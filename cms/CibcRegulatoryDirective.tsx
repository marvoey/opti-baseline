import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ShieldCheck } from 'lucide-react';
import { ctaHref, type OptiLink } from './shared';

/**
 * Capital One: Compliance Notice — a regulatory/compliance callout block.
 * A left-accent callout with heading, rich-text body and up to two CTAs; the
 * accent colour follows the Severity choice.
 */
export const CibcRegulatoryDirectiveContentType = contentType({
  key: 'CibcRegulatoryDirective',
  baseType: '_component',
  displayName: 'Capital One: Compliance Notice',
  description: 'A compliance or regulatory notice callout with body copy and actions.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', description: 'Directive heading.', isLocalized: true, sortOrder: 10 },
    Body: { type: 'richText', displayName: 'Body', description: 'Directive detail copy.', isLocalized: true, sortOrder: 20 },
    Severity: {
      type: 'string',
      displayName: 'Severity',
      description: 'Visual urgency of the directive.',
      enum: [
        { value: 'critical', displayName: 'Critical' },
        { value: 'info', displayName: 'Informational' },
      ],
      isLocalized: true,
      sortOrder: 30,
    },
    PrimaryCta: { type: 'link', displayName: 'Primary CTA', description: 'Primary action, e.g. "Download Guidance PDF".', isLocalized: true, sortOrder: 40 },
    SecondaryCta: { type: 'link', displayName: 'Secondary CTA', description: 'Secondary action, e.g. "Contact Compliance Desk".', isLocalized: true, sortOrder: 50 },
  },
});

type Props = { content: ContentProps<typeof CibcRegulatoryDirectiveContentType> };

export default function CibcRegulatoryDirective({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const primary = content.PrimaryCta as OptiLink;
  const secondary = content.SecondaryCta as OptiLink;
  const bodyHtml = content.Body?.html;

  return (
    <div {...pa(block)} className="bg-cibc-rust/5 border-l-4 border-cibc-rust p-6 rounded-r-xl">
      <h3 {...pa('Heading')} className="text-cibc-rust font-bold flex items-center gap-2">
        <ShieldCheck size={20} /> {content.Heading ?? 'Regulatory Directive'}
      </h3>
      {bodyHtml ? (
        <div
          {...pa('Body')}
          className="text-cibc-rust/90 text-sm mt-2 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      ) : null}
      {primary || secondary ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {primary ? (
            <a {...pa('PrimaryCta')} href={ctaHref(primary)} className="bg-cibc-rust text-white px-4 py-2 rounded text-xs font-bold">
              {primary.text ?? 'Download'}
            </a>
          ) : null}
          {secondary ? (
            <a
              {...pa('SecondaryCta')}
              href={ctaHref(secondary)}
              className="bg-white border border-cibc-rust/30 text-cibc-rust px-4 py-2 rounded text-xs font-bold"
            >
              {secondary.text ?? 'Contact'}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
