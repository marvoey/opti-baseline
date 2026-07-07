import { displayTemplate } from '@optimizely/cms-sdk';

/**
 * "Section Default" display template — a code-managed version of the CMS-authored
 * `DefaultSection` (baseType `_section`).
 *
 * Like `LandingSectionTemplates`, the original targets the `_section` base type,
 * so it applies to *every* section content type — including `V1Section`. This
 * version is scoped to specific content types instead (all `_section` types
 * EXCEPT `V1Section`), so it never lands on `V1Section` or the `_section` base
 * type.
 *
 * A display template targets exactly one thing (nodeType | baseType |
 * contentType), so "these content types" means one template per type, each
 * sharing the identical settings below. Each is an individual named export so
 * `npm run cms:push` (which scans cms/**\/*.tsx for displayTemplate exports)
 * discovers them. Keys use a `…DefaultStyle` suffix to avoid colliding with the
 * content types' existing per-type default templates (e.g. `DemoSectionDefault`).
 */

/** Build a Section Default template bound to a single content type. */
function sectionDefault(key: string, contentType: string) {
  return displayTemplate({
    key,
    displayName: 'Section Default',
    contentType,
    // Non-default: an additional style option, not the content type's default.
    isDefault: false,
    settings: {
      gridWidth: {
        displayName: 'Width',
        editor: 'select',
        sortOrder: 10,
        choices: {
          default: { displayName: 'Default', sortOrder: 10 },
          full: { displayName: 'Full width', sortOrder: 20 },
          wide: { displayName: 'Wide', sortOrder: 30 },
          narrow: { displayName: 'Narrow', sortOrder: 40 },
        },
      },
      vSpacing: {
        displayName: 'Vertical spacing',
        editor: 'select',
        sortOrder: 20,
        choices: {
          default: { displayName: 'Default', sortOrder: 10 },
          small: { displayName: 'Small', sortOrder: 20 },
          large: { displayName: 'Large', sortOrder: 30 },
        },
      },
      sectionColor: {
        displayName: 'Color',
        editor: 'select',
        sortOrder: 30,
        choices: {
          transparent: { displayName: 'Transparent', sortOrder: 5 },
          base_100: { displayName: 'Base 100', sortOrder: 10 },
          base_200: { displayName: 'Base 200', sortOrder: 20 },
          base_300: { displayName: 'Base 300', sortOrder: 30 },
          primary: { displayName: 'Primary', sortOrder: 40 },
          secondary: { displayName: 'Secondary', sortOrder: 50 },
          accent: { displayName: 'Accent', sortOrder: 60 },
          neutral: { displayName: 'Neutral', sortOrder: 70 },
          info: { displayName: 'Info', sortOrder: 80 },
          success: { displayName: 'Success', sortOrder: 90 },
          warning: { displayName: 'Warning', sortOrder: 100 },
          error: { displayName: 'Error', sortOrder: 110 },
        },
      },
    },
  });
}

// One template per targeted content type — every `_section` type EXCEPT V1Section.
export const DemoSectionDefaultStyle = sectionDefault('DemoSectionDefaultStyle', 'DemoSection');
export const BannerDemoServicesGridDefaultStyle = sectionDefault(
  'BannerDemoServicesGridDefaultStyle',
  'BannerDemoServicesGrid',
);
export const BlankSectionDefaultStyle = sectionDefault('BlankSectionDefaultStyle', 'BlankSection');
export const OptiFormsContainerDataDefaultStyle = sectionDefault(
  'OptiFormsContainerDataDefaultStyle',
  'OptiFormsContainerData',
);
export const OptiFormsDIContainerDataDefaultStyle = sectionDefault(
  'OptiFormsDIContainerDataDefaultStyle',
  'OptiFormsDIContainerData',
);
export const SectionHeaderDefaultStyle = sectionDefault('SectionHeaderDefaultStyle', 'SectionHeader');
export const Test001SectionDefaultStyle = sectionDefault(
  'Test001SectionDefaultStyle',
  'Test001Section',
);

/** Convenience bundle for registry registration (not scanned by the CLI). */
export const defaultSectionTemplates = [
  DemoSectionDefaultStyle,
  BannerDemoServicesGridDefaultStyle,
  BlankSectionDefaultStyle,
  OptiFormsContainerDataDefaultStyle,
  OptiFormsDIContainerDataDefaultStyle,
  SectionHeaderDefaultStyle,
  Test001SectionDefaultStyle,
];
