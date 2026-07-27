# Deterministic Retrieval in the Sidebar Layout

The **Sidebar Layout** (the 25/75 Split) is primarily used for the `Educate / Govern` intent, making it the most heavily regulated architecture in the Agentic CMS. 

When a user asks a complex policy or regulatory question, the AI cannot guess or hallucinate the answer. It must use **Deterministic Retrieval** to fetch exact paragraphs (Prose Blocks) and pair them with mandatory legal safety rails (Global Compliance Blocks).

Here is the exact logic the AI uses to choose and assemble these blocks without human intervention.

---

## 1. Extracting the "Query Entities"
Before the AI fetches anything, it must understand the user's context. It does this by mapping the natural language question to the CMS metadata taxonomy.

**Example User Query:** *"Summarize Canadian regulatory reporting for digital assets."*

The AI parses the query and extracts the following entities:
*   `intent: educate`
*   `geo: canada`
*   `domain: digital_assets`

Because the intent is `educate`, the orchestration engine locks in the **Sidebar Layout** and begins querying the CMS API for blocks to fill the slots.

---

## 2. Fetching the Prose Blocks (The Right Column)
The right column (the 75% slot) is designed to hold the actual answer. To ensure accuracy, the layout is constrained to only accept `ParagraphContentType` blocks for this slot.

**The AI's Deterministic Query:**
```sql
GET Content 
WHERE ContentType = 'ParagraphContentType'
  AND Tags CONTAINS ('domain: digital_assets', 'geo: canada')
```

**What Happens Next:**
*   The CMS API searches its pre-approved repository.
*   It finds an exact chunk of text authored by CIBC Mellon’s compliance team detailing the OSFI (Canadian) reporting requirements for digital assets.
*   The AI injects this `ParagraphContentType` block into the right column.

*Crucially, if the user had asked about "European reporting," the query would fetch `geo: europe`, returning UCITS requirements instead of OSFI rules.*

---

## 3. The "Governance Lock": Fetching the Global Compliance Block
This is where the Agentic CMS provides massive risk-mitigation value. The AI does not rely on a content author remembering to drag-and-drop a legal disclaimer onto the page. The Sidebar Layout has a hardcoded **Governance Rule**.

**The Governance Rule:**
> *If any Prose Block injected into this layout contains a `geo` or `rule` tag, the layout MUST independently query for a `ComplianceBlockContentType` matching that tag.*

**The AI's Deterministic Query:**
```sql
GET Content 
WHERE ContentType = 'ComplianceBlockContentType'
  AND Tags CONTAINS ('geo: canada')
```

**What Happens Next:**
*   The CMS API looks for the universal legal disclaimer required for Canadian financial information.
*   The AI retrieves the block (e.g., *"This summary is for informational purposes only and does not constitute Canadian financial or legal advice..."*).
*   The layout forces this block into a locked position (usually spanning the full width beneath the content or highlighted at the top). 

**The Result:** The legal team only has to update that compliance block in one central location in the CMS. Wherever the AI dynamically builds a Canadian page, the updated disclaimer is automatically fetched and locked into place.

---

## 4. The Domino Effect (Auto-Generating the Nav Block)
Once the right column is populated with the Prose Blocks and the Compliance Block is locked in, the AI resolves the left column (the 25% slot).

The AI does not run an external CMS query for the navigation. Instead, it runs an **internal DOM query**:
1.  It scans the `ParagraphContentType` blocks it just placed in the right column.
2.  It extracts the `<h2>` and `<h3>` heading strings.
3.  It dynamically generates a `NavBlock` in the left column with anchor links to those headings.

By retrieving the Prose first, locking the Compliance second, and generating the Navigation last, the Sidebar Layout assembles a perfectly governed, highly specific document in milliseconds.