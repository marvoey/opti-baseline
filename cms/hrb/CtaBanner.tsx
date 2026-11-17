import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { eventKeyProperty, tierProperties } from './shared';
import { CtaButton } from './ui';

export const HrbCtaBannerContentType = contentType({
  key: 'HRB_CtaBanner',
  baseType: '_component',
  displayName: '[HRB] CTA Banner',
  description:
    'H&R Block demo: closing banner, "No one offers more ways to get tax help than H&R Block.", with two buttons. Shared item reused as the closing call to action on every page.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Headline: { type: 'string', displayName: 'Headline', isLocalized: true, isRequired: true },
    PrimaryCtaLabel: {
      type: 'string',
      displayName: 'Primary button label',
      isLocalized: true,
      isRequired: false,
    },
    PrimaryCtaUrl: { type: 'url', displayName: 'Primary button URL', isRequired: false },
    PrimaryCtaEventKey: eventKeyProperty('Primary button event key'),
    SecondaryCtaLabel: {
      type: 'string',
      displayName: 'Secondary button label',
      isLocalized: true,
      isRequired: false,
    },
    SecondaryCtaUrl: { type: 'url', displayName: 'Secondary button URL', isRequired: false },
    SecondaryCtaEventKey: eventKeyProperty('Secondary button event key'),
    ...tierProperties(),
  },
});

export const HrbCtaBannerDisplayTemplate = displayTemplate({
  key: 'HRB_CtaBannerStyle',
  isDefault: true,
  displayName: '[HRB] CTA banner style',
  contentType: 'HRB_CtaBanner',
  settings: {
    Theme: {
      editor: 'select',
      displayName: 'Theme',
      sortOrder: 0,
      choices: {
        darkGreen: { displayName: 'Dark green', sortOrder: 1 },
        sand: { displayName: 'Sand', sortOrder: 2 },
      },
    },
  },
});

type Props = {
  content: ContentProps<typeof HrbCtaBannerContentType>;
  displaySettings?: ContentProps<typeof HrbCtaBannerDisplayTemplate>;
};

export default function CtaBanner({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const dark = displaySettings?.Theme !== 'sand';

  return (
    <section
      {...pa(block)}
      data-dark={dark}
      className={`group w-full px-6 py-12 text-center ${dark ? 'bg-blue-950 text-white' : 'bg-hrb-sand text-hrb-ink'}`}
    >
      <h2 {...pa('Headline')} className="mx-auto max-w-2xl text-2xl font-semibold md:text-3xl">
        {content.Headline}
      </h2>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <CtaButton
          label={content.PrimaryCtaLabel}
          url={content.PrimaryCtaUrl}
          eventKey={content.PrimaryCtaEventKey}
          dark={dark}
          editProps={pa('PrimaryCtaLabel')}
        />
        <CtaButton
          label={content.SecondaryCtaLabel}
          url={content.SecondaryCtaUrl}
          eventKey={content.SecondaryCtaEventKey}
          variant="secondary"
          dark={dark}
          editProps={pa('SecondaryCtaLabel')}
        />
      </div>
    </section>
  );
}
