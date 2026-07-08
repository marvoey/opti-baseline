Based on the Agentic CMS POC Blueprint and our recent context around building **Progressive-themed workflows** (specifically emphasizing **knowledge portal authoring** and **simulated user interactions**), we can map the generic concepts to Progressive's specific insurance and enablement ecosystem.

Here is an analysis of the applicable **Universal Intents** and **Layouts** for the Progressive use case, tailored for an Agentic CMS assembly engine.

## 1. Universal Intents for Progressive (The Assembly Triggers)

In the Agentic CMS model, the AI uses the `intent` metadata to determine which blueprint to grab. For Progressive's knowledge portal and user interaction workflows, the engine should recognize these core intents:

- **Intent: Educate / Enable (Knowledge Portal)**
  - **Purpose:** To explain complex insurance policies, internal SOPs, or underwriting guidelines to either Progressive agents or policyholders.
  - **Agentic Action:** The AI automatically grabs layouts optimized for reading and comprehension, prioritizing deep "Prose Blocks" and ensuring proper taxonomy/tagging so the article is easily found in the portal.

- **Intent: Resolve / Support (Self-Service)**
  - **Purpose:** To help a user quickly troubleshoot a specific scenario, such as a billing discrepancy, or to guide them through the initial steps of filing a claim.
  - **Agentic Action:** The AI prioritizes "Action Blocks" and step-by-step structures, pulling in the most relevant FAQ components based on the user's search context.

- **Intent: Simulate / Transact (Interactive Workflows)**
  - **Purpose:** To guide a user or agent through a multi-step process, like a quoting engine or a simulated claim submission flow.
  - **Agentic Action:** The AI selects layouts that support side-by-side data entry and contextual help, strictly governing the form inputs to ensure compliance.

- **Intent: Govern (Internal Authoring)**
  - **Purpose:** To route drafted content through legal, compliance, and brand review before it is published to the portal.
  - **Agentic Action:** Instead of assembling front-end UI, the AI triggers an internal review layout for stakeholders, highlighting changed clauses and verifying regulatory language automatically.

---

## 2. Universal Layouts for Progressive (The Skeletons)

When the AI agent receives one of the intents above, it needs strict slot constraints to build the page safely. Here are the foundational layouts customized for Progressive's needs:

| Layout Type | Progressive Use Case | AI Assembly Constraints & Logic |
|---|---|---|
| **Sidebar / Asymmetrical** | **Deep Knowledge Portal Articles:** The classic structure for policy documentation. | **Constraints:** Left slot (25%) strictly for navigation/table of contents. Main slot (75%) accepts Prose Blocks and Media Blocks (diagrams). |
| **Split Layout (50/50)** | **Simulated Interactions & Quotes:** Perfect for interactive workflows. | **Constraints:** Left slot accepts an Action/Form Block (the quote/claim simulator). Right slot accepts Prose Blocks offering contextual help (e.g., "What does Comprehensive cover?"). |
| **Grid (3 or 4 columns)** | **Agent Dashboards & Portal Home:** The starting point for users to find what they need quickly. | **Constraints:** Only accepts Card Blocks (e.g., "Recent Policy Updates," "Top Searched Articles," "Open Claims"). |
| **Hero / Feature Slot** | **Critical Announcements:** Highlighting major internal updates or regulatory changes. | **Constraints:** Full-width. High visual hierarchy. Accepts a single concise Prose Block and an Action Block (e.g., "Read the new FL Auto Guidelines"). |

## How This Comes Together in the POC

If an author (or a system trigger) inputs the prompt: *"We need a new page to help agents understand the updated Florida Auto Insurance guidelines,"* the Agentic CMS doesn't panic about design.

1. It tags the `intent` as **Educate / Enable**.
2. It selects the **Sidebar / Asymmetrical** layout because that is the established blueprint for deep education.
3. It fills the main slot with **Prose Blocks** (the actual guidelines) and auto-generates the taxonomy for the sidebar.
4. It flags the content with the **Govern** intent, routing it to legal for approval before the knowledge portal goes live.
