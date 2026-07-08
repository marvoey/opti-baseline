'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ── Brand tokens ──────────────────────────────────────────────────────────────
const G   = '#A8E130'; // Optimizely lime green
const BG  = '#080C08'; // near-black background
const S1  = '#0D160D'; // surface
const S2  = '#131D13'; // surface alt
const BR  = '#1A2A1A'; // border
const BRL = '#243824'; // border light
const M   = '#4D684D'; // muted
const ML  = '#819A81'; // muted light
const W   = '#F5FFF5'; // off-white text
const D1  = '#38C8F0'; // Demo 1 cyan accent
const D2  = '#F59E3A'; // Demo 2 amber accent

// ── Slide data ────────────────────────────────────────────────────────────────

type Slide =
  | { kind: 'cover' }
  | { kind: 'reframe' }
  | { kind: 'demo-intro'; num: 1 | 2; title: string; subtitle: string; focus: string; intents: string[]; name: string; role: string; scenario: string }
  | { kind: 'act'; demo: 1 | 2; act: number; intent: string; action: string; result: string; talk: string }
  | { kind: 'closing' };

const SLIDES: Slide[] = [
  { kind: 'cover' },
  { kind: 'reframe' },
  {
    kind: 'demo-intro', num: 1,
    title: 'The Consultant Flow',
    subtitle: 'Intelligent Enablement Portal',
    focus: 'Generative UI · Opal API Integration · Speed to Resolution',
    intents: ['Retrieve', 'Simulate'],
    name: 'Sarah', role: 'Consultant',
    scenario: "Sarah is on a live call with a Florida customer asking a complex question about commercial auto hail damage. She is using Progressive's existing intranet portal, now powered headlessly by the Opal API.",
  },
  {
    kind: 'act', demo: 1, act: 1,
    intent: 'Contextual Retrieval & Generative UI',
    action: 'Sarah types a natural language query into her portal: "What is the commercial auto hail deductible for a vehicle parked at home in Florida?"',
    result: 'Instead of a list of PDF links, the Opal API instantly returns a Generative UI component — a clean, structured dashboard showing the exact Florida deductible, specific limits, and immediate next steps.',
    talk: "Sarah isn't reading a 10-page document. The Agentic CMS retrieved the exact atomic content blocks and the Generative UI assembled them into a context-aware answer. We just saved 4 minutes of handle time.",
  },
  {
    kind: 'act', demo: 1, act: 2,
    intent: 'Multi-Intent Simulation & Comparison',
    action: 'The customer asks, "What if my business was registered in Georgia?" Sarah updates her query to compare Florida and Georgia.',
    result: 'The Generative UI instantly pivots, presenting a side-by-side comparison matrix of Florida vs. Georgia hail rules.',
    talk: "Because Optimizely stores this as structured variation data — not flat text — the AI can mathematically compare and render it. This eliminates the compliance risk of Sarah accidentally reading the wrong state's policy.",
  },
  {
    kind: 'act', demo: 1, act: 3,
    intent: 'Source Verification',
    action: 'Sarah clicks the "View Source" citation on the Georgia limit.',
    result: 'She is deep-linked to the exact block of the canonical Georgia policy.',
    talk: "Trust is paramount. The Generative UI isn't hallucinating — it strictly assembles approved, structured content from the Agentic CMS.",
  },
  {
    kind: 'demo-intro', num: 2,
    title: 'The Authoring Flow',
    subtitle: 'Agentic Content Assembly',
    focus: 'AI-Integrated Assembly · Architecture Previewer · Matrix Scaling',
    intents: ['Ingest', 'Assemble', 'Variant'],
    name: 'Marcus', role: 'Knowledge Manager',
    scenario: "Marcus needs to digitize a new Commercial Hail Addendum and scale it across multiple states. He doesn't format text — he commands the Agentic CMS.",
  },
  {
    kind: 'act', demo: 2, act: 1,
    intent: 'Agentic Ingestion',
    action: 'Marcus drags a legacy 15-page PDF into the Opal workspace and prompts: "Extract the core coverage limits, exclusions, and definitions from this document and map them to our Commercial Policy structure."',
    result: 'The Agentic CMS parses the document and automatically populates atomic content fields: Limit = $500, Peril = Hail, LOB = Commercial.',
    talk: "Marcus isn't copying and pasting. The AI is doing the heavy lifting of turning unstructured legacy blobs into structured, AI-ready data. This is the migration accelerator.",
  },
  {
    kind: 'act', demo: 2, act: 2,
    intent: 'AI-Integrated Content Assembly',
    action: 'Marcus needs to add standard legal language. He prompts Opal: "Assemble this new policy by attaching the standard 2026 Commercial Legal Disclaimer."',
    result: 'Opal dynamically links the reusable disclaimer block to the new policy.',
    talk: "Content reuse ensures compliance. If Legal updates the disclaimer, it cascades automatically. The AI acts as an assembly engine — no required pieces are missed.",
  },
  {
    kind: 'act', demo: 2, act: 3,
    intent: 'Matrix Scaling (State Variations)',
    action: 'Marcus prompts Opal: "Generate state variations for Florida and Georgia based on the standard policy, but update Florida\'s deductible to $1000 and Georgia\'s to $750."',
    result: 'The CMS automatically spins up the localized variants, inheriting the master content but overriding only the specified fields.',
    talk: "Managing 50 state variations is no longer a manual nightmare. The Agentic CMS scales the matrix instantly.",
  },
  {
    kind: 'act', demo: 2, act: 4,
    intent: 'Architecture Previewer (Simulation)',
    action: 'Before stepping away, Marcus opens the Architecture Previewer and types the same query Sarah used: "Florida hail deductible."',
    result: 'He sees the exact Generative UI component that Sarah will see in the contact center.',
    talk: "Marcus isn't just previewing a webpage — he's simulating AI output. He can guarantee that the intelligence he just built will render perfectly for front-line consultants.",
  },
  { kind: 'closing' },
];

// ── Shared primitives ─────────────────────────────────────────────────────────

function OptiMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx={12} cy={12} r={10.5} stroke={G} strokeWidth={2.5} />
      <circle cx={12} cy={12} r={4.5} stroke={G} strokeWidth={2.5} />
    </svg>
  );
}

function Badge({ children, color = G, bg = 'transparent', border = true }: { children: React.ReactNode; color?: string; bg?: string; border?: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      background: bg,
      border: border ? `1px solid ${color}` : 'none',
      color,
      fontSize: 11,
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

function SectionLine({ color }: { color: string }) {
  return <div style={{ height: 1, flex: 1, background: BR, marginLeft: 12 }} />;
}

// ── Slide components ──────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 64px' }}>
      {/* Large O mark */}
      <div style={{ marginBottom: 28 }}>
        <svg width={80} height={80} viewBox="0 0 80 80" fill="none" aria-hidden>
          <circle cx={40} cy={40} r={37} stroke={G} strokeWidth={3} />
          <circle cx={40} cy={40} r={17} stroke={G} strokeWidth={3} />
        </svg>
      </div>

      <div style={{ fontSize: 11, letterSpacing: 4, color: G, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>
        Optimizely × Progressive Insurance
      </div>

      <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, color: W, lineHeight: 1.1, letterSpacing: '-1px', margin: '0 0 16px' }}>
        Agentic CMS &amp;<br />Generative UI
      </h1>

      <p style={{ fontSize: 17, color: ML, maxWidth: 500, lineHeight: 1.7, margin: '0 0 36px' }}>
        Revised demo flows showcasing AI-integrated content assembly and Intelligent Enablement Portals.
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 20px', border: `1px solid ${BR}`, borderRadius: 100, fontSize: 12, color: M }}>
        Press
        <kbd style={{ background: S2, border: `1px solid ${BRL}`, borderRadius: 5, padding: '2px 8px', fontFamily: 'monospace', color: ML, fontSize: 11 }}>→</kbd>
        to advance
        <span style={{ color: BR }}>·</span>
        <kbd style={{ background: S2, border: `1px solid ${BRL}`, borderRadius: 5, padding: '2px 8px', fontFamily: 'monospace', color: ML, fontSize: 11 }}>Space</kbd>
        to continue
      </div>
    </div>
  );
}

function ReframeSlide() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 80px', textAlign: 'center' }}>
      <div style={{ maxWidth: 860 }}>
        <Badge>The Core Reframe</Badge>

        <blockquote style={{ margin: '28px 0 24px', padding: 0, fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: 700, color: W, lineHeight: 1.35, letterSpacing: '-0.3px', fontStyle: 'italic', borderLeft: 'none' }}>
          &ldquo;You&rsquo;re not buying a content management system.{' '}
          <span style={{ color: G }}>You&rsquo;re buying seconds&nbsp;— and accuracy&nbsp;— back</span>{' '}
          for every consultant interaction you have.&rdquo;
        </blockquote>

        <p style={{ fontSize: 16, color: ML, lineHeight: 1.75 }}>
          These demo flows focus entirely on <strong style={{ color: W }}>AI-integrated content assembly</strong> and <strong style={{ color: W }}>Intelligent Enablement Portals</strong> — showcasing an Agentic CMS that operates on specific intents: <em>Ingest, Assemble, Variant, Retrieve, Simulate</em>.
        </p>
      </div>
    </div>
  );
}

function DemoIntroSlide({ slide }: { slide: Extract<Slide, { kind: 'demo-intro' }> }) {
  const accent = slide.num === 1 ? D1 : D2;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, flexShrink: 0 }}>
        <Badge bg={accent} color={BG} border={false}>Demo {slide.num}</Badge>
        <SectionLine color={accent} />
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, minHeight: 0 }}>
        {/* Left: overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 800, color: W, lineHeight: 1.1, letterSpacing: '-0.5px', margin: '0 0 8px' }}>
              {slide.title}
            </h2>
            <p style={{ fontSize: 17, color: accent, fontWeight: 600, margin: 0 }}>{slide.subtitle}</p>
          </div>

          <div>
            <p style={{ fontSize: 10, color: M, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 8px' }}>Focus Areas</p>
            <p style={{ fontSize: 14, color: ML, lineHeight: 1.75, margin: 0 }}>{slide.focus}</p>
          </div>

          <div>
            <p style={{ fontSize: 10, color: M, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 10px' }}>Active Intents</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {slide.intents.map(intent => (
                <span key={intent} style={{
                  background: S2,
                  border: `1px solid ${BRL}`,
                  color: G,
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '5px 14px',
                  borderRadius: 7,
                  letterSpacing: 0.5,
                }}>
                  {intent}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: persona + scenario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          {/* Persona card */}
          <div style={{ background: S1, border: `1px solid ${BR}`, borderRadius: 12, padding: '16px 20px', flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: M, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 12px' }}>The Persona</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: S2, border: `2px solid ${accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: accent, flexShrink: 0,
              }}>
                {slide.name[0]}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: W, fontSize: 16, margin: '0 0 2px' }}>{slide.name}</p>
                <p style={{ color: ML, fontSize: 13, margin: 0 }}>{slide.role}</p>
              </div>
            </div>
          </div>

          {/* Scenario card */}
          <div style={{ background: S1, border: `1px solid ${BR}`, borderRadius: 12, padding: '16px 20px', flex: 1, minHeight: 0, overflow: 'auto' }}>
            <p style={{ fontSize: 10, color: M, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 12px' }}>The Scenario</p>
            <p style={{ fontSize: 14, color: ML, lineHeight: 1.75, margin: 0 }}>{slide.scenario}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActSlide({ slide }: { slide: Extract<Slide, { kind: 'act' }> }) {
  const accent = slide.demo === 1 ? D1 : D2;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexShrink: 0 }}>
        <Badge color={accent}>Demo {slide.demo} / Act {slide.act}</Badge>
        <span style={{ fontSize: 14, fontWeight: 600, color: W }}>
          <span style={{ color: G }}>Intent:</span> {slide.intent}
        </span>
      </div>

      {/* Three cards */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
        {/* Action */}
        <div style={{ flex: 1, background: S1, border: `1px solid ${BR}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14, minHeight: 0 }}>
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: S2, border: `1px solid ${BRL}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 1L13 7L7 13M1 7H13" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 2.5, color: accent, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>The Action</p>
            <p style={{ fontSize: 14, color: ML, lineHeight: 1.65, margin: 0 }}>{slide.action}</p>
          </div>
        </div>

        {/* Result */}
        <div style={{ flex: 1, background: S1, border: `1px solid ${BRL}`, borderLeft: `3px solid ${G}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14, minHeight: 0 }}>
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: S2, border: `1px solid ${BRL}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 7L5 11L13 3" stroke={G} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 2.5, color: G, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>The Result</p>
            <p style={{ fontSize: 14, color: W, lineHeight: 1.65, margin: 0 }}>{slide.result}</p>
          </div>
        </div>

        {/* Talk Track */}
        <div style={{ flex: 1, background: S2, border: `1px solid ${BR}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14, minHeight: 0 }}>
          <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: BG, border: `1px solid ${BR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M13 2H1C0.45 2 0 2.45 0 3V9C0 9.55 0.45 10 1 10H4.5L7 13L9.5 10H13C13.55 10 14 9.55 14 9V3C14 2.45 13.55 2 13 2Z" stroke={ML} strokeWidth={1.1} />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 2.5, color: ML, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>The Talk Track</p>
            <p style={{ fontSize: 14, color: ML, lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>{slide.talk}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClosingSlide() {
  const intents = ['Ingest', 'Assemble', 'Variant', 'Retrieve', 'Simulate'];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 64px' }}>
      <div style={{ marginBottom: 28 }}>
        <svg width={72} height={72} viewBox="0 0 72 72" fill="none" aria-hidden>
          <circle cx={36} cy={36} r={33} stroke={G} strokeWidth={2} />
          <circle cx={36} cy={36} r={15} fill={G} />
        </svg>
      </div>

      <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: W, lineHeight: 1.15, letterSpacing: '-0.5px', margin: '0 0 16px' }}>
        Any Questions?
      </h2>

      <p style={{ fontSize: 17, color: ML, maxWidth: 520, lineHeight: 1.75, margin: '0 0 32px' }}>
        Two demos. Five intents. One vision:{' '}
        <span style={{ color: G }}>the Agentic CMS that makes every consultant interaction faster and more accurate.</span>
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
        {intents.map(i => (
          <span key={i} style={{
            background: S1,
            border: `1px solid ${BRL}`,
            color: ML,
            fontSize: 13,
            fontWeight: 600,
            padding: '6px 18px',
            borderRadius: 8,
          }}>
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function SlideContent({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'cover':      return <CoverSlide />;
    case 'reframe':    return <ReframeSlide />;
    case 'demo-intro': return <DemoIntroSlide slide={slide} />;
    case 'act':        return <ActSlide slide={slide} />;
    case 'closing':    return <ClosingSlide />;
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
          <OptiMark size={18} />
          <span style={{ color: G, fontWeight: 700, fontSize: 14, letterSpacing: '-0.2px' }}>Optimizely</span>
          <span style={{ color: M, fontSize: 13, margin: '0 2px' }}>×</span>
          <span style={{ color: ML, fontSize: 13 }}>Progressive Insurance</span>
        </div>
        <span style={{ color: M, fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
          {idx + 1} / {total}
        </span>
      </header>

      {/* Slide content */}
      <main
        style={{ flex: 1, overflow: 'hidden', padding: '28px 48px 16px' }}
        onClick={() => go(idx + 1)}
        title="Click to advance"
      >
        <div style={{
          height: '100%',
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
                fontSize: 15,
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
