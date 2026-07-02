import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { Download, Plus } from 'lucide-react';
import { Badge } from '@/app/_components/Badge';

/**
 * Capital One: Document Library — AI-tagged banking documents panel. A heading +
 * a grid of document cards (leaf `CibcAssetCard`), with an optional dashed
 * "upload" tile. Card count per row is a display-template choice.
 */
export const CibcAssetCardContentType = contentType({
  key: 'CibcAssetCard',
  baseType: '_component',
  displayName: 'Capital One: Document Card',
  description: 'A single AI-tagged banking document (name, type, metadata chips, link).',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    AssetName: { type: 'string', displayName: 'Asset Name', description: 'File or document name.', isLocalized: true, sortOrder: 10 },
    AssetClass: { type: 'string', displayName: 'Asset Class', description: 'e.g. Private Equity, Real Estate.', isLocalized: true, sortOrder: 20 },
    Metadata: {
      type: 'array',
      displayName: 'Metadata Tags',
      description: 'AI-extracted tags shown as chips.',
      items: { type: 'string' },
      isLocalized: true,
      sortOrder: 30,
    },
    ExtractedBy: { type: 'string', displayName: 'Extracted By', description: 'Attribution badge, e.g. "Opal".', isLocalized: true, sortOrder: 40 },
    FileLink: { type: 'link', displayName: 'File Link', description: 'Link to download or open the asset.', isLocalized: true, sortOrder: 50 },
  },
});

export const CibcAssetGridContentType = contentType({
  key: 'CibcAssetGrid',
  baseType: '_component',
  displayName: 'Capital One: Document Library',
  description: 'A heading plus a grid of AI-tagged document cards.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', description: 'Grid heading, e.g. "Asset Intelligence (AI-Tagged)".', isLocalized: true, sortOrder: 10 },
    AllowUpload: { type: 'boolean', displayName: 'Show Upload Tile', description: 'Render the dashed "upload new asset" tile.', isLocalized: true, sortOrder: 20 },
    Assets: {
      type: 'array',
      displayName: 'Assets',
      isLocalized: true,
      description: 'Cards of AI-tagged private assets.',
      items: { type: 'component', contentType: CibcAssetCardContentType },
      sortOrder: 30,
    },
  },
});

export const CibcAssetGridDisplayTemplate = displayTemplate({
  key: 'CibcAssetGridDefault',
  isDefault: true,
  displayName: 'Capital One: Document Grid',
  contentType: 'CibcAssetGrid',
  settings: {
    columns: {
      editor: 'select',
      displayName: 'Columns',
      sortOrder: 0,
      choices: {
        two: { displayName: 'Two', sortOrder: 1 },
        three: { displayName: 'Three', sortOrder: 2 },
      },
    },
  },
});

type Props = {
  content: ContentProps<typeof CibcAssetGridContentType>;
  displaySettings?: ContentProps<typeof CibcAssetGridDisplayTemplate>;
};

const COLS: Record<string, string> = {
  two: 'sm:grid-cols-2',
  three: 'sm:grid-cols-3',
};

export default function CibcAssetGrid({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const assets = content.Assets ?? [];
  const cols = COLS[displaySettings?.columns ?? 'two'] ?? COLS.two;

  return (
    <div {...pa(block)} className="space-y-4">
      {content.Heading ? (
        <h2 {...pa('Heading')} className="text-lg font-bold text-cibc-teal">
          {content.Heading}
        </h2>
      ) : null}
      <div className={`grid grid-cols-1 ${cols} gap-4`}>
        {assets.map((asset, i) => (
          <div key={i} className="bg-white border border-black/5 rounded-xl p-5 hover:border-cibc-gold/40 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-cibc-teal/10 rounded-lg text-cibc-teal">
                <Download size={20} />
              </div>
              {asset?.ExtractedBy ? <Badge color="mint">Extracted by {asset.ExtractedBy}</Badge> : null}
            </div>
            <h3 className="font-bold text-sm truncate text-cibc-teal-dark">{asset?.AssetName}</h3>
            <p className="text-xs text-cibc-ink/60 mb-4">{asset?.AssetClass}</p>
            <div className="flex flex-wrap gap-2">
              {(asset?.Metadata ?? []).map((tag, j) => (
                <span key={j} className="text-[10px] bg-cibc-stone px-2 py-1 rounded-md text-cibc-ink/80 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {content.AllowUpload ? (
          <div className="bg-white/50 border border-dashed border-cibc-gold/40 rounded-xl flex flex-col items-center justify-center p-8 text-cibc-ink/50 hover:bg-cibc-gold/5 transition-colors cursor-pointer">
            <Plus size={24} className="mb-2 text-cibc-gold" />
            <span className="text-xs font-bold uppercase tracking-wider">Upload New Private Asset</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
