import type { Metadata } from 'next';
import { Navbar } from '@/src/components/marketing/Navbar';
import { Footer } from '@/src/components/marketing/Footer';
import { Pricing } from '@/src/components/marketing/Pricing';
import { MarketingPageShell } from '@/src/components/marketing/MarketingPageShell';

export const metadata: Metadata = {
  title: 'Pricing | AIStudy',
  description:
    'Compare Free, Standard, and Premium membership plans for AI-generated courses, labs, and assessments.',
};

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <Navbar />
      <main>
        <Pricing fullPage />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
