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
  const content = await getClient().getPreviewContent(params);

  const injectorSrc = new URL(
    '/util/javascript/communicationinjector.js',
    process.env.OPTIMIZELY_CMS_URL,
  ).href;

  const port = process.env.PORT?.trim() || '3009';
  const relativePath = content?._metadata?.url?.default as string | undefined;

  return (
    <>
      <Script src={injectorSrc} strategy="afterInteractive" />
      <PreviewComponent />
      {relativePath && (
        <a
          href={`http://localhost:${port}${relativePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-3 right-3 z-[9999] rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-md hover:bg-gray-100 transition-colors"
        >
          Open on localhost:{port}
        </a>
      )}
      {params.ctx === 'edit' && (
        // The CMS edit overlay captures clicks on editable content inside this iframe, so the
        // image-set manager is reached in a standalone tab (same preview params and token).
        <a
          href={`/preview?${new URLSearchParams(
            Object.entries(params).filter((e): e is [string, string] => typeof e[1] === 'string'),
          ).toString()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-12 right-3 z-[9999] rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-md hover:bg-gray-100 transition-colors"
        >
          Open image manager in new tab
        </a>
      )}
      <OptimizelyComponent content={content} />
    </>
  );
}

export default withAppContext(Page);
