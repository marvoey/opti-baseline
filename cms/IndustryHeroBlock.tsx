import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const IndustryHeroBlockContentType = contentType({
  key: 'IndustryHeroBlock',
  baseType: '_component',
  displayName: 'Industry Hero Block',
  description: 'Hero section with headline, search bar, and quick action pills for an industry vertical',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Headline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Headline',
      description: 'The main question or prompt shown large in the hero',
      isRequired: true,
    },
    SearchPlaceholder: {
      type: 'string',
      format: 'shortString',
      displayName: 'Search Placeholder',
      description: 'Placeholder text inside the search bar',
      isRequired: false,
    },
    QuickAction1: {
      type: 'string',
      format: 'shortString',
      displayName: 'Quick Action 1',
      isRequired: false,
    },
    QuickAction2: {
      type: 'string',
      format: 'shortString',
      displayName: 'Quick Action 2',
      isRequired: false,
    },
    QuickAction3: {
      type: 'string',
      format: 'shortString',
      displayName: 'Quick Action 3',
      isRequired: false,
    },
  },
});

const PILL_KEYS = ['QuickAction1', 'QuickAction2', 'QuickAction3'] as const;

type Props = { content: ContentProps<typeof IndustryHeroBlockContentType> };

export default function IndustryHeroBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section
      {...pa(block)}
      className="relative px-6 py-28 md:py-40 flex flex-col items-center justify-center overflow-hidden bg-[#08251A]"
    >
      {/* Decorative background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ABFF44] rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#91DBDA] rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <h2
          {...pa('Headline')}
          className="text-5xl md:text-7xl font-black text-[#ABFF44] mb-12 text-center max-w-3xl tracking-tighter leading-[1.1]"
        >
          {content.Headline ?? 'What can we help you with today?'}
        </h2>

        <div className="w-full max-w-3xl flex items-center bg-white border-4 border-[#08251A] rounded-[32px] shadow-[8px_8px_0px_#08251A] overflow-hidden mb-12 p-2">
          <div className="pl-6 pr-3 py-4 shrink-0">
            <svg className="w-8 h-8 text-[#08251A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div {...pa('SearchPlaceholder')} className="flex-1">
            <input
              type="text"
              disabled
              placeholder={content.SearchPlaceholder ?? 'Search…'}
              className="w-full h-16 bg-transparent text-xl font-medium outline-none text-[#08251A] placeholder-[#197050] opacity-80"
            />
          </div>
          <button className="h-16 px-10 bg-[#ABFF44] hover:bg-[#7DDD3D] text-[#08251A] font-black text-xl transition-colors border-4 border-[#08251A] cursor-pointer flex items-center justify-center rounded-[24px] shrink-0">
            Go
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm text-[#E4F0DA] font-black uppercase tracking-widest mb-5">Quick Actions</span>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
            {PILL_KEYS.map((key) => {
              const label = content[key];
              if (!label) return null;
              return (
                <button
                  key={key}
                  {...pa(key)}
                  className="px-6 py-4 bg-[#08251A] border-4 border-[#ABFF44] hover:bg-[#ABFF44] hover:text-[#08251A] text-[#ABFF44] rounded-[32px] text-lg font-bold transition-colors flex items-center gap-2"
                >
                  <span>{label}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
