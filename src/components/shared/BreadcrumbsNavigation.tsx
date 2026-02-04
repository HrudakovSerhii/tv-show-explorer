import Link from 'next/link';

import { NAV_URLS } from '@/constants';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type BreadcrumbsNavigationProps = {
  items?: BreadcrumbItem[];
};

export default function BreadcrumbsNavigation({ items }: BreadcrumbsNavigationProps) {
  return (
    <nav className="flex flex-wrap items-center gap-100 px-200 py-300 text-sm">
      <Link
        href={NAV_URLS.home}
        className="text-brand font-weight-medium group flex items-center gap-50"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="truncate group-hover:underline">Back to Home</span>
      </Link>

      {items?.map((item, index) => (
        <div key={index} className="flex items-center gap-100">
          <span className="text-text-subtlest font-weight-medium">&gt;</span>
          <Link
            href={item.href}
            className="text-brand font-weight-medium hover:underline"
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
