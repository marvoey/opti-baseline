import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ctaHref } from './shared';

export const MetricContentType = contentType({
  key: 'UpsMetric',
  baseType: '_component',
  displayName: 'UPS Metric',
  description: 'A headline number with a label, e.g. "200+" countries and territories served.',
  properties: {
    Value: { type: 'string', displayName: 'Value', sortOrder: 10 },
    Label: { type: 'string', displayName: 'Label', isLocalized: true, sortOrder: 20 },
  },
});

export const StoryCardContentType = contentType({
  key: 'UpsStoryCard',
  baseType: '_component',
  displayName: 'UPS Story Card',
  description: 'A story teaser with an image, a title and a link.',
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 10 },
    ImageUrl: { type: 'url', displayName: 'Image URL', sortOrder: 20 },
    Link: { type: 'link', displayName: 'Link', isLocalized: true, sortOrder: 30 },
  },
});

export const CarouselSectionContentType = contentType({
  key: 'UpsCarouselSection',
  baseType: '_component',
  displayName: 'UPS Stories Carousel',
  description: '"Delivering What Matters": metrics plus a scrolling row of story cards.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Metrics: {
      type: 'array',
      displayName: 'Metrics',
      items: { type: 'component', contentType: MetricContentType },
      sortOrder: 20,
    },
    Stories: {
      type: 'array',
      displayName: 'Stories',
      items: { type: 'component', contentType: StoryCardContentType },
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof CarouselSectionContentType> };

export default function CarouselSection({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const metrics = content.Metrics ?? [];
  const stories = content.Stories ?? [];

  return (
    <section className="w-full bg-blue-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h2 {...pa('Heading')} className="mb-8 text-center text-3xl font-bold text-blue-950">
          {content.Heading || 'Delivering What Matters'}
        </h2>

        {metrics.length > 0 && (
          <dl {...pa('Metrics')} className="mb-10 grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
            {metrics.map((m, i) => (
              <div key={i}>
                <dt className="text-4xl font-bold text-blue-950">{m.Value}</dt>
                <dd className="mt-1 text-sm text-blue-950/70">{m.Label}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* CSS scroll-snap carousel — no client JS needed */}
        <ul {...pa('Stories')} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {stories.map((s, i) => (
            <li key={i} className="w-72 shrink-0 snap-start overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
              {s.ImageUrl?.default && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.ImageUrl.default} alt="" className="h-40 w-full object-cover" />
              )}
              <a href={ctaHref(s.Link)} className="block p-4 text-sm font-bold text-blue-950 hover:underline">
                {s.Title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
