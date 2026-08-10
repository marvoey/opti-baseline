'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  children: React.ReactNode;
  itemCount: number;
  showNavigation?: boolean | null;
  // accepts standard HTML attrs or Optimizely's data-epi-* edit-mode attrs
  trackAttrs?: Record<string, string | undefined>;
};

export function CarouselShell({ children, itemCount, showNavigation, trackAttrs }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      setActiveIndex(index);
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || itemCount < 2) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = Array.from(track.children).indexOf(entry.target as HTMLElement);
            if (i >= 0) setActiveIndex(i);
          }
        }
      },
      { root: track, threshold: 0.5 },
    );
    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [itemCount]);

  const showNav = showNavigation && itemCount > 1;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        {...trackAttrs}
        className="flex overflow-hidden snap-x snap-mandatory scroll-smooth"
      >
        {children}
      </div>

      {showNav && (
        <>
          <button
            type="button"
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow transition-opacity disabled:opacity-30 hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollTo(Math.min(itemCount - 1, activeIndex + 1))}
            disabled={activeIndex === itemCount - 1}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow transition-opacity disabled:opacity-30 hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>

          <div className="mt-4 flex justify-center gap-2" aria-label="Slide navigation">
            {Array.from({ length: itemCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-gray-800' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
