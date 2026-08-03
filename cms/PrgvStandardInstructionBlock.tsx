import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";
import { TARGET_AUDIENCE, LINE_OF_BUSINESS, taxonomyEnums, labelFor } from "@/lib/cms/taxonomy";

export const PrgvStandardInstructionBlockContentType = contentType({
  key: "prgv_StandardInstructionBlock",
  baseType: "_component",
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  displayName: "[PRGV Block] Standard Instruction Block",
  description: "General step-by-step guidance for an operational procedure.",
  properties: {
    InstructionText: {
      type: "richText",
      displayName: "Instruction Text",
      isRequired: true,
    },
    TargetAudience: {
      type: "string",
      displayName: "Target Audience",
      format: "selectOne",
      enum: taxonomyEnums(TARGET_AUDIENCE),
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

type Props = { content: ContentProps<typeof PrgvStandardInstructionBlockContentType> };

export default function PrgvStandardInstructionBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <div className="space-y-2">
      {(content.TargetAudience != null || (content.LineOfBusiness != null && content.LineOfBusiness.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2">
          {content.TargetAudience != null && (
            <span {...pa("TargetAudience")} className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {labelFor(TARGET_AUDIENCE, content.TargetAudience)}
            </span>
          )}
          {content.LineOfBusiness != null && content.LineOfBusiness.map((lob: string) => (
            <span key={lob} {...pa("LineOfBusiness")} className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              {labelFor(LINE_OF_BUSINESS, lob)}
            </span>
          ))}
        </div>
      )}
      <div {...pa("InstructionText")} className="prose prose-sm max-w-none text-gray-800">
        <RichTextRenderer content={content.InstructionText?.json} />
      </div>
    </div>
  );
}
