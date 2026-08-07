import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import { DemoPhaseBlockContentType } from './DemoPhaseBlock';

/**
 * DemoScriptPage — a challenger-methodology demo script page.
 * The header (badge, gradient heading, subtitle) is modelled as page-level
 * properties; the phase cards below are a typed ContentArea of DemoPhaseBlock.
 */
export const DemoScriptPageContentType = contentType({
  key: 'DemoScriptPage',
  baseType: '_page',
  displayName: 'Demo Script Page',
  description: 'A challenger-methodology demo script page with phase cards.',
  mayContainTypes: ['ExperiencePage', 'Page', 'DemoScriptPage'],
  properties: {
    MetaTitle: {
      type: 'string',
      displayName: 'Meta Title',
      description: 'Browser tab / SEO title.',
      isLocalized: true,
      sortOrder: 5,
    },
    HeaderBadge: {
      type: 'string',
      displayName: 'Header Badge',
      description: 'Small pill label above the heading, e.g. "Optimizely Demo Script".',
      isLocalized: true,
      sortOrder: 10,
    },
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'Plain portion of the H1, e.g. "Shaping the Future of".',
      isLocalized: true,
      sortOrder: 15,
    },
    HeadingAccent: {
      type: 'string',
      displayName: 'Heading Accent',
      description: 'Gradient-styled continuation of the H1, e.g. "Specialty Food".',
      isLocalized: true,
      sortOrder: 20,
    },
    Subtitle: {
      type: 'string',
      displayName: 'Subtitle',
      description: 'Descriptive paragraph below the heading.',
      isLocalized: true,
      sortOrder: 25,
    },
    Phases: {
      type: 'array',
      displayName: 'Phases',
      description: 'Ordered list of demo phase cards.',
      isLocalized: true,
      sortOrder: 30,
      items: {
        type: 'content',
        allowedTypes: [DemoPhaseBlockContentType],
        restrictedTypes: [],
      },
    },
  },
});

type Props = { content: ContentProps<typeof DemoScriptPageContentType> };

export default function DemoScriptPage({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const phases = content.Phases ?? [];

  return (
    <main className="text-opti-dark bg-white min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">

        <header className="text-center py-10 border-b border-opti-n3">
          {content.HeaderBadge && (
            <div
              {...pa('HeaderBadge')}
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-opti-dark uppercase bg-opti-green rounded-full"
            >
              {content.HeaderBadge}
            </div>
          )}
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight text-opti-dark mb-4">
            <span {...pa('Heading')}>{content.Heading}</span>
            {content.Heading && content.HeadingAccent && ' '}
            {content.HeadingAccent && (
              <span {...pa('HeadingAccent')} className="gradient-text">
                {content.HeadingAccent}
              </span>
            )}
          </h1>
          {content.Subtitle && (
            <p {...pa('Subtitle')} className="text-xl text-opti-dark max-w-2xl mx-auto">
              {content.Subtitle}
            </p>
          )}
        </header>

        <div {...pa('Phases')} className="space-y-12">
          {phases.map((phase, i) => (
            <OptimizelyComponent key={i} content={phase} />
          ))}
        </div>

      </div>
    </main>
  );
}
