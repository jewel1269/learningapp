'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Trophy,
  Wrench,
} from 'lucide-react';
import { useLesson, useStartLesson, useCompleteLesson } from '@/src/features/lessons';
import { useCourseStructure } from '@/src/features/courses';
import { useGenerateQuiz } from '@/src/features/assessments';
import { useGenerateExercise } from '@/src/features/exercises';
import { resolveLabForDomain } from '@/src/features/labs';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { ApiError } from '@/src/infrastructure/apiClient';
import { LessonContentBody } from '@/src/features/lessons/components/LessonContentBody';

function formatGenerationError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  return fallback;
}

function prettyKey(key: string): string {
  return key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function LessonView({ lessonId }: { lessonId: string }) {
  const lessonQ = useLesson(lessonId);
  const courseId = lessonQ.data?.lesson.courseId ?? null;
  const structureQ = useCourseStructure(courseId);

  const router = useRouter();
  const { mutate: startLesson } = useStartLesson();
  const completeMut = useCompleteLesson();
  const quizGen = useGenerateQuiz();
  const exerciseGen = useGenerateExercise();

  // Mark the lesson in-progress the first time it's opened (once per lesson id).
  const startedFor = useRef<string | null>(null);
  useEffect(() => {
    const data = lessonQ.data;
    if (!data) return;
    const status = data.progress?.status;
    if (status === 'in_progress' || status === 'completed') return;
    if (startedFor.current === lessonId) return;
    startedFor.current = lessonId;
    startLesson(lessonId);
  }, [lessonQ.data, lessonId, startLesson]);

  const nav = useMemo(() => {
    const mods = structureQ.data?.modules ?? [];
    const flat = mods.flatMap((m) => m.lessons.map((l) => ({ id: l.id, title: l.title })));
    const idx = flat.findIndex((l) => l.id === lessonId);
    const currentModule = mods.find((m) => m.lessons.some((l) => l.id === lessonId));
    return {
      prev: idx > 0 ? flat[idx - 1] : null,
      next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
      moduleTitle: currentModule?.title ?? null,
      moduleDomain: currentModule?.domain ?? null,
      position: idx >= 0 ? { n: idx + 1, total: flat.length } : null,
    };
  }, [structureQ.data, lessonId]);

  if (lessonQ.isLoading) {
    return (
      <Shell>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-9 w-2/3" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </Shell>
    );
  }

  if (lessonQ.isError || !lessonQ.data) {
    return (
      <Shell>
        <Link href="/my-courses" className="text-sm font-medium text-ink-2 hover:text-primary">
          <ArrowLeft className="mr-1 inline size-4" /> All courses
        </Link>
        <div className="mt-6 rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <h1 className="text-xl font-bold">Lesson not found</h1>
          <p className="mt-2 text-sm text-ink-2">It may have been removed, or the link is wrong.</p>
        </div>
      </Shell>
    );
  }

  const { lesson, progress } = lessonQ.data;
  const isCompleted = progress?.status === 'completed';
  // The complete mutation lives on this component, which App Router reuses across
  // param changes — so scope its success/error to the lesson it actually ran for.
  const justCompleted =
    completeMut.isSuccess && completeMut.variables === lessonId ? completeMut.data : null;
  const completeFailed = completeMut.isError && completeMut.variables === lessonId;
  const done = isCompleted || Boolean(justCompleted);
  const labMeta = nav.moduleDomain ? resolveLabForDomain(nav.moduleDomain) : null;

  return (
    <Shell>
      <Link
        href={courseId ? `/courses/${courseId}` : '/my-courses'}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        {nav.moduleTitle ?? 'Back to course'}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {nav.position && (
          <Badge variant="default">
            Lesson {nav.position.n} of {nav.position.total}
          </Badge>
        )}
        {isCompleted && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-good">
            <CheckCircle2 className="size-4" /> Completed
          </span>
        )}
        {labMeta && (
          <Badge variant="default">{labMeta.label}</Badge>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>

      {justCompleted && (
        <div className="mt-6 rounded-2xl border border-good/40 bg-good-soft p-5">
          <div className="flex items-center gap-2 font-semibold text-good">
            <CheckCircle2 className="size-5" /> Lesson complete!
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {justCompleted.streak && (
              <span className="text-ink-2">
                🔥 <span className="font-semibold text-ink">{justCompleted.streak.current}-day</span>{' '}
                streak
              </span>
            )}
            <span className="text-ink-2">
              Course progress:{' '}
              <span className="font-semibold text-ink">{justCompleted.course.progressPercent}%</span>
            </span>
          </div>
          {justCompleted.achievements.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Trophy className="size-4" /> Unlocked:
              </span>
              {justCompleted.achievements.map((a) => (
                <Badge key={a} variant="primary">
                  {prettyKey(a)}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <article className="mt-8">
        <LessonContentBody
          content={lesson.content}
          emptyMessage="This lesson doesn't have written content yet."
        />
      </article>

      <div className="mt-10 border-t border-line pt-8">
        <p className="text-sm font-medium text-ink-2">
          Finished reading? Optionally test your understanding or practice hands-on.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-bg-soft p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink">Test yourself</h3>
            <p className="text-sm text-ink-2">Generate an AI quiz from this lesson.</p>
          </div>
          <Button
            variant="soft"
            onClick={() =>
              quizGen.mutate(lessonId, {
                onSuccess: (quiz) => router.push(`/lesson/${lessonId}/quiz/${quiz.id}`),
              })
            }
            disabled={quizGen.isPending}
          >
            {quizGen.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ClipboardList className="size-4" />
            )}
            Take a quiz
          </Button>
        </div>
        {quizGen.isError && (
          <p className="mt-3 text-sm text-bad">
            {formatGenerationError(
              quizGen.error,
              'Couldn\u2019t generate a quiz right now. Please try again.',
            )}
          </p>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-bg-soft p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink">Hands-on practice</h3>
            <p className="text-sm text-ink-2">
              {labMeta
                ? `Generate an AI exercise in the ${labMeta.label.toLowerCase()}.`
                : 'Generate an AI exercise for this lesson.'}
            </p>
          </div>
          <Button
            variant="soft"
            onClick={() =>
              exerciseGen.mutate(lessonId, {
                onSuccess: (exercise) =>
                  router.push(`/lesson/${lessonId}/exercise/${exercise.id}`),
              })
            }
            disabled={exerciseGen.isPending}
          >
            {exerciseGen.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wrench className="size-4" />
            )}
            Start exercise
          </Button>
        </div>
        {exerciseGen.isError && (
          <p className="mt-3 text-sm text-bad">
            {formatGenerationError(
              exerciseGen.error,
              'Couldn\u2019t generate an exercise right now. Please try again.',
            )}
          </p>
        )}
      </div>

      {completeFailed && (
        <p className="mt-6 text-sm text-bad">Couldn&rsquo;t save your progress. Please try again.</p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        {nav.prev ? (
          <Link href={`/lesson/${nav.prev.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4" /> Previous
            </Button>
          </Link>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          {!done && (
            <Button onClick={() => completeMut.mutate(lessonId)} disabled={completeMut.isPending}>
              {completeMut.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Mark as complete
            </Button>
          )}
          {nav.next ? (
            <Link href={`/lesson/${nav.next.id}`}>
              <Button variant={done ? 'primary' : 'soft'}>
                Next lesson <ArrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            done &&
            courseId && (
              <Link href={`/courses/${courseId}`}>
                <Button variant="primary">Back to course</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[780px] p-4 sm:p-6 lg:p-8">{children}</div>;
}
