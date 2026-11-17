'use client';

import React, { useState } from 'react';
import { CSS, Chip, Eyebrow, SectionTitle, DocLink, Callout, Code, TH, TD } from './_ui';

/* Speaker-only reference material for the ODP demo, shown in the presenter window (_presenter.jsx), never in the
   audience window: RFP figures to confirm, traceability to the slide, how the three scripts fit, and the setup
   checklist, snippets and gaps. Moved here from the old Overview and Setup & gaps tabs of page.jsx. */

const TRACE_ROWS = [
    ['Single, durable client view from first-party signals', 'ODP keeps one profile per person. Web events, imported events and attributes all attach to it through identifiers.', 'Which feeds land in ODP first (the slide notes mention 100+ inbound feeds), and which identifiers each one carries.'],
    ['Identity resolution and audience deduplication at enterprise scale', 'Email is high-confidence, the browser cookie (vuid) is low-confidence. A matching email merges profiles, so audiences count people, not cookies.', 'Identifier strategy beyond email (for example a MyBlock account ID as a custom identifier). Sizing for 44.5M profiles.'],
    ['Dynamic audience construction', 'Real-time audience builder: attribute and event conditions, include/exclude groups, up to 28 days of event lookback.', 'The 28-day event window versus a 16-week season. Persist long-lived signals as profile attributes.'],
    ['Instant cross-channel activation', 'On-site: Web Experimentation pulls a visitor\u2019s real-time audiences from ODP at page activation. Other channels use ODP standard audiences and activations (not shown in this demo).', 'Peak of 5,000 events/sec, and the Web Experimentation public-key limit of 1M ODP calls per day.'],
];

const SNIP_HEAD = [
  '<head>',
  '  <!-- 1. ODP JavaScript tag first. Keep it synchronous so the vuid exists -->',
  '  <!--    before Web Experimentation asks for it. -->',
  '  <script>/* ODP tag from your ODP account */</script>',
  '',
  '  <!-- 2. Optimizely Web Experimentation snippet second -->',
  '  <script src="https://cdn.optimizely.com/js/{{PROJECT_ID}}.js"></script>',
  '</head>',
].join('\n');
const SNIP_CLICKS = [
  '// Send the same events your import script sends, so seeded and live data line up.',
  "document.addEventListener('click', function (e) {",
  "  var el = e.target.closest('[data-event-key]');",
  '  if (!el || !window.zaius) return;',
  "  window.zaius.event('hrblock', {",
  '    action: el.dataset.eventKey,   // appointment_cta_click | diy_start_click',
  '    page: location.pathname,',
  '    value: el.textContent.trim()',
  '  });',
  '});',
].join('\n');
const SNIP_IDENTIFY = [
  "// When someone signs in to MyBlock, tie this browser's vuid to their email.",
  "window.zaius.event('customer', { action: 'login', email: signedInEmail });",
  '',
  '// Or update identifiers and attributes directly (the vuid is added automatically):',
  'window.zaius.customer({ email: signedInEmail }, { first_name: firstName });',
].join('\n');
const SNIP_CHECK = [
  '// Which real-time audiences does ODP report for me?',
  'window["optimizely"].get("visitor")["vendor.odp"]["audiences"]',
  '',
  '// Am I in the campaign holdback?',
  "window.optimizely.get('state').getCampaignStateLists()['<campaignId>'].isInCampaignHoldback",
].join('\n');
const SNIP_CMDS = [
  'node odp-setup-hrblock-schema.mjs',
  'node odp-import-hrblock-profiles.mjs --count 200 --days 14',
  '',
  '# Refresh profiles later without duplicating events:',
  'node odp-import-hrblock-profiles.mjs --count 200 --days 14 --profiles-only',
].join('\n');

const CHECKLIST = [
  { group: 'ODP', items: [
    ['Create the hrb_* custom fields', 'Run the setup script once. Field names cannot be renamed after creation.'],
    ['Import profiles and events', 'Run the import script. ODP processes asynchronously, so allow a few minutes.'],
    ['Connect the event-action pairs', 'In the real-time audience builder, connect hrblock / appointment_cta_click, hrblock / diy_start_click and pageview / view.'],
    ['Build the four event-based real-time audiences', 'Customers > Audiences > New Audience > Real-Time Audience. Lookback of 28 days at most.'],
  ] },
  { group: 'Site', items: [
    ['Add the ODP tag before the Web Experimentation snippet', 'If you use the ODP vuid as the visitor ID, the ODP tag cannot load asynchronously.'],
    ['Send the two click events', 'Use the data-event-key hooks already on the hero buttons.'],
    ['Identify on sign-in', 'Send the email with the login event so the vuid links to the person.'],
  ] },
  { group: 'Web Experimentation', items: [
    ['Turn on Real-Time Segments', 'Settings > Integrations > Real-Time Segments. Add the ODP public and private keys and the region. User ID: ODP vuid (low confidence).'],
    ['Create the audiences', 'Audiences > Create New Audience > Real-Time Segments > Custom Segments, then pick the ODP audience.'],
    ['Create the personalization campaign', 'Home page, one experience per audience, prioritized, 5% holdback.'],
    ['Add the metrics', 'Click events on the two data-event-key elements. Primary: appointment_cta_click.'],
    ['QA with the console checks', 'Check the audiences array and the holdback flag below.'],
  ] },
];
const GAPS = [
  ['Imported events carry an email only', 'A live browser has a vuid and no link to a seeded profile, so it will not match seeded audiences.', 'Sign in as a seeded profile in the demo, or add a vuid to a few demo events.'],
  ['hrb_* attributes are written once', 'Live clicks do not update hrb_filing_preference, so attribute-based audiences go stale.', 'Use event-based audiences for live behaviour. If you need attributes, add a job that writes them back.'],
  ['28-day event lookback', 'Seeded events are timestamped relative to the import. After 28 days they stop counting in real-time audiences.', 'Re-send events before a demo. Events are not de-duplicated, so expect duplicates.'],
  ['First view of a new visitor', 'ODP may not have the new vuid when the snippet asks, so that load is not bucketed.', 'Expected behaviour. Test with a second page view, and keep the ODP tag first.'],
  ['Web Experimentation call volume', 'The ODP public API key allows 1 million calls per day for this integration. Beyond that, real-time-segment experiments pause until the next day.', 'Size it against peak season traffic before committing to the RFP volumes.'],
  ['RFP slide figures differ from its notes', 'Slide: 25M engageable profiles and 5,000 events/sec. Notes: 20.7M engageable and 1,700 events/sec.', 'Confirm the intended numbers before they go into vendor responses.'],
];

function SetupReference() {
  const [done, setDone] = useState({});
  const all = CHECKLIST.reduce((n, g) => n + g.items.length, 0);
  const count = Object.keys(done).filter((k) => done[k]).length;
  return (
    <div className="p-4">
      <SectionTitle eyebrow="Make it real" title="Setup checklist, snippets and gaps to close">
        Everything needed to reproduce this on hrblock.optimoey.com. Snippets are references: confirm names and settings in your own ODP and Web Experimentation accounts.
      </SectionTitle>

      <div className="hb-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg hb-tx-dark">Checklist</h3>
          <span className="text-sm font-semibold">{count} of {all} done</span>
        </div>
        <div className="mt-2 hb-bar"><div style={{ width: (count / all) * 100 + '%', background: '#005D1F' }} /></div>
        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {CHECKLIST.map((g) => (
            <div key={g.group}>
              <Eyebrow>{g.group}</Eyebrow>
              <ul className="mt-2 space-y-3">
                {g.items.map((it) => {
                  const k = g.group + it[0];
                  return (
                    <li key={k}>
                      <label className="flex cursor-pointer items-start gap-2 text-sm">
                        <input className="mt-1" type="checkbox" checked={!!done[k]} onChange={(e) => setDone({ ...done, [k]: e.target.checked })} />
                        <span><strong>{it[0]}</strong><br /><span className="hb-tx-muted">{it[1]}</span></span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Code label="Run your scripts" code={SNIP_CMDS} />
        <Code label="Page head: order matters" code={SNIP_HEAD} />
        <Code label="Send the two click events" code={SNIP_CLICKS} />
        <Code label="Identify on sign-in" code={SNIP_IDENTIFY} />
        <Code label="QA in the browser console" code={SNIP_CHECK} />
        <div className="space-y-4">
          <Callout title="Keep the private key server-side">Your ODP private API key lives in .env and is only read by the Node scripts. Never put it in the site, in this app, or in client-side code. The Web Experimentation integration asks for the keys in its own project settings.</Callout>
          <Callout title="Documentation">
            <DocLink href="https://docs.optimizely.com/data-platform/docs/websdk-events">ODP Web SDK events</DocLink>{' \u00b7 '}
            <DocLink href="https://docs.optimizely.com/data-platform/docs/build-real-time-audiences-in-odp">Real-time audiences</DocLink>{' \u00b7 '}
            <DocLink href="https://docs.optimizely.com/web-experimentation/docs/configure-real-time-segments-for-web-experimentation">Real-Time Segments</DocLink>{' \u00b7 '}
            <DocLink href="https://docs.optimizely.com/personalization/docs/create-a-campaign-in-optimizely-personalization">Personalization campaigns</DocLink>
          </Callout>
        </div>
      </div>

      <div className="mt-10">
        <SectionTitle title="Gaps and risks to close before a live demo" />
        <div className="hb-card overflow-x-auto">
          <table className="w-full" style={{ minWidth: 720 }}>
            <thead><tr><TH>Gap or risk</TH><TH>Why it matters</TH><TH>What to do</TH></tr></thead>
            <tbody>{GAPS.map((g) => (<tr key={g[0]}><TD className="font-semibold hb-tx-dark">{g[0]}</TD><TD>{g[1]}</TD><TD className="hb-tx-muted">{g[2]}</TD></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ScriptsReference({ eventCount }) {
  return (
<section className="p-4">
        <SectionTitle eyebrow="Your scripts" title="Where your three scripts sit in the picture">
          This app runs the same generator as your import script in the browser: seed 42 and 200 profiles gives {eventCount.toLocaleString()} events and the same filing-preference mix as your dry-run.
        </SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ['odp-client.mjs', 'Shared REST client', 'Reads ODP_PRIVATE_API_KEY from .env, retries 429 and 5xx responses. Server-side only: this key never belongs in a browser or in this app.'],
            ['odp-setup-hrblock-schema.mjs', 'Schema', 'Creates six hrb_* custom fields on the customers object: filing preference, the two click counts, pages viewed, last site event, import batch.'],
            ['odp-import-hrblock-profiles.mjs', 'Profiles and events', 'Generates profiles and their events, derives each profile\u2019s hrb_* attributes from those events, then posts to /v3/profiles and /v3/events.'],
          ].map(([name, tag, text]) => (
            <div key={name} className="hb-card p-5">
              <Chip tone="dark">{tag}</Chip>
              <div className="mt-2 text-sm font-bold hb-mono hb-tx-dark break-words">{name}</div>
              <p className="mt-2 text-sm hb-tx-muted">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4"><Callout title="What the scripts do not cover yet">Imported events carry an email only, so a live browser has no link to a seeded profile until it signs in. The hrb_* attributes are written once at import and are not updated by live clicks. The setup checklist and the gaps table below list how to close both.</Callout></div>
      </section>
  );
}

export function TraceabilityReference() {
  return (
<section className="p-4">
        <div>
          <SectionTitle eyebrow="Traceability" title="Slide requirement, how ODP and Web Experimentation address it, what to validate" />
          <div className="hb-card overflow-x-auto">
            <table className="w-full" style={{ minWidth: 720 }}>
              <thead><tr><TH>Slide requirement</TH><TH>How it is done</TH><TH>Validate with Optimizely</TH></tr></thead>
              <tbody>
                {TRACE_ROWS.map((r) => (
                  <tr key={r[0]}><TD className="font-semibold hb-tx-dark">{r[0]}</TD><TD>{r[1]}</TD><TD className="hb-tx-muted">{r[2]}</TD></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm hb-tx-muted">Scale figures are requirements taken from the slide, not claims about ODP capacity. This demo shows behaviour, not throughput.</p>
        </div>
      </section>
  );
}

export function FiguresReference() {
  return (
    <section className="p-4 space-y-3">
      <Callout title="RFP slide figures differ from its notes">Slide: 25M engageable profiles and 5,000 events/sec. Speaker notes on the slide cite 20.7M engageable profiles and 1,700 events/sec from the TS26 source. Confirm which numbers go to vendors, and say &ldquo;figures as written on the RFP slide&rdquo; until then.</Callout>
          <Callout title="Why this matters for the RFP slide">The slide notes say the 44.5M figure counts profiles, not unique clients. Identity resolution is what turns profiles into people, so the unique client count stays a number to confirm with real identifier data.</Callout>
    </section>
  );
}

function Sec({ title, open, children }) {
  return (
    <details open={open} className="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <summary className="cursor-pointer select-none bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">{title}</summary>
      <div>{children}</div>
    </details>
  );
}

export default function Reference({ eventCount }) {
  return (
    <div className="hb-root">
      <style>{CSS}</style>
      <Sec title="RFP figures to confirm" open><FiguresReference /></Sec>
      <Sec title="Traceability: slide requirement to what to validate"><TraceabilityReference /></Sec>
      <Sec title="Where your three scripts sit"><ScriptsReference eventCount={eventCount} /></Sec>
      <Sec title="Setup checklist, snippets and gaps"><SetupReference /></Sec>
    </div>
  );
}
