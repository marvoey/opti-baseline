// Section #checklist of /demo/flow, generated from the ehealth_friday_demo_flow.html
// canvas (v8). See ../page.tsx before editing by hand.

export default function Checklist() {
  return (
    <section id="checklist" className="card">
      <h2 className="h2">8. Pre-call checklist</h2>
      <div className="grid2">
        <div className="box">
          <h4>Wednesday</h4>
          <ul className="dots text-sm">
            <li><span className="chip c-green">DONE</span> G3 cleanup: deployed and verified live on all four variants on 19 Nov</li>
            <li><span className="chip c-green">DONE</span> G2 banner, phone and legal line in the CMS (live)</li>
            <li>G11 decided: no Web Experimentation. <strong>Remove</strong> <span className="mono">NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID</span> in Vercel and redeploy</li>
          </ul>
        </div>
        <div className="box">
          <h4>Thursday (today)</h4>
          <ul className="dots text-sm">
            <li><span className="chip c-green">DONE</span> G1 personalization: live and verified on 19 Nov</li>
            <li><span className="chip c-warn">ON DEPLOY</span> G4 sitemap, robots, llms.txt, canonical, hreflang and JSON-LD: built and tested locally</li>
            <li><span className="chip c-green">DONE</span> G5 <span className="mono">es</span> locale and Spanish Home. Fix the &quot;eSalud&quot; page title first. Leave the alt text empty for the live Mark moment</li>
            <li><span className="chip c-green">DONE</span> G6 taxonomy, paid landing page and query view (live)</li>
            <li><span className="chip c-warn">ON DEPLOY</span> G7 FAQ block and fuller product pages: published in the CMS, the FAQ shows after the deploy</li>
            <li><strong>Commit and deploy</strong> the G4 and G7 code (new routes, <span className="mono">lib/seo.ts</span>, <span className="mono">lib/jsonLd.ts</span>, <span className="mono">cms/EhFaq.tsx</span>, and the <span className="mono">proxy.ts</span> and layout changes). Then check <span className="mono">/robots.txt</span>, <span className="mono">/sitemap.xml</span>, <span className="mono">/llms.txt</span>, View Source on <span className="mono">/medicare</span> (canonical, JSON-LD, FAQ) and on <span className="mono">/es</span> (lang, hreflang)</li>
            <li><span className="chip c-green">DONE</span> G2 and G6 code deployed (19 Nov) and rechecked on the live site: <span className="mono">/lp/aca-2027</span> is noindex with the minimal header, the menu has no Landing pages item, and the <span className="mono">/demo</span> pages load</li>
          </ul>
        </div>
        <div className="box">
          <h4>Friday morning</h4>
          <ul className="dots text-sm">
            <li>Dry run the full 60 minutes. Pre-open tabs: <a className="link" href="https://ehealth.optimoey.com/" target="_blank" rel="noopener noreferrer">live site</a>, <a className="link" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor</a>, <a className="link" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero" target="_blank" rel="noopener noreferrer">FX flag</a>, <a className="link" href="https://mark.optimizely.com" target="_blank" rel="noopener noreferrer">Mark</a></li>
            <li>Test <a className="link" href="https://ehealth.optimoey.com/?utm_campaign=aca" target="_blank" rel="noopener noreferrer">?utm_campaign=aca</a> and <a className="link" href="https://ehealth.optimoey.com/?utm_campaign=t65" target="_blank" rel="noopener noreferrer">t65</a> in an incognito window</li>
            <li>Fallback: screenshots or a recording of Acts 3 and 4 in case Graph sync is slow</li>
          </ul>
        </div>
        <div className="box">
          <h4>Have ready as backup</h4>
          <ul className="dots text-sm">
            <li>The <a className="link" href="/demo/rfi" target="_blank" rel="noopener noreferrer">RFI summary canvas</a> (requirement IDs)</li>
            <li>An architecture slide: CMS → Graph → Next.js → Akamai, with the decision engine (FX or Target) to the side</li>
            <li>Version history on eHealth Home to show governance</li>
          </ul>
        </div>
      </div>
      <p className="text-xs mt-4 opacity-80">Sources: the live site, crawled 18 Nov 2026; eHealth Home in the CMS (v1695); the project source through the source-file tools (registry, page renderer, layout, siteConfig, siteHost, locales, plan finder); the eHealth RFI; and Optimizely docs on the CMS SaaS + Feature Experimentation integration and Graph content variations. Enrollment dates are standard federal windows; confirm any state-specific ACA dates.</p>
    </section>
  );
}
