'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { Container } from '@/src/components/marketing/Container';
import {
  buildStaticSearchIndex,
  filterSearchItems,
} from '@/src/components/marketing/navbarSearch';
import { cn } from '@/src/lib/utils';

type NavbarSearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function NavbarSearchOverlay({ open, onClose }: NavbarSearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const staticItems = useMemo(() => buildStaticSearchIndex(), []);
  const results = useMemo(() => filterSearchItems(staticItems, query), [staticItems, query]);
  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  function navigateTo(href: string) {
    onClose();
    router.push(href);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!trimmedQuery) return;

    if (results.length > 0) {
      navigateTo(results[0].href);
      return;
    }

    navigateTo(`/courses?q=${encodeURIComponent(trimmedQuery)}`);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] bg-primary shadow-[var(--shadow-primary)]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <Container className="py-4 sm:py-5">
        <form onSubmit={handleSubmit} className="flex items-stretch gap-3">
          <div className="relative mx-auto flex w-full max-w-[920px] flex-1 items-stretch">
            <span className="grid w-14 shrink-0 place-items-center bg-ink text-white">
              <Search className="size-5" strokeWidth={2} />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, categories, or pages…"
              className="h-14 flex-1 bg-white px-4 text-[15px] text-ink outline-none placeholder:text-ink-2"
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="grid size-12 shrink-0 place-items-center bg-primary-dark/70 text-white transition-colors hover:bg-primary-dark sm:size-14"
          >
            <X className="size-5" strokeWidth={2.5} />
          </button>
        </form>

        {trimmedQuery && results.length > 0 ? (
          <ul className="mx-auto mt-3 w-full max-w-[920px] overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-lg">
            {results.map((item, index) => (
              <li key={item.id} className="border-b border-line/70 last:border-b-0">
                <button
                  type="button"
                  onClick={() => navigateTo(item.href)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-bg-soft',
                    index === 0 && 'bg-primary/[0.03]',
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                    <BookOpen className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {item.label}
                    </span>
                    {item.description ? (
                      <span className="block truncate text-xs text-ink-3">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-ink-3" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </div>
  );
}
