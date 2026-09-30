# Visual 2 Build Plan & Demonstration Runbook: CMS SaaS Visual Builder

**Objective:** Build and rehearse a live, 6–8 minute **"Clinical Independence & Multi-Tenant Co-Branding"** micro-demo in Optimizely CMS SaaS (Visual Builder) specifically tailored to **Dr. Kay Jewell (CMAIO)** and **Dawn Whitelaw (CXO)**.

---

## 1. Architectural Strategy & Demonstration Goals

### The Trap to Avoid
Do not give a generic "CMS product tour" (e.g., showing media trees, user administration, or generic blog templates). 

### The Presales Intent
You are answering the unvoiced anxiety of the founders:
1. **Dr. Kay’s Anxiety:** *"Will clinical copy get mangled or delayed if outside contractors touch our frontend?"*  
   **The Proof:** Show that clinical motivational interviewing (MI) microcopy and crisis safety guardrails are edited in real time with zero code deployment.
2. **Dawn’s Anxiety:** *"How do we deliver co-branded portals with male/female variants without paying the agency to duplicate code 50 times?"*  
   **The Proof:** Show an employer template where brand assets (logos, colors) and cohort variations (Male vs. Female) switch dynamically within the same URL structure.

---

## 2. Step-by-Step Build Plan in CMS SaaS

Follow these 6 steps in your Optimizely CMS SaaS demo instance prior to the call.

```
Step 1: Define Content Types & Component Models
   │
Step 2: Configure Client Co-Branding & Cohort Properties
   │
Step 3: Build the "Employer Wellness Portal" Base Experience
   │
Step 4: Seed Realistic MI Clinical Copy (Dr. Kay Persona)
   │
Step 5: Configure the Male vs. Female Personalization Variants
   │
Step 6: Dry Run & Browser Bookmark Preparation
```

---

### Step 1: Define the Content Types & Component Models

Set up a clean, componentized model so the page structure mimics an enterprise multi-tenant portal rather than a one-off marketing page.

1. **Experience Type: `EmployerWellnessPortal`**
   * Represents the root landing page container for pilot clients (e.g., `/pilot/acme-health`).
   * Composition enabled for Visual Builder editing.
2. **Component Type 1: `EmployerHeaderBlock`**
   * `EmployerLogo` (ContentReference / Image)
   * `CoBrandText` (String, e.g., *"Acme Health × Center for Care Optimization"*)
   * `AccentColor` (String / Color Picker, e.g., `#0F766E`)
3. **Component Type 2: `ClinicalHeroBlock`**
   * `Headline` (String)
   * `MotivationalBody` (RichText, 100–150 words with H1/H2 support)
   * `CtaButtonText` (String, e.g., *"Begin Confidential Session with Hygia™"*)
   * `CtaDeepLink` (String, e.g., `#launch-hygia`)
4. **Component Type 3: `ClinicalTrustBlock`**
   * `TherapeuticModelBadge` (String: *"Evidence-Based Motivational Interviewing"*)
   * `PrivacyDisclaimer` (RichText: *"100% Confidential • HIPAA-Compliant • Never shared with Acme Health HR"*)
   * `CrisisNotice` (RichText: 24/7 Suicide & Crisis Lifeline 988 details)

---

### Step 2: Configure Client Co-Branding & Cohort Properties

To demonstrate how easily Dawn can manage multi-tenancy:

1. Add a **`ClientSlug`** metadata field (e.g., `acme-health`, `pilot-beta`).
2. Add an **`AudienceSegment`** property to test variant states (`Default`, `Male Cohort`, `Female Cohort`).
3. Ensure the preview URL pattern resolves cleanly (e.g., `https://demo.cco.health/pilot/{clientSlug}?variant={audience}`).

---

### Step 3: Build the Base Experience in Visual Builder

Create the baseline experience under your CMS Sites tree:

1. **Create Page:** Create a new page named **`[Demo] Acme Health - Wellness Portal`**.
2. **Open Visual Builder:** Launch the visual editor via the Experience view.
3. **Add Section 1 (Employer Co-Brand Header):**
   * Insert a 1-column Row.
   * Add the `EmployerHeaderBlock`.
   * Upload an "Acme Health" placeholder logo alongside CCO’s mark.
4. **Add Section 2 (Motivational Hero & Hygia Intake CTA):**
   * Add a 2-column Row (60/40 split):
     * **Left Column:** `ClinicalHeroBlock` (Headline, Motivational Body, CTA Button).
     * **Right Column:** Visual Card showcasing a simulated chat interface snippet of **Hygia™** with a reassuring introductory message.
5. **Add Section 3 (Clinical Governance & Trust Footer):**
   * Insert a 1-column Row.
   * Add `ClinicalTrustBlock` containing Dr. Kay’s HIPAA and crisis hotline copy.

---

### Step 4: Seed Realistic Clinical Copy (Dr. Kay Persona)

Avoid lorem ipsum. Seed content that reflects Dr. Kay's clinical expertise and Motivational Interviewing (MI) principles:

* **Headline:** *"Reclaim Your Momentum, on Your Terms"*
* **Body Copy (Default Variant):**
  > *"Change rarely happens because someone tells you what to do. It happens when you find your own reasons to begin. Whether you’re managing daily work stress, adjusting sleep habits, or navigating chronic fatigue, **Hygia™** is here to listen—not judge or prescribe. 
  > 
  > In just **3 minutes**, explore what balance looks like for you today through a private, confidential conversation."*
* **CTA Button:** *"Start 3-Minute Reflection with Hygia™"*
* **Trust Footer:**
  > *"Clinical Oversight led by Dr. Kay Jewell, MD. Powered by Motivational Interviewing (MI). Your interactions are strictly confidential and protected under HIPAA. No individual data is ever shared with Acme Health management."*

---

### Step 5: Configure the Male vs. Female Personalization Variants (Dawn Persona)

In Visual Builder, set up the variant layer on the `ClinicalHeroBlock`:

1. **Select the Hero Component** in Visual Builder.
2. Click **Add Personalization / Variant**:
   * **Variant A (Male Outreach Cohort):**
     * *Trigger Rule:* Query Parameter `gender=m` OR Audience Segment = "Male Employee Outreach".
     * *Headline:* *"Burnout Isn’t Weakness. It’s Data. Let’s Fix the Engine."*
     * *Motivational Copy:* Focus on high-performance stamina, recovery metrics, stress decompression, and practical habit resets without touchy-feely clichés.
     * *Image Asset:* Visual focused on focus, endurance, or structured progress.
   * **Variant B (Female Outreach Cohort):**
     * *Trigger Rule:* Query Parameter `gender=f` OR Audience Segment = "Female Employee Outreach".
     * *Headline:* *"Carrying Everything for Everyone Else? Time to Reset Your Balance."*
     * *Motivational Copy:* Focus on cognitive overload, boundaries, emotional well-being, and sustainable self-care rhythms.
     * *Image Asset:* Visual focused on calm, clarity, and restorative space.

---

### Step 6: Browser Tab & Pre-Call Staging

Set up two dedicated browser tabs before Halla starts the call:
* **Tab 1 (The Editor):** Optimizely CMS SaaS Visual Builder editing the *Acme Health* landing page, focused on the Hero block.
* **Tab 2 (The Public Edge Preview):** The live rendering of `https://.../pilot/acme-health` in an incognito window, ready to refresh.

---

## 3. Step-by-Step Live Execution Script (6–8 Minutes)

When Halla hands off to you after Step 2 (Business Pain), transition immediately into your screen share:

```
[Min 0:00–1:00] Frame the Mental Model (Why we're looking at Visual Builder)
[Min 1:00–3:30] Action A: Live Clinical Copy Edit (For Dr. Kay Jewell)
[Min 3:30–6:00] Action B: Toggle Male/Female Cohort Variants (For Dawn Whitelaw)
[Min 6:00–7:30] The Agency Bridge (How this prevents developer rework)
```

---

### Action A: The Clinical Copy Live Edit (For Dr. Kay Jewell)
*Time: ~2.5 minutes*

1. **What to Click on Screen:**
   * Share screen showing Visual Builder with the *Acme Health* portal loaded.
   * Point your cursor to the **Motivational Body Copy** in the Hero Block.
   * Click directly into the text field (inline editing).
2. **What to Say to Dr. Kay:**
   > *"Dr. Kay, you noted that medical and therapeutic copy requires specialized in-house input because of clinical rigor. Here is why that matters for your architecture:
   > 
   > In a traditional setup, if you or your clinical team realize that an intake prompt is too prescriptive—violating Motivational Interviewing principles—you have to submit a ticket to your agency, wait for a sprint cycle, and test it in staging.
   > 
   > Watch this: I am in the live Visual Builder. I can click right into this clinical reflection block, adjust the motivational prompt from 'Explore your balance' to 'Discover your reasons for change,' verify the HIPAA crisis disclaimer below, and hit **Publish**."*
3. **What to Click:**
   * Type the live edit on screen.
   * Click the green **Publish** button in the top right.
   * Switch to Tab 2 (Public Preview), hit refresh, and show the updated clinical copy rendering instantly.
4. **The Diagnostic Probe (Ask Dr. Kay):**
   > *"Dr. Kay, when you need to refine clinical guardrails or update emergency crisis resources across your 2–3 pilot employers today, what does that path to production look like? Does it wait on developers, or do you have immediate editorial authority?"*

---

### Action B: The Male / Female Variant Switch (For Dawn Whitelaw)
*Time: ~2.5 minutes*

1. **What to Click on Screen:**
   * Return to Visual Builder (Tab 1).
   * Hover over the **Audience / Variant Selector** dropdown at the top of the canvas.
   * Show the active state: **`Default View`**.
   * Click the dropdown and select **`Variant A: Male Outreach Cohort`**.
2. **What Happens on Screen:**
   * The headline changes to: *"Burnout Isn’t Weakness. It’s Data. Let’s Fix the Engine."*
   * The hero image shifts from a neutral graphic to the focused recovery graphic.
   * The CTA button updates to: *"Start 3-Minute Performance Reset"*.
3. **What to Click Next:**
   * Click the dropdown again and select **`Variant B: Female Outreach Cohort`**.
   * The headline changes to: *"Carrying Everything for Everyone Else? Time to Reset Your Balance."*
   * The text shifts to cognitive load and boundary management.
4. **What to Say to Dawn:**
   > *"Dawn, for Phase 1 you identified starting with male and female variants to hit that aggressive 40–60% engagement target. 
   > 
   > Notice what just happened: We didn't build two different websites. We didn't ask your agency to write separate frontend components. 
   > 
   > Within one single template, you can define audience rules—whether triggered by a campaign parameter from the broker's outreach email (`?variant=male`) or a self-selected preference—and the page dynamically swaps the tone, imagery, and clinical hooks."*
5. **The Diagnostic Probe (Ask Dawn):**
   > *"Dawn, when the broker launches outreach campaigns across your pilot employers, how are you intending to route employees into these cohorts? Are you planning to pass URL parameters from their HR email system, or do you want visitors to self-identify on the landing page?"*

---

### Action C: The Bridge to Visual 3 (The Agency Architect Hand-off)
*Time: ~1.5 minutes*

1. **What to Show:**
   * Highlight the **Clean Separation of Concerns**:
     * Dr. Kay owns clinical copy.
     * Dawn owns employer co-branding and variant rules.
     * The external agency writes zero CMS code.
2. **What to Say to George & the Founders:**
   > *"Here is the commercial payoff for your timeline: your agency team is ramping up this week. If you ask them to build client-specific landing pages and content systems from scratch, they will spend 80% of their billable hours building database tables and admin forms that you’ll have to discard later.
   > 
   > With this setup, your agency builds one simple Next.js frontend. They pull all of Dr. Kay’s clinical copy and Dawn’s employer variants through our high-speed GraphQL API. When you sign Employer #2 and Employer #3, you don't call the agency—you duplicate this template in CMS SaaS and launch in 15 minutes."*

---

## 4. Pre-Call Validation Checklist

| Check | Item | Verified? |
|---|---|---|
| 🔲 | **Content Model:** `EmployerWellnessPortal` and `ClinicalHeroBlock` created in CMS SaaS instance. | [ ] |
| 🔲 | **Clinical Copy:** Accurate Motivational Interviewing copy loaded (no placeholder / Latin text). | [ ] |
| 🔲 | **Variants Configured:** Male and Female variants toggling smoothly in Visual Builder. | [ ] |
| 🔲 | **Live Edge Preview:** Incognito tab open to verify instant publishing changes without lag. | [ ] |
| 🔲 | **Hand-off Cues:** Practiced transitioning from Action B directly into the Graph GraphQL query (Visual 3). | [ ] |
