import localFont from 'next/font/local';

/**
 * Optimizely brand fonts for /demo/fx-guide, extracted from the canvas (where they were
 * embedded as data URIs) into ./fonts. Used through the --font-fxg-* variables in fx-guide.css.
 */

export const headFont = localFont({
  src: [{ path: './fonts/VCNudgeSemiNormal-800.woff', weight: '800', style: 'normal' }],
  variable: '--font-fxg-head',
  display: 'swap',
});

export const bodyFont = localFont({
  src: [
    { path: './fonts/DieGroteskB-400.woff', weight: '400', style: 'normal' },
    { path: './fonts/DieGroteskB-500.woff', weight: '500', style: 'normal' },
    { path: './fonts/DieGroteskB-700.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-fxg-body',
  display: 'swap',
});

export const monoFont = localFont({
  src: [{ path: './fonts/RobotoMono-400.woff', weight: '400', style: 'normal' }],
  variable: '--font-fxg-mono',
  display: 'swap',
});
