'use client';

import { RequireAuth, RequireAdmin } from '@/src/features/auth';
import { AdminShell } from '@/src/components/layout/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RequireAdmin>
        <AdminShell>{children}</AdminShell>
      </RequireAdmin>
    </RequireAuth>
  );
}
