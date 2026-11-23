/**
 * Skeleton shown while the catch-all awaits the Graph fetch: a hero-shaped card and a few lines,
 * in the site's light brand tints.
 */
export default function Loading() {
  return (
    <div className="w-full animate-pulse bg-neutral-3 px-6 py-12" aria-busy="true" aria-label="Loading">
      <div className="mx-auto h-[420px] max-w-6xl rounded-[32px] bg-neutral-2" />
      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        <div className="h-6 w-2/3 rounded-full bg-neutral-2" />
        <div className="h-4 w-full rounded-full bg-white" />
        <div className="h-4 w-5/6 rounded-full bg-white" />
      </div>
    </div>
  );
}
