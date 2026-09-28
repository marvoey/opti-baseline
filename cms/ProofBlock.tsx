import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

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

type Props = { content: ContentProps<typeof ProofBlockContentType> };

export default function ProofBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="w-full px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p {...pa('MetricNumber')} className="text-5xl font-bold text-blue-600">
          {content.MetricNumber}
        </p>
        <p
          {...pa('MetricLabel')}
          className="mt-2 text-sm font-medium uppercase tracking-wide text-gray-500"
        >
          {content.MetricLabel}
        </p>
        {content.ClientQuote && (
          <blockquote {...pa('ClientQuote')} className="mt-8 text-lg italic text-gray-700">
            &ldquo;{content.ClientQuote}&rdquo;
          </blockquote>
        )}
        {content.ClientIdentifier && (
          <p {...pa('ClientIdentifier')} className="mt-4 text-sm font-semibold text-gray-500">
            — {content.ClientIdentifier}
          </p>
        )}
      </div>
    </section>
  );
}
