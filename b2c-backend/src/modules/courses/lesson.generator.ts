import { z } from 'zod';
import { getAiClient } from '../ai-guidance/ai.client';
import { LESSON_CONTENT_SYSTEM_PROMPT, buildLessonContentPrompt } from '../ai-guidance/prompts/lesson.prompts';

export const GeneratedLessonVisualSchema = z.object({
  type: z.enum(['diagram', 'timeline', 'comparison', 'flowchart', 'infographic']),
  title: z.string().min(1),
  description: z.string().min(40),
  elements: z.array(z.string().min(1)).min(2).max(8).optional(),
});

export const GeneratedLessonSectionSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(180),
  visual: GeneratedLessonVisualSchema.optional(),
});

export const GeneratedLessonContentSchema = z.object({
  summary: z.string().min(80),
  sections: z.array(GeneratedLessonSectionSchema).min(4).max(6),
  keyPoints: z.array(z.string().min(1)).min(4).max(8),
});

export type GeneratedLessonContent = z.infer<typeof GeneratedLessonContentSchema>;

export interface LessonContentInput {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonSummary: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  visualsPreferred: boolean;
  userId?: string | null;
}

export type LessonContentGenerator = (input: LessonContentInput) => Promise<GeneratedLessonContent>;

function schemaForInput(input: LessonContentInput) {
  if (!input.visualsPreferred) return GeneratedLessonContentSchema;

  return GeneratedLessonContentSchema.superRefine((data, ctx) => {
    const withVisual = data.sections.filter((section) => section.visual).length;
    if (withVisual < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least 2 sections must include a visual when visualsPreferred is true',
        path: ['sections'],
      });
    }
  });
}

export const generateLessonContent: LessonContentGenerator = async (input) => {
  const prompt = buildLessonContentPrompt(input);
  const schema = schemaForInput(input);

  const result = await getAiClient().completeStructured(
    { system: LESSON_CONTENT_SYSTEM_PROMPT, prompt, useCase: 'lesson', userId: input.userId ?? null },
    schema,
  );
  return result.data;
};
