// Section #checklist of /demo/flow, generated from the ehealth_friday_demo_flow.html
// canvas (v8). See ../page.tsx before editing by hand.

export default function Checklist() {
  return (
    <section id="checklist" className="card">
      <h2 className="h2">8. Pre-call checklist</h2>
      <div className="grid2">
        <div className="box">
          <h4>Wednesday (today)</h4>
          <ul className="dots text-sm">
            <li>G3 cleanup in the CMS: testimonials, links, hide Reviews</li>
            <li>G2 banner and settings in the CMS</li>
            <li>G11 decide about the Web Experimentation snippet</li>
          </ul>
        </div>
        <div className="box">
          <h4>Thursday</h4>
          <ul className="dots text-sm">
            <li>G1 personalization: FX flag and 3 CMS variations are done and the code is written. Still to do: <span className="mono">yarn install</span>, set the SDK key, deploy, then enable the rules and test</li>
            <li>G4 sitemap, robots, canonical and JSON-LD</li>
            <li>G5 <span className="mono">es</span> locale. Leave the alt text empty for the live Mark moment</li>
            <li>If time allows: G6 taxonomy and paid landing page, G7 FAQ block</li>
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
      <p className="text-xs mt-4 opacity-80">Sources: the live site, crawled 18 Nov 2026; eHealth Home in the CMS (v1658); the project source through the source-file tools (registry, page renderer, layout, siteConfig, siteHost, locales, plan finder); the eHealth RFI; and Optimizely docs on the CMS SaaS + Feature Experimentation integration and Graph content variations. Enrollment dates are standard federal windows; confirm any state-specific ACA dates.</p>
    </section>
  );
}
