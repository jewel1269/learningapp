'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as adminApi from './adminApi';
import type { ContentType } from './adminApi';

export function useAdminMetrics() {
  return useQuery({ queryKey: ['admin', 'metrics'], queryFn: adminApi.getMetrics });
}

export function useAdminCosts() {
  return useQuery({ queryKey: ['admin', 'costs'], queryFn: adminApi.getCosts });
}

export function useAdminContent(type: ContentType, page = 1) {
  return useQuery({
    queryKey: ['admin', 'content', type, page],
    queryFn: () => adminApi.listContent(type, page),
  });
}

export function useAdminFlags(status?: 'open' | 'resolved' | 'dismissed') {
  return useQuery({
    queryKey: ['admin', 'flags', status ?? 'all'],
    queryFn: () => adminApi.listFlags(status),
  });
}

export function useFlagContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { type: ContentType; id: string; reason: string }) =>
      adminApi.flagContent(input.type, input.id, input.reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'flags'] });
    },
  });
}

export function useRegenerateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { type: ContentType; id: string }) =>
      adminApi.regenerateContent(input.type, input.id),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'content', variables.type] });
    },
  });
}

export function useResolveFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { flagId: string; resolution: 'resolved' | 'dismissed' }) =>
      adminApi.resolveFlag(input.flagId, input.resolution),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'flags'] });
    },
  });
}
