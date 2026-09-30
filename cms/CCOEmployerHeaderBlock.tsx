import { contentType, damAssets, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const CCOEmployerHeaderBlockContentType = contentType({
  key: 'CCOEmployerHeaderBlock',
  baseType: '_component',
  displayName: 'CCO Employer Header',
  description: 'Co-branded employer + CCO header for a pilot wellness portal.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    EmployerName: {
      type: 'string',
      displayName: 'Employer Name',
      description: 'Shown as a monogram when no logo is set. e.g. "Acme Health".',
      isLocalized: true,
      sortOrder: 10,
    },
    EmployerLogo: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Employer Logo',
      sortOrder: 20,
    },
    CoBrandText: {
      type: 'string',
      displayName: 'Co-Brand Text',
      description: 'e.g. "Acme Health × Center for Care Optimization".',
      isLocalized: true,
      sortOrder: 30,
    },
    AccentColor: {
      type: 'string',
      displayName: 'Accent Color',
      description: 'Hex color for the employer accent bar, e.g. #0F766E. Defaults to teal.',
      sortOrder: 40,
    },
  },
});

type Props = { content: ContentProps<typeof CCOEmployerHeaderBlockContentType> };

const DEFAULT_ACCENT = '#0F766E';

export default function CCOEmployerHeaderBlock({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const { getAlt } = damAssets(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const accent = /^#[0-9a-fA-F]{3,8}$/.test(content.AccentColor ?? '')
    ? (content.AccentColor as string)
    : DEFAULT_ACCENT;
  const name = content.EmployerName || 'Employer';

  return (
    <header
      {...pa(block)}
      className="w-full border-b border-slate-200 bg-white"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          {content.EmployerLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...pa('EmployerLogo')}
              src={src(content.EmployerLogo)}
              alt={getAlt(content.EmployerLogo, `${name} logo`)}
              className="h-9 w-auto"
            />
          ) : (
            <span
              {...pa('EmployerLogo')}
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              {name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <span {...pa('EmployerName')} className="text-sm font-semibold text-slate-900">
            {name}
          </span>
        </div>
        <span {...pa('CoBrandText')} className="text-xs font-medium text-slate-500">
          {content.CoBrandText}
        </span>
      </div>
    </header>
  );
}
