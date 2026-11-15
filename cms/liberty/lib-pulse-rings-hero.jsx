import React, { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   Liberty Mutual brand tokens (GRM U.S.)
------------------------------------------------------------------- */
const C = {
  yellow: "#FFD000",
  blue: "#1A1446",
  teal: "#78E1E1",
  darkTeal: "#06748C",
  atmo: "#F5F5F5",
  white: "#FFFFFF",
  gray: "#343741",
  y60: "#FFE280",
  y40: "#FFEAA9",
  blue90: "#29254F",
};
const FONT = "Roboto, Arial, sans-serif";

/* Theme rules baked in:
   - On Liberty Blue: white text only
   - On Yellow: Liberty Blue text, white inverse button, no teal
   - On White/Atmospheric: teal primary + outlined secondary */
const THEMES = {
  yellow: {
    label: "Liberty Yellow",
    bg: C.yellow, heading: C.blue, body: C.blue, eyebrow: C.blue,
    mark: C.white, markText: C.blue,
    shapes: [C.white, C.y60, C.y40],
    ring: C.white, dot: C.white,
    panel: C.white, panelShapes: [C.yellow, C.y40, C.blue], panelRing: C.yellow,
  },
  white: {
    label: "White",
    bg: C.white, heading: C.blue, body: C.gray, eyebrow: C.blue,
    mark: C.yellow, markText: C.blue,
    shapes: [C.yellow, C.y40, C.blue],
    ring: C.yellow, dot: C.yellow,
    panel: C.yellow, panelShapes: [C.white, C.y60, C.blue], panelRing: C.white,
  },
  atmospheric: {
    label: "Atmospheric White",
    bg: C.atmo, heading: C.blue, body: C.gray, eyebrow: C.blue,
    mark: C.yellow, markText: C.blue,
    shapes: [C.yellow, C.white, C.blue],
    ring: C.yellow, dot: C.yellow,
    panel: C.yellow, panelShapes: [C.white, C.y60, C.blue], panelRing: C.white,
  },
  blue: {
    label: "Liberty Blue",
    bg: C.blue, heading: C.white, body: C.white, eyebrow: C.white,
    mark: C.yellow, markText: C.blue,
    shapes: [C.blue90, C.yellow, C.teal],
    ring: C.teal, dot: C.yellow,
    panel: C.blue90, panelShapes: [C.yellow, C.blue, C.teal], panelRing: C.teal,
  },
};

const SPEED = { slow: 1.5, normal: 1, fast: 0.65 };
const HEIGHTS = { compact: 400, medium: 540, full: 700 };

const ANIMATIONS = [
  ["static", "None (static)"],
  ["fadeUp", "Fade up (staggered)"],
  ["wordReveal", "Word-by-word reveal"],
  ["highlightSweep", "Highlighter sweep"],
  ["rotatingWords", "Rotating product words"],
  ["pulseRings", "Pulse rings"],
  ["splitReveal", "Panel slide-in"],
];

const DEFAULTS = {
  theme: "yellow",
  animation: "fadeUp",
  layout: "left",
  height: "medium",
  speed: "normal",
  loop: true,
  showShapes: true,
  showViolator: false,
  eyebrow: "Car, home & more",
  headline: "Customized insurance for the road ahead.",
  highlightText: "",
  rotatingWords: "car, home, condo, motorcycle",
  subhead: "Only pay for what you need, with coverage built around your life.",
  primaryCta: "Get a quote",
  primaryLink: "#",
  secondaryCta: "Explore coverage",
  secondaryLink: "#",
  violatorText: "Built for you",
  imageUrl: "",
  imageAlt: "",
};

const CSS = `
.lmh-paused .lmh-anim{animation-play-state:paused !important}
@keyframes lmhFadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes lmhFade{from{opacity:0}to{opacity:1}}
@keyframes lmhWord{from{opacity:0;transform:translateY(105%)}to{opacity:1;transform:none}}
@keyframes lmhSweep{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes lmhRotIn{from{opacity:0;transform:translateY(55%)}to{opacity:1;transform:none}}
@keyframes lmhPop{0%{opacity:0;transform:scale(0) rotate(-14deg)}70%{opacity:1;transform:scale(1.08) rotate(3deg)}100%{opacity:1;transform:none}}
@keyframes lmhPopSoft{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}
@keyframes lmhFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
@keyframes lmhPulse{0%{opacity:0;transform:scale(.55)}25%{opacity:.85}100%{opacity:0;transform:scale(1.55)}}
@keyframes lmhPanel{from{transform:translateX(105%)}to{transform:none}}
@keyframes lmhKen{from{transform:scale(1.12)}to{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.lmh .lmh-anim{animation:none !important}}
`;

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
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
      { threshold: 0.25 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return inView;
}

function parseHeadline(headline, hl) {
  const out = [];
  (headline || "").split(/(\{words\})/).forEach((part) => {
    if (!part) return;
    if (part === "{words}") {
      out.push({ type: "rotate" });
      return;
    }
    const i = hl ? part.toLowerCase().indexOf(hl.toLowerCase()) : -1;
    if (i >= 0) {
      if (i > 0) out.push({ type: "text", text: part.slice(0, i) });
      out.push({ type: "hl", text: part.slice(i, i + hl.length) });
      if (i + hl.length < part.length) out.push({ type: "text", text: part.slice(i + hl.length) });
    } else {
      out.push({ type: "text", text: part });
    }
  });
  return out;
}

const linkProps = (href) =>
  /^https?:/.test(href || "")
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href: "#", onClick: (e) => e.preventDefault() };

/* ------------------------------------------------------------------
   Sub-components
------------------------------------------------------------------- */
function Highlight({ t, sweepStyle, children }) {
  return (
    <span className="relative inline-block" style={{ color: t.markText, padding: "0 .12em" }}>
      <span
        aria-hidden
        className={sweepStyle ? "lmh-anim" : ""}
        style={{
          position: "absolute", left: 0, right: 0, top: "0.14em", bottom: "0.06em",
          background: t.mark, borderRadius: 3, transformOrigin: "left center", zIndex: 0,
          ...(sweepStyle || {}),
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
}

function RotatingWord({ words, m, color, underline, active, loop }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active || words.length < 2) return;
    const id = setInterval(() => {
      setI((x) => (!loop && x === words.length - 1 ? x : (x + 1) % words.length));
    }, 2200 * m);
    return () => clearInterval(id);
  }, [active, words.length, m, loop]);
  return (
    <span className="relative inline-block" style={{ color }}>
      <span
        key={i}
        className="lmh-anim inline-block"
        style={{
          animationName: "lmhRotIn", animationDuration: `${0.5 * m}s`, animationFillMode: "both",
          animationTimingFunction: "cubic-bezier(.2,.7,.2,1)",
          borderBottom: `0.12em solid ${underline}`, lineHeight: 1.05,
        }}
      >
        {words[i] || ""}
      </span>
    </span>
  );
}

function Ctas({ s, style }) {
  const btn =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition-transform duration-200 hover:-translate-y-0.5";
  const primaryStyle =
    s.theme === "yellow" ? { background: C.white, color: C.blue } : { background: C.teal, color: C.blue };
  let secondary = null;
  if (s.secondaryCta) {
    if (s.theme === "white" || s.theme === "atmospheric") {
      secondary = (
        <a {...linkProps(s.secondaryLink)} className={btn} style={{ border: `2px solid ${C.blue}`, color: C.blue }}>
          {s.secondaryCta}
        </a>
      );
    } else {
      secondary = (
        <a
          {...linkProps(s.secondaryLink)}
          className="inline-flex items-center px-2 py-3 text-base font-bold underline underline-offset-4"
          style={{ color: s.theme === "blue" ? C.white : C.blue }}
        >
          {s.secondaryCta} →
        </a>
      );
    }
  }
  return (
    <div className="lmh-anim flex flex-wrap items-center gap-3" style={style}>
      {s.primaryCta && (
        <a {...linkProps(s.primaryLink)} className={btn} style={primaryStyle}>
          {s.primaryCta}
        </a>
      )}
      {secondary}
    </div>
  );
}

function Shapes({ t, layout, loop, a }) {
  const P =
    layout === "center"
      ? [
          { pos: { left: -160, bottom: -160 }, size: 380 },
          { pos: { right: -90, top: -90 }, size: 260 },
          { pos: { right: "12%", bottom: "18%" }, size: 48 },
        ]
      : [
          { pos: { right: -140, top: -110 }, size: 420 },
          { pos: { right: -60, bottom: -100 }, size: 240 },
          { pos: { right: "18%", top: "14%" }, size: 56 },
        ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {P.map((p, i) => (
        <div key={i} className="lmh-anim absolute" style={{ ...p.pos, width: p.size, height: p.size, ...a("lmhPopSoft", 0.1 + i * 0.15, 1.1) }}>
          <div
            className="lmh-anim h-full w-full rounded-full"
            style={{ background: t.shapes[i], ...(loop ? a("lmhFloat", i * 0.8, 6 + i * 1.5, { infinite: true, ease: "ease-in-out" }) : {}) }}
          />
        </div>
      ))}
    </div>
  );
}

function Rings({ ring, dot, center, loop, a, still }) {
  const size = 560;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute hidden lg:block"
      style={{ width: size, height: size, top: "50%", marginTop: -size / 2, ...(center ? { left: "50%", marginLeft: -size / 2 } : { right: -120 }) }}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="lmh-anim absolute inset-0 rounded-full"
          style={{
            border: `3px solid ${ring}`,
            opacity: still ? 0.35 : 0,
            transform: still ? `scale(${0.55 + i * 0.3})` : undefined,
            ...a("lmhPulse", i * 0.9, 3.6, { infinite: loop, ease: "ease-out" }),
          }}
        />
      ))}
      {dot && (
        <span
          className="lmh-anim absolute rounded-full"
          style={{ width: 140, height: 140, left: size / 2 - 70, top: size / 2 - 70, background: dot, ...a("lmhPopSoft", 0.2, 0.9) }}
        />
      )}
    </div>
  );
}

function MediaPanel({ t, s, mode, loop, a, still }) {
  const slide = mode === "splitReveal";
  const [big, small, dot] = t.panelShapes;
  const base = slide ? 0.6 : 0.2;
  const float = (d, dur) => (loop ? a("lmhFloat", d, dur, { infinite: true, ease: "ease-in-out" }) : {});
  return (
    <div className="relative min-h-[300px] overflow-hidden">
      <div
        className="lmh-anim absolute inset-0 overflow-hidden md:rounded-l-[56px]"
        style={{ background: t.panel, ...(slide ? a("lmhPanel", 0, 1) : a("lmhFade", 0, 0.9)) }}
      >
        {s.imageUrl ? (
          <img src={s.imageUrl} alt={s.imageAlt || ""} className="lmh-anim h-full w-full object-cover" style={a("lmhKen", 0.2, 9, { ease: "ease-out" })} />
        ) : (
          <>
            {mode === "pulseRings" && <Rings ring={t.panelRing} center loop={loop} a={a} still={still} />}
            <div className="lmh-anim absolute" style={{ width: 300, height: 300, left: "50%", top: "50%", marginLeft: -150, marginTop: -150, ...a("lmhPopSoft", base, 0.9) }}>
              <div className="lmh-anim h-full w-full rounded-full" style={{ background: big, ...float(0, 7) }} />
            </div>
            <div className="lmh-anim absolute" style={{ width: 130, height: 130, right: "10%", top: "10%", ...a("lmhPopSoft", base + 0.15, 0.9) }}>
              <div className="lmh-anim h-full w-full rounded-full" style={{ background: small, ...float(0.6, 8.5) }} />
            </div>
            <div className="lmh-anim absolute" style={{ width: 44, height: 44, left: "14%", bottom: "16%", ...a("lmhPopSoft", base + 0.3, 0.9) }}>
              <div className="lmh-anim h-full w-full rounded-full" style={{ background: dot, ...float(1.2, 6) }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   The hero component (map these props to CMS properties)
------------------------------------------------------------------- */
export function LibertyHero(props) {
  const s = { ...DEFAULTS, ...props };
  const t = THEMES[s.theme] || THEMES.yellow;
  const m = SPEED[s.speed] || 1;
  const ref = useRef(null);
  const inView = useInView(ref);
  const mode = s.animation;
  const still = mode === "static";
  const layout = mode === "splitReveal" && s.layout === "center" ? "left" : s.layout;
  const center = layout === "center";

  const a = (name, delay = 0, dur = 0.8, o = {}) =>
    still
      ? {}
      : {
          animationName: name,
          animationDuration: `${dur * m}s`,
          animationDelay: `${delay * m}s`,
          animationIterationCount: o.infinite ? "infinite" : 1,
          animationTimingFunction: o.ease || "cubic-bezier(.2,.7,.2,1)",
          animationFillMode: "both",
        };

  const segments = parseHeadline(s.headline, s.highlightText);
  const words = (s.rotatingWords || "").split(",").map((w) => w.trim()).filter(Boolean);
  const wordCount = segments.reduce(
    (n, seg) => n + (seg.type === "rotate" ? 1 : seg.text.trim().split(/\s+/).filter(Boolean).length),
    0
  );
  const shift = mode === "wordReveal" ? wordCount * 0.08 + 0.2 : 0;
  const enter = (i) => a("lmhFadeUp", i * 0.14 + (i > 1 ? shift : 0), 0.8);

  const renderHeadline = () => {
    let wi = 0;
    const reveal = mode === "wordReveal";
    const wrapWord = (w, key) => {
      const d = 0.15 + wi++ * 0.08;
      return (
        <span key={key} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: "0.1em", marginBottom: "-0.1em" }}>
          <span className="lmh-anim inline-block" style={a("lmhWord", d, 0.7)}>{w}</span>
        </span>
      );
    };
    const wrapWords = (text, kb) =>
      text.split(/(\s+)/).map((w, k) => {
        if (!w) return null;
        if (/^\s+$/.test(w)) return " ";
        return wrapWord(w, `${kb}-${k}`);
      });

    return segments.map((seg, i) => {
      if (seg.type === "rotate") {
        if (reveal) return wrapWord(words[0] || "", `r${i}`);
        if (mode === "rotatingWords")
          return <RotatingWord key={i} words={words} m={m} color={t.heading} underline={t.mark} active={inView} loop={s.loop} />;
        return <span key={i}>{words[0] || ""}</span>;
      }
      if (seg.type === "hl")
        return (
          <Highlight key={i} t={t} sweepStyle={mode === "highlightSweep" ? a("lmhSweep", 0.7, 0.7) : null}>
            {reveal ? wrapWords(seg.text, `h${i}`) : seg.text}
          </Highlight>
        );
      return <React.Fragment key={i}>{reveal ? wrapWords(seg.text, `t${i}`) : seg.text}</React.Fragment>;
    });
  };

  const showViolator = s.showViolator && s.theme !== "yellow" && s.violatorText;

  const textBlock = (
    <div
      className={`relative z-10 flex w-full flex-col gap-5 ${center ? "mx-auto max-w-3xl items-center text-center" : "max-w-2xl items-start"} ${
        mode === "splitReveal" && layout === "left" ? "md:max-w-[52%]" : ""
      }`}
    >
      {s.eyebrow && (
        <p className="lmh-anim text-base font-semibold" style={{ color: t.eyebrow, ...enter(0) }}>
          {s.eyebrow}
        </p>
      )}
      <h1
        className={`text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl ${mode === "wordReveal" ? "" : "lmh-anim"}`}
        style={{ color: t.heading, ...(mode === "wordReveal" ? {} : enter(1)) }}
      >
        {renderHeadline()}
      </h1>
      {s.subhead && (
        <p className="lmh-anim max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: t.body, ...enter(2) }}>
          {s.subhead}
        </p>
      )}
      <div className={`flex flex-wrap items-center gap-5 pt-2 ${center ? "justify-center" : ""}`}>
        <Ctas s={s} style={enter(3)} />
        {showViolator && (
          <span
            className="lmh-anim inline-flex shrink-0 items-center justify-center rounded-full text-center text-sm font-bold leading-tight"
            style={{ width: 96, height: 96, padding: 12, background: C.teal, color: C.blue, ...a("lmhPop", 0.75 + shift, 0.6) }}
          >
            {s.violatorText}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section
      ref={ref}
      className={`lmh relative w-full overflow-hidden ${inView ? "" : "lmh-paused"}`}
      style={{ background: t.bg, minHeight: HEIGHTS[s.height], fontFamily: FONT }}
    >
      <style>{CSS}</style>

      {layout !== "split" && (
        <>
          {mode === "splitReveal" && layout === "left" && (
            <div
              aria-hidden
              className="lmh-anim absolute inset-y-0 right-0 hidden w-[40%] rounded-l-[64px] md:block"
              style={{ background: t.panel, ...a("lmhPanel", 0, 1) }}
            >
              <div
                className="lmh-anim absolute rounded-full"
                style={{ width: 200, height: 200, left: "50%", top: "50%", marginLeft: -100, marginTop: -100, background: t.panelShapes[0], ...a("lmhPopSoft", 0.6, 0.8) }}
              />
            </div>
          )}
          {mode === "pulseRings" && <Rings ring={t.ring} dot={center ? null : t.dot} center={center} loop={s.loop} a={a} still={still} />}
          {s.showShapes && mode !== "splitReveal" && mode !== "pulseRings" && <Shapes t={t} layout={layout} loop={s.loop} a={a} />}
        </>
      )}

      {layout === "split" ? (
        <div className="relative grid md:grid-cols-2" style={{ minHeight: HEIGHTS[s.height] }}>
          <div className="flex items-center px-6 py-14 md:px-12 lg:px-16">{textBlock}</div>
          <MediaPanel t={t} s={s} mode={mode} loop={s.loop} a={a} still={still} />
        </div>
      ) : (
        <div className="relative flex w-full items-center px-6 py-16 md:px-12 lg:px-20" style={{ minHeight: HEIGHTS[s.height] }}>
          {textBlock}
        </div>
      )}
    </section>
  );
}

/* ==================================================================
   LibPulseRingsHero: renderer for the CMS content type
   Props use the CMS property names (what Optimizely Graph returns).
   The CMS can't store default values, so they are applied here.
================================================================== */
const CMS_DEFAULTS = {
  Theme: "blue",
  ResponsiveLayout: "center",
  ResponsiveHeight: "medium",
  AnimationSpeed: "normal",
  LoopAmbientMotion: true,
  ShowViolator: false,
  BlockSpacing: "md",
};
const SPACING = { none: 0, sm: 24, md: 48, lg: 80 };

// Editors can type a URL or pick a page. The typed URL wins, as the field help says.
// Graph returns a picked link as { url: { default } }; adjust here if your schema differs.
const pickHref = (typed, picked) =>
  (typed && typed.trim()) || picked?.url?.default || picked?.default || (typeof picked === "string" ? picked : "") || "";

// Image reference from Graph: { url: { default } } or a plain URL string.
const pickImage = (img) => (typeof img === "string" ? img : img?.url?.default || "");

export function LibPulseRingsHero(props) {
  const p = {};
  Object.keys(CMS_DEFAULTS).forEach((k) => {
    p[k] = props[k] === undefined || props[k] === null || props[k] === "" ? CMS_DEFAULTS[k] : props[k];
  });
  return (
    <div style={{ marginTop: SPACING[p.BlockSpacing] ?? SPACING.md }}>
      <LibertyHero
        animation="pulseRings"
        theme={p.Theme}
        layout={p.ResponsiveLayout}
        height={p.ResponsiveHeight}
        speed={p.AnimationSpeed}
        loop={!!p.LoopAmbientMotion}
        showShapes={false}
        showViolator={!!p.ShowViolator}
        violatorText={props.ViolatorText || ""}
        eyebrow={props.Eyebrow || ""}
        headline={props.Headline || ""}
        highlightText={props.HighlightText || ""}
        subhead={props.Subhead || ""}
        primaryCta={props.PrimaryLabel || ""}
        primaryLink={pickHref(props.PrimaryLinkUrl, props.PrimaryLink)}
        secondaryCta={props.SecondaryLabel || ""}
        secondaryLink={pickHref(props.SecondaryLinkUrl, props.SecondaryLink)}
        imageUrl={pickImage(props.Image)}
        imageAlt={props.ImageAlt || ""}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
   Preview: the first content item, plus the editor settings
------------------------------------------------------------------- */
const ITEM = {
  Eyebrow: "Auto insurance",
  Headline: "Protection for the people you love.",
  HighlightText: "people you love",
  Subhead: "Customize your auto policy so you only pay for what you need.",
  PrimaryLabel: "Get a quote",
  PrimaryLinkUrl: "/auto-insurance/quote",
  SecondaryLabel: "Explore coverage",
  SecondaryLinkUrl: "/auto-insurance",
  ShowViolator: true,
  ViolatorText: "Customize today",
  Theme: "blue",
  ResponsiveLayout: "center",
  ResponsiveHeight: "medium",
  AnimationSpeed: "normal",
  LoopAmbientMotion: true,
  BlockSpacing: "md",
};

const QUERY = `query LibPulseRingsHero($key: String!, $locale: Locales) {
  LibPulseRingsHero(
    where: { _metadata: { key: { eq: $key } } }
    locale: [$locale]
  ) {
    items {
      Eyebrow Headline HighlightText Subhead
      PrimaryLabel PrimaryLinkUrl PrimaryLink { url { default } }
      SecondaryLabel SecondaryLinkUrl SecondaryLink { url { default } }
      ShowViolator ViolatorText
      Theme ResponsiveLayout ResponsiveHeight AnimationSpeed
      LoopAmbientMotion BlockSpacing
      Image { url { default } } ImageAlt
    }
  }
}`;

const OPTIONS = {
  Theme: [["blue", "Liberty Blue"], ["white", "White"], ["atmospheric", "Atmospheric White"], ["yellow", "Liberty Yellow"]],
  ResponsiveLayout: [["center", "Centre"], ["left", "Left"], ["split", "Split (text and image)"]],
  ResponsiveHeight: [["compact", "Compact"], ["medium", "Medium"], ["full", "Full"]],
  AnimationSpeed: [["slow", "Slow"], ["normal", "Normal"], ["fast", "Fast"]],
  BlockSpacing: [["none", "None"], ["sm", "Small"], ["md", "Medium"], ["lg", "Large"]],
};
const LABELS = {
  Theme: "Background colour", ResponsiveLayout: "Layout", ResponsiveHeight: "Height",
  AnimationSpeed: "Animation speed", BlockSpacing: "Spacing above",
};

export default function App() {
  const [v, setV] = useState(ITEM);
  const [replay, setReplay] = useState(0);
  const [tab, setTab] = useState("preview");
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const field = "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <div className="min-h-screen bg-slate-100" style={{ fontFamily: FONT }}>
      <style>{CSS}</style>
      <header className="px-6 py-5" style={{ background: C.blue }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold" style={{ color: C.yellow }}>CONTENT TYPE: LibPulseRingsHero</p>
          <h1 className="text-2xl font-semibold text-white">Liberty: Pulse rings hero</h1>
          <p className="text-sm text-white" style={{ opacity: 0.85 }}>Renderer preview using the first content item and the editor settings.</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pt-5">
        <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
          {[["preview", "Preview"], ["graph", "Graph query & data"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className="rounded-md px-4 py-1.5 text-sm font-semibold"
              style={tab === id ? { background: C.blue, color: "#fff" } : { color: C.gray }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "preview" ? (
        <main className="mx-auto grid max-w-7xl gap-6 px-6 py-5 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold" style={{ color: C.blue }}>Editor settings</h2>
            {Object.keys(OPTIONS).map((k) => (
              <label key={k} className="block text-xs font-medium text-slate-600">
                {LABELS[k]}
                <select className={field + " mt-1"} value={v[k]} onChange={(e) => set(k)(e.target.value)}>
                  {OPTIONS[k].map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                </select>
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={v.LoopAmbientMotion} onChange={(e) => set("LoopAmbientMotion")(e.target.checked)} />
              Keep the rings pulsing
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={v.ShowViolator} onChange={(e) => set("ShowViolator")(e.target.checked)} />
              Show round badge
            </label>
            {[["Eyebrow", 60], ["Headline", 100], ["HighlightText", 60], ["Subhead", 200], ["PrimaryLabel", 40], ["SecondaryLabel", 40], ["ViolatorText", 30]].map(([k, max]) => (
              <label key={k} className="block text-xs font-medium text-slate-600">
                {k} <span className="text-slate-400">(max {max})</span>
                <input className={field + " mt-1"} maxLength={max} value={v[k] || ""} onChange={(e) => set(k)(e.target.value)} />
              </label>
            ))}
            <button onClick={() => setReplay((x) => x + 1)} className="w-full rounded-md px-3 py-2 text-sm font-semibold text-white" style={{ background: C.blue }}>
              ↻ Replay animation
            </button>
            {v.Theme === "yellow" && v.ShowViolator && (
              <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-800">The badge is hidden on Liberty Yellow, because teal can't sit on yellow online.</p>
            )}
          </aside>
          <section className="overflow-hidden rounded-xl bg-white shadow-sm">
            <LibPulseRingsHero key={replay} {...v} />
          </section>
        </main>
      ) : (
        <main className="mx-auto grid max-w-7xl gap-6 px-6 py-5 lg:grid-cols-2">
          <div>
            <h2 className="mb-2 text-sm font-semibold" style={{ color: C.blue }}>GraphQL query (check it in GraphiQL first)</h2>
            <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">{QUERY}</pre>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold" style={{ color: C.blue }}>Content item values</h2>
            <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">{JSON.stringify(v, null, 2)}</pre>
          </div>
        </main>
      )}
    </div>
  );
}
