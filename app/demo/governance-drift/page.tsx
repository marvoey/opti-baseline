import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { fetchLimitlessResolution, type LimitlessSlotKeys } from '@/lib/cms/fetchLimitlessResolution';

/**
 * OptimizelyComponent dispatches purely on `content.__typename` (or
 * `content._metadata.types`) matching a key registered in
 * initReactComponentRegistry (see cms/registry.ts) — every other field it or
 * the matched component's getPreviewUtils/previewContextOf touch is read via
 * optional chaining, so a hand-built object needs only __typename plus
 * whatever slots the target component actually reads. NiqLimitlessPage
 * (cms/NiqLimitlessPage.tsx) reads exactly HeroSlot/ProofSlot/ActionSlot.
 * OptimizelyComponent's declared prop type is narrower than this shape, so
 * the cast below is required — assigned via a local const (not an inline
 * object literal) so TS's excess-property check doesn't apply.
 */
type SyntheticContent = Parameters<typeof OptimizelyComponent>[0]['content'];

function buildSyntheticLimitlessPage(keys: LimitlessSlotKeys): SyntheticContent {
  const synthetic = {
    __typename: 'NIQLimitlessPage' as const,
    HeroSlot: keys.heroKey ? { key: keys.heroKey } : null,
    ProofSlot: keys.proofKey ? { key: keys.proofKey } : null,
    ActionSlot: keys.actionKey ? { key: keys.actionKey } : null,
  };
  return synthetic as unknown as SyntheticContent;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Governance Drift Demo',
};

/**
 * Live resolution route for 00-build/03-NIQ Limitless Page Inventory...md
 * Section 4/5 — reached via the "Learn more" link in public/linkedin.html,
 * which passes the visitor's raw Persona/Industry/Tier tags as query params.
 * Renders exactly like app/[locale]/[[...slug]]/page.tsx: resolve content,
 * then `return <OptimizelyComponent content={content} />` — the only
 * difference is `content` is synthesized from a live Graph key-resolution
 * query instead of fetched by path, since there's no single stored
 * NIQLimitlessPage instance backing this route.
 */
const DEFAULTS = {
  persona: 'Ecommerce_VP',
  industry: 'PersonalCare',
  tier: 'StrategicCustomer',
};

type Props = {
  searchParams: Promise<{ persona?: string; industry?: string; tier?: string }>;
};

async function GovernanceDriftPage({ searchParams }: Props) {
  const params = await searchParams;
  const persona = params.persona ?? DEFAULTS.persona;
  const industry = params.industry ?? DEFAULTS.industry;
  const tier = params.tier ?? DEFAULTS.tier;

  const result = await fetchLimitlessResolution({ persona, industry, tier });
  if (!result.ok) notFound();

  const content = buildSyntheticLimitlessPage(result.keys);

  return <OptimizelyComponent content={content} />;
}

export default withAppContext(GovernanceDriftPage);
