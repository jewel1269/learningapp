import type { Page } from '@playwright/test';

const apiBase = process.env.E2E_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function isBackendHealthy(): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(3000),
      });
      return res.status === 400 || res.status === 401 || res.status === 422;
    } catch {
      return false;
    }
  }
}

export async function signupViaApi(email: string, password: string) {
  const res = await fetch(`${apiBase}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Signup failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<{ user: { id: string }; accessToken: string; refreshToken: string }>;
}

export async function loginViaApi(email: string, password: string) {
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Login failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<{ user: { id: string }; accessToken: string; refreshToken: string }>;
}

export async function seedAuthSession(page: Page, tokens: { accessToken: string; refreshToken: string; user: unknown }) {
  await page.addInitScript((payload) => {
    localStorage.setItem(
      'abc-auth',
      JSON.stringify({
        state: {
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        },
        version: 0,
      }),
    );
  }, tokens);
}

export function uniqueEmail(prefix = 'e2e') {
  return `${prefix}-${Date.now()}@bina-test.local`;
}
