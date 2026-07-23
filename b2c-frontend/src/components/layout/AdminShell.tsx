'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BarChart3, DollarSign, Shield } from 'lucide-react';
import { useTranslation } from '@/src/i18n';
import { cn } from '@/src/lib/utils';

const links = [
  { href: '/admin/metrics', icon: BarChart3, labelKey: 'nav.adminMetrics' as const },
  { href: '/admin/costs', icon: DollarSign, labelKey: 'nav.adminCosts' as const },
  { href: '/admin/content', icon: Shield, labelKey: 'nav.adminContent' as const },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              {t('common.backToApp')}
            </Link>
            <h1 className="mt-2 text-xl font-bold text-ink">{t('nav.admin')}</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/[0.08] text-primary'
                      : 'text-ink-2 hover:bg-[#F8F9FB] hover:text-ink',
                  )}
                >
                  <link.icon className="size-4" />
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
