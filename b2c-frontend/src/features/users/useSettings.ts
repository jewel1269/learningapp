'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import * as usersApi from './usersApi';

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updatePreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data);
    },
  });
}

export function useExportUserData() {
  return useMutation({ mutationFn: usersApi.exportUserData });
}

export function useDeleteAccount() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  return useMutation({
    mutationFn: usersApi.deleteAccount,
    onSuccess: () => {
      clear();
      router.push('/login');
    },
  });
}
