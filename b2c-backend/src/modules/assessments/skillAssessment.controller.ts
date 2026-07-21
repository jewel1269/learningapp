import { asyncHandler } from '../../common/utils/asyncHandler';
import { SKILL_TOPICS } from './skillAssessment.constants';
import * as service from './skillAssessment.service';

export const listTopics = asyncHandler(async (_req, res) => {
  res.json({ topics: SKILL_TOPICS });
});

export const generate = asyncHandler(async (req, res) => {
  const assessment = await service.generateSkillAssessment(req.body, req.user?.id, req.user?.tier);
  res.status(201).json({ assessment });
});

export const listMine = asyncHandler(async (req, res) => {
  const guestSessionId = req.query.guestSessionId as string | undefined;
  const result = await service.listSkillAssessments(
    req.user?.id,
    guestSessionId,
    req.user?.tier ?? 'free',
  );
  res.json(result);
});

export const getAssessment = asyncHandler(async (req, res) => {
  const assessment = await service.getSkillAssessment(req.params.id);
  res.json({ assessment });
});

export const submit = asyncHandler(async (req, res) => {
  const submission = await service.submitSkillAssessment(
    req.user!.id,
    req.params.id,
    req.body.answers,
  );
  res.status(201).json({ submission });
});

export const getResult = asyncHandler(async (req, res) => {
  const submission = await service.getSkillAssessmentResult(req.user!.id, req.params.id);
  res.json({ submission });
});
