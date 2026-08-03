import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const ArticleCardContentType = contentType({
  key: 'ArticleCardBlock',
  baseType: '_component',
  displayName: 'Article Card Block',
  description: 'Represents a single related article thumbnail and link.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    ThumbnailImage: {
      type: 'contentReference',
      displayName: 'Thumbnail Image',
      allowedTypes: ['_image'],
      sortOrder: 10,
    },
    CardTitle: {
      type: 'string',
      displayName: 'Card Title',
      isLocalized: true,
      sortOrder: 20,
    },
    PostLink: {
      type: 'url',
      displayName: 'Post Link',
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof ArticleCardContentType> };

export default function ArticleCard({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const imageSrc = content.ThumbnailImage ? src(content.ThumbnailImage) : undefined;
  const href = content.PostLink?.default ?? '#';

  return (
    <a
      {...pa(block)}
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl bg-blue-100 transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-blue-200">
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...pa('ThumbnailImage')}
            src={imageSrc}
            alt={content.CardTitle ?? ''}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3
          {...pa('CardTitle')}
          className="line-clamp-4 text-lg font-bold leading-snug text-blue-900"
        >
          {content.CardTitle}
        </h3>
        <p className="mt-auto flex items-center gap-1 text-sm font-semibold text-pink">
          Read post <span aria-hidden="true">→</span>
        </p>
      </div>
    </a>
  );
}
