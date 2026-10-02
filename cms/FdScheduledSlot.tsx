import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { blockNode } from './shared';

export const FdScheduledSlotContentType = contentType({
  key: 'FdScheduledSlot',
  baseType: '_component',
  displayName: 'Floor & Decor Scheduled Campaign Slot',
  description: 'Time-boxed promotional slot with automatic start/expiry and fallback content.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    SlotName: { type: 'string', format: 'shortString', displayName: 'Slot Identifier', sortOrder: 10 },
    CampaignStart: { type: 'string', displayName: 'Start Date/Time (ISO)', sortOrder: 20 },
    CampaignEnd: { type: 'string', displayName: 'End Date/Time (Auto-Expire)', sortOrder: 30 },
    ActiveContent: {
      type: 'content',
      displayName: 'Active Promotional Block',
      allowedTypes: [],
      sortOrder: 40,
    },
    FallbackContent: {
      type: 'content',
      displayName: 'Fallback Content (Shown when expired)',
      allowedTypes: [],
      sortOrder: 50,
    },
  },
});

export default function FdScheduledSlot({ content }: { content: ContentProps<typeof FdScheduledSlotContentType> }) {
  const { pa } = getPreviewUtils(content);
  const now = new Date();
  const start = content.CampaignStart ? new Date(content.CampaignStart) : null;
  const end = content.CampaignEnd ? new Date(content.CampaignEnd) : null;

  const isLive = (!start || now >= start) && (!end || now <= end);
  const displayContent = isLive ? content.ActiveContent : (content.FallbackContent ?? content.ActiveContent);

  return (
    <div {...pa(blockNode(content))} className="relative">
      {displayContent ? (
        <OptimizelyComponent content={displayContent} />
      ) : (
        <div className="p-4 border-2 border-dashed border-amber-300 bg-amber-50 rounded text-center text-xs text-amber-800">
          Scheduled Slot: Empty ({content.SlotName || 'Unnamed'})
        </div>
      )}
    </div>
  );
}
