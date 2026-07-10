# POC Bulk Content Generation Playbook
**How to populate the Agentic CMS with realistic, compliant atomic copy.**

To prove the "Two-Pass Routing Strategy" works during the POC, you need a substantial matrix of content. Manually typing hundreds of policy variations is inefficient. Instead, we use **Structured LLM Generation** to instantly build a JSON payload of atomic blocks perfectly mapped to the Optimizely CMS taxonomy.

---

## Step 1: Define the "Demo Matrix"

You do not need to map every insurance policy. You only need a deep enough matrix to prove that routing logic works across different jurisdictions and intents.

**The Target Matrix:**
*   **LOBs:** `Personal Auto`, `Commercial Auto`, `Homeowners`
*   **Topics:** `Hail / Storm Damage`, `Roadside Assistance`, `Water Damage`
*   **Jurisdictions:** `National (Master)`, `FL`, `GA`, `OH`, `TX`, `CA`

For each **Topic**, the generation matrix must include:
1.  **1 National Master:** The `Core Principle` (Jurisdiction: National)
2.  **3-5 State Overrides:** The `Jurisdictional Overrides` (Jurisdiction: FL, OH, etc. — containing specific variances)
3.  **2-3 Statutory Disclosures:** The `Compliance Disclosures` (Jurisdiction: FL, CA, etc. — containing legal codes)
4.  **1-2 Procedural Safeguards:** The `Human Action Steps` (Jurisdiction: National or State-specific)

---

## Step 2: The Bulk Generation Prompt

Copy and paste the following prompt into your LLM of choice (ChatGPT, Claude, etc.) or use an internal script to generate the payload. 

***

**System Prompt:**
> You are an expert Insurance Knowledge Manager for Progressive. I am building a Headless CMS POC using atomic content blocks. I need to generate realistic insurance policy content based on a "Tags as Logic" routing strategy.
> 
> I need you to generate a JSON array of content blocks for the following Topics: **[Hail/Storm Damage, Roadside Assistance, Water Damage]**. 
> For each topic, generate content across these Jurisdictions: **[National, FL, GA, OH, TX, CA]**.
> 
> The JSON must follow this exact schema:
> ```json
> {
>   "blocks": [
>     {
>       "BlockType": "KnowledgeRuleBlock | ComplianceDisclaimerBlock | ConsultantScriptBlock",
>       "InternalName": "String (e.g., 'Commercial Auto - FL Hail Limit 2026')",
>       "Taxonomy": {
>         "LOB": "Commercial Auto | Personal Auto | Homeowners",
>         "Topic": "String",
>         "Jurisdiction": "National | FL | GA | OH | TX | CA"
>       },
>       "CopyType": "Core Principle | Jurisdictional Override | Statutory Disclosure | Procedural Safeguard",
>       "RichTextValue": "The actual policy text, disclaimer, or step-by-step instructions. Use HTML tags like <p>, <strong>, and <ul>."
>     }
>   ]
> }
> ```
> 
> **CRITICAL RULES:**
> 1. **Core Principles** MUST be tagged `Jurisdiction: National` and use `BlockType: KnowledgeRuleBlock`.
> 2. **Jurisdictional Overrides** MUST share the same Topic as a Core Principle but be tagged with a specific state (e.g., FL) and contain conflicting limits or deductibles to prove state variances.
> 3. **Statutory Disclosures** MUST use `BlockType: ComplianceDisclaimerBlock` and include realistic-sounding legal citations (e.g., "Per ORC 3937...", "Mandated by FL Dept of Insurance...").
> 4. Ensure there are enough variations so that a query for "FL Hail" returns different blocks than a query for "GA Hail".

***

## Step 3: Importing to Optimizely CMS

Once the LLM generates the JSON array, your Solutions Consultant (SC) or developer can bring this into the POC environment using one of two methods:

### Path A: The API Route (Recommended)
Write a simple Python or Node.js script that iterates through the JSON array and POSTs each object to the **Optimizely CMS Content Management API**. 
*   *Why this wins:* It instantly populates the CMS backend. During the demo, you can open Optimizely CMS and visually show Marcus the Knowledge Manager looking at 100+ perfectly tagged, atomic blocks that were programmatically created.

### Path B: The CSV Import Route (Fastest)
Use a JSON-to-CSV converter, format the columns to match Optimizely's import headers, and use a standard CMS CSV Import add-on to bulk-create the blocks.

### Path C: The Headless Mock Route (Fallback)
If the CMS backend cannot be fully configured in time, the JSON file itself can act as a "mock database." The React front-end (the Progressive Consultant UI) can simply query this JSON file directly to simulate the Two-Pass Routing strategy on the glass.