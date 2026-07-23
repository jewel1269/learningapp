'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/src/components/ui/skeleton';

export function AssessmentShell({ children }: { children: React.ReactNode }) {
  return <div className="w-full px-4 py-6 sm:px-6 lg:px-8">{children}</div>;
}

export function AssessmentLoading() {
  return (
    <AssessmentShell>
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-8 h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-40" />
      <Skeleton className="mt-10 h-px w-full" />
      <Skeleton className="mt-8 h-24 w-full" />
      <Skeleton className="mt-8 h-24 w-full" />
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
        className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-primary"
      >
        <ArrowLeft className="size-4" /> {backLabel}
      </Link>
      <div className="mt-8 border border-line bg-bg-elev px-6 py-10 text-center">
        <h1 className="text-lg font-semibold text-ink">{label}</h1>
        <p className="mt-2 text-sm text-ink-2">It may have been removed, or the link is wrong.</p>
      </div>
    </AssessmentShell>
  );
}
