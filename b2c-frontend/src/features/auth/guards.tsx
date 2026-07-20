'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import { Spinner } from '@/src/components/ui/spinner';
import { useAuthHydrated } from './useAuthHydrated';

function FullScreen() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center">
      <Spinner className="size-6 text-primary" />
    </div>
  );
}

// Protects authenticated routes. Waits for store hydration before deciding, so a
// logged-in user isn't bounced to /login on first paint.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (hydrated && !token) router.replace('/login');
  }, [hydrated, token, router]);

  if (!hydrated) return <FullScreen />;
  if (!token) return null; // redirecting
  return <>{children}</>;
}

// For /login and /signup: send users who ARRIVE already-authenticated to the
// dashboard. The check runs once (in an effect, after hydration) so it does NOT
// fire mid-flow — otherwise the token appearing during signup would hijack the
// intended /create-course redirect and dump the user on /dashboard.
export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const decided = useRef(false);

  useEffect(() => {
    if (!hydrated || decided.current) return;
    decided.current = true;
    if (useAuthStore.getState().accessToken) router.replace('/dashboard');
  }, [hydrated, router]);

  return <>{children}</>;
}
