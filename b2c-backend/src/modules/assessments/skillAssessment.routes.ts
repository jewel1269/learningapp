import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { optionalAuthenticate } from '../../middlewares/optionalAuth.middleware';
import { aiRateLimit } from '../../middlewares/rateLimit.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  generateSkillAssessmentSchema,
  submitSkillAssessmentSchema,
  listSkillAssessmentsQuerySchema,
} from './skillAssessment.validation';
import * as controller from './skillAssessment.controller';

const router = Router();

router.get('/topics', controller.listTopics);

router.get(
  '/mine',
  optionalAuthenticate,
  validate({ query: listSkillAssessmentsQuerySchema }),
  controller.listMine,
);

router.post(
  '/generate',
  optionalAuthenticate,
  aiRateLimit,
  validate({ body: generateSkillAssessmentSchema }),
  controller.generate,
);

router.get('/:id', controller.getAssessment);

router.post(
  '/:id/submit',
  authenticate,
  validate({ body: submitSkillAssessmentSchema }),
  controller.submit,
);

router.get('/:id/result', authenticate, controller.getResult);

export default router;
