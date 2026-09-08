# Optimizely CMS (SaaS) — Content Model & Front-End Assembly Specification

## 1. Design Principles & Goals

This architecture is designed to be **lightweight to configure in CMS SaaS**, **intuitive for editorial teams**, and **simple to implement in front-end frameworks (Next.js / React / Remix)**.

It fulfills the core editorial narrative:
> *"One global knowledge team maintains a single structured content model, reuses shared compliance policies where identical, branches operational instructions where journeys diverge (Peacock direct vs. NOW partner billing), and delivers structured JSON via Optimizely Graph edge CDN to any branded frontend, search engine, or AI agent."*

---

## 2. Content Model Hierarchy (Minimal & Modular)

We define **1 Page / Container Content Type** and **4 Modular Component Block Types**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Page Content Type: HelpArticle                                           │
│    • articleId (UUID)                 • topicFamilyId ("help-payment-update") │
│    • proposition ("peacock"|"now"|..) • legacySalesforceId ("ka04W...")     │
│    • title (String)                   • summary (RichText / String)         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. Composition Slots (ContentArea & ContentReference)                       │
│    ├── Slot A: mainContent [StepGroupBlock, PartnerCardGridBlock]           │
│    ├── Slot B: sharedNoticeRef -> SharedNoticeBlock (Central Assets)        │
│    └── Slot C: faqContent [FaqAccordionBlock]                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Content Types & Properties

### 3.1 Root Page Type: `HelpArticle`

The primary editorial record in CMS SaaS.

| Property Name | System Type | Localized | Purpose & Front-End Mapping |
|---|---|---|---|
| `articleId` | `String` (Read-only) | No | Permanent unique identifier. Emitted directly to `window.adobeDataLayer.article.id`. |
| `topicFamilyId` | `String` (Indexed) | No | Cross-proposition key (e.g. `help-payment-update`) grouping Peacock and NOW articles. |
| `legacySalesforceId` | `String` | No | Salesforce Knowledge ID (e.g. `ka04W0000018abcQAA`) for 301 redirect generation. |
| `proposition` | `Choice` (`peacock`, `now`, `wow`, `skyshowtime`) | No | Scopes delivery and drives brand theme loading in the front-end. |
| `intentCategory` | `Choice` | No | Semantic intent taxonomy (e.g. `billing.payment_method_change`). |
| `title` | `String` | Yes | Article heading (H1). |
| `summary` | `RichText` | Yes | Lead paragraph summary. |
| `mainContent` | `ContentArea` | Yes | Assembled body blocks (`StepGroupBlock`, `PartnerCardGridBlock`). |
| `sharedNoticeRef` | `ContentReference` | No | Pointer to reusable `SharedNoticeBlock` stored in the Global Shared Folder. |
| `faqContent` | `ContentArea` | Yes | Expandable accordion items (`FaqAccordionBlock`). |

---

### 3.2 Block 1: `StepGroupBlock` (Ordered Instruction Steps)

Renders numbered instruction flows without raw HTML markup or layout drift.

| Property Name | System Type | Localized | Purpose |
|---|---|---|---|
| `groupHeading` | `String` | Yes | Optional sub-heading (e.g. *"Updating Payment on Web"*). |
| `layoutStyle` | `Choice` (`numbered_list`, `tabbed_subviews`) | No | Controls whether steps render as stacked cards or sub-tabs (e.g. Card vs PayPal). |
| `steps` | `PropertyList<InstructionItem>` | Yes | Inline array of steps (Title, Body text, Optional deep-link URL). |

**Inner Item Schema (`InstructionItem`):**
* `stepNumber` (`Integer`)
* `stepTitle` (`String`)
* `stepBody` (`RichText`)
* `ctaUrl` (`LinkItem` — optional deep-link)

---

### 3.3 Block 2: `PartnerCardGridBlock` (Conditional 3rd-Party Billing)

Renders partner portal cards (e.g., EE TV, Apple, TalkTalk, Amazon for NOW UK).

| Property Name | System Type | Localized | Purpose |
|---|---|---|---|
| `sectionTitle` | `String` | Yes | Section header (e.g. *"Billed through a Partner?"*). |
| `partners` | `PropertyList<PartnerCardItem>` | Yes | Array of partner cards. |

**Inner Item Schema (`PartnerCardItem`):**
* `partnerName` (`String` — e.g. "EE TV", "Apple Subscriptions")
* `badgeText` (`String` — e.g. "Partner Bundle", "In-App")
* `guidanceNote` (`String` — specific instructions for this provider)
* `portalUrl` (`LinkItem` — external management URL)

---

### 3.4 Block 3: `SharedNoticeBlock` (Reusable Compliance Disclaimer)

Stored in `Sites/Shared/Disclaimers/` and referenced by multiple articles.

| Property Name | System Type | Localized | Purpose |
|---|---|---|---|
| `noticeId` | `String` (Unique) | No | Identifier (e.g. `block-bank-updater-01`). |
| `noticeType` | `Choice` (`info`, `warning`, `policy`) | No | Visual style trigger in front-end. |
| `heading` | `String` | Yes | Disclaimer heading (e.g. *"Automatic Bank Card Updates"*). |
| `body` | `RichText` | Yes | Approved regulatory copy regarding automatic bank updates & next billing cycle charges. |

---

### 3.5 Block 4: `FaqAccordionBlock` (Collapsible Q&A)

| Property Name | System Type | Localized | Purpose |
|---|---|---|---|
| `question` | `String` | Yes | Accordion trigger question. |
| `answer` | `RichText` | Yes | Collapsible answer with supported payment methods list. |

---

## 4. Front-End Component Assembly Pattern (Next.js / React)

From a front-end engineering perspective, this content model maps cleanly to a **dynamic component registry**. No complex JSON parsing or custom middleware is required.

### 4.1 Component Registry (`ComponentMap.tsx`)

```tsx
import StepGroup from '@/components/blocks/StepGroup';
import PartnerCardGrid from '@/components/blocks/PartnerCardGrid';
import FaqAccordion from '@/components/blocks/FaqAccordion';

export const ComponentMap: Record<string, React.FC<any>> = {
  StepGroupBlock: StepGroup,
  PartnerCardGridBlock: PartnerCardGrid,
  FaqAccordionBlock: FaqAccordion,
};

// Generic Slot Renderer
export function BlockAreaRenderer({ blocks, brandTheme }: { blocks: any[]; brandTheme: string }) {
  if (!blocks || blocks.length === 0) return null;
  
  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        const Component = ComponentMap[block.__typename];
        if (!Component) return null;
        return <Component key={block.id || idx} {...block} brandTheme={brandTheme} />;
      })}
    </div>
  );
}
```

---

### 4.2 Single Help Article Page Wrapper (`HelpArticlePage.tsx`)

```tsx
export default function HelpArticlePage({ article }: { article: HelpArticleData }) {
  const brandTheme = article.proposition; // 'peacock' | 'now'

  return (
    <div className={`theme-${brandTheme} max-w-4xl mx-auto px-4 py-8`}>
      {/* Breadcrumb & Identity */}
      <nav className="breadcrumb text-sm mb-4">
        <span>Help Center</span> &gt; <span>Managing Account</span> &gt; <span>Billing</span>
      </nav>

      {/* Header */}
      <h1 className="article-title text-3xl font-bold mb-4">{article.title}</h1>
      
      {/* Lead Summary */}
      <div className="article-summary lead p-4 rounded-xl mb-6">
        {article.summary}
      </div>

      {/* Main Assembly Slot (Steps, Partner Cards) */}
      <BlockAreaRenderer blocks={article.mainContent} brandTheme={brandTheme} />

      {/* Shared Policy Notice (Reference Block) */}
      {article.sharedNoticeRef && (
        <aside className="policy-notice p-4 rounded-xl my-6">
          <h4 className="font-bold">{article.sharedNoticeRef.heading}</h4>
          <p>{article.sharedNoticeRef.body}</p>
        </aside>
      )}

      {/* FAQs Slot */}
      {article.faqContent?.length > 0 && (
        <section className="faq-section mt-8">
          <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
          <BlockAreaRenderer blocks={article.faqContent} brandTheme={brandTheme} />
        </section>
      )}

      {/* Analytics Hook (Adobe Analytics) */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.adobeDataLayer = window.adobeDataLayer || [];
          window.adobeDataLayer.push({
            event: 'articleView',
            article: {
              articleId: '${article.articleId}',
              topicFamilyId: '${article.topicFamilyId}',
              proposition: '${article.proposition}'
            }
          });
        `
      }} />
    </div>
  );
}
```

---

## 5. Optimizely Graph GraphQL Query

A single clean GraphQL query retrieves the full assembled article with resolved shared blocks and dimensions:

```graphql
query GetHelpArticle($topicFamilyId: String!, $proposition: String!, $locale: String!) {
  HelpArticle(
    where: {
      topicFamilyId: { eq: $topicFamilyId }
      proposition: { in: [$proposition, "shared"] }
      _locale: { eq: $locale }
    }
  ) {
    articleId
    topicFamilyId
    legacySalesforceId
    proposition
    title
    summary

    # Assembled Main Content Slot
    mainContent {
      ... on StepGroupBlock {
        __typename
        groupHeading
        layoutStyle
        steps {
          stepNumber
          stepTitle
          stepBody
          ctaUrl { url }
        }
      }
      ... on PartnerCardGridBlock {
        __typename
        sectionTitle
        partners {
          partnerName
          badgeText
          guidanceNote
          portalUrl { url }
        }
      }
    }

    # Shared Reusable Component Reference
    sharedNoticeRef {
      ... on SharedNoticeBlock {
        noticeId
        noticeType
        heading
        body
      }
    }

    # FAQ Accordions
    faqContent {
      ... on FaqAccordionBlock {
        __typename
        question
        answer
      }
    }
  }
}
```

---

## 6. End-to-End Live Editorial Walkthrough (30-Minute Script)

This content model directly powers the live 30-minute demonstration flow:

| Time | Live Action in CMS SaaS & Opal | What the Audience Sees on Frontends | RFI Requirement Proven |
|---|---|---|---|
| **0:00 - 0:05** | Open `HelpArticle` in CMS SaaS. Edit the `title` and add a step in `StepGroupBlock`. | **Peacock (Dark/Neon)** and **NOW (Teal)** frontends hot-reload simultaneously with new copy. | **CMS-011, CMS-012, CMS-001** (No-code authoring, canonical single store). |
| **0:05 - 0:09** | Inspect `PartnerCardGridBlock` on NOW. Show it is active on NOW but omitted on Peacock. | NOW renders EE TV, Apple, TalkTalk cards; Peacock remains clean direct account flow. | **CMS-096, CMS-038** (Proposition variation & third-party billing branches). |
| **0:09 - 0:14** | Open **Opal Copilot**: *"Refine step 1 in plain language preserving all URLs"*. Translate to Italian with locked glossary. | Opal diff preview; accepted into draft. Target locale renders in Italian with currency token (`€6.99/mese`). | **CMS-051, CMS-054, CMS-059** (Governed AI & glossary-locked translation). |
| **0:14 - 0:19** | Author attempts direct publish $\rightarrow$ **Blocked by Policy**. Global Approver logs in, reviews visual diff, approves & schedules. Rollback test. | 4-eye workflow enforcement, zero publish loopholes, instant 1-click rollback. | **CMS-031, CMS-112, CMS-120** (Governance, RBAC, separation of duties). |
| **0:19 - 0:25** | Inspect Optimizely Graph GraphQL response. Trace single payload to Web UI, Chatbot context, and Adobe Analytics. | Clean JSON payload feeds Help Web, AI Chatbot citations without scraping, and emits stable IDs to Adobe. | **CMS-101, CMS-103, CMS-081** (Multichannel API delivery & analytics continuity). |
| **0:25 - 0:30** | Display Salesforce Knowledge source record alongside migrated CMS SaaS article. | Legacy URL redirect matrix (`301 Active`) and Salesforce ID lineage verified. | **CMS-116, CMS-117, CMS-008** (Salesforce migration and URL authority preservation). |
