// Section #matrix of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.
/* eslint-disable @next/next/no-img-element -- static SVG illustrations, nothing to optimize */
import illustration2Img from '../_assets/illustration-2.svg';

export default function Matrix() {
  return (
    <section id="matrix" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 06</span>
          <h2 className="h2">Who sees what: the decision matrix</h2>
        </div>
        <img className="ill" src={illustration2Img.src} alt="" />
      </div>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>ehealth_campaign</th>
              <th>Rule hit</th>
              <th>Variable</th>
              <th>Rendered</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="mono">/?utm_campaign=aca</span></td>
              <td><span className="mono">aca</span></td>
              <td>A/B skipped (audience fails), then <span className="mono">ehealth_aca_delivery</span></td>
              <td><span className="mono">AcaOep</span></td>
              <td>ACA OEP hero, Individual &amp; Family tile selected</td>
            </tr>
            <tr>
              <td><span className="mono">/?utm_campaign=t65</span></td>
              <td><span className="mono">t65</span></td>
              <td>A/B skipped, then <span className="mono">ehealth_t65_delivery</span></td>
              <td><span className="mono">Turning65</span></td>
              <td>“Turning 65? Find the Medicare plan that fits you”</td>
            </tr>
            <tr>
              <td>Plain <span className="mono">/</span></td>
              <td><span className="mono">none</span></td>
              <td><span className="mono">ehealth_aep_hero_test</span></td>
              <td><span className="mono">Original</span> or <span className="mono">AepSwitcher</span></td>
              <td>50/50, sticky per <span className="mono">eh_vid</span></td>
            </tr>
            <tr>
              <td>Other campaign, e.g. <span className="mono">?utm_campaign=spring</span></td>
              <td><span className="mono">spring</span></td>
              <td>A/B test (NOT aca/t65 is true)</td>
              <td><span className="mono">Original</span> or <span className="mono">AepSwitcher</span></td>
              <td>Joins the 50/50 test</td>
            </tr>
            <tr>
              <td>Came back later without UTM</td>
              <td>Cookie value (30 days)</td>
              <td>Same as first visit</td>
              <td>Same</td>
              <td>Consistent experience</td>
            </tr>
            <tr>
              <td>Googlebot or another crawler</td>
              <td>n/a</td>
              <td>No decision (<span className="mono">isLikelyBot</span>)</td>
              <td>n/a</td>
              <td>Default page: stable SEO, clean data</td>
            </tr>
            <tr>
              <td>SDK key missing, datafile timeout or error</td>
              <td>n/a</td>
              <td>Fails open</td>
              <td>n/a</td>
              <td>Default page</td>
            </tr>
            <tr>
              <td><span className="mono">/es</span>, <span className="mono">/medicare</span>, any other page</td>
              <td>n/a</td>
              <td>FX not called</td>
              <td>n/a</td>
              <td>That page’s normal content</td>
            </tr>
            <tr>
              <td><span className="mono">/?fx_reset=1</span></td>
              <td>Cleared, so <span className="mono">none</span></td>
              <td>A/B test with a new visitor ID</td>
              <td>Re-rolled</td>
              <td>Demo helper to show the split</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
