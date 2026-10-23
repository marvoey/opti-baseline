import type { CmsItem } from '@/lib/cmsDelivery';

// Nested Content Delivery payload from build-instructions/Shutterfly Master Execution Matrix &
// Pure Mark AI Demo Guide.md (Track 1): LandingPage > Container > GridRow > PromoCard, with a
// controlTab and per-breakpoint deviceTabs. The mobile tab carries the planted overrides.
export const CAMPAIGN_DATABASE: Record<string, CmsItem> = {
  '1042': {
    contentLink: { id: 1042, workId: 0 },
    name: 'Holiday Photo Books Campaign Page',
    contentType: ['Page', 'CampaignLandingPage'],
    mainContentArea: [
      {
        contentLink: { id: 2010 },
        name: 'Level 1 - Main Hero Container',
        contentType: ['Block', 'ContainerBlock'],
        controlTab: { isVisible: true, theme: 'holiday-red' },
        children: [
          {
            contentLink: { id: 3055 },
            name: 'Level 2 - Holiday Promo Grid Row',
            contentType: ['Block', 'GridRowBlock'],
            controlTab: { columns: 3 },
            children: [
              {
                contentLink: { id: 4892 },
                name: 'Level 3 - 50% Off Hardcover Photo Book Card',
                contentType: ['Block', 'PromoCardBlock'],
                controlTab: {
                  headline: '50% Off Hardcover Photo Books',
                  showPromoBadge: true,
                  ctaUrl: '/photo-books/hardcover',
                },
                deviceTabs: {
                  desktop: { inheritFromControl: true, showPromoBadge: true, overridePriceText: null },
                  tablet: { inheritFromControl: true, showPromoBadge: true, overridePriceText: null },
                  mobile: {
                    inheritFromControl: false,
                    showPromoBadge: false,
                    overridePriceText: 'Excludes Disney Collection',
                    hiddenLegacyBannerId: 'BUG_BANNER_99',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

// Friendly URL -> content id, kept outside the payload so the payload stays verbatim.
export const CAMPAIGN_ROUTES: Record<string, string> = {
  '/en/holiday-photo-books/': '1042',
};

export const CAMPAIGN_SITE = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Shutterfly Campaign Site',
    startPage: { id: 1042, url: '/en/holiday-photo-books/' },
    languages: [{ name: 'en', displayName: 'English', isMasterLanguage: true }],
  },
];
