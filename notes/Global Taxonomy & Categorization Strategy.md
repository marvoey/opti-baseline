# Global Taxonomy & Categorization Strategy

This document outlines the structured taxonomy and categorization model designed for the Optimizely CMS Knowledge Base. It details the specific enumerations used for audience targeting, product lines, lifecycles, and regional compliance, as well as how they drive frontline content assembly.

---

## 1. Defined Enums: Target Audience (Roles)

To ensure content is routed to the correct users and to prevent search clutter, the `TargetAudience` property uses a strict multi-select list (Enum). This taxonomy is applied to all core content types.

### Frontline & Support Tags
Used to target customer-facing agents and operational support staff.
* **Tier 1 Service** (`tier1_service`)
* **Tier 2 Service** (`tier2_service`)
* **Tier 1 Claims Intake** (`tier1_claims`)
* **Tier 2 Claims Support** (`tier2_claims`)
* **Escalation Desk** (`escalation_desk`)
* **Retention** (`retention`)
* **Supervisor Queue** (`supervisor_queue`)
* **Agency Support** (`agency_support`)

### Operations & Governance Tags
Used to target internal IT, Knowledge Management (KM), and compliance teams.
* **Knowledge Authors** (`knowledge_authors`)
* **Content Approvers** (`content_approvers`)
* **Compliance Reviewers** (`compliance_reviewers`)
* **Operations Leads** (`operations_leads`)
* **KM & Content Ops** (`km_content_ops`)
* **Audit Support** (`audit_support`)
* **IT Partners** (`it_partners`)
* **Business Owners** (`business_owners`)

---

## 2. Other Global Taxonomies & Tags

### Products & Lines of Business (LOBs)
Managed via **Taxonomy as Content**. Editors create `[PRGV] Category` pages in a dedicated folder tree and link them to articles using a `ProductsLOBs` ContentReference field.
* **Auto**
* **Home / Property**
* **Multi-Product / Bundled**
* **Enterprise / General**

### Geographies / Jurisdictions
Used to drive state-specific compliance routing and conditional display logic. Handled via **Taxonomy as Content** to allow ongoing expansion.
* **All States / National**
* **Specific States** (e.g., NY, CA, FL, TX)

### Content Categories (Mapped to Content Types)
Instead of using a generic tag, the core nature of the document dictates its structural Content Type in the CMS:
* **Standard Procedure** -> `[PRGV] Knowledge Article`
* **Service Handling Guide** -> `[PRGV] Knowledge Article`
* **Compliance Matrix** -> `[PRGV] Compliance Disclosure Matrix`
* **Governance Standard** -> `[PRGV] Governance Operational Plan`
* **Program / Migration Plan** -> `[PRGV] Governance Operational Plan`

### Lifecycle Status (Mapped to Native CMS Workflow)
Custom status fields were removed to prevent "split-brain" discrepancies. Legacy statuses map directly to Optimizely's **Native Publishing Workflow**:
* **Draft** -> Native CMS *Draft*
* **Pending Review** -> Native CMS *Ready to Publish*
* **Approved / Active Execution** -> Native CMS *Published*
* **Archived / Retired** -> Native CMS *Expired* (Stop Publish)

---

## 3. Using "Frontline & Support" for Content Assembly

The **Frontline & Support** tags are the engine for dynamically assembling the right content for the right user. 

* **Targeted Delivery:** When a Tier 1 agent logs into the portal, the front-end application reads their profile and queries the CMS to assemble *only* the procedures and scripts tagged with `Tier 1`.
* **Reducing Clutter & Risk:** By filtering out Tier 2 or Escalation procedures, frontline agents are prevented from accidentally reading advanced override steps or unapproved scripts.
* **Dynamic Modularity:** Content assembly allows you to show a unified "Auto Claims" page, but dynamically inject state-specific compliance matrices (e.g., California Disclosures) based on these tags and user context.

---

## 4. Explaining "Operations & Governance" (And Why We Keep It)

While the front-end portal is currently **strictly for Frontline Agents**, the "Operations & Governance" tags have been kept in the schema to future-proof the CMS as an "All-in-One" system.

* **Single Source of Truth:** Documents like *Knowledge Article Standards* or *Migration Plans* do not belong in front of a call center agent, but they *do* belong in the Knowledge Base. 
* **Search Exclusion:** By explicitly tagging administrative documents with Operations tags (and omitting Frontline tags), the system's search engine can automatically hide these documents from standard agents.
* **Future Internal Hubs:** When the KM or Compliance teams log into the CMS, they can filter by their specific tags to see internal policies, audit matrices, and authoring guidelines without having to jump to a separate platform like SharePoint.
* **Audit Readiness:** Having a clear taxonomy makes it trivial to generate reports for regulators showing exactly which compliance documents apply to which internal review teams.

---

## 5. Developer Implementation (JSON Schemas)

The following JSON definitions are provided for developers to configure the taxonomy fields and models within the Optimizely CMS.

### A. Target Audience (Roles)
**Applies to:** `prgv_KnowledgeArticle`, `prgv_ComplianceDisclosureMatrix`, `prgv_GovernanceOperationalPlan`
**Approach:** Array with `selectMany` format (Multi-select Checkbox List)

```json
{
  "TargetAudience": {
    "Type": "array",
    "Format": "selectMany",
    "DisplayName": "Target Audience",
    "Description": "Roles the article applies to",
    "Group": "Content",
    "Items": {
      "Type": "string",
      "Enum": [
        { "DisplayName": "Tier 1 Service", "Value": "tier1_service" },
        { "DisplayName": "Tier 2 Service", "Value": "tier2_service" },
        { "DisplayName": "Tier 1 Claims Intake", "Value": "tier1_claims" },
        { "DisplayName": "Tier 2 Claims Support", "Value": "tier2_claims" },
        { "DisplayName": "Escalation Desk", "Value": "escalation_desk" },
        { "DisplayName": "Retention", "Value": "retention" },
        { "DisplayName": "Supervisor Queue", "Value": "supervisor_queue" },
        { "DisplayName": "Agency Support", "Value": "agency_support" },
        { "DisplayName": "Knowledge Authors", "Value": "knowledge_authors" },
        { "DisplayName": "Content Approvers", "Value": "content_approvers" },
        { "DisplayName": "Compliance Reviewers", "Value": "compliance_reviewers" },
        { "DisplayName": "Operations Leads", "Value": "operations_leads" },
        { "DisplayName": "KM & Content Ops", "Value": "km_content_ops" },
        { "DisplayName": "Audit Support", "Value": "audit_support" },
        { "DisplayName": "IT Partners", "Value": "it_partners" },
        { "DisplayName": "Business Owners", "Value": "business_owners" }
      ]
    }
  }
}
```

### B. Products & LOBs
**Applies to:** `prgv_KnowledgeArticle`, `prgv_ComplianceDisclosureMatrix`, `prgv_GovernanceOperationalPlan`
**Approach:** Array of Content References (Taxonomy as Content)

```json
{
  "ProductsLOBs": {
    "Type": "array",
    "DisplayName": "Products / LOBs",
    "Description": "Select the applicable products or LOBs from the Taxonomy tree.",
    "Group": "Taxonomy",
    "Items": {
      "Type": "contentReference"
    }
  }
}
```

### C. Geographies / Jurisdictions
**Applies to:** `prgv_KnowledgeArticle`, `prgv_ComplianceDisclosureMatrix`
**Approach:** Array of Content References (Taxonomy as Content)

```json
{
  "StateJurisdiction": {
    "Type": "array",
    "DisplayName": "State / Jurisdiction",
    "Description": "Select the applicable states or regions from the Taxonomy tree.",
    "Group": "Taxonomy",
    "Items": {
      "Type": "contentReference"
    }
  }
}
```

### D. The Taxonomy "Tag" Content Type
**Key:** `prgv_Category`
**Purpose:** To make the reference fields above work, developers need to provision this underlying base content type. Content Editors will use this type to actually build the folder tree of tags (e.g., creating a page for "Florida" or "Auto").

```json
{
  "Key": "prgv_Category",
  "DisplayName": "[PRGV] Category",
  "Description": "Used to build the hierarchical taxonomy tree (e.g., Products, LOBs, Regions).",
  "BaseType": "_page",
  "Properties": {
    "Title": {
      "Type": "string",
      "DisplayName": "Category Name",
      "Group": "Content",
      "IsRequired": true,
      "SortOrder": 10
    },
    "Description": {
      "Type": "string",
      "DisplayName": "Description",
      "Group": "Content",
      "SortOrder": 20
    }
  }
}
```

### E. Developer Note: Omitted Taxonomies
* **Lifecycle Status:** Do **not** create a custom property for this. Map legacy statuses directly to Optimizely's native `ContentVersion` states (Draft, Ready to Publish, Published) and use the native `StopPublish` date property for Archived/Retired content.
* **Content Categories (Procedure vs. Matrix):** Do **not** create a tag for this. The categorization is handled natively by the `ContentType` schema the author chooses when clicking "Create Content" (e.g., selecting `prgv_KnowledgeArticle` vs `prgv_ComplianceDisclosureMatrix`).