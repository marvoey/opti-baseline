import { readFileSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

export const metadata = {
  title: 'Progressive | Opti Demo',
  icons: { icon: [{ url: 'https://images.contentstack.io/v3/assets/blt62d40591b3650da3/blt4a6e0a9548045e84/favicon.svg', type: 'image/svg+xml' }] },
};

export default function ApproachPage() {
  const md = readFileSync(join(process.cwd(), 'agentic-cms-html', 'approach.md'), 'utf8');
  const html = marked(md) as string;

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 pb-6 border-b border-gray-200">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#007bc4]">Agentic CMS · Progressive</span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Approach</h1>
        </div>
        <article
          className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-[#007bc4]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
