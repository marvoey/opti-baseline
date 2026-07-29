import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import Link from 'next/link';

export const MainNavContentType = contentType({
  key: 'MainNav',
  baseType: '_component',
  displayName: '[CIBC] Main Nav Links',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    MainNavLinks: {
      type: 'array',
      format: 'LinkCollection',
      displayName: 'Links',
      isRequired: false,
      items: { type: 'link' },
    },
  },
});

type Props = { content: ContentProps<typeof MainNavContentType> };

export default function MainNav({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const links = (content.MainNavLinks as Array<{ text?: string; default?: string }> | null) ?? [];
  return (
    <nav {...pa(content.__composition)} className="hidden lg:flex gap-8 font-semibold text-white/80">
      {links.map((link, i) => (
        <Link
          key={i}
          href={link.default ?? '#'}
          className="hover:text-white flex items-center gap-1 transition-colors"
        >
          {link.text}
        </Link>
      ))}
    </nav>
  );
}
