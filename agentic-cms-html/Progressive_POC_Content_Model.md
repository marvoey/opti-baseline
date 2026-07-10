## 1. Global Taxonomy (The Logic Engine)
Before defining blocks, we must define the taxonomy. These will be implemented as **Category** or **Taxonomy** properties in Optimizely. 

Based on a comprehensive review of Progressive's official product lines, the taxonomy must support the following:

*   **Line of Business (LOB):** 
    *   *Vehicle:* `Personal Auto`, `Commercial Auto`, `Motorcycle`, `RV/Trailer`, `Boat/PWC`, `ATV/UTV`, `Classic Car`, `Snowmobile`, `Golf Cart`, `Autocycle`, `E-bike`
    *   *Property:* `Homeowners`, `Renters`, `Condo`, `Mobile Home`, `Flood`
    *   *Commercial:* `Business Owners Policy (BOP)`, `General Liability`, `Workers' Compensation`, `Professional Liability (E&O)`, `Cyber Insurance`, `Contractors`
    *   *Specialty/Personal:* `Life Insurance`, `Pet Insurance`, `Umbrella`, `Travel`, `Wedding/Event`, `Jewelry`
*   **Topic / Peril:** 
    *   *Core Perils:* `Hail/Windstorm`, `Water Damage/Burst Pipe`, `Collision`, `Comprehensive (Theft/Vandalism)`, `Bodily Injury Liability`, `Property Damage Liability`, `Uninsured Motorist`, `Medical Payments/PIP`
    *   *Service & Support:* `Roadside Assistance`, `Glass Claim`, `Rental Reimbursement`, `Mechanical Breakdown`
    *   *Sales & Guidance:* `Discounts`, `Coverage Options`, `Upsell/Cross-sell`, `Transition Guidelines`, `Life Events`, `Tools (Snapshot/Name Your Price)`
*   **Jurisdiction (State):** `National`, `FL`, `CA`, `OH`, `TX` (etc. — all 50 states)
*   **Intent Tag:** `Consult`, `Resolve`, `Simulate`