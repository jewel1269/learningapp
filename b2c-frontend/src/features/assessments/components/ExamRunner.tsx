'use client';

import { useRouter } from 'next/navigation';
import { useExam, useGenerateExam, useSubmitExam } from '../useAssessments';
import { AssessmentView } from './AssessmentView';
import { AssessmentShell, AssessmentError, AssessmentLoading } from './shell';

export function ExamRunner({ examId }: { examId: string }) {
  const router = useRouter();
  const examQ = useExam(examId);
  const submitMut = useSubmitExam(examId);
  const genMut = useGenerateExam();

  if (examQ.isLoading) return <AssessmentLoading />;
  if (examQ.isError || !examQ.data)
    return <AssessmentError backHref="/courses" backLabel="Courses" label="Exam not found" />;

  const exam = examQ.data;
  // Course exams can return to their course; module exams (scopeId is a module id)
  // fall back to the course list.
  const backHref = exam.scope === 'course' ? `/courses/${exam.scopeId}` : '/courses';
  const backLabel = exam.scope === 'course' ? 'Back to course' : 'Courses';

  return (
    <AssessmentShell>
      <AssessmentView
        title={exam.scope === 'course' ? 'Course exam' : 'Module exam'}
        subtitle="Answer every question, then submit for grading."
        questions={exam.questions}
        submission={submitMut.data ?? null}
        submitting={submitMut.isPending}
        submitError={submitMut.isError}
        onSubmit={(answers) => submitMut.mutate(answers)}
        backHref={backHref}
        backLabel={backLabel}
        retaking={genMut.isPending}
        onRetake={() =>
          genMut.mutate(
            { scope: exam.scope, scopeId: exam.scopeId },
            { onSuccess: (fresh) => router.push(`/exam/${fresh.id}`) },
          )
        }
      />
    </AssessmentShell>
  );
}

export default ExamRunner;
