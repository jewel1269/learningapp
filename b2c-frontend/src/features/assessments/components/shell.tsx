'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/src/components/ui/skeleton';

export function AssessmentShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[780px] p-4 sm:p-6 lg:p-8">{children}</div>;
}

export function AssessmentLoading() {
  return (
    <AssessmentShell>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-9 w-1/2" />
      <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
      <Skeleton className="mt-4 h-40 w-full rounded-2xl" />
    </AssessmentShell>
  );
}

export function AssessmentError({
  backHref,
  backLabel,
  label,
}: {
  backHref: string;
  backLabel: string;
  label: string;
}) {
  return (
    <AssessmentShell>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-primary"
      >
        <ArrowLeft className="size-4" /> {backLabel}
      </Link>
      <div className="mt-6 rounded-2xl border border-line bg-bg-elev p-10 text-center">
        <h1 className="text-xl font-bold">{label}</h1>
        <p className="mt-2 text-sm text-ink-2">It may have been removed, or the link is wrong.</p>
      </div>
    </AssessmentShell>
  );
}
