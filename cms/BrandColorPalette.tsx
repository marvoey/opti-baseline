import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const BrandColorPaletteContentType = contentType({
  key: 'BrandColorPalette',
  baseType: '_component',
  displayName: 'Brand: Color Palette',
  description: 'Displays a configurable brand color swatch grid with hex values and usage labels.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: {
      type: 'string', format: 'shortString',
      displayName: 'Section Title',
      isRequired: false, isLocalized: true, sortOrder: 10,
    },
    Color1Name: { type: 'string', format: 'shortString', displayName: 'Color 1 Name',  isRequired: false, sortOrder: 20 },
    Color1Hex:  { type: 'string', format: 'shortString', displayName: 'Color 1 Hex',   description: 'e.g. #002855', isRequired: false, sortOrder: 30 },
    Color2Name: { type: 'string', format: 'shortString', displayName: 'Color 2 Name',  isRequired: false, sortOrder: 40 },
    Color2Hex:  { type: 'string', format: 'shortString', displayName: 'Color 2 Hex',   isRequired: false, sortOrder: 50 },
    Color3Name: { type: 'string', format: 'shortString', displayName: 'Color 3 Name',  isRequired: false, sortOrder: 60 },
    Color3Hex:  { type: 'string', format: 'shortString', displayName: 'Color 3 Hex',   isRequired: false, sortOrder: 70 },
    Color4Name: { type: 'string', format: 'shortString', displayName: 'Color 4 Name',  isRequired: false, sortOrder: 80 },
    Color4Hex:  { type: 'string', format: 'shortString', displayName: 'Color 4 Hex',   isRequired: false, sortOrder: 90 },
    Color5Name: { type: 'string', format: 'shortString', displayName: 'Color 5 Name',  isRequired: false, sortOrder: 100 },
    Color5Hex:  { type: 'string', format: 'shortString', displayName: 'Color 5 Hex',   isRequired: false, sortOrder: 110 },
  },
});

export const BrandColorPaletteDisplayTemplate = displayTemplate({
  key: 'BrandColorPaletteDefault',
  isDefault: true,
  displayName: 'Brand: Color Palette',
  contentType: 'BrandColorPalette',
  settings: {},
});

const ESL_DEFAULTS = [
  { name: 'Deep Navy',   hex: '#002855', usage: 'Backgrounds, footer, hero' },
  { name: 'ESL Blue',    hex: '#0057b8', usage: 'Primary action, links' },
  { name: 'ESL Orange',  hex: '#f5821f', usage: 'CTA buttons, promotions' },
  { name: 'ESL Teal',    hex: '#007078', usage: 'Accent, gradients' },
  { name: 'Light Base',  hex: '#f4f7fb', usage: 'Section backgrounds' },
];

// Compute a text colour that contrasts with a given hex background
function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#1c2b3a' : '#ffffff';
}

// Full blue scale pulled from the CSS theme for the "scale strip" section
const BLUE_SCALE = [
  { label: '950', hex: '#002855' },
  { label: '900', hex: '#003d7a' },
  { label: '800', hex: '#0057b8' },
  { label: '700', hex: '#1a6fd1' },
  { label: '600', hex: '#3385d9' },
  { label: '500', hex: '#4d9de0' },
  { label: '400', hex: '#66b3e8' },
  { label: '300', hex: '#99ccf2' },
  { label: '200', hex: '#cce4fb' },
  { label: '100', hex: '#e5f2fd' },
  { label: '50',  hex: '#f0f7ff' },
];

type Props = { content: ContentProps<typeof BrandColorPaletteContentType> };

export default function BrandColorPalette({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const swatches = [
    { name: content.Color1Name || ESL_DEFAULTS[0].name, hex: content.Color1Hex || ESL_DEFAULTS[0].hex, usage: ESL_DEFAULTS[0].usage },
    { name: content.Color2Name || ESL_DEFAULTS[1].name, hex: content.Color2Hex || ESL_DEFAULTS[1].hex, usage: ESL_DEFAULTS[1].usage },
    { name: content.Color3Name || ESL_DEFAULTS[2].name, hex: content.Color3Hex || ESL_DEFAULTS[2].hex, usage: ESL_DEFAULTS[2].usage },
    { name: content.Color4Name || ESL_DEFAULTS[3].name, hex: content.Color4Hex || ESL_DEFAULTS[3].hex, usage: ESL_DEFAULTS[3].usage },
    { name: content.Color5Name || ESL_DEFAULTS[4].name, hex: content.Color5Hex || ESL_DEFAULTS[4].hex, usage: ESL_DEFAULTS[4].usage },
  ];

  return (
    <section {...pa(block)} className="w-full px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {content.Title && (
          <h2 {...pa('Title')} className="font-display font-bold text-2xl text-blue-950">{content.Title}</h2>
        )}

        {/* Primary swatches */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Primary Palette</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {swatches.map((s, i) => {
              const text = contrastColor(s.hex);
              return (
                <div key={i} className="rounded-xl overflow-hidden border border-black/10 shadow-sm">
                  <div className="h-28 flex flex-col items-start justify-end p-3" style={{ backgroundColor: s.hex, color: text }}>
                    <span className="font-mono text-[11px] font-bold opacity-90">{s.hex}</span>
                  </div>
                  <div className="bg-white p-3">
                    <p className="font-bold text-sm text-slate-800">{s.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.usage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blue scale strip */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Blue Scale (Tailwind theme remap)</p>
          <div className="flex rounded-xl overflow-hidden border border-black/10 shadow-sm">
            {BLUE_SCALE.map(({ label, hex }) => {
              const text = contrastColor(hex);
              return (
                <div
                  key={label}
                  className="flex-1 py-10 flex flex-col items-center justify-end gap-1"
                  style={{ backgroundColor: hex, color: text }}
                >
                  <span className="font-mono text-[9px] font-bold">{label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex mt-1">
            {BLUE_SCALE.map(({ label, hex }) => (
              <div key={label} className="flex-1 text-center">
                <span className="font-mono text-[9px] text-slate-400 hidden sm:block">{hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orange accents */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Orange Accent Scale</p>
          <div className="flex gap-3">
            {[
              { label: '400', hex: '#f79838' },
              { label: '500', hex: '#f5821f' },
              { label: '600', hex: '#d96e10' },
            ].map(({ label, hex }) => (
              <div key={label} className="flex-1 rounded-xl overflow-hidden border border-black/10 shadow-sm">
                <div className="h-16" style={{ backgroundColor: hex }} />
                <div className="bg-white px-3 py-2">
                  <p className="font-bold text-xs text-slate-700">Orange {label}</p>
                  <p className="font-mono text-[10px] text-slate-400">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
