'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SCENES } from './_scenes';
import { openChannel, PRESENTER_URL, PRESENTER_WINDOW } from './_sync';
import { CSS, Chip, Eyebrow, SectionTitle, DocLink, Callout, Stat, StackedBar, Code, TH, TD, AttrRows } from './_ui';

/* =====================================================================
   H&R Block | Identity resolution + real-time activation demo
   Optimizely Data Platform (ODP) + Optimizely Web Experimentation

   Everything in this app runs in the browser with simulated data.
   It makes NO calls to ODP or Web Experimentation and holds NO API keys.
   The data generator below is a faithful port of
   odp-import-hrblock-profiles.mjs (same PRNG, personas, event model and
   deriveAttributes), so seed 42 / 200 profiles gives the same 1,191 events
   and the same filing-preference mix as the script's --dry-run.
   ===================================================================== */

/* ---------- 1. SITE MODEL (what happens on hrblock.optimoey.com) ---------- */
const SITE_HOST = 'hrblock.optimoey.com';
const EVENT_TYPE = 'hrblock';
const PAGES = {
  '/': 'H&R Block | Optimizely',
  '/still-time-to-file': 'Still time to file | Optimizely',
  '/file-online': 'File online | Optimizely',
  '/tax-pro': 'File with a tax pro | Optimizely',
  '/offices': 'Find an office | Optimizely',
  '/tax-center': 'Tax Center | Optimizely',
};
const CLICK_EVENTS = {
  appointment_cta_click: { page: '/', label: 'Work with a pro' },
  diy_start_click: { page: '/', label: 'Keep filing on my own' },
};
const PERSONAS = [
  { weight: 35, pages: ['/tax-pro', '/offices', '/still-time-to-file'], clicks: { appointment_cta_click: [1, 3], diy_start_click: [0, 0] } },
  { weight: 35, pages: ['/file-online', '/still-time-to-file'], clicks: { appointment_cta_click: [0, 0], diy_start_click: [1, 3] } },
  { weight: 20, pages: ['/file-online', '/tax-pro', '/tax-center'], clicks: { appointment_cta_click: [1, 2], diy_start_click: [1, 2] } },
  { weight: 10, pages: ['/tax-center'], clicks: { appointment_cta_click: [0, 0], diy_start_click: [0, 0] } },
];
const LOCATIONS = [
  { city: 'Kansas City', state: 'MO', timezone: 'America/Chicago' },
  { city: 'Overland Park', state: 'KS', timezone: 'America/Chicago' },
  { city: 'Austin', state: 'TX', timezone: 'America/Chicago' },
];
const FIRST_NAMES = ['Ava', 'Liam', 'Maria', 'Noah', 'Sofia', 'Ethan', 'Isabella', 'Mason', 'Mia', 'Lucas', 'Amelia', 'Carlos', 'Priya', 'Jamal', 'Chen', 'Olivia', 'Diego', 'Hannah', 'Omar', 'Grace'];
const LAST_NAMES = ['Garcia', 'Johnson', 'Nguyen', 'Williams', 'Patel', 'Brown', 'Martinez', 'Davis', 'Kim', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Hernandez', 'Moore', 'Clark', 'Lewis', 'Walker', 'Young', 'Allen'];

/* ---------- 2. DATA GENERATION (port of the import script) ---------- */
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Derive profile attributes FROM events (same logic as deriveAttributes in the script). */
function deriveAttributes(events, batch) {
  const count = (fn) => events.filter(fn).length;
  const appt = count((e) => e.type === EVENT_TYPE && e.action === 'appointment_cta_click');
  const diy = count((e) => e.type === EVENT_TYPE && e.action === 'diy_start_click');
  const views = count((e) => e.type === 'pageview');
  const lastClick = [...events].filter((e) => e.type === EVENT_TYPE).sort((a, b) => b.data.ts - a.data.ts)[0];
  let preference = 'researching';
  if (appt > diy) preference = 'tax_pro';
  else if (diy > appt) preference = 'diy';
  else if (appt > 0) preference = 'undecided';
  return {
    hrb_filing_preference: preference,
    hrb_appointment_cta_clicks: appt,
    hrb_diy_start_clicks: diy,
    hrb_pages_viewed: views,
    hrb_last_site_event: lastClick ? lastClick.action : 'pageview',
    hrb_import_batch: batch,
  };
}

function buildDataset({ count, days, seed, now }) {
  const rand = mulberry32(seed);
  const randInt = (min, max) => min + Math.floor(rand() * (max - min + 1));
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const pickWeighted = (items) => {
    const total = items.reduce((s, i) => s + i.weight, 0);
    let r = rand() * total;
    for (const i of items) {
      if ((r -= i.weight) < 0) return i;
    }
    return items[items.length - 1];
  };
  const runId = 'hrb-import-' + new Date(now * 1000).toISOString().slice(0, 10);
  const pageviewEvent = (email, page, ts) => ({
    type: 'pageview', action: 'view', identifiers: { email },
    data: { ts, hostname: SITE_HOST, page, title: PAGES[page] },
  });
  const buildEvents = (email, persona) => {
    const events = [];
    const sessions = randInt(1, 2);
    const clickPlan = [];
    for (const [action, [min, max]] of Object.entries(persona.clicks)) {
      for (let i = 0, n = randInt(min, max); i < n; i++) clickPlan.push(action);
    }
    const sessionStarts = [];
    for (let s = 0; s < sessions; s++) sessionStarts.push(now - randInt(60, days * 86400));
    sessionStarts.sort((a, b) => a - b);
    const homeTimes = [];
    sessionStarts.forEach((start) => {
      let ts = start;
      const pages = ['/', ...persona.pages.filter(() => rand() < 0.7)];
      pages.forEach((page) => {
        events.push(pageviewEvent(email, page, ts));
        if (page === '/') homeTimes.push(ts);
        ts += randInt(15, 90);
      });
    });
    clickPlan.forEach((action) => {
      const ts = Math.min(now, pick(homeTimes) + randInt(5, 40));
      events.push({
        type: EVENT_TYPE, action, identifiers: { email },
        data: { ts, hostname: SITE_HOST, page: CLICK_EVENTS[action].page, title: PAGES[CLICK_EVENTS[action].page], value: CLICK_EVENTS[action].label },
      });
    });
    return events.sort((a, b) => a.data.ts - b.data.ts);
  };

  const profiles = [];
  let eventCount = 0;
  for (let i = 1; i <= count; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const loc = pick(LOCATIONS);
    const email = (first + '.' + last + '.' + String(i).padStart(4, '0') + '@example.com').toLowerCase();
    const events = buildEvents(email, pickWeighted(PERSONAS));
    eventCount += events.length;
    profiles.push({
      attributes: {
        email, first_name: first, last_name: last,
        city: loc.city, state: loc.state, country: 'US', timezone: loc.timezone,
        ...deriveAttributes(events, runId),
      },
      events,
    });
  }
  return { profiles, eventCount, runId };
}

/* ---------- 3. REAL-TIME AUDIENCE MODEL ---------- */
const ATTR_FIELDS = [
  { id: 'hrb_filing_preference', label: 'HRB Filing Preference', kind: 'string', options: ['tax_pro', 'diy', 'undecided', 'researching'] },
  { id: 'hrb_appointment_cta_clicks', label: 'HRB Appointment CTA Clicks', kind: 'number' },
  { id: 'hrb_diy_start_clicks', label: 'HRB DIY Start Clicks', kind: 'number' },
  { id: 'hrb_pages_viewed', label: 'HRB Pages Viewed', kind: 'number' },
  { id: 'hrb_last_site_event', label: 'HRB Last Site Event', kind: 'string', options: ['appointment_cta_click', 'diy_start_click', 'pageview'] },
  { id: 'state', label: 'State', kind: 'string', options: ['MO', 'KS', 'TX'] },
];
const EVENT_OPTIONS = [
  { key: 'hrblock|appointment_cta_click', type: 'hrblock', action: 'appointment_cta_click', label: 'hrblock \u00b7 appointment_cta_click' },
  { key: 'hrblock|diy_start_click', type: 'hrblock', action: 'diy_start_click', label: 'hrblock \u00b7 diy_start_click' },
  { key: 'pageview|view', type: 'pageview', action: 'view', label: 'pageview \u00b7 view' },
];
const MAX_LOOKBACK_DAYS = 28;

const evGroup = (mode, match, conds) => ({ type: 'event', mode, match, conds });
const atGroup = (mode, match, conds) => ({ type: 'attribute', mode, match, conds });
const evCond = (action, n, days) => ({ type: 'hrblock', action, op: 'atleast', n, days });
const atCond = (field, op, value) => ({ field, op, value });

const AUDIENCES = [
  {
    id: 'hrb_high_intent_pro', name: 'High-intent pro', family: 'events',
    desc: 'Clicked "Work with a pro" at least twice in the last 14 days.',
    groups: [evGroup('include', 'all', [evCond('appointment_cta_click', 2, 14)])],
  },
  {
    id: 'hrb_pro_seekers', name: 'Pro seekers', family: 'events',
    desc: 'Clicked "Work with a pro" and never "Keep filing on my own" in the last 28 days.',
    groups: [
      evGroup('include', 'all', [evCond('appointment_cta_click', 1, 28)]),
      evGroup('exclude', 'any', [evCond('diy_start_click', 1, 28)]),
    ],
  },
  {
    id: 'hrb_diy_starters', name: 'DIY starters', family: 'events',
    desc: 'Clicked "Keep filing on my own" and never "Work with a pro" in the last 28 days.',
    groups: [
      evGroup('include', 'all', [evCond('diy_start_click', 1, 28)]),
      evGroup('exclude', 'any', [evCond('appointment_cta_click', 1, 28)]),
    ],
  },
  {
    id: 'hrb_comparing', name: 'Comparing options', family: 'events',
    desc: 'Clicked both hero CTAs in the last 28 days.',
    groups: [evGroup('include', 'all', [evCond('appointment_cta_click', 1, 28), evCond('diy_start_click', 1, 28)])],
  },
  {
    id: 'hrb_pref_tax_pro', name: 'Preference = tax_pro', family: 'attributes',
    desc: 'Profile attribute hrb_filing_preference is tax_pro (written by the import script).',
    groups: [atGroup('include', 'all', [atCond('hrb_filing_preference', 'is', 'tax_pro')])],
  },
  {
    id: 'hrb_pref_diy', name: 'Preference = diy', family: 'attributes',
    desc: 'Profile attribute hrb_filing_preference is diy.',
    groups: [atGroup('include', 'all', [atCond('hrb_filing_preference', 'is', 'diy')])],
  },
  {
    id: 'hrb_pref_undecided', name: 'Preference = undecided', family: 'attributes',
    desc: 'Profile attribute hrb_filing_preference is undecided.',
    groups: [atGroup('include', 'all', [atCond('hrb_filing_preference', 'is', 'undecided')])],
  },
];
const EVENT_AUDIENCES = AUDIENCES.filter((a) => a.family === 'events');

function evalCond(group, c, profile, now) {
  if (group.type === 'attribute') {
    const v = profile.attributes[c.field];
    if (v === undefined || v === null) return false;
    if (c.op === 'is') return String(v) === String(c.value);
    if (c.op === 'isnot') return String(v) !== String(c.value);
    const nv = Number(v);
    const target = Number(c.value);
    if (c.op === 'eq') return nv === target;
    if (c.op === 'gte') return nv >= target;
    if (c.op === 'lte') return nv <= target;
    return false;
  }
  const since = now - Math.min(MAX_LOOKBACK_DAYS, Number(c.days) || 1) * 86400;
  const n = profile.events.filter((e) => e.type === c.type && e.action === c.action && e.data.ts >= since).length;
  return c.op === 'exactly' ? n === Number(c.n) : n >= Number(c.n);
}
function evalGroup(group, profile, now) {
  if (!group.conds.length) return true;
  const results = group.conds.map((c) => evalCond(group, c, profile, now));
  const matched = group.match === 'all' ? results.every(Boolean) : results.some(Boolean);
  return group.mode === 'include' ? matched : !matched;
}
function inAudience(groups, profile, now) {
  return groups.every((g) => evalGroup(g, profile, now));
}
const cloneGroups = (groups) => JSON.parse(JSON.stringify(groups));

/* ---------- 4. EXPERIENCES (Web Experimentation personalization campaign) ---------- */
const ORIGINAL_COPY = {
  eyebrow: "STARTED ONLINE? YOU DON'T HAVE TO FINISH ALONE",
  h1: 'Get a tax pro on your side, without starting over.',
  body: "A trusted tax pro can check the work you've already done, answer your questions, or take it from here. You'll always know your price before you start.",
  appt: 'Work with a pro', diy: 'Keep filing on my own', emphasis: 'appt', badge: 'pro',
};
const EXPERIENCES = [
  {
    id: 'high_intent', name: 'Book now', audience: 'hrb_high_intent_pro', color: '#003512',
    copy: {
      eyebrow: 'READY WHEN YOU ARE', h1: 'Pick a time with your tax pro.',
      body: "You're one step away. Choose a time that works for you, in person or online. You'll always know your price before you start.",
      appt: 'Make appointment', diy: 'Keep filing on my own', emphasis: 'appt', badge: 'pro',
    },
  },
  {
    id: 'pro', name: 'Pro seekers', audience: 'hrb_pro_seekers', color: '#005D1F',
    copy: {
      eyebrow: 'WORK WITH A TAX PRO', h1: 'Let a trusted tax pro take it from here.',
      body: "Hand it all over, or have a pro check the work you've started. Meet in person or online, and know your price before you start.",
      appt: 'Start with a tax pro', diy: 'Keep filing on my own', emphasis: 'appt', badge: 'pro',
    },
  },
  {
    id: 'diy', name: 'DIY starters', audience: 'hrb_diy_starters', color: '#00E95C',
    copy: {
      eyebrow: 'PICK UP WHERE YOU LEFT OFF', h1: "You're on your way. Keep going.",
      body: 'Continue your return at your own pace, on any device. Add live expert help anytime you want it.',
      appt: 'Add a tax pro', diy: 'Continue my online return', emphasis: 'diy', badge: 'diy',
    },
  },
  {
    id: 'compare', name: 'Comparing options', audience: 'hrb_comparing', color: '#D2FA52',
    copy: {
      eyebrow: 'NOT SURE YET?', h1: 'Compare your options, then choose.',
      body: 'Hand it all to a pro, add live expert help, or keep going on your own. Upgrade anytime.',
      appt: 'Work with a pro', diy: 'Keep filing on my own', emphasis: 'appt', badge: 'support',
    },
  },
];

function hashPct(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return Math.abs(h) % 100;
}

/** What would Web Experimentation do for this profile? (priority order, first match wins, then holdback) */
function decide(profile, now, holdbackPct, seedKey) {
  const memberships = EVENT_AUDIENCES.filter((a) => inAudience(a.groups, profile, now)).map((a) => a.id);
  const winner = EXPERIENCES.find((x) => memberships.includes(x.audience)) || null;
  const holdback = !!winner && hashPct(seedKey) < holdbackPct;
  return { memberships, winner, holdback };
}

/* ---------- 5. IDENTITY SCENARIO (simplified model of documented ODP behaviour) ---------- */
const MARIA = 'maria.garcia@example.com';
const SAM = 'sam.garcia@example.com';
const V_LAP = '4f6e0a8c-3b71-4d52-9a14-0c8e5b2d71a4';
const V_PH = '9b2d7f15-6c48-4e0a-b3d9-1f7a2c5e8d36';
const SCN_BASE_TS = 1794400000;
const SCN_EVENTS = [
  { id: 'e1', when: 'Mon 08:12', device: 'Laptop', type: 'pageview', action: 'view', ids: { vuid: V_LAP }, page: '/' },
  { id: 'e2', when: 'Mon 08:12', device: 'Laptop', type: 'hrblock', action: 'appointment_cta_click', ids: { vuid: V_LAP }, page: '/', value: 'Work with a pro' },
  { id: 'e3', when: 'Mon 08:13', device: 'Laptop', type: 'pageview', action: 'view', ids: { vuid: V_LAP }, page: '/tax-pro' },
  { id: 'e4', when: 'Wed 19:40', device: 'Phone', type: 'pageview', action: 'view', ids: { vuid: V_PH }, page: '/' },
  { id: 'e5', when: 'Wed 19:41', device: 'Phone', type: 'hrblock', action: 'diy_start_click', ids: { vuid: V_PH }, page: '/', value: 'Keep filing on my own' },
  { id: 'e6', when: 'Wed 19:42', device: 'Phone', type: 'pageview', action: 'view', ids: { vuid: V_PH }, page: '/file-online' },
  { id: 'e7', when: 'Wed 19:44', device: 'Phone', type: 'customer', action: 'login', ids: { vuid: V_PH, email: MARIA }, page: '/', value: 'Signs in to MyBlock\u00ae' },
  { id: 'e8', when: 'Thu 07:55', device: 'Laptop', type: 'customer', action: 'login', ids: { vuid: V_LAP, email: MARIA }, page: '/', value: 'Signs in to MyBlock\u00ae' },
  { id: 'e9', when: 'Thu 12:30', device: 'Server', type: 'hrblock', action: 'appointment_cta_click', ids: { email: MARIA }, page: '/', value: 'Work with a pro' },
  { id: 'e10', when: 'Fri 20:05', device: 'Laptop', type: 'customer', action: 'login', ids: { vuid: V_LAP, email: SAM }, page: '/', value: 'Signs in to MyBlock\u00ae' },
  { id: 'e11', when: 'Fri 20:06', device: 'Laptop', type: 'pageview', action: 'view', ids: { vuid: V_LAP, email: SAM }, page: '/file-online' },
];
const scnEvent = (id) => SCN_EVENTS.find((e) => e.id === id);
const scnToOdp = (e) => {
  const idx = SCN_EVENTS.findIndex((x) => x.id === e.id);
  const data = { ts: SCN_BASE_TS + idx * 3600, hostname: SITE_HOST, page: e.page, title: PAGES[e.page] };
  if (e.type === 'hrblock') data.value = e.value;
  return { type: e.type, action: e.action, identifiers: e.ids, data };
};
const SCN_NOW = SCN_BASE_TS + 7 * 86400;
const ids = (...a) => a;
const SCN_STEPS = [
  {
    title: 'Anonymous visit on the laptop',
    text: 'The ODP JavaScript tag sets a first-party cookie (vuid) and sends pageviews and your two data-event-key clicks. ODP has no email yet, so it builds a profile around the vuid alone. This visitor can be personalized on-site but cannot be messaged.',
    docs: 'vuid is ODP\u2019s cookie/device ID. It is a low-confidence identifier and expires after 2 years.',
    newIds: ids('e1', 'e2', 'e3'), unique: 1,
    profiles: [{ key: 'P1', zid: 'z_1a7c04', email: null, vuids: [V_LAP], events: ids('e1', 'e2', 'e3') }],
  },
  {
    title: 'Same person, phone browser',
    text: 'A different browser means a different vuid, so ODP starts a second anonymous profile. Counted naively, one client is now two. This is the double-counting that identity resolution exists to remove.',
    docs: 'Anonymous cookies cannot be linked to each other until a high-confidence identifier shows up.',
    newIds: ids('e4', 'e5', 'e6'), unique: 1,
    profiles: [
      { key: 'P1', zid: 'z_1a7c04', email: null, vuids: [V_LAP], events: ids('e1', 'e2', 'e3') },
      { key: 'P2', zid: 'z_93be51', email: null, vuids: [V_PH], events: ids('e4', 'e5', 'e6') },
    ],
  },
  {
    title: 'Signs in on the phone (email + vuid)',
    text: 'The sign-in event carries an email next to the phone\u2019s vuid. Email is a high-confidence identifier, so ODP attaches it to the phone profile, including the anonymous history that cookie already had. This profile is now known and messageable.',
    docs: 'Email is high-confidence and messaging-enabled by default. When a visitor identifies, their earlier anonymous activity is associated via the tracking cookie.',
    newIds: ids('e7'), unique: 1,
    profiles: [
      { key: 'P1', zid: 'z_1a7c04', email: null, vuids: [V_LAP], events: ids('e1', 'e2', 'e3') },
      { key: 'P2', zid: 'z_93be51', email: MARIA, vuids: [V_PH], events: ids('e4', 'e5', 'e6', 'e7') },
    ],
  },
  {
    title: 'Signs in on the laptop: profiles merge',
    text: 'The laptop sign-in carries the same email plus the laptop vuid. ODP matches the high-confidence email, links the laptop vuid to that profile, and the anonymous laptop history folds in. Two profiles become one, with both devices\u2019 events on a single timeline.',
    docs: 'Matching high-confidence identifiers connect events to existing profiles. ODP merges users when enough information becomes available.',
    newIds: ids('e8'), unique: 1, merged: true,
    profiles: [{ key: 'P2', zid: 'z_93be51', email: MARIA, vuids: [V_PH, V_LAP], events: ids('e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8') }],
  },
  {
    title: 'Server-side import joins by email',
    text: 'Your import script sends events with an email identifier only. They land on the same profile with no cookie involved. This is how offline and back-office signals reach the same client view.',
    docs: 'Any source can contribute: a matching email is enough to connect an event to the existing profile.',
    newIds: ids('e9'), unique: 1,
    profiles: [{ key: 'P2', zid: 'z_93be51', email: MARIA, vuids: [V_PH, V_LAP], events: ids('e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9') }],
  },
  {
    title: 'Edge case: a family member signs in on the shared laptop',
    text: 'A second person uses the same browser and signs in with a different email. The low-confidence laptop vuid moves to the newest high-confidence identity (Sam). Earlier events stay on the profile where they happened, so one person\u2019s history does not leak into another\u2019s.',
    docs: 'Low-confidence identifiers can move between profiles; previous events stay on the original profile. The most recent high-confidence submission inherits the shared cookie.',
    newIds: ids('e10', 'e11'), unique: 2, edge: true,
    profiles: [
      { key: 'P2', zid: 'z_93be51', email: MARIA, vuids: [V_PH], events: ids('e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9') },
      { key: 'P3', zid: 'z_c2d77f', email: SAM, vuids: [V_LAP], events: ids('e10', 'e11') },
    ],
  },
];

/* ---------- 6. SMALL HELPERS ---------- */
const nowSec = () => Math.floor(Date.now() / 1000);
const fmtAgo = (ts, now) => {
  const d = Math.max(0, now - ts);
  if (d < 90) return 'just now';
  if (d < 3600) return Math.round(d / 60) + ' min ago';
  if (d < 86400) return Math.round(d / 3600) + ' h ago';
  return Math.round(d / 86400) + ' d ago';
};
const short = (s) => (s ? s.slice(0, 8) + '\u2026' : '');
const randHex = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const newVuid = () => [randHex(8), randHex(4), '4' + randHex(3), '9' + randHex(3), randHex(12)].join('-');
const PREF_COLORS = { tax_pro: '#005D1F', diy: '#00E95C', undecided: '#D2FA52', researching: '#B9B59C' };
const PREF_LABELS = { tax_pro: 'tax_pro', diy: 'diy', undecided: 'undecided', researching: 'researching' };
const pctOf = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0);


/* =====================================================================
   OVERVIEW
   ===================================================================== */
function FlowBox({ n, title, sub, tone }) {
  const dark = tone === 'dark';
  return (
    <div className={(dark ? 'hb-card-dark' : 'hb-card') + ' flex-1 p-4'} style={{ minWidth: 150 }}>
      <div className="flex items-center gap-2">
        <span className="hb-num" style={dark ? { background: '#00E95C', color: '#003512' } : undefined}>{n}</span>
        <div className={'text-sm font-bold break-words ' + (dark ? 'hb-tx-white' : 'hb-tx-dark')} style={{ minWidth: 0 }}>{title}</div>
      </div>
      <div className={'mt-2 text-sm ' + (dark ? 'hb-tx-sand' : 'hb-tx-muted')}>{sub}</div>
    </div>
  );
}
function Lead({ eyebrow, children }) {
  return (
    <div className="mb-5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <p className="mt-1 max-w-3xl text-base hb-tx-muted">{children}</p>
    </div>
  );
}
const FlowArrow = () => <div className="hidden items-center justify-center hb-tx-green text-2xl lg:flex" aria-hidden="true">{'\u2192'}</div>;

function Overview({ go }) {
  return (
    <div>
      <section className="hb-bg-dark hb-dark-zone">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
          <Eyebrow light>Demo for the RFP capability slide</Eyebrow>
          <h1 className="mt-2 max-w-3xl text-3xl leading-tight hb-tx-white md:text-5xl">From the first click to the right experience, in real time.</h1>
          <p className="mt-4 max-w-3xl text-base hb-tx-sand md:text-lg">
            This walkthrough shows how Optimizely Data Platform (ODP) and Optimizely Web Experimentation deliver two of the seven capabilities on the H&amp;R Block slide, using the simulated events from hrblock.optimoey.com.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Stat light value="44.5M" label="customer profiles in the data foundation" />
            <Stat light value="25M" label={'engageable profiles per tax season \u00b9'} />
            <Stat light value="5,000" label={'real-time events/sec at peak \u00b9'} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="hb-btn hb-btn-neon" onClick={() => go('devices')}>Try the identity lab</button>
            <button type="button" className="hb-btn hb-btn-outline-light" onClick={() => go('visitor')}>See real-time activation</button>
          </div>
          <p className="mt-4 text-xs hb-tx-sand">
            {'\u00b9'} Figures as written on the RFP slide: requirements, not claims about ODP capacity.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <SectionTitle eyebrow="How it fits together" title="One loop: capture, resolve, segment, personalize, measure">
          The two capabilities are one pipeline. Identity resolution decides who the visitor is, real-time audiences decide what they have shown interest in, and Web Experimentation turns that into a different page.
        </SectionTitle>
        <div className="flex flex-col gap-3 lg:flex-row">
          <FlowBox n="1" title="hrblock.optimoey.com" sub="Pageviews plus clicks tagged data-event-key: appointment_cta_click and diy_start_click." />
          <FlowArrow />
          <FlowBox n="2" tone="dark" title="ODP identity resolution" sub="vuid (cookie) and email stitched into one profile. Seeded and live events share it." />
          <FlowArrow />
          <FlowBox n="3" tone="dark" title="ODP real-time audiences" sub="Event and attribute conditions over the last 28 days. New events reach audiences in under 90 seconds." />
          <FlowArrow />
          <FlowBox n="4" title="Web Experimentation" sub={'Real-Time Segments integration fetches the visitor\u2019s audiences (2 second limit) at page activation.'} />
          <FlowArrow />
          <FlowBox n="5" title="Personalized page" sub="One experience per audience, in priority order, with a holdback. Same click events measure the result." />
        </div>
        <p className="mt-3 text-sm hb-tx-muted">The hero CTA clicks do double duty: they are ODP events that build audiences, and Web Experimentation metrics that judge the experiences.</p>
      </section>

      <section className="hb-bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <SectionTitle eyebrow="The two capabilities" title="What the slide asks for, and how it is done" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="hb-card p-6">
              <Eyebrow>Capability 1</Eyebrow>
              <h3 className="mt-1 text-xl hb-tx-dark">Unified Customer Data &amp; Identity Resolution</h3>
              <p className="mt-2 text-sm hb-tx-muted">A single, durable client view built from first-party signals across every interaction, enabling accurate identity resolution and audience deduplication at enterprise scale.</p>
              <ul className="mt-4 list-disc pl-5 text-sm space-y-1">
                <li>ODP JavaScript tag assigns a first-party cookie (vuid) to every visitor.</li>
                <li>Email is high-confidence; vuid is low-confidence and can move between profiles.</li>
                <li>Signing in links both devices to one profile and merges earlier anonymous history.</li>
                <li>Server-side imports join the same profile by email.</li>
              </ul>
              <button type="button" className="hb-btn hb-btn-primary mt-5" onClick={() => go('devices')}>Open identity lab</button>
            </div>
            <div className="hb-card p-6">
              <Eyebrow>Capability 2</Eyebrow>
              <h3 className="mt-1 text-xl hb-tx-dark">Real-Time Audience Segmentation &amp; Activation</h3>
              <p className="mt-2 text-sm hb-tx-muted">Dynamic audience construction and instant cross-channel activation, ensuring marketing reaches the right segments at the right moment.</p>
              <ul className="mt-4 list-disc pl-5 text-sm space-y-1">
                <li>Build real-time audiences from your hrblock events and hrb_* attributes.</li>
                <li>Switch on the Real-Time Segments integration in Web Experimentation.</li>
                <li>Run a personalization campaign: one experience per audience, with a holdback.</li>
                <li>A click updates ODP at once; the next page view picks up the new audience.</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="hb-btn hb-btn-primary" onClick={() => go('audience')}>Build audiences</button>
                <button type="button" className="hb-btn hb-btn-outline" onClick={() => go('visitor')}>Activate on the site</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      
    </div>
  );
}

/* =====================================================================
   IDENTITY LAB
   ===================================================================== */
const DEVICE_TONE = { Laptop: 'sand', Phone: 'outline', Server: 'dark' };

function ProfileCard({ p, step }) {
  const evs = p.events.map(scnEvent).sort((a, b) => SCN_EVENTS.indexOf(a) - SCN_EVENTS.indexOf(b));
  const odpEvs = evs.map((e) => ({ type: e.type, action: e.action, data: { ts: scnToOdp(e).data.ts } }));
  const attrs = deriveAttributes(odpEvs, 'live');
  const audiences = EVENT_AUDIENCES.filter((a) => inAudience(a.groups, { attributes: attrs, events: odpEvs }, SCN_NOW));
  const known = !!p.email;
  return (
    <div className="hb-card p-4" style={{ borderColor: known ? '#005D1F' : '#E4E0CC', borderWidth: 2 }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-bold hb-mono hb-tx-dark">zaius_id {p.zid}</div>
        <Chip tone={known ? 'green' : 'sand'}>{known ? 'Known customer' : 'Anonymous'}</Chip>
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="hb-tx-muted w-14">email</span>
          {p.email ? <><span className="hb-mono break-all">{p.email}</span><Chip tone="neon" title="High-confidence identifier; messaging enabled by default">high confidence</Chip></> : <span className="hb-tx-muted">not known yet, so no messaging</span>}
        </div>
        {p.vuids.map((v) => (
          <div key={v} className="flex flex-wrap items-center gap-2">
            <span className="hb-tx-muted w-14">vuid</span>
            <span className="hb-mono" title={v}>{short(v)}</span>
            <Chip title="Cookie ID set by the ODP JavaScript tag; low-confidence identifier">low confidence</Chip>
            <span className="text-xs hb-tx-muted">{v === V_LAP ? 'laptop browser' : 'phone browser'}</span>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <div className="text-xs font-semibold uppercase tracking-wider hb-tx-muted">Real-time audiences it qualifies for</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {audiences.length ? audiences.map((a) => <Chip key={a.id} tone="green">{a.name}</Chip>) : <span className="text-sm hb-tx-muted">none yet</span>}
        </div>
      </div>
      <div className="mt-3 text-sm">
        <div className="text-xs font-semibold uppercase tracking-wider hb-tx-muted">Attributes your script would derive</div>
        <AttrRows rows={[['hrb_filing_preference', attrs.hrb_filing_preference], ['hrb_appointment_cta_clicks', attrs.hrb_appointment_cta_clicks], ['hrb_diy_start_clicks', attrs.hrb_diy_start_clicks], ['hrb_pages_viewed', attrs.hrb_pages_viewed]]} />
      </div>
      <div className="mt-3">
        <div className="text-xs font-semibold uppercase tracking-wider hb-tx-muted">Timeline ({evs.length} events)</div>
        <ul className="hb-scroll mt-1 space-y-1 overflow-y-auto pr-1" style={{ maxHeight: 220 }}>
          {evs.map((e) => {
            const isNew = step.newIds.includes(e.id);
            return (
              <li key={e.id} className="flex flex-wrap items-center gap-2 rounded-lg px-2 py-1 text-sm" style={{ background: isNew ? '#E9FBEF' : '#F8F8F5', borderLeft: isNew ? '4px solid #00E95C' : '4px solid transparent' }}>
                <span className="w-20 text-xs hb-tx-muted">{e.when}</span>
                <Chip tone={DEVICE_TONE[e.device]}>{e.device}</Chip>
                <span className="hb-mono text-xs">{e.type}/{e.action}</span>
                <span className="text-xs hb-tx-muted">{e.page}</span>
                {isNew ? <Chip tone="dark">new</Chip> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function IdentityScenario({ from = 0, to = SCN_STEPS.length - 1 }) {
  const [si, setSi] = useState(from);
  const step = SCN_STEPS[si];
  const raw = step.profiles.length;
  const people = step.unique;
  const dup = Math.max(0, raw - people);
  const messageable = step.profiles.filter((p) => p.email).length;
  const payload = JSON.stringify(step.newIds.map((id) => scnToOdp(scnEvent(id))), null, 2);
  const short6 = ['Anonymous visit', 'Second device', 'Sign in: phone', 'Sign in: laptop', 'Server import', 'Shared laptop'];
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario steps">
        {SCN_STEPS.map((s, i) => (i < from || i > to ? null : (
          <button key={s.title} type="button" className="hb-step" aria-current={i === si ? 'step' : undefined} data-done={i < si ? 'true' : 'false'} onClick={() => setSi(i)}>
            <span className="mr-1 opacity-70">{i + 1}</span>{short6[i]}
          </button>
        )))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="hb-card p-5">
            <Eyebrow>{'Step ' + (si + 1) + ' of ' + SCN_STEPS.length + (step.edge ? ' \u00b7 edge case' : '')}</Eyebrow>
            <h3 className="mt-1 text-lg hb-tx-dark">{step.title}</h3>
            <p className="mt-2 text-sm">{step.text}</p>
            <p className="mt-3 text-xs hb-tx-muted">{step.docs}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" disabled={si === from} onClick={() => setSi(si - 1)}>Back</button>
              <button type="button" className="hb-btn hb-btn-primary hb-btn-sm" disabled={si === to} onClick={() => setSi(si + 1)}>Next step</button>
              <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={() => setSi(from)}>Restart</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="hb-card p-3"><Stat value={raw} label="profiles in ODP" /></div>
            <div className="hb-card p-3"><Stat value={people} label="real people" /></div>
            <div className="hb-card p-3"><div className={'text-3xl font-bold md:text-4xl ' + (dup ? '' : 'hb-tx-green')} style={dup ? { color: '#262626', textDecoration: 'underline' } : undefined}>{dup}</div><div className="mt-1 text-sm hb-tx-muted">double-counted</div></div>
            <div className="hb-card p-3"><Stat value={messageable} label="messageable (email known)" /></div>
          </div>
          <Code label="Events ODP receives in this step" code={payload} maxH={260} />
          <p className="text-xs hb-tx-muted">Same shape as the events in your import script (POST /v3/events). Browser events come from the ODP JavaScript tag and carry the vuid; the server-side event carries only an email.</p>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {step.merged ? <Callout dark title="Merged">The anonymous laptop profile (z_1a7c04) folded into the known profile. Its events now sit on one timeline with the phone events, and one client counts once.</Callout> : null}
          {si === 3 ? <Callout title="Why this changes segmentation">Before the merge, the laptop profile looked like a pro seeker and the phone profile like a DIY starter. Merged, the same person is comparing options. The audiences below are re-evaluated on the unified profile.</Callout> : null}
          {si === 4 ? <Callout title="The audience flips">The imported appointment click makes two appointment clicks against one DIY click. The profile moves to High-intent pro and still counts as Comparing options.</Callout> : null}
          <div className="grid grid-cols-1 gap-4">
            {step.profiles.map((p) => <ProfileCard key={p.key + si} p={p} step={step} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function PopulationPanel({ population, params, setParams, now }) {
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(10);
  const [open, setOpen] = useState(null);
  const { profiles, eventCount, runId } = population;
  const mix = useMemo(() => {
    const m = { tax_pro: 0, diy: 0, undecided: 0, researching: 0 };
    profiles.forEach((p) => { m[p.attributes.hrb_filing_preference] += 1; });
    return m;
  }, [profiles]);
  const filtered = useMemo(() => profiles.filter((p) => p.attributes.email.includes(q.trim().toLowerCase())), [profiles, q]);
  const shown = filtered.slice(0, limit);
  const sample = open ? profiles.find((p) => p.attributes.email === open) : null;
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="hb-card p-5 lg:col-span-1">
          <h3 className="text-lg hb-tx-dark">Generator settings</h3>
          <p className="mt-1 text-sm hb-tx-muted">Same flags as the import script. The same seed and count always give the same emails, so re-running upserts profiles instead of duplicating them.</p>
          <div className="mt-4 space-y-4 text-sm">
            <label className="block">
              <span className="font-semibold">--count: {params.count} profiles</span>
              <input className="mt-1 w-full" type="range" min="20" max="500" step="10" value={params.count} onChange={(e) => setParams({ ...params, count: parseInt(e.target.value, 10) })} />
            </label>
            <label className="block">
              <span className="font-semibold">--days: spread events over {params.days} days</span>
              <input className="mt-1 w-full" type="range" min="1" max="28" step="1" value={params.days} onChange={(e) => setParams({ ...params, days: parseInt(e.target.value, 10) })} />
            </label>
            <label className="block">
              <span className="font-semibold">--seed</span>
              <input className="hb-input mt-1 block w-32" type="number" value={params.seed} onChange={(e) => setParams({ ...params, seed: parseInt(e.target.value, 10) || 0 })} />
            </label>
            <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={() => setParams({ count: 200, days: 14, seed: 42 })}>Reset to script defaults</button>
          </div>
        </div>
        <div className="hb-card p-5 lg:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            <Stat value={profiles.length.toLocaleString()} label="profiles" />
            <Stat value={eventCount.toLocaleString()} label="events" />
            <Stat value={(eventCount / profiles.length).toFixed(1)} label="events per profile" />
          </div>
          <div className="mt-5 text-sm font-semibold">Derived hrb_filing_preference</div>
          <div className="mt-2"><StackedBar segments={Object.keys(mix).map((k) => ({ label: k, value: mix[k], color: PREF_COLORS[k] }))} /></div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {Object.keys(mix).map((k) => (
              <span key={k} className="inline-flex items-center gap-2">
                <span style={{ width: 12, height: 12, borderRadius: 3, background: PREF_COLORS[k], display: 'inline-block', border: '1px solid #262626' }} />
                <span className="hb-mono text-xs">{k}</span> <strong>{mix[k]}</strong> <span className="hb-tx-muted">({pctOf(mix[k], profiles.length)}%)</span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs hb-tx-muted">Import batch id: <span className="hb-mono">{runId}</span>. Emails use example.com, a reserved domain, so nothing here can reach a real person. All profiles are identified by email only, which is why live browsers need a sign-in to be linked to them.</p>
        </div>
      </div>

      <div className="hb-card mt-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg hb-tx-dark">Browse the profiles</h3>
          <label className="text-sm"><span className="sr-only">Filter by email</span>
            <input className="hb-input w-64" placeholder="Filter by email" value={q} onChange={(e) => { setQ(e.target.value); setLimit(10); }} />
          </label>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full" style={{ minWidth: 640 }}>
            <thead><tr><TH>Email</TH><TH>Preference</TH><TH>Appointment clicks</TH><TH>DIY clicks</TH><TH>Pages</TH><TH>Last event</TH></tr></thead>
            <tbody>
              {shown.map((p) => {
                const a = p.attributes;
                return (
                  <tr key={a.email} className="hb-row" tabIndex={0} onClick={() => setOpen(open === a.email ? null : a.email)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === a.email ? null : a.email); } }} aria-expanded={open === a.email}>
                    <TD className="hb-mono text-xs">{a.email}</TD>
                    <TD><span className="inline-flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: 3, background: PREF_COLORS[a.hrb_filing_preference], display: 'inline-block', border: '1px solid #262626' }} />{a.hrb_filing_preference}</span></TD>
                    <TD>{a.hrb_appointment_cta_clicks}</TD><TD>{a.hrb_diy_start_clicks}</TD><TD>{a.hrb_pages_viewed}</TD>
                    <TD className="hb-mono text-xs">{a.hrb_last_site_event}</TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className="hb-tx-muted">Showing {shown.length} of {filtered.length}</span>
          {shown.length < filtered.length ? <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={() => setLimit(limit + 10)}>Show 10 more</button> : null}
        </div>
        {sample ? (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Code label="POST /v3/profiles (one record)" code={JSON.stringify({ attributes: sample.attributes }, null, 2)} maxH={300} />
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider hb-tx-muted">Events for this profile</div>
              <ul className="space-y-1 text-sm">
                {sample.events.map((e, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg px-2 py-1" style={{ background: '#F8F8F5' }}>
                    <span className="w-20 text-xs hb-tx-muted">{fmtAgo(e.data.ts, now)}</span>
                    <span className="hb-mono text-xs">{e.type}/{e.action}</span>
                    <span className="text-xs hb-tx-muted">{e.data.page}</span>
                    {e.data.value ? <Chip>{e.data.value}</Chip> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function IdentityStepsScene({ from, to, lead }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <Lead eyebrow={'Capability 1 \u00b7 Identity resolution'}>{lead}</Lead>
      <IdentityScenario from={from} to={to} />
    </div>
  );
}
const TwoDevicesScene = () => <IdentityStepsScene from={0} to={1} lead="Follow one client, Maria. She visits on her laptop, then on her phone. Each browser gets its own cookie, so ODP sees two anonymous visitors. Click through the two steps and watch the count of profiles against the count of real people." />;
const SignInMergeScene = () => <IdentityStepsScene from={2} to={3} lead="Maria signs in on her phone, then on her laptop. The email is a high-confidence identifier, so ODP attaches it to the phone profile and later folds the anonymous laptop profile into it. Watch the profiles, the timeline and the audiences change." />;
const ImportSharedScene = () => <IdentityStepsScene from={4} to={5} lead="Signals from your own systems join the same profile by email, with no cookie involved. Then a family member signs in on the shared laptop: the edge case to plan for when you decide on identifiers." />;

function IdentifiersScene({ population, params, setParams, now }) {
  const idRows = [
    ['email', 'High', 'Yes', 'The person-level key. Used by your import script. Directly links events to an existing profile or creates one.'],
    ['vuid', 'Low', 'No', 'Cookie/device ID set by the ODP JavaScript tag, lasts 2 years. Only used to link when no high-confidence identifier is present, and can move between profiles.'],
    ['zaius_id', 'n/a', 'No', 'ODP-generated ID for the profile. Not something you send.'],
    ['Custom (for example MyBlock account ID)', 'Set by configuration', 'Configurable', 'Custom identifiers are considered when merging. They are created with the ODP Customer Success team, so plan the identifier list early.'],
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <Lead eyebrow={'Capability 1 \u00b7 the unified view'}>Underneath the story are two things: the rules ODP uses to decide who is who, and the population of profiles that your import script builds.</Lead>

      <div>
        <SectionTitle title="Identifiers at a glance">The confidence level decides how much weight an identifier carries when ODP decides whether two events belong to the same person.</SectionTitle>
        <div className="hb-card overflow-x-auto">
          <table className="w-full" style={{ minWidth: 640 }}>
            <thead><tr><TH>Identifier</TH><TH>Confidence</TH><TH>Messaging</TH><TH>How it behaves</TH></tr></thead>
            <tbody>{idRows.map((r) => (<tr key={r[0]}><TD className="font-semibold hb-mono text-xs">{r[0]}</TD><TD>{r[1]}</TD><TD>{r[2]}</TD><TD className="hb-tx-muted">{r[3]}</TD></tr>))}</tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Callout title="Sources">
            <DocLink href="https://docs.optimizely.com/data-platform/docs/overview-of-customer-identity-and-resolution">Overview of customer identity and resolution</DocLink>{' \u00b7 '}
            <DocLink href="https://docs.optimizely.com/data-platform/docs/thebasics-identifiers">Identifiers</DocLink>{' \u00b7 '}
            <DocLink href="https://docs.optimizely.com/data-platform/docs/track-customers-in-odp">Track customers in ODP</DocLink>
          </Callout>
        </div>
      </div>

      <div className="mt-12">
        <SectionTitle eyebrow="Your import script, in the browser" title="The seeded population">
          Every attribute is derived from that profile&rsquo;s events, exactly as in the script. Move the sliders to see how the volume and the 28-day audience window react.
        </SectionTitle>
        <PopulationPanel population={population} params={params} setParams={setParams} now={now} />
      </div>
    </div>
  );
}

/* =====================================================================
   REAL-TIME AUDIENCES (ODP)
   ===================================================================== */
const OP_LABELS = { is: 'is', isnot: 'is not', eq: 'is exactly', gte: 'is at least', lte: 'is at most' };

function ConditionRow({ group, c, onChange, onRemove }) {
  if (group.type === 'attribute') {
    const f = ATTR_FIELDS.find((x) => x.id === c.field) || ATTR_FIELDS[0];
    const ops = f.kind === 'number' ? ['eq', 'gte', 'lte'] : ['is', 'isnot'];
    return (
      <div className="flex flex-wrap items-center gap-2">
        <select className="hb-input" aria-label="Attribute" value={c.field} onChange={(e) => {
          const nf = ATTR_FIELDS.find((x) => x.id === e.target.value);
          onChange({ field: nf.id, op: nf.kind === 'number' ? 'gte' : 'is', value: nf.kind === 'number' ? 1 : nf.options[0] });
        }}>
          {ATTR_FIELDS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
        <select className="hb-input" aria-label="Operator" value={c.op} onChange={(e) => onChange({ op: e.target.value })}>
          {ops.map((o) => <option key={o} value={o}>{OP_LABELS[o]}</option>)}
        </select>
        {f.kind === 'number'
          ? <input className="hb-input w-20" type="number" min="0" aria-label="Value" value={c.value} onChange={(e) => onChange({ value: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })} />
          : <select className="hb-input" aria-label="Value" value={c.value} onChange={(e) => onChange({ value: e.target.value })}>{f.options.map((o) => <option key={o} value={o}>{o}</option>)}</select>}
        <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={onRemove} aria-label="Remove condition">Remove</button>
      </div>
    );
  }
  const key = c.type + '|' + c.action;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className="hb-input" aria-label="Event" value={key} onChange={(e) => {
        const o = EVENT_OPTIONS.find((x) => x.key === e.target.value);
        onChange({ type: o.type, action: o.action });
      }}>
        {EVENT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>
      <select className="hb-input" aria-label="Count operator" value={c.op} onChange={(e) => onChange({ op: e.target.value })}>
        <option value="atleast">is at least</option>
        <option value="exactly">is exactly</option>
      </select>
      <input className="hb-input w-16" type="number" min="0" aria-label="Times" value={c.n} onChange={(e) => onChange({ n: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })} />
      <span className="text-sm">times in the last</span>
      <input className="hb-input w-16" type="number" min="1" max={MAX_LOOKBACK_DAYS} aria-label="Days" value={c.days} onChange={(e) => onChange({ days: Math.min(MAX_LOOKBACK_DAYS, Math.max(1, parseInt(e.target.value, 10) || 1)) })} />
      <span className="text-sm">days</span>
      <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={onRemove} aria-label="Remove condition">Remove</button>
    </div>
  );
}

function GroupEditor({ group, index, onGroup, onCond, onAddCond, onRemoveCond, onRemoveGroup }) {
  return (
    <div className="hb-card-sand p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold hb-tx-dark">Group {index + 1}</span>
        <select className="hb-input" aria-label="Include or exclude" value={group.mode} onChange={(e) => onGroup({ mode: e.target.value })}>
          <option value="include">Include</option><option value="exclude">Exclude</option>
        </select>
        <span>people who match</span>
        <select className="hb-input" aria-label="All or any" value={group.match} onChange={(e) => onGroup({ match: e.target.value })}>
          <option value="all">all</option><option value="any">any</option>
        </select>
        <span>of these {group.type === 'attribute' ? 'attributes' : 'events'}</span>
        <span className="ml-auto"><button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={onRemoveGroup}>Remove group</button></span>
      </div>
      <div className="mt-3 space-y-2">
        {group.conds.map((c, ci) => (
          <ConditionRow key={ci} group={group} c={c} onChange={(patch) => onCond(ci, patch)} onRemove={() => onRemoveCond(ci)} />
        ))}
        {!group.conds.length ? <div className="text-sm hb-tx-muted">No conditions: this group matches everyone.</div> : null}
      </div>
      <button type="button" className="hb-btn hb-btn-primary hb-btn-sm mt-3" onClick={onAddCond}>{group.type === 'attribute' ? 'Add attribute' : 'Add event'}</button>
    </div>
  );
}

function AudienceBuilderScene({ population, now }) {
  const [selId, setSelId] = useState('hrb_high_intent_pro');
  const preset = AUDIENCES.find((a) => a.id === selId);
  const [draft, setDraft] = useState(() => cloneGroups(AUDIENCES[0].groups));
  const modified = JSON.stringify(draft) !== JSON.stringify(preset.groups);
  const pickAud = (id) => { setSelId(id); setDraft(cloneGroups(AUDIENCES.find((a) => a.id === id).groups)); };
  const members = useMemo(() => population.profiles.filter((p) => inAudience(draft, p, now)), [draft, population, now]);
  const sizes = useMemo(() => {
    const m = {};
    AUDIENCES.forEach((a) => { m[a.id] = population.profiles.filter((p) => inAudience(a.groups, p, now)).length; });
    return m;
  }, [population, now]);
  const total = population.profiles.length;

  const setGroup = (gi, patch) => setDraft(draft.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  const setCond = (gi, ci, patch) => setDraft(draft.map((g, i) => (i !== gi ? g : { ...g, conds: g.conds.map((c, j) => (j === ci ? { ...c, ...patch } : c)) })));
  const addCond = (gi) => setDraft(draft.map((g, i) => {
    if (i !== gi) return g;
    const nc = g.type === 'attribute' ? atCond('hrb_filing_preference', 'is', 'tax_pro') : evCond('appointment_cta_click', 1, 28);
    return { ...g, conds: [...g.conds, nc] };
  }));
  const removeCond = (gi, ci) => setDraft(draft.map((g, i) => (i !== gi ? g : { ...g, conds: g.conds.filter((_, j) => j !== ci) })));
  const removeGroup = (gi) => setDraft(draft.filter((_, i) => i !== gi));
  const addGroup = (type) => setDraft([...draft, type === 'attribute' ? atGroup('include', 'all', [atCond('hrb_filing_preference', 'is', 'tax_pro')]) : evGroup('include', 'all', [evCond('appointment_cta_click', 1, 28)])]);

  const renderPick = (a) => (
    <button key={a.id} type="button" className="hb-pick" aria-pressed={a.id === selId} onClick={() => pickAud(a.id)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold hb-tx-dark">{a.name}</span>
        <Chip tone={a.family === 'events' ? 'green' : 'sand'}>{sizes[a.id]}</Chip>
      </div>
      <div className="hb-mono mt-1 text-xs hb-tx-muted">{a.id}</div>
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <Lead eyebrow={'Capability 2 \u00b7 step 1: Optimizely Data Platform'}>
        This is the real-time audience builder, running against the {total} seeded profiles. Pick an audience, change its conditions, and watch the membership update. Event conditions look back at most 28 days, so the lookback you set here is the one that counts.
      </Lead>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-3 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider hb-tx-muted">Event-based (used for activation)</div>
          {AUDIENCES.filter((a) => a.family === 'events').map(renderPick)}
          <div className="pt-2 text-xs font-semibold uppercase tracking-wider hb-tx-muted">Attribute-based (your hrb_* fields)</div>
          {AUDIENCES.filter((a) => a.family === 'attributes').map(renderPick)}
        </div>

        <div className="lg:col-span-9 space-y-4">
          <div className="hb-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl hb-tx-dark">{preset.name}</h3>
              <span className="hb-mono text-xs hb-tx-muted">{preset.id}</span>
              {modified ? <Chip tone="neon">edited, not saved</Chip> : null}
              {modified ? <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={() => pickAud(selId)}>Undo edits</button> : null}
            </div>
            <p className="mt-1 text-sm hb-tx-muted">{preset.desc}</p>

            <div className="mt-4 space-y-3">
              {draft.map((g, gi) => (
                <GroupEditor key={gi} group={g} index={gi}
                  onGroup={(patch) => setGroup(gi, patch)}
                  onCond={(ci, patch) => setCond(gi, ci, patch)}
                  onAddCond={() => addCond(gi)}
                  onRemoveCond={(ci) => removeCond(gi, ci)}
                  onRemoveGroup={() => removeGroup(gi)} />
              ))}
              <div className="flex flex-wrap gap-2">
                <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={() => addGroup('event')}>Add event group</button>
                <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={() => addGroup('attribute')}>Add attribute group</button>
              </div>
              <p className="text-xs hb-tx-muted">A group holds one type of condition, either attributes or events. All groups must pass for someone to be in the audience.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="hb-card p-5 md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wider hb-tx-muted">Audience size</div>
              <div className="mt-1 flex items-end gap-2"><span className="text-5xl font-bold hb-tx-green">{members.length}</span><span className="pb-2 text-sm hb-tx-muted">of {total} profiles ({pctOf(members.length, total)}%)</span></div>
              <div className="mt-3 hb-bar"><div style={{ width: pctOf(members.length, total) + '%', background: '#005D1F' }} /></div>
              <div className="mt-4 text-sm hb-tx-muted">Evaluated live in your browser from the events and attributes your import script generates.</div>
            </div>
            <div className="hb-card p-5 md:col-span-3">
              <div className="text-xs font-semibold uppercase tracking-wider hb-tx-muted">First members</div>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full" style={{ minWidth: 420 }}>
                  <thead><tr><TH>Email</TH><TH>Appt</TH><TH>DIY</TH><TH>Preference</TH></tr></thead>
                  <tbody>
                    {members.slice(0, 6).map((p) => (
                      <tr key={p.attributes.email}><TD className="hb-mono text-xs">{p.attributes.email}</TD><TD>{p.attributes.hrb_appointment_cta_clicks}</TD><TD>{p.attributes.hrb_diy_start_clicks}</TD><TD className="hb-mono text-xs">{p.attributes.hrb_filing_preference}</TD></tr>
                    ))}
                    {!members.length ? <tr><TD className="hb-tx-muted">Nobody matches yet.</TD><TD /><TD /><TD /></tr> : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function AudienceKindsScene({ population, now }) {
  const sizes = useMemo(() => AUDIENCES.map((a) => ({ a, n: population.profiles.filter((q) => inAudience(a.groups, q, now)).length })), [population, now]);
  const total = population.profiles.length;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <Lead eyebrow={'Capability 2 \u00b7 step 1: Optimizely Data Platform'}>The same segmentation question can be answered from events or from profile attributes. They behave differently once the season is under way, so it is worth choosing deliberately. Sizes are against the {total} seeded profiles.</Lead>
      <div className="mb-6 hb-card overflow-x-auto">
        <table className="w-full" style={{ minWidth: 520 }}>
          <thead><tr><TH>Audience</TH><TH>Based on</TH><TH>Members</TH><TH>Share</TH></tr></thead>
          <tbody>
            {sizes.map(({ a, n }) => (
              <tr key={a.id}><TD className="font-semibold hb-tx-dark">{a.name}</TD><TD><Chip tone={a.family === 'events' ? 'green' : 'sand'}>{a.family === 'events' ? 'events' : 'attributes'}</Chip></TD><TD>{n}</TD><TD>{pctOf(n, total)}%</TD></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="hb-card p-5">
          <h3 className="text-lg hb-tx-dark">Event-based or attribute-based?</h3>
          <p className="mt-2 text-sm">Your import script writes hrb_filing_preference once, when it imports. A live click on the site never updates it. The event-based audiences read the events directly, so they react to live behaviour and still match the seeded data. Compare the sizes in the table above.</p>
          <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
            <li><strong>Events:</strong> real-time, but limited to the last 28 days.</li>
            <li><strong>Attributes:</strong> stay on the profile as long as you keep them, but need something to write them back.</li>
            <li>Use both: events for the moment, attributes for the season.</li>
          </ul>
        </div>
        <div className="hb-card p-5">
          <h3 className="text-lg hb-tx-dark">Build it in ODP</h3>
          <ol className="mt-2 list-decimal pl-5 text-sm space-y-1">
            <li>Go to Customers &gt; Audiences &gt; New Audience &gt; Real-Time Audience.</li>
            <li>Name it, then Add Event Conditions or Add Attribute Conditions.</li>
            <li>If hrblock events are missing from the list, use Connect New Event-Action Pair. Names must match the import script exactly: hrblock / appointment_cta_click.</li>
            <li>Save Audience. New events reach audiences in under 90 seconds; most arrive in under 10.</li>
          </ol>
          <p className="mt-3 text-sm"><DocLink href="https://docs.optimizely.com/data-platform/docs/build-real-time-audiences-in-odp">Build real-time audiences in ODP</DocLink></p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   ACTIVATION (Web Experimentation)
   ===================================================================== */
function HomePreview({ copy, highlight, onCta }) {
  const diff = (k) => highlight && copy[k] !== ORIGINAL_COPY[k];
  const cls = (flag) => (flag ? 'hb-changed' : '');
  const apptPrimary = copy.emphasis === 'appt';
  const badgeFor = (id) => (copy.badge === id ? <span className={'hb-chip hb-chip-neon ' + cls(highlight && copy.badge !== ORIGINAL_COPY.badge)}>{'\u2605'} Recommended for you</span> : null);
  const cards = [
    { id: 'diy', eyebrow: 'DO-IT-YOURSELF', h: 'File your own taxes with confidence', price: '$0', small: '+ $0 state additional for paid products *simple returns only', cta: 'Start for free' },
    { id: 'support', eyebrow: 'DO-IT-YOURSELF + SUPPORT', h: 'File your own taxes with expert help', price: '$65', small: '+ $49 per state filed', cta: 'Start with expert help' },
    { id: 'pro', eyebrow: 'FULL-SERVICE TAX PREP', h: 'Let a trusted tax pro handle it all', price: '$99', small: '+ additional state fee', cta: 'Start with a tax pro' },
  ];
  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: '1.5px solid #CFCBB5', background: '#fff' }}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 hb-bg-sand text-xs">
        <strong className="hb-tx-dark">H&amp;R Block{'\u00ae'}</strong>
        <span className="hb-tx-muted">Still time to file {'\u00b7'} File online {'\u00b7'} File with a tax pro {'\u00b7'} Find an office</span>
      </div>
      <div className="hb-bg-dark px-5 py-7 hb-dark-zone">
        <div className={'text-xs font-semibold uppercase tracking-widest hb-tx-neon ' + cls(diff('eyebrow'))} style={{ display: 'inline-block' }}>{copy.eyebrow}</div>
        <h3 className={'mt-2 text-2xl hb-tx-white md:text-3xl ' + cls(diff('h1'))} style={{ display: 'block' }}>{copy.h1}</h3>
        <p className={'mt-3 max-w-xl text-sm hb-tx-sand ' + cls(diff('body'))}>{copy.body}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" data-event-key="appointment_cta_click" onClick={() => onCta('appointment_cta_click', copy.appt)} className={'hb-btn ' + (apptPrimary ? 'hb-btn-neon' : 'hb-btn-outline-light') + ' ' + cls(diff('appt') || (highlight && copy.emphasis !== ORIGINAL_COPY.emphasis))}>{copy.appt}</button>
          <button type="button" data-event-key="diy_start_click" onClick={() => onCta('diy_start_click', copy.diy)} className={'hb-btn ' + (!apptPrimary ? 'hb-btn-neon' : 'hb-btn-outline-light') + ' ' + cls(diff('diy') || (highlight && copy.emphasis !== ORIGINAL_COPY.emphasis))}>{copy.diy}</button>
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-2 text-sm hb-tx-sand md:grid-cols-3">
          <li>{'\u2713'} Get a second set of expert eyes before you file</li>
          <li>{'\u2713'} Meet in person or online, whichever works for you</li>
          <li>{'\u2713'} Backed by our 100% Accuracy guarantee</li>
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-3 p-4 hb-bg-warm md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.id} className="hb-card p-3 text-sm" style={copy.badge === c.id ? { borderColor: '#005D1F', borderWidth: 2 } : undefined}>
            <div style={{ minHeight: 24 }}>{badgeFor(c.id)}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider hb-tx-green">{c.eyebrow}</div>
            <div className="mt-1 font-bold hb-tx-dark">{c.h}</div>
            <div className="mt-2 text-xs hb-tx-muted">Starting at</div>
            <div className="text-2xl font-bold hb-tx-dark">{c.price}</div>
            <div className="text-xs hb-tx-muted">{c.small}</div>
            <div className="mt-2"><span className="hb-btn hb-btn-primary hb-btn-sm" style={{ cursor: 'default' }}>{c.cta}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STAGE_TEXT = [
  ['Capture', 'The ODP tag sends the click with the visitor\u2019s vuid.'],
  ['Resolve', 'ODP matches the vuid or email to a profile.'],
  ['Segment', 'Real-time audiences are re-evaluated on the profile.'],
  ['Fetch', 'Next page view: the snippet asks ODP for this visitor\u2019s audiences (2 second limit).'],
  ['Decide', 'Highest-priority matching experience wins, then the holdback applies.'],
  ['Render', 'The page shows that experience.'],
];

const DEFAULT_HOLDBACK = 5; // Personalization default

function ActivationVisitorScene({ population }) {
  const [visitor, setVisitor] = useState(() => ({ vuid: newVuid(), email: null, live: [], views: 0 }));
  const [applied, setApplied] = useState({ status: 'idle', winner: null, holdback: false, memberships: [] });
  const [stage, setStage] = useState(0);
  const holdbackPct = DEFAULT_HOLDBACK;
  const [highlight, setHighlight] = useState(true);
  const [pick, setPick] = useState('');
  const timers = useRef([]);
  const booted = useRef(false);

  const featured = useMemo(() => {
    const out = [];
    ['tax_pro', 'diy', 'undecided', 'researching'].forEach((pref) => {
      population.profiles.filter((p) => p.attributes.hrb_filing_preference === pref).slice(0, 2).forEach((p) => out.push(p));
    });
    const hi = population.profiles.find((p) => p.attributes.hrb_appointment_cta_clicks >= 2 && !out.includes(p));
    if (hi) out.push(hi);
    return out;
  }, [population]);
  useEffect(() => { if (!pick && featured.length) setPick(featured[0].attributes.email); }, [featured, pick]);

  const seeded = visitor.email ? population.profiles.find((p) => p.attributes.email === visitor.email) : null;
  const events = [...(seeded ? seeded.events : []), ...visitor.live];
  const derived = deriveAttributes(events, 'live');
  const profile = { attributes: { ...(seeded ? seeded.attributes : {}), ...derived }, events };
  const liveDecision = decide(profile, nowSec(), holdbackPct, visitor.email || visitor.vuid);
  const shownCopy = applied.status === 'ok' && applied.winner && !applied.holdback ? applied.winner.copy : ORIGINAL_COPY;
  const stale = applied.status !== 'idle' && (liveDecision.winner ? liveDecision.winner.id : '') !== (applied.winner ? applied.winner.id : '');

  const play = (upTo) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage(0);
    for (let k = 1; k <= upTo; k++) timers.current.push(setTimeout(() => setStage(k), k * 320));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const mkEvent = (type, action, page, value) => ({
    type, action,
    identifiers: visitor.email ? { vuid: visitor.vuid, email: visitor.email } : { vuid: visitor.vuid },
    data: { ts: nowSec(), hostname: SITE_HOST, page, title: PAGES[page], ...(value ? { value } : {}) },
  });
  const pageView = () => {
    const known = !!visitor.email || visitor.views >= 1;
    const pv = mkEvent('pageview', 'view', '/');
    if (!known) setApplied({ status: 'race', winner: null, holdback: false, memberships: [] });
    else setApplied({ status: 'ok', winner: liveDecision.winner, holdback: liveDecision.holdback, memberships: liveDecision.memberships });
    setVisitor((v) => ({ ...v, views: v.views + 1, live: [...v.live, pv] }));
    play(known ? 6 : 4);
  };
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    pageView();
  }, []);
  const onCta = (key, label) => {
    const ev = mkEvent(EVENT_TYPE, key, '/', label);
    setVisitor((v) => ({ ...v, live: [...v.live, ev] }));
    play(3);
  };
  const signIn = () => {
    if (!pick) return;
    setVisitor((v) => ({ ...v, email: pick, live: [...v.live, { type: 'customer', action: 'login', identifiers: { vuid: v.vuid, email: pick }, data: { ts: nowSec(), hostname: SITE_HOST, page: '/', title: PAGES['/'], value: 'Signs in to MyBlock\u00ae' } }] }));
    play(2);
  };
  const reset = () => {
    timers.current.forEach(clearTimeout);
    setVisitor({ vuid: newVuid(), email: null, live: [], views: 0 });
    setApplied({ status: 'idle', winner: null, holdback: false, memberships: [] });
    setStage(0);
  };

  let banner;
  if (applied.status === 'race') banner = ['First page view of a brand-new visitor', 'The snippet asked ODP for this ID before ODP had received it, so ODP did not recognise it and bucketing was skipped for this load. The original shows. Load the page again to see the experience.'];
  else if (applied.status === 'ok' && applied.winner && applied.holdback) banner = ['In the campaign holdback', 'This visitor matches "' + applied.winner.name + '" but is in the ' + holdbackPct + '% holdback, so the original shows. That is how the campaign measures lift.'];
  else if (applied.status === 'ok' && applied.winner) banner = ['Experience: ' + applied.winner.name, 'Matched audience ' + applied.winner.audience + ' (highest priority of ' + applied.memberships.length + ' matched).'];
  else if (applied.status === 'ok') banner = ['Original experience', 'No real-time audience matched this visitor yet.'];
  else banner = ['Loading', 'Running the first page view.'];

  const recent = [...visitor.live].reverse().slice(0, 6);
  const storedPref = seeded ? seeded.attributes.hrb_filing_preference : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <Lead eyebrow={'Capability 2 \u00b7 step 2: Web Experimentation'}>
        Play the visitor. Click the hero buttons, sign in as a seeded profile, then load the next page view. ODP updates as you click; the page changes when Web Experimentation next asks ODP who this is.
      </Lead>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="hb-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg hb-tx-dark">Visitor</h3>
              <Chip tone={visitor.email ? 'green' : 'sand'}>{visitor.email ? 'Known' : 'Anonymous'}</Chip>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="hb-tx-muted">vuid</span><span className="hb-mono" title={visitor.vuid}>{short(visitor.vuid)}</span>
              <span className="hb-tx-muted">page views</span><strong>{visitor.views}</strong>
            </div>
            {visitor.email ? <div className="mt-1 text-sm break-all"><span className="hb-tx-muted">email </span><span className="hb-mono">{visitor.email}</span></div> : null}

            <div className="hb-btop mt-4 pt-4">
              <label className="block text-sm font-semibold" htmlFor="hb-pick">Sign in to MyBlock{'\u00ae'} as a seeded profile</label>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <select id="hb-pick" className="hb-input" style={{ maxWidth: 260 }} value={pick} onChange={(e) => setPick(e.target.value)} disabled={!!visitor.email}>
                  {featured.map((p) => (
                    <option key={p.attributes.email} value={p.attributes.email}>{p.attributes.email.split('@')[0]} ({p.attributes.hrb_filing_preference})</option>
                  ))}
                </select>
                <button type="button" className="hb-btn hb-btn-primary hb-btn-sm" onClick={signIn} disabled={!!visitor.email}>Sign in</button>
              </div>
              <p className="mt-2 text-xs hb-tx-muted">Sends a login event with the email and this browser&rsquo;s vuid. ODP links them, so the seeded history now counts for this visitor.</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="hb-btn hb-btn-neon hb-btn-sm" onClick={pageView}>Next page view</button>
              <button type="button" className="hb-btn hb-btn-outline hb-btn-sm" onClick={reset}>New anonymous visitor</button>
            </div>
            {stale ? <div className="mt-3"><Callout dark title="ODP has newer information than the page">This visitor now qualifies for {liveDecision.winner ? '"' + liveDecision.winner.name + '"' : 'the original experience'}. Load the next page view to see it.</Callout></div> : null}
          </div>

          <div className="hb-card p-5">
            <h3 className="text-lg hb-tx-dark">ODP profile right now</h3>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wider hb-tx-muted">Real-time audiences</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {liveDecision.memberships.length ? liveDecision.memberships.map((m) => <Chip key={m} tone="green">{m}</Chip>) : <span className="text-sm hb-tx-muted">none yet</span>}
            </div>
            <div className="mt-3 text-sm">
              <div className="text-xs font-semibold uppercase tracking-wider hb-tx-muted">Derived from events now</div>
              <AttrRows rows={[['hrb_filing_preference', derived.hrb_filing_preference], ['hrb_appointment_cta_clicks', derived.hrb_appointment_cta_clicks], ['hrb_diy_start_clicks', derived.hrb_diy_start_clicks]]} />
            </div>
            {storedPref ? (
              <div className="mt-3 text-sm">
                <span className="hb-tx-muted">Stored on the profile by the import: </span><strong className="hb-mono">{storedPref}</strong>{' '}
                {storedPref !== derived.hrb_filing_preference ? <Chip tone="neon">stale: nothing writes live clicks back</Chip> : <Chip>in sync</Chip>}
              </div>
            ) : null}
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider hb-tx-muted">Latest events</div>
            <ul className="mt-1 space-y-1">
              {recent.map((e, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg px-2 py-1 text-xs" style={{ background: '#F8F8F5' }}>
                  <span className="hb-mono">{e.type}/{e.action}</span>
                  {e.data.value ? <Chip>{e.data.value}</Chip> : null}
                  <span className="hb-tx-muted">{fmtAgo(e.data.ts, nowSec())}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="hb-card-dark p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold hb-tx-neon">{banner[0]}</div>
                <div className="mt-1 text-sm hb-tx-sand">{banner[1]}</div>
              </div>
              <label className="flex items-center gap-2 text-sm hb-tx-sand">
                <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} /> Highlight changes
              </label>
            </div>
          </div>
          <HomePreview copy={shownCopy} highlight={highlight} onCta={onCta} />
          <p className="text-xs hb-tx-muted">The two hero buttons keep their data-event-key in every experience; only text and emphasis change. That keeps ODP events and campaign metrics comparable. Copy is illustrative and needs legal review before use.</p>
        </div>
      </div>

      <div className="mt-10">
        <SectionTitle title="What happens, step by step">Click a hero button to run steps 1 to 3 at once. Steps 4 to 6 only run on the next page view.</SectionTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {STAGE_TEXT.map((s, i) => (
            <div key={s[0]} className="hb-stage" data-on={stage >= i + 1 ? 'true' : 'false'}>
              <div className="flex items-center gap-2"><span className="hb-num">{i + 1}</span><strong className="text-sm hb-tx-dark">{s[0]}</strong></div>
              <div className="mt-2 text-xs hb-tx-muted">{s[1]}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Code label="Browser console check (simulated output)" code={'> window["optimizely"].get("visitor")["vendor.odp"]["audiences"]\n' + JSON.stringify(applied.status === 'ok' ? applied.memberships : [])} />
          <Callout title="Why the page does not change on the click">Web Experimentation evaluates audiences when a page activates. The click reaches ODP and its audiences within seconds, and the next page view (or single-page-app navigation) picks it up. Make sure dynamic website support is on for this single-page app.</Callout>
        </div>
      </div>

    </div>
  );
}

function CampaignScene({ population, now }) {
  const [holdbackPct, setHoldbackPct] = useState(DEFAULT_HOLDBACK);
  const alloc = useMemo(() => {
    const counts = { original: 0, holdback: 0 };
    EXPERIENCES.forEach((x) => { counts[x.id] = 0; });
    population.profiles.forEach((p) => {
      const d = decide(p, now, holdbackPct, p.attributes.email);
      if (!d.winner) counts.original += 1;
      else if (d.holdback) counts.holdback += 1;
      else counts[d.winner.id] += 1;
    });
    return counts;
  }, [population, now, holdbackPct]);
  const total = population.profiles.length;
  const allocRows = [
    ...EXPERIENCES.map((x) => ({ id: x.id, label: x.name, audience: x.audience, color: x.color, n: alloc[x.id] })),
    { id: 'holdback', label: 'Holdback (sees original)', audience: 'random ' + holdbackPct + '% of matched', color: '#8F8C7A', n: alloc.holdback },
    { id: 'original', label: 'Original (no audience matched)', audience: 'everyone else', color: '#E4E0CC', n: alloc.original },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <Lead eyebrow={'Capability 2 \u00b7 step 2: Web Experimentation'}>Behind the page you just saw is one personalization campaign: an experience per audience, in priority order, with a holdback. Move the holdback and see who would see what across the seeded profiles.</Lead>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="hb-card p-5">
          <h3 className="text-lg hb-tx-dark">The campaign in Web Experimentation</h3>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li><strong>Type:</strong> personalization campaign on the home page.</li>
            <li><strong>Audiences:</strong> Real-Time Segments &gt; Custom Segments, one per ODP audience.</li>
            <li><strong>Priority:</strong> a visitor sees only the highest-ranked experience they qualify for.</li>
            <li><strong>Primary metric:</strong> click on [data-event-key=&quot;appointment_cta_click&quot;]. Secondary: diy_start_click.</li>
          </ul>
          <p className="mt-2 text-xs hb-tx-muted">Personalization campaigns need Optimizely Personalization on the project. Without it, run one A/B test per audience on the same page.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full" style={{ minWidth: 420 }}>
              <thead><tr><TH>Priority</TH><TH>Experience</TH><TH>ODP audience</TH></tr></thead>
              <tbody>
                {EXPERIENCES.map((x, i) => (<tr key={x.id}><TD>{i + 1}</TD><TD className="font-semibold">{x.name}</TD><TD className="hb-mono text-xs">{x.audience}</TD></tr>))}
                <tr><TD>5</TD><TD className="font-semibold">Original</TD><TD className="hb-tx-muted">everyone else</TD></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm"><DocLink href="https://docs.optimizely.com/personalization/docs/create-a-campaign-in-optimizely-personalization">Create a personalization campaign</DocLink>{' \u00b7 '}<DocLink href="https://docs.optimizely.com/web-experimentation/docs/configure-real-time-segments-for-web-experimentation">Real-Time Segments for Web Experimentation</DocLink></p>
        </div>

        <div className="hb-card p-5">
          <h3 className="text-lg hb-tx-dark">Who sees what across the seeded profiles</h3>
          <label className="mt-2 block text-sm">
            <span className="font-semibold">Holdback: {holdbackPct}%</span>
            <span className="hb-tx-muted"> (Personalization default is 5%)</span>
            <input className="mt-1 w-full" type="range" min="0" max="20" step="1" value={holdbackPct} onChange={(e) => setHoldbackPct(parseInt(e.target.value, 10))} />
          </label>
          <div className="mt-3"><StackedBar segments={allocRows.map((r) => ({ label: r.label, value: r.n, color: r.color }))} /></div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full" style={{ minWidth: 380 }}>
              <thead><tr><TH>Experience</TH><TH>Profiles</TH><TH>Share</TH></tr></thead>
              <tbody>
                {allocRows.map((r) => (
                  <tr key={r.id}>
                    <TD><span className="inline-flex items-center gap-2"><span style={{ width: 12, height: 12, borderRadius: 3, background: r.color, display: 'inline-block', border: '1px solid #262626' }} />{r.label}</span></TD>
                    <TD>{r.n}</TD><TD>{pctOf(r.n, total)}%</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs hb-tx-muted">Approximation: the holdback here is a stable hash of each email. Web Experimentation buckets visitors itself.</p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   APP SHELL
   Audience window: only what the audience should see, one scene at a time (arrow keys,
   or the buttons inside the Overview), as a nine-scene story. Speaker notes, scene list and reference material
   (RFP figures to confirm, traceability, setup checklist, gaps) live in the presenter
   window (_presenter.jsx), opened with S. Scene script: _scenes.js. Window link: _sync.js.
   ===================================================================== */
const clampIdx = (i) => Math.max(0, Math.min(SCENES.length - 1, Number(i) || 0));
const DEFAULT_PARAMS = { count: 200, days: 14, seed: 42 };

export default function App() {
  const [idx, setIdx] = useState(0);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [resetKey, setResetKey] = useState(0);
  const [now] = useState(() => nowSec());
  const population = useMemo(() => buildDataset({ ...params, now }), [params, now]);
  const presenterWin = useRef(null);
  const chan = useRef(null);
  const latest = useRef('');
  const onCommand = useRef(() => {});
  const stageRef = useRef(null);

  const go = (id) => {
    const i = SCENES.findIndex((sc) => sc.id === id);
    if (i >= 0) setIdx(i);
  };
  const resetAll = () => { setIdx(0); setParams(DEFAULT_PARAMS); setResetKey((k) => k + 1); };

  /* New scene starts at the top of the stage. */
  useEffect(() => { if (stageRef.current) stageRef.current.scrollTop = 0; }, [idx]);

  /* S opens (or focuses) the presenter window. */
  const openPresenter = () => {
    const w = presenterWin.current;
    if (w && !w.closed) { w.focus(); return; }
    presenterWin.current = window.open(PRESENTER_URL, PRESENTER_WINDOW, 'popup=yes,width=820,height=940');
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

  /* Channel to the presenter window (declared before the state broadcast so it exists on first run). */
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

  const eventCount = population.eventCount;
  const payload = JSON.stringify({ idx, resetKey, eventCount });
  useEffect(() => {
    latest.current = payload;
    chan.current?.postMessage({ type: 'state', payload });
  }, [payload]);

  const s = SCENES[idx];
  const stage = () => {
    switch (s.id) {
      case 'overview': return <Overview go={go} />;
      case 'devices': return <TwoDevicesScene />;
      case 'merge': return <SignInMergeScene />;
      case 'import': return <ImportSharedScene />;
      case 'identifiers': return <IdentifiersScene population={population} params={params} setParams={setParams} now={now} />;
      case 'audience': return <AudienceBuilderScene population={population} now={now} />;
      case 'kinds': return <AudienceKindsScene population={population} now={now} />;
      case 'visitor': return <ActivationVisitorScene population={population} />;
      default: return <CampaignScene population={population} now={now} />;
    }
  };

  return (
    <div className="hb-root flex h-screen flex-col">
      <style>{CSS}</style>
      <header className="hb-bg-green hb-dark-zone shrink-0">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-8">
          <div className="text-sm font-bold hb-tx-white">H&amp;R Block{'®'} <span className="font-normal hb-tx-sand">Integrated Marketing Ecosystem</span></div>
          <Chip tone="neon">Simulated data. No live ODP connection.</Chip>
        </div>
      </header>
      <div className="hb-bg-white hb-btop shrink-0 border-b hb-rule px-4 py-3 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-xs hb-tx-muted">{s.act}</div>
          <div className="text-lg font-bold hb-tx-dark">{s.title}</div>
        </div>
      </div>
      <main ref={stageRef} className="min-h-0 flex-1 overflow-y-auto" key={`${idx}-${resetKey}`}>
        {stage()}
        <footer className="hb-bg-dark hb-dark-zone">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs hb-tx-sand md:px-8">
            Built from the H&amp;R Block Integrated Marketing Scale &amp; Requirements slide (HRB - Business Use) and the hrblock.optimoey.com import scripts. All profiles, events and experiences are simulated. Site copy variations are illustrative and need legal review before use.
          </div>
        </footer>
      </main>
    </div>
  );
}
