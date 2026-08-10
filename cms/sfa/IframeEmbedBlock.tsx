import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { sfaContainerWidthSettings, containerWidthClass } from './sfaDisplaySettings';
import { taxonomyEnums, PRODUCT_CATEGORY, MAKER_ATTRIBUTE, RECOGNITION, EVENT } from '@/lib/cms/taxonomy';

export const IframeEmbedBlockContentType = contentType({
  key: 'SFA_IframeEmbedBlock',
  baseType: '_component',
  displayName: '(_SFA) External Embed Block',
  description: 'Embeds YouTube, Ceros, or Ad Banners.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    EmbedTitle: {
      type: 'string',
      displayName: 'Internal Title',
      sortOrder: 5,
    },
    IframeUrl: {
      type: 'url',
      displayName: 'Source URL',
      sortOrder: 10,
    },
    Height: {
      type: 'integer',
      displayName: 'Height (px)',
      minimum: 100,
      sortOrder: 15,
    },
    ProductCategory: { type: 'string', format: 'selectOne', displayName: 'Product Category', isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 50, enum: taxonomyEnums(PRODUCT_CATEGORY) },
    MakerAttribute:  { type: 'string', format: 'selectOne', displayName: 'Maker Attribute',  isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 51, enum: taxonomyEnums(MAKER_ATTRIBUTE) },
    Recognition:     { type: 'string', format: 'selectOne', displayName: 'Recognition',       isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 52, enum: taxonomyEnums(RECOGNITION) },
    Event:           { type: 'string', format: 'selectOne', displayName: 'Event',             isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 53, enum: taxonomyEnums(EVENT) },
  },
});

export const IframeEmbedBlockDisplayTemplate = displayTemplate({
  key: 'SFA_IframeEmbedBlockDefault',
  contentType: 'SFA_IframeEmbedBlock',
  isDefault: true,
  displayName: 'External Embed Block',
  settings: sfaContainerWidthSettings,
});

type Props = {
  content: ContentProps<typeof IframeEmbedBlockContentType>;
  displaySettings?: ContentProps<typeof IframeEmbedBlockDisplayTemplate>;
};

export default function IframeEmbedBlock({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const src = content.IframeUrl?.default;
  const height = content.Height ?? 400;
  const widthClass = containerWidthClass(displaySettings?.containerWidth);

  if (!src) return null;

  return (
    <div {...pa(block)} className={widthClass}>
      <div className="w-full">
        <iframe
          {...pa('IframeUrl')}
          title={content.EmbedTitle ?? 'Embedded content'}
          src={src}
          style={{ height: `${height}px` }}
          className="w-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
