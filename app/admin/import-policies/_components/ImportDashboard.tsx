'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Eye, X, RefreshCw } from 'lucide-react';
import { importPolicyBlock, checkImportStatuses } from '../actions';
import type { PolicyBlock } from '../actions';

type BlockStatus = 'idle' | 'importing' | 'ok' | 'exists' | 'error';

type LogEntry = {
  name: string;
  copyType: string;
  status: 'ok' | 'exists' | 'error';
  detail?: string;
};

const COPY_TYPES = [
  'Core Principle',
  'Jurisdictional Override',
  'Statutory Disclosure',
  'Procedural Safeguard',
] as const;

const LOBS = ['Homeowners', 'Personal Auto', 'Commercial Auto'];

const TOPICS = [
  'Hail/Storm Damage',
  'Water Damage',
  'Roadside Assistance',
  'Glass Claim',
  'Liability',
  'Rideshare Coverage',
];

const CONCURRENCY = 5;

type Props = { blocks: PolicyBlock[]; credentialsAvailable: boolean };

export default function ImportDashboard({ blocks, credentialsAvailable }: Props) {
  const [statuses, setStatuses] = useState<Record<number, BlockStatus>>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [filterLOB, setFilterLOB] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterCopyType, setFilterCopyType] = useState('All');
  const [previewBlock, setPreviewBlock] = useState<PolicyBlock | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const filteredIndices = blocks
    .map((b, i) => ({ b, i }))
    .filter(
      ({ b }) =>
        (filterLOB === 'All' || b.Taxonomy.LOB === filterLOB) &&
        (filterTopic === 'All' || b.Taxonomy.Topic === filterTopic) &&
        (filterCopyType === 'All' || b.CopyType === filterCopyType),
    )
    .map(({ i }) => i);

  const copyTypeCounts = COPY_TYPES.reduce(
    (acc, ct) => {
      acc[ct] = blocks.filter(b => b.CopyType === ct).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const doneCount = filteredIndices.filter(
    i => statuses[i] === 'ok' || statuses[i] === 'exists',
  ).length;

  const errorCount = filteredIndices.filter(i => statuses[i] === 'error').length;
  const importableCount = filteredIndices.filter(
    i => statuses[i] !== 'ok' && statuses[i] !== 'exists',
  ).length;
  const totalFiltered = filteredIndices.length;
  const progress = totalFiltered > 0 ? doneCount / totalFiltered : 0;

  const handleImport = useCallback(async () => {
    if (!credentialsAvailable) return;
    abortRef.current = false;
    setIsImporting(true);
    setLog([]);

    const indices = filteredIndices.filter(
      i => statuses[i] !== 'ok' && statuses[i] !== 'exists',
    );
    let cursor = 0;

    async function worker() {
      while (cursor < indices.length && !abortRef.current) {
        const i = indices[cursor++];
        const block = blocks[i];

        setStatuses(prev => ({ ...prev, [i]: 'importing' }));
        const result = await importPolicyBlock(block);
        const status: BlockStatus =
          result.status === 'no-credentials' ? 'error' : result.status;

        setStatuses(prev => ({ ...prev, [i]: status }));
        setLog(prev => [
          {
            name: block.InternalName,
            copyType: block.CopyType,
            status: status as 'ok' | 'exists' | 'error',
            detail: result.status === 'error' ? result.detail : undefined,
          },
          ...prev,
        ]);
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setIsImporting(false);
  }, [blocks, filteredIndices, statuses, credentialsAvailable]);

  const handleCheck = useCallback(async () => {
    setIsChecking(true);
    setCheckError(null);
    const result = await checkImportStatuses();
    if (!result.ok) {
      setCheckError(result.message);
      setIsChecking(false);
      return;
    }
    // Build lookup: copyType -> Set<InternalName>
    const lookup: Record<string, Set<string>> = {};
    for (const [ct, names] of Object.entries(result.existing)) {
      lookup[ct] = new Set(names);
    }
    setStatuses(
      Object.fromEntries(
        blocks.map((b, i) => [
          i,
          lookup[b.CopyType]?.has(b.InternalName) ? 'exists' : 'idle',
        ]),
      ),
    );
    setIsChecking(false);
  }, [blocks]);

  return (
    <div className="space-y-8">
      {/* Copy type counts */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {COPY_TYPES.map(ct => (
          <button
            key={ct}
            onClick={() => setFilterCopyType(filterCopyType === ct ? 'All' : ct)}
            className={`rounded-2xl border p-5 text-left shadow-sm transition-colors ${
              filterCopyType === ct
                ? 'border-indigo-300 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">{copyTypeCounts[ct]}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{ct}</p>
          </button>
        ))}
      </div>

      {/* Filters + action bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <FilterSelect
            label="Copy Type"
            value={filterCopyType}
            onChange={setFilterCopyType}
            options={['All', ...COPY_TYPES]}
          />
          <FilterSelect
            label="Line of Business"
            value={filterLOB}
            onChange={setFilterLOB}
            options={['All', ...LOBS]}
          />
          <FilterSelect
            label="Topic / Peril"
            value={filterTopic}
            onChange={setFilterTopic}
            options={['All', ...TOPICS]}
          />

          <div className="ml-auto flex items-end gap-3">
            <p className="text-sm text-slate-500">
              {importableCount} of {totalFiltered} to import
            </p>
            <button
              onClick={handleCheck}
              disabled={isChecking || isImporting}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="Query CMS to mark which blocks already exist"
            >
              <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
              Check CMS
            </button>
            {isImporting ? (
              <button
                onClick={() => { abortRef.current = true; }}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={handleImport}
                disabled={!credentialsAvailable || importableCount === 0}
                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Import {importableCount > 0 ? importableCount : ''} blocks
              </button>
            )}
          </div>
        </div>

        {/* Check error */}
        {checkError && (
          <p className="mt-4 text-sm text-red-600">Check CMS failed: {checkError}</p>
        )}

        {/* Progress bar */}
        {(isImporting || doneCount > 0) && (
          <div className="mt-5">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>
                {doneCount} / {totalFiltered} done
              </span>
              <span>
                {filteredIndices.filter(i => statuses[i] === 'ok').length} imported ·{' '}
                {filteredIndices.filter(i => statuses[i] === 'exists').length} existed ·{' '}
                {errorCount} errors
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-200"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Import log */}
      {log.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-700">
              Import Log{' '}
              <span className="ml-1 font-normal text-slate-400">({log.length})</span>
            </h2>
          </div>
          <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
            {log.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-3 px-6 py-3 text-sm">
                <StatusDot status={entry.status} />
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-slate-900">{entry.name}</span>
                  <span className="ml-2 text-xs text-slate-400">{entry.copyType}</span>
                  {entry.detail && (
                    <p className="mt-0.5 truncate text-xs text-red-600">{entry.detail}</p>
                  )}
                </div>
                <StatusBadge status={entry.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entry table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-700">
            {totalFiltered} blocks
            {totalFiltered !== blocks.length && (
              <span className="ml-1 font-normal text-slate-400">
                (filtered from {blocks.length})
              </span>
            )}
          </h2>
          {(filterLOB !== 'All' || filterTopic !== 'All' || filterCopyType !== 'All') && (
            <button
              onClick={() => {
                setFilterLOB('All');
                setFilterTopic('All');
                setFilterCopyType('All');
              }}
              className="text-xs text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Copy Type</th>
                <th className="px-6 py-3">LOB</th>
                <th className="px-6 py-3">Topic</th>
                <th className="px-6 py-3">Jurisdiction</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIndices.slice(0, 100).map(i => {
                const block = blocks[i];
                const status = statuses[i] ?? 'idle';
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="max-w-[240px] truncate px-6 py-3 font-medium text-slate-900">
                      {block.InternalName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-slate-600">
                      {block.CopyType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-slate-600">
                      {block.Taxonomy.LOB}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-slate-600">
                      {block.Taxonomy.Topic}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{block.Taxonomy.Jurisdiction}</td>
                    <td className="px-6 py-3">
                      <RowStatus status={status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setPreviewBlock(block)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Preview content"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredIndices.length > 100 && (
            <p className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
              Showing first 100 of {filteredIndices.length} — use filters to narrow results.
            </p>
          )}
        </div>
      </div>
      {/* Block preview modal */}
      {previewBlock && (
        <BlockPreviewModal block={previewBlock} onClose={() => setPreviewBlock(null)} />
      )}
    </div>
  );
}

function BlockPreviewModal({ block, onClose }: { block: PolicyBlock; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">{block.InternalName}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <Pill>{block.CopyType}</Pill>
              <Pill>{block.Taxonomy.LOB}</Pill>
              <Pill>{block.Taxonomy.Topic}</Pill>
              {block.Taxonomy.Jurisdiction !== 'National' && (
                <Pill>{block.Taxonomy.Jurisdiction}</Pill>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Rich text content */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          <div
            className="prose prose-sm max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: block.RichTextValue }}
          />
        </div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
      {children}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'ok' ? 'bg-green-500' : status === 'exists' ? 'bg-slate-400' : 'bg-red-500';
  return <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

function StatusBadge({ status }: { status: 'ok' | 'exists' | 'error' }) {
  const styles = {
    ok: 'bg-green-50 text-green-700',
    exists: 'bg-slate-100 text-slate-600',
    error: 'bg-red-50 text-red-700',
  };
  const labels = { ok: 'imported', exists: 'exists', error: 'error' };
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function RowStatus({ status }: { status: BlockStatus }) {
  if (status === 'idle') return <span className="text-xs text-slate-300">—</span>;
  const styles: Record<BlockStatus, string> = {
    idle: '',
    importing: 'bg-indigo-50 text-indigo-700',
    ok: 'bg-green-50 text-green-700',
    exists: 'bg-slate-100 text-slate-600',
    error: 'bg-red-50 text-red-700',
  };
  const labels: Record<BlockStatus, string> = {
    idle: '',
    importing: 'importing…',
    ok: 'imported',
    exists: 'exists',
    error: 'error',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
