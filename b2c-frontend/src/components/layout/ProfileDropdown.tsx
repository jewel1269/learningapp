'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  CreditCard,
  Bell,
  Palette,
  Globe,
  LifeBuoy,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';
import { useLogout } from '@/src/features/auth';
import { Avatar } from '@/src/components/ui/avatar';

interface ProfileMenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}

export function ProfileDropdown() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const menuItems: ProfileMenuItem[] = [
    { label: 'My Profile', icon: User, href: '/profile' },
    { label: 'Account Settings', icon: Settings, href: '/settings' },
    { label: 'Billing', icon: CreditCard, href: '/billing' },
    { label: 'Notifications', icon: Bell, href: '/notifications' },
    { label: 'Appearance', icon: Palette, href: '/settings' },
    { label: 'Language', icon: Globe, href: '/settings' },
    { label: 'Help Center', icon: LifeBuoy, href: '/support' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-bg-soft"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar name={user?.email} className="size-9" />
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-ink sm:block">
          {user?.email?.split('@')[0]?.split(/[._-]/)[0] ?? 'User'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-[240px] overflow-hidden rounded-2xl border border-[#F1F5F9] bg-white shadow-[0_20px_40px_-12px_rgba(15,23,42,0.12)]"
          >
            {/* User info header */}
            <div className="border-b border-[#F1F5F9] px-4 py-3.5">
              <p className="text-sm font-semibold text-ink">
                {user?.email?.split('@')[0] ?? 'Admin'}
              </p>
              <p className="mt-0.5 text-xs text-ink-3">{user?.email ?? 'admin@bina.com'}</p>
            </div>

            {/* Menu items */}
            <div className="p-1.5">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href ?? '#'}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2 transition-all duration-150 hover:bg-[#F8F9FB] hover:text-ink"
                >
                  <item.icon className="size-4 shrink-0 text-ink-3 group-hover:text-ink-2" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="size-3.5 shrink-0 text-ink-3/50 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}

              <div className="my-1.5 h-px bg-[#F1F5F9]" />

              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#EF4444] transition-all duration-150 hover:bg-[#FEF2F2]"
              >
                <LogOut className="size-4 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
