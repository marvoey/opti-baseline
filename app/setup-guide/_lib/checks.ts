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
  // Steps 4 to 8 (same for everyone; Step 8 is the last one people do on their own)
  s4: 'node -v shows v22.x.x',
  s4b: 'node -v still shows v22 in a new terminal',
  s5: 'yarn --version shows 4.14.1',
  s6: 'All five lines look right',
  s7: 'The project is open in VS Code, and the terminal prompt includes opti-baseline-main',
  's8-install': 'yarn install finished with “Done”',
  // Steps 9 to 11: together in the live session
  's9-env': 'A .env file is saved next to package.json',
  s10a: 'yarn cms:align showed a list (no 401/403 error)',
  s10b: 'http://localhost:3034 loads in the browser',
  s11: 'Folder attached in Mark Desktop (or skipped)',
} as const;

export type CheckId = keyof typeof CHECKS;

/**
 * The last step people do on their own. Everything after it is done together in the live session.
 * The progress bar, the "Stop here" card and the facilitator view all follow this number.
 */
export const HOMEWORK_LAST_STEP = 8;
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

/** Step number a tick box belongs to: 0 for "terminal basics", otherwise 1–11. */
export function stepOf(id: CheckId): number {
  const m = /(?:^|-)s(\d+)/.exec(id);
  return m ? Number(m[1]) : 0;
}

/** Which part of the guide to count: the prep (Steps 0–8), the live session (Steps 9–11) or everything. */
export type ProgressPart = 'all' | 'prep' | 'session';

const inPart = (id: CheckId, part: ProgressPart) =>
  part === 'all' || (part === 'prep' ? stepOf(id) <= HOMEWORK_LAST_STEP : stepOf(id) > HOMEWORK_LAST_STEP);

export function computeProgress(checked: Iterable<string>, os: Os, winMode: WinMode = 'native', part: ProgressPart = 'all') {
  const done = new Set(checked);
  const relevant = CHECK_IDS.filter((id) => appliesTo(id, os, winMode) && inPart(id, part));
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
