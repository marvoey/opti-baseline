'use client';

import React, { useState, useEffect } from "react";

/* =========================================================
   OPTIMIZELY BRANDED ANIMATED INTRO SLIDE / MINI-DECK
   Module 1 Certification: Limitless 1:1 Personalization
   Brand Pack Rules Enforced:
   - Colors: LFGreen (#ABFF44), Grass (#7DDD3D), Good-to-go (#3AB533),
     Dark Fir (#08251A), Light Blue (#91DBDA), Neutral 1 (#FFFFFF),
     Neutral 2 (#EFF6E9), Neutral 3 (#E4F0DA), Neutral 4 (#D8E4CB)
   - Extrusion Sequence (Upwards 5-Step):
     Step 1 (Front): #ABFF44
     Step 2: #40A142
     Step 3: #2E8C45
     Step 4: #166E49
     Step 5 (Deepest): #0D593E
   - Hard Constraints:
     * NO gradients anywhere (solid brand colors only)
     * Dark Fir (#08251A) is the ONLY permitted stroke color
     * Generously rounded 32px corners (continuous pillow shape)
     * Only ONE word or phrase in a headline is extruded
   ========================================================= */

/* --- Official Optimizely Extruded Word Component (5-Step Upwards Effect) --- */
function ExtrudedHeadlineWord({ children, animate = true }: { children: React.ReactNode; animate?: boolean }) {
  const steps = [
    { color: "#0D593E", x: -12, y: 12, delay: "0.28s" }, // Extrusion 8 (Layer 5)
    { color: "#166E49", x: -9, y: 9, delay: "0.21s" },   // Extrusion 6 (Layer 4)
    { color: "#2E8C45", x: -6, y: 6, delay: "0.14s" },   // Extrusion 4 (Layer 3)
    { color: "#40A142", x: -3, y: 3, delay: "0.07s" },   // Extrusion 3 (Layer 2)
  ];

  return (
    <span className="relative inline-block select-none mx-2 my-1">
      {steps.map((s, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out"
          style={{
            color: s.color,
            transform: animate ? `translate(${s.x}px, ${s.y}px)` : "translate(0px, 0px)",
            transitionDelay: s.delay,
            WebkitTextStroke: "2px #08251A",
            fontFamily: "'Roboto Condensed', sans-serif",
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          {children}
        </span>
      ))}
      <span
        className="relative z-10 inline-block transition-transform duration-500"
        style={{
          color: "#ABFF44", // Extrusion 1 (Front Layer)
          WebkitTextStroke: "2px #08251A",
          fontFamily: "'Roboto Condensed', sans-serif",
          fontWeight: 900,
          letterSpacing: "-0.03em",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* --- Official Optimizely Wordmark Badge (Brand-Compliant Vector) --- */
function OptimizelyLogo({ size = "md" }) {
  const scale = size === "lg" ? "text-4xl" : "text-2xl";
  const layers = [
    { color: "#0D593E", x: -5, y: 5 },
    { color: "#166E49", x: -3.75, y: 3.75 },
    { color: "#2E8C45", x: -2.5, y: 2.5 },
    { color: "#40A142", x: -1.25, y: 1.25 },
  ];

  return (
    <div className="relative inline-flex items-center select-none py-1 pl-2">
      <span className={`relative inline-block font-black tracking-tight ${scale}`} style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>
        {layers.map((l, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              color: l.color,
              transform: `translate(${l.x}px, ${l.y}px)`,
              WebkitTextStroke: "1.5px #08251A",
            }}
          >
            Optimizely
          </span>
        ))}
        <span
          className="relative z-10"
          style={{
            color: "#ABFF44",
            WebkitTextStroke: "1.5px #08251A",
          }}
        >
          Optimizely
        </span>
      </span>
    </div>
  );
}

/* --- Limitless Infinity Vector Icon (from assets/Icons/limitless-600x600-light.svg) --- */
function LimitlessIcon({ className = "w-8 h-8", color = "#ABFF44" }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 12C19.85 12 10 20.06 10 30C10 39.94 19.85 48 32 48C40.1 48 46.8 43.5 52.5 37.5L67.5 22.5C73.2 16.5 79.9 12 88 12C100.15 12 110 20.06 110 30C110 39.94 100.15 48 88 48C79.9 48 73.2 43.5 67.5 37.5L59 29"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 21L44 15"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* --- Opal AI Lightning Bolt Icon --- */
function OpalBoltIcon({ className = "w-5 h-5", fill = "#08251A" }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} className={className} aria-hidden="true">
      <path d="M13 2L4 14h7l-2 8 11-12h-7l2-8z" />
    </svg>
  );
}

export default function LimitlessCertificationIntroDeck() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [stageStep, setStageStep] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);
  const [bucketShattered, setBucketShattered] = useState(false);
  const [activeAccountIdx, setActiveAccountIdx] = useState(0);
  const [countdown, setCountdown] = useState<number | "LIVE!" | null>(null);

  const demoAccounts = [
    {
      name: "Helix Freight Group",
      domain: "helix.vantagecloud-demo.com",
      stage: "Discovery · $480K",
      mode: "CREATE MODE",
      modeColor: "#ABFF44",
      signals: ["3 EU Cold-Chain Hubs", "14 ODP Sessions", "Legacy TMS Objection"],
      committee: [
        { role: "Economic Buyer", name: "Marcus Lee (CFO)", focus: "Margin Pressure and ROI" },
        { role: "Technical Evaluator", name: "Priya Natarajan (VP IT)", focus: "Zero-Downtime TMS Migration" },
        { role: "Champion", name: "Tom Becker (Fleet Dir)", focus: "Real-Time Hub Visibility" },
      ],
    },
    {
      name: "Apex Health Partners",
      domain: "apex.vantagecloud-demo.com",
      stage: "Evaluation · $1.2M",
      mode: "UPDATE MODE (3-MO DELTA)",
      modeColor: "#91DBDA",
      signals: ["New CMIO Hired (Oct 2)", "Moved to Evaluation", "4x HIPAA Page Visits"],
      committee: [
        { role: "Economic Buyer", name: "Rachel Owens (SVP Fin)", focus: "Clinical Hub TCO" },
        { role: "Technical Evaluator", name: "Dr. Elena Park (NEW CMIO)", focus: "HIPAA and EHR Governance" },
        { role: "Champion", name: "Victor Hale (Dir Access)", focus: "Patient Portal Speed" },
      ],
    },
  ];

  const tickerItems = [
    "⚡ YOU ARE FREE TO GROW",
    "SWAP LIMITS FOR LIMITLESS",
    "CATEGORIZATION IS NOT PERSONALIZATION",
    "CRM + ODP + WEB RESEARCH ENRICHMENT",
    "CREATE MODE + 3-MONTH DELTA UPDATE MODE",
    "GOVERNED IN OPTIMIZELY CMS + CMP",
  ];

  // Staggered entrance animation on Slide 0
  useEffect(() => {
    setStageStep(0);
    const t1 = setTimeout(() => setStageStep(1), 150);
    const t2 = setTimeout(() => setStageStep(2), 450);
    const t3 = setTimeout(() => setStageStep(3), 850);
    const t4 = setTimeout(() => setStageStep(4), 1250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [activeSlide]);

  // Auto-toggle between Helix (Create) and Apex (Update) preview cards on Slide 0
  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setActiveAccountIdx((prev) => (prev + 1) % demoAccounts.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [autoCycle]);

  // Keyboard navigation (Arrow keys + Space + B to shatter bucket)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveSlide((prev) => Math.min(2, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setActiveSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === "b" || e.key === "B") {
        setBucketShattered((prev) => !prev);
      } else if (e.key === " ") {
        e.preventDefault();
        if (activeSlide < 2) {
          setActiveSlide((prev) => prev + 1);
        } else {
          triggerLaunchCountdown();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlide]);

  const triggerLaunchCountdown = () => {
    setCountdown(3);
    const i = setInterval(() => {
      setCountdown((prev) => {
        if (typeof prev !== "number" || prev <= 1) {
          clearInterval(i);
          return "LIVE!";
        }
        return prev - 1;
      });
    }, 850);
  };

  const replayIntro = () => {
    setStageStep(0);
    setBucketShattered(false);
    setCountdown(null);
    setTimeout(() => setStageStep(1), 100);
    setTimeout(() => setStageStep(2), 350);
    setTimeout(() => setStageStep(3), 700);
    setTimeout(() => setStageStep(4), 1050);
  };

  const currentAcct = demoAccounts[activeAccountIdx];

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between select-none overflow-hidden"
      style={{
        backgroundColor: "#08251A", // Dark Fir backdrop
        color: "#FFFFFF",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Google Fonts and Custom Keyframe Animations (Strictly NO Gradients) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,700;0,900;1,700&family=Roboto+Mono:wght@400;600;700&family=Roboto:wght@400;500;700;900&display=swap');

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 0.4; }
          100% { transform: scale(0.95); opacity: 0.9; }
        }
        @keyframes tickerSlide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-float {
          animation: floatSlow 4s ease-in-out infinite;
        }
        .animate-pulse-ring {
          animation: pulseRing 2.4s ease-in-out infinite;
        }
        .animate-ticker {
          display: flex;
          width: 200%;
          animation: tickerSlide 22s linear infinite;
        }
      `}</style>

      {/* =========================================================
          TOP BRAND HEADER BAR
          ========================================================= */}
      <header
        className="w-full px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b-2"
        style={{ backgroundColor: "#0D3A29", borderColor: "#197050" }}
      >
        <div className="flex items-center gap-5">
          <OptimizelyLogo size="md" />
          <div className="h-6 w-0.5" style={{ backgroundColor: "#197050" }} />
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: "#ABFF44",
              color: "#08251A",
              borderRadius: "32px",
              border: "2px solid #08251A",
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            <OpalBoltIcon className="w-4 h-4" fill="#08251A" />
            SA Certification · Module 01
          </div>
        </div>

        {/* Slide Switcher Pills */}
        <div className="flex items-center gap-2">
          {[
            { id: 0, label: "01 · Hero Title" },
            { id: 1, label: "02 · Smash The Bucket" },
            { id: 2, label: "03 · Agentic Architecture" },
          ].map((tab) => {
            const active = activeSlide === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSlide(tab.id)}
                className="px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer"
                style={{
                  backgroundColor: active ? "#ABFF44" : "#08251A",
                  color: active ? "#08251A" : "#E4F0DA",
                  borderRadius: "32px",
                  border: "2px solid #08251A",
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            onClick={replayIntro}
            title="Replay entrance animations"
            className="ml-2 px-3.5 py-2 text-xs font-bold uppercase transition-all cursor-pointer"
            style={{
              backgroundColor: "#91DBDA",
              color: "#08251A",
              borderRadius: "32px",
              border: "2px solid #08251A",
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            ↻ Replay
          </button>
        </div>
      </header>

      {/* =========================================================
          MAIN 16:9 STAGE AREA
          ========================================================= */}
      <main className="flex-1 flex items-center justify-center px-8 py-6">
        <div className="w-full max-w-7xl">
          {/* ---------------------------------------------------------
              SLIDE 0: HERO INTRO — LIMITLESS 1:1 PERSONALIZATION
              --------------------------------------------------------- */}
          {activeSlide === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: High-Impact Extruded Typography */}
              <div className="lg:col-span-7 space-y-6">
                {/* Eyebrow Badge */}
                <div
                  className={`inline-flex items-center gap-3 px-5 py-2 transition-all duration-500 ${
                    stageStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    backgroundColor: "#E4F0DA",
                    color: "#08251A",
                    borderRadius: "32px",
                    border: "2px solid #08251A",
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: "#3AB533", border: "1.5px solid #08251A" }}
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ fontFamily: "'Roboto Mono', monospace" }}
                  >
                    WELCOME TO THE LAND OF MARKETING LIBERATION
                  </span>
                </div>

                {/* Main Hero Headline with Level 02 Playful Upwards Extrusion */}
                <div
                  className={`transition-all duration-700 ${
                    stageStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className="p-3 animate-float"
                      style={{
                        backgroundColor: "#0D3A29",
                        borderRadius: "24px",
                        border: "2px solid #ABFF44",
                      }}
                    >
                      <LimitlessIcon className="w-12 h-12" color="#ABFF44" />
                    </div>
                    <span
                      className="text-sm font-bold uppercase tracking-widest px-3 py-1"
                      style={{
                        backgroundColor: "#91DBDA",
                        color: "#08251A",
                        borderRadius: "32px",
                        fontFamily: "'Roboto Mono', monospace",
                      }}
                    >
                      CLOSE THE MID-FUNNEL GAP
                    </span>
                  </div>

                  <h1
                    className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tight"
                    style={{ fontFamily: "'Roboto Condensed', sans-serif", letterSpacing: "-0.03em" }}
                  >
                    <ExtrudedHeadlineWord animate={stageStep >= 2}>
                      ONE ACCOUNT.
                    </ExtrudedHeadlineWord>
                    <span className="block mt-3 text-white">
                      ONE GOVERNED MICROSITE
                    </span>
                  </h1>
                </div>

                {/* Candid Challenger Subheadline */}
                <p
                  className={`text-xl sm:text-2xl leading-snug max-w-2xl transition-all duration-700 ${
                    stageStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ color: "#E4F0DA" }}
                >
                  Twenty years of putting buyers into broad segments wasn’t personalization—it was{" "}
                  <span
                    className="px-2.5 py-0.5 font-bold"
                    style={{
                      backgroundColor: "#FF99B6",
                      color: "#08251A",
                      borderRadius: "16px",
                    }}
                  >
                    categorization
                  </span>
                  . Watch autonomous Opal agents research, build, govern, and refresh a bespoke microsite for every target account.
                </p>

                {/* Presenter Card + Interactive Cue Buttons */}
                <div
                  className={`pt-2 flex flex-wrap items-center gap-4 transition-all duration-700 ${
                    stageStep >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  {/* Presenter Pill */}
                  <div
                    className="flex items-center gap-4 px-6 py-3.5"
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#08251A",
                      borderRadius: "32px",
                      border: "3px solid #08251A",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
                      style={{
                        backgroundColor: "#ABFF44",
                        color: "#08251A",
                        border: "2px solid #08251A",
                        fontFamily: "'Roboto Condensed', sans-serif",
                      }}
                    >
                      MO
                    </div>
                    <div>
                      <div
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: "#197050", fontFamily: "'Roboto Mono', monospace" }}
                      >
                        SOLUTIONS ARCHITECT
                      </div>
                      <div
                        className="text-xl font-black uppercase"
                        style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                      >
                        Marvin Oey
                      </div>
                    </div>
                  </div>

                  {/* Interactive Slide Trigger */}
                  <button
                    onClick={() => setActiveSlide(1)}
                    className="px-7 py-4 text-base font-black uppercase tracking-wide flex items-center gap-3 transition-transform active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: "#ABFF44",
                      color: "#08251A",
                      borderRadius: "32px",
                      border: "3px solid #08251A",
                      fontFamily: "'Roboto Condensed', sans-serif",
                    }}
                  >
                    <OpalBoltIcon className="w-5 h-5" fill="#08251A" />
                    Smash The Bucket →
                  </button>
                </div>
              </div>

              {/* Right Column: Live Animated 1:1 Microsite Synthesizer Card */}
              <div
                className={`lg:col-span-5 transition-all duration-700 ${
                  stageStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                <div
                  className="p-6 relative"
                  style={{
                    backgroundColor: "#EFF6E9", // Neutral 2 AAA backdrop
                    color: "#08251A",
                    borderRadius: "32px",
                    border: "4px solid #08251A",
                  }}
                >
                  {/* Floating Mode Pill */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full animate-pulse-ring"
                        style={{ backgroundColor: "#3AB533", border: "1.5px solid #08251A" }}
                      />
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ fontFamily: "'Roboto Mono', monospace" }}
                      >
                        lim1_abm_orchestrator
                      </span>
                    </div>
                    <span
                      className="px-3 py-1 text-xs font-bold uppercase"
                      style={{
                        backgroundColor: currentAcct.modeColor,
                        color: "#08251A",
                        borderRadius: "32px",
                        border: "2px solid #08251A",
                        fontFamily: "'Roboto Mono', monospace",
                      }}
                    >
                      {currentAcct.mode}
                    </span>
                  </div>

                  {/* Target Account Header Box */}
                  <div
                    className="p-4 mb-4"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "24px",
                      border: "2px solid #08251A",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className="text-xs font-bold uppercase"
                          style={{ color: "#197050", fontFamily: "'Roboto Mono', monospace" }}
                        >
                          TARGET ACCOUNT MICROSITE
                        </div>
                        <div
                          className="text-2xl font-black uppercase mt-0.5"
                          style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                        >
                          {currentAcct.name}
                        </div>
                      </div>
                      <span
                        className="px-3 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: "#E4F0DA",
                          color: "#08251A",
                          borderRadius: "32px",
                          border: "1.5px solid #08251A",
                          fontFamily: "'Roboto Mono', monospace",
                        }}
                      >
                        {currentAcct.stage}
                      </span>
                    </div>
                    <div
                      className="mt-2 text-xs font-semibold truncate px-3 py-1.5"
                      style={{
                        backgroundColor: "#08251A",
                        color: "#ABFF44",
                        borderRadius: "16px",
                        fontFamily: "'Roboto Mono', monospace",
                      }}
                    >
                      https://{currentAcct.domain}
                    </div>
                  </div>

                  {/* Tri-Source Intelligence Chips */}
                  <div className="mb-4">
                    <div
                      className="text-xs font-bold uppercase mb-2"
                      style={{ fontFamily: "'Roboto Mono', monospace" }}
                    >
                      TRI-SOURCE ENRICHMENT SIGNALS (CRM + ODP + WEB)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentAcct.signals.map((sig, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: i === 0 ? "#ABFF44" : i === 1 ? "#91DBDA" : "#E4F0DA",
                            color: "#08251A",
                            borderRadius: "32px",
                            border: "1.5px solid #08251A",
                          }}
                        >
                          ✦ {sig}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buying Committee Persona Slots */}
                  <div className="space-y-2.5">
                    <div
                      className="text-xs font-bold uppercase"
                      style={{ fontFamily: "'Roboto Mono', monospace" }}
                    >
                      INFERRED BUYING COMMITTEE PERSONAS
                    </div>
                    {currentAcct.committee.map((member, i) => (
                      <div
                        key={i}
                        className="p-3 flex items-center justify-between gap-3"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "20px",
                          border: "2px solid #08251A",
                        }}
                      >
                        <div>
                          <div className="text-xs font-bold uppercase" style={{ color: "#197050" }}>
                            {member.role}
                          </div>
                          <div className="text-sm font-bold text-slate-900">{member.name}</div>
                        </div>
                        <span
                          className="px-3 py-1 text-xs font-bold text-right"
                          style={{
                            backgroundColor: "#E4F0DA",
                            color: "#08251A",
                            borderRadius: "16px",
                            border: "1.5px solid #08251A",
                          }}
                        >
                          {member.focus}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Account Switcher Dots */}
                  <div className="mt-5 pt-3 border-t-2 border-slate-200 flex items-center justify-between">
                    <div className="flex gap-2">
                      {demoAccounts.map((a, idx) => (
                        <button
                          key={a.name}
                          onClick={() => {
                            setAutoCycle(false);
                            setActiveAccountIdx(idx);
                          }}
                          className="px-3 py-1 text-xs font-bold uppercase cursor-pointer"
                          style={{
                            backgroundColor: activeAccountIdx === idx ? "#08251A" : "#D8E4CB",
                            color: activeAccountIdx === idx ? "#ABFF44" : "#08251A",
                            borderRadius: "32px",
                            fontFamily: "'Roboto Mono', monospace",
                          }}
                        >
                          {idx === 0 ? "Helix (Create)" : "Apex (Update)"}
                        </button>
                      ))}
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#197050", fontFamily: "'Roboto Mono', monospace" }}
                    >
                      CMS + CMP Governed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------
              SLIDE 1: THE CHALLENGER REFRAME — BUCKETS VS. 1:1
              --------------------------------------------------------- */}
          {activeSlide === 1 && (
            <div className="space-y-8">
              <div className="text-center max-w-4xl mx-auto space-y-3">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase"
                  style={{
                    backgroundColor: "#91DBDA",
                    color: "#08251A",
                    borderRadius: "32px",
                    border: "2px solid #08251A",
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  THE CHALLENGER REFRAME · PRESS [B] OR CLICK TO SMASH THE BUCKET
                </div>
                <h2
                  className="text-5xl sm:text-6xl font-black uppercase tracking-tight"
                  style={{ fontFamily: "'Roboto Condensed', sans-serif", letterSpacing: "-0.03em" }}
                >
                  STOP CALLING BUCKETS{" "}
                  <ExtrudedHeadlineWord animate={true}>PERSONALIZATION</ExtrudedHeadlineWord>
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* LEFT CARD: 20 YEARS OF CATEGORIZATION */}
                <div
                  onClick={() => setBucketShattered(!bucketShattered)}
                  className="p-8 cursor-pointer transition-all duration-500 flex flex-col justify-between relative"
                  style={{
                    backgroundColor: bucketShattered ? "#0D3A29" : "#E4F0DA",
                    color: bucketShattered ? "#A1AC8D" : "#08251A",
                    borderRadius: "32px",
                    border: "4px solid #08251A",
                    transform: bucketShattered ? "scale(0.96)" : "scale(1)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-4 py-1.5 text-xs font-bold uppercase"
                        style={{
                          backgroundColor: "#FF99B6",
                          color: "#08251A",
                          borderRadius: "32px",
                          border: "2px solid #08251A",
                          fontFamily: "'Roboto Mono', monospace",
                        }}
                      >
                        THE OLD WAY · CATEGORIZATION
                      </span>
                      <span
                        className="text-xs font-bold uppercase"
                        style={{ fontFamily: "'Roboto Mono', monospace" }}
                      >
                        {bucketShattered ? "✗ OBSOLETE" : "CLICK TO SHATTER"}
                      </span>
                    </div>

                    <h3
                      className={`text-4xl font-black uppercase mb-3 ${
                        bucketShattered ? "line-through" : ""
                      }`}
                      style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                    >
                      Static Industry Buckets
                    </h3>
                    <p className="text-base mb-6">
                      Everyone in “Logistics” or “Healthcare” gets the exact same hero banner, the same generic case study, and the same stale pitch.
                    </p>

                    <div className="space-y-3">
                      {[
                        "Ignores the distinct needs of the CFO, Architect, and Champion",
                        "Manual landing page production collapses in the mid-funnel",
                        "ABM pages go stale the day after a deal changes stage",
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="p-3.5 flex items-center gap-3 text-sm font-bold"
                          style={{
                            backgroundColor: bucketShattered ? "#08251A" : "#FFFFFF",
                            color: bucketShattered ? "#C3CEAF" : "#08251A",
                            borderRadius: "20px",
                            border: "2px solid #08251A",
                          }}
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                            style={{ backgroundColor: "#FF99B6", color: "#08251A" }}
                          >
                            ✕
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-slate-300 flex items-center justify-between text-xs font-bold uppercase">
                    <span>Mid-Funnel Result:</span>
                    <span
                      className="px-3 py-1"
                      style={{
                        backgroundColor: "#FF99B6",
                        color: "#08251A",
                        borderRadius: "16px",
                      }}
                    >
                      Pipeline Stalls in Discovery
                    </span>
                  </div>
                </div>

                {/* RIGHT CARD: LIMITLESS 1:1 PERSONALIZATION */}
                <div
                  className="p-8 flex flex-col justify-between transition-all duration-500"
                  style={{
                    backgroundColor: "#ABFF44", // LFGreen Hero Card
                    color: "#08251A",
                    borderRadius: "32px",
                    border: "4px solid #08251A",
                    transform: bucketShattered ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5"
                        style={{
                          backgroundColor: "#08251A",
                          color: "#ABFF44",
                          borderRadius: "32px",
                          fontFamily: "'Roboto Mono', monospace",
                        }}
                      >
                        <OpalBoltIcon className="w-3.5 h-3.5" fill="#ABFF44" />
                        THE OPAL WAY · TRUE 1:1
                      </span>
                      <span
                        className="px-3 py-1 text-xs font-bold uppercase"
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#08251A",
                          borderRadius: "32px",
                          border: "2px solid #08251A",
                          fontFamily: "'Roboto Mono', monospace",
                        }}
                      >
                        100% GOVERNED
                      </span>
                    </div>

                    <h3
                      className="text-4xl font-black uppercase mb-3"
                      style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                    >
                      Living Account Microsites
                    </h3>
                    <p className="text-base font-medium mb-6">
                      A bespoke, modular landing page in Optimizely CMS for every single target account—researched, written, and kept fresh by AI agents.
                    </p>

                    <div className="space-y-3">
                      {[
                        "Synthesizes CRM history + ODP behavioral intent + live web signals",
                        "Tailors modular blocks for Economic Buyer, Tech Evaluator and Champion",
                        "3-month delta check surgically updates pages when new stakeholders join",
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="p-3.5 flex items-center gap-3 text-sm font-bold"
                          style={{
                            backgroundColor: "#FFFFFF",
                            color: "#08251A",
                            borderRadius: "20px",
                            border: "2px solid #08251A",
                          }}
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                            style={{
                              backgroundColor: "#3AB533",
                              color: "#FFFFFF",
                              border: "1.5px solid #08251A",
                            }}
                          >
                            ✓
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-emerald-950 flex items-center justify-between text-xs font-bold uppercase">
                    <span>Mid-Funnel Result:</span>
                    <button
                      onClick={() => setActiveSlide(2)}
                      className="px-4 py-1.5 font-black cursor-pointer"
                      style={{
                        backgroundColor: "#08251A",
                        color: "#ABFF44",
                        borderRadius: "16px",
                      }}
                    >
                      See Agent Architecture →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------
              SLIDE 2: AGENTIC WORKFLOW AND DEMO LAUNCHPAD
              --------------------------------------------------------- */}
          {activeSlide === 2 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span
                    className="px-4 py-1 text-xs font-bold uppercase"
                    style={{
                      backgroundColor: "#ABFF44",
                      color: "#08251A",
                      borderRadius: "32px",
                      fontFamily: "'Roboto Mono', monospace",
                    }}
                  >
                    UNDER THE HOOD · lim1_abm_orchestrator
                  </span>
                  <h2
                    className="text-4xl sm:text-5xl font-black uppercase mt-2"
                    style={{ fontFamily: "'Roboto Condensed', sans-serif", letterSpacing: "-0.03em" }}
                  >
                    FROM CRM SIGNAL TO{" "}
                    <ExtrudedHeadlineWord animate={true}>GOVERNED</ExtrudedHeadlineWord> MICROSITE
                  </h2>
                </div>

                <button
                  onClick={triggerLaunchCountdown}
                  className="px-7 py-4 text-lg font-black uppercase tracking-wide flex items-center gap-3 cursor-pointer transition-transform active:scale-95"
                  style={{
                    backgroundColor: countdown === "LIVE!" ? "#3AB533" : "#ABFF44",
                    color: "#08251A",
                    borderRadius: "32px",
                    border: "3px solid #08251A",
                    fontFamily: "'Roboto Condensed', sans-serif",
                  }}
                >
                  <OpalBoltIcon className="w-6 h-6" fill="#08251A" />
                  {countdown === null
                    ? "Start Live Demo Count"
                    : countdown === "LIVE!"
                    ? "⚡ DEMO LIVE — SHARE /demo/crm"
                    : `LAUNCHING IN ${countdown}...`}
                </button>
              </div>

              {/* 4-Step Pipeline Architecture Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    step: "STEP 01",
                    title: "Tri-Source Intake",
                    agent: "Northstar CRM + ODP",
                    bg: "#FFFFFF",
                    badgeBg: "#E4F0DA",
                    points: [
                      "CRM Stage and Contacts",
                      "ODP 30-Day Intent Topics",
                      "External Web and Hiring Signals",
                    ],
                  },
                  {
                    step: "STEP 02",
                    title: "Router Agent",
                    agent: "lim1_account_router",
                    bg: "#EFF6E9",
                    badgeBg: "#91DBDA",
                    points: [
                      "Checks CMS ABM Container",
                      "No Page -> CREATE MODE",
                      "Existing Page -> UPDATE MODE",
                    ],
                  },
                  {
                    step: "STEP 03",
                    title: "Create vs. Update",
                    agent: "Creator and Updater Agents",
                    bg: "#E4F0DA",
                    badgeBg: "#ABFF44",
                    points: [
                      "Create: Full Persona Synthesis",
                      "Update: 3-Month Delta Check",
                      "Built on Brand Pack and CMS Types",
                    ],
                  },
                  {
                    step: "STEP 04",
                    title: "CMS and CMP Sign-Off",
                    agent: "Optimizely CMS + Graph",
                    bg: "#ABFF44",
                    badgeBg: "#FFFFFF",
                    points: [
                      "Draft Saved in Visual Builder",
                      "CMP Human-in-the-Loop Review",
                      "Subdomain URL Indexed to Graph",
                    ],
                  },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className="p-6 flex flex-col justify-between"
                    style={{
                      backgroundColor: card.bg,
                      color: "#08251A",
                      borderRadius: "32px",
                      border: "3px solid #08251A",
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="px-3 py-1 text-xs font-bold uppercase"
                          style={{
                            backgroundColor: "#08251A",
                            color: "#ABFF44",
                            borderRadius: "32px",
                            fontFamily: "'Roboto Mono', monospace",
                          }}
                        >
                          {card.step}
                        </span>
                        <span className="text-lg font-black">→</span>
                      </div>

                      <h3
                        className="text-2xl font-black uppercase mb-1"
                        style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                      >
                        {card.title}
                      </h3>
                      <div
                        className="inline-block px-2.5 py-0.5 text-xs font-bold mb-4"
                        style={{
                          backgroundColor: card.badgeBg,
                          borderRadius: "12px",
                          border: "1.5px solid #08251A",
                          fontFamily: "'Roboto Mono', monospace",
                        }}
                      >
                        {card.agent}
                      </div>

                      <ul className="space-y-2 text-xs font-bold">
                        {card.points.map((pt, i) => (
                          <li
                            key={i}
                            className="p-2.5 flex items-center gap-2"
                            style={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "16px",
                              border: "1.5px solid #08251A",
                            }}
                          >
                            <span style={{ color: "#3AB533" }}>●</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Callout Banner */}
              <div
                className="p-5 flex flex-wrap items-center justify-between gap-4"
                style={{
                  backgroundColor: "#91DBDA",
                  color: "#08251A",
                  borderRadius: "32px",
                  border: "3px solid #08251A",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black"
                    style={{
                      backgroundColor: "#08251A",
                      color: "#ABFF44",
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div
                      className="text-xs font-bold uppercase"
                      style={{ fontFamily: "'Roboto Mono', monospace" }}
                    >
                      LIVE CERTIFICATION DEMO SCENARIO
                    </div>
                    <div className="text-base font-black">
                      Helix Freight Group (Create v1) + Apex Health Partners (Update v2 for New CMIO Dr. Elena Park)
                    </div>
                  </div>
                </div>
                <div
                  className="px-4 py-2 text-xs font-bold uppercase"
                  style={{
                    backgroundColor: "#08251A",
                    color: "#FFFFFF",
                    borderRadius: "32px",
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  Field Delivery Engineer (FDE) Assisted Delivery
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================
          BOTTOM ANIMATED BRAND TICKER BAR
          ========================================================= */}
      <footer
        className="w-full py-3 border-t-2 overflow-hidden"
        style={{ backgroundColor: "#ABFF44", color: "#08251A", borderColor: "#08251A" }}
      >
        <div
          className="animate-ticker flex items-center gap-12 whitespace-nowrap text-xs font-black uppercase tracking-widest"
          style={{ fontFamily: "'Roboto Mono', monospace" }}
        >
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              <span>•</span>
            </React.Fragment>
          ))}
        </div>
      </footer>
    </div>
  );
}
