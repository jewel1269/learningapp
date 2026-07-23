'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, Loader2, Network, X } from 'lucide-react';
import { useCourse, useCourseStructure } from '@/src/features/courses';
import { useGenerateExam } from '@/src/features/assessments';
import { resolveLabForDomain } from '@/src/features/labs';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Progress } from '@/src/components/ui/progress';
import { Skeleton } from '@/src/components/ui/skeleton';

export function CourseOverview({ courseId }: { courseId: string }) {
  const router = useRouter();
  const courseQ = useCourse(courseId);
  const course = courseQ.data?.course;
  const status = course?.status;
  const isReady = status === 'ready' || status === 'completed';
  // Only fetch structure once the course is ready — otherwise a fetch during
  // "generating" caches modules:[] and never refetches when status flips to ready.
  const structureQ = useCourseStructure(isReady ? courseId : null);

  const examGen = useGenerateExam();
  const genExam = (scope: 'module' | 'course', scopeId: string) =>
    examGen.mutate({ scope, scopeId }, { onSuccess: (exam) => router.push(`/exam/${exam.id}`) });
  const examPending = (scopeId: string) =>
    examGen.isPending && examGen.variables?.scopeId === scopeId;

  if (courseQ.isLoading) {
    return (
      <Shell>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-3 w-full max-w-md" />
        <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
      </Shell>
    );
  }

  if (courseQ.isError || !course) {
    return (
      <Shell>
        <BackLink />
        <div className="mt-6 rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <h1 className="text-xl font-bold">Course not found</h1>
          <p className="mt-2 text-sm text-ink-2">It may have been removed, or the link is wrong.</p>
        </div>
      </Shell>
    );
  }

  if (status === 'generating') {
    return (
      <Shell>
        <BackLink />
        <div className="mt-6 rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Loader2 className="size-7 animate-spin" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Building your course…</h1>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm text-ink-2">
            Modules, lessons, quizzes and labs are being generated. This page will update
            automatically.
          </p>
        </div>
      </Shell>
    );
  }

  if (status === 'failed') {
    return (
      <Shell>
        <BackLink />
        <div className="mt-6 rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-bad-soft text-bad">
            <X className="size-7" strokeWidth={2.4} />
          </div>
          <h1 className="mt-4 text-xl font-bold">Generation failed</h1>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm text-ink-2">
            {course.failureReason ?? 'Something went wrong while building this course.'}
          </p>
          <Link href="/create-course" className="mt-6 inline-block">
            <Button>Create a new course</Button>
          </Link>
        </div>
      </Shell>
    );
  }

  // ready / completed
  const modules = structureQ.data?.modules ?? [];
  return (
    <Shell>
      <BackLink />
      <div className="mt-6 rounded-2xl border border-line bg-linear-to-br from-primary-soft to-bg-elev p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status === 'completed' ? 'primary' : 'good'} className="capitalize">
            {status}
          </Badge>
          <span className="text-xs capitalize text-ink-2">{course.level}</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{course.title}</h1>
        <p className="mt-1 text-ink-2">{course.category}</p>
        <div className="mt-5 max-w-md">
          <Progress value={course.progressPercent} />
          <div className="mt-1.5 text-xs text-ink-3">{course.progressPercent}% complete</div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/courses/${courseId}/structure`}>
            <Button variant="soft" size="sm">
              <Network className="size-4" /> View as diagram
            </Button>
          </Link>
          <Button
            variant="soft"
            size="sm"
            onClick={() => genExam('course', courseId)}
            disabled={examGen.isPending}
          >
            {examPending(courseId) ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <GraduationCap className="size-4" />
            )}
            Course exam
          </Button>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-lg font-bold">Modules</h2>
      {structureQ.isError ? (
        <div className="rounded-2xl border border-line bg-bg-elev p-8 text-center">
          <p className="text-sm text-ink-2">Couldn&rsquo;t load the course structure.</p>
          <Button variant="soft" className="mt-3" onClick={() => structureQ.refetch()}>
            Retry
          </Button>
        </div>
      ) : structureQ.isLoading || !structureQ.data ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {modules.map((m, i) => {
            const lab = resolveLabForDomain(m.domain);
            return (
            <div key={m.id} className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-9 flex-none place-items-center rounded-lg bg-primary-soft font-mono text-sm font-bold text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold">{m.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="default">{lab.label}</Badge>
                    <p className="text-xs capitalize text-ink-3">
                      {m.domain} · {m.lessonCount} lessons
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => genExam('module', m.id)}
                  disabled={examGen.isPending}
                >
                  {examPending(m.id) ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <GraduationCap className="size-4" />
                  )}
                  Exam
                </Button>
              </div>
              <ul className="mt-4 flex flex-col divide-y divide-line">
                {m.lessons.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/lesson/${l.id}`}
                      className="group flex items-center gap-3 py-2.5 text-sm transition-colors hover:text-primary"
                    >
                      <BookOpen className="size-4 text-ink-3 group-hover:text-primary" />
                      <span className="flex-1">{l.title}</span>
                      <ArrowRight className="size-4 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
          {modules.length === 0 && (
            <p className="text-sm text-ink-2">No modules found for this course.</p>
          )}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="w-full p-4 sm:p-6 lg:p-8 xl:px-10">{children}</div>;
}

function BackLink() {
  return (
    <Link
      href="/my-courses"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-primary"
    >
      <ArrowLeft className="size-4" /> All courses
    </Link>
  );
}
