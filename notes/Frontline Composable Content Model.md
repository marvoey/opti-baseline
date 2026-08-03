# Frontline Composable Content Model

To move away from static Word documents (like the 10-page *Auto Claims FNOL* or *Teen Driver* guides), we must break the content into a modular architecture. 

In this model, a "Procedure" is no longer a massive block of text. Instead, we lean entirely into the power of the **Optimizely Visual Builder** and front-end filtering.

Here are the core Content Types required to build this composable architecture for the demo.

---

## 1. The Container: A Standard "Experience"
*Base Type: `_experience` (e.g., a standard `BlankExperience`)*

You do not need a rigid, custom "Procedure Page" type. By using a standard Optimizely Experience, you get an infinitely flexible, drag-and-drop canvas. 

**How it works:** 
The author creates a new `BlankExperience` and titles it "Adding a Teen Driver." This is the empty binder. The magic happens entirely through the smart components they drop onto this canvas.

---

## 2. The Reusable Blocks (Components)
*Base Type: `_component` (Must have `compositionBehaviors: ["sectionEnabled", "elementEnabled"]` to be dragged into the Visual Builder).*

These are the "Index Cards" that get dropped onto the Experience. Authors create these blocks and tag them with taxonomies so the system knows when to assemble them.

### Block A: `[PRGV] Standard Instruction Block`
The most common block, used for general step-by-step guidance.
*   **`Instruction Text`** (Rich Text) - The actual steps to take.
*   **`Target Audience`** (Multi-select Enum) - Used to filter which agents can see this step.
    *   *Values:* `Tier 1 Service`, `Tier 2 Service`, `Tier 1 Claims Intake`, `Tier 2 Claims Support`, `Escalation Desk`, `Retention`, `Supervisor Queue`, `Agency Support`
*   **`Applicable State`** (Taxonomy Reference) - e.g., *National*, *California*.

### Block B: `[PRGV] Handling Note & Rule Block` (Solving the "Wall of Text")
Used to break down complex severity flags, escalation rules, and state-specific exceptions into atomic pieces.
*   **`Note Content`** (Rich Text) - The specific rule or flag (e.g., "If vehicle is not drivable, escalate to Towing Team").
*   **`Rule Category`** (Single-select Enum) - Drives front-end logic (e.g., putting a red border around a severity flag vs. a yellow border around a general note).
    *   *Values:* `Severity Flag`, `Escalation Rule`, `State Exception`, `General Handling Note`
*   **`Severity Level`** (Single-select Enum) - Used by the agent to filter the wall of text down to the most critical alerts.
    *   *Values:* `Low Priority`, `Medium Priority`, `High Priority`, `Critical - Stop/Review`
*   **`Applicable State`** (Taxonomy Reference) - e.g., *New York*.

### Block C: `[PRGV] Scripting Block`
Used strictly for verbatim language the agent must read out loud.
*   **`Verbatim Script`** (Rich Text) - The exact words to say.
*   **`Script Category`** (Single-select Enum) - Tells the front-end how to style the box (e.g., Legal scripts always render in a blue "Must Read" box).
    *   *Values:* `Greeting/Opening`, `Legal/Compliance`, `Closing/Sign-off`, `De-escalation`
*   **`Applicable State`** (Taxonomy Reference)

---

## 3. The Centralized Matrix (Global Components)

Some blocks are so important they shouldn't just be created ad-hoc inside the Visual Builder. They need to be stored in a shared component library so *dozens* of Experiences can link to them.

### `[PRGV] Global Compliance Disclosure`
A specialized version of the Scripting Block managed exclusively by the Legal/Compliance team.
*   **`Disclosure Name`** (String) - e.g., "California Privacy Rights 2026".
*   **`Legal Text`** (Rich Text) - The mandatory script.
*   **`Jurisdiction`** (Taxonomy Reference) - e.g., *California*.

---

## 4. Demo Scenarios: Assembling the Content

### Scenario 1: The Basic Assembly
1.  **The Blank Canvas:** You create a new `BlankExperience` for "Adding a Teen Driver."
2.  **The Core Steps:** You drag a `Standard Instruction Block` onto the page. You tag it for *National* and *Tier 1*. You explain: *"Everyone sees this base block."*
3.  **The Escalation:** You drag a second `Standard Instruction Block` regarding premium overrides below the first one. You tag it for *Retention*. You explain: *"The Tier 1 agent never sees this block, preventing unauthorized discounts."*

### Scenario 2: Solving the "Wall of Text" (Severity & Escalation Rules)
In legacy Word docs, the "SEVERITY FLAGS AND STATE HANDLING NOTES" section is a giant, unreadable paragraph. Here is how composability fixes it for the agent:

1.  **Authoring (Deconstruction):** Instead of typing a giant paragraph, the author drags 5 individual `[PRGV] Handling Note` blocks onto the canvas. They tag one as *Severity: High*, another as *State: NY*, and another as *Category: Escalation*.
2.  **Agent Experience A (The Whole Thing):** A new trainee opens the page. By default, the front-end renders all 5 blocks neatly stacked. They can read "the whole thing" for full context.
3.  **Agent Experience B (The Laser Focus):** An experienced agent gets a live call from New York with a highly severe claim. They don't have time to read 5 blocks. 
    *   On the front-end portal, they click two filters at the top of their screen: **[State: NY]** and **[Severity: High]**.
    *   *The Magic:* Optimizely Graph instantly filters the components. The wall of text disappears, and only the *one* handling note that matches NY and High Severity remains on the screen. The agent gets exactly what they need in milliseconds.