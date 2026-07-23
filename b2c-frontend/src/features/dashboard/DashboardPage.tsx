'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Crown,
  Flame,
  Plus,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { TRIAL_PERIOD_MONTHS } from '@/src/constants/pricing';
import { useMe } from '@/src/features/auth';
import { useCourses } from '@/src/features/courses';
import { CourseCard } from '@/src/features/courses/components/CourseCard';
import { useMyAchievements } from '@/src/features/gamification';
import { useSubscription } from '@/src/features/subscription';
import { useTranslation } from '@/src/i18n';
import type { Course } from '@/src/domain/course';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { Skeleton } from '@/src/components/ui/skeleton';
import { DashboardAnalytics } from './DashboardAnalytics';

function displayName(email: string) {
  const local = email.split('@')[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function pickContinueCourse(courses: Course[]): Course | undefined {
  return (
    courses.find(
      (course) =>
        course.status === 'ready' && course.progressPercent > 0 && course.progressPercent < 100,
    ) ??
    courses.find((course) => course.status === 'ready') ??
    courses.find((course) => course.status === 'generating')
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-44 rounded-2xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
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

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('dashboard.greetingMorning')
      : hour < 17
        ? t('dashboard.greetingAfternoon')
        : t('dashboard.greetingEvening');

  const loading =
    meQ.isLoading || coursesQ.isLoading || achievementsQ.isLoading || subscriptionQ.isLoading;

  if (loading) return <DashboardSkeleton />;

  const user = meQ.data?.user;
  const courses = coursesQ.data?.courses ?? [];
  const achievements = achievementsQ.data;
  const tier = subscriptionQ.data?.subscription.tier ?? user?.tier ?? 'free';
  const subscription = subscriptionQ.data?.subscription;
  const isPremium = tier === 'premium';
  const continueCourse = pickContinueCourse(courses);
  const previewCourses = courses.slice(0, 3);
  const streak = user?.streak?.current ?? 0;

  if (coursesQ.isError || !user) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-line bg-bg-elev p-10 text-center">
          <p className="text-ink-2">{t('dashboard.loadError')}</p>
          <Button variant="soft" className="mt-4" onClick={() => coursesQ.refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {greeting}, {displayName(user.email)}
            </h1>
            <p className="mt-1 text-sm text-ink-2">{t('dashboard.welcomeHub')}</p>
          </div>
          {streak > 0 ? (
            <Badge variant="warn" className="gap-1.5 px-3 py-1.5 text-sm">
              <Flame className="size-4" />
              {streak}-day streak
            </Badge>
          ) : null}
        </div>

        <div className="rounded-2xl border border-dashed border-line-2 bg-bg-soft p-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles className="size-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-ink">{t('dashboard.createFirstTitle')}</h2>
          <p className="mx-auto mt-2 max-w-[42ch] text-sm text-ink-2">
            {t('dashboard.createFirstBody')}
          </p>
          <Link href="/create-course" className="mt-6 inline-block">
            <Button size="lg">
              <Plus className="size-4" /> {t('dashboard.startLearning')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {greeting}, {displayName(user.email)}
          </h1>
          <p className="mt-1 text-sm text-ink-2">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {streak > 0 ? (
            <Badge variant="warn" className="gap-1.5 px-3 py-1.5 text-sm">
              <Flame className="size-4" />
              {streak}-day streak
            </Badge>
          ) : null}
          <Link href="/create-course">
            <Button>
              <Plus className="size-4" /> {t('common.newCourse')}
            </Button>
          </Link>
        </div>
      </div>

      {!isPremium && subscription?.requiresPayment ? (
        <div className="mb-6 rounded-2xl border border-bad/20 bg-bad-soft px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="font-semibold text-ink">{t('dashboard.trialEndedTitle')}</p>
            <p className="mt-1 text-sm text-ink-2">{t('dashboard.trialEndedBody')}</p>
          </div>
          <Link href="/upgrade" className="mt-3 inline-block sm:mt-0">
            <Button>{t('dashboard.subscribeNow')}</Button>
          </Link>
        </div>
      ) : null}

      {!isPremium && subscription?.trialActive ? (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-ink">
                {t('dashboard.trialDaysLeft', {
                  days: String(subscription.daysRemainingInTrial),
                  months: String(TRIAL_PERIOD_MONTHS),
                })}
              </p>
              <p className="mt-1 text-sm text-ink-2">{t('dashboard.trialPremiumNote')}</p>
            </div>
          </div>
          <Link href="/upgrade">
            <Button variant="soft">{t('dashboard.viewPlans')}</Button>
          </Link>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {continueCourse ? (
            <section className="rounded-2xl border border-line bg-bg-elev p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    {t('dashboard.continueLearning')}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-ink">{continueCourse.title}</h2>
                  <p className="mt-1 text-sm text-ink-2">{continueCourse.category}</p>
                </div>
                <Badge variant={continueCourse.status === 'generating' ? 'warn' : 'primary'}>
                  {continueCourse.status === 'generating'
                    ? t('dashboard.generating')
                    : t('dashboard.inProgress')}
                </Badge>
              </div>
              {continueCourse.status === 'ready' ? (
                <div className="mt-5">
                  <Progress value={continueCourse.progressPercent} />
                  <p className="mt-2 text-xs text-ink-3">
                    {continueCourse.progressPercent}% {t('dashboard.complete')}
                  </p>
                </div>
              ) : (
                <p className="mt-5 text-sm text-ink-2">
                  Your course is being generated. Check back in a moment.
                </p>
              )}
              <Link href={`/courses/${continueCourse.id}`} className="mt-5 inline-block">
                <Button variant={continueCourse.status === 'generating' ? 'soft' : 'primary'}>
                  {continueCourse.status === 'generating'
                    ? t('dashboard.viewStatus')
                    : t('common.continue')}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </section>
          ) : null}

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-ink">{t('dashboard.yourCourses')}</h2>
              </div>
              {courses.length > 3 ? (
                <Link
                  href="/my-courses"
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  {t('dashboard.viewAll')}
                </Link>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {previewCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>

          <DashboardAnalytics courses={courses} />
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-ink-2">{t('dashboard.planLabel')}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Crown
                    className={`size-5 ${tier === 'premium' ? 'text-secondary' : 'text-ink-3'}`}
                  />
                  <span className="text-lg font-bold capitalize text-ink">{tier}</span>
                </div>
              </div>
              <Badge variant={tier === 'premium' ? 'good' : 'outline'} className="capitalize">
                {tier}
              </Badge>
            </div>
            {tier === 'free' ? (
              <>
                <p className="mt-3 text-sm text-ink-2">{t('dashboard.upgradeHint')}</p>
                <Link href="/upgrade" className="mt-4 block">
                  <Button variant="soft" className="w-full">
                    {t('dashboard.upgradePremium')}
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/upgrade" className="mt-4 block">
                <Button variant="soft" className="w-full">
                  {t('dashboard.manageBilling')}
                </Button>
              </Link>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-secondary" />
              <h2 className="text-lg font-bold text-ink">{t('achievements.title')}</h2>
            </div>
            <p className="mt-3 text-2xl font-bold text-ink">
              {achievements?.earnedCount ?? 0}
              <span className="text-base font-medium text-ink-3">
                {' '}
                / {achievements?.total ?? 0} {t('dashboard.achievementsEarned')}
              </span>
            </p>
            {achievements?.achievements?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {achievements.achievements.slice(0, 4).map((item) => (
                  <span
                    key={item.key}
                    title={item.title}
                    className="grid size-10 place-items-center rounded-xl bg-secondary-soft text-lg"
                  >
                    {item.icon ?? '🏆'}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-2">{t('dashboard.achievementsHint')}</p>
            )}
            <Link href="/achievements" className="mt-4 block">
              <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
                {t('dashboard.viewAchievements')}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
