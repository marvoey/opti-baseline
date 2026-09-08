/** Shared gradient promo tile used by `Entertainment` and `Cinema`. Not a CMS content type. */

export function ShowcaseTile({ heading, body, cta }: { heading: string; body: string; cta: string }) {
  return (
    <div
      className="flex flex-col justify-end rounded-xl p-6"
      style={{ background: 'linear-gradient(135deg, var(--color-blue-800), var(--color-blue-950))', minHeight: '16rem' }}
    >
      <h3 className="text-xl font-bold text-white">{heading}</h3>
      <p className="mt-2 text-sm text-white/70">{body}</p>
      <a href="#plans" className="btn-cta mt-4 inline-block w-fit rounded-full px-5 py-2 text-sm font-bold text-white">
        {cta}
      </a>
    </div>
  );
}
