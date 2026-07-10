# Compliant Copy Structuring: The "Resolve" Intent
**How Optimizely CMS Ensures 100% Compliance via Atomic Copy Types**

When a Progressive consultant uses the **Resolve / Support** intent, they are typically live on the phone dealing with a claim or policy dispute. The margin for error is zero. 

To guarantee compliance across 50 states and multiple Lines of Business (LOB), the Agentic CMS does not serve a single "document." Instead, it dynamically assembles the answer using **four distinct, governed "Copy Types."** 

By mapping these copy types directly to Optimizely CMS fields and routing them via taxonomy tags (`LOB`, `Topic`, `Jurisdiction`), we eliminate compliance risks and hallucination.

---

## The 4 Compliant "Copy Types" (CMS Field Mapping)

Every answer generated in the Resolve UI is a composite of these four atomic copy types. They are authored separately, governed separately, and assembled instantly.

### 1. The Core Principle (The National Baseline)
*   **What it is:** The universal truth of a policy that applies across all states unless specifically overridden.
*   **CMS Field:** `CoreDefinition` (Found in `PrgvCoverageRule`, `PrgvBenefit`)
*   **Compliance Role:** Provides the baseline coverage logic without forcing the author to rewrite it 50 times.
*   *Example:* "Sudden and accidental discharge of water from a burst pipe is covered."

### 2. The Jurisdictional Override (The Variance)
*   **What it is:** The state-specific or tier-specific modification to the Core Principle. 
*   **CMS Fields:** `DeductibleRules`, `Exceptions` 
*   **Compliance Role:** Prevents a consultant from quoting a National limit to a Florida customer. If the API detects `Jurisdiction: FL`, it mathematically replaces the national text with the Florida override.
*   *Example:* "Debris removal sub-limit is $500." (Overrides the national $1,000 limit).

### 3. The Statutory Disclosure (The Legal Lock)
*   **What it is:** Mandatory legal language mandated by state Departments of Insurance (DOI). 
*   **CMS Field:** `StateDisclosure` 
*   **Compliance Role:** This copy type is strictly routed to the **Right-Rail "REQUIRED DISCLAIMER" box** in the Resolve UI. The consultant cannot miss it. The LLM cannot summarize it or change a single comma. 
*   *Example:* "FL: Sinkhole activity is a separate disclosure. A sinkhole inspection may be required."

### 4. The Procedural Safeguard (The Human Action)
*   **What it is:** The strict step-by-step instructions the consultant must follow to execute the resolution.
*   **CMS Fields:** `Steps`, `RequiredInfo` (Found in `PrgvProcedure`)
*   **Compliance Role:** Ensures operational compliance (e.g., preventing a consultant from accidentally admitting liability on a recorded line).
*   *Example:* "Advise the insured not to admit fault or discuss the incident with the other party."

---

## How it works in practice (Scenario Analysis)

Let's look at how this structured copy methodology resolves real Progressive scenarios dynamically based on the **LOB + Topic + Jurisdiction** tags.

### Scenario 08: The Florida Burst Pipe
**The Context:** A customer calls about a flooded basement from a burst pipe in Orlando.
**The Intent Trigger:** `Resolve` 
**The Taxonomy Trigger:** `LOB: Homeowners` + `Topic: Coverage Options` + `Jurisdiction: FL`

**The Assembly (How the CMS queries the copy):**
1.  **Pass 1 (Core Principle):** The CMS pulls the `PrgvCoverageRule` for water damage. It renders the `CoreDefinition`: *"Sudden and accidental discharge... is covered."*
2.  **Pass 2 (Cross-Product Gap):** Because this is water-related, the taxonomy also triggers a `PrgvExclusionRule` for Flood. It renders the `ExclusionText`: *"Damage caused by surface water/storm surge is excluded."*
3.  **Pass 3 (Statutory Disclosure):** The CMS detects `Jurisdiction: FL`. It forces the `StateDisclosure` field into the UI's right-rail: *"FL Sinkhole investigation may trigger..."*

**The Result:** The consultant gets a perfectly compliant answer. They didn't have to read a 14-page PDF. The AI didn't hallucinate a summary. The CMS simply stacked the pre-approved Core Principle, the Exclusion, and the Florida Statutory Disclosure into the split-screen layout.

### Scenario 02: Storm / Tree Damage
**The Context:** A tree falls on a fence and a car in Florida.
**The Intent Trigger:** `Resolve`
**The Taxonomy Trigger:** `LOB: Homeowners & Personal Auto` + `Topic: Hail` + `Jurisdiction: FL`

**The Assembly (How the CMS queries the copy):**
1.  **Pass 1 (Core Principle):** Pulls `PrgvCoverageRule` (Homeowners). Renders `CoreDefinition` (Other Structures covered at 10%).
2.  **Pass 2 (Jurisdictional Override):** Pulls `DeductibleRules` for Florida. Overrides the national debris removal limit to $500.
3.  **Pass 3 (Cross-Product Gap):** Pulls `PrgvExclusionRule` (Auto). Instructs the consultant that the car requires a completely separate Auto Comprehensive claim.
4.  **Pass 4 (Statutory Disclosure):** Forces the FL Storm Endorsement disclosure into the right rail.

---

## The "Two-Pass" Routing Strategy (For the POC)

To make this work in the POC, we configure Optimizely Graph to use a "Two-Pass" routing strategy for the `Resolve` intent.

1.  **Exact Match (State Level):** The API first queries Optimizely Graph for content matching all three tags: `LOB` + `Topic` + `Jurisdiction: [User's State]`. If it finds a block (like a specific Florida `DeductibleRule` or `StateDisclosure`), it renders it.
2.  **National Fallback:** If no state-specific block exists for that topic, the API automatically falls back to content tagged `Jurisdiction: National`. 

**Why this wins the room:** This proves to Progressive that their Knowledge Managers don't need to author 50 different full-page documents. They author **one** National master policy (`CoreDefinition`), and then only author the specific state `Exceptions` or `StateDisclosures`. The Agentic CMS handles the assembly seamlessly at the moment of intent.