'use client';

import { Activity, BookOpen, Brain, Users } from 'lucide-react';
import { useTranslation } from '@/src/i18n';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useAdminMetrics } from './useAdmin';

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
      <div className="flex items-center gap-2 text-ink-2">
        <Icon className="size-4 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-3">{hint}</p> : null}
    </div>
  );
}

function pct(value: number | null) {
  if (value === null) return '—';
  return `${Math.round(value * 100)}%`;
}

export function AdminMetricsPage() {
  const { t } = useTranslation();
  const metricsQ = useAdminMetrics();

  if (metricsQ.isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (metricsQ.isError || !metricsQ.data) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <p className="text-ink-2">{t('admin.accessDenied')}</p>
          <Button variant="soft" className="mt-4" onClick={() => metricsQ.refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  const data = metricsQ.data;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-ink">{t('admin.metricsTitle')}</h2>
      <p className="mt-1 text-sm text-ink-2">
        Updated {new Date(data.generatedAt).toLocaleString()}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Users"
          value={String(data.users.active)}
          hint={`${data.users.premium} premium · ${data.users.total} total`}
          icon={Users}
        />
        <StatCard
          label="Courses"
          value={String(data.courses.total)}
          hint={`Success ${pct(data.courses.generationSuccessRate)} · Failed ${pct(data.courses.generationFailureRate)}`}
          icon={BookOpen}
        />
        <StatCard
          label="Assessments"
          value={String(data.assessments.quizSubmissions + data.assessments.examSubmissions)}
          hint={`${data.assessments.quizSubmissions} quizzes · ${data.assessments.examSubmissions} exams`}
          icon={Activity}
        />
        <StatCard
          label="AI spend"
          value={`$${data.ai.totalCostUsd.toFixed(2)}`}
          hint={`${data.ai.totalCalls} calls`}
          icon={Brain}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
          <h3 className="font-bold text-ink">Course status</h3>
          <dl className="mt-4 space-y-2">
            {Object.entries(data.courses.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <dt className="capitalize text-ink-2">{status}</dt>
                <dd className="font-semibold text-ink">{count}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
          <h3 className="font-bold text-ink">Exercises</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink-2">Submissions</dt>
              <dd className="font-semibold text-ink">{data.exercises.submissions}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-2">Graded</dt>
              <dd className="font-semibold text-ink">{data.exercises.graded}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-2">Completion rate</dt>
              <dd className="font-semibold text-ink">{pct(data.exercises.completionRate)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-2">Labs</dt>
              <dd className="text-right text-ink-3">{data.labs.note}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

export default AdminMetricsPage;
