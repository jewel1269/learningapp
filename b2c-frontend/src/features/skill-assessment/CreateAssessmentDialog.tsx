'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { ApiError } from '@/src/infrastructure/apiClient';
import type { SkillAssessmentQuota } from '@/src/domain/assessment';
import {
  SKILL_TOPICS,
  type SkillTopic,
} from '@/src/features/skill-assessment/skillAssessmentApi';
import { useGenerateSkillAssessment } from '@/src/features/skill-assessment/useSkillAssessment';

export function CreateAssessmentDialog({
  open,
  onClose,
  quota,
}: {
  open: boolean;
  onClose: () => void;
  quota?: SkillAssessmentQuota;
}) {
  const router = useRouter();
  const generate = useGenerateSkillAssessment();
  const [topic, setTopic] = useState<SkillTopic>('Programming');
  const [customTopic, setCustomTopic] = useState('');
  const [error, setError] = useState<string | null>(null);

  const atLimit = quota?.remaining === 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setError(null);
      setTopic('Programming');
      setCustomTopic('');
    }
  }, [open]);

  if (!open) return null;

  function onCreate() {
    setError(null);
    if (atLimit) {
      setError('Free plan limit reached. You can create up to 3 assessments.');
      return;
    }
    if (topic === 'Other' && !customTopic.trim()) {
      setError('Please describe what you want to learn.');
      return;
    }
    generate.mutate(
      { topic, customTopic: topic === 'Other' ? customTopic.trim() : undefined },
      {
        onSuccess: (assessment) => {
          onClose();
          router.push(`/assessment/${assessment.id}`);
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 429) {
            setError(err.message);
            return;
          }
          setError('Could not create your assessment. Please try again.');
        },
      },
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-assessment-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg text-ink-3 transition hover:bg-bg-soft hover:text-ink"
        >
          <X className="size-5" />
        </button>

        <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          Skill assessment
        </div>

        <h2 id="create-assessment-title" className="mt-4 text-2xl font-bold text-ink">
          What do you want to learn?
        </h2>
        <p className="mt-2 text-sm text-ink-2">
          Take a quick 10-question assessment and discover your skill level — beginner to expert.
        </p>

        {quota && quota.limit !== null && (
          <p className="mt-3 rounded-xl border border-line/80 bg-[#FCFCFC] px-3 py-2 text-sm text-ink-2">
            Free plan: <span className="font-semibold text-ink">{quota.used}</span> of{' '}
            <span className="font-semibold text-ink">{quota.limit}</span> assessments used
            {quota.remaining !== null && quota.remaining > 0
              ? ` · ${quota.remaining} remaining`
              : ' · limit reached'}
          </p>
        )}

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-ink">Choose a topic</p>
          <div className="flex flex-wrap gap-2">
            {SKILL_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition',
                  topic === t
                    ? 'border-primary bg-primary text-white'
                    : 'border-line bg-bg-soft text-ink-2 hover:border-primary/40',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {topic === 'Other' && (
          <div className="mt-4">
            <label htmlFor="custom-topic" className="mb-2 block text-sm font-medium text-ink">
              Tell us your topic
            </label>
            <input
              id="custom-topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Cloud computing, UI design…"
              className="h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        )}

        {error && <p className="mt-4 text-sm text-bad">{error}</p>}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={generate.isPending}>
            Cancel
          </Button>
          <Button onClick={onCreate} disabled={generate.isPending || atLimit}>
            {generate.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Create assessment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateAssessmentDialog;
