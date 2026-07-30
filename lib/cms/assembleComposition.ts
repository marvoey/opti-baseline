import type { TaxonomyBlock } from './fetchByTaxonomy';
import type { ExperienceSeed, CompositionNode } from './seedExperience';
import { INTENT, PERSONA, GEO, SERVICE } from './taxonomy';

export type AssemblyParams = {
  intent?: string;
  persona?: string;
  service?: string;
  geo?: string;
};

function contentRef(key: string): string {
  return `cms://content/${key}`;
}

// HeroBlockv2 and Paragraph have `sectionEnabled` — place directly as section nodes.
// CardBlock / ActionBlock have only `elementEnabled` — must live inside rows/columns.
function refSection(block: TaxonomyBlock): CompositionNode {
  return {
    nodeType: 'section',
    displayName: block.displayName,
    component: { contentType: block._type, reference: contentRef(block.key) },
  };
}

function refElement(block: TaxonomyBlock): CompositionNode {
  return {
    nodeType: 'component',
    displayName: block.displayName,
    component: { contentType: block._type, reference: contentRef(block.key) },
  };
}

export function assembleComposition(
  blocks: TaxonomyBlock[],
  params: AssemblyParams,
): ExperienceSeed {
  const heroes = blocks.filter(b => b._type === 'HeroBlockv2').slice(0, 1);
  const paras  = blocks.filter(b => b._type === 'Paragraph');
  const cards  = blocks.filter(b => b._type === 'CardBlock');

  const nodes: CompositionNode[] = [];

  // Hero blocks render their own full-width section layout
  for (const hero of heroes) {
    nodes.push(refSection(hero));
  }

  // Paragraph blocks render their own layout (with auto-TOC when headings present)
  for (const para of paras) {
    nodes.push(refSection(para));
  }

  // Cards live inside a FeedSection (one row per card)
  if (cards.length > 0) {
    nodes.push({
      nodeType: 'section',
      displayName: 'Cards',
      layoutType: 'grid',
      component: { contentType: 'FeedSection' },
      nodes: cards.map(card => ({
        nodeType: 'row',
        displayName: card.displayName,
        nodes: [{
          nodeType: 'column',
          displayName: 'Content',
          nodes: [refElement(card)],
        }],
      })),
    });
  }

  const parts: string[] = ['assembled'];
  const labels: string[] = [];
  if (params.intent)  { parts.push(`i${params.intent}`);  labels.push(INTENT[params.intent]?.displayName  ?? params.intent); }
  if (params.persona) { parts.push(`p${params.persona}`); labels.push(PERSONA[params.persona]?.displayName ?? params.persona); }
  if (params.service) { parts.push(`s${params.service}`); labels.push(SERVICE[params.service]?.displayName ?? params.service); }
  if (params.geo)     { parts.push(`g${params.geo}`);     labels.push(GEO[params.geo]?.displayName         ?? params.geo); }

  return {
    displayName: labels.length ? `Assembled: ${labels.join(' · ')}` : 'Assembled Page',
    routeSegment: parts.join('--'),
    locale: 'en',
    composition: {
      nodeType: 'experience',
      layoutType: 'outline',
      nodes,
    },
  };
}
