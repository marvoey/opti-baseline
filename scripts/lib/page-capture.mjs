/**
 * Helpers shared by the screenshot scripts (scripts/screenshot.mjs and
 * scripts/screenshot-components.mjs).
 */

// Chromium can't reliably capture images taller than this.
export const MAX_CAPTURE_HEIGHT = 16_000;

export function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

export function intOption(name, raw, min, max) {
  const n = Number.parseInt(raw, 10);
  if (!Number.isInteger(n) || n < min || n > max) fail(`--${name} must be an integer between ${min} and ${max}.`);
  return n;
}

/** Parse a CLI URL; only https is accepted. */
export function parseHttpsUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    fail("--url is not a valid URL.");
  }
  if (url.protocol !== "https:") fail("--url must use https.");
  return url;
}

/** Open `url` in a fresh page, wait for it to settle, and return the page. */
export async function loadPage(browser, { url, width, height, scale, waitMs }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
  const page = await context.newPage();
  const response = await page.goto(url.href, { waitUntil: "domcontentloaded", timeout: 60_000 });
  if (response && !response.ok()) fail(`Page responded with HTTP ${response.status()}.`);
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {}); // busy pages may never go idle
  await page.waitForTimeout(waitMs);
  return page;
}

/**
 * Some sites (including shutterfly.com) scroll inside a container such as <main>
 * while the document itself stays viewport-height, so Playwright's `fullPage`
 * sees nothing extra. Scroll that container to trigger lazy-loaded content, then
 * grow the viewport so the whole page is laid out at once (no sticky headers
 * overlapping content, and element coordinates equal page coordinates).
 */
export async function expandInnerScroller(page, width, height) {
  // Tag the tallest vertically-scrollable element so we can address it below.
  const found = await page.evaluate(() => {
    let best = null;
    for (const el of document.querySelectorAll("*")) {
      const overflowY = getComputedStyle(el).overflowY;
      const extra = el.scrollHeight - el.clientHeight;
      if ((overflowY === "auto" || overflowY === "scroll") && extra > 50 && (!best || extra > best.extra)) {
        best = { el, extra };
      }
    }
    if (best) best.el.setAttribute("data-shot-scroller", "");
    return Boolean(best);
  });
  if (!found) return; // normal page: the document itself scrolls

  const scroller = page.locator("[data-shot-scroller]");
  // Step down the container so lazy images load, then return to the top.
  for (let y = 0; ; y += height / 2) {
    const done = await scroller.evaluate((el, top) => {
      el.scrollTo(0, top);
      return top + el.clientHeight >= el.scrollHeight;
    }, y);
    await page.waitForTimeout(250);
    if (done) break;
  }
  await scroller.evaluate((el) => el.scrollTo(0, 0));
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});

  const extra = await scroller.evaluate((el) => el.scrollHeight - el.clientHeight);
  const newHeight = Math.min(height + extra, MAX_CAPTURE_HEIGHT);
  if (height + extra > MAX_CAPTURE_HEIGHT) console.warn(`Page is taller than ${MAX_CAPTURE_HEIGHT}px; capture truncated.`);
  await page.setViewportSize({ width, height: newHeight });
  await page.waitForTimeout(1000); // let layout and lazy content settle at the new size
}
