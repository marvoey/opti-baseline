import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnostics · Admin',
  description: 'CMS environment diagnostics.',
};

export const dynamic = 'force-dynamic';

const CMS_ENV_VARS = [
  { key: 'PORT', label: 'Port', sensitive: false },
  { key: 'OPTIMIZELY_DEFAULT_LOCALE', label: 'Default Locale', sensitive: false },
  { key: 'OPTIMIZELY_CMS_URL', label: 'CMS URL', sensitive: false },
  { key: 'OPTIMIZELY_CMS_CLIENT_ID', label: 'CMS Client ID', sensitive: false },
  { key: 'OPTIMIZELY_CMS_CLIENT_SECRET', label: 'CMS Client Secret', sensitive: true },
  { key: 'OPTIMIZELY_CMS_API_URL', label: 'CMS API URL', sensitive: false },
  { key: 'OPTIMIZELY_GRAPH_SINGLE_KEY', label: 'Graph Single Key', sensitive: true },
  { key: 'OPTIMIZELY_GRAPH_GATEWAY', label: 'Graph Gateway', sensitive: false },
  { key: 'NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID', label: 'Web Snippet ID', sensitive: false },
] as const;

function mask(value: string): string {
  if (value.length <= 8) return '••••••••';
  return value.slice(0, 6) + '••••••••' + value.slice(-4);
}

export default function DiagnosticsPage() {
  const rows = CMS_ENV_VARS.map(({ key, label, sensitive }) => {
    const raw = process.env[key];
    return { key, label, sensitive, value: raw ?? null };
  });

  const missing = rows.filter((r) => r.value === null || r.value === '');
  const present = rows.filter((r) => r.value !== null && r.value !== '');

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Diagnostics</h1>
        <p className="mt-2 text-slate-600">
          CMS environment variables for this instance.{' '}
          <span className="font-medium text-amber-700">
            Sensitive values are partially masked.
          </span>
        </p>
      </header>

      {missing.length > 0 && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <span className="font-medium">Missing or empty:</span>{' '}
          {missing.map((r) => (
            <code
              key={r.key}
              className="mr-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs"
            >
              {r.key}
            </code>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 w-56">Variable</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3 w-24 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label, sensitive, value }) => {
              const set = value !== null && value !== '';
              return (
                <tr
                  key={key}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{label}</div>
                    <div className="font-mono text-xs text-slate-400">{key}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700 break-all">
                    {set
                      ? sensitive
                        ? mask(value!)
                        : value
                      : <span className="text-slate-400 italic">not set</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {set ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        set
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                        missing
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Values are read server-side from <code className="font-mono">process.env</code> at request
        time. This page is never cached.
      </p>
    </main>
  );
}
