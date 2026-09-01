/**
 * Create real Optimizely CMS SaaS content from the Agentic Studio's
 * generated composition AST (app/_components/agentic-intent-composition.jsx),
 * via the Content Management API (CMA) — the same OAuth client-credentials
 * client as lib/cms/contentTypes.ts (`@optimizely/cms-sdk`'s GraphClient is
 * read-only and cannot create/publish content).
 *
 * Composition node shape below was confirmed against a real, published
 * BlankExperience in the connected CMS instance (via the opal-cms MCP
 * cms_get_content_data / GraphQL tools), not just the OpenAPI schema:
 *   - the composition root itself is a CompositionNode with
 *     nodeType: "experience" (not "root"), layoutType: "outline".
 *   - section/row/column/component nodes use nodeType
 *     "section" | "row" | "column" | "component".
 *   - a richText-typed property's value inside a composition node is
 *     `{ value: { html: "<...>" } }` — no "json" key is required on write.
 */

import { MISSING_CREDENTIALS_MESSAGE, getAuthorizedClient } from './cmaClient';

type AstComponentNode = {
  type: string;
  nodeType: 'component';
  key: string;
  displayName?: string;
  properties?: Record<string, unknown>;
};

type AstColumnNode = {
  type: 'Column';
  nodeType: 'column';
  key: string;
  displayTemplateKey?: string;
  nodes: AstComponentNode[];
};

type AstRowNode = {
  type: 'Row';
  nodeType: 'row';
  key: string;
  displayTemplateKey?: string;
  nodes: AstColumnNode[];
};

type AstSectionNode = {
  type: string;
  nodeType: 'section';
  layoutType: string;
  displayName?: string;
  key: string;
  displayTemplateKey?: string;
  displaySettings?: Record<string, unknown>;
  nodes: AstRowNode[];
};

export type FinalCompositionAst = {
  type: string;
  nodeType: 'experience';
  layoutType: string;
  displayName?: string;
  key: string;
  nodes: AstSectionNode[];
};

type CompositionNode = {
  id: string;
  displayName?: string;
  nodeType: string;
  layoutType?: string;
  displaySettings?: { displayTemplate: string; settings?: Record<string, string> };
  component?: { contentType: string; properties?: Record<string, unknown> };
  nodes?: CompositionNode[];
};

/** Wrap a RichText element's plain-text fields into the CMA's richText property shape. */
function richTextValue(headline?: unknown, body?: unknown): { value: { html: string } } {
  const headingHtml = headline ? `<h2>${escapeHtml(String(headline))}</h2>` : '';
  const bodyHtml = body ? String(body) : '';
  return { value: { html: `${headingHtml}${bodyHtml}` } };
}

/**
 * The CMA returns RFC 7807 problem+json bodies (`{ status, title, detail }`).
 * Surface `detail` when present, and add a pointed hint for the 403
 * "Required access is 'create'" case — the API Client needs content
 * read/write scope granted in CMS admin, not just content-type scope.
 */
function describeCmaError(status: number, bodyText: string): string {
  let detail = bodyText;
  try {
    const parsed = JSON.parse(bodyText) as { detail?: string; title?: string };
    detail = parsed.detail || parsed.title || bodyText;
  } catch {
    // not JSON, use the raw body
  }
  const hint =
    status === 403
      ? ' — grant this API Client content read/write access in CMS admin → Settings → API Clients (it may currently be scoped to content types only).'
      : '';
  return `Request failed (${status})${detail ? ': ' + detail : ''}${hint}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Map one RichText element's AST properties to its CMA component.properties. */
function mapComponentProperties(node: AstComponentNode): Record<string, unknown> {
  const props = node.properties ?? {};
  if (node.type === 'RichText') {
    return { Body: richTextValue(props.headline, props.richTextContent) };
  }
  return props;
}

/** Map one component-type key from the AST to the registered CMS content-type key. */
function mapComponentContentType(astType: string): string {
  if (astType === 'RichText') return 'RichTextBlock';
  return astType;
}

/**
 * Translate the AST produced by AgenticWorkflowStudio's simulated pipeline
 * (app/_components/agentic-intent-composition.jsx `finalCompositionAst`)
 * into the CMA's CompositionNode[] shape, ready to hand to `createExperience`.
 */
export function mapAstToComposition(ast: FinalCompositionAst): CompositionNode[] {
  return ast.nodes.map((section): CompositionNode => ({
    id: section.key,
    displayName: section.displayName,
    nodeType: 'section',
    layoutType: section.layoutType,
    displaySettings: section.displayTemplateKey
      ? { displayTemplate: section.displayTemplateKey }
      : undefined,
    component: { contentType: 'BlankSection' },
    nodes: section.nodes.map((row): CompositionNode => ({
      id: row.key,
      nodeType: 'row',
      nodes: row.nodes.map((column): CompositionNode => ({
        id: column.key,
        nodeType: 'column',
        nodes: column.nodes.map((component): CompositionNode => ({
          id: component.key,
          displayName: component.displayName,
          nodeType: 'component',
          component: {
            contentType: mapComponentContentType(component.type),
            properties: mapComponentProperties(component),
          },
        })),
      })),
    })),
  }));
}

export type CreateExperienceInput = {
  displayName: string;
  routeSegment: string;
  ast: FinalCompositionAst;
};

export type CreateExperienceResult =
  | { ok: true; key: string; placed: boolean }
  | {
      ok: false;
      reason: 'missing-credentials' | 'error';
      message: string;
    };

/**
 * Create a BlankExperience content item from a generated AST. Fails soft
 * (never throws) so callers can render an actionable message, matching the
 * pattern in lib/cms/contentTypes.ts.
 */
export async function createExperience(
  input: CreateExperienceInput,
): Promise<CreateExperienceResult> {
  let client;
  try {
    client = await getAuthorizedClient();
  } catch (err) {
    return { ok: false, reason: 'error', message: err instanceof Error ? err.message : String(err) };
  }
  if (!client) {
    return { ok: false, reason: 'missing-credentials', message: MISSING_CREDENTIALS_MESSAGE };
  }

  const containerKey = process.env.OPTIMIZELY_CMS_ROOT_CONTAINER_KEY?.trim();
  const locale = process.env.OPTIMIZELY_DEFAULT_LOCALE?.trim() || 'en';

  const body = {
    contentType: 'BlankExperience',
    ...(containerKey ? { container: containerKey } : {}),
    initialVersion: {
      displayName: input.displayName,
      locale,
      routeSegment: input.routeSegment,
      composition: {
        id: input.ast.key,
        displayName: input.displayName,
        nodeType: 'experience',
        layoutType: 'outline',
        nodes: mapAstToComposition(input.ast),
      },
    },
  };

  try {
    const res = await fetch(`${client.base}/v1/content`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${client.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      return { ok: false, reason: 'error', message: describeCmaError(res.status, errBody) };
    }
    const created = (await res.json()) as { key?: string };
    if (!created.key) {
      return { ok: false, reason: 'error', message: 'Create succeeded but response had no key.' };
    }
    return { ok: true, key: created.key, placed: Boolean(containerKey) };
  } catch (err) {
    return { ok: false, reason: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}

export type PublishExperienceResult = { ok: boolean; message?: string };

/** Publish version 1 of a freshly created content item. */
export async function publishExperience(key: string): Promise<PublishExperienceResult> {
  let client;
  try {
    client = await getAuthorizedClient();
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
  if (!client) return { ok: false, message: MISSING_CREDENTIALS_MESSAGE };

  try {
    const res = await fetch(
      `${client.base}/v1/content/${encodeURIComponent(key)}/versions/1:publish`,
      {
        method: 'POST',
        headers: { authorization: `Bearer ${client.token}` },
      },
    );
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, message: describeCmaError(res.status, body) };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
