import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Badge, type BadgeProps } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { Avatar } from '@/src/components/ui/avatar';
import type { Course, CourseStatus } from '@/src/domain/course';
import { cn } from '@/src/lib/utils';

export const statusVariant: Record<CourseStatus, BadgeProps['variant']> = {
  generating: 'warn',
  ready: 'good',
  failed: 'bad',
  completed: 'primary',
  archived: 'default',
};

const statusLabel: Record<CourseStatus, string> = {
  generating: 'Generating',
  ready: 'Ready',
  failed: 'Failed',
  completed: 'Completed',
  archived: 'Archived',
};

function levelTone(level: Course['level']) {
  if (level === 'advanced') return 'bg-bad-soft text-bad';
  if (level === 'intermediate') return 'bg-secondary-soft text-secondary';
  return 'bg-primary-soft text-primary';
}

export function CourseCard({ course }: { course: Course }) {
  const isGenerating = course.status === 'generating';
  const isFailed = course.status === 'failed';

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-bg-elev p-5 shadow-soft transition hover:border-primary/25 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <Avatar name={course.title} className="size-11 text-xs" />
        <Badge variant={statusVariant[course.status]} className="capitalize">
          {statusLabel[course.status]}
        </Badge>
      </div>

      <h3 className="mt-4 line-clamp-2 text-base font-semibold text-ink group-hover:text-primary">
        {course.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-2">{course.category}</span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize',
            levelTone(course.level),
          )}
        >
          {course.level}
        </span>
      </div>

      {course.topics.length > 0 ? (
        <p className="mt-3 line-clamp-1 text-xs text-ink-3">
          {course.topics.slice(0, 3).join(' · ')}
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        {isGenerating ? (
          <div className="flex items-center gap-2 rounded-xl bg-warn-soft px-3 py-2.5 text-sm text-warn">
            <Loader2 className="size-4 animate-spin" />
            AI is building your course…
          </div>
        ) : isFailed ? (
          <p className="rounded-xl bg-bad-soft px-3 py-2.5 text-sm text-bad">
            Generation failed. Open to retry or create a new course.
          </p>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-ink-3">Progress</span>
              <span className="font-semibold text-ink">{course.progressPercent}%</span>
            </div>
            <Progress value={course.progressPercent} className="h-2" />
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm font-medium text-primary">
          {isGenerating ? 'View status' : isFailed ? 'View details' : 'Continue learning'}
        </span>
        <span className="grid size-8 place-items-center rounded-full border border-line text-ink-3 transition group-hover:border-primary/20 group-hover:bg-primary-soft group-hover:text-primary">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

export function CourseCardCompact({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex items-center gap-3 rounded-xl border border-line bg-bg-elev px-4 py-3 shadow-soft transition hover:border-primary/25 hover:bg-bg-soft"
    >
      <Avatar name={course.title} className="size-10 text-xs" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{course.title}</p>
        <p className="text-xs text-ink-3">
          {course.category} · {course.progressPercent}% complete
        </p>
      </div>
      <Badge variant={statusVariant[course.status]} className="capitalize">
        {statusLabel[course.status]}
      </Badge>
    </Link>
  );
}
