'use client';

import { RequireAuth } from '@/src/features/auth';
import { SidebarProvider } from '@/src/components/layout/Sidebar';
import { AppShell } from '@/src/components/layout/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <AppShell>{children}</AppShell>
      </SidebarProvider>
    </RequireAuth>
  );
}
