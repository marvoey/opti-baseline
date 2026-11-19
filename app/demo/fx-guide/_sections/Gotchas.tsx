// Section #gotchas of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.
/* eslint-disable @next/next/no-img-element -- static SVG illustrations, nothing to optimize */
import illustration3Img from '../_assets/illustration-3.svg';

export default function Gotchas() {
  return (
    <section id="gotchas" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 08</span>
          <h2 className="h2">Gotchas, so you don’t learn them live</h2>
          <p className="lead">Every one of these cost us time. They’re written down so they don’t cost you any.</p>
        </div>
        <img className="ill" src={illustration3Img.src} alt="" />
      </div>
      <div className="g2">
        <div className="card">
          <h3 className="h3">A/B tests always run before deliveries</h3>
          <p className="small">You can’t get around it by reordering. An A/B rule with no audience catches everyone, so the campaign deliveries would never fire. The fix is to give the A/B rule the audience <span className="mono">NOT (ACA OR T65)</span>.</p>
        </div>
        <div className="card">
          <h3 className="h3">A missing attribute means “unknown”, which silently skips the test</h3>
          <p className="small">NOT(unknown) is still unknown, so visitors with no campaign would never enter the A/B test. The fix is to always send <span className="mono">ehealth_campaign</span>, using <span className="mono">none</span> when there’s no campaign.</p>
        </div>
        <div className="card">
          <h3 className="h3">Names must match exactly, including case</h3>
          <p className="small">The variable value <span className="mono">Turning65</span> has to equal the CMS variation <em>key</em> <span className="mono">Turning65</span>, not its display name “Turning 65”. If they don’t match, <span className="mono">pickItem</span> quietly falls back to the original. That’s safe, but it can look like “targeting is broken”.</p>
        </div>
        <div className="card">
          <h3 className="h3">A variation is a full copy, not a patch</h3>
          <p className="small">Edits to inline blocks on the default page don’t flow into the variations (edits inside shared blocks do). <a href="#cmspage">Section 2</a> lists exactly what has drifted. G3 shows this: the default was cleaned up in v1695, but the variations reach the same result only through code safety nets until someone re-syncs them in Visual Builder. Don’t edit the default the day before the call unless you re-sync.</p>
        </div>
        <div className="card">
          <h3 className="h3">One decision per request</h3>
          <p className="small"><span className="mono">React.cache</span> stops <span className="mono">generateMetadata</span> and the page body from each calling <span className="mono">decide()</span>, which would record two impressions and double-count visitors.</p>
        </div>
        <div className="card">
          <h3 className="h3">Rule changes can take about 2 minutes to show</h3>
          <p className="small">The SDK polls every 10 seconds, but the datafile CDN caches it (TTL 120). Don’t change rules live during the demo and expect it to show immediately.</p>
        </div>
        <div className="card">
          <h3 className="h3">Serverless and event batching</h3>
          <p className="small"><span className="mono">batchSize: 1</span> plus a 1-second flush means impressions aren’t lost when Vercel freezes the function after it responds.</p>
        </div>
        <div className="card">
          <h3 className="h3">Why server-side and not Web Experimentation</h3>
          <p className="small">There’s no DOM swap, no flicker and no snippet. Crawlers see stable HTML, and targeting runs where the content is fetched. The Web Experimentation snippet was dropped from the demo scope (G11).</p>
        </div>
      </div>
    </section>
  );
}
