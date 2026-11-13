import Link from 'next/link';
import { corelResolver } from '@/cms/corel';
import SiteChrome from '@/app/_components/SiteChrome';
import { PAGES, type PageKey } from './sample';

/**
 * Dev harness: renders every Corel CMS block through the real components using
 * sample content ported from app/demo/mock (no CMS content required). One tab per
 * mock page, e.g. /demo/corel-blocks?page=product. Not linked from the site.
 */
export const metadata = { title: 'Corel blocks (sample content)', robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function CorelBlocksDemo({ searchParams }: Props) {
  const { page } = await searchParams;
  const key: PageKey = page && page in PAGES ? (page as PageKey) : 'home';
  const { blocks } = PAGES[key];

  return (
    <SiteChrome>
      <nav className="border-b border-gray-200 bg-gray-50 text-sm">
        <div className="site-container flex flex-wrap items-center gap-x-5 gap-y-1 py-2">
          <span className="font-semibold text-gray-500">Corel blocks · sample content:</span>
          {(Object.keys(PAGES) as PageKey[]).map((k) => (
            <Link
              key={k}
              href={`/demo/corel-blocks?page=${k}`}
              className={k === key ? 'font-bold text-brand' : 'text-gray-700 hover:text-brand'}
            >
              {PAGES[k].label}
            </Link>
          ))}
        </div>
      </nav>
      <main>
        {blocks.map((b, i) => {
          const Component = corelResolver[b.type as keyof typeof corelResolver] as
            | React.ComponentType<{ content: never }>
            | undefined;
          return Component ? (
            <Component key={i} content={b.content as never} />
          ) : (
            <p key={i} className="p-4 text-rose-600">Unknown block type: {b.type}</p>
          );
        })}
      </main>
    </SiteChrome>
  );
}
