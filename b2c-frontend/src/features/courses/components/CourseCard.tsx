import Link from 'next/link';
import { Badge, type BadgeProps } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import type { Course, CourseStatus } from '@/src/domain/course';

export const statusVariant: Record<CourseStatus, BadgeProps['variant']> = {
  generating: 'warn',
  ready: 'good',
  failed: 'bad',
  completed: 'primary',
  archived: 'default',
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col rounded-2xl border border-line bg-bg-elev p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex items-center justify-between">
        <Badge variant={statusVariant[course.status]} className="capitalize">
          {course.status}
        </Badge>
        <span className="text-xs capitalize text-ink-3">{course.level}</span>
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold text-ink group-hover:text-primary">
        {course.title}
      </h3>
      <p className="text-sm text-ink-2">{course.category}</p>
      <div className="mt-auto pt-4">
        <Progress value={course.progressPercent} />
        <div className="mt-1.5 text-xs text-ink-3">{course.progressPercent}% complete</div>
      </div>
    </Link>
  );
}
