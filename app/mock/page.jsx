import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Every subfolder of app/mock containing a page file becomes a link.
function getMocks() {
  const dir = path.join(process.cwd(), 'app', 'mock');
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        /^[a-z0-9-_]+$/i.test(e.name) &&
        fs.readdirSync(path.join(dir, e.name)).some((f) => /^page\.(jsx?|tsx?|mdx)$/.test(f)),
    )
    .map((e) => ({
      href: `/mock/${e.name}`,
      label: e.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}

export default function MockIndex() {
  const MOCKS = getMocks();
  return (
    <main className="min-h-screen bg-neutral-100 text-[#1f2937] font-sans antialiased">
      <header className="bg-[#1b2a4a] text-white px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Mocks</h1>
          <p className="mt-2 text-sm text-white/70">Browse the available design mocks.</p>
        </div>
      </header>
      <ul className="max-w-3xl mx-auto px-4 py-8 grid gap-4 sm:grid-cols-2">
        {MOCKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex items-center justify-between rounded-lg bg-white p-5 border border-neutral-200 shadow-sm transition hover:border-[#df4a26] hover:shadow-md"
            >
              <span className="font-semibold">{label}</span>
              <ArrowRight className="h-5 w-5 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#df4a26]" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
