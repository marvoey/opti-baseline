import Link from 'next/link';
import { Menu, ChevronDown, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { getNavTree, type NavNode } from '@/lib/navTree';

/**
 * Sticky header: logo, primary nav, sign-in link and call to action. White with Dark Fir text
 * (the brand's only text colour) and a Dark Fir rule, matching the /setup-guide top bar.
 *
 * The primary nav comes from the CMS content tree (lib/navTree.ts): the start page, its child
 * pages, and a dropdown (CSS hover / keyboard focus) for any page that has children. Links that
 * are not CMS pages go in siteConfig.mainNavExtraLinks. The mobile menu is a native <details>
 * disclosure, so this stays a Server Component with no client JS.
 */
const linkClass =
  'inline-flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-neutral-3 transition-colors';

function DesktopItem({ node }: { node: NavNode }) {
  if (node.children.length === 0) {
    return (
      <Link href={node.href} className={linkClass}>
        {node.label}
      </Link>
    );
  }
  return (
    <div className="group relative">
      <Link href={node.href} className={linkClass} aria-haspopup="true">
        {node.label}
        <ChevronDown
          size={14}
          className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </Link>
      <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="min-w-56 rounded-2xl border-2 border-dark-fir bg-white p-2">
          {node.children.map((child) => (
            <li key={child.href}>
              <Link href={child.href} className="block rounded-xl px-4 py-2 text-sm hover:bg-neutral-3">
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileItem({ node, depth = 0 }: { node: NavNode; depth?: number }) {
  return (
    <>
      <Link
        href={node.href}
        style={depth ? { paddingLeft: `${1 + depth}rem` } : undefined}
        className={`block rounded-xl px-4 py-3 text-sm hover:bg-neutral-3 ${depth ? '' : 'font-semibold'}`}
      >
        {node.label}
      </Link>
      {node.children.map((child) => (
        <MobileItem key={child.href} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

function ExtraLink({ link, className }: { link: { label: string; href: string; external?: boolean }; className: string }) {
  return (
    <Link href={link.href} className={className}>
      {link.label}
      {link.external ? <ArrowUpRight size={14} /> : null}
    </Link>
  );
}

const MainNav = async ({ locale }: { locale?: string }) => {
  const tree = await getNavTree(locale);
  const topLevel: NavNode[] = [
    ...(tree.home ? [{ label: siteConfig.homeNavLabel, href: tree.home.href, children: [] }] : []),
    ...tree.items,
  ];
  const extras = siteConfig.mainNavExtraLinks;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-dark-fir bg-white text-dark-fir">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" title="Go to home page" className="flex items-center gap-3" data-cms-field="brand_logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} width={105} height={36} className="h-9 w-auto" />
          <span className="hidden border-l-2 border-dark-fir pl-3 text-sm font-bold sm:inline">{siteConfig.siteLabel}</span>
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-semibold lg:flex" aria-label="Main">
          {topLevel.map((node) => (
            <DesktopItem key={node.href} node={node} />
          ))}
          {extras.map((link) => (
            <ExtraLink key={link.label} link={link} className={linkClass} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={siteConfig.accountHref}
            className="hidden rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-neutral-3 sm:inline-flex"
          >
            {siteConfig.accountLabel}
          </Link>
          <Link
            href={siteConfig.primaryCta.href}
            className="hidden items-center rounded-full border-2 border-dark-fir bg-lfgreen px-4 py-2 text-sm font-bold transition-colors hover:bg-grass sm:inline-flex"
          >
            {siteConfig.primaryCta.label}
          </Link>
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-full p-2 hover:bg-neutral-3 [&::-webkit-details-marker]:hidden">
              <Menu size={22} />
              <span className="sr-only">Open menu</span>
            </summary>
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border-2 border-dark-fir bg-white p-2">
              {topLevel.map((node) => (
                <MobileItem key={node.href} node={node} />
              ))}
              {extras.map((link) => (
                <ExtraLink
                  key={link.label}
                  link={link}
                  className="flex items-center gap-1 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-neutral-3"
                />
              ))}
              <div className="mt-2 grid gap-2 border-t border-dark-fir/20 p-2 pt-3 sm:hidden">
                <Link href={siteConfig.accountHref} className="rounded-full border-2 border-dark-fir px-4 py-2 text-center text-sm font-semibold">
                  {siteConfig.accountLabel}
                </Link>
                <Link
                  href={siteConfig.primaryCta.href}
                  className="rounded-full border-2 border-dark-fir bg-lfgreen px-4 py-2 text-center text-sm font-bold"
                >
                  {siteConfig.primaryCta.label}
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
