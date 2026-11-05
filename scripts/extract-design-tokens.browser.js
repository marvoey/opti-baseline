/**
 * Browser-console helper: extracts design tokens from a web page.
 *
 * NOT run by Node or the build. Paste it into the DevTools Console of the page
 * you want to inspect (e.g. an OpenTable restaurant-solutions page, window ~1440px wide).
 *
 *   1. Open the page in Chrome, press F12, go to the Console tab.
 *   2. Paste this whole file and press Enter (Chrome may ask you to type "allow pasting").
 *   3. The JSON is printed and copied to the clipboard. If copy() fails, right-click
 *      the printed object and choose "Copy object".
 *
 * Read-only: it only reads computed styles already on the page. It makes no network
 * calls and does not modify the page.
 */
(() => {
  const TRANSPARENT = /^rgba\(\s*0,\s*0,\s*0,\s*0\s*\)$|^transparent$/;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // Real background: first non-transparent background walking up the tree.
  const effBg = (el) => {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const bg = getComputedStyle(e).backgroundColor;
      if (!TRANSPARENT.test(bg)) return bg;
    }
    return 'rgb(255, 255, 255) (default)';
  };
  const pick = (el) => {
    if (!el) return null;
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: String(el.className).slice(0, 80),
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      font: c.fontFamily.split(',')[0],
      size: c.fontSize,
      weight: c.fontWeight,
      lh: c.lineHeight,
      ls: c.letterSpacing,
      tt: c.textTransform,
      td: c.textDecorationLine,
      color: c.color,
      bg: c.backgroundColor,
      effBg: effBg(el),
      bgImg: c.backgroundImage.slice(0, 120),
      radius: c.borderRadius,
      border: c.border,
      shadow: c.boxShadow,
      pad: c.padding,
      transition: c.transition.slice(0, 80),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  };
  const all = (sel, n = 3) =>
    [...document.querySelectorAll(sel)].filter(visible).slice(0, n).map(pick);

  // Custom properties from ANY rule (not just :root), colour/size/font related only.
  const vars = {};
  const VAR_NAME = /color|colour|bg|brand|accent|primary|secondary|radius|shadow|space|spacing|font|container|width|cream|ink|dark|light/i;
  for (const s of document.styleSheets) {
    try {
      for (const r of s.cssRules) {
        if (!r.style) continue;
        for (const n of r.style) {
          if (n.startsWith('--') && VAR_NAME.test(n) && Object.keys(vars).length < 200) {
            const key = r.selectorText === ':root' ? n : `${n} @ ${String(r.selectorText).slice(0, 40)}`;
            vars[key] = r.style.getPropertyValue(n).trim().slice(0, 80);
          }
        }
      }
    } catch {
      /* cross-origin stylesheet: ignore */
    }
  }

  // Large blocks: which background colours dominate the page, and where.
  const bands = [];
  for (const e of document.querySelectorAll('body section, body main > *, body footer, body header')) {
    const r = e.getBoundingClientRect();
    if (r.width < 600 || r.height < 120) continue;
    const c = getComputedStyle(e);
    bands.push({
      cls: String(e.className).slice(0, 60),
      top: Math.round(r.top + scrollY),
      h: Math.round(r.height),
      bg: c.backgroundColor,
      effBg: effBg(e),
      bgImg: c.backgroundImage.slice(0, 80),
      pt: c.paddingTop,
      pb: c.paddingBottom,
      maxw: c.maxWidth,
    });
  }

  // Text colour census (what colours text actually uses).
  const census = {};
  for (const e of [...document.querySelectorAll('h1,h2,h3,h4,p,li,a,span')].filter(visible).slice(0, 1500)) {
    const k = getComputedStyle(e).color + ' on ' + effBg(e);
    census[k] = (census[k] || 0) + 1;
  }
  const colorPairs = Object.entries(census).sort((a, b) => b[1] - a[1]).slice(0, 15);

  // Centered content containers (max-width / gutters).
  const containers = [...document.querySelectorAll('[class*=container i],[class*=content-section],[class*=wrapper i],[class*=inner i]')]
    .filter(visible)
    .slice(0, 10)
    .map((e) => {
      const c = getComputedStyle(e);
      return { cls: String(e.className).slice(0, 50), w: Math.round(e.getBoundingClientRect().width), maxw: c.maxWidth, pl: c.paddingLeft, pr: c.paddingRight };
    });

  const CTA_TEXT = /demo|get started|contact|book|try|learn|request|sign|watch|talk|see |start|join|pricing/i;
  const ctas = [...document.querySelectorAll('a,button')]
    .filter((e) => visible(e) && (CTA_TEXT.test(e.textContent || '') || /cta|btn|button/i.test(String(e.className))))
    .slice(0, 14)
    .map(pick);

  const out = {
    url: location.href,
    viewport: innerWidth,
    vars,
    fonts: [...document.fonts]
      .map((f) => f.family + ' ' + f.weight)
      .filter((v, i, a) => a.indexOf(v) === i),
    body: pick(document.body),
    h1: all('h1', 1),
    h2: all('h2', 4),
    h3: all('h3', 3),
    h4: all('h4', 2),
    p: all('p', 4),
    eyebrows: all('[class*=eyebrow i],[class*=overline i],[class*=h-small],[class*=kicker i]', 3),
    ctas,
    cards: all('[class*=card i]', 4),
    header: all('header', 1),
    footer: all('footer, [class*=footer i]', 3),
    containers,
    bands,
    colorPairs,
    images: all('img', 4).map((i) => ({ radius: i.radius, shadow: i.shadow, w: i.w, h: i.h })),
  };

  const json = JSON.stringify(out, null, 1);
  console.log(json);
  let copied = false;
  try {
    copy(json); // DevTools-only helper
    copied = true;
  } catch {
    /* not available outside DevTools */
  }
  // The console echoes the return value, so this replaces a confusing "undefined".
  return copied
    ? `Done: ${json.length} characters copied to the clipboard (also printed above).`
    : `Done: ${json.length} characters printed above. Copy failed: right-click the object and choose "Copy object".`;
})();
