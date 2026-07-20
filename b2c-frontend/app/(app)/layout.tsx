'use client';

import { RequireAuth } from '@/src/features/auth';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { AdminTopbar } from '@/src/components/layout/AdminTopbar';
import { FloatingActionButton } from '@/src/components/dashboard/FloatingActionButton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:pl-[270px] transition-all duration-300">
          <AdminTopbar />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
        <FloatingActionButton />
      </div>
    </RequireAuth>
  );
}
