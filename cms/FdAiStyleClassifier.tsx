import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { FdProductContentType } from './FdProduct';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import type { ProductData } from '@/app/_components/fd/types';

export const FdAiStyleClassifierContentType = contentType({
  key: 'FdAiStyleClassifier',
  baseType: '_component',
  displayName: 'Floor & Decor AI Aesthetic Enrichment (Mark)',
  description: 'Inspects and applies Mark AI computer-vision aesthetic tags to product catalog feeds.',
  properties: {
    Product: {
      type: 'content',
      displayName: 'Product to Classify',
      allowedTypes: [FdProductContentType],
      sortOrder: 10,
    },
    InferredStyle: { type: 'string', format: 'shortString', displayName: 'Inferred Aesthetic Style', sortOrder: 20 },
    InferredPalette: { type: 'string', format: 'shortString', displayName: 'Color Palette Analysis', sortOrder: 30 },
    ConfidenceScore: { type: 'float', displayName: 'Mark AI Confidence (0-100)', sortOrder: 40 },
    SyncStatus: { type: 'string', format: 'shortString', displayName: 'Graph Taxonomy Status', sortOrder: 50 },
  },
});

export default function FdAiStyleClassifier({ content }: { content: ContentProps<typeof FdAiStyleClassifierContentType> }) {
  const prod = content.Product as unknown as ProductData | undefined;

  return (
    <div className="bg-neutral-900 text-white rounded-xl p-5 border border-neutral-700 shadow-lg text-xs">
      <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
        <span className="font-bold text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Mark AI Taxonomy Enrichment: {prod?.Name || 'Selected SKU'}
        </span>
        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
          {content.SyncStatus || 'Synced to Optimizely Graph'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
        <div className="bg-neutral-800 p-2.5 rounded">
          <span className="text-neutral-400 block text-[10px]">Aesthetic Classification:</span>
          <span className="font-bold text-neutral-100">{content.InferredStyle || 'Modern Organic / Transitional'}</span>
        </div>
        <div className="bg-neutral-800 p-2.5 rounded">
          <span className="text-neutral-400 block text-[10px]">Palette Vein Tones:</span>
          <span className="font-bold text-neutral-100">{content.InferredPalette || 'Warm Calacatta Gold & Soft White'}</span>
        </div>
        <div className="bg-neutral-800 p-2.5 rounded">
          <span className="text-neutral-400 block text-[10px]">Mark AI Confidence:</span>
          <span className="font-bold text-emerald-400">{content.ConfidenceScore || 98.4}%</span>
        </div>
        <div className="bg-neutral-800 p-2.5 rounded">
          <span className="text-neutral-400 block text-[10px]">Personalization Readiness:</span>
          <span className="font-bold text-amber-300 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 1:1 Affinity Ready</span>
        </div>
      </div>
    </div>
  );
}
