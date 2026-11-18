'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import type { NavItem } from '@/lib/nav';

/**
 * Mobile / tablet menu (below `lg`): a toggle button that opens a full-width
 * panel under the sticky header. Items with children expand as an accordion;
 * the item's own link still goes to its page. Escape closes the panel.
 */
export default function MobileMenu({
  items,
  phone,
}: {
  items: NavItem[];
  phone: { label: string; href: string };
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    setExpanded(null);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((o) => !o)}
        className="p-2"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="absolute inset-x-0 top-full max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-gray-200 bg-white shadow-lg"
        >
          <ul className="container mx-auto px-4 py-2">
            {items.map((item) => {
              const hasChildren = item.children.length > 0;
              const isExpanded = expanded === item.key;
              const subId = `mobile-sub-${item.key}`;
              return (
                <li key={item.key} className="border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex-1 py-3 font-display text-sm font-semibold text-blue-950"
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
                        aria-expanded={isExpanded}
                        aria-controls={subId}
                        onClick={() => setExpanded(isExpanded ? null : item.key)}
                        className="p-3 text-blue-950"
                      >
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className={isExpanded ? 'rotate-180 transition-transform' : 'transition-transform'}
                        />
                      </button>
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <ul id={subId} className="mb-2 ml-3 border-l-2 border-blue-400 pl-3">
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link href={child.href} onClick={close} className="block py-2 text-sm text-blue-950">
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

          <div className="border-t border-gray-200 px-4 py-3">
            <a
              href={phone.href}
              className="container mx-auto inline-flex items-center gap-2 font-display text-sm font-semibold text-blue-950"
            >
              <Phone size={14} aria-hidden="true" />
              {phone.label}
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}
