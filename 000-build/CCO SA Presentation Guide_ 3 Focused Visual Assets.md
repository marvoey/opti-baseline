# What You Should Present: 3 Focused Visual Assets (15–20 Mins Total)

In the **Sandler & Challenger hybrid approach**, you don't do a generic 45-minute feature tour. Instead, you run **"Diagnostic Micro-Demos" (Give-to-Get)**: you show 60–90 seconds of a concrete capability, and use what’s on screen as the anchor to ask your diagnostic questions.

---

### Presentation Flow Overview

```
[Asset 1] The CCO Architecture Blueprint (2–3 mins)
     │   └─ Gives them the "Mental Model" & proves you understand their ecosystem.
     ▼
[Asset 2] Visual Builder: Clinical Copy & Co-Branded Employer Variants (6–8 mins)
     │   └─ Speaks directly to Dr. Kay & Dawn: proves non-devs can launch client pages.
     ▼
[Asset 3] Optimizely Graph: The Clean Headless API Hand-off (3–4 mins)
         └─ Speaks to the incoming Agency Architect: proves no custom backend is needed.
```

---

### Visual 1: The CCO Solution Architecture Blueprint (Slide / Miro / Canvas)
**Time:** ~3 minutes  
**What's on screen:** A clean, branded diagram of the **3-Tier Architecture** with *their* names and systems explicitly labeled:
* **Top Layer:** Optimizely CMS SaaS (Dr. Kay’s MI copy & Dawn’s employer templates)
* **Middle Layer:** Agency Delivery (Next.js / React headless client)
* **Bottom Layer:** Hygia™ MI Engine + HealthSignals™ Risk Models + Employer Dashboard

**What you say & show:**
> *"Before we talk about features, let me show you how we see the boundaries of your platform. 
> 
> You have three core engines: Layer 3 is your proprietary IP—Hygia's conversational LLM, HealthSignals, and your employer dashboard. Layer 2 is what your incoming agency is building—a fast, responsive Next.js frontend. 
> 
> Layer 1 is where we sit: giving Dr. Kay and Dawn full editorial control over clinical MI copy and employer co-branding, without forcing your agency to spend the next 4 months building a custom CMS from scratch."*

**The Diagnostic Question you pivot to:**
> *"Looking at this separation: When an employee hits Employer #1’s URL, how does your agency plan to serve that frontend today? Are they planning to hardcode templates in React, or do they expect a headless API to feed them content?"*

---

### Visual 2: The "Clinical Independence" Micro-Demo (Visual Builder in CMS SaaS)
**Time:** ~6–8 minutes  
**What's on screen:** Optimizely Visual Builder (CMS SaaS). 
* Have a mockup or clean demo page titled **"Employer Wellness Portal (e.g., Acme Health / Hygia Onboarding)"**.
* Show an employer hero block with a logo, clinical headline, and a button to *"Start Conversation with Hygia"*.

#### Action A: Show Clinical Copy Editing in Real Time (For Dr. Kay)
* Click into a text block with Motivational Interviewing copy (e.g., *"Take 3 minutes to explore what balance means for you today"*).
* Change the copy live on screen.
* **What you say to Dr. Kay:**
  > *"Dr. Kay, you mentioned medical copy requires specialized in-house input. In our Visual Builder, you or your team have a governed editorial workspace. You can refine motivational prompts, update crisis contact resources, or adjust clinical tone directly. You hit 'Publish,' and it’s instantly live across your web endpoints without waiting for a developer sprint cycle."*
* **The Diagnostic Probe:**
  > *"Today, if you discover an MI prompt isn't converting or needs clinical re-wording, how does that edit get made? Does it sit in a GitHub backlog, or do you have a way to publish safely in real time?"*

#### Action B: Show the Male/Female Variant Switch (For Dawn)
* In Visual Builder, click the **Audiences / Variants dropdown** (showing a *"Default"*, *"Variant A: Male Outreach"*, and *"Variant B: Female Outreach"*).
* Toggle between the two variants to show how the imagery and copy shift dynamically (e.g., male variant emphasizes stress/performance, female variant emphasizes holistic balance).
* **What you say to Dawn:**
  > *"Dawn, for Phase 1 you identified starting with male and female outreach variants to hit that 40–60% engagement target. Here, you define the variant rules—whether triggered by a URL parameter from the broker's email (`?variant=male`) or audience signals—without asking developers to code two separate websites."*
* **The Diagnostic Probe:**
  > *"When the broker sends out that email campaign to 500 employees, how are you intending to pass that cohort signal? Will it be a query parameter in the link, or do you want the user to self-select on the page?"*

---

### Visual 3: The Headless Hand-off (Optimizely Graph / GraphQL IDE)
**Time:** ~3–4 minutes  
**What's on screen:** The Optimizely Graph GraphQL Query Explorer.
* Run a clean, 10-line GraphQL query:
  ```graphql
  query GetEmployerPortal($employer: "acme-corp", $variant: "female") {
    EmployerLandingPage(where: { clientSlug: { eq: $employer } }) {
      companyName
      brandColor
      heroHeadline
      clinicalCtaText
      hygiaSessionEndpoint
    }
  }
  ```
* Hit "Execute" and show the clean JSON response returning in 30 milliseconds.

**What you say (Speaking to George & the incoming Agency Architect):**
> *"Here is why your incoming agency will love this: they don't have to learn a complex enterprise framework or maintain a database for content. 
> 
> Everything Dr. Kay and Dawn configure in the visual editor is exposed as a high-speed, CDN-cached GraphQL API. Your agency devs simply query the data in JSON and bind it to their React or Next.js components. When you sign Employer #2 and Employer #3, the agency doesn't write new code—they just pass the new client slug."*

**The Diagnostic Probe:**
> *"Your agency has an architect coming on this week. When they evaluate a content backend, are they expecting a pure headless GraphQL/REST engine, or are they considering building their own custom database from scratch?"*

---

### How to Transition to Step 4 (The 3-Tier Chalk Talk & Halla's Budget Step)

After showing Visuals 1, 2, and 3 (about 15 minutes of interactive discussion), you bring down your screen share and transition back to the founders:

**Marvin's Wrap-up & Hand-off:**
> *"So that’s the architecture in action: Dr. Kay and Dawn get complete visual control over clinical copy and employer variants, while your agency gets a clean headless API to build their frontend without creating technical debt.
> 
> If we keep this separation clean, you can launch your 2–3 pilot employers easily before October 15. 
> 
> Halla, knowing this is what’s required to protect their pilot scale, how does this align with the commercial plan?"*

---

### Preparation Checklist for Marvin before the Call:
1. **Prepare 1 Architecture Slide:** The 3-Tier diagram customized with CCO's branding, *Hygia™*, and *HealthSignals™*.
2. **Set up a Visual Builder demo tenant:** A simple landing page with an employer logo slot, editable MI headline, and an Audience toggle (Male / Female).
3. **Graph GraphQL Query open in a browser tab:** Pre-loaded with an employer query returning clean JSON.
