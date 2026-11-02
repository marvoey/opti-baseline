#!/usr/bin/env node
/**
 * Analyze a public web page's structure, find its main components (header,
 * hero, content sections, footer, ...) and save one screenshot per component.
 *
 *   yarn screenshot:components
 *   yarn screenshot:components --url https://www.shutterfly.com/cards-stationery/ --out-dir screenshots/cards
 *
 * Output (in --out-dir):
 *   01-<name>.png, 02-<name>.png, ...   one image per component, in page order
 *   components.json                     the detected structure (tag, selector, size, position)
 *
 * How components are found: starting at <body>, wrapper elements that only
 * contain a single real child are looked through. Elements that are taller than
 * --max-height and contain several large children are split into those
 * children; everything else becomes a component. Hidden, fixed-position and tiny
 * elements are ignored.
 *
 * Options:
 *   --url <url>         Page to analyze (https only; default: Shutterfly cards & stationery)
 *   --out-dir <dir>     Output folder (default: screenshots/components)
 *   --max-height <px>   Split components taller than this (default: 1200)
 *   --min-height <px>   Ignore elements shorter than this (default: 60)
 *   --max <n>           Safety cap on number of components (default: 60)
 *   --scale <n>         Device pixel ratio, 1-3 (default: 2)
 *   --wait <ms>         Extra settle time after load (default: 3000)
 *   --width <px>        Viewport width (default: 1440)
 *   --height <px>       Initial viewport height (default: 900)
 */
import { chromium } from "playwright";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { expandInnerScroller, intOption, loadPage, parseHttpsUrl } from "./lib/page-capture.mjs";

const { values: opts } = parseArgs({
  options: {
    url: { type: "string", default: "https://www.shutterfly.com/cards-stationery/" },
    "out-dir": { type: "string", default: "screenshots/components" },
    "max-height": { type: "string", default: "1200" },
    "min-height": { type: "string", default: "60" },
    max: { type: "string", default: "60" },
    scale: { type: "string", default: "2" },
    wait: { type: "string", default: "3000" },
    width: { type: "string", default: "1440" },
    height: { type: "string", default: "900" },
  },
});

const target = parseHttpsUrl(opts.url);
const maxHeight = intOption("max-height", opts["max-height"], 300, 8000);
const minHeight = intOption("min-height", opts["min-height"], 10, 1000);
const maxComponents = intOption("max", opts.max, 1, 200);
const scale = intOption("scale", opts.scale, 1, 3);
const waitMs = intOption("wait", opts.wait, 0, 60_000);
const width = intOption("width", opts.width, 320, 3840);
const height = intOption("height", opts.height, 320, 2160);
const outDir = resolve(opts["out-dir"]);

/**
 * Runs inside the page. Tags every detected component with
 * data-shot-component="<index>" and returns a description of each one.
 * Text read from the page is only ever used for labels; it is sanitized
 * before it touches a filename (see slugify below).
 */
function detectComponents({ minHeight, maxHeight, maxComponents }) {
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "LINK", "META", "BR"]);
  const vw = document.documentElement.clientWidth;

  // Real, in-flow, sizeable elements only.
  const isMeaningful = (el) => {
    if (SKIP_TAGS.has(el.tagName)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    if (cs.position === "fixed" || cs.position === "sticky") return el.tagName === "HEADER" || el.tagName === "NAV";
    const r = el.getBoundingClientRect();
    return r.height >= minHeight && r.width >= vw * 0.5;
  };

  const label = (el) => {
    const aria = el.getAttribute("aria-label");
    if (aria) return aria;
    const heading = el.querySelector("h1, h2, h3");
    if (heading && heading.textContent.trim()) return heading.textContent.trim();
    if (el.id) return el.id;
    return el.tagName.toLowerCase();
  };

  const found = [];
  const visit = (el) => {
    if (found.length >= maxComponents) return;
    const kids = [...el.children].filter(isMeaningful);
    const h = el.getBoundingClientRect().height;
    // A wrapper around one real child: look through it.
    if (kids.length === 1 && kids[0].getBoundingClientRect().height >= h * 0.9) return visit(kids[0]);
    // Too tall to be one component and has parts: split into the parts.
    if (kids.length >= 2 && h > maxHeight) return kids.forEach(visit);
    if (el !== document.body && isMeaningful(el)) found.push(el);
    else kids.forEach(visit);
  };
  visit(document.body);

  return found.map((el, i) => {
    el.setAttribute("data-shot-component", String(i));
    const r = el.getBoundingClientRect();
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 4).join(" ") : "";
    return {
      index: i,
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      classes: cls || null,
      label: label(el).replace(/\s+/g, " ").slice(0, 80),
      x: Math.round(r.x),
      y: Math.round(r.y + window.scrollY),
      width: Math.round(r.width),
      height: Math.round(r.height),
      childElements: el.children.length,
      images: el.querySelectorAll("img, picture, video, svg").length,
      links: el.querySelectorAll("a").length,
    };
  });
}

/** Page text -> safe lowercase filename fragment (no path separators, no dots). */
function slugify(text) {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return slug || "component";
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await loadPage(browser, { url: target, width, height, scale, waitMs });
  await expandInnerScroller(page, width, height);

  const components = await page.evaluate(detectComponents, { minHeight, maxHeight, maxComponents });
  if (components.length === 0) throw new Error("No components detected; try a lower --min-height.");
  components.sort((a, b) => a.y - b.y || a.x - b.x);

  await mkdir(outDir, { recursive: true });
  // Remove only files this script produced earlier (NN-name.png), nothing else.
  for (const name of await readdir(outDir)) {
    if (/^\d{2}-[a-z0-9-]+\.png$/.test(name)) await rm(join(outDir, name));
  }

  const pad = Math.max(2, String(components.length).length);
  for (const [i, c] of components.entries()) {
    c.file = `${String(i + 1).padStart(pad, "0")}-${slugify(c.label)}.png`;
    // Re-selecting by the tag we set keeps this independent of page text.
    await page.locator(`[data-shot-component="${c.index}"]`).screenshot({ path: join(outDir, c.file) });
    console.log(`${c.file}  <${c.tag}> ${c.width}x${c.height} @ y=${c.y}`);
  }

  await writeFile(
    join(outDir, "components.json"),
    JSON.stringify({ url: target.href, capturedAt: new Date().toISOString(), components }, null, 2) + "\n",
  );
  console.log(`\n${components.length} components saved to ${outDir}`);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
