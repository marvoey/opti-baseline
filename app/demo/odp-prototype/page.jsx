'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SCENES } from './_scenes';
import { openChannel, PRESENTER_URL, PRESENTER_WINDOW } from './_sync';
import { BRAND, HRB, Btn, Pill, Frame, Spinner, BrandStyles } from '../_shared/brand';
import { PREFERENCES, PREF_LABEL, EVENT_LABEL, mockMembers, mockProfile, mockEvents } from '@/lib/odpDemo';

/* =====================================================================
   H&R Block · Optimizely Data Platform demo · RFP capabilities 1 and 2
     1. Unified Customer Data & Identity Resolution
     2. Real-Time Audience Segmentation & Activation
   Same shell as app/demo/prototype: this window is the one you screen-share and
   shows only what the audience should see; notes, scene list and status tags live
   in the presenter window (_presenter.jsx), opened with S.

   Data is a HYBRID: scenes 2, 4 and 5 read (and in 5 write) the real ODP tenant through
   /api/demo/odp/* (lib/odp.ts) and fall back to sample data (lib/odpDemo.ts) when ODP is
   unreachable or empty. Scenes 3 and 6 are simulations. All people are synthetic.
   The 44.5M / 25M / 5,000 events-per-sec figures are the RFP's requirements, never claimed as measured.
   ===================================================================== */

/* ---------------------------- helpers ---------------------------- */
/** Fetches JSON from our own API; on any failure uses `fallback()` (marked source: 'mock'). */
function useJson(url, fallback) {
  const [res, setRes] = useState({ url: null, data: null, source: null });
  const fb = useRef(fallback);
  useEffect(() => { fb.current = fallback; });
  useEffect(() => {
    if (!url) return undefined;
    let alive = true;
    fetch(url, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => { if (alive) setRes({ url, data: d, source: d.source || 'mock' }); })
      .catch(() => { if (alive) setRes({ url, data: fb.current(), source: 'mock' }); });
    return () => { alive = false; };
  }, [url]);
  if (!url) return { loading: false, data: null, source: null };
  // While a new url is loading, keep showing the previous result (loading: true).
  return { loading: res.url !== url, data: res.data, source: res.source };
}

const fmtTime = (ts) => new Date(ts * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function SourcePill({ loading, source }) {
  if (loading) return <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Spinner /> loading</span>;
  if (source === 'live') return <Pill cls="bg-green-100 text-green-800">● Live from ODP</Pill>;
  if (source === 'mock') return <Pill cls="bg-amber-100 text-amber-800">Sample data</Pill>;
  return null;
}

const PrefBadge = ({ pref }) => {
  const cls = { tax_pro: 'bg-blue-100 text-blue-800', diy: 'bg-green-100 text-green-800', undecided: 'bg-amber-100 text-amber-800', researching: 'bg-slate-100 text-slate-700' }[pref] || 'bg-slate-100 text-slate-700';
  return <Pill cls={cls}>{PREF_LABEL[pref] || pref}</Pill>;
};

const Stat = ({ label, value }) => (
  <div className="flex justify-between border-b border-slate-100 py-1.5 text-sm last:border-0"><span className="text-slate-500">{label}</span><b>{value}</b></div>
);

function EventRow({ e, isNew }) {
  const click = e.type === 'hrblock';
  return (
    <li className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${isNew ? 'bg-green-50 ring-2 ring-green-200' : ''}`}>
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${click ? 'bg-green-600' : 'bg-slate-300'}`} />
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{EVENT_LABEL[e.action] || e.action}{isNew && <span className="ml-2 text-xs font-bold text-green-700">NEW</span>}</div>
        <div className="truncate text-xs text-slate-500">{e.page || '/'} · {e.title}</div>
      </div>
      <div className="shrink-0 text-xs text-slate-500">{fmtTime(e.ts)}</div>
    </li>
  );
}

/* ---------------------------- Scene 1: RFP framing ---------------------------- */
function S1() {
  const [slide, setSlide] = useState(0);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl hrb-dark hrb-motif px-10 py-12 text-white shadow-lg">
        {slide === 0 && (
          <div className="space-y-8">
            <div>
              <div className="text-sm uppercase tracking-widest text-green-200">{BRAND} · Integrated marketing RFP · Capability 1</div>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight">Unified customer data and identity resolution</h1>
              <p className="mt-2 max-w-3xl text-green-100">A single, durable client view built from first-party signals across every interaction, enabling accurate identity resolution and audience deduplication at enterprise scale.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['44.5M customer profiles in the data foundation', 'Your RFP', false],
                ['25M engageable profiles per tax season', 'Your RFP', false],
                ['≈ 56% of profiles engageable in a season', 'Our arithmetic: 25 ÷ 44.5 = 0.56', true],
              ].map(([q, src, ours]) => (
                <div key={q} className={`rounded-xl p-5 ${ours ? 'border border-dashed border-green-200 bg-white/5' : 'bg-white/10'}`}>
                  <div className="text-xl font-bold leading-snug">{q}</div>
                  <div className={`mt-3 text-xs font-semibold uppercase tracking-wider ${ours ? 'text-amber-200' : 'text-green-200'}`}>{src}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {slide === 1 && (
          <div className="space-y-8">
            <div>
              <div className="text-sm uppercase tracking-widest text-green-200">{BRAND} · Integrated marketing RFP · Capability 2</div>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight">Real-time audience segmentation and activation</h1>
              <p className="mt-2 max-w-3xl text-green-100">Dynamic audience construction and instant cross-channel activation, ensuring marketing reaches the right segments at the right moment.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['5,000 real-time events per second at peak', 'Your RFP', false],
                ['≈ 300,000 events a minute at peak', 'Our arithmetic: 5,000 × 60', true],
                ['The right segment at the right moment', 'Your RFP', false],
              ].map(([q, src, ours]) => (
                <div key={q} className={`rounded-xl p-5 ${ours ? 'border border-dashed border-green-200 bg-white/5' : 'bg-white/10'}`}>
                  <div className="text-xl font-bold leading-snug">{q}</div>
                  <div className={`mt-3 text-xs font-semibold uppercase tracking-wider ${ours ? 'text-amber-200' : 'text-green-200'}`}>{src}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 space-y-1 text-xs text-green-200">
          <div>Figures: {BRAND} RFP deck, “Integrated Marketing Scale &amp; Requirements” (“Operating scale for RFP partner capacity assessment”). They are your requirements, not results we have measured.</div>
          <div>The demo that follows runs on a small synthetic dataset of about 200 profiles in a real Optimizely Data Platform tenant, not on {BRAND} data.</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Btn kind="ghost" onClick={() => setSlide(0)} disabled={slide === 0}>‹ Slide</Btn>
        {[0, 1].map((i) => <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} className={`h-2.5 w-2.5 rounded-full ${slide === i ? 'bg-green-700' : 'bg-slate-300'}`} />)}
        <Btn kind="ghost" onClick={() => setSlide(1)} disabled={slide === 1}>Slide ›</Btn>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 2: unified profile ---------------------------- */
function S2({ reportSource }) {
  const seg = useJson('/api/demo/odp/segment?pref=all', () => ({ source: 'mock', members: mockMembers('all') }));
  const samples = useMemo(() => {
    const all = seg.data?.members ?? [];
    return PREFERENCES.flatMap((p) => all.filter((m) => m.preference === p).slice(0, 2));
  }, [seg.data]);
  const [picked, setPicked] = useState(null);
  const email = picked ?? samples[0]?.email ?? null;

  const prof = useJson(email ? `/api/demo/odp/profile?email=${encodeURIComponent(email)}` : null, () => {
    const p = mockProfile(email);
    return p ? { source: 'mock', profile: p, events: mockEvents(p) } : null;
  });
  useEffect(() => { if (prof.source) reportSource(prof.source); else if (seg.source) reportSource(seg.source); }, [prof.source, seg.source, reportSource]);

  const p = prof.data?.profile;
  const events = prof.data?.events ?? [];
  return (
    <Frame url={`odp.optimizely.com/customers/${email ?? ''}`} label="Optimizely Data Platform · customer profile" accent="bg-emerald-50">
      <div className="grid gap-4 p-4 text-sm lg:grid-cols-[220px_1fr_1.2fr]">
        <div>
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-slate-500">CLIENTS</span><SourcePill loading={seg.loading} source={seg.source} /></div>
          <ul className="space-y-1">
            {samples.map((m) => (
              <li key={m.email}>
                <button onClick={() => setPicked(m.email)} className={`w-full rounded-lg border px-3 py-2 text-left transition ${m.email === email ? 'border-green-600 bg-green-50' : 'border-slate-200 bg-white hover:border-green-600'}`}>
                  <div className="font-semibold">{m.firstName} {m.lastName}</div>
                  <div className="text-xs text-slate-500">{PREF_LABEL[m.preference]}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          {p ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: HRB.green }}>{(p.firstName[0] || '') + (p.lastName[0] || '')}</div>
                <div>
                  <div className="text-lg font-bold">{p.firstName} {p.lastName}</div>
                  <div className="text-xs text-slate-500">{p.email}</div>
                  <div className="text-xs text-slate-500">{p.city}, {p.state}</div>
                </div>
              </div>
              <div className="mt-3"><PrefBadge pref={p.preference} /></div>
              <div className="mt-3">
                <div className="mb-1 text-xs font-bold text-slate-500">DERIVED FROM THEIR EVENTS</div>
                <Stat label="Appointment CTA clicks" value={p.apptClicks} />
                <Stat label="DIY start clicks" value={p.diyClicks} />
                <Stat label="Pages viewed" value={p.pagesViewed} />
                <Stat label="Last site event" value={EVENT_LABEL[p.lastEvent] || (p.lastEvent === 'pageview' ? 'Viewed page' : p.lastEvent || '–')} />
              </div>
            </>
          ) : <div className="text-slate-500">{prof.loading ? <Spinner /> : 'Pick a client.'}</div>}
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-slate-500">EVENT TIMELINE · {events.length} events</span><SourcePill loading={prof.loading} source={prof.source} /></div>
          <ul className="max-h-[22rem] space-y-0.5 overflow-y-auto">
            {[...events].sort((a, b) => b.ts - a.ts).map((e, i) => <EventRow key={`${e.ts}-${e.action}-${i}`} e={e} />)}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">Synthetic clients. One profile per person: every page view and click lands here, and the attributes on the left are computed from the timeline on the right.</div>
    </Frame>
  );
}

/* ---------------------------- Scene 3: identity resolution (simulated) ---------------------------- */
const RAW = [
  { id: 'r1', who: 'dana', channel: 'Web visitor', icon: '🌐', key: 'vuid 7f3a…c21', detail: '6 page views, clicked “Keep filing on my own”' },
  { id: 'r2', who: 'dana', channel: 'Email subscriber', icon: '✉️', key: 'dana.rivera@example.com', detail: 'Opened 3 reminder emails' },
  { id: 'r3', who: 'dana', channel: 'Office appointment', icon: '📍', key: 'phone ending 0142', detail: 'Booked Overland Park, Apr 9' },
  { id: 'r4', who: 'marcus', channel: 'Web visitor', icon: '🌐', key: 'vuid 91bd…e07', detail: '3 page views on /file-online' },
  { id: 'r5', who: 'marcus', channel: 'Email subscriber', icon: '✉️', key: 'marcus.lee@example.com', detail: 'Clicked “Still time to file”' },
  { id: 'r6', who: 'priya', channel: 'Web visitor', icon: '🌐', key: 'vuid c04e…19a', detail: '5 page views, clicked “Work with a pro”' },
  { id: 'r7', who: 'priya', channel: 'Office appointment', icon: '📍', key: 'priya.n@example.com', detail: 'Booked Austin, Apr 11' },
];
const CLIENTS = { dana: 'Dana Rivera', marcus: 'Marcus Lee', priya: 'Priya Nair' };

function S3() {
  const [phase, setPhase] = useState('raw'); // raw | resolving | resolved
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const resolve = () => { setPhase('resolving'); timer.current = setTimeout(() => setPhase('resolved'), 1400); };
  return (
    <Frame url="odp.optimizely.com/identity-resolution" label="Optimizely Data Platform · identity resolution" accent="bg-emerald-50">
      <div className="space-y-4 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Pill cls="bg-amber-100 text-amber-800">Simulated · illustrative records</Pill>
          <Btn onClick={resolve} disabled={phase !== 'raw'}>{phase === 'resolving' ? 'Resolving…' : 'Resolve identities'}</Btn>
          {phase === 'resolving' && <Spinner />}
          {phase !== 'raw' && <Btn kind="ghost" onClick={() => setPhase('raw')} disabled={phase === 'resolving'}>Start over</Btn>}
        </div>

        {phase !== 'resolved' ? (
          <div className="grid gap-2 md:grid-cols-2">
            {RAW.map((r) => (
              <div key={r.id} className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-opacity ${phase === 'resolving' ? 'animate-pulse opacity-70' : ''}`}>
                <span className="text-xl">{r.icon}</span>
                <div className="min-w-0"><div className="font-semibold">{r.channel}</div><div className="truncate font-mono text-xs text-slate-500">{r.key}</div><div className="text-xs text-slate-500">{r.detail}</div></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(CLIENTS).map(([k, name]) => (
              <div key={k} className="rounded-xl border-2 border-green-600 bg-green-50 p-4">
                <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: HRB.green }}>{name.split(' ').map((w) => w[0]).join('')}</div><div className="font-bold">{name}</div></div>
                <div className="mt-1 text-xs text-slate-500">1 unified profile · {RAW.filter((r) => r.who === k).length} records merged</div>
                <ul className="mt-2 space-y-1">
                  {RAW.filter((r) => r.who === k).map((r) => <li key={r.id} className="rounded bg-white px-2 py-1 text-xs"><span className="mr-1">{r.icon}</span>{r.channel} · <span className="font-mono text-slate-500">{r.key}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-slate-100 p-4"><div className="text-xs font-bold text-slate-500">AUDIENCE BEFORE RESOLUTION</div><div className="text-3xl font-extrabold">{RAW.length} <span className="text-base font-semibold text-slate-500">records</span></div><div className="text-xs text-slate-500">Each record would be counted, and messaged, separately.</div></div>
          <div className={`rounded-xl p-4 transition-colors ${phase === 'resolved' ? 'bg-green-800 text-white' : 'bg-slate-100'}`}><div className={`text-xs font-bold ${phase === 'resolved' ? 'opacity-80' : 'text-slate-500'}`}>AUDIENCE AFTER RESOLUTION</div><div className="text-3xl font-extrabold">{phase === 'resolved' ? Object.keys(CLIENTS).length : '?'} <span className="text-base font-semibold opacity-80">clients</span></div><div className={`text-xs ${phase === 'resolved' ? 'opacity-80' : 'text-slate-500'}`}>{phase === 'resolved' ? 'Each client counted once, messaged once.' : 'Press Resolve identities.'}</div></div>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">Illustration with synthetic people and made-up identifiers. Identity resolution has not been run on {BRAND} data.</div>
    </Frame>
  );
}

/* ---------------------------- Scene 4: build a segment ---------------------------- */
function S4({ reportSource }) {
  const [pref, setPref] = useState('diy');
  const [minDiy, setMinDiy] = useState(1);
  const seg = useJson(`/api/demo/odp/segment?pref=${pref}`, () => ({ source: 'mock', members: mockMembers(pref) }));
  useEffect(() => { if (seg.source) reportSource(seg.source); }, [seg.source, reportSource]);

  const group = seg.data?.members ?? [];
  const members = group.filter((m) => m.diyClicks >= minDiy);
  const rule = `hrb_filing_preference = "${pref}"  AND  hrb_diy_start_clicks ≥ ${minDiy}`;
  return (
    <Frame url="odp.optimizely.com/segments/new" label="Optimizely Data Platform · segment builder" accent="bg-emerald-50">
      <div className="grid gap-4 p-4 text-sm lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <div>
            <div className="mb-1 text-xs font-bold text-slate-500">FILING PREFERENCE</div>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map((p) => <Btn key={p} kind={pref === p ? 'primary' : 'ghost'} onClick={() => setPref(p)}>{PREF_LABEL[p]}</Btn>)}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-bold text-slate-500">MINIMUM “KEEP FILING ON MY OWN” CLICKS</div>
            <div className="flex gap-2">{[0, 1, 2, 3].map((n) => <Btn key={n} kind={minDiy === n ? 'primary' : 'ghost'} onClick={() => setMinDiy(n)}>{n === 0 ? 'Any' : `${n}+`}</Btn>)}</div>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <div className="text-xs font-bold text-slate-500">RULE</div>
            <code className="mt-1 block break-words text-xs">{rule}</code>
          </div>
          <div className="rounded-xl bg-green-800 p-4 text-white">
            <div className="text-xs opacity-80">Audience size now</div>
            <div className="text-5xl font-extrabold">{seg.loading ? '…' : members.length}</div>
            <div className="text-xs opacity-80">of {group.length} profiles in “{PREF_LABEL[pref]}”</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-slate-500">MEMBERS</span><SourcePill loading={seg.loading} source={seg.source} /></div>
          {members.length === 0 && !seg.loading ? (
            <div className="py-8 text-center text-slate-500">No one matches this rule yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-xs text-slate-500"><th className="py-1">Client</th><th>City</th><th className="text-right">DIY</th><th className="text-right">Pro</th><th className="text-right">Pages</th></tr></thead>
              <tbody>
                {members.slice(0, 8).map((m) => (
                  <tr key={m.email} className="border-b border-slate-100 last:border-0"><td className="py-1.5 font-semibold">{m.firstName} {m.lastName}</td><td className="text-slate-500">{m.city}</td><td className="text-right">{m.diyClicks}</td><td className="text-right">{m.apptClicks}</td><td className="text-right">{m.pagesViewed}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          {members.length > 8 && <div className="mt-2 text-xs text-slate-500">+ {members.length - 8} more</div>}
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">Members are real profiles from the ODP tenant (synthetic people). The rule is evaluated live in this demo on the fields shown.</div>
    </Frame>
  );
}

/* ---------------------------- Scene 5: real-time event ---------------------------- */
const POLL_MS = 3000;
const POLL_TRIES = 10;
const countAction = (events, action) => events.filter((e) => e.action === action).length;

function S5({ reportSource }) {
  const seg = useJson('/api/demo/odp/segment?pref=all', () => ({ source: 'mock', members: mockMembers('all') }));
  const all = useMemo(() => seg.data?.members ?? [], [seg.data]);
  const candidates = useMemo(() => all.filter((m) => m.diyClicks === 0).slice(0, 5), [all]);
  const [picked, setPicked] = useState(null);
  const email = picked ?? candidates[0]?.email ?? null;

  const prof = useJson(email ? `/api/demo/odp/profile?email=${encodeURIComponent(email)}` : null, () => {
    const p = mockProfile(email);
    return p ? { source: 'mock', profile: p, events: mockEvents(p) } : null;
  });
  useEffect(() => { const s = prof.source || seg.source; if (s) reportSource(s); }, [prof.source, seg.source, reportSource]);

  /* Click session for the selected visitor. phase: idle | sending | waiting | arrived | slow.
     timeline = events after the click (null = use the fetched ones). Ignored once another visitor is selected. */
  const IDLE = { email: null, phase: 'idle', timeline: null, latency: null, newKey: null };
  const [sess, setSess] = useState(IDLE);
  const { phase, timeline, latency, newKey } = sess.email === email ? sess : IDLE;
  const patch = (o) => setSess((prev) => ({ ...(prev.email === email ? prev : IDLE), email, ...o }));
  const setPhase = (v) => patch({ phase: v });
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const p = prof.data?.profile;
  const events = timeline ?? prof.data?.events ?? [];
  const baseMembers = all.filter((m) => m.diyClicks > 0).length;
  const entered = phase === 'arrived' && p && p.diyClicks === 0;
  const audience = baseMembers + (entered ? 1 : 0);

  const click = async (eventKey) => {
    if (!email || !p || (phase !== 'idle' && phase !== 'arrived' && phase !== 'slow')) return;
    const current = events;
    const before = countAction(current, eventKey);
    patch({ phase: 'sending', latency: null, newKey: null });
    let sent;
    try {
      const r = await fetch('/api/demo/odp/event', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, eventKey }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      sent = await r.json();
    } catch { sent = { source: 'mock', sentAt: Date.now() }; }
    if (!alive.current) return;
    setPhase('waiting');

    if (sent.source !== 'live') {
      // Sample-data mode: nothing was sent to ODP, so simulate the arrival.
      await sleep(1400);
      if (!alive.current) return;
      const ts = Math.floor(Date.now() / 1000);
      patch({ timeline: [...current, { type: 'hrblock', action: eventKey, ts, page: '/', title: 'H&R Block | Optimizely' }], newKey: `${ts}-${eventKey}`, latency: 1.4, phase: 'arrived' });
      return;
    }
    for (let i = 0; i < POLL_TRIES; i++) {
      await sleep(POLL_MS);
      if (!alive.current) return;
      try {
        const r = await fetch(`/api/demo/odp/profile?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
        const d = r.ok ? await r.json() : null;
        if (d && countAction(d.events, eventKey) > before) {
          const fresh = [...d.events].sort((a, b) => b.ts - a.ts).find((e) => e.action === eventKey);
          patch({ timeline: d.events, newKey: fresh ? `${fresh.ts}-${fresh.action}` : null, latency: (Date.now() - sent.sentAt) / 1000, phase: 'arrived' });
          return;
        }
      } catch { /* keep polling */ }
    }
    if (alive.current) setPhase('slow');
  };

  const busy = phase === 'sending' || phase === 'waiting';
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Frame url="hrblock.optimoey.com" label="The site · visitor" accent="bg-slate-100">
        <div className="space-y-4 p-4 text-sm">
          <div>
            <div className="mb-1 flex items-center justify-between"><span className="text-xs font-bold text-slate-500">WHO IS BROWSING</span><SourcePill loading={seg.loading} source={seg.source} /></div>
            <div className="flex flex-wrap gap-2">
              {candidates.map((m) => <Btn key={m.email} kind={m.email === email ? 'primary' : 'ghost'} onClick={() => setPicked(m.email)} disabled={busy}>{m.firstName} {m.lastName}</Btn>)}
            </div>
          </div>
          <div className="rounded-2xl hrb-dark hrb-motif p-6 text-white">
            <div className="text-xs uppercase tracking-widest text-green-200">Tax season 2027 · Last weeks</div>
            <div className="mt-1 text-2xl font-bold leading-tight">Still time to file. Do it with an expert.</div>
            <p className="mt-1 text-sm text-green-100">Book an appointment with a tax pro today, or finish online.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => click('appointment_cta_click')} disabled={busy || !p} className="rounded-lg px-4 py-2 text-sm font-bold text-slate-900 disabled:opacity-50" style={{ background: HRB.neon }}>Work with a pro</button>
              <button onClick={() => click('diy_start_click')} disabled={busy || !p} className="rounded-lg border border-white/60 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50">Keep filing on my own</button>
            </div>
          </div>
          <div className="text-xs text-slate-500">These are the two buttons on the real home page (<code>data-event-key</code>). Pressing one sends a click event to ODP for the selected visitor.</div>
        </div>
      </Frame>

      <Frame url={`odp.optimizely.com/customers/${email ?? ''}`} label="Optimizely Data Platform" accent="bg-emerald-50">
        <div className="space-y-4 p-4 text-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs font-bold text-slate-500">STATUS</div>
            {phase === 'idle' && <Pill>Waiting for a click</Pill>}
            {phase === 'sending' && <span className="inline-flex items-center gap-2"><Spinner /> Sending event to ODP…</span>}
            {phase === 'waiting' && <span className="inline-flex items-center gap-2"><Spinner /> Event sent · waiting for ODP to process it (asynchronous)…</span>}
            {phase === 'arrived' && <Pill cls="bg-green-100 text-green-800">✓ Event on the profile{latency != null ? ` · ${latency.toFixed(1)} s` : ''}</Pill>}
            {phase === 'slow' && <Pill cls="bg-amber-100 text-amber-800">Event sent · ODP is still processing it</Pill>}
          </div>

          <div className={`rounded-xl border-2 p-4 transition-colors ${entered ? 'border-green-600 bg-green-50' : 'border-slate-200'}`}>
            <div className="text-xs font-bold text-slate-500">AUDIENCE · STARTED FILING ON THEIR OWN (≥ 1 diy_start_click)</div>
            <div className="mt-1 flex items-end gap-3"><div className="text-4xl font-extrabold">{audience}</div><div className="pb-1 text-xs text-slate-500">members{entered ? ' · +1 just now' : ''}</div></div>
            {p && <div className="mt-1 text-xs">{p.firstName} {p.lastName}: {entered ? <b className="text-green-700">entered the audience</b> : p.diyClicks > 0 ? 'already a member' : 'not a member yet'}</div>}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between"><span className="text-xs font-bold text-slate-500">EVENT TIMELINE · {events.length} events</span><SourcePill loading={prof.loading} source={prof.source} /></div>
            <ul className="max-h-60 space-y-0.5 overflow-y-auto">
              {[...events].sort((a, b) => b.ts - a.ts).slice(0, 8).map((e, i) => <EventRow key={`${e.ts}-${e.action}-${i}`} e={e} isNew={`${e.ts}-${e.action}` === newKey} />)}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
          {prof.source === 'live' ? 'The click is a real event written to the ODP tenant. ODP ingests asynchronously, so it can take a moment to appear.' : 'Sample-data mode: no event is sent to ODP; the arrival is simulated.'} The audience rule is evaluated in this demo.
        </div>
      </Frame>
    </div>
  );
}

/* ---------------------------- Scene 6: activation + scale (simulated) ---------------------------- */
const DESTINATIONS = [
  { id: 'site', icon: '🌐', name: 'Site personalization', detail: 'Feature Experimentation audience: hrb_segment = diy_abandoner (see the main demo, Scene 8)' },
  { id: 'email', icon: '✉️', name: 'Email journey', detail: 'Entry trigger: “DIY reminder” journey' },
  { id: 'paid', icon: '📣', name: 'Paid media', detail: 'Hashed audience upload to ad platforms' },
];
const PEAK = 5000;

function S6() {
  const [synced, setSynced] = useState({});
  const [pending, setPending] = useState({});
  const timers = useRef([]);
  const toggle = (id) => {
    if (synced[id]) { setSynced((s) => ({ ...s, [id]: false })); return; }
    setPending((s) => ({ ...s, [id]: true }));
    timers.current.push(setTimeout(() => { setPending((s) => ({ ...s, [id]: false })); setSynced((s) => ({ ...s, [id]: true })); }, 900));
  };

  const [rate, setRate] = useState(0);
  const [running, setRunning] = useState(false);
  const [hist, setHist] = useState(() => Array(40).fill(0));
  const [total, setTotal] = useState(0);
  const tick = useRef(0);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (!running) return undefined;
    tick.current = 0;
    const id = setInterval(() => {
      tick.current += 1;
      const t = tick.current; // 100 ms ticks: ramp up 40, hold 30, ramp down 30
      const base = t <= 40 ? (t / 40) * PEAK : t <= 70 ? PEAK : Math.max(0, ((100 - t) / 30) * PEAK);
      const r = Math.max(0, Math.round(base * (t <= 40 || t > 70 ? 1 : 0.96 + Math.random() * 0.04)));
      setRate(r); setHist((h) => [...h.slice(1), r]); setTotal((x) => x + Math.round(r / 10));
      if (t >= 100) { setRunning(false); setRate(0); }
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Frame url="odp.optimizely.com/segments/diy-starters/activate" label="Optimizely Data Platform · activation" accent="bg-emerald-50">
        <div className="space-y-3 p-4 text-sm">
          <div className="flex flex-wrap items-center gap-2"><Pill cls="bg-amber-100 text-amber-800">Simulated destinations</Pill><span className="text-slate-500">Audience: <b className="text-slate-900">Started filing on their own</b></span></div>
          {DESTINATIONS.map((d) => (
            <div key={d.id} className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${synced[d.id] ? 'border-green-600 bg-green-50' : 'border-slate-200 bg-white'}`}>
              <span className="text-xl">{d.icon}</span>
              <div className="min-w-0 flex-1"><div className="font-semibold">{d.name}</div><div className="text-xs text-slate-500">{d.detail}</div></div>
              {pending[d.id] ? <Spinner /> : synced[d.id] ? <Pill cls="bg-green-100 text-green-800">✓ Synced</Pill> : null}
              <Btn kind={synced[d.id] ? 'ghost' : 'primary'} onClick={() => toggle(d.id)} disabled={pending[d.id]}>{synced[d.id] ? 'Disconnect' : 'Activate'}</Btn>
            </div>
          ))}
          <div className="text-xs text-slate-500">One audience definition, activated across channels. Nothing is sent anywhere in this screen.</div>
        </div>
      </Frame>

      <Frame url="odp.optimizely.com/ingest/throughput" label="Real-time event throughput" accent="bg-emerald-50">
        <div className="space-y-3 p-4 text-sm">
          <div className="flex flex-wrap items-center gap-2"><Pill cls="bg-amber-100 text-amber-800">Simulated · not a load test</Pill><Btn onClick={() => { setTotal(0); setHist(Array(40).fill(0)); setRunning(true); }} disabled={running}>{running ? 'Running…' : 'Simulate peak'}</Btn></div>
          <div className="rounded-xl hrb-dark p-4 text-white">
            <div className="text-xs opacity-80">Events per second</div>
            <div className="text-5xl font-extrabold tabular-nums">{rate.toLocaleString('en-US')}</div>
            <div className="mt-3 flex h-20 items-end gap-0.5">
              {hist.map((v, i) => <div key={i} className="flex-1 rounded-sm" style={{ height: `${Math.max(2, (v / PEAK) * 100)}%`, background: HRB.neon }} />)}
            </div>
            <div className="mt-2 flex justify-between text-xs opacity-80"><span>0</span><span>RFP peak: {PEAK.toLocaleString('en-US')} / sec</span></div>
          </div>
          <div className="text-xs text-slate-500">Events in this run: {total.toLocaleString('en-US')} (illustration). {BRAND}’s RFP sets 5,000 real-time events per second at peak as the requirement; we propose to prove it with a load test in the proof of concept.</div>
        </div>
      </Frame>
    </div>
  );
}

/* ---------------------------- app ---------------------------- */
const clampIdx = (i) => Math.max(0, Math.min(SCENES.length - 1, Number(i) || 0));

export default function App() {
  const [idx, setIdx] = useState(0);
  const [source, setSource] = useState(null); // 'live' | 'mock' | null: whether the last data read came from ODP
  const [resetKey, setResetKey] = useState(0);
  const presenterWin = useRef(null);
  const chan = useRef(null);
  const latest = useRef('');
  const onCommand = useRef(() => {});

  const reportSource = React.useCallback((s) => setSource(s), []);
  const resetAll = () => { setIdx(0); setSource(null); setResetKey((k) => k + 1); };

  /* S opens (or focuses) the presenter window. */
  const openPresenter = () => {
    const w = presenterWin.current;
    if (w && !w.closed) { w.focus(); return; }
    presenterWin.current = window.open(PRESENTER_URL, PRESENTER_WINDOW, 'popup=yes,width=560,height=940');
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || (e.target && e.target.isContentEditable)) return;
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(SCENES.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); openPresenter(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Commands from the presenter window. Reassigned every render so it always sees fresh handlers. */
  useEffect(() => {
    onCommand.current = (m) => {
      if (m.type === 'step') setIdx((i) => clampIdx(i + Number(m.delta || 0)));
      else if (m.type === 'goto') setIdx(clampIdx(m.idx));
      else if (m.type === 'reset') resetAll();
    };
  });

  useEffect(() => {
    const ch = openChannel();
    if (!ch) return undefined;
    chan.current = ch;
    ch.onmessage = (e) => {
      const m = e.data || {};
      if (m.type === 'hello') { if (latest.current) ch.postMessage({ type: 'state', payload: latest.current }); }
      else onCommand.current(m);
    };
    return () => { ch.close(); chan.current = null; };
  }, []);

  const payload = JSON.stringify({ idx, source, resetKey });
  useEffect(() => {
    latest.current = payload;
    chan.current?.postMessage({ type: 'state', payload });
  }, [payload]);

  const s = SCENES[idx];

  const stage = () => {
    switch (s.n) {
      case 1: return <S1 />;
      case 2: return <S2 reportSource={reportSource} />;
      case 3: return <S3 />;
      case 4: return <S4 reportSource={reportSource} />;
      case 5: return <S5 reportSource={reportSource} />;
      default: return <S6 />;
    }
  };

  return (
    <div className="hrb-app flex h-screen flex-col bg-slate-100 font-sans text-slate-900">
      <BrandStyles />
      <header className="hrb-dark px-5 py-3 text-white">
        <div className="text-xs uppercase tracking-widest text-green-200">{BRAND} · Optimizely Data Platform demo</div>
      </header>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-slate-200 bg-white px-5 py-3">
          <div className="text-xs text-slate-500">{s.act}</div>
          <div className="text-lg font-bold">{s.title}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-5" key={`${idx}-${resetKey}`}>
          {stage()}
        </div>
      </main>
    </div>
  );
}
