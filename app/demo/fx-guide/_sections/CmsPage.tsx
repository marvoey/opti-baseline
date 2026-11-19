// Section #cmspage of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.
/* eslint-disable @next/next/no-img-element -- static SVG illustrations, nothing to optimize */
import illustration1Img from '../_assets/illustration-1.svg';

export default function CmsPage() {
  return (
    <section id="cmspage" className="sec">
      <div className="sec-head">
        <div>
          <span className="tag-eyebrow">Section 02</span>
          <h2 className="h2">The CMS page behind the variations</h2>
          <p className="lead">The three variations are not separate pages. They are alternate versions of one CMS page, <strong>eHealth Home</strong>, and they all live under its content key. This section shows that page as it stands in the CMS (read on 19 Nov 2026), so you can see exactly what the Feature Experimentation flag is choosing between.</p>
        </div>
        <img className="ill" src={illustration1Img.src} alt="" />
      </div>
      <div className="pills"><a className="pill cms" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor: find “eHealth Home” <svg className="ico"><use href="#i-ext" /></svg></a> <span className="pill">Content type <span className="mono">BlankExperience</span></span> <span className="pill">Locale <span className="mono">en</span></span> <span className="pill">Key <span className="mono">055218e17aa84576a1d733c08ebf7b02</span></span></div>
      <h3 className="sub-h">One content key, four published items</h3>
      <p className="small sub-note">Optimizely Graph returns these as four items that share one key and one URL. Only the variation key tells them apart, and that key is what the code asks for.</p>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Version</th>
              <th>Variation key</th>
              <th>Display name in the CMS</th>
              <th>Last modified (UTC)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Default (the original)</td>
              <td className="num">1695</td>
              <td>none (this is the original)</td>
              <td>eHealth Home</td>
              <td className="num">19 Nov, 13:45</td>
            </tr>
            <tr>
              <td>Variation</td>
              <td className="num">1678</td>
              <td><span className="mono">AepSwitcher</span></td>
              <td>AEP Switcher</td>
              <td className="num">18 Nov, 23:21</td>
            </tr>
            <tr>
              <td>Variation</td>
              <td className="num">1677</td>
              <td><span className="mono">AcaOep</span></td>
              <td>ACA Open Enrollment</td>
              <td className="num">18 Nov, 23:21</td>
            </tr>
            <tr>
              <td>Variation</td>
              <td className="num">1676</td>
              <td><span className="mono">Turning65</span></td>
              <td>Turning 65</td>
              <td className="num">18 Nov, 23:21</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="note hl" style={{ marginTop: '14px' }}>
        <p className="small"><strong>The flag variable holds the variation key, not the display name.</strong> The value must be <span className="mono">AepSwitcher</span>, not “AEP Switcher”. If it doesn’t match a key exactly, the page quietly falls back to the original.</p>
        <p className="small">Each item also has its own CMS route segment (for example <span className="mono">aep-switcher</span>). The code ignores those: it fetches all four from Graph by the path <span className="mono">/</span> and picks the one whose variation key matches.</p>
      </div>
      <h3 className="sub-h">The page, top to bottom: 12 sections</h3>
      <p className="small sub-note">The hero, 10 content sections that render below it, and a Reviews section that code hides because it still holds placeholder text. Each variation holds a full copy of all 12, and only the hero is meant to differ.</p>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Section name in the CMS</th>
              <th>Component</th>
              <th>What it holds</th>
              <th>In the variations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="num">1</td>
              <td>Hero (Grey)</td>
              <td><span className="mono">EhHero</span></td>
              <td>Headline, the plan finder (ZIP code and plan tiles) and the agent phone line</td>
              <td><span className="tag fx">Overridden: 5 fields</span></td>
            </tr>
            <tr>
              <td className="num">2</td>
              <td>Carriers (White)</td>
              <td><span className="mono">EhCarrierLogos</span></td>
              <td>Aetna, HealthSpring, UnitedHealthcare, Humana, Blue Cross Blue Shield, and a “View all (50+) Medicare carriers” link</td>
              <td><span className="tag">Copied, link not set</span></td>
            </tr>
            <tr>
              <td className="num">3</td>
              <td>MatchFinder (Mint)</td>
              <td><span className="mono">RichTextBlock</span></td>
              <td>“Say hello to MatchFinder” rich text with a Get plans link</td>
              <td><span className="tag">Copied, link is “#”</span></td>
            </tr>
            <tr>
              <td className="num">4</td>
              <td>Testimonials (Grey)</td>
              <td><span className="mono">EhTestimonials</span></td>
              <td>“Real experiences. Real confidence.” carousel of shared testimonial blocks (3 in the default)</td>
              <td><span className="tag">Copied, lists 5</span></td>
            </tr>
            <tr>
              <td className="num">5</td>
              <td>Why eHealth (White)</td>
              <td><span className="mono">EhFeatureRow</span></td>
              <td>Four reasons to choose eHealth, plus a call to action</td>
              <td><span className="tag">Copied, link not set</span></td>
            </tr>
            <tr>
              <td className="num">6</td>
              <td>Savings (Mint)</td>
              <td><span className="mono">EhSavingsBand</span></td>
              <td>“You may save over $2,000 per year” band, call to action and disclaimer</td>
              <td><span className="tag">Copied, link not set</span></td>
            </tr>
            <tr>
              <td className="num">7</td>
              <td>Live Advise (White)</td>
              <td><span className="mono">EhLiveAdvise</span></td>
              <td>Promo for eHealth Live Advise video calls with an agent, plus the phone line</td>
              <td><span className="tag">Copied as is</span></td>
            </tr>
            <tr>
              <td className="num">8</td>
              <td>Coverage (Mint)</td>
              <td><span className="mono">EhCoverageGrid</span></td>
              <td>Six shared coverage cards: Individual &amp; Family, Medicare, Small Business, Short-term, Dental, Vision</td>
              <td><span className="tag">Copied, same shared cards</span></td>
            </tr>
            <tr>
              <td className="num">9</td>
              <td>Reviews (Mint)</td>
              <td><span className="mono">EhReviews</span></td>
              <td>“Hear from our Medicare customers” with four placeholder reviews</td>
              <td><span className="tag web">Copied, hidden by code</span></td>
            </tr>
            <tr>
              <td className="num">10</td>
              <td>Plan recommendations (White)</td>
              <td><span className="mono">EhFeatureRow</span></td>
              <td>“Get your free personal plan recommendations”, three steps plus a call to action</td>
              <td><span className="tag">Copied, link not set</span></td>
            </tr>
            <tr>
              <td className="num">11</td>
              <td>Plan Finder (Grey)</td>
              <td><span className="mono">EhPlanFinder</span></td>
              <td>“Find your health insurance plan match”, the card version of the plan finder</td>
              <td><span className="tag">Copied as is</span></td>
            </tr>
            <tr>
              <td className="num">12</td>
              <td>Steps (Dark green band)</td>
              <td><span className="mono">EhStepsBand</span></td>
              <td>“Compare health insurance plans and enroll online in 3 easy steps”, with image and call to action</td>
              <td><span className="tag">Copied, link not set</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small" style={{ marginTop: '12px', maxWidth: '860px' }}><strong>Inline vs shared:</strong> most components are stored inline, inside the page. The three testimonial cards and six coverage cards are <em>shared blocks</em>, separate content items that the page only references by key.</p>
      <h3 className="sub-h">What each variation changes in the hero</h3>
      <p className="small sub-note">Five fields are overridden: eyebrow, headline, the highlighted phrase, subcopy and which plan tile is pre-selected. The hero image, ZIP field and agent phone line are reused.</p>
      <div className="hv">
        <div className="card c-white">
          <div className="hv-top"><span className="tag">Default · the original</span><span className="tag">Plan finder opens on: Medicare tile</span></div>
          <div className="hv-eyebrow">No eyebrow</div>
          <div className="hv-h">Compare the nation’s top <mark>health insurance plans</mark></div>
          <p className="small hv-sub">No subcopy set.</p>
          <div className="hv-meta">Version 1695 · hero fields not overridden</div>
        </div>
        <div className="card c-cms">
          <div className="hv-top"><span className="tag cms">AepSwitcher</span><span className="tag">Plan finder opens on: Medicare tile</span></div>
          <div className="hv-eyebrow">Medicare Annual Enrollment is here</div>
          <div className="hv-h">Is your Medicare plan <mark>still the right fit</mark> for 2027?</div>
          <p className="small hv-sub">Compare your current plan to new 2027 options from top carriers and see which ones cover your doctors and prescriptions.</p>
          <div className="hv-meta">Version 1678 · CMS display name “AEP Switcher”</div>
        </div>
        <div className="card c-cms">
          <div className="hv-top"><span className="tag cms">AcaOep</span><span className="tag">Plan finder opens on: Individual &amp; Family tile</span></div>
          <div className="hv-eyebrow">Open enrollment is here</div>
          <div className="hv-h">Find <mark>health insurance</mark> for you and your family</div>
          <p className="small hv-sub">Compare plans from top carriers and find out if you qualify for a subsidy.</p>
          <div className="hv-meta">Version 1677 · CMS display name “ACA Open Enrollment”</div>
        </div>
        <div className="card c-cms">
          <div className="hv-top"><span className="tag cms">Turning65</span><span className="tag">Plan finder opens on: Medicare tile</span></div>
          <div className="hv-eyebrow">New to Medicare?</div>
          <div className="hv-h">Turning 65? Find the <mark>Medicare plan</mark> that fits you</div>
          <p className="small hv-sub">You have a limited window to enroll when you turn 65. Compare plans that cover your doctors and prescriptions.</p>
          <div className="hv-meta">Version 1676 · CMS display name “Turning 65”</div>
        </div>
      </div>
      <h3 className="sub-h">Where the variations have drifted from the default</h3>
      <p className="small sub-note">The variations were copied from the default on 18 Nov. The default was cleaned up afterwards (G3, 19 Nov), so the variations still hold the old content. Visitors don’t notice, because the code covers each gap.</p>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>What</th>
              <th>Default (v1695)</th>
              <th>Variations (v1676 to v1678)</th>
              <th>What visitors see</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Testimonials list</td>
              <td>3 shared testimonial blocks</td>
              <td>5 (adds the two duplicate Wilma I. copies)</td>
              <td>Code de-duplicates by name and quote, so 3 show</td>
            </tr>
            <tr>
              <td>MatchFinder “Get plans” link</td>
              <td><span className="mono">/medicare</span></td>
              <td><span className="mono">#</span> (a dead link)</td>
              <td>Code rewrites the dead link to <span className="mono">/medicare</span></td>
            </tr>
            <tr>
              <td>Five call-to-action links (Carriers, Why eHealth, Savings, Plan recommendations, Steps)</td>
              <td>Set to the Medicare plans page</td>
              <td>Not set</td>
              <td>Code falls back to <span className="mono">/medicare</span></td>
            </tr>
            <tr>
              <td>Reviews section</td>
              <td>Placeholder text still there</td>
              <td>Placeholder text still there</td>
              <td>Code hides the section in all four</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="note" style={{ marginTop: '14px' }}>
        <p className="small"><strong>Why it matters:</strong> if someone opens a variation in Visual Builder, they’ll see the old content, not the cleaned-up version. The CMS REST API can’t edit a variation’s draft, so the fix has to be made in Visual Builder, one variation at a time.</p>
        <p className="small"><strong>Shared blocks behave differently.</strong> Because every version stores only a reference, an edit made <em>inside</em> a shared testimonial or coverage card reaches all four versions at once. What doesn’t carry over is the list of <em>which</em> blocks a section references.</p>
      </div>
    </section>
  );
}
