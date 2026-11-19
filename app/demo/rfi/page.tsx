import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import { RFI_SECTIONS, RFI_TITLE, type RfiBlock, type RfiSection } from './rfiDocument';
import './rfi.css';

/**
 * /demo/rfi - eHealth CMS / DXP RFI prep page (source: the ehealth_rfi.html canvas).
 *
 * Two Optimizely prep cards (executive summary, demo flow) followed by eHealth's
 * original questionnaire, rendered verbatim from ./rfiDocument.ts.
 *
 * Lives outside app/[locale]: proxy.ts already excludes /demo from the locale
 * rewrite, so this is a plain static route, not CMS content. It holds internal
 * prep notes, so it is noindex and not linked from site navigation.
 */

const condensed = Roboto_Condensed({
  variable: '--font-rfi-condensed',
  subsets: ['latin'],
  weight: ['600', '800'],
});

const mono = Roboto_Mono({
  variable: '--font-rfi-mono',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'eHealth CMS RFI — Optimizely Prep',
  description: 'Executive summary, demo flow and the full eHealth CMS / DXP RFI questionnaire.',
  robots: { index: false, follow: false },
};

// ---------------------------------------------------------------------------
// Stats are computed from the questionnaire so they can't drift from it.
// ---------------------------------------------------------------------------

const sectionNumber = (s: RfiSection) => Number.parseInt(s.title, 10);

const rowCount = (sections: RfiSection[]) =>
  sections.reduce(
    (total, s) => total + s.blocks.reduce((n, b) => n + (b.t === 'table' ? b.rows.length : 0), 0),
    0,
  );

const sectionsWhere = (match: (n: number) => boolean) =>
  RFI_SECTIONS.filter((s) => match(sectionNumber(s)));

const STATS = [
  { value: RFI_SECTIONS.length, label: 'Sections' },
  { value: rowCount(sectionsWhere((n) => n >= 5 && n <= 16)), label: 'Coded requirements (Sections 5–16)' },
  { value: rowCount(sectionsWhere((n) => [4, 17, 18].includes(n))), label: 'Open questions (Sections 4, 17, 18)' },
  { value: rowCount(sectionsWhere((n) => n === 6)), label: 'SEO + AEO items, the biggest section' },
];

// ---------------------------------------------------------------------------
// Optimizely prep notes (not part of the original RFI).
// ---------------------------------------------------------------------------

const DRIVERS: { driver: string; said: string; angle: string; watch: string }[] = [
  {
    driver: 'Marketer self-service',
    said: 'Authoring, publishing and experiment management with no code',
    angle: 'Visual Builder (sections, rows, columns, elements), blueprints, reusable blocks, scheduling, approvals, Mark agents inside the CMS',
    watch: 'Show guardrails as well as freedom: approved templates, roles, validation',
  },
  {
    driver: 'Multi-app delivery by logical group',
    said: 'One instance serving many frontends, grouped by product line, paid or organic, not by domain',
    angle: 'CMS SaaS Applications, content-tree and taxonomy grouping, Optimizely Graph queries scoped per app, per-app preview tokens and hostnames',
    watch: 'Grouping that isn’t tied to a domain is a modeling decision. Show taxonomy filters in Graph, not only the site tree',
  },
  {
    driver: 'Keep Adobe Target',
    said: 'A/B tests stay in Adobe Target, with self-service variant control',
    angle: 'CMS content variations authored in the editor and delivered through Graph; the frontend or Target picks the variant',
    watch: 'Native path is Optimizely Experimentation. Adobe Target is likely an integration (“I”), not out of the box. Be candid',
  },
  {
    driver: 'Akamai CDN',
    said: 'Static assets published to Akamai',
    angle: 'Headless architecture: frontend and assets can sit behind any CDN, including Akamai',
    watch: 'Mostly a frontend and hosting responsibility. State “Native vs. Frontend” clearly',
  },
  {
    driver: 'Yoast SEO parity + AEO',
    said: 'Benchmarked against Yoast, plus AI answer-engine citation',
    angle: 'SEO property groups in the content model, required-field validation, Mark SEO Metadata agent, GEO audits with JSON-LD schema, Graph-backed sitemaps',
    watch: 'Real-time Yoast-style readability scoring isn’t 1:1. Position AI agents plus the content model as the stronger answer',
  },
];

const LEAD: ReactNode[] = [
  <><strong>AEO (Section 6e):</strong> Few vendors have a credible answer. GEO audits, JSON-LD and answer-block content modeling can be a differentiator.</>,
  <><strong>AI readiness (Section 9):</strong> Mark offers built-in drafting, translation, tagging and alt text, plus custom agents, governance and human-in-the-loop review.</>,
  <><strong>Search (Section 14):</strong> Optimizely Graph covers native full-text search, facets, synonyms and pinned results across apps, with no third-party search needed.</>,
  <><strong>Headless-first delivery (Sections 5, 13, 15):</strong> GraphQL, preview API, webhooks and a Next.js SDK, with SaaS hosting that takes upgrades off their plate.</>,
];

const RISKS: string[] = [
  'Adobe Target integration effort and who owns variant decisioning (Section 8).',
  'Yoast-style feature checklist items such as readability scores, cornerstone flags and bulk meta editing (Section 6a).',
  'Sitemap, robots and redirect management in a headless setup: native, add-on or frontend (Sections 6b and 6c).',
  'Gutenberg/ACF-to-content-model mapping and Yoast metadata migration (Section 16).',
  'HIPAA applicability and data residency (Section 12.16). Get this to security early.',
];

const DEMO_FLOW: { title: string; time: string; body: string }[] = [
  {
    title: 'Reframe and agenda',
    time: '5 min',
    body: 'Read their Business Context back to them. Frame the cost as the engineering queue, not WordPress. Agree on success criteria for a possible POC.',
  },
  {
    title: 'One content hub, many apps',
    time: '8 min · Sections 5, 13',
    body: 'Show Applications (paid app and organic app) on one instance. Group content by product line and traffic type with taxonomy. Show a shared block reused in both apps, a Graph query scoped to one app’s group, and per-app preview.',
  },
  {
    title: 'A marketer builds a landing page, no code',
    time: '10 min · Sections 7, 11',
    body: 'Build a page in Visual Builder from a blueprint with reusable blocks and live preview. Then schedule publishing, send it through an approval workflow and show version compare and rollback.',
  },
  {
    title: 'SEO parity, then AEO',
    time: '10 min · Section 6',
    body: 'Walk the SEO property group (title, description, OG, robots, canonical) and show validation that blocks publishing. Run the Mark SEO Metadata agent to apply drafts, then a GEO audit that adds FAQ and JSON-LD schema. Explain the llms.txt and AI-crawler approach and show hreflang across locales.',
  },
  {
    title: 'Self-service experiments with Adobe Target',
    time: '8 min · Section 8',
    body: 'Author variants as CMS content variations, preview each one and show how Graph exposes them for Adobe Target to decide. Point out governance guardrails. Optionally contrast this with Optimizely’s native experimentation and avoid hard selling.',
  },
  {
    title: 'AI that works inside the CMS',
    time: '7 min · Sections 9, 10',
    body: 'In Mark, draft and rewrite in brand voice, translate a page, generate alt text and tags, and walk through a human-in-the-loop review. Cover data governance and turning AI off in Opti ID.',
  },
  {
    title: 'Search and discovery',
    time: '4 min · Section 14',
    body: 'Show Graph full-text search with facets by product line and locale, plus synonyms and pinned results, managed by the business.',
  },
  {
    title: 'Under the hood for engineering',
    time: '5 min · Sections 13, 15',
    body: 'Cover the Next.js SDK, publish webhooks feeding on-demand revalidation, SSR/SSG, Akamai in front of the frontend and assets, and the SaaS SLA.',
  },
  {
    title: 'Migration, security, next steps',
    time: '3 min · Sections 12, 16, 17',
    body: 'Outline the WordPress-to-CMS migration pattern through the management API, including Yoast metadata and redirect mapping. Mention Opti ID SSO, RBAC and certifications. Propose a scoped POC.',
  },
];

// ---------------------------------------------------------------------------
// Questionnaire renderer. Inline HTML in rfiDocument.ts is static, trusted
// content (only <strong>, <em> and mailto links), so innerHTML is safe here.
// ---------------------------------------------------------------------------

function RfiTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="tbl-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {head.map((_, c) => {
                const value = row[c] ?? '';
                const className = c === 0 ? 'col-id' : value ? undefined : 'empty';
                return (
                  <td key={c} className={className}>
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block }: { block: RfiBlock }) {
  switch (block.t) {
    case 'h3':
      return <h3 className="doc-h3">{block.text}</h3>;
    case 'p':
      return <p className="doc-p" dangerouslySetInnerHTML={{ __html: block.html }} />;
    case 'table':
      return <RfiTable head={block.head} rows={block.rows} />;
    case 'ol':
      return (
        <ol className="doc-ol">
          {block.items.map((html, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </ol>
      );
    default:
      return (
        <ul className={block.t === 'check' ? 'doc-check' : 'doc-ul'}>
          {block.items.map((html, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </ul>
      );
  }
}

function Chips({ items }: { items: [label: string, tone: 'green' | 'blue' | 'neutral'][] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {items.map(([label, tone]) => (
        <span key={label} className={`chip chip-${tone}`}>
          {label}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function RfiPage() {
  return (
    <div className={`rfi-doc ${condensed.variable} ${mono.variable}`}>
      <header className="max-w-6xl mx-auto px-5 pt-10 pb-6">
        <span className="chip chip-green">eHealth · CMS / DXP RFI</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">
          eHealth CMS RFI: summary, demo flow and full questionnaire
        </h1>
        <p className="mt-3 max-w-3xl">
          The top two cards are Optimizely prep notes. Everything under <strong>Original RFI document</strong> keeps
          the source questionnaire’s wording, tables, response columns and formatting.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-5 pb-16 grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-8">
        <aside className="hidden lg:block">
          <nav className="card p-4! sticky top-4 max-h-[92vh] overflow-y-auto" aria-label="Contents">
            <div className="chip chip-neutral mb-3">Contents</div>
            <ul>
              <li><a className="toc-link font-bold" href="#prep-summary">Executive summary</a></li>
              <li><a className="toc-link font-bold" href="#demo-flow">Demo flow</a></li>
              <li><a className="toc-link font-bold" href="#original">Original RFI</a></li>
              {RFI_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a className="toc-link" href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          {/* ---- Prep card 1: executive summary ---- */}
          <section id="prep-summary" className="card mb-8">
            <Chips items={[['Optimizely prep notes', 'green'], ['Not part of the original RFI', 'blue']]} />
            <h2 className="prep-h2">Executive summary</h2>
            <p className="doc-p">
              <strong>Prospect:</strong> eHealth. <strong>Ask:</strong> Replace a WordPress publishing stack with a
              CMS/DXP. <strong>Type:</strong> Information-gathering RFI that may lead to a POC or RFP.{' '}
              <strong>Contact:</strong> <a className="link" href="mailto:tri.ngo@ehealth.com">tri.ngo@ehealth.com</a>.{' '}
              <strong>Stated due date:</strong> [11/11/2026]. The brackets suggest this may be a placeholder, so confirm
              the real deadline with the account team.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              {STATS.map((s) => (
                <div key={s.label} className="stat">
                  <div className="stat-num">{s.value}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <h3 className="doc-h3">What they’re really buying</h3>
            <p className="doc-p">
              The RFI asks for a WordPress replacement, but the real problem is that{' '}
              <strong>engineering is the bottleneck for every revenue page</strong>. SEO and marketing teams can’t ship,
              tweak or test content without a ticket. Every section ties back to self-service with guardrails. A useful
              hypothesis to test in discovery: eHealth is a health-insurance marketplace, so its traffic and revenue
              likely peak around Medicare enrollment windows. Engineering dependency costs the most at exactly those
              moments.
            </p>

            <h3 className="doc-h3">Five decision drivers (from the Business Context)</h3>
            <div className="tbl-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>What they said</th>
                    <th>Optimizely angle (check with Product/SE)</th>
                    <th>Watch-out</th>
                  </tr>
                </thead>
                <tbody>
                  {DRIVERS.map((d) => (
                    <tr key={d.driver}>
                      <td><strong>{d.driver}</strong></td>
                      <td>{d.said}</td>
                      <td>{d.angle}</td>
                      <td>{d.watch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="doc-h3">Where Optimizely can lead</h3>
            <ul className="doc-ul">
              {LEAD.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h3 className="doc-h3">Risks to handle up front</h3>
            <ul className="doc-ul">
              {RISKS.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </section>

          {/* ---- Prep card 2: demo flow ---- */}
          <section id="demo-flow" className="card mb-8">
            <Chips items={[['Optimizely prep notes', 'green'], ['About 60 minutes', 'blue']]} />
            <h2 className="prep-h2">Suggested high-level demo flow</h2>
            <p className="doc-p">
              Storyline: <strong>“From ticket queue to self-service.”</strong> One marketer launches a Medicare
              product-line campaign across a paid-media app and an organic app. They optimize it for search and AI
              answers and set up a test, without filing a single engineering ticket. Use eHealth-style demo content: a
              product-line hub, a paid landing page and an organic article.
            </p>
            <ol className="flow">
              {DEMO_FLOW.map((step, i) => (
                <li key={step.title}>
                  <div className="flow-head">
                    <span className="flow-num">{i}</span>
                    <span className="flow-title">{step.title}</span>
                    <span className="chip chip-neutral">{step.time}</span>
                  </div>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* ---- Original RFI document (verbatim) ---- */}
          <section id="original" className="card rfi-original">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="chip chip-blue">Original RFI document</span>
              <span className="chip chip-neutral">Content preserved verbatim</span>
            </div>
            <h1 className="doc-h1">{RFI_TITLE}</h1>
            {RFI_SECTIONS.map((section) => (
              <div key={section.id}>
                <h2 id={section.id} className="doc-h2">
                  {section.title}
                </h2>
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
