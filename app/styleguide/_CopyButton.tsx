'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Copy-to-clipboard button for a code block. The only interactive (client) part
 * of the otherwise fully-static code UI. `preventDefault`/`stopPropagation` keep
 * a click from toggling a parent <details> when the button lives in a <summary>.
 */
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
