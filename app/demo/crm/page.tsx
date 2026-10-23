// @ts-nocheck — demo UI ported from the canvas mock (plain JS). Remove this line and add types if you want strict checking.
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/* =========================================================
   NORTHSTAR CRM (mock) — Limitless 1:1 live demo
   Route: /demo/crm  (add "demo" to the proxy.ts matcher exclusions)
   - "Run Limitless" → POST /api/limitless/trigger → Opal workflow webhook
   - Microsite status ← GET /api/limitless/status?account=<id> (Graph, published only)
   All companies, people and numbers are fictional.
   ========================================================= */

const BRAND = { name: "Vantage Cloud", domain: "vantagecloud-demo.com" };
const TODAY = "Oct 14, 2026";

const CRM_NAV = [
  { id: "Home", icon: "⌂" },
  { id: "Accounts", icon: "▣" },
  { id: "Contacts", icon: "☺" },
  { id: "Opportunities", icon: "◈" },
  { id: "Campaigns", icon: "➤" },
  { id: "Reports", icon: "▤" },
];

const STAGES = ["Prospecting", "Discovery", "Evaluation", "Negotiation", "Closed Won"];
const STAGE_COLOR = { Prospecting: "slate", Discovery: "blue", Evaluation: "violet", Negotiation: "amber", "Closed Won": "green" };
const STAGE_PROB = { Prospecting: 15, Discovery: 30, Evaluation: 55, Negotiation: 80, "Closed Won": 100 };

const ACCOUNTS = [
  { id: "helix", name: "Helix Freight Group", industry: "Logistics & Supply Chain", employees: "8,400", revenue: "$2.1B", hq: "Rotterdam, NL", stage: "Discovery", pipeline: "$480K", owner: "Dana Ruiz", lastActivity: "Webinar attended · 3d ago" },
  { id: "apex", name: "Apex Health Partners", industry: "Healthcare Provider Network", employees: "22,000", revenue: "$5.8B", hq: "Columbus, OH", stage: "Evaluation", pipeline: "$1.2M", owner: "Dana Ruiz", lastActivity: "Stage changed · 16d ago" },
  { id: "northbridge", name: "Northbridge Bank", industry: "Financial Services", employees: "12,300", revenue: "$3.4B", hq: "Toronto, CA", stage: "Prospecting", pipeline: "$650K", owner: "Leo Grant", lastActivity: "Email opened · 1w ago" },
  { id: "solara", name: "Solara Energy", industry: "Renewable Energy", employees: "5,100", revenue: "$1.4B", hq: "Austin, TX", stage: "Discovery", pipeline: "$390K", owner: "Leo Grant", lastActivity: "Pricing page visit · 2d ago" },
  { id: "kestrel", name: "Kestrel Aerospace", industry: "Aerospace & Defense", employees: "17,800", revenue: "$4.9B", hq: "Seattle, WA", stage: "Prospecting", pipeline: "$900K", owner: "Mia Chen", lastActivity: "Event booth scan · 5d ago" },
  { id: "lumen", name: "Lumen Retail Co.", industry: "Retail", employees: "31,000", revenue: "$7.2B", hq: "Chicago, IL", stage: "Evaluation", pipeline: "$1.5M", owner: "Mia Chen", lastActivity: "Demo requested · 1d ago" },
];

const DETAILS = {
  helix: {
    contacts: [
      { name: "Marcus Lee", title: "Chief Financial Officer", role: "Economic Buyer" },
      { name: "Priya Natarajan", title: "VP, IT Architecture", role: "Technical Evaluator" },
      { name: "Tom Becker", title: "Director, Fleet Operations", role: "Champion" },
    ],
    activity: ["Oct 11 · Attended webinar “Modern Logistics Data”", "Oct 02 · Discovery call: migration risk from legacy TMS raised", "Sep 24 · Downloaded “Real-time Tracking ROI Guide”"],
    signals: [
      { date: "2026-09-18", type: "expansion", text: "Announced 3 new EU cold-chain hubs" },
      { date: "2026-08-07", type: "earnings_call", text: "Q2 earnings call: CFO cites fragmented systems as margin pressure" },
      { date: "2026-09-30", type: "hiring", text: "Hiring 40+ data engineering roles" },
    ],
    odp: ["14 sessions from helixfreight.com in last 30 days", "Viewed Supply Chain Visibility page 6×", "Top intent topics: cold-chain compliance, TMS integration"],
    crm: ["Opportunity: Platform modernization · $480K · Discovery", "3 known contacts mapped to buying roles", "Objection logged: migration risk"],
  },
  apex: {
    contacts: [
      { name: "Rachel Owens", title: "SVP Finance", role: "Economic Buyer" },
      { name: "Dr. Elena Park", title: "Chief Medical Information Officer", role: "Technical Evaluator", isNew: true },
      { name: "Victor Hale", title: "Director, Patient Access", role: "Champion" },
    ],
    activity: ["Sep 28 · Moved to Evaluation stage", "Sep 15 · Requested security & compliance documentation", "Aug 30 · Initial discovery call completed"],
    // Both signals post-date the v1 page (Jul 2), so the Updater treats them as material.
    signals: [
      { date: "2026-10-02", type: "c_suite_hire", text: "Hired Dr. Elena Park as Chief Medical Information Officer" },
      { date: "2026-09-28", type: "buying_stage_shift", text: "Opportunity moved Discovery → Evaluation" },
    ],
    odp: ["9 sessions from apexhealth.org in last 30 days", "Viewed Security & Compliance page 4×", "Top intent topics: HIPAA compliance, EHR integration"],
    crm: ["Opportunity: Clinical content hub · $1.2M · Evaluation", "New contact: Dr. Elena Park (CMIO)", "Requested security & compliance documentation"],
  },
};

/** Turn a status-route response into a badge label. versionNote looks like "v2 · updated: new CMIO". */
function liveLabel(st) {
  if (!st || !st.live) return { text: "No page", short: "No page", color: "slate" };
  const v = (st.versionNote || "").split(" · ")[0];
  return { text: v ? `Published · ${v}` : "Published", short: v ? `Published · ${v}` : "Published", color: "green" };
}

/** Badge label for an ABM page from the CMS pages route (drafts included); same labels as the ABM card. */
function pageLabel(p) {
  if (p.status === "published") return { text: "Published", short: "Published", color: "green" };
  if (p.hasPublished) return { text: "Published · newer draft", short: "Published · newer draft", color: "blue" };
  return { text: "Draft · not published", short: "Draft · not published", color: "amber" };
}

/** Microsite status for an account: the CMS pages (source of the ABM card) win, Graph status is the fallback. */
function findAbmPage(abmPages, acc) {
  const norm = (v) => (v || "").trim().toLowerCase();
  return abmPages.find((x) => x.accountId === acc.id) || abmPages.find((x) => norm(x.accountName) === norm(acc.name));
}

function micrositeLabel(abmPages, liveStatus, acc) {
  const page = findAbmPage(abmPages, acc);
  return page ? pageLabel(page) : liveLabel(liveStatus[acc.id]);
}

const EXTRA_CONTACTS = {
  northbridge: [
    { name: "Elena Voss", title: "Chief Marketing Officer", role: "Economic Buyer" },
    { name: "Raj Patel", title: "Head of Digital Platforms", role: "Technical Evaluator" },
    { name: "Claire Duval", title: "Director, Customer Experience", role: "Champion" },
  ],
  solara: [
    { name: "Hannah Brooks", title: "VP, Marketing", role: "Economic Buyer" },
    { name: "Diego Alvarez", title: "Senior Director, Web Engineering", role: "Technical Evaluator" },
    { name: "Nina Okafor", title: "Digital Experience Manager", role: "Champion" },
  ],
  kestrel: [
    { name: "Grant Whitfield", title: "Chief Digital Officer", role: "Economic Buyer" },
    { name: "Sofia Marin", title: "Director, IT Security", role: "Technical Evaluator" },
    { name: "Ben Hartley", title: "Manager, Partner Programs", role: "Champion" },
  ],
  lumen: [
    { name: "Olivia Grant", title: "SVP, Ecommerce", role: "Economic Buyer" },
    { name: "Kenji Watanabe", title: "VP, Platform Engineering", role: "Technical Evaluator" },
    { name: "Maya Rossi", title: "Director, Merchandising", role: "Champion" },
  ],
};

const ENGAGE = ["Opened email · 2d ago", "Visited pricing · 4d ago", "Attended webinar · 1w ago", "Replied to sales · 1d ago", "Downloaded guide · 6d ago"];

const ALL_CONTACTS = ACCOUNTS.flatMap((a, ai) =>
  (DETAILS[a.id] ? DETAILS[a.id].contacts : EXTRA_CONTACTS[a.id] || []).map((c, ci) => {
    const clean = c.name.replace("Dr. ", "").toLowerCase().split(" ");
    return { ...c, accountId: a.id, account: a.name, owner: a.owner, email: `${clean[0]}.${clean[clean.length - 1]}@${a.id}.example`, engaged: ENGAGE[(ai * 3 + ci) % ENGAGE.length] };
  })
);

const OPPS = [
  { id: "o1", name: "Platform modernization", acct: "helix", account: "Helix Freight Group", stage: "Discovery", amount: 480, close: "Dec 12, 2026", owner: "Dana Ruiz" },
  { id: "o2", name: "Clinical content hub", acct: "apex", account: "Apex Health Partners", stage: "Evaluation", amount: 1200, close: "Nov 30, 2026", owner: "Dana Ruiz" },
  { id: "o3", name: "Digital banking experience", acct: "northbridge", account: "Northbridge Bank", stage: "Prospecting", amount: 650, close: "Feb 20, 2027", owner: "Leo Grant" },
  { id: "o4", name: "Customer portal personalization", acct: "solara", account: "Solara Energy", stage: "Discovery", amount: 390, close: "Jan 15, 2027", owner: "Leo Grant" },
  { id: "o5", name: "Partner and supplier portal", acct: "kestrel", account: "Kestrel Aerospace", stage: "Prospecting", amount: 900, close: "Mar 31, 2027", owner: "Mia Chen" },
  { id: "o6", name: "Omnichannel commerce rollout", acct: "lumen", account: "Lumen Retail Co.", stage: "Evaluation", amount: 1500, close: "Dec 05, 2026", owner: "Mia Chen" },
  { id: "o7", name: "Multi-site content platform", acct: null, account: "Brightline Telecom", stage: "Negotiation", amount: 320, close: "Oct 29, 2026", owner: "Dana Ruiz" },
  { id: "o8", name: "Annual expansion", acct: null, account: "Orchard Foods", stage: "Closed Won", amount: 145, close: "Sep 18, 2026", owner: "Leo Grant" },
  { id: "o9", name: "Experimentation add-on", acct: null, account: "Brightline Telecom", stage: "Closed Won", amount: 210, close: "Aug 27, 2026", owner: "Mia Chen" },
];

const INITIAL_TASKS = [
  { id: "t1", text: "Send follow-up to Marcus Lee (Helix) after webinar", due: "Today", done: false },
  { id: "t2", text: "Review Limitless draft for Apex Health Partners", due: "Today", done: false },
  { id: "t3", text: "Prep discovery call: Solara Energy", due: "Tomorrow", done: false },
  { id: "t4", text: "Update close date: Lumen Retail Co.", due: "Oct 16", done: true },
];

const kFmt = (k) => (k >= 1000 ? `$${Math.round(k / 10) / 100}M` : `$${k}K`);
const initialsOf = (name) => name.replace("Dr. ", "").split(" ").map((x) => x[0]).join("").slice(0, 2);
const openOpps = OPPS.filter((o) => o.stage !== "Closed Won");
const sumK = (list) => list.reduce((s, o) => s + o.amount, 0);

/* ---------- UI PRIMITIVES ---------- */

function Badge({ children, color = "slate" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${map[color] || map.slate}`}>{children}</span>;
}

function Card({ title, right, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      {title && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

const SIGNAL_COLOR = {
  c_suite_hire: "amber",
  earnings_call: "rose",
  buying_stage_shift: "violet",
  expansion: "green",
  hiring: "blue",
};

/** Account enrichment: ODP first-party behaviour + external web research signals. */
function EnrichmentCards({ d, className = "mt-6" }) {
  return (
    <div className={`${className} grid gap-4 lg:grid-cols-2`}>
      <Card title="ODP behavioral intelligence" right={<Badge color="green">Optimizely Data Platform</Badge>}>
        {d?.odp && d.odp.length > 0 ? (
          <ul className="space-y-2 text-sm text-slate-700">
            {d.odp.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-xs font-bold text-emerald-600">✦</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-slate-500">No recent digital intent sessions captured in ODP.</div>
        )}
      </Card>

      <Card title="Web research & market signals" right={<Badge color="blue">External Intelligence</Badge>}>
        {d?.signals && d.signals.length > 0 ? (
          <ul className="space-y-2.5 text-sm text-slate-700">
            {d.signals.map((sig, idx) => (
              <li key={idx} className="flex items-start justify-between gap-3 border-l-2 border-sky-400 pl-3">
                <div>
                  <div className="font-medium leading-snug text-slate-800">{sig.text}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{sig.date}</div>
                </div>
                <Badge color={SIGNAL_COLOR[sig.type] || "slate"}>{sig.type.replace(/_/g, " ")}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-slate-500">No external intelligence signals logged.</div>
        )}
      </Card>
    </div>
  );
}

function PageHeader({ eyebrow, title, sub, actions }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">{eyebrow}</div>
        <h1 className="text-2xl font-bold text-slate-900">
          {title} {sub && <span className="text-base font-normal text-slate-500">· {sub}</span>}
        </h1>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

function Stat({ label, value, note, tone = "text-slate-500" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      <div className={`mt-0.5 text-xs ${tone}`}>{note}</div>
    </div>
  );
}

function Avatar({ name, size = "h-8 w-8 text-xs" }) {
  return <div className={`flex shrink-0 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700 ${size}`}>{initialsOf(name)}</div>;
}

function DataTable({ heads, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>{heads.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none"
    />
  );
}

function BarRow({ label, value, max, text, color = "bg-sky-500" }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-28 shrink-0 text-slate-600">{label}</div>
      <div className="h-5 flex-1 overflow-hidden rounded bg-slate-100">
        <div className={`h-full rounded ${color}`} style={{ width: `${max ? Math.max(4, (value / max) * 100) : 0}%` }} />
      </div>
      <div className="w-16 shrink-0 text-right font-medium text-slate-700">{text}</div>
    </div>
  );
}

/* ---------- VIEWS ---------- */

function CRMHome({ liveMicrosites, go, setSelectedId }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const liveCount = liveMicrosites.length;
  const weighted = Math.round(openOpps.reduce((s, o) => s + (o.amount * STAGE_PROB[o.stage]) / 100, 0));
  const feed = [
    { who: "Dana Ruiz", what: "moved Helix Freight Group to Discovery", when: "10:42 AM", acct: "helix" },
    { who: "Leo Grant", what: "logged a call with Solara Energy", when: "09:15 AM", acct: "solara" },
    { who: "Mia Chen", what: "booked a demo with Lumen Retail Co.", when: "Yesterday", acct: "lumen" },
    { who: "Dana Ruiz", what: "added Dr. Elena Park to Apex Health Partners", when: "Yesterday", acct: "apex" },
  ];
  return (
    <>
      <PageHeader eyebrow={`${TODAY} · Q4 FY26`} title="Good afternoon, Dana" sub="here is your pipeline today" actions={<button onClick={() => go("Campaigns")} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700">View Q4 Tier-1 ABM</button>} />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Open pipeline" value={kFmt(sumK(openOpps))} note={`${openOpps.length} open opportunities`} />
        <Stat label="Weighted forecast" value={kFmt(weighted)} note="+8% vs last month" tone="text-emerald-600" />
        <Stat label="Closed won (QTD)" value={kFmt(sumK(OPPS.filter((o) => o.stage === "Closed Won")))} note="2 deals" />
        <Stat label="ABM microsites live" value={`${liveCount} of ${ACCOUNTS.length}`} note="Q4 Tier-1 ABM" tone="text-violet-600" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="My tasks" className="lg:col-span-1" right={<span className="text-xs text-slate-500">{tasks.filter((t) => !t.done).length} open</span>}>
          <ul className="space-y-2.5 text-sm">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-start gap-2.5">
                <input type="checkbox" checked={t.done} onChange={() => setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} className="mt-1" />
                <div className="flex-1">
                  <div className={t.done ? "text-slate-400 line-through" : "text-slate-800"}>{t.text}</div>
                  <div className="text-xs text-slate-500">Due {t.due}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Pipeline by stage" className="lg:col-span-1">
          <div className="space-y-2.5">
            {STAGES.slice(0, 4).map((s) => {
              const v = sumK(OPPS.filter((o) => o.stage === s));
              return <BarRow key={s} label={s} value={v} max={2500} text={kFmt(v)} />;
            })}
          </div>
        </Card>
        <Card title="Recent activity" className="lg:col-span-1">
          <ul className="space-y-3 text-sm">
            {feed.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-16 shrink-0 text-xs text-slate-400">{f.when}</span>
                <span className="text-slate-700">
                  <span className="font-medium text-slate-900">{f.who}</span> {f.what}
                  {" "}<button onClick={() => { setSelectedId(f.acct); go("Accounts"); }} className="text-sky-700 hover:underline">View</button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function CRMAccounts({ selectedId, setSelectedId, liveStatus, go, triggerOpal, isSyncing, abmPages = [] }) {
  const [q, setQ] = useState("");
  const [owner, setOwner] = useState("All owners");
  const [openId, setOpenId] = useState(null);

  if (openId) {
    const acc = ACCOUNTS.find((a) => a.id === openId);
    const d = DETAILS[acc.id];
    const st = liveLabel(liveStatus[acc.id]);
    const isLive = !!liveStatus[acc.id]?.live;
    const statusText = st.text;
    const statusColor = st.color;
    const contacts = ALL_CONTACTS.filter((c) => c.accountId === acc.id);
    const opps = OPPS.filter((o) => o.acct === acc.id);
    const timeline = d ? d.activity : [`${acc.lastActivity}`, "Added to Q4 Tier-1 ABM campaign", "Account created from event lead"];
    const pageInCms = findAbmPage(abmPages, acc);
    
    return (
      <>
        <div className="mb-3 text-sm text-slate-500"><button onClick={() => setOpenId(null)} className="text-sky-700 hover:underline">Accounts</button> / {acc.name}</div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-900 text-lg font-bold text-white">{initialsOf(acc.name)}</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{acc.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">{acc.industry} · {acc.hq} <Badge color={STAGE_COLOR[acc.stage]}>{acc.stage}</Badge><Badge color={statusColor}>Microsite: {statusText}</Badge></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Log activity</button>
            <button 
              onClick={() => triggerOpal(acc)} 
              disabled={isSyncing[acc.id]} 
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${isSyncing[acc.id] ? "bg-violet-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
            >
              {isSyncing[acc.id] ? "✦ Sending to Limitless..." : "✦ Run Limitless Agent"}
            </button>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Account details">
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-500">Industry</dt><dd>{acc.industry}</dd>
              <dt className="text-slate-500">HQ</dt><dd>{acc.hq}</dd>
              <dt className="text-slate-500">Employees</dt><dd>{acc.employees}</dd>
              <dt className="text-slate-500">Annual revenue</dt><dd>{acc.revenue}</dd>
              <dt className="text-slate-500">Owner</dt><dd>{acc.owner}</dd>
              <dt className="text-slate-500">Campaign</dt><dd>Q4 Tier-1 ABM</dd>
            </dl>
          </Card>
          <Card title={`Contacts (${contacts.length})`}>
            <div className="space-y-3">
              {contacts.map((c) => (
                <div key={c.email} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <div>
                      <div className="text-sm font-medium">{c.name} {c.isNew && <Badge color="amber">New</Badge>}</div>
                      <div className="text-xs text-slate-500">{c.title}</div>
                    </div>
                  </div>
                  <Badge color="violet">{c.role}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Opportunities">
            {opps.map((o) => (
              <div key={o.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                <div className="font-medium text-slate-900">{o.name}</div>
                <div className="mt-1 flex items-center justify-between text-slate-600"><span>{kFmt(o.amount)} · close {o.close}</span><Badge color={STAGE_COLOR[o.stage]}>{o.stage}</Badge></div>
              </div>
            ))}
          </Card>
        </div>
        <EnrichmentCards d={d} className="mt-4" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card title="Activity timeline" className="lg:col-span-2">
            <ul className="space-y-2 text-sm text-slate-700">{timeline.map((x) => <li key={x} className="border-l-2 border-sky-300 pl-3">{x}</li>)}</ul>
          </Card>
          <Card title="Limitless 1:1 microsite" right={<Badge color={statusColor}>{statusText}</Badge>}>
            <p className="text-sm text-slate-600">
              {isLive ? (
                <>Personalized page live at{" "}
                  <a href={liveStatus[acc.id].url || "#"} target="_blank" rel="noopener noreferrer" className="font-medium text-sky-700 hover:underline">{liveStatus[acc.id].url}</a>
                </>
              ) : "No published page yet. Run the Limitless workflow to research and generate a draft, then approve it in CMS."}
            </p>
            {pageInCms?.cmsEditUrl && (
              <div className="mt-3">
                <a
                  href={pageInCms.cmsEditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100"
                >
                  Review in CMS Visual Builder ↗
                </a>
              </div>
            )}
            <button onClick={() => go("Campaigns")} className="mt-3 block text-sm font-medium text-sky-700 hover:underline">See in campaign list</button>
          </Card>
        </div>
      </>
    );
  }

  const owners = ["All owners", ...Array.from(new Set(ACCOUNTS.map((a) => a.owner)))];
  const rows = ACCOUNTS.filter((a) => (owner === "All owners" || a.owner === owner) && a.name.toLowerCase().includes(q.toLowerCase()));
  
  return (
    <>
      <PageHeader eyebrow="All accounts" title="Accounts" sub={`${rows.length} of ${ACCOUNTS.length}`} actions={<><SearchBox value={q} onChange={setQ} placeholder="Search accounts" /><select value={owner} onChange={(e) => setOwner(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{owners.map((o) => <option key={o}>{o}</option>)}</select><button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">+ New account</button></>} />
      <DataTable heads={["Account", "Industry", "HQ", "Employees", "Revenue", "Owner", "Open opportunity"]}>
        {rows.map((a) => (
          <tr key={a.id} onClick={() => { setSelectedId(a.id); setOpenId(a.id); }} className={`cursor-pointer border-t border-slate-100 ${a.id === selectedId ? "bg-sky-50" : "hover:bg-slate-50"}`}>
            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-900 text-xs font-semibold text-white">{initialsOf(a.name)}</div><span className="font-medium text-sky-700">{a.name}</span></div></td>
            <td className="px-4 py-3 text-slate-600">{a.industry}</td>
            <td className="px-4 py-3 text-slate-600">{a.hq}</td>
            <td className="px-4 py-3 text-slate-600">{a.employees}</td>
            <td className="px-4 py-3 text-slate-600">{a.revenue}</td>
            <td className="px-4 py-3 text-slate-600">{a.owner}</td>
            <td className="px-4 py-3"><span className="text-slate-700">{a.pipeline}</span> <Badge color={STAGE_COLOR[a.stage]}>{a.stage}</Badge></td>
          </tr>
        ))}
      </DataTable>
      {rows.length === 0 && <div className="mt-6 text-center text-sm text-slate-500">No accounts match your filters.</div>}
    </>
  );
}

function CRMContacts({ setSelectedId, go }) {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All roles");
  const roles = ["All roles", "Economic Buyer", "Technical Evaluator", "Champion"];
  const rows = ALL_CONTACTS.filter((c) => (role === "All roles" || c.role === role) && `${c.name} ${c.account}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow="All contacts" title="Contacts" sub={`${rows.length} of ${ALL_CONTACTS.length}`} actions={<><SearchBox value={q} onChange={setQ} placeholder="Search name or account" /><select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{roles.map((r) => <option key={r}>{r}</option>)}</select><button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">+ New contact</button></>} />
      <DataTable heads={["Name", "Title", "Account", "Buying role", "Email", "Last engaged", "Owner"]}>
        {rows.map((c) => (
          <tr key={c.email} className="border-t border-slate-100 hover:bg-slate-50">
            <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={c.name} /><span className="font-medium text-slate-900">{c.name}</span>{c.isNew && <Badge color="amber">New</Badge>}</div></td>
            <td className="px-4 py-3 text-slate-600">{c.title}</td>
            <td className="px-4 py-3"><button onClick={() => { setSelectedId(c.accountId); go("Accounts"); }} className="text-sky-700 hover:underline">{c.account}</button></td>
            <td className="px-4 py-3"><Badge color="violet">{c.role}</Badge></td>
            <td className="px-4 py-3 text-slate-500">{c.email}</td>
            <td className="px-4 py-3 text-slate-500">{c.engaged}</td>
            <td className="px-4 py-3 text-slate-600">{c.owner}</td>
          </tr>
        ))}
      </DataTable>
      {rows.length === 0 && <div className="mt-6 text-center text-sm text-slate-500">No contacts match your filters.</div>}
    </>
  );
}

function CRMOpportunities({ setSelectedId, go }) {
  const [view, setView] = useState("Board");
  const open = (o) => { if (o.acct) { setSelectedId(o.acct); go("Accounts"); } };
  return (
    <>
      <PageHeader eyebrow="Sales pipeline" title="Opportunities" sub={`${kFmt(sumK(openOpps))} open · ${openOpps.length} deals`} actions={<><div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">{["Board", "List"].map((v) => <button key={v} onClick={() => setView(v)} className={`px-3 py-2 ${view === v ? "bg-sky-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>{v}</button>)}</div><button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">+ New opportunity</button></>} />
      {view === "Board" ? (
        <div className="grid grid-cols-5 gap-3">
          {STAGES.map((s) => {
            const list = OPPS.filter((o) => o.stage === s);
            return (
              <div key={s} className="rounded-xl bg-slate-100 p-2">
                <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wide text-slate-600"><span>{s}</span><span>{kFmt(sumK(list))}</span></div>
                <div className="space-y-2">
                  {list.map((o) => (
                    <div key={o.id} onClick={() => open(o)} className={`rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm ${o.acct ? "cursor-pointer hover:border-sky-300" : ""}`}>
                      <div className="font-medium text-slate-900">{o.name}</div>
                      <div className="text-xs text-slate-500">{o.account}</div>
                      <div className="mt-2 flex items-center justify-between text-xs"><span className="font-semibold text-slate-800">{kFmt(o.amount)}</span><span className="text-slate-500">{o.close}</span></div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Avatar name={o.owner} size="h-5 w-5 text-xs" />{o.owner}</div>
                    </div>
                  ))}
                  {list.length === 0 && <div className="px-1 py-3 text-xs text-slate-400">No deals</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable heads={["Opportunity", "Account", "Stage", "Amount", "Probability", "Close date", "Owner"]}>
          {OPPS.map((o) => (
            <tr key={o.id} onClick={() => open(o)} className={`border-t border-slate-100 hover:bg-slate-50 ${o.acct ? "cursor-pointer" : ""}`}>
              <td className="px-4 py-3 font-medium text-sky-700">{o.name}</td>
              <td className="px-4 py-3 text-slate-600">{o.account}</td>
              <td className="px-4 py-3"><Badge color={STAGE_COLOR[o.stage]}>{o.stage}</Badge></td>
              <td className="px-4 py-3 text-slate-700">{kFmt(o.amount)}</td>
              <td className="px-4 py-3 text-slate-600">{STAGE_PROB[o.stage]}%</td>
              <td className="px-4 py-3 text-slate-500">{o.close}</td>
              <td className="px-4 py-3 text-slate-600">{o.owner}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}

const LOG_COLOR = { info: "text-slate-300", step: "text-violet-300 font-semibold", tool: "text-sky-300", ok: "text-emerald-400", warn: "text-amber-300", error: "text-rose-400" };

/** Live log of a Limitless run: CRM trigger events plus CMS changes picked up by polling. */
function LimitlessConsole({ logs, onClear, runActive }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);
  return (
    <Card
      title="Limitless console"
      right={
        <div className="flex items-center gap-3">
          {runActive && <Badge color="violet">Watching {runActive.name}…</Badge>}
          <button onClick={onClear} className="text-xs font-medium text-slate-500 hover:text-slate-800">Clear</button>
        </div>
      }
    >
      <div ref={ref} className="h-60 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-xs leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-slate-500">Run Limitless on an account to see progress here.</div>
        ) : (
          logs.map((l, i) => (
            <div key={i} className={LOG_COLOR[l.level] || LOG_COLOR.info}>
              <span className="text-slate-500">{l.ts}</span> {l.text}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

/** Links to the ABM landing pages in the CMS (children of the ABM container). */
function AbmPagesCard({ pages, onRefresh, refreshing, lastUpdated, acc, isSyncing, triggerOpal, onDelete, deletingKey }) {
  return (
    <Card
      title="ABM landing pages (CMS)"
      right={
        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerOpal(acc)}
            disabled={isSyncing[acc.id]}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm ${isSyncing[acc.id] ? "bg-violet-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
          >
            {isSyncing[acc.id] ? `✦ Sending ${acc.name} to Opal…` : `✦ Run Limitless · ${acc.name}`}
          </button>
          {lastUpdated && <span className="text-xs text-slate-400">Updated {lastUpdated.toLocaleTimeString()}</span>}
          <Badge color="slate">{pages.length}</Badge>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh from the CMS"
            aria-label="Refresh ABM landing pages"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* rotate-cw: the standard "refresh" glyph */}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={refreshing ? "animate-spin" : ""} aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
      }
    >
      {pages.length === 0 ? (
        <div className="text-sm text-slate-500">No landing pages created yet.</div>
      ) : (
        <ul className="divide-y divide-slate-100 text-sm">
          {pages.map((p) => {
            const badge = pageLabel(p);
            return (
              <li key={p.key} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-800">{p.accountName}</div>
                  <div className="truncate text-xs text-slate-500">{p.versionNote || `v${p.version}`}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge color={badge.color}>{badge.text}</Badge>
                  <button
                    onClick={() => onDelete(p)}
                    disabled={deletingKey === p.key}
                    className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    title={p.status !== "published" && p.hasPublished ? "Discard the unpublished draft; the published page stays live" : "Delete this page from the CMS"}
                  >
                    {deletingKey === p.key ? "Deleting…" : p.status !== "published" && p.hasPublished ? "Discard draft" : "Delete"}
                  </button>
                  {p.cmsEditUrl && (
                    <a
                      href={p.cmsEditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100"
                      title="Open page in Optimizely CMS editor for review"
                    >
                      Review in CMS ↗
                    </a>
                  )}
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-sky-700"
                      title="Open live public microsite"
                    >
                      Live site ↗
                    </a>
                  ) : !p.cmsEditUrl ? (
                    <span className="text-xs text-slate-400">Publish in CMS</span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function CRMCampaigns({ selectedId, setSelectedId, liveStatus, triggerOpal, isSyncing, logs, clearLogs, runActive, abmPages, refreshPages, refreshing, lastUpdated, onDelete, deletingKey }) {
  const acc = ACCOUNTS.find((a) => a.id === selectedId);
  const d = DETAILS[selectedId];
  const st = micrositeLabel(abmPages, liveStatus, acc);
  const statusText = st.text;
  const statusColor = st.color;

  return (
    <>
      <PageHeader
        eyebrow="Campaign list"
        title="Q4 Tier-1 ABM"
        sub={`${ACCOUNTS.length} target accounts`}
      />
      <DataTable heads={["Account", "Industry", "Stage", "Pipeline", "Owner", "Last activity", "Microsite"]}>
        {ACCOUNTS.map((a) => {
          const ls = micrositeLabel(abmPages, liveStatus, a);
          return (
            <tr key={a.id} onClick={() => setSelectedId(a.id)} className={`cursor-pointer border-t border-slate-100 ${a.id === selectedId ? "bg-sky-50" : "hover:bg-slate-50"}`}>
              <td className="px-4 py-3 font-medium text-sky-700">{a.name}</td>
              <td className="px-4 py-3 text-slate-600">{a.industry}</td>
              <td className="px-4 py-3"><Badge color={STAGE_COLOR[a.stage]}>{a.stage}</Badge></td>
              <td className="px-4 py-3 text-slate-700">{a.pipeline}</td>
              <td className="px-4 py-3 text-slate-600">{a.owner}</td>
              <td className="px-4 py-3 text-slate-500">{a.lastActivity}</td>
              <td className="px-4 py-3"><Badge color={ls.color}>{ls.short}</Badge></td>
            </tr>
          );
        })}
      </DataTable>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card title={acc.name} right={<Badge color={statusColor}>Microsite: {statusText}</Badge>}>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-slate-500">Industry</dt><dd>{acc.industry}</dd>
            <dt className="text-slate-500">HQ</dt><dd>{acc.hq}</dd>
            <dt className="text-slate-500">Employees</dt><dd>{acc.employees}</dd>
            <dt className="text-slate-500">Revenue</dt><dd>{acc.revenue}</dd>
            <dt className="text-slate-500">Opportunity</dt><dd>{acc.pipeline} · {acc.stage}</dd>
          </dl>
        </Card>
        <Card title="Buying committee (known contacts)">
          {d ? (
            <div className="space-y-3">
              {d.contacts.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} />
                    <div>
                      <div className="text-sm font-medium">{c.name} {c.isNew && <Badge color="amber">New</Badge>}</div>
                      <div className="text-xs text-slate-500">{c.title}</div>
                    </div>
                  </div>
                  <Badge color="violet">{c.role}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">3 contacts · roles not yet mapped</div>
          )}
        </Card>
        <Card title="Recent activity">
          {d ? (
            <ul className="space-y-2 text-sm text-slate-700">
              {d.activity.map((x) => <li key={x} className="border-l-2 border-sky-300 pl-3">{x}</li>)}
            </ul>
          ) : (
            <div className="text-sm text-slate-500">{acc.lastActivity}</div>
          )}
        </Card>
      </div>
      {/* --- Account Enrichment (ODP + Web Research Signals) --- */}
      <EnrichmentCards d={d} />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <LimitlessConsole logs={logs} onClear={clearLogs} runActive={runActive} />
        <AbmPagesCard pages={abmPages} onRefresh={refreshPages} refreshing={refreshing} lastUpdated={lastUpdated} acc={acc} isSyncing={isSyncing} triggerOpal={triggerOpal} onDelete={onDelete} deletingKey={deletingKey} />
      </div>
    </>
  );
}

function CRMReports({ liveMicrosites }) {
  const [range, setRange] = useState("This quarter");
  const owners = Array.from(new Set(OPPS.map((o) => o.owner)));
  const byOwner = owners.map((n) => ({ n, v: sumK(openOpps.filter((o) => o.owner === n)) }));
  const maxOwner = Math.max(...byOwner.map((x) => x.v));
  const liveCount = liveMicrosites.length;
  const weighted = Math.round(openOpps.reduce((s, o) => s + (o.amount * STAGE_PROB[o.stage]) / 100, 0));
  const saved = ["Pipeline by stage", "Win rate by owner", "ABM account engagement", "Forecast vs quota", "Stale opportunities (30+ days)"];
  
  return (
    <>
      <PageHeader eyebrow="Analytics" title="Reports" sub="Sales and ABM performance" actions={<><select value={range} onChange={(e) => setRange(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{["This month", "This quarter", "This year"].map((r) => <option key={r}>{r}</option>)}</select><button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export CSV</button></>} />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Open pipeline" value={kFmt(sumK(openOpps))} note={range} />
        <Stat label="Weighted forecast" value={kFmt(weighted)} note="Probability-adjusted" />
        <Stat label="Win rate" value="31%" note="+3 pts vs last quarter" tone="text-emerald-600" />
        <Stat label="Average deal size" value={kFmt(Math.round(sumK(OPPS) / OPPS.length))} note={`${OPPS.length} deals`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Open pipeline by stage">
          <div className="space-y-2.5">
            {STAGES.slice(0, 4).map((s) => {
              const v = sumK(OPPS.filter((o) => o.stage === s));
              return <BarRow key={s} label={s} value={v} max={2500} text={kFmt(v)} />;
            })}
          </div>
        </Card>
        <Card title="Open pipeline by owner">
          <div className="space-y-2.5">{byOwner.map((x) => <BarRow key={x.n} label={x.n} value={x.v} max={maxOwner} text={kFmt(x.v)} color="bg-violet-500" />)}</div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Campaign performance: Q4 Tier-1 ABM" className="lg:col-span-2">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {[["Target accounts", `${ACCOUNTS.length}`], ["Personalized microsites live", `${liveCount} of ${ACCOUNTS.length}`], ["Accounts engaged (30 days)", "5 of 6"], ["Meetings booked", "7"], ["Pipeline influenced", kFmt(sumK(openOpps.filter((o) => o.acct)))]].map((r) => (
                <tr key={r[0]}><td className="py-2 text-slate-600">{r[0]}</td><td className="py-2 text-right font-medium text-slate-900">{r[1]}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Saved reports">
          <ul className="space-y-2 text-sm">{saved.map((s) => <li key={s} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-50"><span>{s}</span><span className="text-slate-400">›</span></li>)}</ul>
        </Card>
      </div>
    </>
  );
}

/* ---------- MAIN APPLICATION ---------- */

/**
 * Builds the timed console trace simulating `lim1_abm_orchestrator` steps
 * while the real Opal workflow runs and `/api/limitless/pages` polls the CMS.
 */
function buildOrchestratorTrace(acc, d, contacts, existingPage) {
  const isUpdate = !!existingPage;
  const slug = acc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const rolesSummary = contacts.map((c) => `${c.name} (${c.role})`).join(", ");

  if (!isUpdate) {
    // CREATE MODE: Router -> Condition (mode === "create") -> Researcher -> Creator
    return [
      {
        delay: 900,
        level: "step",
        text: `[lim1_abm_orchestrator] Webhook trigger received event "crm.abm_account.sync" for ${acc.name} (${acc.id}).`,
      },
      {
        delay: 2400,
        level: "tool",
        text: `[lim1_account_router] Calling graph_content_graphql_executor → query AbmLandingPage(AccountId: "${acc.id}")…`,
      },
      {
        delay: 4500,
        level: "ok",
        text: `[lim1_account_router] 0 published pages found in Graph → output {"mode":"create","slug":"${slug}","contentKey":null}.`,
      },
      {
        delay: 6000,
        level: "step",
        text: `[lim1_abm_orchestrator] Condition matched mode == "create" → routing to [lim1_account_researcher].`,
      },
      {
        delay: 8200,
        level: "info",
        text: `[lim1_account_researcher] Ingesting CRM context (${acc.pipeline} · ${acc.stage}) & mapping buying committee: ${rolesSummary}.`,
      },
      {
        delay: 11500,
        level: "info",
        text: `[lim1_account_researcher] Enriching with ODP behavioral feed (${d?.odp?.[0] || "first-party intent sessions"}) + ${d?.signals?.length || 0} external market signals…`,
      },
      {
        delay: 15000,
        level: "tool",
        text: `[lim1_account_researcher] Running web search for ${acc.industry} industry benchmarks & regulatory context…`,
      },
      {
        delay: 19000,
        level: "ok",
        text: `[lim1_account_researcher] Audience intelligence brief compiled for 3 personas (Economic Buyer, Technical Evaluator, Champion).`,
      },
      {
        delay: 21000,
        level: "step",
        text: `[lim1_abm_orchestrator] Handing research JSON to [lim1_page_creator] (Brand Pack skill active).`,
      },
      {
        delay: 24000,
        level: "tool",
        text: `[lim1_page_creator] Calling cms_create_content_item (ContentType: "AbmLandingPage", RouteSegment: "${slug}")…`,
      },
      {
        delay: 28000,
        level: "tool",
        text: `[lim1_page_creator] Calling cms_update_content_item → writing Hero, Problem, 3 Persona tabs, ProofStats & FaqItems…`,
      },
      {
        delay: 32000,
        level: "tool",
        text: `[lim1_page_creator] Calling cms_get_content_preview_url (status: "draft" — awaiting human governance sign-off)…`,
      },
      {
        delay: 35500,
        level: "info",
        text: `[lim1_abm_orchestrator] Polling Optimizely CMS Management API for new AbmLandingPage draft…`,
      },
    ];
  }

  // UPDATE MODE: Router -> Condition (mode === "update") -> Updater (90-day delta check + JSON Merge Patch)
  const newContact = contacts.find((c) => c.isNew);
  const latestSignal = d?.signals?.[0]?.text || "recent CRM stage & stakeholder shift";

  return [
    {
      delay: 900,
      level: "step",
      text: `[lim1_abm_orchestrator] Webhook trigger received event "crm.abm_account.sync" for ${acc.name} (${acc.id}).`,
    },
    {
      delay: 2400,
      level: "tool",
      text: `[lim1_account_router] Calling graph_content_graphql_executor → query AbmLandingPage(AccountId: "${acc.id}")…`,
    },
    {
      delay: 4500,
      level: "ok",
      text: `[lim1_account_router] Existing page found (key: ${existingPage.key.slice(0, 8)}…, ${existingPage.versionNote || `v${existingPage.version}`}) → output {"mode":"update"}.`,
    },
    {
      delay: 6200,
      level: "step",
      text: `[lim1_abm_orchestrator] Condition matched mode == "update" → skipping Researcher, routing to [lim1_page_updater].`,
    },
    {
      delay: 8500,
      level: "tool",
      text: `[lim1_page_updater] Calling cms_get_content_data (contentKey: "${existingPage.key.slice(0, 8)}…") to inspect published baseline…`,
    },
    {
      delay: 11800,
      level: "info",
      text: `[lim1_page_updater] Evaluating 90-day delta window since LastRefreshed → detected ${d?.signals?.length || 2} material signals (${latestSignal}).`,
    },
    {
      delay: 15500,
      level: "info",
      text: `[lim1_page_updater] Mapping minimal field diff → targeting TechnicalEvaluatorTitle, TechnicalEvaluatorBody${newContact ? ` (for ${newContact.name})` : ""}, HeroSubhead & PageVersionNote.`,
    },
    {
      delay: 19500,
      level: "tool",
      text: `[lim1_page_updater] Calling cms_update_content_item (contentVersion: 0, JSON Merge Patch on changed fields only)…`,
    },
    {
      delay: 23500,
      level: "tool",
      text: `[lim1_page_updater] Calling cms_get_content_preview_url → draft saved for human review (unchanged sections preserved).`,
    },
    {
      delay: 27000,
      level: "info",
      text: `[lim1_abm_orchestrator] Polling Optimizely CMS Management API for updated draft version…`,
    },
  ];
}

export default function CRMApplication() {
  const [page, setPage] = useState("Campaigns");
  const [selectedId, setSelectedId] = useState("helix");
  const [isSyncing, setIsSyncing] = useState({});
  const [liveStatus, setLiveStatus] = useState({}); // { [accountId]: { live, url, versionNote, mode, lastRefreshed } }
  const [notice, setNotice] = useState(null);
  const [logs, setLogs] = useState([]); // Limitless console: { ts, level, text }
  const [abmPages, setAbmPages] = useState([]); // AbmLandingPages in the CMS, drafts included
  const [runActive, setRunActive] = useState(null); // { id, name, startedAt } while a run is being watched
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null); // page key while a delete request is in flight
  const fetchPagesRef = useRef(null); // set by the polling effect; used by the refresh button
  const prevPages = useRef(null);
  const simTimersRef = useRef([]); // active simulation timeouts for lim1_abm_orchestrator
  const clearSimTimers = useCallback(() => {
    simTimersRef.current.forEach(clearTimeout);
    simTimersRef.current = [];
  }, []);
  useEffect(() => () => clearSimTimers(), [clearSimTimers]);
  const lastPollError = useRef(null);
  const log = useCallback(
    (level, text) => setLogs((l) => [...l.slice(-199), { ts: new Date().toLocaleTimeString(), level, text }]),
    []
  );
  const liveMicrosites = ACCOUNTS.filter((a) => liveStatus[a.id]?.live).map((a) => a.id);

  const go = (p) => setPage(p);

  // Poll the status route (Graph, published content only) so "Live · v1/v2" appears after you publish in CMS.
  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      const rows = await Promise.all(
        ACCOUNTS.map(async (a) => {
          try {
            const res = await fetch(`/api/limitless/status?account=${a.id}`, { cache: "no-store" });
            return [a.id, res.ok ? await res.json() : { live: false }];
          } catch {
            return [a.id, { live: false }];
          }
        })
      );
      if (!cancelled) setLiveStatus(Object.fromEntries(rows));
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Poll the CMS (drafts included) for ABM pages every 5 min, or every 5s while a run is being
  // watched so the console shows progress. The refresh button calls the same fetch via fetchPagesRef.
  // The first poll is a silent baseline; later differences become console messages.
  useEffect(() => {
    let cancelled = false;
    let timer;
    const tick = async () => {
      clearTimeout(timer); // a manual refresh must not leave a second poll chain running
      setRefreshing(true);
      try {
        const res = await fetch("/api/limitless/pages", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (res.ok && data?.ok) {
          lastPollError.current = null;
          const prev = prevPages.current;
          if (prev) {
            for (const p of data.pages) {
              const o = prev.get(p.key);
              const note = p.versionNote ? ` · ${p.versionNote}` : "";
              const published = p.status === "published";
              if (!o) {
                clearSimTimers();
                log("ok", published ? `Page found: ${p.accountName} (v${p.version})` : `Draft created: ${p.accountName} (v${p.version})`);
              } else if (o.version !== p.version) {
                clearSimTimers();
                log("ok", `${published ? "Published" : "Draft updated"}: ${p.accountName} → v${p.version}${note}`);
              } else if (o.status !== p.status && published) {
                clearSimTimers();
                log("ok", `Published: ${p.accountName}`);
              } else {
                continue;
              }
              // Stop fast polling once the watched account's page goes live.
              if (runActive && published && p.accountId === runActive.id) {
                log("ok", `Run complete for ${runActive.name}`);
                setRunActive(null);
              }
            }
          }
          prevPages.current = new Map(data.pages.map((p) => [p.key, p]));
          setAbmPages(data.pages);
          setLastUpdated(new Date());
        } else {
          const msg = data?.error || `HTTP ${res.status}`;
          if (lastPollError.current !== msg) log("error", `CMS poll failed: ${msg}`);
          lastPollError.current = msg;
        }
      } catch {
        /* network blip: retry on the next tick */
      } finally {
        if (!cancelled) setRefreshing(false);
      }
      if (cancelled) return;
      if (runActive && Date.now() - runActive.startedAt > 5 * 60 * 1000) {
        log("warn", `No new CMS activity for ${runActive.name} after 5 min. Check the workflow run logs in Opal.`);
        setRunActive(null);
        return; // the effect re-runs with runActive = null, which restarts polling at the idle interval
      }
      timer = setTimeout(tick, runActive ? 5000 : 5 * 60 * 1000);
    };
    fetchPagesRef.current = tick;
    tick();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [runActive, log, clearSimTimers]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  // A page with a newer draft only loses that draft (published stays live); otherwise the whole page goes.
  const deletePage = async (pg) => {
    const discardDraft = pg.status !== "published" && pg.hasPublished;
    const ok = window.confirm(
      discardDraft
        ? `Discard the unpublished draft (v${pg.version}) of ${pg.accountName}? The published page stays live.`
        : `Delete the ${pg.accountName} landing page from the CMS? This cannot be undone.`
    );
    if (!ok) return;
    setDeletingKey(pg.key);
    log("info", discardDraft ? `Discarding draft v${pg.version} of ${pg.accountName}…` : `Deleting the ${pg.accountName} page from the CMS…`);
    try {
      const res = await fetch("/api/limitless/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discardDraft ? { key: pg.key, version: pg.version } : { key: pg.key }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        log("ok", discardDraft ? `Draft discarded for ${pg.accountName}` : `Page deleted: ${pg.accountName}`);
        prevPages.current = null; // the next poll is a silent baseline, not a "page removed" diff
        await fetchPagesRef.current?.();
      } else {
        log("error", `Delete failed: ${data?.error || `HTTP ${res.status}`}`);
      }
    } catch {
      log("error", "Could not reach /api/limitless/delete");
    } finally {
      setDeletingKey(null);
    }
  };

  // Update mode: the page already exists in the CMS, so create a new draft of it instead of re-running
  // the Opal create flow. The poll then reports it as "Published · newer draft".
  const updateExistingPage = async (acc, pg) => {
    log("info", `${acc.name} already has a page in the CMS. Creating an update draft…`);
    try {
      const res = await fetch("/api/limitless/update-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: pg.key }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        if (data.created) {
          log("ok", `Update draft created for ${acc.name} (v${data.version}). Review and publish it in the CMS.`);
          setNotice({ tone: "ok", text: `New draft created for ${acc.name}` });
        } else {
          log("warn", `${acc.name} already has an unpublished draft (v${data.version}); nothing created. Review it in the CMS.`);
          setNotice({ tone: "ok", text: `${acc.name} already has an unpublished draft` });
        }
        await fetchPagesRef.current?.();
      } else {
        const msg = data?.error || `HTTP ${res.status}`;
        log("error", `Update draft failed: ${msg}`);
        setNotice({ tone: "error", text: `Update draft failed: ${msg}` });
      }
    } catch {
      log("error", "Could not reach /api/limitless/update-draft");
      setNotice({ tone: "error", text: "Could not reach /api/limitless/update-draft" });
    }
  };

  // Payload shape matches /api/limitless/trigger (requires account.id) and the Router prompt.
  const triggerOpal = async (acc) => {
    setIsSyncing((prev) => ({ ...prev, [acc.id]: true }));
    const existing = findAbmPage(abmPages, acc);
    if (existing) {
      await updateExistingPage(acc, existing);
      setIsSyncing((prev) => ({ ...prev, [acc.id]: false }));
      return;
    }
    const d = DETAILS[acc.id];
    log("info", `Sending ${acc.name} to the Limitless workflow in Opal…`);
    try {
      const res = await fetch("/api/limitless/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: acc,
          contacts: d ? d.contacts : EXTRA_CONTACTS[acc.id] || [],
          activity: d ? d.activity : [acc.lastActivity],
          signals: d?.signals || [],
          odp: d?.odp || [], // simulated ODP behavioural feed
          crmNotes: d?.crm || [],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        log("ok", `Accepted by Opal (HTTP ${data.status || res.status}). Starting lim1_abm_orchestrator…`);
        setRunActive({ id: acc.id, name: acc.name, startedAt: Date.now() });

        // Simulated lim1_abm_orchestrator step logs while waiting for the CMS draft
        clearSimTimers();
        const contacts = d ? d.contacts : EXTRA_CONTACTS[acc.id] || [];
        const existingPage =
          findAbmPage(abmPages, acc) ||
          (liveStatus[acc.id]?.live ? { key: acc.id, version: "1", versionNote: liveStatus[acc.id].versionNote } : null);
        const trace = buildOrchestratorTrace(acc, d, contacts, existingPage);
        simTimersRef.current = trace.map((step) => setTimeout(() => log(step.level, step.text), step.delay));
      } else {
        const detail = data.error || data.opal || "no details";
        log("error", `Opal trigger failed (HTTP ${data.status || res.status}): ${detail}`);
      }
      setNotice(
        res.ok
          ? { tone: "ok", text: `${acc.name} sent to the Limitless workflow in Opal` }
          : { tone: "error", text: `Opal trigger failed: ${data.error || `HTTP ${data.status || res.status}`}` }
      );
    } catch {
      log("error", "Could not reach /api/limitless/trigger");
      setNotice({ tone: "error", text: "Could not reach /api/limitless/trigger" });
    } finally {
      setTimeout(() => setIsSyncing((prev) => ({ ...prev, [acc.id]: false })), 3000);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans text-slate-800">
      <aside className="flex w-52 shrink-0 flex-col bg-sky-950 p-4 text-sky-100">
        <div className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500">◎</span>Northstar
        </div>
        <nav className="flex-1 space-y-1">
          {CRM_NAV.map((n) => (
            <button key={n.id} onClick={() => go(n.id)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${n.id === page ? "bg-sky-800 text-white" : "text-sky-200 hover:bg-sky-900"}`}>
              <span className="w-4 text-center opacity-80">{n.icon}</span>{n.id}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 border-t border-sky-900 pt-3 text-xs text-sky-300">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-700 font-semibold text-white">DR</div>
          <div><div className="text-sky-100">Dana Ruiz</div><div>ABM lead</div></div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-slate-50 p-6">
        {page === "Home" && <CRMHome liveMicrosites={liveMicrosites} go={go} setSelectedId={setSelectedId} />}
        {page === "Accounts" && <CRMAccounts key={selectedId} selectedId={selectedId} setSelectedId={setSelectedId} liveStatus={liveStatus} go={go} triggerOpal={triggerOpal} isSyncing={isSyncing} abmPages={abmPages} />}
        {page === "Contacts" && <CRMContacts setSelectedId={setSelectedId} go={go} />}
        {page === "Opportunities" && <CRMOpportunities setSelectedId={setSelectedId} go={go} />}
        {page === "Campaigns" && <CRMCampaigns selectedId={selectedId} setSelectedId={setSelectedId} liveStatus={liveStatus} triggerOpal={triggerOpal} isSyncing={isSyncing} logs={logs} clearLogs={() => { clearSimTimers(); setLogs([]); }} runActive={runActive} abmPages={abmPages} refreshPages={() => fetchPagesRef.current?.()} refreshing={refreshing} lastUpdated={lastUpdated} onDelete={deletePage} deletingKey={deletingKey} />}
        {page === "Reports" && <CRMReports liveMicrosites={liveMicrosites} />}
      </main>
      {notice && (
        <div className={`fixed bottom-4 right-4 z-50 max-w-sm rounded-lg px-4 py-3 text-sm text-white shadow-lg ${notice.tone === "ok" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {notice.text}
        </div>
      )}
    </div>
  );
}
