import type { NextRequest } from 'next/server';
import { executeCmsEndpoint, type CmsQuery } from '@/lib/cmsDelivery';
import { CAMPAIGN_DATABASE, CAMPAIGN_ROUTES, CAMPAIGN_SITE } from '@/lib/cmsCampaignData';

/**
 * Optimizely CMS 12 Content Delivery API (v3.0) surface:
 *
 *   GET /api/episerver/v3.0/site
 *   GET /api/episerver/v3.0/content?matchUrl=/en/about-us/&expand=*
 *   GET /api/episerver/v3.0/content/{id|guid}?expand=*
 *   GET /api/episerver/v3.0/content/{id}/children
 *   GET /api/episerver/v3.0/content/{id}/ancestors
 *
 * Serves the nested campaign page (id 1042) from lib/cmsCampaignData.ts: blocks nested
 * three levels deep with controlTab / deviceTabs. Any nested block id (2010, 3055, 4892)
 * also resolves on /content/{id}.
 *
 * One catch-all delegates to the shared engine in lib/cmsDelivery.ts so the
 * live API and the /demo/api explorer cannot drift apart.
 */
export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const query: CmsQuery = {};
  const expand = searchParams.get('expand');
  const matchUrl = searchParams.get('matchUrl');
  const language = searchParams.get('language');
  if (expand) query.expand = expand;
  if (matchUrl) query.matchUrl = matchUrl;
  if (language) query.language = language;

  const res = executeCmsEndpoint(pathname, query, CAMPAIGN_DATABASE, {
    routes: CAMPAIGN_ROUTES,
    site: CAMPAIGN_SITE,
  });

  return Response.json(res.data, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers ?? {},
  });
}
