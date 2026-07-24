import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";

export const ComplianceBlockContentType = contentType({
  key: "ComplianceBlock",
  baseType: "_component",
  displayName: "Compliance Block",
  description:
    "Legally mandated text. Content is governed — the AI assembly engine may not populate this inline; it must reference a pre-approved item.",
  compositionBehaviors: ["elementEnabled"],
  properties: {
    Jurisdiction: {
      type: "string",
      displayName: "Jurisdiction",
      isLocalized: false,
      indexingType: "disabled",
    },
    Body: {
      type: "richText",
      displayName: "Body",
      isLocalized: true,
      indexingType: "searchable",
    },
    Intent: {
      type: "string",
      format: "selectOne",
      displayName: "Intent",
      isLocalized: false,
      indexingType: "queryable",
      group: "Taxonomy",
      sortOrder: 10,
      enum: [
        { value: "discover_recommend", displayName: "Discover / Recommend" },
        { value: "educate_govern", displayName: "Educate / Govern" },
        { value: "simulate_transact", displayName: "Simulate / Transact" },
      ],
    },
    Persona: {
      type: "string",
      format: "selectOne",
      displayName: "Persona",
      isLocalized: false,
      indexingType: "queryable",
      group: "Taxonomy",
      sortOrder: 11,
      enum: [
        { value: "asset_manager", displayName: "Asset Manager" },
        { value: "pension_fund", displayName: "Pension Fund" },
        { value: "corporate_sponsor", displayName: "Corporate Sponsor" },
        { value: "foreign_institution", displayName: "Foreign Institution" },
        { value: "insurance_provider", displayName: "Insurance Provider" },
      ],
    },
    Service: {
      type: "array",
      format: "selectMany",
      displayName: "Service",
      group: "Taxonomy",
      sortOrder: 12,
      items: {
        type: "string",
        enum: [
          { value: "fund_administration",     displayName: "Fund Administration" },
          { value: "foreign_exchange",        displayName: "Foreign Exchange" },
          { value: "treasury_services",       displayName: "Treasury Services" },
          { value: "etf_services",            displayName: "ETF Services" },
          { value: "alternative_investments", displayName: "Alternative Investments" },
          { value: "securities_lending",      displayName: "Securities Lending" },
          { value: "global_custody",          displayName: "Global Custody" },
          { value: "recordkeeping",           displayName: "Recordkeeping" },
          { value: "esg",                     displayName: "ESG" },
          { value: "regulatory",              displayName: "Regulatory" },
          { value: "tax",                     displayName: "Tax" },
          { value: "digital_assets",          displayName: "Digital Assets" },
          { value: "onboarding",              displayName: "Onboarding" },
          { value: "compliance",              displayName: "Compliance" },
        ],
      },
    },
    Geo: {
      type: "string",
      format: "selectOne",
      displayName: "Geo",
      isLocalized: false,
      indexingType: "queryable",
      group: "Taxonomy",
      sortOrder: 13,
      enum: [
        { value: "canada",        displayName: "Canada" },
        { value: "europe",        displayName: "Europe" },
        { value: "united_states", displayName: "United States" },
        { value: "global",        displayName: "Global" },
      ],
    },
  },
});

type Props = {
  content: ContentProps<typeof ComplianceBlockContentType>;
};

export default function ComplianceBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <div
      {...pa(content.__composition)}
      className="rounded border border-amber-300 bg-amber-50 px-5 py-4 dark:border-amber-700 dark:bg-amber-950"
    >
      {content.Jurisdiction && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          {content.Jurisdiction as string}
        </p>
      )}
      <div {...pa("Body")} className="prose prose-sm prose-amber">
        <RichTextRenderer content={content.Body?.json} />
      </div>
    </div>
  );
}
