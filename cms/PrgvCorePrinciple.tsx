import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";

export const PrgvCorePrincipleContentType = contentType({
  key: "PrgvCorePrinciple",
  baseType: "_component",
  compositionBehaviors: ["sectionEnabled", "elementEnabled"],
  displayName: "Progressive: Core Principle",
  description:
    "What it is: The universal truth of a policy that applies across all states unless overridden. Compliance role: Provides baseline coverage logic without forcing authors to rewrite it 50 times.",
  properties: {
    InternalName: {
      type: "string",
      displayName: "Internal Name",
      isRequired: true,
      sortOrder: 10,
    },
    LOB: {
      type: "string",
      displayName: "Line of Business",
      isRequired: true,
      sortOrder: 20,
      format: "selectOne",
      enum: [
        { value: "Homeowners", displayName: "Homeowners" },
        { value: "Personal Auto", displayName: "Personal Auto" },
        { value: "Commercial Auto", displayName: "Commercial Auto" },
      ],
    },
    Topic: {
      type: "string",
      displayName: "Topic / Peril",
      isRequired: true,
      sortOrder: 30,
      format: "selectOne",
      enum: [
        { value: "Hail/Storm Damage", displayName: "Hail / Storm Damage" },
        { value: "Water Damage", displayName: "Water Damage" },
        { value: "Roadside Assistance", displayName: "Roadside Assistance" },
        { value: "Glass Claim", displayName: "Glass Claim" },
        { value: "Liability", displayName: "Liability" },
        { value: "Rideshare Coverage", displayName: "Rideshare Coverage" },
      ],
    },
    RichTextValue: {
      type: "richText",
      displayName: "Content",
      isLocalized: true,
      isRequired: true,
      sortOrder: 50,
    },
  },
});

type Props = { content: ContentProps<typeof PrgvCorePrincipleContentType> };

export default function PrgvCorePrinciple({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <div className="space-y-3">
      <h4 {...pa("InternalName")} className="font-bold text-gray-900">
        {content.InternalName}
      </h4>
      <div {...pa("RichTextValue")} className="prose prose-sm max-w-none text-gray-700">
        <RichTextRenderer content={content.RichTextValue?.json} />
      </div>
    </div>
  );
}
