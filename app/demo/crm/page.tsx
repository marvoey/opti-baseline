// @ts-nocheck — demo UI ported from the canvas mock (plain JS). Remove this line and add types if you want strict checking.
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { siteConfig } from "@/lib/siteConfig";
import {
  TODAY, STAGES, STAGE_COLOR, STAGE_PROB, ACCOUNTS, OPPS, DETAILS, ALL_CONTACTS, RECENT_FEED,
  OWNER_NAMES, INDUSTRIES, COUNTIES, PRODUCT_LINES, ACTIVITY_LABELS, hasNewSignals, kFmt,
} from "./data";

/* =========================================================
   ESL BUSINESS BANKING CRM (mock) — Limitless 1:1 live demo
   Route: /demo/crm  (add "demo" to the proxy.ts matcher exclusions)
   - "Run Limitless" → POST /api/limitless/trigger → Opal workflow webhook
   - Microsite status ← GET /api/limitless/status?account=<id> (Graph, published only)
   Scenario: ESL Federal Credit Union relationship managers prospect 500 Rochester-area
   businesses and non-profits (data + generator in ./data.ts). Everything is fictional.
   ========================================================= */

const CRM_NAV = [
  { id: "Home", icon: "⌂" },
  { id: "Accounts", icon: "▣" },
  { id: "Contacts", icon: "☺" },
  { id: "Opportunities", icon: "◈" },
  { id: "Campaigns", icon: "➤" },
  { id: "Reports", icon: "▤" },
];

const ACCOUNT_IDS = new Set(ACCOUNTS.map((a) => a.id));
const ALL = "All";

/** Turn a status-route response into a badge label. versionNote looks like "v2 · updated: new CFO". */
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

const INITIAL_TASKS = [
  { id: "t1", text: "Send follow-up to Marcus Lee (Lakeshore) on fraud prevention overview", due: "Today", done: false },
  { id: "t2", text: "Review Limitless draft for Genesee Valley Health Partners", due: "Today", done: false },
  { id: "t3", text: "Prep discovery call: Monroe Precision Manufacturing", due: "Tomorrow", done: false },
  { id: "t4", text: "Update close date: Canandaigua Lakeside Hospitality", due: "Oct 29", done: true },
];

const initialsOf = (name) => name.replace("Dr. ", "").split(" ").map((x) => x[0]).join("").slice(0, 2);
const sumK = (list) => list.reduce((s, o) => s + o.amount, 0);
const weightedK = (list) => Math.round(list.reduce((s, o) => s + (o.amount * STAGE_PROB[o.stage]) / 100, 0));

const ACTIVITY_ICON = { call: "☎", email: "✉", meeting: "◉", web: "◐", event: "★", stage: "⇢", task: "✔" };
const agoLabel = (ago) => (ago < 1 ? "Today" : ago === 1 ? "Yesterday" : `${ago}d ago`);
const BUCKETS = ["Under $250K", "$250K–$750K", "$750K+"];
const bucketOf = (k) => (k < 250 ? BUCKETS[0] : k < 750 ? BUCKETS[1] : BUCKETS[2]);
const OPP_MONTHS = Array.from(new Set(OPPS.slice().sort((a, b) => a.closeTs - b.closeTs).map((o) => o.closeMonth)));
const micrositeKind = (abmPages, liveStatus, a) => {
  const t = micrositeLabel(abmPages, liveStatus, a).text;
  return t.startsWith("Published") ? "Published" : t.startsWith("Draft") ? "Draft" : "No page";
};

/* ---------- UI PRIMITIVES ---------- */

function Badge({ children, color = "slate" }) {
  const map = {
    slate: "bg-blue-100/50 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-blue-300/40 text-blue-800",
    rose: "bg-rose-100 text-rose-700",
  };
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${map[color] || map.slate}`}>{children}</span>;
}

function Card({ title, right, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-blue-100 bg-white p-4 shadow-sm ${className}`}>
      {title && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-blue-950">{title}</h3>
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

function IntentBadge({ meta }) {
  const color = meta.band === "High" ? "green" : meta.band === "Medium" ? "amber" : "slate";
  return <Badge color={color}>Intent {meta.intentScore} · {meta.band}</Badge>;
}

/** Dated activity entries (type icon, text, who, when). */
function ActivityList({ items, limit }) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <ul className="space-y-2 text-sm text-blue-700">
      {list.map((it, i) => (
        <li key={i} className="flex items-start gap-2.5 border-l-2 border-blue-300 pl-3">
          <span className="mt-0.5 w-4 shrink-0 text-center text-blue-500" title={ACTIVITY_LABELS[it.type]}>{ACTIVITY_ICON[it.type]}</span>
          <div className="min-w-0 flex-1">
            <div className="leading-snug">{it.text}</div>
            <div className="text-xs text-blue-700/50">{it.date} · {agoLabel(it.ago)} · {it.by}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Account enrichment: ODP first-party behaviour + external web research signals. */
function EnrichmentCards({ d, className = "mt-6" }) {
  const m = d?.odpMeta;
  return (
    <div className={`${className} grid gap-4 lg:grid-cols-2`}>
      <Card
        title="ODP behavioral intelligence"
        right={<div className="flex items-center gap-2">{m && <IntentBadge meta={m} />}<Badge color="green">Optimizely Data Platform</Badge></div>}
      >
        {m && d.odp.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5 text-xs text-blue-700">
            <span className="rounded-md bg-blue-50 px-2 py-1">{m.sessions} sessions · 30d</span>
            <span className="rounded-md bg-blue-50 px-2 py-1">Last seen {m.lastSeenDays === 0 ? "today" : `${m.lastSeenDays}d ago`}</span>
            <span className="rounded-md bg-blue-50 px-2 py-1">{m.source}</span>
          </div>
        )}
        {d?.odp && d.odp.length > 0 ? (
          <ul className="space-y-2 text-sm text-blue-700">
            {d.odp.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-xs font-bold text-emerald-600">✦</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-blue-700/70">No recent digital intent sessions captured in ODP.</div>
        )}
      </Card>

      <Card title="Web research & market signals" right={<Badge color="blue">External Intelligence</Badge>}>
        {d?.signals && d.signals.length > 0 ? (
          <ul className="space-y-2.5 text-sm text-blue-700">
            {d.signals.map((sig, idx) => (
              <li key={idx} className="flex items-start justify-between gap-3 border-l-2 border-blue-400 pl-3">
                <div>
                  <div className="font-medium leading-snug text-blue-800">{sig.text}</div>
                  <div className="mt-0.5 text-xs text-blue-700/50">{sig.date}</div>
                </div>
                <Badge color={SIGNAL_COLOR[sig.type] || "slate"}>{sig.type.replace(/_/g, " ")}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-blue-700/70">No external intelligence signals logged.</div>
        )}
      </Card>
    </div>
  );
}

function PageHeader({ eyebrow, title, sub, actions }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="text-xs uppercase tracking-wide text-blue-700/70">{eyebrow}</div>
        <h1 className="text-2xl font-bold text-blue-950">
          {title} {sub && <span className="text-base font-normal text-blue-700/70">· {sub}</span>}
        </h1>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

function Stat({ label, value, note, tone = "text-blue-700/70" }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-blue-700/70">{label}</div>
      <div className="mt-1 text-2xl font-bold text-blue-950">{value}</div>
      <div className={`mt-0.5 text-xs ${tone}`}>{note}</div>
    </div>
  );
}

function Avatar({ name, size = "h-8 w-8 text-xs" }) {
  return <div className={`flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 ${size}`}>{initialsOf(name)}</div>;
}

/** Heads are strings or { label, key } (sortable). */
function DataTable({ heads, children, sort, onSort }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-blue-50 text-left text-xs uppercase tracking-wide text-blue-700/70">
          <tr>
            {heads.map((h) => {
              const label = typeof h === "string" ? h : h.label;
              const key = typeof h === "string" ? null : h.key;
              const active = key && sort?.key === key;
              return (
                <th key={label} className="whitespace-nowrap px-4 py-3 font-medium">
                  {key && onSort ? (
                    <button onClick={() => onSort(key)} className={`inline-flex items-center gap-1 uppercase tracking-wide hover:text-blue-950 ${active ? "text-blue-950" : ""}`}>
                      {label}<span className="text-[10px]">{active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}</span>
                    </button>
                  ) : label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** Filter state with a "clear" that resets to the initial values and a count of active filters. */
function useFilters(initial) {
  const [f, setF] = useState(initial);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const clear = () => setF(initial);
  const active = Object.keys(initial).filter((k) => f[k] !== initial[k]).length;
  return { f, set, clear, active, sig: JSON.stringify(f) };
}

/** Sorting + pagination over an already-filtered row list. */
function useTableView(rows, accessors = {}, initialSort = { key: null, dir: "asc" }, resetSig = "") {
  const [sort, setSort] = useState(initialSort);
  // The page number is tied to the filter signature, so changing a filter returns to page 1.
  const [pageState, setPageState] = useState({ sig: resetSig, no: 0 });
  const pageNo = pageState.sig === resetSig ? pageState.no : 0;
  const setPageNo = (no) => setPageState({ sig: resetSig, no });
  const [size, setSizeState] = useState(25);
  const sorted = useMemo(() => {
    if (!sort.key) return rows;
    const get = accessors[sort.key] || ((r) => r[sort.key]);
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = get(a);
      const y = get(b);
      return (x < y ? -1 : x > y ? 1 : 0) * dir;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort]);
  const pages = Math.max(1, Math.ceil(sorted.length / size));
  const cur = Math.min(pageNo, pages - 1);
  return {
    sort,
    onSort: (key) => { setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" })); setPageNo(0); },
    page: cur, pages, size, total: sorted.length,
    slice: sorted.slice(cur * size, cur * size + size),
    setPage: setPageNo,
    setSize: (n) => { setSizeState(n); setPageNo(0); },
  };
}

function Pager({ view }) {
  if (view.total === 0) return null;
  const from = view.page * view.size + 1;
  const to = Math.min(view.total, (view.page + 1) * view.size);
  const btn = "rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-blue-700/80">
      <div>Showing {from}–{to} of {view.total}</div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5">Rows
          <select value={view.size} onChange={(e) => view.setSize(Number(e.target.value))} className="rounded-lg border border-blue-100 bg-white px-2 py-1.5 text-sm text-blue-700">
            {[25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <button className={btn} disabled={view.page === 0} onClick={() => view.setPage(0)} aria-label="First page">«</button>
        <button className={btn} disabled={view.page === 0} onClick={() => view.setPage(view.page - 1)}>Prev</button>
        <span>Page {view.page + 1} of {view.pages}</span>
        <button className={btn} disabled={view.page >= view.pages - 1} onClick={() => view.setPage(view.page + 1)}>Next</button>
        <button className={btn} disabled={view.page >= view.pages - 1} onClick={() => view.setPage(view.pages - 1)} aria-label="Last page">»</button>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wide text-blue-700/70">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`rounded-lg border bg-white px-2.5 py-1.5 text-sm normal-case tracking-normal text-blue-700 focus:border-blue-400 focus:outline-none ${value === options[0] ? "border-blue-100" : "border-blue-400 bg-blue-50"}`}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function FilterBar({ fl, count, total, children, noun = "results" }) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-blue-100 bg-white p-3 shadow-sm">
      {children}
      <div className="ml-auto flex items-center gap-3 pb-1 text-sm text-blue-700/80">
        <span>{count} of {total} {noun}</span>
        <button onClick={fl.clear} disabled={fl.active === 0} className="rounded-lg border border-blue-100 px-3 py-1.5 text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40">
          {fl.active > 0 ? `Clear filters (${fl.active})` : "No filters"}
        </button>
      </div>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-56 rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-blue-700 placeholder-blue-700/50 focus:border-blue-400 focus:outline-none"
    />
  );
}

function BarRow({ label, value, max, text, color = "bg-blue-500" }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-28 shrink-0 text-blue-700/80">{label}</div>
      <div className="h-5 flex-1 overflow-hidden rounded bg-blue-100/50">
        <div className={`h-full rounded ${color}`} style={{ width: `${max ? Math.max(4, (value / max) * 100) : 0}%` }} />
      </div>
      <div className="w-16 shrink-0 text-right font-medium text-blue-700">{text}</div>
    </div>
  );
}

/* ---------- VIEWS ---------- */

const ME = "Jordan Hayes";

function CRMHome({ liveMicrosites, go, setSelectedId }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [scope, setScope] = useState("My book");
  const mine = scope === "My book";
  const accts = useMemo(() => (mine ? ACCOUNTS.filter((a) => a.owner === ME) : ACCOUNTS), [mine]);
  const opps = useMemo(() => (mine ? OPPS.filter((o) => o.owner === ME) : OPPS), [mine]);
  const open = opps.filter((o) => o.stage !== "Funded");
  const funded = opps.filter((o) => o.stage === "Funded");
  const liveCount = accts.filter((a) => liveMicrosites.includes(a.id)).length;
  const feed = useMemo(() => RECENT_FEED.filter((f) => !mine || f.owner === ME || f.by === ME).slice(0, 10), [mine]);
  const stageTotals = STAGES.slice(0, 4).map((s) => ({ s, v: sumK(opps.filter((o) => o.stage === s)) }));
  const maxStage = Math.max(1, ...stageTotals.map((x) => x.v));
  return (
    <>
      <PageHeader
        eyebrow={`${TODAY} · Q4 FY26`}
        title="Good afternoon, Jordan"
        sub="here is your pipeline today"
        actions={
          <>
            <div className="flex overflow-hidden rounded-lg border border-blue-100 bg-white text-sm">
              {["My book", "All accounts"].map((v) => <button key={v} onClick={() => setScope(v)} className={`px-3 py-2 ${scope === v ? "bg-blue-600 text-white" : "text-blue-700/80 hover:bg-blue-50"}`}>{v}</button>)}
            </div>
            <button onClick={() => go("Campaigns")} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">View Q4 Business Growth ABM</button>
          </>
        }
      />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Open pipeline" value={kFmt(sumK(open))} note={`${open.length} open opportunities · ${accts.length} accounts`} />
        <Stat label="Weighted forecast" value={kFmt(weightedK(open))} note="Probability-adjusted" tone="text-emerald-600" />
        <Stat label="Funded (QTD)" value={kFmt(sumK(funded))} note={`${funded.length} deals`} />
        <Stat label="ABM microsites live" value={`${liveCount} of ${accts.length}`} note="Q4 Business Growth ABM" tone="text-blue-600" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="My tasks" className="lg:col-span-1" right={<span className="text-xs text-blue-700/70">{tasks.filter((t) => !t.done).length} open</span>}>
          <ul className="space-y-2.5 text-sm">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-start gap-2.5">
                <input type="checkbox" checked={t.done} onChange={() => setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} className="mt-1" />
                <div className="flex-1">
                  <div className={t.done ? "text-blue-700/50 line-through" : "text-blue-800"}>{t.text}</div>
                  <div className="text-xs text-blue-700/70">Due {t.due}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Pipeline by stage" className="lg:col-span-1">
          <div className="space-y-2.5">
            {stageTotals.map((x) => <BarRow key={x.s} label={x.s} value={x.v} max={maxStage} text={kFmt(x.v)} />)}
          </div>
        </Card>
        <Card title="Recent activity" className="lg:col-span-1" right={<span className="text-xs text-blue-700/70">{mine ? "My book" : "All accounts"}</span>}>
          <ul className="space-y-3 text-sm">
            {feed.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-16 shrink-0 text-xs text-blue-700/50">{agoLabel(f.ago)}</span>
                <span className="text-blue-700">
                  <span className="mr-1 text-blue-500">{ACTIVITY_ICON[f.type]}</span>
                  <span className="font-medium text-blue-950">{f.account}</span> · {f.text}
                  {" "}<button onClick={() => { setSelectedId(f.acct); go("Accounts"); }} className="text-blue-700 hover:underline">View</button>
                </span>
              </li>
            ))}
            {feed.length === 0 && <li className="text-blue-700/70">No recent activity.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}

const ACCOUNT_FILTERS = { q: "", owner: ALL, industry: ALL, county: ALL, stage: ALL, tier: ALL, microsite: ALL, intent: ALL, signals: ALL, size: ALL };

function filterAccounts(f, abmPages, liveStatus) {
  const q = f.q.trim().toLowerCase();
  return ACCOUNTS.filter((a) => {
    if (f.owner !== ALL && a.owner !== f.owner) return false;
    if (f.industry !== ALL && a.industry !== f.industry) return false;
    if (f.county !== ALL && a.county !== f.county) return false;
    if (f.stage !== ALL && a.stage !== f.stage) return false;
    if (f.tier !== ALL && `Tier ${a.tier}` !== f.tier) return false;
    if (f.size !== ALL && bucketOf(a.pipelineK) !== f.size) return false;
    if (f.intent !== ALL && DETAILS[a.id].odpMeta.band !== f.intent) return false;
    if (f.signals !== ALL && !hasNewSignals(a.id)) return false;
    if (f.microsite !== ALL && micrositeKind(abmPages, liveStatus, a) !== f.microsite) return false;
    if (q && !(`${a.name} ${a.hq}`.toLowerCase().includes(q) || DETAILS[a.id].contacts.some((c) => c.name.toLowerCase().includes(q)))) return false;
    return true;
  });
}

const ACCOUNT_SORTS = {
  name: (a) => a.name.toLowerCase(),
  intent: (a) => DETAILS[a.id].odpMeta.intentScore,
  signals: (a) => DETAILS[a.id].signals.length,
};

function AccountFilters({ fl, count }) {
  const { f, set } = fl;
  return (
    <FilterBar fl={fl} count={count} total={ACCOUNTS.length} noun="accounts">
      <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wide text-blue-700/70">Search
        <SearchBox value={f.q} onChange={(v) => set("q", v)} placeholder="Account, town or contact" />
      </label>
      <FilterSelect label="Owner" value={f.owner} onChange={(v) => set("owner", v)} options={[ALL, ...OWNER_NAMES]} />
      <FilterSelect label="Industry" value={f.industry} onChange={(v) => set("industry", v)} options={[ALL, ...INDUSTRIES]} />
      <FilterSelect label="County" value={f.county} onChange={(v) => set("county", v)} options={[ALL, ...COUNTIES]} />
      <FilterSelect label="Stage" value={f.stage} onChange={(v) => set("stage", v)} options={[ALL, ...STAGES]} />
      <FilterSelect label="Tier" value={f.tier} onChange={(v) => set("tier", v)} options={[ALL, "Tier 1", "Tier 2", "Tier 3"]} />
      <FilterSelect label="Pipeline" value={f.size} onChange={(v) => set("size", v)} options={[ALL, ...BUCKETS]} />
      <FilterSelect label="Microsite" value={f.microsite} onChange={(v) => set("microsite", v)} options={[ALL, "No page", "Draft", "Published"]} />
      <FilterSelect label="ODP intent" value={f.intent} onChange={(v) => set("intent", v)} options={[ALL, "High", "Medium", "Low"]} />
      <FilterSelect label="Signals" value={f.signals} onChange={(v) => set("signals", v)} options={[ALL, "New in last 30 days"]} />
    </FilterBar>
  );
}

function CRMAccounts({ selectedId, setSelectedId, liveStatus, go, triggerOpal, isSyncing, abmPages = [] }) {
  const [openId, setOpenId] = useState(null);
  const fl = useFilters(ACCOUNT_FILTERS);
  const filtered = useMemo(() => filterAccounts(fl.f, abmPages, liveStatus), [fl.sig, abmPages, liveStatus]); // eslint-disable-line react-hooks/exhaustive-deps
  const view = useTableView(filtered, ACCOUNT_SORTS, { key: null, dir: "asc" }, fl.sig);

  if (openId) {
    const acc = ACCOUNTS.find((a) => a.id === openId);
    const d = DETAILS[acc.id];
    const st = liveLabel(liveStatus[acc.id]);
    const isLive = !!liveStatus[acc.id]?.live;
    const statusText = st.text;
    const statusColor = st.color;
    const contacts = ALL_CONTACTS.filter((c) => c.accountId === acc.id);
    const opps = OPPS.filter((o) => o.acct === acc.id);
    const pageInCms = findAbmPage(abmPages, acc);

    return (
      <>
        <div className="mb-3 text-sm text-blue-700/70"><button onClick={() => setOpenId(null)} className="text-blue-700 hover:underline">Accounts</button> / {acc.name}</div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-900 text-lg font-bold text-white">{initialsOf(acc.name)}</div>
            <div>
              <h1 className="text-2xl font-bold text-blue-950">{acc.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-blue-700/70">{acc.industry} · {acc.hq} <Badge color={STAGE_COLOR[acc.stage]}>{acc.stage}</Badge><Badge color="slate">Tier {acc.tier}</Badge><Badge color={statusColor}>Microsite: {statusText}</Badge></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">Log activity</button>
            <button
              onClick={() => triggerOpal(acc)}
              disabled={isSyncing[acc.id]}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${isSyncing[acc.id] ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isSyncing[acc.id] ? "✦ Sending to Limitless..." : "✦ Run Limitless Agent"}
            </button>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Account details">
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-blue-700/70">Industry</dt><dd>{acc.industry}</dd>
              <dt className="text-blue-700/70">HQ</dt><dd>{acc.hq} ({acc.county} Co.)</dd>
              <dt className="text-blue-700/70">Employees</dt><dd>{acc.employees}</dd>
              <dt className="text-blue-700/70">Annual revenue</dt><dd>{acc.revenue}</dd>
              <dt className="text-blue-700/70">Owner</dt><dd>{acc.owner}</dd>
              <dt className="text-blue-700/70">Campaign</dt><dd>Q4 Business Growth ABM · Tier {acc.tier}</dd>
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
                      <div className="text-xs text-blue-700/70">{c.title}</div>
                    </div>
                  </div>
                  <Badge color="violet">{c.role}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Opportunities">
            <div className="space-y-2">
              {opps.map((o) => (
                <div key={o.id} className="rounded-lg border border-blue-100/50 p-3 text-sm">
                  <div className="font-medium text-blue-950">{o.name}</div>
                  <div className="mt-1 flex items-center justify-between text-blue-700/80"><span>{kFmt(o.amount)} · close {o.close}</span><Badge color={STAGE_COLOR[o.stage]}>{o.stage}</Badge></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <EnrichmentCards d={d} className="mt-4" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card title="Recent activity" className="lg:col-span-2" right={<span className="text-xs text-blue-700/50">{d.activityItems.length} entries</span>}>
            <ActivityList items={d.activityItems} />
          </Card>
          <Card title="Limitless 1:1 microsite" right={<Badge color={statusColor}>{statusText}</Badge>}>
            <p className="text-sm text-blue-700/80">
              {isLive ? (
                <>Personalized page live at{" "}
                  <a href={liveStatus[acc.id].url || "#"} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 hover:underline">{liveStatus[acc.id].url}</a>
                </>
              ) : "No published page yet. Run the Limitless workflow to research and generate a draft, then approve it in CMS."}
            </p>
            {pageInCms?.cmsEditUrl && (
              <div className="mt-3">
                <a
                  href={pageInCms.cmsEditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  Review in CMS Visual Builder ↗
                </a>
              </div>
            )}
            <button onClick={() => { setSelectedId(acc.id); go("Campaigns"); }} className="mt-3 block text-sm font-medium text-blue-700 hover:underline">See in campaign list</button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="All accounts" title="Accounts" sub={`${filtered.length} of ${ACCOUNTS.length}`} actions={<button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ New account</button>} />
      <AccountFilters fl={fl} count={filtered.length} />
      <DataTable
        heads={[{ label: "Account", key: "name" }, { label: "Industry", key: "industry" }, { label: "HQ", key: "hq" }, { label: "Employees", key: "employeesN" }, { label: "Owner", key: "owner" }, { label: "Tier", key: "tier" }, { label: "ODP intent", key: "intent" }, { label: "Last activity", key: "lastActivityAgo" }, { label: "Open opportunity", key: "pipelineK" }]}
        sort={view.sort}
        onSort={view.onSort}
      >
        {view.slice.map((a) => {
          const meta = DETAILS[a.id].odpMeta;
          return (
            <tr key={a.id} onClick={() => { setSelectedId(a.id); setOpenId(a.id); }} className={`cursor-pointer border-t border-blue-100/50 ${a.id === selectedId ? "bg-blue-50" : "hover:bg-blue-50"}`}>
              <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-xs font-semibold text-white">{initialsOf(a.name)}</div><span className="font-medium text-blue-700">{a.name}</span></div></td>
              <td className="px-4 py-3 text-blue-700/80">{a.industry}</td>
              <td className="px-4 py-3 text-blue-700/80">{a.hq}</td>
              <td className="px-4 py-3 text-blue-700/80">{a.employees}</td>
              <td className="px-4 py-3 text-blue-700/80">{a.owner}</td>
              <td className="px-4 py-3 text-blue-700/80">{a.tier}</td>
              <td className="px-4 py-3"><IntentBadge meta={meta} /></td>
              <td className="px-4 py-3 text-blue-700/70">{a.lastActivity}</td>
              <td className="px-4 py-3"><span className="text-blue-700">{a.pipeline}</span> <Badge color={STAGE_COLOR[a.stage]}>{a.stage}</Badge></td>
            </tr>
          );
        })}
      </DataTable>
      {filtered.length === 0 && <div className="mt-6 text-center text-sm text-blue-700/70">No accounts match your filters.</div>}
      <Pager view={view} />
    </>
  );
}

const CONTACT_FILTERS = { q: "", role: ALL, industry: ALL, owner: ALL, engaged: ALL, isNew: ALL };
const ENGAGED = [ALL, "Last 7 days", "Last 30 days", "Over 30 days"];

function CRMContacts({ setSelectedId, go }) {
  const fl = useFilters(CONTACT_FILTERS);
  const filtered = useMemo(() => {
    const { q, role, industry, owner, engaged, isNew } = fl.f;
    const needle = q.trim().toLowerCase();
    return ALL_CONTACTS.filter((c) => {
      if (role !== ALL && c.role !== role) return false;
      if (industry !== ALL && c.industry !== industry) return false;
      if (owner !== ALL && c.owner !== owner) return false;
      if (isNew !== ALL && !c.isNew) return false;
      if (engaged === "Last 7 days" && c.engagedDays > 7) return false;
      if (engaged === "Last 30 days" && c.engagedDays > 30) return false;
      if (engaged === "Over 30 days" && c.engagedDays <= 30) return false;
      if (needle && !`${c.name} ${c.account} ${c.email} ${c.title}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [fl.sig]); // eslint-disable-line react-hooks/exhaustive-deps
  const view = useTableView(filtered, { name: (c) => c.name.toLowerCase() }, { key: null, dir: "asc" }, fl.sig);
  return (
    <>
      <PageHeader eyebrow="All contacts" title="Contacts" sub={`${filtered.length} of ${ALL_CONTACTS.length}`} actions={<button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ New contact</button>} />
      <FilterBar fl={fl} count={filtered.length} total={ALL_CONTACTS.length} noun="contacts">
        <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wide text-blue-700/70">Search
          <SearchBox value={fl.f.q} onChange={(v) => fl.set("q", v)} placeholder="Name, account, title or email" />
        </label>
        <FilterSelect label="Buying role" value={fl.f.role} onChange={(v) => fl.set("role", v)} options={[ALL, "Economic Buyer", "Technical Evaluator", "Champion"]} />
        <FilterSelect label="Industry" value={fl.f.industry} onChange={(v) => fl.set("industry", v)} options={[ALL, ...INDUSTRIES]} />
        <FilterSelect label="Owner" value={fl.f.owner} onChange={(v) => fl.set("owner", v)} options={[ALL, ...OWNER_NAMES]} />
        <FilterSelect label="Last engaged" value={fl.f.engaged} onChange={(v) => fl.set("engaged", v)} options={ENGAGED} />
        <FilterSelect label="New" value={fl.f.isNew} onChange={(v) => fl.set("isNew", v)} options={[ALL, "New contacts only"]} />
      </FilterBar>
      <DataTable
        heads={[{ label: "Name", key: "name" }, { label: "Title", key: "title" }, { label: "Account", key: "account" }, { label: "Buying role", key: "role" }, "Email", { label: "Last engaged", key: "engagedDays" }, { label: "Owner", key: "owner" }]}
        sort={view.sort}
        onSort={view.onSort}
      >
        {view.slice.map((c) => (
          <tr key={`${c.accountId}-${c.email}`} className="border-t border-blue-100/50 hover:bg-blue-50">
            <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={c.name} /><span className="font-medium text-blue-950">{c.name}</span>{c.isNew && <Badge color="amber">New</Badge>}</div></td>
            <td className="px-4 py-3 text-blue-700/80">{c.title}</td>
            <td className="px-4 py-3"><button onClick={() => { setSelectedId(c.accountId); go("Accounts"); }} className="text-left text-blue-700 hover:underline">{c.account}</button></td>
            <td className="px-4 py-3"><Badge color="violet">{c.role}</Badge></td>
            <td className="px-4 py-3 text-blue-700/70">{c.email}</td>
            <td className="px-4 py-3 text-blue-700/70">{c.engaged}</td>
            <td className="px-4 py-3 text-blue-700/80">{c.owner}</td>
          </tr>
        ))}
      </DataTable>
      {filtered.length === 0 && <div className="mt-6 text-center text-sm text-blue-700/70">No contacts match your filters.</div>}
      <Pager view={view} />
    </>
  );
}

const OPP_FILTERS = { q: "", stage: ALL, owner: ALL, product: ALL, amount: ALL, month: ALL };
const BOARD_LIMIT = 8;

function CRMOpportunities({ setSelectedId, go }) {
  const [boardView, setBoardView] = useState("Board");
  const [expanded, setExpanded] = useState({});
  const fl = useFilters(OPP_FILTERS);
  const filtered = useMemo(() => {
    const { q, stage, owner, product, amount, month } = fl.f;
    const needle = q.trim().toLowerCase();
    return OPPS.filter((o) => {
      if (stage !== ALL && o.stage !== stage) return false;
      if (owner !== ALL && o.owner !== owner) return false;
      if (product !== ALL && o.product !== product) return false;
      if (amount !== ALL && bucketOf(o.amount) !== amount) return false;
      if (month !== ALL && o.closeMonth !== month) return false;
      if (needle && !`${o.name} ${o.account}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [fl.sig]); // eslint-disable-line react-hooks/exhaustive-deps
  const view = useTableView(filtered, { name: (o) => o.name.toLowerCase(), account: (o) => o.account.toLowerCase(), close: (o) => o.closeTs }, { key: "amount", dir: "desc" }, fl.sig);
  const open = (o) => { if (o.acct) { setSelectedId(o.acct); go("Accounts"); } };
  const openFiltered = filtered.filter((o) => o.stage !== "Funded");
  return (
    <>
      <PageHeader
        eyebrow="Sales pipeline"
        title="Opportunities"
        sub={`${kFmt(sumK(openFiltered))} open · ${openFiltered.length} deals`}
        actions={<><div className="flex overflow-hidden rounded-lg border border-blue-100 bg-white text-sm">{["Board", "List"].map((v) => <button key={v} onClick={() => setBoardView(v)} className={`px-3 py-2 ${boardView === v ? "bg-blue-600 text-white" : "text-blue-700/80 hover:bg-blue-50"}`}>{v}</button>)}</div><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ New opportunity</button></>}
      />
      <FilterBar fl={fl} count={filtered.length} total={OPPS.length} noun="opportunities">
        <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wide text-blue-700/70">Search
          <SearchBox value={fl.f.q} onChange={(v) => fl.set("q", v)} placeholder="Opportunity or account" />
        </label>
        <FilterSelect label="Stage" value={fl.f.stage} onChange={(v) => fl.set("stage", v)} options={[ALL, ...STAGES]} />
        <FilterSelect label="Owner" value={fl.f.owner} onChange={(v) => fl.set("owner", v)} options={[ALL, ...OWNER_NAMES]} />
        <FilterSelect label="Product" value={fl.f.product} onChange={(v) => fl.set("product", v)} options={[ALL, ...PRODUCT_LINES]} />
        <FilterSelect label="Amount" value={fl.f.amount} onChange={(v) => fl.set("amount", v)} options={[ALL, ...BUCKETS]} />
        <FilterSelect label="Close month" value={fl.f.month} onChange={(v) => fl.set("month", v)} options={[ALL, ...OPP_MONTHS]} />
      </FilterBar>
      {boardView === "Board" ? (
        <div className="grid grid-cols-5 gap-3">
          {STAGES.map((s) => {
            const list = filtered.filter((o) => o.stage === s).sort((a, b) => b.amount - a.amount);
            const shown = expanded[s] ? list : list.slice(0, BOARD_LIMIT);
            return (
              <div key={s} className="rounded-xl bg-blue-100/50 p-2">
                <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wide text-blue-700/80"><span>{s} · {list.length}</span><span>{kFmt(sumK(list))}</span></div>
                <div className="space-y-2">
                  {shown.map((o) => (
                    <div key={o.id} onClick={() => open(o)} className={`rounded-lg border border-blue-100 bg-white p-3 text-sm shadow-sm ${o.acct ? "cursor-pointer hover:border-blue-300" : ""}`}>
                      <div className="font-medium text-blue-950">{o.name}</div>
                      <div className="text-xs text-blue-700/70">{o.account}</div>
                      <div className="mt-2 flex items-center justify-between text-xs"><span className="font-semibold text-blue-800">{kFmt(o.amount)}</span><span className="text-blue-700/70">{o.close}</span></div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-blue-700/70"><Avatar name={o.owner} size="h-5 w-5 text-xs" />{o.owner}</div>
                    </div>
                  ))}
                  {list.length === 0 && <div className="px-1 py-3 text-xs text-blue-700/50">No deals</div>}
                  {list.length > BOARD_LIMIT && (
                    <button onClick={() => setExpanded((e) => ({ ...e, [s]: !e[s] }))} className="w-full rounded-lg py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                      {expanded[s] ? "Show less" : `Show all ${list.length}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <DataTable
            heads={[{ label: "Opportunity", key: "name" }, { label: "Account", key: "account" }, { label: "Product", key: "product" }, { label: "Stage", key: "stage" }, { label: "Amount", key: "amount" }, "Probability", { label: "Close date", key: "close" }, { label: "Owner", key: "owner" }]}
            sort={view.sort}
            onSort={view.onSort}
          >
            {view.slice.map((o) => (
              <tr key={o.id} onClick={() => open(o)} className={`border-t border-blue-100/50 hover:bg-blue-50 ${o.acct ? "cursor-pointer" : ""}`}>
                <td className="px-4 py-3 font-medium text-blue-700">{o.name}</td>
                <td className="px-4 py-3 text-blue-700/80">{o.account}</td>
                <td className="px-4 py-3 text-blue-700/80">{o.product}</td>
                <td className="px-4 py-3"><Badge color={STAGE_COLOR[o.stage]}>{o.stage}</Badge></td>
                <td className="px-4 py-3 text-blue-700">{kFmt(o.amount)}</td>
                <td className="px-4 py-3 text-blue-700/80">{STAGE_PROB[o.stage]}%</td>
                <td className="px-4 py-3 text-blue-700/70">{o.close}</td>
                <td className="px-4 py-3 text-blue-700/80">{o.owner}</td>
              </tr>
            ))}
          </DataTable>
          {filtered.length === 0 && <div className="mt-6 text-center text-sm text-blue-700/70">No opportunities match your filters.</div>}
          <Pager view={view} />
        </>
      )}
      {boardView === "Board" && filtered.length === 0 && <div className="mt-6 text-center text-sm text-blue-700/70">No opportunities match your filters.</div>}
    </>
  );
}

const LOG_COLOR = { info: "text-blue-300", step: "text-blue-300 font-semibold", tool: "text-blue-300", ok: "text-emerald-400", warn: "text-amber-300", error: "text-rose-400" };

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
          <button onClick={onClear} className="text-xs font-medium text-blue-700/70 hover:text-blue-800">Clear</button>
        </div>
      }
    >
      <div ref={ref} className="h-60 overflow-auto rounded-lg bg-blue-950 p-3 font-mono text-xs leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-blue-700/70">Run Limitless on an account to see progress here.</div>
        ) : (
          logs.map((l, i) => (
            <div key={i} className={LOG_COLOR[l.level] || LOG_COLOR.info}>
              <span className="text-blue-700/70">{l.ts}</span> {l.text}
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
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm ${isSyncing[acc.id] ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isSyncing[acc.id] ? `✦ Sending ${acc.name} to Opal…` : `✦ Run Limitless · ${acc.name}`}
          </button>
          {lastUpdated && <span className="text-xs text-blue-700/50">Updated {lastUpdated.toLocaleTimeString()}</span>}
          <Badge color="slate">{pages.length}</Badge>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh from the CMS"
            aria-label="Refresh ABM landing pages"
            className="rounded-md p-1 text-blue-700/70 hover:bg-blue-100/50 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="text-sm text-blue-700/70">No landing pages created yet.</div>
      ) : (
        <ul className="divide-y divide-blue-100/50 text-sm">
          {pages.map((p) => {
            const badge = pageLabel(p);
            return (
              <li key={p.key} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-blue-800">{p.accountName}</div>
                  <div className="truncate text-xs text-blue-700/70">{p.versionNote || `v${p.version}`}</div>
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
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
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
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100/50 hover:text-blue-700"
                      title="Open live public microsite"
                    >
                      Live site ↗
                    </a>
                  ) : !p.cmsEditUrl ? (
                    <span className="text-xs text-blue-700/50">Publish in CMS</span>
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
  const fl = useFilters({ ...ACCOUNT_FILTERS, tier: "Tier 1" });
  const filtered = useMemo(() => filterAccounts(fl.f, abmPages, liveStatus), [fl.sig, abmPages, liveStatus]); // eslint-disable-line react-hooks/exhaustive-deps
  const view = useTableView(filtered, ACCOUNT_SORTS, { key: null, dir: "asc" }, fl.sig);
  const acc = ACCOUNTS.find((a) => a.id === selectedId) || ACCOUNTS[0];
  const d = DETAILS[acc.id];
  const st = micrositeLabel(abmPages, liveStatus, acc);
  const statusText = st.text;
  const statusColor = st.color;

  return (
    <>
      <PageHeader
        eyebrow="Campaign list"
        title="Q4 Business Growth ABM"
        sub={`${filtered.length} target accounts`}
      />
      <AccountFilters fl={fl} count={filtered.length} />
      <DataTable
        heads={[{ label: "Account", key: "name" }, { label: "Industry", key: "industry" }, { label: "Stage", key: "stage" }, { label: "ODP intent", key: "intent" }, { label: "Pipeline", key: "pipelineK" }, { label: "Owner", key: "owner" }, { label: "Last activity", key: "lastActivityAgo" }, "Microsite"]}
        sort={view.sort}
        onSort={view.onSort}
      >
        {view.slice.map((a) => {
          const ls = micrositeLabel(abmPages, liveStatus, a);
          return (
            <tr key={a.id} onClick={() => setSelectedId(a.id)} className={`cursor-pointer border-t border-blue-100/50 ${a.id === selectedId ? "bg-blue-50" : "hover:bg-blue-50"}`}>
              <td className="px-4 py-3 font-medium text-blue-700">{a.name}</td>
              <td className="px-4 py-3 text-blue-700/80">{a.industry}</td>
              <td className="px-4 py-3"><Badge color={STAGE_COLOR[a.stage]}>{a.stage}</Badge></td>
              <td className="px-4 py-3"><IntentBadge meta={DETAILS[a.id].odpMeta} /></td>
              <td className="px-4 py-3 text-blue-700">{a.pipeline}</td>
              <td className="px-4 py-3 text-blue-700/80">{a.owner}</td>
              <td className="px-4 py-3 text-blue-700/70">{a.lastActivity}</td>
              <td className="px-4 py-3"><Badge color={ls.color}>{ls.short}</Badge></td>
            </tr>
          );
        })}
      </DataTable>
      {filtered.length === 0 && <div className="mt-6 text-center text-sm text-blue-700/70">No accounts match your filters.</div>}
      <Pager view={view} />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card title={acc.name} right={<Badge color={statusColor}>Microsite: {statusText}</Badge>}>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-blue-700/70">Industry</dt><dd>{acc.industry}</dd>
            <dt className="text-blue-700/70">HQ</dt><dd>{acc.hq}</dd>
            <dt className="text-blue-700/70">Employees</dt><dd>{acc.employees}</dd>
            <dt className="text-blue-700/70">Revenue</dt><dd>{acc.revenue}</dd>
            <dt className="text-blue-700/70">Opportunity</dt><dd>{acc.pipeline} · {acc.stage}</dd>
          </dl>
        </Card>
        <Card title="Buying committee (known contacts)">
          <div className="space-y-3">
            {d.contacts.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} />
                  <div>
                    <div className="text-sm font-medium">{c.name} {c.isNew && <Badge color="amber">New</Badge>}</div>
                    <div className="text-xs text-blue-700/70">{c.title}</div>
                  </div>
                </div>
                <Badge color="violet">{c.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Recent activity">
          <ActivityList items={d.activityItems} limit={5} />
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
  const fl = useFilters({ owner: ALL, industry: ALL, county: ALL });
  const { owner, industry, county } = fl.f;
  const accts = useMemo(() => ACCOUNTS.filter((a) => (owner === ALL || a.owner === owner) && (industry === ALL || a.industry === industry) && (county === ALL || a.county === county)), [fl.sig]); // eslint-disable-line react-hooks/exhaustive-deps
  const ids = useMemo(() => new Set(accts.map((a) => a.id)), [accts]);
  const opps = useMemo(() => OPPS.filter((o) => (o.acct ? ids.has(o.acct) : industry === ALL && county === ALL && (owner === ALL || o.owner === owner))), [ids, owner, industry, county]);
  const open = opps.filter((o) => o.stage !== "Funded");
  const funded = opps.filter((o) => o.stage === "Funded");
  const owners = OWNER_NAMES.map((n) => ({ n, v: sumK(open.filter((o) => o.owner === n)) })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
  const maxOwner = Math.max(1, ...owners.map((x) => x.v));
  const byIndustry = INDUSTRIES.map((n) => ({ n, v: sumK(open.filter((o) => o.acct && ACCOUNTS.find((a) => a.id === o.acct)?.industry === n)) })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
  const maxIndustry = Math.max(1, ...byIndustry.map((x) => x.v));
  const stageTotals = STAGES.slice(0, 4).map((s) => ({ s, v: sumK(opps.filter((o) => o.stage === s)) }));
  const maxStage = Math.max(1, ...stageTotals.map((x) => x.v));
  const tier1 = accts.filter((a) => a.tier === 1);
  const liveCount = tier1.filter((a) => liveMicrosites.includes(a.id)).length;
  const engaged = tier1.filter((a) => a.lastActivityAgo <= 30 || DETAILS[a.id].odpMeta.band === "High").length;
  const meetings = tier1.reduce((s, a) => s + DETAILS[a.id].activityItems.filter((i) => i.type === "meeting" && i.ago <= 30).length, 0);
  const avgIntent = accts.length ? Math.round(accts.reduce((s, a) => s + DETAILS[a.id].odpMeta.intentScore, 0) / accts.length) : 0;
  const saved = ["Pipeline by stage", "Pipeline by industry", "ABM account engagement", "Forecast vs quota", "Stale opportunities (30+ days)"];
  const sel = "rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-blue-700";

  return (
    <>
      <PageHeader eyebrow="Analytics" title="Reports" sub="Sales and ABM performance" actions={<><select value={range} onChange={(e) => setRange(e.target.value)} className={sel}>{["This month", "This quarter", "This year"].map((r) => <option key={r}>{r}</option>)}</select><button className="rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">Export CSV</button></>} />
      <FilterBar fl={fl} count={accts.length} total={ACCOUNTS.length} noun="accounts">
        <FilterSelect label="Owner" value={owner} onChange={(v) => fl.set("owner", v)} options={[ALL, ...OWNER_NAMES]} />
        <FilterSelect label="Industry" value={industry} onChange={(v) => fl.set("industry", v)} options={[ALL, ...INDUSTRIES]} />
        <FilterSelect label="County" value={county} onChange={(v) => fl.set("county", v)} options={[ALL, ...COUNTIES]} />
      </FilterBar>
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Open pipeline" value={kFmt(sumK(open))} note={`${open.length} deals · ${range}`} />
        <Stat label="Weighted forecast" value={kFmt(weightedK(open))} note="Probability-adjusted" />
        <Stat label="Funded" value={kFmt(sumK(funded))} note={`${funded.length} deals`} tone="text-emerald-600" />
        <Stat label="Avg ODP intent score" value={`${avgIntent}`} note={`${accts.length} accounts`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Open pipeline by stage">
          <div className="space-y-2.5">
            {stageTotals.map((x) => <BarRow key={x.s} label={x.s} value={x.v} max={maxStage} text={kFmt(x.v)} />)}
          </div>
        </Card>
        <Card title="Open pipeline by owner">
          <div className="space-y-2.5">{owners.map((x) => <BarRow key={x.n} label={x.n} value={x.v} max={maxOwner} text={kFmt(x.v)} color="bg-blue-500" />)}</div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Open pipeline by industry">
          <div className="space-y-2.5">{byIndustry.map((x) => <BarRow key={x.n} label={x.n} value={x.v} max={maxIndustry} text={kFmt(x.v)} color="bg-blue-400" />)}</div>
        </Card>
        <Card title="Campaign performance: Q4 Business Growth ABM (Tier 1)">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-blue-100/50">
              {[["Target accounts", `${tier1.length}`], ["Personalized microsites live", `${liveCount} of ${tier1.length}`], ["Accounts engaged (30 days)", `${engaged} of ${tier1.length}`], ["Meetings booked (30 days)", `${meetings}`], ["Pipeline influenced", kFmt(sumK(open.filter((o) => o.acct && tier1.some((a) => a.id === o.acct))))]].map((r) => (
                <tr key={r[0]}><td className="py-2 text-blue-700/80">{r[0]}</td><td className="py-2 text-right font-medium text-blue-950">{r[1]}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="mt-4">
        <Card title="Saved reports">
          <ul className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">{saved.map((s) => <li key={s} className="flex items-center justify-between rounded-lg border border-blue-100/50 px-3 py-2 text-blue-700 hover:bg-blue-50"><span>{s}</span><span className="text-blue-700/50">›</span></li>)}</ul>
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
        text: `[lim1_account_researcher] Running web search for ${acc.industry} industry benchmarks & NCUA/regulatory context…`,
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
  const [selectedId, setSelectedId] = useState("lakeshore");
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
  // An account is "live" when Graph reports a published page or the CMS list has one published.
  const liveMicrosites = useMemo(
    () => ACCOUNTS.filter((a) => liveStatus[a.id]?.live || findAbmPage(abmPages, a)?.status === "published").map((a) => a.id),
    [liveStatus, abmPages]
  );

  const go = (p) => setPage(p);

  // Poll the status route (Graph, published content only) so "Live · v1/v2" appears after you publish in CMS.
  // With 500 accounts we only poll the selected account plus accounts that already have a CMS page
  // (known from the single /pages call below); every other account is "No page" without a request.
  const pollKey = useMemo(
    () => Array.from(new Set([selectedId, ...abmPages.map((p) => p.accountId).filter((id) => id && ACCOUNT_IDS.has(id))])).join(","),
    [selectedId, abmPages]
  );
  useEffect(() => {
    let cancelled = false;
    const ids = pollKey.split(",").filter(Boolean);
    const fetchStatus = async () => {
      const rows = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetch(`/api/limitless/status?account=${encodeURIComponent(id)}`, { cache: "no-store" });
            return [id, res.ok ? await res.json() : { live: false }];
          } catch {
            return [id, { live: false }];
          }
        })
      );
      if (!cancelled) setLiveStatus((prev) => ({ ...prev, ...Object.fromEntries(rows) }));
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [pollKey]);

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
          contacts: d.contacts,
          activity: d.activity,
          signals: d.signals,
          odp: d.odp, // simulated ODP behavioural feed
          crmNotes: d.crm,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        log("ok", `Accepted by Opal (HTTP ${data.status || res.status}). Starting lim1_abm_orchestrator…`);
        setRunActive({ id: acc.id, name: acc.name, startedAt: Date.now() });

        // Simulated lim1_abm_orchestrator step logs while waiting for the CMS draft
        clearSimTimers();
        const contacts = d.contacts;
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
    <div className="flex h-screen w-full font-sans text-blue-800">
      <aside className="flex w-52 shrink-0 flex-col bg-blue-950 p-4 text-blue-100">
        <div className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoInvertedSrc} alt={siteConfig.logoAlt} width={83} height={50} className="h-[50px] w-[83px]" />
        </div>
        <nav className="flex-1 space-y-1">
          {CRM_NAV.map((n) => (
            <button key={n.id} onClick={() => go(n.id)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${n.id === page ? "bg-blue-800 text-white" : "text-blue-200 hover:bg-blue-900"}`}>
              <span className="w-4 text-center opacity-80">{n.icon}</span>{n.id}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 border-t border-blue-900 pt-3 text-xs text-blue-300">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 font-semibold text-white">JH</div>
          <div><div className="text-blue-100">Jordan Hayes</div><div>Business development lead</div></div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-blue-50 p-6">
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
