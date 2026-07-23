"use client";

import { useState, createContext, useContext, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  GraduationCap,
  ClipboardList,
  Award,
  Bell,
  Settings,
  LogOut,
  Shield,
  BarChart3,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useLogout, useMe } from "@/src/features/auth";
import { useTranslation } from "@/src/i18n";
import type { MessageKey } from "@/src/i18n";

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

// Owns sidebar state and provides it to the WHOLE app shell (sidebar + topbar +
// main), so the hamburger in the topbar and the content padding stay in sync.
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = useCallback(() => setCollapsed((p) => !p), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, mobileOpen, openMobile, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface NavItem {
  labelKey: MessageKey;
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
    title: "MENU",
    items: [
      { labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
      { labelKey: "nav.courses", href: "/my-courses", icon: BookOpen },
      { labelKey: "nav.quizzes", href: "/quizzes", icon: ClipboardList },
      { labelKey: "nav.exams", href: "/exams", icon: GraduationCap },
      { labelKey: "nav.assessments", href: "/assessments", icon: FolderOpen },
      { labelKey: "nav.achievements", href: "/achievements", icon: Award },
    ],
  },
  {
    title: "APPS",
    items: [
      { labelKey: "nav.notifications", href: "/notifications", icon: Bell, badge: 3 },
    ],
  },
  {
    title: "PAGES",
    items: [
      { labelKey: "nav.settings", href: "/settings", icon: Settings },
    ],
  },
];

const adminGroup: NavGroup = {
  title: "ADMIN",
  items: [
    { labelKey: "nav.adminMetrics", href: "/admin/metrics", icon: BarChart3 },
    { labelKey: "nav.adminContent", href: "/admin/content", icon: Shield },
  ],
};

function SidebarNavItem({
  item,
  active,
  collapsed,
  label,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  label: string;
}) {
  return (
    <Link
      href={item.href}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex h-12 items-center rounded-xl text-[15px] font-medium transition-all duration-200",
        collapsed ? "justify-center px-0" : "gap-4 px-6",
        active
          ? "bg-primary/[0.08] text-primary"
          : "text-ink-2 hover:bg-[#F8F9FB] hover:text-ink",
      )}
    >
      {/* Active left indicator */}
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}

      {/* Icon */}
      <item.icon
        className={cn(
          "size-5 shrink-0 transition-colors duration-200",
          active ? "text-primary" : "text-ink-3 group-hover:text-ink-2",
        )}
      />

      {/* Label */}
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
    </Link>
  );
}

function SidebarGroupSection({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className={collapsed ? "px-2" : "px-4"}>
      {/* Section label */}
      {collapsed ? (
        <div className="py-3" />
      ) : (
        <div className="flex items-center px-3 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3/70">
            {group.title}
          </span>
        </div>
      )}

      {/* Items */}
      <div className="flex flex-col gap-0.5">
        {group.items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <SidebarNavItem
              key={item.href}
              item={item}
              active={active}
              collapsed={collapsed}
              label={t(item.labelKey)}
            />
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar();
  const logout = useLogout();
  const meQ = useMe();
  const { t } = useTranslation();
  const isAdmin = meQ.data?.user.role === 'admin';
  const groups = isAdmin ? [...navGroups, adminGroup] : navGroups;

  // `isCollapsed` is only ever true for the desktop rail — the mobile drawer
  // always renders the full-width version.
  const renderContent = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center py-5",
          isCollapsed ? "justify-center px-0" : "gap-3 px-6",
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          {isCollapsed ? (
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-ink">
              B
            </span>
          ) : (
            <span className="text-xl font-bold tracking-tight text-ink">Bina B2C</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col gap-1">
          {groups.map((group, i) => (
            <div key={group.title}>
              <SidebarGroupSection group={group} collapsed={isCollapsed} />
              {i < groups.length - 1 && <div className="mx-6 my-2 h-px bg-line" />}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom logout */}
      <div className="border-t border-line px-4 py-3">
        <button
          onClick={logout}
          title={isCollapsed ? "Logout" : undefined}
          className={cn(
            "flex h-12 w-full items-center rounded-xl text-[15px] font-medium text-ink-2 transition-all duration-200 hover:bg-[#FEF2F2] hover:text-[#EF4444]",
            isCollapsed ? "justify-center px-0" : "gap-4 px-6",
          )}
        >
          <LogOut className="size-5 shrink-0" />
          {!isCollapsed && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
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
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#F1F5F9] bg-white lg:hidden"
          >
            {renderContent(false)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar — collapses to a 72px icon rail */}
      <aside
        className={cn(
          "sidebar-transition fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-[#F1F5F9] bg-white transition-[width] duration-300 lg:flex",
          collapsed ? "w-[72px]" : "w-[270px]",
        )}
      >
        {renderContent(collapsed)}
      </aside>
    </>
  );
}
