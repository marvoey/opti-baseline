export const sfaContainerWidthSettings = {
  containerWidth: {
    editor: 'select' as const,
    displayName: 'Container Width',
    sortOrder: 0,
    choices: {
      full:        { displayName: 'Full Width',              sortOrder: 1 },
      constrained: { displayName: 'Constrained (max-w-3xl)', sortOrder: 2 },
    },
  },
};
