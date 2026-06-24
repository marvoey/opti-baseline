/**
 * Skeleton shown while the catch-all awaits the Graph fetch. Kept simple — a
 * shimmer block roughly the height of a hero — so soft navigations feel snappy.
 */
export default function Loading() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-[480px] w-full bg-slate-200" />
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-12">
        <div className="h-6 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-5/6 rounded bg-slate-100" />
      </div>
    </div>
  );
}
