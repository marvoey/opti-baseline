'use client';

import {
  Deck,
  Slide,
  Heading,
  FlexBox,
  Notes,
  fadeTransition,
} from 'spectacle';

// ─── Brand tokens ────────────────────────────────────────────────────────────
const BLUE   = '#0077b3';
const DARK   = '#001a6e';
const GREEN  = '#00a651';
const WHITE  = '#ffffff';
const SLATE  = '#64748b';
const LIGHT  = '#f0f7fc';
const BORDER = '#bfdbee';

// ─── Theme ───────────────────────────────────────────────────────────────────
const theme = {
  colors: {
    primary:    WHITE,
    secondary:  BLUE,
    tertiary:   DARK,
    quaternary: GREEN,
  },
  fonts: {
    header: '"Roboto", system-ui, sans-serif',
    text:   '"Roboto", system-ui, sans-serif',
    monospace: '"Geist Mono", "Fira Code", monospace',
  },
  fontSizes: {
    h1: '2.6rem',
    h2: '1.9rem',
    h3: '1.4rem',
    text: '1rem',
    monospace: '0.85rem',
  },
  space: [0, 4, 8, 16, 32, 48, 64],
};

// ─── Reusable primitives ─────────────────────────────────────────────────────

function KmBadge({ id }: { id: string }) {
  return (
    <span style={{
      display: 'inline-block',
      background: BLUE,
      color: WHITE,
      fontWeight: 700,
      fontSize: '0.8rem',
      letterSpacing: '0.05em',
      padding: '3px 12px',
      borderRadius: 999,
      marginRight: 8,
    }}>
      {id}
    </span>
  );
}

function RouteChip({ route }: { route: string }) {
  return (
    <span style={{
      display: 'inline-block',
      background: '#1e293b',
      color: '#a5f3fc',
      fontFamily: 'monospace',
      fontSize: '0.82rem',
      padding: '4px 12px',
      borderRadius: 6,
      marginTop: 10,
    }}>
      {route}
    </span>
  );
}

function AnnounceBlock({ text }: { text: string }) {
  return (
    <div style={{
      background: LIGHT,
      border: `1px solid ${BORDER}`,
      borderLeft: `4px solid ${BLUE}`,
      borderRadius: 8,
      padding: '14px 18px',
      marginBottom: 12,
    }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: BLUE, textTransform: 'uppercase', marginBottom: 6 }}>
        Say this →
      </div>
      <div style={{ color: '#1e3a5f', fontSize: '0.88rem', lineHeight: 1.55, fontStyle: 'italic' }}>
        {text}
      </div>
    </div>
  );
}

function ClaimBlock({ id, text }: { id: string; text: string }) {
  return (
    <div style={{
      borderLeft: `4px solid ${BLUE}`,
      paddingLeft: 14,
      marginBottom: 10,
    }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: BLUE, letterSpacing: '0.05em', marginBottom: 3 }}>{id}</div>
      <div style={{ fontSize: '0.82rem', color: '#1e293b', lineHeight: 1.45 }}>{text}</div>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
      <div style={{
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: BLUE,
        color: WHITE,
        fontSize: '0.72rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
      }}>
        {n}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>{text}</div>
    </div>
  );
}

// ─── Slide layouts ────────────────────────────────────────────────────────────

function SectionSlide({
  actLabel,
  title,
  duration,
  bullets,
}: {
  actLabel: string;
  title: string;
  duration: string;
  bullets: string[];
}) {
  return (
    <Slide backgroundColor={DARK}>
      <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="flex-start" padding="0 64px">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ color: GREEN, fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {actLabel}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.12)', color: WHITE, fontSize: '0.75rem', padding: '3px 12px', borderRadius: 999 }}>
            {duration}
          </span>
        </div>
        <Heading fontSize="2.6rem" color={WHITE} margin="0 0 28px 0">{title}</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ color: GREEN, fontWeight: 700, marginTop: 2 }}>→</span>
              <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1rem', lineHeight: 1.45 }}>{b}</span>
            </div>
          ))}
        </div>
      </FlexBox>
    </Slide>
  );
}

function UseCaseSlide({
  num,
  kmIds,
  title,
  announce,
  route,
  steps,
  claims,
  notes,
}: {
  num: number;
  kmIds: string[];
  title: string;
  announce: string;
  route?: string;
  steps: string[];
  claims: { id: string; text: string }[];
  notes?: string;
}) {
  return (
    <Slide backgroundColor={WHITE} padding="0">
      {/* Top bar */}
      <div style={{
        background: DARK,
        padding: '10px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {kmIds.map(id => <KmBadge key={id} id={id} />)}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em' }}>
          USE CASE {num}
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '12px 32px 0', borderBottom: `1px solid ${BORDER}` }}>
        <Heading fontSize="1.25rem" color={DARK} margin="0 0 10px 0">{title}</Heading>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 0, height: 'calc(100% - 110px)', overflow: 'hidden' }}>
        {/* Left */}
        <div style={{ flex: '0 0 55%', padding: '16px 20px 16px 32px', borderRight: `1px solid ${BORDER}`, overflow: 'auto' }}>
          <AnnounceBlock text={announce} />
          {route && <RouteChip route={route} />}
          <div style={{ marginTop: 16 }}>
            {steps.map((s, i) => <Step key={i} n={i + 1} text={s} />)}
          </div>
        </div>

        {/* Right */}
        <div style={{ flex: '0 0 45%', padding: '16px 32px 16px 20px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: SLATE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            Requirement claims
          </div>
          {claims.map((c, i) => <ClaimBlock key={i} id={c.id} text={c.text} />)}
        </div>
      </div>

      {notes && <Notes>{notes}</Notes>}
    </Slide>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalkthroughPage() {
  return (
    <Deck theme={theme} transition={fadeTransition}>

      {/* ── 1. Cover ── */}
      <Slide backgroundColor={DARK}>
        <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
          <div style={{ color: GREEN, fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
            Optimizely CMS SaaS
          </div>
          <Heading fontSize="2.8rem" color={WHITE} textAlign="center" margin="0 0 16px 0">
            Progressive × Optimizely
          </Heading>
          <Heading fontSize="1.5rem" color="rgba(255,255,255,0.65)" textAlign="center" margin="0 0 40px 0" fontWeight={400}>
            Knowledge Management Evaluation
          </Heading>
          <div style={{ display: 'flex', gap: 32, marginBottom: 48 }}>
            {['30 requirements', '10 use cases', '80 minutes'].map(l => (
              <div key={l} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', borderTop: `2px solid ${GREEN}`, paddingTop: 8 }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', letterSpacing: '0.1em' }}>PRESS → TO BEGIN</div>
        </FlexBox>
        <Notes>Welcome. This walkthrough covers all 30 KM requirements from the evaluation spreadsheet across 10 live use cases and a verbal-only block. Total time: 80 minutes.</Notes>
      </Slide>

      {/* ── 2. Context ── */}
      <Slide backgroundColor={WHITE}>
        <div style={{ padding: '32px 48px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Heading fontSize="1.8rem" color={DARK} margin="0 0 24px 0">The problem we're solving</Heading>
          <div style={{ display: 'flex', gap: 40, flex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: SLATE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                Today's pain
              </div>
              {[
                ['Multiple versions of truth', 'SharePoint, email threads, printed binders — no single source'],
                ['No content expiration', 'Outdated copy stays live until someone manually notices'],
                ['Manual extraction under pressure', 'Consultants read 14-page PDFs on live recorded calls'],
                ['Compliance risk', 'Incorrect or incomplete answers; no audit trail'],
              ].map(([title, body]) => (
                <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, marginTop: 2, flexShrink: 0 }}>✕</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{title}</div>
                    <div style={{ color: SLATE, fontSize: '0.82rem', marginTop: 2 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ width: 1, background: BORDER }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: SLATE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                The answer: Tags as Logic
              </div>
              <div style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
                Content is authored as <strong>atomic, tagged sentences</strong> — not documents. LOB + Topic + Jurisdiction tags are not search labels. They are <strong>business rules</strong>.
              </div>
              <div style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
                Opal executes a <strong>logic query</strong> against those tags. It does not summarize a PDF.
              </div>
              <div style={{ background: LIGHT, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GREEN}`, borderRadius: 8, padding: '14px 18px' }}>
                <div style={{ fontSize: '0.82rem', color: '#1e3a5f', fontWeight: 600 }}>
                  "You're not buying a CMS. You're buying seconds — and accuracy — back for every consultant interaction."
                </div>
              </div>
            </div>
          </div>
        </div>
        <Notes>Frame the session before touching the product. Establish the four problems, then introduce the Tags as Logic paradigm. This is the through-line for the entire 80 minutes.</Notes>
      </Slide>

      {/* ── 3. Section: Act 1 ── */}
      <SectionSlide
        actLabel="Act 1"
        title="The Payoff"
        duration="15 min"
        bullets={[
          'Use Case 1 — KM-013, KM-014: AI-enabled search with source citations',
          'Use Case 2 — KM-003: State-specific content without duplication',
        ]}
      />

      {/* ── 4. UC1 ── */}
      <UseCaseSlide
        num={1}
        kmIds={['KM-013', 'KM-014']}
        title="AI-Enabled Search with Source Citations"
        announce="On your evaluation sheet, please find KM-013 — AI-Enabled Search and KM-014 — Source Citations and Trust. We're going to show a consultant asking a live policy question and getting a jurisdiction-correct, cited answer from Opal in under four seconds — no searching, no reading a PDF, no guessing. After this you should be able to mark both of those rows."
        route="/kb-workspace/opal"
        steps={[
          'Open /kb-workspace/opal — Opal Knowledge Assistant loads with DevPanel and Combobox.',
          'Type "hail" in the Combobox — list filters to Personal Auto / Hail/Storm Damage questions.',
          'Submit. Open the DevPanel: walk through each log entry — SSE open, POST trigger, Graph query, response delivered.',
          'PolicyCard renders: National Policy, FL Jurisdictional Override, Consultant Action, Required Disclosure.',
          'Point to the Sources section — content block label and copy type trace back to the authored article.',
        ]}
        claims={[
          { id: 'KM-014', text: 'Every answer includes the source block label and copy type. The cited block traces directly back to the authored CMS content.' },
          { id: 'KM-013', text: 'Opal executes a tag-logic query — it does not summarize documents. Hallucination is structurally eliminated.' },
        ]}
        notes="KM-013: AI-Enabled Search / RAG. KM-014: Source Citations and Trust. The DevPanel is the key proof point — show the GraphQL query being constructed with LOB + Topic + Jurisdiction tags, not free-text search."
      />

      {/* ── 5. UC2 ── */}
      <UseCaseSlide
        num={2}
        kmIds={['KM-003']}
        title="Generic and State-Specific Content Without Duplication"
        announce="Still on the same screen — please find KM-003, Generic and State-Specific Content. We're going to ask the same policy question for California and show that the answer changes — a state-specific override replaces the national baseline — without the Knowledge Manager ever having written two separate full articles. One source of truth, 51 jurisdictions."
        route="/kb-workspace/opal (same session)"
        steps={[
          'In the Combobox, ask the same category of question for California.',
          'Submit. The second PolicyCard renders below the FL answer in the thread.',
          'Compare the two cards: National Policy block is identical. Jurisdictional Override differs — CA shows CA-specific rule.',
          'Explain two-pass routing: Pass 1 finds a state override; Pass 2 falls back to national. Same national block powers both answers.',
        ]}
        claims={[
          { id: 'KM-003', text: 'Authors write a national master article once and a state override only where the rule differs. No full article duplication — the routing logic assembles the correct answer at query time.' },
        ]}
        notes="KM-003: Generic and State-Specific Content. The key point is that the Core Principle block is identical in both answers — only the Jurisdictional Override field differs. One authored block, 51 resolved answers."
      />

      {/* ── 6. Section: Act 2 ── */}
      <SectionSlide
        actLabel="Act 2"
        title="Governed vs Ungoverned"
        duration="15 min"
        bullets={[
          'Use Case 3 — KM-017: Why governance prevents hallucination',
          'Use Case 4 — KM-015, KM-004: AI freshness and active date enforcement',
        ]}
      />

      {/* ── 7. UC3 ── */}
      <UseCaseSlide
        num={3}
        kmIds={['KM-017', 'KM-013']}
        title="Governance — Preventing Hallucination"
        announce="Please find KM-017 — Governance in your evaluation sheet. This one addresses a question we expect to come up: 'why not just use ChatGPT?' We're going to open the developer panel and show exactly what query Opal executes, then point to the mandatory legal disclosure block and ask whether a generic LLM can guarantee that language appears verbatim every time. The answer is no — and we'll show you why structurally."
        route="/kb-workspace/opal (DevPanel open)"
        steps={[
          'Ask a new question — e.g., "What is the rideshare coverage exclusion in California?"',
          'Open DevPanel: point to the GraphQL filter — LOB: Personal Auto, Topic: Rideshare Coverage, Jurisdiction: CA. Not free-text search.',
          'Point to the Required Disclosure block (red-tinted). A generic LLM would paraphrase this. Opal renders the locked authored copy unchanged.',
          'Contrast verbally: ungoverned AI generates prose — plausible, no citation, no jurisdiction, no disclosure guarantee.',
        ]}
        claims={[
          { id: 'KM-017', text: 'Only published, approved, active-dated content reaches the AI layer. Draft, expired, or unapproved blocks are excluded at the query level — before the LLM sees them.' },
          { id: 'KM-013', text: 'Governed RAG is not about adding a citation after generation. The LLM has no opportunity to generate — it only renders pre-authored copy.' },
        ]}
        notes="KM-017: Governance. The Required Disclosure block is the sharpest proof point — mandatory legal language that a generic LLM would never guarantee verbatim. Compliance teams on recorded calls cannot accept paraphrased disclosures."
      />

      {/* ── 8. UC4 ── */}
      <UseCaseSlide
        num={4}
        kmIds={['KM-015', 'KM-004']}
        title="AI Freshness and Publishing Sync"
        announce="Please find KM-015 — AI Freshness and Publishing Sync, and while you're there KM-004 — Active Dates is right above it. A question we get is: 'if a regulation changes at midnight, when does the old answer stop showing up?' We're going to answer that — no cache-busting, no manual unpublish, the expiration date on the block handles it."
        route="/kb-workspace/opal + verbal"
        steps={[
          'Explain the pipeline: author publishes → Optimizely Graph reindexes → next query resolves the updated block (minutes, not hours).',
          'Active dates: a block with an expiration date is automatically excluded from query results after that date — no manual unpublish step.',
          'Offer to show /kb-workspace/test to confirm live content state if pressed.',
        ]}
        claims={[
          { id: 'KM-015', text: 'New and updated articles propagate to search and AI answers within minutes of publish. Expired content is excluded from the next query, not the next cache flush.' },
          { id: 'KM-004', text: 'Publish date, expiration date, review date, and timezone are metadata fields on each block. The routing query filters by active date range at query time.' },
        ]}
        notes="KM-015: AI Freshness and Publishing Sync. KM-004: Active Dates. The expiration is enforced structurally at query time — not as a scheduled job or manual step. This is critical for jurisdiction-specific regulation changes."
      />

      {/* ── 9. Section: Act 3 ── */}
      <SectionSlide
        actLabel="Act 3"
        title="The Content Engine"
        duration="20 min"
        bullets={[
          'Use Case 5 — KM-002: Structured templates and content model',
          'Use Case 6 — KM-012: Knowledge search for authors',
          'Use Case 7 — KM-009: Content reuse across answers',
          'Use Case 8 — KM-005, KM-006: Workflow and versioning',
        ]}
      />

      {/* ── 10. UC5 ── */}
      <UseCaseSlide
        num={5}
        kmIds={['KM-002', 'KM-003']}
        title="Structured Templates and Content Model"
        announce="We're going to shift perspective now — from what the consultant sees to what the Knowledge Manager builds. Please find KM-002 — Structured Templates on your sheet. We're going to step behind that Opal answer and show the actual content model: what fields Marcus fills in, why the taxonomy tags are routing rules and not search labels, and where the active date lives on every block."
        route="/kb-workspace/cms"
        steps={[
          'Navigate to /kb-workspace/cms — left column shows the Opal answer card; right column shows the CMS field structure.',
          'Hover "National Policy" on the left → Core Definition field highlights on the right (national, no override).',
          'Hover "Florida Override" → Deductible Rules field highlights (LOB: Personal Auto, Topic: Hail/Storm, Jurisdiction: FL).',
          'Point to taxonomy fields: LOB, Peril/Topic, Variation tags — routing rules, not search keywords.',
          'Point to Settings: Active Date — expiration and publish date live here on every block.',
        ]}
        claims={[
          { id: 'KM-002', text: 'Content type enforces required fields — taxonomy and rich text are required. Authors cannot publish without tagging. Validation is at the content type level.' },
          { id: 'KM-003', text: 'A state override block shares the same taxonomy as the national block except for the Jurisdiction tag. The routing logic reads tags as logic gates.' },
        ]}
        notes="KM-002: Structured Templates. KM-003 (supporting). The hover-to-highlight interaction is the key proof point — it closes the black-box question by mapping the rendered answer back to the exact authored fields."
      />

      {/* ── 11. UC6 ── */}
      <UseCaseSlide
        num={6}
        kmIds={['KM-012']}
        title="Knowledge Search — Finding Content as an Author"
        announce="Please find KM-012 — Knowledge Search. This is about how Knowledge Managers and authors find content in the library — not how consultants get answers. We're going to open the content admin, search by keyword, then stack filters by copy type, line of business, topic, and jurisdiction to land on exactly the right block in a few clicks. No SharePoint, no scrolling."
        route="/admin/copy-types"
        steps={[
          'Open /admin/copy-types — stat dashboard shows total published items + count per copy type.',
          'Type "hail" in the search box — table filters in real time to matching internal names.',
          'Use Type dropdown → "Jurisdictional Override". Add LOB → "Personal Auto". Add Topic → "Hail/Storm Damage".',
          'Point to the Jurisdiction column — shows which states have overrides vs. national fallback at a glance.',
          'Click Edit on any row — full block content, taxonomy, and active date fields are directly accessible.',
        ]}
        claims={[
          { id: 'KM-012', text: 'The content library is fully searchable by name, copy type, LOB, topic, and jurisdiction without developer tooling. For end users and external apps, the same Optimizely Graph GraphQL API handles search filtered by role and active-date rules.' },
        ]}
        notes="KM-012: Knowledge Search. The key distinction from KM-013 (AI search) is that this is the author-facing browse/search tool. The same metadata that routes consultant answers is what makes the library findable."
      />

      {/* ── 12. UC7 ── */}
      <UseCaseSlide
        num={7}
        kmIds={['KM-009', 'KM-008']}
        title="Content Reuse — One Block, Many Answers"
        announce="Please find KM-009 — Content Reuse, and KM-008 — Workspaces is right above it if you want to mark that alongside. We're going to show that a national statutory disclosure is authored once and resolved into every applicable consultant answer automatically — and that a single compliance edit propagates everywhere without a find-and-replace."
        route="/kb-workspace/test"
        steps={[
          'Open /kb-workspace/test — select LOB: Personal Auto, Topic: Glass Claim.',
          'Point to Statutory Disclosures section — the same national block appears.',
          'Change topic to Roadside Assistance — the Statutory Disclosure is the same block.',
          'Add jurisdiction FL — Override section changes; Disclosure may add FL-specific language.',
          'Explain: one authored block resolves into every state where no override exists.',
        ]}
        claims={[
          { id: 'KM-009', text: 'Shared content — disclaimers, standard language, procedural safeguards — is authored once. A change propagates to every resolved answer automatically. No bulk find-and-replace.' },
          { id: 'KM-008', text: 'Content access is scoped by LOB at the query level. Different frontline teams see only content relevant to their line of business.' },
        ]}
        notes="KM-009: Content Reuse. KM-008: Workspaces (supporting). A compliance update to a national disclosure requires one edit in one block — every consultant answer in every state updates on the next query."
      />

      {/* ── 13. UC8 ── */}
      <UseCaseSlide
        num={8}
        kmIds={['KM-005', 'KM-006']}
        title="Workflow, Versioning, and Approval"
        announce="Please find KM-005 — Assignment and Approval and KM-006 — Versioning and Rollback. We're going to walk through what happens before a block goes live — the authoring, review, and approval workflow — and then show how version history lets compliance teams answer 'what exact copy was Opal serving on the date of this recorded call?'"
        route="Verbal + Optimizely CMS admin (if available)"
        steps={[
          'Content lifecycle: Draft → Review → Approve → Publish, each with role assignment and notifications.',
          'Every save creates a version. Reviewers diff two versions side by side. Rollback restores any prior version.',
          'Approval history logs who approved, when, and from which version — full audit trail.',
        ]}
        claims={[
          { id: 'KM-005', text: 'Content moves through Author → Review → Approve → Publish roles. No content reaches the live index without passing the defined workflow.' },
          { id: 'KM-006', text: 'Version history is maintained per block. The publish history shows which version was live at any given date — critical for compliance audits on recorded calls.' },
        ]}
        notes="KM-005: Assignment and Approval. KM-006: Versioning and Rollback. If the live CMS admin is available, show the version diff UI. If not, describe verbally — the compliance audit angle (what was Opal saying on the date of this call?) lands well with legal/compliance buyers."
      />

      {/* ── 14. Section: Architecture ── */}
      <SectionSlide
        actLabel="Architecture Deep-Dive"
        title="For Technical Buyers"
        duration="10 min"
        bullets={[
          'Use Case 9 — KM-028, KM-029, KM-031: APIs, webhooks, and the agentic loop',
          'Use Case 10 — KM-026, KM-027: Content source of truth and data residency',
        ]}
      />

      {/* ── 15. UC9 ── */}
      <UseCaseSlide
        num={9}
        kmIds={['KM-028', 'KM-029', 'KM-031']}
        title="APIs, Webhooks, and the Agentic Loop"
        announce="For the technical folks in the room — please find KM-028 — Search and RAG APIs, KM-029 — AI Security and Permissions, and KM-031 — APIs, Webhooks, and Integrations. A question we always get is: 'is this a mockup or is there real infrastructure behind it?' We're going to run an animated simulation of the actual async agent loop — step by step, with the real JSON payloads at each node."
        route="/kb-workspace/webhook"
        steps={[
          'Click Run Simulation — walk through each node: Consultant UI → Webhook Trigger → Agent Reasoning → CMS SaaS Content → Push to CRM.',
          'GraphQL query: LOB + Topic + Jurisdiction tags — standard authenticated call, same endpoint external apps use.',
          'push_to_crm_ui tool: Opal pushes the assembled answer back to the workspace via SSE.',
          'Point to JSON payload panel — these are the actual payload shapes for each step.',
        ]}
        claims={[
          { id: 'KM-028', text: 'Optimizely Graph exposes a standard authenticated GraphQL API. Every Opal query is a documented call — external applications use the same endpoint.' },
          { id: 'KM-029', text: 'The GraphQL query inherits CMS access controls. Unpublished, expired, or role-restricted blocks are excluded before the LLM sees them.' },
          { id: 'KM-031', text: 'Trigger is a webhook POST. Response delivery is SSE. Content fetch is GraphQL. All standard, documented interfaces — no proprietary black-box protocol.' },
        ]}
        notes="KM-028, KM-029, KM-031. The webhook diagram answers the 'is this real?' question for architects. The payload inspector on the right is the proof — these are not mocked shapes."
      />

      {/* ── 16. UC10 ── */}
      <UseCaseSlide
        num={10}
        kmIds={['KM-026', 'KM-027']}
        title="Content Source of Truth and Data Residency"
        announce="Please find KM-026 — Content Source of Truth and KM-027 — AI Index and Data Residency. This one is verbal — we're going to cover where the authoritative content actually lives, where the search index is derived from, and what controls govern data residency, tenant isolation, and deletion. Security and legal teams usually want notes on this one."
        route="Verbal"
        steps={[
          'Authoritative content lives in Optimizely CMS SaaS — not in a vector database, not in a vendor LLM context window.',
          'Optimizely Graph is the CDN-edge GraphQL delivery layer — it serves published content only. No shadow index.',
          'Deleted or unpublished content is removed from the Graph index on next sync.',
          'Data residency, tenant isolation, retention, and deletion governed by the Optimizely SaaS agreement.',
        ]}
        claims={[
          { id: 'KM-026', text: 'The CMS is the single source of truth. There is no secondary AI-managed content store that can drift from what authors approved.' },
          { id: 'KM-027', text: 'Search indexes are derived exclusively from published, active-dated CMS content. Embeddings and vector stores, if used, are bounded by the same publish/expiration rules.' },
        ]}
        notes="KM-026, KM-027. Security architects and legal teams care most about this one. The key point: there is no proprietary shadow index or LLM context window storing content outside the customer's governed CMS."
      />

      {/* ── 17. Verbal-Only ── */}
      <Slide backgroundColor={WHITE} padding="0">
        <div style={{ padding: '20px 40px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ marginBottom: 16 }}>
            <Heading fontSize="1.4rem" color={DARK} margin="0 0 6px 0">Verbal-Only Requirements</Heading>
            <div style={{ fontSize: '0.78rem', color: SLATE, fontStyle: 'italic' }}>
              Announce each KM number aloud before the response so evaluators can follow on their sheet.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, overflow: 'auto' }}>
            {[
              { id: 'KM-001', title: 'Authoring', body: 'Knowledge Managers author, tag, and publish entirely in the CMS admin UI. No deployment, no code change.' },
              { id: 'KM-004', title: 'Active Dates', body: 'Publish date, expiration, review date, and timezone on every block. Filtered at query time.' },
              { id: 'KM-007', title: 'Concurrent Editing', body: 'Draft locking — a second editor sees the lock owner and cannot create a conflicting draft without an explicit override.' },
              { id: 'KM-008', title: 'Workspaces', body: 'Content access by LOB and channel enforced at the GraphQL layer. Reader role control by skill/group without vendor support.' },
              { id: 'KM-010', title: 'Accessibility', body: 'Authored rich text conforms to WCAG 2.1 AA. PDF and print-friendly export via the delivery API.' },
              { id: 'KM-011', title: 'Migration', body: 'Bulk import tooling and REST/GraphQL export available. SharePoint migration via Optimizely utilities or custom ETL.' },
              { id: 'KM-018', title: 'Analytics', body: 'Search term reporting, failed queries, article usefulness ratings, and content gap identification in Optimizely Analytics.' },
              { id: 'KM-019 / 020', title: 'Environments', body: 'Separate non-prod and prod environments. Content models and configs promoted via CMS CLI — no manual re-config in prod.' },
              { id: 'KM-021', title: 'SSO & Provisioning', body: 'SAML 2.0, SCIM 2.0, group-to-role mapping, JIT provisioning, and automated deprovisioning supported natively.' },
              { id: 'KM-022', title: 'Role-Based Access', body: 'Roles and permissions configured by workspace, content type, and CRUD action in the admin UI without vendor support.' },
              { id: 'KM-023', title: 'Audit Logs', body: 'All article changes, approvals, publishing events, permission changes, and API access logged with timestamps and actor identity.' },
              { id: 'KM-024 / 025', title: 'Performance & SLA', body: 'Address per the standard SaaS SLA deck — uptime commitments, RPO/RTO, and indexing volume limits.' },
              { id: 'KM-030', title: 'AI Model & Vendor', body: 'Opal uses Optimizely-hosted models by default. Customer-selectable model, region, or BYOM — confirm current roadmap with product team.' },
            ].map(({ id, title, body }) => (
              <div key={id} style={{
                background: '#f8fafc',
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: '10px 14px',
              }}>
                <div style={{ marginBottom: 4 }}><KmBadge id={id} /></div>
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.82rem', marginBottom: 4 }}>{title}</div>
                <div style={{ color: SLATE, fontSize: '0.75rem', lineHeight: 1.45 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
        <Notes>Move quickly through these — approximately 5 minutes total. Say each KM ID number out loud before the one-sentence response so evaluators can find and mark their row. These are platform capabilities not visible in the demo app.</Notes>
      </Slide>

      {/* ── 18. Known Gaps ── */}
      <Slide backgroundColor={WHITE} padding="0">
        <div style={{ padding: '28px 48px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Heading fontSize="1.6rem" color={DARK} margin="0 0 8px 0">Known Gaps — Address Directly</Heading>
          <div style={{ fontSize: '0.82rem', color: SLATE, marginBottom: 24, fontStyle: 'italic' }}>
            These were flagged in Progressive's evaluation notes. Do not skip them.
          </div>
          <div style={{ display: 'flex', gap: 20, flex: 1 }}>
            {[
              {
                title: 'User Feedback & Ratings',
                status: 'Roadmap',
                body: 'Not natively in the current build. Opal answer cards can surface a thumbs-up/down widget; feedback writes back to analytics. Full feedback-to-authoring workflow is on the roadmap. Current workaround: analytics dashboard surfaces failed searches and unanswered questions.',
              },
              {
                title: 'Assessing AI Response Quality',
                status: 'Tractable',
                body: "Opal's governed model makes this tractable — because the answer is assembled from cited blocks, quality assessment happens at the block level, not the response level. A block that generates consistently poor feedback can be identified and revised.",
              },
              {
                title: 'Duplicate Content Detection',
                status: 'Not native',
                body: 'The structured content model reduces the surface area significantly — LOB + Topic + Jurisdiction is a composite key, so true duplicates are rejected at the content type level. Fuzzy similarity detection across rich text fields is not currently built in.',
              },
            ].map(({ title, status, body }) => (
              <div key={title} style={{
                flex: 1,
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderTop: `4px solid #f59e0b`,
                borderRadius: 8,
                padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem' }}>{title}</div>
                  <span style={{
                    background: status === 'Roadmap' ? '#dbeafe' : status === 'Tractable' ? '#dcfce7' : '#fee2e2',
                    color: status === 'Roadmap' ? '#1d4ed8' : status === 'Tractable' ? '#166534' : '#991b1b',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}>
                    {status}
                  </span>
                </div>
                <div style={{ color: '#78350f', fontSize: '0.8rem', lineHeight: 1.55 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
        <Notes>Do not skip this slide. Progressive flagged all three gaps in their evaluation notes. Address each one directly — giving an honest assessment builds more trust than glossing over gaps. The framing for each is already on the slide.</Notes>
      </Slide>

      {/* ── 19. Closing ── */}
      <Slide backgroundColor={DARK}>
        <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center" padding="0 64px">
          <div style={{ color: GREEN, fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
            Closing
          </div>
          <div style={{
            color: WHITE,
            fontSize: '1.6rem',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.4,
            marginBottom: 40,
            maxWidth: 680,
          }}>
            "You're not buying a content management system. You're buying seconds — and accuracy — back for every consultant interaction."
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 48, width: '100%', maxWidth: 620 }}>
            {[
              ['Act 1', 'A consultant got a jurisdiction-correct, cited answer in four seconds — FL and CA returning different overrides from the same national baseline.'],
              ['Act 2', 'The DevPanel showed what governance means: Opal executes a tag-logic query, the LLM renders pre-approved copy, and mandatory disclosures are locked.'],
              ['Act 3', 'Marcus authors atomic blocks once. Every consultant in every state benefits — without a developer in the loop.'],
            ].map(([act, desc]) => (
              <div key={act} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ color: GREEN, fontWeight: 700, flexShrink: 0 }}>{act}</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.08em' }}>OPEN FOR Q&A</div>
        </FlexBox>
        <Notes>Return to the core message. Restate the three-act proof briefly, then open the floor. If questions go deep on architecture, the /kb-workspace/webhook diagram is already available. If questions go deep on content model, /kb-workspace/cms is already available.</Notes>
      </Slide>

    </Deck>
  );
}
