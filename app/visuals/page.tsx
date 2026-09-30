import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';

// Index of every page under /visuals. Routes are discovered by scanning this
// directory at build time (the page is static), so adding app/visuals/<name>/page.tsx
// makes it show up here with no code changes.

const VISUALS_DIR = path.join(process.cwd(), 'app', 'visuals');
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

type VisualRoute = { href: string; label: string };

function toLabel(segments: string[]): string {
  return segments
    .map((s) =>
      s
        .split(/[-_]/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    )
    .join(' / ');
}

function scan(dir: string, segments: string[] = []): VisualRoute[] {
  const routes: VisualRoute[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;

    // Skip private folders (_x), dynamic segments ([x]) and parallel slots (@x):
    // none of them map to a single linkable URL.
    if (/^[_[@]/.test(name)) continue;

    const isGroup = /^\(.*\)$/.test(name); // (group) folders don't add a URL segment
    const childSegments = isGroup ? segments : [...segments, name];
    const childDir = path.join(dir, name);

    if (!isGroup && fs.readdirSync(childDir).some((f) => PAGE_FILE.test(f))) {
      routes.push({
        href: `/visuals/${childSegments.join('/')}`,
        label: toLabel(childSegments),
      });
    }
    routes.push(...scan(childDir, childSegments));
  }

  return routes;
}

export const metadata = { title: 'Visuals' };

export default function VisualsIndexPage() {
  const routes = scan(VISUALS_DIR).sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { numeric: true }),
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold text-dark-fir">Visuals</h1>
      <p className="mt-2 text-gray-600">
        {routes.length} {routes.length === 1 ? 'page' : 'pages'}
      </p>

      {routes.length === 0 ? (
        <p className="mt-8 text-gray-500">No visuals yet.</p>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {routes.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-lg border border-neutral-3 bg-neutral-2 px-5 py-4 transition-colors hover:border-light-fir hover:bg-neutral-3"
              >
                <span className="block font-medium text-dark-fir">{label}</span>
                <span className="block text-xs text-gray-500">{href}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
