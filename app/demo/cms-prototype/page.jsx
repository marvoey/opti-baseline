'use client';

import React, { useMemo, useState } from 'react';

/* =====================================================================
   H&R Block content model prototype
   For: marvoey/opti-baseline, branch hrblock (CMS SaaS, @optimizely/cms-sdk 2.x)
   Content rule: copy comes from hrblock.com and hrblock.com/tax-center/ only
   (Build Plan Section 5). Tier A = mirrored, B = authored from the allow-list,
   C = synthetic.
   ===================================================================== */

/* ---------- Brand (hrblock.com/brandportal) ---------- */
const C = { green: '#005D1F', dark: '#003512', sand: '#F6F4E9', warm: '#F8F8F5', ink: '#262626', neon: '#00E95C', logo: '#14AA40' };
const FONT = { fontFamily: 'Graphik, Inter, ui-sans-serif, system-ui, sans-serif' };
const BG = {
  darkGreen: { bg: C.dark, fg: '#FFFFFF', dark: true, label: 'Dark green' },
  sand: { bg: C.sand, fg: C.ink, dark: false, label: 'Sand' },
  warmWhite: { bg: C.warm, fg: C.ink, dark: false, label: 'Warm white' },
  white: { bg: '#FFFFFF', fg: C.ink, dark: false, label: 'White' },
};
const GRID = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

const HRB = 'https://www.hrblock.com';
const SRC = {
  home: HRB + '/',
  options: HRB + '/filing-options-and-products/',
  hub: HRB + '/tax-center/',
  lifeStages: HRB + '/tax-center/life-stages/',
  es: HRB + '/espanol/',
  guarantees: HRB + '/guarantees/',
  article: HRB + '/tax-center/irs/deadlines-and-extensions/miss-tax-extension-deadline/',
};
const TIER = {
  A: { label: 'A · Mirrored', color: '#005D1F', bg: '#E3F1E7' },
  B: { label: 'B · Authored', color: '#7A4B00', bg: '#FBEFD9' },
  C: { label: 'C · Synthetic', color: '#4B3D86', bg: '#ECE8F8' },
};
const STATUS = {
  core: { label: 'Core', cls: 'bg-emerald-100 text-emerald-800' },
  optional: { label: 'Optional', cls: 'bg-sky-100 text-sky-800' },
  deferred: { label: 'Deferred', cls: 'bg-amber-100 text-amber-800' },
  existing: { label: 'In repo', cls: 'bg-slate-200 text-slate-700' },
  not: { label: 'Not modeled', cls: 'bg-rose-100 text-rose-800' },
  locale: { label: 'Locale', cls: 'bg-violet-100 text-violet-800' },
};
const GROUPS = [
  ['page', 'Page types'],
  ['element', 'Elements (Visual Builder)'],
  ['data', 'Connected data'],
  ['shared', 'Shared and nested'],
  ['existing', 'Already in the repo'],
];

/* ---------- Property helpers ---------- */
const EVENTS = [['none', 'None'], ['appointment_cta_click', 'appointment_cta_click'], ['diy_start_click', 'diy_start_click']];
const p = (key, type, label, o = {}) => ({ key, type, label, loc: false, req: false, desc: '', ...o });
const cta = (prefix, label, withEvent = true) => [
  p(prefix + 'Label', 'string', label + ' label', { loc: true }),
  p(prefix + 'Url', 'url', label + ' URL'),
  ...(withEvent ? [p(prefix + 'EventKey', 'event', label + ' event key', { desc: 'Feature Experimentation event sent on click. Choice property, not localized.' })] : []),
];
const PROP_TYPES = [
  ['string', 'string'],
  ['richText', 'richText'],
  ['url', 'url'],
  ['boolean', 'boolean'],
  ['integer', 'integer'],
  ['dateTime', 'dateTime'],
  ['enum', 'string (choices)'],
  ['event', 'event key (choices)'],
  ['image', 'image (DAM)'],
  ['ref', 'contentReference'],
  ['refArray', 'array<contentReference>'],
  ['contentArray', 'array<content>'],
  ['stringArray', 'array<string>'],
];
const REF_TYPES = ['ref', 'refArray', 'contentArray'];

/* ---------- Content types ---------- */
const INITIAL_TYPES = [
  {
    key: 'HRB_LandingExperience', file: 'HrbLandingExperience', name: 'Landing Experience', group: 'page', base: '_experience', status: 'core', source: true,
    desc: 'The Visual Builder page type for every composed marketing page: Home, the campaign page, the two product pages, Offices and the Tax Center hub.',
    why: 'One composable type keeps the model small. The archetype is a property, not a new type. The campaign page gets CMS variations for the Feature Experimentation flag.',
    mayContain: ['_self', 'HRB_TaxCenterCategoryPage'],
    props: [
      p('MetaTitle', 'string', 'Meta title', { loc: true }),
      p('MetaDescription', 'string', 'Meta description', { loc: true }),
      p('PageType', 'enum', 'Page archetype', { enum: [['home', 'Home'], ['campaign', 'Campaign landing'], ['product', 'Product'], ['locator', 'Office locator'], ['hub', 'Tax Center hub']], desc: 'Groups pages in Graph queries and analytics. Not localized.' }),
      p('Disclosure', 'ref', 'Compliance disclosure', { ref: 'HRB_ComplianceDisclosure', req: true, desc: 'The shared disclosure block. Rendered in the footer of every page, so editors cannot leave it out.' }),
    ],
    notes: ['Variations on /still-time-to-file: Original, UrgencyB, DiyAbandoner, ReturningAssisted, LateFiler, OriginalBackup. Names must match the flag values exactly.', 'Spanish is a locale (es) of these pages, not a separate type.'],
  },
  {
    key: 'HRB_TaxCenterCategoryPage', file: 'HrbTaxCenterCategoryPage', name: 'Tax Center Category Page', group: 'page', base: '_page', status: 'optional', source: true,
    desc: 'A fixed-layout page for a Tax Center category such as Life Stages: heading, intro and a list of article cards that link out to hrblock.com.',
    why: 'The contrast for the architecture argument: marketers compose landing pages, while editorial listings use a fixed template filled from shared cards.',
    mayContain: [],
    props: [
      p('MetaTitle', 'string', 'Meta title', { loc: true }),
      p('MetaDescription', 'string', 'Meta description', { loc: true }),
      p('CategoryName', 'string', 'Category name', { loc: true, req: true }),
      p('Intro', 'string', 'Intro', { loc: true }),
      p('CategoryUrl', 'url', 'Live category URL', { desc: 'The category page on hrblock.com, for the "see all" link.' }),
      p('Articles', 'refArray', 'Articles', { ref: 'HRB_ArticleCard', desc: 'Shared article cards. Each opens the live article in a new tab.' }),
      p('Disclosure', 'ref', 'Compliance disclosure', { ref: 'HRB_ComplianceDisclosure', req: true }),
    ],
    notes: ['Not in the Build Plan page list. Build it only if the demo shows the structured-versus-composed contrast.', 'Life Stages article titles have not been captured yet (Build Plan 5.6).'],
  },
  {
    key: 'HRB_Hero', file: 'HrbHero', name: 'Hero', group: 'element', base: '_component', behaviors: ['sectionEnabled', 'elementEnabled'], status: 'core', source: true,
    desc: 'Top-of-page message with eyebrow, headline, sub-copy and two buttons. The element the persona and A/B variations change.',
    why: 'Section-enabled so it can be dropped straight in as a full-width section. Its own Theme setting covers that case, because the section style does not apply then.',
    props: [
      p('Eyebrow', 'string', 'Eyebrow', { loc: true }),
      p('Headline', 'string', 'Headline', { loc: true, req: true }),
      p('Subcopy', 'string', 'Sub-copy', { loc: true }),
      ...cta('PrimaryCta', 'Primary button'),
      ...cta('SecondaryCta', 'Secondary button'),
      p('Image', 'image', 'Image', { desc: 'DAM image. Graph returns a reference only; resolve it with expandReferences() (Build Plan Section 4, correction 2).' }),
      p('ShowCountdown', 'boolean', 'Show countdown chip', { desc: 'Shows the computed days-to-April-15 chip, labelled as demo (UrgencyB).' }),
    ],
    notes: ['Buttons are label + URL pairs, not Link properties: Link Item properties do not auto-translate in CMS SaaS, and Spanish needs translatable labels.'],
  },
  {
    key: 'HRB_SectionHeading', file: 'HrbSectionHeading', name: 'Section Heading', group: 'element', base: '_component', behaviors: ['elementEnabled'], status: 'core', source: true,
    desc: 'Kicker, heading and intro above a group of elements, e.g. "Tax options for any situation" or the Tax Center hub header.',
    why: 'Keeps headings as content inside the grid. Section content properties are not delivered in Graph composition queries.',
    props: [p('Kicker', 'string', 'Kicker', { loc: true }), p('Heading', 'string', 'Heading', { loc: true, req: true }), p('Intro', 'string', 'Intro', { loc: true })],
  },
  {
    key: 'HRB_QuickLinks', file: 'HrbQuickLinks', name: 'Quick Links', group: 'element', base: '_component', behaviors: ['elementEnabled'], status: 'core', source: true,
    desc: 'The home page shortcuts: Work with a tax pro, Do your own taxes, Estimate your refund.',
    why: 'Inline link items keep the three labels together and translatable.',
    props: [p('Links', 'contentArray', 'Links', { ref: 'HRB_LinkItem', loc: true, max: 4 })],
  },
  {
    key: 'HRB_OfferCard', file: 'HrbOfferCard', name: 'Offer Card', group: 'element', base: '_component', behaviors: ['elementEnabled'], status: 'core', source: true,
    desc: 'One filing tier with the published price: Do-It-Yourself, DIY + Support or Full-Service. Placed three across in a row.',
    why: 'Mirrors the "Tax options for any situation" cards field by field, so prices and wording are copied, never paraphrased.',
    props: [
      p('TierLabel', 'string', 'Tier label', { loc: true, req: true }),
      p('Headline', 'string', 'Headline', { loc: true, req: true }),
      p('Subcopy', 'string', 'Sub-copy', { loc: true }),
      p('Bullets', 'stringArray', 'Bullets', { loc: true, max: 4 }),
      p('PricePrefix', 'string', 'Price prefix', { loc: true }),
      p('Price', 'string', 'Price', { loc: true, req: true, desc: 'A string, so the published price stays verbatim ("$0", "$65", "$99").' }),
      p('PriceNote', 'string', 'Price note', { loc: true }),
      ...cta('PrimaryCta', 'Primary button'),
      ...cta('SecondaryCta', 'Secondary button', false),
    ],
    notes: ['The fourth home page tier (tax software) has no captured price, so it is left out.', '/espanol/ has no price cards: Spanish falls back to English here.'],
  },
  {
    key: 'HRB_TrustBar', file: 'HrbTrustBar', name: 'Trust Bar', group: 'element', base: '_component', behaviors: ['sectionEnabled', 'elementEnabled'], status: 'core', source: true,
    desc: 'The three published trust claims. Replaces the dropped testimonial block.',
    why: 'Only claims that appear on hrblock.com. No customer quotes.',
    props: [p('Heading', 'string', 'Heading', { loc: true }), p('Claims', 'stringArray', 'Claims', { loc: true, req: true, max: 3 })],
  },
  {
    key: 'HRB_Guarantees', file: 'HrbGuarantees', name: 'Guarantees', group: 'element', base: '_component', behaviors: ['sectionEnabled', 'elementEnabled'], status: 'core', source: true,
    desc: '100% Accuracy, Maximum Refund and No Surprise, in their short form, with the "See all our guarantees" link.',
    why: 'Short forms only next to the link. The long terms go in the shared disclosure once captured.',
    props: [p('Heading', 'string', 'Heading', { loc: true }), p('Items', 'contentArray', 'Guarantees', { ref: 'HRB_GuaranteeItem', loc: true, max: 3 }), ...cta('Link', 'Guarantees link', false)],
  },
  {
    key: 'HRB_Callout', file: 'HrbCallout', name: 'Callout', group: 'element', base: '_component', behaviors: ['elementEnabled'], status: 'core', source: true,
    desc: 'A small promo box with an icon, headline and one button: "Securely manage your taxes with MyBlock" or "Find your office".',
    why: 'One type covers both home page callouts.',
    props: [p('Icon', 'enum', 'Icon', { enum: [['myblock', 'MyBlock'], ['office', 'Office'], ['none', 'None']] }), p('Headline', 'string', 'Headline', { loc: true, req: true }), p('Body', 'string', 'Body', { loc: true }), ...cta('Cta', 'Button')],
  },
  {
    key: 'HRB_CtaBanner', file: 'HrbCtaBanner', name: 'CTA Banner', group: 'element', base: '_component', behaviors: ['sectionEnabled', 'elementEnabled'], status: 'core', source: true,
    desc: 'Closing banner: "No one offers more ways to get tax help than H&R Block." with two buttons.',
    why: 'The Tax Center banner, reused as the closing call to action on every page.',
    props: [p('Headline', 'string', 'Headline', { loc: true, req: true }), ...cta('PrimaryCta', 'Primary button'), ...cta('SecondaryCta', 'Secondary button')],
  },
  {
    key: 'HRB_ArticleCard', file: 'HrbArticleCard', name: 'Article Card', group: 'element', base: '_component', behaviors: ['elementEnabled'], status: 'core', source: true,
    desc: 'A Tax Center card: category label and title, linking to the live article on hrblock.com.',
    why: 'Link-out rule: articles are not copied. Cards are shared items in one folder, so the hub and category pages reference the same card.',
    props: [p('CategoryLabel', 'string', 'Category label', { loc: true, req: true }), p('Title', 'string', 'Title', { loc: true, req: true }), p('ArticleUrl', 'url', 'Article URL', { req: true, desc: 'Live article on hrblock.com. Opens in a new tab.' }), p('HasVideo', 'boolean', 'Has video')],
    notes: ['Suggested folder: Sites/H&R Block/Tax Center cards.'],
  },
  {
    key: 'HRB_ArticleList', file: 'HrbArticleList', name: 'Article List', group: 'element', base: '_component', behaviors: ['sectionEnabled', 'elementEnabled'], status: 'core', source: true,
    desc: 'A heading and a grid of referenced article cards, e.g. "Recent articles."',
    why: 'Faster for editors than placing six cards in six columns, and reuses the shared cards.',
    props: [p('Heading', 'string', 'Heading', { loc: true }), p('Articles', 'refArray', 'Articles', { ref: 'HRB_ArticleCard', max: 6 }), ...cta('MoreLink', 'More link', false)],
  },
  {
    key: 'HRB_CategoryNav', file: 'HrbCategoryNav', name: 'Category Nav', group: 'element', base: '_component', behaviors: ['elementEnabled'], status: 'core', source: true,
    desc: 'The Tax Center categories: Life Stages, Work, Taxes 101, Tax Breaks and Money, What’s New, All topics. Each links to hrblock.com.',
    why: 'Inline link items; the categories link out like the articles.',
    props: [p('Links', 'contentArray', 'Links', { ref: 'HRB_LinkItem', loc: true, max: 8 })],
  },
  {
    key: 'HRB_OfficeFinder', file: 'HrbOfficeFinder', name: 'Office Finder', group: 'data', base: '_component', behaviors: ['sectionEnabled', 'elementEnabled'], status: 'core', source: false,
    desc: 'Search box and results list. Results come from the synthetic office directory in the custom Graph source (hrbx).',
    why: 'Shows connected content: office data changes at the source without a CMS publish.',
    props: [p('Heading', 'string', 'Heading', { loc: true }), ...cta('Cta', 'Search button', false), p('DefaultZip', 'string', 'Default ZIP'), p('ResultsLimit', 'integer', 'Results limit')],
    notes: ['Office data stays synthetic (Tier C). Never real addresses or phone numbers.'],
  },
  {
    key: 'HRB_OfficeCard', file: 'HrbOfficeCard', name: 'Office Card', group: 'data', base: '_component', behaviors: ['elementEnabled'], status: 'core', source: false,
    desc: 'One office, bound to the hrbx connected source so editors can place a single office on a page.',
    why: 'The acceptance check "change availability at the source, the card changes without a publish" needs a bound card.',
    props: [p('OfficeName', 'string', 'Office name', { req: true }), p('City', 'string', 'City'), p('State', 'string', 'State'), p('Zip', 'string', 'ZIP'), p('Availability', 'string', 'Availability'), p('Bilingual', 'boolean', 'Bilingual pros')],
    notes: ['Binding: POST /v1/contenttypebindings maps the hrbx Office type to this component. Verify the field mapping in Phase 5.'],
  },
  {
    key: 'HRB_FaqList', file: 'HrbFaqList', name: 'FAQ List', group: 'element', base: '_component', behaviors: ['elementEnabled'], status: 'deferred', source: true,
    desc: 'Question-and-answer list, like the FAQ section of a Tax Center article.',
    why: 'Deferred until real answers are captured from hrblock.com. No invented answers.',
    props: [p('Heading', 'string', 'Heading', { loc: true }), p('Items', 'contentArray', 'Questions', { ref: 'HRB_FaqItem', loc: true })],
  },
  {
    key: 'HRB_ComplianceDisclosure', file: 'HrbComplianceDisclosure', name: 'Compliance Disclosure', group: 'shared', base: '_component', status: 'core', source: true,
    desc: 'One shared block with the guarantee terms (once captured) or the "demonstration site" line. Referenced by every page.',
    why: 'A required page property, not a block editors place, so it cannot be left off a page.',
    props: [p('Body', 'richText', 'Body', { loc: true, req: true })],
    notes: ['Suggested location: Sites/H&R Block/Shared.'],
  },
  {
    key: 'HRB_LinkItem', file: 'HrbLinkItem', name: 'Link Item', group: 'shared', base: '_component', status: 'core', source: false,
    desc: 'Label, URL and event key, used inside Quick Links and Category Nav.',
    why: 'A translatable label with a URL, instead of a Link property.',
    props: [p('Label', 'string', 'Label', { loc: true, req: true }), p('Url', 'url', 'URL', { req: true }), p('EventKey', 'event', 'Event key'), p('OpensInNewTab', 'boolean', 'Opens in new tab')],
  },
  {
    key: 'HRB_GuaranteeItem', file: 'HrbGuaranteeItem', name: 'Guarantee Item', group: 'shared', base: '_component', status: 'core', source: false,
    desc: 'One guarantee: title and short-form text.',
    why: 'Inline item inside Guarantees.',
    props: [p('Title', 'string', 'Title', { loc: true, req: true }), p('Text', 'string', 'Text', { loc: true, req: true })],
  },
  {
    key: 'HRB_FaqItem', file: 'HrbFaqItem', name: 'FAQ Item', group: 'shared', base: '_component', status: 'deferred', source: false,
    desc: 'One question and answer.',
    why: 'Inline item inside FAQ List.',
    props: [p('Question', 'string', 'Question', { loc: true, req: true }), p('Answer', 'richText', 'Answer', { loc: true, req: true })],
  },
  {
    key: 'RichTextBlock', file: 'RichText', name: 'Rich Text (Prose)', group: 'existing', base: '_component', behaviors: ['elementEnabled', 'sectionEnabled'], status: 'existing', source: false,
    desc: 'The repo’s existing prose block (cms/RichText.tsx). Reused for short lists of published bullets.',
    why: 'Already pushed; no new type needed.',
    props: [p('Intent', 'string', 'Intent Tag'), p('Audience', 'string', 'Target Audience'), p('Domain', 'string', 'Domain / Vertical'), p('Geo', 'string', 'Geo / Region'), p('Body', 'richText', 'Body', { loc: true })],
  },
];

/* ---------- Display templates ---------- */
const TEMPLATES = [
  {
    key: 'HRB_SectionStyle', name: 'Section style', file: 'HrbLayoutStyles', scope: ['baseType', '_section'], isDefault: true,
    note: 'Applies to BlankSection. Replaces cms/HrbSection.tsx in the Build Plan.',
    settings: [
      { key: 'Background', label: 'Background', choices: [['warmWhite', 'Warm white'], ['sand', 'Sand'], ['darkGreen', 'Dark green'], ['white', 'White']] },
      { key: 'Spacing', label: 'Spacing', choices: [['standard', 'Standard'], ['compact', 'Compact'], ['spacious', 'Spacious']] },
      { key: 'Width', label: 'Width', choices: [['full', 'Full'], ['medium', 'Medium'], ['narrow', 'Narrow']] },
    ],
  },
  {
    key: 'HRB_RowStyle', name: 'Row style', file: 'HrbLayoutStyles', scope: ['nodeType', 'row'], isDefault: true,
    settings: [
      { key: 'Gap', label: 'Gap', choices: [['medium', 'Medium'], ['none', 'None'], ['small', 'Small'], ['large', 'Large']] },
      { key: 'ResponsiveTextAlign', label: 'Text align', choices: [['left', 'Left'], ['center', 'Center']] },
    ],
  },
  {
    key: 'HRB_ColumnStyle', name: 'Column style', file: 'HrbLayoutStyles', scope: ['nodeType', 'column'], isDefault: true,
    settings: [{ key: 'Surface', label: 'Surface', choices: [['none', 'None'], ['card', 'White card'], ['sandCard', 'Sand card']] }],
  },
  {
    key: 'HRB_HeroStyle', name: 'Hero style', file: 'HrbHero', scope: ['contentType', 'HRB_Hero'], isDefault: true,
    settings: [
      { key: 'Theme', label: 'Theme', choices: [['darkGreen', 'Dark green'], ['sand', 'Sand'], ['warmWhite', 'Warm white']] },
      { key: 'MediaPosition', label: 'Image', choices: [['none', 'No image'], ['right', 'Image right']] },
    ],
  },
  {
    key: 'HRB_OfferCardStyle', name: 'Offer card style', file: 'HrbOfferCard', scope: ['contentType', 'HRB_OfferCard'], isDefault: true,
    settings: [{ key: 'Emphasis', label: 'Emphasis', choices: [['standard', 'Standard'], ['featured', 'Featured']] }],
  },
  {
    key: 'HRB_CtaBannerStyle', name: 'CTA banner style', file: 'HrbCtaBanner', scope: ['contentType', 'HRB_CtaBanner'], isDefault: true,
    settings: [{ key: 'Theme', label: 'Theme', choices: [['darkGreen', 'Dark green'], ['sand', 'Sand']] }],
  },
];

/* ---------- Source content (Build Plan 5.3, as read 16 Nov 2026) ---------- */
const CARDS = [
  { id: 'c1', CategoryLabel: 'Deadlines and extensions', Title: 'Extended tax deadline: Can I file another extension after October 15?', ArticleUrl: HRB + '/tax-center/irs/deadlines-and-extensions/miss-tax-extension-deadline/', HasVideo: false },
  { id: 'c2', CategoryLabel: 'Filing', Title: 'How to amend a tax return if you’ve already filed', ArticleUrl: HRB + '/tax-center/filing/how-to-amend-tax-return/', HasVideo: false },
  { id: 'c3', CategoryLabel: 'Adjustments and deductions', Title: 'The standard deduction vs. itemized deductions: What’s the difference?', ArticleUrl: HRB + '/tax-center/filing/adjustments-and-deductions/standard-vs-itemized-deductions/', HasVideo: true },
  { id: 'c4', CategoryLabel: 'Filing', Title: 'New tax laws 2026: IRS tax changes to maximize your tax refund in 2027', ArticleUrl: HRB + '/tax-center/filing/tax-law-changes/', HasVideo: false },
  { id: 'c5', CategoryLabel: 'Other income', Title: 'Gift tax: How much is gift tax and who pays it?', ArticleUrl: HRB + '/tax-center/income/other-income/do-i-have-to-pay-taxes-on-a-gift/', HasVideo: false },
  { id: 'c6', CategoryLabel: 'States', Title: 'Does Tennessee have state income tax?', ArticleUrl: HRB + '/tax-center/filing/states/tennessee-taxes/', HasVideo: false },
];
const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

const OFFERS = {
  diy: { TierLabel: 'DO-IT-YOURSELF', Headline: 'File your own taxes with confidence', Subcopy: 'Nearly 52% qualify for free filing with easy guided steps all the way through.', Bullets: ['File at your own pace, on any device, with built-in support', 'Start free and upgrade anytime for live help or more complex taxes'], PricePrefix: 'Starting at', Price: '$0', PriceNote: '+ $0 state additional for paid products *simple returns only', PrimaryCtaLabel: 'Start for free', PrimaryCtaUrl: '/file-online', PrimaryCtaEventKey: 'diy_start_click', SecondaryCtaLabel: 'Learn more', SecondaryCtaUrl: '/file-online' },
  support: { TierLabel: 'DO-IT-YOURSELF + SUPPORT', Headline: 'File your own taxes with expert help', Subcopy: 'Live support from tax pros and AI Tax Assist included from the start.', Bullets: ['Great for families, freelancers, or investors', 'File at your own pace and get answers when you need them'], PricePrefix: 'Starting at', Price: '$65', PriceNote: '+ $49 per state filed', PrimaryCtaLabel: 'Start with expert help', PrimaryCtaUrl: '/file-online', PrimaryCtaEventKey: 'diy_start_click', SecondaryCtaLabel: 'Learn more', SecondaryCtaUrl: '/file-online' },
  full: { TierLabel: 'FULL-SERVICE TAX PREP', Headline: 'Let a trusted tax pro handle it all', Subcopy: 'Work with your pro however is most convenient, in person or online.', Bullets: ['Dedicated one-on-one guidance for all tax situations', 'Choose your pro or get matched, and file in as little as one hour'], PricePrefix: 'Starting at', Price: '$99', PriceNote: '+ additional state fee', PrimaryCtaLabel: 'Start with a tax pro', PrimaryCtaUrl: '/tax-pro', PrimaryCtaEventKey: 'appointment_cta_click', SecondaryCtaLabel: 'Learn more', SecondaryCtaUrl: '/tax-pro' },
};
const CLAIMS = ['22 million clients worldwide trusted Block last year', '70+ years of tax expertise', '1 billion tax returns prepared worldwide'];
const GUARANTEES = [
  { Title: '100% Accuracy', Text: 'If there’s an error caused by H&R Block or our software, we’ll cover any resulting penalties and interest.' },
  { Title: 'Maximum Refund', Text: 'If you find an error that impacts your refund or tax liability, we’ll refund your tax prep fee and file an amended return at no extra cost.' },
  { Title: 'No Surprise', Text: 'We’ll tell you the price upfront and keep you updated if anything changes, so you always know what to expect.' },
];
const QUICK = [
  { Label: 'Work with a tax pro', Url: '/tax-pro', EventKey: 'appointment_cta_click' },
  { Label: 'Do your own taxes', Url: '/file-online', EventKey: 'diy_start_click' },
  { Label: 'Estimate your refund', Url: HRB + '/tax-calculator/', EventKey: 'none', OpensInNewTab: true },
];
const CATEGORIES = [
  ['Life Stages', '/tax-center/life-stages/'], ['Work', '/tax-center/work/'], ['Taxes 101', '/tax-center/taxes-101/'],
  ['Tax Breaks and Money', '/tax-center/tax-breaks-money/'], ['What’s New', '/tax-center/whats-new/'], ['All topics', '/tax-center/all-topics/'],
].map(([Label, path]) => ({ Label, Url: HRB + path, EventKey: 'none', OpensInNewTab: true }));
const DISCLOSURE = 'Demonstration site. Site content © HRB Digital LLC, used for demonstration only. Site copy is from hrblock.com as of November 2026; offices, audiences and results are synthetic.';

const VARIATIONS = {
  Original: { Eyebrow: 'STILL TIME TO FILE', Headline: 'No one offers more ways to get tax help than H&R Block.', Subcopy: 'Work with your pro however is most convenient, in person or online.', PrimaryCtaLabel: 'File with a tax pro', PrimaryCtaEventKey: 'appointment_cta_click', SecondaryCtaLabel: 'File online', SecondaryCtaEventKey: 'none', ShowCountdown: false },
  UrgencyB: { Eyebrow: 'STILL TIME TO FILE', Headline: 'April 15 is close. Let a trusted tax pro handle it all.', Subcopy: 'Choose your pro or get matched, and file in as little as one hour.', PrimaryCtaLabel: 'Start with a tax pro', PrimaryCtaEventKey: 'appointment_cta_click', SecondaryCtaLabel: 'File online', SecondaryCtaEventKey: 'none', ShowCountdown: true },
  DiyAbandoner: { Eyebrow: 'WELCOME BACK', Headline: 'File your own taxes with expert help.', Subcopy: 'Live support from tax pros and AI Tax Assist included from the start.', PrimaryCtaLabel: 'Start with expert help', PrimaryCtaEventKey: 'diy_start_click', SecondaryCtaLabel: 'File with a tax pro', SecondaryCtaEventKey: 'appointment_cta_click', ShowCountdown: false },
  ReturningAssisted: { Eyebrow: 'WELCOME BACK', Headline: 'Welcome back. Work with your pro in person or online.', Subcopy: 'Dedicated one-on-one guidance for all tax situations.', PrimaryCtaLabel: 'Make an appointment to file with a tax pro', PrimaryCtaEventKey: 'appointment_cta_click', SecondaryCtaLabel: 'Find an office', SecondaryCtaEventKey: 'none', ShowCountdown: false },
  LateFiler: { Eyebrow: 'STILL TIME TO FILE', Headline: 'File taxes the way you want with H&R Block.', Subcopy: 'Start free and upgrade anytime for live help or more complex taxes.', PrimaryCtaLabel: 'Start for free', PrimaryCtaEventKey: 'diy_start_click', SecondaryCtaLabel: 'File with a tax pro', SecondaryCtaEventKey: 'appointment_cta_click', ShowCountdown: false },
};
VARIATIONS.OriginalBackup = { ...VARIATIONS.Original };

/* ---------- Composition builders ---------- */
let _id = 0;
const uid = () => 'n' + ++_id;
const E = (t, props, tier, extra = {}) => ({ id: uid(), t, props, tier, ...extra });
const S = (bg, ...rows) => ({ id: uid(), bg, rows: rows.map((cols) => ({ id: uid(), cols: cols.map((els) => ({ id: uid(), els })) })) });

const SAMPLE = {
  HRB_Hero: () => E('HRB_Hero', { Eyebrow: '', Headline: 'Let a trusted tax pro handle it all', Subcopy: 'Work with your pro however is most convenient, in person or online.', PrimaryCtaLabel: 'Start with a tax pro', PrimaryCtaEventKey: 'appointment_cta_click', SecondaryCtaLabel: 'Find an office', SecondaryCtaEventKey: 'none' }, 'A'),
  HRB_SectionHeading: () => E('HRB_SectionHeading', { Heading: 'Tax options for any situation' }, 'A'),
  HRB_QuickLinks: () => E('HRB_QuickLinks', { Links: QUICK }, 'A'),
  HRB_OfferCard: () => E('HRB_OfferCard', { ...OFFERS.diy }, 'A'),
  HRB_TrustBar: () => E('HRB_TrustBar', { Claims: CLAIMS }, 'A'),
  HRB_Guarantees: () => E('HRB_Guarantees', { Items: GUARANTEES, LinkLabel: 'See all our guarantees', LinkUrl: SRC.guarantees }, 'A'),
  HRB_Callout: () => E('HRB_Callout', { Icon: 'office', Headline: 'Find your office', CtaLabel: 'Look for my office', CtaEventKey: 'none' }, 'A'),
  HRB_CtaBanner: () => E('HRB_CtaBanner', { Headline: 'No one offers more ways to get tax help than H&R Block.', PrimaryCtaLabel: 'File with a tax pro', PrimaryCtaEventKey: 'appointment_cta_click', SecondaryCtaLabel: 'File online', SecondaryCtaEventKey: 'none' }, 'A'),
  HRB_ArticleCard: () => E('HRB_ArticleCard', { ...CARDS[0] }, 'A'),
  HRB_ArticleList: () => E('HRB_ArticleList', { Heading: 'Recent articles.', Articles: ['c1', 'c2', 'c3'] }, 'A'),
  HRB_CategoryNav: () => E('HRB_CategoryNav', { Links: CATEGORIES }, 'A'),
  HRB_OfficeFinder: () => E('HRB_OfficeFinder', { Heading: 'Find your office', CtaLabel: 'Look for my office', DefaultZip: '', ResultsLimit: 3 }, 'C'),
  HRB_OfficeCard: () => E('HRB_OfficeCard', { OfficeName: 'Demo Office A', City: 'Kansas City', State: 'MO', Zip: '00000', Availability: 'Next available: today (synthetic)', Bilingual: true }, 'C'),
  HRB_FaqList: () => E('HRB_FaqList', { Heading: 'FAQs' }, 'A'),
  RichTextBlock: () => E('RichTextBlock', { Body: ['- Dedicated one-on-one guidance for all tax situations', '- Choose your pro or get matched, and file in as little as one hour'] }, 'A'),
};

const officeCards = () => [
  E('HRB_OfficeCard', { OfficeName: 'Demo Office A', City: 'Kansas City', State: 'MO', Zip: '00000', Availability: 'Next available: today', Bilingual: true }, 'C'),
  E('HRB_OfficeCard', { OfficeName: 'Demo Office B', City: 'Kansas City', State: 'MO', Zip: '00000', Availability: 'Next available: tomorrow', Bilingual: false }, 'C'),
  E('HRB_OfficeCard', { OfficeName: 'Demo Office C', City: 'Overland Park', State: 'KS', Zip: '00000', Availability: 'Walk-in hours (synthetic)', Bilingual: true }, 'C'),
];
const banner = () => SAMPLE.HRB_CtaBanner();

const PAGE_COMPOSITIONS = {
  home: [
    S('darkGreen', [[E('HRB_Hero', { Headline: 'File taxes the way you want with H&R Block.', Subcopy: 'Nearly 52% qualify for free filing with easy guided steps all the way through.', PrimaryCtaLabel: 'Work with a tax pro', PrimaryCtaEventKey: 'appointment_cta_click', SecondaryCtaLabel: 'Do your own taxes', SecondaryCtaEventKey: 'diy_start_click' }, 'B', {
      esTier: 'A',
      es: { Eyebrow: '', Headline: 'Tu socio en la preparación de taxes', Subcopy: 'Sabemos que tu prioridad es recibir el máximo reembolso. Cuando trabajas con profesionales de taxes bilingües en H&R Block — que saben cómo elaborar tu declaración de taxes en español — ellos se encargarán de todo lo necesario relacionado a tus taxes para que tú solamente te encargues de ti.', PrimaryCtaLabel: 'Haz una cita', SecondaryCtaLabel: 'Encuentra una oficina' },
    })]]),
    S('white', [[SAMPLE.HRB_QuickLinks()]]),
    S('sand', [[SAMPLE.HRB_SectionHeading()]], [[E('HRB_OfferCard', { ...OFFERS.diy }, 'A')], [E('HRB_OfferCard', { ...OFFERS.support }, 'A')], [E('HRB_OfferCard', { ...OFFERS.full }, 'A', { display: { Emphasis: 'featured' } })]]),
    S('warmWhite', [[SAMPLE.HRB_TrustBar()]]),
    S('white', [[SAMPLE.HRB_Guarantees()]]),
    S('warmWhite', [[E('HRB_Callout', { Icon: 'myblock', Headline: 'Securely manage your taxes with MyBlock', CtaLabel: 'Sign in to MyBlock', CtaEventKey: 'none' }, 'A')], [SAMPLE.HRB_Callout()]]),
    S('white', [[SAMPLE.HRB_ArticleList()]]),
  ],
  campaign: [
    S('darkGreen', [[E('HRB_Hero', { ...VARIATIONS.Original }, 'B', { variationDriven: true })]]),
    S('sand', [[SAMPLE.HRB_SectionHeading()]], [[E('HRB_OfferCard', { ...OFFERS.diy }, 'A')], [E('HRB_OfferCard', { ...OFFERS.support }, 'A')], [E('HRB_OfferCard', { ...OFFERS.full }, 'A', { display: { Emphasis: 'featured' } })]]),
    S('warmWhite', [[SAMPLE.HRB_TrustBar()]]),
    S('white', [[SAMPLE.HRB_OfficeFinder()]]),
    S('darkGreen', [[banner()]]),
  ],
  fileOnline: [
    S('sand', [[E('HRB_Hero', { Eyebrow: 'DO-IT-YOURSELF', Headline: 'File your own taxes with confidence', Subcopy: 'Nearly 52% qualify for free filing with easy guided steps all the way through.', PrimaryCtaLabel: 'Start for free', PrimaryCtaEventKey: 'diy_start_click', SecondaryCtaLabel: 'Start with expert help', SecondaryCtaEventKey: 'diy_start_click' }, 'A')]]),
    S('warmWhite', [[E('HRB_OfferCard', { ...OFFERS.diy }, 'A')], [E('HRB_OfferCard', { ...OFFERS.support }, 'A', { display: { Emphasis: 'featured' } })]]),
    S('white', [[SAMPLE.HRB_Guarantees()]]),
    S('warmWhite', [[SAMPLE.HRB_ArticleList()]]),
    S('darkGreen', [[banner()]]),
  ],
  taxPro: [
    S('darkGreen', [[E('HRB_Hero', { Eyebrow: 'FULL-SERVICE TAX PREP', Headline: 'Let a trusted tax pro handle it all', Subcopy: 'Work with your pro however is most convenient, in person or online.', PrimaryCtaLabel: 'Start with a tax pro', PrimaryCtaEventKey: 'appointment_cta_click', SecondaryCtaLabel: 'Find an office', SecondaryCtaEventKey: 'none' }, 'A')]]),
    S('warmWhite', [[E('HRB_OfferCard', { ...OFFERS.full }, 'A', { display: { Emphasis: 'featured' } })], [SAMPLE.RichTextBlock()]]),
    S('white', [[SAMPLE.HRB_OfficeFinder()]]),
    S('sand', [[SAMPLE.HRB_Guarantees()]]),
    S('darkGreen', [[banner()]]),
  ],
  offices: [
    S('sand', [[E('HRB_SectionHeading', { Kicker: 'Find an office', Heading: 'Find your office' }, 'A')]], [[SAMPLE.HRB_OfficeFinder()]]),
    S('warmWhite', officeCards().map((c) => [c])),
    S('white', [[E('HRB_Callout', { Icon: 'myblock', Headline: 'Securely manage your taxes with MyBlock', CtaLabel: 'Sign in to MyBlock', CtaEventKey: 'none' }, 'A')]]),
  ],
  hub: [
    S('sand', [[E('HRB_SectionHeading', { Kicker: 'Tax Information Center', Heading: 'Tax help for now and what’s next.', Intro: 'Lean on our years of experience to get help with tax questions and stay up to date on the latest tax tools and guidance.' }, 'A')]], [[SAMPLE.HRB_CategoryNav()]]),
    S('white', [[E('HRB_ArticleList', { Heading: 'Recent articles.', Articles: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'], MoreLinkLabel: 'All topics', MoreLinkUrl: HRB + '/tax-center/all-topics/' }, 'A')]]),
    S('warmWhite', [[E('HRB_TrustBar', { Heading: 'See why millions trust us with their taxes.', Claims: CLAIMS }, 'A')]]),
    S('darkGreen', [[banner()]]),
  ],
};

const CATEGORY_PAGE = { CategoryName: 'Life Stages', Intro: 'As you go through stages of life—marriage, kids, college, retirement—your taxes can change, too. H&R Block is here to help.', CategoryUrl: SRC.lifeStages, Articles: [] };

const PAGES = [
  { id: 'home', name: 'Home', url: '/', archetype: 'Home', type: 'HRB_LandingExperience', status: 'core', source: SRC.home, why: 'Filing options with prices, trust claims, guarantees, MyBlock and office callouts, recent articles. The loan hero on hrblock.com today is left out.' },
  { id: 'campaign', name: 'Still time to file', url: '/still-time-to-file', archetype: 'Campaign landing', type: 'HRB_LandingExperience', status: 'core', source: SRC.home, variations: true, why: 'The demo’s experiment and personalization page. Six CMS variations of one experience, chosen by the Feature Experimentation flag.' },
  { id: 'fileOnline', name: 'File online', url: '/file-online', archetype: 'Product', type: 'HRB_LandingExperience', status: 'core', source: SRC.options, why: 'Do-it-yourself path: the DIY and DIY + Support tiers. Target of diy_start_click.' },
  { id: 'taxPro', name: 'File with a tax pro', url: '/tax-pro', archetype: 'Product', type: 'HRB_LandingExperience', status: 'core', source: SRC.options, why: 'Assisted path: the Full-Service tier and the office finder. Target of appointment_cta_click.' },
  { id: 'offices', name: 'Offices', url: '/offices', archetype: 'Office locator', type: 'HRB_LandingExperience', status: 'core', source: SRC.home, why: 'Connected content: office cards from the synthetic hrbx source change without a CMS publish.' },
  { id: 'hub', name: 'Tax Center hub', url: '/tax-center', archetype: 'Tax Center hub', type: 'HRB_LandingExperience', status: 'core', source: SRC.hub, why: 'Hub header, category links and article cards that link to the live articles.' },
  { id: 'category', name: 'Tax Center category', url: '/tax-center/life-stages', archetype: 'Editorial listing', type: 'HRB_TaxCenterCategoryPage', status: 'optional', source: SRC.lifeStages, fixed: true, why: 'Fixed template filled from shared cards. Optional: build it if you want the structured-versus-composed contrast.' },
  { id: 'article', name: 'Tax Center article', url: 'hrblock.com (link-out)', archetype: 'Long-form article', type: null, status: 'not', source: SRC.article, why: 'Content rule: long Tax Center articles are not copied. Cards link to the live article in a new tab.' },
  { id: 'spanish', name: 'Spanish pages', url: '/es/…', archetype: 'Locale', type: 'locale', status: 'locale', source: SRC.es, why: 'Spanish is the es locale of the same pages, using copy from /espanol/. Items without Spanish copy fall back to English.' },
];
const COMPOSABLE = PAGES.filter((pg) => PAGE_COMPOSITIONS[pg.id] || pg.fixed);

/* ---------- Helpers ---------- */
const clone = (x) => JSON.parse(JSON.stringify(x));
const daysToApril15 = () => Math.max(0, Math.ceil((new Date('2027-04-15T00:00:00') - new Date()) / 86400000));
const LOCALIZED_ELEMENTS = new Set(['HRB_Hero', 'HRB_SectionHeading', 'HRB_QuickLinks', 'HRB_OfferCard', 'HRB_TrustBar', 'HRB_Guarantees', 'HRB_Callout', 'HRB_CtaBanner', 'HRB_ArticleCard', 'HRB_ArticleList', 'HRB_CategoryNav', 'HRB_OfficeFinder', 'RichTextBlock']);

function countUsage(sections, fixed) {
  const n = {};
  const add = (k, v = 1) => { n[k] = (n[k] || 0) + v; };
  add('HRB_ComplianceDisclosure');
  if (fixed) { add('HRB_ArticleCard', (fixed.Articles || []).length); return n; }
  (sections || []).forEach((s) => s.rows.forEach((r) => r.cols.forEach((c) => c.els.forEach((el) => {
    add(el.t);
    if (el.t === 'HRB_QuickLinks' || el.t === 'HRB_CategoryNav') add('HRB_LinkItem', (el.props.Links || []).length);
    if (el.t === 'HRB_Guarantees') add('HRB_GuaranteeItem', (el.props.Items || []).length);
    if (el.t === 'HRB_ArticleList') add('HRB_ArticleCard', (el.props.Articles || []).length);
  }))));
  return n;
}

/* ---------- Code generation (cms-sdk 2.x, repo conventions) ---------- */
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const exportName = (t) => t.file + 'ContentType';
const tplName = (tp) => tp.key.replace(/^HRB_/, 'Hrb') + 'DisplayTemplate';

function propLines(pr, i, byKey, selfKey) {
  const refName = (k) => (byKey[k] && byKey[k].included && k !== selfKey ? exportName(byKey[k]) : q(k));
  const out = [];
  switch (pr.type) {
    case 'enum':
    case 'event': {
      const ch = pr.type === 'event' ? EVENTS : pr.enum || [];
      out.push("type: 'string',", 'enum: [' + ch.map(([v, l]) => '{ value: ' + q(v) + ', displayName: ' + q(l) + ' }').join(', ') + '],');
      break;
    }
    case 'image': out.push("type: 'contentReference',", "allowedTypes: ['_image'],"); break;
    case 'ref': out.push("type: 'contentReference',", 'allowedTypes: [' + refName(pr.ref) + '],'); break;
    case 'refArray': out.push("type: 'array',", "items: { type: 'contentReference', allowedTypes: [" + refName(pr.ref) + '] },'); break;
    case 'contentArray': out.push("type: 'array',", "items: { type: 'content', allowedTypes: [" + refName(pr.ref) + '] },'); break;
    case 'stringArray': out.push("type: 'array',", "items: { type: 'string' },"); break;
    default: out.push("type: '" + pr.type + "',");
  }
  out.push('displayName: ' + q(pr.label) + ',');
  if (pr.desc) out.push('description: ' + q(pr.desc) + ',');
  if (pr.loc) out.push('isLocalized: true,');
  if (pr.req) out.push('isRequired: true,');
  if (pr.max && ['refArray', 'contentArray', 'stringArray'].includes(pr.type)) out.push('maxItems: ' + pr.max + ',');
  out.push('sortOrder: ' + (i + 1) * 10 + ',');
  return '    ' + pr.key + ': {\n' + out.map((l) => '      ' + l).join('\n') + '\n    },';
}

function templateCode(tp) {
  const settings = tp.settings.map((s, i) => {
    const choices = s.choices.map(([v, l], j) => '        ' + v + ': { displayName: ' + q(l) + ', sortOrder: ' + (j + 1) + ' },').join('\n');
    return '    ' + s.key + ': {\n      editor: \'select\' as const,\n      displayName: ' + q(s.label) + ',\n      sortOrder: ' + i + ',\n      choices: {\n' + choices + '\n      },\n    },';
  }).join('\n');
  return 'export const ' + tplName(tp) + ' = displayTemplate({\n  key: ' + q(tp.key) + ',\n  displayName: ' + q('[HRB] ' + tp.name) + ',\n  isDefault: ' + tp.isDefault + ',\n  ' + tp.scope[0] + ': ' + q(tp.scope[1]) + ',\n  settings: {\n' + settings + '\n  },\n});';
}

function typeFile(t, byKey) {
  const tpls = TEMPLATES.filter((x) => x.scope[0] === 'contentType' && x.scope[1] === t.key);
  const refs = [...new Set(t.props.filter((r) => REF_TYPES.includes(r.type)).map((r) => r.ref))].filter((k) => byKey[k] && byKey[k].included && k !== t.key);
  const lines = [];
  lines.push("import { contentType" + (tpls.length ? ', displayTemplate' : '') + ", type ContentProps } from '@optimizely/cms-sdk';");
  if (t.base === '_experience') {
    lines.push("import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';");
    lines.push("import { ComponentWrapper } from './wrappers';");
  } else {
    lines.push("import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';");
  }
  if (t.source) lines.push("import { sourceFields } from './sourceFields';");
  refs.forEach((k) => lines.push('import { ' + exportName(byKey[k]) + " } from './" + byKey[k].file + "';"));
  lines.push('');
  lines.push('/** ' + t.desc + ' */');
  lines.push('export const ' + exportName(t) + ' = contentType({');
  lines.push('  key: ' + q(t.key) + ',');
  lines.push('  baseType: ' + q(t.base) + ',');
  lines.push('  displayName: ' + q('[HRB] ' + t.name) + ',');
  lines.push('  description: ' + q(t.desc) + ',');
  if (t.behaviors && t.behaviors.length) lines.push('  compositionBehaviors: [' + t.behaviors.map(q).join(', ') + '],');
  if (t.mayContain && t.mayContain.length) lines.push('  mayContainTypes: [' + t.mayContain.map(q).join(', ') + '],');
  lines.push('  properties: {');
  t.props.forEach((pr, i) => lines.push(propLines(pr, i, byKey, t.key)));
  if (t.source) lines.push('    ...sourceFields(),');
  lines.push('  },');
  lines.push('});');
  tpls.forEach((tp) => { lines.push(''); lines.push(templateCode(tp)); });
  lines.push('');
  lines.push('type Props = { content: ContentProps<typeof ' + exportName(t) + '> };');
  lines.push('');
  lines.push('/** Render stub so `cms:push` and the registry work now. Phase 4 replaces it with the real component. */');
  if (t.base === '_experience') {
    lines.push('export default function ' + t.file + '({ content }: Props) {');
    lines.push('  // eslint-disable-next-line @typescript-eslint/no-explicit-any');
    lines.push('  const { pa } = getPreviewUtils(content as any);');
    lines.push('  // eslint-disable-next-line @typescript-eslint/no-explicit-any');
    lines.push('  const nodes = (content as any).composition?.nodes ?? [];');
    lines.push('  return (');
    lines.push('    // eslint-disable-next-line @typescript-eslint/no-explicit-any');
    lines.push('    <main {...pa(content as any)}>');
    lines.push('      <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />');
    lines.push('    </main>');
    lines.push('  );');
    lines.push('}');
  } else {
    const tag = t.base === '_page' ? 'main' : 'section';
    lines.push('export default function ' + t.file + '({ content }: Props) {');
    if (t.base === '_component') {
      lines.push('  const { pa } = getPreviewUtils(content);');
      lines.push('  const block = (content as { __composition?: { key: string } }).__composition;');
      lines.push('  return (');
      lines.push('    <' + tag + ' {...pa(block)} className="w-full px-6 py-12">');
    } else {
      lines.push('  // eslint-disable-next-line @typescript-eslint/no-explicit-any');
      lines.push('  const { pa } = getPreviewUtils(content as any);');
      lines.push('  return (');
      lines.push('    // eslint-disable-next-line @typescript-eslint/no-explicit-any');
      lines.push('    <' + tag + ' {...pa(content as any)} className="w-full px-6 py-12">');
    }
    lines.push('      <pre className="mx-auto max-w-6xl overflow-auto text-xs">{JSON.stringify(content, null, 2)}</pre>');
    lines.push('    </' + tag + '>');
    lines.push('  );');
    lines.push('}');
  }
  return lines.join('\n') + '\n';
}

const SOURCE_FIELDS_FILE = `/**
 * Source fields for the hrblock.com content rule (Build Plan 5.6).
 * Spread into a content type's \`properties\`: { ...sourceFields() }.
 * A .ts file, so the config push glob (cms .tsx files only) does not scan it.
 */
export function sourceFields(sortOrder = 900) {
  return {
    ContentTier: {
      type: 'string' as const,
      displayName: 'Content tier',
      description: 'A = mirrored from hrblock.com, B = authored from the allow-list, C = synthetic.',
      sortOrder,
      enum: [
        { value: 'A', displayName: 'A \\u00b7 Mirrored' },
        { value: 'B', displayName: 'B \\u00b7 Authored' },
        { value: 'C', displayName: 'C \\u00b7 Synthetic' },
      ],
    },
    SourceUrl: {
      type: 'url' as const,
      displayName: 'Source URL',
      description: 'The hrblock.com page this text was copied from.',
      sortOrder: sortOrder + 1,
    },
    SourceRetrieved: {
      type: 'dateTime' as const,
      displayName: 'Source retrieved',
      description: 'Date the source text was captured. Re-check at T-1 week.',
      sortOrder: sortOrder + 2,
    },
  };
}
`;

function layoutStylesFile() {
  const tpls = TEMPLATES.filter((x) => x.file === 'HrbLayoutStyles');
  return "import { displayTemplate } from '@optimizely/cms-sdk';\n\n/** Section, row and column styles. Sections use the SDK's BlankSection; there is no custom _section type. */\n" + tpls.map(templateCode).join('\n\n') + '\n';
}

function registryFile(types) {
  const gen = types.filter((t) => t.included && t.status !== 'existing');
  const imp = gen.map((t) => {
    const tpls = TEMPLATES.filter((x) => x.scope[0] === 'contentType' && x.scope[1] === t.key).map(tplName);
    return 'import ' + t.file + ', { ' + [exportName(t), ...tpls].join(', ') + " } from './" + t.file + "';";
  });
  const layout = TEMPLATES.filter((x) => x.file === 'HrbLayoutStyles').map(tplName);
  const allTpls = [...layout, ...TEMPLATES.filter((x) => x.scope[0] === 'contentType' && gen.some((t) => t.key === x.scope[1])).map(tplName)];
  return '// cms/registry.ts: additions for the H&R Block model. Merge into the existing file.\n'
    + imp.join('\n') + '\n'
    + 'import { ' + layout.join(', ') + " } from './HrbLayoutStyles';\n\n"
    + 'export const registeredContentTypes = [\n  BlankExperienceContentType,\n  BlankSectionContentType,\n  PageContentType,\n  RichTextContentType,\n'
    + gen.map((t) => '  ' + exportName(t) + ',').join('\n') + '\n];\n\n'
    + 'initContentTypeRegistry(registeredContentTypes);\n\n'
    + 'initDisplayTemplateRegistry([\n' + allTpls.map((n) => '  ' + n + ',').join('\n') + '\n]);\n\n'
    + 'initReactComponentRegistry({\n  resolver: {\n    BlankExperience,\n    BlankSection,\n    Page,\n    RichTextBlock: RichText,\n'
    + gen.map((t) => '    ' + t.key + ': ' + t.file + ',').join('\n') + '\n  },\n});\n';
}

function manifest(types, pages) {
  return JSON.stringify({
    model: 'H&R Block demo content model',
    repo: 'marvoey/opti-baseline#hrblock',
    sdk: '@optimizely/cms-sdk ^2.0.0',
    contentRule: 'Copy from hrblock.com and hrblock.com/tax-center/ only. Tier A mirrored, B authored from the allow-list, C synthetic. Long articles link out.',
    pages: PAGES.map((pg) => ({ name: pg.name, url: pg.url, archetype: pg.archetype, contentType: pg.type, status: pg.status, source: pg.source, usage: pages[pg.id] || pg.fixed ? countUsage(pages[pg.id], pg.fixed ? CATEGORY_PAGE : null) : undefined })),
    contentTypes: types.filter((t) => t.included).map((t) => ({ key: t.key, displayName: '[HRB] ' + t.name, baseType: t.base, compositionBehaviors: t.behaviors || [], status: t.status, sourceFields: !!t.source, properties: t.props.map((pr) => ({ key: pr.key, type: pr.type, ref: pr.ref, localized: pr.loc, required: pr.req, maxItems: pr.max })) })),
    displayTemplates: TEMPLATES.map((tp) => ({ key: tp.key, scope: { [tp.scope[0]]: tp.scope[1] }, isDefault: tp.isDefault, settings: tp.settings.map((s) => ({ key: s.key, choices: s.choices.map((c) => c[0]) })) })),
  }, null, 2);
}

/* ---------- Small UI pieces ---------- */
function Chip({ children, cls = 'bg-slate-100 text-slate-700', title }) {
  return <span title={title} className={'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ' + cls}>{children}</span>;
}
function TierChip({ tier }) {
  const t = TIER[tier];
  if (!t) return null;
  return <span className="absolute right-2 top-2 z-10 rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: t.bg, color: t.color }}>{t.label}</span>;
}
function Ext({ href, children, className = '' }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={'underline decoration-dotted underline-offset-2 hover:opacity-80 ' + className}>{children}</a>;
}
function CtaButton({ label, primary, dark, eventKey, showEvents }) {
  if (!label) return null;
  const style = primary
    ? dark ? { background: C.neon, color: C.dark } : { background: C.green, color: '#fff' }
    : dark ? { border: '1.5px solid #fff', color: '#fff' } : { border: '1.5px solid ' + C.green, color: C.green };
  const ev = eventKey && eventKey !== 'none' ? eventKey : null;
  return (
    <span className="inline-flex flex-col items-start">
      <span className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold" style={style} title={ev ? 'Event: ' + ev : 'No event'}>{label}</span>
      {showEvents && ev && <span className="mt-1 font-mono text-[10px] opacity-70">{'⚡ ' + ev}</span>}
    </span>
  );
}
function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text); return true; }
  } catch (e) { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    return true;
  } catch (e) { return false; }
}

/* ---------- Element renderers ---------- */
function ElementView({ el, ctx }) {
  let props = el.props || {};
  if (el.t === 'HRB_Hero' && el.variationDriven) props = { ...props, ...VARIATIONS[ctx.variation] };
  let fallback = false;
  let tier = el.tier;
  if (ctx.locale === 'es') {
    if (el.es) { props = { ...props, ...el.es }; if (el.esTier) tier = el.esTier; }
    else if (LOCALIZED_ELEMENTS.has(el.t)) fallback = true;
  }
  const dark = ctx.dark;
  const muted = dark ? 'opacity-85' : 'opacity-75';
  const accent = dark ? C.neon : C.green;
  const ev = ctx.showEvents;
  let body = null;

  switch (el.t) {
    case 'HRB_Hero':
      body = (
        <div className="py-6 md:py-10">
          {props.Eyebrow && <div className="mb-3 text-xs font-semibold tracking-[0.14em]" style={{ color: accent }}>{props.Eyebrow}</div>}
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">{props.Headline}</h1>
          {props.Subcopy && <p className={'mt-4 max-w-2xl text-base md:text-lg ' + muted}>{props.Subcopy}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaButton label={props.PrimaryCtaLabel} primary dark={dark} eventKey={props.PrimaryCtaEventKey} showEvents={ev} />
            <CtaButton label={props.SecondaryCtaLabel} dark={dark} eventKey={props.SecondaryCtaEventKey} showEvents={ev} />
          </div>
          {props.ShowCountdown && (
            <div className="mt-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ background: dark ? 'rgba(0,233,92,.15)' : '#E3F1E7', color: accent }}>
              {daysToApril15() + ' days to April 15 · computed, demo'}
            </div>
          )}
        </div>
      );
      break;
    case 'HRB_SectionHeading':
      body = (
        <div className="py-2">
          {props.Kicker && <div className="mb-2 text-xs font-semibold tracking-[0.14em] uppercase" style={{ color: accent }}>{props.Kicker}</div>}
          <h2 className="text-2xl font-semibold md:text-3xl">{props.Heading}</h2>
          {props.Intro && <p className={'mt-3 max-w-2xl ' + muted}>{props.Intro}</p>}
        </div>
      );
      break;
    case 'HRB_QuickLinks':
      body = (
        <div className="grid gap-3 md:grid-cols-3">
          {(props.Links || []).map((l, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border px-4 py-4 font-semibold" style={{ borderColor: dark ? 'rgba(255,255,255,.3)' : '#E3E1D6', color: dark ? '#fff' : C.green }}>
              <span>{l.Label}</span><span aria-hidden="true">{l.OpensInNewTab ? '↗' : '→'}</span>
            </div>
          ))}
        </div>
      );
      break;
    case 'HRB_OfferCard': {
      const featured = el.display && el.display.Emphasis === 'featured';
      body = (
        <div className="flex h-full flex-col rounded-2xl bg-white p-6 text-left" style={{ color: C.ink, border: featured ? '2px solid ' + C.green : '1px solid #E3E1D6' }}>
          <div className="text-[11px] font-semibold tracking-[0.12em]" style={{ color: C.green }}>{props.TierLabel}</div>
          <h3 className="mt-2 text-xl font-semibold">{props.Headline}</h3>
          {props.Subcopy && <p className="mt-2 text-sm opacity-80">{props.Subcopy}</p>}
          <ul className="mt-4 space-y-2 text-sm">
            {(props.Bullets || []).map((b, i) => <li key={i} className="flex gap-2"><span style={{ color: C.green }}>{'✓'}</span><span>{b}</span></li>)}
          </ul>
          <div className="mt-auto pt-6">
            <div className="text-xs opacity-70">{props.PricePrefix}</div>
            <div className="text-3xl font-semibold">{props.Price}</div>
            {props.PriceNote && <div className="mt-1 text-xs opacity-70">{props.PriceNote}</div>}
            <div className="mt-4 flex flex-wrap gap-2">
              <CtaButton label={props.PrimaryCtaLabel} primary eventKey={props.PrimaryCtaEventKey} showEvents={ev} />
              <CtaButton label={props.SecondaryCtaLabel} />
            </div>
          </div>
        </div>
      );
      break;
    }
    case 'HRB_TrustBar':
      body = (
        <div className="py-2">
          {props.Heading && <h2 className="mb-5 text-2xl font-semibold">{props.Heading}</h2>}
          <div className="grid gap-4 md:grid-cols-3">
            {(props.Claims || []).map((c, i) => (
              <div key={i} className="rounded-xl px-5 py-5 text-lg font-semibold leading-snug" style={{ background: dark ? 'rgba(255,255,255,.06)' : '#fff', color: dark ? '#fff' : C.green, border: dark ? 'none' : '1px solid #E3E1D6' }}>{c}</div>
            ))}
          </div>
        </div>
      );
      break;
    case 'HRB_Guarantees':
      body = (
        <div className="py-2">
          {props.Heading && <h2 className="mb-5 text-2xl font-semibold">{props.Heading}</h2>}
          <div className="grid gap-6 md:grid-cols-3">
            {(props.Items || []).map((g, i) => (
              <div key={i}>
                <div className="font-semibold" style={{ color: accent }}>{g.Title}</div>
                <p className={'mt-2 text-sm ' + muted}>{g.Text}</p>
              </div>
            ))}
          </div>
          {props.LinkLabel && <div className="mt-5 text-sm font-semibold" style={{ color: accent }}>{props.LinkLabel + ' →'}</div>}
        </div>
      );
      break;
    case 'HRB_Callout':
      body = (
        <div className="flex h-full items-start gap-4 rounded-2xl bg-white p-6" style={{ color: C.ink, border: '1px solid #E3E1D6' }}>
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: C.green }}>{props.Icon === 'myblock' ? 'M' : props.Icon === 'office' ? '⌂' : '•'}</div>
          <div>
            <div className="text-lg font-semibold">{props.Headline}</div>
            {props.Body && <p className="mt-1 text-sm opacity-75">{props.Body}</p>}
            <div className="mt-3"><CtaButton label={props.CtaLabel} eventKey={props.CtaEventKey} showEvents={ev} /></div>
          </div>
        </div>
      );
      break;
    case 'HRB_CtaBanner':
      body = (
        <div className="py-6 text-center">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold md:text-3xl">{props.Headline}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CtaButton label={props.PrimaryCtaLabel} primary dark={dark} eventKey={props.PrimaryCtaEventKey} showEvents={ev} />
            <CtaButton label={props.SecondaryCtaLabel} dark={dark} eventKey={props.SecondaryCtaEventKey} showEvents={ev} />
          </div>
        </div>
      );
      break;
    case 'HRB_ArticleCard':
      body = <ArticleCardView card={props} />;
      break;
    case 'HRB_ArticleList':
      body = (
        <div>
          {props.Heading && <h2 className="mb-5 text-2xl font-semibold">{props.Heading}</h2>}
          <div className="grid gap-4 md:grid-cols-3">
            {(props.Articles || []).map((id) => CARD_BY_ID[id] && <ArticleCardView key={id} card={CARD_BY_ID[id]} />)}
          </div>
          {props.MoreLinkLabel && <div className="mt-5 text-sm font-semibold" style={{ color: accent }}><Ext href={props.MoreLinkUrl}>{props.MoreLinkLabel + ' ↗'}</Ext></div>}
        </div>
      );
      break;
    case 'HRB_CategoryNav':
      body = (
        <div className="flex flex-wrap gap-2">
          {(props.Links || []).map((l, i) => (
            <a key={i} href={l.Url} target="_blank" rel="noopener noreferrer" className="rounded-full border px-4 py-2 text-sm font-semibold hover:opacity-80" style={{ borderColor: C.green, color: C.green, background: '#fff' }}>{l.Label + ' ↗'}</a>
          ))}
        </div>
      );
      break;
    case 'HRB_OfficeFinder':
      body = (
        <div className="py-2">
          {props.Heading && <h2 className="mb-4 text-2xl font-semibold">{props.Heading}</h2>}
          <div className="flex max-w-xl flex-wrap gap-2">
            <div className="flex-1 rounded-full border bg-white px-4 py-2.5 text-sm text-slate-400" style={{ borderColor: '#D6D3C4' }}>ZIP code</div>
            <CtaButton label={props.CtaLabel || 'Look for my office'} primary dark={dark} />
          </div>
          <p className={'mt-3 text-xs ' + muted}>Results come from the synthetic office directory (connected source hrbx).</p>
        </div>
      );
      break;
    case 'HRB_OfficeCard':
      body = (
        <div className="h-full rounded-2xl bg-white p-5" style={{ color: C.ink, border: '1px solid #E3E1D6' }}>
          <div className="font-semibold">{props.OfficeName}</div>
          <div className="mt-1 text-sm opacity-75">{[props.City, props.State].filter(Boolean).join(', ') + ' ' + (props.Zip || '')}</div>
          <div className="mt-3 text-sm font-semibold" style={{ color: C.green }}>{props.Availability}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {props.Bilingual && <Chip cls="bg-emerald-50 text-emerald-800">Bilingual pros</Chip>}
            <Chip cls="bg-violet-50 text-violet-800">Synthetic · hrbx</Chip>
          </div>
        </div>
      );
      break;
    case 'HRB_FaqList':
      body = <div className="rounded-xl border border-dashed p-6 text-sm opacity-70">FAQ List is deferred until real answers are captured from hrblock.com.</div>;
      break;
    case 'RichTextBlock':
      body = (
        <ul className="space-y-2 py-2">
          {(props.Body || []).map((line, i) => <li key={i} className="flex gap-2"><span style={{ color: accent }}>{'✓'}</span><span>{line.replace(/^- /, '')}</span></li>)}
        </ul>
      );
      break;
    default:
      body = <div className="rounded border border-dashed p-4 text-sm">{el.t}</div>;
  }

  return (
    <div className="relative">
      {ctx.showTiers && <TierChip tier={tier} />}
      {fallback && <span className="absolute left-2 top-2 z-10 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">en fallback</span>}
      {body}
    </div>
  );
}

function ArticleCardView({ card }) {
  return (
    <a href={card.ArticleUrl} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col rounded-2xl bg-white p-5 text-left hover:shadow-md" style={{ color: C.ink, border: '1px solid #E3E1D6' }}>
      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: C.green }}>
        <span>{card.CategoryLabel}</span>
        {card.HasVideo && <Chip cls="bg-emerald-50 text-emerald-800">Video</Chip>}
      </div>
      <div className="mt-2 font-semibold leading-snug">{card.Title}</div>
      <div className="mt-auto pt-4 text-xs opacity-60">{'Opens hrblock.com ↗'}</div>
    </a>
  );
}

/* ---------- Page preview ---------- */
function SiteFrame({ locale, children, onPage }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm" style={{ ...FONT, color: C.ink }}>
      <div className="flex gap-4 px-6 py-1.5 text-[11px] text-white" style={{ background: C.dark }}>
        <span className="font-semibold">H&amp;R Block</span><span className="opacity-75">Block Advisors</span><span className="opacity-75">Spruce</span>
        <span className="ml-auto opacity-60">{'Header and footer: siteConfig in code (Build Plan Phase 2)'}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-6 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2" title="Logo placeholder. Use the official files.">
            <span className="inline-block h-6 w-6 rounded-sm" style={{ background: C.logo }} />
            <span className="text-sm font-bold tracking-wide">{'H&R BLOCK'}</span>
          </div>
          <nav className="hidden gap-5 text-sm md:flex">
            {['Taxes', 'Financial products', 'Business services', 'Tools and resources'].map((n) => <span key={n}>{n}</span>)}
          </nav>
        </div>
        <div className="flex gap-4 text-sm">
          <span>Find an office</span><span>Search</span><span className="font-semibold" style={{ color: C.green }}>{locale === 'es' ? 'Mi cuenta' : 'Sign in to MyBlock'}</span>
        </div>
      </div>
      {children}
      <div className="px-6 py-6 text-xs text-white/80" style={{ background: C.dark }}>
        <div className="mb-2 font-semibold text-white">Compliance Disclosure (page property, shared block)</div>
        <p>{DISCLOSURE}</p>
      </div>
    </div>
  );
}

function SectionView({ s, ctx }) {
  const b = BG[s.bg] || BG.white;
  return (
    <section className="px-6 py-10 md:px-10" style={{ background: b.bg, color: b.fg }}>
      <div className="mx-auto max-w-6xl space-y-6">
        {s.rows.map((r) => (
          <div key={r.id} className={'grid gap-6 ' + (GRID[r.cols.length] || GRID[4])}>
            {r.cols.map((c) => (
              <div key={c.id} className="space-y-4">
                {c.els.map((el) => <ElementView key={el.id} el={el} ctx={{ ...ctx, dark: b.dark }} />)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryPageView({ data, ctx }) {
  return (
    <div>
      <section className="px-6 py-10 md:px-10" style={{ background: C.sand }}>
        <div className="relative mx-auto max-w-6xl">
          {ctx.showTiers && <TierChip tier="A" />}
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: C.green }}>Tax Information Center</div>
          <h1 className="text-3xl font-semibold md:text-4xl">{data.CategoryName}</h1>
          <p className="mt-3 max-w-2xl opacity-80">{data.Intro}</p>
          <div className="mt-4 text-sm font-semibold" style={{ color: C.green }}><Ext href={data.CategoryUrl}>{'See all Life Stages articles on hrblock.com ↗'}</Ext></div>
        </div>
      </section>
      <section className="bg-white px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Articles (fixed template, refArray of shared cards)</div>
          {data.Articles.length ? (
            <div className="grid gap-4 md:grid-cols-3">{data.Articles.map((id) => <ArticleCardView key={id} card={CARD_BY_ID[id]} />)}</div>
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-sm text-slate-600">
              No Life Stages cards yet. Capture the category label and title of each card from <Ext href={SRC.lifeStages}>/tax-center/life-stages/</Ext> first (Build Plan 5.6). Cards are never invented.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------- Outline editor ---------- */
function OutlineEditor({ sections, typesByKey, addable, onChange }) {
  const set = (fn) => { const next = clone(sections); fn(next); onChange(next); };
  return (
    <div className="space-y-3">
      {sections.map((s, si) => (
        <div key={s.id} className="rounded-lg border bg-white">
          <div className="flex flex-wrap items-center gap-1.5 border-b bg-slate-50 px-2 py-1.5 text-xs">
            <span className="font-semibold">{'Section ' + (si + 1)}</span>
            <span className="text-slate-400">BlankSection</span>
            <select className="ml-auto rounded border px-1 py-0.5" value={s.bg} onChange={(e) => set((n) => { n[si].bg = e.target.value; })} title="HRB_SectionStyle → Background">
              {Object.entries(BG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <button className="rounded px-1.5 hover:bg-slate-200" disabled={si === 0} onClick={() => set((n) => { const [x] = n.splice(si, 1); n.splice(si - 1, 0, x); })} title="Move up">{'↑'}</button>
            <button className="rounded px-1.5 hover:bg-slate-200" disabled={si === sections.length - 1} onClick={() => set((n) => { const [x] = n.splice(si, 1); n.splice(si + 1, 0, x); })} title="Move down">{'↓'}</button>
            <button className="rounded px-1.5 text-rose-600 hover:bg-rose-50" onClick={() => set((n) => { n.splice(si, 1); })} title="Delete section">{'✕'}</button>
          </div>
          <div className="space-y-2 p-2">
            {s.rows.map((r, ri) => (
              <div key={r.id} className="rounded border border-slate-200 p-1.5">
                <div className="mb-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <span>{'Row ' + (ri + 1) + ' · ' + r.cols.length + ' col'}</span>
                  <button className="ml-auto rounded px-1 hover:bg-slate-100" disabled={r.cols.length >= 4} onClick={() => set((n) => { n[si].rows[ri].cols.push({ id: uid(), els: [] }); })}>+ column</button>
                  <button className="rounded px-1 text-rose-600 hover:bg-rose-50" onClick={() => set((n) => { n[si].rows.splice(ri, 1); })}>{'✕'}</button>
                </div>
                <div className="space-y-1">
                  {r.cols.map((c, ci) => (
                    <div key={c.id} className="rounded bg-slate-50 p-1.5">
                      <div className="mb-1 flex items-center text-[10px] uppercase tracking-wide text-slate-400">
                        <span>{'Column ' + (ci + 1)}</span>
                        {r.cols.length > 1 && <button className="ml-auto text-rose-500" onClick={() => set((n) => { n[si].rows[ri].cols.splice(ci, 1); })}>{'✕'}</button>}
                      </div>
                      {c.els.map((el, ei) => {
                        const t = typesByKey[el.t];
                        const excluded = t && !t.included;
                        return (
                          <div key={el.id} className={'mb-1 flex items-center gap-1 rounded border bg-white px-1.5 py-1 text-xs ' + (excluded ? 'border-rose-300' : '')}>
                            <span className="font-medium">{t ? t.name : el.t}</span>
                            {el.variationDriven && <Chip cls="bg-amber-50 text-amber-800">variations</Chip>}
                            {excluded && <Chip cls="bg-rose-100 text-rose-700">excluded</Chip>}
                            <span className="ml-auto font-mono text-[10px] text-slate-400">{el.tier}</span>
                            <button className="text-rose-500" onClick={() => set((n) => { n[si].rows[ri].cols[ci].els.splice(ei, 1); })}>{'✕'}</button>
                          </div>
                        );
                      })}
                      <select className="w-full rounded border bg-white px-1 py-0.5 text-[11px] text-slate-600" value="" onChange={(e) => { const k = e.target.value; if (!k) return; set((n) => { n[si].rows[ri].cols[ci].els.push(SAMPLE[k]()); }); }}>
                        <option value="">+ add element</option>
                        {addable.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="w-full rounded border border-dashed py-1 text-[11px] text-slate-500 hover:bg-slate-50" onClick={() => set((n) => { n[si].rows.push({ id: uid(), cols: [{ id: uid(), els: [] }] }); })}>+ row</button>
          </div>
        </div>
      ))}
      <button className="w-full rounded-lg border border-dashed py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50" onClick={() => set((n) => { n.push({ id: uid(), bg: 'white', rows: [{ id: uid(), cols: [{ id: uid(), els: [] }] }] }); })}>+ section</button>
    </div>
  );
}

function outlineJson(page, sections, variation) {
  if (page.fixed) return { contentType: page.type, baseType: '_page', properties: { ...CATEGORY_PAGE, Disclosure: '→ HRB_ComplianceDisclosure (shared)' } };
  return {
    note: 'Planning outline for Visual Builder. Not the Graph response shape.',
    contentType: page.type,
    url: page.url,
    variation: page.variations ? variation : undefined,
    properties: { PageType: page.archetype, Disclosure: '→ HRB_ComplianceDisclosure (shared)' },
    composition: sections.map((s) => ({
      nodeType: 'section', type: 'BlankSection', displayTemplate: 'HRB_SectionStyle', settings: { Background: s.bg },
      rows: s.rows.map((r) => ({
        nodeType: 'row', displayTemplate: 'HRB_RowStyle',
        columns: r.cols.map((c) => ({
          nodeType: 'column',
          elements: c.els.map((el) => ({ nodeType: 'component', type: el.t, tier: el.tier, display: el.display, properties: el.variationDriven ? { ...el.props, ...VARIATIONS[variation] } : el.props })),
        })),
      })),
    })),
  };
}

/* ---------- App ---------- */
const TABS = [['pages', '1 · Page types'], ['components', '2 · Components'], ['assemble', '3 · Assemble'], ['matrix', '4 · Matrix'], ['export', '5 · Export']];

export default function App() {
  const [tab, setTab] = useState('pages');
  const [types, setTypes] = useState(() => INITIAL_TYPES.map((t) => ({ ...t, included: t.status !== 'deferred', props: t.props.map((x) => ({ ...x })) })));
  const [pages, setPages] = useState(() => clone(PAGE_COMPOSITIONS));
  const [pageId, setPageId] = useState('home');
  const [variation, setVariation] = useState('Original');
  const [locale, setLocale] = useState('en');
  const [showTiers, setShowTiers] = useState(true);
  const [showEvents, setShowEvents] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [typeKey, setTypeKey] = useState('HRB_Hero');
  const [fileKey, setFileKey] = useState('sourceFields.ts');
  const [copied, setCopied] = useState('');
  const [newProp, setNewProp] = useState({ key: '', type: 'string' });

  const byKey = useMemo(() => Object.fromEntries(types.map((t) => [t.key, t])), [types]);
  const usage = useMemo(() => Object.fromEntries(COMPOSABLE.map((pg) => [pg.id, countUsage(pages[pg.id], pg.fixed ? CATEGORY_PAGE : null)])), [pages]);
  const addable = types.filter((t) => t.included && SAMPLE[t.key]);
  const page = PAGES.find((x) => x.id === pageId);
  const selType = byKey[typeKey];

  const counts = {
    pages: types.filter((t) => t.included && t.group === 'page').length,
    elements: types.filter((t) => t.included && (t.group === 'element' || t.group === 'data')).length,
    shared: types.filter((t) => t.included && t.group === 'shared').length,
    templates: TEMPLATES.length,
  };

  const files = useMemo(() => {
    const out = [['sourceFields.ts', SOURCE_FIELDS_FILE], ['HrbLayoutStyles.tsx', layoutStylesFile()]];
    types.filter((t) => t.included && t.status !== 'existing').forEach((t) => out.push([t.file + '.tsx', typeFile(t, byKey)]));
    out.push(['registry.additions.ts', registryFile(types)]);
    out.push(['hrb-content-model.json', manifest(types, pages)]);
    return out;
  }, [types, byKey, pages]);
  const fileMap = Object.fromEntries(files);
  const currentFile = fileMap[fileKey] !== undefined ? fileKey : files[0][0];

  const issues = useMemo(() => {
    const list = [];
    types.filter((t) => t.included).forEach((t) => {
      const seen = new Set();
      t.props.forEach((pr) => {
        if (!/^[A-Z][A-Za-z0-9]*$/.test(pr.key)) list.push(['warn', t.key + '.' + (pr.key || '(empty)') + ': use PascalCase letters and digits, like the repo types.']);
        if (seen.has(pr.key)) list.push(['error', t.key + ': duplicate property ' + pr.key + '.']);
        seen.add(pr.key);
        if (REF_TYPES.includes(pr.type)) {
          if (!pr.ref) list.push(['error', t.key + '.' + pr.key + ': choose an allowed type.']);
          else if (byKey[pr.ref] && !byKey[pr.ref].included) list.push(['warn', t.key + '.' + pr.key + ' allows ' + pr.ref + ', which is excluded. Export falls back to the key string.']);
        }
      });
    });
    COMPOSABLE.forEach((pg) => {
      Object.keys(usage[pg.id] || {}).forEach((k) => { if (byKey[k] && !byKey[k].included) list.push(['warn', pg.name + ' uses ' + byKey[k].name + ', which is excluded from the model.']); });
    });
    return list;
  }, [types, byKey, usage]);

  const updateType = (key, fn) => setTypes((prev) => prev.map((t) => (t.key === key ? fn({ ...t, props: t.props.map((x) => ({ ...x })) }) : t)));
  const doCopy = (label, text) => { if (copyText(text)) { setCopied(label); setTimeout(() => setCopied(''), 1500); } };
  const openPage = (id, loc) => { setPageId(id); if (loc) setLocale(loc); setTab('assemble'); };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800" style={FONT}>
      {/* Header */}
      <header className="text-white" style={{ background: C.dark }}>
        <div className="mx-auto max-w-7xl px-5 py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-[0.16em]" style={{ color: C.neon }}>H&amp;R BLOCK DEMO · CMS SAAS CONTENT MODEL</div>
              <h1 className="mt-1 text-2xl font-semibold">Content model prototype</h1>
              <p className="mt-1 text-sm text-white/75">Branch hrblock · @optimizely/cms-sdk 2.x · copy from hrblock.com and the Tax Center only</p>
            </div>
            <div className="flex flex-wrap gap-2 text-center text-xs">
              {[['Page types', counts.pages], ['Elements', counts.elements], ['Shared / nested', counts.shared], ['Display templates', counts.templates]].map(([l, n]) => (
                <div key={l} className="rounded-lg bg-white/10 px-3 py-2"><div className="text-lg font-semibold">{n}</div><div className="text-white/70">{l}</div></div>
              ))}
            </div>
          </div>
          <nav className="mt-5 flex flex-wrap gap-1">
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className="rounded-t-lg px-4 py-2 text-sm font-semibold" style={tab === k ? { background: '#f1f5f9', color: C.dark } : { color: 'rgba(255,255,255,.8)' }}>{l}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {/* ---------------- Page types ---------------- */}
        {tab === 'pages' && (
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-5">
              <h2 className="text-lg font-semibold">Step 1: the pages the demo needs</h2>
              <p className="mt-1 text-sm text-slate-600">Nine page archetypes map to <b>two</b> page content types. Six composed pages share one Visual Builder experience type; the archetype is a property. One editorial listing uses a fixed <code>_page</code>. Articles are linked, not modeled, and Spanish is a locale.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PAGES.map((pg) => {
                const u = usage[pg.id];
                const used = u ? Object.keys(u).filter((k) => u[k] > 0 && byKey[k] && k !== 'HRB_ComplianceDisclosure').map((k) => byKey[k].name) : [];
                return (
                  <div key={pg.id} className="flex flex-col rounded-xl border bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold">{pg.name}</div>
                        <div className="font-mono text-xs text-slate-500">{pg.url}</div>
                      </div>
                      <Chip cls={STATUS[pg.status].cls}>{STATUS[pg.status].label}</Chip>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                      <Chip>{pg.archetype}</Chip>
                      {pg.type && pg.type !== 'locale' && <Chip cls="bg-emerald-50 text-emerald-900"><span className="font-mono">{pg.type}</span></Chip>}
                      {pg.type && byKey[pg.type] && <Chip cls="bg-slate-100 text-slate-600"><span className="font-mono">{byKey[pg.type].base}</span></Chip>}
                      {pg.variations && <Chip cls="bg-amber-50 text-amber-800">6 variations</Chip>}
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{pg.why}</p>
                    {used.length > 0 && <p className="mt-2 text-xs text-slate-500"><b>Built from:</b> {used.join(', ')}</p>}
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-xs">
                      <Ext href={pg.source} className="text-emerald-800">{'Source page ↗'}</Ext>
                      {(PAGE_COMPOSITIONS[pg.id] || pg.fixed) && <button className="ml-auto rounded-full px-3 py-1 font-semibold text-white" style={{ background: C.green }} onClick={() => openPage(pg.id, 'en')}>{'Assemble →'}</button>}
                      {pg.id === 'spanish' && <button className="ml-auto rounded-full px-3 py-1 font-semibold text-white" style={{ background: C.green }} onClick={() => openPage('home', 'es')}>{'Preview Home in es →'}</button>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl border bg-white p-5">
              <h3 className="font-semibold">Modeling rules this prototype follows</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                <li><b>One experience type for composed pages.</b> Home, campaign, product, offices and hub differ in composition, not in fields, so the archetype is a <code>PageType</code> choice property.</li>
                <li><b>No custom section type.</b> The SDK marks <code>_section</code> as internal, so sections use <code>BlankSection</code> with the <code>HRB_SectionStyle</code> display template. This replaces <code>cms/HrbSection.tsx</code> in the Build Plan. <i>Verify</i> in Visual Builder.</li>
                <li><b>Headings are elements.</b> Section content properties are not delivered in Graph composition queries, so a Section Heading element carries them.</li>
                <li><b>Buttons are label + URL pairs.</b> Link Item properties do not auto-translate in CMS SaaS, and Spanish needs translatable labels.</li>
                <li><b>Prices are strings</b> so "$0", "$65" and "$99" stay exactly as published.</li>
                <li><b>Choice properties are not localized</b> (event keys, archetype, icon). You have seen CMS SaaS translate choice values, so check that Spanish versions keep the English keys. <i>Verify.</i></li>
                <li><b>Source fields on mirrored items:</b> <code>ContentTier</code>, <code>SourceUrl</code>, <code>SourceRetrieved</code> via <code>sourceFields()</code> (Build Plan 5.6).</li>
                <li><b>Article cards are shared and link out.</b> Lists reference them, so one card can appear on the hub and a category page.</li>
                <li><b>The disclosure is a required page property</b>, not a block editors have to remember to place.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ---------------- Components ---------------- */}
        {tab === 'components' && (
          <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
            <aside className="space-y-4">
              {GROUPS.map(([g, label]) => (
                <div key={g} className="rounded-xl border bg-white p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
                  <div className="space-y-1">
                    {types.filter((t) => t.group === g).map((t) => (
                      <div key={t.key} className={'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ' + (t.key === typeKey ? 'bg-emerald-50' : 'hover:bg-slate-50')}>
                        <input type="checkbox" checked={t.included} disabled={t.status === 'existing'} onChange={(e) => updateType(t.key, (x) => ({ ...x, included: e.target.checked }))} title="Include in the model and export" />
                        <button className="flex-1 text-left" onClick={() => setTypeKey(t.key)}>
                          <span className={t.included ? '' : 'text-slate-400 line-through'}>{t.name}</span>
                        </button>
                        <Chip cls={STATUS[t.status].cls}>{STATUS[t.status].label}</Chip>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-xl border bg-white p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Display templates</div>
                {TEMPLATES.map((tp) => (
                  <div key={tp.key} className="py-1 text-sm">
                    <div className="font-mono text-xs">{tp.key}</div>
                    <div className="text-xs text-slate-500">{tp.scope[0] + ': ' + tp.scope[1] + ' · ' + tp.settings.map((s) => s.key).join(', ')}</div>
                  </div>
                ))}
              </div>
            </aside>

            {selType && (
              <section className="space-y-4">
                <div className="rounded-xl border bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">{'[HRB] ' + selType.name}</h2>
                      <div className="mt-1 font-mono text-xs text-slate-500">{selType.key + ' · cms/' + selType.file + '.tsx'}</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Chip cls="bg-slate-800 text-white"><span className="font-mono">{selType.base}</span></Chip>
                      {(selType.behaviors || []).map((b) => <Chip key={b} cls="bg-emerald-50 text-emerald-900">{b}</Chip>)}
                      <Chip cls={STATUS[selType.status].cls}>{STATUS[selType.status].label}</Chip>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">{selType.desc}</p>
                  <p className="mt-2 text-sm text-slate-600"><b>Why:</b> {selType.why}</p>
                  {selType.mayContain && selType.mayContain.length > 0 && <p className="mt-2 text-xs text-slate-500"><b>May contain (child pages):</b> <span className="font-mono">{selType.mayContain.join(', ')}</span></p>}
                  <p className="mt-2 text-xs text-slate-500"><b>Used on:</b> {COMPOSABLE.filter((pg) => usage[pg.id] && usage[pg.id][selType.key]).map((pg) => pg.name + ' (' + usage[pg.id][selType.key] + ')').join(', ') || (selType.group === 'page' ? COMPOSABLE.filter((pg) => pg.type === selType.key).map((pg) => pg.name).join(', ') : 'not placed yet')}</p>
                </div>

                <div className="rounded-xl border bg-white p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Properties</h3>
                    {selType.source && <span className="text-xs text-slate-500">+ ContentTier, SourceUrl, SourceRetrieved via <code>sourceFields()</code></span>}
                  </div>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-500">
                          <th className="py-2 pr-2">Key</th><th className="py-2 pr-2">Type</th><th className="py-2 pr-2">Allowed / choices</th><th className="py-2 pr-2">Localized</th><th className="py-2 pr-2">Required</th><th className="py-2 pr-2">Notes</th><th />
                        </tr>
                      </thead>
                      <tbody>
                        {selType.props.map((pr, i) => (
                          <tr key={i} className="border-b align-top">
                            <td className="py-1.5 pr-2">
                              <input className="w-36 rounded border px-1.5 py-0.5 font-mono text-xs" value={pr.key} disabled={selType.status === 'existing'} onChange={(e) => updateType(selType.key, (t) => { t.props[i].key = e.target.value; return t; })} />
                            </td>
                            <td className="py-1.5 pr-2">
                              <select className="rounded border px-1 py-0.5 text-xs" value={pr.type} disabled={selType.status === 'existing'} onChange={(e) => updateType(selType.key, (t) => { const v = e.target.value; t.props[i].type = v; if (v === 'enum' && !t.props[i].enum) t.props[i].enum = [['option1', 'Option 1']]; if (REF_TYPES.includes(v) && !t.props[i].ref) t.props[i].ref = 'HRB_ArticleCard'; return t; })}>
                                {PROP_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                              </select>
                            </td>
                            <td className="py-1.5 pr-2 text-xs">
                              {REF_TYPES.includes(pr.type) ? (
                                <select className="rounded border px-1 py-0.5 font-mono text-xs" value={pr.ref || ''} disabled={selType.status === 'existing'} onChange={(e) => updateType(selType.key, (t) => { t.props[i].ref = e.target.value; return t; })}>
                                  {types.filter((t) => t.base === '_component').map((t) => <option key={t.key} value={t.key}>{t.key}</option>)}
                                </select>
                              ) : pr.type === 'enum' ? <span className="font-mono">{(pr.enum || []).map((c) => c[0]).join(' | ')}</span>
                                : pr.type === 'event' ? <span className="font-mono">{EVENTS.map((c) => c[0]).join(' | ')}</span>
                                  : pr.type === 'image' ? <span className="font-mono">_image</span> : <span className="text-slate-300">{'—'}</span>}
                              {pr.max ? <div className="mt-0.5 text-slate-500">{'max ' + pr.max}</div> : null}
                            </td>
                            <td className="py-1.5 pr-2"><input type="checkbox" checked={!!pr.loc} disabled={selType.status === 'existing'} onChange={(e) => updateType(selType.key, (t) => { t.props[i].loc = e.target.checked; return t; })} /></td>
                            <td className="py-1.5 pr-2"><input type="checkbox" checked={!!pr.req} disabled={selType.status === 'existing'} onChange={(e) => updateType(selType.key, (t) => { t.props[i].req = e.target.checked; return t; })} /></td>
                            <td className="max-w-xs py-1.5 pr-2 text-xs text-slate-500">{pr.desc}</td>
                            <td className="py-1.5">{selType.status !== 'existing' && <button className="text-rose-500" onClick={() => updateType(selType.key, (t) => { t.props.splice(i, 1); return t; })} title="Remove property">{'✕'}</button>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {selType.status !== 'existing' && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <input className="w-40 rounded border px-2 py-1 font-mono" placeholder="NewPropertyKey" value={newProp.key} onChange={(e) => setNewProp({ ...newProp, key: e.target.value })} />
                      <select className="rounded border px-1 py-1" value={newProp.type} onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}>
                        {PROP_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                      <button className="rounded-full px-3 py-1 font-semibold text-white disabled:opacity-40" style={{ background: C.green }} disabled={!newProp.key} onClick={() => {
                        updateType(selType.key, (t) => { t.props.push(p(newProp.key, newProp.type, newProp.key, { loc: newProp.type === 'string' || newProp.type === 'richText', ref: REF_TYPES.includes(newProp.type) ? 'HRB_ArticleCard' : undefined, enum: newProp.type === 'enum' ? [['option1', 'Option 1']] : undefined })); return t; });
                        setNewProp({ key: '', type: 'string' });
                      }}>+ Add property</button>
                    </div>
                  )}
                </div>

                {TEMPLATES.filter((tp) => tp.scope[1] === selType.key).map((tp) => (
                  <div key={tp.key} className="rounded-xl border bg-white p-5 text-sm">
                    <h3 className="font-semibold">{'Display template: ' + tp.key}</h3>
                    <ul className="mt-2 space-y-1 text-slate-600">
                      {tp.settings.map((s) => <li key={s.key}><span className="font-mono">{s.key}</span>{': ' + s.choices.map((c) => c[1]).join(', ')}</li>)}
                    </ul>
                  </div>
                ))}
                {selType.notes && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <ul className="list-disc space-y-1 pl-5">{selType.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* ---------------- Assemble ---------------- */}
        {tab === 'assemble' && page && (
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-4">
              <div className="space-y-3 rounded-xl border bg-white p-4 text-sm">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Page</span>
                  <select className="mt-1 w-full rounded border px-2 py-1.5" value={pageId} onChange={(e) => setPageId(e.target.value)}>
                    {COMPOSABLE.map((pg) => <option key={pg.id} value={pg.id}>{pg.name + ' · ' + pg.url}</option>)}
                  </select>
                </label>
                <div className="font-mono text-xs text-slate-500">{page.type + (byKey[page.type] ? ' · ' + byKey[page.type].base : '')}</div>
                {page.variations && (
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">CMS variation (flag value)</span>
                    <select className="mt-1 w-full rounded border px-2 py-1.5" value={variation} onChange={(e) => setVariation(e.target.value)}>
                      {Object.keys(VARIATIONS).map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                )}
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex overflow-hidden rounded-full border">
                    {['en', 'es'].map((l) => <button key={l} className="px-3 py-1 font-semibold" style={locale === l ? { background: C.green, color: '#fff' } : {}} onClick={() => setLocale(l)}>{l}</button>)}
                  </div>
                  <label className="flex items-center gap-1"><input type="checkbox" checked={showTiers} onChange={(e) => setShowTiers(e.target.checked)} />Tiers</label>
                  <label className="flex items-center gap-1"><input type="checkbox" checked={showEvents} onChange={(e) => setShowEvents(e.target.checked)} />Event keys</label>
                  <label className="flex items-center gap-1"><input type="checkbox" checked={showJson} onChange={(e) => setShowJson(e.target.checked)} />Outline JSON</label>
                </div>
                {locale === 'es' && <p className="rounded bg-violet-50 p-2 text-xs text-violet-900">Spanish copy exists only for the Home hero and header (from /espanol/). Everything marked "en fallback" shows English until real Spanish copy is captured.</p>}
              </div>
              {page.fixed ? (
                <div className="rounded-xl border bg-white p-4 text-sm text-slate-600">Fixed <code>_page</code> template: no Visual Builder composition. Editors fill the properties; the layout is in code.</div>
              ) : (
                <OutlineEditor sections={pages[pageId]} typesByKey={byKey} addable={addable} onChange={(next) => setPages((prev) => ({ ...prev, [pageId]: next }))} />
              )}
              <button className="w-full rounded-lg border bg-white py-2 text-xs text-slate-600 hover:bg-slate-50" onClick={() => setPages((prev) => ({ ...prev, [pageId]: clone(PAGE_COMPOSITIONS[pageId] || []) }))}>Reset this page</button>
            </aside>
            <section className="space-y-4">
              <SiteFrame locale={locale}>
                {page.fixed ? <CategoryPageView data={CATEGORY_PAGE} ctx={{ showTiers }} /> : (pages[pageId] || []).map((s) => <SectionView key={s.id} s={s} ctx={{ locale, variation, showTiers, showEvents }} />)}
              </SiteFrame>
              {showJson && (
                <div className="rounded-xl border bg-slate-900 p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                    <span>Composition outline</span>
                    <button className="rounded bg-white/10 px-2 py-1" onClick={() => doCopy('outline', JSON.stringify(outlineJson(page, pages[pageId] || [], variation), null, 2))}>{copied === 'outline' ? 'Copied' : 'Copy'}</button>
                  </div>
                  <pre className="max-h-96 overflow-auto text-[11px] leading-relaxed text-emerald-200">{JSON.stringify(outlineJson(page, pages[pageId] || [], variation), null, 2)}</pre>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ---------------- Matrix ---------------- */}
        {tab === 'matrix' && (
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Which components assemble which pages</h2>
            <p className="mt-1 text-sm text-slate-600">Counts come from the current compositions in Assemble, including nested items (link items, guarantee items, referenced article cards) and the disclosure each page references.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-slate-500">
                    <th className="py-2 pr-3">Component</th>
                    {COMPOSABLE.map((pg) => <th key={pg.id} className="px-2 py-2 text-center">{pg.name}</th>)}
                    <th className="px-2 py-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {types.filter((t) => t.group !== 'page').map((t) => {
                    const row = COMPOSABLE.map((pg) => (usage[pg.id] && usage[pg.id][t.key]) || 0);
                    const total = row.reduce((a, b) => a + b, 0);
                    return (
                      <tr key={t.key} className={'border-b ' + (t.included ? '' : 'text-slate-400')}>
                        <td className="py-1.5 pr-3"><div className="font-medium">{t.name}</div><div className="font-mono text-[10px] text-slate-400">{t.key}</div></td>
                        {row.map((n, i) => <td key={i} className="px-2 py-1.5 text-center">{n ? <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white" style={{ background: C.green }}>{n}</span> : <span className="text-slate-200">{'·'}</span>}</td>)}
                        <td className="px-2 py-1.5 text-center font-semibold">{total || (t.status === 'deferred' ? 'deferred' : '0')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- Export ---------------- */}
        {tab === 'export' && (
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <aside className="space-y-4">
                <div className="rounded-xl border bg-white p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{'Files for cms/ (' + files.length + ')'}</div>
                  {files.map(([name]) => (
                    <button key={name} onClick={() => setFileKey(name)} className={'block w-full rounded px-2 py-1 text-left font-mono text-xs ' + (name === currentFile ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50')}>{name}</button>
                  ))}
                </div>
                <div className="rounded-xl border bg-white p-4 text-xs text-slate-700">
                  <div className="mb-2 font-semibold">Push to the CMS</div>
                  <ol className="list-decimal space-y-1.5 pl-4">
                    <li>On a branch off <code>hrblock</code> (<code>hrb/content-model</code>), copy the files into <code>cms/</code>.</li>
                    <li>Merge <code>registry.additions.ts</code> into <code>cms/registry.ts</code>.</li>
                    <li><code>yarn cms:push</code>, then <code>yarn cms:check</code> (scripts in package.json, CMS client credentials in your local <code>.env</code> only).</li>
                    <li>Open the CMS: the <code>[HRB]</code> types and the six display templates should appear.</li>
                  </ol>
                </div>
              </aside>
              <section className="rounded-xl border bg-slate-900">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-slate-300">
                  <span className="font-mono">{'cms/' + currentFile}</span>
                  <button className="rounded bg-white/10 px-2 py-1 hover:bg-white/20" onClick={() => doCopy(currentFile, fileMap[currentFile])}>{copied === currentFile ? 'Copied' : 'Copy file'}</button>
                </div>
                <pre className="max-h-[640px] overflow-auto p-4 text-[11px] leading-relaxed text-emerald-100">{fileMap[currentFile]}</pre>
              </section>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <h3 className="font-semibold">Checks</h3>
              {issues.length === 0 ? <p className="mt-2 text-sm text-emerald-700">No issues in the current model.</p> : (
                <ul className="mt-2 space-y-1 text-sm">
                  {issues.map(([lvl, msg], i) => <li key={i} className={lvl === 'error' ? 'text-rose-700' : 'text-amber-700'}>{(lvl === 'error' ? 'Error: ' : 'Warning: ') + msg}</li>)}
                </ul>
              )}
              <h3 className="mt-5 font-semibold">Verify before pushing</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>The generated code follows the SDK source on GitHub (property types, <code>displayTemplate()</code> settings). Your repo pins <code>^2.0.0</code>; run <code>yarn tsc --noEmit</code> after copying.</li>
                <li>Arrays of inline <code>content</code> items (Quick Links, Category Nav, Guarantees) and arrays of <code>contentReference</code> (Article List): confirm Graph returns the nested properties, or resolve them with <code>expandReferences()</code>.</li>
                <li>A display template scoped to <code>baseType: '_section'</code> applies to BlankSection in Visual Builder.</li>
                <li>Office Card binding to the hrbx source (Phase 5, <code>POST /v1/contenttypebindings</code>).</li>
                <li>Removing or changing a property that has content is breaking and needs <code>cms:push:all</code> (Build Plan Section 8).</li>
              </ul>
            </div>
          </div>
        )}
      </main>
      <footer className="pb-8 text-center text-xs text-slate-500">Copy as read on hrblock.com, 16 Nov 2026. Re-check prices and offers at T-1 week. Offices and results are synthetic.</footer>
    </div>
  );
}
