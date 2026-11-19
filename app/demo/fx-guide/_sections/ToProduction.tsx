// Section #next of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.
/* eslint-disable @next/next/no-img-element -- static SVG illustrations, nothing to optimize */
import illustration4Img from '../_assets/illustration-4.svg';
import icon4Img from '../_assets/icon-4.svg';
import icon5Img from '../_assets/icon-5.svg';
import icon6Img from '../_assets/icon-6.svg';
import icon7Img from '../_assets/icon-7.svg';
import icon8Img from '../_assets/icon-8.svg';
import icon9Img from '../_assets/icon-9.svg';

export default function ToProduction() {
  return (
    <section id="next" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 11</span>
          <h2 className="h2">From demo to production: what eHealth would add</h2>
        </div>
        <img className="ill" src={illustration4Img.src} alt="" />
      </div>
      <div className="g2">
        <div className="card icard">
          <img src={icon4Img.src} alt="" />
          <div>
            <h3 className="h3">Environments</h3>
            <p className="small">Recreate the rules in the Production environment and switch <span className="mono">OPTIMIZELY_FX_SDK_KEY</span> per deploy target (preview uses Development, prod uses Production).</p>
          </div>
        </div>
        <div className="card icard">
          <img src={icon5Img.src} alt="" />
          <div>
            <h3 className="h3">Edge caching (Akamai)</h3>
            <p className="small">The personalized home page is dynamic per request. For scale, cache per variation, for example with a variation key at the edge or a cache key built from the bucket. Cover this in the Akamai conversation.</p>
          </div>
        </div>
        <div className="card icard">
          <img src={icon6Img.src} alt="" />
          <div>
            <h3 className="h3">Consent</h3>
            <p className="small">Gate the <span className="mono">eh_vid</span> cookie and event dispatch behind eHealth’s consent manager. Without consent, the visitor gets the default page, which the fail-open design already handles.</p>
          </div>
        </div>
        <div className="card icard">
          <img src={icon7Img.src} alt="" />
          <div>
            <h3 className="h3">Richer targeting</h3>
            <p className="small">Add attributes such as age band, state, plan interest or a CRM segment through ODP or Real-Time Segments. Same flag, more audiences, no change to the CMS.</p>
          </div>
        </div>
        <div className="card icard">
          <img src={icon8Img.src} alt="" />
          <div>
            <h3 className="h3">Keeping variations in sync</h3>
            <p className="small">Set an editorial rule: when shared blocks on the default page change, re-sync each variation, or keep shared sections in shared blocks that every variation references.</p>
          </div>
        </div>
        <div className="card icard">
          <img src={icon9Img.src} alt="" />
          <div>
            <h3 className="h3">More metrics</h3>
            <p className="small">Add downstream events (quote started, application submitted) as secondary metrics so the hero test is judged on revenue, not just clicks.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
