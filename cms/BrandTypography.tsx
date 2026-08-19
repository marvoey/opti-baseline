import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const BrandTypographyContentType = contentType({
  key: 'BrandTypography',
  baseType: '_component',
  displayName: 'Brand: Typography',
  description: 'Type specimen showcasing the brand font stack, weight scale, and text hierarchy.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: {
      type: 'string', format: 'shortString',
      displayName: 'Section Title',
      isRequired: false, isLocalized: true, sortOrder: 10,
    },
    HeadingFont: {
      type: 'string', format: 'shortString',
      displayName: 'Heading Font Family',
      description: 'Display name of the heading typeface (e.g. "Montserrat").',
      isRequired: false, sortOrder: 20,
    },
    BodyFont: {
      type: 'string', format: 'shortString',
      displayName: 'Body Font Family',
      description: 'Display name of the body typeface (e.g. "Open Sans").',
      isRequired: false, sortOrder: 30,
    },
    HeadingWeight: {
      type: 'string', format: 'selectOne',
      displayName: 'Heading Weight',
      description: 'Font weight used for primary headings.',
      isRequired: false, sortOrder: 40,
      enum: [
        { value: '400', displayName: '400 – Regular'    },
        { value: '500', displayName: '500 – Medium'     },
        { value: '600', displayName: '600 – Semibold'   },
        { value: '700', displayName: '700 – Bold'       },
        { value: '800', displayName: '800 – Extrabold'  },
      ],
    },
    SampleHeading: {
      type: 'string', format: 'shortString',
      displayName: 'Sample Heading Text',
      description: 'Used for the H1 specimen. Defaults to an ESL tagline.',
      isRequired: false, isLocalized: true, sortOrder: 50,
    },
    SampleBody: {
      type: 'string', format: 'shortString',
      displayName: 'Sample Body Text',
      description: 'Paragraph-length copy for the body specimen.',
      isRequired: false, isLocalized: true, sortOrder: 60,
    },
  },
});

export const BrandTypographyDisplayTemplate = displayTemplate({
  key: 'BrandTypographyDefault',
  isDefault: true,
  displayName: 'Brand: Typography',
  contentType: 'BrandTypography',
  settings: {},
});

const WEIGHT_LABEL: Record<string, string> = {
  '400': 'Regular',
  '500': 'Medium',
  '600': 'Semibold',
  '700': 'Bold',
  '800': 'Extrabold',
};

type Props = { content: ContentProps<typeof BrandTypographyContentType> };

export default function BrandTypography({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const headingFont    = content.HeadingFont   || 'Montserrat';
  const bodyFont       = content.BodyFont      || 'Open Sans';
  const headingWeight  = content.HeadingWeight  || '800';
  const sampleHeading  = content.SampleHeading  || 'Building financial futures, together.';
  const sampleBody     = content.SampleBody     || 'ESL Federal Credit Union has served members across the Rochester region since 1941. We believe in putting people first — offering competitive rates, personalised service, and financial tools that help you thrive at every stage of life.';

  return (
    <section {...pa(block)} className="w-full px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-12">

        {content.Title && (
          <h2 {...pa('Title')} className="font-display font-bold text-2xl text-blue-950">{content.Title}</h2>
        )}

        {/* Font metadata row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-950 rounded-xl p-8 flex flex-col justify-between min-h-[180px]">
            <div className="font-display text-7xl font-extrabold text-white leading-none">Aa</div>
            <div className="mt-4">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-0.5">Display / Heading</p>
              <p className="text-white font-bold text-lg font-display">{headingFont}</p>
              <p className="text-blue-300 text-xs mt-0.5">Weights: 400 · 500 · 600 · 700 · 800</p>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-8 flex flex-col justify-between min-h-[180px]">
            <div className="text-7xl font-normal text-slate-800 leading-none">Aa</div>
            <div className="mt-4">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-0.5">Body / UI</p>
              <p className="text-slate-800 font-bold text-lg">{bodyFont}</p>
              <p className="text-slate-500 text-xs mt-0.5">Weights: 400 · 600 · 700</p>
            </div>
          </div>
        </div>

        {/* Type hierarchy specimen */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 space-y-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Type Scale Specimen</p>

          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">H1 · {headingFont} · {WEIGHT_LABEL[headingWeight] ?? headingWeight}</span>
            <h1 {...pa('SampleHeading')} className="font-display text-4xl sm:text-5xl text-blue-950 leading-tight mt-1" style={{ fontWeight: Number(headingWeight) }}>
              {sampleHeading}
            </h1>
          </div>

          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">H2 · {headingFont} · Bold</span>
            <h2 className="font-display text-3xl font-bold text-blue-900 mt-1">Your credit union, your community.</h2>
          </div>

          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">H3 · {headingFont} · Semibold</span>
            <h3 className="font-display text-xl font-semibold text-blue-800 mt-1">Trusted financial guidance since 1941.</h3>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Body · {bodyFont} · Regular · 16px / 1.6</span>
            <p {...pa('SampleBody')} className="text-base text-slate-700 leading-relaxed mt-2 max-w-2xl">{sampleBody}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Small / Caption</span>
              <p className="text-sm text-slate-500">Rates subject to change. APR = Annual Percentage Rate. Membership eligibility required.</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Label / UI</span>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Apply Today · Learn More · Get Started</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Mono</span>
              <code className="font-mono text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded">ABA: 221373059</code>
            </div>
          </div>
        </div>

        {/* Weight scale */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">Heading Weight Scale ({headingFont})</p>
          <div className="space-y-2">
            {[['400', 'Regular'], ['500', 'Medium'], ['600', 'Semibold'], ['700', 'Bold'], ['800', 'Extrabold']].map(([w, label]) => (
              <div key={w} className="flex items-baseline gap-4">
                <span className="text-[10px] text-slate-400 w-20 shrink-0 font-mono">{w} · {label}</span>
                <span className="font-display text-2xl text-blue-950" style={{ fontWeight: Number(w) }}>
                  ESL Federal Credit Union
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
