import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";
import { RULE_CATEGORY, SEVERITY_LEVEL, LINE_OF_BUSINESS, taxonomyEnums, labelFor } from "@/lib/cms/taxonomy";

export const PrgvHandlingNoteBlockContentType = contentType({
  key: "prgv_HandlingNoteBlock",
  baseType: "_component",
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  displayName: "[PRGV Block] Handling Note & Rule Block",
  description: "Atomic blocks for severity flags, escalation rules, and exceptions.",
  properties: {
    NoteContent: {
      type: "richText",
      displayName: "Note Content",
      isRequired: true,
    },
    SeverityLevel: {
      type: "string",
      displayName: "Severity Level",
      format: "selectOne",
      enum: taxonomyEnums(SEVERITY_LEVEL),
    },
    RuleCategory: {
      type: "string",
      displayName: "Rule Category",
      format: "selectOne",
      enum: taxonomyEnums(RULE_CATEGORY),
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

type Props = { content: ContentProps<typeof PrgvHandlingNoteBlockContentType> };

export default function PrgvHandlingNoteBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <div className="space-y-2 rounded border border-amber-300 bg-amber-50 p-3">
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {content.SeverityLevel != null && (
          <span {...pa("SeverityLevel")} className="rounded bg-amber-200 px-2 py-0.5 text-amber-800">
            {labelFor(SEVERITY_LEVEL, content.SeverityLevel)}
          </span>
        )}
        {content.RuleCategory != null && (
          <span {...pa("RuleCategory")} className="rounded bg-gray-200 px-2 py-0.5 text-gray-700">
            {labelFor(RULE_CATEGORY, content.RuleCategory)}
          </span>
        )}
        {content.LineOfBusiness != null && content.LineOfBusiness.map((lob: string) => (
          <span key={lob} className="rounded bg-blue-100 px-2 py-0.5 text-blue-800">
            {labelFor(LINE_OF_BUSINESS, lob)}
          </span>
        ))}
      </div>
      <div {...pa("NoteContent")} className="prose prose-sm max-w-none text-gray-800">
        <RichTextRenderer content={content.NoteContent?.json} />
      </div>
    </div>
  );
}
