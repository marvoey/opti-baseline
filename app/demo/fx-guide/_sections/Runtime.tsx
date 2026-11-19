// Section #runtime of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.

export default function Runtime() {
  return (
    <section id="runtime" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 05</span>
          <h2 className="h2">What happens on each request, in order</h2>
          <p className="lead">This is the runtime sequence for one home-page visit, followed by the conversion. Each step names the file it happens in.</p>
        </div>
      </div>
      <ol className="tl">
        <li>
          <div className="badge">1</div>
          <div className="mini">
            <span className="cap">browser</span>
            <div className="h3">Visitor requests <span className="mono">/?utm_campaign=t65</span></div>
            <p className="small">It could also be a plain <span className="mono">/</span>, or <span className="mono">/?fx_reset=1</span> during the demo.</p>
          </div>
        </li>
        <li>
          <div className="badge">2</div>
          <div className="mini">
            <span className="cap">proxy.ts · identify()</span>
            <div className="h3">Identify the visitor</div>
            <p className="small">Reuses a valid <span className="mono">eh_vid</span> or creates <span className="mono">crypto.randomUUID()</span>. The campaign comes from the URL first, then the cookie, and is normalized to lower case <span className="mono">[a-z0-9_-]{'{'}1,32{'}'}</span>. <span className="mono">fx_reset</span> drops both.</p>
          </div>
        </li>
        <li>
          <div className="badge">3</div>
          <div className="mini">
            <span className="cap">proxy.ts · forwardedHeaders() / withVisitorCookies()</span>
            <div className="h3">Forward the identity as headers and set the cookies</div>
            <p className="small">The page can’t read a cookie set on <em>this</em> response, so on a first visit it reads <span className="mono">x-eh-vid</span> and <span className="mono">x-eh-campaign</span> instead. The proxy always overwrites those headers so a client can’t spoof them. Then it rewrites <span className="mono">/</span> to <span className="mono">/en/</span>.</p>
          </div>
        </li>
        <li>
          <div className="badge web">4</div>
          <div className="mini">
            <span className="cap">page.tsx · loadContent() · resolveHomeVariation()</span>
            <div className="h3">Personalize only the default-locale home page</div>
            <p className="small">The decision runs only when <span className="mono long">slug.length === 0 &amp;&amp; locale === &apos;en&apos;</span>. <span className="mono">/medicare</span>, <span className="mono">/es</span> and other pages skip FX entirely. Bots, and requests with no valid visitor ID, get the default page. The function is wrapped in <span className="mono">React.cache</span>, so <span className="mono">generateMetadata</span> and the page body share <strong>one decision and one impression</strong>.</p>
          </div>
        </li>
        <li>
          <div className="badge fx">5</div>
          <div className="mini">
            <span className="cap">lib/fx.ts · readyClient()</span>
            <div className="h3">Get a ready SDK client</div>
            <p className="small">One client per server process, kept on <span className="mono">globalThis</span>. It polls the datafile every 10 seconds and waits up to 2.5 seconds for the first datafile. With no key, a timeout or an error, it returns <span className="mono">null</span> and the visitor gets the default page.</p>
          </div>
        </li>
        <li>
          <div className="badge fx">6</div>
          <div className="mini">
            <span className="cap">lib/fx.ts · userContext() + decide()</span>
            <div className="h3">Build the user context and decide</div>
            <p className="small"><span className="mono long">createUserContext(vid, {'{'} ehealth_campaign: campaign ?? &apos;none&apos; {'}'})</span>, then <span className="mono">decide(&apos;ehealth_home_hero&apos;)</span>. The SDK walks the ruleset locally from the cached datafile (no network call): the A/B test first, then the ACA delivery, then the T65 delivery, then everyone else.</p>
          </div>
        </li>
        <li>
          <div className="badge fx">7</div>
          <div className="mini">
            <span className="cap">lib/fx.ts</span>
            <div className="h3">Read the variable and record the impression</div>
            <p className="small">Reads <span className="mono long">decision.variables[&apos;cms-saas-content-variation&apos;]</span>. <span className="mono">Original</span> or empty becomes <span className="mono">null</span>, meaning the default page. For the A/B rule, <span className="mono">decide()</span> also sends the decision impression. <span className="mono">batchSize: 1</span> sends it right away, so a frozen serverless instance doesn’t lose it.</p>
          </div>
        </li>
        <li>
          <div className="badge cms">8</div>
          <div className="mini">
            <span className="cap">page.tsx · getContentByPath() + pickItem()</span>
            <div className="h3">Ask Graph for that variation, with a safety net</div>
            <p className="small"><span className="mono long">variation: {'{'} include: &apos;SOME&apos;, value: [&apos;Turning65&apos;], includeOriginal: true {'}'}</span> returns both the variation and the original. <span className="mono">pickItem</span> chooses the item whose <span className="mono">_metadata.variation</span> matches, otherwise the original. A missing or unpublished variation never breaks the page.</p>
          </div>
        </li>
        <li>
          <div className="badge ok">9</div>
          <div className="mini">
            <span className="cap">page.tsx · OptimizelyComponent</span>
            <div className="h3">Render on the server</div>
            <p className="small">The HTML arrives already personalized: no flicker, no client script and no layout shift. The G3 code safety nets (testimonial de-duplication, fixing dead <span className="mono">#</span> links, hiding placeholder reviews) apply to the variations too.</p>
          </div>
        </li>
        <li>
          <div className="badge ok">10</div>
          <div className="mini">
            <span className="cap">PlanFinderWidget.tsx · /api/fx/track · trackFxEvent()</span>
            <div className="h3">The visitor converts</div>
            <p className="small">A valid ZIP submit (or a phone click) sends <span className="mono long">POST /api/fx/track {'{'}event{'}'}</span> with <span className="mono">keepalive</span>, fire-and-forget. The route reads the <span className="mono">eh_vid</span> and <span className="mono">eh_campaign</span> cookies and checks the event against an allow-list. It then calls <span className="mono">trackEvent</span> for the <em>same</em> visitor and attributes, so the conversion counts toward the bucket the visitor saw.</p>
          </div>
        </li>
      </ol>
    </section>
  );
}
