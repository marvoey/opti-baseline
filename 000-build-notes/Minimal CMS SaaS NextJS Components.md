# Minimal SaaS CMS Demo Components (.tsx)

Below are the Next.js component files for the minimalist Living Spaces demo build. They are built using the `@optimizely/cms-sdk` and use `getPreviewUtils` to ensure full compatibility with On-Page Edit (OPE) inside the CMS SaaS Visual Builder. 

### 1. `PromoBannerBlock.tsx`
This block is used for the PLP Personalization demo. It renders a background image with a headline and subheadline.

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const PromoBannerBlockContentType = contentType({
  key: 'PromoBannerBlock',
  baseType: '_component',
  displayName: 'Promo Banner Block',
  description: 'Promotional banner with background image, headline, and subheadline.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Headline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Headline',
      description: 'Primary banner text',
      isRequired: true,
    },
    Subheadline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Subheadline',
      description: 'Secondary banner text',
      isRequired: false,
    },
    BackgroundImage: {
      type: 'contentReference',
      allowedTypes: ['_Image'],
      displayName: 'Background Image',
      isRequired: false,
    },
  },
});

type Props = { content: ContentProps<typeof PromoBannerBlockContentType> };

export default function PromoBannerBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  
  // Extract URL from the contentReference (assuming Graph expansion) or use fallback
  const bgImage = (content.BackgroundImage as any)?.url ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  return (
    <section
      {...pa(block)}
      className="relative w-full h-[350px] flex items-center justify-center overflow-hidden my-8 rounded-lg shadow-sm"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      <div className="relative z-20 text-center text-white p-6 max-w-2xl">
        <h2 {...pa('Headline')} className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
          {content.Headline ?? 'Special Promotion'}
        </h2>
        {content.Subheadline && (
          <p {...pa('Subheadline')} className="text-xl md:text-2xl font-light drop-shadow-md">
            {content.Subheadline}
          </p>
        )}
      </div>
    </section>
  );
}
```

### 2. `RichContentBlock.tsx`
This flexible block is used twice on the PDP—once for the "Assembly Required" disclaimer and once for the SEO/Enrichment section.

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const RichContentBlockContentType = contentType({
  key: 'RichContentBlock',
  baseType: '_component',
  displayName: 'Rich Content Block',
  description: 'Flexible rich text block for PDP Disclaimers and Content Enrichment.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ContentBody: {
      type: 'string',
      format: 'html', // Renders the Optimizely TinyMCE / Rich Text editor
      displayName: 'Content Body',
      description: 'Rich text content',
      isRequired: true,
    },
  },
});

type Props = { content: ContentProps<typeof RichContentBlockContentType> };

export default function RichContentBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)} className="prose max-w-none my-6 p-6 bg-[#f9f9f9] border border-gray-200 rounded-md shadow-sm">
      <div 
        {...pa('ContentBody')}
        // In a real application, you might use a library like HTML React Parser here 
        dangerouslySetInnerHTML={{ __html: content.ContentBody ?? '<p><em>Enter your content here...</em></p>' }}
      />
    </div>
  );
}
```

### 3. `BlogArticle.tsx`
While the canvas mentioned no frontend build is strictly needed for the Vendor Authoring workflow (since it can be shown entirely in the CMS UI), having the Next.js page structure complete helps if you want to click "Preview" during the demo.

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const BlogArticleContentType = contentType({
  key: 'BlogArticle',
  baseType: '_page',
  displayName: 'Blog Article',
  description: 'Blog article template for Vendor Content Authoring workflow.',
  properties: {
    Title: {
      type: 'string',
      format: 'shortString',
      displayName: 'Title',
      isRequired: true,
    },
    Body: {
      type: 'string',
      format: 'html',
      displayName: 'Body',
      isRequired: true,
    },
  },
});

type Props = { content: ContentProps<typeof BlogArticleContentType> };

export default function BlogArticle({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  
  return (
    <article className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-10 border-b pb-6">
        <h1 {...pa('Title')} className="text-4xl font-bold text-gray-900 mb-4">
          {content.Title ?? 'New Blog Post'}
        </h1>
        <p className="text-gray-500 text-sm">Vendor Content Preview</p>
      </header>
      <div 
        {...pa('Body')}
        className="prose prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: content.Body ?? '<p>Start writing your article here...</p>' }}
      />
    </article>
  );
}
```