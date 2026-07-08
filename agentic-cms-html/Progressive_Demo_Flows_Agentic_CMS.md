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

## 🎬 Act 3: The Engine (Agentic Content Assembly)
*Focus: Proving this isn't magic. It requires Marcus (Knowledge Manager) using an Agentic CMS to structure the data.*

* **The Setup:** How does the Generative UI know the exact limits without hallucinating? We go behind the scenes to Optimizely CMS to see Marcus, the Knowledge Manager.
* **The Action (Ingest Intent):** Marcus drags a legacy 15-page PDF into the Opal workspace. He prompts: *"Ingest this policy. Extract the core coverage limits, exclusions, and deductibles and map them to our structured fields."*
* **The Result:** The Agentic CMS strips away the "document" formatting and locks the data into pre-approved, atomic fields (Limit = $500, Peril = Hail).
* **The Talk Track:** *"This is the foundational difference. You can't put a Generative UI over a folder of PDFs. Marcus is using the Agentic CMS to turn unstructured legacy blobs into strict, compliant, atomic data."*

* **The Action (Variant Assembly Intent):** Marcus prompts Opal: *"Generate state variations for Florida and Georgia based on the standard policy, but update Florida's deductible to $1000 and Georgia's to $750."*
* **The Result:** The CMS scales the matrix instantly, linking reusable legal disclaimers so nothing is out of compliance.
* **The Talk Track:** *"Because Marcus assembled this as atomic, tagged data variations rather than static pages, the API can query it mathematically. That is what allows the Generative UI in Act 2 to build a perfect comparison matrix on the fly."*