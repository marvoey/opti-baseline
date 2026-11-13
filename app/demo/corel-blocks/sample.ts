/**
 * Sample content for every Corel block, ported from app/demo/mock/page.tsx and
 * shaped like Optimizely Graph results (links are `{ text, url: { default } }`,
 * rich text is `{ json }`). Renders the real CMS components without needing any
 * content in the CMS, and doubles as the reference when seeding real pages.
 *
 * Loosely typed on purpose (`Block.content` is untyped): this is demo data.
 */

export type Block = { type: string; content: Record<string, unknown> };
export type PageKey = 'home' | 'product' | 'offers' | 'trials' | 'learn' | 'support';

const CD = 'https://www.coreldraw.com';
const L = (text: string, path: string) => ({
  text,
  title: text,
  target: null,
  url: { default: path.startsWith('http') ? path : CD + path },
});
const RT = (...paras: string[]) => ({
  json: { type: 'richText', children: paras.map((p) => ({ type: 'paragraph', children: [{ text: p }] })) },
});
const S = '/static/cdgs/product_content/cdgs/2026';

/* ---------- shared item data ---------- */
const customers = [
  { Quote: "As the world's largest supplier of specialized sign-making tools, Yellotools uses CorelDRAW to design innovative, time-saving solutions to common industry problems.", Name: 'Yellotools', Role: 'Tool manufacturer for sign makers, Germany', ImageUrl: `${S}/featured-customer/yellowtools.png` },
  { Quote: 'Based in Stockholm, Stefan relies on Corel PHOTO-PAINT to create impressive illustrations for editorial clients, ad agencies, and publishers.', Name: 'Stefan Lindblad', Role: 'Illustrator and graphic artist, Sweden', ImageUrl: `${S}/featured-customer/stefan-lindblad.png` },
  { Quote: 'Bitsy & Company creates graphic novels that inspire and challenge cultural roots.', Name: 'Bitsy & Company', Role: 'Web comics and graphic novels, USA', ImageUrl: `${S}/featured-customer/bitsy.png` },
  { Quote: 'Fahnen Eibl uses their craftsmanship and CorelDRAW’s production technology to create high-quality flags.', Name: 'Kunststickerei Eibl GmbH', Role: 'Flag production and artistic embroidery, Germany' },
];
const logos = ['Telefonica', 'Unilever', 'Daimler', 'Petrobras', 'Abbott', 'Glencore', 'Pfizer'].map((n) => ({
  Title: n,
  ImageUrl: `/static/cdgs/images/customer-logos/${n.toLowerCase()}.png`,
}));
const awards = [
  ['G2 Vector Graphics – Leader', 'G2 Vector Graphics', 'g2-leader-fall-2024'],
  ['G2 Vector Graphics – Momentum Leader', 'G2 Vector Graphics', 'g2-momentum-2024'],
  ['G2 Photo Editing – Leader', 'G2 Photo Editing', 'g2-leader-2024'],
  ['G2 Photo Editing – High Performer', 'G2 Photo Editing', 'g2-high-performer-2024'],
].map(([Title, Caption, f]) => ({ Title, Caption, ImageUrl: `/static/cdgs/product_content/cdgs/2025/${f}.png` }));
const tryCards = ['Text-to-vector AI', 'AI background removal', 'Text-to-image AI', 'Start with a template', 'Turn an image into vector', 'Try Focus Mode', 'Make a sticker', 'Create an icon'].map(
  (Title, i) => ({ Title, Link: L(Title, `/dl/try${i}/`) }),
);
const releases = [
  { Group: 'September 2026', Title: 'Text-to-vector AI', Description: 'Turn text prompts or existing artwork into editable, scalable vector graphics with generative AI.', Link: L('Try now', '/dl/ttvpp/') },
  { Group: 'September 2026', Title: 'Enhanced PowerTRACE', Description: 'Improved object structure and precise AI-powered background removal deliver cleaner results.', Link: L('Try now', '/dl/ptpp/') },
  { Group: 'September 2026', Title: 'Upload fonts in CorelDRAW Web', Description: 'Upload and use custom, brand, and system fonts in CorelDRAW Web, a subscriber exclusive.' },
  { Group: 'March 2026', Title: 'Text-to-image AI', Description: 'Create original AI-generated images from text prompts using leading AI models.', Link: L('Try now', '/dl/aigpp/') },
  { Group: 'March 2026', Title: 'AI masking', Description: 'Create precise masks with intelligent subject selection and clip masking.' },
  { Group: 'March 2026', Title: 'Modernized UI', Description: 'A refreshed, more intuitive user interface with improved navigation.' },
];
const apps = [
  { Name: 'CorelDRAW®', Subtitle: 'Vector illustration and page layout', Description: 'Create anything and everything with this powerful, full-featured software for graphic design.', ImageUrl: `${S}/icon-coreldraw.png` },
  { Name: 'Corel PHOTO-PAINT™', Subtitle: 'Image editing and pixel-based design', Description: 'Process images in high gear with the robust AI-powered Corel PHOTO-PAINT.', ImageUrl: `${S}/icon-photo-paint.png` },
  { Name: 'Corel® Font Manager', Subtitle: 'Font exploration and management', Description: 'Organize and manage your font library without having to install fonts.', ImageUrl: `${S}/icon-font-manager.png` },
  { Name: 'CorelDRAW® Web', Subtitle: 'Browser-based vector illustration', Description: 'Design on the go. Save projects to the cloud and access them from any browser.', ImageUrl: `${S}/icon-cdgs-web.png`, SubscriberExclusive: true },
];
const included = {
  IncludedContent: ['7,000 clipart, digital images, and vehicle wrap templates', '1,000 high-resolution digital photos', 'Over 1,000 TrueType and OpenType fonts', 'Integrated access to Pantone® Color Libraries'],
  IncludedCredits: ['Subscription: 2,000/month', 'One-time purchase: 2,000 (one-time)'],
};
const ratings = [
  { Source: 'Capterra', Score: '4.5/5', Link: L('Capterra', 'https://www.capterra.com/p/124823/CorelDRAW/') },
  { Source: 'G2', Score: '4.3/5', Link: L('G2', 'https://www.g2.com/products/coreldraw/reviews') },
  { Source: 'SourceForge', Score: '4.5/5', Link: L('SourceForge', 'https://sourceforge.net/software/product/CorelDRAW/') },
];
const faq = (q: string, ...a: string[]) => ({ Question: q, Answer: RT(...a) });

/* ---------- blocks ---------- */
const trialCta = L('Try free', 'https://web.coreldraw.com/?content=trial');

const heroHome: Block = {
  type: 'CorelHeroSplit',
  content: {
    Eyebrow: 'NEW! CorelDRAW Graphics Suite 2026', Title: 'Professional graphic design software',
    Body: 'Powerful tools for vector illustration, layout, photo editing, and typography.',
    PromoLabel: 'BLACK FRIDAY STARTS EARLY', PromoText: 'Save 30%. Limited-time offer.',
    PrimaryCta: trialCta, SecondaryCta: L('Buy now', '/en/product/coreldraw/'),
    Note: 'Available for Windows, Mac, and Web', ArtworkCredit: 'Éder Minetto', ImageUrl: '/static/cdgs/images/home/cdgs-2026-hero.png',
  },
};
const tiers: Block = {
  type: 'CorelTierCards',
  content: {
    Title: 'Graphic design options for all skill levels', Cta: L('Help me decide', '/en/product/family/'),
    Tiers: [
      { Level: 'QUICK & EASY', Name: 'CorelDRAW Go', SaveLabel: 'Save 30%', Link: L('Learn more', '/en/product/go/'), Features: ['Beginner-friendly design app', 'Templates, assets, and easy vector tools', 'Great for quick, one-off projects'], Apps: ['CorelDRAW Go'] },
      { Level: 'ADVANCED', Name: 'CorelDRAW Standard', SaveLabel: 'Save $45', Link: L('Learn more', '/en/product/coreldraw/standard/'), Features: ['For enthusiasts and home businesses', 'Vector illustration plus photo editing', 'Great for logos and signage'], Apps: ['CorelDRAW Standard', 'Corel PHOTO-PAINT Standard'] },
      { Level: 'PROFESSIONAL', Name: 'CorelDRAW Graphics Suite', SaveLabel: 'Save 30%', Popular: true, Link: L('Learn more', '/en/product/coreldraw/'), Features: ['Built for Windows, Mac, and web', 'Vector layout, photo editing, and type tools', 'Great for professional design work'], Apps: ['CorelDRAW', 'CorelDRAW Web', 'Corel PHOTO-PAINT', 'Corel Font Manager'] },
    ],
  },
};
const testimonials: Block = { type: 'CorelTestimonialCarousel', content: { Stories: customers, Cta: L('Customer stories', '/en/pages/customer-stories/') } };
const marquee: Block = { type: 'CorelLogoMarquee', content: { Title: 'You’re in good company', Subtitle: 'Join millions of users across thousands of global organizations who use CorelDRAW.', Logos: logos } };
const ctaDark: Block = { type: 'CorelCtaBanner', content: { Title: 'Test drive CorelDRAW for FREE, no credit card required!', Cta: L('Learn more', '/en/free-trials/') } };
const ctaLight: Block = { type: 'CorelCtaBanner', content: { Theme: 'light', Title: 'Test drive CorelDRAW for FREE, no credit card required!', Cta: L('Learn more', '/en/free-trials/') } };
const awardsStrip: Block = { type: 'CorelAwardsStrip', content: { Awards: awards } };
const ratingsFull: Block = {
  type: 'CorelRatings',
  content: {
    LeftTitle: 'Our competitive advantage', LeftLead: 'Enjoy all-in-one design and layout, a native OS experience, flexible purchasing options, free integrated Pantone® colors, and so much more.',
    LeftBody: 'Easy to learn and packed with unique features, CorelDRAW Graphics Suite is a powerful alternative to comparable graphic design software.',
    Subheading: 'Check out reviews from satisfied graphics pros and design teams around the globe.', Ratings: ratings,
  },
};
const ratingsOnly: Block = { type: 'CorelRatings', content: { Subheading: 'Check out reviews from satisfied graphics pros and design teams around the globe.', Ratings: ratings } };
const releaseCarousel = (withTitle: boolean): Block => ({
  type: 'CorelCardCarousel',
  content: { Title: 'What’s new in CorelDRAW Graphics Suite 2026?', Subtitle: withTitle ? 'Powered by Artist Intelligence™' : undefined, Cards: releases, Cta: withTitle ? L('Compare purchase options', '/en/product/coreldraw/compare/') : undefined },
});
const tryCarousel = (title: string): Block => ({ type: 'CorelCardCarousel', content: { Variant: 'tile', Title: title, Cards: tryCards } });

const PRODUCT: Block[] = [
  {
    type: 'CorelProductHero',
    content: {
      Badge: 'New', Title: 'CorelDRAW Graphics Suite 2026', Subtitle: 'Professional graphic design software for Windows, Mac, and Web',
      Body: 'Fuel your creative fire with professional graphics software—designed to get the job done.', TrialCta: L('Try free for 15 days', 'https://web.coreldraw.com/?content=trial'),
      RatingCount: '1020', AiNoteLabel: 'NEW THIS YEAR', AiNoteTitle: 'Includes generative AI with Text-to-vector', AiNoteSub: 'Powered by Artist Intelligence™',
      VatNote: '(incl. VAT)', UpgradeLink: L('Looking to upgrade?', '/en/pages/upgrade/'), FeaturesLink: L('Subscription-exclusive features', '#compare'),
      RenewLink: L('Renew subscription', 'https://account.corel.com/accounts/user/accountSubscriptions'), BusinessLink: L('Buy for business', '/en/licensing/business/'),
      Plans: [
        { Label: 'Annual Plan', Tag: 'New in 2026', Headline: '$15.42/mo', Blurb: 'Subscribe and for just $15.42/mo, get the latest version, exclusive apps and features, monthly AI credits, and more.', SaveLabel: 'Save 30%', Price: '$185.00', Unit: '/year', WasPrice: '$269.00', Cta: L('Subscribe now', 'https://store.coreldraw.com/1103/purl-CDGSSUBPUREPREM2'), ShowSubscriptionLinks: true, PromoTitle: 'Black Friday Starts Early', PromoText: 'Save 30% on your first year of the annual plan.' },
        { Label: 'Monthly Plan', Tag: 'New in 2026', Headline: '$39.00/mo', Blurb: 'Subscribe for $39/mo to access the latest version, exclusive cloud features, and more.', Price: '$39.00', Unit: '/month', Cta: L('Subscribe now', 'https://store.coreldraw.com/1103/purl-CDGSSUBPUREPREM1'), ShowSubscriptionLinks: true },
        { Label: 'One-Time Purchase', Tag: '2026 version', Headline: '$379.00', Blurb: 'Buy it once, own it forever.', SaveLabel: 'Save 30%', Price: '$379.00', WasPrice: '$549.00', Cta: L('Buy now', 'https://store.coreldraw.com/1103/purl-ESDCDGS2026ML'), PromoTitle: 'Black Friday Starts Early', PromoText: 'Save 30%.' },
      ],
    },
  },
  { type: 'CorelSubNav', content: { Title: 'CorelDRAW Graphics Suite', Links: [L('Overview', '#prod-hero'), L("What's New", '#whats-new'), L('Features', '#features'), L('Compare', '#compare'), L('Specs', '#tech-specs'), L('FAQ', '#faq')], Cta: L('Buy now', '#prod-hero') } },
  { type: 'CorelIntroSplit', content: { Title: 'Creativity meets productivity', Body: RT('CorelDRAW® Graphics Suite is your fully loaded, professional design toolkit for delivering breathtaking vector illustration, layout, photo editing, and typography projects with total efficiency.', 'A budget-friendly subscription provides ongoing value with instant access to exclusive apps, features, content, AI credits, and support for the latest technologies.'), ImageUrl: `${S}/creativity-meets-productivity.png` } },
  awardsStrip,
  { type: 'CorelAppGrid', content: { Title: 'All the tools you need to tackle any project', Apps: apps, ...included } },
  { type: 'CorelCardGrid', content: { Title: 'The sky is the limit!', Items: [{ Title: 'Branding and marketing', Description: 'Create everything from brand identity assets to alluring sales tools.' }, { Title: 'Signage and large-format printing', Description: 'Artwork for a variety of print outputs using a powerful color management engine.' }, { Title: 'Apparel and textiles', Description: 'Screen printing, embroidery, direct-to-garment printing or apparel.' }] } },
  marquee, testimonials, ratingsFull,
  releaseCarousel(true),
  { type: 'CorelFeatureSpotlight', content: { Title: 'Accelerate your ideas with intelligent design tools', LeadTitle: 'Generate vectors with AI', LeadBody: 'Transform ideas into editable, scalable vectors in seconds with the new Text-to-vector feature.', Items: [{ Title: 'Generate images with AI', Description: 'Create unique AI-generated bitmaps from scratch or existing content.' }, { Title: 'Remix images with AI', Description: 'Quickly edit and transform images with near-instant photo edits.' }, { Title: 'Remove backgrounds with AI', Description: 'One-click AI background removal with clean results.' }, { Title: 'Mask photos with AI', Description: 'AI-assisted subject selection and clip masking.' }] } },
  tryCarousel('Start designing with CorelDRAW'),
  { type: 'CorelCardGrid', content: { Variant: 'icon', Title: 'Professional design tools at your fingertips', Subtitle: 'Core capabilities', Items: [{ Title: 'Vector illustration', Description: 'Turn basic lines and shapes into complex works of art.' }, { Title: 'Page layout', Description: 'Create layouts for brochures and multi-page documents.' }, { Title: 'Typography', Description: 'Arrange type beautifully with block shadows, contours and more.' }], SliderTitle: 'What sets CorelDRAW apart', SliderItems: [{ Title: 'Design for print or web', Description: 'Master color consistency across media.' }, { Title: 'Non-destructive editing', Description: 'Apply reversible adjustments and effects.' }, { Title: 'Bitmap-to-vector tracing', Description: 'Exceptional trace results with AI-assisted PowerTRACE.' }] } },
  {
    type: 'CorelComparisonTable',
    content: {
      Title: 'From new features to content, subscribers get more', Subtitle: 'As a subscriber, you get access to exclusive features, apps, content, and AI credits.',
      CornerLabel: 'CorelDRAW Graphics Suite – Version Comparison Matrix', Column1Label: 'Subscription', Column2Label: 'One-time purchase', Cta: L('See full comparison', '/en/product/coreldraw/compare/'),
      Rows: [
        { Group: 'Value, access, and support', Label: 'CorelDRAW Web', Description: 'Browser-based vector illustration and graphic design', Col1Type: 'yes', Col2Type: 'no' },
        { Group: 'Value, access, and support', Label: 'Generative AI credits', Description: 'Included credits for prompt-based image creation and editing.', Col1Type: 'text', Col1Text: '2,000 monthly credits', Col2Type: 'text', Col2Text: '2,000 one-time credits' },
        { Group: 'Value, access, and support', Label: 'Product ownership', Col1Type: 'no', Col2Type: 'yes' },
        { Group: 'Tools, features, and content', Label: 'Layout tools', Col1Type: 'yes', Col2Type: 'yes' },
        { Group: 'Tools, features, and content', Label: 'Drawing tools', Col1Type: 'yes', Col2Type: 'yes' },
      ],
    },
  },
  { type: 'CorelFaqAccordion', content: { Items: [faq('What is CorelDRAW Graphics Suite?', 'CorelDRAW Graphics Suite is a professional graphic design software solution for Windows, Mac, and web.'), faq('How much does CorelDRAW Graphics Suite cost?', 'It depends on the purchasing option you choose. Try it free for 15 days—no credit card required!'), faq('Does CorelDRAW have generative AI?', 'Yes! AI Generate turns text descriptions into custom vectors and images in seconds.')] } },
  {
    type: 'CorelTechSpecs',
    content: {
      Specs: [
        { Group: 'Windows', Heading: 'Operating system', Detail: 'Windows 11 or Windows 10, 64-bit, with the latest updates' }, { Group: 'Windows', Heading: 'Memory', Detail: '8 GB RAM (16 GB or higher recommended)' },
        { Group: 'Mac', Heading: 'Operating system', Detail: 'macOS Tahoe (26), Sequoia (15), or Sonoma (14)' }, { Group: 'Mac', Heading: 'Memory', Detail: '8 GB RAM (16 GB or higher recommended)' },
        { Group: 'Web', GroupNote: 'CorelDRAW Web – browser requirements', Heading: 'Google Chrome', Detail: 'Version 142 or higher' }, { Group: 'Web', Heading: 'Microsoft Edge', Detail: 'Version 142 or higher' },
      ],
    },
  },
  { type: 'CorelGalleryGrid', content: { Title: 'Graphic design gallery', Subtitle: 'Find inspiration in our online gallery, featuring images from CorelDRAW artists and designers from around the world.', Images: ['Maycon Bartowski', 'Joseph Diaz', 'Tomasz Mroziński', 'Five Nine', 'Marco Mastrelli', 'Samuel Leon', 'Rage Designs', 'OCTO'].map((Caption) => ({ Caption, Title: Caption })) } },
  { type: 'CorelCtaBanner', content: { Title: 'Push the boundaries of visual communication with CorelDRAW Graphics Suite', Cta: trialCta } },
];

export const PAGES: Record<PageKey, { label: string; blocks: Block[] }> = {
  home: { label: 'Home', blocks: [heroHome, tiers, testimonials, marquee, ctaDark] },
  product: { label: 'Product', blocks: PRODUCT },
  offers: {
    label: 'Special offers',
    blocks: [
      { type: 'CorelHeroSplit', content: { Theme: 'dark', Eyebrow: 'New', Title: 'CorelDRAW Graphics Suite', Body: 'A complete suite of applications for vector illustration, layout, photo editing, and more on your platform of choice.', PromoLabel: 'BLACK FRIDAY STARTS EARLY', PromoText: 'Save 30%. Limited-time offer.', PrimaryCta: L('Buy now', '/en/product/coreldraw/'), ArtworkCredit: 'Éder Minetto', ImageUrl: '/static/cdgs/images/home/cdgs-2026-hero.png' } },
      {
        type: 'CorelOfferCards',
        content: {
          Title: 'Black Friday deals on Graphics products',
          Offers: [
            { Name: 'CorelDRAW Graphics Suite 365‑day Subscription', Description: 'A low cost option to always stay current', SaveLabel: 'Save 30%', PromoText: 'Save 30% on your first year of the annual plan.', WasPrice: '$269.00', Price: '$185.00', Unit: '/year', Popular: true, Link: L('Buy now', '/en/product/coreldraw/') },
            { Name: 'CorelDRAW Technical Suite', Description: 'High-impact technical design software from concept to completion', Price: '$1,199.00', Link: L('Buy now', '/en/product/technical-suite/') },
            { Name: 'CorelDRAW Standard', Description: 'Graphic design for enthusiasts and home businesses', SaveLabel: 'Save $45', PromoText: 'Save $45.', WasPrice: '$299.00', Price: '$254.00', Link: L('Buy now', '/en/product/coreldraw/standard/') },
            { Name: 'CorelDRAW Go', Description: 'Intuitive web-based graphic design app that goes beyond templates', SaveLabel: 'Save 30%', WasPrice: '$99.99', Price: '$69.99', Unit: '/year', Link: L('Buy now', '/en/product/go/') },
          ],
        },
      },
      ctaLight,
    ],
  },
  trials: {
    label: 'Free trials',
    blocks: [
      { type: 'CorelTrialHero', content: { Title: 'Try CorelDRAW free for 15 days', Body: 'Create vector illustrations, layouts, and more with our professional graphic design software. Start a 15-day free trial, including AI credits.', Cta: trialCta, CtaNote: 'No credit card required!', LearnMoreLink: L('Learn more', '/en/product/coreldraw/'), FormIntro: 'Enter your email address to access your trial and get started.', ConsentText: 'I agree that the companies of Corel Corporation or local business partners can contact me regarding their products, services, and events. I can withdraw my consent at any time.', SubmitLabel: 'Download', SuccessTitle: "You're close!", SuccessBody: 'We’ve emailed you the trial, so it’s all set for you to access the next time you’re on your computer.' } },
      tryCarousel('Login and try with CorelDRAW'),
      releaseCarousel(false),
      { type: 'CorelIncludedApps', content: { Title: 'What’s included in CorelDRAW Graphics Suite 2026', PrimaryApp: { ...apps[0], Bullets: ['All-in-one design and layout', 'Professional vector illustration tools', 'AI-powered vector and image generation'] }, AlsoIncluded: [{ ...apps[3], Description: 'Design on the go in your browser' }, { ...apps[1], Description: 'Edit, retouch, and enhance photos' }, { ...apps[2], Description: 'Find, organize, and manage fonts' }], ...included } },
      { type: 'CorelSplitCta', content: { Title: 'Try CorelDRAW in your browser, no downloads or installation needed.', Cta: trialCta, Note: '*Note that this trial excludes some CorelDRAW features and all of the other applications that come with a CorelDRAW Graphics Suite purchase.', SecondaryLead: 'Looking to try even more features and applications?', SecondaryLink: L('Try the full CorelDRAW Graphics Suite', 'https://www.corel.com/en/free-trials/'), SecondarySuffix: 'on Windows or Mac.' } },
      awardsStrip, ratingsOnly,
    ],
  },
  learn: {
    label: 'Learning center',
    blocks: [
      { type: 'CorelSubNav', content: { Variant: 'dark', Title: 'Learning Center', TitleLink: L('Learning Center', '/en/learn/'), Links: [L('Tutorials', '/en/learn/tutorials/'), L('Webinars & e-Books', '/en/learn/webinars/'), L('How-tos', '/en/learn/how-to/'), L('Customer Stories', '/en/pages/customer-stories/'), L('Gallery', '/en/learn/gallery/')] } },
      { type: 'CorelPageBanner', content: { Title: 'CorelDRAW Learning Center', Body: 'So many ways to learn! See how you can get the most out of your CorelDRAW products with extensive insight into specific tools and features along with helpful tips and tricks.' } },
      { type: 'CorelIconLinkCards', content: { Overlap: true, Items: [{ Title: 'CorelDRAW Academy', Description: 'Free Corel-certified resources for creatives of all skill levels.', Link: L('Open', '/en/learn/academy/'), Icon: 'book' }, { Title: 'Tutorials', Description: 'In-depth learning content for a variety of design topics.', Link: L('Open', '/en/learn/tutorials/'), Icon: 'cog' }, { Title: 'Webinars & e-Books', Description: 'Free online workshops on using tools and features.', Link: L('Open', '/en/learn/webinars/'), Icon: 'users' }, { Title: 'How-tos', Description: 'Step-by-step guides for popular design tasks.', Link: L('Open', '/en/learn/how-to/'), Icon: 'star' }] } },
      { type: 'CorelIconLinkCards', content: { Variant: 'inspire', Title: 'Get inspired', Items: [{ Title: 'Customer stories', Description: 'Discover how real businesses and organizations rely on the graphic design power of CorelDRAW.', Link: L('Read stories', '/en/pages/customer-stories/') }, { Title: 'Gallery', Description: 'Find inspiration in our diverse collection of artwork by CorelDRAW artists.', Link: L('View gallery', '/en/learn/gallery/') }, { Title: 'Top Tips', Description: 'Accelerate and customize your design process with simple tips from training experts.', Link: L('Watch videos', '/en/learn/tutorials/tips/') }] } },
    ],
  },
  support: {
    label: 'Support',
    blocks: [
      { type: 'CorelPageBanner', content: { ShowSearch: true, SearchPlaceholder: 'Search support articles…', SearchUrl: 'https://support.corel.com/hc/en-us/search?query=', Title: 'Welcome to CorelDRAW support', Body: 'Click below for frequently asked questions, documentation and other helpful tools to get the answers you need.' } },
      { type: 'CorelIconLinkCards', content: { Overlap: true, Columns: '5', Items: [{ Title: 'Install & activate', Description: 'Tutorials for product installation', Link: L('Open', '/en/support/install-and-activate/'), Icon: 'cog' }, { Title: 'Download', Description: 'Patches & Updates', Link: L('Open', '/en/support/updates/'), Icon: 'download' }, { Title: 'Orders', Description: 'Buy, inquire, return', Link: L('Open', '/en/support/orders/'), Icon: 'box' }, { Title: 'Your account', Description: 'Update your profile, register a product and more', Link: L('Open', '/en/support/your-account/'), Icon: 'user' }, { Title: 'Discovery Center', Description: 'Your home for creative learning', Link: L('Open', 'https://learn.corel.com/'), Icon: 'book' }] } },
      { type: 'CorelAnnouncements', content: { Links: [L('CorelDRAW Web – Frequently Asked Questions (FAQ)', 'https://kb.corel.com/en/130067'), L('CorelDRAW Go – Frequently Asked Questions (FAQ)', 'https://kb.corel.com/en/130319'), L('Artificial Intelligence (AI) in CorelDRAW products – FAQ', 'https://kb.corel.com/en/131069')] } },
      {
        type: 'CorelContactOptions',
        content: {
          Cards: [
            { Icon: 'users', Title: 'CorelDRAW Communities', Description: 'Meet, share and learn from other users in our online communities.', PrimaryLink: L('CorelDRAW', 'https://community.coreldraw.com/'), SecondaryLink: L('CorelDRAW Go', 'https://community.go.corel.com/') },
            { Icon: 'ticket', Title: 'Create Support ticket', Description: 'Email us and receive a response within 24 hours', PrimaryLink: L('Submit a ticket', 'https://support.corel.com/hc/en-us/requests/new') },
            { Icon: 'chat', Title: 'Chat', Description: 'Start a chat session with a Corel agent', PrimaryLink: L('Start Chat', 'https://www.corel.com/contact/') },
            { Icon: 'phone', Title: 'Call', PhoneNumber: '1-844-759-9903', ShowDirectory: true },
          ],
          Directory: [
            { Region: 'North America', Country: 'United States', PhoneNumber: '1-844-759-9903' }, { Region: 'North America', Country: 'Canada', PhoneNumber: '1-866-341-0059' },
            { Region: 'Europe', Country: 'United Kingdom', PhoneNumber: '+44 808 189 9383' }, { Region: 'Europe', Country: 'France', PhoneNumber: '+33 805 08 0202' }, { Region: 'Europe', Country: 'Germany', PhoneNumber: '+49 800 000 1399' },
          ],
        },
      },
    ],
  },
};
