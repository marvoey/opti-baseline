import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";
import { LINE_OF_BUSINESS, taxonomyEnums, labelFor } from "@/lib/cms/taxonomy";

export const PrgvGlobalComplianceDisclosureContentType = contentType({
  key: "prgv_GlobalComplianceDisclosure",
  baseType: "_component",
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  displayName: "[PRGV Block] Global Compliance Disclosure",
  description: "A specialized global compliance script managed by Legal.",
  properties: {
    DisclosureName: {
      type: "string",
      displayName: "Disclosure Name",
      isRequired: true,
    },
    EffectiveDate: {
      type: "dateTime",
      displayName: "Effective Date",
    },
    Jurisdiction: {
      type: "contentReference",
      displayName: "Jurisdiction",
    },
    LegalText: {
      type: "richText",
      displayName: "Legal Text",
      isRequired: true,
    },
    Category: {
      type: "contentReference",
      displayName: "Category",
      allowedTypes: ["PrgvCategory"],
    },
    LineOfBusiness: {
      type: "array",
      format: "selectMany",
      displayName: "Line of Business",
      description: "Which insurance products does this block apply to?",
      group: "Content",
      isRequired: true,
      items: {
        type: "string",
        enum: taxonomyEnums(LINE_OF_BUSINESS),
      },
    },
  },
});

type Props = { content: ContentProps<typeof PrgvGlobalComplianceDisclosureContentType> };

export default function PrgvGlobalComplianceDisclosure({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <div className="space-y-3 border-l-4 border-red-600 pl-4">
      <div className="flex items-center gap-3">
        <span {...pa("DisclosureName")} className="font-semibold text-gray-900">
          {content.DisclosureName}
        </span>
        {content.EffectiveDate && (
          <span className="text-xs text-gray-500">
            Effective: {new Date(content.EffectiveDate).toLocaleDateString()}
          </span>
        )}
      </div>
      {content.LineOfBusiness != null && content.LineOfBusiness.length > 0 && (
        <div {...pa("LineOfBusiness")} className="flex flex-wrap gap-1">
          {content.LineOfBusiness.map((lob: string) => (
            <span key={lob} className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              {labelFor(LINE_OF_BUSINESS, lob)}
            </span>
          ))}
        </div>
      )}
      <div {...pa("LegalText")} className="prose prose-sm max-w-none text-gray-700">
        <RichTextRenderer content={content.LegalText?.json} />
      </div>
    </div>
  );
}
