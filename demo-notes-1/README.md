# CIBC Mellon — Challenger Sale & RFP Materials

Strategic pitch materials and formal RFP documents for the CIBC Mellon engagement.
These files establish the commercial narrative, the POC delivery plan, and the
official Optimizely RFP response artifacts.

---

## Strategic narrative

These six documents build the Challenger Sale argument from first principles —
why the problem is urgent, how to reframe it, and how to demonstrate it live.

Read in this order for the full arc:

### 1. `critical-business-issues.md`

**Why they can't wait.** Five specific business drivers with named problems and
quantified impact, written for C-suite delivery:

- **Monolithic Agility Gap** — 2015-era website blocks marketing and operations teams
- **OSFI B-10/B-13 exposure** — legacy digital infrastructure is now a compliance liability
- **Alternative assets "Dark Data"** — unstructured Capital Call PDFs waste ~29% of analyst time
- **T+1 settlement compression** — no margin for delayed client communications
- **Bilingual/WCAG mandate** — manual translation is too slow and costly

This is the "why they need us" foundation for all downstream materials.

### 2. `agility-gap.md`

**The core strategic problem defined.** Names and frames the "Agility Gap" — the
distance between CIBC Mellon's 2015-era digital infrastructure and 2026-era business
ambitions — across four dimensions:

| Dimension | Optimizely solution |
|---|---|
| Monolithic Bottleneck | Headless CMS decouples content from presentation |
| OSFI Operational Resilience | Risk transfer to SOC 2 / ISO 27001 certified SaaS |
| Alternative Assets Dark Data | Opal AI turns the DAM into an intelligence engine |
| T+1 Information Velocity Squeeze | Real-time segmented omnichannel delivery |

Provides the conceptual vocabulary used throughout all other demo documents.

### 3. `strategic-evolution-map.md`

**The Challenger reframe ladder.** A five-row table mapping each literal RFP
requirement to a higher-stakes commercial narrative:

| RFP asks for | Reframed as |
|---|---|
| Redesigned corporate website | Operational Control Tower |
| Centralized asset storage | Ingestion and Intelligence Engine |
| AI content suggestions | Generative UI Workspace |
| Approval workflows | Compliance Moat |
| Personalization | Operational Precision |

Includes a verbatim three-step talking script for the presentation:
Acknowledge (baseline) → Disrupt (industry reality) → Reframe (elevated value).

### 4. `commercial-insights.md`

**The four Challenger commercial insights.** Each structured as Status Quo vs.
Reframe vs. Rationale, positioning the platform as an "Operational Command Center":

1. Content delivery as critical operational infrastructure for T+1 trade environments
2. DAM as an AI-powered intelligence engine eliminating the "manual tax"
3. OSFI compliance as a competitive moat excluding nimble fintechs
4. Personalization as operational precision — delivering regulatory signals, not promotions

Explains how these insights let the sales team bypass the marketing CMS budget
conversation and appeal directly to the COO, Chief Risk Officer, and Head of
Client Onboarding.

### 5. `cms-block-alignment.md`

**The technical bridge to the live demo.** Maps each of the four commercial
insights to a specific CIBC-prefixed CMS content type already registered in the
Optimizely instance:

| Commercial insight | CMS block |
|---|---|
| Content as Infrastructure | `CibcAlertFeed` |
| Private Markets Dark Data | `CibcAssetGrid` |
| OSFI Compliance | `CibcRegulatoryDirective` |
| Operational Precision | `CibcOnboardingJourney` |

The argument: showing their own named data models proves production-readiness
and neutralizes concerns about custom development risk.

### 6. `poc-operational-strategy.md`

**The on-site delivery playbook for June 25.** Three complete demo scenarios
with scene-by-scene scripts and tactical presenter notes:

- **Scenario A — T+1 Emergency:** Use Opal AI to draft a regulatory update,
  personalize it for Pension Fund Managers only, push omnichannel in one click.
- **Scenario B — Private Market Asset Intake:** Upload a Capital Call PDF, let
  Opal auto-extract metadata, demonstrate instant searchability.
- **Scenario C — OSFI Compliance Moat:** Navigate the audit trail for a content
  block, show the "Second Set of Eyes" approval workflow, export a user attestation report.

Opens with a "Cost of Inaction" framing (not Optimizely branding). Closes with
an ROI statement, not Q&A. Tactical tips include demonstrating live French
translation and showing a mobile preview on an actual device.

---

## RFP documents (`rfp/`)

The formal RFP artifacts — CIBC Mellon's original requirements and Optimizely's
completed responses.

### `rfp/rfp-section-1-introduction.md`

**CIBC Mellon's official RFP introduction.** Establishes company context
(C$3.4T AUA, 50/50 BNY/CIBC JV, founded 1996), scope of work (replace the 2015
website, integrate a DAM), and proposals due date (April 30, 2026). Contains the
complete itemized capability checklists: 16 DXP requirements and 13 DAM requirements.
This is the source-of-record document for what was formally requested.

### `rfp/schedule-a-third-party-response.md`

**Optimizely's formal written responses to all 19 RFP questionnaire sections.**
Covers organizational profile, financial services client list, fee model, OSFI
B-10 compliance approach, certifications (SOC 2 Type II, ISO 27001/27017/27018),
AI governance policies, ESG commitments (net-zero by 2030), and DEI data.
Key claims: Canadian data centres in Toronto and Quebec City; existing multi-year
DXP partnership with CIBC; licenses billed per content item (CMS), per user seat
(DAM), and per consumption credit (Opal AI).

### `rfp/schedule-b-governance-controls.md`

**CIBC Mellon's minimum security controls with Optimizely's compliance
responses.** 19 control domains covering information security policy, asset
management, HR security, physical and environmental security, logical access
control, SDLC, incident management (24-hour notification requirement), SOC 2 /
ISO audit rights, BCP/DR, records management, supplier governance, and a
detailed AI section (Table 17). The AI section covers data segregation,
accountability, fairness, transparency, human oversight, adversarial testing,
and output moderation — all mapped to the Opal AI framework. Primary security
due diligence artifact for the engagement.

### `rfp/schedule-d-business-requirements.md`

**Feature-by-feature compliance matrix.** ~55 functional, compliance, integration,
performance, security, and support requirements, each scored 0–3 (0 = not available,
1 = custom programming, 2 = configurable, 3 = standard out-of-the-box). Most
requirements score 3, including headless CMS, WCAG 2.0 AA, approval workflows,
audit trail, omnichannel delivery, SSO/MFA, French language support, CDN,
personalization, and RBAC. Items scored 2 include real-time collaboration, user
attestation reporting, batch publishing, and AEO/LLM optimization. The formal
feature compliance checklist underpinning Schedule A.
