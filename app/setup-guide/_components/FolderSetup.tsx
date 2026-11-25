'use client';

import { useId } from 'react';
import s from '../setup-guide.module.css';
import { DEFAULT_FOLDERS, MAX_FOLDER_NAME, type Folders } from '../_lib/folders';
import { useGuide } from './GuideProvider';
import { Cmds, Example, Only } from './ui';
import { REPO_CLONE_URL } from '../_lib/repo';

/**
 * Step 7's two folder names. The reader types them once; the folder picture, the commands to copy
 * and the example paths in Step 12 all follow what was typed.
 */

const N = { os: 'win', mode: 'native' } as const; // PowerShell (default)

const FIELDS: { which: keyof Folders; label: string; hint: string }[] = [
  { which: 'container', label: 'Container folder', hint: 'Holds the main project and, later, every demo site.' },
  { which: 'main', label: 'Main project folder', hint: 'Holds the project you download now.' },
];

export function FolderInputs() {
  const { typedFolders, setFolder, finishFolder } = useGuide();
  const id = useId();
  return (
    <div className={s.folderForm}>
      {FIELDS.map(({ which, label, hint }) => (
        <label key={which} className={s.field}>
          {label}
          <input
            type="text"
            value={typedFolders[which]}
            placeholder={DEFAULT_FOLDERS[which]}
            maxLength={MAX_FOLDER_NAME}
            onChange={(e) => setFolder(which, e.target.value)}
            onBlur={() => finishFolder(which)}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby={`${id}-${which}`}
          />
          <small id={`${id}-${which}`}>{hint}</small>
        </label>
      ))}
      <small className={s.folderRule}>
        Lower-case letters, numbers and dashes only, like <code>my-demos</code>. Spaces turn into dashes, and anything
        else is left out. Already ran the commands below? Changing a name now won’t rename folders you’ve already made.
      </small>
    </div>
  );
}

/** A folder name typed by the reader, for use inside a sentence. */
export function FolderName({ which }: { which: keyof Folders }) {
  return <>{useGuide().folders[which]}</>;
}

/** The folder layout with the reader's own names. */
export function FolderTree() {
  const { folders } = useGuide();
  const rows: [left: string, note?: string][] = [
    [folders.container, 'holds all your demo work'],
    [`├─ ${folders.main}`, 'the main project’s folder'],
    ['│  └─ opti-baseline-main', 'the project you download now'],
    ['├─ acme', 'later: a folder for each customer demo,'],
    ['│  └─ opti-baseline-acme', '  with that demo’s site inside, created for you'],
    ['└─ …'],
  ];
  const width = Math.max(...rows.map(([left]) => left.length)) + 3;
  return (
    <Example
      label="How your folders will look"
      lines={rows.map(([left, note]) => (note ? `${left.padEnd(width)}← ${note}` : left))}
    />
  );
}

/** The four commands that create the folders and download the project. */
export function CloneCommands() {
  const { container, main } = useGuide().folders;
  const clone = {
    c: `git clone ${REPO_CLONE_URL} opti-baseline-main`,
    what: (
      <>
        Downloads the project into a new folder called <code>opti-baseline-main</code>. It takes under a minute and ends
        with a line like <code>Resolving deltas: 100%… done</code>. No GitHub login is needed.
      </>
    ),
  };
  const open = { c: 'code opti-baseline-main', what: 'Opens the project in a new VS Code window.' };
  const cdWhat =
    'Moves the terminal into that folder, like double-clicking it. It prints nothing, but the prompt now shows the folder name.';
  return (
    <>
      <Only unix>
        <Cmds
          items={[
            {
              c: `mkdir -p ~/${container}/${main}`,
              what: (
                <>
                  Creates both folders (<code>~</code> means your home folder). It prints nothing.
                </>
              ),
            },
            { c: `cd ~/${container}/${main}`, what: cdWhat },
            clone,
            open,
          ]}
        />
      </Only>
      <Only {...N}>
        <Cmds
          items={[
            {
              c: `mkdir -Force $HOME\\${container}\\${main}`,
              what: (
                <>
                  Creates both folders inside your user folder (<code>$HOME</code>, for example{' '}
                  <code>C:\Users\jsmith</code>). It prints a small table with the folder’s name. That’s normal.
                </>
              ),
            },
            { c: `cd $HOME\\${container}\\${main}`, what: cdWhat },
            clone,
            open,
          ]}
        />
      </Only>
    </>
  );
}

/** What the project folder’s full path looks like on this computer (Step 12). */
export function ProjectPath({ kind }: { kind: 'mac' | 'native' | 'wsl' }) {
  const { container, main } = useGuide().folders;
  const line = {
    mac: `/Users/jsmith/${container}/${main}/opti-baseline-main`,
    native: `C:\\Users\\jsmith\\${container}\\${main}\\opti-baseline-main`,
    wsl: `\\\\wsl.localhost\\Ubuntu\\home\\jsmith\\${container}\\${main}\\opti-baseline-main`,
  }[kind];
  return <Example lines={[line]} />;
}
