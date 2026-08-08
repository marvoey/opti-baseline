export const sfaContainerWidthSettings = {
  containerWidth: {
    editor: 'select' as const,
    displayName: 'Container Width',
    sortOrder: 0,
    choices: {
      full:        { displayName: 'Full Width',              sortOrder: 1 },
      wide:        { displayName: 'Wide (max-w-6xl)',        sortOrder: 2 },
      constrained: { displayName: 'Constrained (max-w-3xl)', sortOrder: 3 },
    },
  },
};

export function containerWidthClass(width: string | undefined): string | undefined {
  if (width === 'wide') return 'mx-auto max-w-6xl';
  if (width === 'constrained') return 'mx-auto max-w-3xl';
  return undefined;
}
