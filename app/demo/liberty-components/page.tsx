import type { Metadata } from 'next';
import Link from 'next/link';
import { BASE_PATH, COMPONENTS, GROUPS } from './_showcase/registry';

export const metadata: Metadata = {
  title: 'Liberty components',
  description: 'Every Ask Liberty component with its default text, variants and props.',
};

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-[34px] leading-tight font-light text-navy">Liberty components</h1>
      <p className="mt-3 max-w-3xl text-gray-600">
        The {COMPONENTS.length} components behind the Ask Liberty answer pages (header and footer
        excluded). Each page shows the component with its default text, its variants and its props.
        Source: <code className="text-navy">app/_components_liberty</code>.
      </p>

      {GROUPS.map((group) => {
        const items = COMPONENTS.filter((c) => c.group === group);
        return (
          <section key={group} className="mt-10">
            <h2 className="text-xl font-light text-navy">{group}</h2>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((c) => (
                <Link
                  key={c.slug}
                  href={`${BASE_PATH}/${c.slug}`}
                  className="block rounded-xl border border-gray-200 p-5 hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-mist text-lmtd text-xs font-bold px-2.5 py-0.5">{c.id}</span>
                    <span className="text-navy font-medium">{c.title}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{c.description}</p>
                  <div className="mt-3 text-xs text-gray-500">Used on {c.usedOn}</div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
