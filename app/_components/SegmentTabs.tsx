'use client';

import { useState, type ReactNode } from 'react';

type Props = {
  businessLabel: string;
  personalLabel: string;
  business: ReactNode;
  personal: ReactNode;
};

/** Business / Personal segment toggle; panels are server-rendered children. */
export default function SegmentTabs({ businessLabel, personalLabel, business, personal }: Props) {
  const [segment, setSegment] = useState<'business' | 'personal'>('business');
  const btn = (active: boolean) =>
    `rounded-full px-6 py-2 text-sm font-bold transition-colors ${
      active ? 'bg-blue-950 text-white' : 'bg-blue-50 text-blue-950 hover:bg-blue-100'
    }`;

  return (
    <div>
      <div role="tablist" className="mb-8 flex justify-center gap-3">
        <button role="tab" aria-selected={segment === 'business'} className={btn(segment === 'business')} onClick={() => setSegment('business')}>
          {businessLabel}
        </button>
        <button role="tab" aria-selected={segment === 'personal'} className={btn(segment === 'personal')} onClick={() => setSegment('personal')}>
          {personalLabel}
        </button>
      </div>
      <div role="tabpanel">{segment === 'business' ? business : personal}</div>
    </div>
  );
}
