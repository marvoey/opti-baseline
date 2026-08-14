import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import {
  sectionSettings,
  type SectionDisplaySettings,
  sectionBgClass,
  sectionPaddingClass,
  sectionInnerClass,
} from './sectionDisplayTemplate';

export const SharedContentContentType = contentType({
  key: 'SharedContent',
  baseType: '_component',
  displayName: 'Shared Content',
  description: 'To be Used in a Column',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    SharedContent_ContentArea: {
      type: 'array',
      displayName: 'Shared Content (Content Area)',
      description: 'This is of type Content Area',
      isRequired: false,
      items: {
        type: 'content',
        allowedTypes: ['_component'],
      },
    },
    SharedContent_ContentAreaItem: {
      type: 'content',
      displayName: 'Shared Content (Content Area Item)',
      isRequired: false,
      allowedTypes: ['_component'],
    },
    SharedContent_ContentReference: {
      type: 'contentReference',
      displayName: 'Shared Content (Content Reference)',
      isRequired: false,
      allowedTypes: ['_component'],
    },
  },
});

export const SharedContentDisplayTemplate = displayTemplate({
  key: 'SharedContentSection',
  isDefault: true,
  displayName: 'Shared Content',
  contentType: 'SharedContent',
  settings: sectionSettings,
});

type Props = {
  content: ContentProps<typeof SharedContentContentType>;
  displaySettings?: SectionDisplaySettings;
};

export default function SharedContent({ content, displaySettings }: Props) {
  type WithComposition = { __composition?: { key: string; __context?: { edit: boolean; preview_token: string } } };
  const composition = (content as WithComposition).__composition;
  console.log('[SharedContent] composition.__context', composition?.__context);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils((composition ?? content) as any);
  
  const bg      = sectionBgClass[displaySettings?.background ?? '']   ?? '';
  const padding = sectionPaddingClass[displaySettings?.padding ?? ''] ?? 'py-12';
  const inner   = sectionInnerClass[displaySettings?.width ?? '']     ?? 'w-full';

  const areaItems = (content.SharedContent_ContentArea ?? []) as unknown[];
  const areaItem  = content.SharedContent_ContentAreaItem as unknown;
  const contentRef = content.SharedContent_ContentReference as unknown;

  const isEmpty = areaItems.length === 0 && !areaItem && !contentRef;

  if (isEmpty) {
    return (
      <div {...pa(content as any)} className={`w-full ${bg} ${padding}`}>
        <div className={inner}>
          <p className="rounded border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400">
            No shared content selected
          </p>
        </div>
      </div>
    );
  }

  return (
    <section {...pa(composition)} className={`w-full m-4 ${bg} ${padding}`}>
      <div className={inner}>
        {areaItems.length > 0 && (
          <div {...pa('SharedContent_ContentArea')}>
            {areaItems.map((item, i) => {
              const key = (item as { _metadata?: { key?: string } })?._metadata?.key ?? String(i);
              return (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <OptimizelyComponent key={key} content={item as any} />
              );
            })}
          </div>
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {areaItem ? <OptimizelyComponent content={areaItem as any} /> : null}
        {contentRef ? (() => {
          const ref = contentRef as { url?: { default?: string } };
          const href = ref.url?.default ?? '#';
          return <a href={href} className="text-sm text-blue-600 underline">{href}</a>;
        })() : null}
      </div>
    </section>
  );
}
