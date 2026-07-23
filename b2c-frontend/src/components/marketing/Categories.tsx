import Link from 'next/link';
import { ChevronsRight, GraduationCap } from 'lucide-react';
import { CATEGORIES } from './data';
import { Container } from './Container';

function CategoriesHeading() {
  return (
    <div className="mx-auto mb-14 max-w-4xl text-center lg:mb-[58px]">
      <div className="inline-flex items-center gap-2.5">
        <GraduationCap className="size-5 text-secondary" strokeWidth={2} />
        <span className="text-[20px] font-medium capitalize leading-5 text-primary">Category</span>
      </div>

      <h2 className="mt-[18px] text-[30px] font-semibold capitalize leading-[1.35] text-ink sm:text-[36px] sm:leading-[51px]">
        Explore Our World&apos;s Class <br />
        Best Courses{' '}
        <span className="inline-block rounded-[21px] bg-primary px-2.5 py-1.5 text-[24px] leading-[30px] text-white sm:text-[30px]">
          Categories
        </span>
      </h2>
    </div>
  );
}

function CategoryCard({
  title,
  courses,
  icon: Icon,
  iconBg,
  iconColor,
}: (typeof CATEGORIES)[number]) {
  return (
    <article className="group rounded-lg bg-bg-elev p-5">
      <div className="relative rounded-lg border border-line bg-[var(--marketing-surface)] px-5 pb-5 pt-[77px] ">
        <div className="absolute -left-5 top-5 z-10 grid size-20 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg-elev">
          <span className={`grid size-14 place-items-center rounded-full ${iconBg}`}>
            <Icon className={`size-7 ${iconColor}`} strokeWidth={1.8} />
          </span>
        </div>

        <p className="text-[16px] font-semibold italic leading-[26px] text-primary">{courses} Courses</p>

        <h3 className="mb-10 mt-1 text-[24px] font-semibold leading-[31px] text-ink">
          <Link href="/assessments" className="transition-colors hover:text-primary">
            {title}
          </Link>
        </h3>

        <Link
          href="/assessments"
          className="inline-flex items-center gap-2.5 rounded-full bg-secondary px-6 py-3 text-[18px] font-medium text-white transition-colors hover:bg-secondary-2"
        >
          View More
          <span className="grid size-7 place-items-center rounded-full bg-white/20">
            <ChevronsRight className="size-4" strokeWidth={2.5} />
          </span>
        </Link>
      </div>
    </article>
  );
}

export function Categories() {
  return (
    <section id="categories" className="bg-[var(--marketing-surface)] py-20 lg:py-[120px] lg:pb-24">
      <Container>
        <CategoriesHeading />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
