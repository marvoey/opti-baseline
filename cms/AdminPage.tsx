import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const AdminPageContentType = contentType({
  key: 'AdminPage',
  baseType: '_page',
  displayName: '[CIBC] Admin Page',
  description: 'A portal landing page for internal admin sections.',
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      isLocalized: true,
      indexingType: 'searchable',
    },
    Subtitle: {
      type: 'string',
      displayName: 'Subtitle',
      isLocalized: true,
      indexingType: 'searchable',
    },
  },
});

type Props = {
  content: ContentProps<typeof AdminPageContentType>;
};

export default function AdminPage({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h1
            {...pa('Title')}
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            {content.Title ?? 'Admin Portal'}
          </h1>
          {content.Subtitle && (
            <p {...pa('Subtitle')} className="mt-2 text-slate-600 dark:text-slate-400">
              {content.Subtitle}
            </p>
          )}
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-6 py-10" />
    </div>
  );
}
