'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ── Brand tokens ──────────────────────────────────────────────────────────────
const G    = '#A8E130'; // Optimizely lime green
const BG   = '#080C08'; // near-black background
const S1   = '#0D160D'; // surface
const S2   = '#131D13'; // surface alt
const BR   = '#1A2A1A'; // border
const BRL  = '#243824'; // border light
const M    = '#4D684D'; // muted
const ML   = '#819A81'; // muted light
const W    = '#F5FFF5'; // off-white text
const D2   = '#38C8F0'; // Act 2 cyan (solution)
const D3   = '#F59E3A'; // Act 3 amber (engine)
const PAIN = '#FF5C35'; // Act 1 red-orange (the problem)
const PBGL = '#1A0C08'; // pain surface

// ── Slide data ────────────────────────────────────────────────────────────────

type Slide =
  | { kind: 'cover' }
  | { kind: 'reframe' }
  | { kind: 'concept-intro'; headline: string; subhead: string; body: string; items: { label: string; desc: string }[]; accent: string }
  | { kind: 'taxonomy' }
  | { kind: 'scale-objection' }
  | { kind: 'act-intro'; num: 1 | 2 | 3; badge: string; title: string; subtitle: string; persona: { name: string; role: string }; description: string }
  | { kind: 'act'; num: 1 | 2 | 3; scene: number; intent: string; action: string; result: string; talk: string; pain?: boolean; image?: string }
  | { kind: 'closing' };

const SLIDES: Slide[] = [
  // ─ 1 ─ Cover
  { kind: 'cover' },

  // ─ 2 ─ Reframe
  { kind: 'reframe' },

  // ─ 3 ─ Concept: Tags as Labels vs Tags as Logic
  {
    kind: 'concept-intro',
    headline: 'Tags as Labels vs. Tags as Logic',
    subhead: 'The fundamental paradigm shift',
    accent: G,
    body: 'In every traditional CMS, tags help the search bar find a PDF. In an Agentic CMS, tags are the business rules that tell the AI exactly when and where a piece of copy is allowed to appear.',
    items: [
      {
        label: 'The Old Way — Search Labels',
        desc: 'A 50-page PDF gets tagged [Commercial] [Auto] [Florida]. The tag finds the document. The consultant still has to open it, read it, and manually extract the answer. The AI has no idea what is inside.',
      },
      {
        label: 'The New Way — Atomic Logic',
        desc: 'A single sentence — "Baseline deductible is $1,000" — is tagged [LOB: Commercial Auto] [State: FL] [Peril: Hail] [Type: Limit]. Those tags are a strict mathematical boundary. They tell the Generative UI exactly under what conditions this copy is allowed to render.',
      },
    ],
  },

  // ─ 4 ─ Concept: The Progressive Taxonomy
  { kind: 'taxonomy' },

  // ─ 5 ─ Concept: Scale Objection Pre-empt
  { kind: 'scale-objection' },

  // ─ 6–8 ─ Act 1: The Pain of the "Now" (scenes start at slide 7)
  {
    kind: 'act-intro', num: 1,
    badge: 'Act 1 — The Problem',
    title: 'The Pain of the "Now"',
    subtitle: 'Traditional KB Simulator',
    persona: { name: 'Sarah', role: 'Progressive Consultant' },
    description: 'Sarah is on a live call. A customer wants to know the commercial auto hail deductible for Florida — and what it would be if they moved their business to Georgia. She turns to the enterprise knowledge base.',
  },
  {
    kind: 'act', num: 1, scene: 1, pain: true,
    image: '/screenshots/kb-results.png',
    intent: 'The Search',
    action: 'Sarah types her query into the standard enterprise search bar: "commercial auto hail deductible Florida."',
    result: 'The system returns a list of confusingly named PDFs and Word documents. Three of them say FINAL. She has to guess which one is current.',
    talk: '"The customer is on hold. Sarah is staring at a page of blue links. Every file has a different version number — CommAuto_092_A_v8_FINAL, FL_Exceptions_2024_REVISED_v2, Copy_of_FL_Exceptions_2022_OLD_ARCHIVE. Which one do I use?"',
  },
  {
    kind: 'act', num: 1, scene: 2, pain: true,
    intent: 'The Read',
    action: 'Sarah clicks the Florida Addendum. She is presented with a 14-page legal PDF. She hits Ctrl+F, scrolls to Section 4, and reads dense legal language to find the $1,000 hail deductible.',
    result: 'She holds that number in her head, hits Back, finds the Georgia document, and does it again — manually assembling a comparison matrix under live call pressure.',
    talk: '"This causes burnout, spikes handle time, and introduces compliance risk. Sarah isn\'t doing her job — she\'s doing the document assembly job that the system should be doing for her."',
  },

  // ─ 6–8 ─ Act 2: The Solution
  {
    kind: 'act-intro', num: 2,
    badge: 'Act 2 — The Solution',
    title: 'Intelligent Enablement Portal',
    subtitle: 'Powered headlessly by Optimizely\'s Agentic CMS',
    persona: { name: 'Sarah', role: 'Progressive Consultant' },
    description: 'We immediately switch to the new Intelligent Enablement Portal. Same Sarah. Same query. The difference: instead of returning documents, the system assembles the exact answer.',
  },
  {
    kind: 'act', num: 2, scene: 1,
    intent: 'Retrieve Intent',
    action: 'Sarah types her exact query: "What is the commercial auto hail deductible for Florida?"',
    result: 'The UI does NOT return a PDF. It instantly assembles a clean, structured mini-dashboard showing the exact $1,000 Florida deductible — pulling from atomic data blocks in the Agentic CMS.',
    talk: '"We didn\'t give Sarah a document to read. The system understood her intent and dynamically assembled the exact UI layout she needed to resolve the call. No Ctrl+F. No mental math. Handle time: seconds, not minutes."',
  },
  {
    kind: 'act', num: 2, scene: 2,
    image: '/screenshots/demo-v2-clicked.png',
    intent: 'Compare Intent',
    action: 'Sarah types: "Compare that to Georgia." She does not navigate away or open a new document.',
    result: 'The Generative UI dynamically reframes itself, assembling a side-by-side comparison matrix: Florida $1,000 vs. Georgia $750. Every data point has a "View Source" citation.',
    talk: '"Because every figure deep-links to the exact approved policy block, Sarah can trust it 100%. This is AI that eliminates compliance risk instead of creating it — and it runs on content Marcus already structured."',
  },

  // ─ 9–11 ─ Act 3: The Engine
  {
    kind: 'act-intro', num: 3,
    badge: 'Act 3 — The Engine',
    title: 'Authoring Tagged Copy, Not Pages',
    subtitle: 'Behind the scenes in Optimizely CMS',
    persona: { name: 'Marcus', role: 'Knowledge Manager' },
    description: 'How does the Generative UI know the exact limits without hallucinating? We go behind the scenes to Optimizely CMS to see Marcus, the Knowledge Manager. He just received a regulatory bulletin: Florida and Georgia are changing their Commercial Hail deductibles for 2026.',
  },
  {
    kind: 'act', num: 3, scene: 1,
    intent: 'Authoring Atomic Copy',
    action: 'In a traditional CMS, Marcus would open a blank page and type a 10-page document. Instead, Marcus creates a specific, atomic content block — a "Coverage Limit." He inputs only the new rule copy: "Mandatory baseline deductible of $1,000 applies to all commercial auto policies for hail."',
    result: 'Marcus applies strict taxonomy tags to the block: LOB: Commercial Auto · State: Florida · Peril: Hail. These tags are not just metadata — they are the boundaries that tell the AI exactly when and where this copy is allowed to be used.',
    talk: '"This is the fundamental shift. Marcus is not writing a page. He is managing copy. In a traditional knowledge base, tags help the search bar find a PDF. In an Agentic CMS, the tags ARE the logic — the strict guardrails that eliminate hallucination."',
  },
  {
    kind: 'act', num: 3, scene: 2,
    intent: 'Variant Assembly Intent',
    action: 'Marcus needs to apply this to Georgia, but with a different limit. He asks Opal: "Generate a state variant of this block for Georgia, but change the deductible to $750."',
    result: 'Opal instantly creates the tagged Georgia variant. Marcus did not have to duplicate a 10-page document just to change one number.',
    talk: '"Because Marcus authors properly tagged copy instead of static pages, he eliminates conflicting truths. This is exactly why Sarah\'s interface in Act 2 worked — the system used her intent to query these exact tags, pulling the $1,000 Florida block and the $750 Georgia block, and assembling them perfectly on screen."',
  },

  // ─ 12 ─ Closing
  { kind: 'closing' },
];

// ── Shared primitives ─────────────────────────────────────────────────────────

function OptiMark({ size = 20 }: { size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/Optimizely_Primary-Logo_Medium_Green_RGB.png" alt="Optimizely" height={size} style={{ height: size, width: 'auto', display: 'block' }} />;
}

function Badge({ children, color = G, bg = 'transparent', border = true }: { children: React.ReactNode; color?: string; bg?: string; border?: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      background: bg,
      border: border ? `1px solid ${color}` : 'none',
      color,
      fontSize: 17,
      fontWeight: 700,
      letterSpacing: 2.5,
      textTransform: 'uppercase' as const,
      padding: '4px 12px',
      borderRadius: 100,
    }}>
      {children}
    </span>
  );
}

function actAccent(num: 1 | 2 | 3): string {
  return num === 1 ? PAIN : num === 2 ? D2 : D3;
}

// ── Slide components ──────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 64px' }}>
      <div style={{ marginBottom: 0 }}>
        <OptiMark size={150} />
      </div>

      <div style={{ fontSize: 17, letterSpacing: 4, color: G, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>
        Optimizely × Progressive Insurance
      </div>

      <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, color: W, lineHeight: 1.1, letterSpacing: '-1px', margin: '0 0 16px' }}>
        Intent-Driven<br />Knowledge Demo
      </h1>

      <p style={{ fontSize: 17, color: ML, maxWidth: 520, lineHeight: 1.7, margin: '0 0 36px' }}>
        From <em style={{ color: ML }}>"Search and Read"</em> to <strong style={{ color: W }}>Intent-Driven Layout Assembly</strong> — powered headlessly by an Agentic CMS.
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 20px', border: `1px solid ${BR}`, borderRadius: 100, fontSize: 18, color: M }}>
        Press
        <kbd style={{ background: S2, border: `1px solid ${BRL}`, borderRadius: 5, padding: '2px 8px', fontFamily: 'monospace', color: ML, fontSize: 17 }}>→</kbd>
        to advance
        <span style={{ color: BR }}>·</span>
        <kbd style={{ background: S2, border: `1px solid ${BRL}`, borderRadius: 5, padding: '2px 8px', fontFamily: 'monospace', color: ML, fontSize: 17 }}>Space</kbd>
        to continue
      </div>
    </div>
  );
}

function ReframeSlide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 80px', textAlign: 'center' }}>
      <div style={{ maxWidth: 860 }}>
        <Badge>Reframe</Badge>

        <blockquote style={{ margin: '28px 0 24px', padding: 0, fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: 700, color: W, lineHeight: 1.35, letterSpacing: '-0.3px', fontStyle: 'italic', borderLeft: 'none' }}>
          &ldquo;We are moving from a{' '}
          <span style={{ color: PAIN }}>&lsquo;Search and Read&rsquo; document repository</span>{' '}
          to{' '}
          <span style={{ color: G }}>&lsquo;Intent-Driven Layout Assembly&rsquo;.</span>&rdquo;
        </blockquote>

        <p style={{ fontSize: 24, color: ML, lineHeight: 1.6, marginBottom: 36 }}>
          This demo is structured to contrast the painful <strong style={{ color: W }}>Now</strong> — navigating static documents — with the dynamic <strong style={{ color: W }}>Future</strong> — multi-intent Generative UI powered by an Agentic CMS.
        </p>

        {/* Three acts preview */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
          {[
            { label: 'Act 1', name: 'The Pain of the Now', color: PAIN },
            { label: 'Act 2', name: 'The Solution', color: D2 },
            { label: 'Act 3', name: 'The Engine', color: D3 },
          ].map(a => (
            <div key={a.label} style={{ background: S1, border: `1px solid ${BR}`, borderRadius: 10, padding: '10px 18px', textAlign: 'center', minWidth: 160 }}>
              <p style={{ fontSize: 15, color: a.color, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px' }}>{a.label}</p>
              <p style={{ fontSize: 21, color: W, fontWeight: 600, margin: 0 }}>{a.name}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 18, color: M, marginTop: 20, fontStyle: 'italic' }}>
          Note: The &ldquo;Govern/Review&rdquo; intent is intentionally excluded to focus on the contrast between static retrieval and dynamic assembly.
        </p>
      </div>
    </div>
  );
}

function ActIntroSlide({ slide }: { slide: Extract<Slide, { kind: 'act-intro' }> }) {
  const accent = actAccent(slide.num);
  const badgeBg = slide.num === 1 ? PBGL : S1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
        <Badge bg={accent} color={BG} border={false}>{slide.badge}</Badge>
        <div style={{ height: 1, flex: 1, background: BR, marginLeft: 12 }} />
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left: overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 800, color: W, lineHeight: 1.1, letterSpacing: '-0.5px', margin: '0 0 8px' }}>
              {slide.title}
            </h2>
            <p style={{ fontSize: 17, color: accent, fontWeight: 600, margin: 0 }}>{slide.subtitle}</p>
          </div>

          <div>
            <p style={{ fontSize: 15, color: M, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 10px' }}>Active Intents</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {slide.num === 1
                ? ['Search', 'Read'].map(i => (
                  <span key={i} style={{ background: PBGL, border: `1px solid ${PAIN}55`, color: PAIN, fontSize: 20, fontWeight: 700, padding: '5px 14px', borderRadius: 7, letterSpacing: 0.5 }}>{i}</span>
                ))
                : slide.num === 2
                ? ['Retrieve', 'Compare'].map(i => (
                  <span key={i} style={{ background: S2, border: `1px solid ${BRL}`, color: G, fontSize: 20, fontWeight: 700, padding: '5px 14px', borderRadius: 7, letterSpacing: 0.5 }}>{i}</span>
                ))
                : ['Ingest', 'Variant Assembly'].map(i => (
                  <span key={i} style={{ background: S2, border: `1px solid ${BRL}`, color: G, fontSize: 20, fontWeight: 700, padding: '5px 14px', borderRadius: 7, letterSpacing: 0.5 }}>{i}</span>
                ))
              }
            </div>
          </div>
        </div>

        {/* Right: persona + scenario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: badgeBg, border: `1px solid ${BR}`, borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 15, color: M, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 12px' }}>The Persona</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: S2, border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: accent, flexShrink: 0 }}>
                {slide.persona.name[0]}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: W, fontSize: 16, margin: '0 0 2px' }}>{slide.persona.name}</p>
                <p style={{ color: ML, fontSize: 20, margin: 0 }}>{slide.persona.role}</p>
              </div>
            </div>
          </div>

          <div style={{ background: badgeBg, border: `1px solid ${BR}`, borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 15, color: M, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 12px' }}>The Scenario</p>
            <p style={{ fontSize: 21, color: ML, lineHeight: 1.6, margin: 0 }}>{slide.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActSlide({ slide }: { slide: Extract<Slide, { kind: 'act' }> }) {
  const accent = slide.pain ? PAIN : actAccent(slide.num);
  const resultBorder = slide.pain ? PAIN : G;
  const resultLabel = slide.pain ? PAIN : G;
  const resultBg = slide.pain ? PBGL : S1;
  const cardBg = slide.pain ? PBGL : S1;

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexShrink: 0 }}>
      <Badge color={accent}>Act {slide.num} / Scene {slide.scene}</Badge>
      <span style={{ fontSize: 21, fontWeight: 600, color: W }}>
        <span style={{ color: slide.pain ? PAIN : G }}>Intent:</span> {slide.intent}
      </span>
      {slide.pain && (
        <span style={{ marginLeft: 'auto', fontSize: 17, color: PAIN, border: `1px solid ${PAIN}55`, borderRadius: 100, padding: '2px 10px', fontWeight: 700, letterSpacing: 1 }}>
          ⚠ BEFORE
        </span>
      )}
    </div>
  );

  // ── Layout: image present → left text column + right browser frame ──────────
  if (slide.image) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {header}
        <div className="grid grid-cols-1 md:grid-cols-[38%_1fr] gap-5">

          {/* Left: Action + Talk Track */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Action */}
            <div style={{ background: cardBg, border: `1px solid ${BR}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14 }}>
              <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: S2, border: `1px solid ${BRL}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M7 1L13 7L7 13M1 7H13" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, letterSpacing: 2.5, color: accent, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>The Action</p>
                <p style={{ fontSize: 21, color: ML, lineHeight: 1.55, margin: 0 }}>{slide.action}</p>
              </div>
            </div>

            {/* Talk Track */}
            <div style={{ background: S2, border: `1px solid ${BR}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14 }}>
              <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: BG, border: `1px solid ${BR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M13 2H1C0.45 2 0 2.45 0 3V9C0 9.55 0.45 10 1 10H4.5L7 13L9.5 10H13C13.55 10 14 9.55 14 9V3C14 2.45 13.55 2 13 2Z" stroke={ML} strokeWidth={1.1} />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, letterSpacing: 2.5, color: ML, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>The Talk Track</p>
                <p style={{ fontSize: 21, color: ML, lineHeight: 1.55, fontStyle: 'italic', margin: 0 }}>{slide.talk}</p>
              </div>
            </div>
          </div>

          {/* Right: browser chrome + screenshot at native width */}
          <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden', border: `1px solid ${PAIN}44`, boxShadow: `0 0 0 1px ${PAIN}22, 0 8px 32px #00000066` }}>
            {/* Browser title bar */}
            <div style={{ background: '#1C1C1E', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, borderBottom: '1px solid #333' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28CA41' }} />
              </div>
            </div>
            {/* Screenshot — natural width, clipped */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt="KB results showing confusing list of documents"
                style={{ display: 'block', width: slide.pain ? '1440px' : '100%', maxWidth: slide.pain ? 'none' : '100%', height: 'auto' }}
              />
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ── Layout: standard three-card stack ───────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {header}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Action */}
        <div style={{ background: cardBg, border: `1px solid ${BR}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14 }}>
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: S2, border: `1px solid ${BRL}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 1L13 7L7 13M1 7H13" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, letterSpacing: 2.5, color: accent, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>The Action</p>
            <p style={{ fontSize: 21, color: ML, lineHeight: 1.55, margin: 0 }}>{slide.action}</p>
          </div>
        </div>

        {/* Result */}
        <div style={{ background: resultBg, border: `1px solid ${BRL}`, borderLeft: `3px solid ${resultBorder}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14 }}>
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: S2, border: `1px solid ${BRL}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {slide.pain
              ? <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M7 2V8M7 11V11.5" stroke={PAIN} strokeWidth={1.8} strokeLinecap="round" />
                  <circle cx={7} cy={7} r={6} stroke={PAIN} strokeWidth={1.2} />
                </svg>
              : <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 7L5 11L13 3" stroke={G} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            }
          </div>
          <div>
            <p style={{ fontSize: 15, letterSpacing: 2.5, color: resultLabel, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>The Result</p>
            <p style={{ fontSize: 21, color: W, lineHeight: 1.55, margin: 0 }}>{slide.result}</p>
          </div>
        </div>

        {/* Talk Track */}
        <div style={{ background: S2, border: `1px solid ${BR}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14 }}>
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: BG, border: `1px solid ${BR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M13 2H1C0.45 2 0 2.45 0 3V9C0 9.55 0.45 10 1 10H4.5L7 13L9.5 10H13C13.55 10 14 9.55 14 9V3C14 2.45 13.55 2 13 2Z" stroke={ML} strokeWidth={1.1} />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, letterSpacing: 2.5, color: ML, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>The Talk Track</p>
            <p style={{ fontSize: 21, color: ML, lineHeight: 1.55, fontStyle: 'italic', margin: 0 }}>{slide.talk}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClosingSlide() {
  const intents = ['Ingest', 'Variant Assembly', 'Retrieve', 'Compare'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 64px' }}>
      <div style={{ marginBottom: 28 }}>
        <svg width={72} height={72} viewBox="0 0 72 72" fill="none" aria-hidden>
          <circle cx={36} cy={36} r={33} stroke={G} strokeWidth={2} />
          <circle cx={36} cy={36} r={15} fill={G} />
        </svg>
      </div>

      <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: W, lineHeight: 1.15, letterSpacing: '-0.5px', margin: '0 0 16px' }}>
        Any Questions?
      </h2>

      <p style={{ fontSize: 17, color: ML, maxWidth: 560, lineHeight: 1.75, margin: '0 0 12px' }}>
        Three acts. One vision:{' '}
        <span style={{ color: G }}>an Agentic CMS that makes every consultant interaction faster, more accurate, and fully trusted.</span>
      </p>

      <p style={{ fontSize: 21, color: M, maxWidth: 480, lineHeight: 1.6, margin: '0 0 32px', fontStyle: 'italic' }}>
        From <span style={{ color: PAIN }}>searching documents</span> → to <span style={{ color: D2 }}>assembling answers</span> → powered by <span style={{ color: D3 }}>structured content</span>.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
        {intents.map(i => (
          <span key={i} style={{ background: S1, border: `1px solid ${BRL}`, color: ML, fontSize: 20, fontWeight: 600, padding: '6px 18px', borderRadius: 8 }}>
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function ConceptIntroSlide({ slide }: { slide: Extract<Slide, { kind: 'concept-intro' }> }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Badge>Key Concept</Badge>

        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 46px)', fontWeight: 800, color: W, letterSpacing: '-0.5px', lineHeight: 1.1, margin: '20px 0 8px' }}>
          {slide.headline}
        </h2>
        <p style={{ fontSize: 18, color: ML, margin: '0 0 32px' }}>{slide.subhead}</p>

        <p style={{ fontSize: 21, color: ML, lineHeight: 1.7, margin: '0 0 32px', maxWidth: 780 }}>{slide.body}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {slide.items.map((item, i) => (
            <div key={i} style={{ background: i === 0 ? PBGL : S1, border: `1px solid ${i === 0 ? PAIN + '44' : BRL}`, borderLeft: `3px solid ${i === 0 ? PAIN : G}`, borderRadius: 12, padding: '20px 22px' }}>
              <p style={{ fontSize: 15, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: 700, color: i === 0 ? PAIN : G, margin: '0 0 10px' }}>
                {item.label}
              </p>
              <p style={{ fontSize: 20, color: i === 0 ? ML : W, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TAXONOMY_ROWS = [
  { cat: 'LOB (Line of Business)', purpose: 'Defines the core product', examples: 'Personal Auto, Commercial Auto, Homeowners, Motorcycle' },
  { cat: 'Jurisdiction (State)', purpose: 'Defines regulatory boundaries', examples: 'FL, GA, OH, National (Default)' },
  { cat: 'Peril / Coverage', purpose: 'Defines the specific incident type', examples: 'Hail, Windstorm, Collision, Bodily Injury' },
  { cat: 'Content Type', purpose: 'Defines what the block is', examples: 'Coverage Limit, Legal Disclaimer, Consultant Script, Procedure' },
  { cat: 'Audience', purpose: 'Defines who is allowed to see it', examples: 'Frontline Consultant, Claims Adjuster, Underwriter' },
  { cat: 'Time / Validity', purpose: 'Defines compliance windows', examples: 'Effective: 01-01-2026, Expires: 12-31-2026' },
];

function TaxonomySlide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 22 }}>
        <Badge color={D3}>Progressive Taxonomy</Badge>
        <div style={{ height: 1, flex: 1, background: BR, marginLeft: 12 }} />
      </div>

      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 38px)', fontWeight: 800, color: W, letterSpacing: '-0.3px', margin: '0 0 6px' }}>
          The Multidimensional Tag System
        </h2>
        <p style={{ fontSize: 18, color: ML, margin: 0 }}>
          For &ldquo;Tags as Logic&rdquo; to work, every content block needs to be positioned within this six-dimensional space. This is how the Generative UI knows exactly which copy to assemble — without guessing.
        </p>
      </div>

      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
          <thead>
            <tr>
              {['Tag Category', 'Purpose', 'Progressive Examples'].map(h => (
                <th key={h} style={{ textAlign: 'left' as const, padding: '8px 14px', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: 700, color: M, borderBottom: `1px solid ${BR}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TAXONOMY_ROWS.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${BR}`, background: i % 2 === 0 ? 'transparent' : S1 }}>
                <td style={{ padding: '12px 14px', fontSize: 18, fontWeight: 700, color: D3 }}>{row.cat}</td>
                <td style={{ padding: '12px 14px', fontSize: 18, color: ML }}>{row.purpose}</td>
                <td style={{ padding: '12px 14px', fontSize: 17, color: W }}>
                  {row.examples.split(', ').map(ex => (
                    <span key={ex} style={{ display: 'inline-block', background: S2, border: `1px solid ${BRL}`, borderRadius: 5, padding: '1px 7px', marginRight: 5, marginBottom: 3, fontSize: 15, color: ML }}>
                      {ex}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: S1, border: `1px solid ${BRL}`, borderLeft: `3px solid ${G}`, borderRadius: 10 }}>
        <p style={{ fontSize: 18, color: W, margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: G }}>The result:</strong> When Sarah asks about &ldquo;commercial auto hail in Florida,&rdquo; the AI doesn&rsquo;t search for a document — it executes a logic query across these exact dimensions and assembles the answer inline.
        </p>
      </div>
    </div>
  );
}

function ScaleObjectionSlide() {
  const steps = [
    { num: '01', title: 'AI Auto-Classification', body: 'Marcus doesn\'t create 500 tags by hand. During migration, Opal ingests the legacy PDFs, extracts the limits, and auto-tags them. The AI does the heavy lifting — Marcus just approves the mapping.' },
    { num: '02', title: 'Taxonomy Inheritance', body: 'Tags cascade from context. Drop a new block into the "Florida Commercial Auto" workspace and the system automatically inherits [State: FL] and [LOB: Commercial Auto]. No manual re-entry.' },
    { num: '03', title: 'The ROI of Maintenance', body: 'The daily volume of maintenance actually decreases. One regulatory change no longer means opening, editing, and routing 50 different PDFs. Update one tagged atomic block — the entire ecosystem updates instantly.' },
  ];
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Badge color={PAIN}>Pre-empting the Scale Objection</Badge>

        <h2 style={{ fontSize: 'clamp(22px, 2.6vw, 38px)', fontWeight: 800, color: W, letterSpacing: '-0.5px', lineHeight: 1.1, margin: '14px 0 8px' }}>
          &ldquo;Tagging every sentence sounds like a manual nightmare.&rdquo;
        </h2>
        <p style={{ fontSize: 18, color: ML, lineHeight: 1.6, margin: '0 0 16px', maxWidth: 780 }}>
          You&rsquo;re right — <em>if humans had to do it</em>. We&rsquo;re not shifting effort to data entry. We&rsquo;re shifting it to <strong style={{ color: W }}>logic supervision</strong>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {steps.map(s => (
            <div key={s.num} style={{ background: S1, border: `1px solid ${BR}`, borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: S2, border: `1px solid ${BRL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: G, letterSpacing: 0.5, marginBottom: 10 }}>
                {s.num}
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: G, margin: '0 0 6px', letterSpacing: 0.3 }}>{s.title}</p>
              <p style={{ fontSize: 18, color: ML, lineHeight: 1.55, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, padding: '10px 16px', background: PBGL, border: `1px solid ${PAIN}33`, borderLeft: `3px solid ${G}`, borderRadius: 10 }}>
          <p style={{ fontSize: 18, color: W, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
            The Agentic CMS handles the scale of the tagging — freeing the Knowledge Manager to focus on <strong style={{ color: G }}>accuracy, not administration</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

function SlideContent({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'cover':           return <CoverSlide />;
    case 'reframe':         return <ReframeSlide />;
    case 'concept-intro':   return <ConceptIntroSlide slide={slide} />;
    case 'taxonomy':        return <TaxonomySlide />;
    case 'scale-objection': return <ScaleObjectionSlide />;
    case 'act-intro':       return <ActIntroSlide slide={slide} />;
    case 'act':             return <ActSlide slide={slide} />;
    case 'closing':         return <ClosingSlide />;
  }
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DemoFlowPage() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = SLIDES.length;

  const go = useCallback((next: number) => {
    if (next < 0 || next >= total) return;
    if (pending.current) clearTimeout(pending.current);
    setVisible(false);
    pending.current = setTimeout(() => {
      setIdx(next);
      setVisible(true);
    }, 150);
  }, [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go, idx]);

  useEffect(() => () => { if (pending.current) clearTimeout(pending.current); }, []);

  return (
    <div
      style={{
        background: BG,
        color: W,
        height: '100dvh',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Progress bar */}
      <div style={{ height: 2, background: BR, flexShrink: 0 }}>
        <div style={{ height: '100%', background: G, width: `${((idx + 1) / total) * 100}%`, transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>

      {/* Header */}
      <header style={{ padding: '10px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${BR}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <OptiMark size={30} />
          <span style={{ color: ML, fontSize: 20 }}>Progressive</span>
        </div>
        <span style={{ color: M, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>
          {idx + 1} / {total}
        </span>
      </header>

      {/* Slide content */}
      <main
        className="px-4 sm:px-8 md:px-12 pt-7 pb-4"
        style={{ flex: 1, overflow: 'hidden' }}
        onClick={() => go(idx + 1)}
        title="Click to advance"
      >
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(6px)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}>
          <SlideContent slide={SLIDES[idx]} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '10px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${BR}`, flexShrink: 0 }}>
        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); go(i); }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === idx ? 20 : 7,
                height: 7,
                borderRadius: 4,
                background: i === idx ? G : (i < idx ? M : BR),
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: '←', target: idx - 1, disabled: idx === 0 },
            { label: '→', target: idx + 1, disabled: idx === total - 1 },
          ].map(({ label, target, disabled }) => (
            <button
              key={label}
              onClick={e => { e.stopPropagation(); go(target); }}
              disabled={disabled}
              aria-label={label === '←' ? 'Previous slide' : 'Next slide'}
              style={{
                width: 36, height: 36,
                borderRadius: 8,
                background: disabled ? 'transparent' : S1,
                border: `1px solid ${disabled ? BR : BRL}`,
                color: disabled ? M : W,
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: 23,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
                opacity: disabled ? 0.4 : 1,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
