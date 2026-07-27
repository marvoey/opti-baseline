import {
  contentType,
  displayTemplate,
  type ContentProps,
} from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";

export const HeroBlockContentType = contentType({
  key: "HeroBlockv2",
  baseType: "_component",
  displayName: "Hero Block v2 for CIBC",
  description: "Full-width hero with a background image and rich text overlay.",
  compositionBehaviors: ["sectionEnabled"],
  properties: {
    BackgroundImage: {
      type: "contentReference",
      displayName: "Background Image",
      allowedTypes: ["_image"],
      sortOrder: -2,
    },
    AltText: { type: "string", displayName: "Alt Text", isLocalized: false, sortOrder: 0, },
    Body: {
      type: "richText",
      displayName: "Body",
      isLocalized: true,
      indexingType: "searchable",
      sortOrder: -3,
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
    Persona: {
      type: "string",
      format: "selectOne",
      displayName: "Persona",
      isLocalized: false,
      indexingType: "queryable",
      group: "Taxonomy",
      sortOrder: 11,
      enum: [
        { value: "asset_manager",       displayName: "Asset Manager" },
        { value: "pension_fund",        displayName: "Pension Fund" },
        { value: "corporate_sponsor",   displayName: "Corporate Sponsor" },
        { value: "foreign_institution", displayName: "Foreign Institution" },
        { value: "insurance_provider",  displayName: "Insurance Provider" },
      ],
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
  },
});

export const HeroBlockDisplayTemplate = displayTemplate({
  key: "HeroBlockv2Default",
  isDefault: true,
  displayName: "Hero Block v2",
  contentType: "HeroBlockv2",
  settings: {
    theme: {
      editor: "select",
      displayName: "Theme",
      sortOrder: 0,
      choices: {
        default: { displayName: "Default", sortOrder: 1 },
        light: { displayName: "Light", sortOrder: 2 },
        dark: { displayName: "Dark", sortOrder: 3 },
      },
    },
  },
});

const THEME = {
  default: { overlay: "bg-black/50", prose: "prose-invert", text: "text-white" },
  light: { overlay: "bg-white/40", prose: "", text: "text-gray-900" },
  dark: { overlay: "bg-black/50", prose: "prose-invert", text: "text-white" },
} as const;

type Theme = keyof typeof THEME;

type Props = {
  content: ContentProps<typeof HeroBlockContentType>;
  displaySettings?: ContentProps<typeof HeroBlockDisplayTemplate>;
};

export default function HeroBlock({ content, displaySettings }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const themeKey = (displaySettings?.theme as unknown as Theme) ?? "default";
  const theme = THEME[themeKey] ?? THEME.default;
  const bgSrc = content.BackgroundImage ? src(content.BackgroundImage) : undefined;

  return (
    <section
      {...pa(content.__composition)}
      className="relative min-h-120 overflow-hidden"
    >
      {bgSrc ? (
        <img
          {...pa("BackgroundImage")}
          src={bgSrc}
          alt={(content.AltText as string | undefined) ?? ""}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={themeKey === "light" ? "/hero-bg-light.svg" : "/hero-bg-dark.svg"}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {theme.overlay && (
        <div
          className={`absolute inset-0 ${theme.overlay}`}
          aria-hidden="true"
        />
      )}
      <div className={`relative z-10 px-8 py-16 ${theme.text}`}>
        <div
          {...pa("Body")}
          className={`prose mx-auto max-w-3xl ${theme.prose}`}
        >
          <RichTextRenderer content={content.Body?.json} />
        </div>
      </div>
    </section>
  );
}
