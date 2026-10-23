# Step-by-Step Implementation Guide: Mark Tool for Optimizely CMS 12 REST API

This guide walks through creating, deploying, and registering a custom **Mark (Opal) Tool** in Next.js (App Router) that connects to your CMS 12 Content Delivery API endpoint at `/api/episerver/v3.0/[...path]` in the `opti-baseline` repository.

---

## 1. Architecture Overview

When you interact with Mark in chat, the request flows as follows:

```
+-----------------------------------------------------------------------------------+
| 1. Discovery Phase                                                                |
| Mark AI Orchestrator  --[ GET /api/opal/discovery ]-->  Your Next.js App          |
|                       <--[ Tool Manifest JSON ]-------  (Inspects parameters)     |
+-----------------------------------------------------------------------------------+
| 2. Execution Phase                                                                |
| Mark AI Orchestrator  --[ POST /api/opal/tools/fetch_cms12_content ]--> Next.js    |
| (Passes { content_id: "1042", expand: "*" })                                      |
|                                                                                   |
| Next.js Tool Handler  --[ Internal GET /api/episerver/v3.0/content/1042?expand=* ]|
|                       <--[ Returns ContentApiModel JSON ]-------------------------|
|                                                                                   |
| Next.js Tool Handler  --[ Formats JSON & Summary ]--> Mark AI Chat Stream         |
+-----------------------------------------------------------------------------------+
```

---

## Step 1: Verify the Mock CMS 12 Delivery Route

Ensure your catch-all Next.js route is present at `app/api/episerver/v3.0/[...path]/route.ts`.

### `app/api/episerver/v3.0/[...path]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { executeCmsEndpoint, INITIAL_CMS_DATABASE } from "@/lib/cmsDelivery";

export async function GET(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  const pathSegments = params.path || [];
  const fullApiPath = `/api/episerver/v3.0/${pathSegments.join("/")}`;

  const searchParams = request.nextUrl.searchParams;
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const result = executeCmsEndpoint(fullApiPath, query, INITIAL_CMS_DATABASE);

  return NextResponse.json(result.data, {
    status: result.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      "X-Opti-Mock-Endpoint": fullApiPath,
    },
  });
}
```

---

## Step 2: Implement the Mark / Opal Discovery Endpoint

Mark calls this endpoint during tool registry synchronization to read tool schemas and parameter rules.

Create `app/api/opal/discovery/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  const manifest = {
    schema_version: "2024-01-01",
    name: "Optimizely CMS 12 Content Delivery Toolset",
    description: "Exposes Optimizely CMS 12 headless Content Delivery REST API endpoints to Mark AI.",
    tools: [
      {
        name: "fetch_cms12_content",
        description:
          "Fetches published or draft Optimizely CMS 12 page/block content models using the Content Delivery REST API v3.0. Supports resolving by Content ID or by friendly URL route, with content area expansion.",
        endpoint: `${origin}/api/opal/tools/fetch_cms12_content`,
        http_method: "POST",
        parameters: {
          type: "object",
          properties: {
            content_id: {
              type: "string",
              description:
                "The numeric CMS Content ID or GUID (e.g. '1042', '5', '4821'). Omit if querying by match_url.",
            },
            sub_path: {
              type: "string",
              description:
                "Optional sub-resource: 'children' to list immediate child pages, or 'ancestors' for breadcrumbs.",
              enum: ["", "children", "ancestors"],
            },
            match_url: {
              type: "string",
              description:
                "Friendly URL path to resolve (e.g., '/en/holiday-sale/' or '/products/disney-collection/'). Used when content_id is unknown.",
            },
            expand: {
              type: "string",
              description:
                "Property expansion mode. Use '*' to fully serialize and expand nested ContentArea blocks, or provide a comma-separated list of properties (e.g. 'mainContentArea').",
              default: "*",
            },
            language: {
              type: "string",
              description: "Two-letter ISO language code (e.g. 'en', 'sv', 'de'). Defaults to 'en'.",
              default: "en",
            },
          },
          required: [],
        },
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

---

## Step 3: Implement the Tool Execution Endpoint

Create `app/api/opal/tools/fetch_cms12_content/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

interface ToolPayload {
  content_id?: string;
  sub_path?: string;
  match_url?: string;
  expand?: string;
  language?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ToolPayload = await request.json();
    const origin = request.nextUrl.origin;

    // 1. Build the target REST endpoint URL
    let targetPath = "/api/episerver/v3.0/content/";
    if (body.content_id) {
      targetPath += body.content_id;
      if (body.sub_path) {
        targetPath += `/${body.sub_path}`;
      }
    }

    const queryParams = new URLSearchParams();
    if (body.expand) queryParams.set("expand", body.expand);
    if (body.match_url) queryParams.set("matchUrl", body.match_url);
    if (body.language) queryParams.set("language", body.language);

    const queryString = queryParams.toString();
    const fetchUrl = `${origin}${targetPath}${queryString ? `?${queryString}` : ""}`;

    // 2. Fetch the JSON from the mock CMS 12 REST endpoint
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `CMS 12 Endpoint returned ${response.status}: ${response.statusText}`,
          requested_url: fetchUrl,
        },
        { status: 200 } // Return 200 to Mark with structured error object
      );
    }

    const data = await response.json();

    // 3. Return structured payload and human-readable summary to Mark
    return NextResponse.json({
      success: true,
      endpoint_called: fetchUrl,
      content_name: data.name || (Array.isArray(data) ? `Collection (${data.length} items)` : "Unknown"),
      content_type: data.contentType || [],
      content_id: data.contentLink?.id || body.content_id || null,
      data: data,
      summary: Array.isArray(data)
        ? `Found ${data.length} items for query.`
        : `Successfully retrieved ${data.contentType?.[1] || "content"} '${data.name}' (ID: ${data.contentLink?.id}) in '${data.language?.name || "en"}' with expand='${body.expand || "*"}'.`,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to execute CMS 12 tool",
    });
  }
}

// Handle CORS Preflight for Mark orchestrator
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

---

## Step 4: Create the Client-Side React Consumer Hook

In your Next.js frontend, consume this endpoint cleanly using React hooks:

### `lib/hooks/useCmsContent.ts`

```typescript
import { useState, useEffect } from "react";

export function useCmsContent(contentId?: string, expand: string = "*") {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contentId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/episerver/v3.0/content/${contentId}?expand=${encodeURIComponent(expand)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setData(json);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [contentId, expand]);

  return { data, isLoading, error };
}
```

---

## Step 5: Register the Tool in Optimizely Opal / Mark

1. **Deploy your Next.js application** (e.g., to Vercel or your publicly accessible staging domain).
2. Go to the **Optimizely Opal Instance Admin Portal**:
   - `https://opal.optimizely.com/instances/{your_instance_id}/tools`
3. Click **Add Tool Registry / Custom Tool**.
4. Configure the settings:
   - **Tool Name**: `Optimizely CMS 12 REST Delivery`
   - **Discovery URL**: `https://<your-deployed-domain>/api/opal/discovery`
   - **Authentication**: `None` (or Bearer Token if secured)
5. Click **Test & Sync Discovery**.
   - Opal will call `GET /api/opal/discovery` and register the `fetch_cms12_content` function.

---

## Step 6: Verify in Mark AI Chat

Once registered, you can ask Mark natural language queries in chat. Mark will automatically invoke your custom tool:

- *"Mark, fetch CMS 12 content for page 1042 with all content areas expanded."*
- *"Check the nested blocks under ID 1042 and tell me if there are any mobile override conflicts."*
- *"Resolve the friendly URL '/en/holiday-sale/' and return the hero banner properties."*