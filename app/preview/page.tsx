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

  // OPTIMIZELY_CMS_URL is the authoritative server-side var; fall back to the
  // NEXT_PUBLIC_ variant (available at build time on Vercel) if the server-only
  // one isn't set. Skip the script entirely rather than crashing with Invalid URL.
  const cmsBase =
    process.env.OPTIMIZELY_CMS_URL ?? process.env.NEXT_PUBLIC_OPTIMIZELY_CMS_URL;
  const injectorSrc = cmsBase
    ? new URL('/util/javascript/communicationinjector.js', cmsBase).href
    : null;

  return (
    <>
      {injectorSrc && <Script src={injectorSrc} strategy="afterInteractive" />}
      <PreviewComponent />
      <OptimizelyComponent content={content} />
    </>
  );
}

export default withAppContext(Page);
