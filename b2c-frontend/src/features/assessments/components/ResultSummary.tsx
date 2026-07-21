'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import type { AssessmentQuestion, AssessmentSubmission } from '@/src/domain/assessment';

function scoreTone(score: number): { text: string; ring: string; label: string } {
  if (score >= 70) return { text: 'text-good', ring: 'border-good/40 bg-good-soft', label: 'Passed' };
  if (score >= 40)
    return { text: 'text-warn', ring: 'border-warn/40 bg-warn-soft', label: 'Almost there' };
  return { text: 'text-bad', ring: 'border-bad/40 bg-bad-soft', label: 'Keep practicing' };
}

export function ResultSummary({
  questions,
  submission,
  answers,
  backHref,
  backLabel,
  onRetake,
  retaking,
}: {
  questions: AssessmentQuestion[];
  submission: AssessmentSubmission;
  answers: Record<number, string>;
  backHref: string;
  backLabel: string;
  onRetake?: () => void;
  retaking?: boolean;
}) {
  const tone = scoreTone(submission.score);
  const results = [...submission.results].sort((a, b) => a.questionIndex - b.questionIndex);
  const correctCount = results.filter((r) => r.correct).length;

  return (
    <div>
      <div className={`rounded-2xl border p-6 text-center ${tone.ring}`}>
        <div className={`text-5xl font-bold tracking-tight ${tone.text}`}>{submission.score}%</div>
        <div className={`mt-1 text-sm font-semibold ${tone.text}`}>{tone.label}</div>
        <p className="mt-1 text-sm text-ink-2">
          {correctCount} of {results.length} correct
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {results.map((r) => {
          const q = questions[r.questionIndex];
          const given = (answers[r.questionIndex] ?? '').trim();
          return (
            <div
              key={r.questionIndex}
              className="rounded-2xl border border-line bg-bg-elev p-5 shadow-soft"
            >
              <div className="flex items-start gap-3">
                {r.correct ? (
                  <CheckCircle2 className="mt-0.5 size-5 flex-none text-good" />
                ) : (
                  <XCircle className="mt-0.5 size-5 flex-none text-bad" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-ink">
                    {r.questionIndex + 1}. {q?.question ?? 'Question'}
                  </p>
                  <p className="mt-2 text-sm text-ink-2">
                    <span className="text-ink-3">Your answer:</span> {given || '—'}
                  </p>
                  {!r.correct && (
                    <p className="mt-1 text-sm text-good">
                      <span className="text-ink-3">Correct answer:</span> {r.correctAnswer}
                    </p>
                  )}
                  {r.feedback && <p className="mt-2 text-sm italic text-ink-3">{r.feedback}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <Link href={backHref}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" /> {backLabel}
          </Button>
        </Link>
        {onRetake && (
          <Button variant="soft" onClick={onRetake} disabled={retaking}>
            {retaking ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Try another
          </Button>
        )}
      </div>
    </div>
  );
}

export default ResultSummary;
