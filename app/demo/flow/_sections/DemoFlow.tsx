// Section #flow of /demo/flow. Originally generated from the ehealth_friday_demo_flow.html
// canvas (v14), then rewritten by hand as a step-by-step script: every act is a numbered list of
// OPEN / SAY / DO / ASK steps with the exact words to say. Act 0 quotes the RFI's Business Context
// verbatim (see app/demo/rfi/rfiDocument.ts). See ../page.tsx before regenerating from the canvas.

import type { ReactNode } from 'react';
import CopyUrlButton from './CopyUrlButton';

const SITE = 'https://ehealth.optimoey.com';
const CMS = 'https://app-epsamoey0012f6ygp001.cms.optimizely.com/ui/cms';
const FX_FLAG = 'https://app.optimizely.com/v2/projects/6229025884995584/flags/manage/ehealth_home_hero';

type Kind = 'open' | 'say' | 'do' | 'ask';
const KIND_LABEL: Record<Kind, string> = { open: 'Open', say: 'Say', do: 'Do', ask: 'Ask' };

function Step({ kind, children }: { kind: Kind; children: ReactNode }) {
  return (
    <li>
      <span className={`sk sk-${kind}`}>{KIND_LABEL[kind]}</span>
      <div className="step-body">{children}</div>
    </li>
  );
}

function Pill({ href, tone, children }: { href: string; tone?: 'cms' | 'fx'; children: ReactNode }) {
  const label = typeof children === 'string' ? children : href;
  return (
    <span className="pill-wrap">
      <a
        className={`pill${tone ? ` pill-${tone}` : ''}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children} <span aria-hidden="true">↗</span>
      </a>
      <CopyUrlButton href={href} label={label} />
    </span>
  );
}

function Say({ children }: { children: ReactNode }) {
  return <div className="say">{children}</div>;
}

function Head({ num, title, children }: { num: number; title: string; children: ReactNode }) {
  return (
    <div className="act-head">
      <span className="act-num">{num}</span>
      <span className="act-title">{title}</span>
      {children}
    </div>
  );
}

export default function DemoFlow() {
  return (
    <section id="flow" className="card">
      <h2 className="h2">3. Demo flow (60 minutes)</h2>
      <p>Story: <strong>one Individual &amp; Family marketer and one Medicare marketer share a homepage during overlapping enrollment windows.</strong> They make changes, test and personalize without engineering. Then engineering sees how it&apos;s built.</p>
      <p className="text-sm mt-2">
        <strong>How to read the steps, in order:</strong>{' '}
        <span className="sk sk-open">Open</span> a link or item,{' '}
        <span className="sk sk-say">Say</span> the words in the green box out loud,{' '}
        <span className="sk sk-do">Do</span> something on screen,{' '}
        <span className="sk sk-ask">Ask</span> them a question and wait.
      </p>

      {/* ACT 0 */}
      <div className="act">
        <Head num={0} title="Reframe and agree success criteria">
          <span className="chip c-n">4 min</span>
          <span className="chip c-n">TALK</span>
        </Head>
        <ol className="steps">
          <Step kind="open">
            <Pill href="/demo/rfi">RFI summary canvas</Pill> and scroll to <strong>1. Introduction and Purpose</strong>, then the <strong>Business Context</strong> list.
          </Step>
          <Step kind="say">
            Intro, then read the bullets below one at a time, pausing after each for a nod. They are word for word from their RFI.
            <Say>“Before I show anything, I want to read back what you told us in the RFI, in your own words.”</Say>
            <Say>
              “<strong>Fragmented CMS systems and templates slow down publishing and experimentation.</strong>”
            </Say>
            <Say>
              “<strong>SEO and content teams depend heavily on engineering for updates and testing.</strong>”
            </Say>
            <Say>
              “<strong>The current platform lacks self-service capabilities, forcing business and marketing teams to rely on engineering for routine content changes, page updates, and experiments.</strong>”
            </Say>
            <Say>
              “<strong>The future platform must empower business and marketing teams with self-service authoring, publishing, and experiment management that does not require coding or engineering involvement.</strong>”
            </Say>
            <Say>
              “<strong>The platform must serve content to multiple frontend applications, organized by logical grouping (for example product line, paid-media traffic, organic traffic), not by domain.</strong>”
            </Say>
            <Say>
              “<strong>A/B testing will run on your existing Adobe Target; business and marketing teams require self-service experiment and content control without engineering.</strong>”
            </Say>
            <Say>
              “<strong>Static assets must be publishable to your Akamai CDN.</strong>”
            </Say>
            <Say>
              “<strong>SEO parity with your current Yoast SEO workflow is a priority.</strong>”
            </Say>
          </Step>
          <Step kind="ask">
            Stop talking after you ask this one, and let them answer.
            <Say>“Did I get that right? Is anything missing, or anything you&rsquo;d put first?”</Say>
          </Step>
          <Step kind="do">Fix anything they correct. Then move on.</Step>
          <Step kind="ask">
            <Say>“What would you need to see today to feel this platform is a serious fit for eHealth?”</Say>
          </Step>
          <Step kind="do">Write their answers down where they can see them (shared screen or doc). You will read them back in Act 8.</Step>
          <Step kind="say">
            <Say>“Over the next hour I&rsquo;ll show each of those on a working site built on Optimizely CMS SaaS. I&rsquo;ll tell you for each step whether it works today or is a talk track. Marketing first, then engineering.”</Say>
          </Step>
        </ol>
      </div>

      {/* ACT 1 */}
      <div className="act">
        <Head num={1} title="“This is eHealth.com, running on Optimizely”">
          <span className="chip c-n">4 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-n">RFI 5.12, 7.9</span>
        </Head>
        <div className="open">
          <span className="open-lbl">Pre-open</span>
          <Pill href={`${SITE}/`}>Home</Pill>
          <Pill href={`${SITE}/medicare`}>/medicare</Pill>
          <Pill href={`${SITE}/dental-and-vision/dental`}>/dental-and-vision/dental</Pill>
        </div>
        <ol className="steps">
          <Step kind="open">
            <Pill href={`${SITE}/`}>Live homepage</Pill>
          </Step>
          <Step kind="say">
            <Say>“This is a working eHealth site running on Optimizely CMS SaaS. It&rsquo;s not a mockup.”</Say>
          </Step>
          <Step kind="do">Scroll slowly from the top hero to the dark green Steps band at the bottom. Pause on the hero and the plan finder.</Step>
          <Step kind="open">
            <Pill href={`${SITE}/medicare`}>/medicare</Pill>, then <Pill href={`${SITE}/dental-and-vision/dental`}>/dental-and-vision/dental</Pill>
          </Step>
          <Step kind="do">On each page, point at the plan finder. On the dental page, point at the button that says “Compare dental &amp; vision plans”.</Step>
          <Step kind="say">
            <Say>“It&rsquo;s the same plan finder block on both pages. It changes its default tile and button label from one CMS setting. Nobody wrote a new page.”</Say>
          </Step>
          <Step kind="do">Point at the header menu.</Step>
          <Step kind="say">
            <Say>“This menu isn&rsquo;t hard-coded. It&rsquo;s built from the content tree in the CMS, so adding a product page adds a menu item with no code change.”</Say>
            <Say>“Every section you just saw is a block your team owns. Engineering built it once, and marketing composes with it.”</Say>
          </Step>
        </ol>
      </div>

      {/* ACT 2 */}
      <div className="act">
        <Head num={2} title="Marketer self-service in Visual Builder">
          <span className="chip c-n">12 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-n">RFI 7.1–7.10, 11.1–11.3, 5.5</span>
        </Head>
        <div className="open">
          <span className="open-lbl">Pre-open</span>
          <Pill href={CMS} tone="cms">CMS editor</Pill>
          <Pill href={`${SITE}/`}>Live Home</Pill>
        </div>
        <ol className="steps">
          <Step kind="open">
            <Pill href={CMS} tone="cms">CMS editor</Pill>, then find <strong>eHealth Home</strong> (an experience, route <span className="mono">ehealth-home</span>, content key <span className="mono">055218e17aa84576a1d733c08ebf7b02</span>) and open it in Visual Builder.
          </Step>
          <Step kind="say">
            <Say>“This is what your marketers see. They click on the page and edit it in place. No ticket, no engineer.”</Say>
          </Step>
          <Step kind="do"><strong>Edit the hero inline.</strong> Click the hero headline in the preview and change the green highlighted words to any short phrase.</Step>
          <Step kind="do">Open the hero&rsquo;s settings and set <span className="mono">DefaultPlanType</span> to “Individual &amp; Family”. Watch the plan finder button label change.</Step>
          <Step kind="say">
            <Say>“Headline, highlight and the plan finder default are all fields. One edit, and the preview updates.”</Say>
          </Step>
          <Step kind="do"><strong>Guardrails.</strong> Select one section and change its style (<span className="mono">EhSectionStyle</span>) from grey to mint.</Step>
          <Step kind="say">
            <Say>“Marketers pick from approved options only. They never touch CSS, so the brand can&rsquo;t drift.”</Say>
          </Step>
          <Step kind="do"><strong>Compose.</strong> Drag the Savings band above Testimonials. Then add a new section from the eHealth block library and remove it again.</Step>
          <Step kind="say">
            <Say>“They rearrange and add sections from a library engineering built once. The page is assembled, not coded.”</Say>
          </Step>
          <Step kind="open">
            The shared <strong>Medicare plans</strong> Coverage Card (content key <span className="mono">48d40593f2d6401da87ca82fa4a4e4a6</span>). Keep the <Pill href={`${SITE}/`}>Live Home</Pill> tab ready.
          </Step>
          <Step kind="do"><strong>Edit once, update everywhere.</strong> Change the card&rsquo;s text, publish, then refresh the live homepage and show the Coverage grid has changed.</Step>
          <Step kind="say">
            <Say>“It&rsquo;s one shared item, not a copy. Edit it once and every page that uses it updates. The same item can feed every app.”</Say>
          </Step>
          <Step kind="do"><strong>Govern.</strong> Schedule the publish for a later time, send it through approval, then open <strong>version history</strong>. Point out that the default page is on v1695, then compare two versions and roll one back.</Step>
          <Step kind="say">
            <Say>“Nothing goes live without a schedule and an approval, and every change is versioned. v1695 on this page shows how many iterations it&rsquo;s been through.”</Say>
          </Step>
          <Step kind="open">
            <strong>The banner moment</strong> <span className="chip c-green">DONE (G2)</span>: the <strong>Site settings</strong> item (shared-blocks folder, content key <span className="mono">b55f002785614cd0b37e535b48c45c3b</span>).
          </Step>
          <Step kind="do">Change “Medicare Annual Enrollment is here!” to something else and publish. Change the label and the link URL together: the banner link goes to /medicare/. Then refresh the <Pill href={`${SITE}/`}>live site</Pill>. It reaches the site within about a minute.</Step>
          <Step kind="say">
            <Say>“During AEP this is the change that normally waits in an engineering queue. Here a marketer does it in a minute, and the same item controls the header phone number and the footer legal line.”</Say>
          </Step>
          <Step kind="do">Show that clearing the message hides the whole strip. Optionally schedule an “AEP ends Dec 7” version in the editor. <em>(Scheduling has not been tested from here, so treat it as a maybe.)</em> Put the original banner text back when you&rsquo;re done.</Step>
        </ol>
      </div>

      {/* ACT 3 */}
      <div className="act">
        <Head num={3} title="Personalize and test, keeping Adobe Target">
          <span className="chip c-n">10 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-n">RFI 8.1–8.11</span>
        </Head>
        <div className="open">
          <span className="open-lbl">Pre-open</span>
          <Pill href={CMS} tone="cms">CMS editor</Pill>
          <Pill href={FX_FLAG} tone="fx">FX flag</Pill>
          <Pill href={`${FX_FLAG}/rules/development`} tone="fx">FX rules (Dev)</Pill>
          <Pill href={`${FX_FLAG}/rules/development/edit/ehealth_aep_hero_test`} tone="fx">A/B rule</Pill>
          <Pill href={`${SITE}/?utm_campaign=aca`}>?utm_campaign=aca</Pill>
          <Pill href={`${SITE}/?utm_campaign=t65`}>?utm_campaign=t65</Pill>
          <Pill href="https://docs.optimizely.com/feature-experimentation/docs/configure-optimizely-cms-saas">Integration doc</Pill>
        </div>
        <ol className="steps">
          <Step kind="open">
            <Pill href={CMS} tone="cms">CMS editor</Pill>, then <strong>eHealth Home</strong>, then its <strong>content variations</strong>: <span className="mono">Turning65</span>, <span className="mono">AepSwitcher</span> and <span className="mono">AcaOep</span>.
          </Step>
          <Step kind="say">
            <Say>“One page, one URL, three alternate versions. Each carries a full copy of the 12 blocks and overrides only the hero text.”</Say>
          </Step>
          <Step kind="do">Open one variation and point at the hero fields it overrides. <em>(Heads up: the copies date from 18 Nov, so the G3 cleanup of 3 testimonials and working links reaches them through code, not through their own content.)</em></Step>
          <Step kind="do">Open a <strong>new incognito window</strong> so you start as a fresh visitor.</Step>
          <Step kind="open">
            <Pill href={`${SITE}/?utm_campaign=aca`}>?utm_campaign=aca</Pill> in the incognito window.
          </Step>
          <Step kind="say">
            <Say>“A visitor from an ACA campaign gets the Individual &amp; Family hero, with the plan finder already set to Individual.”</Say>
          </Step>
          <Step kind="open">
            <Pill href={`${SITE}/?utm_campaign=t65`}>?utm_campaign=t65</Pill> in a fresh incognito window.
          </Step>
          <Step kind="do">Point at the eyebrow “New to Medicare?” and the headline “Turning 65? Find the Medicare plan that fits you”.</Step>
          <Step kind="say">
            <Say>“Both are rendered on the server, so there&rsquo;s no flicker, and SEO stays intact.”</Say>
          </Step>
          <Step kind="open">
            <Pill href={FX_FLAG} tone="fx">ehealth_home_hero flag</Pill> in Feature Experimentation, then <Pill href={`${FX_FLAG}/rules/development`} tone="fx">FX rules (Dev)</Pill>.
          </Step>
          <Step kind="do">Point at the two <strong>targeted delivery rules</strong> (ACA audience and Turning 65 audience). Then open the <Pill href={`${FX_FLAG}/rules/development/edit/ehealth_aep_hero_test`} tone="fx">A/B rule</Pill>, which is the AEP hero test for everyone else.</Step>
          <Step kind="say">
            <Say>“Two rules deliver the ACA and Turning 65 heroes. Everyone else is in a 50/50 test on the AEP hero. The test excludes the campaign audiences, because A/B tests are evaluated first. The variable <span className="mono">cms-saas-content-variation</span> carries the CMS variation key.”</Say>
          </Step>
          <Step kind="do">Optional: show the plain homepage with no campaign, then add <span className="mono">?fx_reset=1</span> to re-roll the A/B bucket and see the other version.</Step>
          <Step kind="do"><strong>The Adobe Target point</strong> <span className="chip c-n">TALK</span>: open <span className="mono">lib/fx.ts</span> in the repo. It is the one place the variation key is chosen.</Step>
          <Step kind="say">
            <Say>“Your marketers author the variants here. Adobe Target, or anything else, decides who sees which one. Swap Feature Experimentation for Target&rsquo;s server-side delivery returning the same key, and the CMS and the editors don&rsquo;t change. You don&rsquo;t have to rip anything out to get self-service.”</Say>
          </Step>
          <Step kind="say">
            Be candid here. This is the honest limit.
            <Say>“I found no packaged Adobe Target connector for CMS SaaS in the docs, so this is a code-level integration point. That&rsquo;s an ‘I’ in your RFI response codes. Personalization in this demo is server-side Feature Experimentation only. Client-side Web Experimentation is deliberately not part of it.”</Say>
          </Step>
        </ol>
      </div>

      {/* ACT 4 */}
      <div className="act">
        <Head num={4} title="SEO parity with Yoast, then AEO">
          <span className="chip c-n">9 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-n">RFI 6.1–6.39</span>
        </Head>
        <div className="open">
          <span className="open-lbl">Pre-open</span>
          <Pill href={`${SITE}/small-business`}>/small-business</Pill>
          <Pill href={`${SITE}/medicare`}>/medicare</Pill>
          <Pill href={CMS} tone="cms">CMS editor</Pill>
          <Pill href={`${SITE}/robots.txt`}>/robots.txt</Pill>
          <Pill href={`${SITE}/sitemap.xml`}>/sitemap.xml</Pill>
          <Pill href={`${SITE}/llms.txt`}>/llms.txt</Pill>
          <Pill href="https://docs.optimizely.com/agent-platform/docs/seo-metadata-implementation-agent">SEO agent doc</Pill>
        </div>
        <ol className="steps">
          <Step kind="open">
            <Pill href={CMS} tone="cms">CMS editor</Pill>, then the <strong>/small-business</strong> page, then its SEO fields.
          </Step>
          <Step kind="do">Point at Meta Title, Meta Description and the OG image.</Step>
          <Step kind="say">
            <Say>“Every page has these fields, with a site-wide fallback. The site outputs the Open Graph and Twitter tags from them.”</Say>
          </Step>
          <Step kind="open">
            Mark (<Pill href="https://mark.optimizely.com">mark.optimizely.com</Pill>), and run the <em>SEO Metadata</em> agent on <span className="mono">/small-business</span>. Guide: <Pill href="https://docs.optimizely.com/agent-platform/docs/seo-metadata-implementation-agent">SEO agent doc</Pill>.
          </Step>
          <Step kind="say">
            <Say>“It audits the page, then writes its changes back as a draft in the CMS. A person approves it before anything goes live.”</Say>
          </Step>
          <Step kind="open">
            <Pill href={`${SITE}/sitemap.xml`}>/sitemap.xml</Pill>, <Pill href={`${SITE}/robots.txt`}>/robots.txt</Pill> and <Pill href={`${SITE}/llms.txt`}>/llms.txt</Pill>, one after another.
          </Step>
          <Step kind="say">
            <Say>“All three are generated from the CMS content tree, so nobody maintains them by hand. The robots rules allow search and answer-engine crawlers and block AI training crawlers.”</Say>
          </Step>
          <Step kind="open">
            <Pill href={`${SITE}/medicare`}>/medicare</Pill>, then use <strong>View Page Source</strong> (Ctrl+U, or Cmd+Option+U on a Mac).
          </Step>
          <Step kind="do">Search the source for <span className="mono">canonical</span>, then for <span className="mono">ld+json</span>.</Step>
          <Step kind="say">
            <Say>“Every page carries a canonical link, hreflang links and structured data: Organization, WebSite, WebPage and BreadcrumbList. That&rsquo;s clean, server-rendered markup.”</Say>
          </Step>
          <Step kind="do"><strong>AEO.</strong> Scroll <span className="mono">/medicare</span> to the FAQ block. Back in View Source, search for <span className="mono">FAQPage</span>. Repeat quickly on <span className="mono">/individual-and-family</span>.</Step>
          <Step kind="do">Run a GEO audit, then show <Pill href={`${SITE}/llms.txt`}>/llms.txt</Pill> again.</Step>
          <Step kind="say">
            <Say>“Yoast scores a draft. This gives you the fields, the governance and an AI coach, and your front end produces clean, server-rendered markup that answer engines can cite.”</Say>
          </Step>
        </ol>
      </div>

      {/* ACT 5 */}
      <div className="act">
        <Head num={5} title="One content hub, grouped by product line and channel">
          <span className="chip c-n">7 min</span>
          <span className="chip c-green">DONE (G6)</span>
          <span className="chip c-n">RFI 5.1–5.11, 14.4–14.5</span>
        </Head>
        <div className="open">
          <span className="open-lbl">Pre-open</span>
          <Pill href={CMS} tone="cms">CMS editor</Pill>
          <Pill href={`${SITE}/lp/aca-2027`}>/lp/aca-2027</Pill>
          <Pill href={`${SITE}/demo/groups`}>/demo/groups</Pill>
          <Pill href="https://docs.optimizely.com/cms-saas/docs/applications">Applications doc</Pill>
        </div>
        <ol className="steps">
          <Step kind="open">
            <Pill href={`${SITE}/demo/groups`}>/demo/groups</Pill> (the Graph query view).
          </Step>
          <Step kind="say">
            <Say>“Your RFI&rsquo;s real question was grouping that isn&rsquo;t tied to a domain. This runs the actual Graph query, and shows you the exact GraphQL.”</Say>
          </Step>
          <Step kind="do">Click the preset <em>“All organic Medicare pages”</em>. Point at the GraphQL on screen, which is scoped to the host and to the content tree under eHealth Home.</Step>
          <Step kind="do">Click the preset <em>“All paid ACA landing pages”</em>.</Step>
          <Step kind="do">Pick <strong>Dental &amp; Vision</strong>. A parent category returns its children (Dental and Vision).</Step>
          <Step kind="say">
            <Say>“Pages are grouped by product line and by channel, not by domain. Ask for a group and you get every page in it.”</Say>
          </Step>
          <Step kind="open">
            <Pill href={CMS} tone="cms">CMS editor</Pill>, then the categories.
          </Step>
          <Step kind="do">Point at <strong>Product line</strong> (Medicare, Individual &amp; Family, Small Business, Dental &amp; Vision with Dental and Vision inside it, Short-term) and <strong>Channel</strong> (Paid, Organic). The seven product pages are tagged Organic plus their product line.</Step>
          <Step kind="open">
            <Pill href={`${SITE}/lp/aca-2027`}>/lp/aca-2027</Pill>, the paid landing page.
          </Step>
          <Step kind="say">
            <Say>“This paid landing page is built from the same blocks as the home page: hero, Why eHealth, Live Advise and Steps. It adds two shared testimonials. It&rsquo;s tagged Individual &amp; Family and Paid, and set to noindex. Same content, different app context.”</Say>
          </Step>
          <Step kind="do">In the CMS, open <strong>Applications</strong> and show that each app has its own host and preview URL (per-app preview). Guide: <Pill href="https://docs.optimizely.com/cms-saas/docs/applications">Applications doc</Pill>.</Step>
        </ol>
      </div>

      {/* ACT 6 */}
      <div className="act">
        <Head num={6} title="AI in the editor’s workflow">
          <span className="chip c-n">6 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-green">es locale on</span>
          <span className="chip c-n">RFI 9.1–9.8, 10.1–10.6, 7.5, 11.6</span>
        </Head>
        <div className="open">
          <span className="open-lbl">Pre-open</span>
          <Pill href={CMS} tone="cms">CMS editor</Pill>
          <Pill href="https://mark.optimizely.com">Mark</Pill>
          <Pill href={`${SITE}/medicare`}>/medicare</Pill>
          <Pill href={`${SITE}/es`}>/es</Pill>
        </div>
        <ol className="steps">
          <Step kind="open">
            <Pill href="https://mark.optimizely.com">Mark</Pill> and the eHealth Home Coverage grid in the <Pill href={CMS} tone="cms">CMS editor</Pill>.
          </Step>
          <Step kind="do"><strong>Accessibility.</strong> Ask Mark to generate alt text for the 6 coverage-card images. They are empty today.</Step>
          <Step kind="say">
            <Say>“That&rsquo;s a real accessibility gap on the site, fixed live.”</Say>
          </Step>
          <Step kind="open">
            <Pill href={`${SITE}/es`}>/es</Pill>. Eyeball the page title first: it should say eHealth, not “eSalud”.
          </Step>
          <Step kind="say">
            <Say>“eHealth Home is already translated into Spanish. Now I&rsquo;ll translate a second page live.”</Say>
          </Step>
          <Step kind="do"><strong>Spanish.</strong> Ask Mark to translate <span className="mono">/medicare</span> into Spanish. The <span className="mono">es</span> locale is on.</Step>
          <Step kind="open">
            <Pill href={`${SITE}/es/medicare`}>/es/medicare</Pill>.
          </Step>
          <Step kind="say">
            <Say>“Anything not yet translated falls back to English. Before this translation, /es/medicare showed the English page, with its canonical link pointing at /medicare.”</Say>
          </Step>
          <Step kind="say">
            <Say>“AI output lands as a draft, goes through the approval step and leaves an audit trail. If your policy says no, generative AI can be turned off in the Opti ID admin.”</Say>
          </Step>
        </ol>
      </div>

      {/* ACT 7 */}
      <div className="act">
        <Head num={7} title="Under the hood for engineering">
          <span className="chip c-n">4 min</span>
          <span className="chip c-green">READY</span>
          <span className="chip c-n">RFI 13.1–13.10, 15.1–15.7</span>
        </Head>
        <div className="open">
          <span className="open-lbl">Pre-open</span>
          <Pill href="https://github.com/marvoey/opti-baseline">Template repo</Pill>
          <Pill href="https://docs.optimizely.com/cms-saas/docs/enable-live-preview-saas">Live preview doc</Pill>
          <Pill href={CMS} tone="cms">CMS editor</Pill>
        </div>
        <ol className="steps">
          <Step kind="open">
            <Pill href="https://github.com/marvoey/opti-baseline">Template repo</Pill>, then open one block file, for example <span className="mono">cms/EhHero.tsx</span>.
          </Step>
          <Step kind="say">
            <Say>“Content types are code. A block is one file that holds the content type and its React component. It&rsquo;s registered in <span className="mono">cms/registry.ts</span> and pushed to the CMS with <span className="mono">npm run cms:push</span>.”</Say>
          </Step>
          <Step kind="say">
            <Say>“The stack is Next.js 16 with the CMS SDK v2 and Graph. Locale routing with clean URLs lives in <span className="mono">proxy.ts</span>, and editor preview runs through <span className="mono">/preview</span>.”</Say>
          </Step>
          <Step kind="open">
            <Pill href="https://docs.optimizely.com/cms-saas/docs/enable-live-preview-saas">Live preview doc</Pill> if they want the detail. Otherwise skip.
          </Step>
          <Step kind="say">
            <Say>“The site deploys on Vercel today. Akamai can sit in front of the front end and the static assets. That&rsquo;s a hosting decision, not a CMS feature.”</Say>
          </Step>
          <Step kind="do"><span className="chip c-n">OPTIONAL</span> Show the source-file tools: Mark can read and edit this project in a sandbox, with backups and a stale-edit check. It&rsquo;s an “AI for developers” moment.</Step>
        </ol>
      </div>

      {/* ACT 8 */}
      <div className="act">
        <Head num={8} title="Migration path and next step">
          <span className="chip c-n">4 min</span>
          <span className="chip c-n">TALK</span>
          <span className="chip c-n">RFI 16, 17</span>
        </Head>
        <div className="open">
          <span className="open-lbl">Pre-open</span>
          <Pill href="/demo/rfi">RFI summary canvas</Pill>
        </div>
        <ol className="steps">
          <Step kind="open">
            <Pill href="/demo/rfi">RFI summary canvas</Pill> and scroll to <strong>16. Migration from WordPress</strong>.
          </Step>
          <Step kind="say">
            <Say>“Migration from WordPress goes through the management API. Gutenberg blocks map to our Eh blocks. Yoast titles and descriptions map to MetaTitle and MetaDescription. Redirects are generated from the old URLs.”</Say>
          </Step>
          <Step kind="do">Show the success criteria you wrote down in Act 0. Go through them one at a time and say which act answered each.</Step>
          <Step kind="say">
            Now move from the product to their process. Ask each question below, then stop talking and write the answer down.
            <Say>“Thanks for your time today. I&rsquo;d like to understand where you are in the process, so I can make the next steps useful.”</Say>
          </Step>
          <Step kind="ask">
            <Say>“Where are you in your evaluation? Do you have a vendor of choice today, or is it still open?”</Say>
          </Step>
          <Step kind="ask">
            <Say>“Who else are you looking at, and what would make one platform stand out for you?”</Say>
          </Step>
          <Step kind="ask">
            <Say>“What does the decision process look like from here? Who is involved (marketing, engineering, SEO, security, legal and compliance, procurement), who signs off, and what are the steps?”</Say>
          </Step>
          <Step kind="ask">
            <Say>“Is there a date you need a decision by, for example ahead of next enrollment season?”</Say>
          </Step>
          <Step kind="ask">
            The security section of the RFI (§12) is talk track only, so offer to send it.
            <Say>“Who on your security team should receive our security answers?”</Say>
          </Step>
          <Step kind="ask">
            <Say>“What would you need from us next to move forward?”</Say>
          </Step>
          <Step kind="do">Write down the names, the steps, the dates and who owns each one. Agree the next conversation (who, when) before you hang up.</Step>
          <Step kind="say">
            <Say>“I&rsquo;ll send a recap today with what we covered and the answers to your questions.”</Say>
          </Step>
          <Step kind="do">
            <em>Only if THEY bring up a proof of concept or pilot, never first:</em> ask what it would need to prove to them, and write it down. Don&rsquo;t propose a scope unprompted.
          </Step>
        </ol>
      </div>
    </section>
  );
}
