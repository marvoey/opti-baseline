'use client';

import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';

/**
 * Demo helper: wraps an animated component (AiProgressPanel, StagedReveal,
 * StreamText) and adds a "Replay" button that bumps its `playKey` prop.
 */
export default function Replayable({
  children,
  label = 'Replay',
}: {
  children: ReactNode;
  label?: string;
}) {
  const [key, setKey] = useState(0);
  return (
    <div>
      <div className="px-4 py-2 border-b border-gray-200 bg-[#F5F7F8] flex justify-end">
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="text-sm font-medium text-lmt border border-lmt rounded-full px-4 py-1 hover:bg-mist"
        >
          {label}
        </button>
      </div>
      {/* Only components take playKey; a plain DOM element would reject it. */}
      {isValidElement(children) && typeof children.type !== 'string'
        ? cloneElement(children as ReactElement<{ playKey?: number }>, { playKey: key })
        : children}
    </div>
  );
}
