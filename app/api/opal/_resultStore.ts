/**
 * Where Mark's reply waits for the browser's request. The store is the CMS: a
 * short-lived DRAFT item (never published, so it never reaches Graph or the
 * site) in a dedicated folder, keyed by the question's random id. The waiting
 * request reads it and deletes it straight away; a sweep removes anything left.
 *
 * Kept behind three functions so another backend could replace the CMS later.
 */

import { cmsStoreConfig } from '@/lib/askMark/config';
import { cleanResult, type MarkResult } from '@/lib/askMark/parsePayload';
import {
  createDraftContent,
  deleteContentPermanently,
  getContentVersions,
  listChildren,
} from '@/lib/cms/managementApi';

const CONTENT_TYPE = 'LibAskResult';
/** Items older than this are removed by the sweep. */
const MAX_AGE_SECONDS = 10 * 60;
const SWEEP_BATCH = 20;
const SWEEP_EVERY_MS = 2 * 60 * 1000;

function folder(): string {
  const cfg = cmsStoreConfig();
  if (!cfg) throw new Error('CMS store is not configured');
  return cfg.folderKey;
}

/** Item names carry their creation time (`r-<epoch seconds>-<id prefix>`) so the sweep needs no extra calls. */
function itemName(cid: string): string {
  return `r-${Math.floor(Date.now() / 1000)}-${cid.slice(0, 6)}`;
}

/** Store Mark's reply. Returns false if a reply for this id was already stored (first one wins). */
export async function putResult(cid: string, result: MarkResult): Promise<boolean> {
  const properties: Record<string, unknown> = {};
  if (result.intent) properties.Intent = result.intent;
  if (result.product) properties.Product = result.product;
  if (result.topic) properties.Topic = result.topic;
  if (result.coverage) properties.Coverage = result.coverage;
  if (result.state) properties.State = result.state;
  if (result.confidence !== undefined) properties.Confidence = result.confidence;
  if (result.reasoning) properties.Reasoning = result.reasoning;

  return createDraftContent({
    key: cid,
    contentType: CONTENT_TYPE,
    container: folder(),
    displayName: itemName(cid),
    properties,
  });
}

/** Property values may come back raw or wrapped as `{ value }`. */
function unwrap(v: unknown): unknown {
  return v && typeof v === 'object' && !Array.isArray(v) && 'value' in v ? (v as { value: unknown }).value : v;
}

/**
 * Read Mark's reply, then delete it. Returns undefined while no reply exists
 * yet. A failed delete is logged and left to the sweep; it never blocks the reply.
 */
export async function takeResult(cid: string): Promise<MarkResult | undefined> {
  const versions = await getContentVersions(cid);
  const props = versions?.find((v) => v.properties)?.properties;
  if (!props) return undefined;

  const result = cleanResult({
    intent: unwrap(props.Intent),
    product: unwrap(props.Product),
    topic: unwrap(props.Topic),
    coverage: unwrap(props.Coverage),
    state: unwrap(props.State),
    confidence: unwrap(props.Confidence),
    reasoning: unwrap(props.Reasoning),
  });

  try {
    await deleteContentPermanently(cid);
  } catch (err) {
    console.warn('[ask-mark] could not delete a collected reply; the sweep will remove it', {
      cid,
      error: err instanceof Error ? err.message : String(err),
    });
  }
  return result;
}

let lastSweep = 0;

/** Remove replies nobody collected. Runs at most every two minutes per server instance. */
export async function sweepResults(): Promise<void> {
  const now = Date.now();
  if (now - lastSweep < SWEEP_EVERY_MS) return;
  lastSweep = now;

  try {
    const nodes = await listChildren(folder());
    const cutoff = Math.floor(now / 1000) - MAX_AGE_SECONDS;
    let removed = 0;
    for (const node of nodes) {
      if (removed >= SWEEP_BATCH) break;
      const created = Number(/^r-(\d+)-/.exec(node.displayName ?? '')?.[1]);
      if (!node.key || !Number.isFinite(created) || created > cutoff) continue;
      await deleteContentPermanently(node.key);
      removed += 1;
    }
    if (removed) console.log(`[ask-mark] sweep removed ${removed} uncollected repl${removed === 1 ? 'y' : 'ies'}`);
  } catch (err) {
    console.warn('[ask-mark] sweep failed', err instanceof Error ? err.message : String(err));
  }
}
