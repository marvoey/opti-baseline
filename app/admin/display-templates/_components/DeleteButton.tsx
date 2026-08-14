'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteDisplayTemplate } from '../[key]/actions';

export default function DeleteButton({ templateKey }: { templateKey: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete display template "${templateKey}"? This cannot be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteDisplayTemplate(templateKey);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={14} />
        {pending ? 'Deleting…' : 'Delete'}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
