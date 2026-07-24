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
