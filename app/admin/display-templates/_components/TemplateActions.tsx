'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, Download, Loader2, Trash2, X } from 'lucide-react';
import {
  deleteDisplayTemplateAction,
  exportDisplayTemplateAction,
} from '../actions';

type Props = {
  templateKey: string;
  displayName: string;
  /** Whether this template is also defined in this codebase (recoverable). */
  registered: boolean;
};

/**
 * Delete control for a single display template. Opens a confirmation dialog that
 * warns — prominently, when the template is NOT in code — that deletion is
 * permanent and unrecoverable, and offers a JSON download so it can be
 * re-imported later.
 */
export default function TemplateActions({ templateKey, displayName, registered }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [pending, startTransition] = useTransition();

  function openDialog() {
    setError(null);
    setOpen(true);
  }

  async function handleDownload() {
    setError(null);
    setDownloading(true);
    try {
      const res = await exportDisplayTemplateAction(templateKey);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      const blob = new Blob([res.json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteDisplayTemplateAction(templateKey);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      // The list is revalidated server-side; the card unmounts on refresh.
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        aria-label={`Delete ${displayName}`}
      >
        <Trash2 size={14} />
        Delete
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Delete display template?</h2>
              <button
                type="button"
                onClick={() => !pending && setOpen(false)}
                className="text-slate-400 transition-colors hover:text-slate-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium text-slate-900">{displayName}</span>{' '}
              <code className="font-mono text-xs text-slate-500">{templateKey}</code>
            </p>

            {registered ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                This template is also defined in this codebase, so it can be re-created by
                running <code className="font-mono text-xs">npm run cms:push</code>. Deleting
                removes it from the CMS only.
              </div>
            ) : (
              <div className="mt-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="font-medium">This template exists only in the CMS.</p>
                  <p className="mt-1">
                    It is not defined in this codebase, so deleting it is{' '}
                    <span className="font-medium">permanent and cannot be recovered</span>.
                    Download a copy first if you might need to re-import it later.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading || pending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                Download JSON
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {pending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
