import { contentType, type ContentProps, getClient } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { CardBlockContentType } from './CardBlock';
import { ActionBlockContentType } from './ActionBlock';
import { ParagraphContentType } from './Paragraph';
import { HeroBlockContentType } from './HeroBlock';

export const SharedCardContentType = contentType({
  key: 'SharedCard',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  displayName: '[CIBC] Shared Content',
  description: 'Allows use of shared content',
  properties: {
    Cards: {
      type: 'contentReference',
      displayName: 'Cards',
      allowedTypes: [CardBlockContentType, ActionBlockContentType, ParagraphContentType, HeroBlockContentType],
    },
  },
});

const CARD_BLOCK_QUERY = `
  query GetCardBlock($key: String!) {
    CardBlock(where: { _metadata: { key: { eq: $key } } }, limit: 1) {
      items {
        __typename
        _metadata { key displayName }
        Title Body { json } Link { default }
        Intent Persona Service Geo
      }
    }
  }
`;

const ACTION_BLOCK_QUERY = `
  query GetActionBlock($key: String!) {
    ActionBlock(where: { _metadata: { key: { eq: $key } } }, limit: 1) {
      items {
        __typename
        _metadata { key displayName }
        Label Href { default } Variant Intent Persona Service Geo
      }
    }
  }
`;

const PARAGRAPH_QUERY = `
  query GetParagraph($key: String!) {
    Paragraph(where: { _metadata: { key: { eq: $key } } }, limit: 1) {
      items {
        __typename
        _metadata { key displayName }
        Text { json }
      }
    }
  }
`;

const HERO_BLOCK_QUERY = `
  query GetHeroBlockv2($key: String!) {
    HeroBlockv2(where: { _metadata: { key: { eq: $key } } }, limit: 1) {
      items {
        __typename
        _metadata { key displayName }
        BackgroundImage { key url { default } }
        AltText Body { json }
        Intent Persona Service Geo
      }
    }
  }
`;

type Props = {
  content: ContentProps<typeof SharedCardContentType>;
};

export default async function SharedCard({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const refKey = content.Cards?.key;

  if (!refKey) return null;

  const client = getClient();
  const previewToken = content.__context?.preview_token;
  const vars = { key: refKey };

  const tryRequest = async (query: string, typeName: string) => {
    try {
      return await client.request(query, vars, previewToken);
    } catch (e) {
      console.error(`[SharedCard] ${typeName} query error:`, e);
      return null;
    }
  };

  const [cardData, actionData, paragraphData, heroData] = await Promise.all([
    tryRequest(CARD_BLOCK_QUERY, 'CardBlock'),
    tryRequest(ACTION_BLOCK_QUERY, 'ActionBlock'),
    tryRequest(PARAGRAPH_QUERY, 'Paragraph'),
    tryRequest(HERO_BLOCK_QUERY, 'HeroBlockv2'),
  ]);

  const resolved =
    cardData?.CardBlock?.items?.[0] ??
    actionData?.ActionBlock?.items?.[0] ??
    paragraphData?.Paragraph?.items?.[0] ??
    heroData?.HeroBlockv2?.items?.[0] ??
    null;

  if (!resolved) return null;

  return (
    <div {...pa(content.__composition)}>
      <OptimizelyComponent content={resolved as any} />
    </div>
  );
}
