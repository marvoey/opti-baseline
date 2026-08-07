import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

const THEME_CLASSES: Record<string, string> = {
  deadline: 'bg-red-50 border-red-400 text-red-900',
  promo:    'bg-amber-50 border-amber-400 text-amber-900',
  info:     'bg-blue-50 border-blue-400 text-blue-900',
};

export const AlertCalloutBlockContentType = contentType({
  key: 'SFA_AlertCalloutBlock',
  baseType: '_component',
  displayName: '(_SFA) Alert / Promo Banner Block',
  description: 'Inline callout for deadlines or sponsor promos.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    CalloutTitle: {
      type: 'string',
      displayName: 'Alert Title',
      isLocalized: true,
      sortOrder: 5,
    },
    Message: {
      type: 'richText',
      displayName: 'Alert Message',
      isLocalized: true,
      sortOrder: 10,
    },
    ThemeStyle: {
      type: 'string',
      displayName: 'Theme Style',
      sortOrder: 15,
      enum: [
        { value: 'deadline', displayName: 'Deadline (Red)' },
        { value: 'promo',    displayName: 'Promo (Amber)' },
        { value: 'info',     displayName: 'Info (Blue)' },
      ],
    },
  },
});

type Props = { content: ContentProps<typeof AlertCalloutBlockContentType> };

export default function AlertCalloutBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const themeClass = THEME_CLASSES[content.ThemeStyle ?? ''] ?? 'bg-gray-50 border-gray-300 text-gray-900';

  return (
    <div
      {...pa(block)}
      className={`w-full border-l-4 px-6 py-4 rounded-r-md ${themeClass}`}
    >
      {content.CalloutTitle && (
        <p {...pa('CalloutTitle')} className="font-bold text-sm uppercase tracking-wide mb-1">
          {content.CalloutTitle}
        </p>
      )}
      {content.Message && (
        <div {...pa('Message')} className="prose prose-sm max-w-none">
          <RichTextRenderer content={content.Message.json} />
        </div>
      )}
    </div>
  );
}
