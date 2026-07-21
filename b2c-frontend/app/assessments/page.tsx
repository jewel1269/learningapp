import { AssessmentSiteShell } from '@/src/components/marketing/AssessmentSiteShell';
import { AssessmentsPage } from '@/src/features/skill-assessment/AssessmentsPage';

export default function AssessmentsRoutePage() {
  return (
    <AssessmentSiteShell>
      <AssessmentsPage />
    </AssessmentSiteShell>
  );
}
