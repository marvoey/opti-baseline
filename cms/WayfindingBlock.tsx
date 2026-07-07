import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { NavigationNodeContentType } from './NavigationNode';

export const WayfindingBlockContentType = contentType({
  key: 'WayfindingBlock',
  baseType: '_component',
  displayName: 'v2: Wayfinding Block',
  description: 'Structural navigation: table of contents, breadcrumbs, or step wizard.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    WayfindingType: {
      type: 'string',
      displayName: 'Wayfinding Type',
      isRequired: true,
      sortOrder: 10,
      enum: [
        { value: 'toc', displayName: 'Table of Contents' },
        { value: 'breadcrumbs', displayName: 'Breadcrumbs' },
        { value: 'wizard', displayName: 'Step Wizard' },
      ],
    },
    NavigationNodes: {
      type: 'array',
      displayName: 'Navigation Nodes',
      isLocalized: true,
      sortOrder: 20,
      items: {
        type: 'content',
        allowedTypes: [NavigationNodeContentType],
        restrictedTypes: [],
      },
    },
  },
});

type Node = { Label?: string | null; Target?: { default?: string | null } | null };
type Props = { content: ContentProps<typeof WayfindingBlockContentType> };

function Toc({ nodes, pa }: { nodes: Node[]; pa: (f: string) => object }) {
  return (
    <nav aria-label="Table of contents" className="sticky top-4 px-6 py-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
        On this page
      </p>
      <ol {...pa('NavigationNodes')} className="space-y-2">
        {nodes.slice(0, 5).map((node, i) => (
          <li key={i}>
            <a
              href={node.Target?.default ?? '#'}
              className="text-sm text-blue-600 hover:underline"
            >
              {node.Label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Breadcrumbs({ nodes, pa }: { nodes: Node[]; pa: (f: string) => object }) {
  return (
    <nav aria-label="Breadcrumb" className="px-6 py-3">
      <ol {...pa('NavigationNodes')} className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {nodes.map((node, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {i < nodes.length - 1 ? (
              <a href={node.Target?.default ?? '#'} className="hover:text-blue-600 hover:underline">
                {node.Label}
              </a>
            ) : (
              <span className="font-medium text-gray-900">{node.Label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Wizard({ nodes, pa }: { nodes: Node[]; pa: (f: string) => object }) {
  return (
    <div className="px-6 py-6">
      <ol {...pa('NavigationNodes')} className="flex flex-wrap items-center gap-4">
        {nodes.map((node, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="text-sm font-medium text-gray-700">{node.Label}</span>
            {i < nodes.length - 1 && <span className="text-gray-300">→</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function WayfindingBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const nodes = (content.NavigationNodes ?? []) as Node[];

  return (
    <div {...pa(block)} className="w-full">
      {content.WayfindingType === 'breadcrumbs' ? (
        <Breadcrumbs nodes={nodes} pa={pa} />
      ) : content.WayfindingType === 'wizard' ? (
        <Wizard nodes={nodes} pa={pa} />
      ) : (
        <Toc nodes={nodes} pa={pa} />
      )}
    </div>
  );
}
