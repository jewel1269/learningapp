import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';

const ABOUT_POINTS = [
  'It provides tools for course creation',
  'Enrollment management, and tracking learner progress, ensuring a streamlined learning experience.',
  'An effective LMS offers robust analytics',
  'Reporting features that enable businesses to track learner performance, completion rates, and engagement levels.',
  'Many LMS platforms include collaborative',
  'Collaborative features such as discussion forums, messaging, and group projects, which facilitate interaction and communication among learners.',
] as const;

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-16 lg:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -left-4 -top-4 size-24 rounded-full bg-secondary/15 blur-2xl" />
          <div className="absolute -bottom-4 -right-4 size-32 rounded-full bg-primary/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-[28px] border-4 border-white shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&h=820&fit=crop"
              alt="Student learning online"
              width={700}
              height={820}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="About Us"
            title="Behind the Scenes: Discover the People & Passion Behind"
            description="Meet the talented individuals who bring our vision to life every day. With a shared passion and commitment, our team works tirelessly to deliver exceptional quality and innovation."
          />

          <ul className="mt-8 space-y-4">
            {ABOUT_POINTS.map((point, index) => (
              <li key={point} className="flex gap-3">
                {index % 2 === 0 ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                ) : (
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#CBD5E1]" />
                )}
                <span
                  className={
                    index % 2 === 0
                      ? 'text-base font-bold text-ink'
                      : 'text-sm leading-relaxed text-ink-2'
                  }
                >
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-sm text-ink-2">Have a Questions</p>
              <p className="text-lg font-bold text-primary">info@domain.com</p>
            </div>
            <Link
              href="/signup"
              className="inline-flex h-12 items-center rounded-xl bg-secondary px-7 text-sm font-semibold text-white transition-colors hover:bg-secondary-2"
            >
              Know More
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
