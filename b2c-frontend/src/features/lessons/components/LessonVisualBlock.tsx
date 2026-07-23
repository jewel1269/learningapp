'use client';

import { GitBranch, ImageIcon, Layers3, ListOrdered, Workflow } from 'lucide-react';
import type { LessonVisual, LessonVisualType } from '@/src/features/lessons/lessonsApi';

const visualMeta: Record<
  LessonVisualType,
  { label: string; icon: typeof ImageIcon }
> = {
  diagram: { label: 'Diagram', icon: Layers3 },
  timeline: { label: 'Timeline', icon: ListOrdered },
  comparison: { label: 'Comparison', icon: GitBranch },
  flowchart: { label: 'Flowchart', icon: Workflow },
  infographic: { label: 'Infographic', icon: ImageIcon },
};

export function LessonVisualBlock({ visual }: { visual: LessonVisual }) {
  const meta = visualMeta[visual.type] ?? visualMeta.diagram;
  const Icon = meta.icon;

  return (
    <aside className="rounded-xl border border-primary/20 bg-primary-soft/40 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{meta.label}</p>
          <h3 className="mt-1 text-base font-semibold text-ink">{visual.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{visual.description}</p>
          {visual.elements && visual.elements.length > 0 ? (
            <ul className="mt-3 space-y-1.5 border-t border-primary/10 pt-3">
              {visual.elements.map((element, index) => (
                <li key={index} className="flex gap-2 text-sm text-ink-2">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{element}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
