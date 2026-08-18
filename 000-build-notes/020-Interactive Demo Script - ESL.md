# Step-by-Step Script: ESL Interactive Demo Flow

This script is designed to be used alongside the interactive React prototype. It will guide you exactly on what to click and what to say to hit every critical requirement Simon (Alacrity) outlined for the ESL team.

---

### Step 1: Setting the Stage (The Architecture)
**Target Audience:** Ocean Dev Team & ESL Governance Team
**Agenda Item:** Company + Product Overview / Platform Orientation

* **Action:** Open the interactive demo with the "Visual Composition" tab active on the left. Leave the hero on "Split Content."
* **Talk Track:** 
> *"To understand why Optimizely is the perfect fit for ESL's headless transformation, we need to look at how we divide responsibilities. On the left, you see the Optimizely CMS SaaS interface—this is the Marketer's domain. On the right, you see the Next.js application—this is the Developer and Brand Governance domain. We pass clean JSON from the left to the right. Let me show you why this matters."*

---

### Step 2: Rapid Visual Composition (Within Guardrails)
**Target Audience:** ESL Marketing Team & Ocean Dev Team
**Agenda Item:** Visual Composition + Rapid Experience Iteration

* **Action:** Click the "Hero Block Component" dropdown on the left and change it from **"Split Content"** to **"Centered Banner"**.
* **Talk Track:** 
> *"Your marketers need to move fast. If they decide a campaign needs a centered hero banner instead of a split layout, they just select it from the dropdown. Notice how the Next.js front-end instantly responds. But look closely at the CMS panel on the left: there are no color pickers, no font size overrides, and no margin padding inputs. The marketer controls the **structure**, but the Next.js app strictly enforces the ESL Blue brand guidelines. Marketers get speed, developers get governance."*

---

### Step 3: Content Curation & The DAM
**Target Audience:** ESL Marketing Team
**Agenda Item:** Platform Orientation + Content Curation

* **Action:** Delete the text in the "Headline" box and type: `"Welcome to the new ESL."` Then, toggle the **"Display Featured Products Grid"** checkbox off, and then back on.
* **Talk Track:** 
> *"Updating copy is instant. If a marketer wants to change the messaging or swap a hero image from the integrated DAM, they just update the fields and the JSON payload updates in real-time. If they want to simplify the page, they can toggle entire component grids off with a single click. It's drag-and-drop flexibility without the risk of breaking the site."*

---

### Step 4: Personalization ("Crawl" Phase)
**Target Audience:** ESL Marketing Team
**Agenda Item:** Personalization + Experimentation

* **Action:** Click the **"Audiences"** tab on the left side of the CMS panel. 
* **Talk Track:** 
> *"We know you want to walk before you run with personalization. You don't need a massive, complex data model on Day 1. Optimizely allows you to do basic, rule-based personalization right out of the gate."*
* **Action:** Click the **"First-Time Homebuyer"** button in the left panel.
* **Talk Track:** 
> *"If a user enters the 'First-Time Homebuyer' segment, the marketer sets a rule in the CMS. Notice how the hero headline and call-to-action instantly pivot to mortgage resources. The Next.js app doesn't have to change its code; it just receives a different JSON payload from Optimizely based on who is looking at the screen."*

---

### Step 5: The Agentic Teaser (Phase 2)
**Target Audience:** ESL Leadership
**Agenda Item:** Wrap Up / Time-to-Market Benchmarks

* **Action:** Leave the screen showing the personalized First-Time Homebuyer view.
* **Talk Track:** 
> *"Everything I just showed you is your Day 1, governed MVP. But what happens in Year 2 when you need to scale? That is where Opal, our Agentic AI, comes in. Because Optimizely knows your exact content model, you can ask Opal to 'Draft a landing page for Auto Loans.' Opal will fill out all those fields on the left automatically. But because of this architecture, Opal can NEVER break your Next.js design system. AI provides the scale, but your developers still own the brand."*