import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { Quote } from 'lucide-react';
import { AnimatedMetric } from '@/app/_components/AnimatedMetric';

import { industryProperty, personaProperty } from './taxonomy';

/**
 * ProofBlock — client proof point (metric + quote) for the NIQ ABM demo. No
 * equivalent type exists in the tenant yet: CardPrimitiveBlock is the closest
 * relative but models a generic card, not a metric/quote pairing, so this is
 * a net-new dedicated content type.
 */
export const ProofBlockContentType = contentType({
  key: 'ProofBlock',
  baseType: '_component',
  displayName: 'Proof Block',
  description: 'Client proof point: a metric, its label, and a supporting quote.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    MetricNumber: {
      type: 'string',
      format: 'shortString',
      displayName: 'Metric Number',
      description: 'The headline stat, e.g. "-18%" or "92%".',
      isLocalized: true,
      isRequired: true,
      sortOrder: 1,
    },
    MetricLabel: {
      type: 'string',
      format: 'shortString',
      displayName: 'Metric Label',
      description: 'What the metric measures, e.g. "Retailer Out-of-Stocks".',
      isLocalized: true,
      isRequired: true,
      sortOrder: 2,
    },
    ClientQuote: {
      type: 'string',
      displayName: 'Client Quote',
      description: '1–2 sentence supporting quote.',
      isLocalized: true,
      sortOrder: 3,
    },
    ClientIdentifier: {
      type: 'string',
      format: 'shortString',
      displayName: 'Client Identifier',
      description: 'Anonymized client descriptor, e.g. "Tier-1 Global Personal Care Brand".',
      isLocalized: true,
      sortOrder: 4,
    },
    ...industryProperty(20),
    ...personaProperty(21),
  },
});

/**
 * `animate` defaults to true (web). Pass `animate={false}` for static
 * contexts — e.g. an email preview — where a count-up wouldn't render/apply.
 */
type Props = { content: ContentProps<typeof ProofBlockContentType>; animate?: boolean };

export default function ProofBlock({ content, animate = true }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="w-full bg-blue-50 px-6 py-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-blue-100 bg-white p-10 text-center shadow-lg shadow-blue-900/5 transition-transform duration-300 hover:-translate-y-1">
        <p
          {...pa('MetricNumber')}
          className="bg-gradient-to-r from-[#2D6DF6] to-[#00D2FF] bg-clip-text text-6xl font-black text-transparent"
        >
          <AnimatedMetric value={content.MetricNumber ?? ''} animate={animate} />
        </p>
        <p
          {...pa('MetricLabel')}
          className="mt-2 text-xs font-bold uppercase tracking-widest text-blue-900/60"
        >
          {content.MetricLabel}
        </p>
        {content.ClientQuote && (
          <>
            <Quote className="mx-auto mt-8 h-6 w-6 text-blue-200" />
            <blockquote {...pa('ClientQuote')} className="mt-2 text-xl font-medium text-ink italic">
              &ldquo;{content.ClientQuote}&rdquo;
            </blockquote>
          </>
        )}
        {content.ClientIdentifier && (
          <p
            {...pa('ClientIdentifier')}
            className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
          >
            — {content.ClientIdentifier}
          </p>
        )}
      </div>
    </section>
  );
}
