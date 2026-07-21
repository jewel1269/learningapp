'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import { useTheme } from '@/src/providers';
import { useSidebar } from './Sidebar';
import { LanguageSelector } from './LanguageSelector';
import { ProfileDropdown } from './ProfileDropdown';
import { cn } from '@/src/lib/utils';

const routeTitleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/courses': 'Courses',
  '/categories': 'Categories',
  '/students': 'Students',
  '/instructors': 'Instructors',
  '/enrollments': 'Enrollments',
  '/live-classes': 'Live Classes',
  '/certificates': 'Certificates',
  '/reviews': 'Reviews',
  '/messages': 'Messages',
  '/notifications': 'Notifications',
  '/analytics': 'Analytics',
  '/revenue': 'Revenue',
  '/coupons': 'Coupons',
  '/cms': 'CMS',
  '/blog': 'Blog',
  '/settings': 'Settings',
  '/support': 'Support',
  '/create-course': 'Create Course',
  '/achievements': 'Achievements',
  '/upgrade': 'Upgrade',
};

function getPageTitle(pathname: string): string {
  // Direct match
  if (routeTitleMap[pathname]) return routeTitleMap[pathname];

  // Dynamic route matching
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'courses' && segments[1]) {
    if (segments[2] === 'structure') return 'Course Structure';
    return 'Course Details';
  }
  if (segments[0] === 'lesson' && segments[1]) {
    if (segments.includes('exercise')) return 'Exercise';
    if (segments.includes('quiz')) return 'Quiz';
    return 'Lesson';
  }
  if (segments[0] === 'exam' && segments[1]) return 'Exam';

  // Fallback: capitalize first segment
  if (segments.length > 0) {
    return segments[segments.length - 1]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return 'Dashboard';
}

export function AdminTopbar() {
  const pathname = usePathname();
  const { openMobile, toggle: toggleSidebar } = useSidebar();
  const { theme, toggle } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center border-b border-[#F1F5F9] bg-white transition-all duration-300">
      {/* No sidebar offset here — the (app) layout wrapper already applies lg:pl-[270px]. */}
      <div className="flex w-full items-center justify-between pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-6 lg:pr-8">
        {/* ─── LEFT: Hamburger + Title + Search ─── */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={openMobile}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-[#F8F9FB] hover:text-ink lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>

          {/* Desktop hamburger — collapses/expands the sidebar rail */}
          <button
            onClick={toggleSidebar}
            className="hidden size-10 shrink-0 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-[#F8F9FB] hover:text-ink lg:flex"
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </button>

          {/* Dynamic page title */}
          <h1
            key={pathname}
            className="animate-fade-in shrink-0 text-[22px] font-semibold leading-none tracking-[-0.025em] text-[#0F172A]"
          >
            {pageTitle}
          </h1>

          {/* Search bar — left, after title */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-3" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={cn(
                  'h-12 rounded-full border bg-[#F8F9FB] pl-12 pr-4 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink-3',
                  searchFocused
                    ? 'w-[340px] border-primary/30 bg-white ring-4 ring-primary/[0.06]'
                    : 'w-[280px] border-transparent hover:border-[#E8EBF0]',
                )}
              />
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Actions ─── */}
        <div className="flex items-center gap-1">
          {/* Mobile search */}
          <button
            className="flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-[#F8F9FB] hover:text-ink md:hidden"
            aria-label="Search"
          >
            <Search className="size-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-[#F8F9FB] hover:text-ink"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </button>

          {/* Messages */}
          <button
            className="relative flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-[#F8F9FB] hover:text-ink"
            aria-label="Messages"
          >
            <MessageSquare className="size-5" />
            <span className="absolute right-2.5 top-2.5 flex size-2 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#06B6D4] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[#06B6D4]" />
            </span>
          </button>

          {/* Notifications */}
          <button
            className="relative flex size-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-[#F8F9FB] hover:text-ink"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 flex min-w-[18px] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Divider */}
          <div className="mx-1 h-8 w-px bg-[#F1F5F9]" />

          {/* Profile Avatar */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
