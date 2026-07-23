'use client';

import Link from 'next/link';
import { ChevronRight, Clock, Flame, GraduationCap, Plus, Sparkles, Target, Trophy } from 'lucide-react';
import { TRIAL_PERIOD_MONTHS } from '@/src/constants/pricing';
import { useMe } from '@/src/features/auth';
import { useCourses } from '@/src/features/courses';
import { useMyAchievements } from '@/src/features/gamification';
import { useSubscription } from '@/src/features/subscription';
import { useTranslation } from '@/src/i18n';
import type { Course } from '@/src/domain/course';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import {
  DashboardActivityTable,
  DashboardChartsRow,
  RecentCoursesPanel,
  StudySummaryCard,
} from './DashboardAnalytics';

function computeCourseStats(courses: Course[]) {
  const ready = courses.filter((course) => course.status === 'ready');
  const completed = ready.filter((course) => course.progressPercent >= 100).length;
  const inProgress = ready.filter(
    (course) => course.progressPercent > 0 && course.progressPercent < 100,
  ).length;
  const avgProgress = ready.length
    ? Math.round(ready.reduce((sum, course) => sum + course.progressPercent, 0) / ready.length)
    : 0;
  return { ready: ready.length, completed, inProgress, avgProgress };
}

function DashboardHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-[#3D2C1E]">Dashboard</h1>
      <nav className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
        <Link href="/dashboard" className="transition hover:text-[#3D2C1E]">
          AIStudy
        </Link>
        <ChevronRight className="size-4" />
        <span className="font-medium text-[#3D2C1E]">Dashboard</span>
      </nav>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[360px] rounded-xl" />
        <Skeleton className="h-[360px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <Skeleton className="h-[420px] rounded-xl lg:col-span-4" />
        <Skeleton className="h-[420px] rounded-xl lg:col-span-8" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const meQ = useMe();
  const coursesQ = useCourses();
  const achievementsQ = useMyAchievements();
  const subscriptionQ = useSubscription();

  const loading =
    meQ.isLoading || coursesQ.isLoading || achievementsQ.isLoading || subscriptionQ.isLoading;

  if (loading) return <DashboardSkeleton />;

  const user = meQ.data?.user;
  const courses = coursesQ.data?.courses ?? [];
  const achievements = achievementsQ.data;
  const tier = subscriptionQ.data?.subscription.tier ?? user?.tier ?? 'free';
  const subscription = subscriptionQ.data?.subscription;
  const isPremium = tier === 'premium';
  const streak = user?.streak?.current ?? 0;
  const courseStats = computeCourseStats(courses);

  const shellClass = 'w-full space-y-6 p-4 sm:p-6 lg:p-8 xl:px-10';

  if (coursesQ.isError || !user) {
    return (
      <div className={shellClass}>
        <DashboardHeader />
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-10 text-center shadow-sm">
          <p className="text-[#5C534A]">{t('dashboard.loadError')}</p>
          <Button variant="soft" className="mt-4" onClick={() => coursesQ.refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={shellClass}>
        <DashboardHeader />

        <div className="rounded-xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#E7E3DE] text-[#6D4C41]">
            <Sparkles className="size-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#3D2C1E]">{t('dashboard.createFirstTitle')}</h2>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm text-[#9CA3AF]">
            {t('dashboard.createFirstBody')}
          </p>
          <Link href="/create-course" className="mt-6 inline-block">
            <Button size="lg" className="rounded-md bg-[#6D4C41] hover:bg-[#5D4037]">
              <Plus className="size-4" /> {t('dashboard.startLearning')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <DashboardHeader />

      {!isPremium && subscription?.requiresPayment ? (
        <div className="rounded-xl border border-bad/20 bg-white px-5 py-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="font-semibold text-[#3D2C1E]">{t('dashboard.trialEndedTitle')}</p>
            <p className="mt-1 text-sm text-[#9CA3AF]">{t('dashboard.trialEndedBody')}</p>
          </div>
          <Link href="/upgrade" className="mt-3 inline-block sm:mt-0">
            <Button className="rounded-md bg-[#6D4C41] hover:bg-[#5D4037]">
              {t('dashboard.subscribeNow')}
            </Button>
          </Link>
        </div>
      ) : null}

      {!isPremium && subscription?.trialActive ? (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/15 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-[#3D2C1E]">
                {t('dashboard.trialDaysLeft', {
                  days: String(subscription.daysRemainingInTrial),
                  months: String(TRIAL_PERIOD_MONTHS),
                })}
              </p>
              <p className="mt-1 text-sm text-[#9CA3AF]">{t('dashboard.trialPremiumNote')}</p>
            </div>
          </div>
          <Link href="/upgrade">
            <Button variant="soft">{t('dashboard.viewPlans')}</Button>
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StudySummaryCard
          label="Courses"
          value={String(courseStats.ready)}
          icon={GraduationCap}
          iconBg="bg-[#E5E7EB] text-[#6B7280]"
        />
        <StudySummaryCard
          label="Progress"
          value={`${courseStats.avgProgress}%`}
          icon={Target}
          iconBg="bg-[#FEF3C7] text-[#D97706]"
        />
        <StudySummaryCard
          label="Achievements"
          value={`${achievements?.earnedCount ?? 0}`}
          icon={Trophy}
          iconBg="bg-[#DCFCE7] text-[#16A34A]"
        />
        <StudySummaryCard
          label="Streak"
          value={String(streak)}
          icon={Flame}
          iconBg="bg-[#DBEAFE] text-[#2563EB]"
        />
      </div>

      <DashboardChartsRow courses={courses} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <RecentCoursesPanel courses={courses} />
        </div>
        <div className="lg:col-span-8">
          <DashboardActivityTable />
        </div>
      </div>
    </div>
  );
}
