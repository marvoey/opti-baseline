/**
 * Shared helpers for the screenshot scripts (screenshot.mjs, screenshot-components.mjs,
 * screenshot-demo-set.mjs).
 */
import { isIP } from "node:net";

/**
 * Parse and validate a target URL. Only public https:// pages are accepted:
 * no credentials in the URL, no localhost / internal hostnames, no raw IP addresses.
 * @param {string} value
 * @returns {URL}
 */
export function parseHttpsUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid URL: ${JSON.stringify(value)}`);
  }
  if (url.protocol !== "https:") throw new Error("Only https:// URLs are allowed.");
  if (url.username || url.password) throw new Error("URLs with embedded credentials are not allowed.");

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const internal = host === "localhost" || /\.(local|localhost|internal|lan|home|corp)$/.test(host) || !host.includes(".");
  if (internal || isIP(host)) throw new Error("Only public hostnames are allowed (no localhost, internal names or IP addresses).");
  return url;
}

/**
 * Parse an integer CLI option and enforce an inclusive range.
 * @param {string} name   option name, used in the error message
 * @param {string|number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function intOption(name, value, min, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(`--${name} must be a whole number between ${min} and ${max} (got ${JSON.stringify(value)}).`);
  }
  return n;
}

/**
 * Launch headless Chromium. HTTP/2 is turned off because some sites (opentable.com from
 * this network) reset HTTP/2 streams with ERR_HTTP2_PROTOCOL_ERROR but serve HTTP/1.1 fine.
 * @param {import("playwright").BrowserType} chromium
 */
export function launchBrowser(chromium) {
  return chromium.launch({ headless: true, args: ["--disable-http2"] });
}

/**
 * Open a page in a fresh, isolated browser context and wait for it to settle.
 * @param {import("playwright").Browser} browser
 * @param {{ url: URL, width: number, height: number, scale: number, waitMs: number, contextOptions?: object }} options
 * @returns {Promise<import("playwright").Page>}
 */
export async function loadPage(browser, { url, width, height, scale, waitMs, contextOptions = {} }) {
  const context = await browser.newContext({
    ...contextOptions,
    viewport: { width, height },
    deviceScaleFactor: scale,
  });
  const page = await context.newPage();
  await page.goto(url.href, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForLoadState("load", { timeout: 15_000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {}); // busy pages never go idle: fine
  await page.waitForTimeout(waitMs);
  return page;
}

/**
 * Make the whole page measurable in page coordinates:
 *  1. scroll down in steps so lazy-loaded images and sections render, then back to the top;
 *  2. if the page scrolls inside an inner container (not the document), un-clip that container
 *     so the document itself becomes full height.
 * @param {import("playwright").Page} page
 * @param {number} width
 * @param {number} height
 */
export async function expandInnerScroller(page, width, height) {
  const step = Math.max(200, Math.floor(height / 2));

  // Mark whatever scrolls the most (document or an inner element).
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
    best.setAttribute("data-capture-scroller", "");
  });
  const scroller = page.locator("[data-capture-scroller]");

  const max = await scroller.evaluate((el) => el.scrollHeight - el.clientHeight);
  for (let y = 0; y <= max && y <= 60_000; y += step) {
    await scroller.evaluate((el, top) => el.scrollTo(0, top), y);
    await page.waitForTimeout(150);
  }
  await scroller.evaluate((el) => el.scrollTo(0, 0));
  await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});

  const isInner = await scroller.evaluate((el) => el !== document.scrollingElement);
  if (isInner) {
    await scroller.evaluate((el) => {
      for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
        node.style.setProperty("height", "auto", "important");
        node.style.setProperty("max-height", "none", "important");
        node.style.setProperty("overflow", "visible", "important");
      }
      document.documentElement.style.setProperty("height", "auto", "important");
    });
  }
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(500);
}
