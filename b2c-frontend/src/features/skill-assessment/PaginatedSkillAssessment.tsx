'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Send,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Container } from '@/src/components/marketing/Container';
import { useAuthStore } from '@/src/store/authStore';
import type { AssessmentQuestion, SubmittedAnswer } from '@/src/domain/assessment';
import { pendingAnswersKey } from './skillAssessmentApi';

const PAGE_SIZE = 2;
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function PaginatedSkillAssessment({
  assessmentId,
  topicLabel,
  questions,
  submitting,
  onSubmit,
}: {
  assessmentId: string;
  topicLabel: string;
  questions: AssessmentQuestion[];
  submitting: boolean;
  onSubmit: (answers: SubmittedAnswer[]) => void;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const pageQuestions = useMemo(
    () => questions.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [questions, page],
  );
  const startIndex = page * PAGE_SIZE;
  const isLastPage = page === totalPages - 1;
  const answeredCount = questions.filter((_, i) => (answers[i] ?? '').trim() !== '').length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const pageAnswered = pageQuestions.every((_, i) => (answers[startIndex + i] ?? '').trim() !== '');
  const allAnswered = answeredCount === questions.length;

  const setAnswer = (index: number, value: string) =>
    setAnswers((prev) => ({ ...prev, [index]: value }));

  const buildAnswers = (): SubmittedAnswer[] =>
    questions.map((_, i) => ({ questionIndex: i, answer: answers[i] ?? '' }));

  const handleNext = () => {
    if (!pageAnswered) return;
    if (isLastPage) handleSubmit();
    else setPage((p) => p + 1);
  };

  const handleSubmit = () => {
    if (!allAnswered || submitting) return;
    const payload = buildAnswers();
    if (!token) {
      sessionStorage.setItem(pendingAnswersKey(assessmentId), JSON.stringify(payload));
      router.push(`/login?redirect=${encodeURIComponent(`/assessment/${assessmentId}/result`)}`);
      return;
    }
    onSubmit(payload);
  };

  return (
    <div className="pb-32 pt-8 lg:pt-12">
      <Container className="max-w-[1240px]">
        {/* Header */}
        <div className="overflow-hidden rounded-3xl border border-line/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="border-b border-line/70 bg-[linear-gradient(90deg,rgba(0,127,142,0.08)_0%,rgba(255,255,255,0)_55%)] px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <Sparkles className="size-3.5" />
                  Skill assessment
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  {topicLabel}
                </h1>
                <p className="mt-2 max-w-2xl text-base text-ink-2">
                  Answer all {questions.length} questions to discover your skill level. Take your time
                  — each section shows two questions at a time.
                </p>
              </div>

              <div className="grid min-w-[220px] grid-cols-3 gap-3 sm:gap-4">
                <StatCard label="Questions" value={String(questions.length)} />
                <StatCard label="Answered" value={String(answeredCount)} accent />
                <StatCard label="Progress" value={`${progressPercent}%`} />
              </div>
            </div>
          </div>

          <div className="px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalPages }, (_, step) => {
                  const done = step < page || (step === page && pageAnswered);
                  const active = step === page;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => step <= page && setPage(step)}
                      disabled={step > page}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition',
                        active && 'border-primary bg-primary text-white shadow-[0_8px_20px_rgba(0,127,142,0.22)]',
                        !active && done && 'border-primary/20 bg-primary-soft text-primary',
                        !active && !done && 'border-line bg-white text-ink-3',
                        step > page && 'cursor-not-allowed opacity-60',
                      )}
                    >
                      <span className="grid size-5 place-items-center rounded-full bg-white/15 text-[11px] font-bold">
                        {step + 1}
                      </span>
                      Section {step + 1}
                    </button>
                  );
                })}
              </div>

              <div className="min-w-[240px] flex-1 lg:max-w-md">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-2">
                    Section {page + 1} of {totalPages}
                  </span>
                  <span className="text-ink-3">{answeredCount}/{questions.length} complete</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line/80">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary)_0%,#14B8A6_100%)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {pageQuestions.map((q, offset) => {
            const i = startIndex + offset;
            const answered = Boolean(answers[i]?.trim());

            return (
              <article
                key={i}
                className={cn(
                  'rounded-3xl border bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-shadow sm:p-7',
                  answered ? 'border-primary/25' : 'border-line/80',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-bold text-white shadow-[0_10px_24px_rgba(0,127,142,0.25)]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
                        Question {i + 1}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold leading-8 text-ink sm:text-xl">
                        {q.question}
                      </h2>
                    </div>
                  </div>
                  {answered && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-good-soft px-2.5 py-1 text-xs font-semibold text-good">
                      <CheckCircle2 className="size-3.5" />
                      Selected
                    </span>
                  )}
                </div>

                {q.options && (
                  <div className="mt-6 flex flex-col gap-3">
                    {q.options.map((opt, optIndex) => {
                      const selected = answers[i] === opt;
                      const label = OPTION_LABELS[optIndex] ?? String(optIndex + 1);
                      return (
                        <label
                          key={opt}
                          className={cn(
                            'group flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-200',
                            selected
                              ? 'border-primary bg-primary-soft/70 shadow-[0_10px_24px_rgba(0,127,142,0.12)]'
                              : 'border-line/80 bg-[#FCFCFC] hover:border-primary/35 hover:bg-white',
                          )}
                        >
                          <input
                            type="radio"
                            name={`q-${i}`}
                            className="sr-only"
                            checked={selected}
                            onChange={() => setAnswer(i, opt)}
                          />
                          <span
                            className={cn(
                              'grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold transition-colors',
                              selected
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary ring-1 ring-line group-hover:ring-primary/30',
                            )}
                          >
                            {label}
                          </span>
                          <span
                            className={cn(
                              'text-sm leading-6 sm:text-[15px]',
                              selected ? 'font-medium text-primary' : 'text-ink-2',
                            )}
                          >
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Container>

      {/* Sticky footer actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-white/90 backdrop-blur-md">
        <Container className="max-w-[1240px]">
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-ink-2">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary">
                <ClipboardList className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">
                  {isLastPage ? 'Ready to submit?' : 'Continue to the next section'}
                </p>
                <p className="text-ink-3">
                  {pageAnswered
                    ? isLastPage
                      ? allAnswered
                        ? 'All questions answered. Submit to see your level.'
                        : 'Please answer every question before submitting.'
                      : 'This section is complete.'
                    : 'Select an answer for each question on this page.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:justify-end">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || submitting}
                className="min-w-[132px]"
              >
                <ArrowLeft className="size-4" />
                Previous
              </Button>

              <Button
                size="lg"
                onClick={handleNext}
                disabled={!pageAnswered || submitting || (isLastPage && !allAnswered)}
                className="min-w-[168px] bg-primary hover:bg-primary-dark"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isLastPage ? (
                  <Send className="size-4" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                {isLastPage ? 'Submit assessment' : 'Next section'}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3 text-center',
        accent ? 'border-primary/20 bg-primary-soft' : 'border-line/80 bg-white',
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', accent ? 'text-primary' : 'text-ink')}>{value}</p>
    </div>
  );
}

export default PaginatedSkillAssessment;
