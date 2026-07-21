import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { STATS, WHY_CHOOSE } from './data';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';

export function WhyChooseUs() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Discover Why Our Student and Clients Choose Us"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {WHY_CHOOSE.map((item) => (
            <article
              key={item.title}
              className="rounded-[22px] border border-line bg-bg-soft p-6 transition-all hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="grid size-12 place-items-center rounded-full bg-primary text-white">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold leading-snug text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] p-8 text-white lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/80">
              Join Our Live Class
            </p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/90">
              It has survived not only five centuries, but also the leap into electronic typesetting.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Image
                src="https://i.pravatar.cc/100?img=48"
                alt="Sarah Amanda"
                width={64}
                height={64}
                className="size-16 rounded-full border-2 border-white/30 object-cover"
              />
              <div>
                <p className="text-lg font-bold">Sarah Amanda</p>
                <p className="text-sm text-white/80">Product Designer</p>
              </div>
            </div>
            <div className="mt-8 inline-flex rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div>
                <p className="text-3xl font-bold leading-none">10+</p>
                <p className="mt-1 text-sm text-white/85">Student Trained</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-line bg-white p-6 lg:p-8">
            <div className="flex items-center gap-4 border-b border-[#F1F5F9] pb-5">
              <Image
                src="https://i.pravatar.cc/100?img=47"
                alt="Alisa Olivia"
                width={56}
                height={56}
                className="size-14 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-ink">Alisa Olivia</p>
                <p className="text-sm text-ink-2">/</p>
              </div>
              <Image
                src="https://i.pravatar.cc/100?img=15"
                alt="Jhon Oleson"
                width={56}
                height={56}
                className="ml-auto size-14 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-ink">Jhon Oleson</p>
                <p className="text-sm text-ink-2">Sr. Developer</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div key={`${stat.label}-${stat.suffix}`} className="rounded-2xl bg-bg-soft p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {stat.value}
                    <span className="text-secondary">{stat.suffix}</span>
                  </p>
                  <p className="mt-1 text-xs font-medium leading-snug text-ink-2">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-secondary px-6 text-sm font-semibold text-white transition-colors hover:bg-secondary-2"
            >
              Join Live Class
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
