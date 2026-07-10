import { getClient, type PreviewParams } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { PreviewComponent } from '@optimizely/cms-sdk/react/client';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type PreviewContent = {
  LOB?: string;
  Topic?: string;
  Jurisdiction?: string;
};

async function KbPreviewPage({ searchParams }: Props) {
  const params = (await searchParams) as unknown as PreviewParams;

  let content;
  try {
    content = await getClient().getPreviewContent(params);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8 text-center">
        <div>
          <p className="text-lg font-semibold text-red-600">Preview unavailable</p>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            The Graph schema may be out of sync. Run{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">npm run config:push</code>{' '}
            then reload.
          </p>
          <p className="mt-3 font-mono text-xs text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  const meta = content as PreviewContent | null;
  const taxonomy = [
    { label: 'Line of Business', value: meta?.LOB },
    { label: 'Topic', value: meta?.Topic },
    { label: 'Jurisdiction', value: meta?.Jurisdiction },
  ].filter(f => f.value);

  const injectorSrc = new URL(
    '/util/javascript/communicationinjector.js',
    process.env.OPTIMIZELY_CMS_URL,
  ).href;

  return (
    <>
      <Script src={injectorSrc} strategy="afterInteractive" />
      <PreviewComponent />

      {/* Taxonomy — outside the response bubble */}
      {taxonomy.length > 0 && (
        <dl className="flex flex-wrap gap-2">
          {taxonomy.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm">
              <dt className="text-xs text-gray-400">{label}:</dt>
              <dd className="text-xs font-semibold text-gray-800">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Opal-style response bubble */}
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-1">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex-1">
          <OptimizelyComponent content={content} />
        </div>
      </div>
    </>
  );
}

export default withAppContext(KbPreviewPage);
