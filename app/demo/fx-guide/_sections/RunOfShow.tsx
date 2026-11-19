// Section #demo of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.

export default function RunOfShow() {
  return (
    <section id="demo" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 09 · 10 min · RFI 8.1–8.11</span>
          <h2 className="h2">Run of show: personalize and test, keeping Adobe Target</h2>
        </div>
      </div>
      <div className="pills"><a className="pill cms" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor <svg className="ico"><use href="#i-ext" /></svg></a> <a className="pill fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero" target="_blank" rel="noopener noreferrer">FX flag <svg className="ico"><use href="#i-ext" /></svg></a> <a className="pill fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/rules/development" target="_blank" rel="noopener noreferrer">FX rules (Dev) <svg className="ico"><use href="#i-ext" /></svg></a> <a className="pill fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/variables" target="_blank" rel="noopener noreferrer">Variables <svg className="ico"><use href="#i-ext" /></svg></a> <a className="pill fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/rules/development/edit/ehealth_aep_hero_test" target="_blank" rel="noopener noreferrer">A/B rule <svg className="ico"><use href="#i-ext" /></svg></a> <a className="pill" href="https://ehealth.optimoey.com/?utm_campaign=aca" target="_blank" rel="noopener noreferrer">?utm_campaign=aca <svg className="ico"><use href="#i-ext" /></svg></a> <a className="pill" href="https://ehealth.optimoey.com/?utm_campaign=t65" target="_blank" rel="noopener noreferrer">?utm_campaign=t65 <svg className="ico"><use href="#i-ext" /></svg></a> <a className="pill" href="https://ehealth.optimoey.com/?fx_reset=1" target="_blank" rel="noopener noreferrer">?fx_reset=1 <svg className="ico"><use href="#i-ext" /></svg></a></div>
      <ol className="steps" style={{ marginTop: '20px' }}>
        <li className="card step">
          <div className="badge cms">1</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Author (about 2 min)</h3>
              <span className="tag cms">CMS</span>
            </div>
            <p className="small" style={{ marginTop: '8px' }}>In Visual Builder, open eHealth Home and switch between the content variations <span className="mono">Turning65</span>, <span className="mono">AepSwitcher</span> and <span className="mono">AcaOep</span>. Point out that only the hero text and the default plan differ. Marketers own all of it, with no developer involved.</p>
          </div>
        </li>
        <li className="card step">
          <div className="badge web">2</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Experience (about 3 min)</h3>
              <span className="tag web">Live site</span>
            </div>
            <p className="small" style={{ marginTop: '8px' }}>In a fresh incognito window, load <span className="mono">?utm_campaign=aca</span>: you get the Individual &amp; Family hero with the finder defaulted to Individual. Load <span className="mono">?utm_campaign=t65</span>: you get “New to Medicare?” and “Turning 65? Find the Medicare plan that fits you”. Use View Source to show the hero text is in the server HTML (no flicker, SEO-safe).</p>
          </div>
        </li>
        <li className="card step">
          <div className="badge fx">3</div>
          <div>
            <div className="step-top">
              <h3 className="h3">Decide (about 3 min)</h3>
              <span className="tag fx">FX</span>
            </div>
            <p className="small" style={{ marginTop: '8px' }}>In FX, open the flag and show the variable and the variations, then the Development ruleset: two deliveries plus the A/B rule with its <span className="mono">NOT</span> audience. Explain the “experiments first” rule and the 50/50 test on <span className="mono">plan_finder_submit</span>. Refresh <span className="mono">/?fx_reset=1</span> a few times to show the split.</p>
          </div>
        </li>
        <li className="card step">
          <div className="badge">4</div>
          <div>
            <div className="step-top">
              <h3 className="h3">The Adobe Target point (about 2 min)</h3>
              <span className="tag">TALK</span>
            </div>
            <p className="small" style={{ marginTop: '8px' }}>Show <span className="mono">lib/fx.ts</span>, the one place the variation key is chosen. Replace its body with Target’s server-side delivery returning the same key, and the CMS, the variations and the editors stay the same.</p>
          </div>
        </li>
      </ol>
      <div className="quote" style={{ marginTop: '16px' }}>“Your marketers author the variants here. Adobe Target, or anything else, decides who sees which one. You don’t have to rip anything out to get self-service.”</div>
      <div className="note" style={{ marginTop: '16px' }}>
        <p className="small"><strong>Be candid:</strong> I found no packaged Adobe Target connector for CMS SaaS in the docs, so this is a code-level integration point (“I” in RFI terms). Personalization in this demo is server-side Feature Experimentation only.</p>
      </div>
    </section>
  );
}
