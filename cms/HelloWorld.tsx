import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const HelloWorldContentType = contentType({
  key: 'HelloWorld',
  baseType: '_component',
  displayName: 'Hello World',
  description: 'A test component.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

type Props = { content: ContentProps<typeof HelloWorldContentType> };

export default function HelloWorld({ content: _ }: Props) {
  return <p>Hello World!</p>;
}
