'use client';

import React, { useState, useEffect, useCallback, useRef } from "react";
import { C, FONT_CSS, Btn, Pill, Eyebrow } from "./_ui";
import { SCENES, TIMELINE } from "./_scenes";
import { openChannel, PRESENTER_URL, PRESENTER_WINDOW } from "./_sync";

/* =====================================================================
   H and R Block · "Monday of Week 11" · ODP clickable demo
   Capability 5 (Marketing Measurement and Attribution) and
   Capability 6 (Paid Media Activation and First-Party Data Collaboration).
   Same pattern as /demo/prototype: scenes, simulated product screens,
   paste clips and a story clock. This window is the one you screen-share and shows only what the audience
   should see; presenter notes, the scene list, reset and the typed answer live in the presenter window
   (_presenter.jsx), opened with S. Scene script: _scenes.js. Window link: _sync.js.
   All profiles, audiences, volumes and results are SYNTHETIC.
   ===================================================================== */

const BRAND = "H&R Block";

/* H and R Block palette, used only inside H and R Block ad previews */
const HRB = { green: "#005D1F", dark: "#003512", sand: "#F6F4E9", neon: "#00E95C" };

const LOGO_SVG = "<svg id=\"Optimizely_Primary_Logo_Medium\" data-name=\"Optimizely Primary Logo Medium\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 740 254\"> <path fill=\"#abff44\" d=\"M267.653,62.0583h-27.0992v18.9211h-9.5222v19.6536h9.5222v38.9407c0,14.2815,6.1031,20.1418,20.1417,20.1418h17.5784v-19.6536h-7.5691c-2.0752,0-3.0518-.7324-3.0518-2.8075v-36.6215h10.6208v-19.6536h-10.6208v-18.9211Z\"/> <path fill=\"#abff44\" d=\"M396.0726,79.6367c-7.2029,0-14.0386,2.8076-19.7755,8.6665-2.6866-6.2251-7.9354-8.6665-15.6254-8.6665-6.5928,0-12.8179,2.8076-18.3108,8.6665v-7.3237h-25.7566v78.7361h27.0992v-57.8619c.8545-1.2206,2.4413-1.953,4.3943-1.953,2.6854,0,3.9061,1.0985,3.9061,3.906v55.9089h27.1006v-57.8619c.8544-1.2206,2.4412-1.953,4.3943-1.953,2.6853,0,3.906,1.0985,3.906,3.906v55.9089h27.0994v-59.8149c0-13.5503-6.4694-20.2639-18.4316-20.2639Z\"/> <path fill=\"#abff44\" d=\"M300.4906,54.7346h-6.2264c-6.2252,0-10.8636,4.8826-10.8636,10.9856,0,5.9812,4.6384,10.9871,10.8636,10.9871h6.2264c6.2253,0,10.8638-5.0059,10.8638-10.9871,0-6.103-4.6384-10.9856-10.8638-10.9856Z\"/> <rect fill=\"#abff44\" x=\"283.8888\" y=\"80.9795\" width=\"27.0994\" height=\"78.736\"/> <path fill=\"#abff44\" d=\"M202.7116,79.5146c-6.8357,0-12.3297,3.1737-16.2358,8.7886-.1221-2.6853-.3661-5.1266-.6102-7.3237h-26.4891c.2441,6.1031.3662,12.0842.3662,18.1887v85.3274h27.0994v-29.9067c4.0281,4.1501,9.156,6.3472,15.2593,6.3472,17.3342,0,27.0994-14.7708,27.0994-40.2834,0-25.8787-9.521-41.1379-26.489-41.1379ZM193.7997,141.5267c-4.8826-.1219-7.5681-7.8134-7.5681-20.63,0-12.9399,2.6855-21.4844,7.5681-21.4844,5.0057-.1221,7.8132,8.4224,7.8132,21.4844,0,12.6947-2.8075,20.5081-7.8132,20.63Z\"/> <path fill=\"#abff44\" d=\"M112.0121,60.2274c-25.8788,0-42.6028,19.4093-42.6028,50.0486,0,31.1288,16.724,50.7821,42.6028,50.7821,25.7578,0,42.4805-19.6533,42.4805-50.7821,0-30.6393-16.7227-50.0486-42.4805-50.0486ZM111.89,138.2311c-7.6901,0-12.8167-10.7428-12.8167-27.9551,0-16.724,5.1266-27.2214,12.8167-27.2214,7.5691,0,12.8179,10.4974,12.8179,27.2214,0,17.2123-5.2488,27.9551-12.8179,27.9551Z\"/> <rect fill=\"#abff44\" x=\"420.1205\" y=\"80.9795\" width=\"27.0994\" height=\"78.736\"/> <path fill=\"#abff44\" d=\"M654.7404,103.5625l-2.8074,21.6064-3.2959-21.2402-4.8826-22.9492h-27.5876l22.2168,78.4919-.7322,3.1736c-.2441,1.3428-1.2207,2.0751-2.4414,2.0751h-14.8928v19.7755h19.2871c13.427,0,20.1418-5.859,23.4375-18.5549l22.0947-84.9612h-26.3669l-4.0293,22.583Z\"/> <rect fill=\"#abff44\" x=\"583.9397\" y=\"62.0583\" width=\"27.0994\" height=\"97.6571\"/> <path fill=\"#abff44\" d=\"M544.6327,79.5146c-21.8506,0-36.3774,16.1138-36.3774,40.7717,0,25.1465,14.0386,40.7717,36.2554,40.7717,18.5549,0,31.739-12.3296,33.9363-29.908h-26.8564c-.9766,6.8368-4.1503,10.8649-7.8123,10.8649-5.0045,0-7.812-6.1031-8.3003-16.8461h43.213c3.0516-26.6111-11.109-45.6543-34.0582-45.6543ZM535.4779,110.5201c1.3428-7.568,4.5164-12.0844,8.5444-12.0844s6.9578,4.3943,8.1783,12.0844h-16.7228Z\"/> <polygon fill=\"#abff44\" points=\"505.692 99.9006 505.692 80.9795 452.8347 80.9795 452.8347 100.6331 475.9072 100.6331 452.8347 141.6488 452.8347 159.7156 506.1802 159.7156 506.1802 140.062 483.109 140.062 505.692 99.9006\"/> <path fill=\"#abff44\" d=\"M436.7223,54.7346h-6.2264c-6.2252,0-10.8636,4.8826-10.8636,10.9856,0,5.9812,4.6384,10.9871,10.8636,10.9871h6.2264c6.2253,0,10.8636-5.0059,10.8636-10.9871,0-6.103-4.6383-10.9856-10.8636-10.9856Z\"/> <path fill=\"#0d3a29\" d=\"M685.1366,76.3411h-26.3669c-1.7087,0-2.5632.4883-3.4177,1.3428l-6.1045,6.3472-.8545-4.0281c-.6104-2.4412-2.197-3.6619-4.6384-3.6619h-28.0759v-14.2827c0-2.6853-2.3203-4.7605-4.6395-4.7605h-27.0994c-1.4647,0-2.4413.6104-3.2958,1.4648l-14.7709,14.7698c-.7323.7335-1.3427,1.9541-1.3427,3.2969v3.2957c-5.2488-3.2957-12.2076-5.3708-19.8977-5.3708-11.8413,0-23.9257,3.9061-33.4478,16.7229l-.7324.9764v-11.474c0-2.3192-2.0752-4.6384-4.7605-4.6384h-57.4957c2.6854-3.1748,3.9061-6.4706,3.9061-10.6208,0-8.9106-6.9578-15.6252-15.9905-15.6252h-5.1279c-4.7604,0-8.6665,1.8308-11.9622,5.1279l-15.8695,15.8682c-1.2206,1.2207-2.1971,2.5634-2.9296,4.0293-1.2207-.1221-2.6853-.2441-4.1501-.2441-6.4706,0-13.062,2.0752-18.677,6.5916-3.9072-4.7605-9.0339-6.5916-15.8694-6.5916-5.4929,0-10.865,1.5869-15.5034,5.3708-.2441-2.8074-1.4647-3.906-4.0281-3.906h-30.0302c2.6854-3.1748,3.9073-6.4706,3.9073-10.6208,0-8.9106-6.959-15.6252-15.9917-15.6252h-5.1278c-4.7605,0-8.6666,1.8308-11.9623,5.1279l-10.3766,10.2533v-3.4178c0-2.4412-2.0751-4.6384-4.7606-4.6384h-27.0992c-1.4647,0-2.5634.6104-3.2958,1.4648l-14.7709,14.6477c-.4883.4894-1.3427,1.9541-1.3427,3.2969v5.0046c-5.1267-4.7605-11.1091-7.0798-18.0667-7.0798-4.5165,0-10.0105,1.4648-13.9165,5.3708-.4883-3.1736-1.5869-3.7839-3.662-3.7839h-26.1229c-1.3427,0-2.4412.4883-3.2957,1.3428l-3.0527,3.0515c-7.8121-16.1136-22.583-25.2684-41.0159-25.2684-12.8168,0-24.1699,4.2723-36.01,15.9904l-9.7664,9.7664c-10.8638,10.8636-16.2357,26.1228-16.2357,43.8232,0,33.448,18.5549,55.5427,47.2423,55.5427,12.8167,0,24.1699-4.7605,32.9585-13.5503l10.1324-10.2534v42.3586c0,2.6853,2.0751,4.7605,4.7605,4.7605h26.9773c1.5868,0,2.6854-.6104,3.4191-1.3428l14.6476-14.7709c.9764-.9766,1.4647-2.0751,1.4647-3.2958v-4.3943c6.5928-.8545,11.9635-3.5398,16.3578-8.1794l13.3063-13.3049c1.5867,13.7932,10.4973,20.5078,26.7332,20.5078h243.4097c1.7089,0,2.6853-.6102,3.4177-1.3427l7.4473-7.5692c7.3237,6.959,16.8459,10.3767,27.5874,10.3767,10.865,0,20.7522-4.1501,27.589-10.9869l7.0797-7.2018v12.0854c0,2.5635,2.0751,4.6384,4.6384,4.6384h33.0817v20.0198c0,2.6853,2.0751,4.7605,4.7605,4.7605h17.9445c8.5444,0,15.7476-2.6854,20.2639-7.2018l14.5269-14.5267c3.4177-3.5399,6.2253-8.5458,7.9341-14.8931l22.0947-85.0833c.8545-3.2958-.7324-5.8591-4.6384-5.8591ZM112.0121,161.0581c-25.8788,0-42.6028-19.6533-42.6028-50.7821,0-30.6393,16.724-50.0486,42.6028-50.0486,25.7578,0,42.4805,19.4093,42.4805,50.0486,0,31.1288-16.7227,50.7821-42.4805,50.7821ZM202.1012,160.936c-6.1033,0-11.2312-2.197-15.2593-6.3472v29.9067h-27.0994v-85.3274c0-6.1045-.1221-12.0856-.3662-18.1887h26.4891c.2441,2.1971.4882,4.6384.6102,7.3237,3.9061-5.6149,9.4001-8.7886,16.2358-8.7886,16.968,0,26.489,15.2593,26.489,41.1379,0,25.5127-9.7651,40.2834-27.0994,40.2834ZM278.2738,100.6331h-10.6208v36.6215c0,2.0751.9766,2.8075,3.0518,2.8075h7.5691v19.6536h-17.5784c-14.0386,0-20.1417-5.8604-20.1417-20.1418v-38.9407h-9.5222v-19.6536h9.5222v-18.9211h27.0992v18.9211h10.6208v19.6536ZM310.9882,159.7155h-27.0994v-78.736h27.0994v78.736ZM300.4906,76.7073h-6.2264c-6.2252,0-10.8636-5.0059-10.8636-10.9871,0-6.103,4.6384-10.9856,10.8636-10.9856h6.2264c6.2253,0,10.8638,4.8826,10.8638,10.9856,0,5.9812-4.6384,10.9871-10.8638,10.9871ZM414.5043,159.7156h-27.0994v-55.9089c0-2.8075-1.2207-3.906-3.906-3.906-1.9531,0-3.5399.7324-4.3943,1.953v57.8619h-27.1006v-55.9089c0-2.8075-1.2207-3.906-3.9061-3.906-1.953,0-3.5398.7324-4.3943,1.953v57.8619h-27.0992v-78.7361h25.7566v7.3237c5.4929-5.8589,11.718-8.6665,18.3108-8.6665,7.6899,0,12.9387,2.4414,15.6254,8.6665,5.7369-5.8589,12.5726-8.6665,19.7755-8.6665,11.9623,0,18.4316,6.7136,18.4316,20.2639v59.8149ZM447.2199,159.7155h-27.0994v-78.736h27.0994v78.736ZM436.7223,76.7073h-6.2264c-6.2252,0-10.8636-5.0059-10.8636-10.9871,0-6.103,4.6384-10.9856,10.8636-10.9856h6.2264c6.2253,0,10.8636,4.8826,10.8636,10.9856,0,5.9812-4.6383,10.9871-10.8636,10.9871ZM506.1802,159.7156h-53.3455v-18.0668l23.0725-41.0157h-23.0725v-19.6536h52.8573v18.9211l-22.583,40.1614h23.0712v19.6536ZM578.6909,125.1689h-43.213c.4883,10.7429,3.2958,16.8461,8.3003,16.8461,3.662,0,6.8357-4.0281,7.8123-10.8649h26.8564c-2.1973,17.5784-15.3813,29.908-33.9363,29.908-22.2168,0-36.2554-15.6252-36.2554-40.7717,0-24.658,14.5269-40.7717,36.3774-40.7717,22.9492,0,37.1099,19.0432,34.0582,45.6543ZM611.0391,159.7155h-27.0994V62.0583h27.0994v97.6571ZM663.0419,165.9407c-3.2957,12.6959-10.0105,18.5549-23.4375,18.5549h-19.2871v-19.7755h14.8928c1.2207,0,2.1973-.7323,2.4414-2.0751l.7322-3.1736-22.2168-78.4919h27.5876l4.8826,22.9492,3.2959,21.2402,2.8074-21.6064,4.0293-22.583h26.3669l-22.0947,84.9612Z\"/> <path fill=\"#0d3a29\" d=\"M544.0223,98.4358c-4.0281,0-7.2017,4.5164-8.5444,12.0844h16.7228c-1.2206-7.6901-4.1503-12.0844-8.1783-12.0844Z\"/> <path fill=\"#0d3a29\" d=\"M193.7997,99.4124c-4.8826,0-7.5681,8.5444-7.5681,21.4844,0,12.8167,2.6855,20.5081,7.5681,20.63,5.0057-.1219,7.8132-7.9353,7.8132-20.63,0-13.062-2.8075-21.6064-7.8132-21.4844Z\"/> <path fill=\"#0d3a29\" d=\"M111.89,83.0546c-7.6901,0-12.8167,10.4974-12.8167,27.2214,0,17.2123,5.1266,27.9551,12.8167,27.9551,7.5691,0,12.8179-10.7428,12.8179-27.9551,0-16.724-5.2488-27.2214-12.8179-27.2214Z\"/> </svg>";


/* ---------------------------- synthetic data ---------------------------- */
const RECORDS = [
  { src: "Email", id: "taylor.r@example.com", d: "Opened “Your documents checklist”" },
  { src: "Web (anonymous)", id: "vuid 7f3a-91c2", d: "Viewed pricing, then signed in to MyBlock" },
  { src: "App", id: "app user 88412", d: "Started a DIY return, did not finish" },
];

const EVENTS = [
  { t: "Fri 18:02", ch: "Email", e: "email_open · Your documents checklist" },
  { t: "Fri 18:04", ch: "Web", e: "pageview · /pricing (anonymous)" },
  { t: "Sat 10:41", ch: "Web", e: "login · MyBlock (anonymous visitor identified)" },
  { t: "Sun 21:15", ch: "App", e: "return_started · DIY online" },
  { t: "Sun 21:38", ch: "App", e: "session_end · return not finished" },
  { t: "Mon 07:30", ch: "SMS", e: "sms_delivered · consent: opted in" },
];

const VOLUME = Array.from({ length: 48 }, (_, i) =>
  Math.round(700 + 3900 * Math.exp(-Math.pow((i - 41) / 4.5, 2)) + 1300 * Math.exp(-Math.pow((i - 19) / 5, 2)) + ((i * 37) % 11) * 35)
);

const RULES_C1 = [
  { join: "", field: "Event · return_started", op: "occurred", value: "in the last 14 days" },
  { join: "AND", field: "Event · return_filed", op: "did not occur", value: "this season" },
  { join: "AND", field: "Consent · marketing", op: "is", value: "opted in" },
];

const BASE_AUDIENCES = [
  { k: "lapsed", name: "TS27 · Last year's clients, not back yet", size: 6120440, use: "Win back" },
  { k: "filed", name: "TS27 · Filed this season", size: 11804117, use: "Suppress" },
  { k: "hv", name: "TS27 · High-value clients", size: 1206553, use: "Lookalike seed" },
];

const ACT_AUD = [
  { k: "filed", name: "Filed this season", size: 11804117, goal: "Suppress" },
  { k: "started", name: "Started, not finished", size: 2431208, goal: "Re-engage" },
  { k: "lapsed", name: "Last year's clients, not back yet", size: 6120440, goal: "Win back" },
  { k: "hv", name: "High-value clients", size: 1206553, goal: "Lookalike seed" },
];

const DESTS = [
  { k: "google", name: "Google Ads", where: "Search, YouTube, Gmail", match: 0.58 },
  { k: "meta", name: "Facebook (Meta)", where: "Facebook, Instagram, Audience Network", match: 0.64 },
  { k: "tiktok", name: "TikTok", where: "TikTok ads", match: 0.41 },
  { k: "snap", name: "Snapchat", where: "Snapchat ads", match: 0.37 },
  { k: "criteo", name: "Criteo", where: "Retargeting and display", match: 0.52 },
  { k: "adobe", name: "Adobe Ads", where: "Programmatic", match: 0.48 },
];

const SYNC_STEPS = [
  "Audience refreshed in ODP",
  "Match keys prepared (email or phone)",
  "Sent to the selected platforms",
  "Platforms match keys to their users",
  "Segment ready for targeting or exclusion",
];

const ATTR_CHANNELS = ["Email", "SMS", "App push", "Web embed"];
const ATTR_MODELS = [
  { k: "last", name: "Last", desc: "100% of the credit to the last touchpoint before the conversion." },
  { k: "first", name: "First", desc: "100% of the credit to the first touchpoint." },
  { k: "linear", name: "Linear", desc: "Credit split equally across every touchpoint." },
  { k: "firstlast", name: "First and Last", desc: "Credit split equally between the first and last touchpoints." },
  { k: "decay", name: "Time Decay", desc: "More credit to touchpoints closer to the conversion." },
];
const ATTR = {
  last: [18, 41, 22, 19],
  first: [52, 8, 10, 30],
  linear: [34, 22, 16, 28],
  firstlast: [35, 25, 16, 24],
  decay: [24, 33, 20, 23],
};
const ATTR_TOTAL = 418560;

const EXPORT_C2 = `{
  "format": "parquet",
  "objects": ["customers", "events"]
}`;
const EXPORT_FILES = [
  { name: "events/part-0000…0143.parquet", rows: 38214906 },
  { name: "customers/part-0000…0021.parquet", rows: 9602311 },
];
const WH_SQL = `-- Weekly MMM input: ODP outcomes joined with media spend
SELECT s.week,
       SUM(IFF(s.channel = 'tv_streaming', s.spend, 0)) AS tv_streaming,
       SUM(IFF(s.channel = 'paid_search',  s.spend, 0)) AS paid_search,
       SUM(IFF(s.channel = 'paid_social',  s.spend, 0)) AS paid_social,
       SUM(IFF(s.channel = 'programmatic', s.spend, 0)) AS programmatic,
       MAX(o.returns_filed)                             AS returns_filed
FROM   media_spend s
JOIN   odp_weekly_outcomes o ON o.week = s.week
GROUP  BY s.week
ORDER  BY s.week;`;
const WH_ROWS = [
  ["Week 7", "$4.6M", "$2.1M", "$2.4M", "$1.5M", "1,312,880"],
  ["Week 8", "$4.4M", "$2.3M", "$2.3M", "$1.5M", "1,198,410"],
  ["Week 9", "$4.3M", "$2.5M", "$2.2M", "$1.5M", "1,064,227"],
  ["Week 10", "$4.2M", "$2.6M", "$2.1M", "$1.5M", "987,560"],
];

const MMM = [
  { name: "TV and streaming", spend: 4.2, contrib: 31, roi: 0.9, curve: { a: 34, k: 3.2 } },
  { name: "Paid search", spend: 2.6, contrib: 29, roi: 1.4, curve: { a: 52, k: 4.6 } },
  { name: "Paid social", spend: 2.1, contrib: 11, roi: 0.6, curve: { a: 13, k: 0.9 } },
  { name: "Programmatic and CTV", spend: 1.5, contrib: 9, roi: 0.7, curve: { a: 14, k: 1.6 } },
  { name: "Owned (email, SMS)", spend: 0.4, contrib: 20, roi: 6.1, curve: null },
];
const MMM_COLORS = [C.lf, C.go, C.e6, C.blue, C.fir];
const MMM_SUMMARY =
  "Week 10 read-out (simulated): paid search is still on the steep part of its curve, while paid social has flattened. Recommendation: move about $0.3M a week from paid social to paid search for Week 12, hold TV, and keep the filed-client suppression on every platform. Owned channels punch far above their spend, so keep the started-not-finished journey running. Model calibrated against this season's experiment lift.";

const REC_MIX = { current: [4.2, 2.6, 2.1, 1.5, 0.4], next: [4.2, 2.9, 1.8, 1.5, 0.4] };
const AUD_ACTIONS = [
  "Started, not finished · add Google and Meta (re-engage)",
  "Filed this season · extend suppression to TikTok and Snapchat",
  "High-value clients · refresh the lookalike seed on Meta",
];

const ROLES = [
  { cap: "Collect web, app, email and SMS events into profiles", o: "ODP" },
  { cap: "Unified customer profiles and audiences", o: "ODP" },
  { cap: "Attribution reports (Linear, First, Last, First and Last, Time Decay)", o: "ODP" },
  { cap: "Cross-channel performance for owned channels", o: "ODP" },
  { cap: "Export customers and events to Amazon S3 (CSV or Parquet)", o: "ODP" },
  { cap: "Audience sync to Google, Meta, TikTok, Snapchat, Criteo, Adobe Ads", o: "ODP" },
  { cap: "Server-side conversion feeds (e.g. Meta CAPI, Google Enhanced Conversions)", o: "Extend" },
  { cap: "Ad platforms beyond the native connectors", o: "Extend" },
  { cap: "Media spend and impression data in the warehouse", o: "Partner" },
  { cap: "Weekly media mix modeling", o: "Partner" },
  { cap: "Data clean room collaboration", o: "Partner" },
  { cap: "High-volume media tag and pixel delivery (7,000/sec peak)", o: "Partner" },
];
const OWNER = {
  ODP: { label: "ODP native", bg: C.lf },
  Extend: { label: "ODP + extension", bg: C.blue },
  Partner: { label: "Partner / warehouse", bg: C.n3 },
};
const TRUST = [
  ["ODP · U.S. region hosting", "Documented", C.lf],
  ["Audiences from behavior and consent only (IRC 7216)", "Design principle", C.blue],
  ["ODP sustained and peak ingestion vs 5,000 events/sec", "Confirming in writing", C.n3],
  ["Backups, logs, metadata and personnel access in the U.S.", "Confirming in writing", C.n3],
  ["IRC 7216 contractual position", "Confirming in writing", C.n3],
  ["ODP SOC 2 attestation", "Confirming in writing", C.n3],
];

/* ---------------------------- helpers ---------------------------- */
const fmt = (n) => Math.round(n).toLocaleString("en-US");
const money = (n) => "$" + fmt(n);

function useTypewriter(text, run, step = 3, speed = 14) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) { setN(0); return undefined; }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + step)), speed);
    return () => clearInterval(id);
  }, [run, text, step, speed]);
  return text.slice(0, n);
}

function useCountUp(target, run, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) { setV(0); return undefined; }
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [target, run, ms]);
  return v;
}

function Frame({ url, label, children }) {
  return (
    <div className="overflow-hidden rounded-[32px] border-2 border-[#08251A] bg-white">
      <div className="flex items-center gap-2 border-b-2 border-[#08251A] bg-[#E4F0DA] px-4 py-2">
        <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#08251A] bg-[#ABFF44]" />
        <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#08251A] bg-[#91DBDA]" />
        <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#08251A] bg-white" />
        <div className="f-m ml-2 min-w-0 flex-1 truncate rounded-full border-2 border-[#08251A] bg-white px-3 py-0.5 text-[11px] text-[#08251A]">{url}</div>
        {label && <span className="f-sub hidden shrink-0 text-xs text-[#08251A] sm:inline">{label}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#E4F0DA] border-t-[#08251A] align-middle" />;
}

function Check({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.fir} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

function StepDot({ state, n }) {
  const bg = state === "done" ? "bg-[#ABFF44]" : state === "now" ? "odp-pulse bg-[#91DBDA]" : "bg-[#EFF6E9]";
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#08251A] ${bg}`}>
      {state === "done" ? <Check /> : <span className="f-m text-[11px] text-[#08251A]">{n}</span>}
    </span>
  );
}

function Toggle({ on, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className={`relative h-7 w-12 shrink-0 rounded-full border-2 border-[#08251A] transition-colors ${on ? "bg-[#3AB533]" : "bg-[#EFF6E9]"}`}
    >
      <span className={`absolute top-[2px] h-5 w-5 rounded-full border-2 border-[#08251A] bg-white transition-all ${on ? "left-[22px]" : "left-[2px]"}`} />
    </button>
  );
}

function Extrude({ children }) {
  const layers = [C.e8, C.e6, C.e4, C.e3];
  const step = 0.045;
  return (
    <span className="relative inline-block" style={{ marginLeft: `${step * 4}em` }}>
      {layers.map((col, i) => {
        const k = layers.length - i;
        return (
          <span key={col} aria-hidden="true" className="absolute left-0 top-0" style={{ color: col, WebkitTextStroke: `1.5px ${C.fir}`, paintOrder: "stroke fill", transform: `translate(${-k * step}em, ${k * step}em)` }}>
            {children}
          </span>
        );
      })}
      <span className="relative" style={{ color: C.lf, WebkitTextStroke: `1.5px ${C.fir}`, paintOrder: "stroke fill" }}>{children}</span>
    </span>
  );
}

function Slide({ children }) {
  return <div className="rounded-[32px] border-2 border-[#08251A] bg-[#08251A] px-8 py-10 text-white md:px-12 md:py-12">{children}</div>;
}

/* ---------------------------- Scene 1 ---------------------------- */
function S1() {
  const [slide, setSlide] = useState(0);
  return (
    <div className="space-y-4">
      <Slide>
        {slide === 0 && (
          <div className="odp-in space-y-8">
            <div>
              <p className="f-m text-xs uppercase text-[#ABFF44]">{BRAND} · Integrated marketing RFP · What you told us</p>
              <h1 className="f-h mt-3 text-5xl md:text-6xl">Sixteen decision cycles. Every one has to move real <Extrude>budget</Extrude>.</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["“Required: weekly MMM updates throughout a compact 16-week season”", "Your RFP · capability 5", C.lf],
                ["“Privacy-safe activation of first-party audiences in paid media environments”", "Your RFP · capability 6", C.lf],
                ["One read-out, one decision, every 7 days", "Our arithmetic: 16 cycles ÷ 16 weeks", C.blue],
              ].map(([q, src, bg]) => (
                <div key={q} className="rounded-[32px] border-2 border-[#08251A] p-6 text-[#08251A]" style={{ background: bg }}>
                  <p className="f-h3 text-2xl">{q}</p>
                  <p className="f-m mt-4 text-[11px] uppercase">{src}</p>
                </div>
              ))}
            </div>
            <p className="f-b text-xs text-[#E4F0DA]">Quotes from the {BRAND} RFP slide “Integrated Marketing Scale and Requirements”. The weekly pace is our arithmetic. The demo that follows uses synthetic data.</p>
          </div>
        )}
        {slide === 1 && (
          <div className="odp-in space-y-6">
            <h2 className="f-h text-5xl md:text-6xl">The model isn't the bottleneck.</h2>
            <p className="f-b max-w-3xl text-2xl text-[#E4F0DA]">Time is. How fast last week's outcomes reach the model, and how fast the model's decisions reach the ad platforms.</p>
            <div className="flex flex-wrap gap-3">
              {["16-week season (your RFP)", "44.5M profiles (your RFP)", "1 missed cycle ≈ 6% of the season (1 ÷ 16, our arithmetic)"].map((x) => (
                <span key={x} className="f-m rounded-full border-2 border-[#08251A] bg-[#ABFF44] px-4 py-1.5 text-xs uppercase text-[#08251A]">{x}</span>
              ))}
            </div>
          </div>
        )}
        {slide === 2 && (
          <div className="odp-in space-y-6">
            <div>
              <p className="f-m text-xs uppercase text-[#ABFF44]">One question before we start</p>
              <h2 className="f-h2 mt-2 text-3xl md:text-4xl">When Monday's read-out says “move budget to search and stop paying for people who already filed”, when do Google and Meta know, and who has to touch it?</h2>
            </div>
            <div className="rounded-[32px] border-2 border-[#08251A] bg-[#E4F0DA] p-6 text-[#08251A]">
              <Eyebrow>The story we will follow</Eyebrow>
              <p className="f-b mt-2 text-lg">Monday of Week 11, early April. Priya runs media and measurement. By the end of the day she needs last week's outcomes in the model, this week's mix decided, and the right audiences in every ad platform.</p>
              <p className="f-b mt-2 text-xs">Everything you will see is a demo build with synthetic data, not {BRAND} data.</p>
            </div>
            <div>
              <p className="f-sub mb-2 text-[#ABFF44]">Watch for three things</p>
              <ol className="f-b space-y-2 text-lg">
                <li>1. One first-party profile feeds both measurement and activation.</li>
                <li>2. Audiences reach Google and Meta without a list upload.</li>
                <li>3. Each weekly read-out turns into action within a day.</li>
              </ol>
            </div>
          </div>
        )}
      </Slide>
      <div className="flex items-center justify-center gap-3">
        <Btn kind="ghost" onClick={() => setSlide(Math.max(0, slide - 1))} disabled={slide === 0}>‹ Slide</Btn>
        {[0, 1, 2].map((i) => (
          <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} className={`h-3 w-3 rounded-full border-2 border-[#08251A] ${slide === i ? "bg-[#3AB533]" : "bg-white"}`} />
        ))}
        <Btn kind="ghost" onClick={() => setSlide(Math.min(2, slide + 1))} disabled={slide === 2}>Slide ›</Btn>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 2 ---------------------------- */
function VolumeChart({ upto }) {
  const W = 560;
  const H = 190;
  const max = 6000;
  const pts = VOLUME.slice(0, Math.max(2, upto)).map((v, i) => [(i / (VOLUME.length - 1)) * W, H - (v / max) * H]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H} L0,${H} Z`;
  const yReq = H - (5000 / max) * H;
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full" role="img" aria-label="Simulated events per second over the weekend">
      <line x1="0" x2={W} y1={yReq} y2={yReq} stroke={C.fir} strokeWidth="1.5" strokeDasharray="6 5" />
      <text x={W - 4} y={yReq - 6} textAnchor="end" className="f-m" fontSize="11" fill={C.fir}>RFP peak requirement · 5,000/sec</text>
      <path d={area} fill={C.lf} />
      <path d={line} fill="none" stroke={C.fir} strokeWidth="2" />
      <line x1="0" x2={W} y1={H} y2={H} stroke={C.fir} strokeWidth="2" />
      {[["Sat 00:00", 0], ["Sat 12:00", 12], ["Sun 00:00", 24], ["Sun 12:00", 36]].map(([l, i]) => (
        <text key={l} x={(i / (VOLUME.length - 1)) * W + 2} y={H + 16} className="f-m" fontSize="10" fill={C.fir}>{l}</text>
      ))}
    </svg>
  );
}

function S2({ stamp }) {
  const [phase, setPhase] = useState("split");
  const [shown, setShown] = useState(0);
  const [cursor, setCursor] = useState(12);

  useEffect(() => {
    if (phase !== "streaming") return undefined;
    const a = setInterval(() => setShown((n) => n + 1), 650);
    const b = setInterval(() => setCursor((c) => Math.min(VOLUME.length, c + 1)), 105);
    return () => { clearInterval(a); clearInterval(b); };
  }, [phase]);

  useEffect(() => {
    if (phase === "streaming" && shown >= EVENTS.length) {
      setPhase("merged");
      setCursor(VOLUME.length);
      stamp("profile");
    }
  }, [shown, phase, stamp]);

  const now = VOLUME[Math.max(0, cursor - 1)];
  const peak = Math.max(...VOLUME.slice(0, cursor));

  return (
    <div className="grid gap-5 xl:grid-cols-5">
      <div className="xl:col-span-3">
        <Frame url="app.odp.optimizely.com/customers/profiles/taylor-r" label="ODP · Customer profile">
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="f-h3 text-xl text-[#08251A]">{phase === "merged" ? "One client, one profile" : "Three systems, three strangers"}</p>
              <Btn onClick={() => { setShown(0); setCursor(12); setPhase("streaming"); }} disabled={phase !== "split"}>
                {phase === "streaming" ? <><Spinner /> Streaming events</> : phase === "merged" ? "Profile unified" : "Stream the weekend's events"}
              </Btn>
            </div>

            {phase !== "merged" ? (
              <div className="grid gap-3 md:grid-cols-3">
                {RECORDS.map((r, i) => (
                  <div key={r.id} className="rounded-[24px] border-2 border-[#08251A] bg-[#EFF6E9] p-4 transition-all duration-500" style={{ opacity: phase === "streaming" ? Math.max(0.35, 1 - shown * 0.12) : 1, transform: phase === "streaming" ? `translateX(${(1 - i) * Math.min(shown, 5) * 6}px)` : "none" }}>
                    <Eyebrow>{r.src}</Eyebrow>
                    <p className="f-sub mt-1 break-all text-sm text-[#08251A]">{r.id}</p>
                    <p className="f-b mt-1 text-sm text-[#08251A]">{r.d}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="odp-in grid gap-4 rounded-[24px] border-2 border-[#08251A] bg-[#ABFF44] p-5 md:grid-cols-3">
                <div className="flex items-center gap-3 md:col-span-3">
                  <span className="f-h flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#08251A] bg-white text-2xl text-[#08251A]">TR</span>
                  <div>
                    <p className="f-h3 text-2xl text-[#08251A]">Taylor R. <span className="f-m text-xs">(synthetic)</span></p>
                    <p className="f-b text-sm text-[#08251A]">Returning client · assisted last season · English</p>
                  </div>
                </div>
                <div>
                  <Eyebrow>Identifiers</Eyebrow>
                  <ul className="f-b mt-1 space-y-0.5 text-sm text-[#08251A]">
                    <li>taylor.r@example.com</li><li>app user 88412</li><li>vuid 7f3a-91c2</li><li>+1 (555) 010-2231</li>
                  </ul>
                </div>
                <div>
                  <Eyebrow>Consent</Eyebrow>
                  <ul className="f-b mt-1 space-y-0.5 text-sm text-[#08251A]"><li>Email · opted in</li><li>SMS · opted in</li></ul>
                </div>
                <div>
                  <Eyebrow>Right now</Eyebrow>
                  <ul className="f-b mt-1 space-y-0.5 text-sm text-[#08251A]"><li>Return started Sun 21:15</li><li>Not finished</li><li>Audience: Started, not finished</li></ul>
                </div>
              </div>
            )}

            <div className="rounded-[24px] border-2 border-[#08251A] p-4">
              <Eyebrow>Event timeline</Eyebrow>
              <ol className="mt-2 space-y-1.5">
                {EVENTS.slice(0, phase === "merged" ? EVENTS.length : shown).map((e) => (
                  <li key={e.t} className="odp-in flex items-center gap-3">
                    <span className="f-m w-20 shrink-0 text-[11px] text-[#08251A]">{e.t}</span>
                    <Pill bg={C.n3}>{e.ch}</Pill>
                    <span className="f-b text-sm text-[#08251A]">{e.e}</span>
                  </li>
                ))}
                {phase === "split" && <li className="f-b text-sm text-[#08251A] opacity-60">No events streamed yet.</li>}
              </ol>
            </div>
          </div>
        </Frame>
      </div>

      <div className="space-y-5 xl:col-span-2">
        <Frame url="app.odp.optimizely.com/data-setup/event-volume" label="ODP · Event volume">
          <div className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Eyebrow>Events per second · weekend</Eyebrow>
                <p className="f-h mt-1 text-5xl text-[#08251A]">{fmt(now)}</p>
              </div>
              <div className="text-right">
                <Pill bg={C.n3}>Simulated traffic</Pill>
                <p className="f-m mt-2 text-[11px] text-[#08251A]">PEAK SO FAR · {fmt(peak)}</p>
              </div>
            </div>
            <VolumeChart upto={cursor} />
          </div>
        </Frame>
        <div className="rounded-[32px] border-2 border-[#08251A] bg-white p-5">
          <Eyebrow>Connected first-party sources (illustrative)</Eyebrow>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Web SDK", "Mobile SDK", "ODP email and SMS", "Salesforce CRM sync", "Warehouse sync (Hightouch)"].map((s) => (
              <Pill key={s} bg={C.n2}>{s}</Pill>
            ))}
          </div>
          <p className="f-b mt-3 text-sm text-[#08251A]">44.5M profiles in the foundation (your RFP). No third-party cookies involved.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 3 ---------------------------- */
function S3({ stamp }) {
  const [name, setName] = useState("");
  const [rules, setRules] = useState([]);
  const [sized, setSized] = useState(false);
  const [saved, setSaved] = useState(false);
  const count = useCountUp(2431208, sized, 1400);
  const ready = name && rules.length > 0;
  const counted = sized && count >= 2431208;

  const save = () => { setSaved(true); stamp("aud"); };
  const list = saved ? [{ k: "started", name, size: 2431208, use: "Re-engage", fresh: true }, ...BASE_AUDIENCES] : BASE_AUDIENCES;

  return (
    <div className="grid gap-5 xl:grid-cols-5">
      <div className="xl:col-span-3">
        <Frame url="app.odp.optimizely.com/customers/audiences/new" label="ODP · Audience builder">
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="f-h3 text-xl text-[#08251A]">New audience</p>
              <Btn kind="paste" onClick={() => { setName("TS27 · Started, not finished"); setRules(RULES_C1); setSized(false); }} disabled={saved}>Paste C1</Btn>
            </div>
            <label className="block">
              <Eyebrow>Audience name</Eyebrow>
              <input value={name} onChange={(e) => setName(e.target.value)} disabled={saved} className="f-b mt-1 w-full rounded-full border-2 border-[#08251A] px-4 py-2 text-[#08251A] disabled:bg-[#EFF6E9]" placeholder="Name this audience" />
            </label>
            <div>
              <Eyebrow>Include customers where</Eyebrow>
              <div className="mt-2 space-y-2">
                {rules.length === 0 && <div className="f-b rounded-[24px] border-2 border-dashed border-[#08251A] p-4 text-sm text-[#08251A] opacity-70">Add a condition: behavior, attribute or consent.</div>}
                {rules.map((r) => (
                  <div key={r.field} className="odp-in flex flex-wrap items-center gap-2">
                    {r.join && <span className="f-m w-12 text-xs text-[#08251A]">{r.join}</span>}
                    {!r.join && <span className="w-12" />}
                    <span className="f-b rounded-full border-2 border-[#08251A] bg-[#E4F0DA] px-3 py-1 text-sm text-[#08251A]">{r.field}</span>
                    <span className="f-b rounded-full border-2 border-[#08251A] bg-white px-3 py-1 text-sm text-[#08251A]">{r.op}</span>
                    <span className="f-b rounded-full border-2 border-[#08251A] bg-white px-3 py-1 text-sm text-[#08251A]">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 rounded-[24px] border-2 border-[#08251A] bg-[#EFF6E9] p-4">
              <Btn kind="ghost" onClick={() => setSized(true)} disabled={!ready || sized}>Estimate size</Btn>
              <div>
                <p className="f-h text-4xl text-[#08251A]">{sized ? fmt(count) : "—"}</p>
                <p className="f-m text-[11px] text-[#08251A]">PROFILES (SYNTHETIC) · OF 44.5M</p>
              </div>
              <div className="h-3 min-w-[120px] flex-1 overflow-hidden rounded-full border-2 border-[#08251A] bg-white">
                <div className="h-full bg-[#3AB533] transition-all duration-700" style={{ width: sized ? `${(count / 44500000) * 100}%` : "0%" }} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Btn onClick={save} disabled={!counted || saved}>{saved ? "Saved" : "Save audience"}</Btn>
              {saved && <span className="f-b text-sm text-[#08251A]">Saved. It refreshes as profiles change.</span>}
            </div>
          </div>
        </Frame>
      </div>
      <div className="space-y-5 xl:col-span-2">
        <Frame url="app.odp.optimizely.com/customers/audiences" label="ODP · Audiences">
          <div className="divide-y-2 divide-[#08251A]">
            {list.map((a) => (
              <div key={a.k} className={`flex items-center justify-between gap-3 px-5 py-4 ${a.fresh ? "odp-in bg-[#ABFF44]" : ""}`}>
                <div className="min-w-0">
                  <p className="f-sub truncate text-sm text-[#08251A]">{a.name}</p>
                  <p className="f-m text-[11px] text-[#08251A]">{fmt(a.size)} PROFILES · REFRESHES AS PROFILES CHANGE</p>
                </div>
                <Pill bg={a.fresh ? C.white : C.n3}>{a.use}</Pill>
              </div>
            ))}
          </div>
        </Frame>
        <div className="rounded-[32px] border-2 border-[#08251A] bg-[#91DBDA] p-5">
          <Eyebrow>Guardrail</Eyebrow>
          <p className="f-b mt-1 text-[#08251A]">Audiences use on-site behavior, engagement and consent. Tax-return content is never used for marketing audiences (IRC 7216).</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 4 ---------------------------- */
function AdPhone({ who, note, children }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full max-w-[250px] rounded-[32px] border-2 border-[#08251A] bg-white p-3">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#08251A]" />
        {children}
      </div>
      <p className="f-sub text-sm text-[#08251A]">{who}</p>
      <p className="f-b -mt-1 text-center text-xs text-[#08251A]">{note}</p>
    </div>
  );
}

function S4({ stamp }) {
  const [aud, setAud] = useState("filed");
  const [on, setOn] = useState({});
  const [step, setStep] = useState(-1);
  const [synced, setSynced] = useState([]);
  const [tab, setTab] = useState("google");

  const running = step >= 0 && step < SYNC_STEPS.length;
  const pending = Object.keys(on).filter((k) => on[k]);
  const a = ACT_AUD.find((x) => x.k === aud);

  useEffect(() => {
    if (!running) return undefined;
    const t = setTimeout(() => setStep((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [step, running]);

  useEffect(() => {
    if (step === SYNC_STEPS.length) {
      setSynced(pending.map((k) => { const [au, de] = k.split(":"); return { au, de }; }));
      stamp("sync");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const toggle = (dk) => {
    const key = `${aud}:${dk}`;
    setOn((o) => ({ ...o, [key]: !o[key] }));
    if (step >= SYNC_STEPS.length) setStep(-1);
  };

  const rowsFor = (de) => synced.filter((s) => s.de === de).map((s) => {
    const au = ACT_AUD.find((x) => x.k === s.au);
    const d = DESTS.find((x) => x.k === de);
    return { name: `ODP · ${au.name}`, size: au.size * d.match, goal: au.goal };
  });

  const platformTable = (de, title, url) => {
    const rows = rowsFor(de);
    return (
      <Frame url={url} label={title}>
        <div className="p-5">
          <Eyebrow>Your data segments</Eyebrow>
          {rows.length === 0 ? (
            <p className="f-b mt-3 text-sm text-[#08251A] opacity-70">No ODP segments yet. Toggle this destination on and run the sync.</p>
          ) : (
            <div className="mt-3 overflow-hidden rounded-[24px] border-2 border-[#08251A]">
              {rows.map((r, i) => (
                <div key={r.name} className={`odp-in flex items-center justify-between gap-3 px-4 py-3 ${i ? "border-t-2 border-[#08251A]" : ""}`}>
                  <div>
                    <p className="f-sub text-sm text-[#08251A]">{r.name}</p>
                    <p className="f-m text-[11px] text-[#08251A]">CUSTOMER LIST · ~{fmt(r.size)} MATCHED (ILLUSTRATIVE)</p>
                  </div>
                  <Pill bg={r.goal === "Suppress" ? C.blue : C.lf}>{r.goal === "Suppress" ? "Exclusion" : "Targeting"}</Pill>
                </div>
              ))}
            </div>
          )}
        </div>
      </Frame>
    );
  };

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Frame url="app.odp.optimizely.com/customers/audiences/ts27-filed" label="ODP · Audience">
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            {ACT_AUD.map((x) => (
              <button key={x.k} onClick={() => setAud(x.k)} className={`f-btn rounded-full border-2 border-[#08251A] px-3 py-1 text-sm text-[#08251A] ${aud === x.k ? "bg-[#ABFF44]" : "bg-white"}`}>{x.name}</button>
            ))}
          </div>
          <div className="flex items-end justify-between gap-3 rounded-[24px] border-2 border-[#08251A] bg-[#EFF6E9] p-4">
            <div>
              <p className="f-h3 text-xl text-[#08251A]">TS27 · {a.name}</p>
              <p className="f-m text-[11px] text-[#08251A]">{fmt(a.size)} PROFILES (SYNTHETIC)</p>
            </div>
            <Pill bg={a.goal === "Suppress" ? C.blue : C.lf}>{a.goal}</Pill>
          </div>
          <div>
            <Eyebrow>Next scheduled 3rd-party segment sync</Eyebrow>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {DESTS.map((d) => {
                const isOn = !!on[`${aud}:${d.k}`];
                return (
                  <div key={d.k} className={`flex items-center justify-between gap-3 rounded-[24px] border-2 border-[#08251A] px-4 py-2.5 ${isOn ? "bg-[#E4F0DA]" : "bg-white"}`}>
                    <div className="min-w-0">
                      <p className="f-sub text-sm text-[#08251A]">{d.name}</p>
                      <p className="f-b truncate text-xs text-[#08251A]">{isOn ? "Scheduled · daily" : d.where}</p>
                    </div>
                    <Toggle on={isOn} onClick={() => toggle(d.k)} label={`Sync to ${d.name}`} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-[24px] border-2 border-[#08251A] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="f-sub text-sm text-[#08251A]">{pending.length} audience-to-platform connection{pending.length === 1 ? "" : "s"} scheduled</p>
              <Btn onClick={() => setStep(0)} disabled={!pending.length || running}>{running ? <><Spinner /> Syncing</> : "Run tonight's sync (sped up)"}</Btn>
            </div>
            <ol className="mt-3 space-y-2">
              {SYNC_STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <StepDot state={step > i ? "done" : step === i ? "now" : "todo"} n={i + 1} />
                  <span className={`f-b text-sm text-[#08251A] ${step < i ? "opacity-50" : ""}`}>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Frame>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {[["google", "Google Ads"], ["meta", "Meta Ads Manager"], ["preview", "Ad preview"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`f-btn rounded-full border-2 border-[#08251A] px-4 py-1.5 text-sm text-[#08251A] ${tab === k ? "bg-[#ABFF44]" : "bg-white"}`}>{l}</button>
          ))}
        </div>
        {tab === "google" && platformTable("google", "Google Ads · Audience manager", "ads.google.com › Tools › Shared library › Audience manager")}
        {tab === "meta" && platformTable("meta", "Meta · Audiences", "business.facebook.com › Ads Manager › Audiences")}
        {tab === "preview" && (
          <Frame url="paid social feed · mobile" label="What each client sees">
            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <AdPhone who="Taylor" note="Started, not finished · targeted">
                <p className="f-m text-[10px] text-[#08251A]">SPONSORED · {BRAND.toUpperCase()}</p>
                <div className="mt-2 rounded-[20px] p-4 text-white" style={{ background: HRB.dark }}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: HRB.neon }}>Welcome back</p>
                  <p className="mt-1 text-lg font-bold leading-tight">File your own taxes with expert help.</p>
                  <p className="mt-1 text-xs opacity-90">Live support from tax pros and AI Tax Assist included from the start.</p>
                  <span className="mt-3 inline-block rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: HRB.neon, color: HRB.dark }}>Start with expert help</span>
                </div>
              </AdPhone>
              <AdPhone who="Jamie" note="Filed Mar 30 · excluded">
                <p className="f-m text-[10px] text-[#08251A]">FEED</p>
                <div className="mt-2 flex h-[170px] flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#08251A] bg-[#EFF6E9] p-4 text-center">
                  <p className="f-sub text-sm text-[#08251A]">No {BRAND} acquisition ad</p>
                  <p className="f-b mt-1 text-xs text-[#08251A]">Excluded by “Filed this season”. That impression goes to someone who hasn't filed.</p>
                </div>
              </AdPhone>
            </div>
            <p className="f-b border-t-2 border-[#08251A] px-6 py-3 text-xs text-[#08251A]">Ad copy reuses the demo site's DIY hero, which follows claims on hrblock.com. Synthetic clients.</p>
          </Frame>
        )}
        <p className="f-b text-xs text-[#08251A]">Match rates are illustrative. Platforms match on first-party identifiers; the full profile stays in ODP.</p>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 5 ---------------------------- */
function S5({ stamp }) {
  const [filed, setFiled] = useState(7.3);
  const [freq, setFreq] = useState(3);
  const [cpm, setCpm] = useState(12);
  const [weeks, setWeeks] = useState(5);
  const [applied, setApplied] = useState(false);
  const weeklyImps = 120;
  const wastedImps = Math.min(weeklyImps, filed * freq);
  const wastedPct = (wastedImps / weeklyImps) * 100;
  const redirected = (filed * 1e6 * freq * weeks * cpm) / 1000;

  const sliders = [
    ["Filed clients matched in the platforms", `${filed.toFixed(1)}M`, filed, setFiled, 1, 12, 0.1],
    ["Acquisition impressions per person, per week", `${freq}`, freq, setFreq, 1, 8, 1],
    ["Average CPM", `$${cpm}`, cpm, setCpm, 4, 30, 1],
    ["Weeks left in the season", `${weeks}`, weeks, setWeeks, 1, 16, 1],
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-5">
      <div className="space-y-5 xl:col-span-3">
        <Frame url="week-11 media plan · acquisition campaigns" label="Media plan (synthetic)">
          <div className="space-y-5 p-5">
            {sliders.map(([label, shown, val, set, min, max, st]) => (
              <div key={label}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="f-b text-sm text-[#08251A]">{label}</p>
                  <p className="f-h text-2xl text-[#08251A]">{shown}</p>
                </div>
                <input type="range" min={min} max={max} step={st} value={val} onChange={(e) => set(Number(e.target.value))} className="mt-1 w-full accent-[#3AB533]" aria-label={label} />
              </div>
            ))}
            <p className="f-m text-[11px] text-[#08251A]">DEFAULT: 11.8M FILED × ~62% MATCH ≈ 7.3M · 120M ACQUISITION IMPRESSIONS A WEEK (SYNTHETIC)</p>
          </div>
        </Frame>
        <div className="rounded-[32px] border-2 border-[#08251A] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow>Who this week's acquisition impressions reach</Eyebrow>
            <Btn onClick={() => { setApplied(true); stamp("suppress"); }} disabled={applied}>{applied ? "Suppression on" : "Apply “Filed this season” suppression"}</Btn>
          </div>
          <div className="mt-4 space-y-3">
            {[["Before", false], ["After", true]].map(([l, after]) => {
              const w = after && applied ? 0 : wastedPct;
              return (
                <div key={l} className="flex items-center gap-3">
                  <span className="f-sub w-14 text-sm text-[#08251A]">{l}</span>
                  <div className="flex h-10 flex-1 overflow-hidden rounded-full border-2 border-[#08251A]">
                    <div className="f-sub flex items-center justify-center bg-[#91DBDA] text-xs text-[#08251A] transition-all duration-700" style={{ width: `${w}%` }}>
                      {w > 8 ? `Already filed ${Math.round(w)}%` : ""}
                    </div>
                    <div className="f-sub flex flex-1 items-center justify-center bg-[#3AB533] text-xs text-[#08251A]">Not yet filed</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="xl:col-span-2">
        <div className="flex h-full flex-col justify-center rounded-[32px] border-2 border-[#08251A] bg-[#ABFF44] p-8">
          <Eyebrow>Spend redirected over the rest of the season</Eyebrow>
          <p className="f-h mt-2 text-6xl text-[#08251A]">{money(redirected)}</p>
          <p className="f-b mt-4 text-lg text-[#08251A]">That budget can reach people who haven't filed yet, instead of thanking people who already did.</p>
          <p className="f-m mt-6 text-[11px] text-[#08251A]">ILLUSTRATIVE MATH, NOT A FORECAST</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 6 ---------------------------- */
function S6({ stamp }) {
  const [model, setModel] = useState("last");
  const [seen, setSeen] = useState(["last"]);
  const shares = ATTR[model];
  const pick = (k) => {
    setModel(k);
    setSeen((s) => (s.includes(k) ? s : [...s, k]));
  };
  useEffect(() => { if (seen.length >= 3) stamp("attr"); }, [seen, stamp]);
  const emailLast = ATTR.last[0];
  const emailNow = shares[0];

  return (
    <div className="grid gap-5 xl:grid-cols-5">
      <div className="xl:col-span-3">
        <Frame url="app.odp.optimizely.com/reports/attribution/ts27-late-season" label="ODP · Reports › Attribution reports">
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2">
              <Pill bg={C.n3}>Conversion · return_filed</Pill>
              <Pill bg={C.n3}>Window · Week 10</Pill>
              <Pill bg={C.n3}>Campaigns · TS27 late season</Pill>
            </div>
            <div>
              <Eyebrow>Model for attribution</Eyebrow>
              <div className="mt-2 flex flex-wrap gap-2">
                {ATTR_MODELS.map((m) => (
                  <button key={m.k} onClick={() => pick(m.k)} className={`f-btn rounded-full border-2 border-[#08251A] px-3 py-1 text-sm text-[#08251A] ${model === m.k ? "bg-[#ABFF44]" : "bg-white"}`}>{m.name}</button>
                ))}
              </div>
              <p className="f-b mt-2 text-sm text-[#08251A]">{ATTR_MODELS.find((m) => m.k === model).desc}</p>
            </div>
            <div className="space-y-3">
              {ATTR_CHANNELS.map((ch, i) => (
                <div key={ch} className="grid grid-cols-12 items-center gap-3">
                  <p className="f-sub col-span-3 text-sm text-[#08251A]">{ch}</p>
                  <div className="col-span-6 h-8 overflow-hidden rounded-full border-2 border-[#08251A] bg-[#EFF6E9]">
                    <div className="h-full rounded-full bg-[#3AB533] transition-all duration-500" style={{ width: `${shares[i]}%` }} />
                  </div>
                  <p className="f-h col-span-1 text-right text-xl text-[#08251A]">{shares[i]}%</p>
                  <p className="f-m col-span-2 text-right text-[11px] text-[#08251A]">{fmt((ATTR_TOTAL * shares[i]) / 100)}</p>
                </div>
              ))}
            </div>
            <p className="f-m border-t-2 border-[#08251A] pt-3 text-[11px] text-[#08251A]">{fmt(ATTR_TOTAL)} FILED RETURNS WITH AN ODP TOUCHPOINT · SYNTHETIC</p>
          </div>
        </Frame>
      </div>
      <div className="space-y-5 xl:col-span-2">
        <div className="rounded-[32px] border-2 border-[#08251A] bg-[#ABFF44] p-6">
          <Eyebrow>What changed</Eyebrow>
          <p className="f-h3 mt-2 text-2xl text-[#08251A]">
            {model === "last" ? "Under Last, SMS looks like the hero and email looks minor." : `Email moves from ${emailLast}% under Last to ${emailNow}% under ${ATTR_MODELS.find((m) => m.k === model).name}.`}
          </p>
          <p className="f-b mt-2 text-[#08251A]">Email opens the journey; SMS closes it. Cutting email because last-touch undervalues it would starve the reminders that follow.</p>
        </div>
        <div className="rounded-[32px] border-2 border-[#08251A] bg-white p-6">
          <Eyebrow>A typical late-season path</Eyebrow>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {["Email", "Web embed", "App push", "SMS", "Filed"].map((s, i) => (
              <React.Fragment key={s}>
                <span className={`f-sub rounded-full border-2 border-[#08251A] px-3 py-1 text-xs text-[#08251A] ${s === "Filed" ? "bg-[#ABFF44]" : "bg-[#EFF6E9]"}`}>{s}</span>
                {i < 4 && <span className="text-[#08251A]">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border-2 border-[#08251A] bg-[#E4F0DA] p-6">
          <Eyebrow>The limit of the microscope</Eyebrow>
          <p className="f-b mt-1 text-[#08251A]">It credits the touchpoints ODP orchestrates. TV, paid search and paid social need the telescope: the weekly mix model.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 7 ---------------------------- */
function S7({ stamp }) {
  const [body, setBody] = useState("");
  const [run, setRun] = useState("idle");
  const [prog, setProg] = useState(0);
  const [wh, setWh] = useState("idle");

  useEffect(() => {
    if (run !== "running") return undefined;
    const id = setInterval(() => setProg((p) => {
      if (p >= 100) { clearInterval(id); return 100; }
      return p + 4;
    }), 70);
    return () => clearInterval(id);
  }, [run]);
  useEffect(() => { if (prog >= 100 && run === "running") setRun("done"); }, [prog, run]);

  const runWh = () => {
    setWh("running");
    setTimeout(() => { setWh("done"); stamp("export"); }, 1300);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Frame url="api.us1.odp.optimizely.com · Start Export Job" label="ODP · Export API">
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="f-h3 text-xl text-[#08251A]">Weekly export: Week 10</p>
            <Btn kind="paste" onClick={() => setBody(EXPORT_C2)} disabled={!!body}>Paste C2</Btn>
          </div>
          <div>
            <Eyebrow>Request body (simplified)</Eyebrow>
            <pre className="f-m mt-1 min-h-[96px] whitespace-pre-wrap rounded-[24px] border-2 border-[#08251A] bg-[#EFF6E9] p-4 text-xs text-[#08251A]">{body || "// paste the export request"}</pre>
          </div>
          <Btn onClick={() => { setProg(0); setRun("running"); }} disabled={!body || run !== "idle"}>{run === "running" ? <><Spinner /> Exporting</> : run === "done" ? "Export complete" : "Start export job"}</Btn>
          {run !== "idle" && (
            <div className="odp-in space-y-3 rounded-[24px] border-2 border-[#08251A] p-4">
              <div>
                <Eyebrow>Response · path</Eyebrow>
                <p className="f-m mt-1 break-all text-xs text-[#08251A]">s3://zaius-outgoing/{"<tracker-id>"}/data-exports/3a44c1…e9f</p>
              </div>
              {EXPORT_FILES.map((f) => (
                <div key={f.name}>
                  <div className="flex justify-between gap-2">
                    <span className="f-m truncate text-[11px] text-[#08251A]">{f.name}</span>
                    <span className="f-m text-[11px] text-[#08251A]">{fmt((f.rows * prog) / 100)} rows</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-[#08251A] bg-white">
                    <div className="h-full bg-[#3AB533]" style={{ width: `${prog}%` }} />
                  </div>
                </div>
              ))}
              {run === "done" && <p className="f-b text-sm text-[#08251A]">Loaded into the warehouse as odp_weekly_outcomes. Schedule: every Monday 06:00.</p>}
            </div>
          )}
        </div>
      </Frame>

      <Frame url="app.snowflake.com › worksheets › weekly_mmm_input" label="Warehouse (synthetic dataset)">
        <div className="space-y-4 p-5">
          <pre className="f-m overflow-x-auto whitespace-pre rounded-[24px] border-2 border-[#08251A] bg-[#08251A] p-4 text-[11px] leading-relaxed text-[#ABFF44]">{WH_SQL}</pre>
          <Btn kind="dark" onClick={runWh} disabled={run !== "done" || wh !== "idle"}>{wh === "running" ? <><Spinner /> Running</> : wh === "done" ? "Query complete" : "Run query"}</Btn>
          {run !== "done" && <p className="f-b text-xs text-[#08251A]">Run the ODP export first.</p>}
          {wh === "done" && (
            <div className="odp-in overflow-x-auto rounded-[24px] border-2 border-[#08251A]">
              <table className="w-full text-left">
                <thead className="bg-[#E4F0DA]">
                  <tr>
                    {["Week", "TV and streaming", "Paid search", "Paid social", "Programmatic", "Returns filed (ODP)"].map((h) => (
                      <th key={h} className="f-m whitespace-nowrap px-3 py-2 text-[10px] uppercase text-[#08251A]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WH_ROWS.map((r) => (
                    <tr key={r[0]} className="border-t-2 border-[#08251A]">
                      {r.map((c, i) => <td key={i} className={`f-b whitespace-nowrap px-3 py-2 text-xs text-[#08251A] ${i === 5 ? "bg-[#ABFF44] font-bold" : ""}`}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Pill bg={C.lf}>Outcomes · from ODP</Pill>
            <Pill bg={C.n3}>Spend · from agencies and platforms</Pill>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* ---------------------------- Scene 8 ---------------------------- */
function SatCurves() {
  const W = 420;
  const H = 200;
  const xMax = 6;
  const yMax = 60;
  const curves = MMM.filter((c) => c.curve);
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" role="img" aria-label="Simulated response curves">
      <line x1="0" x2={W} y1={H} y2={H} stroke={C.fir} strokeWidth="2" />
      <line x1="1" x2="1" y1="0" y2={H} stroke={C.fir} strokeWidth="2" />
      {curves.map((c) => {
        const idx = MMM.indexOf(c);
        const pts = Array.from({ length: 41 }, (_, i) => {
          const x = (i / 40) * xMax;
          const y = c.curve.a * (1 - Math.exp(-x / c.curve.k));
          return [(x / xMax) * W, H - (y / yMax) * H];
        });
        const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
        const cx = (c.spend / xMax) * W;
        const cy = H - ((c.curve.a * (1 - Math.exp(-c.spend / c.curve.k))) / yMax) * H;
        return (
          <g key={c.name}>
            <path d={d} fill="none" stroke={MMM_COLORS[idx]} strokeWidth="4" />
            <path d={d} fill="none" stroke={C.fir} strokeWidth="1" />
            <circle cx={cx} cy={cy} r="7" fill={MMM_COLORS[idx]} stroke={C.fir} strokeWidth="2" />
          </g>
        );
      })}
      <text x={W - 2} y={H + 18} textAnchor="end" className="f-m" fontSize="10" fill={C.fir}>WEEKLY SPEND ($M) →</text>
      <text x="8" y="12" className="f-m" fontSize="10" fill={C.fir}>INCREMENTAL RETURNS ↑</text>
    </svg>
  );
}

function S8({ stamp }) {
  const [sum, setSum] = useState(false);
  const text = useTypewriter(MMM_SUMMARY, sum, 3, 14);
  const totalSpend = MMM.reduce((s, c) => s + c.spend, 0);
  useEffect(() => { if (sum && text.length >= MMM_SUMMARY.length) stamp("mmm"); }, [sum, text, stamp]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pill bg={C.n3}>Simulated · partner layer, not an ODP feature</Pill>
        <Pill bg={C.n2}>Input: ODP outcomes plus warehouse spend</Pill>
      </div>
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Frame url="mmm-partner.example › TS27 › week-11 read-out" label="MMM partner · weekly read-out">
            <div className="space-y-4 p-5">
              <div className="grid grid-cols-12 gap-2">
                <p className="f-m col-span-4 text-[10px] uppercase text-[#08251A]">Channel</p>
                <p className="f-m col-span-6 text-[10px] uppercase text-[#08251A]">Spend share (top) vs contribution share (bottom)</p>
                <p className="f-m col-span-2 text-right text-[10px] uppercase text-[#08251A]">ROI index</p>
              </div>
              {MMM.map((c, i) => {
                const sp = (c.spend / totalSpend) * 100;
                return (
                  <div key={c.name} className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[#08251A]" style={{ background: MMM_COLORS[i] }} />
                      <span className="f-sub text-sm text-[#08251A]">{c.name}</span>
                    </div>
                    <div className="col-span-6 space-y-1">
                      <div className="h-3 overflow-hidden rounded-full border-2 border-[#08251A] bg-[#EFF6E9]"><div className="h-full bg-[#91DBDA]" style={{ width: `${sp}%` }} /></div>
                      <div className="h-3 overflow-hidden rounded-full border-2 border-[#08251A] bg-[#EFF6E9]"><div className="h-full bg-[#3AB533]" style={{ width: `${c.contrib}%` }} /></div>
                    </div>
                    <p className={`f-h col-span-2 text-right text-xl text-[#08251A] ${c.roi >= 1.2 ? "underline decoration-[#3AB533] decoration-4" : ""}`}>{c.roi.toFixed(1)}</p>
                  </div>
                );
              })}
              <p className="f-m border-t-2 border-[#08251A] pt-3 text-[11px] text-[#08251A]">SHARE OF MARKETING-DRIVEN FILED RETURNS · WEEKLY BAYESIAN REFRESH · SYNTHETIC</p>
            </div>
          </Frame>
        </div>
        <div className="space-y-5 xl:col-span-2">
          <div className="rounded-[32px] border-2 border-[#08251A] bg-white p-5">
            <Eyebrow>Response curves · where each channel sits today</Eyebrow>
            <SatCurves />
            <p className="f-b text-sm text-[#08251A]">Paid search is still climbing. Paid social has flattened.</p>
          </div>
          <div className="rounded-[32px] border-2 border-[#08251A] bg-[#91DBDA] p-5">
            <Eyebrow>Calibration</Eyebrow>
            <p className="f-b mt-1 text-sm text-[#08251A]">Priors checked against this season's experiment lift: hero test +12.9% completed returns (Optimizely Analytics, synthetic).</p>
          </div>
        </div>
      </div>
      <div className="rounded-[32px] border-2 border-[#08251A] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="f-sub text-[#08251A]">Mark · summarize the read-out for the Monday meeting</p>
          <Btn kind="dark" onClick={() => setSum(true)} disabled={sum}>Ask Mark to summarize</Btn>
        </div>
        {sum && <p className="f-b mt-3 rounded-[24px] border-2 border-[#08251A] bg-[#EFF6E9] p-4 text-[#08251A]">{text}{text.length < MMM_SUMMARY.length && <span className="animate-pulse">▍</span>}</p>}
      </div>
    </div>
  );
}

/* ---------------------------- Scene 9 ---------------------------- */
function MixBar({ vals }) {
  const total = vals.reduce((a, b) => a + b, 0);
  return (
    <div className="flex h-12 w-full overflow-hidden rounded-full border-2 border-[#08251A]">
      {vals.map((v, i) => (
        <div key={MMM[i].name} className={`f-sub flex items-center justify-center text-xs transition-all duration-700 ${i === 2 || i === 4 ? "text-white" : "text-[#08251A]"}`} style={{ width: `${(v / total) * 100}%`, background: MMM_COLORS[i] }}>
          {(v / total) * 100 > 9 ? `$${v.toFixed(1)}M` : ""}
        </div>
      ))}
    </div>
  );
}

function S9({ stamp }) {
  const [applied, setApplied] = useState(false);
  const [ticks, setTicks] = useState(0);
  const [count, setCount] = useState(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!applied || ticks >= AUD_ACTIONS.length) return undefined;
    const t = setTimeout(() => setTicks((n) => n + 1), 700);
    return () => clearTimeout(t);
  }, [applied, ticks]);
  useEffect(() => { if (ticks === AUD_ACTIONS.length) stamp("shift"); }, [ticks, stamp]);
  useEffect(() => {
    if (count === null) return undefined;
    if (count === 0) { setLive(true); stamp("live"); setCount(null); return undefined; }
    const t = setTimeout(() => setCount(count - 1), 800);
    return () => clearTimeout(t);
  }, [count, stamp]);

  const mix = applied ? REC_MIX.next : REC_MIX.current;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <Frame url="week-12 plan · budget by channel" label="Media plan (synthetic)">
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="f-h3 text-xl text-[#08251A]">{applied ? "Week 12 plan · recommendation applied" : "Week 12 plan · current mix"}</p>
              <Btn onClick={() => setApplied(true)} disabled={applied}>Apply recommendation</Btn>
            </div>
            <MixBar vals={mix} />
            <div className="flex flex-wrap gap-3">
              {MMM.map((c, i) => (
                <span key={c.name} className="f-b flex items-center gap-2 text-xs text-[#08251A]">
                  <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-[#08251A]" style={{ background: MMM_COLORS[i] }} />{c.name}
                </span>
              ))}
            </div>
            {applied && <p className="f-b odp-in rounded-[24px] border-2 border-[#08251A] bg-[#EFF6E9] p-3 text-sm text-[#08251A]">Paid social $2.1M → $1.8M · paid search $2.6M → $2.9M. Budgets change in the platforms or with the agency.</p>}
          </div>
        </Frame>
        <Frame url="app.odp.optimizely.com/customers/audiences" label="ODP · Audience actions">
          <div className="space-y-4 p-5">
            <ol className="space-y-3">
              {AUD_ACTIONS.map((a, i) => (
                <li key={a} className="flex items-center gap-3">
                  <StepDot state={ticks > i ? "done" : applied && ticks === i ? "now" : "todo"} n={i + 1} />
                  <span className={`f-b text-sm text-[#08251A] ${ticks > i ? "" : "opacity-60"}`}>{a}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center gap-3 border-t-2 border-[#08251A] pt-4">
              <Btn kind="dark" onClick={() => setCount(3)} disabled={ticks < AUD_ACTIONS.length || live || count !== null}>{live ? "Live in the platforms" : "Run tonight's sync (sped up)"}</Btn>
              {count !== null && <span className="f-b text-sm text-[#08251A]"><Spinner /> Overnight sync… {count}</span>}
              {live && <span className="f-sub odp-in text-sm text-[#08251A]">Live Tue 6:00 · before the first Tuesday auction</span>}
            </div>
          </div>
        </Frame>
      </div>
      <div className="rounded-[32px] border-2 border-[#08251A] bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <Eyebrow>The season · 16 decision cycles</Eyebrow>
          <p className="f-sub text-sm text-[#08251A]">Cycle 11 of 16 · {live ? "done" : "in progress"} · 5 left</p>
        </div>
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
          {Array.from({ length: 16 }, (_, i) => {
            const w = i + 1;
            const done = w < 11 || (w === 11 && live);
            const cur = w === 11 && !live;
            return (
              <div key={w} className={`flex h-12 items-center justify-center rounded-[16px] border-2 border-[#08251A] ${done ? "bg-[#ABFF44]" : cur ? "odp-pulse bg-[#91DBDA]" : "bg-[#EFF6E9]"}`}>
                <span className="f-m text-[11px] text-[#08251A]">W{w}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 10 ---------------------------- */
function S10({ stamps, answer }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="rounded-[32px] border-2 border-[#08251A] bg-[#08251A] p-7 text-white">
        <p className="f-m text-xs uppercase text-[#ABFF44]">Priya's Monday</p>
        <ol className="mt-4 space-y-2.5">
          {TIMELINE.map(([k, t, l]) => (
            <li key={k} className={`flex items-center gap-3 ${stamps[k] ? "" : "opacity-40"}`}>
              <span className="f-m w-24 shrink-0 rounded-full border-2 border-[#08251A] bg-[#ABFF44] px-2 py-0.5 text-center text-[11px] text-[#08251A]">{t}</span>
              <span className="f-b flex-1 text-sm">{l}</span>
              <span className="f-sub text-[#ABFF44]">{stamps[k] ? "✓" : "·"}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="space-y-5">
        <div className="rounded-[32px] border-2 border-[#08251A] bg-white p-7">
          <Eyebrow>Three things you saw</Eyebrow>
          <ol className="f-h3 mt-3 space-y-3 text-2xl text-[#08251A]">
            <li>1. One first-party profile fed both measurement and activation.</li>
            <li>2. Audiences reached Google and Meta without a list upload.</li>
            <li>3. Monday's read-out was live in the platforms by Tuesday 6:00.</li>
          </ol>
        </div>
        <div className="rounded-[32px] border-2 border-[#08251A] bg-[#ABFF44] p-7">
          <Eyebrow>Earlier you said</Eyebrow>
          <p className="f-h3 mt-2 text-2xl text-[#08251A]">{answer.trim() ? `“${answer}”` : "Read-out to live audience: one day, sixteen times a season."}</p>
          {answer.trim() && <p className="f-b mt-2 text-[#08251A]">Monday 1 pm to Tuesday 6:00. That difference is the gap we close.</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Scene 11 ---------------------------- */
function S11() {
  const [filter, setFilter] = useState("all");
  const rows = filter === "all" ? ROLES : ROLES.filter((r) => r.o === filter);
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="space-y-3 xl:col-span-3">
          <div className="flex flex-wrap gap-2">
            {[["all", "Show all"], ["ODP", OWNER.ODP.label], ["Extend", OWNER.Extend.label], ["Partner", OWNER.Partner.label]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} className={`f-btn rounded-full border-2 border-[#08251A] px-3 py-1 text-sm text-[#08251A] ${filter === k ? "bg-[#ABFF44]" : "bg-white"}`}>{l}</button>
            ))}
          </div>
          <div className="overflow-hidden rounded-[32px] border-2 border-[#08251A] bg-white">
            {rows.map((r, i) => (
              <div key={r.cap} className={`flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between ${i ? "border-t-2 border-[#08251A]" : ""}`}>
                <p className="f-b text-sm text-[#08251A]">{r.cap}</p>
                <Pill bg={OWNER[r.o].bg}>{OWNER[r.o].label}</Pill>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5 xl:col-span-2">
          <div className="rounded-[32px] border-2 border-[#08251A] bg-white p-5">
            <p className="f-h3 text-xl text-[#08251A]">Taxpayer trust</p>
            <div className="mt-2">
              {TRUST.map(([t, s, bg]) => (
                <div key={t} className="flex items-center justify-between gap-2 border-b-2 border-[#E4F0DA] py-2 last:border-b-0">
                  <span className="f-b text-sm text-[#08251A]">{t}</span>
                  <Pill bg={bg}>{s}</Pill>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border-2 border-[#08251A] bg-[#08251A] p-6 text-white">
            <p className="f-m text-xs uppercase text-[#ABFF44]">Proposed next step</p>
            <p className="f-h2 mt-2 text-3xl">Scoped proof of concept</p>
            <ul className="f-b mt-3 space-y-1 text-sm">
              <li>• One suppression audience synced to Google and Meta</li>
              <li>• One re-engagement audience on the same platforms</li>
              <li>• One weekly ODP export feeding your current MMM</li>
            </ul>
            <p className="f-b mt-4 rounded-[24px] border-2 border-[#08251A] bg-[#ABFF44] p-3 text-sm text-[#08251A]">Measured on one number: <b>time from read-out to live audience.</b></p>
            <p className="f-b mt-3 text-sm italic text-[#ABFF44]">“Who should we work with to set that up?”</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- app ---------------------------- */
const clampIdx = (i) => Math.max(0, Math.min(SCENES.length - 1, Number(i) || 0));

export default function App() {
  const [idx, setIdx] = useState(0);
  const [stamps, setStamps] = useState({});
  const [answer, setAnswer] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const presenterWin = useRef(null);
  const chan = useRef(null);
  const latest = useRef("");
  const onCommand = useRef(() => {});

  const stamp = useCallback((k) => setStamps((st) => (st[k] ? st : { ...st, [k]: true })), []);
  const go = useCallback((i) => setIdx(clampIdx(i)), []);
  const resetAll = () => { setStamps({}); setAnswer(""); setIdx(0); setResetKey((k) => k + 1); };

  /* S opens (or focuses) the presenter window. */
  const openPresenter = () => {
    const w = presenterWin.current;
    if (w && !w.closed) { w.focus(); return; }
    presenterWin.current = window.open(PRESENTER_URL, PRESENTER_WINDOW, "popup=yes,width=560,height=940");
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || "";
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || (e.target && e.target.isContentEditable)) return;
      if (e.key === "ArrowRight") setIdx((i) => Math.min(SCENES.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "s" || e.key === "S") { e.preventDefault(); openPresenter(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Commands from the presenter window. Reassigned every render so it always sees fresh handlers. */
  useEffect(() => {
    onCommand.current = (m) => {
      if (m.type === "step") setIdx((i) => clampIdx(i + Number(m.delta || 0)));
      else if (m.type === "goto") setIdx(clampIdx(m.idx));
      else if (m.type === "answer") setAnswer(String(m.value ?? ""));
      else if (m.type === "reset") resetAll();
    };
  });

  /* Channel to the presenter window (declared before the state broadcast so it exists on first run). */
  useEffect(() => {
    const ch = openChannel();
    if (!ch) return undefined;
    chan.current = ch;
    ch.onmessage = (e) => {
      const m = e.data || {};
      if (m.type === "hello") { if (latest.current) ch.postMessage({ type: "state", payload: latest.current }); }
      else onCommand.current(m);
    };
    return () => { ch.close(); chan.current = null; };
  }, []);

  const payload = JSON.stringify({ idx, stamps, answer, resetKey });
  useEffect(() => {
    latest.current = payload;
    chan.current?.postMessage({ type: "state", payload });
  }, [payload]);

  const s = SCENES[idx];
  const stage = () => {
    switch (s.n) {
      case 1: return <S1 />;
      case 2: return <S2 stamp={stamp} />;
      case 3: return <S3 stamp={stamp} />;
      case 4: return <S4 stamp={stamp} />;
      case 5: return <S5 stamp={stamp} />;
      case 6: return <S6 stamp={stamp} />;
      case 7: return <S7 stamp={stamp} />;
      case 8: return <S8 stamp={stamp} />;
      case 9: return <S9 stamp={stamp} />;
      case 10: return <S10 stamps={stamps} answer={answer} />;
      default: return <S11 />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#EFF6E9] text-[#08251A]">
      <style>{FONT_CSS}</style>
      <header className="flex flex-wrap items-center justify-between gap-3 bg-[#08251A] px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="h-8 w-[117px]" role="img" aria-label="Optimizely" dangerouslySetInnerHTML={{ __html: LOGO_SVG.replace("<svg ", '<svg width="100%" height="100%" ') }} />
          <span className="f-m hidden text-[11px] uppercase text-white sm:inline">{BRAND} · Optimizely Data Platform demo</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous scene" className="f-btn h-8 w-8 rounded-full border-2 border-[#08251A] bg-white text-[#08251A] disabled:opacity-40">‹</button>
          <span className="f-m w-14 text-center text-[11px] text-white">{idx + 1} / {SCENES.length}</span>
          <button onClick={() => go(idx + 1)} disabled={idx === SCENES.length - 1} aria-label="Next scene" className="f-btn h-8 w-8 rounded-full border-2 border-[#08251A] bg-[#ABFF44] text-[#08251A] disabled:opacity-40">›</button>
        </div>
      </header>
      <div className="border-b-2 border-[#08251A] bg-white px-5 py-3">
        <p className="f-h3 text-2xl text-[#08251A]">{s.title}</p>
      </div>
      <main className="flex-1 p-5" key={`${idx}-${resetKey}`}>
        {stage()}
      </main>
      <div className="h-1.5 bg-[#E4F0DA]"><div className="h-full bg-[#3AB533] transition-all duration-500" style={{ width: `${((idx + 1) / SCENES.length) * 100}%` }} /></div>
    </div>
  );
}
