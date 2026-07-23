'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Container } from './Container';
import { PRICING_FAQ } from '@/src/constants/pricing';
import { cn } from '@/src/lib/utils';

export function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-[640px] text-center">
          <span className="inline-flex rounded-full bg-primary-soft px-3.5 py-1.5 text-[12.5px] font-semibold text-primary">
            FAQ
          </span>
          <h2 className="mt-4 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-ink">
            Pricing questions
          </h2>
        </div>

        <div className="mx-auto flex max-w-[760px] flex-col gap-3">
          {PRICING_FAQ.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q} className="overflow-hidden rounded-2xl border border-line bg-bg-elev">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-5 py-[18px] text-left text-[15px] font-semibold text-ink"
                >
                  {item.q}
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                    <Plus className={cn('size-4 transition-transform', isOpen && 'rotate-45')} />
                  </span>
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-[18px] text-sm text-ink-2">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
