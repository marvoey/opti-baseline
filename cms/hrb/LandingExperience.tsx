import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { expandReferences, previewContextOf } from '../expandRefs';
import { ComponentWrapper } from '../wrappers';
import { HrbComplianceDisclosureContentType } from './ComplianceDisclosure';
import { tierProperties } from './shared';

export const HrbLandingExperienceContentType = contentType({
  key: 'HRB_LandingExperience',
  baseType: '_experience',
  displayName: '[HRB] Landing Experience',
  description:
    'H&R Block demo: the Visual Builder page type for every composed marketing page: Home, the campaign page, the two product pages, Offices and the Tax Center hub. The archetype is a property, not a new type.',
  // Referenced by key (not import) to avoid a circular import with the category page.
  mayContainTypes: ['HRB_TaxCenterCategoryPage', 'HRB_LandingExperience'],
  properties: {
    MetaTitle: { type: 'string', displayName: 'Meta title', isLocalized: true, isRequired: false },
    MetaDescription: {
      type: 'string',
      displayName: 'Meta description',
      isLocalized: true,
      isRequired: false,
    },
    PageType: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Page archetype',
      description: 'Groups pages in Graph queries and analytics. Not localized.',
      isRequired: false,
      enum: [
        { value: 'home', displayName: 'Home' },
        { value: 'campaign', displayName: 'Campaign landing' },
        { value: 'product', displayName: 'Product' },
        { value: 'locator', displayName: 'Office locator' },
        { value: 'hub', displayName: 'Tax Center hub' },
      ],
    },
    Disclosure: {
      type: 'contentReference',
      displayName: 'Compliance disclosure',
      description:
        'The shared disclosure block. Rendered in the footer of every page, so editors cannot leave it out.',
      isRequired: true,
      allowedTypes: [HrbComplianceDisclosureContentType],
    },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbLandingExperienceContentType> };

export default async function LandingExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.composition?.nodes ?? [];
  const [disclosure] = await expandReferences<
    ContentProps<typeof HrbComplianceDisclosureContentType>
  >([content.Disclosure], previewContextOf(content));

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)} data-page-type={content.PageType ?? undefined}>
      <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />
      {disclosure && (
        <footer className="bg-hrb-warm-white px-6 py-8">
          <div className="mx-auto max-w-6xl prose prose-sm text-xs text-hrb-ink/70">
            <RichTextRenderer content={disclosure.Body?.json} />
          </div>
        </footer>
      )}
    </main>
  );
}
