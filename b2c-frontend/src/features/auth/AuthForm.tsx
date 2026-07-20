'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { ApiError } from '@/src/infrastructure/apiClient';
import { useLogin, useSignup } from './useAuth';

const GOOGLE_ENABLED = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup';
  const login = useLogin();
  const signup = useSignup();
  const mutation = isSignup ? signup : login;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [googleMsg, setGoogleMsg] = useState<string | null>(null);

  const serverError = mutation.error instanceof ApiError ? mutation.error.message : null;
  const error = localError ?? serverError;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (!emailRe.test(email)) return setLocalError('Enter a valid email address.');
    if (isSignup && password.length < 8)
      return setLocalError('Password must be at least 8 characters.');
    if (!password) return setLocalError('Enter your password.');
    mutation.mutate({ email: email.trim(), password });
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-8 text-center">
        <Link href="/" className="mb-6 inline-flex items-center gap-2.5 text-xl font-extrabold">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-[17px] font-bold text-primary-ink">
            B
          </span>
          Bina B2C
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1.5 text-sm text-ink-2">
          {isSignup
            ? 'Start building real skills in minutes — free.'
            : 'Log in to continue learning.'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
              className="pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-bad-soft px-3.5 py-2.5 text-sm text-bad" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={mutation.isPending} className="w-full">
          {isSignup ? 'Create account' : 'Log in'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-3">
        <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        type="button"
        variant="soft"
        size="lg"
        className="w-full"
        onClick={() =>
          GOOGLE_ENABLED
            ? setGoogleMsg('Google sign-in flow will connect here.')
            : setGoogleMsg('Google sign-in isn’t configured yet — use email for now.')
        }
      >
        <GoogleMark /> Continue with Google
      </Button>
      {googleMsg && <p className="mt-2 text-center text-xs text-ink-3">{googleMsg}</p>}

      <p className="mt-6 text-center text-sm text-ink-2">
        {isSignup ? 'Already have an account? ' : 'New to Bina? '}
        <Link
          href={isSignup ? '/login' : '/signup'}
          className="font-semibold text-primary hover:underline"
        >
          {isSignup ? 'Log in' : 'Create one free'}
        </Link>
      </p>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.2-4 1.2-3 0-5.6-2-6.6-4.8H1.4v3C3.4 21.4 7.4 24 12 24z"
      />
      <path fill="#FBBC05" d="M5.4 14.5a7.2 7.2 0 0 1 0-4.6v-3H1.4a12 12 0 0 0 0 10.6l4-3z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.4l4 3C6.4 6.7 9 4.8 12 4.8z"
      />
    </svg>
  );
}
