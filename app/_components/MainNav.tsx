import Link from 'next/link';
import { User, Menu, Search, ChevronDown, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { getNavTree, type NavNode } from '@/lib/navTree';

/**
 * Sticky black header: logos, primary nav, yellow "Buy Now" pill and round icon
 * buttons for search / player menu.
 *
 * The nav comes from the CMS content tree (lib/navTree.ts): the start page, its
 * child pages, and a dropdown (CSS hover / keyboard focus) for any page that has
 * children. The mobile menu uses a native <details> disclosure, so this stays a
 * Server Component with no client JS.
 */
const linkClass = 'inline-flex items-center gap-1 transition-colors hover:text-white';

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
          <ChevronDown size={14} className="opacity-70 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
        </Link>
        <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <ul className="min-w-56 rounded-2xl border border-rs-line bg-rs-panel p-2 shadow-2xl">
            {node.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="block rounded-xl px-4 py-2.5 text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white"
                >
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
        style={depth ? { paddingLeft: `${1 + depth * 1}rem` } : undefined}
        className={`block rounded-xl px-4 py-3 text-sm hover:bg-white/10 hover:text-white ${
          depth ? 'font-semibold text-white/60' : 'font-bold text-white/85'
        }`}
      >
        {node.label}
      </Link>
      {node.children.map((child) => (
        <MobileItem key={child.href} node={child} depth={depth + 1} />
      ))}
    </>
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
  <header className="sticky top-0 z-50 border-b border-rs-line bg-rs-ink/95 backdrop-blur">
    <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-4">
      <div className="navbar-brand flex items-center gap-4" data-cms-field="brand_logo">
        <a href={siteConfig.starHref} title={siteConfig.starAlt} className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.starSrc} alt={siteConfig.starAlt} className="h-8 w-8" />
        </a>
        <span aria-hidden className="h-6 w-px bg-white/25" />
        <Link href="/" title="Go to home page" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-7 w-auto" />
        </Link>
      </div>

      <nav className="hidden flex-1 items-center gap-7 text-sm font-bold text-white/80 lg:flex">
        {topLevel.map((node) => (
          <DesktopItem key={node.href} node={node} />
        ))}
        {extras.map((link) => (
          <Link key={link.label} href={link.href} className={linkClass}>
            {link.label}
            {link.external ? <ArrowUpRight size={14} className="opacity-70" /> : null}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden items-center rounded-full bg-rs-yellow px-5 py-2 text-sm font-extrabold text-black transition-colors hover:bg-rs-yellow-soft sm:inline-flex"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button
          type="button"
          aria-label={siteConfig.searchLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          aria-label={siteConfig.accountLabel}
          className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:flex"
        >
          <User size={18} />
        </button>

        {/* Mobile menu */}
        <details className="relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-white hover:bg-white/10">
            <Menu size={22} />
            <span className="sr-only">Open menu</span>
          </summary>
          <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-rs-line bg-rs-panel p-2 shadow-2xl">
            {topLevel.map((node) => (
              <MobileItem key={node.href} node={node} />
            ))}
            {extras.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-white/85 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={siteConfig.primaryCta.href}
              className="mt-2 block rounded-full bg-rs-yellow px-4 py-3 text-center text-sm font-extrabold text-black"
            >
              {siteConfig.primaryCta.label}
            </Link>
          </div>
        </details>
      </div>
    </div>
  </header>
  );
};

export default MainNav;
