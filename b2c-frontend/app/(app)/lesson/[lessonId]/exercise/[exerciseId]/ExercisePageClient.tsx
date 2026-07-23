'use client';

import Link from 'next/link';
import { useExercise } from '@/src/features/exercises';
import { ExerciseView } from '@/src/features/exercises/components/ExerciseView';
import { Skeleton } from '@/src/components/ui/skeleton';

export default function ExercisePageClient({
  lessonId,
  exerciseId,
}: {
  lessonId: string;
  exerciseId: string;
}) {
  const { data: exercise, isLoading, isError } = useExercise(exerciseId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[980px] p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !exercise) {
    return (
      <div className="mx-auto max-w-[980px] p-8 text-center">
        <h1 className="text-xl font-bold">Exercise not found</h1>
        <Link href={`/lesson/${lessonId}`} className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to lesson
        </Link>
      </div>
    );
  }

  return <ExerciseView lessonId={lessonId} exercise={exercise} />;
}
