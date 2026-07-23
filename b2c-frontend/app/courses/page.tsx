import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Navbar } from '@/src/components/marketing/Navbar';
import { Footer } from '@/src/components/marketing/Footer';
import { CoursesCatalogPage } from '@/src/components/marketing/CoursesCatalogPage';
import { MarketingPageShell } from '@/src/components/marketing/MarketingPageShell';

export const metadata: Metadata = {
  title: 'Courses | AIStudy',
  description:
    'Browse courses from expert instructors across programming, design, marketing, and more.',
};

export default function CoursesPage() {
  return (
    <MarketingPageShell>
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-[40vh] bg-bg-soft" />}>
          <CoursesCatalogPage />
        </Suspense>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
