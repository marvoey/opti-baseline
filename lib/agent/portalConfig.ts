/**
 * Chrome copy for the Independent Agent Portal (from public/use-case-2-agent-portal.html).
 * Page copy lives in the CMS; this is only the header, footer and utility row.
 * Most links go to "#", as in the mockup.
 */

import { DEFAULT_AGENT_KEY, agentKeyFromPath, type AgentKey } from './personas';

export type PortalLink = { label: string; href: string };

/** The portal root: the sign-in page. It is NOT an agent's home, see `portalHomeFor`. */
export const PORTAL_HOME = '/agent';

/**
 * The page an agent lands on: their own dashboard (/agent/dana). Used for the
 * header's Home link and logo, and as the fallback after Sign in. The key is one
 * of the four allow-listed agent keys, so the result is always a safe path.
 */
export const portalHomeFor = (key: AgentKey): string => `${PORTAL_HOME}/${key}`;

/**
 * The sign-in page: the portal root, /agent exactly (also /agent/ and with a
 * locale prefix, /en/agent). It gets the sparse sign-in header. Everything below
 * it (/agent/dana, /agent/priorities, ...) is a signed-in page with the full header.
 */
export const SIGNIN_PATH_RE = /^\/(?:[a-z]{2}(?:-[A-Za-z0-9]+)?\/)?agent\/?$/;

/**
 * Where "Sign in" leads, as typed in the CMS. Only a path on this site is
 * accepted: it must start with a single "/" (so not "//host" or "/\\host"), and
 * contain no control characters or backslashes. Anything else, including a full
 * https:// address, falls back to the default agent's dashboard (never to the
 * sign-in page itself, which would loop). `{agent}` is replaced with the
 * chosen agent's key later (always one of the four allow-listed keys).
 */
export function safeDestination(template: string | null | undefined): string {
  const t = (template ?? '').trim();
  const ok = /^\/(?![/\\])[^\\\u0000-\u001f\u007f]*$/.test(t);
  return ok ? t : portalHomeFor(DEFAULT_AGENT_KEY);
}

/** URLs under this prefix get the portal header and footer instead of the LM.com ones. */
export const PORTAL_PATH_RE = /^\/(?:[a-z]{2}(?:-[A-Za-z0-9]+)?\/)?agent(?:\/|$)/;

export type ChromeVariant = 'site' | 'portal' | 'signin' | 'agent' | 'plain';

/**
 * Which header a URL gets:
 *  - 'signin': the simple header (logo, Help, Español) on the sign-in page /agent;
 *  - 'agent': the simple header with the bell and the agent's initials, name and
 *    agency, on the agents' own dashboards (/agent/dana, ...) and the product page;
 *  - 'plain': the simple header with just the logo, on the priorities page;
 *  - 'portal': the full header (menu, agent, "view as") on any other /agent/* page
 *    (none today; it is the fallback for pages added later and for 404s there);
 *  - 'site': the LM.com header everywhere else.
 * The CMS preview route does not use this: it chooses by page type.
 */
export function chromeFor(pathname: string): ChromeVariant {
  if (SIGNIN_PATH_RE.test(pathname)) return 'signin';
  if (agentKeyFromPath(pathname) || SALES_PATH_RE.test(pathname)) return 'agent';
  if (PRIORITIES_PATH_RE.test(pathname)) return 'plain';
  return PORTAL_PATH_RE.test(pathname) ? 'portal' : 'site';
}

/** The priorities page. */
export const PRIORITIES_PATH_RE = /^\/(?:[a-z]{2}(?:-[A-Za-z0-9]+)?\/)?agent\/priorities(?:\/|$)/;

/** Product pages: "Sales & marketing" is the active menu item on them (in the full header). */
export const SALES_PATH_RE = /^\/(?:[a-z]{2}(?:-[A-Za-z0-9]+)?\/)?agent\/home-auto-bundle(?:\/|$)/;

/** Which header menu item is active for a URL: "Sales & marketing" on product pages, otherwise "Home". */
export const activeNavLabel = (pathname: string): string => (SALES_PATH_RE.test(pathname) ? 'Sales & marketing' : 'Home');

export const portalConfig = {
  name: 'Independent Agent Portal',
  navLinks: [
    { label: 'Home', href: PORTAL_HOME }, // replaced by the agent's own dashboard in PortalHeader
    { label: 'Quote', href: '#' },
    { label: 'Policies', href: '#' },
    { label: 'Claims', href: '#' },
    { label: 'Sales & marketing', href: '#' },
    { label: 'Resources', href: '#' },
  ] satisfies PortalLink[],
  /** Right side of the sign-in header (no navigation, no signed-in agent). */
  signInLinks: [
    { label: 'Help', href: '#' },
    { label: 'Español', href: '#' },
  ] satisfies PortalLink[],
  utilityLinks: [
    { label: 'Contact your marketing manager', href: '#' },
    { label: 'Help center', href: '#' },
  ] satisfies PortalLink[],
  footerColumns: [
    {
      heading: 'Agent support',
      links: [
        { label: 'Contact your marketing manager', href: '#' },
        { label: 'Underwriting support', href: '#' },
        { label: 'Technical help', href: '#' },
      ],
    },
    {
      heading: 'Sales and marketing',
      links: [
        { label: 'Product guides', href: '#' },
        { label: 'Bundles', href: '#' },
        { label: 'Co-branded materials', href: '#' },
      ],
    },
    {
      heading: 'Programs',
      links: [
        { label: 'Agency agreement', href: '#' },
        { label: 'Licensing and appointments', href: '#' },
        { label: 'Training and events', href: '#' },
      ],
    },
  ],
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Security Policy', href: '#' },
    { label: 'Terms and Conditions', href: '#' },
    { label: 'Producer compensation disclosure', href: '#' },
  ] satisfies PortalLink[],
  footerLegal: `© ${new Date().getFullYear()} Liberty Mutual Insurance, 175 Berkeley Street, Boston, MA 02116. For use by authorized independent agents.`,
} as const;
