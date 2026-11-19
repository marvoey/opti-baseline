import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { CalendarCheck } from 'lucide-react';
import { urlHrefOr } from './shared';

/**
 * Promo banner as a page component: the same magenta strip as the site-wide banner
 * under the header, but as a block an editor drops into a Visual Builder section,
 * so one page (or one campaign landing page) can carry its own message.
 *
 * This does NOT replace the site-wide banner. That one is still rendered by
 * app/_components/TopNav.tsx from the "[eHealth] Site Settings" item
 * (lib/siteSettings.ts) and is unchanged. The markup below mirrors TopNav, so keep
 * the two in step if the strip's design changes.
 *
 * A blank message hides the strip (an editor sees a placeholder instead); a blank
 * link label drops the link; a blank link URL falls back to /medicare.
 */
export const EhPromoBannerContentType = contentType({
  key: 'EhPromoBanner',
  baseType: '_component',
  displayName: '[eHealth] Promo Banner',
  description:
    '[EH] Magenta promo strip (message plus an optional link) to drop onto a page. The site-wide banner under the header is set in [eHealth] Site Settings instead.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Message: {
      type: 'string',
      displayName: 'Message',
      description: 'Bold text in the strip, e.g. "ACA Open Enrollment ends January 15!". Leave blank to hide the strip.',
      isLocalized: true,
      sortOrder: 10,
    },
    LinkLabel: {
      type: 'string',
      displayName: 'Link label',
      description: 'Underlined link text after the message, e.g. "Compare 2027 plans". Leave blank for no link.',
      isLocalized: true,
      sortOrder: 20,
    },
    LinkUrl: {
      type: 'url',
      displayName: 'Link URL',
      description: 'Where the link goes. Use a site path such as /individual-and-family.',
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof EhPromoBannerContentType> };

export default function EhPromoBanner({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const isEditing = !!(content as { __context?: { edit?: boolean } }).__context?.edit;

  const message = content.Message?.trim();
  const linkLabel = content.LinkLabel?.trim();

  if (!message) {
    if (!isEditing) return null;
    return (
      <div {...pa(block)} className="w-full px-6 py-3">
        <div
          {...pa('Message')}
          className="rounded border border-dashed border-gray-400 p-3 text-center text-sm text-gray-500"
        >
          Add a message to show the promo banner
        </div>
      </div>
    );
  }

  return (
    <div {...pa(block)} className="w-full bg-promo text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-1.5 text-center font-display text-xs font-semibold">
        <CalendarCheck size={14} aria-hidden="true" />
        <span {...pa('Message')}>{message}</span>
        {linkLabel && (
          <a
            {...pa('LinkLabel')}
            href={urlHrefOr(content.LinkUrl)}
            className="font-normal underline underline-offset-2 hover:no-underline"
          >
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}
