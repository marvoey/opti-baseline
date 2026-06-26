import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { BundledLanguage } from 'shiki';
import type { DisplayTemplateDef } from './_blocks';
import { highlight } from './_highlight';
import { CopyButton } from './_CopyButton';

/**
 * Presentational helpers shared by the styleguide index and detail pages. Pure
 * server components — no client interactivity.
 */

/** A single rendered variant of a block, with a small caption. */
export function Preview({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div>
      {label ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cibc-ink/40">
          {label}
        </p>
      ) : null}
      <div className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
        {children}
      </div>
    </div>
  );
}

/** A titled section block on the detail page. */
export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-cibc-teal-dark">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-cibc-ink/60">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** Display-template settings the editor can choose for this block. */
export function DisplayTemplateTable({ template }: { template: DisplayTemplateDef }) {
  const settings = Object.entries(template.settings ?? {});
  if (!settings.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-cibc-stone/60 text-xs uppercase tracking-wider text-cibc-ink/50">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Setting</th>
            <th className="px-4 py-2.5 font-semibold">Editor</th>
            <th className="px-4 py-2.5 font-semibold">Choices</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {settings.map(([key, setting]) => (
            <tr key={key} className="align-top">
              <td className="px-4 py-3">
                <code className="font-mono text-xs font-semibold text-cibc-teal-dark">{key}</code>
                {setting.displayName ? (
                  <div className="mt-0.5 text-xs text-cibc-ink/50">{setting.displayName}</div>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-xs text-cibc-teal">{setting.editor ?? '—'}</code>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(setting.choices ?? {}).map(([value, choice]) => (
                    <span
                      key={value}
                      className="rounded bg-cibc-stone px-1.5 py-0.5 font-mono text-[10px] text-cibc-ink/70"
                    >
                      {value}
                      {choice.displayName ? ` · ${choice.displayName}` : ''}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A code/JSON block styled like an editor: Shiki-highlighted on the server
 * (zero client JS for highlighting), a copy button, and optional collapse via a
 * native <details>. Shiki output keeps its own colours; we drop its background
 * so the surrounding slate frame shows through.
 */
export async function CodeBlock({
  code,
  lang = 'tsx',
  caption,
  collapsible = false,
  defaultOpen = true,
}: {
  code: string;
  lang?: BundledLanguage;
  caption?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const html = await highlight(code, lang);

  const body = (
    <div
      className="overflow-x-auto text-[13px] leading-relaxed [tab-size:2] [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:px-4 [&_pre]:py-4 [&_pre]:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  const barInner = (
    <>
      {collapsible ? (
        <ChevronRight
          size={14}
          className="shrink-0 text-slate-400 transition-transform group-open:rotate-90"
        />
      ) : (
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </span>
      )}
      {caption ? <span className="ml-1 font-mono text-xs text-slate-400">{caption}</span> : null}
      <CopyButton value={code} />
    </>
  );

  const barClass =
    'flex items-center gap-2 border-b border-white/10 bg-slate-950/50 px-4 py-2.5';
  const frameClass = 'overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-sm';

  if (collapsible) {
    return (
      <details open={defaultOpen} className={`group ${frameClass}`}>
        <summary className={`${barClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          {barInner}
        </summary>
        {body}
      </details>
    );
  }

  return (
    <div className={frameClass}>
      <div className={barClass}>{barInner}</div>
      {body}
    </div>
  );
}
