# Progressive Agentic CMS: Intents, Layouts, and Building Blocks

To successfully shift from a traditional "static page" CMS to an **Agentic CMS** for Progressive's Intelligent Enablement Portal, we must rethink how content is structured. In an Agentic CMS, the AI acts as a layout engine. It does not just return search links; it reads the user's *intent*, selects the appropriate structural *layout*, and fills it with governed *building blocks*.

Below is the blueprint analysis tailored for Progressive's consultant-facing workflows.

---

## 1. Universal Intents (The Assembly Triggers)

`Intent` is the primary metadata signal that triggers the AI assembly engine. When a consultant asks a question, the AI first categorizes the request to determine which blueprint to grab.

*   **Intent: Educate / Enable (Knowledge Portal)**
    *   **Purpose:** To explain complex insurance policies, internal SOPs, or underwriting guidelines to Progressive consultants.
    *   **Agentic Action:** The AI automatically grabs layouts optimized for reading and comprehension. It prioritizes deep "Prose Blocks" and ensures proper taxonomy/tagging so the article structure is easily scannable (e.g., auto-generating a table of contents).
*   **Intent: Resolve / Support (Live Consultation)**
    *   **Purpose:** To help a consultant quickly answer a specific scenario while the customer is on hold, such as a state-to-state policy transition or specific towing limits.
    *   **Agentic Action:** The AI prioritizes "Action Blocks" and targeted answer extraction. It specifically forces mandatory compliance disclaimers into the layout based on the state detected in the query.
*   **Intent: Simulate / Transact (Interactive Workflows)**
    *   **Purpose:** To guide a consultant through a multi-step process, like filing a commercial auto glass claim or generating a quote.
    *   **Agentic Action:** The AI selects layouts that support side-by-side data entry and contextual help, updating the guidance dynamically based on which form field the consultant is currently focused on.
*   **Intent: Govern / Review (Content Operations)**
    *   **Purpose:** To route drafted content through legal, compliance, and brand review before it is published to the portal.
    *   **Agentic Action:** Instead of assembling a front-end UI for a consultant, the AI triggers an internal review layout for stakeholders, highlighting changed clauses (diffs) and verifying regulatory language automatically.

---

## 2. Universal Layouts (The Skeletons)

Once the AI determines the intent, it selects a strict layout skeleton. These layouts act as programmable constraints so the AI knows exactly where to place content without breaking the user experience.

| Layout Type | Progressive Use Case | AI Assembly Constraints & Logic |
| :--- | :--- | :--- |
| **Sidebar / Asymmetrical (25/75)** | **Deep Knowledge Portal Articles:** The classic structure for dense underwriting guidelines or policy documentation. | **Constraints:** Left slot strictly for navigation/table of contents. Main slot accepts Prose Blocks and Media Blocks. |
| **Split Layout (60/40 or 50/50)** | **Simulated Interactions & Quick Resolutions:** Perfect for claim workflows or fast answers. | **Constraints:** Left slot accepts an Action/Form Block or extracted exact answer. Right slot accepts dynamic contextual help or locked Compliance Blocks. |
| **Grid (3 or 4 columns)** | **Consultant Dashboards:** The starting point for users to find what they need quickly upon logging in. | **Constraints:** Only accepts Card Blocks (e.g., "Recent Policy Updates," "Top Searched Articles"). |
| **Hero / Feature Slot** | **Critical Announcements:** Highlighting major internal updates or regulatory changes. | **Constraints:** Full-width. High visual hierarchy. Accepts a single concise Prose Block and an Action Block. |

---

## 3. Base Building Blocks (The Primitives)

These are the atomic units of content that the AI uses to fill the layout slots. Each block is designed to solve a specific operational pain point for Progressive.

### Prose / Typography Block
*   **Description:** Headlines, body copy, and rich text elements.
*   **Progressive Pain Point Solved:** Consultants need clear, readable guidelines. When reading through a dense, 10-page underwriting guideline, dumping text on a page makes it unreadable. Text must be broken up with appropriate semantic headers to be scannable during a live call.
*   **Agentic Assembly Logic:** The AI uses this primitive to inject narrative or extracted answers. It automatically applies formatting rules (like bolding key terms or generating lists) based on the context metadata without requiring human styling.

### Action / Interactive Block
*   **Description:** Buttons, inputs, and form fields.
*   **Progressive Pain Point Solved:** Consultants need to trigger workflows (like emailing a policy to a customer or submitting a claim draft) directly from the knowledge portal without switching to a different internal tool.
*   **Agentic Assembly Logic:** The AI provisions action blocks when the workflow requires human input or a transactional step. These blocks are strictly governed by RBAC (Role-Based Access Control) to prevent unauthorized actions (e.g., only authorized agents can click "Bind Policy").

### Card / Item Container Block
*   **Description:** Standardized container for singular entities (a policy, an article, an alert).
*   **Progressive Pain Point Solved:** When searching for policies or viewing a dashboard, consultants need consistent, bite-sized summaries to quickly decide if they should click for more details. 
*   **Agentic Assembly Logic:** The AI uses the Card Block primarily in Grid Layouts. It automatically maps the entity's underlying metadata (Title, Active Date, State Tags) into the card's predefined slots, ensuring visual consistency across all search results regardless of who authored the content.

### Global Compliance Block
*   **Description:** Reusable, legally mandated text snippets.
*   **Progressive Pain Point Solved:** Progressive faces massive liability if an agent quotes an outdated policy or fails to read a state-mandated disclaimer (e.g., ORC 3937 for Ohio towing limits).
*   **Agentic Assembly Logic:** The AI *cannot edit this block*. It acts as a strict dependency injected into the layout based on the context. If the query involves "Ohio," the AI automatically fetches and locks the Ohio compliance block into the layout. Changes made by the Legal team to this block instantly propagate to all generated UIs globally.

---

## 4. Demo Scenarios in Action (Example Content)

To illustrate how the architecture applies these principles in real-time, here are the specific scenarios and content generated in the live multi-intent demo:

### Scenario 1: Consult (Live Data)
*   **Consultant Query:** *"What coverage options and discounts can I offer a customer to lower their auto premium?"*
*   **Intent Detected:** Consult / Upsell
*   **Layout Assembled:** Dashboard (Side-by-Side)
*   **Blocks Fetched & Example Content:**
    *   **Prose/Card Blocks (Discounts):** Pulled live data showing **Bundle & Save** (average $1,086 savings) and the **Snapshot® Program** (average $328 annual savings).
    *   **Prose Blocks (Upsell):** Highlighted **Progressive Vehicle Protection (Exclusive)** for vehicles 2-8 years old.
    *   **Action Block:** "Launch AutoQuote Explorer®" button, noting required inputs (ZIP, VIN, Driver's License).

### Scenario 2: Resolve / Support
*   **Consultant Query:** *"What roadside assistance applies to an Ohio auto policy transition?"*
*   **Intent Detected:** Resolve / Support
*   **Layout Assembled:** Split Layout (60/40)
*   **Blocks Fetched & Example Content:**
    *   **Targeted Prose Block (Main Slot):** Extracted the exact answer: *"Customer qualifies for a 30-day Ohio grace transition policy... Standard Ohio limits apply (up to 15 miles)."*
    *   **Global Compliance Block (Right Slot):** Locked legal text injected automatically: *"Per ORC 3937, roadside assistance limits are subject to local facility availability..."*
    *   **Action Block:** "Email Policy to Customer" button.

### Scenario 3: Simulate / Transact
*   **Consultant Query:** *"Guide me through filing a Commercial Auto glass claim."*
*   **Intent Detected:** Simulate / Transact
*   **Layout Assembled:** Side-by-Side (Interactive Form)
*   **Blocks Fetched & Example Content:**
    *   **Action Block (Form):** Inputs for Policy Number, Date of Loss, and a dropdown for Glass Type Damaged (Windshield, Side Window, Rear Glass).
    *   **Dynamic Prose Block (Contextual Help):** Monitored the form state. When "Windshield" was selected, it instantly surfaced an ADAS (Advanced Driver Assistance Systems) script: *"Does your vehicle have lane departure warnings, automatic braking, or rain-sensing wipers? If Yes: Recalibration approval required."*