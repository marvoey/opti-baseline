import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const BrandButtonsContentType = contentType({
  key: 'BrandButtons',
  baseType: '_component',
  displayName: 'Brand: Buttons & CTAs',
  description: 'Showcases the brand button variants, sizes, and states using configurable colours and shape.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: {
      type: 'string', format: 'shortString',
      displayName: 'Section Title',
      isRequired: false, isLocalized: true, sortOrder: 10,
    },
    PrimaryColor: {
      type: 'string', format: 'shortString',
      displayName: 'Primary Button Color',
      description: 'Hex value for the filled primary button background (e.g. #0057b8).',
      isRequired: false, sortOrder: 20,
    },
    PrimaryTextColor: {
      type: 'string', format: 'shortString',
      displayName: 'Primary Button Text Color',
      description: 'Hex value for text on the primary button (e.g. #ffffff).',
      isRequired: false, sortOrder: 30,
    },
    AccentColor: {
      type: 'string', format: 'shortString',
      displayName: 'Accent / CTA Color',
      description: 'Hex value for accent CTA buttons (e.g. #f5821f).',
      isRequired: false, sortOrder: 40,
    },
    Shape: {
      type: 'string', format: 'selectOne',
      displayName: 'Button Shape',
      description: 'Controls the border-radius of all button variants.',
      isRequired: false, sortOrder: 50,
      enum: [
        { value: 'pill',   displayName: 'Pill (fully rounded)'  },
        { value: 'lg',     displayName: 'Large radius (12px)'   },
        { value: 'md',     displayName: 'Medium radius (8px)'   },
        { value: 'sm',     displayName: 'Small radius (4px)'    },
        { value: 'none',   displayName: 'Square (no radius)'    },
      ],
    },
  },
});

export const BrandButtonsDisplayTemplate = displayTemplate({
  key: 'BrandButtonsDefault',
  isDefault: true,
  displayName: 'Brand: Buttons & CTAs',
  contentType: 'BrandButtons',
  settings: {},
});

const RADIUS_MAP: Record<string, string> = {
  pill: '9999px',
  lg:   '12px',
  md:   '8px',
  sm:   '4px',
  none: '0px',
};

type Props = { content: ContentProps<typeof BrandButtonsContentType> };

export default function BrandButtons({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const primaryBg   = content.PrimaryColor     || '#0057b8';
  const primaryText = content.PrimaryTextColor || '#ffffff';
  const accentBg    = content.AccentColor      || '#f5821f';
  const shape       = content.Shape            || 'pill';
  const radius      = RADIUS_MAP[shape] ?? '9999px';

  const sizes = [
    { label: 'Large',  px: '20px', py: '14px', fontSize: '16px', fontWeight: '700' },
    { label: 'Medium', px: '16px', py: '10px', fontSize: '14px', fontWeight: '600' },
    { label: 'Small',  px: '12px', py: '8px',  fontSize: '12px', fontWeight: '600' },
  ];

  return (
    <section {...pa(block)} className="w-full px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {content.Title && (
          <h2 {...pa('Title')} className="font-display font-bold text-2xl text-blue-950">{content.Title}</h2>
        )}

        {/* Variant × Size grid */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3">Button Variants × Sizes</p>

          {sizes.map(({ label, px, py, fontSize, fontWeight }) => (
            <div key={label} className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{label}</p>
              <div className="flex flex-wrap items-center gap-3">

                {/* Primary */}
                <button
                  style={{ backgroundColor: primaryBg, color: primaryText, borderRadius: radius, paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py, fontSize, fontWeight, border: 'none', cursor: 'pointer', letterSpacing: '0.01em' }}
                >
                  Apply Today
                </button>

                {/* Accent / CTA */}
                <button
                  style={{ backgroundColor: accentBg, color: '#ffffff', borderRadius: radius, paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py, fontSize, fontWeight, border: 'none', cursor: 'pointer', letterSpacing: '0.01em' }}
                >
                  Get Started
                </button>

                {/* Outlined */}
                <button
                  style={{ backgroundColor: 'transparent', color: primaryBg, borderRadius: radius, paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py, fontSize, fontWeight, border: `2px solid ${primaryBg}`, cursor: 'pointer', letterSpacing: '0.01em' }}
                >
                  Learn More
                </button>

                {/* Ghost */}
                <button
                  style={{ backgroundColor: 'transparent', color: primaryBg, borderRadius: radius, paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py, fontSize, fontWeight, border: 'none', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.01em' }}
                >
                  View Rates →
                </button>

                {/* Disabled */}
                <button
                  disabled
                  style={{ backgroundColor: '#e2e8f0', color: '#94a3b8', borderRadius: radius, paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py, fontSize, fontWeight, border: 'none', cursor: 'not-allowed', letterSpacing: '0.01em' }}
                >
                  Disabled
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* On dark background */}
        <div className="rounded-xl p-8 space-y-6" style={{ backgroundColor: primaryBg }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">On Brand Background</p>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              style={{ backgroundColor: '#ffffff', color: primaryBg, borderRadius: radius, padding: '12px 24px', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
            >
              Apply Today
            </button>
            <button
              style={{ backgroundColor: accentBg, color: '#ffffff', borderRadius: radius, padding: '12px 24px', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
            >
              Get Started
            </button>
            <button
              style={{ backgroundColor: 'transparent', color: '#ffffff', borderRadius: radius, padding: '12px 24px', fontSize: '14px', fontWeight: '600', border: '2px solid rgba(255,255,255,0.6)', cursor: 'pointer' }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Shape reference */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">Shape Reference</p>
          <div className="flex flex-wrap gap-3 items-center">
            {Object.entries(RADIUS_MAP).map(([key, r]) => (
              <div key={key} className="text-center">
                <button
                  style={{ backgroundColor: key === shape ? primaryBg : '#e2e8f0', color: key === shape ? primaryText : '#475569', borderRadius: r, padding: '10px 20px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
                <p className="text-[9px] text-slate-400 mt-1 font-mono">{r}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
