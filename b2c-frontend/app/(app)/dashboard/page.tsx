'use client';

import {
  Users,
  BookOpen,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Activity,
  BarChart3,
} from 'lucide-react';
import { KpiCard } from '@/src/components/dashboard/KpiCard';
import { AnalyticsChart } from '@/src/components/dashboard/AnalyticsChart';
import { EnrollmentChart } from '@/src/components/dashboard/EnrollmentChart';
import { MetricCard } from '@/src/components/dashboard/MetricCard';
import { EnrollmentsTable } from '@/src/components/dashboard/EnrollmentsTable';
import { ActivityTimeline } from '@/src/components/dashboard/ActivityTimeline';
import { UpcomingClasses } from '@/src/components/dashboard/UpcomingClasses';
import { LatestReviews } from '@/src/components/dashboard/LatestReviews';
import { Announcements } from '@/src/components/dashboard/Announcements';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-2">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* ROW 1 — KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Students"
          value="12,845"
          change={12.5}
          icon={Users}
          gradient="kpi-gradient-1"
          sparklineData={[30, 40, 35, 50, 49, 60, 70, 91, 86, 95, 105, 120]}
          delay={0}
        />
        <KpiCard
          title="Active Courses"
          value="248"
          change={8.2}
          icon={BookOpen}
          gradient="kpi-gradient-2"
          sparklineData={[20, 25, 30, 28, 35, 42, 48, 55, 52, 60, 65, 72]}
          delay={0.1}
        />
        <KpiCard
          title="Revenue"
          value="$184,520"
          change={18.7}
          icon={DollarSign}
          gradient="kpi-gradient-3"
          sparklineData={[50, 55, 62, 58, 70, 75, 82, 88, 95, 102, 110, 125]}
          delay={0.2}
        />
        <KpiCard
          title="Completion Rate"
          value="73.4%"
          change={-2.1}
          changeLabel="vs last month"
          icon={GraduationCap}
          gradient="kpi-gradient-4"
          sparklineData={[65, 68, 72, 70, 74, 76, 73, 75, 72, 74, 73, 73]}
          delay={0.3}
        />
      </div>

      {/* ROW 2 — Charts */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div>
          <EnrollmentChart />
        </div>
      </div>

      {/* ROW 3 — Metric Cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Revenue Analytics"
          value="$48,250"
          change={14.3}
          subtitle="This month"
          color="#4F46E5"
          data={[20, 35, 30, 50, 45, 60, 55, 70, 65, 80, 75, 90]}
          icon={TrendingUp}
          delay={0.5}
        />
        <MetricCard
          title="Student Activity"
          value="8,432"
          change={22.1}
          subtitle="Active this week"
          color="#7C3AED"
          data={[40, 45, 55, 50, 65, 60, 75, 70, 85, 80, 95, 90]}
          icon={Activity}
          delay={0.6}
        />
        <MetricCard
          title="Course Performance"
          value="4.8/5.0"
          change={3.5}
          subtitle="Average rating"
          color="#06B6D4"
          data={[60, 62, 58, 65, 63, 68, 66, 70, 69, 72, 71, 75]}
          icon={BarChart3}
          delay={0.7}
        />
      </div>

      {/* ROW 4 — Enrollments Table */}
      <div className="mt-6">
        <EnrollmentsTable />
      </div>

      {/* ROW 5 — Bottom Section */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ActivityTimeline />
        <UpcomingClasses />
        <LatestReviews />
        <Announcements />
      </div>
    </div>
  );
}
