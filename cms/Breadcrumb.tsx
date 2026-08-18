import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import BreadcrumbComponent from '@/app/_components/Breadcrumb';

export const BreadcrumbContentType = contentType({
  key: 'Breadcrumb',
  baseType: '_component',
  displayName: 'Breadcrumb',
  description: 'Page breadcrumb navigation trail.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

type Props = { content: ContentProps<typeof BreadcrumbContentType> };

export default function Breadcrumb({ content: _content }: Props) {
  return <BreadcrumbComponent />;
}
