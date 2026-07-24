import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';

function BlankRow({ children }: StructureContainerProps) {
  return <div className="flex flex-col gap-4 md:flex-row">{children}</div>;
}

function BlankColumn({ children }: StructureContainerProps) {
  return <div className="flex-1">{children}</div>;
}

type EmptyReason = 'no-rows' | 'no-columns' | 'no-content' | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEmptyReason(nodes: any[]): EmptyReason {
  if (!nodes?.length) return 'no-rows';
  const allRowsEmpty = nodes.every(row => !row.nodes?.length);
  if (allRowsEmpty) return 'no-columns';
  const allColumnsEmpty = nodes.every(row =>
    row.nodes?.every((col: any) => !col.nodes?.length),
  );
  if (allColumnsEmpty) return 'no-content';
  return null;
}

const EMPTY_MESSAGES: Record<Exclude<EmptyReason, null>, string> = {
  'no-rows': 'This section has no rows. Add a row in the Visual Builder to get started.',
  'no-columns': 'This section has rows but no columns. Add columns inside each row to hold content.',
  'no-content': 'This section has columns but no content elements. Drag elements into the columns to display content.',
};

// BlankSection is a CMS system type — no contentType() definition needed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlankSection({ content }: { content: any }) {
  const { pa } = getPreviewUtils(content);
  const emptyReason = getEmptyReason(content.nodes);
  return (
    <section {...pa(content)}>
      {emptyReason ? (
        <p className="text-muted-foreground py-8 text-center text-sm italic">
          {EMPTY_MESSAGES[emptyReason]}
        </p>
      ) : (
        <OptimizelyGridSection
          nodes={content.nodes}
          row={BlankRow}
          column={BlankColumn}
        />
      )}
    </section>
  );
}
