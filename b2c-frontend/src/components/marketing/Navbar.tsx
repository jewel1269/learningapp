'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, Search, UserRound, X } from 'lucide-react';
import { LanguageSelector } from '@/src/components/layout/LanguageSelector';
import { NAV_LINKS } from './data';
import { Container } from './Container';

function FiStudyLogo() {
  return (
    <Link href="/" className="relative inline-flex shrink-0 flex-col leading-none text-primary" aria-label="FiStudy Home">
      <span className="text-[34px] font-bold tracking-[-0.02em]">
        <span className="text-primary">AI</span>
        <span className="text-ink">Study</span>
      </span>
      <svg
        className="absolute -bottom-1 left-[34px] h-[10px] w-[72px]"
        viewBox="0 0 72 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 8C18 2 34 1 70 6"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}

function NavDivider() {
  return <span className="hidden h-10 w-px bg-line-2 lg:block" aria-hidden="true" />;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;

    searchInputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [searchOpen]);

  const openSearch = () => {
    setMobileOpen(false);
    setSearchOpen(true);
  };

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-[60] bg-primary shadow-[var(--shadow-primary)] transition-transform duration-300 ease-out ${
          searchOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-hidden={!searchOpen}
      >
        <Container className="flex h-20 items-center gap-4">
          <div className="mx-auto flex w-full max-w-[760px] flex-1 items-stretch">
            <span className="grid w-14 shrink-0 place-items-center bg-ink text-white">
              <Search className="size-5" strokeWidth={2} />
            </span>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search Here"
              tabIndex={searchOpen ? 0 : -1}
              className="h-14 flex-1 bg-white px-4 text-[15px] text-ink outline-none placeholder:text-ink-2"
            />
          </div>
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            tabIndex={searchOpen ? 0 : -1}
            className="grid size-12 shrink-0 place-items-center bg-primary-dark/70 text-white transition-colors hover:bg-primary-dark"
          >
            <X className="size-5" strokeWidth={2.5} />
          </button>
        </Container>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary-soft)_55%,white)_0%,#FFFFFF_18%,#FFFFFF_82%,color-mix(in_srgb,var(--primary-soft)_55%,white)_100%)] shadow-[0_4px_24px_rgba(15,23,42,0.04)]">
        <Container className="flex h-[88px] items-center justify-between gap-6">
          <FiStudyLogo />

          <nav
            className="hidden flex-1 items-center justify-center gap-[36px] xl:flex"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[18px] font-medium text-ink transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[18px] font-medium text-ink transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={openSearch}
              className="text-primary transition-colors hover:text-primary-dark"
            >
              <Search className="size-[22px]" strokeWidth={2} />
            </button>

            <NavDivider />

            <LanguageSelector compact />

            <NavDivider />

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="relative grid size-11 place-items-center rounded-full border border-line-2 text-ink transition-opacity hover:opacity-85"
                aria-label="Sign in"
              >
                <UserRound className="size-5" strokeWidth={1.8} />
                <span className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full border border-white bg-primary text-[10px] font-bold text-primary-ink">
                  +
                </span>
              </Link>
              <span className="flex flex-col leading-tight">
                <Link
                  href="/login"
                  className="text-[15px] font-bold text-ink transition-colors hover:text-primary"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-[13px] font-medium text-ink-3 transition-colors hover:text-primary"
                >
                  Register
                </Link>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label="Search"
              onClick={openSearch}
              className="grid size-10 place-items-center text-primary"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-lg border border-line text-ink-2"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>

        {mobileOpen ? (
          <nav className="border-t border-line bg-white px-4 py-4 lg:hidden">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-bg-soft py-3 text-[15px] font-medium text-ink"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-bg-soft py-3 text-[15px] font-medium text-ink"
                >
                  {link.label}
                </a>
              ),
            )}

            <div className="mt-5 space-y-4 border-t border-bg-soft pt-5">
              <LanguageSelector />
              <Link href="/login" className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full border border-line-2">
                  <UserRound className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">Sign in</span>
                  <span className="block text-xs text-ink-3">Register</span>
                </span>
              </Link>
            </div>
          </nav>
        ) : null}
      </header>
    </>
  );
}
