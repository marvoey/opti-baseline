import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto_Condensed, Roboto_Mono } from 'next/font/google';
import { RFI_SECTIONS, RFI_TITLE, type RfiBlock, type RfiSection } from '../rfi/rfiDocument';
import '../rfi/rfi.css';
import './overview.css';

/**
 * /demo/rfi-overview - customer-facing version of /demo/rfi, written to be
 * screen-shared with eHealth during the call.
 *
 * Differences from /demo/rfi (internal prep):
 *   - No watch-outs, risks, "what they're really buying", account-team notes or
 *     contact details. Everything here is safe for eHealth to read.
 *   - The agenda mirrors the 60-minute flow in /demo/flow (DemoFlow.tsx), with
 *     customer-facing wording and no READY/TALK/DONE build status.
 *   - eHealth's original questionnaire is kept, collapsed, as a reference appendix.
 *
 * Reuses ../rfi/rfi.css (scoped under .rfi-doc) and ../rfi/rfiDocument.ts.
 * Not CMS content, noindex and not linked from site navigation.
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
  title: 'Optimizely \u00d7 eHealth: your RFI, on a working site',
  description: 'What we heard in the eHealth CMS / DXP RFI, how Optimizely meets each priority, and the agenda for today.',
  robots: { index: false, follow: false },
};

const DEMO_SITE = 'https://ehealth.optimoey.com';

// ---------------------------------------------------------------------------
// Stats computed from the questionnaire so they can't drift from it.
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
  { value: RFI_SECTIONS.length, label: 'Sections in your RFI' },
  { value: rowCount(sectionsWhere((n) => n >= 5 && n <= 16)), label: 'Requirements (Sections 5-16)' },
  { value: rowCount(sectionsWhere((n) => n === 6)), label: 'SEO + AEO items, your largest section' },
  { value: 60, label: 'Minutes today, mapped to your sections' },
];

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const HEARD: { title: string; body: string }[] = [
  {
    title: 'Marketing waits on engineering',
    body: 'SEO and content teams rely on engineering for routine page changes, updates and tests. Fragmented templates slow publishing and experimentation.',
  },
  {
    title: 'One CMS, many front ends',
    body: 'Content has to reach multiple front-end apps, grouped by product line, paid and organic traffic, not by domain.',
  },
  {
    title: 'Keep what already works',
    body: 'A/B testing stays on Adobe Target. Static assets publish to Akamai. Nobody rips out working infrastructure.',
  },
  {
    title: 'Search, then answer engines',
    body: 'Parity with your Yoast SEO workflow, plus content that ChatGPT, Perplexity and AI Overviews can find and cite.',
  },
];

type Where = [label: string, tone: 'green' | 'blue' | 'neutral'];

const PRIORITIES: { priority: string; said: string; how: ReactNode; where: Where[] }[] = [
  {
    priority: 'Self-service for marketing',
    said: 'Authoring, publishing and experiment management without code or engineering.',
    how: (
      <>
        Visual Builder with eHealth&apos;s own blocks, approved style options, reusable blueprints, scheduling, approvals
        and version history. Engineering builds a block once. Marketing composes pages with it.
      </>
    ),
    where: [['Native', 'green']],
  },
  {
    priority: 'Multi-app delivery by logical group',
    said: 'One instance serving many front ends, grouped by product line, paid or organic.',
    how: (
      <>
        Product line and channel are content categories, not separate sites. Each front end queries only its group
        through Optimizely Graph. Shared blocks are referenced once and reused in every app, and each application has
        its own host and preview URL.
      </>
    ),
    where: [['Native', 'green']],
  },
  {
    priority: 'Adobe Target stays',
    said: 'A/B tests run in Adobe Target, with self-service variant control.',
    how: (
      <>
        Marketers author and preview variants as CMS content variations. Target decides who sees which variant and
        returns a variant key. Your front end then fetches that variant server-side, so there&apos;s no flicker and SEO
        is preserved. This is an integration point in your front-end code, not a packaged connector. Today we&apos;ll show
        the pattern with Optimizely Feature Experimentation making the decision, and where Target plugs in.
      </>
    ),
    where: [['Native (variants)', 'green'], ['Integration (decision)', 'neutral']],
  },
  {
    priority: 'Akamai CDN',
    said: 'Static assets published to Akamai.',
    how: (
      <>
        With headless delivery, your front end and its static assets sit behind whatever CDN you choose, including
        Akamai. The CMS doesn&apos;t dictate it.
      </>
    ),
    where: [['Front end / hosting', 'blue']],
  },
  {
    priority: 'Yoast SEO parity + AEO',
    said: 'Match Yoast today, and be citable by AI answer engines.',
    how: (
      <>
        SEO fields with validation in the content model. An AI SEO review in the CMS that writes suggested fixes back as
        a draft for approval. Sitemap, robots.txt, llms.txt, canonical, hreflang and JSON-LD (including FAQ schema)
        generated from CMS content and rendered by your front end.
      </>
    ),
    where: [['Native (fields, review)', 'green'], ['Front end (output)', 'blue']],
  },
];

const AGENDA: { title: string; time: string; refs: string; body: string }[] = [
  {
    title: 'Your goals for today',
    time: '4 min',
    refs: 'Business Context',
    body: 'We start with you: what would make this hour worth your time, and what do you most want to see?',
  },
  {
    title: 'eHealth.com, running on Optimizely',
    time: '4 min',
    refs: '5.12, 7.9',
    body: 'A working eHealth-style site on Optimizely CMS SaaS: the homepage, Medicare and Dental & Vision. Navigation comes from the content tree, so a new product page adds its own menu item.',
  },
  {
    title: 'A marketer ships changes, within guardrails',
    time: '12 min',
    refs: '7.1-7.10, 11.1-11.3, 5.5',
    body: 'Edit the hero in Visual Builder, switch a section style from approved options, reorder sections, update a shared coverage card everywhere it appears and change the enrollment banner site-wide. Then schedule, approve, compare versions and roll back.',
  },
  {
    title: 'Personalize and test, keeping Adobe Target',
    time: '10 min',
    refs: '8.1-8.11',
    body: 'Hero variants for Turning 65 and ACA shoppers, authored in the CMS and rendered server-side. A decision engine picks the variant, and we show exactly where Adobe Target fits.',
  },
  {
    title: 'SEO parity with Yoast, then AEO',
    time: '9 min',
    refs: '6.1-6.39',
    body: 'SEO fields and fallbacks, an AI SEO review that writes back a draft, then the live sitemap, robots.txt, llms.txt, canonical, hreflang and FAQ schema in the page source.',
  },
  {
    title: 'One content hub, grouped by product line and channel',
    time: '7 min',
    refs: '5.1-5.11, 14.4-14.5',
    body: 'Pages tagged by product line and Paid / Organic, queried per app ("all organic Medicare pages"). A paid landing page built from the same blocks as the homepage.',
  },
  {
    title: 'AI in the editor\u2019s workflow',
    time: '6 min',
    refs: '9.1-9.8, 10.1-10.6, 7.5, 11.6',
    body: 'Generate missing alt text, translate a page into Spanish with fallback to English, and keep a human in the loop with drafts, approvals and an audit trail.',
  },
  {
    title: 'Under the hood for engineering',
    time: '4 min',
    refs: '13.1-13.10, 15.1-15.7',
    body: 'Content types as code, Next.js with the CMS SDK and Graph, live preview, publish-driven revalidation and how Akamai sits in front.',
  },
  {
    title: 'Migration path and next steps',
    time: '4 min',
    refs: '16, 17',
    body: 'WordPress to Optimizely through the management API: Gutenberg blocks, Yoast metadata and redirects. Then we talk through how your evaluation works from here and what you need from us.',
  },
];

const COVERAGE: { section: string; where: string; how: string }[] = [
  { section: '5. Architecture and multi-app delivery', where: 'Steps 1 and 5', how: 'Live demo' },
  { section: '6a-6d. SEO and Yoast parity', where: 'Step 4', how: 'Live demo' },
  { section: '6e. Answer Engine Optimization', where: 'Step 4', how: 'Live demo' },
  { section: '7. Content velocity and authoring', where: 'Step 2', how: 'Live demo' },
  { section: '8. Experimentation (Adobe Target)', where: 'Step 3', how: 'Live demo + integration walkthrough' },
  { section: '9. AI readiness', where: 'Steps 4 and 6', how: 'Live demo' },
  { section: '10. Multilingual and localization', where: 'Step 6', how: 'Live demo' },
  { section: '11. Workflow and governance', where: 'Step 2', how: 'Live demo' },
  { section: '12. Security and access control', where: 'Step 8', how: 'Discussion, then a session with your security team' },
  { section: '13. Developer experience and APIs', where: 'Step 7', how: 'Live walkthrough' },
  { section: '14. Search and content discovery', where: 'Step 5', how: 'Discussion + detail in writing' },
  { section: '15. Rendering, performance and hosting', where: 'Step 7', how: 'Discussion' },
  { section: '16. Migration from WordPress', where: 'Step 8', how: 'Discussion' },
  { section: '4, 17, 18. Vendor, commercial and support', where: 'Step 8', how: 'Follow-up in writing' },
];

const QUESTIONS: ReactNode[] = [
  <><strong>Adobe Target:</strong> is it at.js or server-side delivery today, and who builds activities, marketing or engineering?</>,
  <><strong>Front ends:</strong> how many apps are there today, and is paid vs. organic split by app, by path or by template?</>,
  <><strong>Enrollment:</strong> during AEP and Open Enrollment, how long does a homepage or banner change take from request to live?</>,
  <><strong>Compliance:</strong> who approves Medicare marketing content, and how many review steps does it go through?</>,
  <><strong>Spanish:</strong> how much Spanish content do you publish, and how is it translated today?</>,
  <><strong>Yoast:</strong> which features do editors actually use: readability scoring, or mostly titles, canonicals and sitemaps?</>,
  <><strong>AEO:</strong> are you already seeing referrals from ChatGPT, Perplexity or AI Overviews, and are you measuring them?</>,
  <><strong>Akamai:</strong> does it sit in front of WordPress today, and does it handle image optimization?</>,
];

const DECISION: { title: string; body: string }[] = [
  {
    title: 'Where you are today',
    body: 'Which options are you considering, including staying on WordPress? Is there a front-runner yet?',
  },
  {
    title: 'How you\u2019ll decide',
    body: 'Which criteria matter most, and how will you weigh the RFI responses against what you see in sessions like this one?',
  },
  {
    title: 'Who\u2019s involved',
    body: 'Who else has a say (marketing, SEO, engineering, security, procurement), and who makes the final call?',
  },
  {
    title: 'What drives the timing',
    body: 'Is there a date this needs to land by: an enrollment season, a WordPress or hosting renewal, a budget cycle?',
  },
  {
    title: 'What happens after the RFI',
    body: 'What are the next stages of your evaluation, and when do you expect to make a decision?',
  },
  {
    title: 'What you need from us',
    body: 'What would make Optimizely an easy choice to recommend internally? Is there anything we can prepare for your stakeholders?',
  },
];

// ---------------------------------------------------------------------------
// Questionnaire renderer (same as /demo/rfi). Inline HTML in rfiDocument.ts is
// static, trusted content (only <strong>, <em> and mailto links).
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

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

// ---------------------------------------------------------------------------

export default function RfiOverviewPage() {
  return (
    <div className={`rfi-doc rfi-overview ${condensed.variable} ${mono.variable}`}>
      <header className="max-w-6xl mx-auto px-5 pt-10 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip chip-green">Optimizely &times; eHealth</span>
          <span className="chip chip-neutral">CMS / DXP RFI</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">From ticket queue to self-service</h1>
        <p className="lede mt-3 max-w-3xl">
          Your RFI, mapped to a working eHealth site on Optimizely CMS SaaS. This page plays back what we heard, how
          today&apos;s session is organized and where each section of your RFI shows up, so you can hold us to it.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <a className="pill-link" href={DEMO_SITE} target="_blank" rel="noopener noreferrer">
            Open the demo site <span aria-hidden="true">&#8599;</span>
          </a>
          <a className="pill-link pill-link-ghost" href="#agenda">
            Today&apos;s agenda
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 pb-16 grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-8">
        <aside className="hidden lg:block">
          <nav className="card p-4! sticky top-4 max-h-[92vh] overflow-y-auto" aria-label="Contents">
            <div className="chip chip-neutral mb-3">Contents</div>
            <ul>
              <li><a className="toc-link font-bold" href="#heard">What we heard</a></li>
              <li><a className="toc-link font-bold" href="#priorities">Your priorities</a></li>
              <li><a className="toc-link font-bold" href="#agenda">Today&apos;s agenda</a></li>
              <li><a className="toc-link font-bold" href="#coverage">RFI coverage</a></li>
              <li><a className="toc-link font-bold" href="#questions">Questions for you</a></li>
              <li><a className="toc-link font-bold" href="#next">Next steps</a></li>
              <li><a className="toc-link" href="#original">Your RFI (reference)</a></li>
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 grid gap-8">
          {/* ---- 1. What we heard ---- */}
          <section id="heard" className="card">
            <Eyebrow>01 &middot; What we heard</Eyebrow>
            <h2 className="prep-h2">Your words, played back</h2>
            <p className="doc-p">
              From the Business Context in your RFI. If we&apos;ve got any of this wrong, now&apos;s the time to tell us.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {HEARD.map((h) => (
                <div key={h.title} className="heard">
                  <div className="heard-title">{h.title}</div>
                  <p>{h.body}</p>
                </div>
              ))}
            </div>

            <div className="callout">
              <div className="callout-title">One thing we&apos;d like to check with you</div>
              <p>
                Every ticket for a page change costs time, and that time is worth the most during Medicare AEP and ACA
                Open Enrollment, when shoppers are comparing plans right now. So the goal isn&apos;t just to replace
                WordPress. It&apos;s to let your teams ship, change and test revenue pages in those windows without
                waiting on engineering. Is that how it feels from your side?
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {STATS.map((s) => (
                <div key={s.label} className="stat">
                  <div className="stat-num">{s.value}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ---- 2. Priorities ---- */}
          <section id="priorities" className="card">
            <Eyebrow>02 &middot; Your priorities</Eyebrow>
            <h2 className="prep-h2">How Optimizely meets each one</h2>
            <p className="doc-p">
              Your RFI asks whether each capability is native to the CMS or built in the front end, so we&apos;ve labelled
              that for each priority.
            </p>
            <div className="tbl-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Your priority</th>
                    <th>What you asked for</th>
                    <th>How it works with Optimizely</th>
                    <th>Where it lives</th>
                  </tr>
                </thead>
                <tbody>
                  {PRIORITIES.map((p) => (
                    <tr key={p.priority}>
                      <td><strong>{p.priority}</strong></td>
                      <td>{p.said}</td>
                      <td>{p.how}</td>
                      <td>
                        <div className="flex flex-col items-start gap-2">
                          {p.where.map(([label, tone]) => (
                            <span key={label} className={`chip chip-${tone}`}>
                              {label}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="doc-p note">
              <strong>Where we differ from Yoast:</strong> rather than a live readability score on every draft, editors get
              an AI review in the CMS that proposes changes for approval. We&apos;ll show both sides today so you can judge
              which fits your team.
            </p>
          </section>

          {/* ---- 3. Agenda ---- */}
          <section id="agenda" className="card">
            <Eyebrow>03 &middot; Today&apos;s agenda</Eyebrow>
            <h2 className="prep-h2">60 minutes, all on a working site</h2>
            <p className="doc-p">
              The story: <strong>an Individual &amp; Family marketer and a Medicare marketer share one homepage during
              overlapping enrollment windows.</strong> They change it, test it and personalize it without engineering.
              Then your engineers see how it&apos;s built.
            </p>
            <ol className="flow">
              {AGENDA.map((step, i) => (
                <li key={step.title}>
                  <div className="flow-head">
                    <span className="flow-num">{i}</span>
                    <span className="flow-title">{step.title}</span>
                    <span className="chip chip-neutral">{step.time}</span>
                    <span className="chip chip-blue">RFI {step.refs}</span>
                  </div>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* ---- 4. Coverage ---- */}
          <section id="coverage" className="card">
            <Eyebrow>04 &middot; RFI coverage</Eyebrow>
            <h2 className="prep-h2">Where each section of your RFI shows up</h2>
            <div className="tbl-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>RFI section</th>
                    <th>Agenda step</th>
                    <th>How we cover it</th>
                  </tr>
                </thead>
                <tbody>
                  {COVERAGE.map((c) => (
                    <tr key={c.section}>
                      <td>{c.section}</td>
                      <td>{c.where}</td>
                      <td>{c.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---- 5. Questions ---- */}
          <section id="questions" className="card">
            <Eyebrow>05 &middot; Questions for you</Eyebrow>
            <h2 className="prep-h2">Help us get the details right</h2>
            <p className="doc-p">We&apos;ll weave these in as we go. Your answers help us tailor what we show today and what we send afterwards.</p>
            <ul className="doc-ul">
              {QUESTIONS.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </section>

          {/* ---- 6. Next steps ---- */}
          <section id="next" className="card card-accent">
            <Eyebrow>06 &middot; Next steps</Eyebrow>
            <h2 className="prep-h2">Help us support your evaluation</h2>
            <p className="doc-p">
              To bring you the right people and information at the right time, it helps to understand how you&apos;ll
              make this decision.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {DECISION.map((d) => (
                <div key={d.title} className="heard">
                  <div className="heard-title">{d.title}</div>
                  <p>{d.body}</p>
                </div>
              ))}
            </div>
            <h3 className="doc-h3">What we&apos;ll send after today</h3>
            <ul className="doc-ul">
              <li>Written answers to anything we couldn&apos;t fully cover today, with documentation links.</li>
              <li>Security and compliance documentation for your security team (RFI Section 12).</li>
              <li>A deeper session with your engineering or security team, if that would help.</li>
            </ul>
          </section>

          {/* ---- Appendix: original RFI ---- */}
          <section id="original" className="card rfi-original">
            <details>
              <summary>
                <span className="chip chip-neutral">Reference</span>
                <span className="summary-title">Your RFI, as issued</span>
                <span className="summary-hint" aria-hidden="true" />
              </summary>
              <div className="mt-6">
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
              </div>
            </details>
          </section>
        </div>
      </main>
    </div>
  );
}
