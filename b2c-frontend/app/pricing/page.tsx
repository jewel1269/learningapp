import type { Metadata } from 'next';
import { Navbar } from '@/src/components/marketing/Navbar';
import { Footer } from '@/src/components/marketing/Footer';
import { Pricing } from '@/src/components/marketing/Pricing';

export const metadata: Metadata = {
  title: 'Pricing | AIStudy',
  description:
    'Compare Free, Standard, and Premium membership plans for AI-generated courses, labs, and assessments.',
};

export default function PricingPage() {
  return (
    <div className="font-sans text-[#0F172A]">
      <Navbar />
      <main>
        <Pricing fullPage />
      </main>
      <Footer />
    </div>
  );
}
