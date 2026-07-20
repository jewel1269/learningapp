import { apiClient } from '@/src/infrastructure/apiClient';
import type { Tier } from '@/src/domain/user';

export interface Subscription {
  tier: Tier;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
}

export function getMySubscription(): Promise<{ subscription: Subscription }> {
  return apiClient<{ subscription: Subscription }>('/subscriptions/me');
}

export function createCheckout(): Promise<{ url: string }> {
  return apiClient<{ url: string }>('/subscriptions/checkout', { method: 'POST' });
}

export function createPortal(): Promise<{ url: string }> {
  return apiClient<{ url: string }>('/subscriptions/portal', { method: 'POST' });
}
