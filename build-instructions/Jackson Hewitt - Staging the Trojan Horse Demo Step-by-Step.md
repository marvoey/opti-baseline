# Step-by-Step Guide: Staging Content for the Jackson Hewitt "Trojan Horse Demo"

This guide details exactly how to build, stage, and execute the mock assets and workflows for the Jackson Hewitt **Agentic Use Case Discovery & Scoping** call. 

The goal of this "Trojan Horse" approach is to satisfy Dana Justin’s desire to see a demo while keeping the conversation firmly anchored to their operational bottlenecks, quantitative scoping metrics, and architectural decisions.

---

## Part 1: Pre-Call Preparation & Content Asset Checklist

To avoid live LLM latency or API hiccups, follow a **dual-track staging strategy**: have live prompts ready to execute, but keep pre-generated tabs open as an instant failsafe.

### 1. Target Webpages from Jackson Hewitt
Open these exact pages from `jacksonhewitt.com` in dedicated browser tabs:
1. **Tax Deduction & Filing Info Page:** `https://www.jacksonhewitt.com/tax-help/tax-tips-topics/filing-your-taxes/` or standard deduction guides.
2. **Refund Advance / Season Kickoff Page:** `https://www.jacksonhewitt.com/file-taxes-options-products/refund-advance/` (or in-store Walmart filing page).
3. **$25 Online DIY Filing Page:** `https://www.jacksonhewitt.com/file-taxes-options-products/file-taxes-online/`.

---

## Part 2: Step-by-Step Workflow & Prompt Setup

### Step 1: Stage Act 1 — The Annual Tax Rule Audit & Bulk Refresh
*(Addresses Dana’s specific pain: Auditing hundreds of pages mentioning outdated tax year rules)*

#### A. The Exact Prompt to Copy-Paste into Mark / Opal
```text
Act as a Senior Tax Content Strategist and CMS Auditor for Jackson Hewitt.

Review our tax education and promotional landing page content for outdated 2025 tax season parameters. 
Perform an audit against the updated 2026 IRS tax guidelines:
1. Standard Deduction updates (Single: $14,600 → $15,000; Married Joint: $29,200 → $30,000; Head of Household: $21,900 → $22,500).
2. Filing Deadline & Tax Day updates (April 15, 2026 tax filing deadlines).
3. Early Season Refund Advance loan promo dates (updating 2025 campaign dates to 2026/2027).

Format the output as an actionable CMS Audit Report table with columns:
- Page / Content Block Name
- Current 2025 Copy (Outdated)
- Proposed 2026 Update (IRS Compliant)
- Compliance Risk Level (High / Medium / Low)
- Editor Action (Approve Update / Manual Review Needed)

Follow this with a draft of the updated 2026 "Standard Deduction & Key Dates" content block ready for direct publishing in CMS.
```

#### B. The Pre-Baked Failsafe Response (Keep in a Backup Tab/Document)
If running live takes more than 10 seconds, switch to this pre-staged output:

| Page / Content Block | Current 2025 Copy (Outdated) | Proposed 2026 Update (IRS Compliant) | Compliance Risk | Editor Action |
|---|---|---|---|---|
| **Tax Help / Standard Deduction** | *"For 2025, single filers can claim a $14,600 standard deduction, while married couples filing jointly receive $29,200."* | *"For the 2026 tax year, single filers can claim a $15,000 standard deduction, while married couples filing jointly receive $30,000."* | **High** | [Approve & Push to CMS] |
| **Important Tax Deadlines** | *"Mark your calendar: Tax Day is Tuesday, April 15, 2025. File before midnight to avoid IRS penalties."* | *"Mark your calendar: Tax Day is Wednesday, April 15, 2026. File before midnight to avoid IRS penalties."* | **High** | [Approve & Push to CMS] |
| **Refund Advance Loan Overview** | *"Get up to $3,500 with a 0% APR Refund Advance starting December 2024 through February 2025."* | *"Get up to $3,500 with a 0% APR Refund Advance starting December 2025 through February 2026."* | **Medium** | [Approve & Push to CMS] |
| **Walmart In-Store Kiosk FAQ** | *"Drop off your 2024 W-2s at any of our 3,000+ Walmart locations during January 2025."* | *"Drop off your 2025 W-2s at any of our 3,000+ Walmart locations during January 2026."* | **Medium** | [Approve & Push to CMS] |

---

### Step 2: Stage Act 2 — Peak-Season Intent Experimentation
*(Addresses the value multiplier: Generating variants to feed their Web Experimentation license)*

#### A. The Exact Prompt to Copy-Paste into Mark / Opal
```text
Act as an Experimentation Lead for Jackson Hewitt.

We want to run an A/B/n test on our primary high-traffic homepage banner during the peak January tax rush. 
Our baseline copy is: "File Your Taxes with Jackson Hewitt. Max Refund Guaranteed."

Generate 3 distinct, high-converting test variations tailored to our primary audience segments, including hypothesis, headline, supporting copy, and CTA:

1. Variation A (Walmart Walk-In / Convenience): Target working parents and shoppers who want in-person reassurance without an appointment.
2. Variation B (Flat $25 Online DIY): Target cost-conscious, independent W-2 filers looking for speed and transparent pricing.
3. Variation C (Refund Advance Seekers): Target early filers in January needing immediate cash flow before official IRS payout dates.
```

#### B. The Pre-Baked Failsafe Response

* **Variation A: Local Convenience (Walmart Retail Footprint)**
  * **Hypothesis:** Promoting retail convenience and zero-wait walk-ins will increase local office bookings among in-person filers.
  * **Headline:** *"File While You Shop: Expert Tax Help Inside Your Local Walmart."*
  * **Subhead:** *"No appointments needed. Walk in today, meet with a certified Tax Pro, and leave with your max refund guaranteed."*
  * **CTA:** *"Find a Walmart Tax Pro Near You"*

* **Variation B: Transparent Value (Digital DIY $25 Flat Rate)**
  * **Hypothesis:** Highlighting fixed, no-surprise pricing directly challenges TurboTax's hidden tier upgrades and reduces landing page bounce.
  * **Headline:** *"Simple, Flat $25 Tax Filing. Federal & State Included."*
  * **Subhead:** *"No surprise fees or hidden upgrades based on schedules. Fast, secure online filing from your phone or laptop."*
  * **CTA:** *"Start Your $25 Return Today"*

* **Variation C: Immediate Liquidity (Early Season Refund Advance)**
  * **Hypothesis:** Leading with $0 fee early liquidity captures early January filers who prioritize immediate access to refund dollars.
  * **Headline:** *"Need Cash Fast? Get Up to $3,500 in Minutes with 0% APR."*
  * **Subhead:** *"Don't wait weeks for the IRS. Qualified filers can get an Early Refund Advance loan within 24 hours of filing."*
  * **CTA:** *"Apply for Refund Advance"*

---

## Part 3: Minute-by-Minute Execution Script

| Time | Agenda Step | Screen Display | Action & Spoken Talk Track |
|---|---|---|---|
| **00:00 – 03:00** | Up-Front Contract | Camera / Agenda Slide | Set expectations: *"We’re going to look at the exact workflow Dana highlighted—updating seasonal tax rules—and use that to see how many hours/credits you actually need."* |
| **03:00 – 07:00** | **Act 1: Tax Rule Audit Demo** | Mark / Opal Interface | 1. Paste Prompt 1.<br>2. Generate/display the Audit Table.<br>3. Show side-by-side copy diffs.<br>4. Highlight editor approval governance. |
| **07:00 – 11:00** | **The Act 1 Discovery Pivot** | Mark UI / Camera | **Stop typing. Ask Dana directly:**<br>*"Dana, when your team does this manually across your site in Q4, how many total pages are touched? How many weeks of editor time does this consume?"* *(Note down pages & hours).* |
| **11:00 – 15:00** | **Act 2: Experimentation Demo** | Mark / Opal Interface | 1. Paste Prompt 2.<br>2. Generate the 3 intent variations.<br>3. Show how variants connect directly to Web Experimentation to feed tests in peak season. |
| **15:00 – 18:00** | **The Act 2 Discovery Pivot** | Camera | **Ask the throughput question:**<br>*"You own Web Experimentation and Personalization. During peak tax season, what is the bottleneck that stops you from running 10 variations like this—copywriting or approvals?"* |
| **18:00 – 25:00** | **Act 3: The SA Architecture Pivot** | Whiteboard / Architecture Slide | **Transition to Matthew & Tech Leads:**<br>1. *"Dana, if we wait until August 2027, your team will have to do this manual audit twice more. Why wait?"*<br>2. *"Matthew, since your architects want ES to help with the database migration from 11 to 13, you are already doing a major re-architecture. Have you evaluated skipping PaaS and moving straight to CMS SaaS to eliminate upgrades forever?"* |
| **25:00 – 30:00** | Next Steps & Scoping Wrap-up | Shared Notes | Summarize volume metrics for Cat's pricing estimate; agree on Next Steps (SOW review + SaaS architecture evaluation). |

---

## Part 4: Browser Tab Staging Checklist (Setup 15 Mins Before Call)

- [ ] **Tab 1:** Optimizely Opal / Mark workspace (logged in and verified active).
- [ ] **Tab 2:** Text document / notepad with Prompts 1 & 2 ready for quick copy-paste.
- [ ] **Tab 3:** Backup tab with pre-generated responses open (in case of live tool timeout).
- [ ] **Tab 4:** Live `jacksonhewitt.com` tax-help landing page.
- [ ] **Tab 5:** Optimizely CMS editor interface (showing block/page authoring if visual context is needed).
- [ ] **Tab 6:** Private notepad open to record:
  - *Number of active CMS editors*
  - *Estimated pages requiring annual tax refresh*
  - *Peak-season experiment target volume*
  - *Matthew's response on .NET vs. React/Next.js readiness*
