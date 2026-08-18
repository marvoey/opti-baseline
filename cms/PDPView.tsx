import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import PDPViewComponent from '@/app/_components/custom/PDPView';

export const PDPViewContentType = contentType({
  key: 'PDPView',
  baseType: '_component',
  displayName: 'Product Details',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Disclaimer: {
      type: 'content',
      displayName: 'Disclaimer',
      isLocalized: true,
      isRequired: false,
    },
    Enrichment: {
      type: 'array',
      displayName: 'Enrichment',
      isLocalized: true,
      isRequired: false,
      items: { type: 'content' },
    },
  },
});

type Props = { content: ContentProps<typeof PDPViewContentType> };

export default function PDPView({ content: _content }: Props) {
  return <PDPViewComponent />;
}
