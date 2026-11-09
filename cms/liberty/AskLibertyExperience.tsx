import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import AskBar from '@/app/_components_liberty/AskBar';
import AskLibertyHero, { type AskQuestion } from '@/app/_components_liberty/AskLibertyHero';
import StagedReveal from '@/app/_components_liberty/StagedReveal';
import type { ProgressChip } from '@/app/_components_liberty/AiProgressPanel';
import { markReady } from '@/lib/askMark/config';
import { ComponentWrapper } from '../wrappers';
import { resolveHref } from './shared';

/**
 * One question on the Ask Liberty home: the chip text, where it leads, and the
 * "simulated retrieval" shown while the answer is "found". Embedded in
 * `AskLibertyExperience`, never placed on its own.
 */
export const LibAskQuestionContentType = contentType({
  key: 'LibAskQuestion',
  baseType: '_component',
  displayName: 'Liberty Ask Question',
  description: 'A suggested question and the retrieval steps shown while it is answered.',
  properties: {
    Question: {
      type: 'string',
      displayName: 'Question',
      description: 'Shown as a suggested-question chip and echoed in the progress card.',
      isLocalized: true,
      sortOrder: 10,
    },
    LinkUrl: {
      type: 'string',
      displayName: 'Answer page URL (text)',
      description:
        'Where the visitor lands after the animation, e.g. /rental-car. If filled, it is used instead of the picker below. Leave both empty to stay on this page.',
      isLocalized: true,
      sortOrder: 20,
    },
    Link: {
      type: 'link',
      displayName: 'Answer page (picker)',
      description: 'Choose the answer page. Used only when the URL (text) is empty.',
      isLocalized: true,
      sortOrder: 30,
    },
    Keywords: {
      type: 'string',
      displayName: 'Keywords',
      description:
        'Comma-separated words that send a typed question here, e.g. "rent, rental". The first question (top to bottom) with a matching word wins. A typed question that matches nothing goes to the first question.',
      isLocalized: true,
      sortOrder: 40,
    },
    Classification: {
      type: 'array',
      displayName: 'Classification chips',
      description:
        'Shown under "Classify the question". One per line as "Label | Value", e.g. "Product | Auto". Add " | warn" for a yellow chip, e.g. "State | Needed | warn".',
      isLocalized: true,
      sortOrder: 50,
      maxItems: 8,
      items: { type: 'string' },
    },
    RetrievingLabel: {
      type: 'string',
      displayName: 'Retrieving text',
      description: 'Step 3 while it runs. Default: "Retrieving approved Liberty Mutual content".',
      isLocalized: true,
      sortOrder: 60,
    },
    RetrievedLabel: {
      type: 'string',
      displayName: 'Retrieved text',
      description: 'Step 3 when it finishes. Default: "Approved content retrieved".',
      isLocalized: true,
      sortOrder: 70,
    },
    RetrievedItems: {
      type: 'array',
      displayName: 'Retrieved items',
      description: 'Lines listed under "Retrieve approved content".',
      isLocalized: true,
      sortOrder: 80,
      maxItems: 8,
      items: { type: 'string' },
    },
    NeedsDetail: {
      type: 'boolean',
      displayName: 'Needs more detail (warning style)',
      description: 'Finish step 3 with a yellow "!" and flag the last retrieved item.',
      sortOrder: 90,
    },
    HideChip: {
      type: 'boolean',
      displayName: 'Hide as a suggested-question chip',
      description:
        'Questions can still be reached by keywords and by Mark, but are not shown as a chip under the search box.',
      sortOrder: 100,
    },
    IsFallback: {
      type: 'boolean',
      displayName: 'Fallback question',
      description:
        'Where questions land when nothing else matches or Mark is unsure or says out of scope. Mark at most one.',
      sortOrder: 110,
    },
  },
});

/**
 * Ask Liberty (`_experience`). The page's own hero (headline, subtitle, search
 * box, suggested questions) and the "Ask Liberty simulated retrieval" animation
 * are part of the experience itself; everything below is a normal Visual
 * Builder canvas of section-enabled blocks.
 */
export const AskLibertyExperienceContentType = contentType({
  key: 'AskLibertyExperience',
  baseType: '_experience',
  displayName: 'Ask Liberty',
  description:
    'Ask Liberty page: hero with search box and suggested questions, the simulated retrieval animation, and a canvas for answer content.',
  mayContainTypes: ['*'],
  properties: {
    MetaTitle: {
      type: 'string',
      displayName: 'Meta Title',
      description: 'Browser tab / SEO title. Falls back to the page name.',
      isLocalized: true,
      sortOrder: 5,
    },
    MetaDescription: {
      type: 'string',
      displayName: 'Meta Description',
      isLocalized: true,
      sortOrder: 6,
    },
    PageLayout: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Page layout',
      description:
        'Home: hero with search box and suggested questions. Answer: ask bar at the top and the answer builds in. Default: Home.',
      sortOrder: 8,
      enum: [
        { value: 'home', displayName: 'Home (hero)' },
        { value: 'answer', displayName: 'Answer (ask bar)' },
      ],
    },
    AskBarQuestion: {
      type: 'string',
      displayName: 'Answer layout: question',
      description: 'Pre-filled in the ask bar at the top of an answer page.',
      isLocalized: true,
      sortOrder: 9,
    },
    AskPageUrl: {
      type: 'string',
      displayName: 'Answer layout: ask page URL',
      description:
        'Where a new question from the ask bar is sent, as ?q=... The Ask Liberty home page then plays the animation and opens the right answer. Default: /',
      sortOrder: 9,
    },
    Heading: {
      type: 'string',
      displayName: 'Heading',
      isLocalized: true,
      sortOrder: 10,
    },
    Subtitle: {
      type: 'string',
      displayName: 'Subtitle',
      isLocalized: true,
      sortOrder: 20,
    },
    Placeholder: {
      type: 'string',
      displayName: 'Search box placeholder',
      isLocalized: true,
      sortOrder: 30,
    },
    ButtonLabel: {
      type: 'string',
      displayName: 'Ask button label',
      isLocalized: true,
      sortOrder: 40,
    },
    Questions: {
      type: 'array',
      displayName: 'Suggested questions',
      description:
        'One Liberty Ask Question per suggested question. Order matters: it is the chip order and the priority when matching a typed question.',
      isLocalized: true,
      sortOrder: 50,
      maxItems: 12,
      items: { type: 'component', contentType: LibAskQuestionContentType },
    },
    SkipAnimation: {
      type: 'boolean',
      displayName: 'Skip the animation',
      description: 'Go straight to the answer page without the progress card.',
      sortOrder: 60,
    },
    UseMark: {
      type: 'boolean',
      displayName: 'Send questions to Mark',
      description:
        'On: each question is classified by Mark and routed to the matching approved answer. Off: the simulated card and keyword routing. Ignored if the server is not set up for Mark.',
      sortOrder: 70,
    },
    MarkTimeoutSeconds: {
      type: 'integer',
      displayName: 'Mark timeout (seconds)',
      description: 'How long to wait for Mark before using keyword routing. Default 20; allowed 5 to 60.',
      sortOrder: 80,
    },
  },
});

type Props = { content: ContentProps<typeof AskLibertyExperienceContentType> };

/** "Label | Value" or "Label | Value | warn" → a classification chip. */
function parseChip(line: string | null | undefined): ProgressChip | null {
  const [label, value, flag] = (line ?? '').split('|').map((p) => p.trim());
  if (!label || !value) return null;
  return { label, value, warn: flag?.toLowerCase() === 'warn' };
}

const clean = (list: Array<string | null> | null | undefined): string[] =>
  (list ?? []).map((s) => s?.trim() ?? '').filter(Boolean);

export default function AskLibertyExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  // `__context` only exists on content fetched for preview: `preview_token` is
  // set for any CMS preview and `edit` for on-page editing. Either way the ask
  // flow (progress card, navigation) is switched off so editors can work.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = (content as any).__context as { edit?: boolean; preview_token?: string } | undefined;
  const editing = !!(ctx?.edit || ctx?.preview_token);
  const nodes = content.composition?.nodes ?? [];

  const questions: AskQuestion[] = (content.Questions ?? [])
    .filter((q) => q?.Question?.trim())
    .map((q) => ({
      question: q!.Question!.trim(),
      href: resolveHref(q!.LinkUrl, q!.Link) === '#' ? undefined : resolveHref(q!.LinkUrl, q!.Link),
      keywords: (q!.Keywords ?? '').split(',').map((k) => k.trim()).filter(Boolean),
      chips: (q!.Classification ?? []).map(parseChip).filter((c): c is ProgressChip => !!c),
      items: clean(q!.RetrievedItems),
      warn: !!q!.NeedsDetail,
      retrievingLabel: q!.RetrievingLabel?.trim() || undefined,
      retrievedLabel: q!.RetrievedLabel?.trim() || undefined,
      hideChip: !!q!.HideChip,
      isFallback: !!q!.IsFallback,
    }));

  // Mark is used only when the editor ticked the box AND the server has everything
  // it needs (webhook, tool token, CMS store). Never in preview.
  const markEnabled = !editing && !!content.UseMark && markReady();
  const timeoutSeconds = Math.min(60, Math.max(5, Math.round(content.MarkTimeoutSeconds ?? 20)));

  const canvas = nodes.length > 0 && (
    <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />
  );

  // Answer layout: ask bar, then the canvas builds in piece by piece (off in
  // preview and when the animation is skipped).
  if (content.PageLayout === 'answer') {
    const reveal = !editing && !content.SkipAnimation;
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <main {...pa(content as any)} className="bg-white">
        {/* In preview the form is disabled so a submit cannot navigate the editor frame away. */}
        <fieldset disabled={editing} className="contents">
          <div {...pa('AskBarQuestion')}>
            <AskBar
              question={content.AskBarQuestion ?? ''}
              buttonLabel={content.ButtonLabel || undefined}
              placeholder={content.Placeholder || undefined}
              action={content.AskPageUrl?.trim() || '/'}
            />
          </div>
        </fieldset>
        {reveal ? <StagedReveal>{canvas}</StagedReveal> : canvas}
      </main>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)} className="bg-white">
      <AskLibertyHero
        title={content.Heading || undefined}
        subtitle={content.Subtitle || undefined}
        placeholder={content.Placeholder || undefined}
        buttonLabel={content.ButtonLabel || undefined}
        questions={questions}
        skipAnimation={!!content.SkipAnimation}
        editing={editing}
        markEnabled={markEnabled}
        markTimeoutMs={timeoutSeconds * 1000}
        editAttrs={{ title: pa('Heading'), subtitle: pa('Subtitle') }}
      />
      {canvas}
    </main>
  );
}
