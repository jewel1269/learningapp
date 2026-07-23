'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, ClipboardCheck, GraduationCap, NotebookPen } from 'lucide-react';
import type { Course } from '@/src/domain/course';
import type { ExamHistoryItem, QuizHistoryItem } from '@/src/domain/assessment';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useMyExams, useMyQuizzes } from '@/src/features/assessments/useAssessments';
import { useTranslation } from '@/src/i18n';

function averageScore(items: { score: number }[]) {
  if (!items.length) return null;
  return Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);
}

function computeCourseStats(courses: Course[]) {
  const ready = courses.filter((course) => course.status === 'ready');
  const completed = ready.filter((course) => course.progressPercent >= 100).length;
  const inProgress = ready.filter(
    (course) => course.progressPercent > 0 && course.progressPercent < 100,
  ).length;
  const avgProgress = ready.length
    ? Math.round(
        ready.reduce((sum, course) => sum + course.progressPercent, 0) / ready.length,
      )
    : 0;
  return { ready: ready.length, completed, inProgress, avgProgress };
}

type ActivityItem =
  | { kind: 'quiz'; item: QuizHistoryItem }
  | { kind: 'exam'; item: ExamHistoryItem };

function buildActivity(quizzes: QuizHistoryItem[], exams: ExamHistoryItem[]): ActivityItem[] {
  return [
    ...quizzes.map((item) => ({ kind: 'quiz' as const, item })),
    ...exams.map((item) => ({ kind: 'exam' as const, item })),
  ]
    .sort(
      (a, b) =>
        new Date(b.item.submittedAt).getTime() - new Date(a.item.submittedAt).getTime(),
    )
    .slice(0, 5);
}

function scoreTone(score: number) {
  if (score >= 70) return 'good';
  if (score >= 50) return 'default';
  return 'bad';
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg-elev p-4 shadow-soft">
      <div className="flex items-center gap-2 text-ink-2">
        <Icon className="size-4 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-3">{hint}</p>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}

export function DashboardAnalytics({ courses }: { courses: Course[] }) {
  const { t } = useTranslation();
  const quizzesQ = useMyQuizzes();
  const examsQ = useMyExams();

  if (quizzesQ.isLoading || examsQ.isLoading) return <AnalyticsSkeleton />;

  const quizzes = quizzesQ.data ?? [];
  const exams = examsQ.data ?? [];
  const courseStats = computeCourseStats(courses);
  const quizAvg = averageScore(quizzes);
  const examAvg = averageScore(exams);
  const activity = buildActivity(quizzes, exams);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-ink">{t('dashboard.analytics')}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/quizzes">
            <Button variant="ghost" size="sm">
              {t('dashboard.quizHistory')}
            </Button>
          </Link>
          <Link href="/exams">
            <Button variant="ghost" size="sm">
              {t('dashboard.examHistory')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Courses"
          value={String(courseStats.ready)}
          hint={`${courseStats.completed} completed · ${courseStats.inProgress} in progress`}
          icon={GraduationCap}
        />
        <KpiCard
          label="Course progress"
          value={`${courseStats.avgProgress}%`}
          hint="Average across ready courses"
          icon={BarChart3}
        />
        <KpiCard
          label="Quizzes"
          value={quizAvg === null ? '—' : `${quizAvg}%`}
          hint={`${quizzes.length} submitted`}
          icon={NotebookPen}
        />
        <KpiCard
          label="Exams"
          value={examAvg === null ? '—' : `${examAvg}%`}
          hint={`${exams.length} submitted`}
          icon={ClipboardCheck}
        />
      </div>

      <div className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-ink">{t('dashboard.recentActivity')}</h3>
          {(quizzesQ.isError || examsQ.isError) && (
            <Button
              variant="soft"
              size="sm"
              onClick={() => {
                void quizzesQ.refetch();
                void examsQ.refetch();
              }}
            >
              {t('common.retry')}
            </Button>
          )}
        </div>

        {activity.length === 0 ? (
          <p className="mt-4 text-sm text-ink-2">{t('dashboard.noActivity')}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {activity.map((entry) => {
              const title =
                entry.kind === 'quiz' ? entry.item.lessonTitle : entry.item.scopeTitle;
              const label = entry.kind === 'quiz' ? 'Quiz' : 'Exam';
              return (
                <div
                  key={`${entry.kind}-${entry.item.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-bg-soft px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-xs text-ink-3">
                      {label} · {new Date(entry.item.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={scoreTone(entry.item.score)}>{entry.item.score}%</Badge>
                </div>
              );
            })}
          </div>
        )}

        {activity.length > 0 ? (
          <Link href="/quizzes" className="mt-4 block">
            <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
              {t('dashboard.viewAllActivity')}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
