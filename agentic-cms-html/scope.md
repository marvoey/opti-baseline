Based on the provided strategy documents, the RFI analysis, and the Q&A readout, Progressive does not need a traditional website or a standard intranet.

What Progressive specifically needs is an **Intelligent Enablement Portal** powered by an **Agentic CMS architecture**.

Here is the exact scope of what Progressive needs from both the Web UI and the Agentic CMS perspectives to solve their core business problem: reducing consultant handle time, eliminating compliance risks, and bridging the gap to AI.

---

## 1. The Web UI Perspective: "Generative UI" for the Consultant

Progressive's front-line consultants (like "Alex" from the narrative) are currently wasting minutes clicking through 14 different SharePoint links and cross-referencing tabs. The Web UI cannot just be a better search bar for static articles; it must be an **assembly engine**.

- **Conversational Interface to Assembled UI:** The UI must allow a consultant to type a natural language query (e.g., *"What roadside assistance applies to an Ohio auto policy for a customer transitioning from Florida?"*). Instead of returning links, the UI dynamically generates a purpose-built "Answer Card."
- **Intent-Driven Layout Assembly:** Using the POC Blueprint, the UI must instantly recognize the user's *intent* and select the right layout without a developer writing React code:
  - *If resolving a policy question:* It generates a **Split Layout** showing the exact policy rules on the left and the required state legal disclaimer on the right.
  - *If learning a new underwriting guideline:* It generates a **Sidebar Layout** for deep reading with an auto-generated table of contents.
- **Contextual & Role-Based Filtering:** The UI must know who is logged in. A Commercial Lines underwriter and a CRM contact center agent searching for the same term should see completely different UI assemblies based on their role and workspace.

## 2. The Agentic CMS Perspective: The "Engine Under the Hood"

For the Generative UI to work, the traditional "HTML blob" CMS must be replaced by a highly structured, API-first Agentic CMS that treats content as data.

- **Structured Metadata & "No-Code" Authoring:** Authors must be forced into structured templates (e.g., Policy Article Template) with discrete fields for *Jurisdiction*, *Effective Dates*, and *Audience*. No author should ever write HTML. This is the only way downstream AI models (like their OpenAI/AWS Bedrock pilots) can accurately query the data.
- **Master Content with State Variations:** Progressive cannot maintain 50 different articles for 50 states. The CMS needs a master inheritance model (e.g., "National Roadside Assistance") where authors only input the *overrides* for specific states (e.g., Ohio's specific towing limits).
- **Reusable Compliance Blocks:** Legal disclaimers must be managed globally. If a regulation changes, the legal team updates one "Disclaimer Block" in the CMS, and it instantly updates across every generated UI card for every consultant.
- **Strict Governance & AI Security Sync:** This is critical for the Claims and Legal teams. The CMS must have ironclad workflows and audit trails. Furthermore, the AI must respect CMS states — if an Ohio policy update is approved but its "Active Date" is not until July 1st, the AI must be cryptographically blocked from surfacing that rule to a consultant on June 30th.

## 3. The "Agentic" Workflow Layer

Progressive noted they want to move toward "longer-term agentic workflows." The system needs to support agents that act autonomously in the background:

- **The Audit/Review Agent:** When a policy is updated, an AI agent checks the structured metadata and automatically routes it to the specific compliance reviewer for that state or business line (Claims vs. Commercial Lines).
- **The Expiration Agent:** Policy content in insurance is a massive liability if it gets stale. The CMS needs agents that monitor effective dates and proactively alert knowledge managers when a policy is nearing expiration or requires a regulatory refresh.

## Summary Scope Statement

Progressive needs a headless, API-first CMS that breaks policy documents into heavily governed, state-specific, metadata-rich blocks. On the front end, they need a Generative UI that bypasses traditional IT development, using AI to instantly assemble those blocks into role-specific, legally compliant answers for consultants while the customer is on hold.
