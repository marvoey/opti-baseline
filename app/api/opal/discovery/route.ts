/**
 * Opal (Mark) tool discovery. Opal calls this during tool-registry sync to learn
 * which tools exist and what parameters they take.
 *
 *   GET /api/opal/discovery
 *
 * `endpoint` is relative, as emitted by the Opal tools SDK: Opal resolves it against
 * the discovery URL, so `/tools/fetch_cms12_content` lands on
 * app/api/opal/tools/fetch_cms12_content/route.ts.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({
    functions: [
      {
        name: 'fetch_cms12_content',
        description:
          'Fetches published or draft Optimizely CMS 12 page/block content models using the Content Delivery REST API v3.0. Supports resolving by Content ID or by friendly URL route, with content area expansion.',
        endpoint: '/tools/fetch_cms12_content',
        http_method: 'POST',
        parameters: [
          {
            name: 'content_id',
            type: 'string',
            description:
              "The numeric CMS Content ID or GUID (e.g. '1042', '2010'). Omit if querying by match_url.",
            required: false,
          },
          {
            name: 'sub_path',
            type: 'string',
            description:
              "Optional sub-resource of content_id: 'children' to list immediate child items, or 'ancestors' for breadcrumbs.",
            required: false,
          },
          {
            name: 'match_url',
            type: 'string',
            description:
              "Friendly URL path to resolve (e.g. '/en/holiday-photo-books/'). Used when content_id is unknown.",
            required: false,
          },
          {
            name: 'expand',
            type: 'string',
            description:
              "Property expansion mode. Use '*' to fully expand nested ContentArea blocks, or a property name such as 'mainContentArea'. Defaults to '*'.",
            required: false,
          },
          {
            name: 'language',
            type: 'string',
            description: "Two-letter ISO language code (e.g. 'en'). Defaults to 'en'.",
            required: false,
          },
        ],
      },
    ],
  });
}
