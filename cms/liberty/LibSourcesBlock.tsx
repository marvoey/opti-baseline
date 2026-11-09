import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import SourcesBlock from '@/app/_components_liberty/SourcesBlock';
import LibertyBlock from './LibertyBlock';
import { blockSpacing, resolveHref } from './shared';

/** One source in the list. Embedded in `LibSourcesBlock`, never placed on its own. */
export const LibSourceContentType = contentType({
  key: 'LibSource',
  baseType: '_component',
  displayName: 'Liberty Source',
  description: 'One source for an answer: title, site, short quote and link.',
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 10 },
    Domain: {
      type: 'string',
      displayName: 'Site',
      description: 'Site the source comes from, e.g. libertymutual.com.',
      isLocalized: true,
      sortOrder: 20,
    },
    Quote: { type: 'string', displayName: 'Quote', isLocalized: true, sortOrder: 30 },
    LinkUrl: {
      type: 'string',
      displayName: 'Link URL (text)',
      description:
        'Type a path such as /ask-liberty/rental-car or a full https:// address. If filled, it is used instead of the Link picker below.',
      isLocalized: true,
      sortOrder: 40,
    },
    Link: {
      type: 'link',
      displayName: 'Link (picker)',
      description: 'Choose a page. Used only when Link URL (text) is empty.',
      isLocalized: true,
      sortOrder: 50,
    },
  },
});

/** C29 — numbered sources with quotes, plus the legal disclaimer. */
export const LibSourcesBlockContentType = contentType({
  key: 'LibSourcesBlock',
  baseType: '_component',
  displayName: 'Liberty: Sources',
  description: 'Numbered list of sources for an answer, with the legal disclaimer.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: {
      type: 'string',
      displayName: 'Heading',
      isLocalized: true,
      sortOrder: 10,
    },
    Sources: {
      type: 'array',
      displayName: 'Sources',
      description: 'Add one Liberty Source per source. Numbered automatically.',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 10,
      items: { type: 'component', contentType: LibSourceContentType },
    },
    Disclaimer: {
      type: 'string',
      displayName: 'Disclaimer',
      description: 'Small legal text under the list. Leave empty to hide.',
      isLocalized: true,
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof LibSourcesBlockContentType> };

export default function LibSourcesBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <LibertyBlock content={content}>
      <div {...pa('Sources')}>
        <SourcesBlock
          className=""
          heading={content.Heading ?? ''}
          disclaimer={content.Disclaimer ?? ''}
          sources={(content.Sources ?? []).map((s) => ({
            title: s?.Title ?? '',
            domain: s?.Domain ?? '',
            quote: s?.Quote ?? '',
            href: resolveHref(s?.LinkUrl, s?.Link),
          }))}
        />
      </div>
    </LibertyBlock>
  );
}
