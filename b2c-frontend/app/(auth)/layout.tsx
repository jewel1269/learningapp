import { RedirectIfAuthed } from '@/src/features/auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RedirectIfAuthed>
      <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6 py-12">
        {/* soft gradient backdrop (matches the marketing look) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-tint-mint opacity-70 blur-[130px]" />
          <div className="absolute -right-24 bottom-0 size-[460px] rounded-full bg-tint-peach opacity-60 blur-[130px]" />
        </div>
        <div className="relative z-10 w-full max-w-[440px] rounded-3xl border border-line bg-bg-elev p-8 shadow-lift sm:p-10">
          {children}
        </div>
      </div>
    </RedirectIfAuthed>
  );
}
