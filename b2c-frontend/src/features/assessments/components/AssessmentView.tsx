'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { ResultSummary } from './ResultSummary';
import type {
  AssessmentQuestion,
  AssessmentSubmission,
  SubmittedAnswer,
} from '@/src/domain/assessment';

export function AssessmentView({
  title,
  subtitle,
  questions,
  submission,
  submitting,
  submitError,
  onSubmit,
  backHref,
  backLabel,
  onRetake,
  retaking,
}: {
  title: string;
  subtitle?: string;
  questions: AssessmentQuestion[];
  submission: AssessmentSubmission | null;
  submitting: boolean;
  submitError: boolean;
  onSubmit: (answers: SubmittedAnswer[]) => void;
  backHref: string;
  backLabel: string;
  onRetake?: () => void;
  retaking?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const setAnswer = (i: number, val: string) => setAnswers((prev) => ({ ...prev, [i]: val }));

  if (submission) {
    return (
      <ResultSummary
        questions={questions}
        submission={submission}
        answers={answers}
        backHref={backHref}
        backLabel={backLabel}
        onRetake={onRetake}
        retaking={retaking}
      />
    );
  }

  const answeredCount = questions.filter((_, i) => (answers[i] ?? '').trim() !== '').length;
  const submit = () =>
    onSubmit(questions.map((_, i) => ({ questionIndex: i, answer: answers[i] ?? '' })));

  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-primary"
      >
        <ArrowLeft className="size-4" /> {backLabel}
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-ink-2">{subtitle}</p>}
        <p className="mt-2 text-sm text-ink-3">
          {answeredCount} of {questions.length} answered
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {questions.map((q, i) => (
          <div key={i} className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft">
            <p className="font-medium text-ink">
              {i + 1}. {q.question}
            </p>
            {q.type === 'mcq' && q.options ? (
              <div className="mt-4 flex flex-col gap-2">
                {q.options.map((opt) => {
                  const selected = answers[i] === opt;
                  return (
                    <label
                      key={opt}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition',
                        selected
                          ? 'border-primary bg-primary-soft text-primary'
                          : 'border-line hover:border-primary/50',
                      )}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        className="accent-[var(--primary)]"
                        checked={selected}
                        onChange={() => setAnswer(i, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={answers[i] ?? ''}
                onChange={(e) => setAnswer(i, e.target.value)}
                placeholder="Type your answer…"
                className="mt-4 min-h-24 w-full rounded-xl border border-line bg-bg p-3 text-sm outline-none focus:border-primary"
              />
            )}
          </div>
        ))}
      </div>

      {submitError && (
        <p className="mt-6 text-sm text-bad">Couldn&rsquo;t submit your answers. Please try again.</p>
      )}

      <div className="mt-8 border-t border-line pt-6">
        <Button onClick={submit} disabled={submitting || answeredCount === 0}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Submit {answeredCount < questions.length ? `(${answeredCount}/${questions.length})` : ''}
        </Button>
      </div>
    </div>
  );
}

export default AssessmentView;
