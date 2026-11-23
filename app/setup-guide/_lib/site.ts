/**
 * What a reader types in "You're ready" to get their `yarn site:new:local` commands:
 *   name         the site's display name, e.g. "Acme Corp"          (--name "Acme Corp")
 *   opportunity  the customer or deal, kept as a folder name        (--opp acme)
 *   shortName    optional: replaces the short site name worked out from the name (acme-corp)
 *   prefix       optional: replaces the three-letter prefix worked out from the names (acm)
 * An empty shortName or prefix means "use the one we worked out".
 *
 * Keep in step with validateInputs() in scripts/site-new.mjs:
 *   short name  lower-case letters, digits, hyphens, and not "main"
 *   prefix      2-12 letters/digits starting with a letter; site:new capitalises the first letter, because content
 *               type keys are PascalCase (acm -> AcmHeroBlock, and cms:align needs keys to start with it). The guide
 *               types it in lower case and always uses exactly three letters.
 *   --opp       a plain folder name, different from the folder that holds the main project
 *
 * Pure module: used by the browser, the progress API and the stored progress.
 */
import { finishedFolderName, typedFolderName } from './folders';

export type SiteInput = { name: string; opportunity: string; shortName: string; prefix: string };

export const EMPTY_SITE: SiteInput = { name: '', opportunity: '', shortName: '', prefix: '' };
export const MAX_SITE_NAME = 60;
export const MAX_SHORT_NAME = 40;
export const PREFIX_LENGTH = 3;

/**
 * Letters, numbers, spaces and . , & ' ( ) _ + - are kept. Everything else is dropped: the name goes inside
 * double quotes in a terminal, where a quote, $, backtick, backslash or ! would change the command.
 */
const NOT_ALLOWED = /[^\p{L}\p{N} .,&'’()_+-]/gu;

/** What the name box keeps while the person types. */
export function typedSiteName(raw: string): string {
  return raw
    .replace(NOT_ALLOWED, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .slice(0, MAX_SITE_NAME);
}

/** The finished name: no space at the end. Empty when nothing usable was typed. */
export const finishedSiteName = (typed: string) => typedSiteName(typed).trim();

/** Prefix box: plain letters only, all lower case ("ACM" and "Acm" both become "acm"), at most three. */
export function typedPrefix(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[^A-Za-z]/g, '')
    .slice(0, PREFIX_LENGTH)
    .toLowerCase();
}

/** How the prefix starts the content type keys site:new creates: acm -> Acm (AcmHeroBlock). */
export const typeKeyPrefix = (prefix: string) => prefix.charAt(0).toUpperCase() + prefix.slice(1);

/** Short name box: a folder-style name (lower case, digits, single dashes), at most 40 characters. */
const typedShortName = (raw: string) => typedFolderName(raw).slice(0, MAX_SHORT_NAME);
const finishedShortName = (raw: string) => finishedFolderName(typedShortName(raw));

/** What a box keeps while the person types in it. */
export function typedSiteField(which: keyof SiteInput, raw: string): string {
  if (which === 'name') return typedSiteName(raw);
  if (which === 'prefix') return typedPrefix(raw);
  return which === 'shortName' ? typedShortName(raw) : typedFolderName(raw);
}

/** What a box keeps when the person leaves it. */
export function finishedSiteField(which: keyof SiteInput, raw: string): string {
  if (which === 'name') return finishedSiteName(raw);
  if (which === 'prefix') return typedPrefix(raw);
  return which === 'shortName' ? finishedShortName(raw) : finishedFolderName(raw);
}

/** Cleans every field the way it is cleaned when the person leaves the box. */
export function finishedSite(site: Partial<SiteInput>): SiteInput {
  return {
    name: finishedSiteName(site.name ?? ''),
    opportunity: finishedFolderName(site.opportunity ?? ''),
    shortName: finishedShortName(site.shortName ?? ''),
    prefix: typedPrefix(site.prefix ?? ''),
  };
}

/**
 * Stored or posted site values, checked and filled in: null unless every field is already clean (so the
 * server never stores anything the page would not have produced). Fields missing from older saves count as empty.
 */
export function parseSite(v: unknown): SiteInput | null {
  if (typeof v !== 'object' || v === null) return null;
  const o = v as Record<string, unknown>;
  const fields = ['name', 'opportunity', 'shortName', 'prefix'] as const;
  const site = { ...EMPTY_SITE };
  for (const f of fields) {
    const value = o[f] ?? '';
    if (typeof value !== 'string') return null;
    site[f] = value;
  }
  const clean = finishedSite(site);
  return fields.every((f) => clean[f] === site[f]) ? site : null;
}

export const sameSite = (a: SiteInput | undefined, b: SiteInput | undefined) =>
  (['name', 'opportunity', 'shortName', 'prefix'] as const).every((f) => (a?.[f] ?? '') === (b?.[f] ?? ''));

export const isEmptySite = (s: SiteInput) => sameSite(s, EMPTY_SITE);

// ── Worked-out values ───────────────────────────────────────────────────────

/** Plain a-z and 0-9 words from a name: "Café Münch & Co" -> ["Cafe", "Munch", "Co"]. Apostrophes don't split a word. */
function words(name: string): string[] {
  return name
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .replace(/['’]/g, '')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

/** "Acme Corp" -> "acme-corp". Empty when the name has no letters or numbers a-z. */
export function siteShortName(name: string): string {
  return words(name)
    .join('-')
    .toLowerCase()
    .slice(0, MAX_SHORT_NAME)
    .replace(/-+$/, '');
}

/** Little words and company endings that say nothing about who the customer is. */
const FILLER = new Set(['of', 'and', 'the', 'for', 'de', 'la', 'le', 'van', 'von']);
const ENDINGS = new Set(['inc', 'llc', 'ltd', 'corp', 'corporation', 'co', 'company', 'gmbh', 'ag', 'plc', 'sa', 'bv', 'nv', 'group', 'holdings']);

/**
 * Three letters that stand for a name, or null when it has fewer than three letters to work with.
 *   one word      its first three letters          Microsoft -> mic, Acme -> acm
 *   two words     two from the first, one from the second   Deutsche Telekom -> det
 *   three or more the first letter of the first three        Royal Dutch Shell -> rds, H&R Block -> hrb
 * Filler words (of, and, the) and endings (Inc, Corp, GmbH) are left out first, as long as a word remains.
 */
export function threeLetters(name: string): string | null {
  const all = words(name)
    .map((w) => w.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);
  const noFiller = all.filter((w) => !FILLER.has(w.toLowerCase()));
  const base = noFiller.length ? noFiller : all;
  const noEndings = base.filter((w) => !ENDINGS.has(w.toLowerCase()));
  const ws = noEndings.length ? noEndings : base;

  let letters = '';
  if (ws.length >= 3) letters = ws[0][0] + ws[1][0] + ws[2][0];
  else if (ws.length === 2) letters = ws[0].length >= 2 ? ws[0].slice(0, 2) + ws[1][0] : ws[0][0] + ws[1].slice(0, 2);
  else if (ws.length === 1) letters = ws[0].slice(0, 3);
  return letters.length === PREFIX_LENGTH ? typedPrefix(letters) : null;
}

/** The prefix worked out from the site name, or from the opportunity when the name doesn't give three letters. */
export const sitePrefix = (name: string, opportunity = ''): string | null =>
  threeLetters(name) ?? threeLetters(opportunity);

// ── Putting it together ─────────────────────────────────────────────────────

type SiteErrors = { name?: string; opportunity?: string; shortName?: string; prefix?: string };

export type SiteResult =
  | {
      ok: true;
      name: string;
      opportunity: string;
      shortName: string;
      prefix: string;
      /** What we worked out, shown as the hint in the optional boxes. */
      auto: { shortName: string; prefix: string };
    }
  | { ok: false; errors: SiteErrors; missing: boolean; auto: { shortName: string; prefix: string } };

/**
 * Both required boxes must be filled in. `mainFolder` is the folder that holds the main project (Step 7): the
 * opportunity folder is created next to it, so it cannot have the same name. An override wins over what we
 * worked out, and also covers a name we can't work anything out from (for example one written in Chinese).
 */
export function resolveSite(site: SiteInput, mainFolder: string): SiteResult {
  const { name, opportunity, shortName: ownShort, prefix: ownPrefix } = finishedSite(site);
  const autoShort = siteShortName(name);
  const autoPrefix = name || opportunity ? (sitePrefix(name, opportunity) ?? '') : '';
  const auto = { shortName: autoShort, prefix: autoPrefix };
  const shortName = ownShort || autoShort;
  const prefix = ownPrefix || autoPrefix;

  const errors: SiteErrors = {};
  if (name && !shortName) {
    errors.name = 'This name has no letters or numbers from a–z. Type your own short name and prefix under “Change the short name or prefix”.';
  } else if (shortName === 'main') {
    if (ownShort) errors.shortName = 'Choose a different short name. “main” is the main project.';
    else errors.name = 'Choose a different name. “main” is the main project.';
  }
  if (opportunity && opportunity === mainFolder) {
    errors.opportunity = `That’s the name of your main project folder (${mainFolder}). Use a different name.`;
  }
  if (ownPrefix && ownPrefix.length !== PREFIX_LENGTH) errors.prefix = 'Use exactly three letters.';
  else if (name && opportunity && !prefix) {
    errors.prefix = 'We couldn’t work out three letters from these names. Type three letters of your own.';
  }

  const missing = !name || !opportunity;
  if (missing || Object.keys(errors).length) return { ok: false, errors, missing, auto };
  return { ok: true, name, opportunity, shortName, prefix, auto };
}

/** The command to copy (site:new:local: the site's only address is http://localhost:<port>). `dry` adds --dry: check everything and print the plan, change nothing. */
export function siteCommand(r: Extract<SiteResult, { ok: true }>, dry: boolean): string {
  const base = `yarn site:new:local ${r.shortName} --prefix ${r.prefix} --name "${r.name}" --opp ${r.opportunity}`;
  return dry ? `${base} --dry` : base;
}
