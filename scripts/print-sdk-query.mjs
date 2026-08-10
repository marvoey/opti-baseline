// Prints the exact GraphQL query the SDK generates for BlankExperience
// Run: node scripts/print-sdk-query.mjs

import { createMultipleContentQuery, createFragment } from '../node_modules/@optimizely/cms-sdk/dist/esm/graph/createQuery.js';
import { init as initContentTypeRegistry } from '../node_modules/@optimizely/cms-sdk/dist/esm/model/contentTypeRegistry.js';
import { BlankExperienceContentType, BlankSectionContentType } from '../node_modules/@optimizely/cms-sdk/dist/esm/model/internalContentTypes.js';

// Mirror the registry.ts setup (SFA types commented out, same as production)
const registeredContentTypes = [
  BlankExperienceContentType,
  BlankSectionContentType,
  { key: 'ExperiencePage', baseType: '_experience', displayName: 'Experience Page', properties: {} },
  { key: 'Page', baseType: '_page', displayName: 'Page', properties: {
    MetaTitle: { type: 'string', isLocalized: true, sortOrder: 5 },
    Content: { type: 'array', isLocalized: true, items: { type: 'content', allowedTypes: [], restrictedTypes: [] } },
  }},
  { key: 'RichTextBlock', baseType: '_component', displayName: 'Rich Text',
    compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
    properties: {
      BlockWidth: { type: 'string', isLocalized: true, sortOrder: 5 },
      Body: { type: 'richText', isLocalized: true, sortOrder: 10 },
      BackgroundColor: { type: 'string', sortOrder: 15 },
    }
  },
];

initContentTypeRegistry(registeredContentTypes);

// Test with damEnabled = true (since this CMS has DAM)
for (const typeName of ['BlankExperience', 'ExperiencePage', 'Page']) {
  const query = createMultipleContentQuery(typeName, true);
  console.log(`\n=== SDK Query for ${typeName} (damEnabled=true) ===\n`);
  console.log(query);
}
