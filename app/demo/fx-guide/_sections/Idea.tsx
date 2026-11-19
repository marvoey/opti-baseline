// Section #idea of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.
/* eslint-disable @next/next/no-img-element -- static SVG illustrations, nothing to optimize */
import icon1Img from '../_assets/icon-1.svg';
import icon2Img from '../_assets/icon-2.svg';
import icon3Img from '../_assets/icon-3.svg';

export default function Idea() {
  return (
    <section id="idea" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 01</span>
          <h2 className="h2">The big idea: three systems, one job each</h2>
          <p className="lead">No system does another’s job. Editors never set targeting logic in the CMS. Feature Experimentation never stores content, only a <em>name</em> (the variation key). The front end ties the two together in one place.</p>
        </div>
      </div>
      <div className="g3">
        <div className="card c-cms">
          <div className="sys-head"><img src={icon1Img.src} alt="" /><span className="h4">Author · CMS SaaS</span></div>
          <h3 className="h3">What each variant says</h3>
          <p className="small">eHealth Home (<span className="mono">055218e1…7b02</span>) has three <strong>content variations</strong>, <span className="mono">AcaOep</span>, <span className="mono">Turning65</span> and <span className="mono">AepSwitcher</span>, built in Visual Builder. Each one overrides only the hero copy and the default plan.</p>
        </div>
        <div className="card c-fx">
          <div className="sys-head"><img src={icon2Img.src} alt="" /><span className="h4">Decide · Feature Experimentation</span></div>
          <h3 className="h3">Who sees which variant</h3>
          <p className="small">The flag <span className="mono">ehealth_home_hero</span> runs two targeted deliveries (campaign audiences) and one 50/50 A/B test. Its string variable <span className="mono">cms-saas-content-variation</span> returns the CMS variation key.</p>
        </div>
        <div className="card c-web">
          <div className="sys-head"><img src={icon3Img.src} alt="" /><span className="h4">Deliver · Graph + Next.js</span></div>
          <h3 className="h3">Serve it with no flicker</h3>
          <p className="small">The server-rendered catch-all page asks Graph for <span className="mono">/</span> <em>plus</em> the variation it was told to show, picks the matching item, and renders HTML. Nothing swaps in the browser.</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '16px', padding: '22px 26px' }}>
        <div className="flow" role="group" aria-label="Request flow, six steps">
          <div className="node c-white"><i className="n">1</i><b>Browser</b><span className="t">GET <span className="mono">/?utm_campaign=t65</span></span></div>
          <div className="node c-web"><i className="n">2</i><b>proxy.ts</b><span className="t">Mints <span className="mono">eh_vid</span>, remembers the campaign in <span className="mono">eh_campaign</span>, forwards both as <span className="mono">x-eh-*</span> headers</span></div>
          <div className="node c-fx"><i className="n">3</i><b>lib/fx.ts</b><span className="t"><span className="mono">decide(&apos;ehealth_home_hero&apos;)</span> with the attribute <span className="mono">ehealth_campaign=&quot;t65&quot;</span></span></div>
          <div className="node c-fx"><i className="n">4</i><b>FX ruleset</b><span className="t">A/B test skipped, t65 delivery matches, variable = <span className="mono">&quot;Turning65&quot;</span></span></div>
          <div className="node c-cms"><i className="n">5</i><b>Graph</b><span className="t"><span className="mono">getContentByPath(&apos;/&apos;)</span> asking for variation <span className="mono">Turning65</span> plus the original</span></div>
          <div className="node c-ok"><i className="n">6</i><b>Server-rendered HTML</b><span className="t">“Turning 65? Find the Medicare plan that fits you”</span></div>
        </div>
      </div>
      <p className="small" style={{ marginTop: '14px', maxWidth: '860px' }}><strong>Why it matters for eHealth:</strong> the decision layer is one function. In <span className="mono">lib/fx.ts</span>, Adobe Target’s server-side delivery could return the same variation key, and the CMS, the variations and the editors’ workflow would stay exactly the same.</p>
    </section>
  );
}
