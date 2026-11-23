/**
 * The two folder names a reader chooses in Step 7:
 *   container  holds the main project and, later, a folder for every customer demo (~/demo-sites)
 *   main       holds the project that is downloaded in Step 7 (~/demo-sites/opti-baseline-hub)
 *
 * Names are kebab-case: lower-case letters and numbers separated by single dashes.
 * Pure module: used by the browser, the progress API and the stored progress.
 */
export type Folders = { container: string; main: string };

export const DEFAULT_FOLDERS: Folders = { container: 'demo-sites', main: 'opti-baseline-hub' };
export const MAX_FOLDER_NAME = 40;

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const isFolderName = (v: unknown): v is string =>
  typeof v === 'string' && v.length <= MAX_FOLDER_NAME && KEBAB.test(v);

export const isFolders = (v: unknown): v is Folders =>
  typeof v === 'object' && v !== null && isFolderName((v as Folders).container) && isFolderName((v as Folders).main);

export const sameFolders = (a: Folders | undefined, b: Folders | undefined) =>
  a?.container === b?.container && a?.main === b?.main;

/**
 * What the input keeps while the person types: lower case, spaces and underscores become dashes,
 * every other character is dropped, no leading or doubled dashes. A trailing dash stays so that
 * "my-demos" can be typed one letter at a time.
 */
export function typedFolderName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '')
    .slice(0, MAX_FOLDER_NAME);
}

/** The finished name: no trailing dash. Empty when nothing usable was typed. */
export const finishedFolderName = (typed: string) => typedFolderName(typed).replace(/-+$/, '');

/** The names the commands use: what was typed, or the suggested name where nothing usable was typed. */
export function resolveFolders(typed: Folders): Folders {
  return {
    container: finishedFolderName(typed.container) || DEFAULT_FOLDERS.container,
    main: finishedFolderName(typed.main) || DEFAULT_FOLDERS.main,
  };
}

export const isDefaultFolders = (f: Folders) => sameFolders(f, DEFAULT_FOLDERS);
