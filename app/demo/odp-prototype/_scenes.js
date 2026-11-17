/* Speaker-side data for the ODP demo (RFP capabilities 1 and 2): scene script and what is real.
   Used by the presenter window only. RFP numbers come from docs/H_R_Block_Integrated_Marketing_Capabilities.md. */

export const STATUS = {
  live: { label: 'LIVE', cls: 'bg-green-100 text-green-800', hint: 'Reads from the real ODP tenant (falls back to sample data if ODP is unreachable)' },
  hybrid: { label: 'HYBRID', cls: 'bg-lime-100 text-lime-800', hint: 'Real ODP data and events, with a simulated rule or screen on top' },
  simulated: { label: 'SIMULATED', cls: 'bg-amber-100 text-amber-800', hint: 'A pattern only: no ODP calls behind it' },
  slides: { label: 'SLIDES', cls: 'bg-slate-100 text-slate-700', hint: 'RFP requirements, not demonstrated' },
};
export const STATUS_BY_SCENE = { 1: 'slides', 2: 'live', 3: 'simulated', 4: 'hybrid', 5: 'hybrid', 6: 'simulated' };
export const STATUS_NOTE = {
  2: 'profile + events from ODP',
  4: 'members from ODP, rule is simulated',
  5: 'real event sent to ODP, segment entry simulated',
};

export const SCENES = [
  { n: 1, short: 'What the RFP asks', title: 'What you told us: scale and speed', time: '00:00–02:00', act: 'Capability 1 and 2 · Framing', rfp: '1, 2',
    prep: ['Two slides ready: capability 1 (44.5M / 25M), capability 2 (5,000 events/sec)', 'Say “your RFP describes”, not “you run”', 'Be ready to say plainly: this demo uses about 200 synthetic profiles, not 44.5M'],
    tell: 'Your RFP asks for one durable client view across every interaction, 44.5 million profiles with 25 million engageable in a tax season, and the ability to act on 5,000 events a second at peak. Today we show how that works on a small, real ODP tenant, and we are clear about what is real and what is a pattern.',
    show: ['Slide 1: unified customer data (44.5M profiles, 25M engageable)', 'Slide 2: real-time segmentation and activation (5,000 events/sec)', 'Point at the footer: scale numbers are the RFP’s, not ours'],
    back: 'One profile per person, and audiences that update as people act. Next, we look at a profile.' },
  { n: 2, short: 'One unified profile', title: 'One profile, every interaction', time: '02:00–05:00', act: 'Capability 1 · Unified customer data', rfp: '1',
    prep: ['Run scripts/odp-import-hrblock-profiles.mjs beforehand so the LIVE pill shows', 'If the pill says Sample data, say so: ODP is not reachable or not yet populated', 'Pick one DIY and one tax-pro profile'],
    tell: 'Every page view and every click on the site lands on one profile, keyed on the client, not on a device or a channel. Here is what the marketer sees.',
    show: ['Pick a profile from the list', 'Point at the derived attributes (filing preference, clicks, pages viewed)', 'Scroll the event timeline: pageviews and the two CTA clicks'],
    back: 'The attributes are computed from the events, so the profile can always be traced back to what the client did.' },
  { n: 3, short: 'Identity resolution', title: 'Three records, one client', time: '05:00–07:30', act: 'Capability 1 · Identity resolution', rfp: '1',
    warn: 'SIMULATED: a pattern with synthetic records. We have not run identity resolution on H&R Block data. Say that if asked, and offer to prove it on their data in the proof of concept.',
    prep: ['No live data on this scene', 'Do not quote the dedupe numbers as a result: they are illustrative'],
    tell: 'Clients show up as a web visitor, an email subscriber and an office appointment. Identity resolution ties those records to one person, so you count each client once and never email them three times.',
    show: ['Three raw records on the left', 'Press Resolve identities', 'Before and after audience counts'],
    back: 'Deduplication is what makes a 25 million engageable audience a real number of people, not a count of records.' },
  { n: 4, short: 'Build a segment', title: 'Build an audience from behavior', time: '07:30–10:30', act: 'Capability 2 · Real-time segmentation', rfp: '2',
    prep: ['Members come from ODP (LIVE pill) or sample data', 'The rule is built on real field names, but evaluated in the browser in this demo'],
    tell: 'A marketer builds an audience from what people did. Pick a filing preference and a minimum number of DIY clicks, and the audience and its members update.',
    show: ['Choose “Wants to file on their own”', 'Raise the minimum DIY clicks to 2', 'Show the member list and the count'],
    back: 'The audience is defined once, from first-party behavior, and the count is always current.' },
  { n: 5, short: 'Real-time event', title: 'A click changes the audience', time: '10:30–13:30', act: 'Capability 2 · Real-time segmentation', rfp: '2',
    warn: 'ODP ingests events asynchronously, so the new event can take from seconds to a few minutes to appear. If it has not shown after 30 seconds, say so and move on: do not wait on stage.',
    prep: ['This sends ONE real event to ODP for a synthetic profile', 'Pick a profile with no DIY clicks yet', 'If the pill says Sample data, no event is actually sent'],
    tell: 'Watch one client. She has not started filing on her own. She clicks “Keep filing on my own” on the home page. That event goes to ODP, lands on her profile, and she enters the audience.',
    show: ['Pick a profile that has not clicked DIY', 'Press the CTA on the mock home page', 'Watch the event arrive in her timeline and the audience count change'],
    back: 'The event, the profile and the audience are the same system, so there is no nightly batch between a click and an audience.' },
  { n: 6, short: 'Activate + scale', title: 'Activate everywhere, at peak', time: '13:30–15:00', act: 'Capability 2 · Activation', rfp: '2',
    warn: 'SIMULATED: the destinations and the events-per-second ticker are illustrations. The 5,000 events/sec figure is the RFP’s peak, not a load test we ran. Never present the ticker as measured capacity.',
    prep: ['Connect this to the main prototype’s Scene 8 (DIY Abandoner personalization) if time allows', 'Have the load-test plan ready if they ask how we will prove 5,000/sec'],
    tell: 'The same audience feeds the site, email and paid media. And your RFP sets the bar at 5,000 events a second at peak. We show that as your requirement, and propose to prove it in a load test during the proof of concept.',
    show: ['Turn on the destinations one by one', 'Press Simulate peak: the ticker is labelled simulated', 'Close on the RFP figure'],
    back: 'One audience, many channels, and a clear plan to prove the scale rather than claim it.' },
];
