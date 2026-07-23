'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Sparkles } from 'lucide-react';
import { useCourses } from '@/src/features/courses';
import { CourseCard } from '@/src/features/courses/components/CourseCard';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';

export default function MyCoursesPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim().toLowerCase() ?? '';
  const { data, isLoading, isError, refetch } = useCourses();
  const courses = data?.courses ?? [];

  const filteredCourses = useMemo(() => {
    if (!query) return courses;
    return courses.filter((course) => {
      const haystack = [course.title, course.category, course.level, ...course.topics]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [courses, query]);

  return (
    <div className="mx-auto w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">My courses</h1>
          <p className="mt-1 text-sm text-ink-2">
            {query
              ? `Showing results for “${searchParams.get('q')}”.`
              : 'Your AI-generated courses and their progress.'}
          </p>
        </div>
        <Link href="/create-course">
          <Button>
            <Plus className="size-4" /> New course
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <p className="text-ink-2">Couldn&rsquo;t load your courses.</p>
          <Button variant="soft" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-2 bg-bg-soft p-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles className="size-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold">
            {query ? 'No courses match your search' : 'No courses yet'}
          </h2>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm text-ink-2">
            {query
              ? 'Try a different keyword or create a new course on this topic.'
              : 'Tell our AI what you want to learn and it will build a full course with hands-on labs in seconds.'}
          </p>
          <Link href="/create-course" className="mt-6 inline-block">
            <Button size="lg">
              <Plus className="size-4" /> {query ? 'Create course' : 'Create your first course'}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
