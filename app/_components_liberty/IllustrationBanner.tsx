import { cx } from './utils';

/* ---- Reusable SVG pieces (draw inside an <svg>) ---- */

/** Yellow Liberty car. Draws at (x, y) scaled by s. */
export function Car({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 42 L22 40 L44 10 L122 10 L150 40 L192 46 L194 72 L0 72 Z"
        fill="#FFD000"
        stroke="#1A1446"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M52 17 L82 17 L82 38 L34 38 Z" fill="#E6F4F6" stroke="#1A1446" strokeWidth={2.5} />
      <path d="M90 17 L119 17 L140 38 L90 38 Z" fill="#E6F4F6" stroke="#1A1446" strokeWidth={2.5} />
      <circle cx={46} cy={74} r={17} fill="#1A1446" />
      <circle cx={46} cy={74} r={6} fill="#fff" />
      <circle cx={152} cy={74} r={17} fill="#1A1446" />
      <circle cx={152} cy={74} r={6} fill="#fff" />
    </g>
  );
}

/** Navy-roofed house. */
export function House({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-10 90 L120 0 L250 90 Z" fill="#1A1446" />
      <rect x={10} y={88} width={220} height={150} fill="#fff" stroke="#1A1446" strokeWidth={3} />
      <rect x={95} y={150} width={50} height={88} fill="#06748C" />
      <rect x={30} y={115} width={46} height={40} fill="#E6F4F6" stroke="#1A1446" strokeWidth={3} />
      <rect x={164} y={115} width={46} height={40} fill="#E6F4F6" stroke="#1A1446" strokeWidth={3} />
      <rect x={170} y={20} width={24} height={44} fill="#1A1446" />
    </g>
  );
}

/** Two-tone green tree. */
export function Tree({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 5} y={y} width={10} height={60} fill="#5B4636" />
      <circle cx={x} cy={y - 10} r={38} fill="#7CC4B0" />
      <circle cx={x + 22} cy={y + 8} r={24} fill="#6BB8A3" />
    </g>
  );
}

/* ---- Scenes ---- */

export type IllustrationScene = 'road' | 'house' | 'family';

const RAIN: Array<[number, number]> = [
  [430, 120],
  [455, 170],
  [760, 110],
  [790, 165],
  [735, 200],
];

function Scene({ scene }: { scene: IllustrationScene }) {
  if (scene === 'road') {
    return (
      <>
        <rect x={0} y={250} width={1200} height={90} fill="#C9E7EC" />
        <rect x={0} y={282} width={1200} height={8} fill="#fff" opacity={0.7} />
        <Tree x={150} y={190} />
        <Tree x={1040} y={185} />
        <circle cx={980} cy={70} r={36} fill="#FFD000" />
        <Car x={470} y={170} s={1.25} />
        <g transform="translate(760 120) rotate(14)">
          <rect width={90} height={56} rx={8} fill="#fff" stroke="#1A1446" strokeWidth={3} />
          <circle cx={18} cy={28} r={7} fill="none" stroke="#1A1446" strokeWidth={3} />
          <path d="M36 22h38M36 34h26" stroke="#06748C" strokeWidth={4} strokeLinecap="round" />
        </g>
      </>
    );
  }
  if (scene === 'house') {
    return (
      <>
        <rect x={0} y={270} width={1200} height={70} fill="#C9E7EC" />
        <Tree x={250} y={210} />
        <House x={480} y={30} s={1} />
        <Tree x={900} y={215} />
        {RAIN.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y} q12 18 0 26 q-12 -8 0 -26z`} fill="#4AA3DF" />
        ))}
        <circle cx={1050} cy={70} r={34} fill="#FFD000" />
      </>
    );
  }
  return (
    <>
      <rect x={0} y={265} width={1200} height={75} fill="#C9E7EC" />
      <circle cx={160} cy={80} r={36} fill="#FFD000" />
      <House x={250} y={25} s={1} />
      <Car x={560} y={180} s={1.2} />
      <Tree x={900} y={205} />
      <Tree x={1060} y={215} />
      <g fill="#1A1446">
        <circle cx={830} cy={190} r={10} />
        <rect x={822} y={202} width={16} height={40} rx={6} />
        <circle cx={860} cy={205} r={8} />
        <rect x={853} y={215} width={14} height={28} rx={5} />
      </g>
    </>
  );
}

const DEFAULT_LABELS: Record<IllustrationScene, string> = {
  road: 'Illustration of a car on the road with a rental agreement',
  house: 'Illustration of a house with water drops',
  family: 'Illustration of a family with their home and car',
};

export type IllustrationBannerProps = {
  /** road (rental car) · house (water damage) · family (home + auto). */
  scene?: IllustrationScene;
  /** Accessible description of the picture. */
  ariaLabel?: string;
  className?: string;
};

/** C20 — wide, rounded SVG scene that sets the topic of an answer. */
export default function IllustrationBanner({
  scene = 'road',
  ariaLabel,
  className,
}: IllustrationBannerProps) {
  return (
    <div data-reveal="illo" className={cx('rounded-3xl overflow-hidden', className)}>
      <svg viewBox="0 0 1200 340" className="w-full block" role="img" aria-label={ariaLabel ?? DEFAULT_LABELS[scene]}>
        <rect width={1200} height={340} fill="#E6F4F6" />
        <Scene scene={scene} />
      </svg>
    </div>
  );
}
