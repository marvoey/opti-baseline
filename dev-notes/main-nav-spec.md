# Main Navigation — Component & CMS Specification

**Version:** 1.0  
**Status:** Ready for development  
**Covers:** CMS content model · TypeScript types · Component API · Behaviour · Accessibility · Security

---

## Table of contents

1. [Overview](#1-overview)
2. [CMS content model](#2-cms-content-model)
3. [TypeScript types](#3-typescript-types)
4. [JSON config example](#4-json-config-example)
5. [React component API](#5-react-component-api)
6. [Behaviour specification](#6-behaviour-specification)
7. [Accessibility requirements](#7-accessibility-requirements)
8. [Security requirements](#8-security-requirements)
9. [Out of scope](#9-out-of-scope)

---

## 1. Overview

A data-driven top navigation bar whose structure is entirely controlled by a CMS. Editors can add or remove top-level links, create dropdown menus, choose dropdown layout (single column, two columns, three columns, or mega-menu with featured card), and promote a featured item into any dropdown — all without a code deploy.

**Rendering rules at a glance**

| Config state | Component renders |
|---|---|
| `children` is empty | Plain link (no dropdown) |
| `children` is non-empty, `columnLayout: "single"` | Single-column dropdown list |
| `children` is non-empty, `columnLayout: "cols2"` | Two-column dropdown grid |
| `children` is non-empty, `columnLayout: "cols3"` | Three-column dropdown grid |
| `children` is non-empty, `columnLayout: "mega"` | Mega-menu: links left, featured card right |
| `featuredItem` present | Adds promotional card slot (only meaningful on `mega`) |
| `url` is `null` | Item acts as a trigger only; no anchor element is rendered |

---

## 2. CMS content model

### 2.1 `NavigationConfig` (singleton)

One record per site and locale. This is the root object fetched by the component.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier, e.g. `main-nav` |
| `label` | `string` | Yes | Human-readable name for CMS editors |
| `locale` | `string` | Yes | BCP 47 locale code, e.g. `en-US` |
| `items` | `NavItem[]` | Yes | Ordered list of top-level nav items |

### 2.2 `NavItem` (reusable content type)

Recursive. Both top-level entries and their dropdown children use this same type.

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `id` | `string` | Yes | — | Unique. Used as React key and `aria-controls` target. |
| `label` | `string` | Yes | — | Display text. Keep under ~20 characters. |
| `url` | `string \| null` | Yes | — | Set to `null` for parent-only items that open a dropdown but have no page of their own. |
| `openInNewTab` | `boolean` | No | `false` | Renders `target="_blank" rel="noreferrer noopener"` when `true`. |
| `icon` | `string \| null` | No | `null` | Icon slug from the project's icon library (e.g. Tabler: `"chart-bar"`). Displayed in dropdown link rows only, not in the top bar. |
| `description` | `string \| null` | No | `null` | Short subtitle rendered under the label in dropdown rows. Recommended max 60 characters. |
| `columnLayout` | `"single" \| "cols2" \| "cols3" \| "mega"` | No | `"single"` | Controls how `children` are laid out. Ignored on leaf nodes (items with no children). |
| `featuredItem` | `FeaturedNavCard \| null` | No | `null` | Promotional card. Meaningful only when `columnLayout` is `"mega"`. |
| `visibilityRules` | `VisibilityRule[] \| null` | No | `null` | Optional display conditions. See section 2.4. |
| `children` | `NavItem[]` | Yes | `[]` | Ordered child items. Empty array = leaf node. |

> **Nesting depth:** The component supports a maximum of **two levels** (top-level items + one level of children). Deeper nesting is not rendered.

### 2.3 `FeaturedNavCard`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier |
| `tag` | `string \| null` | No | Short eyebrow label, e.g. `"NEW"`, `"WEBINAR"` |
| `heading` | `string` | Yes | Card title. Max 60 characters. |
| `description` | `string \| null` | No | Supporting copy. Max 120 characters. |
| `imageUrl` | `string \| null` | No | Absolute URL to card image. Recommended size: 400×200px. |
| `imageAlt` | `string` | Only if `imageUrl` set | Alt text for the image. |
| `url` | `string` | Yes | Destination URL on click. |
| `ctaLabel` | `string` | Yes | Link label, e.g. `"Read the guide"`. |

### 2.4 `VisibilityRule`

| Field | Type | Notes |
|---|---|---|
| `condition` | `"authenticated" \| "role"` | `"authenticated"` shows the item only to logged-in users. `"role"` additionally checks the role list. |
| `roles` | `string[]` | Required when `condition` is `"role"`. Items with unmatched roles are hidden client-side. |

> **Security note:** Visibility rules control rendering only. They are **not** a substitute for server-side access control. Any protected route must enforce auth on the server regardless of nav visibility.

---

## 3. TypeScript types

Copy these into a shared types file (e.g. `src/types/navigation.ts`).

```typescript
export type ColumnLayout = "single" | "cols2" | "cols3" | "mega";

export type VisibilityCondition = "authenticated" | "role";

export interface VisibilityRule {
  condition: VisibilityCondition;
  roles?: string[];
}

export interface FeaturedNavCard {
  id: string;
  tag?: string | null;
  heading: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string;
  url: string;
  ctaLabel: string;
}

export interface NavItem {
  id: string;
  label: string;
  url: string | null;
  openInNewTab?: boolean;
  icon?: string | null;
  description?: string | null;
  columnLayout?: ColumnLayout;
  featuredItem?: FeaturedNavCard | null;
  visibilityRules?: VisibilityRule[] | null;
  children: NavItem[];
}

export interface NavigationConfig {
  id: string;
  label: string;
  locale: string;
  items: NavItem[];
}
```

---

## 4. JSON config example

This is the shape the component's `config` prop expects. The CMS API should return this structure.

```json
{
  "id": "main-nav",
  "locale": "en-US",
  "label": "Main navigation",
  "items": [
    {
      "id": "products",
      "label": "Products",
      "url": null,
      "columnLayout": "mega",
      "featuredItem": {
        "id": "feat-ai",
        "tag": "NEW",
        "heading": "AI-powered insights",
        "description": "Automatically surface winning variants from your experiments.",
        "imageUrl": "https://cdn.example.com/nav/ai-card.png",
        "imageAlt": "Abstract illustration of data visualisation",
        "url": "/blog/ai-insights",
        "ctaLabel": "Read the guide"
      },
      "children": [
        {
          "id": "analytics",
          "label": "Analytics",
          "description": "Real-time data insights",
          "url": "/products/analytics",
          "icon": "chart-bar",
          "openInNewTab": false,
          "children": []
        },
        {
          "id": "experimentation",
          "label": "Experimentation",
          "description": "A/B and multivariate tests",
          "url": "/products/experimentation",
          "icon": "flask",
          "openInNewTab": false,
          "children": []
        }
      ]
    },
    {
      "id": "solutions",
      "label": "Solutions",
      "url": null,
      "columnLayout": "cols2",
      "children": [
        {
          "id": "sol-engineering",
          "label": "Engineering",
          "url": "/solutions/engineering",
          "icon": "code",
          "children": []
        },
        {
          "id": "sol-product",
          "label": "Product",
          "url": "/solutions/product",
          "icon": "chart-pie",
          "children": []
        }
      ]
    },
    {
      "id": "pricing",
      "label": "Pricing",
      "url": "/pricing",
      "children": []
    }
  ]
}
```

---

## 5. React component API

### 5.1 Component signature

```typescript
interface MainNavProps {
  /** Navigation structure from CMS */
  config: NavigationConfig;

  /**
   * Optional: logo element rendered on the left.
   * Accepts any valid React node (image, SVG, text).
   */
  logo?: React.ReactNode;

  /**
   * Optional: slot for CTA button(s) on the right.
   * Renders after nav items, before the end of the bar.
   */
  actions?: React.ReactNode;

  /**
   * Optional: currently authenticated user.
   * Used to evaluate VisibilityRules. If omitted, all
   * "authenticated" and "role" rules evaluate to hidden.
   */
  currentUser?: {
    isAuthenticated: boolean;
    roles?: string[];
  } | null;

  /** Optional: class name applied to the outer <nav> element */
  className?: string;
}

export function MainNav(props: MainNavProps): JSX.Element;
```

### 5.2 Data fetching

The component is **presentational only** — it does not fetch its own data. Data fetching is the responsibility of the parent (page, layout, or server component).

```typescript
// Example: Next.js App Router layout
import { getNavConfig } from "@/lib/cms";
import { MainNav } from "@/components/MainNav";

export default async function RootLayout({ children }) {
  const navConfig = await getNavConfig("main-nav", "en-US");
  return (
    <html>
      <body>
        <MainNav config={navConfig} logo={<Logo />} actions={<GetStartedButton />} />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### 5.3 URL validation

Before rendering any href, the component must validate URLs to prevent injection. Implement a `isSafeUrl` helper:

```typescript
// src/components/MainNav/utils.ts
const ALLOWED_PROTOCOLS = ["https:", "http:"];

export function isSafeUrl(raw: string | null): boolean {
  if (!raw) return false;
  try {
    const url = new URL(raw, window.location.origin);
    return ALLOWED_PROTOCOLS.includes(url.protocol);
  } catch {
    // Relative paths like /pricing are safe; they throw on URL constructor
    return raw.startsWith("/") && !raw.startsWith("//");
  }
}
```

Use `isSafeUrl` on every `url` field before passing it to an `href`. If it returns `false`, render the item as a `<span>` instead of an `<a>` and log a warning.

---

## 6. Behaviour specification

### 6.1 Opening and closing

| Trigger | Action |
|---|---|
| Click on a nav item that has children | Toggle its dropdown open/closed |
| Click anywhere outside the nav | Close all open dropdowns |
| Hover over a different nav item while a dropdown is already open | Swap to the new dropdown (do not close first) |
| `Escape` key | Close the active dropdown and return focus to its trigger |

**No hover-to-open** — dropdowns open on click only. This ensures touch device compatibility and avoids accidental openings.

### 6.2 Active state

The trigger button for the currently open dropdown receives:
- CSS class `is-active` (for styling)
- `aria-expanded="true"`
- The chevron icon rotates 180°

### 6.3 Dropdown positioning

Dropdowns are positioned `absolute`, anchored to the bottom of their trigger. On viewports where the dropdown would overflow the right edge of the viewport, flip the dropdown to align its right edge with the trigger's right edge instead.

### 6.4 Mobile / responsive

At breakpoints below `768px`:
- The desktop nav bar is replaced with a hamburger menu button
- Tapping the button opens a full-width slide-in drawer
- Each item with children becomes an accordion section in the drawer
- All dropdown types (single, cols2, cols3, mega) render as a single stacked list inside the drawer
- The `featuredItem` card is hidden on mobile to reduce scroll depth

### 6.5 Visibility rules evaluation

```
function isItemVisible(item: NavItem, currentUser): boolean {
  if (!item.visibilityRules || item.visibilityRules.length === 0) return true;

  return item.visibilityRules.every(rule => {
    if (rule.condition === "authenticated") {
      return currentUser?.isAuthenticated === true;
    }
    if (rule.condition === "role") {
      return rule.roles?.some(r => currentUser?.roles?.includes(r)) ?? false;
    }
    return true;
  });
}
```

Items that fail visibility evaluation are **not rendered to the DOM** (not just hidden with CSS).

---

## 7. Accessibility requirements

These are non-negotiable and must pass before merge.

### 7.1 Roles and ARIA

```html
<!-- Outer wrapper -->
<nav aria-label="Main">

  <!-- Top-level list -->
  <ul role="list">

    <!-- Item with dropdown -->
    <li>
      <button
        aria-haspopup="true"
        aria-expanded="false"           <!-- true when open -->
        aria-controls="dropdown-products"
      >
        Products
      </button>

      <div
        id="dropdown-products"
        role="menu"
      >
        <a role="menuitem" href="/products/analytics">Analytics</a>
      </div>
    </li>

    <!-- Plain link -->
    <li>
      <a href="/pricing">Pricing</a>
    </li>

  </ul>
</nav>
```

### 7.2 Keyboard navigation

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus through all interactive elements in DOM order |
| `Enter` / `Space` on trigger | Opens dropdown |
| `Escape` | Closes open dropdown, returns focus to trigger |
| `Arrow Down` | When dropdown is open, moves focus to first `menuitem` |
| `Arrow Up` / `Arrow Down` | Moves focus between `menuitem` elements within an open dropdown |
| `Home` / `End` | Moves focus to first / last `menuitem` |

### 7.3 Focus management

- Dropdown triggers must be focusable and activated by keyboard
- When a dropdown closes via `Escape`, focus returns to the trigger that opened it
- Focus must never be trapped inside the nav

### 7.4 Reduced motion

Chevron rotation and any open/close transitions must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .nav-chevron,
  .dropdown {
    transition: none;
  }
}
```

### 7.5 Images

All `<img>` elements inside `FeaturedNavCard` must have a non-empty `alt` attribute matching the `imageAlt` field. If `imageAlt` is absent or empty, omit the `<img>` element.

---

## 8. Security requirements

### 8.1 URL sanitisation (critical)

Every `url` field from the CMS must be passed through `isSafeUrl` (defined in section 5.3) before being used as an `href`. This prevents `javascript:` and `data:` URI injection from a compromised CMS record.

### 8.2 Content rendering

- Nav labels and descriptions from the CMS must be rendered as **text nodes** — never with `dangerouslySetInnerHTML` or equivalent
- Image URLs must come only from trusted, allowlisted CDN domains; validate against a `NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS` environment variable (or equivalent) before rendering

### 8.3 External links

Any item with `openInNewTab: true` must render with **both** `rel="noreferrer noopener"` to prevent tab-napping:

```tsx
{item.openInNewTab && (
  <a href={href} target="_blank" rel="noreferrer noopener">
    {item.label}
  </a>
)}
```

### 8.4 Visibility rules are client-side only

As noted in section 2.4, visibility rules control rendering only. **Never rely on nav visibility to protect data or routes.** All access control must be enforced server-side.

### 8.5 CMS API response validation

Before passing the CMS response to the component, validate it against the `NavigationConfig` schema (e.g. with Zod). Do not render an unvalidated API response.

```typescript
import { z } from "zod";

const NavItemSchema: z.ZodType<NavItem> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    url: z.string().nullable(),
    openInNewTab: z.boolean().optional(),
    icon: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    columnLayout: z.enum(["single", "cols2", "cols3", "mega"]).optional(),
    featuredItem: FeaturedNavCardSchema.nullable().optional(),
    visibilityRules: z.array(VisibilityRuleSchema).nullable().optional(),
    children: z.array(z.lazy(() => NavItemSchema)),
  })
);

const NavigationConfigSchema = z.object({
  id: z.string(),
  label: z.string(),
  locale: z.string(),
  items: z.array(NavItemSchema),
});
```

---

## 9. Out of scope

The following are explicitly **not** part of this component's responsibility:

- Fetching nav data from the CMS (handled by calling code)
- Authentication / session management (handled by auth layer)
- Route-level access control (handled by server middleware)
- Analytics / click tracking (attach externally via event delegation on `<nav>`)
- Search bar integration (pass as part of the `actions` slot)
- Multi-level nesting beyond two levels
