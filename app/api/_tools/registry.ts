import { createRegistry } from './_createRegistry';
import { OPAL_PARAMETERS, createOpalHandler } from './_opalHandler';

const { defineTool, getTool, getDiscoveryManifest } = createRegistry();

export { getTool, getDiscoveryManifest };

// ─── Tool definitions ─────────────────────────────────────────────────────────

defineTool({
  name: 'liberty_ask',
  description:
    'Returns the classification of a Liberty Mutual customer question to the Ask Liberty website. ' +
    'Call exactly once per question, passing the correlationId you received with the question. ' +
    'Return only the classification fields. Never answer the question.',
  parameters: OPAL_PARAMETERS,
  handler: createOpalHandler('liberty_ask'),
});
