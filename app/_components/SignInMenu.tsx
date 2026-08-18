'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, LogIn } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

export function SignInMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white font-semibold text-sm rounded hover:bg-orange-600 transition-colors"
      >
        <LogIn size={15} />
        {siteConfig.accountLabel}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white shadow-xl rounded border border-gray-100 py-1 z-50">
          <p className="px-4 py-2 text-xs font-bold text-blue-800 uppercase tracking-widest border-b border-gray-100">
            Online Banking
          </p>
          {siteConfig.signInAccounts.map((account) => (
            <Link
              key={account.label}
              href={account.href}
              className="flex items-center px-4 py-2.5 text-sm text-blue-950 hover:bg-blue-50 font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              {account.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
