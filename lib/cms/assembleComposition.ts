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

// Every section node must have a section-base content type (BlankSection).
// The actual block is a component node nested inside a row → column.
function wrapInSection(block: TaxonomyBlock): CompositionNode {
  return {
    nodeType: 'section',
    displayName: block.displayName,
    layoutType: 'grid',
    component: { contentType: 'BlankSection' },
    nodes: [{
      nodeType: 'row',
      displayName: block.displayName,
      nodes: [{
        nodeType: 'column',
        displayName: 'Content',
        nodes: [{
          nodeType: 'component',
          displayName: block.displayName,
          component: { contentType: block._type, reference: contentRef(block.key) },
        }],
      }],
    }],
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

  for (const hero of heroes) {
    nodes.push(wrapInSection(hero));
  }

  for (const para of paras) {
    nodes.push(wrapInSection(para));
  }

  // All cards share one section; each card gets its own column in a single row.
  if (cards.length > 0) {
    nodes.push({
      nodeType: 'section',
      displayName: 'Cards',
      layoutType: 'grid',
      component: { contentType: 'BlankSection' },
      nodes: [{
        nodeType: 'row',
        displayName: 'Cards',
        nodes: cards.map(card => ({
          nodeType: 'column',
          displayName: card.displayName,
          nodes: [{
            nodeType: 'component',
            displayName: card.displayName,
            component: { contentType: card._type, reference: contentRef(card.key) },
          }],
        })),
      }],
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
