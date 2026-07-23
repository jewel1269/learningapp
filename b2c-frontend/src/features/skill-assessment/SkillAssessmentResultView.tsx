'use client';

import Link from 'next/link';
import { Award, BookOpen, CheckCircle2, ClipboardList, Route, Target, XCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Container } from '@/src/components/marketing/Container';
import { CreateCourseFromRecommendation } from '@/src/features/learning-path/CreateCourseFromRecommendation';
import {
  getLearningPathSteps,
  getRecommendedCourseTitle,
  type LearningPathPrefill,
} from '@/src/features/learning-path/learningPathRecommendation';
import type {
  AssessmentQuestion,
  SkillAssessmentSubmission,
  SkillLevel,
} from '@/src/domain/assessment';
import { cn } from '@/src/lib/utils';

const LEVEL_COPY: Record<
  SkillLevel,
  {
    description: string;
    badge: string;
    accent: string;
    headerClass: string;
    badgeClass: string;
  }
> = {
  Beginner: {
    description:
      'You are building your foundation. We recommend structured introductory courses to strengthen core concepts.',
    badge: 'Foundation track',
    accent: 'text-primary',
    headerClass: 'border-line bg-gradient-to-br from-tint-blue/80 to-bg-elev',
    badgeClass: 'border-primary/20 bg-primary-soft text-primary',
  },
  Intermediate: {
    description:
      'You have a solid base and are ready for structured, hands-on learning with practical exercises.',
    badge: 'Growth track',
    accent: 'text-primary',
    headerClass: 'border-line bg-gradient-to-br from-primary-soft/70 to-bg-elev',
    badgeClass: 'border-primary/20 bg-primary-soft text-primary',
  },
  Advanced: {
    description:
      'You demonstrate strong subject knowledge. Advanced labs and applied projects will help you go further.',
    badge: 'Advanced track',
    accent: 'text-secondary',
    headerClass: 'border-line bg-gradient-to-br from-secondary-soft/80 to-bg-elev',
    badgeClass: 'border-secondary/20 bg-secondary-soft text-secondary',
  },
  Expert: {
    description:
      'Your performance indicates mastery at this level. Explore expert tracks and specialized practice areas.',
    badge: 'Expert track',
    accent: 'text-good',
    headerClass: 'border-line bg-gradient-to-br from-good-soft/80 to-bg-elev',
    badgeClass: 'border-good/20 bg-good-soft text-good',
  },
};

export function SkillAssessmentResultView({
  topicLabel,
  questions,
  submission,
  answers,
  prefill,
}: {
  topicLabel: string;
  questions: AssessmentQuestion[];
  submission: SkillAssessmentSubmission;
  answers: Record<number, string>;
  prefill: LearningPathPrefill;
}) {
  const levelInfo = LEVEL_COPY[submission.level];
  const results = [...submission.results].sort((a, b) => a.questionIndex - b.questionIndex);
  const correctCount = results.filter((r) => r.correct).length;
  const pathSteps = getLearningPathSteps(prefill);
  const recommendedTitle = getRecommendedCourseTitle(prefill);

  return (
    <div className="pb-16 pt-8 lg:pt-12">
      <Container className="max-w-[1240px]">
        <div className="overflow-hidden rounded-2xl border border-line bg-bg-elev shadow-lift">
          <div className={cn('border-b px-6 py-10 text-center sm:px-10', levelInfo.headerClass)}>
            <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-line bg-bg-elev shadow-card">
              <Award className={cn('size-8', levelInfo.accent)} />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">
              Assessment result
            </p>
            <h1 className={cn('mt-2 text-3xl font-bold sm:text-4xl', levelInfo.accent)}>
              {submission.level}
            </h1>
            <p className="mt-4 text-5xl font-bold tracking-tight text-ink sm:text-6xl">
              {submission.score}%
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="rounded-full border border-line bg-bg-soft px-3 py-1 font-medium text-ink-2">
                {correctCount} of {results.length} correct
              </span>
              <span className="rounded-full border border-line bg-bg-soft px-3 py-1 font-medium text-ink-2">
                {topicLabel}
              </span>
              <span
                className={cn(
                  'rounded-full border px-3 py-1 font-semibold',
                  levelInfo.badgeClass,
                )}
              >
                {levelInfo.badge}
              </span>
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-base">
              {levelInfo.description}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-bg-elev shadow-card">
          <div className="border-b border-line bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary)_10%,transparent)_0%,transparent_55%)] px-6 py-8 sm:px-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <Route className="size-4" />
              Recommended learning path
            </div>
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{recommendedTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-base">
              Based on your {submission.score}% score, we recommend a {prefill.courseLevel}-level
              course in {prefill.category}. Generate a personalized program with modules, labs, and
              assessments.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            {pathSteps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-line bg-bg-soft p-5">
                <span className="grid size-9 place-items-center rounded-lg border border-primary/15 bg-primary-soft text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-2">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-line bg-bg-soft px-6 py-6 sm:px-8">
            <CreateCourseFromRecommendation prefill={prefill} />
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Target className="size-4" />
                Answer review
              </div>
              <h2 className="mt-2 text-2xl font-bold text-ink">Question breakdown</h2>
            </div>
            <p className="text-sm text-ink-3">Private results — visible only to your account</p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {results.map((r) => {
              const q = questions[r.questionIndex];
              const given = (answers[r.questionIndex] ?? '').trim();
              return (
                <div
                  key={r.questionIndex}
                  className="rounded-2xl border border-line bg-bg-elev p-6 shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        'grid size-10 shrink-0 place-items-center rounded-xl border',
                        r.correct
                          ? 'border-good/20 bg-good-soft text-good'
                          : 'border-bad/20 bg-bad-soft text-bad',
                      )}
                    >
                      {r.correct ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <XCircle className="size-5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
                        Question {r.questionIndex + 1}
                      </p>
                      <p className="mt-2 text-base font-semibold leading-7 text-ink">
                        {q?.question ?? 'Question'}
                      </p>
                      <div className="mt-4 space-y-2 rounded-xl border border-line bg-bg-soft p-4">
                        <p className="text-sm text-ink-2">
                          <span className="font-medium text-ink">Your answer:</span>{' '}
                          {given || '—'}
                        </p>
                        {!r.correct ? (
                          <p className="text-sm text-good">
                            <span className="font-medium text-ink">Correct answer:</span>{' '}
                            {r.correctAnswer}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 rounded-2xl border border-line bg-bg-elev p-6 shadow-card">
          <Link href="/assessments">
            <Button size="lg">
              <ClipboardList className="size-4" />
              View all assessments
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="soft">
              <BookOpen className="size-4" />
              Go to dashboard
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default SkillAssessmentResultView;
