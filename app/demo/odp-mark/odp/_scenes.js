/* Presentation: each scene is one slide. `builds` is how many times → (or Space) advances inside the slide before
   moving to the next one; `buildHint` says what each build shows. Speaker-side data for the ODP + Web Experimentation demo (RFP capabilities 1 and 2): the story, scene by scene.
   Used by the presenter window only; page.jsx uses `id` to pick the scene to render.
   The whole demo runs in the browser with simulated data: no ODP or Web Experimentation calls and no API keys. */

export const STATUS = {
  simulated: { label: 'SIMULATED', cls: 'bg-amber-100 text-amber-800', hint: 'Runs in the browser on generated data; no ODP or Web Experimentation calls' },
  model: { label: 'MODELLED', cls: 'bg-lime-100 text-lime-800', hint: 'Simulated, but follows documented ODP behaviour and mirrors the import script' },
};
export const STATUS_BY_SCENE = { 1: 'simulated', 2: 'model', 3: 'model', 4: 'model', 5: 'model', 6: 'model', 7: 'model', 8: 'model', 9: 'model' };
export const STATUS_NOTE = {
  2: 'simplified model of documented ODP identity behaviour',
  3: 'simplified model of documented ODP identity behaviour',
  4: 'edge case: low-confidence identifiers can move',
  5: 'same generator as the import script (seed 42)',
  6: 'evaluated in the browser on the seeded profiles',
  7: 'sizes are on the seeded profiles',
  8: 'Web Experimentation decision is modelled, not called',
  9: 'holdback is an approximation (hash of the email)',
};

export const SCENES = [
  { n: 1, builds: 3, buildHint: '1 the hero numbers · 2 the five-box loop · 3 the two capabilities', subs: ["Two of the seven capabilities on the RFP slide, and the numbers behind them.", "One loop: capture, resolve, segment, personalize, measure.", "What the slide asks for, and how each capability is delivered."], id: 'overview', short: 'Overview', title: 'Two capabilities, one pipeline', time: '00:00–02:00', act: 'Overview', rfp: '1, 2',
    prep: ['Open the Reference section below and read “RFP figures to confirm”: the slide says 25M / 5,000 events/sec, its notes say 20.7M / 1,700', 'Say “figures as written on the RFP slide”, not “what we can handle”', 'Everything in this window is simulated: no live ODP connection'],
    tell: 'Two of the seven capabilities on your slide are one pipeline. Identity resolution decides who the visitor is, real-time audiences decide what they have shown interest in, and Web Experimentation turns that into a different page. The scale figures are your requirements, not claims about capacity.',
    show: ['Hero: 44.5M profiles, 25M engageable, 5,000 events/sec, with the footnote', 'The five-box loop: capture, resolve, segment, personalize, measure', 'The two capability cards, then press “Try the identity lab”'],
    back: 'One loop, not two products. First, how one person becomes one profile.' },

  { n: 2, builds: 2, buildHint: '1 anonymous laptop · 2 the phone creates a second profile', subs: ["Maria browses on her laptop. ODP builds a profile around the cookie alone.", "Then her phone: a new cookie, a second profile. One client, counted twice."], id: 'devices', short: 'Two devices', title: 'One client, two anonymous visitors', time: '02:00–04:00', act: 'Capability 1 · Identity resolution', rfp: '1',
    warn: 'This is a simplified model of documented ODP behaviour, not a live tenant. If asked about edge cases, offer to prove them in the proof of concept.',
    prep: ['Scene starts at step 1: press Restart if you went back', 'Point out the counters: profiles in ODP, real people, duplicates'],
    tell: 'Maria visits hrblock.com on her laptop. The ODP tag gives that browser a cookie, and ODP builds a profile around it. Then she picks up her phone. Different browser, different cookie, second profile. Counted naively, one client is now two.',
    show: ['Step 1: anonymous laptop, one profile, one person', 'Press → (or Next step): the phone creates a second profile', 'Point at “profiles in ODP: 2, real people: 1, duplicates: 1”', 'Open “Events ODP receives in this step” if they want to see the payload'],
    back: 'This double counting is what identity resolution exists to remove. Next, what changes when she signs in.' },

  { n: 3, builds: 2, buildHint: '1 sign in on the phone · 2 sign in on the laptop: the merge', subs: ["She signs in on the phone. Email is high confidence, so the profile becomes a known customer.", "She signs in on the laptop with the same email: the anonymous profile folds in."], id: 'merge', short: 'Sign in and merge', title: 'She signs in, and the profiles become one', time: '04:00–06:30', act: 'Capability 1 · Identity resolution', rfp: '1',
    warn: 'Merge timing in a real account can differ from this model. Do not promise a specific delay.',
    prep: ['Scene starts at step 3 (sign in on the phone)', 'Remember: email is high confidence, the cookie (vuid) is low confidence'],
    tell: 'Maria signs in on her phone. The sign-in event carries her email next to the phone cookie, so the phone profile becomes a known person. When she signs in on the laptop with the same email, ODP matches it and folds the anonymous laptop history into the same profile.',
    show: ['Step 3: the phone profile gets her email and becomes messageable', 'Press Next step: two profiles become one, with one timeline', 'Read the “Why this changes segmentation” callout', 'Point at the audiences re-evaluated on the unified profile'],
    back: 'One person, one profile, one timeline, so audiences count clients once. Next, signals from your own systems.' },

  { n: 4, builds: 2, buildHint: '1 server import joins by email · 2 the shared-laptop edge case', subs: ["Your import script sends an email only, no cookie, and it lands on the same profile.", "Edge case: a family member signs in on the shared laptop, and the cookie moves."], id: 'import', short: 'Imports and shared devices', title: 'Your systems join by email, and the shared-laptop edge case', time: '06:30–08:30', act: 'Capability 1 · Identity resolution', rfp: '1',
    warn: 'The shared-laptop edge case is where real accounts need a deliberate identifier strategy. Say that plainly rather than glossing over it.',
    prep: ['Scene starts at step 5 (server-side import)', 'Have the identifier strategy question ready: what besides email (MyBlock account ID?)'],
    tell: 'Your import script sends events with an email only, no cookie, and they land on the same profile. That is how offline and back-office signals reach the same client view. And a warning: if a family member signs in on the shared laptop, the low-confidence cookie moves to the newest person.',
    show: ['Step 5: the imported appointment click lands on Maria’s profile', 'Point at “The audience flips” callout', 'Press Next step: Sam signs in on the shared laptop; two real people, two profiles', 'Say: earlier events stay where they happened'],
    back: 'Email makes the link; the cookie only helps when nothing better exists. Identifier strategy is worth deciding early.' },

  { n: 5, builds: 3, buildHint: '1 identifiers table · 2 the seeded population · 3 browse the profiles', subs: ["How much weight each identifier carries when ODP decides who is who.", "What your import script builds: every attribute derived from that profile’s events.", "Browse the seeded profiles and see the record ODP receives."], id: 'identifiers', short: 'Identifiers and population', title: 'The rules, and the seeded population', time: '08:30–10:30', act: 'Capability 1 · The unified view', rfp: '1',
    prep: ['Three builds: identifiers, population summary, profile browser', 'The seeded population is the same generator as the import script: seed 42 and 200 profiles', 'Sliders change the volume and the 28-day window'],
    tell: 'Under the story are the rules ODP uses: how much weight each identifier carries, and which ones are messaging-enabled. And here is the population your import script builds: every attribute derived from that profile’s events.',
    show: ['Build 1: the identifiers table: email high, vuid low, zaius_id generated, custom IDs by configuration', 'Build 2: the seeded population: profile and event counts, the preference mix; move a slider', 'Build 3: browse the profiles; click a row for its events and the record ODP receives'],
    back: 'Rules you can reason about, and a population that matches what will land in ODP. Next, audiences from that population.' },

  { n: 6, builds: 2, buildHint: '1 pick an audience and edit its conditions · 2 who is in it', subs: ["Pick an audience, change its conditions, and the size updates against the seeded profiles.", "Who is in the audience right now."], id: 'audience', short: 'Build an audience', title: 'Build a real-time audience', time: '10:30–13:00', act: 'Capability 2 · Real-time audiences', rfp: '2',
    prep: ['Start on “High-intent pro” (the default)', 'The editor is on build 1 and the member list on build 2, so the size strip stays visible in both', 'Event conditions look back at most 28 days; a season is 16 weeks'],
    tell: 'A marketer builds an audience from what people did on hrblock.com: the two hero buttons. Change a condition and the audience size updates against the seeded profiles.',
    show: ['Build 1: pick “Pro seekers”, then “DIY starters”', 'Edit a condition (for example 3+ appointment clicks) and watch the size change', 'Show an include group and an exclude group', 'Build 2: who is in the audience: the first members'],
    back: 'Audiences are defined once from first-party behaviour. Next, why events and attributes behave differently.' },

  { n: 7, builds: 2, buildHint: '1 sizes table · 2 events versus attributes, and how to build it', subs: ["The same question answered from events and from attributes: different sizes, different behaviour.", "Events for the moment, attributes for the season."], id: 'kinds', short: 'Events or attributes', title: 'Events for the moment, attributes for the season', time: '13:00–14:30', act: 'Capability 2 · Real-time audiences', rfp: '2',
    warn: 'The 28-day event lookback is a real constraint against a 16-week season. This is the point to raise it, not to hide it.',
    prep: ['The sizes table compares event-based and attribute-based audiences on the same profiles', 'hrb_filing_preference is written once at import; live clicks never update it'],
    tell: 'The attribute audiences read a field the import wrote once; the event audiences read what people just did. Use events for the moment, attributes for the season.',
    show: ['Build 1: the sizes table, event-based against attribute-based', 'Build 2: the two-sided card (events versus attributes) and the four steps to build it in ODP'],
    back: 'Choose per use case: events react in seconds, attributes last the season but need something to write them back.' },

  { n: 8, builds: 3, buildHint: '1 the visitor and the page · 2 the ODP profile · 3 what happens, step by step', subs: ["Play the visitor: click a hero button, sign in as a seeded profile, then load the next page view.", "ODP updates as you click: audiences, derived attributes and the latest events.", "The page changes when Web Experimentation next asks ODP who this is."], id: 'visitor', short: 'The visitor clicks', title: 'A click reaches ODP, the next page view changes', time: '14:30–18:00', act: 'Capability 2 · Activation on site', rfp: '2',
    warn: 'The Web Experimentation decision and the “under 90 seconds” audience update are modelled from the documentation. Do not present this as measured latency.',
    prep: ['Press “New anonymous visitor” before you start', 'The page deliberately does not change on the click: the next page view picks up the new audience', 'Dynamic website support must be on for single-page apps (callout on screen)'],
    tell: 'A visitor clicks “Keep filing on my own”. That click reaches ODP and its audiences within seconds, and on the next page view Web Experimentation shows the experience for the audience they now belong to.',
    show: ['Build 1: click a hero button as the anonymous visitor; sign in as a seeded profile', 'Build 2: the ODP profile right now: audiences, derived attributes, latest events; keep clicking from the strip on top', 'Build 3: the six steps and the console check; press “Next page view”, go back to build 1 and the hero has changed'],
    back: 'One click, one profile, one audience, a different page. The same click events also measure the result.' },

  { n: 9, builds: 2, buildHint: '1 the campaign and its priorities · 2 who sees what, with the holdback', subs: ["One personalization campaign: an experience per audience, in priority order.", "Move the holdback: who would see what across the seeded profiles."], id: 'campaign', short: 'The campaign', title: 'One campaign, an experience per audience', time: '18:00–20:00', act: 'Capability 2 · Activation on site', rfp: '2',
    warn: 'The holdback here is a stable hash of each email, an approximation. Web Experimentation buckets visitors itself.',
    prep: ['Personalization campaigns need Optimizely Personalization on the project', 'Default holdback is 5%'],
    tell: 'Behind the page is one personalization campaign: an experience per audience, in priority order, and a holdback group that always sees the original so you can measure the lift honestly.',
    show: ['Build 1: the campaign: priority list of experiences and their ODP audiences', 'Build 2: move the holdback slider: who sees what across the seeded profiles', 'Primary metric: click on the appointment button'],
    back: 'Audiences from ODP, experiences in Web Experimentation, and the same click events to prove it worked.' },
];
