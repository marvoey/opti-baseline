import { getClient } from '@optimizely/cms-sdk';

/**
 * Finds the first published HeroBlock/ProofBlock/ActionBlock matching the
 * given Persona/Industry/Tier tags. Mirrors the ResolveBrandSafeLimitlessPage
 * query in 00-build/03-NIQ Limitless Page Inventory...md Section 5 — each
 * slot resolves independently on its own tag, which is what makes "drift"
 * possible when one tag doesn't match the visitor's real segment.
 *
 * Only the matching content keys are resolved here — the caller builds a
 * synthetic NIQLimitlessPage-shaped object from them and renders it via
 * <OptimizelyComponent>, which lets NiqLimitlessPage's own slot-resolution
 * (cms/NiqLimitlessPage.tsx, via expandReferences) do the actual fetch.
 */
const KEYS_QUERY = `
  query FindLimitlessKeys($persona: String!, $industry: String!, $tier: String!) {
    hero: HeroBlock(where: { Persona: { eq: $persona } }, limit: 1) {
      items { _metadata { key } }
    }
    proof: ProofBlock(where: { Industry: { eq: $industry } }, limit: 1) {
      items { _metadata { key } }
    }
    action: ActionBlock(where: { Tier: { eq: $tier } }, limit: 1) {
      items { _metadata { key } }
    }
  }
`;

type KeyLookup = { items?: Array<{ _metadata?: { key?: string | null } | null } | null> | null } | null;

type KeysResult = {
  hero?: KeyLookup;
  proof?: KeyLookup;
  action?: KeyLookup;
};

function firstKey(lookup: KeyLookup): string | undefined {
  return lookup?.items?.[0]?._metadata?.key ?? undefined;
}

export type LimitlessSlotKeys = {
  heroKey?: string;
  proofKey?: string;
  actionKey?: string;
};

export type FetchLimitlessResolutionResult =
  | { ok: true; keys: LimitlessSlotKeys }
  | { ok: false; error: string };

/** Resolves the Hero/Proof/Action slot keys for a visitor's Persona/Industry/Tier tags, live from Graph. */
export async function fetchLimitlessResolution(params: {
  persona: string;
  industry: string;
  tier: string;
}): Promise<FetchLimitlessResolutionResult> {
  try {
    const data = (await getClient().request(KEYS_QUERY, params)) as KeysResult;

    return {
      ok: true,
      keys: {
        heroKey: firstKey(data.hero ?? null),
        proofKey: firstKey(data.proof ?? null),
        actionKey: firstKey(data.action ?? null),
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
