/**
 * Placeholder shown inside an editor-facing block that has no content yet, so an
 * empty block in Visual Builder is visible and tells the editor what to add.
 */
export default function EmptyBlock({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mx-auto my-8 max-w-3xl rounded-2xl border border-dashed border-white/25 p-8 text-center">
      <p className="text-sm font-bold text-white/80">{title}</p>
      <p className="mt-1 text-sm text-rs-muted">{hint}</p>
    </div>
  );
}
