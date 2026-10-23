// --- Content store and request engine for the Optimizely CMS 12 Content Delivery API (v3.0) ---
// Shared by the live route handlers (app/api/episerver/v3.0) and the /demo/api explorer.
export const INITIAL_CMS_DATABASE = {
  // Start Page (ID: 5)
  "5": {
    contentLink: {
      id: 5,
      workId: 1,
      guidValue: "e7b0a70f-155e-4efb-86ce-b119cb497bf4",
      providerName: null,
      url: "/en/",
      expanded: null
    },
    name: "Alloy Plan - Global Enterprise",
    language: { name: "en" },
    existingLanguages: [{ name: "en" }, { name: "sv" }, { name: "de" }],
    masterLanguage: { name: "en" },
    contentType: ["Page", "StartPage"],
    parentLink: {
      id: 1,
      workId: 0,
      guidValue: "00000000-0000-0000-0000-000000000001",
      url: null
    },
    routeSegment: null,
    url: "/en/",
    changed: "2024-03-12T10:15:30Z",
    created: "2023-11-01T08:00:00Z",
    startPublish: "2023-11-01T08:00:00Z",
    stopPublish: null,
    saved: "2024-03-12T10:15:30Z",
    status: "Published",
    category: {
      value: ["Enterprise", "B2B SaaS"],
      propertyDataType: "PropertyCategory"
    },
    metaTitle: {
      value: "Optimizely CMS 12 - Content Delivery Experience",
      propertyDataType: "PropertyLongString"
    },
    heroHeading: {
      value: "Enterprise Headless with CMS 12",
      propertyDataType: "PropertyLongString"
    },
    heroLead: {
      value: "Deliver structured content seamlessly to any channel using the official Optimizely Content Delivery REST API v3.0.",
      propertyDataType: "PropertyLongString"
    },
    mainBody: {
      value: "<p>Welcome to the <strong>Optimizely CMS 12</strong> headless frontend. The Content Delivery API translates your IContent graph into clean JSON models with full type fidelity, localizations, and expandability.</p>",
      propertyDataType: "PropertyXhtmlString"
    },
    mainContentArea: {
      value: [
        {
          contentLink: {
            id: 101,
            workId: 1,
            guidValue: "f2a1b3c4-d5e6-47a8-9b0c-1d2e3f4a5b6c"
          },
          displayOption: "full",
          expanded: {
            name: "Cloud Native .NET 6+ Architecture",
            contentType: ["Block", "TeaserBlock"],
            heading: { value: "High-Performance REST Serialization", propertyDataType: "PropertyLongString" },
            description: { value: "Engineered on modern ASP.NET Core with cross-platform container support and fast JSON serialization.", propertyDataType: "PropertyLongString" },
            callToActionText: { value: "Explore Technical Specs", propertyDataType: "PropertyLongString" },
            targetUrl: { value: "/en/products/cloud-engine/", propertyDataType: "PropertyUrl" },
            theme: { value: "indigo", propertyDataType: "PropertyLongString" }
          }
        },
        {
          contentLink: {
            id: 102,
            workId: 1,
            guidValue: "a9b8c7d6-e5f4-3210-fedc-ba9876543210"
          },
          displayOption: "half",
          expanded: {
            name: "Omnichannel Delivery Model",
            contentType: ["Block", "FeatureBlock"],
            heading: { value: "Instant Expandability and Caching", propertyDataType: "PropertyLongString" },
            description: { value: "Query nested blocks via ?expand=* and reduce network hops with HTTP surrogate cache headers.", propertyDataType: "PropertyLongString" },
            callToActionText: { value: "Learn More", propertyDataType: "PropertyLongString" },
            targetUrl: { value: "/en/products/omnichannel/", propertyDataType: "PropertyUrl" },
            theme: { value: "emerald", propertyDataType: "PropertyLongString" }
          }
        },
        {
          contentLink: {
            id: 103,
            workId: 1,
            guidValue: "c4d5e6f7-1234-5678-90ab-cdef12345678"
          },
          displayOption: "half",
          expanded: {
            name: "Experimentation and Personalization",
            contentType: ["Block", "FeatureBlock"],
            heading: { value: "Dynamic Property Modeling", propertyDataType: "PropertyLongString" },
            description: { value: "Support for IPersonalizableProperty enables targeted payloads aligned with visitor segments.", propertyDataType: "PropertyLongString" },
            callToActionText: { value: "View Audiences", propertyDataType: "PropertyLongString" },
            targetUrl: { value: "/en/personalization/", propertyDataType: "PropertyUrl" },
            theme: { value: "purple", propertyDataType: "PropertyLongString" }
          }
        }
      ],
      propertyDataType: "PropertyContentArea"
    }
  },

  // Standard Page (ID: 6)
  "6": {
    contentLink: {
      id: 6,
      workId: 1,
      guidValue: "11112222-3333-4444-5555-666677778888",
      providerName: null,
      url: "/en/products/cloud-engine/",
      expanded: null
    },
    name: "Cloud Engine Overview",
    language: { name: "en" },
    existingLanguages: [{ name: "en" }, { name: "sv" }],
    masterLanguage: { name: "en" },
    contentType: ["Page", "StandardPage"],
    parentLink: {
      id: 5,
      workId: 1,
      guidValue: "e7b0a70f-155e-4efb-86ce-b119cb497bf4",
      url: "/en/"
    },
    routeSegment: "cloud-engine",
    url: "/en/products/cloud-engine/",
    changed: "2024-02-18T14:40:00Z",
    created: "2024-01-15T11:00:00Z",
    startPublish: "2024-01-15T11:00:00Z",
    stopPublish: null,
    saved: "2024-02-18T14:40:00Z",
    status: "Published",
    category: {
      value: ["Infrastructure", "Cloud"],
      propertyDataType: "PropertyCategory"
    },
    heading: {
      value: "Optimizely DXP and Cloud Architecture",
      propertyDataType: "PropertyLongString"
    },
    mainIntro: {
      value: "Architected for 99.99% uptime, distributed globally across Microsoft Azure with built-in Cloudflare CDN edge routing.",
      propertyDataType: "PropertyLongString"
    },
    mainBody: {
      value: "<p>The CMS 12 architecture decouples editors from frontend renderers while maintaining full preview capabilities via Content Delivery tokens.</p><ul><li>Automatic Webhook notifications on publish</li><li>Stateless microservice-friendly deployment</li><li>Granular user and role permissions</li></ul>",
      propertyDataType: "PropertyXhtmlString"
    },
    mainContentArea: {
      value: [
        {
          contentLink: { id: 104, guidValue: "99887766-5544-3322-1100-aabbccddeeff" },
          displayOption: "full",
          expanded: {
            name: "High Scalability Metrics",
            contentType: ["Block", "TeaserBlock"],
            heading: { value: "Sub-50ms Response Times", propertyDataType: "PropertyLongString" },
            description: { value: "Edge cached endpoints deliver raw JSON payloads with zero database cold starts.", propertyDataType: "PropertyLongString" },
            callToActionText: { value: "Read Benchmark Report", propertyDataType: "PropertyLongString" },
            targetUrl: { value: "/en/benchmarks/", propertyDataType: "PropertyUrl" },
            theme: { value: "blue", propertyDataType: "PropertyLongString" }
          }
        }
      ],
      propertyDataType: "PropertyContentArea"
    }
  },

  // About Us Page (ID: 7)
  "7": {
    contentLink: {
      id: 7,
      workId: 1,
      guidValue: "22334455-6677-8899-00aa-bbccddeeff11",
      providerName: null,
      url: "/en/about-us/",
      expanded: null
    },
    name: "About Alloy Global",
    language: { name: "en" },
    existingLanguages: [{ name: "en" }],
    masterLanguage: { name: "en" },
    contentType: ["Page", "StandardPage"],
    parentLink: {
      id: 5,
      workId: 1,
      guidValue: "e7b0a70f-155e-4efb-86ce-b119cb497bf4",
      url: "/en/"
    },
    routeSegment: "about-us",
    url: "/en/about-us/",
    changed: "2024-01-20T09:20:00Z",
    created: "2024-01-10T12:00:00Z",
    startPublish: "2024-01-10T12:00:00Z",
    stopPublish: null,
    saved: "2024-01-20T09:20:00Z",
    status: "Published",
    category: {
      value: ["Corporate"],
      propertyDataType: "PropertyCategory"
    },
    heading: {
      value: "Pioneering Digital Experience Since 1994",
      propertyDataType: "PropertyLongString"
    },
    mainIntro: {
      value: "We help the world's most ambitious brands unlock their digital potential through experimentation, content management, and commerce.",
      propertyDataType: "PropertyLongString"
    },
    mainBody: {
      value: "<p>Headquartered in Minneapolis with hubs in Stockholm, London, and Sydney, we power millions of digital touchpoints worldwide.</p>",
      propertyDataType: "PropertyXhtmlString"
    },
    mainContentArea: {
      value: [],
      propertyDataType: "PropertyContentArea"
    }
  }
};

export const SITE_DEFINITION = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Alloy Global Enterprise Site",
    siteUrl: "https://demo.optimizely.com/",
    startPage: {
      id: 5,
      guidValue: "e7b0a70f-155e-4efb-86ce-b119cb497bf4",
      url: "/en/"
    },
    languages: [
      { name: "en", displayName: "English", isMasterLanguage: true },
      { name: "sv", displayName: "Svenska", isMasterLanguage: false },
      { name: "de", displayName: "Deutsch", isMasterLanguage: false }
    ]
  }
];

// --- REST handler engine ---
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type CmsItem = any;

export type CmsResponse = {
  status: number;
  statusText: string;
  data: CmsItem;
  headers?: Record<string, string>;
};

export type CmsQuery = { expand?: string; matchUrl?: string; language?: string };

export type CmsEndpointOptions = {
  /** Friendly URL -> content id, for stores whose items carry no `url`. */
  routes?: Record<string, string>;
  site?: CmsItem;
};

// Looks an item up by id or GUID, at the top level or nested anywhere in a content area / children tree.
function findContent(database: Record<string, CmsItem>, identifier: string): CmsItem | undefined {
  if (database[identifier]) return database[identifier];
  const visit = (node: CmsItem): CmsItem | undefined => {
    if (!node || typeof node !== 'object') return undefined;
    const link = node.contentLink;
    if (link && (String(link.id) === identifier || link.guidValue === identifier)) return node;
    const kids = Array.isArray(node) ? node : Object.values(node);
    for (const kid of kids) {
      const hit = visit(kid);
      if (hit) return hit;
    }
    return undefined;
  };
  return visit(Object.values(database));
}

export function executeCmsEndpoint(
  path: string,
  queryParams: CmsQuery = {},
  database: Record<string, CmsItem>,
  options: CmsEndpointOptions = {},
): CmsResponse {
  const cleanPath = path.trim().replace(/^https?:\/\/[^\/]+/, "");
  
  // 1. Site Definition: /api/episerver/v3.0/site/
  if (cleanPath.startsWith("/api/episerver/v3.0/site")) {
    return {
      status: 200,
      statusText: "OK",
      data: options.site ?? SITE_DEFINITION,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=3600"
      }
    };
  }

  // 2. Querying by matchUrl: /api/episerver/v3.0/content/?matchUrl=/en/alloy-plan/
  if (queryParams.matchUrl) {
    const targetUrl = queryParams.matchUrl.trim().toLowerCase();
    const routedId = Object.entries(options.routes ?? {}).find(([url]) => url.toLowerCase() === targetUrl)?.[1];
    const matched = routedId
      ? database[routedId]
      : Object.values(database).find(item => item.url && item.url.toLowerCase() === targetUrl);
    if (matched) {
      return processExpand(matched, queryParams.expand);
    }
    return {
      status: 404,
      statusText: "Not Found",
      data: {
        type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
        title: "Content not found",
        status: 404,
        detail: `No content matched the friendly route segment '${queryParams.matchUrl}'`
      },
      headers: { "content-type": "application/problem+json; charset=utf-8" }
    };
  }

  // 3. Children endpoint: /api/episerver/v3.0/content/{id}/children
  const childrenMatch = cleanPath.match(/\/api\/episerver\/v3\.0\/content\/([^\/\?]+)\/children/);
  if (childrenMatch) {
    const parentId = parseInt(childrenMatch[1], 10);
    const children = Object.values(database).filter(item => item.parentLink && item.parentLink.id === parentId);
    return {
      status: 200,
      statusText: "OK",
      data: children.map(child => processExpand(child, queryParams.expand).data),
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60"
      }
    };
  }

  // 4. Ancestors endpoint: /api/episerver/v3.0/content/{id}/ancestors
  const ancestorsMatch = cleanPath.match(/\/api\/episerver\/v3\.0\/content\/([^\/\?]+)\/ancestors/);
  if (ancestorsMatch) {
    const childId = ancestorsMatch[1];
    const item = findContent(database, childId);
    if (!item) {
      return { status: 404, statusText: "Not Found", data: { error: "Content ID not found" } };
    }
    const ancestors = [];
    let curr = item;
    while (curr && curr.parentLink && curr.parentLink.id && database[curr.parentLink.id]) {
      curr = database[curr.parentLink.id];
      ancestors.push(processExpand(curr, "none").data);
    }
    return {
      status: 200,
      statusText: "OK",
      data: ancestors,
      headers: { "content-type": "application/json; charset=utf-8" }
    };
  }

  // 5. Standard Content by ID or GUID: /api/episerver/v3.0/content/{id}
  const contentMatch = cleanPath.match(/\/api\/episerver\/v3\.0\/content\/([^\/\?]+)/);
  if (contentMatch) {
    const identifier = contentMatch[1];
    const found = findContent(database, identifier);
    if (found) {
      return processExpand(found, queryParams.expand);
    }
    return {
      status: 404,
      statusText: "Not Found",
      data: {
        type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
        title: "Content item not found",
        status: 404,
        detail: `Item '${identifier}' was not found in the Content Repository.`
      },
      headers: { "content-type": "application/problem+json; charset=utf-8" }
    };
  }

  // Default Fallback
  return {
    status: 400,
    statusText: "Bad Request",
    data: { error: "Unknown CMS 12 Content Delivery API endpoint structure." },
    headers: { "content-type": "application/json" }
  };
}

// Helper to handle ?expand=* or ?expand=mainContentArea
function processExpand(item: CmsItem, expandParam?: string): CmsResponse {
  const clone = JSON.parse(JSON.stringify(item));
  const isExpandAll = expandParam === "*" || expandParam === "mainContentArea";

  if (!isExpandAll && clone.mainContentArea && Array.isArray(clone.mainContentArea.value)) {
    // When NOT expanded, Optimizely CD API strips out the expanded block body, returning only reference
    clone.mainContentArea.value = clone.mainContentArea.value.map((block: CmsItem) => ({
      contentLink: block.contentLink,
      displayOption: block.displayOption
    }));
  }

  return {
    status: 200,
    statusText: "OK",
    data: clone,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=30, stale-while-revalidate=120",
      "x-optimizely-routed": "true"
    }
  };
}
