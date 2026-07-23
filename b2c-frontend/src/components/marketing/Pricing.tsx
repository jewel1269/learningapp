'use client';

import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { buttonClasses } from '@/src/components/ui/button';
import {
  PREMIUM_ONLY_FEATURES,
  PREMIUM_PLAN_FEATURES,
  PREMIUM_PRICE_USD,
  TRIAL_PERIOD_MONTHS,
  TRIAL_PLAN_FEATURES,
} from '@/src/constants/pricing';
import { useAuthHydrated } from '@/src/features/auth/useAuthHydrated';
import { useAuthStore } from '@/src/store/authStore';
import { Container } from './Container';
import { cn } from '@/src/lib/utils';

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[20px_1fr] gap-2.5 text-sm text-ink-2">
      <Check className="mt-0.5 size-4 shrink-0 text-good" strokeWidth={2.6} />
      {children}
    </li>
  );
}

export function Pricing({ fullPage = false }: { fullPage?: boolean }) {
  const hydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const trialHref = hydrated && isAuthenticated ? '/dashboard' : '/signup';
  const premiumHref = hydrated && isAuthenticated ? '/upgrade' : '/signup';

  return (
    <section id="pricing" className={cn(fullPage ? 'pb-8 pt-28 sm:pt-32' : 'py-20')}>
      <Container>
        {fullPage ? (
          <div className="mx-auto mb-10 max-w-[720px] text-center">
            <span className="inline-flex rounded-full bg-primary-soft px-3.5 py-1.5 text-[12.5px] font-semibold text-primary">
              Pricing
            </span>
            <h1 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-tight text-ink">
              3 months free, then choose Premium
            </h1>
            <p className="mt-4 text-sm text-ink-2 sm:text-base">
              Start with {TRIAL_PERIOD_MONTHS} months on us. After that, subscribe to keep learning.
              Some power features always require Premium.
            </p>
          </div>
        ) : (
          <div className="mx-auto mb-11 flex max-w-[640px] flex-col items-center gap-3.5 text-center">
            <span className="inline-flex rounded-full bg-primary-soft px-3.5 py-1.5 text-[12.5px] font-semibold text-primary">
              Pricing
            </span>
            <h2 className="text-[clamp(1.75rem,4vw,2.6rem)] font-bold tracking-tight">
              3 months free, then Premium.
            </h2>
          </div>
        )}

        <div className="rounded-[26px] bg-bg-lav p-6 sm:p-11">
          <div className="mx-auto grid max-w-[880px] gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-bg p-8">
              <div className="text-sm font-semibold text-ink-2">Free trial</div>
              <div className="text-4xl font-extrabold tracking-tight text-ink">
                $0
                <span className="text-sm font-medium text-ink-3">
                  {' '}
                  / {TRIAL_PERIOD_MONTHS} months
                </span>
              </div>
              <p className="text-sm text-ink-2">
                Full platform access with standard limits. No credit card required.
              </p>
              <ul className="flex flex-col gap-2.5">
                {TRIAL_PLAN_FEATURES.map((feature) => (
                  <Feature key={feature}>{feature}</Feature>
                ))}
              </ul>
              <Link
                href={trialHref}
                className={buttonClasses({ variant: 'soft', className: 'mt-auto w-full' })}
              >
                {hydrated && isAuthenticated ? 'Go to dashboard' : 'Start free trial'}
              </Link>
            </div>

            <div className="relative flex flex-col gap-4 rounded-[20px] border-2 border-primary bg-bg p-8 shadow-card">
              <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-ink">
                After trial + premium extras
              </span>
              <div className="text-sm font-semibold text-ink-2">Premium</div>
              <div className="text-4xl font-extrabold tracking-tight text-ink">
                ${PREMIUM_PRICE_USD}
                <span className="text-sm font-medium text-ink-3"> / month</span>
              </div>
              <p className="text-sm text-ink-2">
                Required after your trial ends. Unlocks higher limits and premium-only features.
              </p>
              <ul className="flex flex-col gap-2.5">
                {PREMIUM_PLAN_FEATURES.map((feature) => (
                  <Feature key={feature}>{feature}</Feature>
                ))}
              </ul>
              <div className="rounded-xl border border-secondary/20 bg-secondary-soft px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                  Premium-only (pay anytime)
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
                  {PREMIUM_ONLY_FEATURES.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </div>
              <Link href={premiumHref} className={buttonClasses({ className: 'mt-auto w-full' })}>
                <Sparkles className="size-4" />
                {hydrated && isAuthenticated ? 'Upgrade now' : 'Sign up & upgrade'}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
