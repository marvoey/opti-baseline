import Link from 'next/link';
import s from './opal.module.css';

const OpalIcon = () => (
  <div className={s.oi}>
    <svg width="9" height="9" fill="none" stroke="#7c3aed" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  </div>
);

const OpalHeader = () => (
  <div className={s.rcOh}>
    <OpalIcon />
    <span className={s.on}>Opal Knowledge Assistant</span>
  </div>
);

const Source = ({ label }: { label: string }) => (
  <span className={s.sc2}><span className={s.sd} />{label}</span>
);

const Brain = ({ color, label, children }: { color: string; label: string; children: React.ReactNode }) => (
  <div className={s.mb}>
    <div className={s.ml}>Content Model — CMS SaaS</div>
    <span className={s.ctb} style={{ background: color }}>{label}</span>
    <div className={s.fbs}>{children}</div>
  </div>
);

type FcColor = 'bl' | 'gr' | 'am' | 'pu' | 're';
const FC_CLASS: Record<FcColor, string> = { bl: s.fbBl, gr: s.fbGr, am: s.fbAm, pu: s.fbPu, re: s.fbRe };

const Field = ({ fc, fk, fv, fn, badge }: { fc: FcColor; fk: string; fv: string; fn?: string; badge?: string }) => (
  <div className={`${s.fb} ${FC_CLASS[fc]}`}>
    <div className={s.fk}>{fk}</div>
    <div className={s.fv}>
      {fv}
      {badge && <span className={`${s.fbg} ${s.fbgOv}`}>{badge}</span>}
    </div>
    {fn && <div className={s.fn}>{fn}</div>}
  </div>
);

const NAV_ITEMS = [
  { href: '#coverage',       label: 'Coverage Rule' },
  { href: '#exclusion',      label: 'Exclusion Rule' },
  { href: '#benefit',        label: 'Benefit' },
  { href: '#discount',       label: 'Discount' },
  { href: '#program',        label: 'Program' },
  { href: '#life-event',     label: 'Life Event' },
  { href: '#recommendation', label: 'Recommendation' },
  { href: '#procedure',      label: 'Procedure' },
];

export default function RenderPreviewPage() {
  return (
    <div className={s.page}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className={s.ph}>
        <span className={s.phBrand}>Progressive × Optimizely</span>
        <span className={s.phSep}>|</span>
        <span className={s.phTitle}>Render Preview — Opal Consultant UI</span>
        <Link href="/component-library" className={s.phBack}>Schema</Link>
        <Link href="/demo" className={s.phBack} style={{ marginLeft: 4 }}>Demo</Link>
      </div>

      {/* ── Sticky nav ─────────────────────────────────── */}
      <nav className={s.sn}>
        {NAV_ITEMS.map(({ href, label }) => (
          <a key={href} href={href} className={s.snLink}>{label}</a>
        ))}
      </nav>

      <div className={s.main}>

        {/* ══════════════════════════════════════════════
            1. PrgvCoverageRule
        ══════════════════════════════════════════════ */}
        <section className={s.section} id="coverage">
          <div className={s.sh}>
            <div className={s.shNum}>01</div>
            <div>
              <div className={s.shTitle}>PrgvCoverageRule</div>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagLob}`}>Personal Auto</span>
                <span className={`${s.tag} ${s.tagTop}`}>Coverage Options</span>
                <span className={`${s.tag} ${s.tagJur}`}>National</span>
              </div>
            </div>
          </div>

          <div className={s.ex}>
            <div className={s.xl}>Scenario</div>
            <div className={s.xq}>"John was in a fender bender — the other driver is claiming a back injury. What are his personal auto liability limits?"</div>
            <div className={s.ms}>
              <div className={s.mf}>
                <div className={s.ml}>Response — Opal Consultant UI</div>
                <div className={s.rc}>
                  <OpalHeader />
                  <h4>Liability Coverage Summary — Platinum</h4>
                  <table className={s.lt}>
                    <tbody>
                      <tr><td>Bodily Injury</td><td>$100,000 per person / $300,000 per accident</td></tr>
                      <tr><td>Property Damage</td><td>$100,000 per accident</td></tr>
                      <tr><td>Medical Payments</td><td>$5,000 per person</td></tr>
                    </tbody>
                  </table>
                  <h4>Consultant Guidance</h4>
                  <p>Advise John: do <strong>not</strong> admit fault, avoid discussing the incident outside official claims channels, document the scene with photos, and refer all correspondence to Progressive.</p>
                  <div className={s.rs}>
                    <div className={s.rsl}>Sources</div>
                    <div className={s.rsc}>
                      <Source label="Auto Liability — Platinum" />
                      <Source label="Consultant Guidance — Claims" />
                    </div>
                  </div>
                </div>
              </div>
              <Brain color="#007BC7" label="PrgvCoverageRule">
                <Field fc="bl" fk="LineOfBusiness / Topic" fv="Personal Auto / Coverage Options" />
                <Field fc="bl" fk="PolicyTier" fv="Platinum" badge="Platinum Override" />
                <Field fc="am" fk="CoreDefinition → limits.bodilyInjury" fv="$100K per person / $300K per accident" fn="Master (Standard): $50K / $100K" badge="Platinum" />
                <Field fc="am" fk="CoreDefinition → limits.propertyDamage" fv="$100,000 per accident" />
                <Field fc="pu" fk="CoreDefinition → limits.medPay" fv="$5,000 per person" />
                <Field fc="pu" fk="Exceptions → consultantGuidance" fv="Rich Text: no admission of fault, documentation advice, referral to claims" />
              </Brain>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            2. PrgvExclusionRule
        ══════════════════════════════════════════════ */}
        <section className={s.section} id="exclusion">
          <div className={s.sh}>
            <div className={s.shNum}>02</div>
            <div>
              <div className={s.shTitle}>PrgvExclusionRule</div>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagLob}`}>Personal Auto</span>
                <span className={`${s.tag} ${s.tagLob}`}>Homeowners</span>
                <span className={`${s.tag} ${s.tagTop}`}>Coverage Options</span>
                <span className={`${s.tag} ${s.tagJur}`}>National</span>
              </div>
            </div>
          </div>

          <div className={s.ex}>
            <div className={s.xl}>Scenario</div>
            <div className={s.xq}>"John's laptop and camera gear were stolen from his car in a parking garage — does his personal auto or homeowners policy cover the stolen items?"</div>
            <div className={s.ms}>
              <div className={s.mf}>
                <div className={s.ml}>Response — Opal Consultant UI</div>
                <div className={`${s.rc} ${s.rcGap}`}>
                  <OpalHeader />
                  <h4>Auto Policy: Not Covered</h4>
                  <p>Personal Auto policies do <strong>not cover personal property</strong> inside the vehicle — this is a standard exclusion across all auto products.</p>
                  <h4>Homeowners: Off-Premises Personal Property</h4>
                  <p>The stolen items are covered under the Homeowners <strong>off-premises personal property</strong> provision — up to <strong>10% of his personal property limit</strong> (~$8,500 on this policy).</p>
                  <p>Coverage is at <strong>Actual Cash Value (ACV)</strong> unless a Replacement Cost endorsement is active.</p>
                  <div className={s.rs}>
                    <div className={s.rsl}>Sources</div>
                    <div className={s.rsc}>
                      <Source label="Auto Personal Property Exclusion" />
                      <Source label="HO Off-Premises Rider" />
                    </div>
                  </div>
                </div>
              </div>
              <Brain color="#E74C3C" label="PrgvExclusionRule">
                <Field fc="bl" fk="LineOfBusiness / Topic" fv="Personal Auto / Personal Property" />
                <Field fc="re" fk="ExclusionText" fv="Personal property inside vehicle: excluded (all tiers, all states)" />
                <Field fc="pu" fk="RedirectNote" fv="→ Homeowners off-premises personal property coverage" />
                <Field fc="pu" fk="ReferralProduct" fv="HO Off-Premises Personal Property" />
              </Brain>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            3. PrgvBenefit
        ══════════════════════════════════════════════ */}
        <section className={s.section} id="benefit">
          <div className={s.sh}>
            <div className={s.shNum}>03</div>
            <div>
              <div className={s.shTitle}>PrgvBenefit</div>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagLob}`}>Personal Auto</span>
                <span className={`${s.tag} ${s.tagTop}`}>Coverage Options</span>
                <span className={`${s.tag} ${s.tagJur}`}>FL</span>
              </div>
            </div>
          </div>

          <div className={s.ex}>
            <div className={s.xl}>Scenario</div>
            <div className={s.xq}>"John's car is going into the shop for hail repairs — what does his Florida personal auto policy cover for a rental while it's out?"</div>
            <div className={s.ms}>
              <div className={s.mf}>
                <div className={s.ml}>Response — Opal Consultant UI</div>
                <div className={s.rc}>
                  <OpalHeader />
                  <h4>Rental Reimbursement Confirmed — Platinum</h4>
                  <p>John's Platinum policy includes rental reimbursement at <strong>$50/day for up to 30 days</strong>. Standard tier is $30/day up to 21 days.</p>
                  <p>Preferred in-network vendors:</p>
                  <div className={s.cr}>
                    <span className={`${s.chip} ${s.chipI}`}>Enterprise</span>
                    <span className={`${s.chip} ${s.chipI}`}>Hertz</span>
                    <span className={`${s.chip} ${s.chipI}`}>National</span>
                  </div>
                  <span className={s.ab}>Authorize Rental</span>
                  <div className={s.rs}>
                    <div className={s.rsl}>Sources</div>
                    <div className={s.rsc}><Source label="Auto Rental — Platinum Tier" /></div>
                  </div>
                </div>
              </div>
              <Brain color="#27AE60" label="PrgvBenefit">
                <Field fc="bl" fk="LineOfBusiness / Topic / PolicyTier" fv="Personal Auto / Rental Reimbursement / Platinum" />
                <Field fc="am" fk="PrimaryLimit" fv="$50/day" badge="Platinum Override" fn="MasterPrimaryLimit: $30/day" />
                <Field fc="am" fk="SecondaryLimit" fv="30 days" badge="Platinum Override" fn="MasterSecondaryLimit: 21 days" />
                <Field fc="gr" fk="Vendors" fv='"Enterprise, Hertz, National"' />
                <Field fc="pu" fk="EnrollmentAction" fv='"Authorize Rental"' />
              </Brain>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            4. PrgvDiscount
        ══════════════════════════════════════════════ */}
        <section className={s.section} id="discount">
          <div className={s.sh}>
            <div className={s.shNum}>04</div>
            <div>
              <div className={s.shTitle}>PrgvDiscount</div>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagLob}`}>Personal Auto</span>
                <span className={`${s.tag} ${s.tagLob}`}>Homeowners</span>
                <span className={`${s.tag} ${s.tagTop}`}>Discounts</span>
                <span className={`${s.tag} ${s.tagJur}`}>FL</span>
              </div>
            </div>
          </div>

          <div className={s.ex}>
            <div className={s.xl}>Scenario</div>
            <div className={s.xq}>"What discounts is John currently missing out on for his Florida home and auto bundle?"</div>
            <div className={s.ms}>
              <div className={s.mf}>
                <div className={s.ml}>Response — Opal Consultant UI</div>
                <div className={`${s.rc} ${s.rcOpp}`}>
                  <OpalHeader />
                  <h4>3 Unenrolled Discounts Found</h4>
                  <div className={s.or}>
                    <div className={s.ori}>
                      <span className={s.orn}>Snapshot® Telematics</span>
                      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span className={s.ors}>Up to 30%</span>
                        <span className={s.ore}>Not enrolled</span>
                      </span>
                    </div>
                    <div className={s.ori}>
                      <span className={s.orn}>Paperless Billing</span>
                      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span className={s.ors}>$5/month</span>
                        <span className={s.ore}>Not enrolled</span>
                      </span>
                    </div>
                    <div className={s.ori}>
                      <span className={s.orn}>Pay-in-Full</span>
                      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span className={s.ors}>Up to 8%</span>
                        <span className={s.ore}>Not enrolled</span>
                      </span>
                    </div>
                  </div>
                  <div className={s.rs}>
                    <div className={s.rsl}>Sources</div>
                    <div className={s.rsc}>
                      <Source label="Discount Catalog — Auto" />
                      <Source label="Discount Catalog — HO" />
                    </div>
                  </div>
                </div>
              </div>
              <Brain color="#E67E22" label="PrgvDiscount × 3">
                <Field fc="gr" fk="discount[0].DiscountName / SavingsRange" fv="Snapshot® Telematics / Up to 30%" />
                <Field fc="gr" fk="discount[1].DiscountName / SavingsAmount" fv="Paperless Billing / $5/month" />
                <Field fc="gr" fk="discount[2].DiscountName / SavingsRange" fv="Pay-in-Full / Up to 8% of premium" />
                <div className={s.bcrm}>Assembly filter: enrolled = false AND eligible = true — enrollment status read from CRM, not stored in CMS</div>
              </Brain>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            5. PrgvProgram
        ══════════════════════════════════════════════ */}
        <section className={s.section} id="program">
          <div className={s.sh}>
            <div className={s.shNum}>05</div>
            <div>
              <div className={s.shTitle}>PrgvProgram</div>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagLob}`}>Personal Auto</span>
                <span className={`${s.tag} ${s.tagTop}`}>Tools</span>
                <span className={`${s.tag} ${s.tagJur}`}>National</span>
              </div>
            </div>
          </div>

          <div className={s.ex}>
            <div className={s.xl}>Scenario</div>
            <div className={s.xq}>"Are there any Progressive telematics tools that could lower John's personal auto premium based on his driving behavior?"</div>
            <div className={s.ms}>
              <div className={s.mf}>
                <div className={s.ml}>Response — Opal Consultant UI</div>
                <div className={s.rc}>
                  <OpalHeader />
                  <h4>Snapshot® Telematics Program</h4>
                  <p>Snapshot® monitors driving behavior via a <strong>mobile app or plug-in device</strong> over a 6-month measurement period.</p>
                  <h4>Discount Structure</h4>
                  <table className={s.lt}>
                    <tbody>
                      <tr><td>Enrollment discount</td><td>Up to 10% — applied immediately</td></tr>
                      <tr><td>Renewal discount</td><td>Up to 30% — behavior-based</td></tr>
                    </tbody>
                  </table>
                  <span className={s.ab}>Enroll in Snapshot</span>
                  <div className={s.rs}>
                    <div className={s.rsl}>Sources</div>
                    <div className={s.rsc}><Source label="Snapshot Program — National" /></div>
                  </div>
                </div>
              </div>
              <Brain color="#9B59B6" label="PrgvProgram">
                <Field fc="bl" fk="LineOfBusiness / Topic" fv="Personal Auto / Tools + Telematics" />
                <Field fc="gr" fk="ProgramName / MeasurementPeriod" fv="Snapshot® / 6 months (app or plug-in)" />
                <Field fc="am" fk="ParticipationDiscount" fv="Up to 10% — applied at enrollment" />
                <Field fc="am" fk="RenewalDiscount" fv="Up to 30% — behavior-based at renewal" />
                <Field fc="pu" fk="ScoringFactors" fv='["Hard Braking (−)", "Late Night (−)", "Low Mileage (+)", "Smooth Accel (+)"]' />
                <Field fc="pu" fk="EnrollmentAction" fv='"Enroll in Snapshot"' />
              </Brain>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            6. PrgvLifeEvent
        ══════════════════════════════════════════════ */}
        <section className={s.section} id="life-event">
          <div className={s.sh}>
            <div className={s.shNum}>06</div>
            <div>
              <div className={s.shTitle}>PrgvLifeEvent</div>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagLob}`}>Personal Auto</span>
                <span className={`${s.tag} ${s.tagLob}`}>Homeowners</span>
                <span className={`${s.tag} ${s.tagTop}`}>Transition Guidelines</span>
                <span className={`${s.tag} ${s.tagJur}`}>FL → OH</span>
              </div>
            </div>
          </div>

          <div className={s.ex}>
            <div className={s.xl}>Scenario</div>
            <div className={s.xq}>"John's daughter is moving to Ohio for college and taking the second car — what changes need to be made to his Florida auto and homeowners policies?"</div>
            <div className={s.ms}>
              <div className={s.mf}>
                <div className={s.ml}>Response — Opal Consultant UI</div>
                <div className={`${s.rc} ${s.rcLife}`}>
                  <OpalHeader />
                  <h4>Life Event: Student Away — Changes Required</h4>
                  <h4>Auto Policy</h4>
                  <p>Garaging address must update to OH. As a <strong>full-time student</strong> (not a permanent state change), coverage continues — but the garaging state affects the premium. FL-titled vehicle: registration update may be required within <strong>30 days</strong> of establishing OH residency.</p>
                  <h4>Homeowners Policy</h4>
                  <p>Dorm contents are covered under the <strong>off-premises personal property</strong> provision, up to 10% of the personal property limit (~$8,500). A Renters policy would provide broader coverage.</p>
                  <span className={s.ab}>Update Garaging Address</span>
                  <div className={s.rs}>
                    <div className={s.rsl}>Sources</div>
                    <div className={s.rsc}>
                      <Source label="Auto Transition — Student Away" />
                      <Source label="HO Off-Premises" />
                      <Source label="FL → OH Jurisdiction Note" />
                    </div>
                  </div>
                </div>
              </div>
              <Brain color="#16A085" label="PrgvLifeEvent">
                <Field fc="bl" fk="Topic / LifeEventType" fv="Transition / Student Away at College" />
                <Field fc="gr" fk="AutoChanges" fv="Update garaging to OH; FL registration note for FL-titled vehicles" />
                <Field fc="gr" fk="HomeChanges" fv="Dorm contents: off-premises personal property limit (10%)" />
                <Field fc="pu" fk="EligibilityRequirements" fv="Full-time student status required to maintain FL policy base" />
                <Field fc="am" fk="JurisdictionNote" fv="FL → OH garaging: premium recalculation + registration within 30 days" badge="FL → OH" />
                <Field fc="pu" fk="RequiredActions" fv='Update garaging address in system; trigger recalculation' />
              </Brain>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            7. PrgvRecommendation
        ══════════════════════════════════════════════ */}
        <section className={s.section} id="recommendation">
          <div className={s.sh}>
            <div className={s.shNum}>07</div>
            <div>
              <div className={s.shTitle}>PrgvRecommendation</div>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagLob}`}>Personal Auto</span>
                <span className={`${s.tag} ${s.tagLob}`}>Homeowners</span>
                <span className={`${s.tag} ${s.tagTop}`}>Upsell</span>
                <span className={`${s.tag} ${s.tagJur}`}>National</span>
              </div>
            </div>
          </div>

          <div className={s.ex}>
            <div className={s.xl}>Scenario</div>
            <div className={s.xq}>"Given his Platinum home and auto bundle in Florida, does John have enough liability protection or should we recommend umbrella coverage?"</div>
            <div className={s.ms}>
              <div className={s.mf}>
                <div className={s.ml}>Response — Opal Consultant UI</div>
                <div className={`${s.rc} ${s.rcRec}`}>
                  <OpalHeader />
                  <h4>Umbrella Coverage Recommended</h4>
                  <p>John's combined auto liability cap is $300,000. For a Platinum homeowner, financial planners typically recommend coverage equal to net worth. A $1M umbrella fills the gap at approximately <strong>$19/month</strong>.</p>
                  <h4>What Umbrella Adds</h4>
                  <div className={s.cr}>
                    <span className={`${s.chip} ${s.chipI}`}>Excess Liability</span>
                    <span className={`${s.chip} ${s.chipI}`}>Personal Injury (libel/slander)</span>
                    <span className={`${s.chip} ${s.chipI}`}>Worldwide Coverage</span>
                    <span className={`${s.chip} ${s.chipI}`}>Rental Property Liability</span>
                  </div>
                  <span className={s.ab}>Get Umbrella Quote</span>
                  <div className={s.rs}>
                    <div className={s.rsl}>Sources</div>
                    <div className={s.rsc}><Source label="Personal Umbrella — Upsell Guide" /></div>
                  </div>
                </div>
              </div>
              <Brain color="#2473AE" label="PrgvRecommendation">
                <Field fc="bl" fk="LineOfBusiness / RecommendationType" fv="Personal Umbrella / Upsell" />
                <Field fc="gr" fk="TriggerCondition" fv="Auto BI limit < $500K net worth threshold" />
                <Field fc="gr" fk="GapNarrative" fv="Rich Text: current limits vs. recommended for asset profile" />
                <Field fc="pu" fk="CoverageAdditions" fv='["Excess Liability", "Personal Injury", "Worldwide", "Rental Property"]' />
                <Field fc="am" fk="PricingNote" fv="~$19/month for $1M umbrella" />
                <Field fc="pu" fk="CtaLabel" fv='"Get Umbrella Quote"' />
                <div className={s.bcrm}>Net worth threshold check driven by CRM policy data — trigger logic, not stored in CMS</div>
              </Brain>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            8. PrgvProcedure
        ══════════════════════════════════════════════ */}
        <section className={s.section} id="procedure">
          <div className={s.sh}>
            <div className={s.shNum}>08</div>
            <div>
              <div className={s.shTitle}>PrgvProcedure</div>
              <div className={s.tags}>
                <span className={`${s.tag} ${s.tagLob}`}>Personal Auto</span>
                <span className={`${s.tag} ${s.tagTop}`}>Coverage Options</span>
                <span className={`${s.tag} ${s.tagJur}`}>National</span>
              </div>
            </div>
          </div>

          <div className={s.ex}>
            <div className={s.xl}>Scenario</div>
            <div className={s.xq}>"He hasn't filed a claim yet — how do we open a liability claim and what does he need to have ready?"</div>
            <div className={s.ms}>
              <div className={s.mf}>
                <div className={s.ml}>Response — Opal Consultant UI</div>
                <div className={`${s.rc} ${s.rcProc}`}>
                  <OpalHeader />
                  <h4>Liability Claim Intake</h4>
                  <p>To open a claim, gather:</p>
                  <ul className={s.cl}>
                    <li>Police report or case number</li>
                    <li>Other driver&apos;s contact info + insurance</li>
                    <li>Photos of scene and both vehicles</li>
                    <li>Witness names and contact info (if available)</li>
                  </ul>
                  <p style={{ marginTop: 6 }}>Initial contact from the Progressive claims team within <strong>24 hours</strong> of filing.</p>
                  <span className={s.ab}>Open Liability Claim</span>
                </div>
              </div>
              <Brain color="#D35400" label="PrgvProcedure — Claims Intake">
                <Field fc="bl" fk="ProcedureType" fv="Liability Claim Intake" />
                <Field fc="gr" fk="RequiredInfo" fv='["Police report", "Other party contact + insurance", "Scene photos", "Witness info"]' />
                <Field fc="pu" fk="ResponseTimeline" fv="Claims contact within 24 hours of filing" />
                <Field fc="am" fk="CtaLabel" fv='"Open Liability Claim"' />
              </Brain>
            </div>
          </div>
        </section>

      </div>{/* /main */}

      <footer className={s.footer}>
        <span>8 content types · Progressive × Optimizely CMS SaaS</span>
        <span>
          <Link href="/component-library" style={{ color: 'inherit', textDecoration: 'underline' }}>Schema browser</Link>
          {' '}·{' '}
          <code style={{ fontFamily: 'Courier New, monospace', fontSize: 10 }}>npm run config:push</code>
        </span>
      </footer>

    </div>
  );
}
