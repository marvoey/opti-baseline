# Plan: /demo-flow Presentation Route

## Context
Create a full-screen, clickable presentation at `/demo-flow` that walks through the two demo scenarios in `agentic-cms-html/Progressive_Demo_Flows_Agentic_CMS.md`. It should feel like a polished slide deck (keyboard + click navigation), styled with the Optimizely brand identity from the images in `/opti-branding/`.

## Branding observations (from `/opti-branding/` images)
- **Primary green**: Vibrant lime green (~`#A8E130`) — "Like the grass on the other side"
- **Background**: Near-black dark (`#080C08`) with green-tinted surfaces
- **Typography**: VC Nudge ExtraBold / Die Grotesk B — not publicly available, approximate with system `-apple-system, "Segoe UI", sans-serif`
- **Logo mark**: Two concentric circles forming an "O" ring — renderable as inline SVG
- **Color pairings**: Green on dark works, never same-color on same-color

## Slide deck structure (12 slides)

| # | Kind | Content |
|---|------|---------|
| 1 | cover | "Agentic CMS & Generative UI" hero with Optimizely O mark |
| 2 | reframe | Core positioning quote |
| 3 | demo-intro | Demo 1 overview — Sarah / Consultant Flow |
| 4–6 | act × 3 | Demo 1 Acts 1–3 |
| 7 | demo-intro | Demo 2 overview — Marcus / Authoring Flow |
| 8–11 | act × 4 | Demo 2 Acts 1–4 |
| 12 | closing | Intent summary / Q&A |

Each **act** slide has three stacked cards: **The Action** → **The Result** (green left-border accent) → **The Talk Track** (italic, muted).

Each **demo-intro** slide has two columns: left = title/focus/intent chips, right = persona card + scenario card.

## Files to create
- `app/demo-flow/layout.tsx` — bare metadata layout, no global site chrome
- `app/demo-flow/page.tsx` — `'use client'` full-screen presentation; ~350 lines

## Files to modify
- `app/_components/DevQuickLinks.tsx` — add `{ label: 'Demo Flow', href: '/demo-flow' }` to LINKS

## Key implementation details

### Navigation
- `useEffect` keyboard listener: `ArrowRight` / `Space` → next; `ArrowLeft` → prev
- Footer arrow buttons + dot indicators (active dot wider, past dots muted)
- `go(next)` fades out (150ms), swaps slide, fades in — uses `useRef` to cancel pending timeouts

### Layout shell
```
[2px progress bar — animates width to (idx+1)/total * 100%]
[header: O-mark + "Optimizely × Progressive Insurance" | "3 / 12"]
[main flex-1: slide content fades in/out]
[footer: dot indicators | ← → buttons]
```

### Brand tokens (inline styles — Tailwind lacks these exact values)
```ts
const G   = '#A8E130'; // Optimizely green
const BG  = '#080C08'; // background
const S1  = '#0D160D'; // surface
const S2  = '#131D13'; // surface alt
const BR  = '#1A2A1A'; // border
const BRL = '#243824'; // border light
const M   = '#4D684D'; // muted
const ML  = '#819A81'; // muted light
const D1  = '#38C8F0'; // Demo 1 cyan accent
const D2  = '#F59E3A'; // Demo 2 amber accent
```

### Slide type union (TypeScript)
```ts
type Slide =
  | { kind: 'cover' }
  | { kind: 'reframe' }
  | { kind: 'demo-intro'; num: 1|2; title: string; subtitle: string; focus: string; intents: string[]; name: string; role: string; scenario: string }
  | { kind: 'act'; demo: 1|2; act: number; intent: string; action: string; result: string; talk: string }
  | { kind: 'closing' };
```

## Verification
1. Run dev server (`yarn dev` or `npm run dev`)
2. Navigate to `http://localhost:3000/demo-flow`
3. Check: full-screen, no site nav visible
4. Check: keyboard ← → advances/retreats slides with fade
5. Check: dot indicators update; progress bar fills
6. Check: all 12 slides render without console errors
7. Check: DevQuickLinks panel shows new "Demo Flow" entry
