'use client';

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { safeHref } from './utils';

/**
 * Pulse rings hero (Liberty brand, GRM U.S.). Ported from the lib-pulse-rings-hero
 * prototype, keeping only the pulse-rings animation the CMS type uses.
 *
 * Theme rules baked in:
 *  - On Liberty Blue: white text only
 *  - On Yellow: Liberty Blue text, white inverse button, no teal (so no badge)
 *  - On White / Atmospheric White: teal primary + outlined secondary
 */
const C = {
  yellow: '#FFD000',
  blue: '#1A1446',
  teal: '#78E1E1',
  atmo: '#F5F5F5',
  white: '#FFFFFF',
  gray: '#343741',
  y60: '#FFE280',
  y40: '#FFEAA9',
  blue90: '#29254F',
};

type ThemeKey = 'blue' | 'white' | 'atmospheric' | 'yellow';

type Theme = {
  bg: string;
  heading: string;
  body: string;
  mark: string;
  markText: string;
  ring: string;
  dot: string;
  panel: string;
  panelShapes: [string, string, string];
  panelRing: string;
};

const THEMES: Record<ThemeKey, Theme> = {
  yellow: {
    bg: C.yellow, heading: C.blue, body: C.blue,
    mark: C.white, markText: C.blue,
    ring: C.white, dot: C.white,
    panel: C.white, panelShapes: [C.yellow, C.y40, C.blue], panelRing: C.yellow,
  },
  white: {
    bg: C.white, heading: C.blue, body: C.gray,
    mark: C.yellow, markText: C.blue,
    ring: C.yellow, dot: C.yellow,
    panel: C.yellow, panelShapes: [C.white, C.y60, C.blue], panelRing: C.white,
  },
  atmospheric: {
    bg: C.atmo, heading: C.blue, body: C.gray,
    mark: C.yellow, markText: C.blue,
    ring: C.yellow, dot: C.yellow,
    panel: C.yellow, panelShapes: [C.white, C.y60, C.blue], panelRing: C.white,
  },
  blue: {
    bg: C.blue, heading: C.white, body: C.white,
    mark: C.yellow, markText: C.blue,
    ring: C.teal, dot: C.yellow,
    panel: C.blue90, panelShapes: [C.yellow, C.blue, C.teal], panelRing: C.teal,
  },
};

const SPEED = { slow: 1.5, normal: 1, fast: 0.65 } as const;
const HEIGHTS = { compact: 400, medium: 540, full: 700 } as const;
type SpeedKey = keyof typeof SPEED;
type HeightKey = keyof typeof HEIGHTS;
type LayoutKey = 'center' | 'left' | 'split';

// A key the editor never set (null) or that the CMS no longer offers falls back to the default.
const pick = <T extends string>(map: Record<T, unknown>, key: string | null | undefined, fallback: T): T =>
  key && key in map ? (key as T) : fallback;

const CSS = `
.lmh-paused .lmh-anim{animation-play-state:paused !important}
@keyframes lmhFadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes lmhFade{from{opacity:0}to{opacity:1}}
@keyframes lmhPop{0%{opacity:0;transform:scale(0) rotate(-14deg)}70%{opacity:1;transform:scale(1.08) rotate(3deg)}100%{opacity:1;transform:none}}
@keyframes lmhPopSoft{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}
@keyframes lmhFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
@keyframes lmhPulse{0%{opacity:0;transform:scale(.55)}25%{opacity:.85}100%{opacity:0;transform:scale(1.55)}}
@keyframes lmhKen{from{transform:scale(1.12)}to{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.lmh .lmh-anim{animation:none !important}}
`;

type Anim = (name: string, delay?: number, dur?: number, o?: { infinite?: boolean; ease?: string }) => CSSProperties;

/** The `data-epi-*` attributes `pa()` returns; empty unless the page is open in the editor. */
type DataAttrs = Record<string, string | undefined>;
type EditAttrs = Partial<Record<'eyebrow' | 'headline' | 'subhead' | 'primary' | 'secondary' | 'badge', DataAttrs>>;

export type PulseRingsHeroProps = {
  theme?: string | null;
  layout?: string | null;
  height?: string | null;
  speed?: string | null;
  loop?: boolean | null;
  showBadge?: boolean | null;
  badgeText?: string | null;
  eyebrow?: string | null;
  headline?: string | null;
  highlightText?: string | null;
  subhead?: string | null;
  primaryLabel?: string | null;
  primaryHref?: string;
  secondaryLabel?: string | null;
  secondaryHref?: string;
  imageSrc?: string;
  imageAlt?: string | null;
  /** `data-epi-*` attributes for on-page editing (empty outside the editor). */
  editAttrs?: EditAttrs;
};

/** Start the animations only once the hero has scrolled into view. */
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/** Split the headline around the highlighted phrase (case-insensitive, first match). */
function splitHeadline(headline: string, highlight: string) {
  const i = highlight ? headline.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (i < 0) return { before: headline, mark: '', after: '' };
  return {
    before: headline.slice(0, i),
    mark: headline.slice(i, i + highlight.length),
    after: headline.slice(i + highlight.length),
  };
}

function Rings({ ring, dot, center, loop, a }: { ring: string; dot: string | null; center: boolean; loop: boolean; a: Anim }) {
  const size = 560;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute hidden lg:block"
      style={{ width: size, height: size, top: '50%', marginTop: -size / 2, ...(center ? { left: '50%', marginLeft: -size / 2 } : { right: -120 }) }}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="lmh-anim absolute inset-0 rounded-full"
          style={{ border: `3px solid ${ring}`, opacity: 0, ...a('lmhPulse', i * 0.9, 3.6, { infinite: loop, ease: 'ease-out' }) }}
        />
      ))}
      {dot && (
        <span
          className="lmh-anim absolute rounded-full"
          style={{ width: 140, height: 140, left: size / 2 - 70, top: size / 2 - 70, background: dot, ...a('lmhPopSoft', 0.2, 0.9) }}
        />
      )}
    </div>
  );
}

/** Right-hand panel of the Split layout: the chosen image, or the rings on a coloured panel. */
function MediaPanel({ t, src, alt, loop, a }: { t: Theme; src: string; alt: string; loop: boolean; a: Anim }) {
  const [big, small, dot] = t.panelShapes;
  const float = (d: number, dur: number) => (loop ? a('lmhFloat', d, dur, { infinite: true, ease: 'ease-in-out' }) : {});
  return (
    <div className="relative min-h-[300px] overflow-hidden">
      <div className="lmh-anim absolute inset-0 overflow-hidden md:rounded-l-[56px]" style={{ background: t.panel, ...a('lmhFade', 0, 0.9) }}>
        {src ? (
          // Asset hosts are not configured for next/image, and the CMS serves the image already sized.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="lmh-anim h-full w-full object-cover" style={a('lmhKen', 0.2, 9, { ease: 'ease-out' })} />
        ) : (
          <>
            <Rings ring={t.panelRing} dot={null} center loop={loop} a={a} />
            <div className="lmh-anim absolute" style={{ width: 300, height: 300, left: '50%', top: '50%', marginLeft: -150, marginTop: -150, ...a('lmhPopSoft', 0.2, 0.9) }}>
              <div className="lmh-anim h-full w-full rounded-full" style={{ background: big, ...float(0, 7) }} />
            </div>
            <div className="lmh-anim absolute" style={{ width: 130, height: 130, right: '10%', top: '10%', ...a('lmhPopSoft', 0.35, 0.9) }}>
              <div className="lmh-anim h-full w-full rounded-full" style={{ background: small, ...float(0.6, 8.5) }} />
            </div>
            <div className="lmh-anim absolute" style={{ width: 44, height: 44, left: '14%', bottom: '16%', ...a('lmhPopSoft', 0.5, 0.9) }}>
              <div className="lmh-anim h-full w-full rounded-full" style={{ background: dot, ...float(1.2, 6) }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PulseRingsHero(props: PulseRingsHeroProps) {
  const themeKey = pick<ThemeKey>(THEMES, props.theme, 'blue');
  const t = THEMES[themeKey];
  const layout = pick<LayoutKey>({ center: 1, left: 1, split: 1 }, props.layout, 'center');
  const heightPx = HEIGHTS[pick<HeightKey>(HEIGHTS, props.height, 'medium')];
  const m = SPEED[pick<SpeedKey>(SPEED, props.speed, 'normal')];
  const loop = props.loop ?? true; // the CMS cannot store a default, so an unset switch means on
  const center = layout === 'center';
  const edit = props.editAttrs ?? {};

  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref);

  const a: Anim = (name, delay = 0, dur = 0.8, o = {}) => ({
    animationName: name,
    animationDuration: `${dur * m}s`,
    animationDelay: `${delay * m}s`,
    animationIterationCount: o.infinite ? 'infinite' : 1,
    animationTimingFunction: o.ease || 'cubic-bezier(.2,.7,.2,1)',
    animationFillMode: 'both',
  });
  const enter = (i: number) => a('lmhFadeUp', i * 0.14, 0.8);

  const { before, mark, after } = splitHeadline(props.headline ?? '', props.highlightText?.trim() ?? '');
  const showBadge = !!props.showBadge && themeKey !== 'yellow' && !!props.badgeText;

  const btn =
    'inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition-transform duration-200 hover:-translate-y-0.5';
  const primaryStyle = themeKey === 'yellow' ? { background: C.white, color: C.blue } : { background: C.teal, color: C.blue };
  const lightTheme = themeKey === 'white' || themeKey === 'atmospheric';

  const textBlock = (
    <div className={`relative z-10 flex w-full flex-col gap-5 ${center ? 'mx-auto max-w-3xl items-center text-center' : 'max-w-2xl items-start'}`}>
      {props.eyebrow && (
        <p className="lmh-anim text-base font-semibold" style={{ color: t.heading, ...enter(0) }} {...edit.eyebrow}>
          {props.eyebrow}
        </p>
      )}
      <h1
        className="lmh-anim text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
        style={{ color: t.heading, ...enter(1) }}
        {...edit.headline}
      >
        {before}
        {mark && (
          <span className="relative inline-block" style={{ color: t.markText, padding: '0 .12em' }}>
            <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: '0.14em', bottom: '0.06em', background: t.mark, borderRadius: 3, zIndex: 0 }} />
            <span style={{ position: 'relative', zIndex: 1 }}>{mark}</span>
          </span>
        )}
        {after}
      </h1>
      {props.subhead && (
        <p className="lmh-anim max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: t.body, ...enter(2) }} {...edit.subhead}>
          {props.subhead}
        </p>
      )}
      <div className={`flex flex-wrap items-center gap-5 pt-2 ${center ? 'justify-center' : ''}`}>
        <div className="lmh-anim flex flex-wrap items-center gap-3" style={enter(3)}>
          {props.primaryLabel && (
            <a href={safeHref(props.primaryHref)} className={btn} style={primaryStyle} {...edit.primary}>
              {props.primaryLabel}
            </a>
          )}
          {props.secondaryLabel &&
            (lightTheme ? (
              <a href={safeHref(props.secondaryHref)} className={btn} style={{ border: `2px solid ${C.blue}`, color: C.blue }} {...edit.secondary}>
                {props.secondaryLabel}
              </a>
            ) : (
              <a
                href={safeHref(props.secondaryHref)}
                className="inline-flex items-center px-2 py-3 text-base font-bold underline underline-offset-4"
                style={{ color: themeKey === 'blue' ? C.white : C.blue }}
                {...edit.secondary}
              >
                {props.secondaryLabel} →
              </a>
            ))}
        </div>
        {showBadge && (
          <span
            className="lmh-anim inline-flex shrink-0 items-center justify-center rounded-full text-center text-sm font-bold leading-tight"
            style={{ width: 96, height: 96, padding: 12, background: C.teal, color: C.blue, ...a('lmhPop', 0.75, 0.6) }}
            {...edit.badge}
          >
            {props.badgeText}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section
      ref={ref}
      className={`lmh relative w-full overflow-hidden ${inView ? '' : 'lmh-paused'}`}
      style={{ background: t.bg, minHeight: heightPx }}
    >
      <style>{CSS}</style>

      {layout === 'split' ? (
        <div className="relative grid md:grid-cols-2" style={{ minHeight: heightPx }}>
          <div className="flex items-center px-6 py-14 md:px-12 lg:px-16">{textBlock}</div>
          <MediaPanel t={t} src={props.imageSrc ? safeHref(props.imageSrc, '') : ''} alt={props.imageAlt ?? ''} loop={loop} a={a} />
        </div>
      ) : (
        <Fragment>
          <Rings ring={t.ring} dot={center ? null : t.dot} center={center} loop={loop} a={a} />
          <div className="relative flex w-full items-center px-6 py-16 md:px-12 lg:px-20" style={{ minHeight: heightPx }}>
            {textBlock}
          </div>
        </Fragment>
      )}
    </section>
  );
}
