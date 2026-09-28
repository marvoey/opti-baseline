import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Governance Drift — Permutation Map',
};

/**
 * The 18-combination permutation map from
 * 00-build/03-NIQ Limitless Page Inventory ... Section 3 (3 Heroes x 3 Proofs
 * x 2 Actions). Every row here is one of the doc's "100% Governed & Coherent"
 * combinations — see Section 4 of that doc for the two deliberate drift
 * failure modes (constructed by hand-editing the query params instead).
 */
type Permutation = {
  n: number;
  hero: 'H1' | 'H2' | 'H3';
  proof: 'P1' | 'P2' | 'P3';
  action: 'A1' | 'A2';
  persona: string;
  industry: string;
  tier: string;
  context: string;
};

const PERMUTATIONS: Permutation[] = [
  { n: 1, hero: 'H1', proof: 'P1', action: 'A1', persona: 'Ecommerce_VP', industry: 'PersonalCare', tier: 'StrategicCustomer', context: 'Unilever Personal Care Ecommerce VP (Marvin Oey)' },
  { n: 2, hero: 'H1', proof: 'P1', action: 'A2', persona: 'Ecommerce_VP', industry: 'PersonalCare', tier: 'ConsiderationProspect', context: "L'Oréal / Beiersdorf Ecommerce VP (Prospect)" },
  { n: 3, hero: 'H1', proof: 'P2', action: 'A1', persona: 'Ecommerce_VP', industry: 'PackagedFoods', tier: 'StrategicCustomer', context: 'Unilever Grocery/Food Ecommerce VP' },
  { n: 4, hero: 'H1', proof: 'P2', action: 'A2', persona: 'Ecommerce_VP', industry: 'PackagedFoods', tier: 'ConsiderationProspect', context: 'Nestlé / Kraft Heinz Ecommerce VP (Prospect)' },
  { n: 5, hero: 'H1', proof: 'P3', action: 'A1', persona: 'Ecommerce_VP', industry: 'BeverageAlcohol', tier: 'StrategicCustomer', context: 'Diageo / Pernod Ricard Ecommerce VP (Client)' },
  { n: 6, hero: 'H1', proof: 'P3', action: 'A2', persona: 'Ecommerce_VP', industry: 'BeverageAlcohol', tier: 'ConsiderationProspect', context: 'Bacardi / Campari Ecommerce VP (Prospect)' },
  { n: 7, hero: 'H2', proof: 'P1', action: 'A1', persona: 'Insights_Director', industry: 'PersonalCare', tier: 'StrategicCustomer', context: 'Unilever Personal Care Insights Director' },
  { n: 8, hero: 'H2', proof: 'P1', action: 'A2', persona: 'Insights_Director', industry: 'PersonalCare', tier: 'ConsiderationProspect', context: 'Estée Lauder Insights Director (Prospect)' },
  { n: 9, hero: 'H2', proof: 'P2', action: 'A1', persona: 'Insights_Director', industry: 'PackagedFoods', tier: 'StrategicCustomer', context: 'Unilever Food Insights Director' },
  { n: 10, hero: 'H2', proof: 'P2', action: 'A2', persona: 'Insights_Director', industry: 'PackagedFoods', tier: 'ConsiderationProspect', context: 'Danone / Ferrero Insights Director (Prospect)' },
  { n: 11, hero: 'H2', proof: 'P3', action: 'A1', persona: 'Insights_Director', industry: 'BeverageAlcohol', tier: 'StrategicCustomer', context: 'Moët Hennessy Insights Director (Client)' },
  { n: 12, hero: 'H2', proof: 'P3', action: 'A2', persona: 'Insights_Director', industry: 'BeverageAlcohol', tier: 'ConsiderationProspect', context: 'Brown-Forman Insights Director (Prospect)' },
  { n: 13, hero: 'H3', proof: 'P1', action: 'A1', persona: 'Category_Commercial', industry: 'PersonalCare', tier: 'StrategicCustomer', context: 'Unilever Personal Care Category Lead' },
  { n: 14, hero: 'H3', proof: 'P1', action: 'A2', persona: 'Category_Commercial', industry: 'PersonalCare', tier: 'ConsiderationProspect', context: 'Colgate-Palmolive Category Lead (Prospect)' },
  { n: 15, hero: 'H3', proof: 'P2', action: 'A1', persona: 'Category_Commercial', industry: 'PackagedFoods', tier: 'StrategicCustomer', context: 'Unilever Grocery Trade Promo Director' },
  { n: 16, hero: 'H3', proof: 'P2', action: 'A2', persona: 'Category_Commercial', industry: 'PackagedFoods', tier: 'ConsiderationProspect', context: 'General Mills Category Director (Prospect)' },
  { n: 17, hero: 'H3', proof: 'P3', action: 'A1', persona: 'Category_Commercial', industry: 'BeverageAlcohol', tier: 'StrategicCustomer', context: 'William Grant & Sons Commercial Director' },
  { n: 18, hero: 'H3', proof: 'P3', action: 'A2', persona: 'Category_Commercial', industry: 'BeverageAlcohol', tier: 'ConsiderationProspect', context: 'Treasury Wine Estates Category Director' },
];

function resolveHref({ persona, industry, tier }: Permutation): string {
  const params = new URLSearchParams({ persona, industry, tier });
  return `/demo/governance-drift?${params.toString()}`;
}

export default function GovernanceDriftParamsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Governance Drift — Permutation Map
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        The 18 combinations from Section 3 of the NIQ Limitless Page Inventory doc (3 Heroes ×
        3 Proofs × 2 Actions). Persona resolves the <code>HeroBlock</code>, Industry resolves the{' '}
        <code>ProofBlock</code>, and Tier resolves the <code>ActionBlock</code> — each row below
        is one governed, coherent combination.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {PERMUTATIONS.map((perm) => (
          <Link
            key={perm.n}
            href={resolveHref(perm)}
            className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3 text-sm last:border-b-0 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 shrink-0 font-mono text-xs text-slate-400">{perm.n}</span>
              <span className="w-24 shrink-0 font-mono text-xs text-slate-500">
                {perm.hero}/{perm.proof}/{perm.action}
              </span>
              <span className="text-slate-800">{perm.context}</span>
            </div>
            <span className="shrink-0 font-medium text-blue-600">View →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
