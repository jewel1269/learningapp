'use client';

import { useEffect, useState } from 'react';
import { Loader2, Network } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  getNetworkScenario,
  listNetworkScenarios,
  submitNetworkScenario,
  type NetworkScenario,
  type ScenarioSubmitResult,
} from '../labsApi';

export interface ScenarioLabSubmission {
  scenarioId: string;
  answers: Record<string, string>;
  localResult?: ScenarioSubmitResult | null;
}

function scenarioIdFromStarter(starterState: unknown, fallback: string): string {
  if (starterState && typeof starterState === 'object') {
    const s = starterState as Record<string, unknown>;
    if (typeof s.scenarioId === 'string') return s.scenarioId;
  }
  return fallback;
}

export function NetworkSimulatorLab({
  starterState,
  value,
  onChange,
  readOnly = false,
}: {
  starterState: unknown;
  value: ScenarioLabSubmission | null;
  onChange: (data: ScenarioLabSubmission) => void;
  readOnly?: boolean;
}) {
  const [scenario, setScenario] = useState<NetworkScenario | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>(value?.answers ?? {});
  const [localResult, setLocalResult] = useState<ScenarioSubmitResult | null>(
    value?.localResult ?? null,
  );
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const scenarios = await listNetworkScenarios();
        const id = scenarioIdFromStarter(starterState, scenarios[0]?.id ?? 'port-scan');
        const data = await getNetworkScenario(id);
        if (!cancelled) setScenario(data);
      } catch {
        if (!cancelled) setError('Could not load network scenario.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
  }, [starterState]);

  useEffect(() => {
    if (scenario) onChange({ scenarioId: scenario.id, answers, localResult });
  }, [scenario, answers, localResult, onChange]);

  async function checkAnswers() {
    if (!scenario || readOnly) return;
    setChecking(true);
    setError(null);
    try {
      const payload = scenario.questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? '',
      }));
      const result = await submitNetworkScenario(scenario.id, payload);
      setLocalResult(result);
    } catch {
      setError('Could not check answers. Premium subscription may be required.');
    } finally {
      setChecking(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-bg-soft p-8 text-sm text-ink-2">
        <Loader2 className="size-4 animate-spin" /> Loading network scenario…
      </div>
    );
  }

  if (error && !scenario) {
    return <p className="text-sm text-bad">{error}</p>;
  }

  if (!scenario) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-line bg-bg-soft p-5">
        <div className="flex items-center gap-2 font-semibold text-ink">
          <Network className="size-5 text-primary" />
          {scenario.title}
        </div>
        <p className="mt-2 text-sm text-ink-2">{scenario.description}</p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">Flow summary</p>
        <pre className="mt-3 max-h-56 overflow-auto rounded-xl bg-[#0F172A] p-3 font-mono text-xs leading-6 text-[#E2E8F0]">
          {scenario.pcapSummary.join('\n')}
        </pre>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-ink">Analysis questions</p>
        <div className="mt-4 space-y-4">
          {scenario.questions.map((q) => (
            <div key={q.id}>
              <label className="text-sm font-medium text-ink" htmlFor={`net-${q.id}`}>
                {q.prompt}
              </label>
              {q.hint && <p className="mt-1 text-xs text-ink-3">{q.hint}</p>}
              <input
                id={`net-${q.id}`}
                value={answers[q.id] ?? ''}
                readOnly={readOnly}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                className="mt-2 h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>

        {!readOnly && (
          <Button className="mt-5" variant="soft" onClick={() => void checkAnswers()} disabled={checking}>
            {checking ? <Loader2 className="size-4 animate-spin" /> : 'Check locally'}
          </Button>
        )}

        {localResult && (
          <p className="mt-4 text-sm text-ink-2">
            Local score: <span className="font-semibold text-ink">{localResult.score}%</span> (
            {localResult.correct}/{localResult.total} correct)
          </p>
        )}
        {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      </div>
    </div>
  );
}

export default NetworkSimulatorLab;
