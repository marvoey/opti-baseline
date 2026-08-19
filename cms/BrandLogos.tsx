import Image from 'next/image';
import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const BrandLogosContentType = contentType({
  key: 'BrandLogos',
  baseType: '_component',
  displayName: 'Brand: Logos & Mark',
  description: 'Displays logo variants on light and dark backgrounds, plus the brand mark.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: {
      type: 'string', format: 'shortString',
      displayName: 'Section Title',
      isRequired: false, isLocalized: true, sortOrder: 10,
    },
    LogoOnLight: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Logo (on Light)',
      description: 'Logo variant used on white or light backgrounds.',
      isRequired: false, sortOrder: 20,
    },
    LogoOnDark: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Logo (on Dark)',
      description: 'Logo variant used on dark or coloured backgrounds.',
      isRequired: false, sortOrder: 30,
    },
    LogoMark: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Logo Mark / Icon',
      description: 'Icon-only version of the logo (no wordmark).',
      isRequired: false, sortOrder: 40,
    },
    DarkBackgroundHex: {
      type: 'string', format: 'shortString',
      displayName: 'Dark Background Color',
      description: 'Hex color for the dark logo preview panel (e.g. #002855).',
      isRequired: false, sortOrder: 50,
    },
  },
});

export const BrandLogosDisplayTemplate = displayTemplate({
  key: 'BrandLogosDefault',
  isDefault: true,
  displayName: 'Brand: Logos & Mark',
  contentType: 'BrandLogos',
  settings: {},
});

type ImgRef = { url?: { default?: string | null } };

type Props = { content: ContentProps<typeof BrandLogosContentType> };

export default function BrandLogos({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const lightUrl = (content.LogoOnLight as ImgRef | undefined)?.url?.default;
  const darkUrl  = (content.LogoOnDark  as ImgRef | undefined)?.url?.default;
  const markUrl  = (content.LogoMark    as ImgRef | undefined)?.url?.default;
  const darkBg   = content.DarkBackgroundHex || '#002855';

  // Fall back to the ESL logo from /public if no CMS asset is set
  const lightSrc = lightUrl || '/esl-logo.png';
  const darkSrc  = darkUrl  || '/esl-logo.png';

  const CLEAR_SPACE = '24px';
  const CONTEXTS = [
    { label: 'Incorrect — too small clear space', value: '4px', ok: false },
    { label: 'Minimum clear space',               value: '16px', ok: true  },
    { label: 'Recommended clear space',           value: CLEAR_SPACE, ok: true  },
  ];

  return (
    <section {...pa(block)} className="w-full px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {content.Title && (
          <h2 {...pa('Title')} className="font-display font-bold text-2xl text-blue-950">{content.Title}</h2>
        )}

        {/* On light + on dark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div {...pa('LogoOnLight')} className="bg-white rounded-xl border border-slate-200 p-10 flex items-center justify-center min-h-[180px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightSrc} alt="Logo on light background" className="max-h-16 w-auto object-contain" />
          </div>
          <div {...pa('LogoOnDark')} className="rounded-xl p-10 flex items-center justify-center min-h-[180px]" style={{ backgroundColor: darkBg }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={darkSrc} alt="Logo on dark background" className="max-h-16 w-auto object-contain brightness-0 invert" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* On accent backgrounds */}
          {[
            { bg: '#f4f7fb', label: 'On Light Base', invert: false },
            { bg: '#007078', label: 'On Teal',       invert: true  },
            { bg: '#f5821f', label: 'On Orange',     invert: false },
            { bg: '#1c2b3a', label: 'On Charcoal',   invert: true  },
          ].map(({ bg, label, invert }) => (
            <div key={bg} className="rounded-xl p-6 flex flex-col items-start gap-3" style={{ backgroundColor: bg }}>
              <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: invert ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }}>{label}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={invert ? darkSrc : lightSrc}
                alt={label}
                className={`h-10 w-auto object-contain ${invert ? 'brightness-0 invert' : ''}`}
              />
            </div>
          ))}
        </div>

        {/* Logo mark */}
        {markUrl && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">Logo Mark</p>
            <div {...pa('LogoMark')} className="flex gap-4">
              {[
                { bg: '#ffffff', border: '1px solid #e2e8f0' },
                { bg: '#002855', border: 'none' },
                { bg: '#f5821f', border: 'none' },
              ].map(({ bg, border }, i) => (
                <div key={i} className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg, border }}>
                  <Image src={markUrl} alt="Logo mark" width={48} height={48} className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear space guide */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 space-y-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Clear Space Guide</p>
          <div className="flex flex-wrap gap-8 items-end">
            {CONTEXTS.map(({ label, value, ok }) => (
              <div key={value} className="text-center">
                <div
                  className="bg-white rounded-lg border-2 inline-flex items-center justify-center"
                  style={{ padding: value, borderColor: ok ? '#d1fae5' : '#fecaca' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lightSrc} alt="Logo clear space" className="h-8 w-auto object-contain" />
                </div>
                <p className={`text-[9px] mt-2 font-semibold ${ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {ok ? '✓' : '✗'} {value}
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5 max-w-[100px] leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
