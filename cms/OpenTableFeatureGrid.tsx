import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import {
  Clock,
  ConciergeBell,
  Globe,
  Headset,
  Lightbulb,
  MessageCircle,
  MonitorSmartphone,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
  Users,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';

/** Icons an editor can pick for a feature item. Value = enum value stored in the CMS. */
const ICONS: Record<string, { label: string; Icon: LucideIcon }> = {
  globe: { label: 'Globe (anywhere)', Icon: Globe },
  wifiOff: { label: 'Offline', Icon: WifiOff },
  device: { label: 'Devices', Icon: MonitorSmartphone },
  bell: { label: 'Service bell', Icon: ConciergeBell },
  headset: { label: 'Support headset', Icon: Headset },
  phone: { label: 'Phone', Icon: PhoneCall },
  growth: { label: 'Growth', Icon: TrendingUp },
  team: { label: 'Team', Icon: Users },
  idea: { label: 'Idea', Icon: Lightbulb },
  chat: { label: 'Chat', Icon: MessageCircle },
  clock: { label: 'Clock', Icon: Clock },
  shield: { label: 'Shield', Icon: ShieldCheck },
};

/** One icon + title + text entry in the grid. Not placed on its own — used inside OpenTableFeatureGrid. */
export const OpenTableFeatureItemContentType = contentType({
  key: 'OpenTableFeatureItem',
  baseType: '_component',
  displayName: 'OpenTable Feature Item',
  description: 'OpenTable feature item: an icon with a short title and a sentence of supporting text.',
  properties: {
    Icon: {
      type: 'string',
      displayName: 'Icon',
      enum: Object.entries(ICONS).map(([value, { label }]) => ({ value, displayName: label })),
      sortOrder: 10,
    },
    Title: {
      type: 'string',
      displayName: 'Title',
      isLocalized: true,
      isRequired: true,
      maxLength: 60,
      sortOrder: 20,
    },
    Text: {
      type: 'string',
      displayName: 'Text',
      isLocalized: true,
      maxLength: 200,
      sortOrder: 30,
    },
  },
});

/**
 * OpenTable Feature Grid — heading plus a grid of icon/title/text items on a
 * dark (wine) or light (cream) band. Used for "A reliable platform with
 * unparalleled support" and similar benefit lists.
 */
export const OpenTableFeatureGridContentType = contentType({
  key: 'OpenTableFeatureGrid',
  baseType: '_component',
  displayName: 'OpenTable Feature Grid',
  description: 'OpenTable feature grid: centered heading and a 3-column grid of icon + title + text items, on a dark or light band.',
  // sectionEnabled only: the CMS rejects an array-of-components property (Items) on elementEnabled types.
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      isLocalized: true,
      isRequired: true,
      maxLength: 120,
      sortOrder: 10,
    },
    Theme: {
      type: 'string',
      displayName: 'Theme',
      description: 'Dark = deep maroon band with light text. Light = cream band with dark text.',
      enum: [
        { value: 'dark', displayName: 'Dark (maroon)' },
        { value: 'light', displayName: 'Light (cream)' },
      ],
      sortOrder: 20,
    },
    Items: {
      type: 'array',
      displayName: 'Items',
      isLocalized: true,
      maxItems: 9,
      items: { type: 'component', contentType: OpenTableFeatureItemContentType },
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof OpenTableFeatureGridContentType> };

export default function OpenTableFeatureGrid({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const dark = content.Theme !== 'light';
  const items = content.Items ?? [];

  return (
    <section
      {...pa(block)}
      className={`w-full ${dark ? 'bg-wine text-white' : 'bg-cream text-ink'}`}
    >
      <div className="page-width py-14 md:py-20">
        <h2 {...pa('Heading')} className="mx-auto max-w-2xl text-center text-heading">
          {content.Heading}
        </h2>
        <ul {...pa('Items')} className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[item.Icon ?? '']?.Icon;
            return (
              <li key={i} className="flex flex-col gap-3">
                {Icon && <Icon aria-hidden className="h-8 w-8 text-accent" strokeWidth={1.5} />}
                <h3 className="font-sans text-lead font-semibold">{item.Title}</h3>
                {item.Text && <p className={dark ? 'text-white/85' : 'text-ink-soft'}>{item.Text}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
