import { displayTemplate } from '@optimizely/cms-sdk';

export const ColumnDisplayTemplate = displayTemplate({
  key: 'ColumnDefault',
  isDefault: true,
  displayName: 'Column',
  nodeType: 'column',
  settings: {
    position: {
      editor: 'select',
      displayName: 'Positioning',
      sortOrder: 0,
      choices: {
        default:  { displayName: 'Default',  sortOrder: 1 },
        relative: { displayName: 'Relative', sortOrder: 2 },
      },
    },
  },
});
