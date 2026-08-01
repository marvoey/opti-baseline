import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchItemForEdit } from './actions';
import EditContentForm from './_components/EditContentForm';

export const metadata: Metadata = { title: 'Edit Copy Item · Admin' };
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ key: string }> };

export default async function EditPage({ params }: Props) {
  const { key } = await params;
  const result = await fetchItemForEdit(key);

  if (!result.ok) {
    if (result.message.includes('No content found')) notFound();

    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="font-semibold text-red-900">Could not load item</p>
          <p className="mt-1 text-sm text-red-700">{result.message}</p>
        </div>
      </main>
    );
  }

  return <EditContentForm item={result.item} />;
}
