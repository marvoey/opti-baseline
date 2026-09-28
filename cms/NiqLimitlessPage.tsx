import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import ActionBlock, { ActionBlockContentType } from './ActionBlock';
import { expandReferences, previewContextOf } from './expandRefs';
import HeroBlock, { HeroBlockContentType } from './HeroBlock';
import ProofBlock, { ProofBlockContentType } from './ProofBlock';

/**
 * NIQLimitlessPage — a dynamically generated page with three fixed slots
 * (Hero/Proof/Action), each a reference to a separately published instance of
 * the matching block type. Created directly in the CMS; this definition
 * mirrors its live schema. A contentReference only delivers `{ key, url }`
 * from Graph, so the referenced item's properties are fetched via
 * expandReferences (see expandRefs.ts) before rendering.
 */
export const NiqLimitlessPageContentType = contentType({
  key: 'NIQLimitlessPage',
  baseType: '_page',
  displayName: 'NIQ Limitless Page',
  description: 'This is a dynamically generated page.',
  mayContainTypes: ['*'],
  properties: {
    HeroSlot: {
      type: 'contentReference',
      displayName: 'Hero Slot',
      allowedTypes: ['HeroBlock'],
    },
    ProofSlot: {
      type: 'contentReference',
      displayName: 'Proof Slot',
      allowedTypes: ['ProofBlock'],
    },
    ActionSlot: {
      type: 'contentReference',
      displayName: 'Action Slot',
      allowedTypes: ['ActionBlock'],
    },
  },
});

type Props = { content: ContentProps<typeof NiqLimitlessPageContentType> };

export default async function NiqLimitlessPage({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const ctx = previewContextOf(content);

  const [[hero], [proof], [action]] = await Promise.all([
    expandReferences<ContentProps<typeof HeroBlockContentType>>(
      content.HeroSlot ? [content.HeroSlot] : [],
      ctx,
    ),
    expandReferences<ContentProps<typeof ProofBlockContentType>>(
      content.ProofSlot ? [content.ProofSlot] : [],
      ctx,
    ),
    expandReferences<ContentProps<typeof ActionBlockContentType>>(
      content.ActionSlot ? [content.ActionSlot] : [],
      ctx,
    ),
  ]);

  return (
    <main className="w-full">
      {hero && (
        <div {...pa('HeroSlot')}>
          <HeroBlock content={hero} />
        </div>
      )}
      {proof && (
        <div {...pa('ProofSlot')}>
          <ProofBlock content={proof} />
        </div>
      )}
      {action && (
        <div {...pa('ActionSlot')}>
          <ActionBlock content={action} />
        </div>
      )}
    </main>
  );
}
