import { Schema, model, Types } from 'mongoose';
import { answerSchema, resultSchema, stripId } from './quizSubmission.model';

const skillAssessmentSubmissionSchema = new Schema(
  {
    assessmentId: { type: Types.ObjectId, ref: 'SkillAssessment', required: true, index: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    answers: { type: [answerSchema], default: [] },
    results: { type: [resultSchema], default: [] },
    score: { type: Number, default: 0 },
    level: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

skillAssessmentSubmissionSchema.index({ assessmentId: 1, userId: 1 }, { unique: true });

skillAssessmentSubmissionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: stripId,
});

export const SkillAssessmentSubmission = model(
  'SkillAssessmentSubmission',
  skillAssessmentSubmissionSchema,
);
