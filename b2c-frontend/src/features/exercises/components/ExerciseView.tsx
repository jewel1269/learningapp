'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Send, Sparkles } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import type { Exercise } from '@/src/domain/exercise';
import {
  CodeEditorLab,
  NetworkSimulatorLab,
  resolveLabForExerciseDomain,
  SocSimulatorLab,
  TerminalLab,
} from '@/src/features/labs';
import { useExerciseSubmission, useSubmitExercise } from '../useExercises';

export function ExerciseView({
  lessonId,
  exercise,
}: {
  lessonId: string;
  exercise: Exercise;
}) {
  const lab = resolveLabForExerciseDomain(exercise.domain);
  const submit = useSubmitExercise(exercise.id);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [labData, setLabData] = useState<unknown>(null);
  const submissionQ = useExerciseSubmission(submissionId, Boolean(submissionId));

  const handleLabChange = useCallback((data: unknown) => {
    setLabData(data);
  }, []);

  const graded = submissionQ.data?.status === 'graded';
  const grading = submissionQ.data?.status === 'submitted' || submissionQ.data?.status === 'grading';

  const labNode = useMemo(() => {
    const common = {
      starterState: exercise.taskSpec.starterState,
      value: labData as never,
      onChange: handleLabChange,
      readOnly: graded,
    };
    switch (lab.kind) {
      case 'terminal':
        return <TerminalLab {...common} />;
      case 'soc':
        return <SocSimulatorLab {...common} />;
      case 'network':
        return <NetworkSimulatorLab {...common} />;
      default:
        return <CodeEditorLab {...common} />;
    }
  }, [exercise.taskSpec.starterState, lab.kind, labData, handleLabChange, graded]);

  function onSubmit() {
    submit.mutate(labData ?? {}, {
      onSuccess: (submission) => setSubmissionId(submission.id),
    });
  }

  return (
    <div className="mx-auto w-full max-w-[980px] p-4 sm:p-6 lg:p-8">
      <Link
        href={`/lesson/${lessonId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to lesson
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="primary">{lab.label}</Badge>
        <span className="text-xs capitalize text-ink-3">{exercise.domain}</span>
      </div>

      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Hands-on exercise</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{exercise.taskSpec.description}</p>

      <div className="mt-8">{labNode}</div>

      {!graded && (
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Button onClick={onSubmit} disabled={submit.isPending || grading}>
            {submit.isPending || grading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Submit for AI grading
          </Button>
          {grading && (
            <p className="text-sm text-ink-2">Grading in progress — this usually takes a few seconds.</p>
          )}
          {submit.isError && (
            <p className="text-sm text-bad">Could not submit your exercise. Please try again.</p>
          )}
        </div>
      )}

      {submissionQ.isLoading && submissionId && (
        <div className="mt-6">
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      )}

      {graded && submissionQ.data && (
        <div className="mt-8 rounded-2xl border border-good/30 bg-good-soft p-6">
          <div className="flex items-center gap-2 font-semibold text-good">
            <Sparkles className="size-5" /> Graded
          </div>
          <p className="mt-3 text-3xl font-bold text-ink">
            {submissionQ.data.score ?? '—'}
            {submissionQ.data.score !== null ? '%' : ''}
          </p>
          {submissionQ.data.feedback && (
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-2">
              {submissionQ.data.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ExerciseView;
