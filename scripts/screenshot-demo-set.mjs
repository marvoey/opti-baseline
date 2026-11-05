#!/usr/bin/env node
/**
 * Create the "Shutterfly demo" screenshot set listed in public/fulfillment-script.html
 * (section "Screenshot list"), using headless Chromium (Playwright).
 *
 *   yarn screenshot:demo
 *   yarn screenshot:demo --out-dir "$HOME/Desktop/Shutterfly demo"
 *
 * Files written to --out-dir:
 *   01-hero.png            top of the page: navigation + main hero banner, full width
 *   02-categories.png      the category tiles section ("Shop all cards & stationery")
 *   03-promo-band.png      one promo band further down the page
 *   04-phone-1.png         iPhone, top of the page
 *   05-phone-2.png         iPhone, middle of the page
 *   06-phone-3.png         iPhone, bottom of the page
 *   07-tablet.png          iPad, top of the page
 *   (phone/tablet images are tall: they hold whole page components and never cut one in half)
 *   design-comp-STAGED.png copy of 01 with ONE visible text change (printed when the script runs)
 *
 * The page is public and content changes with the season, so sections are found by
 * their heading text, with fallbacks. ALWAYS look at the images before the demo.
 *
 * Options:
 *   --url <url>       Page to capture (https only; default: Shutterfly cards & stationery)
 *   --out-dir <dir>   Output folder (default: screenshots/demo)
 *   --scale <n>       Desktop device pixel ratio, 1-3 (default: 2)
 *   --wait <ms>       Extra settle time after load (default: 3000)
 *   --width <px>      Desktop viewport width (default: 1440)
 *   --height <px>     Desktop viewport height (default: 900)
 */
import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { expandInnerScroller, intOption, launchBrowser, loadPage, parseHttpsUrl } from "./lib/page-capture.mjs";

const { values: opts } = parseArgs({
  options: {
    url: { type: "string", default: "https://www.shutterfly.com/cards-stationery/" },
    "out-dir": { type: "string", default: "screenshots/demo" },
    scale: { type: "string", default: "2" },
    wait: { type: "string", default: "3000" },
    width: { type: "string", default: "1440" },
    height: { type: "string", default: "900" },
  },
});

const target = parseHttpsUrl(opts.url);
const scale = intOption("scale", opts.scale, 1, 3);
const waitMs = intOption("wait", opts.wait, 0, 60_000);
const width = intOption("width", opts.width, 320, 3840);
const height = intOption("height", opts.height, 320, 2160);
const outDir = resolve(opts["out-dir"]);

// Heading text used to find each section. First match wins; the next pattern is the fallback.
const CATEGORIES_HEADINGS = [/shop all cards/i, /shop .* by (style|theme)/i];
const PROMO_HEADINGS = [/tiny prints/i, /tinsel/i, /holiday catalog/i];
// The staged comp replaces the first of these words found in a heading inside the hero region.
const STAGED_SWAPS = [
  ["holiday", "birthday"],
  ["Personalized", "Customized"],
];

// Phone/tablet images are cut only BETWEEN page components, so nothing is sliced in half.
// A slice holds as many whole components as fit in this height (CSS px); a single
// component taller than this is kept whole, up to MAX_SINGLE_COMPONENT.
const SLICE_HEIGHT = 1800;
const MAX_SINGLE_COMPONENT = 4000;
const MOBILE_SCALE = 2; // 3x phone screenshots get huge; 2x is still sharp

const browser = await launchBrowser(chromium);
try {
  await mkdir(outDir, { recursive: true });
  await captureDesktop();
  await captureMobile("iPhone 15", "phone");
  await captureMobile("iPad (gen 7)", "tablet");
  console.log(`\nDone. Review the images in ${outDir}`);
} finally {
  await browser.close();
}

async function captureDesktop() {
  const page = await loadPage(browser, { url: target, width, height, scale, waitMs });
  await clearOverlays(page);
  await expandInnerScroller(page, width, height); // whole page laid out, coordinates = page coordinates

  const hero = await page.evaluate(() => {
    const el = document.querySelector(".sfly-lib-hero-container");
    return el ? Math.round(el.getBoundingClientRect().bottom + scrollY) : null;
  });
  // Region 01 = very top of the page down to the bottom of the first hero banner.
  await clip(page, "01-hero.png", { x: 0, y: 0, width, height: Math.min(hero ?? 1050, 2000) });

  const categories = await sectionBox(page, CATEGORIES_HEADINGS);
  if (categories) await clip(page, "02-categories.png", categories);
  else console.warn("! 02-categories.png skipped: no category section found. Capture it by hand.");

  const promo = (await sectionBox(page, PROMO_HEADINGS)) ?? (await secondHeroBox(page));
  if (promo) await clip(page, "03-promo-band.png", promo);
  else console.warn("! 03-promo-band.png skipped: no promo band found. Capture it by hand.");

  // Staged comp: change ONE word on this throwaway local copy of the page, then re-shoot region 01.
  const change = await page.evaluate(
    ({ swaps, limit }) => {
      const headings = [...document.querySelectorAll("h1, h2, h3")].filter((h) => h.getBoundingClientRect().bottom + scrollY <= limit);
      for (const [from, to] of swaps) {
        for (const h of headings) {
          const node = [...h.childNodes].find((n) => n.nodeType === 3 && n.textContent.toLowerCase().includes(from.toLowerCase()));
          if (!node) continue;
          const before = node.textContent;
          node.textContent = before.replace(new RegExp(from, "i"), to); // textContent only; never parsed as HTML
          return { before: before.trim(), after: node.textContent.trim() };
        }
      }
      return null;
    },
    { swaps: STAGED_SWAPS, limit: hero ?? 1050 },
  );
  if (change) {
    await clip(page, "design-comp-STAGED.png", { x: 0, y: 0, width, height: Math.min(hero ?? 1050, 2000) });
    console.log(`  Staged change: "${change.before}"  ->  "${change.after}"`);
  } else {
    console.warn("! design-comp-STAGED.png skipped: no headline text to change. Edit a copy of 01-hero.png by hand.");
  }
  await page.context().close();
}

/** Phone: three images of whole components (top, middle, bottom). Tablet: one (top). */
async function captureMobile(deviceName, kind) {
  const device = devices[deviceName];
  if (!device) throw new Error(`Unknown Playwright device: ${deviceName}`);
  const { viewport, deviceScaleFactor: _native, ...contextOptions } = device;
  const page = await loadPage(browser, {
    url: target,
    width: viewport.width,
    height: viewport.height,
    scale: MOBILE_SCALE,
    waitMs,
    contextOptions,
  });
  await clearOverlays(page);

  // Find whatever scrolls (the document, or an inner container like shutterfly.com's <main>).
  await page.evaluate(() => {
    let best = document.scrollingElement;
    let bestExtra = best.scrollHeight - best.clientHeight;
    for (const el of document.querySelectorAll("*")) {
      const oy = getComputedStyle(el).overflowY;
      const extra = el.scrollHeight - el.clientHeight;
      if ((oy === "auto" || oy === "scroll") && extra > bestExtra) {
        best = el;
        bestExtra = extra;
      }
    }
    best.setAttribute("data-demo-scroller", "");
  });
  const scroller = page.locator("[data-demo-scroller]");
  const max = await scroller.evaluate((el) => el.scrollHeight - el.clientHeight);

  // Step down once so lazy images load, then return to the top and measure the components.
  for (let y = 0; y <= max; y += viewport.height / 2) {
    await scroller.evaluate((el, top) => el.scrollTo(0, top), y);
    await page.waitForTimeout(200);
  }
  await scroller.evaluate((el) => el.scrollTo(0, 0));
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(800);

  const { components, total } = await page.evaluate(detectBands, { maxHeight: SLICE_HEIGHT });
  if (components.length === 0) throw new Error(`No page components found for the ${kind} screenshots.`);

  const slices = planSlices(components, total, kind === "phone" ? 3 : 1);
  const files = kind === "phone" ? ["04-phone-1.png", "05-phone-2.png", "06-phone-3.png"] : ["07-tablet.png"];

  for (const [i, slice] of slices.entries()) {
    // Make the window exactly as tall as the slice, scroll to its top edge, take the viewport.
    await page.setViewportSize({ width: viewport.width, height: Math.ceil(slice.end - slice.start) });
    // Sticky/fixed bars (header, feedback tab) would repeat on top of later slices; hide them there.
    if (i > 0) await hideStuckElements(page);
    await scroller.evaluate((el, top) => el.scrollTo(0, top), Math.floor(slice.start));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(outDir, files[i]) });
    console.log(`Saved ${files[i]}  (page y ${Math.round(slice.start)}-${Math.round(slice.end)}, ${slice.count} components)`);
  }
  await page.context().close();
}

/**
 * Runs in the page. Returns the top-level components (full-width blocks) as vertical bands
 * measured from the top of the scrolling area, plus the total scrollable height.
 * Wrapper elements around a single child are looked through; blocks taller than
 * `maxHeight` that contain several children are split into those children.
 */
function detectBands({ maxHeight }) {
  const scroller = document.querySelector("[data-demo-scroller]");
  const isDoc = scroller === document.scrollingElement;
  const originTop = isDoc ? 0 : scroller.getBoundingClientRect().top;
  const vw = document.documentElement.clientWidth;
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "LINK", "META", "BR"]);

  const meaningful = (el) => {
    if (SKIP.has(el.tagName)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    if (cs.position === "fixed") return false;
    const r = el.getBoundingClientRect();
    return r.height >= 40 && r.width >= vw * 0.5;
  };
  const bands = [];
  const visit = (el) => {
    const kids = [...el.children].filter(meaningful);
    const h = el.getBoundingClientRect().height;
    if (kids.length === 1 && kids[0].getBoundingClientRect().height >= h * 0.9) return visit(kids[0]);
    if (kids.length >= 2 && h > maxHeight) return kids.forEach(visit);
    if (el !== document.body && el !== scroller && meaningful(el)) {
      const r = el.getBoundingClientRect();
      bands.push({ top: r.top - originTop + scroller.scrollTop, bottom: r.bottom - originTop + scroller.scrollTop });
    } else kids.forEach(visit);
  };
  visit(scroller === document.scrollingElement ? document.body : scroller);
  bands.sort((a, b) => a.top - b.top);
  return { components: bands, total: scroller.scrollHeight };
}

/**
 * Choose `count` slices (top, middle, bottom) that start and end on component edges.
 * Each holds as many whole components as fit in SLICE_HEIGHT.
 */
function planSlices(bands, total, count) {
  const fits = (a, b) => b - a <= SLICE_HEIGHT;
  const forward = (i, startAt) => {
    let j = i;
    while (j + 1 < bands.length && fits(startAt, bands[j + 1].bottom)) j++;
    return j;
  };
  const clamp = (a, b) => ({ start: a, end: Math.min(b, a + MAX_SINGLE_COMPONENT) });

  // Top: from the very top of the page.
  const topLast = forward(0, 0);
  const top = { ...clamp(0, bands[topLast].bottom), count: topLast + 1 };
  if (count === 1) return [top];

  // Bottom: to the very end of the page, walking backwards.
  let bi = bands.length - 1;
  while (bi - 1 > topLast && fits(bands[bi - 1].top, total)) bi--;
  const bottom = { start: Math.max(bands[bi].top, total - MAX_SINGLE_COMPONENT), end: total, count: bands.length - bi };

  // Middle: the first component at or after the page's midpoint that sits between the other two.
  const mid = total / 2;
  let mi = bands.findIndex((b, i) => i > topLast && i < bi && b.bottom > mid);
  if (mi === -1) mi = Math.min(topLast + 1, bi - 1);
  const midLast = Math.min(forward(mi, bands[mi].top), bi - 1);
  const middle = { ...clamp(bands[mi].top, bands[midLast].bottom), count: midLast - mi + 1 };
  return [top, middle, bottom];
}

/** Hide (but keep the space of) elements pinned to the screen, so they don't repeat in every slice. */
async function hideStuckElements(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const pos = getComputedStyle(el).position;
      if (pos === "fixed" || pos === "sticky") el.style.visibility = "hidden";
    }
  });
}

/**
 * Remove the cookie banner and the newsletter pop-up so they don't cover the screenshots.
 * Only affects this throwaway browser session; no consent is given and nothing is submitted.
 */
async function clearOverlays(page) {
  // Cookie banner (Transcend). Its contents are in a closed shadow root, so hide the host element.
  // Also hide the mobile "get the app" banner pinned to the bottom of the screen.
  await page.addStyleTag({ content: "#transcend-consent-manager, #smart-banner { display: none !important; }" });
  // Newsletter pop-up (Attentive iframe). It appears a few seconds after load, so wait for it.
  const dismiss = page.frameLocator('iframe[src*="attn.tv"]').getByRole("button", { name: /dismiss/i }).first();
  await dismiss.click({ timeout: 8000 }).catch(() => {}); // not shown this time: nothing to close
  await page.waitForTimeout(500);
}

async function clip(page, file, box) {
  await page.screenshot({ path: join(outDir, file), fullPage: true, clip: box });
  console.log(`Saved ${file}`);
}

/**
 * Bounding box (page coordinates) of the section whose heading matches one of `patterns`.
 * The section is the largest ancestor of the heading that still contains no other h1-h3
 * and is no wider than the viewport.
 */
async function sectionBox(page, patterns) {
  return page.evaluate((sources) => {
    const headings = [...document.querySelectorAll("h1, h2, h3")];
    for (const src of sources) {
      const re = new RegExp(src.source, src.flags);
      const h = headings.find((el) => re.test(el.textContent ?? ""));
      if (!h) continue;
      let el = h;
      while (el.parentElement && el.parentElement !== document.body) {
        const parent = el.parentElement;
        if (parent.querySelectorAll("h1, h2, h3").length > 1) break;
        if (parent.getBoundingClientRect().width > innerWidth + 1) break;
        el = parent;
      }
      const r = el.getBoundingClientRect();
      if (r.height < 60) continue;
      return { x: 0, y: Math.round(r.top + scrollY), width: innerWidth, height: Math.min(Math.round(r.height), 2000) };
    }
    return null;
  }, patterns.map((re) => ({ source: re.source, flags: re.flags })));
}

/** Fallback promo band: the second full-width hero container on the page. */
async function secondHeroBox(page) {
  return page.evaluate(() => {
    const el = document.querySelectorAll(".sfly-lib-hero-container")[1];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: 0, y: Math.round(r.top + scrollY), width: innerWidth, height: Math.round(r.height) };
  });
}
