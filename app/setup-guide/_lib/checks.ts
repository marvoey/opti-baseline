/**
 * Every tick box in the guide, in page order. The progress bar counts these.
 *
 * Id prefixes decide who sees a box:
 *   mac-     macOS only
 *   native-  Windows with PowerShell (the default)
 *   wsl-     Windows with WSL (the advanced option)
 *   (none)   everyone
 * Keep ids stable: saved progress (the GuideUser "Progress" field in the CMS) refers to them.
 *
 * Pure module: used by the browser, the progress API and the facilitator view.
 */
export const CHECKS = {
  'basics-read': 'I’ve read the terminal basics',
  // macOS
  'mac-s1-shell': 'I ran echo $0 and clicked my shell (zsh or bash)',
  // Windows, PowerShell (default)
  'native-s1a': 'winget --version showed a version number',
  'native-s1b': 'PowerShell now allows scripts (the setting shows RemoteSigned)',
  // Windows, WSL (advanced)
  'wsl-s1a': 'WSL installed and Windows restarted',
  'wsl-s1b': 'Ubuntu username and password created (and written down)',
  // Step 2
  'mac-s2a': 'VS Code installed and opened from Applications',
  'mac-s2b': 'I saw “Shell command ‘code’ successfully installed”',
  'native-s2a': 'VS Code, Git and Node.js are installed (all three commands finished)',
  'native-s2b': 'VS Code is open and its terminal shows a prompt starting with PS',
  'wsl-s2a': 'VS Code installed with the WSL extension',
  'wsl-s2b': 'VS Code shows “WSL: Ubuntu” in the bottom-left corner',
  'mac-s2-shell': 'VS Code’s terminal shows the same shell as the Shell switch',
  'wsl-s2-shell': 'I ran echo $0 and set the Shell switch at the top to match',
  // Step 3
  'mac-s3': 'git --version shows a version number',
  'native-s3': 'git --version shows a version number',
  'wsl-s3': 'git --version shows a version number',
  // Steps 4 to 8 (same for everyone)
  s4: 'node -v shows v22.x.x',
  s4b: 'node -v still shows v22 in a new terminal',
  s5: 'yarn --version shows 4.14.1',
  s6: 'All five lines look right',
  s7: 'The project is open in VS Code, and the terminal prompt includes opti-baseline-main',
  's8-install': 'yarn install finished with “Done”',
  // Steps 9 to 12: connect the project to the CMS and run it
  's9-env': 'A .env file is saved next to package.json',
  's10-single': 'My Single key is in .env (OPTIMIZELY_GRAPH_SINGLE_KEY)',
  's10-client': 'My Client ID and Secret are in .env, and it is saved',
  s11a: 'yarn cms:align connected: only Page and RichTextBlock are MISSING (no 401/403 error)',
  's11-push': 'yarn cms:push added them, and yarn cms:align now says passed',
  s11b: 'http://localhost:3034 loads in the browser',
  's12-install': 'Mark Desktop is installed and opens',
  's12-instance': 'I’m logged in, and my CMS instance is selected at the top right of Mark',
  s12: 'My project folder is added under Workspaces in Mark Desktop',
} as const;

export type CheckId = keyof typeof CHECKS;

export type Os = 'mac' | 'win';
export type Shell = 'zsh' | 'bash';
/** Windows only: PowerShell (default) or WSL (advanced). */
export type WinMode = 'native' | 'wsl';

export const CHECK_IDS = Object.keys(CHECKS) as CheckId[];

export const isCheckId = (id: unknown): id is CheckId => typeof id === 'string' && id in CHECKS;
export const isOs = (v: unknown): v is Os => v === 'mac' || v === 'win';
export const isShell = (v: unknown): v is Shell => v === 'zsh' || v === 'bash';
export const isWinMode = (v: unknown): v is WinMode => v === 'native' || v === 'wsl';

/** Whether a tick box counts for this computer (and, on Windows, this terminal). */
export function appliesTo(id: CheckId, os: Os, winMode: WinMode = 'native'): boolean {
  if (id.startsWith('mac-')) return os === 'mac';
  if (id.startsWith('native-')) return os === 'win' && winMode === 'native';
  if (id.startsWith('wsl-')) return os === 'win' && winMode === 'wsl';
  return true;
}

/** Step number a tick box belongs to: 0 for "terminal basics", otherwise 1–12. */
export function stepOf(id: CheckId): number {
  const m = /(?:^|-)s(\d+)/.exec(id);
  return m ? Number(m[1]) : 0;
}

export function computeProgress(checked: Iterable<string>, os: Os, winMode: WinMode = 'native') {
  const done = new Set(checked);
  const relevant = CHECK_IDS.filter((id) => appliesTo(id, os, winMode));
  const ticked = relevant.filter((id) => done.has(id));
  const next = relevant.find((id) => !done.has(id));
  return {
    percent: relevant.length ? Math.round((ticked.length / relevant.length) * 100) : 0,
    done: ticked.length,
    total: relevant.length,
    /** First step with an unticked box; null when everything is done. */
    currentStep: next === undefined ? null : stepOf(next),
  };
}

/** Tick box ids from older versions of the guide, and the id each one is now called. */
const LEGACY_WSL_IDS: Record<string, CheckId> = {
  'win-s1a': 'wsl-s1a',
  'win-s1b': 'wsl-s1b',
  'win-s2a': 'wsl-s2a',
  'win-s2b': 'wsl-s2b',
  'win-s2-shell': 'wsl-s2-shell',
  'win-s3': 'wsl-s3',
  // Steps 8 and 9 swapped places: "Add your .env file" is now Step 9, "Install packages" is Step 8.
  // Safe to apply on every read because the new ids are not keys here.
  s8: 's9-env',
  s9: 's8-install',
  // "Get your API keys" became Step 10: "Check it works" (was 10) is now Step 11, "Mark Desktop" (was 11) is Step 12.
  s10a: 's11a',
  s10b: 's11b',
  s11: 's12',
};

type SavedProgress = { checks: string[]; os?: Os; shell?: Shell; winMode?: WinMode; updatedAt?: string };

/**
 * Brings progress saved by an older version of the guide up to date. A Windows reader who had
 * already ticked anything beyond the terminal basics was following the WSL steps (the only Windows
 * route back then), so they stay on WSL instead of being moved to steps they never did.
 */
export function normalizeProgress<T extends SavedProgress>(p: T): T {
  const checks = [...new Set(p.checks.map((id) => LEGACY_WSL_IDS[id] ?? id))];
  const wasWsl = p.os === 'win' && p.winMode === undefined && checks.some((id) => id !== 'basics-read');
  return { ...p, checks, winMode: p.winMode ?? (wasWsl ? 'wsl' : undefined) };
}
