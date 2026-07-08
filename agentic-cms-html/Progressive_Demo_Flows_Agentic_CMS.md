# Progressive Insurance: Revised Demo Flows (Agentic CMS & Generative UI)

## 🎯 The Core Reframe
**"You're not buying a content management system. You're buying seconds — and accuracy — back for every consultant interaction you have."**

In alignment with our recent pivot, these demo flows move away from traditional CMS authoring and "Experimentation" and focus entirely on **AI-integrated content assembly** and **Intelligent Enablement Portals**. We are showcasing an *Agentic CMS* that operates on specific intents (Ingest, Assemble, Variant, Retrieve, Simulate) to power a Progressive-audience Generative UI. 

*(Note: Per current POC guidelines, the "Govern/Review" intent is intentionally excluded from these flows to focus on assembly and front-end generation).*

---

## 🎬 Demo 1: The Consultant Flow (Intelligent Enablement Portal)
*Focus: Generative UI, Opal API Integration, Speed to Resolution (Retrieve/Simulate Intents)*

**The Scenario:** Sarah (Consultant) is on a live call with a Florida customer asking a complex question about commercial auto hail damage. She is using Progressive's existing intranet portal, which is now powered headlessly by the Opal API.

### Act 1: Intent - Contextual Retrieval & Generative UI
* **The Action:** Sarah types a natural language query into her portal: *"What is the commercial auto hail deductible for a vehicle parked at home in Florida?"*
* **The Result:** Instead of a list of PDF links, the Opal API instantly returns a **Generative UI component**. It renders a clean, structured mini-dashboard showing the exact Florida deductible, the specific limits, and immediate next steps for the claim.
* **The Talk Track:** Sarah isn't reading a 10-page document. The Agentic CMS retrieved the exact atomic content blocks (deductible, limits) and the Generative UI assembled them into a context-aware answer. We just saved 4 minutes of handle time.

### Act 2: Intent - Multi-Intent Simulation & Comparison
* **The Action:** The customer asks, *"What if my business was registered in Georgia?"* Sarah updates her query to compare Florida and Georgia.
* **The Result:** The Generative UI instantly pivots, presenting a side-by-side comparison matrix of Florida vs. Georgia hail rules. 
* **The Talk Track:** Because Optimizely stores this as structured variation data (not flat text), the AI can mathematically compare and render it. This eliminates the compliance risk of Sarah accidentally reading the wrong state's policy.

### Act 3: Intent - Source Verification
* **The Action:** Sarah clicks the "View Source" citation on the Georgia limit.
* **The Result:** She is deep-linked to the exact block of the canonical Georgia policy.
* **The Talk Track:** Trust is paramount. The Generative UI isn't hallucinating; it is strictly assembling approved, structured content from the Agentic CMS.

---

## 🎬 Demo 2: The Authoring Flow (Agentic Content Assembly)
*Focus: AI-Integrated Content Assembly, Architecture Previewer, Matrix Scaling (Ingest, Assemble, Variant Intents)*

**The Scenario:** Marcus (Knowledge Manager) needs to digitize a new Commercial Hail Addendum and scale it across multiple states. He doesn't format text; he commands the Agentic CMS.

### Act 1: Intent - Agentic Ingestion 
* **The Action:** Marcus drags a legacy 15-page PDF into the Opal workspace. He prompts: *"Extract the core coverage limits, exclusions, and definitions from this document and map them to our Commercial Policy structure."*
* **The Result:** The Agentic CMS parses the document and automatically populates the atomic content fields (Limit = $500, Peril = Hail, LOB = Commercial).
* **The Talk Track:** Marcus isn't copying and pasting. The AI is doing the heavy lifting of turning unstructured legacy blobs into structured, AI-ready data. This is the migration accelerator.

### Act 2: Intent - AI-Integrated Content Assembly
* **The Action:** Marcus needs to add standard legal language. He prompts Opal: *"Assemble this new policy by attaching the standard 2026 Commercial Legal Disclaimer."*
* **The Result:** Opal dynamically links the reusable disclaimer block to the new policy.
* **The Talk Track:** Content reuse ensures compliance. If Legal updates the disclaimer, it cascades automatically. The AI acts as an assembly engine, ensuring no required pieces are missed.

### Act 3: Intent - Matrix Scaling (State Variations)
* **The Action:** Marcus prompts Opal: *"Generate state variations for Florida and Georgia based on the standard policy, but update Florida's deductible to $1000 and Georgia's to $750."*
* **The Result:** The CMS automatically spins up the localized variants, inheriting the master content but overriding only the specified fields.
* **The Talk Track:** Managing 50 state variations is no longer a manual nightmare. The Agentic CMS scales the matrix instantly.

### Act 4: Intent - Architecture Previewer (Simulation)
* **The Action:** Before stepping away, Marcus opens the **Architecture Previewer**. He types the same query Sarah will use: *"Florida hail deductible."*
* **The Result:** He sees the exact Generative UI component that Sarah will see in the contact center.
* **The Talk Track:** Marcus isn't just previewing a webpage; he's simulating the AI output. He can guarantee that the intelligence he just built will render perfectly for the front-line consultant.