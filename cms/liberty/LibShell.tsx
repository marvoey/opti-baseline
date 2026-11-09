import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import AccentBar from '@/app/_components_liberty/AccentBar';
import AskBar from '@/app/_components_liberty/AskBar';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import Button from '@/app/_components_liberty/Button';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import StatePill from '@/app/_components_liberty/StatePill';
import TitleBlock from '@/app/_components_liberty/TitleBlock';
import { cx } from '@/app/_components_liberty/utils';
import LibertyBlock from './LibertyBlock';
import { blockSpacing, choice, flag, itemList, linkPicker, linkUrl, resolveHref, str } from './shared';

/* A. Page shell and navigation: ask bar, breadcrumb, title block, section heading, accent bar. */

/** C01 — the grey strip at the top of an answer page. */
export const LibAskBarContentType = contentType({
  key: 'LibAskBar',
  baseType: '_component',
  displayName: 'Liberty: Ask bar',
  description: 'Grey strip with the question being answered and an Ask button.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Question: str('Question', 10, 'Pre-filled in the box.'),
    ButtonLabel: str('Button label', 20),
    Placeholder: str('Placeholder', 30, 'Shown when the box is emptied.'),
    ActionUrl: str('Submit to (URL)', 40, 'Page the question is sent to, e.g. /search. Empty = this page.'),
  },
});

/** One breadcrumb step. Embedded in `LibBreadcrumb`. */
export const LibCrumbContentType = contentType({
  key: 'LibCrumb',
  baseType: '_component',
  displayName: 'Liberty Breadcrumb Step',
  description: 'One step in a breadcrumb trail.',
  properties: {
    Label: str('Label', 10),
    LinkUrl: linkUrl(20),
    Link: linkPicker(30),
  },
});

/** C02 — "Answers › Section › Topic" trail. */
export const LibBreadcrumbContentType = contentType({
  key: 'LibBreadcrumb',
  baseType: '_component',
  displayName: 'Liberty: Breadcrumb',
  description: 'Breadcrumb trail under the ask bar. The last step is the current page.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    RootLabel: str('First step label', 10, 'Always a link, e.g. "Answers".'),
    RootLinkUrl: linkUrl(20, 'First step URL (text)'),
    RootLink: linkPicker(30, 'First step link (picker)'),
    Items: itemList('Steps', 40, LibCrumbContentType, 'Steps after the first. The last one is the current page and is not a link.'),
  },
});

/** C03 — headline and the short direct answer, with an optional state pill and buttons. */
export const LibTitleBlockContentType = contentType({
  key: 'LibTitleBlock',
  baseType: '_component',
  displayName: 'Liberty: Title block',
  description: 'Centred headline and lead. Optional state pill above and up to two buttons below.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Title: str('Title', 10),
    Lead: str('Lead', 20, 'The short direct answer under the headline.'),
    StreamLead: flag('Stream the lead word by word', 30),
    PillState: str('State pill: state', 40, 'e.g. "Texas". Leave empty for no pill.'),
    PillChangeLabel: str('State pill: action text', 50, 'e.g. "Change state".'),
    PillLinkUrl: linkUrl(60, 'State pill URL (text)'),
    PillLink: linkPicker(70, 'State pill link (picker)'),
    PrimaryLabel: str('Primary button label', 80, 'Leave empty for no buttons.'),
    PrimaryLinkUrl: linkUrl(90, 'Primary button URL (text)'),
    PrimaryLink: linkPicker(100, 'Primary button link (picker)'),
    SecondaryLabel: str('Secondary button label', 110),
    SecondaryLinkUrl: linkUrl(120, 'Secondary button URL (text)'),
    SecondaryLink: linkPicker(130, 'Secondary button link (picker)'),
  },
});

/** C04 — centred light heading that introduces a block of content. */
export const LibSectionHeadingContentType = contentType({
  key: 'LibSectionHeading',
  baseType: '_component',
  displayName: 'Liberty: Section heading',
  description: 'Centred heading with optional supporting text.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Title: str('Heading', 10),
    Description: str('Supporting text', 20, 'Optional grey paragraph under the heading.'),
    Level: choice('Heading level', 30, [
      ['h2', 'H2 (default)'],
      ['h3', 'H3'],
    ]),
  },
});

/** C05 — the short yellow rule that sits under headings. */
export const LibAccentBarContentType = contentType({
  key: 'LibAccentBar',
  baseType: '_component',
  displayName: 'Liberty: Accent bar',
  description: 'Short yellow rule.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ...blockSpacing(),
    Align: choice('Alignment', 10, [
      ['left', 'Left (default)'],
      ['center', 'Centred'],
    ]),
  },
});

export const libShellTypes = [
  LibAskBarContentType,
  LibCrumbContentType,
  LibBreadcrumbContentType,
  LibTitleBlockContentType,
  LibSectionHeadingContentType,
  LibAccentBarContentType,
];

/* ---- renderers ---- */

export function LibAskBar({ content }: { content: ContentProps<typeof LibAskBarContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <LibertyBlock content={content} fullBleed defaultSpacing="none">
      <div {...pa('Question')}>
        <AskBar
          question={content.Question ?? ''}
          buttonLabel={content.ButtonLabel || undefined}
          placeholder={content.Placeholder || undefined}
          action={content.ActionUrl || undefined}
        />
      </div>
    </LibertyBlock>
  );
}

export function LibBreadcrumb({ content }: { content: ContentProps<typeof LibBreadcrumbContentType> }) {
  return (
    <LibertyBlock content={content} defaultSpacing="sm">
      <Breadcrumb
        className=""
        rootLabel={content.RootLabel ?? ''}
        rootHref={resolveHref(content.RootLinkUrl, content.RootLink)}
        items={(content.Items ?? [])
          .filter((c) => c?.Label?.trim())
          .map((c) => ({ label: c!.Label!.trim(), href: resolveHref(c!.LinkUrl, c!.Link) }))}
      />
    </LibertyBlock>
  );
}

export function LibTitleBlock({ content }: { content: ContentProps<typeof LibTitleBlockContentType> }) {
  const pill = content.PillState?.trim() ? (
    <StatePill
      state={content.PillState.trim()}
      changeLabel={content.PillChangeLabel ?? ''}
      href={resolveHref(content.PillLinkUrl, content.PillLink)}
    />
  ) : undefined;

  const primary = content.PrimaryLabel?.trim();
  const secondary = content.SecondaryLabel?.trim();
  const actions =
    primary || secondary ? (
      <>
        {primary && <Button href={resolveHref(content.PrimaryLinkUrl, content.PrimaryLink)}>{primary}</Button>}
        {secondary && (
          <Button variant="outline" href={resolveHref(content.SecondaryLinkUrl, content.SecondaryLink)}>
            {secondary}
          </Button>
        )}
      </>
    ) : undefined;

  return (
    <LibertyBlock content={content} defaultSpacing="sm">
      <TitleBlock
        className=""
        title={content.Title ?? ''}
        lead={content.Lead ?? ''}
        streamLead={!!content.StreamLead}
        pill={pill}
        actions={actions}
      />
    </LibertyBlock>
  );
}

export function LibSectionHeading({ content }: { content: ContentProps<typeof LibSectionHeadingContentType> }) {
  return (
    <LibertyBlock content={content} defaultSpacing="lg">
      <SectionHeading
        className=""
        title={content.Title ?? ''}
        description={content.Description ?? ''}
        as={content.Level === 'h3' ? 'h3' : 'h2'}
      />
    </LibertyBlock>
  );
}

export function LibAccentBar({ content }: { content: ContentProps<typeof LibAccentBarContentType> }) {
  return (
    <LibertyBlock content={content} defaultSpacing="sm">
      <AccentBar className={cx(content.Align === 'center' && 'mx-auto')} />
    </LibertyBlock>
  );
}

export const libShellRenderers = {
  LibAskBar,
  LibBreadcrumb,
  LibTitleBlock,
  LibSectionHeading,
  LibAccentBar,
};
