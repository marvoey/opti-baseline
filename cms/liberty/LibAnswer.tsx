import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import AnswerBlock from '@/app/_components_liberty/AnswerBlock';
import AnswerWithSidebar from '@/app/_components_liberty/AnswerWithSidebar';
import BenefitColumn from '@/app/_components_liberty/BenefitColumn';
import CalloutPanel, { type CalloutVariant } from '@/app/_components_liberty/CalloutPanel';
import CoverageTable, { type CoverageRow } from '@/app/_components_liberty/CoverageTable';
import FeatureCard from '@/app/_components_liberty/FeatureCard';
import { ICON_NAMES, type IconName } from '@/app/_components_liberty/Icons';
import IllustrationBanner, { type IllustrationScene } from '@/app/_components_liberty/IllustrationBanner';
import StatCard from '@/app/_components_liberty/StatCard';
import StepList from '@/app/_components_liberty/StepList';
import { cx, safeHref } from '@/app/_components_liberty/utils';
import LibertyBlock from './LibertyBlock';
import {
  blockSpacing,
  choice,
  flag,
  itemList,
  linkPicker,
  linkUrl,
  lines,
  parts,
  resolveHref,
  str,
  strList,
} from './shared';

/* C. Answer content. Repeated rows are small embedded item blocks (LibXxx). */

const ICON_CHOICES = [['none', 'No icon'], ...ICON_NAMES.map((n) => [n, n] as const)] as const;
const VARIANTS: ReadonlyArray<readonly [string, string]> = [
  ['checklist', 'Checklist'],
  ['text', 'Text and link'],
  ['steps', 'Numbered steps'],
  ['links', 'Link list'],
];

/** C09 — the main explanation: two-tone heading, accent bar and paragraphs. */
export const LibAnswerBlockContentType = contentType({
  key: 'LibAnswerBlock',
  baseType: '_component',
  displayName: 'Liberty: Answer block',
  description: 'Two-tone heading, yellow accent bar and body paragraphs.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    HeadingBold: str('Heading (bold line)', 10),
    HeadingLight: str('Heading (light line)', 20),
    Paragraphs: strList('Paragraphs', 30, 'One paragraph per line.'),
  },
});

/** One link in a callout "link list". Kept as a single text line per link. */
const CALLOUT_LINKS_HELP = 'One link per line: Label | Description | URL (path or https://).';

/** C10 — answer text beside a callout panel (one flat block, no nesting). */
export const LibAnswerWithSidebarContentType = contentType({
  key: 'LibAnswerWithSidebar',
  baseType: '_component',
  displayName: 'Liberty: Answer with sidebar',
  description: 'Answer text on the left and a callout panel on the right. Stacks on mobile.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    HeadingBold: str('Heading (bold line)', 10),
    HeadingLight: str('Heading (light line)', 20),
    Paragraphs: strList('Paragraphs', 30, 'One paragraph per line.'),
    CalloutVariant: choice('Callout: type', 40, VARIANTS),
    CalloutTitle: str('Callout: title', 50),
    CalloutText: str('Callout: text', 60, 'Used by the "Text and link" type.'),
    CalloutChecklist: strList('Callout: checklist', 70, 'Used by the "Checklist" type. One item per line.'),
    CalloutSteps: strList('Callout: steps', 80, 'Used by the "Numbered steps" type. One step per line.'),
    CalloutLinks: strList('Callout: links', 90, CALLOUT_LINKS_HELP),
    CalloutActionLabel: str('Callout: action text', 100, 'Link text (or button text for steps).'),
    CalloutActionUrl: linkUrl(110, 'Callout: action URL (text)'),
    CalloutActionLink: linkPicker(120, 'Callout: action link (picker)'),
  },
});

/** C11 — cream callout panel on its own. */
export const LibCalloutPanelContentType = contentType({
  key: 'LibCalloutPanel',
  baseType: '_component',
  displayName: 'Liberty: Callout panel',
  description: 'Cream panel with practical next steps: checklist, text and link, numbered steps or link list.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Variant: choice('Type', 10, VARIANTS),
    Title: str('Title', 20),
    Text: str('Text', 30, 'Used by the "Text and link" type.'),
    Checklist: strList('Checklist', 40, 'Used by the "Checklist" type. One item per line.'),
    Steps: strList('Steps', 50, 'Used by the "Numbered steps" type. One step per line.'),
    Links: strList('Links', 60, CALLOUT_LINKS_HELP),
    ActionLabel: str('Action text', 70, 'Link text (or button text for steps).'),
    ActionUrl: linkUrl(80, 'Action URL (text)'),
    ActionLink: linkPicker(90, 'Action link (picker)'),
  },
});

/** C13 — numbered "what to do now" list. */
export const LibStepListContentType = contentType({
  key: 'LibStepList',
  baseType: '_component',
  displayName: 'Liberty: Step list',
  description: 'Numbered steps with navy number circles.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Steps: strList('Steps', 10, 'One step per line. Numbered automatically.'),
  },
});

/** One row of the coverage table. Embedded in `LibCoverageTable`. */
export const LibCoverageRowContentType = contentType({
  key: 'LibCoverageRow',
  baseType: '_component',
  displayName: 'Liberty Coverage Row',
  description: 'One coverage: name, real-life example and outcome.',
  properties: {
    Name: str('Coverage', 10),
    NameAsLink: flag('Show the name as a link', 20),
    Example: str('Real-life example', 30),
    StatusVariant: choice('Outcome style', 40, [
      ['positive', 'Check mark and text'],
      ['mist', 'Teal pill'],
      ['gray', 'Grey pill'],
    ]),
    StatusLabel: str('Outcome text', 50),
  },
});

/** C14 — three-column comparison table (C15 outcomes are part of each row). */
export const LibCoverageTableContentType = contentType({
  key: 'LibCoverageTable',
  baseType: '_component',
  displayName: 'Liberty: Coverage table',
  description: 'Coverage / real-life example / outcome table.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Headers: strList('Column headings', 10, 'Exactly three lines: coverage, example, outcome.', 3),
    Rows: itemList('Rows', 20, LibCoverageRowContentType, undefined, 20),
  },
});

/** One feature card. Embedded in `LibFeatureCardGrid` (C17 icon is a field). */
export const LibFeatureCardContentType = contentType({
  key: 'LibFeatureCard',
  baseType: '_component',
  displayName: 'Liberty Feature Card',
  description: 'Cream card with optional icon, title, description and link.',
  properties: {
    Title: str('Title', 10),
    Description: str('Description', 20),
    Icon: choice('Icon', 30, ICON_CHOICES, 'Leave on "No icon" for a text-only card.'),
    LinkLabel: str('Link text', 40, 'Leave empty for no link.'),
    LinkUrl: linkUrl(50),
    Link: linkPicker(60),
  },
});

/** C16 — a row of feature cards. */
export const LibFeatureCardGridContentType = contentType({
  key: 'LibFeatureCardGrid',
  baseType: '_component',
  displayName: 'Liberty: Feature cards',
  description: 'Row of cream cards, three per row on desktop.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Cards: itemList('Cards', 10, LibFeatureCardContentType, undefined, 9),
  },
});

/** One stat card. Embedded in `LibStatCardGrid`. */
export const LibStatCardContentType = contentType({
  key: 'LibStatCard',
  baseType: '_component',
  displayName: 'Liberty Stat Card',
  description: 'Large figure with a caption.',
  properties: {
    Value: str('Figure', 10, 'e.g. $30,000'),
    Caption: str('Caption', 20),
  },
});

/** C18 — a row of stat cards. */
export const LibStatCardGridContentType = contentType({
  key: 'LibStatCardGrid',
  baseType: '_component',
  displayName: 'Liberty: Stat cards',
  description: 'Row of bordered cards with a large figure, accent bar and caption.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Stats: itemList('Stats', 10, LibStatCardContentType, undefined, 9),
  },
});

/** One benefit column. Embedded in `LibBenefitColumnGrid`. */
export const LibBenefitColumnContentType = contentType({
  key: 'LibBenefitColumn',
  baseType: '_component',
  displayName: 'Liberty Benefit Column',
  description: 'Short selling point: title, accent bar and paragraph.',
  properties: {
    Title: str('Title', 10),
    Description: str('Description', 20),
  },
});

/** C19 — a row of benefit columns. */
export const LibBenefitColumnGridContentType = contentType({
  key: 'LibBenefitColumnGrid',
  baseType: '_component',
  displayName: 'Liberty: Benefit columns',
  description: 'Row of short selling points, three per row on desktop.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Benefits: itemList('Benefits', 10, LibBenefitColumnContentType, undefined, 9),
  },
});

/** C20 — wide illustration that sets the topic. */
export const LibIllustrationBannerContentType = contentType({
  key: 'LibIllustrationBanner',
  baseType: '_component',
  displayName: 'Liberty: Illustration',
  description: 'Wide illustrated scene: road, house or family.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Scene: choice('Scene', 10, [
      ['road', 'Road (car and rental agreement)'],
      ['house', 'House (water damage)'],
      ['family', 'Family (home and auto)'],
    ]),
    AriaLabel: str('Description for screen readers', 20),
  },
});

export const libAnswerTypes = [
  LibAnswerBlockContentType,
  LibAnswerWithSidebarContentType,
  LibCalloutPanelContentType,
  LibStepListContentType,
  LibCoverageRowContentType,
  LibCoverageTableContentType,
  LibFeatureCardContentType,
  LibFeatureCardGridContentType,
  LibStatCardContentType,
  LibStatCardGridContentType,
  LibBenefitColumnContentType,
  LibBenefitColumnGridContentType,
  LibIllustrationBannerContentType,
];

/* ---- renderers ---- */

type Callout = {
  variant?: string | null;
  title?: string | null;
  text?: string | null;
  checklist?: ReadonlyArray<string | null> | null;
  steps?: ReadonlyArray<string | null> | null;
  links?: ReadonlyArray<string | null> | null;
  actionLabel?: string | null;
  actionHref: string;
};

/** The callout panel from flat CMS values. Empty values render empty, never demo copy. */
function CalloutFromValues({ v, className }: { v: Callout; className?: string }) {
  const variant: CalloutVariant = (['checklist', 'text', 'steps', 'links'] as const).includes(
    v.variant as CalloutVariant,
  )
    ? (v.variant as CalloutVariant)
    : 'checklist';
  return (
    <CalloutPanel
      className={className}
      variant={variant}
      title={v.title ?? ''}
      text={v.text ?? ''}
      items={lines(v.checklist)}
      steps={lines(v.steps)}
      links={lines(v.links).map((line) => {
        const [label = '', description = '', href = ''] = parts(line);
        return { label, description, href: safeHref(href) };
      })}
      actionLabel={v.actionLabel ?? ''}
      actionHref={v.actionHref}
    />
  );
}

export function LibAnswerBlock({ content }: { content: ContentProps<typeof LibAnswerBlockContentType> }) {
  return (
    <LibertyBlock content={content}>
      <AnswerBlock
        headingBold={content.HeadingBold ?? ''}
        headingLight={content.HeadingLight ?? ''}
        paragraphs={lines(content.Paragraphs)}
      />
    </LibertyBlock>
  );
}

export function LibAnswerWithSidebar({ content }: { content: ContentProps<typeof LibAnswerWithSidebarContentType> }) {
  return (
    <LibertyBlock content={content}>
      <AnswerWithSidebar
        className=""
        main={
          <AnswerBlock
            headingBold={content.HeadingBold ?? ''}
            headingLight={content.HeadingLight ?? ''}
            paragraphs={lines(content.Paragraphs)}
          />
        }
        sidebar={
          <CalloutFromValues
            v={{
              variant: content.CalloutVariant,
              title: content.CalloutTitle,
              text: content.CalloutText,
              checklist: content.CalloutChecklist,
              steps: content.CalloutSteps,
              links: content.CalloutLinks,
              actionLabel: content.CalloutActionLabel,
              actionHref: resolveHref(content.CalloutActionUrl, content.CalloutActionLink),
            }}
          />
        }
      />
    </LibertyBlock>
  );
}

export function LibCalloutPanel({ content }: { content: ContentProps<typeof LibCalloutPanelContentType> }) {
  return (
    <LibertyBlock content={content}>
      <div className="max-w-md mx-auto">
        <CalloutFromValues
          v={{
            variant: content.Variant,
            title: content.Title,
            text: content.Text,
            checklist: content.Checklist,
            steps: content.Steps,
            links: content.Links,
            actionLabel: content.ActionLabel,
            actionHref: resolveHref(content.ActionUrl, content.ActionLink),
          }}
        />
      </div>
    </LibertyBlock>
  );
}

export function LibStepList({ content }: { content: ContentProps<typeof LibStepListContentType> }) {
  return (
    <LibertyBlock content={content}>
      <StepList className="" steps={lines(content.Steps)} />
    </LibertyBlock>
  );
}

export function LibCoverageTable({ content }: { content: ContentProps<typeof LibCoverageTableContentType> }) {
  const [h1 = '', h2 = '', h3 = ''] = lines(content.Headers);
  const rows: CoverageRow[] = (content.Rows ?? [])
    .filter((r) => r?.Name?.trim())
    .map((r) => ({
      name: r!.Name!.trim(),
      example: r!.Example ?? '',
      nameAsLink: !!r!.NameAsLink,
      status: {
        variant: r!.StatusVariant === 'mist' || r!.StatusVariant === 'gray' ? r!.StatusVariant : 'positive',
        label: r!.StatusLabel ?? '',
      },
    }));
  return (
    <LibertyBlock content={content}>
      <CoverageTable className="" headers={[h1, h2, h3]} rows={rows} />
    </LibertyBlock>
  );
}

export function LibFeatureCardGrid({ content }: { content: ContentProps<typeof LibFeatureCardGridContentType> }) {
  const cards = (content.Cards ?? []).filter((c) => c?.Title?.trim());
  return (
    <LibertyBlock content={content}>
      <div className={cx('grid md:grid-cols-3 gap-6')}>
        {cards.map((c, i) => (
          <FeatureCard
            key={`${c!.Title}-${i}`}
            title={c!.Title!.trim()}
            description={c!.Description ?? ''}
            icon={ICON_NAMES.includes(c!.Icon as IconName) ? (c!.Icon as IconName) : null}
            linkLabel={c!.LinkLabel?.trim() || undefined}
            linkHref={resolveHref(c!.LinkUrl, c!.Link)}
          />
        ))}
      </div>
    </LibertyBlock>
  );
}

export function LibStatCardGrid({ content }: { content: ContentProps<typeof LibStatCardGridContentType> }) {
  const stats = (content.Stats ?? []).filter((s) => s?.Value?.trim());
  return (
    <LibertyBlock content={content}>
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatCard key={`${s!.Value}-${i}`} value={s!.Value!.trim()} caption={s!.Caption ?? ''} />
        ))}
      </div>
    </LibertyBlock>
  );
}

export function LibBenefitColumnGrid({ content }: { content: ContentProps<typeof LibBenefitColumnGridContentType> }) {
  const benefits = (content.Benefits ?? []).filter((b) => b?.Title?.trim());
  return (
    <LibertyBlock content={content}>
      <div className="grid md:grid-cols-3 gap-8">
        {benefits.map((b, i) => (
          <BenefitColumn key={`${b!.Title}-${i}`} title={b!.Title!.trim()} description={b!.Description ?? ''} />
        ))}
      </div>
    </LibertyBlock>
  );
}

export function LibIllustrationBanner({ content }: { content: ContentProps<typeof LibIllustrationBannerContentType> }) {
  const scene: IllustrationScene =
    content.Scene === 'house' || content.Scene === 'family' ? content.Scene : 'road';
  return (
    <LibertyBlock content={content}>
      <IllustrationBanner scene={scene} ariaLabel={content.AriaLabel || undefined} />
    </LibertyBlock>
  );
}

export const libAnswerRenderers = {
  LibAnswerBlock,
  LibAnswerWithSidebar,
  LibCalloutPanel,
  LibStepList,
  LibCoverageTable,
  LibFeatureCardGrid,
  LibStatCardGrid,
  LibBenefitColumnGrid,
  LibIllustrationBanner,
};
