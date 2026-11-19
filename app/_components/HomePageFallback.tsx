export default function HomePageFallback() {
  return (
    <main className="relative flex min-h-[70vh] flex-col items-center justify-center gap-5 overflow-hidden p-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(252,175,23,0.18),transparent_60%)]"
      />
      <span className="relative rounded-full bg-rs-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
        Coming soon
      </span>
      <h1 className="relative text-5xl font-black tracking-tight text-white md:text-6xl">
        Welcome to Los Santos
      </h1>
      <p className="relative max-w-md text-rs-muted">
        This page is being prepared. Check back soon.
      </p>
    </main>
  );
}
