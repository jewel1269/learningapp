'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/src/components/marketing/Container';
import { PaginatedSkillAssessment } from '@/src/features/skill-assessment/PaginatedSkillAssessment';
import { AssessmentTakeSkeleton } from '@/src/features/skill-assessment/SkillAssessmentSkeletons';
import { useAuthStore } from '@/src/store/authStore';
import {
  useSkillAssessment,
  useSkillAssessmentResult,
  useSubmitSkillAssessment,
} from '@/src/features/skill-assessment/useSkillAssessment';

function topicLabel(topic: string, customTopic: string | null) {
  return topic === 'Other' && customTopic ? customTopic : topic;
}

export default function SkillAssessmentPage({ id }: { id: string }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const { data: assessment, isLoading, isError } = useSkillAssessment(id);
  const { data: submission, isLoading: loadingResult } = useSkillAssessmentResult(id, Boolean(token));
  const submit = useSubmitSkillAssessment(id);

  useEffect(() => {
    if (token && submission) {
      router.replace(`/assessment/${id}/result`);
    }
  }, [token, submission, id, router]);

  if (isLoading || (token && loadingResult) || (token && submission)) {
    return <AssessmentTakeSkeleton />;
  }

  if (isError || !assessment) {
    return (
      <Container className="max-w-[1240px] py-20 text-center">
        <h1 className="text-2xl font-semibold text-ink">Assessment not found</h1>
        <p className="mt-2 text-sm text-ink-2">This assessment may have expired or been removed.</p>
      </Container>
    );
  }

  return (
    <PaginatedSkillAssessment
      assessmentId={id}
      topicLabel={topicLabel(assessment.topic, assessment.customTopic)}
      questions={assessment.questions}
      submitting={submit.isPending}
      onSubmit={(answers) =>
        submit.mutate(answers, {
          onSuccess: () => router.push(`/assessment/${id}/result`),
        })
      }
    />
  );
}
