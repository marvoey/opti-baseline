/**
 * Skeleton shown while the catch-all awaits the Graph fetch. Kept simple - a
 * dark shimmer block roughly the height of a hero, then a card row - so soft
 * navigations feel snappy on the black brand canvas.
 */
export default function Loading() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-[520px] w-full bg-rs-panel" />
      <div className="container mx-auto space-y-6 px-4 py-12">
        <div className="h-8 w-1/3 rounded-lg bg-rs-card" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="aspect-[4/3] rounded-3xl bg-rs-card" />
          <div className="aspect-[4/3] rounded-3xl bg-rs-card" />
          <div className="aspect-[4/3] rounded-3xl bg-rs-card" />
        </div>
      </div>
    </div>
  );
}
