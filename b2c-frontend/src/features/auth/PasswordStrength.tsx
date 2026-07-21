'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const rules: Rule[] = [
  { label: 'Minimum 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'At least one number', test: (pw) => /\d/.test(pw) },
  { label: 'Uppercase & lowercase letters', test: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { label: 'One special character', test: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw) },
];

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const passed = rules.map((r) => r.test(password));
  const score = passed.filter(Boolean).length;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                i < score ? 'w-full bg-primary' : 'w-0 bg-transparent'
              }`}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-1">
        {rules.map((rule, i) => (
          <div key={rule.label} className="flex items-center gap-2 text-xs">
            <span
              className={`flex size-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                passed[i]
                  ? 'bg-primary text-white'
                  : 'border border-line bg-bg-soft text-ink-3'
              }`}
            >
              {passed[i] && <Check className="size-2.5" strokeWidth={3} />}
            </span>
            <span className={passed[i] ? 'text-primary' : 'text-ink-3'}>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
