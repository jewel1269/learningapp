'use client';

import { useRouter } from 'next/navigation';
import { ApiError } from '@/src/infrastructure/apiClient';
import { useLesson } from '@/src/features/lessons';
import { useGenerateQuiz, useQuiz, useSubmitQuiz } from '../useAssessments';
import { AssessmentView } from './AssessmentView';
import { AssessmentShell, AssessmentError, AssessmentLoading } from './shell';

export function QuizRunner({ quizId, lessonId }: { quizId: string; lessonId: string }) {
  const router = useRouter();
  const quizQ = useQuiz(quizId);
  const lessonQ = useLesson(lessonId);
  const submitMut = useSubmitQuiz(quizId);
  const genMut = useGenerateQuiz();
  const backHref = `/lesson/${lessonId}`;

  if (quizQ.isLoading || lessonQ.isLoading) return <AssessmentLoading />;
  if (quizQ.isError || !quizQ.data) {
    return <AssessmentError backHref={backHref} backLabel="Back to lesson" label="Quiz not found" />;
  }

  const lessonTitle = lessonQ.data?.lesson.title;

  return (
    <AssessmentShell>
      <AssessmentView
        eyebrow="Lesson quiz"
        submitLabel="Submit quiz"
        title={lessonTitle ?? 'Lesson quiz'}
        subtitle="Answer each question, then submit for your score."
        questions={quizQ.data.questions}
        submission={submitMut.data ?? null}
        submitting={submitMut.isPending}
        submitError={
          submitMut.isError
            ? submitMut.error instanceof ApiError
              ? submitMut.error.message
              : 'Could not submit your answers. Please try again.'
            : null
        }
        onSubmit={(answers) => submitMut.mutate(answers)}
        backHref={backHref}
        backLabel="Back to lesson"
        retaking={genMut.isPending}
        onRetake={() =>
          genMut.mutate(lessonId, {
            onSuccess: (quiz) => router.push(`/lesson/${lessonId}/quiz/${quiz.id}`),
          })
        }
      />
    </AssessmentShell>
  );
}

export default QuizRunner;
