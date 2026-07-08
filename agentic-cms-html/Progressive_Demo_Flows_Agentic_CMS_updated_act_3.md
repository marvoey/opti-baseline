# Progressive Insurance: Intent-Driven Knowledge Demo Flow

## 🎯 The Core Reframe
**"We are moving from a 'Search and Read' document repository to 'Intent-Driven Layout Assembly'."**

This demo flow is explicitly structured to contrast the painful "Now" (navigating static documents) with the dynamic "Future" (multi-intent Generative UI powered by an Agentic CMS). 

*(Note: Per current POC guidelines, the "Govern/Review" intent is intentionally excluded to focus entirely on the contrast between static retrieval and dynamic assembly).*

---

## 🎬 Act 1: The Pain of the "Now" (The Traditional KB)
*Focus: Setting the trap. Proving that searching for documents puts the burden of assembly on the consultant.*

* **The Setup:** We start in the `Traditional_KB_Simulator`. Sarah, a Progressive consultant, is on a live call with a customer. The customer wants to know the commercial auto hail deductible for Florida, and what it would be if they moved their business to Georgia.
* **The Action (Search):** Sarah types the query into the standard enterprise search bar.
* **The Result (Blue Links):** The system returns a list of confusingly named PDFs and Word documents. 
* **The Action (Read):** Sarah clicks the Florida Addendum. She is presented with a 14-page legal PDF.
* **The Talk Track (The Rational Drowning):** *"Look at this experience. The customer is on hold. Sarah has to hit Ctrl+F, scroll to Section 4, read dense legal text to find the $1,000 limit, and hold that number in her head. Then, she has to hit 'Back', find the Georgia document, and do it again. She is mentally assembling a comparison matrix under pressure. This causes burnout, spikes handle time, and introduces massive compliance risk."*

---

## 🎬 Act 2: The Solution (Intelligent Enablement Portal)
*Focus: Multi-Intent Generative UI, Speed to Resolution, Citation/Trust*

* **The Setup:** We immediately switch to the new Intelligent Enablement Portal (powered headlessly by Optimizely's Agentic CMS).
* **The Action (Retrieve Intent):** Sarah types her exact query: *"What is the commercial auto hail deductible for Florida?"*
* **The Result (Dynamic Layout):** The UI does NOT return a PDF. It instantly assembles a clean, structured mini-dashboard showing the exact $1,000 Florida deductible, pulling from atomic data blocks. 
* **The Action (Compare Intent):** Sarah types: *"Compare that to Georgia."*
* **The Result (Layout Shift):** The Generative UI dynamically reframes itself, assembling a side-by-side comparison matrix of Florida vs. Georgia.
* **The Talk Track:** *"Notice the difference. We didn't give Sarah a document to read. The system understood her intent and dynamically assembled the exact UI layout she needed to resolve the call. No Ctrl+F. No mental math. And because every data point has a 'View Source' citation deep-linking to the exact approved policy block, she can trust it 100%."*

---

## 🎬 Act 3: The Engine (Authoring Tagged Copy, Not Pages)
*Focus: The paradigm shift from writing "documents" to managing structured, atomic, AI-ready data.*

* **The Setup:** How does the Generative UI know the exact limits without hallucinating? We go behind the scenes to Optimizely CMS to see Marcus, the Knowledge Manager. He just received a regulatory bulletin: *Florida and Georgia are changing their Commercial Hail deductibles for 2026.*
* **The Action (Authoring Atomic Copy):** In a traditional CMS, Marcus would open a blank page or a giant WYSIWYG editor and start typing a 10-page "document." Here, Marcus creates a specific, atomic content block—a "Coverage Limit." He inputs *only* the new rule copy: "Mandatory baseline deductible of $1,000 applies to all commercial auto policies for hail."
* **The Action (The Core Concept: Tags as Logic):** Marcus applies strict taxonomy tags to this copy block: `LOB: Commercial Auto`, `State: Florida`, `Peril: Hail`. 
* **The Talk Track (The Paradigm Shift):** *"This is the fundamental shift. Marcus is not writing a page. He is managing 'copy'. In a traditional knowledge base, tags are just used to help the search bar find a PDF. In an Agentic CMS, the tags ARE the logic. They act as the strict boundaries that tell the AI exactly when and where this piece of copy is allowed to be used."*

* **The Action (Variant Assembly Intent - Addressing the Scale Objection):** Marcus needs to apply this to Georgia, but with a different limit. He asks Opal (the Agentic CMS): *"Generate a state variant of this block for Georgia, but change the deductible to $750."*
* **The Result:** Opal instantly creates the tagged variant. Marcus didn't have to duplicate a 10-page document just to change one number.
* **[PRESENTER NOTE - Why this step matters]:** *We include this step specifically to preempt the Knowledge Manager's immediate objection: "If I have to break everything into blocks, do I have to manually do this 50 times for 50 states?" This step proves the CMS is truly Agentic—using AI to do the heavy lifting of matrix management so the author doesn't have to.*
* **The Talk Track (Full Circle):** *"Because Marcus authors properly tagged copy instead of static pages, he eliminates conflicting truths. And more importantly, this is exactly why Sarah's interface in Act 2 worked. When Sarah asked her question, the system didn't read a document—it used her intent to query these exact tags, pulling the $1,000 Florida block and the $750 Georgia block, and assembling them perfectly on the glass."*