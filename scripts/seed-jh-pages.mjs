/**
 * Seed the three JH "target webpages" as CMS experiences at their real paths:
 *   /file-taxes-options-products/file-taxes-online
 *   /tax-help/tax-tips-topics/filing-your-taxes
 *   /refund-advance
 *
 * Nested URLs need parent items, so each path's ancestors are created as small
 * BlankExperience pages. Keys are derived from the path (sha1 → 32 hex), so the
 * script is idempotent: existing pages are skipped and only published if needed.
 * Copy is original (same structure as the live pages, paraphrased wording).
 *
 * Prerequisites: `yarn cms:push:all` (Jh* block types) and HOME_PAGE_CONTENT_ID in .env.
 *
 * Usage:
 *   node --env-file=.env scripts/seed-jh-pages.mjs [--dry] [--no-publish]
 */

import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const NO_PUBLISH = process.argv.includes('--no-publish');

if (
  (!process.env.OPTIMIZELY_CMS_CLIENT_ID || !process.env.OPTIMIZELY_CMS_CLIENT_SECRET) &&
  typeof process.loadEnvFile === 'function'
) {
  try { process.loadEnvFile(join(ROOT, '.env')); } catch { /* no .env, continue */ }
}

const { OPTIMIZELY_CMS_CLIENT_ID, OPTIMIZELY_CMS_CLIENT_SECRET } = process.env;
const GATEWAY = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
const LOCALE = process.env.OPTIMIZELY_DEFAULT_LOCALE || 'en';
// The REST API only accepts content keys as 32 hex chars (no hyphens).
const HOME = process.env.HOME_PAGE_CONTENT_ID?.replace(/-/g, '');

// ── Helpers (same shapes as seed-jh-demo.mjs) ─────────────────────────────────
const props = (obj) => Object.fromEntries(Object.entries(obj).map(([k, value]) => [k, { value }]));

/** Flatten [{Title, Text}, …] into Card1Title, Card1Text, … */
const numbered = (prefix, items) =>
  Object.fromEntries(items.flatMap((item, i) => Object.entries(item).map(([k, v]) => [`${prefix}${i + 1}${k}`, v])));

const block = (displayName, contentType, properties) => ({
  displayName: `${displayName} Section`,
  nodeType: 'section',
  layoutType: 'grid',
  displaySettings: {
    displayTemplate: 'BlankSectionDefault',
    settings: { background: 'white', padding: 'none', width: 'full' },
  },
  component: { contentType: 'BlankSection' },
  nodes: [
    {
      displayName: 'Row',
      nodeType: 'row',
      displaySettings: { displayTemplate: 'DefaultRow', settings: { columns: 'c1' } },
      nodes: [
        {
          displayName: 'Column',
          nodeType: 'column',
          displaySettings: { displayTemplate: 'DefaultColumn', settings: { weight: 'w4' } },
          nodes: [{ displayName, nodeType: 'component', component: { contentType, properties: props(properties) } }],
        },
      ],
    },
  ],
});

const hero = (p) => block('Page Hero', 'JhPageHero', p);
const features = (p, items) => block('Feature List', 'JhFeatureList', { ...p, ...numbered('Item', items) });
const steps = (p, items) => block('Step List', 'JhStepList', { ...p, ...numbered('Step', items) });
const cards = (p, items) => block('Card Grid', 'JhCardGrid', { ...p, ...numbered('Card', items) });
const faq = (p, items) => block('FAQ', 'JhFaqAccordion', { ...p, ...numbered('Faq', items) });
const promo = (p) => block('Promo Banner', 'JhPromoBanner', p);
const articles = (p, items) => block('Article List', 'JhArticleList', { ...p, ...numbered('Article', items) });
const disclosure = (p) => block('Disclosure', 'JhDisclosure', p);

// ── Shared copy ───────────────────────────────────────────────────────────────
const LOAN_DISCLOSURE = disclosure({
  Title: 'Early Tax Refund Advance disclosure',
  Body:
    'Refund Advance loans are offered in amounts from $300 to $1,500, subject to lender approval and eligibility requirements. A finance charge may apply depending on your state. Funding times vary by lender and by how you choose to receive your funds.\n\n' +
    'Loans are made by a third-party lender; Jackson Hewitt acts as a loan broker. This is demo content created for an Optimizely demonstration and is not an offer of credit.',
});

// ── Pages ─────────────────────────────────────────────────────────────────────
const PAGES = [
  {
    path: 'file-taxes-options-products',
    name: 'Ways to File',
    blocks: [
      hero({
        Breadcrumb: 'Home > Ways to File',
        Headline: 'Choose how you want to file',
        Intro: 'Work with a Tax Pro in an office or inside Walmart, or file on your own online.',
      }),
    ],
  },
  {
    path: 'file-taxes-options-products/file-taxes-online',
    name: 'File Taxes Online',
    blocks: [
      hero({
        Breadcrumb: 'Home > Ways to File > File Taxes Online',
        Headline: 'File your federal and state taxes online for one flat $25',
        Intro: 'One simple price, plain-language guidance, and our promise of your biggest refund.',
        PrimaryCtaLabel: 'Start a new return',
        PrimaryCtaHref: '#start',
        SecondaryCtaLabel: 'Log in to continue',
        SecondaryCtaHref: '#login',
      }),
      features({ Title: 'Everything you need to file with confidence' }, [
        { Title: 'Guided, step by step', Text: 'Answer simple questions and get live chat help whenever you are stuck.' },
        { Title: 'Works on any device', Text: 'Start on your phone and finish on your laptop without losing progress.' },
        { Title: 'Import your W-2', Text: 'Snap a photo or import it directly to skip the typing.' },
        { Title: 'Automatic error checks', Text: 'We review your return before you submit so small mistakes do not slow your refund.' },
        { Title: 'One flat $25 fee', Text: 'Federal and state filing for one price, however complex your return is.' },
      ]),
      steps(
        { Title: 'How online filing works', CtaLabel: 'Get started', CtaHref: '#start' },
        [
          { Title: 'Create your account', Text: 'Set up a free account in a couple of minutes.' },
          { Title: 'Gather your documents', Text: 'Use our checklist to collect W-2s, 1099s, and last year’s return.' },
          { Title: 'Review and submit', Text: 'Check the summary, e-file securely, and track your refund.' },
        ],
      ),
      cards({ Title: 'Built for the way you earn', Intro: 'Whatever your situation, one price covers it.' }, [
        { Title: 'Hourly and salaried workers', Text: 'Import your W-2 and be done in minutes.' },
        { Title: 'Gig and 1099 earners', Text: 'Track income and deductions for side work without extra fees.' },
        { Title: 'Families with dependents', Text: 'Claim the credits your household may qualify for.' },
        { Title: 'Students', Text: 'Handle education credits and part-time income with ease.' },
        { Title: 'Multi-state filers', Text: 'File in more than one state at no extra charge.' },
      ]),
      cards({ Title: 'Our guarantees' }, [
        { Title: 'Your data is protected', Text: 'Bank-level encryption and secure sign-in safeguard your information.' },
        { Title: 'Maximum refund', Text: 'We work to find every deduction and credit you are entitled to.' },
        { Title: 'Accurate returns', Text: 'If we make a calculation error that costs you, we will make it right.' },
      ]),
      promo({
        Heading: 'Not satisfied? Get your preparation fees back.',
        Text: 'Terms and eligibility apply. See guarantee details below.',
        Tone: 'gold',
      }),
      cards({ Title: 'Helpful tools and resources' }, [
        { Title: 'Supported tax forms', Text: 'See which forms and schedules you can file online.', LinkLabel: 'View forms', LinkHref: '#' },
        { Title: 'Tax calculators', Text: 'Estimate your refund and your withholding.', LinkLabel: 'Open tools', LinkHref: '#' },
        { Title: 'Document checklist', Text: 'Get a personalized list of what to gather.', LinkLabel: 'Build my list', LinkHref: '#' },
      ]),
      promo({
        Heading: 'Prefer to sit down with an expert?',
        Text: 'Tax Pros are available in offices and inside Walmart.',
        CtaLabel: 'Find a location',
        CtaHref: '#',
      }),
      faq({ Title: 'Frequently asked questions' }, [
        { Question: 'How do I create an account?', Answer: 'Choose “Start a new return,” enter your email, and set a password. It takes a couple of minutes.' },
        { Question: 'Is my state return really included?', Answer: 'Yes. The flat fee covers your federal return and your state return.' },
        { Question: 'How can I pay for my return?', Answer: 'You can pay by card or have the fee taken out of your refund, where available.' },
        { Question: 'How do I check my refund status?', Answer: 'Log in and open your return summary, or use the refund tracker after you file.' },
        { Question: 'I forgot my password. What now?', Answer: 'Use “Forgot password” on the login page and follow the emailed link.' },
        { Question: 'Can I file a prior-year return?', Answer: 'Prior-year availability depends on the tax year. Check the supported years when you start.' },
        { Question: 'When can I start filing?', Answer: 'Filing opens once the IRS begins accepting returns for the season. We will notify you.' },
        { Question: 'Can I file an extension?', Answer: 'Yes. An extension gives you more time to file, but not more time to pay any tax owed.' },
        { Question: 'Where do I find my prior-year AGI?', Answer: 'It appears on last year’s return. If you do not have it, request a transcript from the IRS.' },
      ]),
      disclosure({
        Title: 'Guarantee terms',
        Body:
          'Maximum Refund, Satisfaction, Accuracy, and Transparent Pricing guarantees are subject to terms, eligibility, and exclusions. Add-on services are priced separately.\n\n' +
          'Demo content created for an Optimizely demonstration; wording is illustrative.',
      }),
      LOAN_DISCLOSURE,
    ],
  },
  { path: 'tax-help', name: 'Tax Help', blocks: [hero({ Breadcrumb: 'Home > Tax Help', Headline: 'Tax help and guidance' })] },
  {
    path: 'tax-help/tax-tips-topics',
    name: 'Tax Tips & Topics',
    blocks: [hero({ Breadcrumb: 'Home > Tax Help > Tax Tips & Topics', Headline: 'Tax tips and topics' })],
  },
  {
    path: 'tax-help/tax-tips-topics/filing-your-taxes',
    name: 'Filing Your Taxes',
    blocks: [
      promo({ Heading: 'Need tax help?', Text: 'Talk to a Tax Pro in an office or inside Walmart.', CtaLabel: 'Find an office', CtaHref: '#' }),
      hero({
        Breadcrumb: 'Home > Tax Help > Filing Your Taxes',
        Headline: 'Filing your taxes',
        Intro: 'Learn what you need to know before you file: deadlines, requirements, filing status, and more.',
      }),
      articles({ Title: 'Deadlines & Extensions', SeeMoreLabel: 'See more', SeeMoreHref: '#' }, [
        { Title: 'Should you file an extension?', Summary: 'What an extension does and does not do, and when it makes sense.', Author: 'Tax Pro Team', Date: 'Jan 12, 2026' },
        { Title: 'Key filing deadlines this season', Summary: 'The dates that matter for filing, paying, and amending.', Author: 'Tax Pro Team', Date: 'Jan 8, 2026' },
        { Title: 'When does the IRS start accepting returns?', Summary: 'How the opening date affects when you can file and get paid.', Author: 'Tax Pro Team', Date: 'Jan 5, 2026' },
        { Title: 'What to do if you miss the deadline', Summary: 'Steps to limit penalties and get back on track.', Author: 'Tax Pro Team', Date: 'Dec 20, 2025' },
      ]),
      articles({ Title: 'Filing Requirements & Eligibility', SeeMoreLabel: 'See more', SeeMoreHref: '#' }, [
        { Title: 'Why file even with low income?', Summary: 'Credits and refunds you can only claim by filing.', Author: 'Tax Pro Team', Date: 'Jan 10, 2026' },
        { Title: 'Do minors have to file a return?', Summary: 'Income thresholds and when a young earner should file.', Author: 'Tax Pro Team', Date: 'Dec 28, 2025' },
        { Title: 'What is an ITIN and who needs one?', Summary: 'How to apply and when it is required.', Author: 'Tax Pro Team', Date: 'Dec 15, 2025' },
        { Title: 'Benefits of filing early', Summary: 'Faster refunds and lower risk of identity theft.', Author: 'Tax Pro Team', Date: 'Dec 10, 2025' },
      ]),
      articles({ Title: 'Filing Status', SeeMoreLabel: 'See more', SeeMoreHref: '#' }, [
        { Title: 'Single', Summary: 'Who qualifies and how it affects your standard deduction.', Author: 'Tax Pro Team', Date: 'Nov 30, 2025' },
        { Title: 'Married filing jointly', Summary: 'The advantages of combining incomes and deductions.', Author: 'Tax Pro Team', Date: 'Nov 28, 2025' },
        { Title: 'Head of household', Summary: 'Requirements and the benefits over filing single.', Author: 'Tax Pro Team', Date: 'Nov 25, 2025' },
        { Title: 'How filing status affects your refund', Summary: 'A quick comparison of each status.', Author: 'Tax Pro Team', Date: 'Nov 20, 2025' },
      ]),
      articles({ Title: 'Forms & Filing Preparation', SeeMoreLabel: 'See more', SeeMoreHref: '#' }, [
        { Title: 'Understanding Form 1040', Summary: 'A walk through the main federal return.', Author: 'Tax Pro Team', Date: 'Jan 3, 2026' },
        { Title: 'Estimated tax payments explained', Summary: 'Who must pay quarterly and how to calculate it.', Author: 'Tax Pro Team', Date: 'Dec 18, 2025' },
        { Title: 'Record keeping that saves time', Summary: 'What to keep, and for how long.', Author: 'Tax Pro Team', Date: 'Dec 5, 2025' },
        { Title: 'Decoding W-2 Box 12 codes', Summary: 'What each code means for your return.', Author: 'Tax Pro Team', Date: 'Dec 1, 2025' },
      ]),
      articles({ Title: 'Tax Law & Filing Changes', SeeMoreLabel: 'See more', SeeMoreHref: '#' }, [
        { Title: 'Federal vs. state taxes', Summary: 'How the two systems differ and why you may file both.', Author: 'Tax Pro Team', Date: 'Jan 6, 2026' },
        { Title: 'New deductions to watch this season', Summary: 'Recent law changes that could lower your bill.', Author: 'Tax Pro Team', Date: 'Dec 22, 2025' },
        { Title: 'What recent tax legislation means for you', Summary: 'A plain-language summary of the big changes.', Author: 'Tax Pro Team', Date: 'Dec 12, 2025' },
      ]),
      articles({ Title: 'Taxable Income & Calculations', SeeMoreLabel: 'See more', SeeMoreHref: '#' }, [
        { Title: 'The standard deduction, explained', Summary: 'Current amounts by filing status and when to itemize instead.', Author: 'Tax Pro Team', Date: 'Jan 14, 2026' },
        { Title: 'Tax brackets made simple', Summary: 'Why moving into a higher bracket does not tax all your income at that rate.', Author: 'Tax Pro Team', Date: 'Jan 9, 2026' },
        { Title: 'AGI vs. MAGI', Summary: 'Two numbers that decide which credits you can claim.', Author: 'Tax Pro Team', Date: 'Dec 30, 2025' },
        { Title: 'Marginal vs. effective tax rate', Summary: 'Which rate actually describes what you pay.', Author: 'Tax Pro Team', Date: 'Dec 14, 2025' },
      ]),
      promo({
        Heading: 'Local offices. Walmart locations. One guarantee.',
        Text: 'Backed by decades of experience and millions of returns filed.',
        CtaLabel: 'Find a location',
        CtaHref: '#',
      }),
      LOAN_DISCLOSURE,
    ],
  },
  {
    path: 'refund-advance',
    name: 'Early Tax Refund Advance',
    blocks: [
      hero({
        Breadcrumb: 'Coming soon',
        Headline: 'Get up to $1,500 with an Early Tax Refund Advance',
        Intro: 'Cash for the holidays, borrowed against the refund you are already expecting.',
        PrimaryCtaLabel: 'Sign up for updates',
        PrimaryCtaHref: '#signup',
      }),
      cards(
        {
          Title: 'What is an Early Tax Refund Advance?',
          Intro:
            'A short-term loan against your expected IRS refund. Bring a recent paystub and a valid ID to apply in an office, subject to lender approval.',
        },
        [],
      ),
      cards({ Title: 'Why customers choose it' }, [
        { Title: 'Cash when you need it', Text: 'Get money in time for holiday shopping instead of waiting for tax season.' },
        { Title: 'Money Today Guarantee', Text: 'If you are approved and do not get your money the same day, we make it right. Terms apply.' },
        { Title: 'A simple application', Text: 'No tax documents required to apply. A recent paystub and ID are enough to start.' },
      ]),
      steps({ Title: 'How it works', CtaLabel: 'Sign up for updates', CtaHref: '#signup' }, [
        { Title: 'Bring a recent paystub', Text: 'Stop by a participating office with your paystub and ID.' },
        { Title: 'Get $300 to $1,500 if approved', Text: 'Receive your funds the same day on a prepaid card, or by direct deposit.' },
        { Title: 'Repay from your refund', Text: 'When you file your return with us, the loan is repaid automatically from your refund.' },
      ]),
      cards({ Title: '2026 season schedule' }, [
        { Title: 'Starts December 10', Text: 'Advances become available in participating offices.' },
        { Title: 'Same-day funds', Text: 'Approved customers can load funds onto a prepaid card the same day.' },
        { Title: 'Ends January 31, 2027', Text: 'Last day to apply for an Early Tax Refund Advance this season.' },
      ]),
      cards(
        { Title: 'What it costs', Intro: 'Estimates at a 35.99% APR assuming repayment in 66 days.' },
        [
          { Title: '$300', Text: 'Estimated finance charge $19.52. Estimated total payment $319.52.' },
          { Title: '$500', Text: 'Estimated finance charge $32.54. Estimated total payment $532.54.' },
          { Title: '$1,000', Text: 'Estimated finance charge $65.08. Estimated total payment $1,065.08.' },
          { Title: '$1,500', Text: 'Estimated finance charge $97.62. Estimated total payment $1,597.62.' },
        ],
      ),
      promo({
        Heading: 'Guarantees, local offices, and decades of experience',
        Text: 'Backed by the Money Today Guarantee and thousands of offices nationwide.',
        CtaLabel: 'Find a location',
        CtaHref: '#',
      }),
      faq({ Title: 'Frequently asked questions' }, [
        { Question: 'When are Early Tax Refund Advance loans available?', Answer: 'They start on December 10 and run through January 31, 2027, in participating offices.' },
        { Question: 'Can I get a loan with bad credit?', Answer: 'Approval is based on your expected refund and other lender criteria. A lower credit score does not automatically rule you out.' },
        { Question: 'What is the APR and what does it cost?', Answer: 'The APR is 35.99%. See the cost table above for estimated finance charges by loan amount.' },
        { Question: 'How much can I borrow?', Answer: 'Loan amounts range from $300 to $1,500. The most commonly approved amount is $300.' },
        { Question: 'How do I apply?', Answer: 'Visit a participating office with a recent paystub and a valid ID.' },
        { Question: 'Can I apply without all my tax documents?', Answer: 'Yes. A recent paystub and ID are enough to start the application.' },
        { Question: 'Will applying affect my credit score?', Answer: 'Details depend on the lender. Ask your Tax Pro about credit reporting before you apply.' },
        { Question: 'How fast will I get approved?', Answer: 'Many decisions are made at the office visit. Funding timelines depend on your chosen delivery method.' },
        { Question: 'Who makes the loan?', Answer: 'Loans are made by a third-party lender. Jackson Hewitt acts as a loan broker.' },
        { Question: 'How will I receive my money?', Answer: 'On a prepaid card or by direct deposit, depending on what you choose and what is available.' },
        { Question: 'How do I repay?', Answer: 'Repayment is taken automatically from your tax refund when you file your return with us.' },
        { Question: 'What if my refund is smaller than expected?', Answer: 'You remain responsible for any balance after your refund is applied. Ask your Tax Pro for details.' },
      ]),
      disclosure({
        Title: 'Early Tax Refund Advance and Money Today Guarantee terms',
        Body:
          'Early Tax Refund Advance loans are from $300 to $1,500 and subject to lender approval. The $1,500 loan requires an expected refund of at least $5,000. Interest does not accrue beyond 120 days. Estimates shown assume repayment in 66 days.\n\n' +
          'Demo content created for an Optimizely demonstration; figures are illustrative and not an offer of credit.',
      }),
    ],
  },
];

// ── API ───────────────────────────────────────────────────────────────────────
const keyFor = (path) => createHash('sha1').update(`jh-page:${path}`).digest('hex').slice(0, 32);
const parentPath = (path) => path.split('/').slice(0, -1).join('/');
const routeSegment = (path) => path.split('/').pop();

async function api(token, method, path, body) {
  const res = await fetch(`${GATEWAY}/v1${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text ? JSON.parse(text) : null };
}

const payloadFor = (page) => ({
  key: keyFor(page.path),
  contentType: 'BlankExperience',
  container: parentPath(page.path) ? keyFor(parentPath(page.path)) : HOME,
  initialVersion: {
    locale: LOCALE,
    displayName: page.name,
    routeSegment: routeSegment(page.path),
    properties: props({ MetaTitle: `${page.name} | Jackson Hewitt` }),
    composition: { nodeType: 'experience', layoutType: 'outline', nodes: page.blocks },
  },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// A freshly created item can 404 for a moment (read-after-write lag), so retry.
async function getVersions(token, key) {
  let res;
  for (let attempt = 0; attempt < 8; attempt++) {
    res = await api(token, 'GET', `/content/${key}/versions?locales=${LOCALE}&pageSize=50`);
    if (res.ok || res.status !== 404) return res;
    await sleep(1000 * (attempt + 1));
  }
  return res;
}

async function publishIfNeeded(token, key) {
  const versions = await getVersions(token, key);
  if (!versions.ok) throw new Error(`Version lookup failed (${versions.status}): ${JSON.stringify(versions.body)}`);
  const items = versions.body?.items ?? [];
  if (items.some((v) => v.status === 'published')) return 'already published';
  const draft = items.find((v) => v.status === 'draft' || v.status === 'ready') ?? items[0];
  if (!draft?.version) throw new Error(`No version to publish for ${key}`);
  const res = await api(token, 'POST', `/content/${key}/versions/${draft.version}:publish`, {});
  if (!res.ok) throw new Error(`Publish failed (${res.status}): ${JSON.stringify(res.body)}`);
  return 'published';
}

async function main() {
  if (DRY) {
    for (const page of PAGES) {
      const p = payloadFor(page);
      console.log(`/${page.path}  key=${p.key}  container=${p.container}  blocks=${page.blocks.length}`);
    }
    console.log('\n[seed-jh-pages] DRY RUN — nothing sent. Full payload for the first page:\n');
    console.log(JSON.stringify(payloadFor(PAGES[1]), null, 2).slice(0, 1500) + '\n…');
    return;
  }
  if (!HOME) throw new Error('Missing HOME_PAGE_CONTENT_ID (set in .env) — the container for the page tree.');
  if (!OPTIMIZELY_CMS_CLIENT_ID || !OPTIMIZELY_CMS_CLIENT_SECRET) {
    throw new Error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET (set in .env).');
  }

  const tokenRes = await fetch(`${GATEWAY}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: OPTIMIZELY_CMS_CLIENT_ID,
      client_secret: OPTIMIZELY_CMS_CLIENT_SECRET,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Token request failed: ${tokenRes.status}`);
  const { access_token: token } = await tokenRes.json();

  // PAGES is ordered parents-first, so each container exists before its children.
  for (const page of PAGES) {
    const key = keyFor(page.path);
    const existing = await api(token, 'GET', `/content/${key}`);
    if (existing.ok) {
      console.log(`[seed-jh-pages] /${page.path}: exists`);
    } else {
      const created = await api(token, 'POST', '/content', payloadFor(page));
      if (!created.ok) throw new Error(`Create /${page.path} failed (${created.status}): ${JSON.stringify(created.body)}`);
      console.log(`[seed-jh-pages] /${page.path}: created`);
    }
    if (!NO_PUBLISH) console.log(`[seed-jh-pages] /${page.path}: ${await publishIfNeeded(token, key)}`);
  }
  console.log('\n[seed-jh-pages] Done. Visit the paths above once Graph has indexed them.');
}

main().catch((err) => {
  console.error(`[seed-jh-pages] ${err instanceof Error ? err.message : err}`);
  process.exitCode = 1;
});
