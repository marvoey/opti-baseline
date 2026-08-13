import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const StringElementContentType = contentType({
  key: 'StringElement',
  baseType: '_component',
  displayName: 'String Element',
  description: 'This is supposed to be an element that can be dragged and dropped in Visual Builder',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    String: {
      type: 'string',
      format: 'shortString',
      displayName: 'String',
      isRequired: false,
    },
  },
});

type Props = { content: ContentProps<typeof StringElementContentType> };

export default function StringElement({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)}>
      <span {...pa('String')}>{content.String}</span>
    </div>
  );
}
