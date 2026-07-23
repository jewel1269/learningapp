'use client';

import Link from 'next/link';
import { ArrowRight, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Course } from '@/src/domain/course';
import type { ExamHistoryItem, QuizHistoryItem } from '@/src/domain/assessment';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Avatar } from '@/src/components/ui/avatar';
import { useMyExams, useMyQuizzes } from '@/src/features/assessments/useAssessments';
import { useTranslation } from '@/src/i18n';
import { cn } from '@/src/lib/utils';

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
    .slice(0, 6);
}

function shortId(id: string) {
  return id.length > 10 ? `${id.slice(0, 8)}…` : id;
}

function scoreRank(score: number) {
  if (score >= 90) return 'First';
  if (score >= 75) return 'Second';
  if (score >= 60) return 'Third';
  return 'Fourth';
}

function buildCourseProgressData(courses: Course[]) {
  const ready = courses.filter((course) => course.status === 'ready').slice(0, 7);
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return labels.map((name, index) => {
    const course = ready[index % Math.max(ready.length, 1)];
    const progress = course?.progressPercent ?? 0;
    return {
      name,
      progress,
      target: Math.min(100, progress + Math.max(8, Math.round(progress * 0.15))),
    };
  });
}

function buildMonthlyOverview(quizzes: QuizHistoryItem[], exams: ExamHistoryItem[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts = new Array(12).fill(0);
  const scores = new Array(12).fill(0);
  const scoreCounts = new Array(12).fill(0);

  [...quizzes, ...exams].forEach((item) => {
    const month = new Date(item.submittedAt).getMonth();
    counts[month] += 1;
    scores[month] += item.score;
    scoreCounts[month] += 1;
  });

  return months.map((name, index) => ({
    name,
    attempts: counts[index],
    average: scoreCounts[index] ? Math.round(scores[index] / scoreCounts[index]) : 0,
  }));
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-white px-3 py-2 shadow-sm">
      <p className="mb-1 text-xs font-semibold text-[#3D2C1E]">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs text-[#5C534A]">
          {entry.name}: <span className="font-semibold text-[#3D2C1E]">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function CourseProgressChart({ courses }: { courses: Course[] }) {
  const data = buildCourseProgressData(courses);

  return (
    <section className="rounded-xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#3D2C1E]">Learning Performance</h3>
      <div className="mt-5 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="progress"
              name="Progress"
              stroke="#14B8A6"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function LearningOverviewChart({
  quizzes,
  exams,
}: {
  quizzes: QuizHistoryItem[];
  exams: ExamHistoryItem[];
}) {
  const data = buildMonthlyOverview(quizzes, exams);

  return (
    <section className="rounded-xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#3D2C1E]">Learning Overview</h3>
      <div className="mt-5 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="attempts"
              name="Attempts"
              fill="#6D4C41"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="average"
              name="Average score"
              stroke="#EC4899"
              strokeWidth={2.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ChartsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-[360px] rounded-xl" />
      <Skeleton className="h-[360px] rounded-xl" />
    </div>
  );
}

function TableSkeleton() {
  return <Skeleton className="h-[420px] rounded-xl" />;
}

export function DashboardChartsRow({ courses }: { courses: Course[] }) {
  const quizzesQ = useMyQuizzes();
  const examsQ = useMyExams();

  if (quizzesQ.isLoading || examsQ.isLoading) return <ChartsSkeleton />;

  const quizzes = quizzesQ.data ?? [];
  const exams = examsQ.data ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CourseProgressChart courses={courses} />
      <LearningOverviewChart quizzes={quizzes} exams={exams} />
    </div>
  );
}

export function DashboardActivityTable() {
  const { t } = useTranslation();
  const quizzesQ = useMyQuizzes();
  const examsQ = useMyExams();

  if (quizzesQ.isLoading || examsQ.isLoading) return <TableSkeleton />;

  const activity = buildActivity(quizzesQ.data ?? [], examsQ.data ?? []);

  return (
    <section className="overflow-hidden rounded-xl border border-[#EBEBEB] bg-white shadow-sm">
      {(quizzesQ.isError || examsQ.isError) && (
        <div className="flex justify-end border-b border-[#EBEBEB] px-5 py-3">
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
        </div>
      )}

      {activity.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-[#9CA3AF]">{t('dashboard.noActivity')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EBEBEB] text-xs text-[#9CA3AF]">
                <th className="px-5 py-4 font-medium">Assessment</th>
                <th className="px-5 py-4 font-medium">ID</th>
                <th className="px-5 py-4 font-medium">Type</th>
                <th className="px-5 py-4 font-medium">Score</th>
                <th className="px-5 py-4 font-medium">Rank</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((entry) => {
                const title =
                  entry.kind === 'quiz' ? entry.item.lessonTitle : entry.item.scopeTitle;
                const label = entry.kind === 'quiz' ? 'Quiz' : 'Exam';
                return (
                  <tr key={`${entry.kind}-${entry.item.id}`} className="border-b border-[#F3F4F6]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={title} className="size-9 text-xs" />
                        <span className="font-medium text-[#3D2C1E]">{title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#9CA3AF]">{shortId(entry.item.id)}</td>
                    <td className="px-5 py-4 text-[#5C534A]">{label}</td>
                    <td className="px-5 py-4 font-medium text-[#3D2C1E]">{entry.item.score}%</td>
                    <td className="px-5 py-4 text-[#5C534A]">{scoreRank(entry.item.score)}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-full border border-[#EBEBEB] text-[#9CA3AF] transition hover:bg-[#FAFAF8]"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function RecentCoursesPanel({ courses }: { courses: Course[] }) {
  const preview = courses.slice(0, 6);

  return (
    <section className="h-full rounded-xl border border-[#EBEBEB] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#3D2C1E]">Recent Courses</h3>
          <p className="mt-1 text-sm text-[#9CA3AF]">You have {courses.length} courses</p>
        </div>
        <Link
          href="/create-course"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[#6D4C41] text-white transition hover:bg-[#5D4037]"
          aria-label="Create course"
        >
          <Plus className="size-4" />
        </Link>
      </div>

      <div className="mt-5">
        {preview.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-3 border-b border-[#F3F4F6] py-4 last:border-b-0"
          >
            <Avatar name={course.title} className="size-10 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-[#3D2C1E]">{course.title}</p>
              <p className="text-xs text-[#9CA3AF]">{course.category}</p>
            </div>
            <Link
              href={`/courses/${course.id}`}
              className="grid size-8 shrink-0 place-items-center rounded-full border border-[#EBEBEB] text-[#9CA3AF] transition hover:bg-[#FAFAF8] hover:text-[#5C534A]"
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </div>

      {courses.length > 6 ? (
        <Link
          href="/my-courses"
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
        >
          View all courses
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </section>
  );
}

export function StudySummaryCard({
  label,
  value,
  icon: Icon,
  iconBg,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#EBEBEB] bg-white px-5 py-4 shadow-sm">
      <div className={cn('grid size-[52px] shrink-0 place-items-center rounded-full', iconBg)}>
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-sm text-[#9CA3AF]">{label}</p>
        <p className="text-[26px] font-bold leading-tight text-[#3D2C1E]">{value}</p>
      </div>
    </div>
  );
}
