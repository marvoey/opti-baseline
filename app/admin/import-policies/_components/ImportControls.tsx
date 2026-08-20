'use client';

import { useState } from 'react';
import type { PolicyBlock, FolderInfo } from '../actions';
import type { ContainerEntry } from '../config';
import FolderBrowser from './FolderBrowser';
import TargetContainersEditor from './TargetContainersEditor';
import ImportDashboard from './ImportDashboard';

type Props = {
  blocks: PolicyBlock[];
  credentialsAvailable: boolean;
  config: ContainerEntry[];
  allFolders: FolderInfo[];
};

export default function ImportControls({ blocks, credentialsAvailable, config, allFolders }: Props) {
  const [containerKeys, setContainerKeys] = useState<Record<string, string>>(
    Object.fromEntries(config.map(c => [c.copyType, c.key])),
  );

  function handleChange(copyType: string, key: string) {
    setContainerKeys(prev => ({ ...prev, [copyType]: key }));
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
          <p className="mb-1 text-sm font-medium text-slate-700">CMS site folders</p>
          <p className="mb-3 text-xs text-slate-500">
            Click <strong>Copy key</strong> next to a folder, then paste it into the target container input.
          </p>
          <FolderBrowser folders={allFolders} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
          <p className="mb-4 text-sm font-medium text-slate-700">Target containers</p>
          <TargetContainersEditor
            config={config}
            values={containerKeys}
            onChange={handleChange}
          />
        </div>
      </div>

      <ImportDashboard
        blocks={blocks}
        credentialsAvailable={credentialsAvailable}
        containerOverrides={containerKeys}
      />
    </>
  );
}
