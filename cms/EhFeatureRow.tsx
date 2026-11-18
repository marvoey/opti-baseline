import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

/**
 * eHealth "Why eHealth?" feature row: a centred heading, up to four icon +
 * title + description columns and an orange CTA.
 *
 * Each feature is one line in `Items`, formatted `icon | Title | Description`.
 * Icons: advisor, chat, free, benefits, doctor, rx, cart (anything else shows a check mark).
 */
export const EhFeatureRowContentType = contentType({
  key: 'EhFeatureRow',
  baseType: '_component',
  displayName: '[eHealth] Feature Row',
  description: '[EH] "Why eHealth?" row: heading, icon + title + description columns and an orange CTA.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'e.g. "Why eHealth?".',
      isLocalized: true,
      sortOrder: 10,
    },
    Items: {
      type: 'array',
      displayName: 'Features',
      description: 'One per line (up to 4): icon | Title | Description. Icons: advisor, chat, free, benefits.',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 4,
      items: { type: 'string' },
    },
    CtaLabel: {
      type: 'string',
      displayName: 'Button label',
      description: 'Orange button under the features, e.g. "Compare Medicare plans". Leave blank to hide.',
      isLocalized: true,
      sortOrder: 30,
    },
    CtaUrl: {
      type: 'url',
      displayName: 'Button URL',
      description: 'Where the button goes.',
      sortOrder: 31,
    },
  },
});

type Props = { content: ContentProps<typeof EhFeatureRowContentType> };

type Feature = { icon: string; title: string; description: string };

/** Parse `icon | Title | Description` lines. */
function parseFeatures(lines: Array<string | null> | null | undefined): Feature[] {
  return (lines ?? [])
    .map((line) => (line ?? '').trim())
    .filter(Boolean)
    .map((line) => {
      const [icon = '', title = '', ...rest] = line.split('|').map((p) => p.trim());
      return { icon: icon.toLowerCase(), title, description: rest.join(' | ') };
    })
    .filter((f) => f.title);
}

export default function EhFeatureRow({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const features = parseFeatures(content.Items as Array<string | null> | null);
  const ctaUrl = content.CtaUrl as { default?: string | null } | string | null | undefined;
  const ctaHref = (typeof ctaUrl === 'string' ? ctaUrl : ctaUrl?.default) || '#';

  return (
    <div {...pa(block)} className="w-full px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        {content.Heading && (
          <h2
            {...pa('Heading')}
            className="mb-8 text-center font-display text-2xl font-bold text-blue-950 sm:text-3xl"
          >
            {content.Heading}
          </h2>
        )}

        <ul {...pa('Items')} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <li key={i} className="flex flex-col items-center text-center">
              <FeatureIcon type={f.icon} className="h-14 w-14 text-blue-800" />
              <h3 className="mt-4 font-display text-lg font-bold leading-snug text-blue-950">{f.title}</h3>
              {f.description && <p className="mt-2 text-sm leading-relaxed text-foreground">{f.description}</p>}
            </li>
          ))}
        </ul>

        {content.CtaLabel && (
          <div className="mt-8 text-center">
            <a
              {...pa('CtaLabel')}
              href={ctaHref}
              className="inline-block rounded-full bg-cta px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-cta-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
            >
              {content.CtaLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/** Line icons for the feature columns. */
function FeatureIcon({ type, className }: { type: string; className?: string }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };
  switch (type) {
    case 'advisor': // person with check
      return (
        <svg {...common}>
          <circle cx="20" cy="15" r="7" />
          <path d="M6 41v-3a12 12 0 0 1 20-9" />
          <circle cx="35" cy="34" r="8" />
          <path d="M31.5 34l2.5 2.5 4.5-5" />
        </svg>
      );
    case 'chat': // speech bubbles
      return (
        <svg {...common}>
          <path d="M6 10h26a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H18l-8 7v-7H6a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z" />
          <path d="M38 18h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2v6l-7-6h-9" />
          <path d="M11 17h16M11 22h10" />
        </svg>
      );
    case 'free': // price tag
      return (
        <svg {...common}>
          <path d="M6 24V8a2 2 0 0 1 2-2h16l18 18-18 18L6 24z" />
          <circle cx="15" cy="15" r="2.5" />
          <path d="M26 18v12M30 21c-1-1.5-6-2-6 1.5S30 26 30 29.5 25 32 22 30" />
        </svg>
      );
    case 'benefits': // shield with check
      return (
        <svg {...common}>
          <path d="M24 5l15 6v11c0 10-6.5 17-15 21C15.5 39 9 32 9 22V11l15-6z" />
          <path d="M17 24l5 5 9-10" />
        </svg>
      );
    case 'doctor': // stethoscope-style: person with a plus
      return (
        <svg {...common}>
          <circle cx="22" cy="14" r="7" />
          <path d="M8 41v-3a14 14 0 0 1 14-14" />
          <circle cx="35" cy="35" r="8" />
          <path d="M35 31v8M31 35h8" />
        </svg>
      );
    case 'rx': // pill bottle
      return (
        <svg {...common}>
          <rect x="11" y="6" width="26" height="8" rx="2" />
          <path d="M13 14v24a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V14" />
          <path d="M24 21v10M19 26h10" />
        </svg>
      );
    case 'cart': // shopping cart
      return (
        <svg {...common}>
          <path d="M4 8h6l5 22h20l4-16H12" />
          <circle cx="18" cy="38" r="2.5" />
          <circle cx="33" cy="38" r="2.5" />
        </svg>
      );
    default: // check in circle
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="18" />
          <path d="M16 25l6 6 11-13" />
        </svg>
      );
  }
}
