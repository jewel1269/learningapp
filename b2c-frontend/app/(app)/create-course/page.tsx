'use client';

import { Suspense } from 'react';
import { CreateCourseWizard } from '@/src/features/onboarding/CreateCourseWizard';
import { Skeleton } from '@/src/components/ui/skeleton';

function CreateCourseFallback() {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8 xl:px-10">
      <Skeleton className="h-20 w-full max-w-2xl" />
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="hidden h-96 rounded-xl lg:block" />
        <Skeleton className="h-[520px] rounded-xl" />
      </div>
    </div>
  );
}

export default function CreateCoursePage() {
  return (
    <Suspense fallback={<CreateCourseFallback />}>
      <CreateCourseWizard />
    </Suspense>
  );
}
