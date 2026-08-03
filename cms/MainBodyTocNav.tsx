'use client';

import { useState, useEffect } from 'react';

type Heading = { level: 1 | 2; text: string; id: string };

export function MainBodyTocNav({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-10% 0% -60% 0%' }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveId(id);
  }

  const title = headings.find(h => h.level === 1)?.text ?? 'Contents';

  return (
    <div className="sticky top-20 px-6 py-4">
      <div className="prose mx-auto">
        <h3>{title}</h3>
        <ul>
          {headings.filter(h => h.level !== 1).map(h => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={e => handleClick(e, h.id)}
                className={`transition-colors no-underline ${
                  activeId === h.id
                    ? 'font-semibold text-blue-700'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
