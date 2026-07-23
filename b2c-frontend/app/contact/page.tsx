import type { Metadata } from 'next';
import { Navbar } from '@/src/components/marketing/Navbar';
import { Footer } from '@/src/components/marketing/Footer';
import { ContactPageContent } from '@/src/components/marketing/ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact Us | AIStudy',
  description:
    'Get in touch with the AIStudy team for support, billing questions, partnerships, and general enquiries.',
};

export default function ContactPage() {
  return (
    <div className="font-sans text-[#0F172A]">
      <Navbar />
      <main>
        <ContactPageContent />
      </main>
      <Footer />
    </div>
  );
}
