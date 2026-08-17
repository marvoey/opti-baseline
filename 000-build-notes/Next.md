# Next.js Hardcoded Wiring & Required Pages

For this minimal demo, we are prioritizing speed and impact. Instead of building a fully dynamic production-ready Next.js architecture, we will use "hardcoded wiring."

## What "Hardcoded Wiring" Means

In a **production-ready** Next.js application, the architecture is dynamic. If a user visits `/products/voyage-60-desk`, Next.js reads the URL, sends a GraphQL query asking Optimizely Graph, *"Do you have any content for this URL?"*, and dynamically renders whatever comes back. Building this dynamic routing engine takes time. 

For a **minimal demo**, we use **"hardcoded wiring."** This means you build static Next.js pages for just the 2 or 3 URLs you plan to click on during the demo. Instead of asking Optimizely Graph what to load based on the URL, you hardcode the exact CMS Content IDs into the page's GraphQL query. 

It is the equivalent of building a Hollywood movie set: it looks perfectly real to the audience (the client sees the CMS updating the Next.js site), but behind the scenes, you bypassed the complex dynamic routing logic to save hours of development.

---

## The Pages You Need to Build

Assuming you are using the Next.js App Router (`/app` directory), you only need to build **three specific pages**:

### 1. The PDP Page (`app/products/voyage-60-computer-desk/page.tsx`)
*   **What it does:** Renders a static layout of the desk (fake price, title, image). 
*   **The Wiring:** At the top of the file, you write a GraphQL query that explicitly asks Optimizely Graph for Content ID `101` (your Disclaimer block) and Content ID `102` (your Enrichment block). 
*   **Demo value:** When you change the text of Block 101 in the CMS and publish, Next.js fetches the new text for ID `101` and updates the page. The client sees the content change instantly.

### 2. The PLP Page (`app/categories/home-office-desks/page.tsx`)
*   **What it does:** Renders a static grid of 4 or 5 desk images.
*   **The Wiring:** You hardcode a GraphQL query fetching Content ID `103` (your `PromoBannerBlock`). You place this component right above your fake product grid.
*   **Demo value:** You can use Optimizely Personalization in the CMS to swap out the image for ID `103` based on the user's device. Next.js just blindly renders whatever the CMS passes back for ID `103`.

### 3. The Homepage (`app/page.tsx`)
*   **What it does:** The main landing page of Living Spaces.
*   **The Wiring:** Implement the standard Next.js Preview route (`/api/draft`). Hardcode a query fetching Content ID `104` (a hero banner).
*   **Demo value:** This page is used to demonstrate **Content Scheduling** and **Page Preview**. You don't need any complex logic; you just show that scheduling Block 104 to publish on Friday works natively through Optimizely Graph's timestamp capabilities.

---

## Example of "Hardcoded Wiring" Code

Here is a pseudo-code example of what the PDP route (`app/products/voyage-60-computer-desk/page.tsx`) looks like. Notice how we just ask for a specific ID, rather than using dynamic parameters:

```tsx
import RichContentBlock from '@/components/RichContentBlock';

// 1. HARDCODED GraphQL Query
const query = `
  query GetMyDemoBlocks {
    Disclaimer: _Content(where: { _metadata: { _id: { eq: "101" } } }) {
      items {
        ... on RichContentBlock {
          ContentBody
        }
      }
    }
  }
`;

export default async function VoyageDeskPDP() {
  // 2. Fetch the data directly for ID 101
  const data = await fetchOptimizelyGraph(query);
  const disclaimerData = data.Disclaimer.items[0];

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold">Voyage 60" Computer Desk</h1>
      <p className="text-xl my-4">Price: $499.00</p>
      
      <button className="bg-blue-600 text-white px-6 py-2 rounded">
        Add to Cart
      </button>

      {/* 3. Inject the CMS data into your Next.js component */}
      <div className="mt-8">
         <RichContentBlock content={disclaimerData} />
      </div>

      {/* Static fake product image */}
      <div className="mt-8 bg-gray-200 h-64 flex items-center justify-center">
        <span>Product Image Placeholder</span>
      </div>
    </main>
  );
}
```