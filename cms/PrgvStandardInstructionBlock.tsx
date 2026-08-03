import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";
import { TARGET_AUDIENCE, LINE_OF_BUSINESS, US_JURISDICTION, taxonomyEnums, labelFor } from "@/lib/cms/taxonomy";

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
    TargetAudience: {
      type: "string",
      displayName: "Target Audience",
      format: "selectOne",
      enum: taxonomyEnums(TARGET_AUDIENCE),
      group: "Taxonomy",
    },
  },
});

type Props = { content: ContentProps<typeof PrgvStandardInstructionBlockContentType> };

export default function PrgvStandardInstructionBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <div className="space-y-2">
      {(content.TargetAudience != null || content.ApplicableState != null || (content.LineOfBusiness != null && content.LineOfBusiness.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2">
          {content.TargetAudience != null && (
            <span {...pa("TargetAudience")} className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {labelFor(TARGET_AUDIENCE, content.TargetAudience)}
            </span>
          )}
          {content.ApplicableState != null && (
            <span {...pa("ApplicableState")} className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              {labelFor(US_JURISDICTION, content.ApplicableState)}
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
