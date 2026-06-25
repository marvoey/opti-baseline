import { contentType } from '@optimizely/cms-sdk';

/**
 * Navigation content model — embedded component ("Block") types composed into
 * the CibcSiteSettings page (see cms/CibcSiteSettings.tsx). Together they let
 * editors author the full main-nav spec (dev-notes/main-nav-spec.md) from the
 * CMS: dropdowns, column layouts, mega-menu featured cards, and visibility
 * rules — no code deploy.
 *
 * These are EMBEDDED blocks (used only as `component` properties), not Visual
 * Builder elements, so they declare no `compositionBehaviors` and need no React
 * renderer — they're fetched as part of the settings singleton and rendered by
 * the site chrome (app/_components/MainNav.tsx).
 *
 * Nesting note: the spec caps the menu at two levels. Rather than a self-
 * referential type (which would recurse GraphQL fragment generation without
 * bound), the two levels are modelled as two bounded types — NavMenuItem
 * (top level, carries layout/featured/children) and NavChildLink (leaf row).
 */

/** Icon slugs editors may choose. Mirror of ICON_SLUGS in app/_components/nav/icons.tsx — keep in sync. */
const ICON_ENUM = [
  { value: 'chart-bar', displayName: 'Bar chart' },
  { value: 'chart-pie', displayName: 'Pie chart' },
  { value: 'flask', displayName: 'Flask' },
  { value: 'code', displayName: 'Code' },
  { value: 'layers', displayName: 'Layers' },
  { value: 'book', displayName: 'Book' },
  { value: 'users', displayName: 'Users' },
  { value: 'zap', displayName: 'Zap' },
  { value: 'settings', displayName: 'Settings' },
  { value: 'file', displayName: 'File' },
  { value: 'briefcase', displayName: 'Briefcase' },
  { value: 'support', displayName: 'Support' },
];

/** Promotional card shown on the right of a `mega` dropdown (spec §2.3). */
export const NavFeaturedCardContentType = contentType({
  key: 'NavFeaturedCard',
  baseType: '_component',
  displayName: 'Nav: Featured Card',
  description: 'Promotional card for a mega-menu dropdown.',
  properties: {
    Tag: {
      type: 'string',
      displayName: 'Tag',
      description: 'Short eyebrow label, e.g. “NEW”, “WEBINAR”.',
      maxLength: 24,
      isLocalized: true,
      sortOrder: 10,
    },
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'Card title. ≤60 chars.',
      maxLength: 60,
      isRequired: true,
      isLocalized: true,
      sortOrder: 20,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
      description: 'Supporting copy. ≤120 chars.',
      maxLength: 120,
      isLocalized: true,
      sortOrder: 30,
    },
    Image: {
      type: 'contentReference',
      displayName: 'Image',
      description: 'Card image asset (~400×200). Optional.',
      allowedTypes: ['_image'],
      isLocalized: true,
      sortOrder: 40,
    },
    ImageUrl: {
      type: 'url',
      displayName: 'Image URL',
      description: 'Optional. Full image URL — overrides the Image asset when set.',
      isLocalized: true,
      sortOrder: 50,
    },
    ImageAlt: {
      type: 'string',
      displayName: 'Image Alt',
      description: 'Alt text — required if an image is set, else the image is omitted.',
      maxLength: 160,
      isLocalized: true,
      sortOrder: 60,
    },
    Cta: {
      type: 'link',
      displayName: 'Call to action',
      description: 'Destination + link label (the link text becomes the CTA label).',
      isRequired: true,
      isLocalized: true,
      sortOrder: 70,
    },
  },
});

/** A single display condition for an item (spec §2.4). */
export const NavVisibilityRuleContentType = contentType({
  key: 'NavVisibilityRule',
  baseType: '_component',
  displayName: 'Nav: Visibility Rule',
  description: 'Client-side display condition. NOT a substitute for server-side access control.',
  properties: {
    Condition: {
      type: 'string',
      displayName: 'Condition',
      description: '“Authenticated” shows only to logged-in users; “Role” also checks the role list.',
      isRequired: true,
      sortOrder: 10,
      enum: [
        { value: 'authenticated', displayName: 'Authenticated' },
        { value: 'role', displayName: 'Role' },
      ],
    },
    Roles: {
      type: 'array',
      displayName: 'Roles',
      description: 'Required when Condition is “Role”. Item shows if the user has any of these roles.',
      sortOrder: 20,
      items: { type: 'string' },
    },
  },
});

/** Leaf dropdown row — the second (and deepest) nav level (spec §2.2). */
export const NavChildLinkContentType = contentType({
  key: 'NavChildLink',
  baseType: '_component',
  displayName: 'Nav: Child Link',
  description: 'A link row inside a dropdown.',
  properties: {
    Label: {
      type: 'string',
      displayName: 'Label',
      description: 'Display text. Keep under ~20 characters.',
      maxLength: 40,
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    Link: {
      type: 'link',
      displayName: 'Link',
      description: 'Destination. Set “Open in new window” on the link to open in a new tab.',
      isLocalized: true,
      sortOrder: 20,
    },
    Icon: {
      type: 'string',
      displayName: 'Icon',
      description: 'Optional icon shown beside the label.',
      sortOrder: 30,
      enum: ICON_ENUM,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
      description: 'Short subtitle under the label. ≤60 chars.',
      maxLength: 60,
      isLocalized: true,
      sortOrder: 40,
    },
    VisibilityRules: {
      type: 'array',
      displayName: 'Visibility Rules',
      description: 'Optional display conditions (all must pass).',
      sortOrder: 50,
      items: { type: 'component', contentType: NavVisibilityRuleContentType },
    },
  },
});

/** Top-level nav entry — carries layout, featured card and children (spec §2.2). */
export const NavMenuItemContentType = contentType({
  key: 'NavMenuItem',
  baseType: '_component',
  displayName: 'Nav: Menu Item',
  description: 'A top-level navigation entry. Add children to make it a dropdown.',
  properties: {
    Label: {
      type: 'string',
      displayName: 'Label',
      description: 'Display text. Keep under ~20 characters.',
      maxLength: 40,
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    Link: {
      type: 'link',
      displayName: 'Link',
      description: 'Destination. Leave the URL empty for a dropdown-only trigger with no page of its own.',
      isLocalized: true,
      sortOrder: 20,
    },
    Icon: {
      type: 'string',
      displayName: 'Icon',
      description: 'Optional icon (shown in dropdown rows, not the top bar).',
      sortOrder: 30,
      enum: ICON_ENUM,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
      description: 'Short subtitle. ≤60 chars.',
      maxLength: 60,
      isLocalized: true,
      sortOrder: 40,
    },
    ColumnLayout: {
      type: 'string',
      displayName: 'Dropdown layout',
      description: 'How children are laid out. Ignored when there are no children.',
      sortOrder: 50,
      enum: [
        { value: 'single', displayName: 'Single column' },
        { value: 'cols2', displayName: 'Two columns' },
        { value: 'cols3', displayName: 'Three columns' },
        { value: 'mega', displayName: 'Mega menu (with featured card)' },
      ],
    },
    FeaturedItem: {
      type: 'component',
      contentType: NavFeaturedCardContentType,
      displayName: 'Featured card',
      description: 'Promotional card. Only shown when layout is “Mega menu”.',
      sortOrder: 60,
    },
    VisibilityRules: {
      type: 'array',
      displayName: 'Visibility Rules',
      description: 'Optional display conditions (all must pass).',
      sortOrder: 70,
      items: { type: 'component', contentType: NavVisibilityRuleContentType },
    },
    Children: {
      type: 'array',
      displayName: 'Children',
      description: 'Dropdown rows. Empty = a plain top-level link.',
      sortOrder: 80,
      items: { type: 'component', contentType: NavChildLinkContentType },
    },
  },
});

/** A footer link column (heading + links). */
export const FooterColumnContentType = contentType({
  key: 'FooterColumn',
  baseType: '_component',
  displayName: 'Footer: Column',
  description: 'A heading and a list of links in the footer.',
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      maxLength: 40,
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    Links: {
      type: 'array',
      displayName: 'Links',
      sortOrder: 20,
      items: { type: 'link' },
    },
  },
});
