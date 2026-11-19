// Section #gaps of /demo/flow, generated from the ehealth_friday_demo_flow.html
// canvas (v8). See ../page.tsx before editing by hand.

export default function Gaps() {
  return (
    <section id="gaps" className="card">
      <h2 className="h2">4. Gaps to close</h2>
      <p>Ranked by how much each one strengthens Friday&apos;s story. Effort is a rough estimate for you working with the source tools.</p>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Gap</th>
              <th>Why it lands with eHealth</th>
              <th>Where</th>
              <th>Effort</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>G1</td>
              <td><strong>Personalization and A/B with Feature Experimentation and CMS content variations</strong> (hero variants: Turning65, AepSwitcher, AcaOep)</td>
              <td>RFI §8 is their biggest experimentation ask. Overlapping AEP and OEP make &quot;different hero by audience&quot; an obvious need. It also shows the point where Adobe Target would plug in.</td>
              <td>Code (written, needs deploy): <span className="mono">lib/fx.ts</span>, <span className="mono">proxy.ts</span> (visitor cookie), the catch-all page, <span className="mono">app/api/fx/track</span>. CMS: <strong>3 variations published</strong>. FX: <strong>built in Marvin Demo (rules draft)</strong></td>
              <td>½ day</td>
              <td>
                <span className="chip c-warn">MUST</span>
              </td>
            </tr>
            <tr>
              <td>G2</td>
              <td><strong>Move the promo banner, phone number and footer into the CMS</strong> (a site settings item, schedulable and per app)</td>
              <td>Today a marketer can&apos;t change &quot;Medicare Annual Enrollment is here!&quot; without a code deploy, which is exactly the RFI&apos;s pain point. Fixing it also covers per-group configuration (5.6).</td>
              <td>Code: new <span className="mono">EhSiteSettings</span> type, then read it in <span className="mono">SiteChrome</span>. CMS: one settings item</td>
              <td>2–3 hrs</td>
              <td>
                <span className="chip c-warn">MUST</span>
              </td>
            </tr>
            <tr>
              <td>G3</td>
              <td><strong>Demo cleanup:</strong> duplicate Wilma testimonials (cards 4 and 5), placeholder reviews, # links (banner, MatchFinder, savings, carriers, steps, footer) and empty alt text on coverage images</td>
              <td>A healthcare buyer will notice fake reviews and dead links. Hide the Reviews section rather than inventing reviews, which is a compliance risk. Save the alt text for Act 6.</td>
              <td>CMS only</td>
              <td>45 min</td>
              <td>
                <span className="chip c-warn">MUST</span>
              </td>
            </tr>
            <tr>
              <td>G4</td>
              <td><strong>Technical SEO:</strong> <span className="mono">app/sitemap.ts</span>, <span className="mono">app/robots.ts</span> (AI-crawler rules), canonical and robots meta, JSON-LD, <span className="mono">/llms.txt</span></td>
              <td>Yoast parity and AEO are 39 of the RFI&apos;s line items. Today <a className="link" href="https://ehealth.optimoey.com/sitemap.xml" target="_blank" rel="noopener noreferrer">sitemap.xml</a> and <a className="link" href="https://ehealth.optimoey.com/robots.txt" target="_blank" rel="noopener noreferrer">robots.txt</a> return the homepage. The SEO and AEO fields exist only on <span className="mono">Page (v1)</span>, not on the <span className="mono">BlankExperience</span> the site actually uses.</td>
              <td>Code: 3 new routes plus <span className="mono">generateMetadata</span>. CMS: add Canonical, Robots and FAQ fields to BlankExperience (or a shared SEO group)</td>
              <td>½ day</td>
              <td>
                <span className="chip c-warn">MUST</span>
              </td>
            </tr>
            <tr>
              <td>G5</td>
              <td><strong>Spanish (<span className="mono">es</span>) locale</strong>, then translate Home and /medicare with Mark</td>
              <td>Spanish is likely important to their audience (confirm in discovery). It brings RFI §10 to life. The existing locales (fr, sv, ko, cy, zh) don&apos;t fit eHealth.</td>
              <td>CMS: add es. Code: <span className="mono">npm run gen:locales</span></td>
              <td>1–2 hrs</td>
              <td>
                <span className="chip c-blue">HIGH</span>
              </td>
            </tr>
            <tr>
              <td>G6</td>
              <td><strong>Product-line and channel taxonomy</strong> (Medicare, IFP, Small Business, Dental &amp; Vision, Short-term, plus Paid and Organic) and one paid landing page</td>
              <td>This answers RFI 5.2–5.4 and 5.10 head-on. The current categories are left over from another demo (Product line → Auto, Home, Home + Auto).</td>
              <td>CMS: replace categories, tag pages, build <span className="mono">/lp/aca-2027</span>. Code: an optional Graph query view</td>
              <td>2 hrs</td>
              <td>
                <span className="chip c-blue">HIGH</span>
              </td>
            </tr>
            <tr>
              <td>G7</td>
              <td><strong>FAQ block</strong> (accordion that renders FAQPage JSON-LD) and fuller product pages</td>
              <td>AEO proof point. Product pages are thin, and adding Coverage, Live Advise and FAQ blocks shows reuse across pages.</td>
              <td>Code: <span className="mono">cms/EhFaq.tsx</span>. CMS: add to /medicare and /individual-and-family</td>
              <td>2–3 hrs</td>
              <td>
                <span className="chip c-blue">HIGH</span>
              </td>
            </tr>
            <tr>
              <td>G8</td>
              <td><strong>Compliance disclaimer block</strong> with a Legal approval step</td>
              <td>Medicare marketing content is highly regulated, and eHealth&apos;s real site carries required disclaimers. Showing a reusable disclaimer plus a Legal approval step speaks to RFI 11.5. Confirm the exact wording requirements with them rather than guessing.</td>
              <td>Code: <span className="mono">cms/EhDisclaimer.tsx</span>. CMS: approval sequence</td>
              <td>1–2 hrs</td>
              <td>
                <span className="chip c-n">NICE</span>
              </td>
            </tr>
            <tr>
              <td>G9</td>
              <td><strong>Site search with Graph</strong> (full text plus facets by product line)</td>
              <td>RFI §14 has 11 items, and native search with no Algolia or Coveo needed is a differentiator.</td>
              <td>Code: <span className="mono">app/[locale]/search</span></td>
              <td>2–3 hrs</td>
              <td>
                <span className="chip c-n">NICE</span>
              </td>
            </tr>
            <tr>
              <td>G10</td>
              <td><strong>Plan finder hand-off:</strong> use <span className="mono">?zip=&amp;type=</span> on the landing page (for example &quot;Plans in 85004&quot;) and pass them as FX attributes</td>
              <td>It&apos;s a small touch that makes personalization feel real.</td>
              <td>Code: product-page hero</td>
              <td>1 hr</td>
              <td>
                <span className="chip c-n">NICE</span>
              </td>
            </tr>
            <tr>
              <td>G11</td>
              <td><strong>Decide about the Web Experimentation snippet:</strong> turn it off for the demo, or keep it only as the flicker contrast</td>
              <td>Avoids a &quot;why are you running two testing tools?&quot; detour when they&apos;ve already said Adobe Target.</td>
              <td>Env: <span className="mono">NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID</span></td>
              <td>5 min</td>
              <td>
                <span className="chip c-n">DECIDE</span>
              </td>
            </tr>
            <tr>
              <td>G12</td>
              <td>Cosmetic: the hero highlight renders <span className="mono">text-blue-800</span>, but the field description says &quot;green&quot;, and carriers show as text rather than logos</td>
              <td>The eHealth brand team will notice.</td>
              <td>Code: <span className="mono">cms/EhHero.tsx</span>. CMS: logo images</td>
              <td>30 min</td>
              <td>
                <span className="chip c-n">NICE</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
