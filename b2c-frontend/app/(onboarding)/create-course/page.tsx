import { Suspense } from 'react';
import { CreateCourseWizard } from '@/src/features/onboarding/CreateCourseWizard';

export default function CreateCoursePage() {
  return (
    <Suspense fallback={null}>
      <CreateCourseWizard />
    </Suspense>
  );
}
