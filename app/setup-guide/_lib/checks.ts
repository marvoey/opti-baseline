/**
 * Every tick box in the guide, in page order. The progress bar counts these.
 *
 * Ids starting with "mac-" or "win-" only count for that computer. Keep the ids stable:
 * they are the localStorage keys ("ob-<id>") that remember a reader's ticks.
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
