import { displayTemplate } from "@optimizely/cms-sdk";

/**
 * "Landing Section" display template — a code-managed version of the CMS-authored
 * `OT_LandingSection` (baseType `_section`, exported to
 * downloads/OT_LandingSection.displaytemplate.json).
 *
 * The original targets the `_section` base type, so it applies to *every* section
 * content type — including `V1Section`. We don't want that: this version is
 * scoped to specific content types instead (all `_section` types EXCEPT
 * `V1Section`), so it never lands on `V1Section` or the `_section` base type.
 *
 * A display template targets exactly one thing (nodeType | baseType |
 * contentType), so "these content types" means one template per type, each
 * sharing the identical settings below. Each is an individual named export so
 * `npm run cms:push` (which scans cms/**\/*.tsx for displayTemplate exports)
 * discovers them.
 */

/** Build a Landing Section template bound to a single content type. */
function landingSection(key: string, contentType: string) {
  return displayTemplate({
    key,
    displayName: "Landing Section",
    contentType,
    // Non-default: an additional style option, not the content type's default.
    isDefault: false,
    settings: {
      gridWidth: {
        displayName: "Content width",
        editor: "select",
        sortOrder: 10,
        choices: {
          full: { displayName: "Full bleed", sortOrder: 10 },
          default: { displayName: "Default", sortOrder: 20 },
          wide: { displayName: "Wide (max-7xl)", sortOrder: 30 },
          narrow: { displayName: "Narrow (max-4xl)", sortOrder: 40 },
        },
      },
      verticalSpacing: {
        displayName: "Vertical spacing",
        editor: "select",
        sortOrder: 20,
        choices: {
          none: { displayName: "None", sortOrder: 10 },
          small: { displayName: "Small", sortOrder: 20 },
          medium: { displayName: "Medium", sortOrder: 30 },
          large: { displayName: "Large", sortOrder: 40 },
          xl: { displayName: "XL", sortOrder: 50 },
        },
      },
      backgroundColor: {
        displayName: "Background color",
        editor: "select",
        sortOrder: 30,
        choices: {
          none: { displayName: "None", sortOrder: 10 },
          canvas: { displayName: "Canvas", sortOrder: 20 },
          surface: { displayName: "Surface", sortOrder: 30 },
          brand: { displayName: "Brand", sortOrder: 40 },
          brandDeep: { displayName: "Brand deep", sortOrder: 50 },
          glass: { displayName: "Glass (frosted)", sortOrder: 60 },
        },
      },
      sectionOverlap: {
        displayName: "Pull up into section above",
        editor: "select",
        sortOrder: 35,
        choices: {
          none: { displayName: "None (flush)", sortOrder: 10 },
          shallow: { displayName: "Shallow (16px)", sortOrder: 20 },
          mid: { displayName: "Mid (32px)", sortOrder: 30 },
          deep: { displayName: "Deep (64px)", sortOrder: 40 },
          full: { displayName: "Full (128px)", sortOrder: 50 },
        },
      },
      entranceAnimation: {
        displayName: "Entrance animation",
        editor: "select",
        sortOrder: 40,
        choices: {
          none: { displayName: "None (Default)", sortOrder: 10 },
          fade: { displayName: "Fade in", sortOrder: 20 },
          slide: { displayName: "Slide up", sortOrder: 30 },
          parallax: { displayName: "Parallax", sortOrder: 40 },
        },
      },
    },
  });
}

// One template per targeted content type — every `_section` type EXCEPT V1Section.
export const DemoSectionLanding = landingSection(
  "DemoSectionLanding",
  "DemoSection",
);
export const BannerDemoServicesGridLanding = landingSection(
  "BannerDemoServicesGridLanding",
  "BannerDemoServicesGrid",
);
export const BlankSectionLanding = landingSection(
  "BlankSectionLanding",
  "BlankSection",
);
export const OptiFormsContainerDataLanding = landingSection(
  "OptiFormsContainerDataLanding",
  "OptiFormsContainerData",
);
export const OptiFormsDIContainerDataLanding = landingSection(
  "OptiFormsDIContainerDataLanding",
  "OptiFormsDIContainerData",
);
export const SectionHeaderLanding = landingSection(
  "SectionHeaderLanding",
  "SectionHeader",
);
export const Test001SectionLanding = landingSection(
  "Test001SectionLanding",
  "Test001Section",
);

/** Convenience bundle for registry registration (not scanned by the CLI). */
export const landingSectionTemplates = [
  DemoSectionLanding,
  BannerDemoServicesGridLanding,
  BlankSectionLanding,
  OptiFormsContainerDataLanding,
  OptiFormsDIContainerDataLanding,
  SectionHeaderLanding,
  Test001SectionLanding,
];
