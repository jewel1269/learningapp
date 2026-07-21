import { Navbar } from '@/src/components/marketing/Navbar';

export function AssessmentSiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,#F0FDFA_0%,#F8FAFC_20%,#FFFFFF_100%)] font-sans text-[#0F172A]">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,127,142,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,127,142,0.05) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <Navbar />
      <main className="relative">{children}</main>
    </div>
  );
}
