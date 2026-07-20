'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { ApiError } from '@/src/infrastructure/apiClient';
import { useCreateCourse, useCourse } from '@/src/features/courses';
import type { CourseLevel } from '@/src/domain/course';
import { cn } from '@/src/lib/utils';

const CATEGORIES = ['Cybersecurity', 'Networking', 'Programming', 'Data', 'AI', 'Cloud'];
const LEVELS: { value: CourseLevel; title: string; desc: string }[] = [
  { value: 'beginner', title: 'Beginner', desc: 'New to this — start from the basics.' },
  { value: 'intermediate', title: 'Intermediate', desc: 'Know the fundamentals, go deeper.' },
  { value: 'advanced', title: 'Advanced', desc: 'Experienced — challenge me.' },
];

export function CreateCourseWizard() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [level, setLevel] = useState<CourseLevel | null>(null);
  const [visualsPreferred, setVisualsPreferred] = useState(true);
  const [dailyNotification, setDailyNotification] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const create = useCreateCourse();

  function addTopic() {
    const t = topicInput.trim();
    if (t && !topics.includes(t)) setTopics((prev) => [...prev, t]);
    setTopicInput('');
  }

  function submit() {
    if (!level) return;
    create.mutate(
      { category: category.trim(), topics, level, visualsPreferred, dailyNotification },
      { onSuccess: (data) => setCreatedId(data.course.id) },
    );
  }

  if (createdId) {
    return <GeneratingPanel id={createdId} onRetry={() => setCreatedId(null)} />;
  }

  const canNext1 = category.trim().length > 0 && topics.length > 0;
  const errorMsg = create.error instanceof ApiError ? create.error.message : null;

  return (
    <div className="w-full max-w-[560px]">
      <Stepper step={step} />

      <div className="mt-8 rounded-3xl border border-line bg-bg-elev p-7 shadow-card sm:p-9">
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <Heading title="What do you want to learn?" sub="Pick a subject and a few topics." />
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Subject</Label>
              <Input
                id="category"
                placeholder="e.g. Cybersecurity"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <div className="mt-1 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                      category === c
                        ? 'border-primary bg-primary-soft text-primary'
                        : 'border-line-2 text-ink-2 hover:border-primary',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="topics">Topics</Label>
              <Input
                id="topics"
                placeholder="Type a topic and press Enter"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTopic();
                  }
                }}
              />
              {topics.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setTopics((prev) => prev.filter((x) => x !== t))}
                        aria-label={`Remove ${t}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button disabled={!canNext1} onClick={() => setStep(2)}>
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <Heading title="What's your level?" sub="We'll pitch the course to match." />
            <div className="flex flex-col gap-3">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevel(l.value)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-4 text-left transition',
                    level === l.value
                      ? 'border-primary bg-primary-soft'
                      : 'border-line hover:border-primary',
                  )}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{l.title}</div>
                    <div className="text-sm text-ink-2">{l.desc}</div>
                  </div>
                  <span
                    className={cn(
                      'grid size-5 place-items-center rounded-full border',
                      level === l.value ? 'border-primary bg-primary text-primary-ink' : 'border-line-2',
                    )}
                  >
                    {level === l.value && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <Button disabled={!level} onClick={() => setStep(3)}>
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <Heading title="Last touches" sub="Tune your experience, then generate." />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Prefer visual lessons</div>
                <div className="text-sm text-ink-2">Diagrams and visuals where helpful.</div>
              </div>
              <Switch checked={visualsPreferred} onChange={setVisualsPreferred} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">Daily reminder</div>
                <div className="text-sm text-ink-2">A nudge to keep your streak alive.</div>
              </div>
              <Switch checked={dailyNotification} onChange={setDailyNotification} />
            </div>

            <div className="rounded-2xl bg-bg-lav p-4 text-sm">
              <div className="font-semibold">{category || 'Course'}</div>
              <div className="mt-1 text-ink-2">
                {level} · {topics.join(', ')}
              </div>
            </div>

            {errorMsg && (
              <p className="rounded-lg bg-bad-soft px-3.5 py-2.5 text-sm text-bad" role="alert">
                {errorMsg}{' '}
                {create.error instanceof ApiError && create.error.status === 403 && (
                  <Link href="/courses" className="font-semibold underline">
                    View your courses
                  </Link>
                )}
              </p>
            )}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <Button onClick={submit} loading={create.isPending}>
                <Sparkles className="size-4" /> Generate course
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              'grid size-8 flex-none place-items-center rounded-full text-sm font-semibold transition',
              n <= step ? 'bg-primary text-primary-ink' : 'bg-line-2 text-ink-3',
            )}
          >
            {n < step ? <Check className="size-4" strokeWidth={3} /> : n}
          </span>
          {n < 3 && <span className={cn('h-1 flex-1 rounded-full', n < step ? 'bg-primary' : 'bg-line-2')} />}
        </div>
      ))}
    </div>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-ink-2">{sub}</p>
    </div>
  );
}

function GeneratingPanel({ id, onRetry }: { id: string; onRetry: () => void }) {
  const router = useRouter();
  const { data, isError, refetch } = useCourse(id);
  const status = data?.course.status;

  useEffect(() => {
    if (status === 'ready' || status === 'completed') {
      router.push(`/courses/${id}`);
    }
  }, [status, id, router]);

  // Polling request failed (network / expired session) — offer a refetch rather
  // than recreating the course (which would leave a duplicate).
  if (isError && !status) {
    return (
      <div className="w-full max-w-[560px] rounded-3xl border border-line bg-bg-elev p-9 text-center shadow-card">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-warn-soft text-warn">
          <X className="size-7" strokeWidth={2.4} />
        </div>
        <h1 className="text-xl font-bold">Lost connection</h1>
        <p className="mx-auto mt-2 max-w-[40ch] text-sm text-ink-2">
          We couldn&rsquo;t check on your course. It may still be generating.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => refetch()}>Retry</Button>
          <Link
            href="/courses"
            className="inline-flex h-11 items-center rounded-xl border border-line-2 px-5 text-sm font-semibold text-ink hover:bg-bg-lav"
          >
            My courses
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="w-full max-w-[560px] rounded-3xl border border-line bg-bg-elev p-9 text-center shadow-card">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-bad-soft text-bad">
          <X className="size-7" strokeWidth={2.4} />
        </div>
        <h1 className="text-xl font-bold">Generation failed</h1>
        <p className="mx-auto mt-2 max-w-[40ch] text-sm text-ink-2">
          {data?.course.failureReason ?? 'Something went wrong while building your course.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={onRetry}>Try again</Button>
          <Link
            href="/courses"
            className="inline-flex h-11 items-center rounded-xl border border-line-2 px-5 text-sm font-semibold text-ink hover:bg-bg-lav"
          >
            My courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[560px] rounded-3xl border border-line bg-bg-elev p-9 text-center shadow-card">
      <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Loader2 className="size-8 animate-spin" />
      </div>
      <h1 className="text-xl font-bold">Building your course…</h1>
      <p className="mx-auto mt-2 max-w-[42ch] text-sm text-ink-2">
        Our AI is drafting your modules, lessons, quizzes and exams. This usually takes about 10–15
        seconds.
      </p>
      <div className="mx-auto mt-6 flex max-w-xs flex-col gap-2 text-left text-sm text-ink-2">
        {['Structuring modules', 'Writing lessons', 'Preparing quizzes & labs'].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <Loader2 className="size-3.5 animate-spin text-primary" /> {s}
          </div>
        ))}
      </div>
    </div>
  );
}
