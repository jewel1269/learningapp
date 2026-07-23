'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Caveat } from 'next/font/google';
import {
  BookOpen,
  ChevronsRight,
  Globe2,
  GraduationCap,
  Lightbulb,
  Play,
  Star,
  X,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Container } from './Container';

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

function HeroDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 top-10 size-[420px] rounded-full bg-[#C4B5FD]/25 blur-[90px]" />
      <div className="absolute -right-24 top-0 size-[480px] rounded-full bg-[#BFDBFE]/35 blur-[100px]" />
      <div className="absolute bottom-0 left-[35%] size-[320px] rounded-full bg-[#FED7AA]/30 blur-[80px]" />

      <div
        className="absolute left-[42%] top-[18%] h-[420px] w-[420px] -translate-x-1/2 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,127,142,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,127,142,0.18) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <svg className="absolute left-[4%] top-[14%] size-28 opacity-20" viewBox="0 0 80 80">
        {[...Array(6)].map((_, row) =>
          [...Array(6)].map((__, col) => (
            <circle key={`${row}-${col}`} cx={col * 14 + 6} cy={row * 14 + 6} r="2.5" fill="#007F8E" />
          )),
        )}
      </svg>
      <svg className="absolute bottom-[12%] right-[6%] size-32 opacity-15" viewBox="0 0 80 80">
        {[...Array(6)].map((_, row) =>
          [...Array(6)].map((__, col) => (
            <circle key={`${row}-${col}`} cx={col * 14 + 6} cy={row * 14 + 6} r="2.5" fill="#007F8E" />
          )),
        )}
      </svg>

      <div className="absolute left-[6%] top-[34%] rotate-[-12deg] text-primary opacity-80">
        <GraduationCap className="size-14 drop-shadow-sm" strokeWidth={1.5} />
      </div>
      <div className="absolute right-[8%] top-[24%] rotate-[8deg] text-[#EC4899] opacity-75">
        <BookOpen className="size-11" strokeWidth={1.6} />
      </div>
      <div className="absolute right-[2%] top-[42%] text-primary/60">
        <Globe2 className="size-12" strokeWidth={1.4} />
      </div>
    </div>
  );
}

function HeroVideoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Play instructor video"
      onClick={onClick}
      className="group relative grid size-[70px] place-items-center rounded-full"
    >
      <span className="absolute inset-0 rounded-full bg-secondary/10" />
      <span className="absolute inset-[7px] rounded-full bg-secondary/20" />

      <span className="relative grid size-10 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-secondary/35 animate-hero-video-ripple"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-secondary/25 animate-hero-video-ripple animate-hero-video-ripple-delay-1"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-secondary/20 animate-hero-video-ripple animate-hero-video-ripple-delay-2"
        />
        <span className="relative z-10 grid size-10 place-items-center rounded-full bg-secondary text-white transition-colors group-hover:bg-secondary-2 animate-hero-video-pulse-core">
          <Play className="ml-0.5 size-3.5 fill-white" />
        </span>
      </span>
    </button>
  );
}



function HeroCollage() {
  return (
    <div className="relative w-full max-w-[560px] lg:ml-[77px]">
      <div className="relative grid grid-cols-2 gap-x-5">
        {/* Left column */}
        <div className="relative z-10">
          <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[24px]">
            <Image
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=420&h=520&fit=crop&crop=faces"
              alt="Male student studying with laptop"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 45vw, 260px"
            />
          </div>

          <div className="relative rounded-[13px] bg-white p-3.5 shadow-[0_0_20px_rgba(190,190,190,0.38)]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[9px]">
              <Image
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=220&fit=crop"
                alt="Male student learning UI/UX design on laptop"
                fill
                className="object-cover"
                sizes="260px"
              />
              <span className="absolute left-2.5 top-2.5 rounded-[7px] border border-ink bg-[#FFC224] px-1.5 py-1 text-[12px] font-semibold leading-none text-ink">
                -10% Off
              </span>
            </div>

            <div className="relative mt-2 pr-10">
              <p className="text-[14px] font-medium leading-[17px] text-ink">
                UI/UX Design Enhancing <br /> User Experience Effectively
              </p>
              <p className="mt-5 text-[18px] font-medium leading-none text-secondary">$150.00</p>

              <div className="absolute bottom-0 right-0 text-right">
                <p className="text-[12px] font-medium leading-none text-ink">
                  5.50/<span className="text-ink-2">14</span>
                </p>
                <div className="mt-0.5 flex justify-end gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <Star key={i} className="size-3 fill-[#FFC224] text-[#FFC224]" />
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-label="View course"
                className="absolute right-0 top-1 flex h-6 w-9 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
              >
                <ChevronsRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="relative z-10 mt-[116px]">
          <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[24px]">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=420&h=520&fit=crop&crop=faces"
              alt="Male student portrait"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 45vw, 260px"
            />
          </div>

          <div className="relative max-w-[225px]">
            <div
              aria-hidden
              className="absolute -bottom-1.5 -right-1.5 top-1.5 left-1.5 -z-10 rounded-[45px] border-2 border-ink"
            />
            <div className="flex items-center gap-[15px] rounded-[45px] bg-white px-5 py-[17px] shadow-[0_0_20px_rgba(0,0,0,0.1)]">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#FEF3C7] text-[#F59E0B]">
                <Lightbulb className="size-5" fill="#FEF3C7" />
              </span>
              <div>
                <p className="flex items-center text-[24px] font-semibold leading-none text-primary">
                  <span>25</span>
                  <span>+</span>
                  <span className="ml-1 text-[16px] capitalize text-ink">Years</span>
                </p>
                <p className="text-[16px] font-semibold lowercase leading-[26px] text-ink">of experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    if (!videoModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVideoModalOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [videoModalOpen]);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[linear-gradient(282.57deg,#F1E4FF_0.89%,#F0FFF7_54.81%,#FFEBFF_100%)] pb-16 pt-8 lg:pb-20 lg:pt-24"
    >
      <HeroDecorations />

      <Container className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
        {/* Left content */}
        <div className="relative z-10 max-w-[560px] pb-28 lg:mt-14 lg:pb-0">
          <p className={`${caveat.className} text-[24px] font-semibold italic leading-[30px] text-primary sm:text-[26px]`}>
            # Best Online Platform
          </p>

          <h1 className="mt-1 text-[42px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[52px] lg:text-[63px] lg:leading-[80px]">
            <span className="whitespace-nowrap">
              Start Learning <span className="text-secondary">Today</span>
            </span>
            <br />
            <span className="text-secondary">Discover</span> Your Next
            <br />
            Great Skill
          </h1>

          <p className="mt-5 max-w-[480px] text-[17px] leading-[30px] text-ink-2 lg:text-[20px]">
            Take a quick skill test, discover your level, and get a personalized AI course — start
            with 3 months free.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/signup"
              className="inline-flex h-[58px] items-center rounded-full bg-primary pl-8 pr-2 text-[16px] font-semibold text-white shadow-[var(--shadow-primary)] transition-all hover:bg-primary-dark"
            >
              Get Started
              <span className="ml-5 grid size-11 place-items-center rounded-full bg-primary-dark">
                <ChevronsRight className="size-5" strokeWidth={2.5} />
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[11, 12, 13].map((img) => (
                  <Image
                    key={img}
                    src={`https://i.pravatar.cc/80?img=${img}`}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-full border border-line object-cover"
                  />
                ))}
              </div>
              <div className="leading-tight">
                <p className="text-[22px] font-bold text-primary">2000+</p>
                <p className="text-[13px] text-ink-2">Success Student</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[105px] -right-[50px] z-30 hidden lg:block">
            <HeroVideoButton onClick={() => setVideoModalOpen(true)} />
          </div>
        </div>

        <HeroCollage />
      </Container>

      {videoModalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close video modal"
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            onClick={() => setVideoModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-video-modal-title"
            className="relative w-full max-w-[420px] rounded-[24px] bg-white p-8 text-center shadow-[var(--shadow-elevated)]"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setVideoModalOpen(false)}
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-bg-soft hover:text-ink"
            >
              <X className="size-5" />
            </button>

            <span className="mx-auto grid size-16 place-items-center rounded-full bg-secondary text-white shadow-[var(--shadow-accent)]">
              <Play className="ml-1 size-7 fill-white" />
            </span>

            <h2 id="hero-video-modal-title" className="mt-5 text-[22px] font-bold text-ink">
              Instructional Preview Video Coming Soon
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              We are preparing the instructional preview video. Please check back shortly.
            </p>

            <Button
              type="button"
              className="mt-6 w-full rounded-full"
              onClick={() => setVideoModalOpen(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
