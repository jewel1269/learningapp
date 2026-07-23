import type { Metadata } from 'next';
import { Navbar } from '@/src/components/marketing/Navbar';
import { Footer } from '@/src/components/marketing/Footer';
import { Pricing } from '@/src/components/marketing/Pricing';
import { PricingComparison } from '@/src/components/marketing/PricingComparison';
import { PricingFaq } from '@/src/components/marketing/PricingFaq';

export const metadata: Metadata = {
  title: 'Pricing | AIStudy',
  description:
    'Compare Free and Premium plans for AI-generated courses, labs, quizzes, and skill assessments.',
};

export default function PricingPage() {
  return (
    <div className="font-sans text-[#0F172A]">
      <Navbar />
      <main>
        <Pricing fullPage />
        <PricingComparison />
        <PricingFaq />
      </main>
      <Footer />
    </div>
  );
}
