import { Types } from 'mongoose';
import { SkillAssessment } from './skillAssessment.model';
import { SkillAssessmentSubmission } from './skillAssessmentSubmission.model';
import { AppError } from '../../common/errors/AppError';
import { getAiClient } from '../ai-guidance/ai.client';
import {
  SKILL_ASSESSMENT_SYSTEM_PROMPT,
  buildSkillAssessmentPrompt,
} from '../ai-guidance/prompts/skillAssessment.prompts';
import { User } from '../users/user.model';
import { safeAward } from '../gamification/gamification.service';
import {
  GeneratedSkillAssessmentSchema,
  normalizeSkillQuestions,
  type GeneratedSkillAssessment,
  type SkillMcqQuestion,
} from './skillAssessment.schema';
import type { ZodType } from 'zod';
import { scoreToLevel, skillAssessmentLimitFor, FREE_SKILL_ASSESSMENT_LIMIT } from './skillAssessment.constants';
import { gradeSubmission, type ShortAnswerJudge } from './grading.service';
import type { SubmittedAnswer } from './assessment.schema';

export type SkillAssessmentGenerator = (input: {
  topicLabel: string;
  userId?: string;
}) => Promise<GeneratedSkillAssessment>;

const defaultGenerator: SkillAssessmentGenerator = async ({ topicLabel, userId }) => {
  const result = await getAiClient().completeStructured(
    {
      system: SKILL_ASSESSMENT_SYSTEM_PROMPT,
      prompt: buildSkillAssessmentPrompt({ topic: topicLabel, questionCount: 10 }),
      useCase: 'quiz',
      userId,
    },
    GeneratedSkillAssessmentSchema as ZodType<GeneratedSkillAssessment>,
  );
  return result.data;
};

function topicLabel(topic: string, customTopic?: string | null): string {
  return topic === 'Other' && customTopic ? customTopic.trim() : topic;
}

async function countSkillAssessments(userId?: string, guestSessionId?: string): Promise<number> {
  const now = new Date();
  const active = { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] };
  if (userId) {
    return SkillAssessment.countDocuments({ ...active, userId: new Types.ObjectId(userId) });
  }
  if (guestSessionId) {
    return SkillAssessment.countDocuments({ ...active, guestSessionId, userId: null });
  }
  return 0;
}

export async function assertSkillAssessmentQuota(
  userId?: string,
  guestSessionId?: string,
  tier?: string | null,
): Promise<void> {
  const limit = skillAssessmentLimitFor(tier);
  if (!Number.isFinite(limit)) return;
  const used = await countSkillAssessments(userId, guestSessionId);
  if (used >= limit) {
    throw new AppError(
      429,
      `Free plan allows up to ${FREE_SKILL_ASSESSMENT_LIMIT} active assessments.`,
    );
  }
}

export async function listSkillAssessments(
  userId?: string,
  guestSessionId?: string,
  tier?: string | null,
) {
  const limit = skillAssessmentLimitFor(tier);

  if (!userId && !guestSessionId) {
    return {
      assessments: [],
      quota: {
        tier: tier ?? 'free',
        limit: Number.isFinite(limit) ? limit : null,
        used: 0,
        remaining: Number.isFinite(limit) ? limit : null,
      },
    };
  }

  const used = await countSkillAssessments(userId, guestSessionId);
  const submissionByAssessment = new Map<
    string,
    { score: number; level: string; submittedAt: Date }
  >();

  let docs: Array<{
    _id: Types.ObjectId;
    topic: string;
    customTopic?: string | null;
    generatedAt: Date;
    expiresAt?: Date | null;
    questions?: unknown[];
  }> = [];

  if (userId) {
    const userObjectId = new Types.ObjectId(userId);
    const subs = await SkillAssessmentSubmission.find({ userId: userObjectId })
      .select('assessmentId score level submittedAt')
      .lean();
    for (const sub of subs) {
      submissionByAssessment.set(String(sub.assessmentId), {
        score: sub.score,
        level: sub.level,
        submittedAt: sub.submittedAt,
      });
    }

    const orFilters: Record<string, unknown>[] = [{ userId: userObjectId }];
    const submittedIds = subs.map((s) => s.assessmentId);
    if (submittedIds.length) orFilters.push({ _id: { $in: submittedIds } });
    if (guestSessionId) orFilters.push({ guestSessionId, userId: null });

    docs = await SkillAssessment.find({ $or: orFilters })
      .sort({ createdAt: -1 })
      .select('topic customTopic generatedAt expiresAt questions')
      .lean();
  } else if (guestSessionId) {
    docs = await SkillAssessment.find({ guestSessionId, userId: null })
      .sort({ createdAt: -1 })
      .select('topic customTopic generatedAt expiresAt questions')
      .lean();
  }

  const seen = new Set<string>();
  const assessments = docs
    .filter((doc) => {
      const id = String(doc._id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((doc) => {
      const id = String(doc._id);
      const submission = submissionByAssessment.get(id);
      return {
        id,
        topic: doc.topic,
        customTopic: doc.customTopic ?? null,
        topicLabel: topicLabel(doc.topic, doc.customTopic),
        questionCount: Array.isArray(doc.questions) ? doc.questions.length : 0,
        generatedAt: doc.generatedAt,
        expiresAt: doc.expiresAt,
        status: submission ? ('completed' as const) : ('pending' as const),
        submission,
      };
    });

  return {
    assessments,
    quota: {
      tier: tier ?? 'free',
      limit: Number.isFinite(limit) ? limit : null,
      used,
      remaining: Number.isFinite(limit) ? Math.max(0, limit - used) : null,
    },
  };
}

export async function generateSkillAssessment(
  input: { topic: string; customTopic?: string; guestSessionId?: string },
  userId?: string,
  tier?: string | null,
  generate: SkillAssessmentGenerator = defaultGenerator,
) {
  await assertSkillAssessmentQuota(userId, input.guestSessionId, tier);
  const label = topicLabel(input.topic, input.customTopic);
  const generated = await generate({ topicLabel: label, userId });
  const questions = normalizeSkillQuestions(generated.questions);
  return SkillAssessment.create({
    topic: input.topic,
    customTopic: input.customTopic ?? null,
    userId: userId ? new Types.ObjectId(userId) : null,
    guestSessionId: input.guestSessionId ?? null,
    questions,
  });
}

export async function getSkillAssessment(assessmentId: string) {
  if (!Types.ObjectId.isValid(assessmentId)) throw new AppError(404, 'Assessment not found');
  const assessment = await SkillAssessment.findById(assessmentId);
  if (!assessment) throw new AppError(404, 'Assessment not found');
  if (assessment.expiresAt && assessment.expiresAt < new Date()) {
    throw new AppError(410, 'Assessment has expired');
  }
  return assessment;
}

export async function submitSkillAssessment(
  userId: string,
  assessmentId: string,
  answers: SubmittedAnswer[],
  judge?: ShortAnswerJudge,
) {
  const assessment = await getSkillAssessment(assessmentId);
  const existing = await SkillAssessmentSubmission.findOne({
    assessmentId: assessment._id,
    userId,
  });
  if (existing) throw new AppError(409, 'Assessment already submitted');

  const { score, results } = await gradeSubmission(
    assessment.questions as unknown as SkillMcqQuestion[],
    answers,
    judge,
  );
  const level = scoreToLevel(score);
  const submission = await SkillAssessmentSubmission.create({
    assessmentId: assessment._id,
    userId,
    answers,
    results,
    score,
    level,
  });

  if (!assessment.userId) {
    await SkillAssessment.findByIdAndUpdate(assessment._id, {
      $set: { userId: new Types.ObjectId(userId) },
    });
  }

  await User.findByIdAndUpdate(userId, {
    $set: {
      'preferences.skillAssessment': {
        topic: assessment.topic,
        customTopic: assessment.customTopic,
        level,
        score,
        assessedAt: new Date(),
      },
    },
  });

  await safeAward(userId, { assessmentScore: score });
  return submission;
}

export async function getSkillAssessmentResult(userId: string, assessmentId: string) {
  if (!Types.ObjectId.isValid(assessmentId)) throw new AppError(404, 'Result not found');
  const submission = await SkillAssessmentSubmission.findOne({
    assessmentId,
    userId,
  });
  if (!submission) throw new AppError(404, 'Result not found');
  return submission;
}

export { scoreToLevel, topicLabel };
