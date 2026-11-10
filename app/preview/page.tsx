import { getClient, type PreviewParams } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { PreviewComponent } from '@optimizely/cms-sdk/react/client';
import Script from 'next/script';
import SiteChrome from '@/app/_components/SiteChrome';
import { demoSwitchEnabled, setAgentOverride } from '@/lib/agent/getAgent';
import { isAgentKey } from '@/lib/agent/personas';

// Preview is always per-request (preview tokens, draft versions) — never cached.
export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * CMS live-preview / on-page-editing route. The CMS opens this URL with preview
 * params (preview_token, key, ctx, ver, loc).
 *
 * Site chrome is added here by <SiteChrome> (the catch-all gets it from
 * app/[locale]/layout), so portal content can get the portal header.
 *
 * Uses PreviewComponent from /react/client (the docs' NextPreviewComponent lives
 * at @optimizely/cms-sdk/next, which is NOT exported in the installed v2.0.0).
 */
/** The header for previewed portal content, chosen by page type (the preview URL says nothing about the page). */
function previewChrome(typeName: string): 'signin' | 'agent' | 'plain' | 'portal' | undefined {
  if (typeName === 'AgentPortal') return 'signin';
  if (typeName === 'AgentDashboardExperience' || typeName === 'AgentProductExperience') return 'agent';
  if (typeName === 'AgentPriorities') return 'plain';
  return typeName.startsWith('Agent') ? 'portal' : undefined;
}

async function Page({ searchParams }: Props) {
  const rawParams = await searchParams;
  const params = rawParams as unknown as PreviewParams;
  const content = await getClient().getPreviewContent(params);

  // Independent Agent Portal content (types whose key starts with "Agent") is
  // previewed inside the portal chrome. `?agent=dana` previews it as that agent;
  // it is checked against the four known agents and only honoured while the demo
  // switch is on.
  const typeName = (content as { __typename?: string } | undefined)?.__typename ?? '';
  const isPortal = typeName.startsWith('Agent');
  // A dashboard fixed to one agent ("Show as agent") previews as that agent, header
  // included, whatever `?agent=` says; the header renders before the page body does.
  const pageAgent = (content as { ForAgent?: unknown } | undefined)?.ForAgent;
  if (isPortal) setAgentOverride(isAgentKey(pageAgent) ? pageAgent : demoSwitchEnabled() ? rawParams.agent : null);

  const injectorSrc = new URL(
    '/util/javascript/communicationinjector.js',
    process.env.OPTIMIZELY_CMS_URL,
  ).href;

  const port = process.env.PORT?.trim() || '3009';
  const relativePath = content?._metadata?.url?.default as string | undefined;

  return (
    <SiteChrome force={previewChrome(typeName)}>
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
      <OptimizelyComponent content={content} />
    </SiteChrome>
  );
}

export default withAppContext(Page);
