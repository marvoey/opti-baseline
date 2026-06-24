import { buildConfig } from '@optimizely/cms-sdk';

/**
 * Optimizely CMS CLI config. Push content types with:
 *   npx @optimizely/cms-cli config push optimizely.config.mjs
 *
 * `components` globs the files that export `contentType()` definitions.
 * `propertyGroups` declares custom groups referenced by property `group` keys.
 */
export default buildConfig({
  components: ['./cms/**/*.tsx'],
  // Declare custom property groups here as content types are added.
  // Use a negative sortOrder to float a group above the built-in/system groups
  // (Settings, SEO, Categories, …), which sit at 0–60. None needed for the base.
  propertyGroups: [],
});
