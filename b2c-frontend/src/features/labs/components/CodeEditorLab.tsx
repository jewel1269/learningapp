'use client';

import { useEffect, useState } from 'react';
import { Loader2, Play } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { executeCode, type CodeLanguage, type SandboxResult } from '../labsApi';

export interface CodeEditorSubmission {
  language: CodeLanguage;
  code: string;
  lastRun?: SandboxResult | null;
}

function parseStarter(starterState: unknown): { language: CodeLanguage; code: string } {
  if (starterState && typeof starterState === 'object') {
    const s = starterState as Record<string, unknown>;
    const langRaw = typeof s.language === 'string' ? s.language.toLowerCase() : 'javascript';
    const language =
      langRaw === 'python' || langRaw === 'shell' || langRaw === 'javascript'
        ? langRaw
        : 'javascript';
    const code = typeof s.code === 'string' ? s.code : '';
    return { language, code };
  }
  if (typeof starterState === 'string') {
    return { language: 'javascript', code: starterState };
  }
  return { language: 'javascript', code: '// Write your solution here\n' };
}

export function CodeEditorLab({
  starterState,
  value,
  onChange,
  readOnly = false,
}: {
  starterState: unknown;
  value: CodeEditorSubmission | null;
  onChange: (data: CodeEditorSubmission) => void;
  readOnly?: boolean;
}) {
  const initial = parseStarter(starterState);
  const [language, setLanguage] = useState<CodeLanguage>(value?.language ?? initial.language);
  const [code, setCode] = useState(value?.code ?? initial.code);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<SandboxResult | null>(value?.lastRun ?? null);

  useEffect(() => {
    onChange({ language, code, lastRun });
  }, [language, code, lastRun, onChange]);

  async function runCode() {
    setRunning(true);
    setRunError(null);
    try {
      const result = await executeCode({ language, code });
      setLastRun(result);
    } catch {
      setRunError('Could not run code. Check your sandbox limits or try again.');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-ink" htmlFor="lab-language">
          Language
        </label>
        <select
          id="lab-language"
          value={language}
          disabled={readOnly}
          onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
          className="h-10 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-primary"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="shell">Shell</option>
        </select>
        {!readOnly && (
          <Button variant="soft" size="sm" onClick={runCode} disabled={running}>
            {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            Run code
          </Button>
        )}
      </div>

      <textarea
        value={code}
        readOnly={readOnly}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="min-h-[240px] w-full rounded-2xl border border-line bg-[#0F172A] p-4 font-mono text-sm leading-6 text-[#E2E8F0] outline-none focus:ring-2 focus:ring-primary/30"
      />

      {runError && <p className="text-sm text-bad">{runError}</p>}

      {lastRun && (
        <div className="rounded-2xl border border-line bg-[#FCFCFC] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">Output</p>
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-sm text-ink">
            {lastRun.stdout || lastRun.stderr || '(no output)'}
          </pre>
          <p className="mt-2 text-xs text-ink-3">
            Exit {lastRun.exitCode ?? '—'}
            {lastRun.timedOut ? ' · timed out' : ''}
            {lastRun.oom ? ' · out of memory' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

export default CodeEditorLab;
