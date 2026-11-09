import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import AccountActionCard from '@/app/_components_liberty/AccountActionCard';
import AnswerLinkCard from '@/app/_components_liberty/AnswerLinkCard';
import Button, { type ButtonVariant } from '@/app/_components_liberty/Button';
import HandoffBanner from '@/app/_components_liberty/HandoffBanner';
import { ICON_NAMES, type IconName } from '@/app/_components_liberty/Icons';
import QuestionTileGrid from '@/app/_components_liberty/QuestionTileGrid';
import RelatedQuestions from '@/app/_components_liberty/RelatedQuestions';
import HelpfulRow from '@/app/_components_liberty/HelpfulRow';
import StateComparisonPanel from '@/app/_components_liberty/StateComparisonPanel';
import StatePill from '@/app/_components_liberty/StatePill';
import StateSelectorCard from '@/app/_components_liberty/StateSelectorCard';
import { cx } from '@/app/_components_liberty/utils';
import LibertyBlock from './LibertyBlock';
import {
  blockSpacing,
  choice,
  flag,
  itemList,
  linkPicker,
  linkUrl,
  lines,
  resolveHref,
  str,
  strList,
} from './shared';

/* B. Home tiles · D. Interactive and task · E. Buttons and trust content. */

const ICON_CHOICES = ICON_NAMES.map((n) => [n, n] as const);

/* ---- B. Home ---- */

/** One tile in the question grid. Embedded in `LibQuestionTileGrid`. */
export const LibQuestionTileContentType = contentType({
  key: 'LibQuestionTile',
  baseType: '_component',
  displayName: 'Liberty Question Tile',
  description: 'One popular question: category label, question and link.',
  properties: {
    Category: str('Category', 10, 'Small uppercase label, e.g. "Car".'),
    Question: str('Question', 20),
    LinkLabel: str('Link text', 30, 'Default: "Get the answer ›".'),
    LinkUrl: linkUrl(40),
    Link: linkPicker(50),
  },
});

/** C08 — grey band with a heading and a grid of popular-question tiles. */
export const LibQuestionTileGridContentType = contentType({
  key: 'LibQuestionTileGrid',
  baseType: '_component',
  displayName: 'Liberty: Question tiles',
  description: 'Full-width grey band with a heading and a 3-column grid of question tiles.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10),
    Tiles: itemList('Tiles', 20, LibQuestionTileContentType, undefined, 12),
  },
});

/* ---- D. Task ---- */

/** C21 — asks the visitor for their state. A plain GET form (`?state=Texas`). */
export const LibStateSelectorCardContentType = contentType({
  key: 'LibStateSelectorCard',
  baseType: '_component',
  displayName: 'Liberty: State selector',
  description: 'Asks for the visitor\'s state: dropdown, quick-pick buttons and a location link.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Label: str('Question', 10),
    Placeholder: str('Dropdown placeholder', 20),
    ButtonLabel: str('Button text', 30),
    PopularLabel: str('Quick-pick label', 40),
    PopularStates: strList('Quick-pick states', 50, 'One state per line.', 20),
    HighlightedState: str('Highlighted state', 60, 'Shown with a teal outline.'),
    AllStates: strList('All states (dropdown)', 70, 'One per line. Empty = the quick-pick states.', 60),
    LocationLabel: str('Location link text', 80),
    LocationLinkUrl: linkUrl(90, 'Location link URL (text)'),
    LocationLink: linkPicker(100, 'Location link (picker)'),
    ActionUrl: str('Submit to (URL)', 110, 'Page that receives ?state=…, e.g. /required-coverage/texas. Empty = this page.'),
    Attention: flag('Pulse the card to draw attention', 120),
  },
});

/** C22 — pill showing the chosen state with a "Change state" action. */
export const LibStatePillContentType = contentType({
  key: 'LibStatePill',
  baseType: '_component',
  displayName: 'Liberty: State pill',
  description: 'Teal pill showing the chosen state with a change action.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    State: str('State', 10),
    ChangeLabel: str('Action text', 20),
    LinkUrl: linkUrl(30),
    Link: linkPicker(40),
  },
});

/** One state in the comparison. Embedded in `LibStateComparisonPanel`. */
export const LibComparisonStateContentType = contentType({
  key: 'LibComparisonState',
  baseType: '_component',
  displayName: 'Liberty Comparison State',
  description: 'One state with its minimum coverage figure.',
  properties: {
    Name: str('State', 10),
    Minimums: str('Minimums', 20, 'e.g. 25/50/25'),
    LinkLabel: str('Link text', 30, 'Default: "See {state} requirements ›".'),
    LinkUrl: linkUrl(40),
    Link: linkPicker(50),
  },
});

/** C23 — grey panel inviting comparison with other states. */
export const LibStateComparisonPanelContentType = contentType({
  key: 'LibStateComparisonPanel',
  baseType: '_component',
  displayName: 'Liberty: State comparison',
  description: 'Grey panel comparing minimum coverage in other states.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Title: str('Title', 10),
    States: itemList('States', 20, LibComparisonStateContentType, undefined, 6),
  },
});

/** C24 — card offering a secure route to claim details (C25 look-up fields are built in). */
export const LibAccountActionCardContentType = contentType({
  key: 'LibAccountActionCard',
  baseType: '_component',
  displayName: 'Liberty: Account action card',
  description: 'Log-in card or claim look-up card.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Variant: choice('Type', 10, [
      ['login', 'Log in'],
      ['lookup', 'Look up a claim (shows claim number, last name and ZIP fields)'],
    ]),
    Icon: choice('Icon', 20, ICON_CHOICES),
    Title: str('Title', 30),
    Description: str('Description', 40, 'Shown on the log-in type.'),
    ButtonLabel: str('Button text', 50),
    ButtonLinkUrl: linkUrl(60, 'Button URL (text)'),
    ButtonLink: linkPicker(70, 'Button link (picker)'),
    SecondaryLabel: str('Small link text', 80, 'Shown under the button on the log-in type.'),
    SecondaryLinkUrl: linkUrl(90, 'Small link URL (text)'),
    SecondaryLink: linkPicker(100, 'Small link (picker)'),
  },
});

/** C26 — banner that redirects an out-of-scope question to real help. */
export const LibHandoffBannerContentType = contentType({
  key: 'LibHandoffBanner',
  baseType: '_component',
  displayName: 'Liberty: Handoff banner',
  description: 'Teal-tinted banner with an icon, message and one button.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Icon: choice('Icon', 10, ICON_CHOICES),
    Title: str('Title', 20),
    Description: str('Description', 30),
    ButtonLabel: str('Button text', 40),
    ButtonLinkUrl: linkUrl(50, 'Button URL (text)'),
    ButtonLink: linkPicker(60, 'Button link (picker)'),
  },
});

/** One answer card. Embedded in `LibAnswerLinkCardGrid`. */
export const LibAnswerLinkCardContentType = contentType({
  key: 'LibAnswerLinkCard',
  baseType: '_component',
  displayName: 'Liberty Answer Link Card',
  description: 'Whole-card link to an approved answer.',
  properties: {
    Category: str('Category', 10),
    Title: str('Title', 20),
    Description: str('Description', 30),
    LinkLabel: str('Link text', 40),
    LinkUrl: linkUrl(50),
    Link: linkPicker(60),
  },
});

/** C27 — a row of answer link cards. */
export const LibAnswerLinkCardGridContentType = contentType({
  key: 'LibAnswerLinkCardGrid',
  baseType: '_component',
  displayName: 'Liberty: Answer link cards',
  description: 'Row of bordered cards that link to approved answers.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Cards: itemList('Cards', 10, LibAnswerLinkCardContentType, undefined, 9),
  },
});

/* ---- E. Buttons and trust ---- */

/** C28 — a button. */
export const LibButtonContentType = contentType({
  key: 'LibButton',
  baseType: '_component',
  displayName: 'Liberty: Button',
  description: 'Teal, outline or navy button.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Label: str('Button text', 10),
    Variant: choice('Style', 20, [
      ['primary', 'Solid teal'],
      ['outline', 'Teal outline'],
      ['navy', 'Navy'],
    ]),
    Align: choice('Alignment', 30, [
      ['center', 'Centred (default)'],
      ['left', 'Left'],
    ]),
    LinkUrl: linkUrl(40),
    Link: linkPicker(50),
  },
});

/** One related question. Embedded in `LibRelatedQuestions`. */
export const LibRelatedQuestionContentType = contentType({
  key: 'LibRelatedQuestion',
  baseType: '_component',
  displayName: 'Liberty Related Question',
  description: 'One "people also ask" question with its link.',
  properties: {
    Question: str('Question', 10),
    LinkUrl: linkUrl(20),
    Link: linkPicker(30),
  },
});

/** C30 — "People also ask" grid. */
export const LibRelatedQuestionsContentType = contentType({
  key: 'LibRelatedQuestions',
  baseType: '_component',
  displayName: 'Liberty: Related questions',
  description: 'Heading and a 3-column grid of related-question cards.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Heading: str('Heading', 10),
    LinkLabel: str('Link text on each card', 20, 'Default: "Get the answer ›".'),
    Questions: itemList('Questions', 30, LibRelatedQuestionContentType, undefined, 9),
  },
});

/** C31 — "Was this answer helpful?" row. */
export const LibHelpfulRowContentType = contentType({
  key: 'LibHelpfulRow',
  baseType: '_component',
  displayName: 'Liberty: Helpful row',
  description: '"Was this answer helpful?" with Yes and No buttons. The choice is only highlighted on screen.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Question: str('Question', 10),
    YesLabel: str('Yes button', 20),
    NoLabel: str('No button', 30),
    ReviewedLabel: str('Freshness note', 40, 'e.g. "Last reviewed October 2026". Empty = hidden.'),
  },
});

export const libTaskTypes = [
  LibQuestionTileContentType,
  LibQuestionTileGridContentType,
  LibStateSelectorCardContentType,
  LibStatePillContentType,
  LibComparisonStateContentType,
  LibStateComparisonPanelContentType,
  LibAccountActionCardContentType,
  LibHandoffBannerContentType,
  LibAnswerLinkCardContentType,
  LibAnswerLinkCardGridContentType,
  LibButtonContentType,
  LibRelatedQuestionContentType,
  LibRelatedQuestionsContentType,
  LibHelpfulRowContentType,
];

/* ---- renderers ---- */

const asIcon = (v: string | null | undefined): IconName | undefined =>
  ICON_NAMES.includes(v as IconName) ? (v as IconName) : undefined;

export function LibQuestionTileGrid({ content }: { content: ContentProps<typeof LibQuestionTileGridContentType> }) {
  return (
    <LibertyBlock content={content} fullBleed defaultSpacing="lg">
      <QuestionTileGrid
        heading={content.Heading ?? ''}
        tiles={(content.Tiles ?? [])
          .filter((t) => t?.Question?.trim())
          .map((t) => ({
            category: t!.Category ?? '',
            question: t!.Question!.trim(),
            linkLabel: t!.LinkLabel?.trim() || undefined,
            href: resolveHref(t!.LinkUrl, t!.Link),
          }))}
      />
    </LibertyBlock>
  );
}

export function LibStateSelectorCard({ content }: { content: ContentProps<typeof LibStateSelectorCardContentType> }) {
  const popular = lines(content.PopularStates);
  const all = lines(content.AllStates);
  return (
    <LibertyBlock content={content}>
      <StateSelectorCard
        className=""
        label={content.Label ?? ''}
        placeholder={content.Placeholder ?? ''}
        buttonLabel={content.ButtonLabel ?? ''}
        popularLabel={content.PopularLabel ?? ''}
        popularStates={popular}
        highlightedState={content.HighlightedState?.trim() || undefined}
        allStates={all.length ? all : undefined}
        locationLabel={content.LocationLabel ?? ''}
        locationHref={resolveHref(content.LocationLinkUrl, content.LocationLink)}
        action={content.ActionUrl?.trim() || undefined}
        attention={!!content.Attention}
      />
    </LibertyBlock>
  );
}

export function LibStatePill({ content }: { content: ContentProps<typeof LibStatePillContentType> }) {
  return (
    <LibertyBlock content={content} defaultSpacing="sm">
      <div className="text-center">
        <StatePill
          state={content.State ?? ''}
          changeLabel={content.ChangeLabel ?? ''}
          href={resolveHref(content.LinkUrl, content.Link)}
        />
      </div>
    </LibertyBlock>
  );
}

export function LibStateComparisonPanel({
  content,
}: {
  content: ContentProps<typeof LibStateComparisonPanelContentType>;
}) {
  return (
    <LibertyBlock content={content}>
      <StateComparisonPanel
        className=""
        title={content.Title ?? ''}
        states={(content.States ?? [])
          .filter((s) => s?.Name?.trim())
          .map((s) => ({
            name: s!.Name!.trim(),
            minimums: s!.Minimums ?? '',
            linkLabel: s!.LinkLabel?.trim() || undefined,
            href: resolveHref(s!.LinkUrl, s!.Link),
          }))}
      />
    </LibertyBlock>
  );
}

export function LibAccountActionCard({
  content,
}: {
  content: ContentProps<typeof LibAccountActionCardContentType>;
}) {
  return (
    <LibertyBlock content={content}>
      <div className="max-w-2xl mx-auto">
        <AccountActionCard
          variant={content.Variant === 'lookup' ? 'lookup' : 'login'}
          icon={asIcon(content.Icon)}
          title={content.Title ?? ''}
          description={content.Description ?? ''}
          buttonLabel={content.ButtonLabel ?? ''}
          buttonHref={resolveHref(content.ButtonLinkUrl, content.ButtonLink)}
          secondaryLabel={content.SecondaryLabel ?? ''}
          secondaryHref={resolveHref(content.SecondaryLinkUrl, content.SecondaryLink)}
        />
      </div>
    </LibertyBlock>
  );
}

export function LibHandoffBanner({ content }: { content: ContentProps<typeof LibHandoffBannerContentType> }) {
  return (
    <LibertyBlock content={content}>
      <HandoffBanner
        className=""
        icon={asIcon(content.Icon)}
        title={content.Title ?? ''}
        description={content.Description ?? ''}
        buttonLabel={content.ButtonLabel ?? ''}
        buttonHref={resolveHref(content.ButtonLinkUrl, content.ButtonLink)}
      />
    </LibertyBlock>
  );
}

export function LibAnswerLinkCardGrid({
  content,
}: {
  content: ContentProps<typeof LibAnswerLinkCardGridContentType>;
}) {
  const cards = (content.Cards ?? []).filter((c) => c?.Title?.trim());
  return (
    <LibertyBlock content={content}>
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <AnswerLinkCard
            key={`${c!.Title}-${i}`}
            category={c!.Category ?? ''}
            title={c!.Title!.trim()}
            description={c!.Description ?? ''}
            linkLabel={c!.LinkLabel ?? ''}
            href={resolveHref(c!.LinkUrl, c!.Link)}
          />
        ))}
      </div>
    </LibertyBlock>
  );
}

export function LibButton({ content }: { content: ContentProps<typeof LibButtonContentType> }) {
  const variant: ButtonVariant =
    content.Variant === 'outline' || content.Variant === 'navy' ? content.Variant : 'primary';
  return (
    <LibertyBlock content={content}>
      <div className={cx(content.Align !== 'left' && 'text-center')}>
        <Button variant={variant} href={resolveHref(content.LinkUrl, content.Link)}>
          {content.Label ?? ''}
        </Button>
      </div>
    </LibertyBlock>
  );
}

export function LibRelatedQuestions({
  content,
}: {
  content: ContentProps<typeof LibRelatedQuestionsContentType>;
}) {
  return (
    <LibertyBlock content={content}>
      <RelatedQuestions
        className=""
        heading={content.Heading ?? ''}
        linkLabel={content.LinkLabel?.trim() || undefined}
        questions={(content.Questions ?? [])
          .filter((q) => q?.Question?.trim())
          .map((q) => ({ question: q!.Question!.trim(), href: resolveHref(q!.LinkUrl, q!.Link) }))}
      />
    </LibertyBlock>
  );
}

export function LibHelpfulRow({ content }: { content: ContentProps<typeof LibHelpfulRowContentType> }) {
  return (
    <LibertyBlock content={content}>
      <HelpfulRow
        className="mb-14"
        question={content.Question ?? ''}
        yesLabel={content.YesLabel ?? ''}
        noLabel={content.NoLabel ?? ''}
        reviewedLabel={content.ReviewedLabel ?? ''}
      />
    </LibertyBlock>
  );
}

export const libTaskRenderers = {
  LibQuestionTileGrid,
  LibStateSelectorCard,
  LibStatePill,
  LibStateComparisonPanel,
  LibAccountActionCard,
  LibHandoffBanner,
  LibAnswerLinkCardGrid,
  LibButton,
  LibRelatedQuestions,
  LibHelpfulRow,
};
