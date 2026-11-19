// Section #flow of /demo/flow, generated from the ehealth_friday_demo_flow.html
// canvas (v8). See ../page.tsx before editing by hand.

export default function DemoFlow() {
  return (
    <section id="flow" className="card">
      <h2 className="h2">3. Demo flow (60 minutes)</h2>
      <p>Story: <strong>one Individual &amp; Family marketer and one Medicare marketer share a homepage during overlapping enrollment windows.</strong> They make changes, test and personalize without engineering. Then engineering sees how it&apos;s built.</p>
      <div className="act">
        <div className="act-head">
          <span className="act-num">0</span>
          <span className="act-title">Reframe and agree success criteria</span>
          <span className="chip c-n">4 min</span>
          <span className="chip c-n">TALK</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill" href="/demo/rfi" target="_blank" rel="noopener noreferrer">RFI summary canvas <span aria-hidden="true">↗</span></a>
        </div>
        <ul className="dots">
          <li>Read back their Business Context in their own words: fragmented templates, reliance on engineering, Adobe Target, Akamai and Yoast.</li>
          <li>Ask: <em>&quot;What would have to be true at the end of today for this to be worth a POC?&quot;</em> Write down their answers and refer back to them at the close.</li>
        </ul>
      </div>
      <div className="act">
        <div className="act-head">
          <span className="act-num">1</span>
          <span className="act-title">&quot;This is eHealth.com, running on Optimizely&quot;</span>
          <span className="chip c-n">4 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-n">RFI 5.12, 7.9</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill" href="https://ehealth.optimoey.com/" target="_blank" rel="noopener noreferrer">Home <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://ehealth.optimoey.com/medicare" target="_blank" rel="noopener noreferrer">/medicare <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://ehealth.optimoey.com/dental-and-vision/dental" target="_blank" rel="noopener noreferrer">/dental-and-vision/dental <span aria-hidden="true">↗</span></a>
        </div>
        <ul className="dots">
          <li>Scroll the <a className="link" href="https://ehealth.optimoey.com/" target="_blank" rel="noopener noreferrer">live homepage</a>, then open <a className="link" href="https://ehealth.optimoey.com/medicare" target="_blank" rel="noopener noreferrer">/medicare</a> and <a className="link" href="https://ehealth.optimoey.com/dental-and-vision/dental" target="_blank" rel="noopener noreferrer">/dental-and-vision/dental</a>. The same plan finder adapts its default tile and CTA (&quot;Compare dental &amp; vision plans&quot;) from a CMS setting.</li>
          <li>Point out that the nav comes from the CMS content tree, so adding a product page adds a menu item with no code change.</li>
        </ul>
        <div className="say">&quot;Every section you just saw is a block your team owns. Engineering built it once, and marketing composes with it.&quot;</div>
      </div>
      <div className="act">
        <div className="act-head">
          <span className="act-num">2</span>
          <span className="act-title">Marketer self-service in Visual Builder</span>
          <span className="chip c-n">12 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-warn">+ banner BUILD</span>
          <span className="chip c-n">RFI 7.1–7.10, 11.1–11.3, 5.5</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill pill-cms" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://ehealth.optimoey.com/" target="_blank" rel="noopener noreferrer">Live Home <span aria-hidden="true">↗</span></a>
        </div>
        <ol className="num">
          <li><strong>Edit the hero inline:</strong> change the headline and green highlight on eHealth Home, then set <span className="mono">DefaultPlanType</span> to &quot;Individual &amp; Family&quot; and watch the CTA label change.</li>
          <li><strong>Guardrails, not a blank canvas:</strong> change a section from grey to mint using <span className="mono">EhSectionStyle</span>. Marketers pick from approved options only and never touch CSS.</li>
          <li><strong>Compose:</strong> drag the Savings band above Testimonials. Add a new section from the eHealth block library, then remove it.</li>
          <li><strong>Edit once, update everywhere:</strong> edit one shared Coverage Card (&quot;Medicare plans&quot;) and show it change on the homepage grid. Then make the point that the same item can feed every app.</li>
          <li><strong>Govern:</strong> schedule the publish, send it through approval, open version history (v1658 shows how many iterations have happened), compare versions and roll back.</li>
          <li><strong>The banner moment</strong> <span className="chip c-warn">BUILD</span>: change &quot;Medicare Annual Enrollment is here!&quot; and schedule an &quot;AEP ends Dec 7&quot; variant. <em>Today this banner is hard-coded in <span className="mono">lib/siteConfig.ts</span>,</em> so move it into the CMS before Friday (gap G2).</li>
        </ol>
      </div>
      <div className="act">
        <div className="act-head">
          <span className="act-num">3</span>
          <span className="act-title">Personalize and test, keeping Adobe Target</span>
          <span className="chip c-n">10 min</span>
          <span className="chip c-warn">BUILD</span>
          <span className="chip c-n">RFI 8.1–8.11</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill pill-cms" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor <span aria-hidden="true">↗</span></a>
          <a className="pill pill-fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero" target="_blank" rel="noopener noreferrer">FX flag <span aria-hidden="true">↗</span></a>
          <a className="pill pill-fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/rules/development" target="_blank" rel="noopener noreferrer">FX rules (Dev) <span aria-hidden="true">↗</span></a>
          <a className="pill pill-fx" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/rules/development/edit/ehealth_aep_hero_test" target="_blank" rel="noopener noreferrer">A/B rule <span aria-hidden="true">↗</span></a>
          <a className="pill pill-todo" href="https://ehealth.optimoey.com/?utm_campaign=aca" target="_blank" rel="noopener noreferrer">?utm_campaign=aca <span aria-hidden="true">↗</span> <small>after deploy</small></a>
          <a className="pill pill-todo" href="https://ehealth.optimoey.com/?utm_campaign=t65" target="_blank" rel="noopener noreferrer">?utm_campaign=t65 <span aria-hidden="true">↗</span> <small>after deploy</small></a>
          <a className="pill" href="https://docs.optimizely.com/feature-experimentation/docs/configure-optimizely-cms-saas" target="_blank" rel="noopener noreferrer">Integration doc <span aria-hidden="true">↗</span></a>
        </div>
        <ol className="num">
          <li>In Visual Builder, open the <strong>content variations</strong> of eHealth Home: <span className="mono">Turning65</span>, <span className="mono">AepSwitcher</span> and <span className="mono">AcaOep</span>. Each differs from the default only in the hero text; the other 11 blocks are identical copies of the default page.</li>
          <li>Load <span className="mono">/?utm_campaign=aca</span> to get the Individual &amp; Family hero with the finder defaulted to Individual. Load <span className="mono">/?utm_campaign=t65</span> to get &quot;New to Medicare? Start here&quot;. Both are rendered server-side, so there&apos;s no flicker and SEO stays intact.</li>
          <li>In Feature Experimentation, show the <a className="link" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero" target="_blank" rel="noopener noreferrer">ehealth_home_hero</a> flag: two <a className="link" href="https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero/rules/development" target="_blank" rel="noopener noreferrer">targeted delivery rules</a> for the ACA and Turning 65 audiences, then an A/B rule on the AEP hero for everyone else (it excludes the campaign audiences, since A/B tests are evaluated first). The variable <span className="mono">cms-saas-content-variation</span> carries the CMS variation key.</li>
          <li><strong>The Adobe Target point</strong> <span className="chip c-n">TALK</span>: show <span className="mono">lib/fx.ts</span>, the one place the variation key is chosen. Swap Feature Experimentation for Target&apos;s server-side delivery returning the same key, and the CMS and editors don&apos;t change.</li>
        </ol>
        <div className="say">&quot;Your marketers author the variants here. Adobe Target, or anything else, decides who sees which one. You don&apos;t have to rip anything out to get self-service.&quot;</div>
        <p className="text-sm"><strong>Be candid:</strong> I found no packaged Adobe Target connector for CMS SaaS in the docs, so this is a code-level integration point (&quot;I&quot; in RFI terms). The client-side Web Experimentation snippet already on the site is a useful contrast: it flickers because it changes the page after load.</p>
      </div>
      <div className="act">
        <div className="act-head">
          <span className="act-num">4</span>
          <span className="act-title">SEO parity with Yoast, then AEO</span>
          <span className="chip c-n">9 min</span>
          <span className="chip c-green">PARTLY READY</span>
          <span className="chip c-warn">+ BUILD</span>
          <span className="chip c-n">RFI 6.1–6.39</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill" href="https://ehealth.optimoey.com/small-business" target="_blank" rel="noopener noreferrer">/small-business <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://ehealth.optimoey.com/medicare" target="_blank" rel="noopener noreferrer">/medicare <span aria-hidden="true">↗</span></a>
          <a className="pill pill-cms" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://ehealth.optimoey.com/robots.txt" target="_blank" rel="noopener noreferrer">/robots.txt <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://ehealth.optimoey.com/sitemap.xml" target="_blank" rel="noopener noreferrer">/sitemap.xml <span aria-hidden="true">↗</span></a>
          <a className="pill pill-todo" href="https://ehealth.optimoey.com/llms.txt" target="_blank" rel="noopener noreferrer">/llms.txt <span aria-hidden="true">↗</span> <small>after G4</small></a>
          <a className="pill" href="https://docs.optimizely.com/agent-platform/docs/seo-metadata-implementation-agent" target="_blank" rel="noopener noreferrer">SEO agent doc <span aria-hidden="true">↗</span></a>
        </div>
        <ul className="dots">
          <li><strong>Ready:</strong> Meta Title, Meta Description and OG image on each page, with the site-wide fallback, Open Graph and Twitter tags.</li>
          <li><strong>Ready:</strong> run the Mark <em>SEO Metadata</em> agent on <span className="mono">/small-business</span>. It produces an audit and writes the changes back as a CMS draft for approval.</li>
          <li><strong>Build:</strong> <span className="mono">/sitemap.xml</span> and <span className="mono">/robots.txt</span> currently return the homepage HTML. Add both (with AI-crawler rules for GPTBot, PerplexityBot and Google-Extended), plus canonical and robots meta and JSON-LD (Organization, WebSite, BreadcrumbList, FAQPage). Then view the source live.</li>
          <li><strong>AEO:</strong> add an FAQ block to <span className="mono">/medicare</span> that renders FAQPage schema, run a GEO audit, and show <span className="mono">/llms.txt</span>.</li>
        </ul>
        <div className="say">&quot;Yoast scores a draft. This gives you the fields, the governance and an AI coach, and your front end produces clean, server-rendered markup that answer engines can cite.&quot;</div>
      </div>
      <div className="act">
        <div className="act-head">
          <span className="act-num">5</span>
          <span className="act-title">One content hub, grouped by product line and channel</span>
          <span className="chip c-n">7 min</span>
          <span className="chip c-warn">BUILD (light)</span>
          <span className="chip c-n">RFI 5.1–5.11, 14.4–14.5</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill pill-cms" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor <span aria-hidden="true">↗</span></a>
          <a className="pill pill-todo" href="https://ehealth.optimoey.com/lp/aca-2027" target="_blank" rel="noopener noreferrer">/lp/aca-2027 <span aria-hidden="true">↗</span> <small>after G6</small></a>
          <a className="pill" href="https://docs.optimizely.com/cms-saas/docs/applications" target="_blank" rel="noopener noreferrer">Applications doc <span aria-hidden="true">↗</span></a>
        </div>
        <ul className="dots">
          <li>Show the Graph query behind the site, which is scoped by host. Then answer the RFI&apos;s real question, which is grouping that isn&apos;t tied to a domain: run <em>&quot;all organic Medicare pages&quot;</em> and <em>&quot;all paid ACA landing pages&quot;</em> by filtering on a taxonomy.</li>
          <li>Open a paid landing page (<span className="mono">/lp/aca-2027</span>) built from the <em>same</em> shared blocks, set to noindex and with minimal nav. It&apos;s the same content in a different app context.</li>
          <li>Per-app preview: Applications in the CMS, each with its own host and preview URL.</li>
        </ul>
      </div>
      <div className="act">
        <div className="act-head">
          <span className="act-num">6</span>
          <span className="act-title">AI in the editor&apos;s workflow</span>
          <span className="chip c-n">6 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-warn">+ es locale</span>
          <span className="chip c-n">RFI 9.1–9.8, 10.1–10.6, 7.5, 11.6</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill pill-cms" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://mark.optimizely.com" target="_blank" rel="noopener noreferrer">Mark <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://ehealth.optimoey.com/medicare" target="_blank" rel="noopener noreferrer">/medicare <span aria-hidden="true">↗</span></a>
          <a className="pill pill-todo" href="https://ehealth.optimoey.com/es/medicare" target="_blank" rel="noopener noreferrer">/es/medicare <span aria-hidden="true">↗</span> <small>after G5</small></a>
        </div>
        <ul className="dots">
          <li><strong>Accessibility:</strong> ask Mark to generate alt text for the 6 coverage-card images, which are empty today. It&apos;s a real fix to a real gap, done live.</li>
          <li><strong>Spanish:</strong> translate eHealth Home and <span className="mono">/medicare</span> into Spanish with Mark, then show <span className="mono">/es/medicare</span> with fallback to English for anything untranslated. <em>This needs an <span className="mono">es</span> locale; the CMS currently has en, fr, sv, ko, ko-KR, cy and zh.</em></li>
          <li><strong>Human in the loop:</strong> AI output lands as a draft, goes through the approval step and has an audit trail. Mention that generative AI can be turned off in the Opti ID admin.</li>
        </ul>
      </div>
      <div className="act">
        <div className="act-head">
          <span className="act-num">7</span>
          <span className="act-title">Under the hood for engineering</span>
          <span className="chip c-n">4 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-n">RFI 13.1–13.10, 15.1–15.7</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill" href="https://github.com/marvoey/opti-baseline" target="_blank" rel="noopener noreferrer">Template repo <span aria-hidden="true">↗</span></a>
          <a className="pill" href="https://docs.optimizely.com/cms-saas/docs/enable-live-preview-saas" target="_blank" rel="noopener noreferrer">Live preview doc <span aria-hidden="true">↗</span></a>
          <a className="pill pill-cms" href="https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms" target="_blank" rel="noopener noreferrer">CMS editor <span aria-hidden="true">↗</span></a>
        </div>
        <ul className="dots">
          <li>Content types are code: a block is one <span className="mono">cms/*.tsx</span> file containing the type and its React component, registered in <span className="mono">cms/registry.ts</span> and pushed with <span className="mono">npm run cms:push</span>.</li>
          <li>The stack is Next.js 16 with CMS SDK v2 and Graph. Clean-URL locale routing lives in <span className="mono">proxy.ts</span>, and preview runs through <span className="mono">/preview</span>.</li>
          <li>The site deploys on Vercel today. Akamai can sit in front of the front end and static assets; that&apos;s a hosting decision, not a CMS feature.</li>
          <li><span className="chip c-n">OPTIONAL</span> The source-file tools let Mark read and edit this project in a sandbox, with backups and a stale-edit check. It&apos;s an &quot;AI for developers&quot; moment.</li>
        </ul>
      </div>
      <div className="act">
        <div className="act-head">
          <span className="act-num">8</span>
          <span className="act-title">Migration path and next step</span>
          <span className="chip c-n">4 min</span>
          <span className="chip c-n">TALK</span>
          <span className="chip c-n">RFI 16, 17</span>
        </div>
        <div className="open">
          <span className="open-lbl">Open</span>
          <a className="pill" href="/demo/rfi" target="_blank" rel="noopener noreferrer">RFI summary canvas <span aria-hidden="true">↗</span></a>
        </div>
        <ul className="dots">
          <li>WordPress to the CMS through the management API. Gutenberg blocks map to Eh* blocks, Yoast titles and descriptions map to MetaTitle and MetaDescription, and redirects are generated from the old URLs.</li>
          <li>Propose a scoped POC built around their success criteria from Act 0. For example: one product line, one paid app and one organic app, with a Target-driven variant.</li>
        </ul>
      </div>
    </section>
  );
}
