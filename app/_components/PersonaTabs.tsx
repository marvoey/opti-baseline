'use client';
import { useEffect, useState, type ReactNode } from 'react';

type Tab = { id: string; label: string; panel: ReactNode };

export default function PersonaTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    // Preselect from ?persona=… (used by persona-specific sales URLs). Runs once on mount:
    // the URL is only readable client-side, and `tabs` is a new array every render.
    const p = new URLSearchParams(window.location.search).get('persona');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p && tabs.some((t) => t.id === p)) setActive(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-6">
      <div role="tablist" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${t.id === active ? 'bg-blue-800 text-white' : 'bg-white text-blue-950 ring-1 ring-slate-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={t.id !== active} className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          {t.panel}
        </div>
      ))}
    </div>
  );
}
