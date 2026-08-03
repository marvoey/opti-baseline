# From Static Word Docs to Intelligent Structured Content

When managing knowledge in flat Word documents, you face a major problem: **content is trapped**. A Word document is a digital piece of paper. It cannot adapt to who is reading it, it cannot share a paragraph with another document, and if a legal script changes, you have to find and manually edit 50 different Word documents.

By moving these documents into Optimizely CMS, we break that digital paper into **smart, reusable, atomic building blocks**. 

---

## Do we still need a "Document"?

**No.** The goal is to **stop thinking in terms of "documents" entirely.** 

The `[PRGV] Knowledge Article` content type that we created *is* the new document. It completely replaces the Word file. 

### The "Binder" Analogy
Imagine the `[PRGV] Knowledge Article` is an empty binder labeled **"Auto Claims FNOL Procedure."** Instead of slipping a single, flat piece of printed paper into that binder, you fill it with smart, individual index cards (Blocks):
*   You drop in an instruction card for the **Procedural Steps**.
*   You drop in an amber warning card for the **Fraud Alerts**.
*   You drop in a blue verbatim card for the **Agent Script**.
*   You add a legal reference that automatically pulls the exact **California Compliance Disclosure**.

When a frontline agent searches for the procedure, the CMS grabs that binder, reads all the index cards inside it, filters them by the agent's role and state, and instantly builds a clean, interactive webpage on their screen.

---

## The Atomic Building Blocks

Instead of rich-text blobs, content is composed using four highly specific, targeted components (`baseType: "_component"`):

1. **`[PRGV] Standard Instruction Block`**: General step-by-step guidance. Scoped by `TargetAudience` (e.g., Tier 1 vs. Tier 2) so agents only see steps relevant to their role.
2. **`[PRGV] Handling Note Block`**: Operational warnings, escalation rules, and state exceptions. Features visual cues like amber borders and severity badges (Low to Critical).
3. **`[PRGV] Scripting Block`**: Verbatim language the agent *must* read out loud. Tightly scoped by Jurisdiction and Line of Business (LOB).
4. **`[PRGV] Global Compliance Disclosure`**: Specialized legal disclosures managed by the Legal team. Separates `Jurisdiction` (the governing law) from `ApplicableState` (where it is operationally surfaced). 

---

## Global Taxonomy & Intelligent Routing

To route these blocks to the right users at the right time, we apply a strict global taxonomy. (Note: Enum values are stored efficiently as numeric string codes in the CMS).

### 1. Target Audience (Roles)
Tags are divided into **Frontline & Support** (Tier 1 Service, Escalation Desk, etc.) and **Operations & Governance** (Knowledge Authors, Compliance Reviewers).
*   *The Intelligence:* The front-end portal explicitly pulls "Frontline" tagged content for agents, reducing clutter and preventing them from seeing internal governance standards or Tier 2 override steps.

### 2. Products, LOBs, and Jurisdictions
Instead of flat enums, these use **Taxonomy as Content**. Editors create `[PRGV] Category` pages in a dedicated folder tree (e.g., a node for "Personal Auto" or "California").
*   *The Intelligence:* Blocks use a `ContentReference` to these categories, allowing hierarchical structures and easy expansion without requiring developer deployment.

### 3. Lifecycle & Categorization
*   **Workflow:** Legacy statuses map natively to Optimizely's workflow (Draft → Ready to Publish → Published → Expired). No custom status fields are needed.
*   **Content Types over Tags:** We don't tag a page as a "Matrix" or "Procedure." The structural Content Type (`Knowledge Article` vs. `Compliance Disclosure Matrix`) defines its nature.

---

## The "Before & After" Transformation

Let's look at how a flat `01_Auto_Claims_FNOL_Procedure.docx` is transformed:

*   **The Document Header:** The old "Target Audience" text becomes a strict `TargetAudience` metadata tag. Tier 2 content is automatically hidden from Tier 1 agents.
*   **Core Instructions:** Bullet points become `Standard Instruction Blocks`.
*   **Fraud Warnings:** A bolded sentence hidden in step 4 becomes a `Handling Note Block` with `SeverityLevel = Critical`, rendering as a prominent amber alert box.
*   **Legal Scripting:** The strict California script is removed entirely from the article. It becomes a standalone `Global Compliance Disclosure` or `Scripting Block`. The article simply references it. If 10 procedures need that script, they all share the exact same block. When Legal updates the block, all 10 procedures update instantly.

---

## Summary of the Goal

By breaking a single Word document into atomic blocks and global taxonomies, your content becomes **Composable**. You are no longer writing "Documents." You are managing a database of smart content chunks. Optimizely CMS acts as the brain, pulling those chunks together to assemble the perfect, personalized screen for whichever agent is asking for help.