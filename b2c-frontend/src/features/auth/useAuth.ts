'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import * as authApi from './authApi';

function navigateAfterAuth(router: ReturnType<typeof useRouter>, defaultPath: string) {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  router.push(redirect?.startsWith('/') ? redirect : defaultPath);
}

export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: authApi.getMe });
}

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      navigateAfterAuth(router, '/dashboard');
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      setAuth(data);
      navigateAfterAuth(router, '/create-course');
    },
  });
}

export function useGoogleLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: authApi.loginWithGoogle,
    onSuccess: (data) => {
      setAuth(data);
      navigateAfterAuth(router, '/dashboard');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  return () => {
    const { refreshToken, clear } = useAuthStore.getState();
    // Revoke the refresh-token family server-side (fire-and-forget), then clear locally.
    if (refreshToken) void authApi.logout(refreshToken).catch(() => {});
    clear();
    router.push('/login');
  };
}
