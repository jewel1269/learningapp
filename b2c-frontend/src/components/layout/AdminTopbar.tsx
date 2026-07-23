'use client';

import { useState } from 'react';
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '@/src/providers';
import { useTranslation } from '@/src/i18n';
import { useSidebar } from './Sidebar';
import { LanguageSelector } from './LanguageSelector';
import { ProfileDropdown } from './ProfileDropdown';
import { cn } from '@/src/lib/utils';

export function AdminTopbar() {
  const { t } = useTranslation();
  const { openMobile, toggle: toggleSidebar } = useSidebar();
  const { theme, toggle } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-line bg-bg-elev">
      <div className="flex w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={openMobile}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-ink-2 transition hover:bg-bg-soft lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>

          <button
            onClick={toggleSidebar}
            className="hidden size-10 shrink-0 items-center justify-center rounded-xl text-ink-2 transition hover:bg-bg-soft lg:flex"
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </button>

          <div className="relative hidden min-w-0 flex-1 md:block md:max-w-xl">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                'h-11 w-full rounded-xl border bg-bg-soft pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-3',
                searchFocused
                  ? 'border-primary/30 bg-bg-elev ring-2 ring-primary/10'
                  : 'border-line hover:border-line-2',
              )}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            className="flex size-10 items-center justify-center rounded-xl text-ink-2 transition hover:bg-bg-soft md:hidden"
            aria-label="Search"
          >
            <Search className="size-5" />
          </button>

          <button
            onClick={toggle}
            className="flex size-10 items-center justify-center rounded-xl text-ink-2 transition hover:bg-bg-soft"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>

          <LanguageSelector />

          <button
            className="relative flex size-10 items-center justify-center rounded-xl text-ink-2 transition hover:bg-bg-soft"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-bad" />
          </button>

          <div className="mx-1 hidden h-8 w-px bg-line sm:block" />

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
