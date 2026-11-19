// Section #angle of /demo/flow, generated from the ehealth_friday_demo_flow.html
// canvas (v8). See ../page.tsx before editing by hand.

export default function Angle() {
  return (
    <section id="angle" className="card">
      <h2 className="h2">1. The angle: two enrollment windows, one engineering queue</h2>
      <p>On Friday eHealth will be in the <strong>middle of Medicare AEP</strong> (15 Oct–7 Dec) and of <strong>ACA Open Enrollment</strong>, which runs 1 Nov–15 Jan in most states. These are their highest-stakes weeks. The demo site&apos;s own banner says &quot;Medicare Annual Enrollment is here!&quot;.</p>
      <p>The RFI&apos;s Business Context describes a team that can&apos;t change pages or run tests without engineering. Frame the call around the cost of that delay during enrollment, not the cost of WordPress.</p>
      <div className="say">&quot;Right now, if your Individual &amp; Family team wants a different homepage hero for paid ACA traffic while Medicare owns the default, who has to do the work, and how long does it take? Let&apos;s do it live in the next 10 minutes.&quot;</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="stat">
          <div className="stat-num">12</div>
          <div className="stat-lbl">CMS sections on the homepage</div>
        </div>
        <div className="stat">
          <div className="stat-num">18</div>
          <div className="stat-lbl">Content types (14 are eHealth blocks)</div>
        </div>
        <div className="stat">
          <div className="stat-num">7</div>
          <div className="stat-lbl">Product pages, nav built from the CMS tree</div>
        </div>
        <div className="stat">
          <div className="stat-num">3</div>
          <div className="stat-lbl">CMS hero variations, live and chosen by FX rules</div>
        </div>
      </div>
      <h3>Three things they should leave believing</h3>
      <ol className="num">
        <li><strong>Marketers can ship within guardrails:</strong> Visual Builder, eHealth&apos;s own blocks, approved section styles, scheduling and approvals.</li>
        <li><strong>They keep Adobe Target:</strong> the CMS holds the variant content, and any decision engine can choose which variant to serve. Show it with Feature Experimentation, then show where Target plugs into the same point in the code.</li>
        <li><strong>SEO and AEO work in a headless setup:</strong> the content model provides the fields, the front end renders the output, and Mark agents give SEO coaching in the CMS.</li>
      </ol>
    </section>
  );
}
