const ESL_GRADIENTS = [
  'from-blue-950 to-blue-800',
  'from-blue-900 to-[#007078]',
  'from-[#002855] via-blue-800 to-[#007078]',
  'from-blue-950 to-blue-700',
  'from-[#002855] to-blue-600',
  'from-blue-800 to-[#007078]',
  'from-blue-950 via-[#007078] to-blue-800',
  'from-blue-700 to-[#002855]',
] as const;

/** Deterministic gradient from a seed string — same seed always returns the same gradient. */
export function pickGradient(seed: string): string {
  const hash = seed.split('').reduce((n, c) => n + c.charCodeAt(0), 0);
  return ESL_GRADIENTS[hash % ESL_GRADIENTS.length];
}
