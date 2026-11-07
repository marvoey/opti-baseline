import { Checklist, ChecklistItem } from '@/app/_components_liberty/ChecklistItem';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('checklist-item');

export default function Page() {
  return (
    <Showcase
      slug="checklist-item"
      props={[
        { name: 'ChecklistItem children', type: 'ReactNode', defaultValue: '"Confirm your policy includes collision and comprehensive"', note: 'Use inside a <ul>' },
        { name: 'Checklist items', type: 'string[]', defaultValue: '4 rental-car lines', note: 'Wrapper that renders one ChecklistItem per string' },
        { name: 'Checklist className', type: 'string', defaultValue: "'mt-4'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: '<Checklist /> with default items',
          node: (
            <div className="max-w-[340px] text-sm">
              <Checklist className="mt-0" />
            </div>
          ),
        },
        {
          label: '<Checklist items={…} /> with custom text',
          node: (
            <div className="max-w-[340px] text-sm">
              <Checklist className="mt-0" items={['Collision', 'Comprehensive', 'Roadside assistance']} />
            </div>
          ),
        },
      ]}
    >
      <ul className="max-w-[340px] text-sm">
        <ChecklistItem />
      </ul>
    </Showcase>
  );
}
