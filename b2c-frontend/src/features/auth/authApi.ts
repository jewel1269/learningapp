import { apiClient } from '@/src/infrastructure/apiClient';
import type { User } from '@/src/domain/user';

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export function signup(input: Credentials): Promise<AuthResult> {
  return apiClient<AuthResult>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: Credentials): Promise<AuthResult> {
  return apiClient<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function loginWithGoogle(idToken: string): Promise<AuthResult> {
  return apiClient<AuthResult>('/auth/oauth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

// Revokes the refresh-token family server-side. Fire-and-forget on logout.
export function logout(refreshToken: string): Promise<void> {
  return apiClient<void>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function getMe(): Promise<{ user: User }> {
  return apiClient<{ user: User }>('/users/me');
}
