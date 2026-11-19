/**
 * Renders structured data (schema.org JSON-LD) as a <script> tag.
 *
 * JSON.stringify does not escape "<", so a value containing "</script>" could break out of
 * the tag. Replacing "<" with its unicode escape keeps the JSON valid and the page safe
 * (the approach recommended in the Next.js JSON-LD guide).
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
