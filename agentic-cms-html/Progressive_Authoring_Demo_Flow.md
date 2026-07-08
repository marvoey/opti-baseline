# Progressive Insurance: Content Authoring Deep-Dive Demo

## 🎯 The Core Reframe for Authoring
**"Your content authors shouldn't be formatting text; they should be building the intelligence that powers your business."**

While the previous demo focused on the Consultant's experience, this demo flow zooms in on **Marcus (Knowledge Manager)**. It proves how Optimizely CMS SaaS provides a no-code, structured, and Agentic authoring experience that makes AI-ready content possible.

---

## 👥 Cast of Characters
1. **Marcus (Knowledge Manager):** The primary user. He is responsible for managing Commercial Lines content without relying on IT.
2. **Reviewer/Compliance:** (Brief cameo) Approving state-specific regulatory changes.

---

## 🎬 Act 1: AI-Assisted Migration & Creation (Req 1, 11)
*Show how easy it is to get legacy content into the new, structured system.*

* **The Scenario:** Marcus has a legacy 10-page PDF policy document about "Commercial Auto Hail Damage" currently sitting in SharePoint. He needs to move it into the new CMS.
* **The Action:** Marcus creates a new article using the "Commercial Policy" template. Instead of copying and pasting, he uses Opal (Agentic CMS) to ingest the PDF. He prompts Opal: *"Extract the core coverage limits, exclusions, and definitions from this PDF and populate them into the template fields."*
* **The Result:** Opal automatically fills out the structured template fields (Definitions, Limits, Exclusions) based on the document.
* **Key Talk Tracks:**
    * **No Developer Support (Req 1):** Point out that Marcus built a complex, structured article entirely through a visual UI and natural language.
    * **Migration Accelerator (Req 11):** This AI-assisted authoring is exactly how Progressive can accelerate their migration off legacy systems.

---

## 🎬 Act 2: Structured Templates & Reusable Content (Req 2, 9)
*Demonstrate the power of atomic content over "blobs of text."*

* **The Scenario:** Marcus needs to ensure the legal disclaimer is attached to this policy.
* **The Action:** Marcus drags and drops a "Standard Commercial Disclaimer" block into the article.
* **The Result:** The disclaimer is referenced, not copied. 
* **Key Talk Tracks:**
    * **Content Reuse (Req 9):** Explain that if Legal updates this disclaimer tomorrow, it automatically updates across the thousands of policies that reference it, eliminating massive compliance risks.
    * **Required Metadata (Req 2):** Show how the template forces Marcus to select tags (e.g., LOB: Commercial, Peril: Weather). Explain that *this* is the secret sauce that makes the front-end AI search accurate.

---

## 🎬 Act 3: Mastering the Matrix - State Variations (Req 3, 8)
*Address the massive pain point of state-specific insurance regulations.*

* **The Scenario:** Florida has a specific regulatory requirement for hail deductibles that differs from the generic national policy.
* **The Action:** Marcus uses the variation dropdown to switch from the "Generic" master article to the "Florida" variation. He updates *only* the deductible field.
* **The Result:** The Florida article inherits 95% of its content from the master, overriding only the specific limit.
* **Key Talk Tracks:**
    * **State-Specific Content (Req 3):** Progressive doesn't need to manage 50 different copies of the same article. If the generic definition of "Hail" changes, Marcus updates it once, and all 50 states inherit the change.
    * **Workspaces (Req 8):** Remind them Marcus is doing this safely within the Commercial Lines workspace.

---

## 🎬 Act 4: Governance, Dates & Audit Trails (Req 4, 5, 6, 28)
*Prove that speed doesn't compromise compliance and control.*

* **The Scenario:** The Florida variation change must be approved by Compliance and legally cannot take effect until July 1st.
* **The Action:** Marcus sets the "Active Date" for the Florida variation to July 1st. He triggers the workflow, assigning it to the "Compliance Reviewers" group. 
* **The Result:** The article locks into a draft/review state. We view the version history comparing the old limit to the new limit.
* **Key Talk Tracks:**
    * **Active Dates (Req 4):** The system handles the rollout automatically. On July 1st, the new rule goes live. 
    * **Approval & Audit (Req 5, 6, 28):** Show the side-by-side version comparison. Explain that every change, approval, and publish event is logged for discovery and audit purposes.
    * **AI Security Sync:** Remind them that the front-end AI Consultant bot *will not* see or use this new July 1st Florida rule until it is approved and the active date hits.

---

## 🏁 The Wrap-Up
*Tie the authoring experience directly to the business outcome.*

**"Because Marcus has this structured, AI-assisted, and tightly governed authoring environment, Sarah in the contact center gets the exact right answer, instantly, every time she gets a call. You solve the contact center problem by solving the content problem first."**