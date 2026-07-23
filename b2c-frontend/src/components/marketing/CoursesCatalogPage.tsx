'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Clock3, Search, Star } from 'lucide-react';
import { COURSE_FILTERS, COURSES, type CourseCategory } from './data';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';
import { cn } from '@/src/lib/utils';

export function CoursesCatalogPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim().toLowerCase() ?? '';
  const categoryParam = searchParams.get('category') as CourseCategory | null;

  const activeFilter: CourseCategory =
    categoryParam && COURSE_FILTERS.includes(categoryParam) ? categoryParam : 'All Categories';

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCategory =
        activeFilter === 'All Categories' || course.category === activeFilter;
      if (!matchesCategory) return false;
      if (!query) return true;

      const haystack = [
        course.title,
        course.instructor,
        course.category,
        course.level,
        course.experience,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [activeFilter, query]);

  return (
    <section className="bg-bg-soft py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Course catalog"
          title="Courses from expert instructors"
          description="Browse programs across design, programming, marketing, and more — taught by experienced instructors on AIStudy."
        />

        <div className="mx-auto mt-10 flex max-w-2xl items-stretch overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <span className="grid w-14 shrink-0 place-items-center bg-primary text-white">
            <Search className="size-5" />
          </span>
          <form action="/courses" method="get" className="flex flex-1">
            <input
              type="search"
              name="q"
              defaultValue={searchParams.get('q') ?? ''}
              placeholder="Search by course, instructor, or category…"
              className="h-14 flex-1 px-4 text-[15px] text-ink outline-none placeholder:text-ink-2"
            />
            {activeFilter !== 'All Categories' ? (
              <input type="hidden" name="category" value={activeFilter} />
            ) : null}
          </form>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {COURSE_FILTERS.map((filter) => {
            const active = activeFilter === filter;
            const params = new URLSearchParams();
            if (query) params.set('q', searchParams.get('q') ?? '');
            if (filter !== 'All Categories') params.set('category', filter);
            const href = params.toString() ? `/courses?${params.toString()}` : '/courses';

            return (
              <Link
                key={filter}
                href={href}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                  active
                    ? 'bg-primary text-white shadow-[var(--shadow-primary)]'
                    : 'border border-line bg-white text-[#475569] hover:border-primary hover:text-primary',
                )}
              >
                {filter}
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-ink-2">
          {query || activeFilter !== 'All Categories'
            ? `${filteredCourses.length} course${filteredCourses.length === 1 ? '' : 's'} found`
            : `${COURSES.length} courses from ${new Set(COURSES.map((c) => c.instructor)).size} instructors`}
        </p>

        {filteredCourses.length === 0 ? (
          <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-dashed border-line-2 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-ink">No courses match your search</p>
            <p className="mt-2 text-sm text-ink-2">
              Try another keyword or browse all categories.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              View all courses
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="relative h-[210px]">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                    {course.category}
                  </span>
                  <span className="absolute right-4 top-4 rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white">
                    ${course.price.toFixed(2)}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-ink-2">
                    <Star className="size-4 fill-[#FBBF24] text-[#FBBF24]" />
                    <span className="font-semibold text-ink">{course.rating}</span>
                    <span>({course.reviews} reviews)</span>
                  </div>

                  <h3 className="mt-3 min-h-[56px] text-lg font-bold leading-snug text-ink">
                    {course.title}
                  </h3>

                  <div className="mt-4 flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
                    <Image
                      src={course.avatar}
                      alt={course.instructor}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">{course.instructor}</p>
                      <p className="text-xs text-ink-2">{course.experience}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-ink-2">
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-primary">
                      {course.level}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-bg-soft px-3 py-1">
                      <BookOpen className="size-3.5" />
                      {course.lessons} lessons
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-bg-soft px-3 py-1">
                      <Clock3 className="size-3.5" />
                      {course.duration}
                    </span>
                  </div>

                  <Link
                    href="/signup"
                    className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-white transition-colors hover:bg-secondary-2"
                  >
                    Enroll now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
