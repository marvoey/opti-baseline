'use client';

import { useState, useTransition } from 'react';
import { resolveFolderInfo } from '../actions';
import type { FolderInfo } from '../actions';
import type { ContainerEntry } from '../config';

type ResolvedMap = Record<string, FolderInfo | null | 'loading'>;

type Props = {
  config: ContainerEntry[];
  values: Record<string, string>;
  onChange: (copyType: string, key: string) => void;
};

export default function TargetContainersEditor({ config, values, onChange }: Props) {
  const [resolved, setResolved] = useState<ResolvedMap>({});
  const [, startTransition] = useTransition();

  function handleBlur(copyType: string, key: string) {
    const trimmed = key.trim();
    if (!trimmed) return;
    setResolved(r => ({ ...r, [copyType]: 'loading' }));
    startTransition(async () => {
      const info = await resolveFolderInfo(trimmed);
      setResolved(r => ({ ...r, [copyType]: info }));
    });
  }

  return (
    <ul className="space-y-4">
      {config.map(c => {
        const info = resolved[c.copyType];
        return (
          <li key={c.copyType}>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {c.copyType}
            </label>
            <input
              type="text"
              value={values[c.copyType] ?? ''}
              onChange={e => onChange(c.copyType, e.target.value)}
              onBlur={e => handleBlur(c.copyType, e.target.value)}
              placeholder="Paste folder key…"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mt-1 h-4 text-[11px]">
              {info === 'loading' && (
                <span className="text-slate-400">Resolving…</span>
              )}
              {info && info !== 'loading' && (
                <span className="text-green-700">📁 {info.displayName}</span>
              )}
              {info === null && (
                <span className="text-red-500">Not found in CMS</span>
              )}
              {info === undefined && values[c.copyType] && (
                <span className="text-slate-300">Tab out to resolve</span>
              )}
            </div>
          </li>
        );
      })}
      <li className="pt-1 text-[11px] text-slate-400">
        Set <code>FOLDER_*</code> in <code>.env</code> to persist these values.
      </li>
    </ul>
  );
}
