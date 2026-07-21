import { Navbar } from '@/src/components/marketing/Navbar';
import { Hero } from '@/src/components/marketing/Hero';
import { Categories } from '@/src/components/marketing/Categories';
import { ClassDaySection } from '@/src/components/marketing/ClassDaySection';
import { AboutSection } from '@/src/components/marketing/AboutSection';
import { PopularCourses } from '@/src/components/marketing/PopularCourses';
import { WhyChooseUs } from '@/src/components/marketing/WhyChooseUs';
import { InstructorsSection } from '@/src/components/marketing/InstructorsSection';
import { JoinLiveSection } from '@/src/components/marketing/JoinLiveSection';
import { TestimonialsSection } from '@/src/components/marketing/TestimonialsSection';
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
        {/* <ClassDaySection />
        <AboutSection />
        <PopularCourses />
        <WhyChooseUs />
        <InstructorsSection />
        <JoinLiveSection />
        <TestimonialsSection /> */}
      </main>
      <Footer />
    </div>
  );
}
