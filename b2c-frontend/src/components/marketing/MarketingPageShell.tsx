import type { ReactNode } from 'react';

export function MarketingPageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-bg font-sans text-ink">{children}</div>;
}
