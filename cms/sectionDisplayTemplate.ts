// Kept as .ts (not .tsx) so the ./cms/**/*.tsx push glob does not scan it.
import { displayTemplate, type ContentProps } from '@optimizely/cms-sdk';

export const sectionSettings = {
  background: {
    editor: 'select' as const,
    displayName: 'Background',
    sortOrder: 0,
    choices: {
      white: { displayName: 'White', sortOrder: 0 },
      muted: { displayName: 'Muted', sortOrder: 1 },
      dark:  { displayName: 'Dark',  sortOrder: 2 },
    },
  },
  padding: {
    editor: 'select' as const,
    displayName: 'Padding',
    sortOrder: 1,
    choices: {
      sm: { displayName: 'Small',  sortOrder: 0 },
      md: { displayName: 'Medium', sortOrder: 1 },
      lg: { displayName: 'Large',  sortOrder: 2 },
    },
  },
  width: {
    editor: 'select' as const,
    displayName: 'Width',
    sortOrder: 2,
    choices: {
      full:      { displayName: 'Full',      sortOrder: 0 },
      contained: { displayName: 'Contained', sortOrder: 1 },
    },
  },
};

export const SectionDisplayTemplate = displayTemplate({
  key: 'SectionDefault',
  isDefault: true,
  displayName: 'Section',
  baseType: '_section',
  settings: sectionSettings,
});

export type SectionDisplaySettings = ContentProps<typeof SectionDisplayTemplate>;

export const sectionBgClass: Record<string, string> = {
  white: 'bg-white',
  muted: 'bg-gray-100',
  dark:  'bg-gray-900 text-white',
};

export const sectionPaddingClass: Record<string, string> = {
  sm: 'py-6',
  md: 'py-12',
  lg: 'py-20',
};

export const sectionInnerClass: Record<string, string> = {
  full:      'w-full',
  contained: 'max-w-6xl mx-auto',
};
