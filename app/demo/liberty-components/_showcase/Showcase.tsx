import Link from 'next/link';
import type { ReactNode } from 'react';
import { BASE_PATH, COMPONENTS, getEntry } from './registry';

export type PropDoc = {
  name: string;
  type: string;
  /** Default value, as shown in the table. */
  defaultValue?: string;
  note?: string;
};

export type Variant = {
  label: string;
  note?: string;
  node: ReactNode;
  /** Render edge to edge (no padding), for components that bring their own width. */
  flush?: boolean;
};

type ShowcaseProps = {
  slug: string;
  props: PropDoc[];
  /** The component with no props: every text is its default. */
  children: ReactNode;
  variants?: Variant[];
  /** Render the default example edge to edge. */
  flush?: boolean;
};

function Canvas({ label, note, flush, children }: { label: string; note?: string; flush?: boolean; children: ReactNode }) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xl font-light text-navy">{label}</h2>
        {note && <p className="text-sm text-gray-500">{note}</p>}
      </div>
      <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className={flush ? '' : 'p-6'}>{children}</div>
      </div>
    </section>
  );
}

/**
 * Page frame for one component under /demo/liberty-components/<slug>:
 * title, what it is, where it is used, the component with its default text,
 * any variants, and a props table. The frame is demo scaffolding only — the
 * components themselves live in app/_components_liberty.
 */
export default function Showcase({ slug, props, children, variants = [], flush = false }: ShowcaseProps) {
  const entry = getEntry(slug);
  const index = COMPONENTS.findIndex((c) => c.slug === slug);
  const prev = COMPONENTS[index - 1];
  const next = COMPONENTS[index + 1];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
        <Link href={BASE_PATH} className="text-lmt underline underline-offset-2">
          Liberty components
        </Link>{' '}
        &rsaquo; {entry.group} &rsaquo; <span aria-current="page">{entry.title}</span>
      </nav>

      <header className="mt-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-mist text-lmtd text-xs font-bold px-3 py-1">{entry.id}</span>
          <h1 className="text-[34px] leading-tight font-light text-navy">{entry.title}</h1>
        </div>
        <p className="mt-3 max-w-3xl text-gray-600">{entry.description}</p>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-gray-500">Used on</dt>
            <dd className="font-medium text-navy">{entry.usedOn}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-gray-500">Source</dt>
            <dd>
              <code className="text-navy">app/_components_liberty/{entry.source}</code>
            </dd>
          </div>
        </dl>
      </header>

      <Canvas label="Default" note="No props: every text is the mockup's own." flush={flush}>
        {children}
      </Canvas>

      {variants.map((v) => (
        <Canvas key={v.label} label={v.label} note={v.note} flush={v.flush}>
          {v.node}
        </Canvas>
      ))}

      <section className="mt-12">
        <h2 className="text-xl font-light text-navy">Props</h2>
        <p className="mt-1 text-sm text-gray-500">All text is a prop. Leave a prop out to use its default.</p>
        <div className="mt-3 overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5] text-left text-navy">
              <tr>
                <th className="p-3 font-medium">Prop</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Default</th>
              </tr>
            </thead>
            <tbody>
              {props.map((p) => (
                <tr key={p.name} className="border-t border-gray-200 align-top">
                  <td className="p-3">
                    <code className="text-navy">{p.name}</code>
                  </td>
                  <td className="p-3">
                    <code className="text-gray-700">{p.type}</code>
                    {p.note && <div className="mt-1 text-xs text-gray-500">{p.note}</div>}
                  </td>
                  <td className="p-3 text-gray-700">{p.defaultValue ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <nav aria-label="More components" className="mt-12 pt-6 border-t border-gray-200 flex justify-between gap-4 text-sm">
        {prev ? (
          <Link href={`${BASE_PATH}/${prev.slug}`} className="text-lmt underline underline-offset-2">
            ‹ {prev.id} {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`${BASE_PATH}/${next.slug}`} className="text-lmt underline underline-offset-2">
            {next.id} {next.title} ›
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
