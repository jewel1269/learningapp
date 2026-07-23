'use client';

import { BookOpen } from 'lucide-react';
import type { LessonContent } from '@/src/features/lessons/lessonsApi';
import { parseLessonContent } from '@/src/features/lessons/lessonContent';
import { LessonVisualBlock } from '@/src/features/lessons/components/LessonVisualBlock';

interface LessonContentBodyProps {
  content: LessonContent | null | undefined;
  emptyMessage?: string;
}

export function LessonContentBody({
  content,
  emptyMessage = 'This lesson does not have written content yet.',
}: LessonContentBodyProps) {
  const parsed = parseLessonContent(content);

  if (!parsed.hasBody) {
    return (
      <div className="rounded-xl border border-dashed border-line-2 bg-bg-soft p-8 text-center text-sm text-ink-2">
        <BookOpen className="mx-auto mb-2 size-6 text-ink-3" />
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {parsed.intro ? (
        <div className="rounded-xl border border-line bg-bg-soft p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Overview</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{parsed.intro}</p>
        </div>
      ) : null}

      {parsed.sections.map((section, sectionIndex) => (
        <section key={`${section.title}-${sectionIndex}`} className="flex flex-col gap-4">
          {section.title ? (
            <h2 className="text-lg font-semibold tracking-tight text-ink">{section.title}</h2>
          ) : null}

          {section.visual ? <LessonVisualBlock visual={section.visual} /> : null}

          {section.paragraphs.length > 0 ? (
            <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-ink-2">
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </section>
      ))}

      {parsed.keyPoints.length > 0 ? (
        <section className="rounded-xl border border-line bg-bg-soft p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Key takeaways</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-2">
            {parsed.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
