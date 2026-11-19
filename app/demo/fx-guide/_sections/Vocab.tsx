// Section #vocab of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.

export default function Vocab() {
  return (
    <section id="vocab" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 03</span>
          <h2 className="h2">Vocabulary: “variation” means two things</h2>
          <p className="lead">The word “variation” means something different in each product, and that trips people up. In this build the names match on purpose: the FX variation <span className="mono">Turning65</span> sets the variable to <span className="mono">Turning65</span>, which is the CMS variation <span className="mono">Turning65</span>.</p>
        </div>
      </div>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Term</th>
              <th>Where it lives</th>
              <th>In this demo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Content variation</td>
              <td>CMS SaaS</td>
              <td>An alternate version of a page at the same URL, identified by a <em>variation key</em>. <span className="mono">AcaOep</span> (v1677), <span className="mono">Turning65</span> (v1676), <span className="mono">AepSwitcher</span> (v1678) on eHealth Home. See <a href="#cmspage">section 2</a>.</td>
            </tr>
            <tr>
              <td>Flag</td>
              <td>FX</td>
              <td><span className="mono">ehealth_home_hero</span> (ID 638439). The container for the rules and the variable.</td>
            </tr>
            <tr>
              <td>Flag variable</td>
              <td>FX</td>
              <td><span className="mono">cms-saas-content-variation</span>, a string with default <span className="mono">Original</span>. Its value must match the CMS variation key exactly, including case.</td>
            </tr>
            <tr>
              <td>Flag variation</td>
              <td>FX</td>
              <td>A named set of variable values: <span className="mono">Original</span>, <span className="mono">AepSwitcher</span>, <span className="mono">AcaOep</span>, <span className="mono">Turning65</span> (plus the built-in <span className="mono">on</span> / <span className="mono">off</span>).</td>
            </tr>
            <tr>
              <td>Attribute</td>
              <td>FX</td>
              <td><span className="mono">ehealth_campaign</span>. The code sends it on every decision (<span className="mono">aca</span>, <span className="mono">t65</span>, any other campaign, or <span className="mono">none</span>).</td>
            </tr>
            <tr>
              <td>Audience</td>
              <td>FX</td>
              <td>“eHealth ACA Open Enrollment” (<span className="mono">ehealth_campaign = aca</span>) and “eHealth Turning 65” (<span className="mono">= t65</span>).</td>
            </tr>
            <tr>
              <td>Rule</td>
              <td>FX</td>
              <td>A targeted delivery (no stats, 100% to one variation) or an A/B test (randomized, measured).</td>
            </tr>
            <tr>
              <td>Event / metric</td>
              <td>FX</td>
              <td><span className="mono">plan_finder_submit</span> (the A/B test’s primary metric) and <span className="mono">agent_call_click</span>.</td>
            </tr>
            <tr>
              <td>Visitor ID</td>
              <td>Front end</td>
              <td><span className="mono">eh_vid</span>, an anonymous UUID cookie (httpOnly, 1 year). FX buckets on it, so each visitor keeps the same experience.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
