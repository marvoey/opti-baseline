// Section #personalization of /demo/flow, generated from the ehealth_friday_demo_flow.html
// canvas (v8). See ../page.tsx before editing by hand.

export default function Personalization() {
  return (
    <section id="personalization" className="card">
      <h2 className="h2">5. Personalization build recipe (G1)</h2>
      <p>This follows Optimizely&apos;s documented CMS SaaS and Feature Experimentation pattern. The FX flag variable <span className="mono">cms-saas-content-variation</span> must match the CMS variation key exactly, and it&apos;s case-sensitive. Graph returns variations only when you ask for them explicitly. (Source: <a className="link" href="https://docs.optimizely.com/feature-experimentation/docs/configure-optimizely-cms-saas" target="_blank" rel="noopener noreferrer">Configure the CMS (SaaS) integration</a>, <a className="link" href="https://docs.optimizely.com/graph/docs/content-variation" target="_blank" rel="noopener noreferrer">Graph: content variation</a>.)</p>
      <div className="grid2">
        <div className="box">
          <h4>CMS</h4>
          <ul className="dots text-sm">
            <li>On eHealth Home, create the variations <span className="mono">Turning65</span>, <span className="mono">AepSwitcher</span> and <span className="mono">AcaOep</span>. Override only the hero eyebrow, headline, highlight, subcopy and default plan. Publish the default first, then each variation. <strong>A variation must carry a full copy of the default page&apos;s blocks:</strong> Graph does not fall back to the default&apos;s block content, so a variation with only the hero set renders every other section empty.</li>
            <li>Graph sync confirmed: the original and all three variations are indexed and published, at the same URL <span className="mono">/</span>.</li>
          </ul>
        </div>
        <div className="box">
          <h4>Feature Experimentation</h4>
          <ul className="dots text-sm">
            <li>Flag <span className="mono">ehealth_home_hero</span>, with the string variable <span className="mono">cms-saas-content-variation</span> defaulting to <span className="mono">Original</span>.</li>
            <li>Two targeted delivery rules: audience &quot;eHealth ACA Open Enrollment&quot; → AcaOep, and &quot;eHealth Turning 65&quot; → Turning65. Both audiences match the user attribute <span className="mono">ehealth_campaign</span> (<span className="mono">aca</span> or <span className="mono">t65</span>). The front end sets it from <span className="mono">utm_campaign</span> and sends <span className="mono">none</span> when there is no campaign.</li>
            <li>An A/B rule for everyone who is <em>not</em> in a campaign audience: Original vs AepSwitcher at 50/50, audience &quot;NOT (ACA or Turning 65)&quot;. The primary metric is <span className="mono">plan_finder_submit</span>. <strong>Order matters:</strong> Feature Experimentation always evaluates A/B tests before targeted deliveries, so an A/B rule with no audience would catch every visitor first and the campaign rules would never fire. That is why this rule excludes the campaign audiences.</li>
          </ul>
        </div>
      </div>
      <h3>Status: live and verified on ehealth.optimoey.com (19 Nov)</h3>
      <div className="open">
        <span className="open-lbl">Open</span>
        <a className="pill pill-fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero" target="_blank" rel="noopener noreferrer">Flag <span aria-hidden="true">↗</span></a>
        <a className="pill pill-fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/rules/development" target="_blank" rel="noopener noreferrer">Dev rules <span aria-hidden="true">↗</span></a>
        <a className="pill pill-fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/variables" target="_blank" rel="noopener noreferrer">Variables <span aria-hidden="true">↗</span></a>
        <a className="pill pill-fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/variations" target="_blank" rel="noopener noreferrer">Variations <span aria-hidden="true">↗</span></a>
        <a className="pill pill-fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/rules/development/edit/ehealth_aep_hero_test" target="_blank" rel="noopener noreferrer">A/B rule <span aria-hidden="true">↗</span></a>
      </div>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Detail</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Attribute</td>
              <td className="mono">ehealth_campaign</td>
              <td>
                <span className="chip c-green">CREATED</span>
              </td>
            </tr>
            <tr>
              <td>Audiences</td>
              <td>eHealth ACA Open Enrollment (<span className="mono">aca</span>), eHealth Turning 65 (<span className="mono">t65</span>)</td>
              <td>
                <span className="chip c-green">CREATED</span>
              </td>
            </tr>
            <tr>
              <td>Events</td>
              <td className="mono">plan_finder_submit, agent_call_click</td>
              <td>
                <span className="chip c-green">CREATED</span>
              </td>
            </tr>
            <tr>
              <td>Flag</td>
              <td><span className="mono">ehealth_home_hero</span> with string variable <span className="mono">cms-saas-content-variation</span> (default <span className="mono">Original</span>, with a description explaining that it must match the CMS variation name exactly).</td>
              <td>
                <span className="chip c-green">CREATED</span>
                {' '}
                <span className="chip c-green">ON (DEV)</span>
              </td>
            </tr>
            <tr>
              <td>Rule 1: <span className="mono">ehealth_aca_delivery</span></td>
              <td>Targeted delivery to the ACA audience, serves <span className="mono">AcaOep</span></td>
              <td>
                <span className="chip c-green">RUNNING (DEV)</span>
              </td>
            </tr>
            <tr>
              <td>Rule 2: <span className="mono">ehealth_t65_delivery</span></td>
              <td>Targeted delivery to the Turning 65 audience, serves <span className="mono">Turning65</span></td>
              <td>
                <span className="chip c-green">RUNNING (DEV)</span>
              </td>
            </tr>
            <tr>
              <td>Rule 3: <span className="mono">ehealth_aep_hero_test</span></td>
              <td>A/B test 50/50, <span className="mono">Original</span> vs <span className="mono">AepSwitcher</span>, metric <span className="mono">plan_finder_submit</span>, audience NOT (ACA or Turning 65). Needs <span className="mono">ehealth_campaign</span> on every visitor: a missing attribute makes the audience &quot;unknown&quot;, and the rule would never match.</td>
              <td>
                <span className="chip c-green">RUNNING (DEV)</span>
              </td>
            </tr>
            <tr>
              <td>CMS variations</td>
              <td><span className="mono">AcaOep</span> (v1677), <span className="mono">Turning65</span> (v1676) and <span className="mono">AepSwitcher</span> (v1678) on eHealth Home, published 18 Nov. Each is a full copy of the default page&apos;s 12 blocks (identical to v1658 when created; G3 then changed the default to v1695) with only the hero eyebrow, headline, highlight, subcopy and default plan overridden. The hero image is reused. Verified live: the Turning 65 and ACA pages render all 10 content sections.</td>
              <td>
                <span className="chip c-green">PUBLISHED</span>
              </td>
            </tr>
            <tr>
              <td>Live check, 19 Nov</td>
              <td>ACA link: the ACA hero, with the Individual &amp; Family tile selected. T65 link: &quot;Turning 65? Find the Medicare plan that fits you&quot;. Plain visitors: 55 fresh test visitors split 30 AepSwitcher and 25 Original. Googlebot gets the original. All 10 content sections render on every variant. The tracking route is deployed (a fake event is rejected with a 400); a real conversion event was not fired. The test visits count as visitors in the A/B rule&apos;s results.</td>
              <td>
                <span className="chip c-green">VERIFIED</span>
              </td>
            </tr>
            <tr>
              <td>Production</td>
              <td>No rules yet. Development only. The live site evaluates the Development rules, so it uses the Development SDK key.</td>
              <td>
                <span className="chip c-warn">EMPTY</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm"><strong>Done and live.</strong> The code is deployed, the lockfile is committed and the three rules are running in Development. The A/B rule excludes the campaign audiences, and every visitor carries <span className="mono">ehealth_campaign</span> (<span className="mono">none</span> when there is no campaign), so plain visitors reach the 50/50 test.</p>
      <h3>What was built in the code</h3>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">proxy.ts</td>
              <td>Mints an anonymous <span className="mono">eh_vid</span> cookie, remembers <span className="mono">?utm_campaign=</span> in <span className="mono">eh_campaign</span>, and forwards both to the page as request headers. <span className="mono">?fx_reset=1</span> re-rolls the visitor for demos. Still routing and identity only, no fetching.</td>
            </tr>
            <tr>
              <td className="mono">lib/fx.ts</td>
              <td>The one decision point. FX JavaScript SDK v6, server-side: <span className="mono">decide(&apos;ehealth_home_hero&apos;)</span> with the <span className="mono">ehealth_campaign</span> attribute, returning the value of <span className="mono">cms-saas-content-variation</span>. Fails open to the default page. This is the seam where an Adobe Target server-side call would replace the body.</td>
            </tr>
            <tr>
              <td className="mono">app/[locale]/[[...slug]]/page.tsx</td>
              <td>Home page only. Calls <span className="mono">getContentByPath(&apos;/&apos;, &#123; variation: &#123; include: &apos;SOME&apos;, value: [key], includeOriginal: true &#125; &#125;)</span> (supported by <span className="mono">@optimizely/cms-sdk</span> 2.x) and picks the item whose <span className="mono">_metadata.variation</span> matches, otherwise the original. Crawlers always get the original.</td>
            </tr>
            <tr>
              <td className="mono">app/api/fx/track/route.ts</td>
              <td>Server route that records <span className="mono">plan_finder_submit</span> and <span className="mono">agent_call_click</span> against the same visitor id, so conversions attribute to the bucket the visitor saw.</td>
            </tr>
            <tr>
              <td className="mono">app/_components/PlanFinderWidget.tsx</td>
              <td>Calls the tracking route on a valid plan finder submit and on the phone link.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Go-live checklist (done 18–19 Nov)</h3>
      <ol className="num">
        <li><span className="chip c-green">DONE</span> <span className="mono">yarn.lock</span> includes <span className="mono">@optimizely/optimizely-sdk</span> 6.7 and is committed.</li>
        <li><span className="chip c-green">DONE</span> <span className="mono">OPTIMIZELY_FX_SDK_KEY</span> is set to the <strong>Development</strong> environment key, since the rules live there (confirmed by the live behaviour).</li>
        <li><span className="chip c-green">DONE</span> Deployed, with the flag and all three rules running in Development.</li>
        <li><span className="chip c-green">DONE</span> Tested on the live site. To repeat it, use a fresh incognito window: <span className="mono">/?utm_campaign=aca</span>, <span className="mono">/?utm_campaign=t65</span> and plain <span className="mono">/</span> (50/50). Add <span className="mono">?fx_reset=1</span> to re-roll the A/B bucket.</li>
      </ol>
      <ul className="dots text-sm">
        <li><strong>Keep the variations in sync:</strong> because each variation holds its own copy of the blocks, an edit to a block on the default eHealth Home (a testimonial, a carrier, a CTA) does not reach the variations. Repeat it in each one, or ask Mark to re-copy the default page into them. Avoid editing the default page the day before the call without re-syncing. G3 is the live example: the default was cleaned up in v1695, but the variations still hold the old content, so the cleanup reaches them through code (<span className="mono">cms/shared.ts</span>, <span className="mono">EhTestimonials</span>, <span className="mono">EhReviews</span>) until they are edited in Visual Builder.</li>
        <li>The SDK polls the datafile every 10 seconds (<span className="mono">updateInterval</span> in <span className="mono">lib/fx.ts</span>), but Optimizely&apos;s CDN caches the datafile too (the environment shows a cache TTL of 120), so allow up to a couple of minutes after changing a rule.</li>
        <li>The personalized home page is dynamic per request, which is fine for the demo. For production, cover edge caching per variation in the Akamai conversation, and cookie consent for the visitor id.</li>
      </ul>
    </section>
  );
}
