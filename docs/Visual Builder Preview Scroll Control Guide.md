# Controlling Visual Builder Preview Auto-Scrolling in Optimizely CMS (SaaS)

## Overview
In Optimizely CMS (SaaS), the Visual Builder live preview uses the `communicationinjector.js` script inside your frontend preview `<iframe>` to synchronize the editor UI with the rendered DOM. By default, hovering over or editing a property in the right-hand panel triggers automatic scrolling in the preview window.

Because `communicationinjector.js` runs inside your frontend application, you can control, customize, or disable this scrolling behavior directly in your Next.js / React preview setup.

---

## Comparison of Approaches

| Approach | Stops Scroll on Hover | Scrolls on Property Selection | Keeps Property Overlays | Keeps Block/Section Outline Selection |
|---|---|---|---|---|
| **Option 1: Scroll Only on Selection** | Yes | Yes (Centered & Smooth) | Yes | Yes |
| **Option 2: Disable All Auto-Scrolling** | Yes | No | Yes | Yes |
| **Option 3: Omit `data-epi-edit` Attributes** | Yes (for properties) | No (for properties) | No (Block-level only) | Yes |
| **Option 4: Capture-Phase `postMessage` Filter** | Yes | Configurable | Configurable | Yes |

---

## Option 1: Scroll Only When a Property Is Selected (Recommended)

This approach intercepts `postMessage` events from the Visual Builder parent frame, suppresses scroll calls during `hover` / `highlight` events, and triggers a smooth, centered scroll only when an editor actively selects (`select` / `focus` / `edit` / `click`) a property or block.

```tsx
// components/cms/VisualBuilderScrollHandler.tsx
'use client';

import { useEffect } from 'react';

export default function VisualBuilderScrollHandler() {
  useEffect(() => {
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const originalScrollTo = window.scrollTo;

    // Flag indicating whether the current tick is a hover event from CMS
    let isCmsHover = false;

    // 1. Capture messages sent from the Visual Builder parent window
    const handleCmsMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || !event.data) return;

      const data = event.data;
      const action = (data.action || data.type || data.event || '').toLowerCase();
      const propertyName = data.propertyName || data.property || data.name;
      const blockId = data.blockId || data.contentLink || data.id;

      const isHoverEvent =
        action.includes('hover') ||
        action.includes('highlight') ||
        action.includes('mouseenter');

      const isSelectEvent =
        action.includes('select') ||
        action.includes('focus') ||
        action.includes('edit') ||
        action.includes('click');

      if (isHoverEvent) {
        // Mark as hover tick to block automatic scroll
        isCmsHover = true;
        requestAnimationFrame(() => {
          isCmsHover = false;
        });
      } else if (isSelectEvent) {
        // Explicitly scroll smoothly to the selected element
        isCmsHover = false;

        let target: HTMLElement | null = null;
        if (propertyName) {
          target = document.querySelector(`[data-epi-edit="${propertyName}"]`);
        }
        if (!target && blockId) {
          target = document.querySelector(`[data-epi-block-id="${blockId}"]`);
        }

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      }
    };

    // 2. Intercept native scroll calls during hover ticks
    Element.prototype.scrollIntoView = function (arg?: boolean | ScrollIntoViewOptions) {
      if (isCmsHover) {
        return; // Suppress hover scroll
      }
      return originalScrollIntoView.call(this, arg);
    };

    window.scrollTo = function (...args: any[]) {
      if (isCmsHover) {
        return;
      }
      return (originalScrollTo as any).apply(window, args);
    };

    // Use capture: true so we receive the message before communicationinjector.js
    window.addEventListener('message', handleCmsMessage, true);

    return () => {
      window.removeEventListener('message', handleCmsMessage, true);
      Element.prototype.scrollIntoView = originalScrollIntoView;
      window.scrollTo = originalScrollTo;
    };
  }, []);

  return null;
}
```

### Sticky Header CSS Adjustment
To prevent sticky headers or navigation bars from overlapping the selected element after scrolling, add `scroll-margin-top` in your global CSS:

```css
[data-epi-edit],
[data-epi-block-id] {
  scroll-margin-top: 80px;
}
```

---

## Option 2: Disable All Preview Auto-Scrolling (Keep Overlays Active)

If you want to keep all property highlight overlays and click-to-edit functionality intact, but completely stop the preview viewport from auto-scrolling on both hover and selection:

```tsx
// components/cms/DisablePreviewAutoScroll.tsx
'use client';

import { useEffect } from 'react';

export default function DisablePreviewAutoScroll() {
  useEffect(() => {
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const originalScrollTo = window.scrollTo;
    let isHandlingCmsMessage = false;

    // 1. Track when the iframe is processing a postMessage from the CMS parent window
    const onMessageCapture = (event: MessageEvent) => {
      if (event.source === window.parent) {
        isHandlingCmsMessage = true;
        requestAnimationFrame(() => {
          isHandlingCmsMessage = false;
        });
      }
    };

    window.addEventListener('message', onMessageCapture, true);

    // 2. Prevent scrollIntoView on CMS-annotated elements (or during CMS message handling)
    Element.prototype.scrollIntoView = function (arg?: boolean | ScrollIntoViewOptions) {
      if (
        isHandlingCmsMessage ||
        this.hasAttribute?.('data-epi-edit') ||
        this.hasAttribute?.('data-epi-block-id') ||
        this.closest?.('[data-epi-edit], [data-epi-block-id]')
      ) {
        return;
      }
      return originalScrollIntoView.call(this, arg);
    };

    // 3. Prevent window.scrollTo jumps triggered by communicationinjector.js
    window.scrollTo = function (...args: any[]) {
      if (isHandlingCmsMessage) {
        return;
      }
      return (originalScrollTo as any).apply(window, args);
    };

    return () => {
      window.removeEventListener('message', onMessageCapture, true);
      Element.prototype.scrollIntoView = originalScrollIntoView;
      window.scrollTo = originalScrollTo;
    };
  }, []);

  return null;
}
```

---

## Option 3: Omit `data-epi-edit` on Properties (Keep Block Selection Only)

Visual Builder relies on two attributes in the preview DOM:
* `data-epi-block-id`: Identifies sections, rows, columns, and shared/inline blocks for the Outline tree.
* `data-epi-edit`: Identifies individual property DOM elements (e.g., `data-epi-edit="heading"`).

If your editors edit fields in the right-hand panel and do not need individual property-level click overlays on the canvas:
1. Keep `data-epi-block-id={id}` on your Section, Row, Column, and Component wrapper elements.
2. **Stop rendering `data-epi-edit`** on individual property elements.

Without `data-epi-edit` in the DOM, hovering over a property in the edit panel has no matching property node in the iframe to scroll to, while selecting sections and components in the Visual Builder Outline still works normally.

---

## Option 4: Intercept Hover `postMessage` Events Before `communicationinjector.js`

If you want to prevent `communicationinjector.js` from ever receiving hover messages from the Visual Builder UI:

```tsx
// components/cms/FilterCmsHoverMessages.tsx
'use client';

import { useEffect } from 'react';

export default function FilterCmsHoverMessages() {
  useEffect(() => {
    const onMessageCapture = (event: MessageEvent) => {
      if (event.source !== window.parent || !event.data) return;

      const action = (
        event.data.action ||
        event.data.type ||
        event.data.event ||
        ''
      ).toLowerCase();

      // Always allow contentSaved and selection events through; block hover events
      if (action.includes('hover') || action.includes('mouseenter')) {
        event.stopImmediatePropagation();
      }
    };

    // Register in capture phase so it runs before communicationinjector.js
    window.addEventListener('message', onMessageCapture, true);

    return () => {
      window.removeEventListener('message', onMessageCapture, true);
    };
  }, []);

  return null;
}
```

---

## Where to Mount in Next.js (App Router)

Render your chosen handler in your preview route (e.g., `app/preview/page.tsx` or draft layout) alongside `communicationinjector.js` when `ctx === 'edit'`:

```tsx
import Script from 'next/script';
import VisualBuilderScrollHandler from '@/components/cms/VisualBuilderScrollHandler';

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ ctx?: string; preview_token?: string }>;
}) {
  const { ctx } = await searchParams;
  const isEditMode = ctx === 'edit';

  return (
    <>
      {isEditMode && (
        <>
          <VisualBuilderScrollHandler />
          <Script
            src={`${process.env.NEXT_PUBLIC_CMS_URL}/util/javascript/communicationinjector.js`}
            strategy="afterInteractive"
          />
        </>
      )}
      {/* Render your page / experience content here */}
    </>
  );
}
```

---

## References
* [Enable live preview - Optimizely CMS (SaaS) Documentation](https://docs.developers.optimizely.com/content-management-system/v1.0.0-CMS-SaaS/docs/enable-live-preview-saas)
