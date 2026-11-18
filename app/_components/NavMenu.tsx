import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '@/lib/nav';

/**
 * Desktop menu. Items with children get a dropdown that opens on hover and on
 * keyboard focus (CSS only, so it stays a server component). Each `li` is the
 * full header height so the pointer never crosses a gap on its way to the
 * dropdown. Hidden below `lg`; MobileMenu takes over there.
 */
export default function NavMenu({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Main" className="hidden h-16 lg:flex">
      <ul className="flex h-full items-center gap-7">
        {items.map((item) => {
          const hasChildren = item.children.length > 0;
          return (
            <li key={item.key} className="group relative flex h-full items-center">
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 transition-colors hover:text-blue-700 focus-visible:text-blue-700"
              >
                {item.label}
                {hasChildren && (
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className="transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
                  />
                )}
              </Link>

              {hasChildren && (
                <ul className="invisible absolute left-1/2 top-full z-50 min-w-60 -translate-x-1/2 border-t-2 border-blue-400 bg-white py-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <li key={child.key}>
                      <Link
                        href={child.href}
                        className="block px-4 py-2 text-[13px] font-semibold text-blue-950 transition-colors hover:bg-mint hover:text-blue-700 focus-visible:bg-mint focus-visible:text-blue-700"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
