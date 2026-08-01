'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateCopyItem, type UpdateResult, type EditableItem } from '../actions';

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

function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function textToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .map(block => `<p>${block.trim().replace(/\n/g, '<br />')}</p>`)
    .filter(p => p !== '<p></p>')
    .join('');
}

type Props = { item: EditableItem };

export default function EditContentForm({ item }: Props) {
  const router = useRouter();
  const [internalName, setInternalName] = useState(item.internalName);
  const [lob,          setLob]          = useState(item.lob);
  const [topic,        setTopic]        = useState(item.topic);
  const [jurisdiction, setJurisdiction] = useState(item.jurisdiction ?? 'National');
  const [bodyText,     setBodyText]     = useState(htmlToText(item.bodyHtml));
  const [result,       setResult]       = useState<UpdateResult | null>(null);
  const [isPending,    startTransition] = useTransition();

  const showJurisdiction = JURISDICTION_TYPES.has(item.contentTypeKey);

  function handleSubmit() {
    setResult(null);
    startTransition(async () => {
      const res = await updateCopyItem(item.cmsKey, {
        contentTypeKey: item.contentTypeKey,
        internalName,
        lob,
        topic,
        jurisdiction: showJurisdiction ? jurisdiction : undefined,
        bodyHtml: textToHtml(bodyText),
      });
      setResult(res);
    });
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-400 hover:text-slate-700"
          >
            ← Back
          </button>
          <span className="text-slate-200">|</span>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {item.copyType}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mt-2">
          Edit Copy Item
        </h1>
        <p className="mt-1 font-mono text-xs text-slate-400">{item.cmsKey}</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6">

          {/* Internal Name */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Internal Name</span>
            <input
              type="text"
              value={internalName}
              onChange={e => setInternalName(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
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

          {/* Jurisdiction */}
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

          {/* Body */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Body Content</span>
            <span className="text-xs text-slate-400">Separate paragraphs with a blank line.</span>
            <textarea
              value={bodyText}
              onChange={e => setBodyText(e.target.value)}
              rows={10}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            />
          </label>
        </div>

        {/* Result banner */}
        {result && (
          <div className={`mt-6 rounded-2xl px-6 py-4 ${result.ok ? 'border border-green-200 bg-green-50' : 'border border-red-200 bg-red-50'}`}>
            {result.ok ? (
              <p className="font-semibold text-green-900">Changes published successfully.</p>
            ) : (
              <>
                <p className="font-semibold text-red-900">Error</p>
                <p className="mt-1 text-sm text-red-800">{result.message}</p>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? 'Saving…' : 'Save & Publish'}
          </button>
          <button
            onClick={() => router.back()}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
