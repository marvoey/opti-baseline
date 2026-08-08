import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { sfaContainerWidthSettings } from './sfaDisplaySettings';

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
  const constrained = displaySettings?.containerWidth === 'constrained';

  if (!src) return null;

  return (
    <div {...pa(block)} className={constrained ? 'mx-auto max-w-3xl' : undefined}>
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
