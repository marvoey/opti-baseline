'use client';

import { useState, useTransition } from 'react';
import { fetchKbBlocks, type FetchKbResult, type KbItem } from './_actions';


const ALL_LOBS = ['Commercial Auto', 'Homeowners', 'Personal Auto'];
const ALL_TOPICS = [
  'Glass Claim',
  'Hail/Storm Damage',
  'Liability',
  'Rideshare Coverage',
  'Roadside Assistance',
  'Water Damage',
];
const ALL_JURISDICTIONS = [
  'AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','HI',
  'IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN',
  'MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH',
  'OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY',
];

function SelectPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
        active
          ? 'bg-[#007BC7] text-white border-[#007BC7]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-[#007BC7] hover:text-[#007BC7]'
      }`}
    >
      {label}
    </button>
  );
}

function ItemCard({ item, label }: { item: KbItem; label: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-gray-900 text-sm">{item.InternalName}</p>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-blue-50 text-[#004A8F] border-blue-200">
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded border border-gray-200">{item.LOB}</span>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded border border-gray-200">{item.Topic}</span>
        {item.Jurisdiction && (
          <span className="bg-blue-50 text-[#004A8F] text-xs font-medium px-2 py-0.5 rounded border border-blue-200">
            {item.Jurisdiction}
          </span>
        )}
      </div>
      {item.richTextHtml && (
        <div
          className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: item.richTextHtml }}
        />
      )}
    </div>
  );
}

function ResultSection({ title, items, label }: { title: string; items: KbItem[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {title} <span className="text-gray-300">({items.length})</span>
      </h2>
      {items.map((item) => (
        <ItemCard key={item._metadata.key} item={item} label={label} />
      ))}
    </div>
  );
}

export default function TestPage() {
  const [lob, setLob] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [jurisdiction, setJurisdiction] = useState<string | null>(null);
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');
  const [result, setResult] = useState<FetchKbResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSelect(type: 'lob' | 'topic' | 'jurisdiction', value: string) {
    const nextLob = type === 'lob' ? (lob === value ? null : value) : lob;
    const nextTopic = type === 'topic' ? (topic === value ? null : value) : topic;
    const nextJurisdiction = type === 'jurisdiction' ? (jurisdiction === value ? null : value) : jurisdiction;

    setLob(nextLob);
    setTopic(nextTopic);
    setJurisdiction(nextJurisdiction);
    setResult(null);
    setError(null);

    if (nextLob && nextTopic) {
      startTransition(async () => {
        try {
          const data = await fetchKbBlocks(nextLob, nextTopic, nextJurisdiction ?? undefined);
          setResult(data);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Fetch failed');
        }
      });
    }
  }

  const total = (result?.corePrinciples.length ?? 0) + (result?.proceduralSafeguards.length ?? 0) + (result?.overrides.length ?? 0) + (result?.disclosures.length ?? 0);
  const ready = lob && topic;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 shrink-0 shadow-sm gap-3">
        <span className="text-[#007BC7] font-bold text-lg tracking-tight">KNOWLEDGE FILTER</span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500 text-sm">Core Principles &amp; Procedural Safeguards</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
          <div className="px-4 py-5 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Line of Business</h3>
            <div className="flex flex-col gap-2">
              {ALL_LOBS.map((l) => (
                <SelectPill
                  key={l}
                  label={l}
                  active={lob === l}
                  onClick={() => handleSelect('lob', l)}
                />
              ))}
            </div>
          </div>

          <div className="px-4 py-5 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Topic</h3>
            <div className="flex flex-col gap-2">
              {ALL_TOPICS.map((t) => (
                <SelectPill
                  key={t}
                  label={t}
                  active={topic === t}
                  onClick={() => handleSelect('topic', t)}
                />
              ))}
            </div>
          </div>

          <div className="px-4 py-5 flex flex-col gap-2 flex-1 min-h-0">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jurisdiction</h3>
            <input
              type="text"
              placeholder="Search…"
              value={jurisdictionSearch}
              onChange={(e) => setJurisdictionSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BC7] focus:border-transparent"
            />
            <div className="flex flex-col gap-0.5 overflow-y-auto flex-1">
              {ALL_JURISDICTIONS.filter((j) =>
                j.toLowerCase().includes(jurisdictionSearch.toLowerCase())
              ).map((j) => (
                <button
                  key={j}
                  onClick={() => handleSelect('jurisdiction', j)}
                  className={`text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    jurisdiction === j
                      ? 'bg-[#007BC7] text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 overflow-y-auto p-6">
          {!ready && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-6.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              <p className="text-sm font-medium">Select a Line of Business and Topic to fetch</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 font-mono">
              {error}
            </div>
          )}

          {isPending && (
            <div className="flex items-center justify-center h-full text-gray-400 gap-2">
              <svg className="w-5 h-5 animate-spin text-[#007BC7]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm">Fetching from Optimizely Graph…</span>
            </div>
          )}

          {!isPending && result && (
            <div className="space-y-8">
              <p className="text-sm font-semibold text-gray-700">
                {total} result{total !== 1 ? 's' : ''} for{' '}
                <span className="text-[#007BC7]">{lob}</span> /{' '}
                <span className="text-[#007BC7]">{topic}</span>
                {jurisdiction && <>{' '}/ <span className="text-[#007BC7]">{jurisdiction}</span></>}
              </p>

              {total === 0 && (
                <p className="text-sm text-gray-400">No content found for this combination.</p>
              )}

              <ResultSection
                title="Core Principles"
                items={result.corePrinciples}
                label="Core Principle"
              />
              <ResultSection
                title="Procedural Safeguards"
                items={result.proceduralSafeguards}
                label="Procedural Safeguard"
              />
              <ResultSection
                title="Jurisdictional Overrides"
                items={result.overrides}
                label="Override"
              />
              <ResultSection
                title="Statutory Disclosures"
                items={result.disclosures}
                label="Disclosure"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
