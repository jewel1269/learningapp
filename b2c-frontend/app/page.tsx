import { Navbar } from '@/src/components/marketing/Navbar';
import { Hero } from '@/src/components/marketing/Hero';
import { Categories } from '@/src/components/marketing/Categories';
import { Footer } from '@/src/components/marketing/Footer';
import { LandingAssessmentPrompt } from '@/src/components/marketing/LandingAssessmentPrompt';

export default function LandingPage() {
  return (
    <div className="font-sans text-[#0F172A]">
      <LandingAssessmentPrompt />
      <Navbar />
      <main>
        <Hero />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}
