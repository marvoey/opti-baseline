/**
 * Seed data for the Corel pages: media manifest, shared blocks and page layouts.
 * Transcribed from the FULL constants in app/demo/mock/page.tsx (not the trimmed
 * app/demo/corel-blocks/sample.ts).
 *
 * Conventions
 *  - Image props are `media('<id>')`, resolved to a `cms://content/<key>` reference
 *    once the image has been uploaded; ids index MEDIA below.
 *  - Links are `{ url, text, title, target }` (CMS link property). Mock-internal
 *    routes become site-relative paths to the new pages; everything else is an
 *    absolute coreldraw.com URL, exactly as the mock's S() helper did.
 *  - Rich text is `html(...)` (escaped HTML); item arrays are plain objects. The seed script
 *    encodes everything into the REST shape ({ value }, { properties }, { html }).
 *  - Block display names are `Corel / <Page> / <Block>` — unique, so the seed is idempotent.
 */

export const ASSET_ORIGIN = 'https://www.coreldraw.com';

/* ----------------------------------------------------------------- helpers */

const ROUTES = {
  '/en/': '/',
  '/en/product/coreldraw/': '/product/',
  '/en/special-offers/': '/special-offers/',
  '/en/free-trials/': '/free-trials/',
  '/en/learn/': '/learn/',
  '/en/support/': '/support/',
};

/** Mock href → CMS href (internal route, fragment, absolute URL, or coreldraw.com path). */
export const href = (h) => {
  if (h.startsWith('#')) return h;
  if (/^https?:\/\//i.test(h)) return h;
  return ROUTES[h.split('?')[0]] ?? ASSET_ORIGIN + h;
};
export const link = (text, h) => ({ url: href(h), text, title: '', target: '' });

/** Placeholder replaced by `cms://content/<key>` after upload. */
export const media = (id) => ({ __media: id });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Rich text value; encoded as `{ html }` for the REST API. */
export const html = (...paras) => ({ __html: paras.map((p) => `<p>${esc(p)}</p>`).join('') });

/* ------------------------------------------------------------------- media */

const CDGS = '/static/cdgs/product_content/cdgs';
const LEARN = '/static/cdgs/images/learn';

/** id → { path (on coreldraw.com), name (CMS display name) } */
export const MEDIA = {
  intro: { path: `${CDGS}/2026/creativity-meets-productivity.png`, name: 'Creativity meets productivity' },
  hero: { path: '/static/cdgs/images/home/cdgs-2026-hero.png', name: 'CorelDRAW Graphics Suite 2026 hero (artwork: Éder Minetto)' },

  'award-1': { path: `${CDGS}/2025/g2-leader-fall-2024.png`, name: 'G2 Vector Graphics – Leader' },
  'award-2': { path: `${CDGS}/2025/g2-momentum-2024.png`, name: 'G2 Vector Graphics – Momentum Leader' },
  'award-3': { path: `${CDGS}/2025/g2-sb-2024.png`, name: 'G2 Vector Graphics – Leader Small Business' },
  'award-4': { path: `${CDGS}/2025/g2-leader-2024.png`, name: 'G2 Photo Editing – Leader' },
  'award-5': { path: `${CDGS}/2025/g2-high-performer-2024.png`, name: 'G2 Photo Editing – High Performer' },
  'award-6': { path: `${CDGS}/2024/g2-photo-editing-easiest-admin-summer-2024.png`, name: 'G2 Photo Editing – Easiest Admin' },
  'award-7': { path: `${CDGS}/2025/g2-leader-sb-2024.png`, name: 'G2 Photo Editing – Leader Small Business' },

  'app-draw': { path: `${CDGS}/2026/icon-coreldraw.png`, name: 'App icon: CorelDRAW' },
  'app-photo': { path: `${CDGS}/2026/icon-photo-paint.png`, name: 'App icon: Corel PHOTO-PAINT' },
  'app-fonts': { path: `${CDGS}/2026/icon-font-manager.png`, name: 'App icon: Corel Font Manager' },
  'app-web': { path: `${CDGS}/2026/icon-cdgs-web.png`, name: 'App icon: CorelDRAW Web' },

  'logo-telefonica': { path: '/static/cdgs/images/customer-logos/telefonica.png', name: 'Customer logo: Telefonica' },
  'logo-unilever': { path: '/static/cdgs/images/customer-logos/unilever.png', name: 'Customer logo: Unilever' },
  'logo-daimler': { path: '/static/cdgs/images/customer-logos/daimler.png', name: 'Customer logo: Daimler' },
  // The mock spells this file "pertrobras"; the preflight tries both spellings.
  'logo-petrobras': { path: '/static/cdgs/images/customer-logos/pertrobras.png', alt: ['/static/cdgs/images/customer-logos/petrobras.png'], name: 'Customer logo: Petrobras' },
  'logo-abbott': { path: '/static/cdgs/images/customer-logos/abbott.png', name: 'Customer logo: Abbott' },
  'logo-glencore': { path: '/static/cdgs/images/customer-logos/glencore.png', name: 'Customer logo: Glencore' },
  'logo-pfizer': { path: '/static/cdgs/images/customer-logos/pfizer.png', name: 'Customer logo: Pfizer' },

  'cust-yellotools': { path: `${CDGS}/2026/featured-customer/yellowtools.png`, name: 'Featured customer: Yellotools' },
  'cust-stefan': { path: `${CDGS}/2026/featured-customer/stefan-lindblad.png`, name: 'Featured customer: Stefan Lindblad' },
  'cust-bitsy': { path: `${CDGS}/2026/featured-customer/bitsy.png`, name: 'Featured customer: Bitsy & Company' },

  'offer-sub': { path: '/static/cdgs/product_content/product-icons/cdgs/cdgs-sub-icon-on-light-250x250.png', name: 'Offer: CorelDRAW Graphics Suite subscription' },
  'offer-ts': { path: '/static/cdgs/product_content/product-icons/cdgs/CDTS-balloon-on-white.png', name: 'Offer: CorelDRAW Technical Suite' },
  'offer-std': { path: '/static/cdgs/product_content/product-icons/cdgs/CorelDRAW-standard-on-white.png', name: 'Offer: CorelDRAW Standard' },
  'offer-go': { path: '/static/cdgs/product_content/product-icons/cdgo/cdgo-sub-on-white-tm.png', name: 'Offer: CorelDRAW Go' },

  'learn-academy': { path: `${LEARN}/ico-academy.svg`, name: 'Learn icon: Academy' },
  'learn-tutorials': { path: `${LEARN}/ico-tutorials.svg`, name: 'Learn icon: Tutorials' },
  'learn-webinars': { path: `${LEARN}/ico-webinars.svg`, name: 'Learn icon: Webinars' },
  'learn-hints': { path: `${LEARN}/ico-hints.svg`, name: 'Learn icon: How-tos' },
  'learn-cs': { path: `${LEARN}/ico-cs.svg`, name: 'Learn icon: Customer stories' },
  'learn-gallery': { path: `${LEARN}/ico-gallery.svg`, name: 'Learn icon: Gallery' },
  'learn-dc': { path: `${LEARN}/ico-dc.svg`, name: 'Learn icon: Discovery Center' },
  'learn-vector': { path: `${LEARN}/ico-vector.svg`, name: 'Learn icon: Guide to vector design' },
  'learn-tips': { path: `${LEARN}/icon-tips.svg`, name: 'Learn icon: Top tips' },
};

/* ------------------------------------------------------------- shared data */

const TRIAL = link('Try free', 'https://web.coreldraw.com/?content=trial');

const AWARDS = [
  ['award-1', 'G2 Vector Graphics – Leader', 'G2 Vector Graphics'],
  ['award-2', 'G2 Vector Graphics – Momentum Leader', 'G2 Vector Graphics'],
  ['award-3', 'G2 Vector Graphics – Leader Small Business', 'G2 Vector Graphics'],
  ['award-4', 'G2 Photo Editing – Leader', 'G2 Photo Editing'],
  ['award-5', 'G2 Photo Editing – High Performer', 'G2 Photo Editing'],
  ['award-6', 'G2 Photo Editing – Easiest Admin', 'G2 Photo Editing'],
  ['award-7', 'G2 Photo Editing – Leader Small Business', 'G2 Photo Editing'],
].map(([id, Title, Caption]) => ({ Title, Caption, Image: media(id) }));

const APPS = [
  { id: 'app-draw', Name: 'CorelDRAW®', Subtitle: 'Vector illustration and page layout', Description: 'Create anything and everything with this powerful, full-featured software for graphic design, including vector illustration, page layout, and more.' },
  { id: 'app-photo', Name: 'Corel PHOTO-PAINT™', Subtitle: 'Image editing and pixel-based design', Description: 'Process images in high gear with the robust AI-powered Corel PHOTO-PAINT. Enjoy an integrated workflow with CorelDRAW.' },
  { id: 'app-fonts', Name: 'Corel® Font Manager', Subtitle: 'Font exploration and management', Description: 'Organize and manage your font library with the simple, yet intuitive, Corel Font Manager. Use your favorite fonts without having to install them.' },
  { id: 'app-web', Name: 'CorelDRAW® Web', Subtitle: 'Browser-based vector illustration and graphic design', Description: 'Design on the go with CorelDRAW Web. Save your projects to the cloud and access them online, from any web browser.', SubscriberExclusive: true },
];
const appItem = ({ id, ...rest }) => ({ ...rest, Image: media(id) });

const INCLUDED = {
  IncludedContent: [
    '7,000 clipart, digital images, and vehicle wrap templates',
    '1,000 high-resolution digital photos',
    'Over 1,000 TrueType and OpenType fonts plus integrated access to over 1,700 Google Fonts families',
    'Over 200 professionally designed templates (plus 600+ additional templates for subscribers)',
    'Over 600 fountain, vector and bitmap fills',
    'Integrated access to Pantone® Color Libraries at no additional cost',
    'Over 100 Painterly brushes (plus 150 additional free brushes for subscribers)',
  ],
  IncludedCredits: ['Subscription: 2,000/month', 'One-time purchase: 2,000 (one-time)'],
};

const RATINGS = [
  { Source: 'Capterra', Score: '4.5/5', Link: link('Capterra', 'https://www.capterra.com/p/124823/CorelDRAW/') },
  { Source: 'G2', Score: '4.3/5', Link: link('G2', 'https://www.g2.com/products/coreldraw/reviews') },
  { Source: 'SourceForge', Score: '4.5/5', Link: link('SourceForge', 'https://sourceforge.net/software/product/CorelDRAW/') },
];
const RATINGS_SUB = 'Check out reviews from satisfied graphics pros and design teams around the globe.';

const TRY_CARDS = [
  ['Text-to-vector AI', '/dl/ttvpp/'], ['AI background removal', '/dl/bgmp/'], ['Text-to-image AI', '/dl/aigmp/'], ['Start with a template', '/dl/swttp/'],
  ['Turn an image into vector', '/dl/pttp/'], ['Try pixel-based brushes', '/dl/pbttp/'], ['Try Focus Mode', '/dl/fmtp/'], ['Make a sticker', '/dl/cstp/'],
  ['Create an icon', '/dl/citp/'], ['Design a greeting card', '/dl/gctp/'], ['Add a block shadow', '/dl/bstp/'],
].map(([Title, h]) => ({ Title, Link: link(Title, h) }));

const RELEASES = [
  ['September 2026', 'Text-to-vector AI', 'Turn text prompts or existing artwork into editable, scalable vector graphics with generative AI.', '/dl/ttvpp/'],
  ['September 2026', 'Enhanced PowerTRACE', 'Improved object structure, better color handling, and precise AI-powered background removal deliver cleaner results with fully editable shapes.', '/dl/ptpp/'],
  ['September 2026', 'Upload fonts in CorelDRAW Web', 'Upload and use custom, brand, and system fonts in CorelDRAW Web, a subscriber exclusive.'],
  ['September 2026', 'DWG and DXF export in CorelDRAW Web', 'Subscribers can export DWG and DXF files directly from the browser for production-ready output.'],
  ['September 2026', 'Enhanced stability and performance', 'Work faster and more reliably with ongoing performance improvements and smoother handling of complex files.'],
  ['March 2026', 'Text-to-image AI', 'Create original AI-generated images from text prompts using leading AI models, styles, and color palettes.', '/dl/aigpp/'],
  ['March 2026', 'AI image remixing', 'Reimagine existing images with prompt-based photo editing and visual remixing.'],
  ['March 2026', 'AI background removal', 'Remove image backgrounds in one click with clean results, even around fine details.', '/dl/bgpp/'],
  ['March 2026', 'AI masking', 'Create precise masks with intelligent subject selection and clip masking.'],
  ['March 2026', 'Quality and performance improvements', 'App launch times around three times faster, plus smoother workflows and fewer interruptions.'],
  ['March 2026', 'Modernized UI', 'A refreshed, more intuitive user interface with improved navigation and refined controls.'],
  ['March 2026', 'CorelDRAW Web updates', 'Improved performance and usability, plus new AI tools.'],
  ['March 2026', 'More content', 'Additional subscriber-exclusive brushes and templates.'],
].map(([Group, Title, Description, h]) => ({ Group, Title, Description, ...(h ? { Link: link('Try now', h) } : {}) }));

/* ------------------------------------------------------------------ blocks */

/** id → { page, name, type, props } — every block is a section-enabled shared component. */
export const BLOCKS = {
  /* ------------------------------------------------------------- Home */
  'home-hero': {
    page: 'Home', name: 'Hero', type: 'CorelHeroSplit',
    props: {
      Eyebrow: 'NEW! CorelDRAW Graphics Suite 2026', Title: 'Professional graphic design software',
      Body: 'Powerful tools for vector illustration, layout, photo editing, and typography.',
      PromoLabel: 'BLACK FRIDAY STARTS EARLY', PromoText: 'Save 30%. Limited-time offer.',
      PrimaryCta: TRIAL, SecondaryCta: link('Buy now', '/en/product/coreldraw/'),
      Note: 'Available for Windows, Mac, and Web', ArtworkCredit: 'Éder Minetto', Image: media('hero'),
    },
  },
  'home-tiers': {
    page: 'Home', name: 'Product tiers', type: 'CorelTierCards',
    props: {
      Title: 'Graphic design options for all skill levels',
      Cta: link('Help me decide', '/en/product/family/'),
      Tiers: [
        { Level: 'QUICK & EASY', Name: 'CorelDRAW Go', SaveLabel: 'Save 30%', Link: link('Learn more', '/en/product/go/'), Features: ['Beginner-friendly design app', 'Templates, assets, and easy vector tools', 'Great for quick, one-off projects'], Apps: ['CorelDRAW Go'] },
        { Level: 'ADVANCED', Name: 'CorelDRAW Standard', SaveLabel: 'Save $45', Link: link('Learn more', '/en/product/coreldraw/standard/'), Features: ['For enthusiasts and home businesses', 'Vector illustration plus photo editing', 'Great for logos and signage'], Apps: ['CorelDRAW Standard', 'Corel PHOTO-PAINT Standard'] },
        { Level: 'PROFESSIONAL', Name: 'CorelDRAW Graphics Suite', SaveLabel: 'Save 30%', Popular: true, Link: link('Learn more', '/en/product/coreldraw/'), Features: ['Built for Windows, Mac, and web', 'Vector layout, photo editing, and type tools', 'Great for professional design work'], Apps: ['CorelDRAW', 'CorelDRAW Web', 'Corel PHOTO-PAINT', 'Corel Font Manager'] },
      ],
    },
  },
  'home-cta': {
    page: 'Home', name: 'Call to action', type: 'CorelCtaBanner',
    props: { Title: 'Test drive CorelDRAW for FREE, no credit card required!', Cta: link('Learn more', '/en/free-trials/') },
  },

  /* ---------------------------------------------------------- Product */
  'product-hero': {
    page: 'Product', name: 'Hero', type: 'CorelProductHero',
    props: {
      Badge: 'New', Title: 'CorelDRAW Graphics Suite 2026',
      Subtitle: 'Professional graphic design software for Windows, Mac, and Web',
      Body: 'Fuel your creative fire with professional graphics software—designed to get the job done.',
      TrialCta: link('Try free for 15 days', 'https://web.coreldraw.com/?content=trial'),
      RatingCount: '1020', AiNoteLabel: 'NEW THIS YEAR', AiNoteTitle: 'Includes generative AI with Text-to-vector', AiNoteSub: 'Powered by Artist Intelligence™',
      PurchaseHeading: 'Purchase options', VatNote: '(incl. VAT)',
      UpgradeLink: link('Looking to upgrade?', '/en/pages/upgrade/'),
      FeaturesLink: link('Subscription-exclusive features', '#compare'),
      RenewLink: link('Renew subscription', 'https://account.corel.com/accounts/user/accountSubscriptions'),
      BusinessLink: link('Buy for business', '/en/licensing/business/'),
      Plans: [
        { Label: 'Annual Plan', Tag: 'New in 2026', Headline: '$15.42/mo', Blurb: 'Subscribe and for just $15.42/mo, get the latest version, exclusive apps and features, monthly AI credits, and more.', SaveLabel: 'Save 30%', Price: '$185.00', Unit: '/year', WasPrice: '$269.00', Cta: link('Subscribe now', 'https://store.coreldraw.com/1103/purl-CDGSSUBPUREPREM2'), ShowSubscriptionLinks: true, PromoTitle: 'Black Friday Starts Early', PromoText: 'Save 30% on your first year of the annual plan.' },
        { Label: 'Monthly Plan', Tag: 'New in 2026', Headline: '$39.00/mo', Blurb: 'Subscribe for $39/mo to access the latest version, exclusive cloud features, and more.', Price: '$39.00', Unit: '/month', Cta: link('Subscribe now', 'https://store.coreldraw.com/1103/purl-CDGSSUBPUREPREM1'), ShowSubscriptionLinks: true },
        { Label: 'One-Time Purchase', Tag: '2026 version', Headline: '$379.00', Blurb: 'Buy it once, own it forever.', SaveLabel: 'Save 30%', Price: '$379.00', WasPrice: '$549.00', Cta: link('Buy now', 'https://store.coreldraw.com/1103/purl-ESDCDGS2026ML'), PromoTitle: 'Black Friday Starts Early', PromoText: 'Save 30%.' },
      ],
    },
  },
  'product-subnav': {
    page: 'Product', name: 'Sub-navigation', type: 'CorelSubNav',
    props: {
      Variant: 'sticky', Title: 'CorelDRAW Graphics Suite',
      Links: [link('Overview', '#prod-hero'), link("What's New", '#whats-new'), link('Features', '#features'), link('Compare', '#compare'), link('Specs', '#tech-specs'), link('FAQ', '#faq')],
      Cta: link('Buy now', '#prod-hero'),
    },
  },
  'product-intro': {
    page: 'Product', name: 'Intro', type: 'CorelIntroSplit',
    props: {
      Title: 'Creativity meets productivity',
      Body: html(
        'CorelDRAW® Graphics Suite is your fully loaded, professional design toolkit for delivering breathtaking vector illustration, layout, photo editing, and typography projects with total efficiency.',
        'A budget-friendly subscription provides ongoing value with instant access to exclusive apps, features, content, AI credits, and support for the latest technologies.',
      ),
      Image: media('intro'),
    },
  },
  // Shared by Product AND Free trials — the one true reuse.
  awards: { page: 'Shared', name: 'Awards strip', type: 'CorelAwardsStrip', props: { Title: 'Multi award-winning solution', Awards: AWARDS } },
  'product-apps': {
    page: 'Product', name: 'Apps', type: 'CorelAppGrid',
    props: { Title: 'All the tools you need to tackle any project', Apps: APPS.map(appItem), ...INCLUDED },
  },
  'product-industries': {
    page: 'Product', name: 'Industries', type: 'CorelCardGrid',
    props: {
      Variant: 'image', Title: 'The sky is the limit!',
      Items: [
        { Title: 'Branding and marketing', Description: 'From creative professionals in advertising and publishing to small businesses producing in-house marketing materials, create everything from brand identity assets to alluring sales tools.' },
        { Title: 'Signage and large-format printing', Description: 'Sign and print professionals rely on CorelDRAW to create artwork for a variety of print outputs using a powerful color management engine and superior prepress tools.' },
        { Title: 'Apparel and textiles', Description: 'Screen printing, embroidery, direct-to-garment printing or apparel—CorelDRAW Graphics Suite has the tools to produce and output designs for the fashion industry.' },
        { Title: 'Retail and e-commerce', Description: 'Dedicated web and print tools for commerce professionals. Design point-of-sale promotions or create assets to enhance an online store.' },
        { Title: 'Blueprints, maps, and schematics', Description: 'Trusted by engineering, manufacturing, and construction firms for precision tools that create product illustrations, diagrams, schematics, and other technical visuals.' },
      ],
    },
  },
  'product-logos': {
    page: 'Product', name: 'Customer logos', type: 'CorelLogoMarquee',
    props: {
      Title: 'You’re in good company',
      Subtitle: 'Join millions of users across thousands of global organizations who use CorelDRAW.',
      Logos: [
        ['logo-telefonica', 'Telefonica'], ['logo-unilever', 'Unilever'], ['logo-daimler', 'Daimler'], ['logo-petrobras', 'Petrobras'],
        ['logo-abbott', 'Abbott'], ['logo-glencore', 'Glencore'], ['logo-pfizer', 'Pfizer'],
      ].map(([id, Title]) => ({ Title, Image: media(id) })),
    },
  },
  'product-customers': {
    page: 'Product', name: 'Featured customers', type: 'CorelTestimonialCarousel',
    props: {
      Cta: link('Customer stories', '/en/pages/customer-stories/'),
      Stories: [
        { Quote: "As the world's largest supplier of specialized sign-making tools, Yellotools uses CorelDRAW to design innovative, time-saving solutions to common industry problems.", Name: 'Yellotools', Role: 'Tool manufacturer for sign makers, Germany', Image: media('cust-yellotools') },
        { Quote: 'Based in Stockholm, Stefan relies on Corel PHOTO-PAINT to create impressive illustrations for editorial clients, ad agencies, and publishers.', Name: 'Stefan Lindblad', Role: 'Illustrator and graphic artist, Sweden', Image: media('cust-stefan') },
        { Quote: 'Bitsy & Company creates graphic novels that inspire and challenge cultural roots. They bring their stories to life by using CorelDRAW for character creation and layout.', Name: 'Bitsy & Company', Role: 'Web comics and graphic novels, USA', Image: media('cust-bitsy') },
        { Quote: 'Fahnen Eibl, a Bavaria-based company, uses their craftsmanship and CorelDRAW’s production technology to create all kinds of high-quality flags.', Name: 'Kunststickerei Eibl GmbH', Role: 'Flag production and artistic embroidery, Germany' },
        { Quote: 'See how TMS Inc., an industry leader in custom signage solutions, uses CorelDRAW Graphics Suite to serve the printing needs of some of the largest Fortune 100 and 200 companies in North America.', Name: 'TMS Print Systems', Role: 'Point of Purchase and Point of Sale printer, USA' },
        { Quote: 'Learn how Ina, aka sewingmachina, uses CorelDRAW Graphics Suite to design digital sewing patterns.', Name: 'Sewingmachina', Role: 'Apparel and textiles, Germany' },
        { Quote: 'See how Wunschleder uses CorelDRAW Graphics Suite to create laser-cut designs and patterns.', Name: 'Wunschleder', Role: 'Leatherwork and accessories company, Germany' },
      ],
    },
  },
  'product-ratings': {
    page: 'Product', name: 'Ratings', type: 'CorelRatings',
    props: {
      LeftTitle: 'Our competitive advantage',
      LeftLead: 'Enjoy all-in-one design and layout, a native OS experience, flexible purchasing options, free integrated Pantone® colors, and so much more.',
      LeftBody: 'Easy to learn and packed with unique features, CorelDRAW Graphics Suite is a powerful alternative to comparable graphic design software. With a no obligation trial and a subscription that’s significantly more affordable than the leading competition, CorelDRAW is an excellent choice for artists and designers.',
      Heading: 'Top-rated by customers', Subheading: RATINGS_SUB, Ratings: RATINGS,
    },
  },
  'product-whatsnew': {
    page: 'Product', name: 'What’s new', type: 'CorelCardCarousel',
    props: {
      Variant: 'release', AnchorId: 'whats-new', Title: 'What’s new in CorelDRAW Graphics Suite 2026?', Subtitle: 'Powered by Artist Intelligence™',
      Cards: RELEASES, Cta: link('Compare purchase options', '/en/product/coreldraw/compare/'),
    },
  },
  'product-spotlight': {
    page: 'Product', name: 'AI spotlight', type: 'CorelFeatureSpotlight',
    props: {
      Title: 'Accelerate your ideas with intelligent design tools', LeadTitle: 'Generate vectors with AI',
      LeadBody: 'Transform ideas into editable, scalable vectors in seconds with the new Text-to-vector feature in CorelDRAW\'s AI Generate docker. Explore directions with text prompts, or generate vectors from existing artwork to quickly create variations—while staying fully in control.',
      Items: [
        { Title: 'Generate images with AI', Description: 'Create unique AI-generated bitmaps from scratch or existing content in CorelDRAW and Corel PHOTO-PAINT.' },
        { Title: 'Remix images with AI', Description: 'Quickly edit and transform images using Nano Banana, a powerful AI model for near-instant photo edits.' },
        { Title: 'Remove backgrounds with AI', Description: 'One-click AI background removal with clean results, even around fine details like hair and fabric.' },
        { Title: 'Mask photos with AI', Description: 'AI-assisted subject selection and clip masking in Corel PHOTO-PAINT for faster, more accurate masking.' },
      ],
    },
  },
  'product-trycards': {
    page: 'Product', name: 'Try it', type: 'CorelCardCarousel',
    props: { Variant: 'tile', Title: 'Start designing with CorelDRAW', Cards: TRY_CARDS },
  },
  'product-capabilities': {
    page: 'Product', name: 'Capabilities', type: 'CorelCardGrid',
    props: {
      Variant: 'icon', AnchorId: 'features', Title: 'Professional design tools at your fingertips', Subtitle: 'Core capabilities',
      Items: [
        { Title: 'Vector illustration', Description: 'Turn basic lines and shapes into complex works of art with versatile shaping and drawing tools, plus Contour, Envelope, Blend, Mesh Fill, and more.' },
        { Title: 'Page layout', Description: 'Create layouts for brochures and multi-page documents. Toggle between single page and multipage editing.' },
        { Title: 'Typography', Description: 'Arrange type beautifully with block shadows, contours, variable font support, fit text to path, and more.' },
        { Title: 'Font management', Description: 'Organize your font library with Corel Font Manager and access over 1,700 Google Fonts families.' },
        { Title: 'Photo editing', Description: 'Adjust color and tone, remove imperfections, correct perspective, and more with layer-based tools in Corel PHOTO-PAINT.' },
        { Title: 'Artificial intelligence', Description: 'Prompt-based generative AI, AI-assisted image masking, and AI background removal at every stage.' },
      ],
      SliderTitle: 'What sets CorelDRAW apart',
      SliderItems: [
        ['Design for print or web', 'Master color consistency across media. Access Pantone color palettes free of charge.'],
        ['Non-destructive editing', 'Apply reversible adjustments and effects to bitmaps and vectors.'],
        ['Bitmap-to-vector tracing', 'Exceptional trace results with AI-assisted PowerTRACE.'],
        ['Multipage view', 'View, manage, and edit all of your project’s digital assets in one view.'],
        ['Multi-asset export', 'Export a customized list of pages and objects with one click.'],
        ['Styles and style sets', 'Apply consistent formatting across objects and whole documents.'],
        ['Unparalleled object control', 'Hide, rename, search, and reorder every element. Use Focus Mode to edit in isolation.'],
        ['Workspace customization', 'Import workspaces or use predefined, industry-specific workspaces and custom shortcuts.'],
        ['Color, fills, and transparencies', 'Swatches, color harmonies, patterns, gradients, mesh fills, and more.'],
        ['Extensive file compatibility', 'Support for an immense list of graphics, publishing, and image file formats.'],
      ].map(([Title, Description]) => ({ Title, Description })),
    },
  },
  'product-compare': {
    page: 'Product', name: 'Comparison', type: 'CorelComparisonTable',
    props: {
      AnchorId: 'compare', Title: 'From new features to content, subscribers get more',
      Subtitle: 'As a subscriber, you get access to exclusive features, apps, content, and AI credits.',
      CornerLabel: 'CorelDRAW Graphics Suite – Version Comparison Matrix', Column1Label: 'Subscription', Column2Label: 'One-time purchase',
      Cta: link('See full comparison', '/en/product/coreldraw/compare/'),
      // [group, label, description, col1, col2]; col = true | false | 'text'
      Rows: [
        ['Value, access, and support', 'CorelDRAW Web', 'Browser-based vector illustration and graphic design', true, false],
        ['Value, access, and support', 'Latest and greatest', 'Instant access to the latest updates as they become available, at no extra cost.', true, false],
        ['Value, access, and support', 'Generative AI credits', 'Included credits for prompt-based image creation and editing.', '2,000 monthly credits', '2,000 one-time credits'],
        ['Value, access, and support', 'Exclusive features', 'Enjoy exclusive features, apps, and workflows.', true, false],
        ['Value, access, and support', 'Budget-friendly', 'Lowest upfront cost and the flexibility to stop paying as needs change.', true, false],
        ['Value, access, and support', 'Ongoing support', 'Guaranteed support for the latest operating systems, devices, and technologies.', true, false],
        ['Value, access, and support', 'Product ownership', 'Pay once to own and use the software version for as long as you choose.', false, true],
        ['Tools, features, and content', 'Cloud-based asset management', '', true, false],
        ['Tools, features, and content', 'Cloud storage', '', true, false],
        ['Tools, features, and content', 'Creative content', '', '150 extra brushes · 600+ extra templates · cloud library', true],
        ['Tools, features, and content', 'Layout tools', '', true, true],
        ['Tools, features, and content', 'Drawing tools', '', true, true],
        ['Tools, features, and content', 'Image editing tools', '', true, true],
        ['Tools, features, and content', 'Typography tools', '', true, true],
        ['Tools, features, and content', 'Web and print output tools', '', true, true],
        ['Tools, features, and content', 'Learning materials', '', true, true],
      ].map(([Group, Label, Description, a, b]) => {
        const col = (v) => (v === true ? { Type: 'yes' } : v === false ? { Type: 'no' } : { Type: 'text', Text: v });
        const [c1, c2] = [col(a), col(b)];
        return { Group, Label, ...(Description ? { Description } : {}), Col1Type: c1.Type, ...(c1.Text ? { Col1Text: c1.Text } : {}), Col2Type: c2.Type, ...(c2.Text ? { Col2Text: c2.Text } : {}) };
      }),
    },
  },
  'product-faq': {
    page: 'Product', name: 'FAQ', type: 'CorelFaqAccordion',
    props: {
      AnchorId: 'faq', Title: 'Frequently asked questions',
      Items: [
        ['What is CorelDRAW Graphics Suite?', ['CorelDRAW Graphics Suite is a professional graphic design software solution for Windows, Mac, and web.', 'It includes CorelDRAW® (vector illustration and page layout), CorelDRAW® Web (subscriber exclusive), Corel PHOTO-PAINT™ (image editing), Corel® Font Manager, and CAPTURE™ (screen capture).']],
        ['How much does CorelDRAW Graphics Suite cost?', ['It depends on the purchasing option you choose. We offer both subscription and one-time purchase options. Not sure yet? Try it free for 15 days—no credit card required!']],
        ['Is CorelDRAW Graphics Suite free?', ['While CorelDRAW Graphics Suite is not a free product, we offer an obligation-free 15-day trial.']],
        ['Can I buy CorelDRAW Graphics Suite without a subscription?', ['Yes. Choose a one-time purchase for perpetual use, or a perpetual license with maintenance—a low-cost annual plan that keeps you eligible for the latest version, exclusive features, and monthly AI credits.']],
        ['Is CorelDRAW Graphics Suite a one-time purchase?', ['Yes, it is available as a one-time purchase for perpetual use. A subscription and a maintenance option for license customers are also offered.']],
        ['Does CorelDRAW have generative AI?', ['Yes! AI Generate turns text descriptions into custom vectors and images in seconds. CorelDRAW Graphics Suite also has one-click AI background removal and AI-powered image masking.']],
        ['What are AI credits?', ['AI credits power CorelDRAW Graphics Suite’s generative AI features. Subscribers and maintenance customers receive a monthly allowance; one-time purchase customers receive a fixed allotment that does not expire.']],
        ['Can I buy more AI credits?', ['Yes. Choose a monthly or annual credit add-on subscription, or a one-time credit pack.']],
        ['Will CorelDRAW use my artwork to train AI?', ['No. Your creative work in CorelDRAW is never used to train our AI features or third-party AI models. Your content remains yours, period.']],
      ].map(([Question, paras]) => ({ Question, Answer: html(...paras) })),
    },
  },
  'product-specs': {
    page: 'Product', name: 'Tech specs', type: 'CorelTechSpecs',
    props: {
      AnchorId: 'tech-specs', Title: 'Tech specs',
      Specs: [
        ...[
          ['Operating system', 'Windows 11 or Windows 10, 64-bit, with the latest updates'],
          ['Processor', 'Intel Core i3/i5/i7/i9 (7th gen or newer) or AMD Ryzen 3/5/7/9, Threadripper, EPYC'],
          ['Memory', '8 GB RAM (16 GB or higher recommended)'],
          ['Storage', '5.5 GB hard disk space'],
          ['Graphics', 'OpenCL 1.2-compatible video card with 3 GB+ VRAM'],
          ['Display', '1280 x 720 at 100% (1920 x 1080 recommended)'],
          ['Input', 'Mouse, tablet or multi-touch screen'],
          ['Connectivity', 'Internet connection required to install and authenticate'],
        ].map(([Heading, Detail]) => ({ Group: 'Windows', Heading, Detail })),
        ...[
          ['Operating system', 'macOS 27 Golden Gate, Tahoe (26), Sequoia (15), or Sonoma (14)'],
          ['Processor', 'Apple Silicon, or multicore Intel with AVX2 support'],
          ['Memory', '8 GB RAM (16 GB or higher recommended)'],
          ['Storage', '3 GB available (SSD recommended; case-sensitive file systems not supported)'],
          ['Graphics', 'OpenCL 1.2-compatible video card with 3 GB+ VRAM'],
          ['Display', '1920 x 1200 screen resolution'],
          ['Input', 'Mouse or tablet'],
          ['Connectivity', 'Internet connection required to install and authenticate'],
        ].map(([Heading, Detail]) => ({ Group: 'Mac', Heading, Detail })),
        { Group: 'Web', GroupNote: 'CorelDRAW Web – browser requirements', Heading: 'Google Chrome', Detail: 'Version 142 or higher' },
        { Group: 'Web', Heading: 'Microsoft Edge', Detail: 'Version 142 or higher' },
        { Group: 'Web', Heading: 'Mozilla Firefox', Detail: 'Version 145 or higher (limited support; some features such as clipboard may not work)' },
      ],
    },
  },
  'product-gallery': {
    page: 'Product', name: 'Gallery', type: 'CorelGalleryGrid',
    props: {
      Title: 'Graphic design gallery',
      Subtitle: 'Find inspiration in our online gallery, featuring images from CorelDRAW artists and designers from around the world.',
      Images: ['Maycon Bartowski', 'Joseph Diaz', 'Tomasz Mroziński', 'Bartowski Design', 'Five Nine', 'Marco Mastrelli', 'Samuel Leon', 'Rage Designs', 'Kseniia Romanova', 'Marcin Chamala', 'Teody Lanada', 'OCTO'].map((n) => ({ Title: n, Caption: n })),
    },
  },
  'product-cta': {
    page: 'Product', name: 'Call to action', type: 'CorelCtaBanner',
    props: { Title: 'Push the boundaries of visual communication with CorelDRAW Graphics Suite', Cta: TRIAL },
  },

  /* --------------------------------------------------- Special offers */
  'offers-hero': {
    page: 'Special offers', name: 'Hero', type: 'CorelHeroSplit',
    props: {
      Theme: 'dark', Eyebrow: 'New', Title: 'CorelDRAW Graphics Suite',
      Body: 'A complete suite of applications for vector illustration, layout, photo editing, and more on your platform of choice.',
      PromoLabel: 'BLACK FRIDAY STARTS EARLY', PromoText: 'Save 30%. Limited-time offer.',
      PrimaryCta: link('Buy now', '/en/product/coreldraw/'), ArtworkCredit: 'Éder Minetto', Image: media('hero'),
    },
  },
  'offers-deals': {
    page: 'Special offers', name: 'Deals', type: 'CorelOfferCards',
    props: {
      Title: 'Black Friday deals on Graphics products',
      Offers: [
        { Name: 'CorelDRAW Graphics Suite 365‑day Subscription', Description: 'A low cost option to always stay current', SaveLabel: 'Save 30%', PromoText: 'Save 30% on your first year of the annual plan.', WasPrice: '$269.00', Price: '$185.00', Unit: '/year', Popular: true, Link: link('Buy now', '/en/product/coreldraw/'), Image: media('offer-sub') },
        { Name: 'CorelDRAW Technical Suite', Description: 'High-impact technical design software to get you from concept to completion', Price: '$1,199.00', Link: link('Buy now', '/en/product/technical-suite/'), Image: media('offer-ts') },
        { Name: 'CorelDRAW Standard', Description: 'Graphic design for enthusiasts and home businesses', SaveLabel: 'Save $45', PromoText: 'Save $45.', WasPrice: '$299.00', Price: '$254.00', Link: link('Buy now', '/en/product/coreldraw/standard/'), Image: media('offer-std') },
        { Name: 'CorelDRAW Go', Description: 'Intuitive web-based graphic design app that goes beyond templates', SaveLabel: 'Save 30%', PromoText: 'Save 30% on your first year of the annual plan.', WasPrice: '$99.99', Price: '$69.99', Unit: '/year', Link: link('Buy now', '/en/product/go/'), Image: media('offer-go') },
      ],
    },
  },
  'offers-cta': {
    page: 'Special offers', name: 'Call to action', type: 'CorelCtaBanner',
    props: { Theme: 'light', Title: 'Test drive CorelDRAW for FREE, no credit card required!', Cta: link('Learn more', '/en/free-trials/') },
  },

  /* ------------------------------------------------------ Free trials */
  'trials-hero': {
    page: 'Free trials', name: 'Hero', type: 'CorelTrialHero',
    props: {
      Title: 'Try CorelDRAW free for 15 days',
      Body: 'Create vector illustrations, layouts, and more with our professional graphic design software. Start a 15-day free trial, including AI credits to explore artificial intelligence-powered image generation and modification.',
      Cta: TRIAL, CtaNote: 'No credit card required!', LearnMoreLink: link('Learn more', '/en/product/coreldraw/'),
      FormIntro: 'Enter your email address to access your trial and get started.',
      ConsentText: 'I agree that the companies of Corel Corporation or local business partners can contact me regarding the products, services, and events provided by Corel Corporation. I can withdraw my consent at any time. By submitting this form, I agree to the Corel Corporation Privacy Statement.',
      SubmitLabel: 'Download', SuccessTitle: "You're close!",
      SuccessBody: 'We’ve emailed you the trial, so it’s all set for you to access the next time you’re on your computer.',
    },
  },
  'trials-try': {
    page: 'Free trials', name: 'Login and try', type: 'CorelCardCarousel',
    props: { Variant: 'tile', Title: 'Login and try with CorelDRAW', Cards: TRY_CARDS },
  },
  'trials-whatsnew': {
    page: 'Free trials', name: 'What’s new', type: 'CorelCardCarousel',
    props: { Variant: 'release', Title: 'What’s new in CorelDRAW Graphics Suite 2026?', Cards: RELEASES },
  },
  'trials-included': {
    page: 'Free trials', name: 'Included apps', type: 'CorelIncludedApps',
    props: {
      Title: 'What’s included in CorelDRAW Graphics Suite 2026',
      PrimaryApp: {
        Name: 'CorelDRAW®', Subtitle: 'Vector illustration and page layout',
        Description: 'Powerful, full-featured graphics software for vector illustration, page layout, typography, and design across any project.',
        Bullets: ['All-in-one design and layout', 'Professional vector illustration tools', 'AI-powered vector and image generation', 'Built-in multipage layout and typography tools'],
        Image: media('app-draw'),
      },
      AlsoIncluded: [
        { Name: 'CorelDRAW® Web', Description: 'Design on the go in your browser', SubscriberExclusive: true, Image: media('app-web') },
        { Name: 'Corel PHOTO-PAINT™', Description: 'Edit, retouch, and enhance photos', Image: media('app-photo') },
        { Name: 'Corel® Font Manager', Description: 'Find, organize, and manage fonts', Image: media('app-fonts') },
      ],
      ...INCLUDED,
    },
  },
  'trials-browser': {
    page: 'Free trials', name: 'Browser trial', type: 'CorelSplitCta',
    props: {
      Title: 'Try CorelDRAW in your browser, no downloads or installation needed.', Cta: TRIAL,
      Note: '*Note that this trial excludes some CorelDRAW features and all of the other applications that come with a CorelDRAW Graphics Suite purchase.',
      SecondaryLead: 'Looking to try even more features and applications?',
      // The mock links straight to a one-off .exe download; point at the official trials page instead.
      SecondaryLink: link('Try the full CorelDRAW Graphics Suite', 'https://www.corel.com/en/free-trials/'),
      SecondarySuffix: 'on Windows or Mac.',
    },
  },
  'trials-ratings': {
    page: 'Free trials', name: 'Ratings', type: 'CorelRatings',
    props: { Heading: 'Top-rated by customers', Subheading: RATINGS_SUB, Ratings: RATINGS },
  },

  /* --------------------------------------------------- Learning center */
  'learn-menu': {
    page: 'Learning center', name: 'Section menu', type: 'CorelSubNav',
    props: {
      Variant: 'dark', Title: 'Learning Center', TitleLink: link('Learning Center', '/en/learn/'),
      Links: [link('Tutorials', '/en/learn/tutorials/'), link('Webinars & e-Books', '/en/learn/webinars/'), link('How-tos', '/en/learn/how-to/'), link('Customer Stories', '/en/pages/customer-stories/'), link('Gallery', '/en/learn/gallery/')],
    },
  },
  'learn-banner': {
    page: 'Learning center', name: 'Banner', type: 'CorelPageBanner',
    props: {
      Title: 'CorelDRAW Learning Center',
      Body: 'So many ways to learn! See how you can get the most out of your CorelDRAW products with extensive insight into specific tools and features along with helpful tips and tricks.',
    },
  },
  'learn-tiles': {
    page: 'Learning center', name: 'Learning tiles', type: 'CorelIconLinkCards',
    props: {
      Overlap: true,
      Items: [
        ['CorelDRAW Academy', 'Free Corel-certified resources for creatives of all skill levels.', '/en/learn/academy/', 'learn-academy'],
        ['Tutorials', 'In-depth learning content for a variety of design topics.', '/en/learn/tutorials/', 'learn-tutorials'],
        ['Webinars & e-Books', 'Free online workshops on using tools and features.', '/en/learn/webinars/', 'learn-webinars'],
        ['How-tos', 'Step-by-step guides for popular design tasks.', '/en/learn/how-to/', 'learn-hints'],
      ].map(([Title, Description, h, id]) => ({ Title, Description, Link: link(Title, h), Image: media(id) })),
    },
  },
  'learn-inspire': {
    page: 'Learning center', name: 'Get inspired', type: 'CorelIconLinkCards',
    props: {
      Variant: 'inspire', Title: 'Get inspired',
      Items: [
        ['Customer stories', 'Discover how real businesses and organizations rely on the graphic design power of CorelDRAW.', 'Read stories', '/en/pages/customer-stories/', 'learn-cs'],
        ['Gallery', 'Find inspiration in our diverse collection of artwork by CorelDRAW artists and designers from around the world.', 'View gallery', '/en/learn/gallery/', 'learn-gallery'],
        ['Discovery Center', 'Visit another resource offering additional tutorials, galleries, tips, and eBooks.', 'Start discovering', 'https://learn.corel.com/graphics-home/', 'learn-dc'],
        ['Guide to Vector Design', 'Learn the basics of vector graphics and design with CorelDRAW, and develop your edge as a designer.', 'Read more', '/en/learn/guide-to-vector-design/', 'learn-vector'],
        ['Top Tips', 'Accelerate and customize your design and production process with simple tips from CorelDRAW training experts.', 'Watch videos', '/en/learn/tutorials/tips/', 'learn-tips'],
        ['Guide to Pantone Colors for print', 'Learn how to use Pantone Colors for print design with CorelDRAW.', 'Read more', '/en/blog/pantone-print-guide/', 'learn-vector'],
      ].map(([Title, Description, cta, h, id]) => ({ Title, Description, Link: link(cta, h), Image: media(id) })),
    },
  },

  /* ---------------------------------------------------------- Support */
  'support-search': {
    page: 'Support', name: 'Search banner', type: 'CorelPageBanner',
    props: {
      Title: 'Welcome to CorelDRAW support',
      Body: 'Click below for frequently asked questions, documentation and other helpful tools to get the answers you need.',
      ShowSearch: true, SearchPlaceholder: 'Search support articles…', SearchUrl: 'https://support.corel.com/hc/en-us/search?query=',
    },
  },
  'support-tiles': {
    page: 'Support', name: 'Support tiles', type: 'CorelIconLinkCards',
    props: {
      Overlap: true, Columns: '5',
      Items: [
        ['Install & activate', 'Tutorials for product installation', '/en/support/install-and-activate/', 'cog'],
        ['Download', 'Patches & Updates', '/en/support/updates/', 'download'],
        ['Orders', 'Buy, inquire, return', '/en/support/orders/', 'box'],
        ['Your account', 'Update your profile, register a product and more', '/en/support/your-account/', 'user'],
        ['Discovery Center', 'Your home for creative learning', 'https://learn.corel.com/', 'book'],
      ].map(([Title, Description, h, Icon]) => ({ Title, Description, Link: link(Title, h), Icon })),
    },
  },
  'support-announcements': {
    page: 'Support', name: 'Announcements', type: 'CorelAnnouncements',
    props: {
      Title: 'Announcements',
      Links: [
        link('CorelDRAW Web – Frequently Asked Questions (FAQ)', 'https://kb.corel.com/en/130067'),
        link('CorelDRAW Go – Frequently Asked Questions (FAQ)', 'https://kb.corel.com/en/130319'),
        link('Artificial Intelligence (AI) in CorelDRAW products – FAQ', 'https://kb.corel.com/en/131069'),
      ],
    },
  },
  'support-contact': {
    page: 'Support', name: 'Contact options', type: 'CorelContactOptions',
    props: {
      DirectoryLabel: 'International numbers',
      Cards: [
        { Icon: 'users', Title: 'CorelDRAW Communities', Description: 'Meet, share and learn from other users in our online communities.', PrimaryLink: link('CorelDRAW', 'https://community.coreldraw.com/'), SecondaryLink: link('CorelDRAW Go', 'https://community.go.corel.com/') },
        { Icon: 'ticket', Title: 'Create Support ticket', Description: 'Email us and receive a response within 24 hours', PrimaryLink: link('Submit a ticket', 'https://support.corel.com/hc/en-us/requests/new') },
        { Icon: 'chat', Title: 'Chat', Description: 'Start a chat session with a Corel agent', PrimaryLink: link('Start Chat', 'https://www.corel.com/contact/') },
        { Icon: 'phone', Title: 'Call', PhoneNumber: '1-844-759-9903', ShowDirectory: true },
      ],
      Directory: [
        ['North America', 'United States', '1-844-759-9903'], ['North America', 'Canada', '1-866-341-0059'],
        ['Europe', 'United Kingdom', '+44 808 189 9383'], ['Europe', 'France', '+33 805 08 0202'], ['Europe', 'Germany', '+49 800 000 1399'], ['Europe', 'Rest of Europe', '+44 808 189 9383'],
        ['Other', 'Middle East', '+44 808 189 9383'], ['Other', 'South Africa', '+44 808 189 9383'],
      ].map(([Region, Country, PhoneNumber]) => ({ Region, Country, PhoneNumber })),
    },
  },
};

/* ------------------------------------------------------------------- pages */

/** Ordered block ids per page. `awards` is shared between Product and Free trials. */
export const PAGES = {
  product: {
    displayName: 'Product', routeSegment: 'product',
    props: { MetaTitle: 'CorelDRAW Graphics Suite 2026', MetaDescription: 'Professional graphic design software for Windows, Mac, and Web — vector illustration, layout, photo editing, typography and generative AI.' },
    blocks: ['product-hero', 'product-subnav', 'product-intro', 'awards', 'product-apps', 'product-industries', 'product-logos', 'product-customers', 'product-ratings', 'product-whatsnew', 'product-spotlight', 'product-trycards', 'product-capabilities', 'product-compare', 'product-faq', 'product-specs', 'product-gallery', 'product-cta'],
  },
  'special-offers': {
    displayName: 'Special offers', routeSegment: 'special-offers',
    props: { MetaTitle: 'Special offers', MetaDescription: 'Black Friday deals on CorelDRAW Graphics Suite, Technical Suite, Standard and Go.' },
    blocks: ['offers-hero', 'offers-deals', 'offers-cta'],
  },
  'free-trials': {
    displayName: 'Free trials', routeSegment: 'free-trials',
    props: { MetaTitle: 'Free trials', MetaDescription: 'Try CorelDRAW free for 15 days — no credit card required.' },
    blocks: ['trials-hero', 'trials-try', 'trials-whatsnew', 'trials-included', 'trials-browser', 'awards', 'trials-ratings'],
  },
  learn: {
    displayName: 'Learning center', routeSegment: 'learn',
    props: { MetaTitle: 'Learning center', MetaDescription: 'Tutorials, webinars, how-tos and inspiration to get the most out of CorelDRAW.' },
    blocks: ['learn-menu', 'learn-banner', 'learn-tiles', 'learn-inspire'],
  },
  support: {
    displayName: 'Support', routeSegment: 'support',
    props: { MetaTitle: 'CorelDRAW support', MetaDescription: 'Frequently asked questions, documentation, communities and contact options for CorelDRAW.' },
    blocks: ['support-search', 'support-tiles', 'support-announcements', 'support-contact'],
  },
};

/**
 * The Corel home page already exists (HOME_PAGE_CONTENT_ID, a BlankExperience), so it is
 * UPDATED rather than created. Mirrors HomePage() in app/demo/mock/page.tsx. The customers
 * and logos blocks are the same shared blocks the Product page uses (identical in the mock).
 */
export const HOME_PAGE = {
  existing: true,
  displayName: 'Home',
  props: {
    MetaTitle: 'Professional graphic design software',
    MetaDescription: 'Powerful tools for vector illustration, layout, photo editing, and typography.',
  },
  blocks: ['home-hero', 'home-tiers', 'product-customers', 'product-logos', 'home-cta'],
};

/** Display name for a block's CMS item, e.g. "Corel / Product / Hero". */
export const blockDisplayName = (b) => `Corel / ${b.page} / ${b.name}`;
