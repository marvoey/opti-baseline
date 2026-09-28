'use client';

import { useState } from 'react';

export default function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      title="Copy to clipboard"
      className="group flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{id}</code>
      <span className="text-xs text-slate-400 dark:text-slate-500">
        {copied ? '✓' : '⎘'}
      </span>
    </button>
  );
}
