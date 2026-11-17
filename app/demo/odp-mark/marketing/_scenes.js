/* Speaker-side data for the marketing demo (RFP capabilities 5 and 6): the story clock, what is real in each scene,
   and the TELL / SHOW / TELL BACK script. Used by the presenter window; TIMELINE is also used by the audience
   window for the recap in Scene 10. */

import { C } from './_ui';

export const TIMELINE = [
  ["profile", "Mon 7:45", "Weekend events unified into profiles"],
  ["aud", "Mon 8:05", "Late-season audience built"],
  ["sync", "Mon 8:15", "Audiences scheduled to the ad platforms"],
  ["suppress", "Mon 8:30", "Suppression savings sized"],
  ["attr", "Mon 9:00", "Owned-channel attribution read"],
  ["export", "Mon 9:20", "Week 10 outcomes in the warehouse"],
  ["mmm", "Mon 13:00", "Weekly mix read-out received"],
  ["shift", "Mon 14:00", "Week 12 plan and audiences updated"],
  ["live", "Tue 6:00", "New audiences live in the ad platforms"],
];

export const STATUS = {
  native: { label: "ODP native · synthetic data", bg: C.lf, hint: "Configured in ODP. Everything on screen is synthetic." },
  mixed: { label: "ODP + warehouse", bg: C.blue, hint: "The ODP export is native. The join with spend runs in the customer's or a partner's warehouse." },
  partner: { label: "Partner · simulated", bg: C.n3, hint: "Not an ODP feature. Shown as the partner layer that ODP feeds." },
  math: { label: "Illustrative math", bg: C.n2, hint: "A calculator with synthetic inputs, not a product screen." },
  slides: { label: "Slides", bg: C.n2, hint: "Slides, not software." },
};

export const SCENES = [
  {
    n: 1, short: "Opening", title: "Opening: one question, asked 16 times", time: "00:00–04:00", status: "slides",
    prep: ["Say “your RFP describes”, not “you run”", "Pen ready for their answer to the Monday question (type it below)"],
    tell: "Your RFP asks for weekly MMM updates through a compact 16-week season, and privacy-safe activation of first-party audiences in paid media. We read that as one question asked 16 times: how fast does last week's truth become this week's spend?",
    show: ["Slide 1: read the two RFP quotes, then the weekly-pace line (our arithmetic)", "Slide 2: let the reframe sit", "Slide 3: ask the Monday question and type their answer"],
    back: "Watch for three things: one profile feeds both measurement and activation; audiences reach the ad platforms without a list upload; every read-out turns into action within a day.",
  },
  {
    n: 2, short: "One profile", title: "ODP in one profile: Taylor's weekend", time: "04:00–08:00", status: "native", stamp: "profile",
    warn: "The event-rate chart is simulated. Do not present it as an ODP benchmark: throughput against the 5,000 events/sec requirement is still being confirmed in writing.",
    prep: ["Three disconnected records showing", "Event-rate chart at Saturday morning"],
    tell: "Everything starts with one profile per client. ODP collects first-party signals from the site, the app, email and SMS, and stitches them together. The client who opened Friday's email and the one who started a return in the app on Sunday are the same person.",
    show: ["Point at the three disconnected records", "Stream the weekend's events and watch them merge into Taylor's profile", "Point at the event-rate chart and the 5,000/sec line from the RFP"],
    back: "One durable profile, built from data H&R Block owns. That profile is the input to everything that follows.",
  },
  {
    n: 3, short: "Build an audience", title: "Build an audience in plain terms", time: "08:00–12:00", status: "native", stamp: "aud",
    prep: ["Audience builder empty", "Clip C1 ready"],
    tell: "Priya doesn't file a ticket for a list. She describes the people she wants in plain terms.",
    show: ["Paste C1", "Estimate the size, then save", "Point at the audience list and the consent guardrail"],
    back: "Audiences are built from behavior and consent, and they refresh as profiles change. Nobody rebuilds a list on Monday morning.",
  },
  {
    n: 4, short: "Activate to paid", title: "Send audiences to paid media without a list upload", time: "12:00–17:00", status: "native", stamp: "sync",
    warn: "Google and Facebook segment syncs are documented as daily. The run here is sped up. Do not promise real-time paid activation.",
    prep: ["Audience “Filed this season” selected", "All destinations off"],
    tell: "Now the same audience goes where the money is. No CSV export, no upload, no agency handoff.",
    show: ["Toggle Google and Facebook on for “Filed this season”, then “Started, not finished”", "Run the sync (sped up) and narrate the steps", "Open Google Ads and Meta to see the segments", "Ad preview: who sees what"],
    back: "Native connectors for Google, Meta, TikTok, Snapchat, Criteo and Adobe Ads. Matching uses first-party identifiers such as email or phone, not third-party cookies.",
  },
  {
    n: 5, short: "Suppression math", title: "The quickest win: stop paying to reach people who already filed", time: "17:00–20:00", status: "math", stamp: "suppress",
    prep: ["Ask whether they will share real CPM and frequency; otherwise keep the defaults"],
    tell: "By Week 11 millions of clients have already filed. Every acquisition impression they see is spend that could reach someone who hasn't.",
    show: ["Set the sliders to their numbers if they share them", "Apply suppression and watch the impression mix change", "Point at the redirected spend"],
    back: "The value depends on how fresh the filed list is. A daily refresh keeps it close to reality.",
  },
  {
    n: 6, short: "Attribution", title: "The microscope: owned-channel attribution", time: "20:00–24:00", status: "native", stamp: "attr",
    warn: "These are rule-based models (Linear, First, Last, First and Last, Time Decay), not algorithmic attribution. They cover ODP-orchestrated touchpoints.",
    prep: ["Attribution report on the Last model"],
    tell: "First lens: the microscope. For the journeys ODP orchestrates, which touchpoints actually lead to a filed return?",
    show: ["Start on Last, then switch to Linear and Time Decay", "Point at how email's credit changes", "Say what it does not cover: TV and paid media need the mix model"],
    back: "Five models in ODP Attribution Reports. Rule-based and fast, and scoped to the channels ODP runs.",
  },
  {
    n: 7, short: "Feed the model", title: "The telescope: feed the weekly mix model", time: "24:00–28:00", status: "mixed", stamp: "export",
    warn: "ODP does not ingest media spend or impressions natively. That data reaches the warehouse from agencies or the platforms. The request body shown is simplified.",
    prep: ["Clip C2 ready", "Warehouse worksheet open"],
    tell: "Second lens: the telescope. A mix model needs clean weekly outcomes. ODP delivers them to the warehouse, where they meet spend and impressions.",
    show: ["Paste C2 and start the export", "Point at the S3 path and the Parquet format", "Run the warehouse query that joins outcomes with spend"],
    back: "ODP exports customers and events to Amazon S3 as CSV or Parquet. The join with spend runs in your warehouse or your MMM partner's.",
  },
  {
    n: 8, short: "Mix read-out", title: "The weekly mix read-out (partner layer)", time: "28:00–33:00", status: "partner", stamp: "mmm",
    warn: "SIMULATED partner screen. MMM is not an ODP feature. Say so before walking through it. The Mark summary here is simulated too.",
    prep: ["Point at the SIMULATED badge first"],
    tell: "This screen is the partner layer, not ODP. It's here so you can see what ODP's data makes possible.",
    show: ["Contribution share vs spend share", "Saturation curves: search has room, social is flat", "Calibration line: experiment lift from Optimizely Analytics", "Ask Mark to summarize"],
    back: "Weekly MMM runs in a partner tool or your warehouse. ODP makes it faster and more accurate by delivering clean first-party outcomes every week.",
  },
  {
    n: 9, short: "Act the same day", title: "Act on the read-out the same day", time: "33:00–37:00", status: "native", stamp: "live",
    warn: "Budget moves happen in the ad platforms or with the agency. ODP changes the audiences.",
    prep: ["Week 12 plan on current mix"],
    tell: "A read-out is only worth something when it changes Tuesday's spend.",
    show: ["Apply the recommendation and watch the mix move", "Watch the audience actions tick through in ODP", "Run tonight's sync and point at Tue 6:00", "Point at the season strip: cycle 11 of 16"],
    back: "Read-out at 1 pm, audiences updated by 2 pm, live in the platforms after the overnight sync. Sixteen times a season.",
  },
  {
    n: 10, short: "Recap", title: "Recap: Priya's Monday", time: "37:00–39:00", status: "slides",
    prep: ["Their answer to the Monday question typed in (it shows on screen)"],
    tell: "Let's replay the day.",
    show: ["Replay the timeline", "Read back the three things", "Quote their answer from the opening"],
    back: "That gap between their answer and Tuesday 6:00 is what we close.",
  },
  {
    n: 11, short: "Fit, trust, next step", title: "Who does what, trust and the next step", time: "39:00–45:00", status: "slides",
    prep: ["Fit table, trust list, next step"],
    tell: "Straight talk: where ODP leads, where it extends, and where a partner plugs in.",
    show: ["Walk the fit table and filter it", "Trust: only confirmed statements", "Propose the scoped proof of concept"],
    back: "Next step: one suppression audience to Google and Meta, and one weekly export feeding your MMM, measured on time from read-out to live audience.",
  },
];
