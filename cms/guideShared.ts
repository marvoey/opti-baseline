// Shared styles and options for the setup guide site's blocks (cms/Guide*.tsx).
// Kept as `.ts` (not `.tsx`) so the `./cms/**/*.tsx` push glob does not scan it.
//
// Brand rules applied here (Optimizely Brand Pack): Dark Fir is the only text and stroke colour,
// backgrounds are White / Neutral 3 / LFGreen, no gradients, pill buttons and 32px card corners.

export const SECTION_BACKGROUNDS = [
  { value: 'white', displayName: 'White' },
  { value: 'neutral', displayName: 'Light green (Neutral 3)' },
];

export function sectionBg(value: string | null | undefined): string {
  return value === 'neutral' ? 'bg-neutral-3' : 'bg-white';
}

/** Brand icons copied to public/setup-guide/icons (from the Optimizely icon library). */
export const ICONS = [
  { value: 'developer', displayName: 'Code window' },
  { value: 'time', displayName: 'Clock' },
  { value: 'security', displayName: 'Padlock' },
  { value: 'email', displayName: 'Envelope' },
];

export const iconSrc = (icon: string | null | undefined) =>
  `/setup-guide/icons/${ICONS.some((i) => i.value === icon) ? icon : 'developer'}.svg`;

/** Brand illustrations copied to public/setup-guide (resized only, never redrawn). */
export const ILLUSTRATIONS = [
  { value: 'guide', displayName: 'Book (guide)' },
  { value: 'backpack', displayName: 'Backpack' },
];

export const illustrationSrc = (value: string | null | undefined) =>
  value === 'backpack' ? '/setup-guide/backpack.svg' : '/setup-guide/guide.svg';

export const sectionClass = 'w-full px-6 py-16 md:py-24 text-dark-fir';
export const innerClass = 'mx-auto max-w-6xl';
export const eyebrowClass = 'mb-3 text-sm font-bold';
export const h2Class = 'font-display text-3xl font-extrabold leading-[1.08] md:text-4xl';
export const introClass = 'mt-4 max-w-2xl text-lg leading-relaxed';

const button =
  'inline-flex items-center justify-center rounded-full border-2 border-dark-fir px-6 py-3 font-semibold text-dark-fir transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-good-to-go';
/** Main action on a white or Neutral 3 background. */
export const buttonPrimary = `${button} bg-lfgreen hover:bg-grass`;
/** Second action on a white or Neutral 3 background, or main action on LFGreen. */
export const buttonWhite = `${button} bg-white hover:bg-neutral-2`;
/** Second action on an LFGreen background. */
export const buttonOutline = `${button} bg-transparent hover:bg-white`;
