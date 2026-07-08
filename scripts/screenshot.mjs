import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/screenshot.mjs <url>');
  console.error('Example: node scripts/screenshot.mjs http://localhost:3000/kb');
  process.exit(1);
}

// Derive a filename from the URL path + query string
const parsed = new URL(url);
const slug = (parsed.pathname + parsed.search)
  .replace(/^\//, '')
  .replace(/[/?=&]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '') || 'home';

const outDir = join(dirname(__dirname), 'public', 'screenshots');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
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

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
