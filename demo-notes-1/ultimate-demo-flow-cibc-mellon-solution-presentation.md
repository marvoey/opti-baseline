# Ultimate Demo Flow: CIBC Mellon Solution Presentation

This runbook merges the strategic, narrative-driven "Day in the Life" scenario with tactical, step-by-step instructions for the presenter. It ensures seamless transitions between the Next.js app, the CMS Editor, and architecture slides while actively managing the psychology of the evaluation room.

## Stakeholder Handoff Strategy
The agenda order is intentional. Sections 1-4 are designed to hook the Business/Marketing buyers. Section 5 acts as the "handoff" where the narrative shifts under the hood. Sections 5-8 secure the technical win from IT, Security, and Compliance stakeholders.

| Segment | Primary Audience | Mode |
| :--- | :--- | :--- |
| 1. Platform Interface | Marketing, Business | Live App + CMS Editor |
| 2. Customer Journey | Marketing, Business | Live App + CMS Editor |
| 3. Personalization | Marketing, Business | Live App (+ Web UI) |
| 4. Core Features | Marketing → IT Bridge | CMS Editor |
| 5. Architecture | IT | Architecture Argument + Live App |
| 6. Integrations | IT | Architecture Argument |
| 7. Security | IT, Security | CMS Editor + Architecture Argument |
| 8. Scalability | IT, Security | Architecture Argument |

---

## 1. Demonstration of Platform Interface (15 min)
*Goal: Hook the business stakeholders. Lead with what the marketer sees and controls, proving that the platform is ready today with no developer bottlenecks.*

*   **Action [Live App Demo]:** Open the published CIBC Mellon Next.js site. Show a visitor-facing page.
*   **Talk Track:** Introduce the end-user experience. Explain how headless architecture cleanly separates presentation from content while `siteConfig.ts` strictly enforces CIBC Mellon's brand governance (fonts, colors, layouts).
*   **Action [Live App Demo]:** Resize the browser window to demonstrate mobile-responsive Tailwind views. Use the `LanguageSwitcher` to instantly toggle between English and French.
*   **Talk Track:** Notice how the Next.js Proxy routing handles bilingual compliance and SEO clean URLs instantly, without a full page reload.
*   **Action [CMS Editor Demo]:** Switch tabs into the Optimizely CMS Visual Builder for the same page.
*   **Talk Track:** Now, look at the marketer experience. Show how a marketer builds a campaign page by dragging pre-built sections (Hero, Split) and blocks (Card, Compliance) onto the canvas. 
*   **Action [CMS Editor Demo]:** Click Preview. 
*   **Talk Track:** Show the `/preview` route. Marketers get real-time, high-fidelity previews of draft content rendered natively in the Next.js app before it goes live.

## 2. Customer Journey Mapping & Experience Optimization (10 min)
*Goal: Tell a story. Walk a specific persona through a content journey to show how the platform supports it end-to-end.*

*   **Talk Track:** Let's look at a specific journey: A **Pension Fund Manager** researching regulatory impacts.
*   **Action [Live App Demo]:** Navigate the "Pension Fund" journey: Hub page (Insights) → Individual Article → Related Content Sidebar → Gated PDF Download (Lead Capture Form).
*   **Action [CMS Editor Demo]:** Open the CMS properties for the article and show the custom Taxonomy fields.
*   **Talk Track:** Show how the marketer builds this journey mechanically. Content is tagged by **Intent** (Educate & Govern), **Persona** (Pension Fund), and **Service** (Regulatory). 
*   **Action [CMS Editor Demo]:** Open the DAM. Upload a new PDF. 
*   **Talk Track:** When a marketer uploads an asset, AI automatically tags it, instantly surfacing it in the relevant sidebar slots. We then attach a lead-capture form to gate the asset.

## 3. Personalization & Engagement Tools (10 min)
*Goal: The marketer differentiator. Prove the platform can recognize who is on the site and adapt without a developer.*

*   **Action [CMS Editor Demo / Web]:** Briefly show the Optimizely Web UI audience segmentation. Show the rule defining a "Pension Fund Manager".
*   **Talk Track:** Marketers can define audiences visually. We've assigned a specific CTA and Hero variant to this exact segment.
*   **Action [Live App Demo]:** Click through the live site to trigger a soft navigation, showing the personalized variant loading.
*   **Talk Track:** Notice there is no page flicker. Because `OptimizelyActivation` fires natively in the React app, experiments and targeting persist seamlessly across soft navigations. We've optimized the journey without breaking the Single Page Application experience.

## 4. Core Features and Capabilities (10 min)
*Goal: Broaden the capability story and transition from marketer empowerment to enterprise compliance.*

*   **Action [CMS Editor Demo]:** Inside a `Paragraph` block, invoke Opal AI.
*   **Talk Track:** Scale content creation safely. Opal AI can generate draft summaries, adjust tone, and auto-tag content to match your taxonomy.
*   **Action [CMS Editor Demo]:** Open the built-in Image Editor. Crop and resize a DAM asset.
*   **Talk Track:** Keep marketers in one tool. No need to open Photoshop for basic asset adjustments.
*   **Action [CMS Editor Demo]:** Open the Publishing Panel. Show Approval Workflows and Scheduling.
*   **Talk Track:** Content agility requires guardrails. Show how you can schedule a batch publish for a specific timezone, and more importantly, route a `ComplianceBlock` through a mandatory "second set of eyes" reviewer gate before it can go live. Show the Content History panel (Audit Trail).

## 5. Solution Architecture and Technology Stack (5 min)
*Goal: The Handoff. Now that marketing value is established, hand off to IT stakeholders to show how it's built.*

*   **Action [Architecture Argument]:** Display a decoupled architecture diagram (CMS → Graph → Next.js).
*   **Talk Track:** For the IT team: the backend and frontend are entirely decoupled. Optimizely CMS manages the structured data, Optimizely Graph serves it globally, and the Next.js app renders it.
*   **Action [Live App Demo]:** Bring up the raw GraphQL API response side-by-side with the rendered webpage.
*   **Talk Track:** This is true omnichannel and AEO (Artificial Engine Optimization). The exact same structured, machine-readable data powering the Next.js site can feed your mobile apps, partner portals, or AI LLMs without bespoke APIs.

## 6. Integration Capabilities (5 min)
*Goal: IT validates the ecosystem fit. (No live app demo — rely on diagrams).*

*   **Action [Architecture Argument]:** Display an API/Webhook ecosystem diagram.
*   **Talk Track:** Let's talk about the downstream stack. Because of the API-first model, the lead-capture form we showed in the Pension Fund journey passes structured payloads directly to your Next.js backend. From there, it's a standard API handshake to Microsoft Dynamics CRM, Salesforce Marketing Cloud, or Marketo. Graph acts as the single endpoint for content syndication.

## 7. Security and Ongoing Remediation (5 min)
*Goal: IT and Security stakeholders validate governance and risk posture.*

*   **Action [CMS Editor Demo]:** Open the Optimizely Admin Panel. Show User Access Management.
*   **Talk Track:** Show Role-Based Access Control (RBAC). You can ensure marketing interns cannot publish to the "Legal/Compliance" content tree. Highlight SSO and MFA capabilities.
*   **Action [CMS Editor Demo]:** Call back to the gated content form from Chapter 2. Show the access control layer on the asset itself.
*   **Talk Track:** Security isn't just about logins; it's about protecting IP. You can strictly control access to gated assets at the platform level.
*   **Action [Architecture Argument]:** Briefly mention accessibility.
*   **Talk Track:** The semantic markup rendered by our Next.js architecture inherently supports WCAG 2.0 Level AA compliance, which can be verified continuously via Lighthouse or axe-core.

## 8. Scalability (3 min)
*Goal: Final IT sign-off and close.*

*   **Action [Architecture Argument]:** Display a Global Edge Delivery / SaaS slide.
*   **Talk Track:** Finally, infrastructure. This is a fully managed SaaS architecture. No provisioning, no performance tuning. It relies on global CDN edge delivery with instant cache invalidation on publish. More importantly, this single CMS instance supports Multi-Site Management—meaning it can scale to host all future CIBC Mellon and BNY properties globally from this single hub.