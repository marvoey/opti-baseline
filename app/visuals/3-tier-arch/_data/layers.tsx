import type { LucideIcon } from 'lucide-react';
import {
  Layers, Sparkles, Brain, Activity, Layout, Code2, BarChart3,
  ShieldCheck, Zap, Server, Lock, Globe, Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

export const BASE = '/visuals/3-tier-arch';
export const PRESENTER_PATH = `${BASE}/presenter`;
export const STEPS = [BASE, `${BASE}/layer-1`, `${BASE}/layer-2`, `${BASE}/layer-3`] as const;

export const PILOT_EMPLOYER = 'Acme Health';

export type Persona = 'female' | 'male';

export type Accent = {
  label: string;      // "Layer N" text colour
  border: string;     // active border + shadow
  iconBox: string;    // icon tile
  glow: string;       // corner glow
  foot: string;       // monospace footer text
  probe: string;      // probe label colour
  hover: string;      // link hover border
};

export type LayerCard = {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  body: (employer: string) => ReactNode;
  foot: string[];
};

export type Layer = {
  n: 1 | 2 | 3;
  path: string;
  tag: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  owner: { icon: LucideIcon; text: string; color: string };
  accent: Accent;
  cols: string;
  cards: LayerCard[];
  talk: { focus: string; paras: string[]; probeLabel: string; probe: string };
};

export type Connector = { icon: LucideIcon; label: string; text: string; iconColor: string; line: string };

export const LAYERS: Layer[] = [
  {
    n: 1,
    path: STEPS[1],
    tag: 'Optimizely Cloud',
    title: 'Content & Experience Governance',
    summary: 'Clinical copy, guardrails and employer co-branding — owned by Dr. Kay and Dawn, no dev tickets.',
    icon: Layers,
    owner: { icon: Users, text: 'Dr. Kay (CMAIO) & Dawn (CXO)', color: 'text-teal-400' },
    accent: {
      label: 'text-teal-400',
      border: 'border-teal-500 shadow-2xl shadow-teal-500/10 ring-1 ring-teal-500/30',
      iconBox: 'bg-teal-500/20 border-teal-500/40 text-teal-300',
      glow: 'bg-teal-500/5',
      foot: 'text-teal-400/90',
      probe: 'text-teal-400',
      hover: 'hover:border-teal-500/60',
    },
    cols: 'sm:grid-cols-2',
    cards: [
      {
        icon: ShieldCheck,
        iconColor: 'text-emerald-400',
        title: 'Clinical MI Copy & Guardrails',
        body: () => (
          <>
            Owned directly by <strong>Dr. Kay Jewell, MD</strong>. Regulated motivational interviewing prompts,
            safety guidance, self-care resource libraries, and clinical tone rules.
          </>
        ),
        foot: ['Visual Builder', 'No Dev Tickets'],
      },
      {
        icon: Layout,
        iconColor: 'text-teal-400',
        title: 'Multi-Tenant Employer Templates',
        body: (employer) => (
          <>
            Managed by <strong>Dawn Whitelaw</strong>. Spin up {employer} in minutes with bespoke logo, brand
            styling, benefit highlights, and targeted male/female variant journeys.
          </>
        ),
        foot: ['Audience Rules', 'M/F Cohort Routing'],
      },
    ],
    talk: {
      focus: "Focus: Protecting Dr. Kay & Dawn's Time",
      paras: [
        '"If your agency hardcodes these landing pages in React, Dr. Kay has to submit engineering tickets just to adjust a motivational prompt or update clinical resources.',
        'Layer 1 gives the clinical team visual governance. Dawn creates the Acme Health template; Dr. Kay edits copy; and it’s live across your pilots in seconds."',
      ],
      probeLabel: 'Diagnostic Probe to George & Dawn:',
      probe:
        '"When your broker signs Employer #2 next month, will your agency have to manually clone and maintain a separate codebase, or do you have a centralized model where you launch in 15 minutes?"',
    },
  },
  {
    n: 2,
    path: STEPS[2],
    tag: 'Agency Frontend',
    title: 'Delivery & Client Application Layer',
    summary: 'Next.js / React on the edge, consuming CMS content via GraphQL and handing off into Hygia.',
    icon: Code2,
    owner: { icon: Users, text: 'External Agency (~5 Heads: PM, Architect, Devs)', color: 'text-blue-400' },
    accent: {
      label: 'text-blue-400',
      border: 'border-blue-500 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/30',
      iconBox: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
      glow: 'bg-blue-500/5',
      foot: 'text-blue-400/90',
      probe: 'text-blue-400',
      hover: 'hover:border-blue-500/60',
    },
    cols: 'sm:grid-cols-2',
    cards: [
      {
        icon: Globe,
        iconColor: 'text-blue-400',
        title: 'Next.js / React Edge Frontend',
        body: () =>
          'Fast, lightweight client web app deployed on edge infrastructure (Vercel/Cloudflare). Consumes structured CMS schemas via GraphQL. Zero custom CMS backend to maintain.',
        foot: ['Sub-100ms TTFB', 'Zero Database Overhead'],
      },
      {
        icon: Zap,
        iconColor: 'text-cyan-400',
        title: 'Embedded Hygia™ Session Hand-off',
        body: () =>
          'Frictionless transition from the co-branded landing page into the authenticated Hygia coaching modal without jarring redirects or clunky authentication drop-offs.',
        foot: ['Encrypted Session Tokens', 'Streamed UI'],
      },
    ],
    talk: {
      focus: 'Focus: Agency Velocity & Zero Technical Debt',
      paras: [
        '"Your agency starts building this week. If they spend 6 weeks building custom content tables, they will blow their budget before even touching Hygia\'s conversational interface.',
        'Optimizely Graph gives your agency architect a clean GraphQL schema. They write modern React/Next.js code and never worry about database schemas or content storage."',
      ],
      probeLabel: 'Diagnostic Probe to Agency Architect:',
      probe:
        '"Are you planning to build and host your own content database for client templates, or are you looking for an enterprise headless API that frees your devs to focus on the Hygia frontend?"',
    },
  },
  {
    n: 3,
    path: STEPS[3],
    tag: 'CCO Proprietary IP',
    title: 'CCO Intelligence & AI Core',
    summary: 'Hygia™ MI agent, HealthSignals™ risk engine and the Employer Dashboard that proves ROI.',
    icon: Brain,
    owner: { icon: Lock, text: 'Protected Enterprise Assets', color: 'text-indigo-400' },
    accent: {
      label: 'text-indigo-400',
      border: 'border-indigo-500 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/30',
      iconBox: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
      glow: 'bg-indigo-500/5',
      foot: 'text-indigo-400/90',
      probe: 'text-indigo-400',
      hover: 'hover:border-indigo-500/60',
    },
    cols: 'sm:grid-cols-3',
    cards: [
      {
        icon: Sparkles,
        iconColor: 'text-teal-400',
        title: 'Hygia™ MI Agent',
        body: () =>
          'LLM conversational agent grounded in motivational interviewing. Prompts resolve ambivalence and guide self-care habits without human coach overhead.',
        foot: ['94% UX Comprehension'],
      },
      {
        icon: Activity,
        iconColor: 'text-rose-400',
        title: 'HealthSignals™ Engine',
        body: () =>
          'Predictive comorbidity risk modeling. Specifically isolates the 23% of employees driving >60% of claims costs to trigger proactive interventions.',
        foot: ['Claims Risk Stratification'],
      },
      {
        icon: BarChart3,
        iconColor: 'text-amber-400',
        title: 'Employer Dashboard',
        body: () =>
          'Aggregated, HIPAA-safe reporting proving 40–60% engagement rates, workforce resilience sentiment, and tangible HEOR healthcare cost reductions.',
        foot: ['Broker Proof-of-Value'],
      },
    ],
    talk: {
      focus: 'Focus: The 40–60% Engagement Metric',
      paras: [
        '"Traditional EAPs die at 3% engagement. To hit 40–60%, the landing page cannot be generic.',
        'Layer 1 feeds high-intent, cohort-tailored traffic directly into Hygia, while front-of-funnel drop-off analytics stream straight into your Employer Dashboard to prove ROI to brokers."',
      ],
      probeLabel: 'Diagnostic Probe to George (CEO/HEOR):',
      probe:
        '"What happens to your broker renewals if you can\'t prove where employees drop off between the outreach email and completing their first session in Hygia?"',
    },
  },
];

/** Connector pipes: index 0 sits between layers 1→2, index 1 between 2→3. */
export const CONNECTORS: Connector[] = [
  {
    icon: Zap,
    iconColor: 'text-teal-400',
    label: 'Optimizely Graph',
    text: 'Optimizely Graph (High-Speed Headless GraphQL API)',
    line: 'from-teal-500 to-blue-500',
  },
  {
    icon: Server,
    iconColor: 'text-indigo-400',
    label: 'Event Streaming',
    text: 'Event Streaming & Real-Time AI Orchestration API',
    line: 'from-blue-500 to-indigo-500',
  },
];

export const OVERVIEW_TALK = {
  title: 'Overview: Three Tiers, Clear Ownership',
  paras: [
    'Walk the stack top to bottom: clinical governance in Optimizely, agency-built frontend in the middle, CCO’s protected IP at the core.',
    'Click into each layer to zoom. Use ← / → to move between layers; this window follows along.',
  ],
};

export const VALUE_POINTS = [
  ['No Agency Re-write:', 'Code written for the 2–3 pilot employers scales to 50 without technical refactoring.'],
  ['$50k Floor Protection:', 'Justified against the cost of 2 dedicated agency backend developers ($80k+ burn).'],
  ['Founder Independence:', 'Dr. Kay and Dawn maintain full editorial agility over clinical messaging.'],
] as const;

export const HANDOFF = {
  title: "Marvin's Hand-off to Halla (AE):",
  quote:
    '"Halla, knowing this is the architecture required to protect their pilot scale, how does this align with the commercial plan?"',
  next: 'Next: Step 5 Budget Negative Reverse',
};

export function variantLabel(persona: Persona) {
  return persona === 'female' ? 'Holistic Resilience & Stress Coping' : 'Performance Focus & Energy Recovery';
}

export function slugFor(employer: string, persona: Persona) {
  return `/${employer.toLowerCase().replace(/\s+/g, '-')}/?v=${persona}`;
}
