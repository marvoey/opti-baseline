import Image from 'next/image';
import type { ReactNode } from 'react';
import s from '../setup-guide.module.css';
import { cx } from './ui';

/**
 * A screenshot with a caption. Server component (no browser code).
 *   small    narrower picture (dialogs)
 *   narrow   a tall, thin crop that sits next to another one in a <FigureRow>
 *   enlarge  the picture is a link to the full-size image, for wide screenshots with small text
 * Screenshots live in public/setup-guide/<folder>/. Never put a real key, secret or ID in one.
 */
export function Figure({
  src,
  width,
  height,
  alt,
  small,
  narrow,
  enlarge,
  children,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  small?: boolean;
  narrow?: boolean;
  enlarge?: boolean;
  children: ReactNode;
}) {
  const picture = <Image src={src} width={width} height={height} alt={alt} sizes="(max-width: 900px) 100vw, 860px" />;
  return (
    <figure className={cx(s.figure, small && s.figureSmall, narrow && s.figureNarrow)}>
      {enlarge ? (
        <a className={s.zoom} href={src} target="_blank" rel="noopener noreferrer" title="Open the picture full size in a new tab">
          {picture}
        </a>
      ) : (
        picture
      )}
      <figcaption>
        {children}
        {enlarge && <span className={s.credit}>Click the picture to see it full size.</span>}
      </figcaption>
    </figure>
  );
}

/** Two or more narrow screenshots side by side (they stack on a phone). */
export function FigureRow({ children }: { children: ReactNode }) {
  return <div className={s.figureRow}>{children}</div>;
}

/** The numbered circle used on a screenshot, repeated in the text so the two can be matched up. */
export function Pin({ n }: { n: number }) {
  return (
    <span className={s.pin} aria-label={`marker ${n}`}>
      {n}
    </span>
  );
}
