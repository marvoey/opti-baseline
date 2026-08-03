# Progressive Line of Business (LOB) Taxonomy

Adding a **Line of Business (LOB)** or **Product Line** property enables the AI orchestration engine to filter blocks not just by State or Audience, but by the specific insurance product being discussed.

### 1. Suggested Property Name
**`LineOfBusiness`** (Display Name: "Line of Business") - This is the standard insurance industry term.

### 2. Suggested Taxonomy (Dropdown Options)
Since a block (like a general fraud warning) might apply to both *Personal Auto* and *Motorcycle*, while others are strictly *Commercial Auto*, this should be a **Multi-Select** property.

*   `personal_auto`: **Personal Auto** *(Primary for the FNOL demo)*
*   `commercial_auto`: **Commercial Auto**
*   `homeowners`: **Homeowners**
*   `renters`: **Renters**
*   `motorcycle_atv`: **Motorcycle / ATV**
*   `boat_pwc`: **Boat / Watercraft**
*   `rv_trailer`: **RV / Trailer**
*   `umbrella`: **Umbrella Policy**

### 3. CMS JSON Definition
To add this to the `prgv_StandardInstructionBlock`, `prgv_ScriptingBlock`, and `prgv_HandlingNoteBlock`, use the following JSON property definition:

```json
{
    "LineOfBusiness": {
        "Type": "array",
        "Format": "selectMany",
        "Items": {
            "Type": "string",
            "Enum": [
                { "DisplayName": "Personal Auto", "Value": "personal_auto" },
                { "DisplayName": "Commercial Auto", "Value": "commercial_auto" },
                { "DisplayName": "Homeowners", "Value": "homeowners" },
                { "DisplayName": "Renters", "Value": "renters" },
                { "DisplayName": "Motorcycle / ATV", "Value": "motorcycle_atv" },
                { "DisplayName": "Boat / Watercraft", "Value": "boat_pwc" },
                { "DisplayName": "RV / Trailer", "Value": "rv_trailer" },
                { "DisplayName": "Umbrella Policy", "Value": "umbrella" }
            ]
        },
        "DisplayName": "Line of Business",
        "Description": "Which insurance products does this block apply to?",
        "Group": "Content",
        "IsRequired": true
    }
}
```

### 4. The Value for Your Demo Story
Adding this allows you to pitch a **3-Dimensional Content Assembly** story:

> *"The AI doesn't just look at the document. It looks at the real-time context of the call. It asks three questions: Who is the agent? Where is the customer? What is the product? It then reaches into the CMS and pulls only the blocks tagged: **Audience:** Tier 1 + **State:** California + **Line of Business:** Personal Auto."*