import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { HeroSectionWarning } from './HeroSectionWarning';

export const HeroSectionContentType = contentType({
  key: 'HeroSection',
  baseType: '_section',
  displayName: 'Hero Section (Full Width)',
  description: 'Full-width hero layout with background image and content overlay.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {},
});

export const HeroSectionDisplayTemplate = displayTemplate({
  key: 'HeroSectionDefault',
  isDefault: true,
  displayName: 'Hero Section',
  contentType: 'HeroSection',
  settings: {
    theme: {
      editor: 'select',
      displayName: 'Theme',
      sortOrder: 0,
      choices: {
        default: { displayName: 'Default', sortOrder: 1 },
        light:   { displayName: 'Light',   sortOrder: 2 },
        dark:    { displayName: 'Dark',    sortOrder: 3 },
      },
    },
  },
});

const THEME = {
  default: { overlay: 'bg-black/50', prose: 'prose-invert', text: 'text-white' },
  light:   { overlay: 'bg-white/40', prose: '',             text: 'text-gray-900' },
  dark:    { overlay: 'bg-black/50', prose: 'prose-invert', text: 'text-white' },
} as const;
type Theme = keyof typeof THEME;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findComponent(nodes: any[], typename: string): any | null {
  for (const row of nodes) {
    for (const col of (row.nodes ?? [])) {
      for (const elem of (col.nodes ?? [])) {
        if (elem.component?.__typename === typename) return elem.component;
      }
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function missingMessage(nodes: any[]): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasCol  = nodes.some((r: any) => (r.nodes as any[])?.length > 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasPara = nodes.some((r: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r.nodes as any[])?.some((c: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c.nodes as any[])?.some((e: any) => e.component?.__typename === 'Paragraph')
    )
  );
  if (!nodes.length) return 'Add a row, column, and Paragraph block to this Hero Section.';
  if (!hasCol)       return 'Add a column with a Paragraph block to this Hero Section.';
  if (!hasPara)      return 'Add a Paragraph block to the column in this Hero Section.';
  return 'Add a Paragraph block to this Hero Section.';
}

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: ContentProps<typeof HeroSectionContentType> & { nodes?: any[] };
  displaySettings?: ContentProps<typeof HeroSectionDisplayTemplate>;
};

export default function HeroSection({ content, displaySettings }: Props) {
  const { pa, src } = getPreviewUtils(content);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPreview = !!(content as any).__context?.preview_token;
  const nodes = content.nodes ?? [];
  const paragraphData = findComponent(nodes, 'Paragraph');
  const imageData     = findComponent(nodes, 'Image');

  const themeKey = (displaySettings?.theme as unknown as Theme) ?? 'default';
  const { overlay, prose, text } = THEME[themeKey] ?? THEME.default;

  if (!paragraphData) {
    return (
      <section {...pa(content)} className="relative min-h-120 overflow-hidden flex items-center justify-center bg-gray-900">
        <HeroSectionWarning rowCount={nodes.length} isPreview={isPreview} />
        <p className="text-sm text-gray-400">{missingMessage(nodes)}</p>
      </section>
    );
  }

  const bgSrc = imageData?.Image ? src(imageData.Image) : undefined;

  return (
    <section {...pa(content)} className="relative min-h-120 overflow-hidden">
      <HeroSectionWarning rowCount={nodes.length} isPreview={isPreview} />
      {bgSrc ? (
        <img
          src={bgSrc}
          alt={(imageData?.AltText as string | undefined) ?? ''}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={themeKey === 'light' ? '/hero-bg-light.svg' : '/hero-bg-dark.svg'}
          alt="" aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />
      <div className={`relative z-10 px-8 py-16 ${text}`}>
        <div className={`prose mx-auto max-w-3xl ${prose}`}>
          <RichTextRenderer content={paragraphData.Text?.json} />
        </div>
      </div>
    </section>
  );
}
