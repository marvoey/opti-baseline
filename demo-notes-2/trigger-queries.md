# Trigger Queries: Intent-Driven Orchestration

To demonstrate the shift from a traditional "destination-driven" website to an **Intent-Driven Agentic CMS**, the demo must feature realistic, high-value institutional queries. 

These questions act as the "Triggers." When typed into the interface, the AI parses the natural language, determines the underlying business **Intent**, locks in the corresponding **Stacking Layout**, and extracts the entity tags to dynamically fetch the governed content blocks.

Here are the specific query sets designed to trigger the three core demo architectures.

---

## 1. Triggering the "Strategic Expansion" Briefing
**Intent Category:** `Discover / Recommend`
**Demo Layout Triggered:** Briefing Stack (Hero &rarr; Sidebar &rarr; Grid &rarr; Action)

**The Nature of these Queries:** 
Exploratory and strategic. The client is evaluating a major business maneuver (like entering a new market or launching a new product) and needs CIBC Mellon to curate a holistic roadmap of services and thought leadership.

**Primary Demo Query:**
*   *"What custody and FX services do we need to expand a Canadian mid-cap fund into European Equities?"*

**Additional Extraction Variations:**

| Trigger Query | Extracted Intent | Extracted Persona | Extracted Geo | Extracted Domain / Service |
| :--- | :--- | :--- | :--- | :--- |
| "We are launching a new ESG-focused mutual fund in Canada; what administration services apply?" | `discover` | `asset_manager` | `canada` | `fund_administration`, `esg` |
| "How can a UK-based pension fund optimize cash drag using your FX desk?" | `discover` | `pension_fund` | `europe` | `foreign_exchange` |
| "What treasury services are recommended for a US corporate sponsor entering the Canadian market?" | `discover` | `corporate_sponsor` | `united_states`, `canada` | `treasury_services` |
| "Explore ETF servicing solutions for a Canadian asset manager." | `discover` | `asset_manager` | `canada` | `etf_services` |
| "We need alternative investment solutions for a global real estate trust." | `discover` | `asset_manager` | `global` | `alternative_investments` |
| "Show me securities lending programs suitable for a Canadian public pension plan." | `discover` | `pension_fund` | `canada` | `securities_lending` |
| "What global custody options exist for a US-based insurance provider?" | `discover` | `insurance_provider` | `united_states` | `global_custody` |
| "Discover cross-border tax solutions for a European asset manager launching in North America." | `discover` | `asset_manager` | `europe`, `canada` | `fund_administration` |
| "How does CIBC Mellon support foreign institutions with Canadian sub-custody?" | `discover` | `foreign_institution` | `canada` | `global_custody` |
| "What are the recommended recordkeeping models for a multinational corporate sponsor?" | `discover` | `corporate_sponsor` | `global` | `recordkeeping` |

---

## 2. Triggering the "Regulatory Impact" Assembly
**Intent Category:** `Educate / Govern`
**Demo Layout Triggered:** Assembly Stack (Split 50/50 &rarr; Timeline &rarr; Full-Width Compliance)

**The Nature of these Queries:** 
Highly specific, risk-averse, and compliance-driven. The client is not looking to buy a service right now; they need exact extraction of complex policies, timelines for compliance, and strict legal definitions.

**Primary Demo Query:**
*   *"Summarize the new Canadian regulatory reporting requirements for digital assets and ESG."* 

**Additional Extraction Variations:**

| Trigger Query | Extracted Intent | Extracted Persona | Extracted Geo | Extracted Domain / Service |
| :--- | :--- | :--- | :--- | :--- |
| "What are the OSFI capital adequacy requirements for Canadian insurance providers?" | `educate` | `insurance_provider` | `canada` | `regulatory` |
| "Summarize the UCITS V directive impacts on European fund administration." | `educate` | `asset_manager` | `europe` | `fund_administration` |
| "Detail the T+1 settlement rules for US cross-border securities lending." | `educate` | `asset_manager` | `united_states` | `securities_lending` |
| "Explain the tax implications of Canadian withholding taxes on foreign institutional investors." | `educate` | `foreign_institution` | `canada` | `tax`, `global_custody` |
| "Show the ESG climate risk disclosure timeline for Canadian corporate pension sponsors." | `educate` | `corporate_sponsor`, `pension_fund` | `canada` | `esg`, `regulatory` |
| "What is the compliance impact of holding digital assets in a Canadian mutual fund?" | `educate` | `asset_manager` | `canada` | `digital_assets` |
| "Outline the reporting differences between IFRS and Canadian GAAP for alternative investments." | `educate` | `asset_manager` | `canada` | `fund_administration`, `alternative_investments` |
| "Clarify the FX execution transparency guidelines under MiFID II for European trades." | `educate` | `asset_manager` | `europe` | `foreign_exchange` |
| "What are the privacy and data residency requirements for Canadian recordkeeping?" | `educate` | `pension_fund` | `canada` | `recordkeeping` |
| "Provide the exact OSFI B-15 compliance checklist for Canadian asset managers." | `educate` | `asset_manager` | `canada` | `regulatory` |

---

## 3. Triggering the "Complex Onboarding" Workflow
**Intent Category:** `Simulate / Transact`
**Demo Layout Triggered:** Workflow Stack (Hero Stepper &rarr; Split Form &rarr; Grid)

**The Nature of these Queries:** 
Task-oriented and transactional. The client has high intent to convert or engage with CIBC Mellon systems and needs a guided workspace to navigate complex data entry, rather than a generic "Contact Us" page.

**Primary Demo Query:**
*   *"Initiate an RFP for pension fund recordkeeping."*

**Additional Extraction Variations:**

| Trigger Query | Extracted Intent | Extracted Persona | Extracted Geo | Extracted Domain / Service |
| :--- | :--- | :--- | :--- | :--- |
| "Open a new Canadian sub-custody account for our US-based bank." | `transact` | `foreign_institution` | `canada`, `united_states` | `global_custody` |
| "Submit data for an FX execution workflow for a European corporate sponsor." | `transact` | `corporate_sponsor` | `europe` | `foreign_exchange` |
| "Begin the onboarding checklist for a new Canadian ETF launch." | `transact` | `asset_manager` | `canada` | `etf_services` |
| "Start the transition of our domestic pension fund administration to CIBC Mellon." | `transact` | `pension_fund` | `canada` | `fund_administration` |
| "Initiate the setup for a cross-border securities lending program." | `transact` | `asset_manager` | `global` | `securities_lending` |
| "Enroll our corporate treasury in your institutional cash management portal." | `transact` | `corporate_sponsor` | `canada` | `treasury_services` |
| "Submit the required AML/KYC documentation for a foreign institution." | `transact` | `foreign_institution` | `global` | `onboarding`, `compliance` |
| "Request a quote for alternative investment reporting for a real estate trust." | `transact` | `asset_manager` | `canada` | `alternative_investments`, `fund_administration` |
| "Start the API integration wizard for CIBC Mellon digital asset tracking." | `transact` | `asset_manager` | `global` | `digital_assets` |
| "Initiate a recordkeeping service migration for a multi-employer pension plan." | `transact` | `pension_fund` | `canada` | `recordkeeping` |