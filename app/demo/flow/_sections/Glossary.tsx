'use client';

import { useState } from 'react';
import { GLOSSARY } from './glossaryData';

// Searchable glossary. Lives in the sticky sidebar of /demo/flow (see ../page.tsx),
// so the meanings stay in view while scrolling between acts.
export default function Glossary() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const groups = GLOSSARY.map((group) => ({
    ...group,
    terms: q
      ? group.terms.filter(({ term, meaning }) => `${term} ${meaning}`.toLowerCase().includes(q))
      : group.terms,
  })).filter((group) => group.terms.length > 0);

  return (
    <div className="card gloss flex min-h-0 flex-1 flex-col p-4!">
      <div className="chip c-n mb-3 self-start">Glossary</div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search AEP, T65, FX..."
        aria-label="Search the glossary"
        className="gloss-search mb-2"
      />
      <div className="gloss-list min-h-0 flex-1 overflow-y-auto pr-1">
        {groups.length === 0 && <p className="text-xs opacity-70">No match.</p>}
        {groups.map((group) => (
          <section key={group.title} className="mb-3">
            <h3 className="gloss-group">{group.title}</h3>
            <dl>
              {group.terms.map(({ term, meaning }) => (
                <div key={term} className="gloss-item">
                  <dt>{term}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
