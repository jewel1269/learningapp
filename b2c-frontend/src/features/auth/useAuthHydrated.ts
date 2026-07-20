'use client';

import { useSyncExternalStore } from 'react';
import { useAuthStore } from '@/src/store/authStore';

// True once the persisted auth store has rehydrated from localStorage. Guards use
// this so they don't redirect a logged-in user during the initial (empty) render.
export function useAuthHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useAuthStore.persist.onFinishHydration(cb),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
