// Section #verify of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.

export default function Verify() {
  return (
    <section id="verify" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 10</span>
          <h2 className="h2">Pre-call test script: 5 minutes, Friday morning</h2>
        </div>
      </div>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Do this</th>
              <th>Expect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Open a new incognito window and go to <span className="mono">/?utm_campaign=aca</span></td>
              <td>ACA OEP hero, Individual tile pre-selected, 10 content sections</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Open a new incognito window and go to <span className="mono">/?utm_campaign=t65</span></td>
              <td>Turning 65 hero with the “New to Medicare?” eyebrow</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Go to <span className="mono">/?fx_reset=1</span> and refresh about 6 times</td>
              <td>A mix of the default hero and the AEP switcher hero</td>
            </tr>
            <tr>
              <td>4</td>
              <td>In the same window, go to plain <span className="mono">/</span></td>
              <td>The same hero as the last reset (it’s sticky)</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Run <span className="mono long">curl -A Googlebot https://ehealth.optimoey.com/</span></td>
              <td>The default (original) hero</td>
            </tr>
            <tr>
              <td>6</td>
              <td>In DevTools, Network tab, submit the plan finder with a valid ZIP</td>
              <td><span className="mono">POST /api/fx/track</span> returns 204</td>
            </tr>
            <tr>
              <td>7</td>
              <td>In FX, open the A/B rule, then Results</td>
              <td>Visitors are counted (this includes the 55 test visits from 19 Nov)</td>
            </tr>
            <tr>
              <td>8</td>
              <td>View Source on the home page</td>
              <td>No Web Experimentation snippet. This needs <span className="mono long">NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID</span> removed in Vercel, then a redeploy.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small" style={{ marginTop: '14px', maxWidth: '860px' }}>On the live site (<span className="mono">ehealth.optimoey.com</span>), explain each decision from what you can see: the hero text tells you which variation rendered, and DevTools, Application tab, Cookies shows <span className="mono">eh_vid</span> and <span className="mono">eh_campaign</span>. The <span className="mono long">[fx] ehealth_home_hero -&gt; rule=…</span> decision log only prints outside production (<span className="mono long">NODE_ENV !== &apos;production&apos;</span>), so it won’t appear live. Use it on local dev when you want to walk through a decision step by step.</p>
    </section>
  );
}
