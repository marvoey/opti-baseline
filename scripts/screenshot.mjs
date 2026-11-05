#!/usr/bin/env node
/**
 * Take a screenshot of a public web page with headless Chromium (Playwright).
 *
 *   yarn screenshot
 *   yarn screenshot --full-page
 *   yarn screenshot --url https://www.shutterfly.com/cards-stationery/ --out screenshots/cards.png --full-page
 *
 * With --full-page the page is split into several sharp, evenly sized images
 * (cards-01.png, cards-02.png, ...) instead of one huge, downscaled one.
 * To capture individual page components instead, see screenshot-components.mjs.
 *
 * Options:
 *   --url <url>          Page to capture (https only; default: Shutterfly cards & stationery)
 *   --out <file>         Output PNG path; with --full-page used as a prefix (default: screenshots/shutterfly-cards-stationery.png)
 *   --full-page          Capture the whole page, split into slices
 *   --slice-height <px>  Height of each slice in CSS pixels (default: 1800)
 *   --scale <n>          Device pixel ratio, 1-3; 2 = retina-sharp (default: 2)
 *   --wait <ms>          Extra settle time after load for lazy content (default: 3000)
 *   --width <px>         Viewport width (default: 1440)
 *   --height <px>        Viewport height (default: 900)
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parseArgs } from "node:util";
import { expandInnerScroller, intOption, launchBrowser, loadPage, parseHttpsUrl } from "./lib/page-capture.mjs";

const { values: opts } = parseArgs({
  options: {
    url: { type: "string", default: "https://www.shutterfly.com/cards-stationery/" },
    out: { type: "string", default: "screenshots/shutterfly-cards-stationery.png" },
    "full-page": { type: "boolean", default: false },
    "slice-height": { type: "string", default: "1800" },
    scale: { type: "string", default: "2" },
    wait: { type: "string", default: "3000" },
    width: { type: "string", default: "1440" },
    height: { type: "string", default: "900" },
  },
});

const target = parseHttpsUrl(opts.url);
const waitMs = intOption("wait", opts.wait, 0, 60_000);
const width = intOption("width", opts.width, 320, 3840);
const height = intOption("height", opts.height, 320, 2160);
const sliceHeight = intOption("slice-height", opts["slice-height"], 400, 4000);
const scale = intOption("scale", opts.scale, 1, 3);
const out = resolve(opts.out);

const browser = await launchBrowser(chromium);
try {
  const page = await loadPage(browser, { url: target, width, height, scale, waitMs });

  if (opts["full-page"]) await expandInnerScroller(page, width, height);

  await mkdir(dirname(out), { recursive: true });
  if (!opts["full-page"]) {
    await page.screenshot({ path: out });
    console.log(`Saved ${out}`);
  } else {
    const total = await page.evaluate(() =>
      Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
    );
    const count = Math.ceil(total / sliceHeight);
    const base = out.replace(/\.png$/i, "");
    for (let i = 0; i < count; i++) {
      const y = i * sliceHeight;
      const file = count === 1 ? out : `${base}-${String(i + 1).padStart(2, "0")}.png`;
      await page.screenshot({
        path: file,
        fullPage: true, // lets the clip extend past the viewport
        clip: { x: 0, y, width, height: Math.min(sliceHeight, total - y) },
      });
      console.log(`Saved ${file}`);
    }
  }
} finally {
  await browser.close();
}
