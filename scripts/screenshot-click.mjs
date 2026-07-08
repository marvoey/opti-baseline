import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url       = process.argv[2];
const selector  = process.argv[3];
const outName   = process.argv[4];
const waitMs    = parseInt(process.argv[5] ?? '5000', 10);

if (!url || !selector) {
  console.error('Usage: node scripts/screenshot-click.mjs <url> <selector> [output-name] [wait-ms]');
  console.error('Example: node scripts/screenshot-click.mjs http://localhost:3000/kb "button.search-btn" kb-after-click 5000');
  process.exit(1);
}

const outDir = join(dirname(__dirname), 'public', 'screenshots');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const slug = outName ?? (() => {
  const parsed = new URL(url);
  return ((parsed.pathname + parsed.search)
    .replace(/^\//, '')
    .replace(/[/?=&]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'home') + '-clicked';
})();

const outPath = join(outDir, `${slug}.png`);

const CHROMIUM_PATH = '/usr/bin/chromium-browser';

const browser = await puppeteer.launch({
  executablePath: CHROMIUM_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

console.log(`Navigating to ${url} ...`);
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 });

console.log(`Clicking "${selector}" ...`);
await page.waitForSelector(selector, { timeout: 10_000 });
await page.click(selector);

// Wait for animations and deferred renders after the click
console.log(`Waiting ${waitMs}ms for content to render ...`);
await new Promise(r => setTimeout(r, waitMs));

// Then wait for any remaining network activity to settle
await page.waitForNetworkIdle({ idleTime: 500, timeout: 10_000 }).catch(() => {});

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
