'use client';

import { useMemo, useState } from 'react';
import type { TaxonomyBlock } from '@/lib/cms/fetchByTaxonomy';
import { INTENT, PERSONA, SERVICE, GEO } from '@/lib/cms/taxonomy';
import type { Permutation } from '@/lib/cms/permutations';

type Option = { value: string; displayName: string };

type Props = {
  intents:      Option[];
  permutations: Permutation[];
};

type Step = 'select' | 'loading' | 'preview' | 'assembling' | 'done' | 'error';

const TYPE_LABEL: Record<string, string> = {
  HeroBlockv2: 'Hero', Paragraph: 'Paragraph', CardBlock: 'Card', ActionBlock: 'Action',
};

const TYPE_COLOR: Record<string, string> = {
  HeroBlockv2: 'bg-amber-100  text-amber-800  dark:bg-amber-900  dark:text-amber-200',
  Paragraph:   'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  CardBlock:   'bg-blue-100   text-blue-800   dark:bg-blue-900   dark:text-blue-200',
  ActionBlock: 'bg-green-100  text-green-800  dark:bg-green-900  dark:text-green-200',
};

const SECTION_BADGE: Record<string, { bg: string; letter: string }> = {
  HeroBlockv2: { bg: 'bg-amber-100  text-amber-800',  letter: 'H' },
  Paragraph:   { bg: 'bg-purple-100 text-purple-800', letter: 'P' },
  CardBlock:   { bg: 'bg-blue-100   text-blue-800',   letter: 'C' },
};

function uniqueSorted(codes: string[]): string[] {
  return [...new Set(codes)].sort((a, b) => Number(a) - Number(b));
}

function toOptions(codes: string[], map: Record<string, { displayName: string }>): Option[] {
  return codes.map(c => ({ value: c, displayName: map[c]?.displayName ?? c }));
}

function SelectField({
  id, label, value, onChange, options, disabled, placeholder,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void;
  options: Option[];
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`text-xs font-semibold uppercase tracking-wider ${
          disabled
            ? 'text-slate-300 dark:text-slate-600'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-600'
            : 'border-slate-300 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'
        }`}
      >
        {disabled ? (
          <option value="">{placeholder ?? 'Select above first'}</option>
        ) : (
          <>
            <option value="">Any</option>
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.displayName}</option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}

function BlockRow({ block }: { block: TaxonomyBlock }) {
  const svcLabels = (block.service ?? []).map(
    code => SERVICE[code]?.displayName ?? code,
  );
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex min-w-0 items-center gap-2">
        <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${TYPE_COLOR[block._type] ?? ''}`}>
          {TYPE_LABEL[block._type] ?? block._type}
        </span>
        <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
          {block.displayName}
        </span>
      </div>
      {svcLabels.length > 0 && (
        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
          {svcLabels.join(', ')}
        </span>
      )}
    </div>
  );
}

export function AssembleWizard({ intents, permutations }: Props) {
  const [intent,  setIntent]  = useState('');
  const [persona, setPersona] = useState('');
  const [service, setService] = useState('');
  const [geo,     setGeo]     = useState('');

  const [step,    setStep]    = useState<Step>('select');
  const [blocks,  setBlocks]  = useState<TaxonomyBlock[]>([]);
  const [doneUrl, setDoneUrl] = useState('');
  const [error,   setError]   = useState('');

  // ── Cascading option derivation ──────────────────────────────────────────

  const personaOpts = useMemo<Option[]>(() => {
    if (!intent) return [];
    const codes = uniqueSorted(
      permutations.filter(p => p.intent === intent).map(p => p.persona),
    );
    return toOptions(codes, PERSONA);
  }, [permutations, intent]);

  const serviceOpts = useMemo<Option[]>(() => {
    if (!intent || !persona) return [];
    const codes = uniqueSorted(
      permutations.filter(p => p.intent === intent && p.persona === persona).map(p => p.service),
    );
    return toOptions(codes, SERVICE);
  }, [permutations, intent, persona]);

  const geoOpts = useMemo<Option[]>(() => {
    if (!intent || !persona || !service) return [];
    const codes = uniqueSorted(
      permutations
        .filter(p => p.intent === intent && p.persona === persona && p.service === service)
        .map(p => p.geo),
    );
    return toOptions(codes, GEO);
  }, [permutations, intent, persona, service]);

  // ── Handlers: clear downstream on parent change ───────────────────────────

  function handleIntentChange(v: string) {
    setIntent(v);
    setPersona('');
    setService('');
    setGeo('');
  }

  function handlePersonaChange(v: string) {
    setPersona(v);
    setService('');
    setGeo('');
  }

  function handleServiceChange(v: string) {
    setService(v);
    setGeo('');
  }

  // ── Selection summary ─────────────────────────────────────────────────────

  const selectionSummary = [
    intent  ? INTENT[intent]?.displayName   : null,
    persona ? PERSONA[persona]?.displayName : null,
    service ? SERVICE[service]?.displayName : null,
    geo     ? GEO[geo]?.displayName         : null,
  ].filter(Boolean).join(' · ');

  // ── API calls ─────────────────────────────────────────────────────────────

  async function parseJson<T>(res: Response): Promise<T> {
    const text = await res.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(`Server returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
    }
  }

  async function handlePreview() {
    setStep('loading');
    setError('');
    const qs = new URLSearchParams();
    if (intent)  qs.set('intent',  intent);
    if (persona) qs.set('persona', persona);
    if (service) qs.set('service', service);
    if (geo)     qs.set('geo',     geo);
    try {
      const res  = await fetch(`/api/assemble?${qs}`);
      const data = await parseJson<{ results?: TaxonomyBlock[]; error?: string }>(res);
      if (!res.ok || data.error) { setError(data.error ?? 'Preview failed'); setStep('error'); return; }
      setBlocks(data.results ?? []);
      setStep('preview');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStep('error');
    }
  }

  async function handleAssemble() {
    setStep('assembling');
    setError('');
    try {
      const res  = await fetch('/api/assemble', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          intent:  intent  || undefined,
          persona: persona || undefined,
          service: service || undefined,
          geo:     geo     || undefined,
        }),
      });
      const data = await parseJson<{ ok: boolean; url?: string; error?: string }>(res);
      if (!res.ok || !data.ok) { setError(data.error ?? 'Assembly failed'); setStep('error'); return; }
      setDoneUrl(data.url ?? '/');
      setStep('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStep('error');
    }
  }

  function reset() {
    setStep('select');
    setBlocks([]);
    setDoneUrl('');
    setError('');
  }

  const heroes = blocks.filter(b => b._type === 'HeroBlockv2');
  const paras  = blocks.filter(b => b._type === 'Paragraph');
  const cards  = blocks.filter(b => b._type === 'CardBlock');

  return (
    <div className="space-y-6">

      {/* ── Step 1 + loading: Select taxonomy ── */}
      {(step === 'select' || step === 'loading') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">
            Choose audience attributes
          </h2>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Select any combination. Optimizely Graph will find matching content blocks and compose
            them into a live CMS page.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SelectField
              id="intent"
              label="Intent"
              value={intent}
              onChange={handleIntentChange}
              options={intents}
            />
            <SelectField
              id="persona"
              label="Persona"
              value={persona}
              onChange={handlePersonaChange}
              options={personaOpts}
              disabled={!intent}
              placeholder="Select intent first"
            />
            <SelectField
              id="service"
              label="Service"
              value={service}
              onChange={handleServiceChange}
              options={serviceOpts}
              disabled={!intent || !persona}
              placeholder={!intent ? 'Select intent first' : 'Select persona first'}
            />
            <SelectField
              id="geo"
              label="Geo"
              value={geo}
              onChange={setGeo}
              options={geoOpts}
              disabled={!intent || !persona || !service}
              placeholder={!intent ? 'Select intent first' : !persona ? 'Select persona first' : 'Select service first'}
            />
          </div>
          <div className="mt-5">
            <button
              onClick={handlePreview}
              disabled={step === 'loading'}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              {step === 'loading' ? 'Fetching content…' : 'Preview matching content →'}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Preview matched blocks ── */}
      {step === 'preview' && (
        <>
          {/* Matched blocks */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {blocks.length} block{blocks.length !== 1 ? 's' : ''} matched
                </h2>
                {selectionSummary && (
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {selectionSummary}
                  </p>
                )}
              </div>
              <button
                onClick={reset}
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ← Change selection
              </button>
            </div>

            {blocks.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  No content matched these filters — try different attributes.
                </p>
                <button
                  onClick={reset}
                  className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  ← Go back
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {blocks.map(b => (
                  <BlockRow key={b.key} block={b} />
                ))}
              </div>
            )}
          </div>

          {/* Page structure plan */}
          {blocks.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                Assembled page structure
              </h2>
              <ol className="space-y-2.5">
                {heroes.map(h => {
                  const b = SECTION_BADGE.HeroBlockv2;
                  return (
                    <li key={h.key} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${b.bg}`}>
                        {b.letter}
                      </span>
                      <span>
                        <span className="font-medium">Hero section</span>
                        {' — '}{h.displayName}
                      </span>
                    </li>
                  );
                })}
                {paras.map(p => {
                  const b = SECTION_BADGE.Paragraph;
                  return (
                    <li key={p.key} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${b.bg}`}>
                        {b.letter}
                      </span>
                      <span>
                        <span className="font-medium">Article section</span>
                        {' — '}{p.displayName}
                      </span>
                    </li>
                  );
                })}
                {cards.length > 0 && (() => {
                  const b = SECTION_BADGE.CardBlock;
                  return (
                    <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${b.bg}`}>
                        {b.letter}
                      </span>
                      <span>
                        <span className="font-medium">Feed section</span>
                        {' — '}{cards.length} card{cards.length !== 1 ? 's' : ''}
                      </span>
                    </li>
                  );
                })()}
              </ol>
              <div className="mt-5">
                <button
                  onClick={handleAssemble}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Assemble page in CMS →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Assembling ── */}
      {step === 'assembling' && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Publishing experience to CMS…
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            This usually takes a few seconds.
          </p>
        </div>
      )}

      {/* ── Step 3: Done ── */}
      {step === 'done' && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm dark:border-green-800 dark:bg-green-950">
          <h2 className="mb-1 text-base font-semibold text-green-800 dark:text-green-300">
            Page assembled
          </h2>
          <p className="mb-1 text-sm text-green-700 dark:text-green-400">
            The experience has been published to CMS and is live at:
          </p>
          <p className="mb-4 font-mono text-sm font-medium text-green-800 dark:text-green-200">
            {doneUrl}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={doneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              View page ↗
            </a>
            <button
              onClick={reset}
              className="text-sm font-medium text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
            >
              Assemble another
            </button>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {step === 'error' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-800 dark:bg-red-950">
          <h2 className="mb-1 text-base font-semibold text-red-800 dark:text-red-300">
            Something went wrong
          </h2>
          <p className="mb-4 font-mono text-xs text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={reset}
            className="text-sm font-medium text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
          >
            ← Try again
          </button>
        </div>
      )}

    </div>
  );
}
