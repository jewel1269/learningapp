'use client';

import { motion } from 'framer-motion';
import { Key, Mail, Shield } from 'lucide-react';

export function AuthIllustration() {
  return (
    <div className="relative flex h-full min-h-[600px] items-center justify-center overflow-hidden rounded-r-2xl bg-[#0D6E63]">
      {/* Subtle background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[18%] size-36 rotate-45 rounded-xl border border-white/10 bg-white/5" />
        <div className="absolute bottom-[22%] right-[14%] size-28 -rotate-12 rounded-xl border border-white/10 bg-white/5" />
        <div className="absolute left-[55%] top-[8%] size-20 rotate-12 rounded-lg border border-white/10 bg-white/5" />
        <div className="absolute left-[8%] top-[60%] size-16 -rotate-6 rounded-lg border border-white/8 bg-white/5" />
        <div className="absolute right-[20%] top-[40%] size-24 rotate-45 rounded-xl border border-white/8 bg-white/5" />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-5 p-6">
        {/* Analytics widget */}
        <div className="w-full rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-white/15">
                <Mail className="size-4 text-white/90" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/60">Inbox</p>
                <p className="text-xl font-bold text-white">176,18</p>
              </div>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#F7B928] text-xs font-bold text-[#111827]">
              45
            </div>
          </div>
          <svg viewBox="0 0 300 50" className="w-full" aria-hidden>
            <defs>
              <linearGradient id="authChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,40 C40,35 80,30 120,22 C160,14 200,18 240,12 C260,9 280,6 300,4"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <path
              d="M0,40 C40,35 80,30 120,22 C160,14 200,18 240,12 C260,9 280,6 300,4 L300,50 L0,50 Z"
              fill="url(#authChartFill)"
            />
          </svg>
        </div>

        {/* Social icons row */}
        <div className="flex gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="size-5 text-white/80" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>
          <div className="flex size-12 items-center justify-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="size-5 text-white/80" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </div>
        </div>

        {/* Security card */}
        <div className="w-full rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#F7B928]/20">
              <Key className="size-4 text-[#F7B928]" />
            </div>
            <p className="text-sm font-bold text-white">Your data, your rules</p>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-white/50">
            Your data belongs to you, and our encryption ensures maximum security.
          </p>
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-white/10" />
            <div className="h-2 w-4/5 rounded-full bg-white/10" />
            <div className="h-2 w-3/5 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Shield badge */}
        <div className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
          <Shield className="size-4 text-[#F7B928]" />
          <span className="text-xs font-medium text-white/80">256-bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}
