import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Styleguide',
  description: 'Optimizely Brand Visual Identity & UI Design Standards.',
};

type Swatch = { name: string; hex: string; className: string };

const PRIMARY: Swatch[] = [
  { name: 'LFGreen', hex: '#ABFF44', className: 'bg-lfgreen' },
  { name: 'Grass', hex: '#7DDD3D', className: 'bg-grass' },
  { name: 'Good-to-go', hex: '#3AB533', className: 'bg-good-to-go' },
  { name: 'Neutral 1', hex: '#FFFFFF', className: 'bg-neutral-1 border border-neutral-5' },
  { name: 'Neutral 3', hex: '#E4F0DA', className: 'bg-neutral-3' },
];

const SECONDARY: Swatch[] = [
  { name: 'Dark Fir', hex: '#08251A', className: 'bg-dark-fir' },
  { name: 'Light Blue', hex: '#91DBDA', className: 'bg-light-blue' },
];

const TERTIARY: Swatch[] = [
  { name: 'Dark Blue', hex: '#007B79', className: 'bg-dark-blue' },
  { name: 'Light Fir', hex: '#197050', className: 'bg-light-fir' },
  { name: 'Mid Fir', hex: '#0D3A29', className: 'bg-mid-fir' },
  { name: 'Light Pink', hex: '#FF99B6', className: 'bg-light-pink' },
  { name: 'Dark Pink', hex: '#8F4764', className: 'bg-dark-pink' },
  { name: 'Neutral 2', hex: '#EFF6E9', className: 'bg-neutral-2' },
  { name: 'Neutral 4', hex: '#D8E4CB', className: 'bg-neutral-4' },
  { name: 'Neutral 5', hex: '#C3CEAF', className: 'bg-neutral-5' },
  { name: 'Neutral 6', hex: '#A1AC8D', className: 'bg-neutral-6' },
];

const PAIRINGS: { textClass: string; bgClass: string; label: string }[] = [
  { textClass: 'text-dark-fir', bgClass: 'bg-lfgreen', label: 'Dark Fir on LFGreen' },
  { textClass: 'text-dark-fir', bgClass: 'bg-light-blue', label: 'Dark Fir on Light Blue' },
  { textClass: 'text-dark-fir', bgClass: 'bg-neutral-3', label: 'Dark Fir on Neutral 3' },
  { textClass: 'text-dark-fir', bgClass: 'bg-neutral-1 border border-neutral-5', label: 'Dark Fir on Neutral 1' },
  { textClass: 'text-dark-fir', bgClass: 'bg-neutral-2', label: 'Dark Fir on Neutral 2' },
  { textClass: 'text-neutral-1', bgClass: 'bg-dark-fir', label: 'Neutral 1 on Dark Fir' },
  { textClass: 'text-lfgreen', bgClass: 'bg-dark-fir', label: 'LFGreen on Dark Fir' },
];

const QA_CHECKLIST = [
  'Backgrounds limited to Neutral 1, Neutral 2, or Neutral 3 pair with Dark Fir body text.',
  "Headers use the display face at ExtraBold (800), tracked -1px (H1) / -0.5px (H2).",
  'Module/card containers use a 32px corner radius; buttons use 8px.',
  'No linear-gradient or radial-gradient anywhere — flat, solid tokens only.',
  'Material Symbols configured at weight 300, with FILL 1 on active/selected state.',
  'Any rendered logo has min-width 80px and clear space of at least one "l" width.',
];

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {swatches.map((s) => (
        <div key={s.name} className="overflow-hidden rounded-2xl border border-neutral-5">
          <div className={`h-20 ${s.className}`} />
          <div className="bg-neutral-1 px-3 py-2">
            <p className="text-sm font-semibold text-dark-fir">{s.name}</p>
            <p className="font-mono text-xs uppercase text-neutral-6">{s.hex}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-neutral-4 py-12 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl font-bold tracking-tight text-dark-fir">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm text-neutral-6">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main className="min-h-full bg-neutral-1">
      <header className="bg-dark-fir px-6 py-16">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-light-blue">
            Optimizely
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-neutral-1 sm:text-5xl">
            Brand Visual Identity
          </h1>
          <p className="mt-4 max-w-2xl text-base text-neutral-4">
            A quick-reference overview of the Optimizely brand standards used across
            this app — color tokens, typography, corner radii, buttons, iconography,
            and logo usage. See the{' '}
            <code className="rounded bg-mid-fir px-1.5 py-0.5 font-mono text-sm text-lfgreen">
              brand-visual-identity
            </code>{' '}
            skill for the full rule set this page is generated from.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6">
        <Section
          id="colors"
          title="Color tokens"
          description="Neutral 1 and Neutral 3 are the default backdrops so the primary greens pop. Never invent a pairing outside the approved list below."
        >
          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-6">
                Primary
              </h3>
              <SwatchGrid swatches={PRIMARY} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-6">
                Secondary
              </h3>
              <SwatchGrid swatches={SECONDARY} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-6">
                Tertiary
              </h3>
              <SwatchGrid swatches={TERTIARY} />
            </div>
          </div>
        </Section>

        <Section
          id="pairings"
          title="Approved text/background pairings"
          description="Restrict text-on-background combinations to these AAA-compliant pairs. Never use two secondary colors together, and never put body copy on a primary color."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PAIRINGS.map((p) => (
              <div
                key={p.label}
                className={`flex h-24 flex-col justify-between rounded-2xl p-4 ${p.bgClass}`}
              >
                <span className={`font-display text-lg font-bold ${p.textClass}`}>Aa</span>
                <span className={`text-xs font-medium ${p.textClass}`}>{p.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="typography"
          title="Typography"
          description={
            'Headlines use VC Nudge (ExtraBold/SemiBold); body and UI labels use Die Grotesk B ' +
            '(Medium/Regular). Both are licensed faces — this app substitutes Space Grotesk for ' +
            'display and Inter for body (see app/layout.tsx), so the samples below render in the ' +
            'substitute faces, not the licensed ones.'
          }
        >
          <div className="space-y-6 rounded-2xl border border-neutral-4 bg-neutral-2 p-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-6">
                H1 · display / extrabold / 48px / -1px tracking
              </p>
              <h1 className="font-display text-5xl font-extrabold tracking-tight text-dark-fir">
                Turn your FML into LFG.
              </h1>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-6">
                H2 · display / extrabold / 32px / -0.5px tracking
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-dark-fir">
                A section header looks like this.
              </h2>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-6">
                Body · sans / regular / 16px / 24px line-height
              </p>
              <p className="text-base leading-6 text-dark-fir">
                A harmonious experience brings warmth and a feeling of tactility to the
                brand. Use the primary color selection to prioritize clean, high-contrast
                layouts, and keep Dark Fir as the only body text color.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-6">
                Caption · sans / regular / 12px / 0.5px tracking
              </p>
              <p className="text-xs tracking-wide text-dark-fir">
                Captions and small text sit at 12px with slightly open tracking.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="shape"
          title="Corner radii — the &ldquo;Opal&rdquo; pillow"
          description="Modules and cards use a 32px squircle radius with continuous (~70%) corner smoothing where supported; buttons and small elements use 8px, or a full pill."
        >
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex h-32 w-32 items-center justify-center rounded-4xl border border-neutral-5 bg-neutral-3 text-xs font-semibold text-dark-fir">
              32px module
            </div>
            <div className="flex h-16 w-32 items-center justify-center rounded-lg border border-neutral-5 bg-neutral-3 text-xs font-semibold text-dark-fir">
              8px button
            </div>
            <div className="flex h-12 w-32 items-center justify-center rounded-full border border-neutral-5 bg-neutral-3 text-xs font-semibold text-dark-fir">
              pill
            </div>
          </div>
        </Section>

        <Section
          id="buttons"
          title="Buttons"
          description="Solid LFGreen background with Dark Fir text by default, generous padding, and rounded or pill corners. Grass is the hover fallback."
        >
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="rounded-lg bg-lfgreen px-6 py-3 text-sm font-medium text-dark-fir transition-colors hover:bg-grass"
            >
              Start Growing
            </button>
            <button
              type="button"
              className="rounded-full bg-lfgreen px-6 py-3 text-sm font-medium text-dark-fir transition-colors hover:bg-grass"
            >
              Pill variant
            </button>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg bg-neutral-4 px-6 py-3 text-sm font-medium text-neutral-6"
            >
              Disabled
            </button>
          </div>
        </Section>

        <Section
          id="icons"
          title="Iconography"
          description="Google Material Symbols, Rounded family, weight 300, optical size 40dp. Outline (FILL 0) when inactive, filled (FILL 1) when active/selected. This app does not currently load the Material Symbols font — the mark below is a stand-in shape at the same weight/rhythm."
        >
          <div className="flex items-center gap-6">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-dark-fir"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 2 4 14h6l-1 8 9-12h-6z"
              />
            </svg>
            <span className="font-mono text-xs text-neutral-6">
              font-variation-settings: &apos;FILL&apos; 0, &apos;wght&apos; 300, &apos;GRAD&apos; 0, &apos;opsz&apos; 40;
            </span>
          </div>
        </Section>

        <Section
          id="logo"
          title="Logo usage"
          description="No logo asset is wired into this styleguide — treat the placeholder below as a stand-in for the real lockup, not the brand mark itself."
        >
          <div className="flex flex-wrap items-start gap-8">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 rounded-full border-2 border-dashed border-neutral-5 px-4 py-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lfgreen text-xs font-extrabold text-dark-fir">
                  O
                </span>
                <span className="font-display text-sm font-extrabold text-dark-fir">
                  optimizely
                </span>
              </div>
              <p className="text-xs text-neutral-6">Placeholder lockup — min-width 80px</p>
            </div>
            <ul className="max-w-md list-inside list-disc space-y-1 text-sm text-dark-fir">
              <li>Never render the wordmark below 80px wide.</li>
              <li>
                Clear space on every side is at least the width of the &ldquo;l&rdquo; in the
                wordmark.
              </li>
              <li>Primary (green, outlined) logo on light backgrounds only.</li>
              <li>Monochrome logo on dark or complex/photographic backgrounds.</li>
              <li>Never strip the outline, recolor, or change the opacity of the mark.</li>
            </ul>
          </div>
        </Section>

        <Section id="qa" title="Automated QA checklist" description="Run generated UI against this list before shipping.">
          <ul className="space-y-2">
            {QA_CHECKLIST.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-dark-fir">
                <span className="mt-0.5 text-light-fir">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <footer className="border-t border-neutral-4 bg-neutral-2 px-6 py-8">
        <p className="mx-auto w-full max-w-5xl text-xs text-neutral-6">
          Generated from the <code className="font-mono">brand-visual-identity</code> Claude
          Code skill (<code className="font-mono">.claude/skills/brand-visual-identity/SKILL.md</code>
          ). Update the skill first, then this page, if the standards change.
        </p>
      </footer>
    </main>
  );
}
