'use client';

import Link from 'next/link';
import { Flame, Lock, Trophy } from 'lucide-react';
import { useMe } from '@/src/features/auth';
import { useTranslation } from '@/src/i18n';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { cn } from '@/src/lib/utils';
import { useAchievementCatalog, useMyAchievements } from './useGamification';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function AchievementsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="mt-2 h-5 w-80" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function AchievementsPage() {
  const { t } = useTranslation();
  const meQ = useMe();
  const catalogQ = useAchievementCatalog();
  const earnedQ = useMyAchievements();

  const loading = meQ.isLoading || catalogQ.isLoading || earnedQ.isLoading;
  if (loading) return <AchievementsSkeleton />;

  if (catalogQ.isError || earnedQ.isError) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <p className="text-ink-2">{t('achievements.loadError')}</p>
          <Button
            variant="soft"
            className="mt-4"
            onClick={() => {
              void catalogQ.refetch();
              void earnedQ.refetch();
            }}
          >
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  const earnedByKey = new Map(
    (earnedQ.data?.achievements ?? []).map((item) => [item.key, item]),
  );
  const catalog = catalogQ.data?.achievements ?? [];
  const streak = meQ.data?.user.streak?.current ?? 0;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-secondary-soft text-secondary">
            <Trophy className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{t('achievements.title')}</h1>
            <p className="mt-1 text-sm text-ink-2">
              {earnedQ.data?.earnedCount ?? 0} of {earnedQ.data?.total ?? catalog.length}{' '}
              {t('achievements.unlocked')}
            </p>
          </div>
        </div>
        {streak > 0 ? (
          <Badge variant="warn" className="gap-1.5 px-3 py-1.5 text-sm">
            <Flame className="size-4" />
            {streak}-day streak
          </Badge>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {catalog.map((item) => {
          const earned = earnedByKey.get(item.key);
          const unlocked = Boolean(earned);
          return (
            <article
              key={item.key}
              className={cn(
                'rounded-2xl border p-5 shadow-soft transition-colors',
                unlocked
                  ? 'border-secondary/30 bg-secondary-soft/40'
                  : 'border-line bg-bg-elev opacity-90',
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    'grid size-12 shrink-0 place-items-center rounded-2xl text-2xl',
                    unlocked ? 'bg-white' : 'bg-bg-soft grayscale',
                  )}
                >
                  {item.icon ?? '🏆'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-ink">{item.title}</h2>
                    {unlocked ? (
                      <Badge variant="good">{t('achievements.earned')}</Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="size-3" />
                        {t('achievements.locked')}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-2">
                    {item.description ?? t('achievements.defaultDescription')}
                  </p>
                  {earned?.earnedAt ? (
                    <p className="mt-2 text-xs text-ink-3">Unlocked {formatDate(earned.earnedAt)}</p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {(earnedQ.data?.earnedCount ?? 0) === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line-2 bg-bg-soft p-8 text-center">
          <p className="text-sm text-ink-2">{t('achievements.emptyHint')}</p>
          <Link href="/my-courses" className="mt-4 inline-block">
            <Button>{t('achievements.startLearning')}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default AchievementsPage;
