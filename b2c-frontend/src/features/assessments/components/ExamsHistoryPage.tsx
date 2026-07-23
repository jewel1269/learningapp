'use client';

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useMyExams } from '@/src/features/assessments/useAssessments';
import { useTranslation } from '@/src/i18n';

function scoreTone(score: number) {
  if (score >= 70) return 'good';
  if (score >= 50) return 'default';
  return 'bad';
}

export function ExamsHistoryPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyExams();

  return (
    <div className="mx-auto w-full max-w-[980px] p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
          <GraduationCap className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('assessments.examHistoryTitle')}</h1>
          <p className="text-sm text-ink-2">{t('assessments.examHistorySubtitle')}</p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 space-y-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      )}

      {isError && (
        <div className="mt-8 rounded-2xl border border-line bg-bg-elev p-8 text-center">
          <p className="text-sm text-ink-2">{t('assessments.loadExamError')}</p>
          <Button variant="soft" className="mt-3" onClick={() => refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-line-2 bg-bg-soft p-10 text-center">
          <p className="text-sm text-ink-2">{t('assessments.noExams')}</p>
          <Link href="/my-courses" className="mt-4 inline-block">
            <Button>{t('common.browseCourses')}</Button>
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {data?.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft"
          >
            <div>
              <p className="font-semibold text-ink">{item.scopeTitle}</p>
              <p className="mt-1 text-sm text-ink-2">
                {item.scope} exam · {item.questionCount} {t('assessments.questions')} ·{' '}
                {new Date(item.submittedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={scoreTone(item.score)}>{item.score}%</Badge>
              <Link href={`/exam/${item.examId}`}>
                <Button variant="soft" size="sm">
                  {t('assessments.viewExam')}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamsHistoryPage;
