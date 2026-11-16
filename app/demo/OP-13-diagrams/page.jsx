'use client';

import React, { useState, useEffect, useMemo } from "react";

/* ------------------------------------------------------------------
   Data: copied from the published CMS content
   (folders "OP-14 Data Flow" and "OP-14 ERD")
------------------------------------------------------------------- */
const QUESTION =
  "Can you send a data flow diagram from an author's edit to a live page behind our Akamai, with each step labeled vendor-managed or customer-built and the expected time at each step? Please also send an ERD of an example platform's data model, showing how content types, entries, shared references, assets, versions and workflow states relate in relation to content/asset retrieval.";

const FLOW = [
  { step: 1, what: "Author edits content in Visual Builder or the form editor (changes autosave as a draft).", where: "CMS (SaaS)", owner: "Vendor-managed", time: "Real time", notes: "Draft is never visible to the public Graph key." },
  { step: 2, what: "Author previews the draft in LM's real front end (preview token appended to the preview URL).", where: "CMS (SaaS) + LM front end", owner: "Vendor-managed (preview); customer-built (preview route in the app)", time: "Real time (preview refreshes on save)", notes: "Preview token is short-lived (5 minutes)." },
  { step: 3, what: "Author submits 'Ready for Review'; approvers act in the approval sequence (optional).", where: "CMS (SaaS)", owner: "Vendor-managed (LM defines steps and reviewers)", time: "Human time", notes: "Decisions recorded in the Change Log." },
  { step: 4, what: "Publish now, or scheduled publish.", where: "CMS (SaaS)", owner: "Vendor-managed", time: "Immediate", notes: "" },
  { step: 5, what: "CMS synchronizes the published version to Optimizely Graph (event-driven indexing).", where: "CMS (SaaS) → Graph", owner: "Vendor-managed", time: "Seconds (typical; to be confirmed in a joint test)", notes: "Published content only; access rights indexed with the content." },
  { step: 6, what: "Graph invalidates its own cached query responses that included the changed item (cache tags per resolved item).", where: "Optimizely Graph", owner: "Vendor-managed", time: "Seconds, as part of indexing (typical; to be confirmed in a joint test)", notes: "Cache hits are exempt from rate limits." },
  { step: 7, what: "Graph fires a webhook (topic/filter, e.g., status = Published) to LM's endpoint with a shared API key.", where: "Optimizely Graph → LM endpoint", owner: "Vendor-managed (delivery); customer-built (registration)", time: "Seconds (typical; to be confirmed in a joint test)", notes: "Retries on failure; the endpoint must be idempotent." },
  { step: 8, what: "Webhook handler validates the key and identifies affected cache entries (content key → cache tags/URLs).", where: "LM (Next.js route or AWS Lambda)", owner: "Customer-built (documented pattern)", time: "< 1 second (estimate)", notes: "Using content keys as cache tags avoids URL mapping." },
  { step: 9, what: "Revalidate the Next.js data/ISR cache (revalidateTag / revalidatePath).", where: "LM front end", owner: "Customer-built (framework feature)", time: "Milliseconds", notes: "Customer code in LM's own front end (LM hosts and controls it). Uses a framework feature, with no extra Optimizely component in the path." },
  { step: 10, what: "Purge Akamai by cache tag (shared blocks) or URL using the Fast Purge API.", where: "Akamai", owner: "Customer-built call; Akamai-managed propagation", time: "Seconds (per Akamai; to be confirmed in a joint test)", notes: "Cache tags assigned via response header on every page." },
  { step: 11, what: "Next visitor request misses Akamai; Next.js renders, querying Graph (fresh content), and returns HTML.", where: "Akamai → LM front end → Graph", owner: "Customer-built (render); vendor-managed (Graph)", time: "Sub-second render (estimate; depends on LM app)", notes: "Response re-cached at Akamai per TTL." },
  { step: 12, what: "Live page shows the updated content to all visitors.", where: "Akamai edge", owner: "Customer-managed (Akamai edge is LM's CDN)", time: "End-to-end: seconds, excluding approval (estimate)", notes: "" },
];

const ERD = [
  { n: 1, entity: "Application (site)", attrs: "key, name, hostnames, start page, root, locales, preview settings", rel: "1 Application → many Content items (under its root); shares 'For All Applications' folders", retrieval: "Front ends query Graph scoped to their application; hostnames drive URL resolution.", related: ["Content item", "Folder"] },
  { n: 2, entity: "Content Type", attrs: "key, baseType (_page, _experience, _section, _component, _image/_video/_media, _folder), displayName, mayContainTypes, compositionBehaviors", rel: "1 Content Type → many Property Definitions; 1 Content Type → many Content items", retrieval: "Becomes a GraphQL type in Graph (e.g., Disclosure { ... }); _folder is not delivered.", related: ["Property Definition", "Content item"] },
  { n: 3, entity: "Property Definition", attrs: "key, type, required (isRequired), validation (pattern, min/max, enum, min/maxItems), localized, group, allowedTypes/restrictedTypes", rel: "Many → 1 Content Type", retrieval: "Defines queryable/filterable fields; required rules are enforced at publish.", related: ["Content Type"] },
  { n: 4, entity: "Content item", attrs: "key (GUID), content type, container/parent, owner folder, created by/date", rel: "1 Content item → many Content Versions; belongs to 1 parent (tree)", retrieval: "Retrieved by key, type, field values or URL (pages only).", related: ["Content Type", "Content Version (per locale)", "Application (site)", "Reference", "Folder", "Taxonomy term (categories)", "Change Log entry"] },
  { n: 5, entity: "Content Version (per locale)", attrs: "version id, locale, status (Draft, Ready to Publish, In Review, Rejected, Scheduled, Published, Previously Published), property values, composition (experiences/sections), changed by/date, published date, stop-publish (expiry)", rel: "Many → 1 Content item; 1 Version → many References", retrieval: "Public Graph key returns only the current Published version (non-expired). Preview token/HMAC can read drafts.", related: ["Content item", "Reference", "Approval (instance)", "Graph document (delivery index)", "Asset"] },
  { n: 6, entity: "Reference", attrs: "from version + property → target content key (content = inline properties; contentReference = key + URL; arrays/content areas)", rel: "Many-to-many between Content Versions and Content items (shared blocks, pages, assets)", retrieval: "Referenced items are inlined into the parent's Graph document at index time; editing a shared item re-indexes and invalidates the parents' cached queries.", related: ["Content Version (per locale)", "Content item", "Asset"] },
  { n: 7, entity: "Asset", attrs: "Content item with base type _image / _video / _media; metadata (size, MIME type, URL); or DAM asset reference", rel: "Referenced by Content Versions; stored in Asset folders", retrieval: "Delivered as URLs via Graph (_assetMetadata); served from CDN.", related: ["Content Version (per locale)", "Folder", "Reference"] },
  { n: 8, entity: "Folder", attrs: "Global ('For All Applications'), application ('For This Application'), local ('For This Page')", rel: "Contains Content items/Assets; carries access rights and approval sequences", retrieval: "Determines sharing scope and who can edit; local items are delivered with their page.", related: ["Content item", "Asset", "Access Control List", "Approval Sequence (definition)", "Application (site)"] },
  { n: 9, entity: "Approval Sequence (definition)", attrs: "steps, reviewers (users/groups), prevent self-approval, inheritance", rel: "Set on a page node or asset folder; inherited by children", retrieval: "Gates publishing; nothing reaches Graph until approved and published.", related: ["Folder", "Approval (instance)"] },
  { n: 10, entity: "Approval (instance)", attrs: "content version, current step, decisions, comments, timestamps", rel: "1 per Content Version in review", retrieval: "Recorded in the Change Log (Approval category).", related: ["Content Version (per locale)", "Approval Sequence (definition)", "Change Log entry"] },
  { n: 11, entity: "Access Control List", attrs: "user/group → Read, Create, Change, Delete, Publish, Administer; per language permissions", rel: "Attached to tree nodes/folders; inherited", retrieval: "Indexed into Graph; restricted items returned only to authenticated requests (HMAC/OIDC + roles).", related: ["Folder", "Graph document (delivery index)"] },
  { n: 12, entity: "Taxonomy term (categories)", attrs: "key, display name, parent (hierarchical)", rel: "Many-to-many with Content items", retrieval: "Filterable/faceted in Graph.", related: ["Content item"] },
  { n: 13, entity: "Change Log entry", attrs: "date, category (content, content type, access rights, approval, project), action, user", rel: "References Content item / type", retrieval: "Audit only; not delivered.", related: ["Content item", "Content Type", "Approval (instance)"] },
  { n: 14, entity: "Graph document (delivery index)", attrs: "_metadata (key, version, locale, status, url, types, published, lastModified), fields, inlined references, ACL", rel: "1 per published Content Version per locale", retrieval: "The retrieval layer for all channels; supports filters, full-text, semantic ranking, facets and webhooks.", related: ["Content Version (per locale)", "Access Control List", "Reference"] },
];

/* ------------------------------------------------------------------
   Ownership and layout
------------------------------------------------------------------- */
const OWN = { 1: "vendor", 2: "shared", 3: "vendor", 4: "vendor", 5: "vendor", 6: "vendor", 7: "shared", 8: "customer", 9: "customer", 10: "customer", 11: "shared", 12: "customer" };
const OWN_META = {
  vendor: { label: "Vendor-managed (Optimizely)", fill: "#dbeafe", stroke: "#2b6cb0", chip: "bg-blue-100 text-blue-800 border-blue-300" },
  customer: { label: "Customer-built / managed (LM)", fill: "#ffedd5", stroke: "#c27a1a", chip: "bg-orange-100 text-orange-800 border-orange-300" },
  shared: { label: "Shared: vendor and customer parts", fill: "#ede9fe", stroke: "#7a4fb0", chip: "bg-purple-100 text-purple-800 border-purple-300" },
};
const PHASES = [
  { name: "Author and approve", steps: [1, 2, 3, 4] },
  { name: "Index and notify", steps: [5, 6, 7] },
  { name: "Refresh caches", steps: [8, 9, 10] },
  { name: "Serve", steps: [11, 12] },
];
const SHORT = {
  1: ["Author edits", "(autosaves a draft)"],
  2: ["Author previews draft", "in LM's front end"],
  3: ["'Ready for Review' and", "approval (optional)"],
  4: ["Publish now, or", "scheduled publish"],
  5: ["CMS syncs published", "version to Graph"],
  6: ["Graph invalidates its", "cached responses"],
  7: ["Graph fires webhook", "to LM endpoint"],
  8: ["Handler validates key,", "finds affected entries"],
  9: ["Revalidate Next.js", "data / ISR cache"],
  10: ["Purge Akamai by", "cache tag or URL"],
  11: ["Akamai miss: Next.js", "renders from Graph"],
  12: ["Live page shows", "updated content"],
};
const TIME_SHORT = { 1: "Real time", 2: "Real time", 3: "Human time", 4: "Immediate", 5: "Seconds*", 6: "Seconds*", 7: "Seconds*", 8: "< 1 s (est.)", 9: "Milliseconds", 10: "Seconds*", 11: "Sub-second (est.)", 12: "Seconds end to end (est.)" };
const LANE_OF = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1, 9: 1, 10: 2, 11: 1, 12: 2 };
const LANES = ["Optimizely: CMS (SaaS) and Graph", "LM: front end and webhook handler", "Akamai edge (LM's CDN)"];

const GROUPS = {
  model: { label: "Content model and storage", fill: "#e6f0ff", stroke: "#2b6cb0", chip: "bg-blue-50 text-blue-800 border-blue-300" },
  version: { label: "Versions and references", fill: "#e7f6e7", stroke: "#2f855a", chip: "bg-green-50 text-green-800 border-green-300" },
  gov: { label: "Governance and audit", fill: "#fff1d6", stroke: "#b7791f", chip: "bg-amber-50 text-amber-800 border-amber-300" },
  delivery: { label: "Delivery (Graph)", fill: "#fde2e2", stroke: "#c53030", chip: "bg-red-50 text-red-800 border-red-300" },
};
const BW = 208, BH = 104, HUBW = 512;
const ENT = {
  "Property Definition": { x: 140, y: 80, g: "model", t: ["Property Definition"], s: ["fields: type, required,", "validation"] },
  "Content Type": { x: 140, y: 304, g: "model", t: ["Content Type"], s: ["becomes a GraphQL type"] },
  "Reference": { x: 140, y: 528, g: "version", t: ["Reference"], s: ["shared block / page /", "asset link"] },
  "Asset": { x: 140, y: 752, g: "model", t: ["Asset"], s: ["content item: image,", "video, media"] },
  "Application (site)": { x: 444, y: 80, g: "model", t: ["Application (site)"], s: ["hostnames, root, start page"] },
  "Content item": { x: 596, y: 304, w: HUBW, g: "model", t: ["Content item"], s: ["the unit editors manage; retrieved by key,", "type, field value or URL (pages only)"] },
  "Content Version (per locale)": { x: 444, y: 528, g: "version", t: ["Content Version", "(per locale)"], s: ["public key sees Published only"] },
  "Graph document (delivery index)": { x: 444, y: 752, g: "delivery", t: ["Graph document", "(delivery index)"], s: ["retrieval layer, all channels"] },
  "Taxonomy term (categories)": { x: 748, y: 80, g: "model", t: ["Taxonomy term", "(categories)"], s: ["filterable and faceted"] },
  "Approval (instance)": { x: 748, y: 528, g: "gov", t: ["Approval (instance)"], s: ["one per version in review"] },
  "Change Log entry": { x: 748, y: 752, g: "gov", t: ["Change Log entry"], s: ["audit only, not delivered"] },
  "Access Control List": { x: 1052, y: 80, g: "gov", t: ["Access Control List"], s: ["indexed: restricted items", "need auth"] },
  "Folder": { x: 1052, y: 304, g: "model", t: ["Folder"], s: ["global, application or local"] },
  "Approval Sequence (definition)": { x: 1052, y: 528, g: "gov", t: ["Approval Sequence", "(definition)"], s: ["steps and reviewers;", "gates publish"] },
};
const EDGES = [
  { a: "Property Definition", b: "Content Type", p: [[140, 132], [140, 252]], ca: "N", cb: "1", v: "defines fields" },
  { a: "Content Type", b: "Content item", p: [[244, 304], [340, 304]], ca: "1", cb: "N", v: "typed as" },
  { a: "Application (site)", b: "Content item", p: [[444, 132], [444, 252]], ca: "1", cb: "N", v: "owns" },
  { a: "Taxonomy term (categories)", b: "Content item", p: [[748, 132], [748, 252]], ca: "N", cb: "N", v: "tags" },
  { a: "Folder", b: "Content item", p: [[948, 304], [852, 304]], ca: "1", cb: "N", v: "contains" },
  { a: "Access Control List", b: "Folder", p: [[1052, 132], [1052, 252]], ca: "N", cb: "1", v: "secures" },
  { a: "Folder", b: "Approval Sequence (definition)", p: [[1052, 356], [1052, 476]], ca: "1", cb: "0..1", v: "set on" },
  { a: "Approval Sequence (definition)", b: "Approval (instance)", p: [[948, 528], [852, 528]], ca: "1", cb: "N", v: "runs as" },
  { a: "Approval (instance)", b: "Content Version (per locale)", p: [[644, 528], [548, 528]], ca: "0..1", cb: "1", v: "reviews" },
  { a: "Content item", b: "Content Version (per locale)", p: [[444, 356], [444, 476]], ca: "1", cb: "N", v: "has versions" },
  { a: "Reference", b: "Content Version (per locale)", p: [[244, 528], [340, 528]], ca: "N", cb: "1", v: "from" },
  { a: "Reference", b: "Content item", p: [[140, 476], [140, 416], [380, 416], [380, 356]], ca: "N", cb: "1", v: "points to" },
  { a: "Asset", b: "Reference", p: [[140, 700], [140, 580]], ca: "1", cb: "N", v: "media target" },
  { a: "Content Version (per locale)", b: "Graph document (delivery index)", p: [[444, 580], [444, 700]], ca: "1", cb: "0..1", v: "indexed as" },
  { a: "Approval (instance)", b: "Change Log entry", p: [[748, 580], [748, 700]], ca: "1", cb: "N", v: "logged in" },
];
const COVERAGE = [
  { ask: "Content types", ents: ["Content Type", "Property Definition"] },
  { ask: "Entries", ents: ["Content item"] },
  { ask: "Shared references", ents: ["Reference"] },
  { ask: "Assets", ents: ["Asset"] },
  { ask: "Versions", ents: ["Content Version (per locale)"] },
  { ask: "Workflow states", ents: ["Content Version (per locale)", "Approval Sequence (definition)", "Approval (instance)"] },
  { ask: "Retrieval", ents: ["Graph document (delivery index)"] },
];

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
function downloadCSV(filename, headers, rows) {
  const esc = (v) => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
  const csv = [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const matches = (q, ...fields) => !q || fields.join(" ").toLowerCase().includes(q.toLowerCase());

function Chip({ active, onClick, className = "", children }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-3 py-1 rounded-full border text-xs font-medium transition " +
        className + (active ? " ring-2 ring-offset-1 ring-slate-500" : " opacity-90 hover:opacity-100")
      }
    >
      {children}
    </button>
  );
}
function OwnerBadge({ step }) {
  const m = OWN_META[OWN[step]];
  return <span className={"inline-block px-2 py-0.5 rounded-full border text-[11px] font-semibold " + m.chip}>{m.label}</span>;
}
function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={"px-3 py-1.5 text-sm rounded-md transition " + (value === o.value ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-100")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Data flow diagram
------------------------------------------------------------------- */
function FlowDiagram({ selected, onSelect, ownerFilter, phaseSteps }) {
  const laneX = [20, 420, 820];
  const box = (s) => ({ x: laneX[LANE_OF[s]] + 20, y: 70 + (s - 1) * 74, w: 320, h: 60 });
  const dim = (s) => (ownerFilter && OWN[s] !== ownerFilter) || (phaseSteps && !phaseSteps.includes(s));
  const arrows = [];
  for (let s = 1; s < 12; s++) {
    const A = box(s), B = box(s + 1);
    let d;
    if (LANE_OF[s] === LANE_OF[s + 1]) d = `M ${A.x + 160} ${A.y + A.h} L ${B.x + 160} ${B.y - 2}`;
    else if (B.x > A.x) d = `M ${A.x + A.w} ${A.y + 30} L ${B.x - 2} ${B.y + 30}`;
    else d = `M ${A.x} ${A.y + 30} L ${B.x + B.w + 2} ${B.y + 30}`;
    const active = selected === s || selected === s + 1;
    arrows.push(<path key={s} d={d} stroke={active ? "#1e293b" : "#64748b"} strokeWidth={active ? 2.6 : 1.6} fill="none" markerEnd="url(#arrow)" opacity={dim(s) && dim(s + 1) ? 0.25 : 1} />);
  }
  return (
    <svg viewBox="0 0 1200 980" className="w-full h-auto select-none" role="img" aria-label="Data flow diagram">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
        </marker>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.35" />
        </filter>
      </defs>
      {LANES.map((n, i) => (
        <g key={n}>
          <rect x={laneX[i]} y={50} width={360} height={914} rx={14} fill="#f8fafc" stroke="#cbd5e1" />
          <text x={laneX[i] + 180} y={34} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0f172a">{n}</text>
        </g>
      ))}
      {arrows}
      {FLOW.map(({ step }) => {
        const b = box(step), m = OWN_META[OWN[step]], sel = selected === step;
        return (
          <g key={step} onClick={() => onSelect(step)} style={{ cursor: "pointer", transition: "opacity .2s" }} opacity={dim(step) ? 0.25 : 1} filter={sel ? "url(#glow)" : undefined}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={10} fill={m.fill} stroke={m.stroke} strokeWidth={sel ? 3.5 : 1.8} />
            <circle cx={b.x + 26} cy={b.y + 30} r={15} fill="white" stroke={m.stroke} strokeWidth={1.8} />
            <text x={b.x + 26} y={b.y + 35} textAnchor="middle" fontSize="14" fontWeight="700" fill={m.stroke}>{step}</text>
            <text x={b.x + 52} y={b.y + 22} fontSize="13" fontWeight="600" fill="#0f172a">{SHORT[step][0]}</text>
            <text x={b.x + 52} y={b.y + 38} fontSize="13" fontWeight="600" fill="#0f172a">{SHORT[step][1]}</text>
            <text x={b.x + 52} y={b.y + 54} fontSize="11.5" fontStyle="italic" fill="#475569">{TIME_SHORT[step]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------
   ERD diagram
------------------------------------------------------------------- */
function ErdDiagram({ selected, onSelect, groupFilter, search }) {
  const neighbors = useMemo(() => {
    if (!selected) return null;
    const s = new Set([selected]);
    EDGES.forEach((e) => { if (e.a === selected) s.add(e.b); if (e.b === selected) s.add(e.a); });
    return s;
  }, [selected]);
  const hit = (name) => {
    const row = ERD.find((r) => r.entity === name);
    return matches(search, name, row.attrs, row.rel, row.retrieval);
  };
  const entDim = (name) =>
    (neighbors && !neighbors.has(name)) || (groupFilter && ENT[name].g !== groupFilter) || (search && !hit(name));

  return (
    <svg viewBox="0 0 1180 830" className="w-full h-auto select-none" role="img" aria-label="Entity relationship diagram">
      <defs>
        <filter id="eglow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.35" />
        </filter>
      </defs>
      {EDGES.map((e, i) => {
        const on = selected && (e.a === selected || e.b === selected);
        const off = (selected && !on) || (groupFilter && ENT[e.a].g !== groupFilter && ENT[e.b].g !== groupFilter);
        const pts = e.p;
        const d = "M " + pts.map((q) => q.join(" ")).join(" L ");
        const card = (p0, p1, txt, key) => {
          const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
          const horiz = Math.abs(ux) > Math.abs(uy);
          const x = p0[0] + ux * 20 + (horiz ? 0 : 13), y = p0[1] + uy * 20 + (horiz ? -9 : 4);
          return <text key={key} x={x} y={y} fontSize="13" fontWeight="700" fill="#1f3a5f" textAnchor={horiz ? "middle" : "start"}>{txt}</text>;
        };
        let best = 0, bi = 0;
        for (let k = 0; k < pts.length - 1; k++) {
          const len = Math.abs(pts[k + 1][0] - pts[k][0]) + Math.abs(pts[k + 1][1] - pts[k][1]);
          if (len > best) { best = len; bi = k; }
        }
        const a = pts[bi], b = pts[bi + 1], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const horiz = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]);
        return (
          <g key={i} opacity={off ? 0.15 : 1} style={{ transition: "opacity .2s" }}>
            <path d={d} fill="none" stroke={on ? "#1e3a8a" : "#475569"} strokeWidth={on ? 3.2 : 1.8} strokeLinejoin="round" />
            {card(pts[0], pts[1], e.ca, "a")}
            {card(pts[pts.length - 1], pts[pts.length - 2], e.cb, "b")}
            <text x={horiz ? mx : mx + 12} y={horiz ? my + 18 : my + 4} fontSize="12" fontStyle="italic" fill="#334155" textAnchor={horiz ? "middle" : "start"}>{e.v}</text>
          </g>
        );
      })}
      {Object.entries(ENT).map(([name, d]) => {
        const w = d.w || BW, g = GROUPS[d.g], sel = selected === name;
        const titleY = d.y - (d.t.length > 1 ? 30 : 20);
        const subY = d.y + (d.t.length > 1 ? 18 : 14);
        return (
          <g key={name} onClick={() => onSelect(sel ? null : name)} style={{ cursor: "pointer", transition: "opacity .2s" }} opacity={entDim(name) ? 0.3 : 1} filter={sel ? "url(#eglow)" : undefined}>
            <rect x={d.x - w / 2} y={d.y - BH / 2} width={w} height={BH} rx={12} fill={g.fill} stroke={g.stroke} strokeWidth={sel ? 4 : 2.2} />
            {d.t.map((t, k) => (
              <text key={k} x={d.x} y={titleY + k * 18} textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f172a">{t}</text>
            ))}
            {d.s.map((t, k) => (
              <text key={"s" + k} x={d.x} y={subY + k * 15} textAnchor="middle" fontSize="12" fontStyle="italic" fill="#475569">{t}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------
   Tables
------------------------------------------------------------------- */
function FlowTable({ rows, onPick, selected }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-800 text-white">
          <tr>
            {["Step", "What happens", "Where it happens", "Ownership", "Expected time", "Notes"].map((h) => (
              <th key={h} className="text-left font-semibold px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.step} onClick={() => onPick(r.step)} className={"border-t border-slate-100 cursor-pointer align-top " + (selected === r.step ? "bg-yellow-50" : "hover:bg-slate-50")}>
              <td className="px-3 py-2 font-bold text-slate-700">{r.step}</td>
              <td className="px-3 py-2 min-w-[260px]">{r.what}</td>
              <td className="px-3 py-2 min-w-[150px] text-slate-700">{r.where}</td>
              <td className="px-3 py-2 min-w-[220px]">
                <OwnerBadge step={r.step} />
                <div className="text-xs text-slate-600 mt-1">{r.owner}</div>
              </td>
              <td className="px-3 py-2 min-w-[180px]">{r.time}</td>
              <td className="px-3 py-2 min-w-[220px] text-slate-600">{r.notes || "—"}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">No steps match.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function ErdTable({ rows, onPick, selected }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-800 text-white">
          <tr>
            {["#", "Entity", "Key attributes", "Relationships", "Effect on retrieval", "Related entities"].map((h) => (
              <th key={h} className="text-left font-semibold px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const g = GROUPS[ENT[r.entity].g];
            return (
              <tr key={r.n} onClick={() => onPick(r.entity)} className={"border-t border-slate-100 cursor-pointer align-top " + (selected === r.entity ? "bg-yellow-50" : "hover:bg-slate-50")}>
                <td className="px-3 py-2 font-bold text-slate-700">{r.n}</td>
                <td className="px-3 py-2 min-w-[170px]">
                  <div className="font-semibold">{r.entity}</div>
                  <span className={"inline-block mt-1 px-2 py-0.5 rounded-full border text-[11px] " + g.chip}>{g.label}</span>
                </td>
                <td className="px-3 py-2 min-w-[240px] text-slate-700">{r.attrs}</td>
                <td className="px-3 py-2 min-w-[220px]">{r.rel}</td>
                <td className="px-3 py-2 min-w-[240px]">{r.retrieval}</td>
                <td className="px-3 py-2 min-w-[200px] text-slate-600">{r.related.join(", ")}</td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">No entities match.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------
   Tabs
------------------------------------------------------------------- */
function Overview({ go }) {
  const counts = { vendor: 0, customer: 0, shared: 0 };
  FLOW.forEach((f) => counts[OWN[f.step]]++);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">What Liberty Mutual asked</div>
        <p className="text-slate-800 leading-relaxed">{QUESTION}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Steps from edit to live page" value="12" />
        <Stat label="End-to-end (excluding approval)" value="Seconds" sub="estimate; joint test to confirm" />
        <Stat label="Entities in the data model" value="14" />
        <Stat label="Primary relationships drawn" value={String(EDGES.length)} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Who owns each step</h3>
            <button onClick={() => go("flow")} className="text-sm text-blue-700 hover:underline">Open data flow →</button>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden mb-3">
            {["vendor", "shared", "customer"].map((k) => (
              <div key={k} style={{ width: (counts[k] / 12) * 100 + "%", background: OWN_META[k].stroke }} title={OWN_META[k].label} />
            ))}
          </div>
          <ul className="space-y-1 text-sm">
            {["vendor", "shared", "customer"].map((k) => (
              <li key={k} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ background: OWN_META[k].stroke }} />
                <span className="flex-1">{OWN_META[k].label}</span>
                <span className="font-semibold">{counts[k]} steps</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {PHASES.map((p) => (
              <div key={p.name} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm">
                <div className="font-semibold text-slate-800">{p.name}</div>
                <div className="text-slate-500 text-xs">Steps {p.steps[0]}–{p.steps[p.steps.length - 1]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Where each ERD item is covered</h3>
            <button onClick={() => go("erd")} className="text-sm text-blue-700 hover:underline">Open data model →</button>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {COVERAGE.map((c) => (
                <tr key={c.ask} className="border-t border-slate-100 align-top">
                  <td className="py-2 pr-3 font-medium text-slate-800 whitespace-nowrap">{c.ask}</td>
                  <td className="py-2 flex flex-wrap gap-1">
                    {c.ents.map((e) => (
                      <button key={e} onClick={() => go("erd", e)} className={"px-2 py-0.5 rounded-full border text-xs hover:underline " + GROUPS[ENT[e].g].chip}>{e}</button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-slate-500">* Times marked "typical" or "estimate" are not measured figures. Optimizely proposes confirming them with LM in a joint test.</p>
    </div>
  );
}
function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4">
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

function FlowTab() {
  const [view, setView] = useState("diagram");
  const [selected, setSelected] = useState(1);
  const [owner, setOwner] = useState(null);
  const [phase, setPhase] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setSelected((s) => {
        if (s >= 12) { setPlaying(false); return 12; }
        return s + 1;
      });
    }, 1300);
    return () => clearInterval(t);
  }, [playing]);

  const phaseSteps = phase ? PHASES.find((p) => p.name === phase).steps : null;
  const rows = FLOW.filter((r) => (!owner || OWN[r.step] === owner) && (!phaseSteps || phaseSteps.includes(r.step)) && matches(q, r.what, r.where, r.owner, r.time, r.notes));
  const cur = FLOW.find((f) => f.step === selected);
  const curPhase = PHASES.find((p) => p.steps.includes(selected));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented value={view} onChange={setView} options={[{ value: "diagram", label: "Diagram" }, { value: "table", label: "Table" }]} />
        <div className="flex flex-wrap gap-2">
          {Object.entries(OWN_META).map(([k, m]) => (
            <Chip key={k} active={owner === k} onClick={() => setOwner(owner === k ? null : k)} className={m.chip}>{m.label}</Chip>
          ))}
        </div>
        <div className="flex-1" />
        {view === "table" && (
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search steps…" className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-56" />
        )}
        <button
          onClick={() => downloadCSV("OP-14 Data Flow.csv", ["Step", "What happens", "Where it happens", "Ownership", "Expected time", "Notes"], FLOW.map((r) => [r.step, r.what, r.where, r.owner, r.time, r.notes]))}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">Phases</span>
        {PHASES.map((p) => (
          <Chip key={p.name} active={phase === p.name} onClick={() => setPhase(phase === p.name ? null : p.name)} className="bg-white text-slate-700 border-slate-300">
            {p.name} · {p.steps[0]}–{p.steps[p.steps.length - 1]}
          </Chip>
        ))}
        {(owner || phase || q) && (
          <button onClick={() => { setOwner(null); setPhase(null); setQ(""); }} className="text-xs text-blue-700 hover:underline ml-1">Clear filters</button>
        )}
      </div>

      {view === "diagram" ? (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-3">
            <FlowDiagram selected={selected} onSelect={(s) => { setPlaying(false); setSelected(s); }} ownerFilter={owner} phaseSteps={phaseSteps} />
            <p className="text-xs text-slate-500 px-2 pb-1">Click a step for details. * Typical; to be confirmed in a joint test. (est.) = estimate. Approval time is excluded from end-to-end.</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 h-fit lg:sticky lg:top-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Step {cur.step} of 12 · {curPhase.name}</div>
              <button
                onClick={() => { if (!playing && selected === 12) setSelected(1); setPlaying(!playing); }}
                className={"px-3 py-1 text-xs rounded-full font-semibold " + (playing ? "bg-rose-600 text-white" : "bg-slate-800 text-white")}
              >
                {playing ? "■ Stop" : "▶ Play flow"}
              </button>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-800 transition-all" style={{ width: (cur.step / 12) * 100 + "%" }} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">{cur.what}</h3>
            <OwnerBadge step={cur.step} />
            <dl className="text-sm space-y-3">
              <Field k="Where it happens" v={cur.where} />
              <Field k="Ownership" v={cur.owner} />
              <Field k="Expected time" v={cur.time} />
              <Field k="Notes" v={cur.notes || "—"} />
            </dl>
            <div className="flex gap-2 pt-1">
              <button disabled={cur.step === 1} onClick={() => { setPlaying(false); setSelected(cur.step - 1); }} className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50">← Previous</button>
              <button disabled={cur.step === 12} onClick={() => { setPlaying(false); setSelected(cur.step + 1); }} className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50">Next →</button>
            </div>
          </div>
        </div>
      ) : (
        <FlowTable rows={rows} selected={selected} onPick={(s) => { setSelected(s); setView("diagram"); }} />
      )}
    </div>
  );
}
function Field({ k, v }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{k}</dt>
      <dd className="text-slate-800 mt-0.5">{v}</dd>
    </div>
  );
}

function ErdTab({ initial }) {
  const [view, setView] = useState("diagram");
  const [selected, setSelected] = useState(initial || "Content item");
  const [group, setGroup] = useState(null);
  const [q, setQ] = useState("");
  useEffect(() => { if (initial) setSelected(initial); }, [initial]);

  const rows = ERD.filter((r) => (!group || ENT[r.entity].g === group) && matches(q, r.entity, r.attrs, r.rel, r.retrieval, r.related.join(" ")));
  const cur = ERD.find((r) => r.entity === selected);
  const drawn = useMemo(() => {
    if (!selected) return [];
    return EDGES.filter((e) => e.a === selected || e.b === selected).map((e) =>
      e.a === selected ? { other: e.b, mine: e.ca, theirs: e.cb, v: e.v } : { other: e.a, mine: e.cb, theirs: e.ca, v: e.v }
    );
  }, [selected]);
  const secondary = useMemo(() => {
    if (!selected) return [];
    const shown = new Set(drawn.map((d) => d.other));
    const rel = new Set(cur ? cur.related : []);
    ERD.forEach((r) => { if (r.related.includes(selected)) rel.add(r.entity); });
    return [...rel].filter((x) => x !== selected && !shown.has(x));
  }, [selected, drawn, cur]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented value={view} onChange={setView} options={[{ value: "diagram", label: "Diagram" }, { value: "table", label: "Table" }]} />
        <div className="flex flex-wrap gap-2">
          {Object.entries(GROUPS).map(([k, g]) => (
            <Chip key={k} active={group === k} onClick={() => setGroup(group === k ? null : k)} className={g.chip}>{g.label}</Chip>
          ))}
        </div>
        <div className="flex-1" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search entities or attributes…" className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-64" />
        <button
          onClick={() => downloadCSV("OP-14 ERD.csv", ["#", "Entity", "Key attributes", "Relationships", "Effect on retrieval", "Related entities"], ERD.map((r) => [r.n, r.entity, r.attrs, r.rel, r.retrieval, r.related.join(", ")]))}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          Export CSV
        </button>
      </div>

      {view === "diagram" ? (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-3">
            <ErdDiagram selected={selected} onSelect={setSelected} groupFilter={group} search={q} />
            <p className="text-xs text-slate-500 px-2 pb-1">Click an entity to highlight its relationships. Primary relationships only. 1 = one, N = many, 0..1 = optional.</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 h-fit lg:sticky lg:top-4 space-y-4">
            {cur ? (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Entity {cur.n} of 14</div>
                    <h3 className="text-lg font-bold text-slate-900">{cur.entity}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:text-slate-800">Clear</button>
                </div>
                <span className={"inline-block px-2 py-0.5 rounded-full border text-[11px] font-semibold " + GROUPS[ENT[cur.entity].g].chip}>{GROUPS[ENT[cur.entity].g].label}</span>
                <dl className="text-sm space-y-3">
                  <Field k="Effect on retrieval" v={cur.retrieval} />
                  <Field k="Key attributes" v={cur.attrs} />
                  <Field k="Relationships" v={cur.rel} />
                </dl>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Drawn relationships</div>
                  <ul className="space-y-1">
                    {drawn.map((d) => (
                      <li key={d.other}>
                        <button onClick={() => setSelected(d.other)} className="w-full text-left text-sm rounded-lg px-2 py-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-200">
                          <span className="font-mono text-xs text-slate-500 mr-1">{d.mine}–{d.theirs}</span>
                          <span className="italic text-slate-600">{d.v}</span>{" "}
                          <span className="font-semibold text-slate-900">{d.other}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {secondary.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Also related (not drawn)</div>
                    <div className="flex flex-wrap gap-1">
                      {secondary.map((s) => (
                        <button key={s} onClick={() => setSelected(s)} className={"px-2 py-0.5 rounded-full border text-xs hover:underline " + GROUPS[ENT[s].g].chip}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-slate-600">
                <h3 className="font-bold text-slate-900 mb-2">Select an entity</h3>
                Click any box in the diagram, or pick a topic Liberty asked about:
                <div className="flex flex-wrap gap-1 mt-3">
                  {COVERAGE.map((c) => (
                    <button key={c.ask} onClick={() => setSelected(c.ents[0])} className="px-2 py-0.5 rounded-full border border-slate-300 text-xs hover:bg-slate-50">{c.ask}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ErdTable rows={rows} selected={selected} onPick={(e) => { setSelected(e); setView("diagram"); }} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   App
------------------------------------------------------------------- */
export default function App() {
  const [tab, setTab] = useState("overview");
  const [erdPick, setErdPick] = useState(null);
  const go = (t, entity) => { setTab(t); if (entity) setErdPick(entity); };
  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "flow", label: "Data flow" },
    { id: "erd", label: "Data model (ERD)" },
  ];
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-xs uppercase tracking-widest text-blue-200 font-semibold">Liberty Mutual RFP · Vendor response</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">OP-14 · Author edit to live page, and example data model</h1>
          <p className="text-slate-300 mt-1 text-sm">Interactive version of the "OP-14 Data Flow" and "OP-14 ERD" sheets</p>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={"px-4 py-2.5 text-sm font-semibold rounded-t-lg transition " + (tab === t.id ? "bg-slate-100 text-slate-900" : "text-slate-200 hover:bg-white/10")}
            >
              {t.label}
            </button>
          ))}
          <div className="flex-1" />
          <button onClick={() => window.print()} className="my-1.5 px-3 text-xs rounded-lg border border-white/30 text-white hover:bg-white/10">Print</button>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {tab === "overview" && <Overview go={go} />}
        {tab === "flow" && <FlowTab />}
        {tab === "erd" && <ErdTab initial={erdPick} />}
      </main>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 text-xs text-slate-500">
        Source: published CMS content in the "OP-14 Data Flow" and "OP-14 ERD" asset folders. Example data model; times marked typical or estimate are not measured.
      </footer>
    </div>
  );
}
