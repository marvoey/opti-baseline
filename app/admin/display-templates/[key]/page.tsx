import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import {
  fetchCmsDisplayTemplate,
  type CmsDisplayTemplate,
  type CmsDisplayTemplateSetting,
} from '@/lib/cms/displayTemplates';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = decodeURIComponent((await params).key);
  return { title: `${key} · Display Templates · Admin` };
}

export default async function DisplayTemplateDetailPage({ params }: Props) {
  const key = decodeURIComponent((await params).key);
  const result = await fetchCmsDisplayTemplate(key);

  if (!result.ok && result.reason === 'not-found') notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link
        href="/admin/display-templates"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ChevronLeft size={16} />
        All display templates
      </Link>

      {result.ok ? (
        <DisplayTemplateDetail template={result.template} />
      ) : (
        <div
          className={`rounded-2xl border p-6 ${
            result.reason === 'missing-credentials'
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <p className="font-medium">
            {result.reason === 'missing-credentials'
              ? 'CMS credentials not configured'
              : 'Could not load this display template'}
          </p>
          <p className="mt-1 text-sm">{result.message}</p>
        </div>
      )}
    </main>
  );
}

function DisplayTemplateDetail({ template: t }: { template: CmsDisplayTemplate }) {
  const settings = Object.entries(t.settings ?? {}).sort(
    ([, a], [, b]) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  return (
    <article>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t.displayName}</h1>
        {t.isDefault && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            default
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
          {t.key}
        </code>
        {t.contentType && (
          <span>
            Content type:{' '}
            <code className="font-mono text-xs text-slate-700">{t.contentType}</code>
          </span>
        )}
        {t.baseType && (
          <span>
            Base type:{' '}
            <code className="font-mono text-xs text-slate-700">{t.baseType}</code>
          </span>
        )}
        {t.nodeType && (
          <span>
            Node type:{' '}
            <code className="font-mono text-xs text-slate-700">{t.nodeType}</code>
          </span>
        )}
      </div>

      <h2 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Settings ({settings.length})
      </h2>

      {settings.length === 0 ? (
        <p className="text-sm italic text-slate-400">No settings defined.</p>
      ) : (
        <div className="space-y-4">
          {settings.map(([name, setting]) => (
            <SettingCard key={name} name={name} setting={setting} />
          ))}
        </div>
      )}
    </article>
  );
}

function SettingCard({ name, setting }: { name: string; setting: CmsDisplayTemplateSetting }) {
  const choices = Object.entries(setting.choices ?? {}).sort(
    ([, a], [, b]) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="font-mono text-sm font-medium text-slate-900">{name}</span>
        {setting.displayName && setting.displayName !== name && (
          <span className="text-sm text-slate-500">{setting.displayName}</span>
        )}
        {setting.editor && (
          <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {setting.editor}
          </span>
        )}
      </div>

      {choices.length > 0 && (
        <div className="divide-y divide-slate-100">
          {choices.map(([choiceKey, choice]) => (
            <div key={choiceKey} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <code className="font-mono text-xs text-slate-600">{choiceKey}</code>
              <span className="text-slate-700">{choice.displayName}</span>
              {choice.sortOrder !== undefined && (
                <span className="ml-auto text-xs text-slate-400">order {choice.sortOrder}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {choices.length === 0 && (
        <p className="px-4 py-3 text-sm italic text-slate-400">No choices defined.</p>
      )}
    </div>
  );
}
