// Section #inventory of /demo/flow, generated from the ehealth_friday_demo_flow.html
// canvas (v8). See ../page.tsx before editing by hand.

export default function Inventory() {
  return (
    <section id="inventory" className="card">
      <h2 className="h2">2. What&apos;s on the site today</h2>
      <p><strong>eHealth Home</strong> is a <span className="mono">BlankExperience</span> (published v1658) served at <a className="link" href="https://ehealth.optimoey.com/" target="_blank" rel="noopener noreferrer">/</a>. Edit it in the <a className="link" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor</a>. Each section uses the <span className="mono">EhSectionStyle</span> display template, which offers grey, mint and white backgrounds and none, compact, standard and roomy spacing.</p>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Section (as in the CMS)</th>
              <th>Block type</th>
              <th>Demo use</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Hero (Grey)</td>
              <td className="mono">EhHero</td>
              <td>Headline + highlight, built-in plan finder, DefaultPlanType. <strong>Use as the personalization target</strong></td>
              <td>
                <span className="chip c-green">READY</span>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Carriers (White)</td>
              <td className="mono">EhCarrierLogos</td>
              <td>Carrier names are text only (no logos), and &quot;View all&quot; links to #</td>
              <td>
                <span className="chip c-warn">FIX LINK</span>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>MatchFinder (Mint)</td>
              <td className="mono">RichTextBlock</td>
              <td>Already tagged Intent=evaluate, Audience=medicare-shoppers, Domain, Geo. <strong>Use for the grouping story</strong></td>
              <td>
                <span className="chip c-warn">FIX LINK</span>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>Testimonials (Grey)</td>
              <td className="mono">EhTestimonials</td>
              <td>5 shared references. <strong>Cards 4 and 5 render as copies of &quot;Wilma I.&quot;</strong></td>
              <td>
                <span className="chip c-warn">FIX</span>
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>Why eHealth (White)</td>
              <td className="mono">EhFeatureRow</td>
              <td>4 pillars with icon keys</td>
              <td>
                <span className="chip c-green">READY</span>
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>Savings (Mint)</td>
              <td className="mono">EhSavingsBand</td>
              <td>$2,000 illustrative figure with a disclaimer. Good for a &quot;compliance gate&quot; moment</td>
              <td>
                <span className="chip c-green">READY</span>
              </td>
            </tr>
            <tr>
              <td>7</td>
              <td>Live Advise (White)</td>
              <td className="mono">EhLiveAdvise</td>
              <td>Image, bullets and phone number</td>
              <td>
                <span className="chip c-green">READY</span>
              </td>
            </tr>
            <tr>
              <td>8</td>
              <td>Coverage (Mint)</td>
              <td className="mono">EhCoverageGrid</td>
              <td>6 shared coverage cards linking to product pages. <strong>All 6 images have empty alt text</strong></td>
              <td>
                <span className="chip c-warn">FIX via Mark</span>
              </td>
            </tr>
            <tr>
              <td>9</td>
              <td>Reviews (Mint)</td>
              <td className="mono">EhReviews</td>
              <td>Placeholder reviews (&quot;Customer name&quot;) with a placeholder disclaimer</td>
              <td>
                <span className="chip c-warn">HIDE</span>
              </td>
            </tr>
            <tr>
              <td>10</td>
              <td>Plan recommendations (White)</td>
              <td className="mono">EhFeatureRow</td>
              <td>Same block type as #5, which shows reuse</td>
              <td>
                <span className="chip c-green">READY</span>
              </td>
            </tr>
            <tr>
              <td>11</td>
              <td>Plan Finder (Grey)</td>
              <td className="mono">EhPlanFinder</td>
              <td>Card layout, submits to <span className="mono">/&#123;plan&#125;?zip=&amp;type=</span></td>
              <td>
                <span className="chip c-green">READY</span>
              </td>
            </tr>
            <tr>
              <td>12</td>
              <td>Steps (Dark green band)</td>
              <td className="mono">EhStepsBand</td>
              <td>3-step enrollment; &quot;See how it works&quot; links to #</td>
              <td>
                <span className="chip c-warn">FIX LINK</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid2">
        <div className="box">
          <h4>Product pages</h4>
          <p className="text-sm">These are <a className="link" href="https://ehealth.optimoey.com/medicare" target="_blank" rel="noopener noreferrer">/medicare</a>, <a className="link" href="https://ehealth.optimoey.com/individual-and-family" target="_blank" rel="noopener noreferrer">/individual-and-family</a>, <a className="link" href="https://ehealth.optimoey.com/small-business" target="_blank" rel="noopener noreferrer">/small-business</a>, <a className="link" href="https://ehealth.optimoey.com/short-term" target="_blank" rel="noopener noreferrer">/short-term</a>, <a className="link" href="https://ehealth.optimoey.com/dental-and-vision" target="_blank" rel="noopener noreferrer">/dental-and-vision</a>, <a className="link" href="https://ehealth.optimoey.com/dental-and-vision/dental" target="_blank" rel="noopener noreferrer">/dental-and-vision/dental</a> and <a className="link" href="https://ehealth.optimoey.com/dental-and-vision/vision" target="_blank" rel="noopener noreferrer">/dental-and-vision/vision</a>. Each has its own Meta Title and Description, for example &quot;Compare Medicare Plans | eHealth&quot;, which is good for SEO. Each is thin, though: a hero with the plan finder plus one feature section, and no images.</p>
        </div>
        <div className="box">
          <h4>Platform signals</h4>
          <p className="text-sm">The header nav is built from the CMS tree under eHealth Home. Graph lookups are scoped by host (<span className="mono">lib/siteHost.ts</span>). Visual Builder preview runs through <span className="mono">/preview</span>. A default OG card is set. The <strong>Optimizely Web Experimentation snippet is already loaded</strong> (client-side and after hydration, so some flicker). Hosting is on Vercel.</p>
        </div>
      </div>
    </section>
  );
}
