import { BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary">
          <BarChart3 className="size-8" strokeWidth={1.8} />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Analytics coming soon
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-2 sm:text-base">
          We are building your learning analytics dashboard. Check back shortly for insights on
          your progress and activity.
        </p>
      </div>
    </div>
  );
}
