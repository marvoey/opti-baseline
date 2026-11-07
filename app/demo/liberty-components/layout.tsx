import Link from 'next/link';
import { BASE_PATH } from './_showcase/registry';

/**
 * Frame for the Liberty component showcase. Deliberately has no site header or
 * footer — those are not part of the component set. Lives under /demo, which
 * proxy.ts leaves outside the [locale] CMS routing.
 */
export default function LibertyComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-white">
      <div className="border-b border-gray-200 bg-[#F5F7F8]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-sm">
          <Link href={BASE_PATH} className="font-medium text-navy">
            Liberty components
          </Link>
          <span className="text-gray-500">Ask Liberty · component library</span>
        </div>
      </div>
      {children}
    </div>
  );
}
