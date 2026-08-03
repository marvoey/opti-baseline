import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";
import { LINE_OF_BUSINESS, US_JURISDICTION, taxonomyEnums, labelFor } from "@/lib/cms/taxonomy";

export const PrgvScriptingBlockContentType = contentType({
  key: "prgv_ScriptingBlock",
  baseType: "_component",
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  displayName: "[PRGV Block] Scripting Block",
  description: "Verbatim language the agent must read out loud.",
  properties: {
    VerbatimScript: {
      type: "richText",
      displayName: "Verbatim Script",
      isRequired: true,
    },
    LineOfBusiness: {
      type: "array",
      format: "selectMany",
      displayName: "Line of Business",
      description: "Which insurance products does this block apply to?",
      group: "Taxonomy",
      items: {
        type: "string",
        enum: taxonomyEnums(LINE_OF_BUSINESS),
      },
    },
    ApplicableState: {
      type: "string",
      displayName: "Applicable State",
      format: "selectOne",
      enum: taxonomyEnums(US_JURISDICTION),
      group: "Taxonomy",
    },
    Category: {
      type: "contentReference",
      displayName: "Category",
      allowedTypes: ["PrgvCategory"],
      group: "Taxonomy",
    },
  },
});

type Props = { content: ContentProps<typeof PrgvScriptingBlockContentType> };

export default function PrgvScriptingBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <div className="space-y-2 rounded border border-blue-300 bg-blue-50 p-3">
      {(content.ApplicableState != null || (content.LineOfBusiness != null && content.LineOfBusiness.length > 0)) && (
        <div className="flex flex-wrap gap-1">
          {content.ApplicableState != null && (
            <span {...pa("ApplicableState")} className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              {labelFor(US_JURISDICTION, content.ApplicableState)}
            </span>
          )}
          {content.LineOfBusiness != null && content.LineOfBusiness.map((lob: string) => (
            <span key={lob} className="rounded bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-900">
              {labelFor(LINE_OF_BUSINESS, lob)}
            </span>
          ))}
        </div>
      )}
      <div {...pa("VerbatimScript")} className="prose prose-sm max-w-none font-medium text-gray-900">
        <RichTextRenderer content={content.VerbatimScript?.json} />
      </div>
    </div>
  );
}
