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
      {/* Progress bar */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: i < score ? '100%' : '0%',
                backgroundColor: i < score ? '#0D6E63' : 'transparent',
              }}
            />
          </div>
        ))}
      </div>
      {/* Rules */}
      <div className="grid grid-cols-1 gap-1">
        {rules.map((rule, i) => (
          <div key={rule.label} className="flex items-center gap-2 text-xs">
            <span
              className={`flex size-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                passed[i]
                  ? 'bg-[#0D6E63] text-white'
                  : 'border border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              {passed[i] && <Check className="size-2.5" strokeWidth={3} />}
            </span>
            <span className={passed[i] ? 'text-[#0D6E63]' : 'text-gray-400'}>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
