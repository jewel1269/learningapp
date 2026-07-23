import { CATEGORIES, COURSES, NAV_LINKS } from './data';

export type NavbarSearchItem = {
  id: string;
  label: string;
  description?: string;
  href: string;
};

function navHref(href: string) {
  return href.startsWith('#') ? `/${href}` : href;
}

export function buildStaticSearchIndex(): NavbarSearchItem[] {
  const pages: NavbarSearchItem[] = NAV_LINKS.map((link) => ({
    id: `nav-${link.label}`,
    label: link.label,
    description: 'Page',
    href: navHref(link.href),
  }));

  const categories: NavbarSearchItem[] = CATEGORIES.map((category) => ({
    id: `category-${category.title}`,
    label: category.title,
    description: 'Browse category',
    href: '/#categories',
  }));

  const courses: NavbarSearchItem[] = COURSES.map((course) => ({
    id: `sample-${course.id}`,
    label: course.title,
    description: `${course.instructor} · ${course.category}`,
    href: `/courses?q=${encodeURIComponent(course.title)}`,
  }));

  return [...pages, ...categories, ...courses];
}

export function filterSearchItems(items: NavbarSearchItem[], query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return items
    .filter((item) => {
      const haystack = [item.label, item.description ?? ''].join(' ').toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, limit);
}
