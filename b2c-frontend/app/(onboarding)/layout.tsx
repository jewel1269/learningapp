import { RequireAuth } from '@/src/features/auth';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-24 size-[500px] rounded-full bg-tint-mint opacity-60 blur-[130px]" />
          <div className="absolute -right-24 bottom-0 size-[440px] rounded-full bg-tint-blue opacity-50 blur-[130px]" />
        </div>
        <div className="relative z-10 flex w-full justify-center">{children}</div>
      </div>
    </RequireAuth>
  );
}
