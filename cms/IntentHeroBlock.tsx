import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const IntentHeroBlockContentType = contentType({
  key: 'IntentHeroBlock',
  baseType: '_component',
  displayName: '(Verticals) Intent Hero Block',
  description: 'The conversational hero section with search and quick actions.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Headline: {
      type: 'string',
      displayName: 'Headline Prompt',
      isLocalized: true,
      sortOrder: 10,
    },
    SearchPlaceholder: {
      type: 'string',
      displayName: 'Search Placeholder Text',
      isLocalized: true,
      sortOrder: 20,
    },
    DestinationFlow: {
      type: 'url',
      displayName: 'Destination URL',
      description: 'Where the search input submits to.',
      sortOrder: 30,
    },
    ActionPills: {
      type: 'array',
      displayName: 'Quick Action Pills',
      sortOrder: 40,
      items: {
        type: 'link',
      },
    },
    Theme: {
      type: 'string',
      displayName: 'Theme / Background Style',
      description: 'Visual background style for the hero section.',
      sortOrder: 50,
      enum: [
        { value: 'dark-fir', displayName: 'Dark Fir' },
        { value: 'light-overlay', displayName: 'Light Blue Overlay' },
        { value: 'white', displayName: 'White' },
      ],
    },
  },
});

type LinkItem = { text?: string | null; href?: string | null; title?: string | null; target?: string | null };
type Props = { content: ContentProps<typeof IntentHeroBlockContentType> };

const THEME_CLASSES: Record<string, { section: string; heading: string; input: string }> = {
  'light-overlay': {
    section: 'bg-[#E4F0DA]',
    heading: 'text-[#08251A]',
    input: 'border-[#08251A]',
  },
  white: {
    section: 'bg-white',
    heading: 'text-[#08251A]',
    input: 'border-[#08251A]',
  },
};

const DEFAULT_THEME = {
  section: 'bg-[#08251A]',
  heading: 'text-[#ABFF44]',
  input: 'border-[#08251A]',
};

export default function IntentHeroBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const pills = (content.ActionPills ?? []) as LinkItem[];
  const theme = THEME_CLASSES[content.Theme ?? ''] ?? DEFAULT_THEME;

  return (
    <section {...pa(block)} className={`w-full relative px-6 py-28 md:py-40 flex flex-col items-center justify-center overflow-hidden ${theme.section}`}>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ABFF44] rounded-full mix-blend-screen blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#91DBDA] rounded-full mix-blend-screen blur-[100px] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <h2
          {...pa('Headline')}
          className={`text-5xl md:text-7xl font-black mb-12 text-center max-w-3xl tracking-tighter leading-[1.1] ${theme.heading}`}
        >
          {content.Headline}
        </h2>

        <form
          action={(content.DestinationFlow as unknown as string) ?? '#'}
          method="get"
          className={`w-full max-w-3xl flex items-center bg-white border-4 ${theme.input} focus-within:border-[#3AB533] transition-all rounded-[32px] shadow-[8px_8px_0px_#08251A] overflow-hidden mb-12 p-2`}
        >
          <div className="pl-6 pr-3 py-4">
            <svg className="w-8 h-8 text-[#08251A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            {...pa('SearchPlaceholder')}
            type="text"
            name="q"
            placeholder={content.SearchPlaceholder ?? undefined}
            className="flex-1 h-16 bg-transparent text-xl font-medium outline-none text-[#08251A] placeholder-[#197050]"
          />
          <button
            type="submit"
            className="h-16 px-10 bg-[#ABFF44] hover:bg-[#7DDD3D] text-[#08251A] font-black text-xl transition-all border-4 border-[#08251A] cursor-pointer flex items-center justify-center rounded-[24px]"
          >
            Go
          </button>
        </form>

        {pills.length > 0 && (
          <div {...pa('ActionPills')} className="flex flex-col items-center">
            <span className="text-sm text-[#E4F0DA] font-black uppercase tracking-widest mb-5">Quick Actions</span>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
              {pills.map((pill, idx) => (
                <a
                  key={idx}
                  href={pill.href ?? '#'}
                  title={pill.title ?? undefined}
                  target={pill.target ?? undefined}
                  className="px-6 py-4 bg-[#08251A] border-4 border-[#ABFF44] hover:bg-[#ABFF44] hover:text-[#08251A] text-[#ABFF44] rounded-[32px] text-lg font-bold transition-colors flex items-center space-x-2"
                >
                  <span>{pill.text}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
