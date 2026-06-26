'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import type { ContentTypeDef } from './_blocks';
import { Section } from './_components';
import { PropertyTable } from './_PropertyTable';

/**
 * The interactive property↔preview map on a block detail page.
 *
 * The block components tag each property's DOM node with
 * `data-epi-property-name` via the SDK's `pa()` helper (the same attributes
 * Optimizely's on-page editor uses) — but only when rendered with an edit
 * context. The detail page renders the previews with that context, so here we
 * can scan the preview DOM for those attributes, drop a numbered marker on each
 * tagged region, and number the matching rows in the properties table. Hovering
 * either side highlights the other.
 *
 * Only properties the component actually renders with `pa()` get a number;
 * array/layout properties that aren't tagged simply stay unnumbered.
 */

type Marker = { key: string; n: number; top: number; left: number };

function readTagged(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-epi-property-name]'));
}

export function PropertyMap({
  previews,
  contentType,
}: {
  previews: ReactNode;
  contentType: ContentTypeDef;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [numbers, setNumbers] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string | null>(null);

  // Measure marker positions relative to the preview container. Re-runs on
  // resize and after async layout (fonts/images) settles.
  useLayoutEffect(() => {
    const container = previewRef.current;
    if (!container) return;

    function measure() {
      if (!container) return;
      const els = readTagged(container);

      // One number per unique property key, assigned in document order.
      const num: Record<string, number> = {};
      let next = 1;
      for (const el of els) {
        const k = el.dataset.epiPropertyName;
        if (k && !(k in num)) num[k] = next++;
      }

      const cRect = container.getBoundingClientRect();
      const mk: Marker[] = els.map((el) => {
        const r = el.getBoundingClientRect();
        const key = el.dataset.epiPropertyName!;
        return { key, n: num[key], top: r.top - cRect.top, left: r.left - cRect.left };
      });

      setNumbers(num);
      setMarkers(mk);
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener('resize', measure);
    // Re-measure once async layout (web fonts, lucide icons) has settled.
    const t = window.setTimeout(measure, 300);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.clearTimeout(t);
    };
  }, [previews]);

  // Outline the matching preview element(s) while a property is active, and let
  // hovering a preview region drive the shared `active` state.
  useEffect(() => {
    const container = previewRef.current;
    if (!container) return;
    const els = readTagged(container);

    const cleanups = els.map((el) => {
      const key = el.dataset.epiPropertyName!;
      const enter = () => setActive(key);
      const leave = () => setActive((cur) => (cur === key ? null : cur));
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      el.style.transition = 'outline-color 120ms';
      return () => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
        el.style.outline = '';
        el.style.outlineOffset = '';
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, [markers]);

  // Apply/remove the outline whenever the active property changes.
  useEffect(() => {
    const container = previewRef.current;
    if (!container) return;
    for (const el of readTagged(container)) {
      const on = active != null && el.dataset.epiPropertyName === active;
      el.style.outline = on ? '2px solid #a29060' : '';
      el.style.outlineOffset = on ? '3px' : '';
    }
  }, [active, markers]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <Section
        title="Preview"
        subtitle="Rendered with the example content below. Hover a numbered marker — or a property row — to see where each field renders."
      >
        <div ref={previewRef} className="relative">
          {previews}
          <div className="pointer-events-none absolute inset-0 z-20">
            {markers.map((m, i) => (
              <button
                key={`${m.key}-${i}`}
                type="button"
                aria-label={`Property ${m.key}`}
                onMouseEnter={() => setActive(m.key)}
                onMouseLeave={() => setActive((cur) => (cur === m.key ? null : cur))}
                style={{ top: m.top, left: m.left }}
                className={`pointer-events-auto absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[11px] font-bold shadow ring-2 ring-white transition ${
                  active === m.key
                    ? 'z-10 scale-125 bg-cibc-gold text-cibc-teal-dark'
                    : 'bg-cibc-teal text-white'
                }`}
              >
                {m.n}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Properties stay pinned alongside a tall preview so editors can read
          the field list without scrolling away from what it renders. */}
      <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
        <Section
          title="Properties"
          subtitle="Fields editors fill in for this content type. Numbered fields are mapped to the preview."
        >
          <PropertyTable
            contentType={contentType}
            numbers={numbers}
            activeKey={active}
            onHover={setActive}
          />
        </Section>
      </div>
    </div>
  );
}
