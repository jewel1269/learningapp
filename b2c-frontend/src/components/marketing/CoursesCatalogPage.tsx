'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react';
import { COURSE_FILTERS, COURSES, type CourseCategory } from './data';
import { Container } from './Container';
import { CourseCatalogCard } from './CourseCatalogCard';
import { cn } from '@/src/lib/utils';

type ViewMode = 'grid' | 'list';

function buildCoursesUrl(params: { q?: string; category?: CourseCategory }) {
  const search = new URLSearchParams();
  if (params.q?.trim()) search.set('q', params.q.trim());
  if (params.category && params.category !== 'All Categories') {
    search.set('category', params.category);
  }
  const query = search.toString();
  return query ? `/courses?${query}` : '/courses';
}

export function CoursesCatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const categoryParam = searchParams.get('category') as CourseCategory | null;
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const activeFilter: CourseCategory =
    categoryParam && COURSE_FILTERS.includes(categoryParam) ? categoryParam : 'All Categories';

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return COURSES.filter((course) => {
      const matchesCategory =
        activeFilter === 'All Categories' || course.category === activeFilter;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        course.title,
        course.instructor,
        course.category,
        course.level,
        course.experience,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeFilter, query]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildCoursesUrl({ q: searchInput, category: activeFilter }));
  }

  function toggleBookmark(id: string) {
    setBookmarks((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="bg-bg py-10 lg:py-14">
      <Container>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="inline-flex w-fit items-center rounded-full border border-line bg-bg-elev p-1 shadow-soft">
              <button
                type="button"
                aria-pressed={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary-soft text-primary'
                    : 'text-ink-2 hover:text-ink',
                )}
              >
                <List className="size-4" />
                List
              </button>
              <button
                type="button"
                aria-pressed={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary-soft text-primary'
                    : 'text-ink-2 hover:text-ink',
                )}
              >
                <LayoutGrid className="size-4" />
                Grid
              </button>
            </div>

            <p className="text-base text-ink-2">
              We Found{' '}
              <span className="font-bold text-ink">{filteredCourses.length}</span> Courses Available
              For you
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={submitSearch} className="relative min-w-[280px] flex-1 sm:min-w-[360px]">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search courses..."
                className="h-12 w-full rounded-full border border-line bg-bg-elev py-2 pl-5 pr-12 text-sm text-ink outline-none transition placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <button
                type="submit"
                aria-label="Search courses"
                className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition hover:bg-bg-soft hover:text-primary"
              >
                <Search className="size-4" />
              </button>
            </form>

            <button
              type="button"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((open) => !open)}
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors',
                filterOpen
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-line bg-bg-elev text-ink-2 hover:border-primary hover:text-primary',
              )}
            >
              <SlidersHorizontal className="size-4" />
              Filter
            </button>
          </div>
        </div>

        {filterOpen ? (
          <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-line bg-bg-elev p-4 shadow-soft">
            {COURSE_FILTERS.map((filter) => {
              const active = activeFilter === filter;
              const href = buildCoursesUrl({ q: query, category: filter });
              return (
                <Link
                  key={filter}
                  href={href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-primary text-white shadow-[var(--shadow-primary)]'
                      : 'border border-line bg-bg-soft text-ink-2 hover:border-primary hover:text-primary',
                  )}
                >
                  {filter}
                </Link>
              );
            })}
          </div>
        ) : null}

        {filteredCourses.length === 0 ? (
          <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-dashed border-line-2 bg-bg-elev p-10 text-center">
            <p className="text-lg font-semibold text-ink">No courses match your search</p>
            <p className="mt-2 text-sm text-ink-2">
              Try another keyword or browse all categories.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              View all courses
            </Link>
          </div>
        ) : (
          <div
            className={cn(
              'mt-8',
              viewMode === 'grid'
                ? 'grid gap-8 md:grid-cols-2 xl:grid-cols-3'
                : 'flex flex-col gap-6',
            )}
          >
            {filteredCourses.map((course) => (
              <CourseCatalogCard
                key={course.id}
                course={course}
                bookmarked={bookmarks.has(course.id)}
                onToggleBookmark={() => toggleBookmark(course.id)}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
