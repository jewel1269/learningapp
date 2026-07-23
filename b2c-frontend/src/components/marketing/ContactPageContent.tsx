'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { Container } from './Container';
import { FOOTER_CONTACT } from './data';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { cn } from '@/src/lib/utils';

const CONTACT_IMAGE =
  'https://images.unsplash.com/photo-1556745755-6828677a638e?w=900&h=1100&fit=crop';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Label className="mb-2 block text-[15px] font-semibold text-ink">
      {children}
      {required ? <span className="text-bad"> *</span> : null}
    </Label>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-line bg-bg-soft px-6 py-12 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-good-soft text-good">
          <CheckCircle2 className="size-8" />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-ink">Message sent successfully</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-2">
          Thanks for reaching out. Our team will get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-8 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <Input name="name" placeholder="John Doe" required autoComplete="name" />
        </div>
        <div>
          <FieldLabel required>Email Address</FieldLabel>
          <div className="relative">
            <Input
              name="email"
              type="email"
              placeholder="john@domain.com"
              required
              autoComplete="email"
              className="pr-11"
            />
            <Mail className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-primary" />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel required>Subject</FieldLabel>
        <Input name="subject" placeholder="Write about your enquiry" required />
      </div>

      <div>
        <FieldLabel required>Message</FieldLabel>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Write your message"
          className={cn(
            'w-full resize-none rounded-xl border border-line-2 bg-bg px-3.5 py-3 text-sm text-ink outline-none transition',
            'placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20',
          )}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(90deg,#007F8E_0%,#009DAF_45%,#F97316_100%)] px-8 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,127,142,0.28)] transition hover:brightness-105 disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Submit Message'}
        <Send className="size-4" />
      </button>
    </form>
  );
}

function ContactInfoCards() {
  const icons = { mail: Mail, phone: Phone, location: MapPin } as const;

  return (
    <div className="mt-16 grid gap-5 md:grid-cols-3">
      {FOOTER_CONTACT.map((item) => {
        const Icon = icons[item.icon];
        const content = (
          <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" />
            </span>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-ink-3">
              {item.label.replace(':', '')}
            </p>
            <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
          </div>
        );

        return item.href ? (
          <Link key={item.label} href={item.href} className="block">
            {content}
          </Link>
        ) : (
          <div key={item.label}>{content}</div>
        );
      })}
    </div>
  );
}

export function ContactPageContent() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0,127,142,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,127,142,0.04) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-primary-soft blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 size-64 rounded-full bg-secondary-soft blur-3xl" />

        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <div className="relative">
              <div className="overflow-hidden rounded-[28px] border border-line/80 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <Image
                  src={CONTACT_IMAGE}
                  alt="Support team member ready to help"
                  width={900}
                  height={1100}
                  className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[620px]"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 left-6 right-6 rounded-2xl border border-line/80 bg-white/95 px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs">
                <p className="text-sm font-semibold text-ink">Average response time</p>
                <p className="mt-1 text-2xl font-bold text-primary">&lt; 24 hours</p>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
                <GraduationCap className="size-4" />
                Get In Touch
              </div>
              <h1 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight text-ink">
                We&rsquo;re Here to Help and Ready to Hear from You
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">
                Questions about courses, billing, assessments, or partnerships? Send us a message and
                our team will guide you to the right solution.
              </p>

              <div className="mt-8 rounded-[28px] border border-line/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
                <ContactForm />
              </div>

              <p className="mt-5 text-sm text-ink-3">
                Prefer email directly?{' '}
                <Link href="mailto:info@example.com" className="font-semibold text-primary hover:underline">
                  info@example.com
                </Link>
              </p>
            </div>
          </div>

          <ContactInfoCards />

          <div className="mt-16 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#007F8E_0%,#009DAF_50%,#006B78_100%)] px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80">
                  Start learning today
                </p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Ready to build your first AI-powered course?
                </h2>
                <p className="mt-3 text-sm text-white/85 sm:text-base">
                  Join thousands of learners exploring programming, cybersecurity, networking, and
                  more.
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-primary transition hover:bg-white/90"
              >
                Get started free
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
