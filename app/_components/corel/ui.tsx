import ChromeLink from '../ChromeLink';

/** Server-safe UI primitives shared by the Corel CMS blocks (ported from app/demo/mock). */

const ASSET_BASE = 'https://www.coreldraw.com';

/**
 * Normalise an image/asset source. Accepts absolute https:// URLs and paths on
 * coreldraw.com; everything else (javascript:, data:, http:, protocol-relative…)
 * is rejected so editor-supplied values can't inject odd schemes into `src`.
 */
export function resolveAssetUrl(src?: string | null): string | undefined {
  const v = src?.trim();
  if (!v) return undefined;
  if (/^https:\/\//i.test(v)) return v;
  if (v.startsWith('/') && !v.startsWith('//')) return ASSET_BASE + v;
  return undefined;
}

export const GRADS = [
  'from-emerald-400 via-teal-500 to-sky-600',
  'from-fuchsia-500 via-purple-500 to-indigo-600',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-lime-400 via-emerald-500 to-teal-700',
  'from-sky-400 via-blue-500 to-violet-600',
  'from-rose-400 via-pink-500 to-purple-600',
];

const PATHS = {
  chevron: 'M6 9l6 6 6-6',
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
  check: 'M5 13l4 4L19 7',
  close: 'M6 6l12 12M18 6L6 18',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zm-9-9h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35',
  phone:
    'M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z',
  chat: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  ticket: 'M4 4h16v16H4zM4 9h16M9 4v16',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  box: 'M21 16V8l-9-5-9 5v8l9 5 9-5zM3.3 7L12 12l8.7-5M12 22V12',
  cog: 'M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 00-2-1.2L14.5 3h-5l-.4 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 000 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 002 1.2l.4 2.6h5l.4-2.6a7 7 0 002-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM4 19.5A2.5 2.5 0 006.5 22H20v-5',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
};
export type IconName = keyof typeof PATHS;

/** Resolve a CMS-supplied icon key to a known icon (unknown keys fall back to a check). */
export function toIconName(key?: string | null): IconName {
  return key && key in PATHS ? (key as IconName) : 'check';
}

export function Icon({ name, className = 'w-5 h-5', fill = false }: { name: IconName; className?: string; fill?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

const BUTTON_VARIANT = {
  primary: 'bg-brand hover:bg-brand-dark text-white border border-brand',
  outline: 'bg-transparent hover:bg-gray-900 hover:text-white text-gray-900 border border-gray-900',
  light: 'bg-white hover:bg-gray-100 text-gray-900 border border-white',
  ghostLight: 'bg-transparent hover:bg-white hover:text-gray-900 text-white border border-white',
};
const BUTTON_SIZE = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof BUTTON_VARIANT;
  size?: keyof typeof BUTTON_SIZE;
  className?: string;
}) {
  return (
    <ChromeLink
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-semibold transition ${BUTTON_VARIANT[variant]} ${BUTTON_SIZE[size]} ${className}`}
    >
      {children}
    </ChromeLink>
  );
}

export function SectionHeading({
  title,
  sub,
  center = true,
  light = false,
}: {
  title?: React.ReactNode;
  sub?: React.ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  if (!title && !sub) return null;
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} mb-10 max-w-3xl`}>
      {title && (
        <h2 className={`text-3xl font-bold tracking-tight md:text-4xl ${light ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      )}
      {sub && <p className={`mt-4 text-lg ${light ? 'text-gray-300' : 'text-gray-600'}`}>{sub}</p>}
    </div>
  );
}

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold tracking-wide text-white uppercase ${className}`}>
      {children}
    </span>
  );
}

/** Dark gradient hero background used by several blocks in the mock. */
export const DARK_HERO = 'bg-gradient-to-br from-black via-gray-900 to-emerald-950 text-white';
