import type { Metadata } from 'next';
import { Navbar } from '@/src/components/marketing/Navbar';
import { Footer } from '@/src/components/marketing/Footer';
import { ContactPageContent } from '@/src/components/marketing/ContactPageContent';
import { MarketingPageShell } from '@/src/components/marketing/MarketingPageShell';

export const metadata: Metadata = {
  title: 'Contact Us | AIStudy',
  description:
    'Get in touch with the AIStudy team for support, billing questions, partnerships, and general enquiries.',
};

export default function ContactPage() {
  return (
    <MarketingPageShell>
      <Navbar />
      <main>
        <ContactPageContent />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
