// Shared BCP-47 tag generation for seed-locales.mjs and generate-all-locales.mjs.

// Market locales from build-instructions/UPS Build Plan (section 1).
export const MARKET_TAGS = [
  'en-US', 'es-US', 'en-CA', 'fr-CA', 'de-DE', 'de-CH', 'fr-CH',
  'es-MX', 'en-GB', 'ar-SA', 'fr-DZ', 'ar-DZ', 'ar-AE',
];

// ---- tag generation -----------------------------------------------------

/** All two-letter ISO 639-1 language subtags the runtime has display data for. */
export function allLanguages() {
  const names = new Intl.DisplayNames(['en'], { type: 'language' });
  const out = [];
  for (const a of 'abcdefghijklmnopqrstuvwxyz') {
    for (const b of 'abcdefghijklmnopqrstuvwxyz') {
      const code = a + b;
      // `of` echoes the code back when the language is unknown.
      if (names.of(code) !== code) out.push(code);
    }
  }
  return out;
}

/** language -> "language-REGION" using CLDR likely subtags (fr -> fr-FR). */
export function likelyTag(lang) {
  const max = new Intl.Locale(lang).maximize();
  return max.region ? `${max.language}-${max.region}` : lang;
}

export function resolveTags(opts) {
  let raw;
  if (opts.tags) {
    raw = opts.tags;
  } else {
    const langs = allLanguages();
    raw = [];
    if (opts.set === 'markets' || opts.set === 'all') raw.push(...MARKET_TAGS);
    if (opts.set === 'languages' || opts.set === 'all') raw.push(...langs);
    if (opts.set === 'likely' || opts.set === 'all') raw.push(...langs.map(likelyTag));
  }
  const tags = [];
  for (const t of raw) {
    try {
      tags.push(Intl.getCanonicalLocales(t)[0]);
    } catch {
      throw new Error(`Not a valid BCP-47 tag: "${t}"`);
    }
  }
  return [...new Set(tags)];
}

export function displayName(tag) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language', languageDisplay: 'standard' }).of(tag) || tag;
  } catch {
    return tag;
  }
}

