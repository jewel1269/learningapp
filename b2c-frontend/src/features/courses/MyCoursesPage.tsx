'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { useCourses } from '@/src/features/courses';
import { CourseCard } from '@/src/features/courses/components/CourseCard';
import type { Course } from '@/src/domain/course';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { cn } from '@/src/lib/utils';

type FilterTab = 'all' | 'in-progress' | 'completed' | 'generating';
type ViewMode = 'grid' | 'list';

function matchesFilter(course: Course, filter: FilterTab) {
  if (filter === 'all') return true;
  if (filter === 'generating') return course.status === 'generating';
  if (filter === 'completed') {
    return course.status === 'completed' || course.progressPercent >= 100;
  }
  return (
    course.status === 'ready' &&
    course.progressPercent > 0 &&
    course.progressPercent < 100
  );
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Courses</h1>
        <p className="mt-1 text-sm text-ink-2">
          Your AI-generated courses and learning progress
        </p>
      </div>
      <nav className="flex items-center gap-1.5 text-sm text-ink-3">
        <Link href="/dashboard" className="transition hover:text-primary">
          <span className="text-primary">AI</span>
          <span className="text-ink">Study</span>
        </Link>
        <ChevronRight className="size-4" />
        <span className="font-medium text-ink">My Courses</span>
      </nav>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8 xl:px-10">
      <Skeleton className="h-14 w-full max-w-xl" />
      <Skeleton className="h-14 rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All courses' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'generating', label: 'Generating' },
];

export function MyCoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q')?.trim() ?? '';
  const [search, setSearch] = useState(queryParam);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [view, setView] = useState<ViewMode>('grid');

  const { data, isLoading, isError, refetch } = useCourses();
  const courses = data?.courses ?? [];

  const filteredCourses = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return courses.filter((course) => {
      if (!matchesFilter(course, filter)) return false;
      if (!normalizedQuery) return true;

      const haystack = [course.title, course.category, course.level, ...course.topics]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [courses, filter, search]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set('q', search.trim());
    else params.delete('q');
    const next = params.toString();
    router.replace(next ? `/my-courses?${next}` : '/my-courses');
  }

  if (isLoading) return <PageSkeleton />;

  const shellClass = 'w-full space-y-6 p-4 sm:p-6 lg:p-8 xl:px-10';

  if (isError) {
    return (
      <div className={shellClass}>
        <PageHeader />
        <div className="rounded-2xl border border-line bg-bg-elev p-10 text-center shadow-soft">
          <p className="text-ink-2">Couldn&apos;t load your courses.</p>
          <Button variant="soft" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={shellClass}>
        <PageHeader />
        <div className="rounded-2xl border border-dashed border-line-2 bg-bg-elev p-12 text-center shadow-soft">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles className="size-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-ink">No courses yet</h2>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm text-ink-2">
            Tell our AI what you want to learn and it will build a full course with hands-on
            labs in seconds.
          </p>
          <Link href="/create-course" className="mt-6 inline-block">
            <Button size="lg">
              <Plus className="size-4" /> Create your first course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <PageHeader />

      <section className="rounded-2xl border border-line bg-bg-elev p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <form onSubmit={handleSearchSubmit} className="relative min-w-0 flex-1 xl:max-w-md">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses, topics, or categories…"
              className="h-11 w-full rounded-xl border border-line bg-bg-soft pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-3 focus:border-primary/30 focus:bg-bg-elev focus:ring-2 focus:ring-primary/10"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 rounded-xl bg-bg-soft p-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    filter === tab.id
                      ? 'bg-bg-elev text-primary shadow-soft'
                      : 'text-ink-3 hover:text-ink-2',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex rounded-xl border border-line p-1">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn(
                  'grid size-9 place-items-center rounded-lg transition',
                  view === 'grid'
                    ? 'bg-primary-soft text-primary'
                    : 'text-ink-3 hover:text-ink-2',
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn(
                  'grid size-9 place-items-center rounded-lg transition',
                  view === 'list'
                    ? 'bg-primary-soft text-primary'
                    : 'text-ink-3 hover:text-ink-2',
                )}
                aria-label="List view"
              >
                <List className="size-4" />
              </button>
            </div>

            <Link href="/create-course">
              <Button>
                <Plus className="size-4" /> New course
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-2 bg-bg-elev p-10 text-center shadow-soft">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-bg-soft text-ink-3">
            <Search className="size-5" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-ink">No courses found</h2>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm text-ink-2">
            {search.trim()
              ? `No results for “${search.trim()}”. Try another keyword or filter.`
              : 'No courses match this filter. Try a different tab.'}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button
              variant="soft"
              onClick={() => {
                setSearch('');
                setFilter('all');
                router.replace('/my-courses');
              }}
            >
              Clear filters
            </Button>
            <Link href="/create-course">
              <Button>
                <Plus className="size-4" /> Create course
              </Button>
            </Link>
          </div>
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-bg-elev shadow-soft">
          <div className="hidden border-b border-line px-5 py-3 text-xs text-ink-3 sm:grid sm:grid-cols-[minmax(0,1.6fr)_120px_120px_100px_72px] sm:gap-4">
            <span>Course</span>
            <span>Category</span>
            <span>Status</span>
            <span>Progress</span>
            <span className="text-right">Action</span>
          </div>
          <div className="divide-y divide-line">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[minmax(0,1.6fr)_120px_120px_100px_72px] sm:items-center sm:gap-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/courses/${course.id}`}
                    className="font-medium text-ink transition hover:text-primary"
                  >
                    {course.title}
                  </Link>
                  <p className="mt-1 text-xs capitalize text-ink-3">{course.level}</p>
                </div>
                <p className="text-sm text-ink-2">{course.category}</p>
                <p className="text-sm capitalize text-ink-2">{course.status}</p>
                <div>
                  <p className="text-sm font-semibold text-ink">{course.progressPercent}%</p>
                  <div className="mt-1 hidden sm:block">
                    <ProgressMini value={course.progressPercent} />
                  </div>
                </div>
                <div className="sm:text-right">
                  <Link
                    href={`/courses/${course.id}`}
                    className="inline-grid size-8 place-items-center rounded-full border border-line text-ink-3 transition hover:bg-primary-soft hover:text-primary"
                  >
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredCourses.length > 0 ? (
        <p className="text-sm text-ink-3">
          Showing {filteredCourses.length} of {courses.length} courses
          {search.trim() ? ` for “${search.trim()}”` : ''}
        </p>
      ) : null}
    </div>
  );
}

function ProgressMini({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-bg-soft">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
