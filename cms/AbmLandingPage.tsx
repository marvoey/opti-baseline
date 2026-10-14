import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import PersonaTabs from '@/app/_components/PersonaTabs';

/**
 * AbmLandingPage — an account-specific landing page that the Limitless workflow creates (create mode)
 * and patches section by section (update mode). Flat properties on purpose, so an
 * agent can JSON-Merge-Patch only the fields a new signal affects.
 */
export const AbmLandingPageContentType = contentType({
  key: 'AbmLandingPage',
  baseType: '_page',
  displayName: 'ABM Landing Page (Limitless)',
  description: 'Account-specific landing page generated and maintained by the Limitless workflow.',
  properties: {
    // SEO (MetaTitle feeds generateMetadata in the catch-all)
    MetaTitle: { type: 'string', displayName: 'Meta Title', sortOrder: 1 },
    MetaDescription: { type: 'string', displayName: 'Meta Description', sortOrder: 2 },

    // Account + Limitless governance
    AccountId: { type: 'string', displayName: 'CRM Account ID', indexingType: 'queryable', sortOrder: 10 },
    AccountName: { type: 'string', displayName: 'Account Name', sortOrder: 11 },
    Industry: { type: 'string', displayName: 'Industry', sortOrder: 12 },
    LimitlessMode: {
      type: 'string',
      displayName: 'Last Limitless Mode',
      enum: [
        { value: 'create', displayName: 'Create' },
        { value: 'update', displayName: 'Update' },
      ],
      sortOrder: 13,
    },
    PageVersionNote: { type: 'string', displayName: 'Version Note', sortOrder: 14 },
    SignalsSummary: { type: 'string', displayName: 'Signals Used', sortOrder: 15 },
    LastRefreshed: { type: 'dateTime', displayName: 'Last Refreshed', sortOrder: 16 },

    // Hero
    HeroEyebrow: { type: 'string', displayName: 'Hero Eyebrow', sortOrder: 20 },
    HeroHeadline: { type: 'string', displayName: 'Hero Headline', sortOrder: 21 },
    HeroSubhead: { type: 'string', displayName: 'Hero Subhead', sortOrder: 22 },
    PrimaryCtaLabel: { type: 'string', displayName: 'CTA Label', sortOrder: 23 },
    PrimaryCtaUrl: { type: 'string', displayName: 'CTA URL', sortOrder: 24 },

    // Problem
    ProblemHeadline: { type: 'string', displayName: 'Problem Headline', sortOrder: 30 },
    ProblemBody: { type: 'richText', displayName: 'Problem Body', sortOrder: 31 },

    // Buying committee
    EconomicBuyerTitle: { type: 'string', displayName: 'Economic Buyer – Headline', sortOrder: 40 },
    EconomicBuyerBody: { type: 'richText', displayName: 'Economic Buyer – Body', sortOrder: 41 },
    TechnicalEvaluatorTitle: { type: 'string', displayName: 'Technical Evaluator – Headline', sortOrder: 42 },
    TechnicalEvaluatorBody: { type: 'richText', displayName: 'Technical Evaluator – Body', sortOrder: 43 },
    ChampionTitle: { type: 'string', displayName: 'Champion – Headline', sortOrder: 44 },
    ChampionBody: { type: 'richText', displayName: 'Champion – Body', sortOrder: 45 },

    // Proof
    ProofStats: { type: 'json', displayName: 'Proof Stats', description: 'JSON array of {"value":"38%","label":"…"}', sortOrder: 50 },
    CaseStudyHeadline: { type: 'string', displayName: 'Case Study Headline', sortOrder: 51 },
    CaseStudyBody: { type: 'richText', displayName: 'Case Study Body', sortOrder: 52 },
    FaqItems: { type: 'json', displayName: 'FAQ Items', description: 'JSON array of {"Question":"…","Answer":"…"}', sortOrder: 60 },
  },
});

type Props = { content: ContentProps<typeof AbmLandingPageContentType> };

/** Accepts rich text (Graph returns { json, html }) or a plain string fallback. */
function Body({ value }: { value: unknown }) {
  if (!value) return null;
  if (typeof value === 'string') return <p>{value}</p>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RichTextRenderer content={(value as any).json} />;
}

function jsonArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}

export default function AbmLandingPage({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const stats = jsonArray<{ value: string; label: string }>(content.ProofStats);
  const faqs = jsonArray<{ Question: string; Answer: string }>(content.FaqItems);

  const personas = [
    { id: 'finance', label: 'For Finance', title: content.EconomicBuyerTitle, body: content.EconomicBuyerBody, t: 'EconomicBuyerTitle', b: 'EconomicBuyerBody' },
    { id: 'it', label: 'For IT & Architecture', title: content.TechnicalEvaluatorTitle, body: content.TechnicalEvaluatorBody, t: 'TechnicalEvaluatorTitle', b: 'TechnicalEvaluatorBody' },
    { id: 'ops', label: 'For Operations', title: content.ChampionTitle, body: content.ChampionBody, t: 'ChampionTitle', b: 'ChampionBody' },
  ] as const;

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="bg-blue-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <p {...pa('HeroEyebrow')} className="text-sm uppercase tracking-widest text-blue-200">{content.HeroEyebrow}</p>
          <h1 {...pa('HeroHeadline')} className="mt-3 text-4xl font-bold md:text-5xl">{content.HeroHeadline}</h1>
          <p {...pa('HeroSubhead')} className="mt-5 max-w-3xl text-lg text-blue-100">{content.HeroSubhead}</p>
          {content.PrimaryCtaLabel && (
            <a {...pa('PrimaryCtaLabel')} href={content.PrimaryCtaUrl || '#'} className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-950">
              {content.PrimaryCtaLabel}
            </a>
          )}
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 {...pa('ProblemHeadline')} className="text-3xl font-bold text-blue-950">{content.ProblemHeadline}</h2>
          <div {...pa('ProblemBody')} className="prose mt-4 max-w-none"><Body value={content.ProblemBody} /></div>
        </div>
      </section>

      {/* Buying committee */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-blue-950">What this means for your team</h2>
          <PersonaTabs
            tabs={personas.map((p) => ({
              id: p.id,
              label: p.label,
              panel: (
                <div>
                  <h3 {...pa(p.t)} className="text-xl font-semibold text-blue-950">{p.title}</h3>
                  <div {...pa(p.b)} className="prose mt-3 max-w-none"><Body value={p.body} /></div>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      {/* Proof */}
      {stats.length > 0 && (
        <section {...pa('ProofStats')} className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-4xl font-bold text-blue-800">{s.value}</div>
                <div className="mt-2 text-sm text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 {...pa('CaseStudyHeadline')} className="text-2xl font-bold text-blue-950">{content.CaseStudyHeadline}</h2>
          <div {...pa('CaseStudyBody')} className="prose mt-4 max-w-none"><Body value={content.CaseStudyBody} /></div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section {...pa('FaqItems')} className="bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-lg bg-white p-4 shadow-sm">
                <summary className="cursor-pointer font-medium text-blue-950">{f.Question}</summary>
                <p className="mt-2 text-slate-700">{f.Answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Limitless governance strip: makes create vs update visible on camera */}
      <footer className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500">
        Personalized for <span {...pa('AccountName')}>{content.AccountName}</span> ·{' '}
        <span {...pa('PageVersionNote')}>{content.PageVersionNote}</span>
        {content.LastRefreshed && <> · refreshed {new Date(content.LastRefreshed as string).toLocaleDateString()}</>}
      </footer>
    </main>
  );
}
