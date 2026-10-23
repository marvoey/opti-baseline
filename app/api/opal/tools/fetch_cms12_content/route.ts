import type { NextRequest } from 'next/server';
import { executeCmsEndpoint, type CmsQuery } from '@/lib/cmsDelivery';
import { CAMPAIGN_DATABASE, CAMPAIGN_ROUTES, CAMPAIGN_SITE } from '@/lib/cmsCampaignData';

/**
 * Opal (Mark) tool: fetch_cms12_content.
 *
 *   POST /api/opal/tools/fetch_cms12_content
 *   { content_id?, sub_path?, match_url?, expand?, language? }
 *
 * Calls the same engine as /api/episerver/v3.0/[...path] directly (no HTTP
 * self-fetch), so the tool and the live API cannot drift apart. Read-only.
 */
const SUB_PATHS = ['children', 'ancestors'];
const ID_PATTERN = /^[A-Za-z0-9-]{1,64}$/; // numeric id or GUID
const MAX_STRING = 512;

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length <= MAX_STRING && value.trim() !== ''
    ? value.trim()
    : undefined;
}

// Opal expects a structured body it can show the model, so failures return 200.
function failure(error: string) {
  return Response.json({ success: false, error });
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const json: unknown = await request.json();
    body = json && typeof json === 'object' ? (json as Record<string, unknown>) : {};
  } catch {
    return failure('Request body must be valid JSON.');
  }

  // Opal may wrap tool arguments in a `parameters` object.
  const args =
    body.parameters && typeof body.parameters === 'object'
      ? (body.parameters as Record<string, unknown>)
      : body;

  const contentId = str(args.content_id);
  const subPath = str(args.sub_path);
  const matchUrl = str(args.match_url);
  const expand = str(args.expand) ?? '*';
  const language = str(args.language);

  if (contentId && !ID_PATTERN.test(contentId)) return failure('content_id must be a numeric ID or GUID.');
  if (subPath && !SUB_PATHS.includes(subPath)) return failure("sub_path must be 'children' or 'ancestors'.");
  if (subPath && !contentId) return failure('sub_path requires content_id.');
  if (!contentId && !matchUrl) return failure('Provide content_id or match_url.');

  let path = '/api/episerver/v3.0/content';
  if (contentId) path += `/${contentId}${subPath ? `/${subPath}` : ''}`;

  const query: CmsQuery = { expand };
  if (matchUrl) query.matchUrl = matchUrl;
  if (language) query.language = language;

  const res = executeCmsEndpoint(path, query, CAMPAIGN_DATABASE, {
    routes: CAMPAIGN_ROUTES,
    site: CAMPAIGN_SITE,
  });

  if (res.status >= 400) {
    return Response.json(
      {
        success: false,
        error: `CMS 12 endpoint returned ${res.status}: ${res.statusText}`,
        endpoint_called: path,
        detail: res.data?.detail ?? res.data?.error,
      },
    );
  }

  const data = res.data;
  const contentType: string[] = Array.isArray(data?.contentType) ? data.contentType : [];

  return Response.json(
    {
      success: true,
      endpoint_called: path + (matchUrl ? `?matchUrl=${matchUrl}` : ''),
      content_name: data?.name ?? (Array.isArray(data) ? `Collection (${data.length} items)` : 'Unknown'),
      content_type: contentType,
      content_id: data?.contentLink?.id ?? contentId ?? null,
      data,
      summary: Array.isArray(data)
        ? `Found ${data.length} items for query.`
        : `Retrieved ${contentType[contentType.length - 1] ?? 'content'} '${data?.name}' (ID: ${data?.contentLink?.id}) with expand='${expand}'.`,
    },
  );
}
