import { contentType, type ContentProps } from "@optimizely/cms-sdk";
import { getPreviewUtils } from "@optimizely/cms-sdk/react/server";
import { RichText as RichTextRenderer } from "@optimizely/cms-sdk/react/richText";
import { taxonomyEnums, INTENT, PERSONA, SERVICE, GEO } from "@/lib/cms/taxonomy";

export const CardBlockContentType = contentType({
  key: "CardBlock",
  baseType: "_component",
  displayName: "[CIBC] Card Block",
  description:
    "Standardized card container for a single entity — product, account, article, or SKU.",
  compositionBehaviors: ["elementEnabled"],
  properties: {
    Title: {
      type: "string",
      displayName: "Title",
      isLocalized: true,
      indexingType: "searchable",
    },
    Body: {
      type: "richText",
      displayName: "Body",
      isLocalized: true,
      indexingType: "searchable",
    },
    Link: { type: "url", displayName: "Link", isLocalized: false },
    Intent:  { type: "string", format: "selectOne",  displayName: "Intent",  isLocalized: false, indexingType: "queryable", group: "Taxonomy", sortOrder: 10, enum: taxonomyEnums(INTENT) },
    Persona: { type: "string", format: "selectOne",  displayName: "Persona", isLocalized: false, indexingType: "queryable", group: "Taxonomy", sortOrder: 11, enum: taxonomyEnums(PERSONA) },
    Service: { type: "array",  format: "selectMany", displayName: "Service",                                                group: "Taxonomy", sortOrder: 12, items: { type: "string", enum: taxonomyEnums(SERVICE) } },
    Geo:     { type: "string", format: "selectOne",  displayName: "Geo",     isLocalized: false, indexingType: "queryable", group: "Taxonomy", sortOrder: 13, enum: taxonomyEnums(GEO) },
  },
});

type Props = {
  content: ContentProps<typeof CardBlockContentType>;
};

export default function CardBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <div
      {...pa(content.__composition)}
      className="rounded border border-neutral-200 bg-white px-5 py-4 dark:border-neutral-700 dark:bg-neutral-900"
    >
      {content.Title && (
        <h3 {...pa("Title")} className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
          {content.Title}
        </h3>
      )}
      {content.Body && (
        <div {...pa("Body")} className="prose prose-sm text-neutral-600 dark:text-neutral-400">
          <RichTextRenderer content={content.Body?.json} />
        </div>
      )}
      {content.Link?.default && (
        <a
          {...pa("Link")}
          href={content.Link.default}
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Learn more →
        </a>
      )}
    </div>
  );
}
