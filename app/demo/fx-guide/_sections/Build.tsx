// Section #build of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.

export default function Build() {
  return (
    <section id="build" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 04</span>
          <h2 className="h2">Build order: what was set up, step by step</h2>
          <p className="lead">The order matters. Content has to exist before FX can point at it. Attributes come before audiences, audiences and events come before rules, and the code reads all of it at the end. Follow these steps in order to rebuild this for another prospect.</p>
        </div>
      </div>
      <ol className="steps">
        <li className="card step">
          <div className="badge cms">1</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Create the CMS content variations</h3>
              <span className="tag cms">CMS · Visual Builder</span>
            </div>
            <ul className="dots">
              <li>On eHealth Home, add the variations <span className="mono">Turning65</span>, <span className="mono">AepSwitcher</span> and <span className="mono">AcaOep</span>. Override only the hero eyebrow, headline, highlight, subcopy and default plan. The hero image is reused.</li>
              <li><strong>Each variation holds a full copy of the default page’s 12 blocks.</strong> Graph doesn’t fall back to the default page’s block content, so a variation with only the hero filled in renders every other section empty.</li>
              <li>Publish the default first, then each variation (all published 18 Nov). Check that Graph has indexed the original and all three variations at the same URL, <span className="mono">/</span>.</li>
              <li><em>API limitation:</em> the CMS REST API writes only the shared draft and can’t create or edit variation drafts, so variations are built in Visual Builder.</li>
              <li>The page itself, its 12 sections and what each variation overrides are laid out in <a href="#cmspage">section 2</a>.</li>
            </ul>
          </div>
        </li>
        <li className="card step">
          <div className="badge fx">2</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Pick the FX project and environment</h3>
              <span className="tag fx">FX</span>
            </div>
            <ul className="dots">
              <li>Project <span className="mono">6229025884995584</span>, environment <strong>Development</strong> (ID <span className="mono">751794584127901</span>).</li>
              <li>Copy that environment’s SDK key into the server-only env var <span className="mono">OPTIMIZELY_FX_SDK_KEY</span>, both in <span className="mono">.env</span> and in Vercel. It must not have a <span className="mono">NEXT_PUBLIC_</span> prefix, since the browser never talks to FX.</li>
              <li>The live site uses the <em>Development</em> key on purpose, because that’s where the rules run. Production has no rules yet.</li>
            </ul>
          </div>
        </li>
        <li className="card step">
          <div className="badge fx">3</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Create the attribute <span className="mono">ehealth_campaign</span></h3>
              <span className="tag fx">FX · Audiences, Attributes</span>
            </div>
            <p className="small">This is the only signal the audiences use. The front end fills it from <span className="mono">?utm_campaign=</span>, last touch wins, and it’s kept for 30 days in the <span className="mono">eh_campaign</span> cookie.</p>
          </div>
        </li>
        <li className="card step">
          <div className="badge fx">4</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Create the two audiences</h3>
              <span className="tag fx">FX · Audiences</span>
            </div>
            <div className="g2" style={{ marginTop: '12px' }}>
              <div className="mini c-white">
                <div className="h4">eHealth ACA Open Enrollment</div>
                <div className="cap" style={{ marginTop: '4px' }}>4650831763472384</div>
                <p className="small" style={{ marginTop: '6px' }}>ehealth_campaign <span className="mono">=</span> &quot;aca&quot;</p>
              </div>
              <div className="mini c-white">
                <div className="h4">eHealth Turning 65</div>
                <div className="cap" style={{ marginTop: '4px' }}>5799607404331008</div>
                <p className="small" style={{ marginTop: '6px' }}>ehealth_campaign <span className="mono">=</span> &quot;t65&quot;</p>
              </div>
            </div>
          </div>
        </li>
        <li className="card step">
          <div className="badge fx">5</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Create the conversion events</h3>
              <span className="tag fx">FX · Events</span>
            </div>
            <ul className="dots">
              <li><span className="mono">plan_finder_submit</span> (<span className="mono">4635733879685120</span>) fires on a valid 5-digit ZIP submit in the plan finder.</li>
              <li><span className="mono">agent_call_click</span> (<span className="mono">6698981474959360</span>) fires when someone clicks the licensed-agent phone link.</li>
            </ul>
          </div>
        </li>
        <li className="card step">
          <div className="badge fx">6</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Create the flag, variable and flag variations</h3>
              <span className="tag fx">FX · Flags</span>
            </div>
            <ul className="dots">
              <li>Flag <span className="mono">ehealth_home_hero</span>.</li>
              <li>String variable <span className="mono">cms-saas-content-variation</span>, default <span className="mono">Original</span>, with a description that says it must match the CMS variation name exactly.</li>
              <li>Flag variations, each setting the variable:</li>
            </ul>
            <div className="tbl" style={{ marginTop: '12px', maxWidth: '640px' }}>
              <table>
                <thead>
                  <tr>
                    <th>FX variation</th>
                    <th>ID</th>
                    <th>Variable value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="mono">Original</span></td>
                    <td><span className="mono">1965357</span></td>
                    <td><span className="mono">Original</span>, which serves the default page</td>
                  </tr>
                  <tr>
                    <td><span className="mono">AepSwitcher</span></td>
                    <td><span className="mono">1965358</span></td>
                    <td><span className="mono">AepSwitcher</span></td>
                  </tr>
                  <tr>
                    <td><span className="mono">AcaOep</span></td>
                    <td><span className="mono">1965353</span></td>
                    <td><span className="mono">AcaOep</span></td>
                  </tr>
                  <tr>
                    <td><span className="mono">Turning65</span></td>
                    <td><span className="mono">1965356</span></td>
                    <td><span className="mono">Turning65</span></td>
                  </tr>
                  <tr>
                    <td><span className="mono">on</span> / <span className="mono">off</span></td>
                    <td><span className="mono">1965342</span> / <span className="mono">1965341</span></td>
                    <td>Built-in. Not used by the rules.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </li>
        <li className="card dark step">
          <div className="badge fx">7</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Add the three rules in Development, and design for evaluation order</h3>
              <span className="tag fx">The important step</span>
            </div>
            <p className="small">Feature Experimentation <strong>always evaluates experiments (A/B tests) first, then targeted deliveries, then “Then, for everyone else”</strong>, whatever order you created them in. That’s why the A/B rule has to <em>exclude</em> the campaign audiences. Without the exclusion, it would catch campaign visitors before their delivery rule got a chance.</p>
            <div className="rules">
              <div className="mini c-fx">
                <div className="ord">Evaluated 1st · A/B test</div>
                <div className="h4 mono plain" style={{ marginTop: '6px', fontWeight: '400' }}>ehealth_aep_hero_test</div>
                <div className="id">1995481</div>
                <ul className="dots small" style={{ marginTop: '10px' }}>
                  <li>Audience: <span className="mono">NOT (ACA OR Turning 65)</span></li>
                  <li>50/50: <span className="mono">Original</span> vs <span className="mono">AepSwitcher</span></li>
                  <li>Primary metric: <span className="mono">plan_finder_submit</span></li>
                </ul>
              </div>
              <div className="mini">
                <div className="ord">Evaluated 2nd · Targeted delivery</div>
                <div className="h4 mono plain" style={{ marginTop: '6px', fontWeight: '400' }}>ehealth_aca_delivery</div>
                <div className="id">1995479</div>
                <ul className="dots small" style={{ marginTop: '10px' }}>
                  <li>Audience: eHealth ACA Open Enrollment</li>
                  <li>100% to <span className="mono">AcaOep</span></li>
                </ul>
              </div>
              <div className="mini">
                <div className="ord">Evaluated 3rd · Targeted delivery</div>
                <div className="h4 mono plain" style={{ marginTop: '6px', fontWeight: '400' }}>ehealth_t65_delivery</div>
                <div className="id">1995480</div>
                <ul className="dots small" style={{ marginTop: '10px' }}>
                  <li>Audience: eHealth Turning 65</li>
                  <li>100% to <span className="mono">Turning65</span></li>
                </ul>
              </div>
            </div>
            <p className="small" style={{ marginTop: '14px' }}>Then, for everyone else: in practice nobody reaches it, because every visitor carries the attribute and so matches either a campaign delivery or the A/B audience. If anyone did, the code treats <span className="mono">Original</span>, or a missing variable value, as “serve the default page”.</p>
          </div>
        </li>
        <li className="card step">
          <div className="badge web">8</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Wire up the front end (five files)</h3>
              <span className="tag web">Next.js</span>
            </div>
            <ol className="plain small">
              <li><span className="mono">lib/visitor.ts</span>: cookie and header names, plus validators for the visitor ID and campaign. Identity only.</li>
              <li><span className="mono">proxy.ts</span>: sets <span className="mono">eh_vid</span> and <span className="mono">eh_campaign</span> and forwards them as request headers. <span className="mono">?fx_reset=1</span> re-rolls the visitor.</li>
              <li><span className="mono">lib/fx.ts</span>: the single decision point. One SDK client per process, fails open.</li>
              <li><span className="mono long">app/[locale]/[[...slug]]/page.tsx</span>: on the home page only, asks FX for the variation, then asks Graph for it.</li>
              <li><span className="mono long">app/api/fx/track/route.ts</span> + <span className="mono">PlanFinderWidget.tsx</span>: records conversions server-side against the same visitor.</li>
            </ol>
            <p className="small" style={{ marginTop: '10px' }}>Dependency: <span className="mono">@optimizely/optimizely-sdk</span> 6.7, committed in <span className="mono">yarn.lock</span>. See <a href="#code">section 7</a> for the code.</p>
          </div>
        </li>
        <li className="card step">
          <div className="badge ok">9</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Turn it on, deploy and verify</h3>
              <span className="tag ok">Done 18–19 Nov</span>
            </div>
            <ul className="dots">
              <li>Flag ON in Development, all three rules running. Deployed to Vercel at <span className="mono">ehealth.optimoey.com</span>.</li>
              <li>Live check: the ACA link showed the ACA hero with the Individual &amp; Family tile selected. The T65 link showed the Turning 65 hero. <strong>55 fresh visitors split 30 AepSwitcher / 25 Original.</strong> Googlebot got the original. All 10 content sections rendered on every variant.</li>
              <li>The tracking route is live (a fake event gets a 400). No real conversion has been fired yet, and the test visits count as visitors in the A/B results.</li>
            </ul>
          </div>
        </li>
      </ol>
    </section>
  );
}
