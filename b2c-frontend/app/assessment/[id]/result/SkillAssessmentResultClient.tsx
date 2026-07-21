'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequireAuth } from '@/src/features/auth/guards';
import { Container } from '@/src/components/marketing/Container';
import { SkillAssessmentResultView } from '@/src/features/skill-assessment/SkillAssessmentResultView';
import { AssessmentResultSkeleton } from '@/src/features/skill-assessment/SkillAssessmentSkeletons';
import {
  pendingAnswersKey,
} from '@/src/features/skill-assessment/skillAssessmentApi';
import {
  useSkillAssessment,
  useSkillAssessmentResult,
  useSubmitSkillAssessment,
} from '@/src/features/skill-assessment/useSkillAssessment';
import type { SubmittedAnswer } from '@/src/domain/assessment';

function topicLabel(topic: string, customTopic: string | null) {
  return topic === 'Other' && customTopic ? customTopic : topic;
}

function ResultContent({ id }: { id: string }) {
  const router = useRouter();
  const submit = useSubmitSkillAssessment(id);
  const { data: assessment, isLoading: loadingAssessment } = useSkillAssessment(id);
  const {
    data: submission,
    isLoading: loadingResult,
    isError: resultError,
    refetch,
  } = useSkillAssessmentResult(id, !submit.isPending);
  const [pendingDone, setPendingDone] = useState(false);

  useEffect(() => {
    if (pendingDone || submit.isPending || submit.isSuccess) return;
    const raw = sessionStorage.getItem(pendingAnswersKey(id));
    if (!raw) return;
    try {
      const answers = JSON.parse(raw) as SubmittedAnswer[];
      submit.mutate(answers, {
        onSuccess: () => {
          sessionStorage.removeItem(pendingAnswersKey(id));
          setPendingDone(true);
          void refetch();
        },
      });
    } catch {
      sessionStorage.removeItem(pendingAnswersKey(id));
    }
  }, [id, pendingDone, submit, refetch]);

  const answersMap = useMemo(() => {
    const map: Record<number, string> = {};
    submission?.answers.forEach((a) => {
      map[a.questionIndex] = a.answer;
    });
    return map;
  }, [submission]);

  if (loadingAssessment || loadingResult || submit.isPending) {
    return <AssessmentResultSkeleton />;
  }

  if (!assessment) {
    return (
      <Container className="max-w-[1240px] py-20 text-center">
        <h1 className="text-2xl font-semibold text-ink">Assessment not found</h1>
      </Container>
    );
  }

  if (resultError || !submission) {
    return (
      <Container className="max-w-[1240px] py-20 text-center">
        <h1 className="text-2xl font-semibold text-ink">Results not available</h1>
        <p className="mt-2 text-sm text-ink-2">
          Complete the assessment and sign in to view your private results.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/assessment/${id}`)}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Go to assessment
        </button>
      </Container>
    );
  }

  return (
    <SkillAssessmentResultView
      topicLabel={topicLabel(assessment.topic, assessment.customTopic)}
      questions={assessment.questions}
      submission={submission}
      answers={answersMap}
    />
  );
}

export default function SkillAssessmentResultPage({ id }: { id: string }) {
  return (
    <RequireAuth redirectTo={`/login?redirect=${encodeURIComponent(`/assessment/${id}/result`)}`}>
      <ResultContent id={id} />
    </RequireAuth>
  );
}
