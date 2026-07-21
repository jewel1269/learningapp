'use client';

import Link from 'next/link';
import { Award, CheckCircle2, Sparkles, Target, XCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Container } from '@/src/components/marketing/Container';
import type {
  AssessmentQuestion,
  SkillAssessmentSubmission,
  SkillLevel,
} from '@/src/domain/assessment';

const LEVEL_COPY: Record<
  SkillLevel,
  { description: string; badge: string; accent: string; ring: string }
> = {
  Beginner: {
    description: 'Great start — we recommend foundational courses to build your base.',
    badge: 'Foundation track',
    accent: 'text-[#2563EB]',
    ring: 'from-[#DBEAFE] to-white border-[#BFDBFE]',
  },
  Intermediate: {
    description: 'Solid foundation — you are ready for structured, hands-on learning paths.',
    badge: 'Growth track',
    accent: 'text-primary',
    ring: 'from-primary-soft to-white border-primary/20',
  },
  Advanced: {
    description: 'Strong grasp of the topic — challenge yourself with advanced labs and projects.',
    badge: 'Advanced track',
    accent: 'text-secondary',
    ring: 'from-[#FFEDD5] to-white border-secondary/25',
  },
  Expert: {
    description: 'Outstanding — explore expert tracks and mentor-led live sessions.',
    badge: 'Expert track',
    accent: 'text-good',
    ring: 'from-good-soft to-white border-good/25',
  },
};

export function SkillAssessmentResultView({
  topicLabel,
  questions,
  submission,
  answers,
}: {
  topicLabel: string;
  questions: AssessmentQuestion[];
  submission: SkillAssessmentSubmission;
  answers: Record<number, string>;
}) {
  const levelInfo = LEVEL_COPY[submission.level];
  const results = [...submission.results].sort((a, b) => a.questionIndex - b.questionIndex);
  const correctCount = results.filter((r) => r.correct).length;

  return (
    <div className="pb-16 pt-8 lg:pt-12">
      <Container className="max-w-[1240px]">
        <div
          className={`overflow-hidden rounded-3xl border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] ${levelInfo.ring}`}
        >
          <div className={`border-b bg-gradient-to-br px-6 py-10 text-center sm:px-10 ${levelInfo.ring}`}>
            <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <Award className={`size-8 ${levelInfo.accent}`} />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">
              Your skill level
            </p>
            <h1 className={`mt-2 text-4xl font-bold sm:text-5xl ${levelInfo.accent}`}>
              {submission.level}
            </h1>
            <p className="mt-4 text-6xl font-bold tracking-tight text-ink">{submission.score}%</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="rounded-full border border-line bg-white px-3 py-1 font-medium text-ink-2">
                {correctCount} of {results.length} correct
              </span>
              <span className="rounded-full border border-line bg-white px-3 py-1 font-medium text-ink-2">
                {topicLabel}
              </span>
              <span className={`rounded-full border px-3 py-1 font-semibold ${levelInfo.ring} ${levelInfo.accent}`}>
                {levelInfo.badge}
              </span>
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-base text-ink-2">{levelInfo.description}</p>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                <Target className="size-4" />
                Answer review
              </div>
              <h2 className="mt-2 text-2xl font-bold text-ink">See what you got right</h2>
            </div>
            <p className="hidden text-sm text-ink-3 sm:block">
              Private results — only visible to your account
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {results.map((r) => {
              const q = questions[r.questionIndex];
              const given = (answers[r.questionIndex] ?? '').trim();
              return (
                <div
                  key={r.questionIndex}
                  className="rounded-3xl border border-line/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
                        r.correct ? 'bg-good-soft text-good' : 'bg-bad/10 text-bad'
                      }`}
                    >
                      {r.correct ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <XCircle className="size-5" />
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
                        Question {r.questionIndex + 1}
                      </p>
                      <p className="mt-2 text-base font-semibold leading-7 text-ink">
                        {q?.question ?? 'Question'}
                      </p>
                      <div className="mt-4 space-y-2 rounded-2xl bg-[#FCFCFC] p-4">
                        <p className="text-sm text-ink-2">
                          <span className="font-medium text-ink-3">Your answer:</span> {given || '—'}
                        </p>
                        {!r.correct && (
                          <p className="text-sm text-good">
                            <span className="font-medium text-ink-3">Correct answer:</span>{' '}
                            {r.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 rounded-3xl border border-line/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <Link href="/#categories">
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              <Sparkles className="size-4" />
              Browse courses
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="soft">
              Create free account
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default SkillAssessmentResultView;
