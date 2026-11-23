/**
 * Every tick box in the guide, in page order. The progress bar counts these.
 *
 * Ids starting with "mac-" or "win-" only count for that computer. Keep ids stable: saved progress
 * (the GuideUser "Progress" field in the CMS) refers to them.
 *
 * Pure module: used by the browser, the progress API and the facilitator view.
 */
export const CHECKS = {
  'basics-read': 'I’ve read the terminal basics',
  'mac-s1-shell': 'I ran echo $0 and clicked my shell (zsh or bash)',
  'win-s1a': 'WSL installed and Windows restarted',
  'win-s1b': 'Ubuntu username and password created (and written down)',
  'mac-s2a': 'VS Code installed and opened from Applications',
  'mac-s2b': 'I saw “Shell command ‘code’ successfully installed”',
  'win-s2a': 'VS Code installed with the WSL extension',
  'win-s2b': 'VS Code shows “WSL: Ubuntu” in the bottom-left corner',
  'mac-s2-shell': 'VS Code’s terminal shows the same shell as the Shell switch',
  'win-s2-shell': 'I ran echo $0 and set the Shell switch at the top to match',
  'mac-s3': 'git --version shows a version number',
  'win-s3': 'git --version shows a version number',
  s4: 'node -v shows v22.x.x',
  s4b: 'node -v still shows v22 in a new terminal',
  s5: 'yarn --version shows 4.14.1',
  s6: 'All five lines look right',
  s7: 'The project is open in VS Code, and the terminal prompt includes opti-baseline-main',
  s8: 'A .env file is saved next to package.json',
  s9: 'yarn install finished with “Done”',
  s10a: 'yarn cms:align showed a list (no 401/403 error)',
  s10b: 'http://localhost:3034 loads in the browser',
  s11: 'Folder attached in Mark Desktop (or skipped)',
} as const;

export type CheckId = keyof typeof CHECKS;
export type Os = 'mac' | 'win';
export type Shell = 'zsh' | 'bash';

export const CHECK_IDS = Object.keys(CHECKS) as CheckId[];

export const isCheckId = (id: unknown): id is CheckId => typeof id === 'string' && id in CHECKS;
export const isOs = (v: unknown): v is Os => v === 'mac' || v === 'win';
export const isShell = (v: unknown): v is Shell => v === 'zsh' || v === 'bash';

/** Whether a tick box counts for this computer. */
export function appliesTo(id: CheckId, os: Os): boolean {
  if (id.startsWith('mac-')) return os === 'mac';
  if (id.startsWith('win-')) return os === 'win';
  return true;
}

/** Step number a tick box belongs to: 0 for "terminal basics", otherwise 1–11. */
export function stepOf(id: CheckId): number {
  const m = /s(\d+)/.exec(id);
  return m ? Number(m[1]) : 0;
}

export function computeProgress(checked: Iterable<string>, os: Os) {
  const done = new Set(checked);
  const relevant = CHECK_IDS.filter((id) => appliesTo(id, os));
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
