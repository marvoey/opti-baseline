import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const CardBlockContentType = contentType({
  key: 'CardBlock',
  baseType: '_component',
  displayName: 'v2: Card Block',
  description: 'Micro-container for a single entity: thumbnail, title, summary, tag, and CTA.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      maxLength: 80,
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    SummaryText: {
      type: 'string',
      displayName: 'Summary',
      isLocalized: true,
      sortOrder: 20,
    },
    MetaTag: {
      type: 'string',
      displayName: 'Meta Tag',
      description: 'Category or label badge (e.g. "Case Study", "New").',
      isLocalized: true,
      sortOrder: 30,
    },
    ThumbnailUrl: {
      type: 'url',
      displayName: 'Thumbnail URL',
      isLocalized: true,
      sortOrder: 40,
    },
    ThumbnailAlt: {
      type: 'string',
      displayName: 'Thumbnail Alt Text',
      isLocalized: true,
      sortOrder: 50,
    },
    ActionLabel: {
      type: 'string',
      displayName: 'CTA Label',
      maxLength: 30,
      isLocalized: true,
      sortOrder: 60,
    },
    ActionUrl: {
      type: 'url',
      displayName: 'CTA URL',
      isLocalized: true,
      sortOrder: 70,
    },
    ActionHierarchy: {
      type: 'string',
      displayName: 'CTA Style',
      sortOrder: 80,
      enum: [
        { value: 'primary', displayName: 'Primary' },
        { value: 'secondary', displayName: 'Secondary' },
        { value: 'ghost', displayName: 'Ghost' },
      ],
    },
  },
});

type Props = { content: ContentProps<typeof CardBlockContentType> };

const HIERARCHY_CLASS: Record<string, string> = {
  primary: 'rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500',
  secondary:
    'rounded-full border-2 border-blue-600 px-5 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white',
  ghost: 'text-sm font-bold text-blue-600 underline-offset-2 hover:underline',
};

export default function CardBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const edit = (content as { __context?: { edit?: boolean } }).__context?.edit;
  const thumbnailSrc = content.ThumbnailUrl?.default ?? undefined;
  const actionHref = edit ? undefined : content.ActionUrl?.default ?? undefined;
  const btnClass =
    HIERARCHY_CLASS[content.ActionHierarchy ?? 'ghost'] ?? HIERARCHY_CLASS.ghost;

  return (
    <article
      {...pa(block)}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
    >
      {thumbnailSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...pa('ThumbnailUrl')}
          src={thumbnailSrc}
          alt={content.ThumbnailAlt ?? ''}
          className="aspect-video w-full object-cover"
        />
      )}
      <div className="p-5">
        {content.MetaTag && (
          <span
            {...pa('MetaTag')}
            className="mb-3 inline-block rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700"
          >
            {content.MetaTag}
          </span>
        )}
        <h3 {...pa('Title')} className="text-lg font-bold leading-snug text-gray-900">
          {content.Title}
        </h3>
        {content.SummaryText && (
          <p {...pa('SummaryText')} className="mt-2 text-sm text-gray-600">
            {content.SummaryText}
          </p>
        )}
        {(content.ActionLabel || actionHref) && (
          <div className="mt-4">
            <a {...pa('ActionLabel')} href={actionHref} className={btnClass}>
              {content.ActionLabel ?? 'Learn more'}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
