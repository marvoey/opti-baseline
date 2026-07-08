# Progressive Insurance: CMS SaaS & Opal Demo Flow

## 🎯 The Core Reframe
**"You're not buying a content management system. You're buying seconds — and accuracy — back for every consultant interaction you have."**

This demo shifts the focus from traditional CMS features to **operational efficiency and risk mitigation**. We will show a Day-in-the-Life scenario proving that AI-readiness requires a robust, structured content architecture today.

---

## 👥 Cast of Characters
1. **Sarah (The Consultant):** Front-line agent handling a live customer call under time pressure.
2. **Marcus (Knowledge Manager):** Responsible for keeping policy content accurate, compliant, and up-to-date for the Commercial Lines team.

---

## 🎬 Act 1: The Payoff (Opal in the Contact Center)
*Start at the end. Show them the AI future they asked for, working perfectly because of Optimizely's architecture.*

* **The Scenario:** Sarah is on a call with a customer in Florida who has a bundled Home & Auto policy. The customer is asking a complex question about hail damage to a vehicle parked in their driveway.
* **The Action:** Instead of searching SharePoint and opening 4 different PDFs, Sarah asks Opal (embedded in her CRM/portal): *"What is our coverage for hail damage to an auto parked at home in Florida?"*
* **The Result:** Opal instantly generates a precise answer using RAG. 
* **Key Talk Tracks:**
    * **Citations & Trust (Req 14):** Highlight how Opal links directly to the specific *Florida Auto Policy* and *Homeowners Hail Addendum*. Sarah can trust it because she can verify it.
    * **Speed to Resolution:** Point out that we just saved 3-5 minutes of handle time and eliminated the risk of reading the "Ohio" policy by mistake.

---

## 🎬 Act 2: The Foundation (CMS SaaS Architecture)
*Transition from the front-end magic to the back-end architecture that makes it possible. "AI is only as good as the content feeding it."*

* **The Scenario:** How did Opal know to give the Florida answer? 
* **The Action:** Switch to Marcus (Knowledge Manager) in CMS SaaS. Open the "Hail Damage Coverage" article.
* **The Result:** Show Optimizely's structured content and variations.
* **Key Talk Tracks:**
    * **Structured Content & Tagging (Req 2):** Show how the article isn't a giant blob of text. It's built with structured fields (Definitions, Limits, Exclusions) and tagged cleanly.
    * **State-Specific Variations (Req 3):** Show the Master "Generic" article, and then seamlessly switch to the "Florida" variation. Demonstrate how Marcus only updates the FL-specific limits without duplicating the entire master document. This is why the AI didn't hallucinate.
    * **Workspaces (Req 8):** Briefly show that Marcus is working in the "Commercial Lines" workspace, safely siloed away from Claims or CRM content.

---

## 🎬 Act 3: Governance & Agentic CMS (The Workflow)
*A regulatory bulletin just dropped. Florida is changing its hail deductible. Show how we maintain compliance at speed.*

* **The Scenario:** Marcus needs to update the Florida variation by the end of the day.
* **The Action:** Marcus uses Opal inside the CMS (Agentic CMS capabilities). He uploads the legal PDF and asks Opal to "Update the Florida hail deductible limits based on this bulletin."
* **The Result:** Opal drafts the changes *within the structured fields*. 
* **Key Talk Tracks:**
    * **Approval Workflows (Req 5):** Marcus submits the AI-assisted draft for Review. Show the compliance approval step. 
    * **AI Security & Freshness (Req 18, 19, 21):** Emphasize a critical point: *Until Compliance clicks "Publish," Opal on the front-end will NOT use this new information.* Optimizely's API instantly syncs permissions—preventing AI from answering with draft or expired content.
    * **Versioning & Audit (Req 6, 28):** Show the version history. If an auditor asks why a claim was approved last Tuesday, Progressive has a perfect snapshot of what the policy said on that exact date.

---

## 🎬 Act 4: Closing the Loop (Analytics & Portability)
*Wrap up by showing how the system gets smarter and fits into their enterprise architecture.*

* **The Action:** Show the Analytics dashboard.
* **Key Talk Tracks:**
    * **Knowledge Analytics (Req 22):** Show how we track what consultants are asking Opal. "Look, we had 50 searches for 'Tesla battery fire' last week, but our confidence scores were low. This is a content gap." Marcus now knows exactly what article to write next.
    * **API First / Headless (Req 17, 27):** Reiterate that while we provide a great authoring UI, the content and the AI search are fully accessible via API to feed whatever custom portals Progressive uses today.

---

## 📝 Q&A Prep for the Demo
*Be ready to answer these directly during the flow:*
1. **"Can we use our own LLM?" (Req 20):** Yes, our Agentic foundations are model-agnostic. You can bring Bedrock.
2. **"How do we migrate from SharePoint?" (Req 11):** Discuss Optimizely's content migration APIs and partner network.
3. **"Does this require developer help to author?" (Req 1):** Point back to Act 2—Marcus did everything via a visual, no-code interface.