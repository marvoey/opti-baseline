# CIBC Mellon DXP/DAM: CMS Content Type Alignment
## Mapping Challenger Insights to Native CMS Blocks (June 25 POC)

To deliver a high-impact demo on June 25, we must prove that our strategic reframing of the DXP is natively supported by the CMS. Fortuitously, our CMS instance features pre-registered, custom **`Cibc`-prefixed content types** that align 1:1 with our core Challenger insights.

This document maps our **Commercial Insights** directly to the **Native CMS Blocks** you will demonstrate.

---

### Insight-to-Block Alignment Map

| Strategic Challenger Insight | Native CMS Content Type Key | How We Demonstrate It in the POC |
| :--- | :--- | :--- |
| **Insight 1: Content is Infrastructure**<br>The public site is a "Market Control Tower" delivering critical, real-time settlement and regulatory alerts to global desks to prevent trade fails. | **`CibcAlertFeed`** *(Section)*<br>and **`CibcAlert`** *(Element)* | **The "T+1 Emergency" Feed:**<br>Show a live warning feed. Demonstrate how an operations user can drag in a new `CibcAlert` (e.g., "Ontario Bank Holiday Alert," severity: `warning`) to dynamically update trading desks in real time. |
| **Insight 2: Private Markets "Dark Data"**<br>The DAM is an automated intake engine that extracts metadata from complex alternative asset PDFs (Private Equity, Real Estate) without manual entry. | **`CibcAssetGrid`** *(Section)*<br>and **`CibcAssetCard`** *(Element)* | **The AI Ingestion Pipeline:**<br>Demonstrate a document upload. Show **Opal AI** reading a Capital Call PDF, extracting metadata, and instantly rendering it as a searchable card inside `CibcAssetGrid` with automated `MetadataChips`. |
| **Insight 3: The OSFI Compliance Moat**<br>Leveraging pre-vetted enterprise security (OSFI B-10 & B-13) so teams can launch compliant, bilingual updates at market speed. | **`CibcRegulatoryDirective`** *(Section)* | **The Secure Approval Workflow:**<br>Show a draft of a new "CRA Withholding Status" directive. Demonstrate Optimizely's built-in audit trails and "Second Set of Eyes" approval workflow before a regulatory change goes live. |
| **Insight 4: Operational Precision**<br>Personalization is not "promotion." It is about filtering noise and showing high-touch, customized roadmaps to institutional clients. | **`CibcOnboardingJourney`** *(Section)*<br>and **`CibcMilestone`** *(Element)* | **The SWF Onboarding Roadmap:**<br>Show the homepage personalizing for a "Sovereign Wealth Fund" prospect. The site surfaces their specific onboarding milestone tracker, proving CIBC Mellon's high-touch custody onboarding speed. |

---

### Why this 1:1 Alignment "Wins the Room"

Traditional vendors (Adobe, Sitecore) will show a generic retail bank homepage and talk about *how they could* configure components to fit asset servicing. 

By using their native **`Cibc` data models**, your presentation immediately shifts:

1.  **Proof of Readiness:** We aren't selling hypothetical future state. We are showing pre-built, structured blocks designed around the exact vocabulary and data schemas of **CIBC Mellon's custodial business**.
2.  **Agency Empowerment:** Because their design agency is providing the "look and feel" (RFP Section 1.2), we prove that our CMS provides the high-performance **operational engine** that sits beneath. The agency has full creative freedom, while the underlying data remains secure and structured.
3.  **Low-Risk implementation:** We neutralize the CIO/CTO's concern about complex custom code. All operational dashboards, alert feeds, and document extraction grids are handled as standardized, out-of-the-box templates.
