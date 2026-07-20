'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import * as subscriptionApi from './subscriptionApi';

export function useSubscription() {
  return useQuery({ queryKey: ['subscription', 'me'], queryFn: subscriptionApi.getMySubscription });
}

// Redirect the browser to Stripe Checkout / the customer portal.
export function useCheckout() {
  return useMutation({
    mutationFn: subscriptionApi.createCheckout,
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: subscriptionApi.createPortal,
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
  });
}
