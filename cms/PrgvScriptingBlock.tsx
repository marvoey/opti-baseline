import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";
import { LINE_OF_BUSINESS, taxonomyEnums, labelFor } from "@/lib/cms/taxonomy";

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
    ApplicableState: {
      type: "contentReference",
      displayName: "Applicable State",
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

type Props = { content: ContentProps<typeof PrgvScriptingBlockContentType> };

export default function PrgvScriptingBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <div className="space-y-2 rounded border border-blue-300 bg-blue-50 p-3">
      {content.LineOfBusiness != null && content.LineOfBusiness.length > 0 && (
        <div {...pa("LineOfBusiness")} className="flex flex-wrap gap-1">
          {content.LineOfBusiness.map((lob: string) => (
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
