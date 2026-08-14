import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const CardBlockContentType = contentType({
  key: 'CardBlock',
  baseType: '_component',
  displayName: 'Card Block',
  description: 'An individual blog post card used within listing grids.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    MainImage: {
      type: 'contentReference',
      displayName: 'Main Image',
      allowedTypes: ['_image'],
    },
    CategoryTitle: {
      type: 'string',
      format: 'shortString',
      displayName: 'Category Title',
    },
    Title: {
      type: 'string',
      format: 'shortString',
      displayName: 'Title',
      isRequired: true,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
    },
  },
});

type Props = { content: ContentProps<typeof CardBlockContentType> };

type Ref = { key?: string; url?: string | { default?: string; hierarchical?: string } } | null | undefined;

function resolveUrl(ref: Ref): string {
  if (!ref) return '';
  const url = ref.url;
  if (!url) return '';
  if (typeof url === 'string') return url;
  return url.default ?? url.hierarchical ?? '';
}

export default function CardBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const mainImageUrl = resolveUrl(content.MainImage as Ref);

  return (
    <article
      {...pa(block)}
      className="flex flex-col items-start justify-between rounded-2xl border-4 border-blue-100 shadow-md dark:border-blue-900"
    >
      <div className="relative w-full">
        {mainImageUrl && (
          <img
            {...pa('MainImage')}
            src={mainImageUrl}
            alt=""
            className="aspect-video w-full rounded-t-2xl object-cover"
          />
        )}
      </div>

      <div className="flex max-w-xl grow p-2 flex-col">
        {content.CategoryTitle && (
          <div className="flex items-center gap-x-4 text-xs">
            <span
              {...pa('CategoryTitle')}
              className="rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-800 dark:bg-blue-950/60 dark:text-blue-200"
            >
              {content.CategoryTitle}
            </span>
          </div>
        )}

        <div className="group relative grow">
          <h3
            {...pa('Title')}
            className="mt-3 text-lg/6 font-semibold text-blue-950 dark:text-blue-50"
          >
            {content.Title ?? 'Card Title'}
          </h3>
          {content.Description && (
            <p
              {...pa('Description')}
              className="mt-5 line-clamp-3 text-sm/6 text-blue-900/70 dark:text-blue-100/70"
            >
              {content.Description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
