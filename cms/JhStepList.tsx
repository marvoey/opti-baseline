import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { numberedItems, numberedProperties } from './shared';

const COUNT = 5;

export const JhStepListContentType = contentType({
  key: 'JhStepList',
  baseType: '_component',
  displayName: 'JH Step List',
  description: 'Numbered "how it works" steps with an optional call to action.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 1 },
    CtaLabel: { type: 'string', displayName: 'CTA Label', isLocalized: true, sortOrder: 2 },
    CtaHref: { type: 'string', displayName: 'CTA Link', sortOrder: 3 },
    ...numberedProperties('Step', 'Step', COUNT, [
      { key: 'Title', label: 'Title' },
      { key: 'Text', label: 'Text' },
    ]),
  },
});

type Props = { content: ContentProps<typeof JhStepListContentType> };

export default function JhStepList({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const steps = numberedItems(content, 'Step', COUNT, ['Title', 'Text']);

  return (
    <section {...pa(block)} className="bg-jh-surface px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {content.Title && (
          <h2 {...pa('Title')} className="text-2xl sm:text-3xl font-extrabold text-jh-navy mb-8">
            {content.Title}
          </h2>
        )}
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.n} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-jh-red text-white font-black mb-3">
                {i + 1}
              </span>
              <h3 {...pa(`Step${step.n}Title`)} className="font-bold text-jh-navy">
                {step.Title}
              </h3>
              <p {...pa(`Step${step.n}Text`)} className="text-sm text-slate-600 mt-1 leading-relaxed">
                {step.Text}
              </p>
            </li>
          ))}
        </ol>
        {content.CtaLabel && (
          <a
            {...pa('CtaLabel')}
            href={content.CtaHref || '#'}
            className="inline-block mt-8 px-7 py-3.5 bg-jh-red hover:bg-jh-red-hover text-white font-bold rounded-lg shadow"
          >
            {content.CtaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
