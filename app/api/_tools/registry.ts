import { createRegistry } from './_createRegistry';
import { OPAL_PARAMETERS, createOpalHandler } from './_opalHandler';

const { defineTool, getTool, getDiscoveryManifest } = createRegistry();

export { getTool, getDiscoveryManifest };

// ─── Tool definitions ─────────────────────────────────────────────────────────

defineTool({
  name: 'progressive_opal',
  description: 'Sends a structured JSON payload from Opal to the Progressive Consultant Workspace.',
  parameters: OPAL_PARAMETERS,
  handler: createOpalHandler('progressive_opal'),
});
