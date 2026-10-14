// @ts-nocheck — demo UI ported from the canvas mock (plain JS). Remove this line and add types if you want strict checking.
"use client";

import React, { useState, useEffect } from "react";

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
  if (!st || !st.live) return { text: "Not published", short: "None", color: "slate" };
  const v = (st.versionNote || "").split(" · ")[0];
  return { text: v ? `Live · ${v}` : "Live", short: v ? `Live · ${v}` : "Live", color: "green" };
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

function CRMAccounts({ selectedId, setSelectedId, liveStatus, go, triggerOpal, isSyncing }) {
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
            <button onClick={() => go("Campaigns")} className="mt-3 text-sm font-medium text-sky-700 hover:underline">See in campaign list</button>
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

function CRMCampaigns({ selectedId, setSelectedId, liveStatus, triggerOpal, isSyncing }) {
  const acc = ACCOUNTS.find((a) => a.id === selectedId);
  const d = DETAILS[selectedId];
  const st = liveLabel(liveStatus[acc.id]);
  const isLive = !!liveStatus[acc.id]?.live;
  const statusText = st.text;
  const statusColor = st.color;

  return (
    <>
      <PageHeader
        eyebrow="Campaign list"
        title="Q4 Tier-1 ABM"
        sub={`${ACCOUNTS.length} target accounts`}
        actions={
          <button 
            onClick={() => triggerOpal(acc)} 
            disabled={isSyncing[acc.id]} 
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm ${isSyncing[acc.id] ? "bg-violet-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
          >
            {isSyncing[acc.id] ? `✦ Sending ${acc.name} to Opal…` : `✦ Run Limitless · ${acc.name}`}
          </button>
        }
      />
      <DataTable heads={["Account", "Industry", "Stage", "Pipeline", "Owner", "Last activity", "Microsite"]}>
        {ACCOUNTS.map((a) => {
          const ls = liveLabel(liveStatus[a.id]);
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

export default function CRMApplication() {
  const [page, setPage] = useState("Campaigns");
  const [selectedId, setSelectedId] = useState("helix");
  const [isSyncing, setIsSyncing] = useState({});
  const [liveStatus, setLiveStatus] = useState({}); // { [accountId]: { live, url, versionNote, mode, lastRefreshed } }
  const [notice, setNotice] = useState(null);
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

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  // Payload shape matches /api/limitless/trigger (requires account.id) and the Router prompt.
  const triggerOpal = async (acc) => {
    setIsSyncing((prev) => ({ ...prev, [acc.id]: true }));
    const d = DETAILS[acc.id];
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
      setNotice(
        res.ok
          ? { tone: "ok", text: `${acc.name} sent to the Limitless workflow in Opal` }
          : { tone: "error", text: `Opal trigger failed: ${data.error || `HTTP ${data.status || res.status}`}` }
      );
    } catch {
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
        {page === "Accounts" && <CRMAccounts key={selectedId} selectedId={selectedId} setSelectedId={setSelectedId} liveStatus={liveStatus} go={go} triggerOpal={triggerOpal} isSyncing={isSyncing} />}
        {page === "Contacts" && <CRMContacts setSelectedId={setSelectedId} go={go} />}
        {page === "Opportunities" && <CRMOpportunities setSelectedId={setSelectedId} go={go} />}
        {page === "Campaigns" && <CRMCampaigns selectedId={selectedId} setSelectedId={setSelectedId} liveStatus={liveStatus} triggerOpal={triggerOpal} isSyncing={isSyncing} />}
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
