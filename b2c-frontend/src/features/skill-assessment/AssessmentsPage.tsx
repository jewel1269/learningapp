'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Plus,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Container } from '@/src/components/marketing/Container';
import { cn } from '@/src/lib/utils';
import type { SkillAssessmentSummary } from '@/src/domain/assessment';
import { CreateAssessmentDialog } from '@/src/features/skill-assessment/CreateAssessmentDialog';
import { AssessmentsListSkeleton } from '@/src/features/skill-assessment/SkillAssessmentSkeletons';
import { useMySkillAssessments } from '@/src/features/skill-assessment/useSkillAssessment';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function AssessmentCard({ item }: { item: SkillAssessmentSummary }) {
  const completed = item.status === 'completed';

  return (
    <article className="rounded-3xl border border-line/80 bg-bg-elev p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
            {item.topic}
          </p>
          <h3 className="mt-2 text-xl font-bold text-ink">{item.topicLabel}</h3>
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            completed ? 'bg-good-soft text-good' : 'bg-primary-soft text-primary',
          )}
        >
          {completed ? 'Completed' : 'In progress'}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-ink-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line/80 px-3 py-1">
          <ClipboardList className="size-4 text-primary" />
          {item.questionCount} questions
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line/80 px-3 py-1">
          <CalendarDays className="size-4 text-primary" />
          {formatDate(item.generatedAt)}
        </span>
        {completed && item.submission && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary-soft px-3 py-1 font-medium text-secondary">
            <Trophy className="size-4" />
            {item.submission.level} · {item.submission.score}%
          </span>
        )}
      </div>

      <div className="mt-6">
        {completed ? (
          <Link href={`/assessment/${item.id}/result`}>
            <Button variant="soft" className="w-full sm:w-auto">
              View results
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        ) : (
          <Link href={`/assessment/${item.id}`}>
            <Button className="w-full bg-primary hover:bg-primary-dark sm:w-auto">
              Continue assessment
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}

export function AssessmentsPage() {
  const { data, isLoading, isError } = useMySkillAssessments();
  const [createOpen, setCreateOpen] = useState(false);

  const quota = data?.quota;
  const assessments = data?.assessments ?? [];
  const atLimit = quota?.remaining === 0;

  if (isLoading) {
    return (
      <>
        <AssessmentsListSkeleton />
        <CreateAssessmentDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="pb-16 pt-8 lg:pt-12">
        <Container className="max-w-[1240px]">
          <div className="overflow-hidden rounded-3xl border border-line/80 bg-bg-elev shadow-lift">
            <div className="border-b border-line/70 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary)_10%,transparent)_0%,transparent_55%)] px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <Sparkles className="size-3.5" />
                    Skill assessments
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    Your assessments
                  </h1>
                  <p className="mt-2 max-w-2xl text-base text-ink-2">
                    Create up to 3 assessments on the free plan. Track your progress, continue
                    unfinished tests, and review your skill levels.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {quota && quota.limit !== null && (
                    <div className="rounded-2xl border border-line/80 bg-bg-soft px-4 py-3 text-sm text-ink-2">
                      <span className="font-semibold text-ink">{quota.used}</span> / {quota.limit}{' '}
                      used on free plan
                    </div>
                  )}
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-dark"
                    onClick={() => setCreateOpen(true)}
                    disabled={atLimit}
                  >
                    <Plus className="size-4" />
                    Create assessment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {isError ? (
            <div className="mt-8 rounded-3xl border border-line/80 bg-bg-elev p-10 text-center shadow-soft">
              <p className="text-lg font-semibold text-ink">Could not load assessments</p>
              <p className="mt-2 text-sm text-ink-2">Please refresh and try again.</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-line bg-bg-elev/90 p-12 text-center shadow-soft">
              <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary-soft text-primary">
                <ClipboardList className="size-8" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-ink">No assessments yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-2">
                Start your first skill check to discover your level and get personalized learning
                recommendations.
              </p>
              <Button
                size="lg"
                className="mt-6 bg-primary hover:bg-primary-dark"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="size-4" />
                Create your first assessment
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {assessments.map((item) => (
                <AssessmentCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {atLimit && (
            <p className="mt-6 text-center text-sm text-ink-3">
              Free plan limit reached. Complete or wait for an assessment to expire before creating
              another.
            </p>
          )}
        </Container>
      </div>

      <CreateAssessmentDialog open={createOpen} onClose={() => setCreateOpen(false)} quota={quota} />
    </>
  );
}

export default AssessmentsPage;
