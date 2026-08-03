import { getClient, type PreviewParams } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { PreviewComponent } from '@optimizely/cms-sdk/react/client';
import Script from 'next/script';

// Preview is always per-request (preview tokens, draft versions) — never cached.
export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * CMS live-preview / on-page-editing route. The CMS opens this URL with preview
 * params (preview_token, key, ctx, ver, loc).
 * 
 * Site chrome comes from app/preview/layout (mirroring how the catch-all gets
 * it from app/[locale]/layout).
 *
 * Uses PreviewComponent from /react/client (the docs' NextPreviewComponent lives
 * at @optimizely/cms-sdk/next, which is NOT exported in the installed v2.0.0).
 */
async function Page({ searchParams }: Props) {
  const params = (await searchParams) as unknown as PreviewParams;
  let content;
  try {
    content = await getClient().getPreviewContent(params);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div>
          <p className="text-lg font-semibold text-red-600">Preview unavailable</p>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            The Graph schema is out of sync. Run{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">npm run config:push</code>{' '}
            then reload.
          </p>
          <p className="mt-3 font-mono text-xs text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  const injectorSrc = new URL(
    '/util/javascript/communicationinjector.js',
    process.env.OPTIMIZELY_CMS_URL,
  ).href;

  return (
    <>
      <Script src={injectorSrc} strategy="afterInteractive" />
      <PreviewComponent />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <OptimizelyComponent content={content} />
      </div>
    </>
  );
}

export default withAppContext(Page);
