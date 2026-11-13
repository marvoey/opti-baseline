import { contentType } from '@optimizely/cms-sdk';
import { choice, ICON_OPTIONS, imageProps } from './shared';

/**
 * Corel ITEM types — small repeatable components held in a block's array
 * property (e.g. a FAQ block holds `CorelFaqItem`s). They have no composition
 * behaviour, so editors can't drop them on a page directly. Definitions only; the
 * parent block renders them.
 *
 * Display names are prefixed "Corel Item:" so they sort together and are easy to
 * tell apart from other demos' types in the shared CMS.
 */

const YES_NO_TEXT = [
  ['yes', 'Check mark'],
  ['no', 'Dash'],
  ['text', 'Custom text'],
] as const;

/** Image + title + caption: logos, award badges, gallery art. */
export const CorelImageItemContentType = contentType({
  key: 'CorelImageItem',
  baseType: '_component',
  displayName: 'Corel Item: Image',
  description: 'A logo, award badge or gallery image with a name and optional caption.',
  properties: {
    Title: { type: 'string', displayName: 'Name / alt text', isLocalized: true, sortOrder: 10 },
    Caption: { type: 'string', displayName: 'Caption', isLocalized: true, sortOrder: 20 },
    ...imageProps(30),
  },
});

/** Title + description card, optionally with an image and link. */
export const CorelTextCardContentType = contentType({
  key: 'CorelTextCard',
  baseType: '_component',
  displayName: 'Corel Item: Text card',
  description: 'A card with a title, short description, optional image and link.',
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 10 },
    Description: { type: 'string', displayName: 'Description', isLocalized: true, sortOrder: 20 },
    Link: { type: 'link', displayName: 'Link', description: 'Optional. The link text is the call to action.', isLocalized: true, sortOrder: 30 },
    Group: {
      type: 'string',
      displayName: 'Group heading',
      description: 'Carousels group consecutive cards that share the same value (e.g. a release month).',
      isLocalized: true,
      sortOrder: 40,
    },
    ...imageProps(50),
  },
});

export const CorelCustomerStoryContentType = contentType({
  key: 'CorelCustomerStory',
  baseType: '_component',
  displayName: 'Corel Item: Customer story',
  description: 'A featured-customer quote with name, role and photo.',
  properties: {
    Quote: { type: 'string', displayName: 'Quote', isLocalized: true, sortOrder: 10 },
    Name: { type: 'string', displayName: 'Name', isLocalized: true, sortOrder: 20 },
    Role: { type: 'string', displayName: 'Role / company', isLocalized: true, sortOrder: 30 },
    ...imageProps(40),
  },
});

export const CorelTierContentType = contentType({
  key: 'CorelTier',
  baseType: '_component',
  displayName: 'Corel Item: Product tier',
  description: 'One product card: level, name, savings badge, features and included apps.',
  properties: {
    Level: { type: 'string', displayName: 'Level', description: 'Small label, e.g. PROFESSIONAL.', isLocalized: true, sortOrder: 10 },
    Name: { type: 'string', displayName: 'Product name', isLocalized: true, sortOrder: 20 },
    SaveLabel: { type: 'string', displayName: 'Savings badge', description: 'e.g. Save 30%. Leave empty for none.', isLocalized: true, sortOrder: 30 },
    Popular: { type: 'boolean', displayName: 'Most popular', sortOrder: 40 },
    Link: { type: 'link', displayName: 'Link', isLocalized: true, sortOrder: 50 },
    Features: {
      type: 'array',
      displayName: 'Features',
      isLocalized: true,
      sortOrder: 60,
      items: { type: 'string' },
    },
    Apps: {
      type: 'array',
      displayName: 'Apps included',
      isLocalized: true,
      sortOrder: 70,
      items: { type: 'string' },
    },
  },
});

export const CorelPurchasePlanContentType = contentType({
  key: 'CorelPurchasePlan',
  baseType: '_component',
  displayName: 'Corel Item: Purchase plan',
  description: 'One tab of the purchase-options card (e.g. Annual plan, One-time purchase).',
  properties: {
    Label: { type: 'string', displayName: 'Tab label', isLocalized: true, sortOrder: 10 },
    Tag: { type: 'string', displayName: 'Tab tag', description: 'e.g. New in 2026.', isLocalized: true, sortOrder: 20 },
    Headline: { type: 'string', displayName: 'Tab price line', description: 'e.g. $15.42/mo.', isLocalized: true, sortOrder: 30 },
    Blurb: { type: 'string', displayName: 'Description', isLocalized: true, sortOrder: 40 },
    SaveLabel: { type: 'string', displayName: 'Savings badge', isLocalized: true, sortOrder: 50 },
    Price: { type: 'string', displayName: 'Price', description: 'Text, e.g. $185.00.', isLocalized: true, sortOrder: 60 },
    Unit: { type: 'string', displayName: 'Price unit', description: 'e.g. /year.', isLocalized: true, sortOrder: 70 },
    WasPrice: { type: 'string', displayName: 'Original price', isLocalized: true, sortOrder: 80 },
    Cta: { type: 'link', displayName: 'Buy button', isLocalized: true, sortOrder: 90 },
    ShowSubscriptionLinks: {
      type: 'boolean',
      displayName: 'Show subscription links',
      description: 'Shows the block-level "features" and "renew" links under this plan.',
      sortOrder: 100,
    },
    PromoTitle: { type: 'string', displayName: 'Promo title', isLocalized: true, sortOrder: 110 },
    PromoText: { type: 'string', displayName: 'Promo text', isLocalized: true, sortOrder: 120 },
  },
});

export const CorelAppItemContentType = contentType({
  key: 'CorelAppItem',
  baseType: '_component',
  displayName: 'Corel Item: App',
  description: 'An application in the suite: icon, name, tagline and description.',
  properties: {
    Name: { type: 'string', displayName: 'Name', isLocalized: true, sortOrder: 10 },
    Subtitle: { type: 'string', displayName: 'Tagline', isLocalized: true, sortOrder: 20 },
    Description: { type: 'string', displayName: 'Description', isLocalized: true, sortOrder: 30 },
    SubscriberExclusive: { type: 'boolean', displayName: 'Subscriber exclusive', sortOrder: 40 },
    Bullets: {
      type: 'array',
      displayName: 'Highlights',
      description: 'Optional bullet list (used by the featured app in "Included apps").',
      isLocalized: true,
      sortOrder: 50,
      items: { type: 'string' },
    },
    ...imageProps(60),
  },
});

export const CorelRatingItemContentType = contentType({
  key: 'CorelRatingItem',
  baseType: '_component',
  displayName: 'Corel Item: Rating',
  description: 'A review-site score (e.g. G2 4.3/5) linking to the reviews.',
  properties: {
    Source: { type: 'string', displayName: 'Review site', isLocalized: true, sortOrder: 10 },
    Score: { type: 'string', displayName: 'Score', description: 'e.g. 4.5/5. Only the part before / is shown large.', sortOrder: 20 },
    Link: { type: 'link', displayName: 'Reviews link', sortOrder: 30 },
  },
});

export const CorelComparisonRowContentType = contentType({
  key: 'CorelComparisonRow',
  baseType: '_component',
  displayName: 'Corel Item: Comparison row',
  description: 'One row of a two-column comparison table.',
  properties: {
    Group: {
      type: 'string',
      displayName: 'Group heading',
      description: 'A heading row is inserted whenever this value changes from the previous row.',
      isLocalized: true,
      sortOrder: 10,
    },
    Label: { type: 'string', displayName: 'Feature', isLocalized: true, sortOrder: 20 },
    Description: { type: 'string', displayName: 'Description', isLocalized: true, sortOrder: 30 },
    Col1Type: choice('Column 1 shows', YES_NO_TEXT, 40),
    Col1Text: { type: 'string', displayName: 'Column 1 text', description: 'Used when "Custom text" is chosen.', isLocalized: true, sortOrder: 41 },
    Col2Type: choice('Column 2 shows', YES_NO_TEXT, 50),
    Col2Text: { type: 'string', displayName: 'Column 2 text', description: 'Used when "Custom text" is chosen.', isLocalized: true, sortOrder: 51 },
  },
});

export const CorelFaqItemContentType = contentType({
  key: 'CorelFaqItem',
  baseType: '_component',
  displayName: 'Corel Item: FAQ',
  description: 'One question and answer.',
  properties: {
    Question: { type: 'string', displayName: 'Question', isLocalized: true, sortOrder: 10 },
    Answer: { type: 'richText', displayName: 'Answer', isLocalized: true, sortOrder: 20 },
  },
});

export const CorelSpecItemContentType = contentType({
  key: 'CorelSpecItem',
  baseType: '_component',
  displayName: 'Corel Item: Tech spec',
  description: 'One spec line (e.g. Memory → 8 GB RAM) belonging to a platform.',
  properties: {
    Group: {
      type: 'string',
      displayName: 'Platform',
      description: 'Consecutive specs with the same platform are shown in one card (e.g. Windows).',
      isLocalized: true,
      sortOrder: 10,
    },
    GroupNote: { type: 'string', displayName: 'Platform note', description: 'Optional line under the platform name; read from its first spec.', isLocalized: true, sortOrder: 20 },
    Heading: { type: 'string', displayName: 'Spec', isLocalized: true, sortOrder: 30 },
    Detail: { type: 'string', displayName: 'Detail', isLocalized: true, sortOrder: 40 },
  },
});

export const CorelOfferContentType = contentType({
  key: 'CorelOffer',
  baseType: '_component',
  displayName: 'Corel Item: Offer',
  description: 'A special-offer card with product art, savings and price.',
  properties: {
    Name: { type: 'string', displayName: 'Product name', isLocalized: true, sortOrder: 10 },
    Description: { type: 'string', displayName: 'Description', isLocalized: true, sortOrder: 20 },
    SaveLabel: { type: 'string', displayName: 'Savings badge', isLocalized: true, sortOrder: 30 },
    PromoText: { type: 'string', displayName: 'Promo text', isLocalized: true, sortOrder: 40 },
    WasPrice: { type: 'string', displayName: 'Original price', isLocalized: true, sortOrder: 50 },
    Price: { type: 'string', displayName: 'Price', isLocalized: true, sortOrder: 60 },
    Unit: { type: 'string', displayName: 'Price unit', isLocalized: true, sortOrder: 70 },
    Popular: { type: 'boolean', displayName: 'Most popular', sortOrder: 80 },
    Link: { type: 'link', displayName: 'Link', isLocalized: true, sortOrder: 90 },
    ...imageProps(100),
  },
});

export const CorelIconCardContentType = contentType({
  key: 'CorelIconCard',
  baseType: '_component',
  displayName: 'Corel Item: Icon card',
  description: 'A tile with an icon or small image, title, description and link.',
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 10 },
    Description: { type: 'string', displayName: 'Description', isLocalized: true, sortOrder: 20 },
    Link: { type: 'link', displayName: 'Link', description: 'The link text is used as the call to action in "Inspire" style.', isLocalized: true, sortOrder: 30 },
    Icon: choice('Icon', ICON_OPTIONS, 40, 'Shown when no image is set.'),
    ...imageProps(50),
  },
});

export const CorelContactCardContentType = contentType({
  key: 'CorelContactCard',
  baseType: '_component',
  displayName: 'Corel Item: Contact card',
  description: 'A support contact channel: communities, ticket, chat or phone.',
  properties: {
    Icon: choice('Icon', ICON_OPTIONS, 10),
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 20 },
    Description: { type: 'string', displayName: 'Description', isLocalized: true, sortOrder: 30 },
    PrimaryLink: { type: 'link', displayName: 'Primary link', isLocalized: true, sortOrder: 40 },
    SecondaryLink: { type: 'link', displayName: 'Secondary link', isLocalized: true, sortOrder: 50 },
    PhoneNumber: { type: 'string', displayName: 'Phone number', description: 'Shown instead of the description, as a tel: link.', sortOrder: 60 },
    ShowDirectory: { type: 'boolean', displayName: 'Show international numbers', description: 'Adds the toggle for the block\'s phone directory.', sortOrder: 70 },
  },
});

export const CorelPhoneEntryContentType = contentType({
  key: 'CorelPhoneEntry',
  baseType: '_component',
  displayName: 'Corel Item: Phone number',
  description: 'One country phone number belonging to a region.',
  properties: {
    Region: { type: 'string', displayName: 'Region', description: 'Consecutive entries with the same region are listed together.', isLocalized: true, sortOrder: 10 },
    Country: { type: 'string', displayName: 'Country', isLocalized: true, sortOrder: 20 },
    PhoneNumber: { type: 'string', displayName: 'Number', sortOrder: 30 },
  },
});

/** Every item type — spread into the registry's content-type list. */
export const corelItemContentTypes = [
  CorelImageItemContentType,
  CorelTextCardContentType,
  CorelCustomerStoryContentType,
  CorelTierContentType,
  CorelPurchasePlanContentType,
  CorelAppItemContentType,
  CorelRatingItemContentType,
  CorelComparisonRowContentType,
  CorelFaqItemContentType,
  CorelSpecItemContentType,
  CorelOfferContentType,
  CorelIconCardContentType,
  CorelContactCardContentType,
  CorelPhoneEntryContentType,
];
