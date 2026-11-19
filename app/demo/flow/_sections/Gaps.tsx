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
              <td>Code (<strong>deployed</strong>): <span className="mono">lib/fx.ts</span>, <span className="mono">proxy.ts</span> (visitor cookie), the catch-all page, <span className="mono">app/api/fx/track</span>. CMS: <strong>3 variations published</strong>. FX: <strong>3 rules running in Development</strong>. Verified live on 19 Nov.</td>
              <td>½ day</td>
              <td>
                <span className="chip c-green">DONE</span>
              </td>
            </tr>
            <tr>
              <td>G2</td>
              <td><strong>Move the promo banner, phone number and footer into the CMS</strong> (a site settings item, schedulable and per app)</td>
              <td>Today a marketer can&apos;t change &quot;Medicare Annual Enrollment is here!&quot; without a code deploy, which is exactly the RFI&apos;s pain point. Fixing it also covers per-group configuration (5.6).</td>
              <td>Built as option B: banner, header phone and footer legal line. Code: <span className="mono">EhSiteSettings</span> type and <span className="mono">lib/siteSettings.ts</span>, read by the header, banner and footer. CMS: one &quot;Site settings&quot; item (live). Footer link columns stay in <span className="mono">siteConfig</span>. <strong>Deployed and live.</strong></td>
              <td>2–3 hrs</td>
              <td>
                <span className="chip c-green">DONE</span>
              </td>
            </tr>
            <tr>
              <td>G3</td>
              <td><strong>Demo cleanup:</strong> duplicate Wilma testimonials (cards 4 and 5), placeholder reviews, # links (banner, MatchFinder, savings, carriers, steps, footer) and empty alt text on coverage images</td>
              <td>A healthcare buyer will notice fake reviews and dead links. Hide the Reviews section rather than inventing reviews, which is a compliance risk. Save the alt text for Act 6. The footer links (About, Careers, Press, social, Privacy, Terms and a few more, about 15) still point to #: hide those columns or say so on the call.</td>
              <td>CMS: default homepage fixed and published (v1695). Code for the variations: <span className="mono">cms/shared.ts</span>, <span className="mono">EhTestimonials</span>, <span className="mono">EhReviews</span>, the CTA blocks. <strong>Deployed and verified live on all four variants on 19 Nov</strong>: 3 testimonials, no # links in the page content, no Reviews section.</td>
              <td>45 min</td>
              <td>
                <span className="chip c-green">DONE</span>
              </td>
            </tr>
            <tr>
              <td>G4</td>
              <td><strong>Technical SEO:</strong> <span className="mono">/sitemap.xml</span>, <span className="mono">/robots.txt</span> (AI-crawler rules), canonical and hreflang links, JSON-LD, <span className="mono">/llms.txt</span> and the right <span className="mono">html lang</span> on Spanish pages</td>
              <td>Yoast parity and AEO are 39 of the RFI&apos;s line items. Until the deploy, <a className="link" href="https://ehealth.optimoey.com/sitemap.xml" target="_blank" rel="noopener noreferrer">sitemap.xml</a>, <a className="link" href="https://ehealth.optimoey.com/robots.txt" target="_blank" rel="noopener noreferrer">robots.txt</a> and <a className="link" href="https://ehealth.optimoey.com/llms.txt" target="_blank" rel="noopener noreferrer">llms.txt</a> all return the homepage, and /es says <span className="mono">lang=&quot;en&quot;</span>. The editor fields already exist on <span className="mono">BlankExperience</span> (Canonical URL, Robots Directives, Keywords, FAQ and HowTo items), so no CMS change was needed.</td>
              <td>Code: <span className="mono">app/sitemap.ts</span>, <span className="mono">app/robots.ts</span>, <span className="mono">app/llms.txt/route.ts</span>, <span className="mono">lib/seo.ts</span>, <span className="mono">lib/jsonLd.ts</span>, canonical and hreflang in <span className="mono">generateMetadata</span>, and the locale header in <span className="mono">proxy.ts</span>. All generated from the CMS tree, so there is nothing to maintain by hand. AI-crawler policy: answer-engine crawlers allowed, training crawlers blocked, one switch (<span className="mono">ALLOW_AI_TRAINING</span>) in <span className="mono">lib/seo.ts</span>. Tested locally against live Graph data. <strong>Not yet deployed.</strong></td>
              <td>½ day</td>
              <td>
                <span className="chip c-warn">ON DEPLOY</span>
              </td>
            </tr>
            <tr>
              <td>G5</td>
              <td><strong>Spanish (<span className="mono">es</span>) locale</strong>, then translate Home and /medicare with Mark</td>
              <td>Spanish is likely important to their audience (confirm in discovery). It brings RFI §10 to life. The existing locales (fr, sv, ko, cy, zh) don&apos;t fit eHealth.</td>
              <td>CMS: <span className="mono">es</span> enabled, and eHealth Home is translated and published at <a className="link" href="https://ehealth.optimoey.com/es" target="_blank" rel="noopener noreferrer">/es</a>. Code: locales regenerated and committed. <strong>/medicare is not translated yet</strong>, which leaves a live Mark moment (Act 6). Fix before the call: Mark turned the brand into &quot;eSalud&quot; in the Spanish page title and CMS name (check the body too).</td>
              <td>1–2 hrs</td>
              <td>
                <span className="chip c-green">DONE</span>
              </td>
            </tr>
            <tr>
              <td>G6</td>
              <td><strong>Product-line and channel taxonomy</strong> (Medicare, IFP, Small Business, Dental &amp; Vision, Short-term, plus Paid and Organic) and one paid landing page</td>
              <td>This answers RFI 5.2–5.4 and 5.10 head-on. The leftover Auto and Home categories from another demo are gone.</td>
              <td>CMS: categories replaced, 7 product pages tagged, <span className="mono">/lp/aca-2027</span> built (live). Code: the <span className="mono">/demo/groups</span> Graph query view and the minimal landing header. <strong>Deployed and live.</strong></td>
              <td>2 hrs</td>
              <td>
                <span className="chip c-green">DONE</span>
              </td>
            </tr>
            <tr>
              <td>G7</td>
              <td><strong>FAQ block</strong> (accordion that renders FAQPage JSON-LD) and fuller product pages</td>
              <td>AEO proof point. Product pages were thin, and adding How it works, Live Advise, Coverage and FAQ blocks shows reuse across pages.</td>
              <td>Code: <span className="mono">cms/EhFaq.tsx</span> (registered, and the type is pushed to the CMS). CMS: <span className="mono">/medicare</span> and <span className="mono">/individual-and-family</span> now have six sections each, including a six-question FAQ, published. <strong>The FAQ appears after the code deploy</strong>; until then the pages show the other three new sections. The wording is demo copy: eHealth compliance should review it.</td>
              <td>2–3 hrs</td>
              <td>
                <span className="chip c-warn">ON DEPLOY</span>
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
              <td><strong>Web Experimentation snippet:</strong> decided not to use Web Experimentation in this demo. Feature Experimentation does the personalization and the A/B test</td>
              <td>Avoids a &quot;why are you running two testing tools?&quot; detour when they&apos;ve already said Adobe Target.</td>
              <td>Env: <span className="mono">NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID</span> is still set in Vercel, so the snippet loads on every page (checked 19 Nov). Remove it and redeploy.</td>
              <td>5 min</td>
              <td>
                <span className="chip c-warn">TO DO</span>
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
