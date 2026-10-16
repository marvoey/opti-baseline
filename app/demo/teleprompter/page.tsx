'use client';

import React, { useState, useEffect, useRef } from "react";

/* =========================================================
   OPTIMIZELY BRANDED TELEPROMPTER
   Module 1 Certification Run-of-Show: Limitless 1:1 Personalization
   Brand Pack Applied:
   - Colors: LFGreen (#ABFF44), Grass (#7DDD3D), Good-to-go (#3AB533),
     Dark Fir (#08251A), Light Blue (#91DBDA), Neutral 1 (#FFFFFF),
     Neutral 2 (#EFF6E9), Neutral 3 (#E4F0DA), Neutral 4 (#D8E4CB)
   - Extrusion Sequence: #ABFF44 -> #40A142 -> #2E8C45 -> #166E49 -> #0D593E
   - Typography: Google Alternatives (Roboto Condensed Black, Roboto, Roboto Mono)
   - UI Rules: 32px continuous rounded corners, Dark Fir strokes only, no gradients
   ========================================================= */

const SCRIPT_SECTIONS = [
  {
    id: "part-1",
    part: "PART 1",
    title: "Elevator Pitch",
    mode: "Camera Only - No Slides",
    targetRange: "0:00 - 1:00",
    durationSec: 60,
    rubricTip:
      "Reframe Categorization vs. Personalization, name the Mid-Funnel Content Gap, and define the concrete artifact (governed 1:1 microsite per account).",
    cues: [
      {
        time: "0:00",
        action: "Look directly into the camera lens. Conversational, candid Challenger posture.",
      },
    ],
    paragraphs: [
      {
        speaker: "OPENING REFRAME",
        text: "For the last twenty years, our industry has sold a polite fiction called 'personalization.' Look under the hood of almost any enterprise personalization program today, and what are they actually doing? They're putting buyers into broad buckets—Healthcare, Financial Services, EMEA—and serving everyone in that bucket the exact same static experience.",
        highlight: "That isn't personalization. That's categorization.",
      },
      {
        speaker: "THE MID-FUNNEL PROBLEM",
        text: "And categorization is the exact reason B2B pipeline stalls in the middle of the funnel. Because when you're closing a seven-figure enterprise deal, you aren't selling to a bucket. You're selling to a buying committee.",
        highlight:
          "You have a CFO scrutinizing margin pressure, a VP of Architecture worried about legacy migration risk, and an Operations Director looking for day-one workflow relief.",
      },
      {
        speaker: "THE SOLUTION & LIFECYCLE",
        text: "Your marketing team knows every one of those stakeholders needs tailored proof points—but manual production simply cannot scale to build, govern, and maintain bespoke experiences for hundreds of target accounts.",
        highlight:
          "Optimizely's Limitless 1:1 Personalization blows that bottleneck off the hinges.",
      },
      {
        speaker: "THE CONCRETE ARTIFACT",
        text: "Instead of segment buckets, autonomous AI agents in Opal research, write, govern, and continuously update a genuinely tailored microsite for every single target account.",
        highlight:
          "It combines your CRM context, first-party behavioral intent from ODP, and live market signals to assemble an on-brand landing page in Optimizely CMS—complete with CMP approval governance and automatic delta updates whenever the account shifts.",
      },
      {
        speaker: "TRANSITION TO DEMO",
        text: "Let me show you how we move from static buckets to living 1:1 microsites in under five minutes.",
        highlight: null,
      },
    ],
  },
  {
    id: "step-1",
    part: "PART 2 - STEP 1 & 2",
    title: "Problem Frame & Account Intake",
    mode: "Screen Share - Northstar CRM",
    targetRange: "1:00 - 2:00",
    durationSec: 60,
    rubricTip:
      "Show realistic, non-confidential sample data in Northstar CRM and explain how target accounts are pulled from the Q4 Tier-1 ABM campaign.",
    cues: [
      {
        time: "1:00",
        action: "Switch to Screen Share on Northstar CRM (/demo/crm) -> Click 'View Q4 Tier-1 ABM' (Campaigns tab).",
      },
      {
        time: "1:25",
        action: "Gesture across the 6 target accounts table (Helix Freight, Apex Health, Northbridge, Solara, Kestrel, Lumen).",
      },
    ],
    paragraphs: [
      {
        speaker: "FRAMING THE CAMPAIGN",
        text: "We're inside Northstar CRM looking at our Q4 Tier-1 ABM campaign for Vantage Cloud. We have six high-value target accounts representing over five million dollars in active pipeline—spanning logistics, healthcare, banking, and retail.",
        highlight:
          "Here is where the mid-funnel always breaks: our AEs are actively working these deals, but four of these six accounts still have 'None' under their 1:1 Microsite status because marketing is stuck in a production backlog.",
      },
      {
        speaker: "ACCOUNT INTAKE",
        text: "With Limitless 1:1 Personalization, account intake happens directly from the CRM—either triggered automatically when an opportunity enters a target campaign or stage, or on-demand by the account team.",
        highlight: "Let's select our first account: Helix Freight Group.",
      },
    ],
  },
  {
    id: "step-3",
    part: "PART 2 - STEP 3",
    title: "Tri-Source Enrichment & Personas",
    mode: "Screen Share - Helix Freight Group",
    targetRange: "2:00 - 3:30",
    durationSec: 90,
    rubricTip:
      "CRITICAL RUBRIC POINT: Explicitly point out all 3 data sources (CRM, ODP, Web Research) and all 3 buying-committee personas (Economic Buyer, Technical Evaluator, Champion).",
    cues: [
      {
        time: "2:00",
        action: "Ensure Helix Freight Group is selected. Scroll slightly so Buying Committee, ODP Behavioral Intelligence, and Web Research Signals cards are centered.",
      },
      {
        time: "2:20",
        action: "Hover over Marcus Lee (Economic Buyer), Priya Natarajan (Technical Evaluator), and Tom Becker (Champion).",
      },
      {
        time: "2:50",
        action: "Hover over the 'ODP behavioral intelligence' card and 'Web research & market signals' card.",
      },
    ],
    paragraphs: [
      {
        speaker: "WHY GENERIC AI FAILS",
        text: "Now, before we generate a single word, look at the audience intelligence we're feeding the agent. If you just ask a generic LLM to write a page for a logistics company, you get generic AI slop.",
        highlight:
          "Limitless builds genuine 1:1 relevance by synthesizing three distinct data sources:",
      },
      {
        speaker: "SOURCE 1: CRM & BUYING COMMITTEE",
        text: "First, CRM Opportunity & Contact Data: We see Helix is a $480K Discovery deal in Rotterdam, and we've logged a specific objection around migration risk from their legacy TMS. More importantly, look at the Buying Committee card. The agent maps known contacts into explicit buying-committee personas:",
        highlight:
          "Marcus Lee, CFO, is our Economic Buyer focused on margin pressure. Priya Natarajan, VP of IT Architecture, is our Technical Evaluator worried about legacy TMS integration. And Tom Becker, Director of Fleet Operations, is our internal Champion.",
      },
      {
        speaker: "SOURCE 2: ODP BEHAVIORAL DATA",
        text: "Second, First-Party ODP Behavioral Intelligence: Below that, Optimizely Data Platform shows us what anonymous and known visitors from helixfreight.com are actually doing on our site—14 sessions in the last 30 days, viewing our Supply Chain Visibility page six times, with top intent topics around cold-chain compliance and TMS integration.",
        highlight: null,
      },
      {
        speaker: "SOURCE 3: WEB RESEARCH SIGNALS",
        text: "Third, External Web Research & Market Signals: We capture live public signals—Helix just announced three new EU cold-chain hubs, their CFO cited fragmented systems on their Q2 earnings call, and they're hiring 40+ data engineers.",
        highlight:
          "The Opal agent doesn't write one generic pitch; it weaves all three sources together so the CFO, the Architect, and the Fleet Director each see their exact priorities addressed on one cohesive page.",
      },
    ],
  },
  {
    id: "step-4",
    part: "PART 2 - STEP 4",
    title: "Create Mode - Generate New Microsite",
    mode: "Screen Share - Trigger & Console",
    targetRange: "3:30 - 5:00",
    durationSec: 90,
    rubricTip:
      "Trigger 'Run Limitless' for Helix. Emphasize that generation starts from the brand's existing content foundation (registered CMS content types & Brand Pack), not freeform HTML.",
    cues: [
      {
        time: "3:30",
        action: "Click the violet 'Run Limitless' button on the Helix Freight Group row.",
      },
      {
        time: "3:45",
        action: "Point to the dark 'Limitless agent console' card as the webhook payload dispatches and polling starts.",
      },
    ],
    paragraphs: [
      {
        speaker: "TRIGGERING CREATE MODE",
        text: "Notice Helix currently has 'None' under Microsite status. Let's click 'Run Limitless' right here.",
        highlight:
          "Down in our Limitless Agent Console, you can see our CRM just fired the enriched account payload to our Opal workflow webhook.",
      },
      {
        speaker: "ROUTER AGENT",
        text: "The first thing that happens in Opal is the Router Agent inspects Optimizely CMS to see if an ABM landing page already exists for Helix. Because no page exists, the Router selects CREATE MODE—running full account research, persona synthesis, copy generation, and CMS assembly.",
        highlight: null,
      },
      {
        speaker: "BRAND CONTENT FOUNDATION",
        text: "And here is a critical architectural point: the Creator Agent is not hallucinating freeform HTML or inventing off-brand layouts.",
        highlight:
          "It starts from Vantage Cloud's existing content foundation and Brand Pack rules—populating structured AbmLandingPage properties in Optimizely CMS SaaS: tailored hero value propositions, role-specific proof blocks for the Economic Buyer, Technical Evaluator, and Champion, and bespoke ROI metrics tied to their EU cold-chain expansion.",
      },
    ],
  },
  {
    id: "step-5",
    part: "PART 2 - STEP 5",
    title: "Update Mode - 3-Month Delta Check",
    mode: "Screen Share - Apex Health Partners",
    targetRange: "5:00 - 6:30",
    durationSec: 90,
    rubricTip:
      "Contrast Create vs. Update mode. Highlight the 3-month lookback window on Apex Health (Dr. Elena Park CMIO hire + stage shift) so the agent only rewrites what changed.",
    cues: [
      {
        time: "5:00",
        action: "Click on the 'Apex Health Partners' row in the Q4 Tier-1 ABM table.",
      },
      {
        time: "5:20",
        action: "Point to 'Dr. Elena Park' with the amber 'New' badge, and the 'Web research & market signals' card (2026-10-02 C-suite hire & 2026-09-28 stage shift).",
      },
      {
        time: "6:00",
        action: "Optional: Click 'Run Limitless' on Apex or point to the 'Live - newer draft' badge in ABM landing pages card.",
      },
    ],
    paragraphs: [
      {
        speaker: "THE DAY-TWO ABM PROBLEM",
        text: "While Helix's draft is being assembled in the CMS, let's talk about what happens on Day Two. Because in enterprise sales, building the initial landing page is only half the battle—the real killer is that ABM pages go stale the moment the deal evolves.",
        highlight:
          "Let's click into our second account: Apex Health Partners, a $1.2M Healthcare opportunity.",
      },
      {
        speaker: "EXISTING V1 PAGE VS NEW SIGNALS",
        text: "Apex already has a published v1 microsite that was generated back in July when they were in Discovery. If we ran a naive AI generator today, it would wipe out the page and redo all the research from scratch.",
        highlight:
          "Instead, look at what changed in the last three months: on September 28th, the opportunity moved from Discovery to Evaluation. And on October 2nd, Apex hired a brand-new Chief Medical Information Officer, Dr. Elena Park—flagged right here with the 'New' badge as our Technical Evaluator—while ODP shows four recent visits to our Security & HIPAA Compliance page.",
      },
      {
        speaker: "HOW UPDATE MODE WORKS",
        text: "When we trigger Limitless on Apex, the Router Agent detects the existing v1 page and routes to UPDATE MODE.",
        highlight:
          "Instead of redoing all the foundational research, the Updater Agent performs a lightweight delta check of CRM activity and market signals from the last three months. It sees a material C-suite hire and stage shift, preserves the approved page structure, and surgically rewrites only the sections that changed—adding clinical EHR governance proof points specifically for Dr. Elena Park as the new CMIO.",
      },
    ],
  },
  {
    id: "step-6",
    part: "PART 2 - STEP 6 & 7",
    title: "Publishing, Governance & Delivery",
    mode: "Screen Share - CMS Editor & Live Microsite",
    targetRange: "6:30 - 7:45",
    durationSec: 75,
    rubricTip:
      "Click 'Review in CMS' to show human-in-the-loop governance, mention CMP approval modes, show the live customer subdomain URL, and mention the Field Delivery Engineer (FDE).",
    cues: [
      {
        time: "6:30",
        action: "Scroll to the 'ABM landing pages (CMS)' card. Point to the 'Draft' / 'Live - newer draft' badges.",
      },
      {
        time: "6:45",
        action: "Click 'Review in CMS' to open Optimizely CMS UI (#context=epi.cms.contentdata:///372) in a new tab.",
      },
      {
        time: "7:10",
        action: "Click 'Live site' to show the published account-specific microsite URL.",
      },
    ],
    paragraphs: [
      {
        speaker: "CMS DRAFT & REVIEW LINK",
        text: "Now let's look at how publishing and governance work—because enterprise marketing teams will never let AI publish unvetted claims straight to production.",
        highlight:
          "Look at our ABM Landing Pages (CMS) card right here in the CRM. Our polling endpoint queries the Optimizely CMS Management API in real time. You can see the exact lifecycle state: Draft for newly created pages, or Live - newer draft when an update is waiting for sign-off.",
      },
      {
        speaker: "GOVERNANCE IN CMS & CMP",
        text: "Right from the CRM, I can click 'Review in CMS', which deep-links directly into the content item inside Optimizely CMS.",
        highlight:
          "Here, our brand and legal reviewers stay completely in control. Using Optimizely CMP approval modes and CMS workflow statuses, teams can configure whether low-risk updates auto-publish or require human-in-the-loop sign-off before going live.",
      },
      {
        speaker: "SEGMENT URLS & FDE DELIVERY",
        text: "Once approved and published in CMS, Optimizely Graph indexes the page immediately, our CRM badge flips to 'Live', and marketing receives the clean, account-specific subdomain URL—ready to drop into outbound sequences, executive emails, and paid media.",
        highlight:
          "And when it comes to implementation, customers aren't left to wire these connectors alone—an Optimizely Field Delivery Engineer (FDE) assists directly with configuring the CRM intake, ODP enrichment, and CMS templates so the workflow is production-ready fast.",
      },
    ],
  },
  {
    id: "part-3",
    part: "PART 3",
    title: "Value Summary & Objection Pre-emption",
    mode: "Camera Only - Close Strong",
    targetRange: "7:45 - 9:00",
    durationSec: 75,
    rubricTip:
      "Stop screen sharing! Return full-screen to camera. Connect what they saw to money, time, and risk, and pre-empt the brand control & stale ABM objections.",
    cues: [
      {
        time: "7:45",
        action: "Stop screen share. Look directly into the camera lens for the executive close.",
      },
    ],
    paragraphs: [
      {
        speaker: "THE REAL TEST OF PERSONALIZATION",
        text: "The test of enterprise personalization was never whether you can prompt an AI to generate copy—anyone can do that today. The real test is whether what actually gets published is deeply relevant to the buying committee, 100% on-brand, and still accurate the moment a real decision-maker lands on the page.",
        highlight:
          "Limitless 1:1 Personalization owns that entire lifecycle end-to-end.",
      },
      {
        speaker: "PRE-EMPTING THE BRAND CONTROL OBJECTION",
        text: "Now, when we show this to marketing leaders, the first question they ask is: 'How do we keep quality and brand control at that volume?' And the answer is built into the architecture you just saw: generation never starts from a blank canvas.",
        highlight:
          "It starts from your existing CMS content foundation and Brand Pack rules, while CMP approval modes keep your team in the governance loop.",
      },
      {
        speaker: "THE BUSINESS OUTCOME (TIME, MONEY, RISK)",
        text: "And because the update mode continuously watches for 3-month CRM and market deltas—like a new CMIO joining the evaluation—your pages never rot.",
        highlight:
          "For a revenue team, that's the difference between 100 static landing pages you don't have the headcount to maintain, and 100 living microsites that maintain themselves—accelerating mid-funnel velocity, cutting manual production costs, and eliminating off-brand risk. You're free to grow.",
      },
    ],
  },
];

const KNOWLEDGE_CHECK_FLASHCARDS = [
  {
    q: "1. Funnel Problem",
    a: "Mid-funnel content gap: Every buying committee role needs tailored proof points, and manual production can't scale.",
  },
  {
    q: "2. Concrete Artifact",
    a: "A modular, governed 1:1 microsite (landing page) published per target account or segment.",
  },
  {
    q: "3. Three Data Sources",
    a: "1) CRM account/contact data, 2) ODP behavioral intent data, 3) External web research & market signals.",
  },
  {
    q: "4. Two Operating Modes",
    a: "Create Mode (full research + build) vs. Update Mode (3-month delta check that rewrites only what changed).",
  },
  {
    q: "5. Buying Committee Personas",
    a: "Economic Buyer (ROI/margin), Technical Evaluator (architecture/security), Champion (operational win).",
  },
  {
    q: "6. Publishing & Governance",
    a: "CMS publishes to customer subdomain; CMP approval modes & CMS workflows manage human sign-off.",
  },
  {
    q: "7. Categorization vs. Personalization",
    a: "Categorization puts buyers in broad buckets with identical content; Personalization builds a 1:1 experience per buyer.",
  },
  {
    q: "8. Field Delivery Engineer (FDE)",
    a: "Assists with configuring CRM intake, ODP enrichment, and CMS templates for fast time-to-value.",
  },
];

/* --- Upwards Extrusion Headline Component (Level 02 Playful Type Expression) --- */
function ExtrudedWord({ children }: { children: React.ReactNode }) {
  const layers = [
    { color: "#0D593E", offset: 8 },
    { color: "#166E49", offset: 6 },
    { color: "#2E8C45", offset: 4 },
    { color: "#40A142", offset: 2 },
  ];

  return (
    <span className="relative inline-block select-none mr-2">
      {layers.map((layer, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            color: layer.color,
            transform: `translate(-${layer.offset}px, ${layer.offset}px)`,
            WebkitTextStroke: "1.5px #08251A",
            zIndex: idx + 1,
          }}
        >
          {children}
        </span>
      ))}
      <span
        className="relative"
        style={{
          color: "#ABFF44",
          WebkitTextStroke: "1.5px #08251A",
          zIndex: 10,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* --- Opal Lightning Bolt Icon (Approved AI Icon) --- */
function OpalBoltIcon({ className = "w-5 h-5", fill = "#ABFF44" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13.5 2Z"
        fill={fill}
        stroke="#08251A"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2.2);
  const [fontSize, setFontSize] = useState(32);
  const [mirrorMode, setMirrorMode] = useState(false);
  const [eyeLineGuide, setEyeLineGuide] = useState(true);
  const [showCues, setShowCues] = useState(true);
  const [showRubricDrawer, setShowRubricDrawer] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("part-1");
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [themeMode, setThemeMode] = useState("darkFir");

  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const totalTargetSeconds = 510;

  useEffect(() => {
    if (!isPlaying) return;

    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    const scrollInterval = setInterval(() => {
      if (scrollerRef.current) {
        scrollerRef.current.scrollTop += scrollSpeed * 0.65;
      }
    }, 30);

    return () => {
      clearInterval(timerInterval);
      clearInterval(scrollInterval);
    };
  }, [isPlaying, scrollSpeed]);

  const jumpToSection = (id: string) => {
    setActiveSectionId(id);
    const el = sectionRefs.current[id];
    if (el && scrollerRef.current) {
      const topPos = el.offsetTop - 90;
      scrollerRef.current.scrollTo({ top: topPos, behavior: "smooth" });
    }
  };

  const jumpRelativeSection = (delta: number) => {
    const idx = SCRIPT_SECTIONS.findIndex((s) => s.id === activeSectionId);
    const nextIdx = Math.max(
      0,
      Math.min(SCRIPT_SECTIONS.length - 1, idx + delta)
    );
    jumpToSection(SCRIPT_SECTIONS[nextIdx].id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA")
        return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        setScrollSpeed((s) => Math.min(6, +(s + 0.4).toFixed(1)));
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setScrollSpeed((s) => Math.max(0.4, +(s - 0.4).toFixed(1)));
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        jumpRelativeSection(1);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        jumpRelativeSection(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleScroll = () => {
    if (!scrollerRef.current) return;
    const containerTop = scrollerRef.current.getBoundingClientRect().top;
    let closestId = activeSectionId;
    let minDistance = Infinity;

    SCRIPT_SECTIONS.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - containerTop - 140);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = sec.id;
        }
      }
    });

    if (closestId !== activeSectionId) {
      setActiveSectionId(closestId);
    }
  };

  const toggleComplete = (id: string) => {
    setCompletedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetPrompter = () => {
    setIsPlaying(false);
    setElapsedSeconds(0);
    setActiveSectionId("part-1");
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isDark = themeMode === "darkFir";
  const completedCount = Object.values(completedSections).filter(Boolean).length;

  return (
    <div
      className="min-h-screen flex flex-col select-none"
      style={{
        backgroundColor: isDark ? "#08251A" : "#E4F0DA",
        color: isDark ? "#FFFFFF" : "#08251A",
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;900&family=Roboto+Mono:wght@400;600&family=Roboto:wght@400;500;700&display=swap');
        .font-nudge {
          font-family: 'Roboto Condensed', sans-serif;
          letter-spacing: -0.02em;
          line-height: 1.04;
        }
        .font-mono-brand {
          font-family: 'Roboto Mono', monospace;
          letter-spacing: 0.03em;
        }
      `}</style>

      {/* ==================== TOP STUDIO HEADER BAR ==================== */}
      <header
        className="sticky top-0 z-30 px-6 py-3.5 border-b-2"
        style={{
          backgroundColor: isDark ? "#08251A" : "#FFFFFF",
          borderColor: "#08251A",
        }}
      >
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand Identity & Title */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2"
              style={{
                backgroundColor: "#ABFF44",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              <OpalBoltIcon className="w-4 h-4" fill="#08251A" />
              <span className="font-mono-brand text-xs font-semibold uppercase">
                Opal Studio Prompter
              </span>
            </div>

            <div>
              <h1 className="font-nudge text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <ExtrudedWord>LIMITLESS</ExtrudedWord>
                <span style={{ color: isDark ? "#FFFFFF" : "#08251A" }}>
                  1:1 CERTIFICATION RUN-OF-SHOW
                </span>
              </h1>
            </div>
          </div>

          {/* Center: Live Timer & Target Pacing Bar */}
          <div
            className="flex items-center gap-4 px-5 py-2 rounded-full border-2"
            style={{
              backgroundColor: isDark ? "#EFF6E9" : "#E4F0DA",
              borderColor: "#08251A",
              color: "#08251A",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full border"
                style={{
                  backgroundColor: isPlaying ? "#3AB533" : "#91DBDA",
                  borderColor: "#08251A",
                }}
              />
              <span className="font-mono-brand text-lg font-semibold">
                {formatTime(elapsedSeconds)}
              </span>
              <span className="font-mono-brand text-xs opacity-75">
                / 8:30 TARGET
              </span>
            </div>

            {/* 8-Step Extrusion Progress Bar */}
            <div className="hidden sm:flex items-center gap-1">
              {[
                "#ABFF44",
                "#3AB533",
                "#40A142",
                "#2E8C45",
                "#227D47",
                "#166E49",
                "#116344",
                "#0D593E",
              ].map((extColor, idx) => {
                const stepSize = totalTargetSeconds / 8;
                const active = elapsedSeconds >= idx * stepSize;
                return (
                  <div
                    key={idx}
                    className="w-3.5 h-3.5 rounded-full border transition-transform"
                    style={{
                      backgroundColor: active ? extColor : "#D8E4CB",
                      borderColor: "#08251A",
                      transform: active ? "scale(1.08)" : "scale(1)",
                    }}
                  />
                );
              })}
            </div>

            <button
              onClick={resetPrompter}
              className="font-mono-brand text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#08251A",
                color: "#08251A",
              }}
              title="Reset Timer and Scroll to Top"
            >
              RESET
            </button>
          </div>

          {/* Right: Teleprompter Playback & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="font-nudge text-base font-black uppercase px-6 py-2.5 rounded-full border-2 flex items-center gap-2 transition-transform active:scale-95"
              style={{
                backgroundColor: isPlaying ? "#91DBDA" : "#ABFF44",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              <span>{isPlaying ? "PAUSE" : "START PROMPTER"}</span>
            </button>

            {/* Speed Control */}
            <div
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              <span className="font-mono-brand text-xs font-semibold">SPD</span>
              <button
                onClick={() =>
                  setScrollSpeed((s) => Math.max(0.4, +(s - 0.4).toFixed(1)))
                }
                className="w-6 h-6 rounded-full border font-bold text-xs flex items-center justify-center"
                style={{ backgroundColor: "#E4F0DA", borderColor: "#08251A" }}
              >
                -
              </button>
              <span className="font-mono-brand text-xs font-bold w-8 text-center">
                {scrollSpeed}x
              </span>
              <button
                onClick={() =>
                  setScrollSpeed((s) => Math.min(6, +(s + 0.4).toFixed(1)))
                }
                className="w-6 h-6 rounded-full border font-bold text-xs flex items-center justify-center"
                style={{ backgroundColor: "#ABFF44", borderColor: "#08251A" }}
              >
                +
              </button>
            </div>

            {/* Font Size Control */}
            <div
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              <span className="font-mono-brand text-xs font-semibold">AA</span>
              <button
                onClick={() => setFontSize((f) => Math.max(20, f - 4))}
                className="w-6 h-6 rounded-full border font-bold text-xs flex items-center justify-center"
                style={{ backgroundColor: "#E4F0DA", borderColor: "#08251A" }}
              >
                -
              </button>
              <span className="font-mono-brand text-xs font-bold w-8 text-center">
                {fontSize}
              </span>
              <button
                onClick={() => setFontSize((f) => Math.min(56, f + 4))}
                className="w-6 h-6 rounded-full border font-bold text-xs flex items-center justify-center"
                style={{ backgroundColor: "#ABFF44", borderColor: "#08251A" }}
              >
                +
              </button>
            </div>

            {/* Action Cues Toggle */}
            <button
              onClick={() => setShowCues((c) => !c)}
              className="font-mono-brand text-xs font-semibold px-3.5 py-2 rounded-full border-2"
              style={{
                backgroundColor: showCues ? "#7DDD3D" : "#FFFFFF",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              {showCues ? "CUES: ON" : "CUES: OFF"}
            </button>

            {/* Camera Eye-Line Guide Toggle */}
            <button
              onClick={() => setEyeLineGuide((g) => !g)}
              className="font-mono-brand text-xs font-semibold px-3.5 py-2 rounded-full border-2"
              style={{
                backgroundColor: eyeLineGuide ? "#91DBDA" : "#FFFFFF",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              EYE-LINE
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() =>
                setThemeMode((t) =>
                  t === "darkFir" ? "neutralLight" : "darkFir"
                )
              }
              className="font-mono-brand text-xs font-semibold px-3.5 py-2 rounded-full border-2"
              style={{
                backgroundColor: "#EFF6E9",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              {isDark ? "LIGHT STUDIO" : "DARK FIR"}
            </button>

            {/* Mirror Mode Toggle */}
            <button
              onClick={() => setMirrorMode((m) => !m)}
              className="font-mono-brand text-xs font-semibold px-3.5 py-2 rounded-full border-2"
              style={{
                backgroundColor: mirrorMode ? "#ABFF44" : "#FFFFFF",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              MIRROR
            </button>

            {/* Knowledge Check Drawer Toggle */}
            <button
              onClick={() => setShowRubricDrawer((d) => !d)}
              className="font-mono-brand text-xs font-semibold px-3.5 py-2 rounded-full border-2"
              style={{
                backgroundColor: showRubricDrawer ? "#ABFF44" : "#FFFFFF",
                borderColor: "#08251A",
                color: "#08251A",
              }}
            >
              QA CHEAT SHEET
            </button>
          </div>
        </div>
      </header>

      {/* ==================== MAIN WORKSPACE ==================== */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* ---------- LEFT SIDEBAR: RUN-OF-SHOW CHAPTER NAVIGATOR ---------- */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          <div
            className="p-5 rounded-[32px] border-2"
            style={{
              backgroundColor: isDark ? "#EFF6E9" : "#FFFFFF",
              borderColor: "#08251A",
              color: "#08251A",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-brand text-xs font-semibold uppercase tracking-wider">
                RUN-OF-SHOW CHAPTERS
              </span>
              <span
                className="font-mono-brand text-xs font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: "#ABFF44",
                  borderColor: "#08251A",
                }}
              >
                {completedCount}/{SCRIPT_SECTIONS.length} DONE
              </span>
            </div>

            <nav className="space-y-2">
              {SCRIPT_SECTIONS.map((sec, index) => {
                const isActive = activeSectionId === sec.id;
                const isDone = !!completedSections[sec.id];
                return (
                  <div
                    key={sec.id}
                    onClick={() => jumpToSection(sec.id)}
                    className="group cursor-pointer p-3 rounded-[24px] border-2 transition-all flex items-start justify-between gap-2"
                    style={{
                      backgroundColor: isActive
                        ? "#ABFF44"
                        : isDone
                        ? "#E4F0DA"
                        : "#FFFFFF",
                      borderColor: "#08251A",
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-brand text-[11px] font-bold uppercase">
                          {sec.part}
                        </span>
                        <span className="font-mono-brand text-[11px] opacity-75">
                          ({sec.targetRange})
                        </span>
                      </div>
                      <div className="font-nudge text-base font-bold uppercase truncate mt-0.5">
                        {index + 1}. {sec.title}
                      </div>
                      <div className="text-xs opacity-80 truncate">
                        {sec.mode}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(sec.id);
                      }}
                      className="w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center text-xs font-bold mt-1"
                      style={{
                        backgroundColor: isDone ? "#3AB533" : "#FFFFFF",
                        borderColor: "#08251A",
                        color: "#08251A",
                      }}
                      title="Mark section complete"
                    >
                      {isDone ? "✓" : ""}
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* Quick Launch Demo Links */}
            <div
              className="mt-5 pt-4 border-t-2 space-y-2"
              style={{ borderColor: "#08251A" }}
            >
              <div className="font-mono-brand text-xs font-semibold uppercase">
                LIVE DEMO SHORTCUTS
              </div>
              <a
                href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms#context=epi.cms.contentdata:///372"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3.5 rounded-full border-2 font-mono-brand text-xs font-semibold flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: "#91DBDA",
                  borderColor: "#08251A",
                  color: "#08251A",
                }}
              >
                <span>Open CMS (#372 Apex)</span>
                <span>↗</span>
              </a>
              <a
                href="https://github.com/marvoey/opti-baseline/tree/limitless-demo/app/demo/crm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3.5 rounded-full border-2 font-mono-brand text-xs font-semibold flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: "#E4F0DA",
                  borderColor: "#08251A",
                  color: "#08251A",
                }}
              >
                <span>GitHub: /app/demo/crm</span>
                <span>↗</span>
              </a>
            </div>

            {/* Keyboard Shortcuts Legend */}
            <div
              className="mt-4 p-3 rounded-[20px] border text-xs space-y-1"
              style={{
                backgroundColor: "#E4F0DA",
                borderColor: "#08251A",
              }}
            >
              <div className="font-mono-brand font-bold uppercase text-[11px]">
                HOTKEYS
              </div>
              <div className="flex justify-between">
                <span>Play / Pause</span>
                <span className="font-mono-brand font-semibold">SPACE</span>
              </div>
              <div className="flex justify-between">
                <span>Scroll Speed</span>
                <span className="font-mono-brand font-semibold">UP / DOWN</span>
              </div>
              <div className="flex justify-between">
                <span>Prev / Next Step</span>
                <span className="font-mono-brand font-semibold">LEFT / RIGHT</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ---------- CENTER / RIGHT: TELEPROMPTER SCRIPT STAGE ---------- */}
        <main className="lg:col-span-9 relative flex flex-col">
          {/* Camera Eye-Line Reading Band Overlay */}
          {eyeLineGuide && (
            <div
              className="pointer-events-none absolute left-0 right-0 top-[150px] h-[150px] z-20 border-y-2 flex items-center justify-between px-4"
              style={{
                borderColor: "#ABFF44",
                backgroundColor: isDark
                  ? "rgba(171, 255, 68, 0.07)"
                  : "rgba(58, 181, 51, 0.10)",
              }}
            >
              <div
                className="px-2.5 py-1 rounded-full border font-mono-brand text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: "#ABFF44",
                  borderColor: "#08251A",
                  color: "#08251A",
                }}
              >
                CAMERA EYE-LINE ZONE
              </div>
              <div
                className="px-2.5 py-1 rounded-full border font-mono-brand text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: "#ABFF44",
                  borderColor: "#08251A",
                  color: "#08251A",
                }}
              >
                KEEP EYES HERE
              </div>
            </div>
          )}

          {/* Scrollable Teleprompter Viewport */}
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="h-[calc(100vh-140px)] overflow-y-auto rounded-[32px] border-2 px-8 md:px-14 py-12 space-y-16"
            style={{
              backgroundColor: isDark ? "#08251A" : "#FFFFFF",
              borderColor: "#08251A",
              transform: mirrorMode ? "scaleX(-1)" : "none",
            }}
          >
            {/* Top Lead-in Spacer */}
            <div className="h-16 flex items-center justify-center">
              <div
                className="px-5 py-2 rounded-full border-2 font-mono-brand text-xs font-semibold uppercase"
                style={{
                  backgroundColor: "#EFF6E9",
                  borderColor: "#08251A",
                  color: "#08251A",
                }}
              >
                RECORDING IN ONE UNBROKEN TAKE (8-10 MINUTES) - PRESS SPACE TO
                SCROLL
              </div>
            </div>

            {SCRIPT_SECTIONS.map((sec, idx) => (
              <section
                key={sec.id}
                ref={(el) => {
                  sectionRefs.current[sec.id] = el;
                }}
                className="p-8 rounded-[32px] border-2 transition-all space-y-6"
                style={{
                  backgroundColor: isDark ? "#EFF6E9" : "#E4F0DA",
                  borderColor: "#08251A",
                  color: "#08251A",
                }}
              >
                {/* Section Header Banner */}
                <div
                  className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2"
                  style={{ borderColor: "#08251A" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3.5 py-1 rounded-full border-2 font-mono-brand text-xs font-bold uppercase"
                      style={{
                        backgroundColor: "#ABFF44",
                        borderColor: "#08251A",
                        color: "#08251A",
                      }}
                    >
                      {sec.part}
                    </span>
                    <h2 className="font-nudge text-2xl md:text-3xl font-black uppercase">
                      {idx + 1}. {sec.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-3.5 py-1 rounded-full border-2 font-mono-brand text-xs font-semibold"
                      style={{
                        backgroundColor: "#91DBDA",
                        borderColor: "#08251A",
                        color: "#08251A",
                      }}
                    >
                      {sec.mode}
                    </span>
                    <span
                      className="px-3.5 py-1 rounded-full border-2 font-mono-brand text-xs font-bold"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#08251A",
                        color: "#08251A",
                      }}
                    >
                      {sec.targetRange}
                    </span>
                  </div>
                </div>

                {/* Assessor Rubric Callout */}
                <div
                  className="p-4 rounded-[24px] border-2 flex items-start gap-3"
                  style={{
                    backgroundColor: "#E4F0DA",
                    borderColor: "#08251A",
                  }}
                >
                  <OpalBoltIcon
                    className="w-5 h-5 shrink-0 mt-0.5"
                    fill="#3AB533"
                  />
                  <div className="text-sm font-medium leading-snug">
                    <span className="font-mono-brand text-xs font-bold uppercase mr-2">
                      ASSESSOR RUBRIC CHECK:
                    </span>
                    {sec.rubricTip}
                  </div>
                </div>

                {/* Stage & Click Cues */}
                {showCues && sec.cues && sec.cues.length > 0 && (
                  <div className="space-y-2">
                    {sec.cues.map((cue, cIdx) => (
                      <div
                        key={cIdx}
                        className="px-4 py-2.5 rounded-[20px] border-2 flex items-center gap-3"
                        style={{
                          backgroundColor: "#91DBDA",
                          borderColor: "#08251A",
                          color: "#08251A",
                        }}
                      >
                        <span
                          className="px-2.5 py-0.5 rounded-full border font-mono-brand text-xs font-bold"
                          style={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#08251A",
                          }}
                        >
                          CLICK / ACTION @ {cue.time}
                        </span>
                        <span className="font-semibold text-sm md:text-base">
                          {cue.action}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Spoken Teleprompter Script Paragraphs */}
                <div className="space-y-8 pt-2">
                  {sec.paragraphs.map((p, pIdx) => (
                    <div key={pIdx} className="space-y-3">
                      <div className="font-mono-brand text-xs font-bold uppercase tracking-wider opacity-70">
                        [{p.speaker}]
                      </div>
                      <p
                        className="font-medium transition-all"
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: 1.32,
                          color: "#08251A",
                        }}
                      >
                        {p.text}
                      </p>
                      {p.highlight && (
                        <div
                          className="p-5 rounded-[24px] border-2 font-bold"
                          style={{
                            backgroundColor: "#ABFF44",
                            borderColor: "#08251A",
                            color: "#08251A",
                            fontSize: `${Math.max(20, fontSize - 2)}px`,
                            lineHeight: 1.3,
                          }}
                        >
                          "{p.highlight}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Section Footer Action */}
                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={() => toggleComplete(sec.id)}
                    className="px-5 py-2 rounded-full border-2 font-mono-brand text-xs font-bold uppercase transition-colors"
                    style={{
                      backgroundColor: completedSections[sec.id]
                        ? "#3AB533"
                        : "#FFFFFF",
                      borderColor: "#08251A",
                      color: "#08251A",
                    }}
                  >
                    {completedSections[sec.id]
                      ? "SECTION DELIVERED"
                      : "MARK SECTION COMPLETE"}
                  </button>

                  {idx < SCRIPT_SECTIONS.length - 1 && (
                    <button
                      onClick={() => jumpToSection(SCRIPT_SECTIONS[idx + 1].id)}
                      className="px-5 py-2 rounded-full border-2 font-mono-brand text-xs font-bold uppercase"
                      style={{
                        backgroundColor: "#7DDD3D",
                        borderColor: "#08251A",
                        color: "#08251A",
                      }}
                    >
                      NEXT: {SCRIPT_SECTIONS[idx + 1].title}
                    </button>
                  )}
                </div>
              </section>
            ))}

            {/* Bottom Runway Spacer */}
            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
              <div
                className="px-6 py-3 rounded-full border-2 font-nudge text-2xl font-black uppercase"
                style={{
                  backgroundColor: "#ABFF44",
                  borderColor: "#08251A",
                  color: "#08251A",
                }}
              >
                YOU'RE FREE TO GROW - END OF RECORDING
              </div>
              <p className="font-mono-brand text-xs opacity-80">
                Hold eye contact for 2 seconds before clicking Stop Recording.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== KNOWLEDGE CHECK MODAL / DRAWER ==================== */}
      {showRubricDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(8, 37, 26, 0.85)" }}
        >
          <div
            className="max-w-4xl w-full p-8 rounded-[32px] border-2 max-h-[85vh] overflow-y-auto space-y-6"
            style={{
              backgroundColor: "#EFF6E9",
              borderColor: "#08251A",
              color: "#08251A",
            }}
          >
            <div
              className="flex items-center justify-between pb-4 border-b-2"
              style={{ borderColor: "#08251A" }}
            >
              <div className="flex items-center gap-3">
                <OpalBoltIcon className="w-6 h-6" fill="#ABFF44" />
                <h2 className="font-nudge text-2xl font-black uppercase">
                  MODULE 1 KNOWLEDGE CHECK - RAPID REFERENCE
                </h2>
              </div>
              <button
                onClick={() => setShowRubricDrawer(false)}
                className="px-4 py-1.5 rounded-full border-2 font-mono-brand text-xs font-bold uppercase"
                style={{
                  backgroundColor: "#ABFF44",
                  borderColor: "#08251A",
                }}
              >
                CLOSE
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KNOWLEDGE_CHECK_FLASHCARDS.map((card, i) => (
                <div
                  key={i}
                  className="p-4 rounded-[24px] border-2 space-y-1.5"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#08251A",
                  }}
                >
                  <div
                    className="inline-block px-3 py-0.5 rounded-full border font-mono-brand text-xs font-bold"
                    style={{
                      backgroundColor: i % 2 === 0 ? "#ABFF44" : "#91DBDA",
                      borderColor: "#08251A",
                    }}
                  >
                    {card.q}
                  </div>
                  <p className="text-sm font-medium leading-snug pt-1">
                    {card.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
