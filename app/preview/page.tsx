import { getClient, type PreviewParams } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { PreviewComponent } from '@optimizely/cms-sdk/react/client';
import Script from 'next/script';
import SiteChrome from '../_components/SiteChrome';

// Preview is always per-request (preview tokens, draft versions) — never cached.
export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * CMS live-preview / on-page-editing route. The CMS opens this URL with preview
 * params (preview_token, key, ctx, ver, loc). We branch the render shell by the
 * kind of content being previewed:
 *   - shared Block  → key contains "contentassets/"
 *   - Experience    → ctx === "experience" (Visual Builder)
 *   - Page          → everything else
 *
 * NOTE: confirm these discriminators against a real preview URL — the params are
 * logged once below in development so you can inspect the actual shape.
 *
 * Uses PreviewComponent from /react/client (the docs' NextPreviewComponent lives
 * at @optimizely/cms-sdk/next, which is NOT exported in the installed v2.0.0).
 */
async function Page({ searchParams }: Props) {
  const raw = await searchParams;
  const params = raw as unknown as PreviewParams;
  const content = await getClient().getPreviewContent(params);

  const key = typeof raw.key === 'string' ? raw.key : '';
  const isSharedBlock = key.includes('contentassets/');
  const isExperience = raw.ctx === 'experience' || '_experience' in raw;

  const injectorSrc = new URL(
    '/util/javascript/communicationinjector.js',
    process.env.OPTIMIZELY_CMS_URL,
  ).href;

  return (
    <>
      <Script src={injectorSrc} strategy="afterInteractive" />
      <PreviewComponent />
      {isSharedBlock ? (
        // A single shared block — preview it bare (no full-page chrome).
        <div className="preview-block-shell mx-auto max-w-3xl p-6">
          <OptimizelyComponent content={content} />
        </div>
      ) : isExperience ? (
        // Full experience — wrap in site chrome so preview matches the published page.
        <SiteChrome>
          <main className="preview-experience-shell">
            <OptimizelyComponent content={content} />
          </main>
        </SiteChrome>
      ) : (
        <SiteChrome>
          <OptimizelyComponent content={content} />
        </SiteChrome>
      )}
    </>
  );
}

export default withAppContext(Page);
