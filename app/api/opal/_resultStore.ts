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
  CmsRateLimitedError,
  contentExists,
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

/** A readable name for the item in the CMS (the sweep uses the item's `created` time, not its name). */
function itemName(cid: string): string {
  return `r-${Math.floor(Date.now() / 1000)}-${cid.slice(0, 6)}`;
}

/**
 * Call this when a question starts, without waiting for it. Measured against the
 * live CMS: creating an item takes about 1.2 s right after the CMS has been asked
 * about that key, but about 0.1 s once that first (slow, about 1 s) lookup is a few
 * seconds old. Mark takes seconds to answer, so doing the lookup now means the
 * reply is stored in ~0.1 s instead of ~1.2 s. Failure is harmless: the create is
 * just slower.
 */
export function prepareResult(cid: string): void {
  void getContentVersions(cid).catch(() => undefined);
}

/** Store Mark's reply. Returns false if a reply for this id was already stored (first one wins). */
export async function putResult(cid: string, result: MarkResult): Promise<boolean> {
  // The API wants each property wrapped as { value } (the same shape it returns on reads).
  const properties: Record<string, { value: unknown }> = {};
  const set = (name: string, value: unknown) => {
    if (value !== undefined && value !== '') properties[name] = { value };
  };
  set('Intent', result.intent);
  set('Product', result.product);
  set('Topic', result.topic);
  set('Coverage', result.coverage);
  set('State', result.state);
  set('Confidence', result.confidence);
  set('Reasoning', result.reasoning);

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

export type TakenResult = {
  result: MarkResult;
  /** Delete the item. Run it AFTER the reply has been sent, so the deletion adds no delay. */
  cleanup: () => Promise<void>;
};

/**
 * Read Mark's reply. Returns undefined while no reply exists yet. The caller must
 * send the reply and then call `cleanup()`, which deletes the item (delete on
 * read). A failed delete is logged and left to the sweep; it never blocks the reply.
 */
export async function takeResult(cid: string): Promise<TakenResult | undefined> {
  // The cheap check first: a missing item answers in ~80 ms, the versions call takes ~1 s.
  if (!(await contentExists(cid))) return undefined;
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

  return {
    result,
    cleanup: async () => {
      // Under load the CMS can answer 429; wait as long as it asks and try again.
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await deleteContentPermanently(cid);
          return;
        } catch (err) {
          if (err instanceof CmsRateLimitedError && attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, err.retryAfterMs));
            continue;
          }
          console.warn('[ask-mark] could not delete a collected reply; the sweep will remove it', {
            cid,
            error: err instanceof Error ? err.message : String(err),
          });
          return;
        }
      }
    },
  };
}

let lastSweep = 0;

/**
 * Remove replies nobody collected. Uses each item's `created` time (folder
 * listings carry no names). Runs at most every two minutes per server instance;
 * `maxAgeSeconds` is only overridden by tests.
 */
export async function sweepResults(maxAgeSeconds = MAX_AGE_SECONDS): Promise<number> {
  const now = Date.now();
  if (now - lastSweep < SWEEP_EVERY_MS) return 0;
  lastSweep = now;

  let removed = 0;
  try {
    const nodes = await listChildren(folder());
    const cutoff = now - maxAgeSeconds * 1000;
    for (const node of nodes) {
      if (removed >= SWEEP_BATCH) break;
      const created = Date.parse(node.created ?? '');
      if (!node.key || !Number.isFinite(created) || created > cutoff) continue;
      await deleteContentPermanently(node.key);
      removed += 1;
    }
    if (removed) console.log(`[ask-mark] sweep removed ${removed} uncollected repl${removed === 1 ? 'y' : 'ies'}`);
  } catch (err) {
    console.warn('[ask-mark] sweep failed', err instanceof Error ? err.message : String(err));
  }
  return removed;
}
