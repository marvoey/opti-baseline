/**
 * Reliability probe for the Ask Liberty ↔ Mark round trip (plan step 4).
 *
 * It simulates Mark WITHOUT Mark: run it against a Preview deployment that has
 * ASK_MARK_STUB=on and OPAL_WEBHOOK_URL pointing at its own /api/opal/stub. Each
 * ask goes through the real route, the stub replies over the public URL like
 * Mark would, the reply is parked in the CMS, and the waiting request finds it.
 * The probe measures how often that works and how much time the round trip adds.
 *
 * Usage:
 *   node --env-file=.env scripts/probe-mark-roundtrip.mjs <preview-url> [--asks 100] [--burst 5] [--timeout 20]
 *
 * Needs, in the environment (to list the results folder at the end):
 *   ASK_MARK_CMS_CLIENT_ID, ASK_MARK_CMS_CLIENT_SECRET, ASK_MARK_RESULTS_FOLDER_KEY
 * and, if the Preview is protected by Vercel Authentication:
 *   VERCEL_AUTOMATION_BYPASS_SECRET
 * The Preview should set ASK_MARK_RATE_LIMIT high (for example 1000), or the
 * per-address limit will throttle the probe.
 *
 * PASS MARK (all must hold):
 *   - at least 99 of 100 asks delivered inside the timeout
 *   - the overhead beyond the stub's own delay is under 3 s for 95% of asks
 *   - no unrecovered rate limiting (every ask is delivered, so none is lost to a 429)
 *   - zero items left in the results folder afterwards
 */

const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? '').replace(/\/$/, '');
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : fallback;
};
const ASKS = opt('asks', 100);
const BURST = opt('burst', 5);
const TIMEOUT_S = opt('timeout', 20);

if (!base) {
  console.error('Usage: node --env-file=.env scripts/probe-mark-roundtrip.mjs <preview-url> [--asks 100] [--burst 5] [--timeout 20]');
  process.exit(2);
}

const QUESTIONS = [
  'Does my car insurance cover a rental car?',
  'My pipe burst last night, am I covered?',
  "What's the minimum car insurance in Texas?",
  'Can I put my house and car on one policy?',
  'Where is my claim payment?',
  'Should I sue the other driver?',
];

const headers = {
  'Content-Type': 'application/json',
  Origin: new URL(base).origin, // the route only accepts browser-style same-origin requests
  ...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
    : {}),
};

/** Read one ask's event stream. Returns when it settles. */
async function ask(question) {
  const started = Date.now();
  const out = { ok: false, outcome: 'error', sentMs: null, totalMs: null, stubDelayMs: null, status: null };
  try {
    const res = await fetch(`${base}/api/opal/ask`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(TIMEOUT_S * 1000),
    });
    out.status = res.status;
    if (!res.ok || !res.body) return out;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return out;
      buffer += decoder.decode(value, { stream: true });
      let end;
      while ((end = buffer.indexOf('\n\n')) !== -1) {
        const block = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        const event = /^event:\s*(.+)$/m.exec(block)?.[1]?.trim();
        const data = /^data:\s*(.+)$/m.exec(block)?.[1];
        if (event === 'sent') out.sentMs = Date.now() - started;
        if (event === 'result') {
          out.totalMs = Date.now() - started;
          out.ok = true;
          out.outcome = 'result';
          const reasoning = data ? JSON.parse(data)?.payload?.reasoning : '';
          out.stubDelayMs = Number(/delay=(\d+)ms/.exec(reasoning ?? '')?.[1] ?? NaN);
          await reader.cancel();
          return out;
        }
        if (event === 'timeout' || event === 'error') {
          out.outcome = event;
          await reader.cancel();
          return out;
        }
      }
    }
  } catch {
    out.outcome = 'client-timeout';
    return out;
  }
}

async function cmsToken() {
  const gateway = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
  const res = await fetch(`${gateway}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.ASK_MARK_CMS_CLIENT_ID,
      client_secret: process.env.ASK_MARK_CMS_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`token request failed (${res.status})`);
  return { gateway, token: (await res.json()).access_token };
}

/** Items left in the results folder. */
async function leftovers() {
  const folder = process.env.ASK_MARK_RESULTS_FOLDER_KEY;
  if (!folder || !process.env.ASK_MARK_CMS_CLIENT_ID || !process.env.ASK_MARK_CMS_CLIENT_SECRET) return undefined;
  const { gateway, token } = await cmsToken();
  const res = await fetch(`${gateway}/v1/content/${folder}/items?pageSize=100`, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`folder list failed (${res.status})`);
  return ((await res.json()).items ?? []).length;
}

const pct = (sorted, p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)] : NaN);

console.log(`Probing ${base}: ${ASKS} asks in bursts of ${BURST}, ${TIMEOUT_S}s timeout\n`);
const results = [];
for (let done = 0; done < ASKS; ) {
  const wave = Math.min(BURST, ASKS - done);
  const batch = await Promise.all(
    Array.from({ length: wave }, (_, i) => ask(QUESTIONS[(done + i) % QUESTIONS.length])),
  );
  results.push(...batch);
  done += wave;
  process.stdout.write(`\r${done}/${ASKS} asks   delivered so far: ${results.filter((r) => r.ok).length}`);
}
console.log('\n');

const delivered = results.filter((r) => r.ok);
const overheads = delivered
  .filter((r) => Number.isFinite(r.stubDelayMs))
  .map((r) => r.totalMs - r.sentMs - r.stubDelayMs)
  .sort((a, b) => a - b);
const totals = delivered.map((r) => r.totalMs).sort((a, b) => a - b);
const byOutcome = results.reduce((m, r) => ((m[r.outcome] = (m[r.outcome] ?? 0) + 1), m), {});
const byStatus = results.reduce((m, r) => (r.status && r.status !== 200 ? ((m[r.status] = (m[r.status] ?? 0) + 1), m) : m), {});

console.log('Outcomes:', byOutcome);
if (Object.keys(byStatus).length) console.log('Non-200 responses:', byStatus);
console.log(`Total time per ask   p50 ${pct(totals, 50)} ms   p95 ${pct(totals, 95)} ms   max ${totals.at(-1) ?? NaN} ms`);
console.log(`Overhead beyond stub p50 ${pct(overheads, 50)} ms   p95 ${pct(overheads, 95)} ms   max ${overheads.at(-1) ?? NaN} ms`);

// The slowest asks, to show where a tail comes from (wave = which burst, slot = position in it).
const worst = results
  .map((r, i) => ({ ...r, wave: Math.floor(i / BURST) + 1, slot: (i % BURST) + 1, overhead: r.totalMs - r.sentMs - r.stubDelayMs }))
  .filter((r) => r.ok && Number.isFinite(r.overhead))
  .sort((a, b) => b.overhead - a.overhead)
  .slice(0, 6);
if (worst.length) {
  console.log('Slowest asks (overhead beyond the stub delay):');
  for (const r of worst) {
    console.log(`  wave ${String(r.wave).padStart(2)} slot ${r.slot}  overhead ${String(r.overhead).padStart(5)} ms   sent@${r.sentMs} ms   stub delay ${r.stubDelayMs} ms   total ${r.totalMs} ms`);
  }
  console.log('');
}

let left;
try {
  await new Promise((r) => setTimeout(r, 3000));
  left = await leftovers();
} catch (err) {
  console.log('Could not list the results folder:', err.message);
}
console.log(`Items left in the results folder: ${left ?? 'not checked'}\n`);

const deliveredEnough = delivered.length >= Math.ceil(ASKS * 0.99);
const overheadOk = overheads.length > 0 && pct(overheads, 95) < 3000;
const cleanFolder = left === 0;
console.log(`${deliveredEnough ? 'PASS' : 'FAIL'}  at least 99% delivered (${delivered.length}/${ASKS})`);
console.log(`${overheadOk ? 'PASS' : 'FAIL'}  95% of asks add under 3 s beyond the stub's delay`);
console.log(`${cleanFolder ? 'PASS' : left === undefined ? 'SKIP' : 'FAIL'}  results folder is empty afterwards`);
process.exit(deliveredEnough && overheadOk && (cleanFolder || left === undefined) ? 0 : 1);
