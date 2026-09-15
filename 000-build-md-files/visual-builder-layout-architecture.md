# Visual Builder Layout Architecture & Intent-Driven Assembly

## Executive Summary
When setting up Optimizely CMS SaaS with the **Universal Component Library**, you **do not** need to author or configure a custom "Layout" content type. Visual Builder and the `@optimizely/cms-sdk` provide a native, recursive composition engine based on an outline-and-grid hierarchy. 

This document details:
1. The native Visual Builder node hierarchy.
2. How the Next.js baseline (`opti-baseline`) renders layouts automatically.
3. How to use Visual Builder Blueprints for pre-configured layouts.
4. How layout composition connects directly to **Point 5: Intent-Driven Assembly**.

---

## 1. Visual Builder Structural Hierarchy

Visual Builder separates layout structure from content data. Experiences and pages are stored as a tree of `CompositionNode` instances:

```
Outline (Experience / Page)        ───> Flat, ordered list of Sections (layoutType: "outline")
  └── Section (Grid Layout)         ───> Horizontal band (layoutType: "grid")
        └── Row                     ───> CompositionStructureNode (Structural container)
              └── Column            ───> CompositionStructureNode (Structural container)
                    └── Element     ───> CompositionComponentNode (Universal Primitives)
```

### Node Classifications
| Node Type | Node Class | Role in Visual Builder | Requires Schema Definition? |
|---|---|---|---|
| **Experience / Page** | `CompositionNode` | Routable top-level container (`layoutType: "outline"`). Stacks sections vertically. | **No** (Standard SDK type: `BlankExperienceContentType`) |
| **Section** | `CompositionStructureNode` | Horizontal band of content (`layoutType: "grid"`). Manages row/column grids. | **No** (Standard SDK type: `BlankSectionContentType`) |
| **Row** | `CompositionStructureNode` | Horizontal slice inside a section grid. Children are columns. `component` field is null. | **No** (Generated automatically by Visual Builder engine) |
| **Column** | `CompositionStructureNode` | Vertical slot inside a row. Children are component elements. `component` field is null. | **No** (Generated automatically by Visual Builder engine) |
| **Element / Component** | `CompositionComponentNode` | Terminal leaf node containing content data (e.g., `RichTextBlock`, `CardBlock`). | **Yes** (Defined with `baseType: '_component'`) |

---

## 2. Front-End Baseline Implementation (`opti-baseline`)

In the Next.js App Router codebase (`https://github.com/marvoey/opti-baseline`), layout handling is already built and fully wired up.

### Experience Level (`cms/BlankExperience.tsx`)
Consumes the top-level experience composition and delegates recursive rendering to the SDK:
```tsx
import { BlankExperienceContentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

export default function BlankExperience({ content }: Props) {
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.composition?.nodes ?? [];

  return (
    <main {...pa(content as any)}>
      <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />
    </main>
  );
}
```

### Section & Grid Level (`cms/BlankSection.tsx`)
Renders the grid hierarchy using custom row and column containers with live preview attributes:
```tsx
export default function BlankSection({ content }: Props) {
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.nodes ?? [];

  function SectionRow({ node, children }: StructureContainerProps) {
    return (
      <div {...pa(node)} className="flex gap-4 w-full">
        {children}
      </div>
    );
  }

  function SectionColumn({ node, children }: StructureContainerProps) {
    return (
      <div {...pa(node)} className="flex-1">
        {children}
      </div>
    );
  }

  return (
    <section {...pa(content as any)} className="w-full">
      <OptimizelyGridSection
        nodes={nodes}
        row={SectionRow}
        column={SectionColumn}
        ComponentWrapper={ComponentWrapper}
      />
    </section>
  );
}
```

### Live Preview Overlays (`cms/wrappers.tsx`)
Applies `pa(node)` so that clicking any section, row, column, or component inside Visual Builder highlights that specific element in the real-time preview:
```tsx
export function ComponentWrapper({ children, node }: ComponentContainerProps) {
  const { pa } = getPreviewUtils(node);
  return <div {...pa(node)}>{children}</div>;
}
```

---

## 3. Creating Reusable Layouts via Visual Builder Blueprints

Instead of developers hardcoding templates in code, content architects create reusable layouts directly in the CMS SaaS editor using **Blueprints**:

1. **Build the Layout Structure:**
   - In Visual Builder, add a `BlankSection`.
   - Add a Row and split it into the desired column ratio (e.g., 2 columns for a Hero Split, 3 or 4 columns for a Card Grid).
   - Drop placeholder primitives (`CardBlock`, `ProseBlock`, etc.) into the column slots.
2. **Apply Design Tokens / Styles:**
   - Use the Section / Column **Style Panel** to set background colors, padding, and alignments.
3. **Save as Blueprint:**
   - Click the Section or Row in the Outline panel.
   - Select **Save Blueprint** and name it (e.g., *"3-Column Intent Grid"*, *"Executive Hero Split"*).
4. **Reuse Across Experiences:**
   - Content authors and Opal AI agents can insert these pre-built blueprints into any experience with a single click.

---

## 4. Architectural Connection to Point 5: Intent-Driven Assembly

Understanding that layouts are simply **JSON trees of structural nodes (`rows`/`columns`) holding component leaf nodes** unlocks the full commercial narrative of Point 5:

### Traditional CMS vs. Intent-Driven Architecture

| Dimension | Traditional Visual Builder Use | Intent-Driven Assembly (Point 5) |
|---|---|---|
| **Layout Definition** | Fixed outline and grid tree. | Reusable structural grid (e.g., 3-column section blueprint). |
| **Slot Population** | Manually populated and hardcoded by an editor. | Dynamically populated at runtime or request time. |
| **Delivery Model** | Static page URL (`/solutions/cloud-security`). | Dynamic resolution based on visitor intent telemetry. |
| **Optimizely Graph Role** | Fetches the full pre-baked experience composition. | Queries matching component primitives by taxonomy (`Intent`, `Domain`, `Audience`) to hydrate slots. |

### The GraphQL Assembly Query Pattern
When delivering an experience dynamically, the front end can request the layout structure or query the primitives directly to populate designated slots:

```graphql
query AssembleIntentGrid(
  $intent: String = "compliance",
  $audience: String = "financial",
  $domain: String = "security"
) {
  # Query matching Card primitives to populate a 3-column layout grid
  CardBlock(
    where: {
      Intent: { eq: $intent }
      Audience: { eq: $audience }
      Domain: { eq: $domain }
    }
    limit: 3
  ) {
    items {
      _metadata { key displayName }
      Title
      Eyebrow
      Description
      Link { url { default } text }
    }
  }

  # Query matching Prose narrative for the lead slot
  RichTextBlock(
    where: {
      Intent: { eq: $intent }
      Domain: { eq: $domain }
    }
    limit: 1
  ) {
    items {
      _metadata { key }
      Body { json }
    }
  }
}
```

### Conclusion
You do not need to configure custom layout schemas. Your structural layout system (`BlankExperience`, `BlankSection`, Rows, Columns) is already operational in `opti-baseline`. Your only operational requirement is registering the **5 Universal Primitives** (`Prose`, `Card`, `Action`, `Media`, `Wayfinding`) so they can be dropped into these layout slots manually by editors or assembled deterministically by Optimizely Graph.
