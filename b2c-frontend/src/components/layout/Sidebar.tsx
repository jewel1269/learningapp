'use client';

import { useState, createContext, useContext, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Users,
  GraduationCap,
  ClipboardList,
  Video,
  Award,
  Star,
  MessageSquare,
  Bell,
  BarChart3,
  DollarSign,
  Tag,
  FileText,
  PenTool,
  LifeBuoy,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLogout } from '@/src/features/auth';

interface SidebarContextType {
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggle: () => {},
  mobileOpen: false,
  openMobile: () => {},
  closeMobile: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'MENU',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Courses', href: '/courses', icon: BookOpen, badge: 24 },
      { label: 'Categories', href: '/categories', icon: FolderOpen },
      { label: 'Students', href: '/students', icon: Users, badge: 1240 },
      { label: 'Instructors', href: '/instructors', icon: GraduationCap },
      { label: 'Enrollments', href: '/enrollments', icon: ClipboardList },
      { label: 'Live Classes', href: '/live-classes', icon: Video },
      { label: 'Certificates', href: '/certificates', icon: Award },
      { label: 'Reviews', href: '/reviews', icon: Star, badge: 42 },
    ],
  },
  {
    title: 'APPS',
    items: [
      { label: 'Messages', href: '/messages', icon: MessageSquare, badge: 5 },
      { label: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Revenue', href: '/revenue', icon: DollarSign },
      { label: 'Coupons', href: '/coupons', icon: Tag },
    ],
  },
  {
    title: 'PAGES',
    items: [
      { label: 'CMS', href: '/cms', icon: FileText },
      { label: 'Blog', href: '/blog', icon: PenTool },
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Support', href: '/support', icon: LifeBuoy },
    ],
  },
];

function SidebarNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex h-12 items-center gap-4 rounded-xl px-6 text-[15px] font-medium transition-all duration-200',
        active
          ? 'bg-primary/[0.08] text-primary'
          : 'text-ink-2 hover:bg-[#F8F9FB] hover:text-ink',
      )}
    >
      {/* Active left indicator */}
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary"
          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        />
      )}

      {/* Icon */}
      <item.icon
        className={cn(
          'size-5 shrink-0 transition-colors duration-200',
          active ? 'text-primary' : 'text-ink-3 group-hover:text-ink-2',
        )}
      />

      {/* Label */}
      <span className="flex-1 truncate">{item.label}</span>

      {/* Badge or Chevron */}
      {item.badge !== undefined ? (
        <span
          className={cn(
            'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
            active
              ? 'bg-primary text-white'
              : 'bg-[#F1F3F5] text-ink-3',
          )}
        >
          {item.badge > 999
            ? `${(item.badge / 1000).toFixed(1)}k`
            : item.badge > 99
              ? '99+'
              : item.badge}
        </span>
      ) : (
        <ChevronRight
          className={cn(
            'size-4 shrink-0 transition-all duration-200',
            active
              ? 'text-primary/50'
              : 'text-ink-3/50 group-hover:text-ink-3',
            hovered && !active ? 'translate-x-0.5' : '',
          )}
        />
      )}
    </Link>
  );
}

function SidebarGroupSection({ group }: { group: NavGroup }) {
  const pathname = usePathname();

  return (
    <div className="px-4">
      {/* Section label */}
      <div className="flex items-center px-3 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3/70">
          {group.title}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-0.5">
        {group.items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <SidebarNavItem key={item.href} item={item} active={active} />;
        })}
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = useLogout();

  const toggle = useCallback(() => setCollapsed((p) => !p), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1BAA6E] text-base font-bold text-white shadow-sm">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-ink">
            Bina
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col gap-1">
          {navGroups.map((group, i) => (
            <div key={group.title}>
              <SidebarGroupSection group={group} />
              {i < navGroups.length - 1 && (
                <div className="mx-6 my-2 h-px bg-line" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom logout */}
      <div className="border-t border-line px-4 py-3">
        <button
          onClick={logout}
          className="flex h-12 w-full items-center gap-4 rounded-xl px-6 text-[15px] font-medium text-ink-2 transition-all duration-200 hover:bg-[#FEF2F2] hover:text-[#EF4444]"
        >
          <LogOut className="size-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, mobileOpen, openMobile, closeMobile }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#F1F5F9] bg-white lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'sidebar-transition fixed inset-y-0 left-0 z-30 hidden w-[270px] flex-col border-r border-[#F1F5F9] bg-white lg:flex',
          collapsed && '-translate-x-full lg:hidden',
        )}
      >
        {sidebarContent}
      </aside>
    </SidebarContext.Provider>
  );
}
