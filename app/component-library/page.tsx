import Link from 'next/link';
import { PrgvCoverageRuleContentType } from '@/cms/PrgvCoverageRule';
import { PrgvExclusionRuleContentType } from '@/cms/PrgvExclusionRule';
import { PrgvBenefitContentType } from '@/cms/PrgvBenefit';
import { PrgvDiscountContentType } from '@/cms/PrgvDiscount';
import { PrgvProgramContentType } from '@/cms/PrgvProgram';
import { PrgvLifeEventContentType } from '@/cms/PrgvLifeEvent';
import { PrgvRecommendationContentType } from '@/cms/PrgvRecommendation';
import { PrgvProcedureContentType } from '@/cms/PrgvProcedure';

const CONTENT_TYPES = [
  PrgvCoverageRuleContentType,
  PrgvExclusionRuleContentType,
  PrgvBenefitContentType,
  PrgvDiscountContentType,
  PrgvProgramContentType,
  PrgvLifeEventContentType,
  PrgvRecommendationContentType,
  PrgvProcedureContentType,
];

const TYPE_COLORS: Record<string, string> = {
  string:           'bg-blue-50 text-blue-700 border-blue-200',
  richText:         'bg-purple-50 text-purple-700 border-purple-200',
  url:              'bg-green-50 text-green-700 border-green-200',
  dateTime:         'bg-orange-50 text-orange-700 border-orange-200',
  array:            'bg-yellow-50 text-yellow-700 border-yellow-200',
  contentReference: 'bg-pink-50 text-pink-700 border-pink-200',
};

const TYPE_ICON: Record<string, string> = {
  string:           'T',
  richText:         'R',
  url:              '⌁',
  dateTime:         '◷',
  array:            '[]',
  contentReference: '⇗',
};

// Section accent colors per content type key
const ACCENT: Record<string, { border: string; header: string; badge: string }> = {
  PrgvCoverageRule:    { border: 'border-t-[#007BC7]', header: 'from-[#007BC7] to-[#004A8F]', badge: 'bg-blue-100 text-[#004A8F]' },
  PrgvExclusionRule:   { border: 'border-t-red-500',   header: 'from-red-600 to-red-800',      badge: 'bg-red-100 text-red-800' },
  PrgvBenefit:         { border: 'border-t-emerald-500', header: 'from-emerald-600 to-emerald-800', badge: 'bg-emerald-100 text-emerald-800' },
  PrgvDiscount:        { border: 'border-t-amber-500',  header: 'from-amber-600 to-amber-800',  badge: 'bg-amber-100 text-amber-800' },
  PrgvProgram:         { border: 'border-t-violet-500', header: 'from-violet-600 to-violet-800', badge: 'bg-violet-100 text-violet-800' },
  PrgvLifeEvent:       { border: 'border-t-teal-500',   header: 'from-teal-600 to-teal-800',    badge: 'bg-teal-100 text-teal-800' },
  PrgvRecommendation:  { border: 'border-t-indigo-500', header: 'from-indigo-600 to-indigo-800', badge: 'bg-indigo-100 text-indigo-800' },
  PrgvProcedure:       { border: 'border-t-slate-500',  header: 'from-slate-600 to-slate-800',  badge: 'bg-slate-100 text-slate-800' },
};

type CmsProperty = {
  type: string;
  displayName?: string;
  description?: string;
  isRequired?: boolean;
  isLocalized?: boolean;
  sortOrder?: number;
  enum?: { value: string; displayName: string }[];
};

type ContentTypeDef = {
  key: string;
  baseType?: string;
  displayName?: string;
  description?: string;
  properties?: Record<string, CmsProperty>;
};

function TypeBadge({ type }: { type: string }) {
  const cls = TYPE_COLORS[type] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  const icon = TYPE_ICON[type] ?? '?';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded border ${cls}`}>
      <span className="opacity-60">{icon}</span>
      {type}
    </span>
  );
}

function ContentTypeCard({ def }: { def: ContentTypeDef }) {
  const accent = ACCENT[def.key] ?? { border: 'border-t-gray-400', header: 'from-gray-600 to-gray-800', badge: 'bg-gray-100 text-gray-700' };
  const props = Object.entries(def.properties ?? {}).sort(
    ([, a], [, b]) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
  );

  // Separate taxonomy (first 7 shared fields) from type-specific fields
  const TAXONOMY_KEYS = new Set(['LineOfBusiness', 'Topic', 'Jurisdiction', 'PolicyTier', 'VariationLabel', 'SourceLabel', 'ActiveDate']);
  const taxonomyProps = props.filter(([k]) => TAXONOMY_KEYS.has(k));
  const specificProps = props.filter(([k]) => !TAXONOMY_KEYS.has(k));

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${accent.border} overflow-hidden flex flex-col`}>
      {/* Card header */}
      <div className={`bg-gradient-to-r ${accent.header} px-5 py-4`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-white font-bold text-base leading-tight">{def.displayName}</h2>
            <code className="text-white/60 text-xs mt-0.5 block font-mono">{def.key}</code>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded ${accent.badge}`}>
            {def.baseType ?? '_component'}
          </span>
        </div>
        {def.description && (
          <p className="text-white/75 text-xs mt-2 leading-relaxed">{def.description}</p>
        )}
      </div>

      {/* Properties */}
      <div className="flex-1 divide-y divide-gray-100">
        {/* Taxonomy section */}
        {taxonomyProps.length > 0 && (
          <section>
            <div className="px-5 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Taxonomy</span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {taxonomyProps.map(([key, prop]) => (
                  <PropertyRow key={key} propKey={key} prop={prop} />
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Type-specific section */}
        {specificProps.length > 0 && (
          <section>
            <div className="px-5 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content Fields</span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {specificProps.map(([key, prop]) => (
                  <PropertyRow key={key} propKey={key} prop={prop} />
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">{props.length} properties</span>
        <span className="text-xs text-gray-400">
          {props.filter(([, p]) => p.isRequired).length > 0 && (
            <>{props.filter(([, p]) => p.isRequired).length} required</>
          )}
        </span>
      </div>
    </div>
  );
}

function PropertyRow({ propKey, prop }: { propKey: string; prop: CmsProperty }) {
  return (
    <tr className="group border-b border-gray-50 last:border-b-0 hover:bg-gray-50/70 transition-colors">
      <td className="px-5 py-2.5 align-top w-[40%]">
        <div className="flex items-center gap-1.5">
          {prop.isRequired && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" title="Required" />
          )}
          <code className="text-xs font-mono text-gray-800 font-semibold">{propKey}</code>
          {prop.isLocalized && (
            <span className="text-[10px] text-gray-400" title="Localized">🌐</span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 pl-3">{prop.displayName}</div>
      </td>
      <td className="px-3 py-2.5 align-top">
        <TypeBadge type={prop.type} />
      </td>
      <td className="px-3 py-2.5 align-top text-xs text-gray-500">
        {prop.description && (
          <p className="leading-relaxed">{prop.description}</p>
        )}
        {prop.enum && (
          <div className="flex flex-wrap gap-1 mt-1">
            {prop.enum.map((e) => (
              <span key={e.value} className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 font-mono">
                {e.value}
              </span>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

export default function ComponentLibraryPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[#007BC7] font-bold text-xl tracking-tight">COMPONENT LIBRARY</div>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-gray-600 font-medium text-sm">Progressive × Optimizely CMS SaaS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full font-mono">
              baseType: _component
            </span>
            <Link
              href="/component-library/previews"
              className="bg-gray-700 hover:bg-gray-900 text-white text-sm font-semibold py-2 px-4 rounded transition shadow"
            >
              Render Preview
            </Link>
            <Link
              href="/demo"
              className="bg-[#007BC7] hover:bg-[#004A8F] text-white text-sm font-semibold py-2 px-4 rounded transition shadow"
            >
              Back to Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="max-w-[1400px] mx-auto px-6 pt-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex flex-wrap items-center gap-6">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Types</span>
          {Object.entries(TYPE_COLORS).map(([type]) => (
            <TypeBadge key={type} type={type} />
          ))}
          <span className="ml-auto flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" /> Required
            </span>
            <span className="flex items-center gap-1">
              <span>🌐</span> Localized
            </span>
          </span>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CONTENT_TYPES.map((ct) => (
          <ContentTypeCard key={ct.key} def={ct as ContentTypeDef} />
        ))}
      </main>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-6 pb-8">
        <div className="border-t border-gray-200 pt-6 flex items-center justify-between text-xs text-gray-400">
          <span>{CONTENT_TYPES.length} content types · Push to CMS with <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">npm run config:push</code></span>
          <span>Optimizely CMS SaaS</span>
        </div>
      </footer>
    </div>
  );
}
