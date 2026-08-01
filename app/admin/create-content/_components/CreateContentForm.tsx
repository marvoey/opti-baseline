'use client';

import { useState, useTransition } from 'react';
import { createCopyItem, type CreateResult } from '../actions';

const CONTENT_TYPES = [
  { label: 'Base Policy',             key: 'PrgvCorePrinciple' },
  { label: 'Jurisdictional Override', key: 'PrgvJurisdictionalOverride' },
  { label: 'Handling Procedure',      key: 'PrgvProceduralSafeguard' },
  { label: 'Statutory Disclosure',    key: 'PrgvStatutoryDisclosure' },
] as const;

const LOB_OPTIONS = ['Homeowners', 'Personal Auto', 'Commercial Auto'];

const TOPIC_OPTIONS = [
  'Hail/Storm Damage',
  'Water Damage',
  'Roadside Assistance',
  'Glass Claim',
  'Liability',
  'Rideshare Coverage',
];

const STATES = [
  'National',
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

const JURISDICTION_TYPES = new Set(['PrgvJurisdictionalOverride', 'PrgvStatutoryDisclosure']);

function textToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .map(block => `<p>${block.trim().replace(/\n/g, '<br />')}</p>`)
    .filter(p => p !== '<p></p>')
    .join('');
}

export function CreateContentForm() {
  const [contentTypeKey, setContentTypeKey] = useState('PrgvCorePrinciple');
  const [internalName, setInternalName] = useState('');
  const [lob, setLob] = useState('');
  const [topic, setTopic] = useState('');
  const [jurisdiction, setJurisdiction] = useState('National');
  const [bodyText, setBodyText] = useState('');
  const [publish, setPublish] = useState(true);
  const [result, setResult] = useState<CreateResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const showJurisdiction = JURISDICTION_TYPES.has(contentTypeKey);
  const selectedType = CONTENT_TYPES.find(t => t.key === contentTypeKey);

  function handleTypeChange(key: string) {
    setContentTypeKey(key);
    setJurisdiction('National');
    setResult(null);
  }

  function handleSubmit() {
    setResult(null);
    startTransition(async () => {
      const res = await createCopyItem({
        contentTypeKey,
        internalName,
        lob,
        topic,
        jurisdiction: showJurisdiction ? jurisdiction : undefined,
        bodyHtml: textToHtml(bodyText),
        publish,
      });
      setResult(res);
      if (res.ok) {
        setInternalName('');
        setLob('');
        setTopic('');
        setJurisdiction('National');
        setBodyText('');
      }
    });
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create Copy Item</h1>
        <p className="mt-2 text-slate-500">
          Author a single policy content item and publish it directly to the CMS.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6">

          {/* Content Type */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Content Type</span>
            <select
              value={contentTypeKey}
              onChange={e => handleTypeChange(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CONTENT_TYPES.map(t => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </label>

          {/* Internal Name */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Internal Name</span>
            <input
              type="text"
              value={internalName}
              onChange={e => setInternalName(e.target.value)}
              placeholder="e.g. HO_HailDamage_National_BasePol_v1"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </label>

          {/* LOB + Topic */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Line of Business</span>
              <select
                value={lob}
                onChange={e => setLob(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select LOB…</option>
                {LOB_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Topic</span>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select topic…</option>
                {TOPIC_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          </div>

          {/* Jurisdiction — only for JO + SD */}
          {showJurisdiction && (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Jurisdiction</span>
              <select
                value={jurisdiction}
                onChange={e => setJurisdiction(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          )}

          {/* Body Content */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Body Content</span>
            <span className="text-xs text-slate-400">
              Plain text — separate paragraphs with a blank line.
            </span>
            <textarea
              value={bodyText}
              onChange={e => setBodyText(e.target.value)}
              rows={8}
              placeholder="Enter policy body text…"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none"
            />
          </label>

          {/* Publish toggle */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={publish}
              onChange={e => setPublish(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Publish immediately</span>
          </label>
        </div>

        {/* Result banner */}
        {result && (
          <div
            className={`mt-6 rounded-2xl px-6 py-4 ${
              result.ok
                ? 'border border-green-200 bg-green-50'
                : 'border border-red-200 bg-red-50'
            }`}
          >
            {result.ok ? (
              <>
                <p className="font-semibold text-green-900">
                  Item created{publish ? ' and published' : ' as draft'}.
                </p>
                <p className="mt-1 font-mono text-sm text-green-700">{result.key}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-red-900">Error</p>
                <p className="mt-1 text-sm text-red-800">{result.message}</p>
              </>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? 'Creating…' : `Create ${selectedType?.label ?? 'Item'}`}
          </button>
        </div>
      </div>
    </main>
  );
}
