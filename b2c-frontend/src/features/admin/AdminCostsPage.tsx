'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from '@/src/i18n';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useAdminCosts } from './useAdmin';

export function AdminCostsPage() {
  const { t } = useTranslation();
  const costsQ = useAdminCosts();

  if (costsQ.isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (costsQ.isError || !costsQ.data) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <p className="text-ink-2">{t('admin.accessDenied')}</p>
          <Button variant="soft" className="mt-4" onClick={() => costsQ.refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  const data = costsQ.data;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-ink">{t('admin.costsTitle')}</h2>
      <p className="mt-1 text-sm text-ink-2">
        ${data.totalCostUsd.toFixed(2)} total · {data.totalCalls} calls ·{' '}
        {data.inputTokens.toLocaleString()} in / {data.outputTokens.toLocaleString()} out tokens
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
          <h3 className="font-bold text-ink">By use case</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byUseCase}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="useCase" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Cost']} />
                <Bar dataKey="costUsd" fill="#0D6E63" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
          <h3 className="font-bold text-ink">By model</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byModel}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="model" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Cost']} />
                <Bar dataKey="costUsd" fill="#12A594" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
        <h3 className="font-bold text-ink">Top users by AI spend</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-2">
                <th className="py-2 pr-4">User ID</th>
                <th className="py-2 pr-4">Cost (USD)</th>
                <th className="py-2">Calls</th>
              </tr>
            </thead>
            <tbody>
              {data.topUsers.map((row) => (
                <tr key={row.userId} className="border-b border-line/60">
                  <td className="py-3 pr-4 font-mono text-xs text-ink">{row.userId}</td>
                  <td className="py-3 pr-4 text-ink">${row.costUsd.toFixed(4)}</td>
                  <td className="py-3 text-ink">{row.calls}</td>
                </tr>
              ))}
              {data.topUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-ink-3">
                    No AI usage yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminCostsPage;
