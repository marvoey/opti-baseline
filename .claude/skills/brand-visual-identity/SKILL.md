---
name: brand-visual-identity
description: >-
  Optimizely Brand Visual Identity and UI Design Standards — color tokens,
  typography (VC Nudge / Die Grotesk B), corner radii ("Opal" squircle),
  buttons, Material Symbols icon config, and logo usage rules. Use whenever
  generating or reviewing HTML, CSS, Tailwind, or UI component code that must
  comply with Optimizely brand standards.
---

# Optimizely Brand Visual Identity & UI Design Standards

You are enforcing the **Optimizely Brand Visual Identity and UI Design
Standards**. When generating or reviewing UI code (HTML/CSS/Tailwind), apply
the design tokens, styling constraints, and compliance checks below exactly.
Any deviation is a brand violation.

---

## 1. Brand design tokens (the palette)

Use these hex codes for all color properties. Do not invent or use colors
outside this palette.

### A. Primary colors (the foundation)
Prioritize **Neutral 1** and **Neutral 3** as backdrops so the vibrant greens
pop.
* **LFGreen:** `#ABFF44` (vibrant green, the key brand signal)
* **Grass:** `#7DDD3D` (medium green)
* **Good-to-go:** `#3AB533` (dark green)
* **Neutral 1:** `#FFFFFF` (pure white, default background)
* **Neutral 3:** `#E4F0DA` (soft sage/off-white background)

### B. Secondary colors (core supporting)
* **Dark Fir:** `#08251A` (deep forest black/green; **must be used for all
  body text**)
* **Light Blue:** `#91DBDA` (accent sky blue)

### C. Tertiary colors (warmth & tactility)
* **Dark Blue:** `#007B79`
* **Light Fir:** `#197050`
* **Mid Fir:** `#0D3A29`
* **Light Pink:** `#FF99B6`
* **Dark Pink:** `#8F4764`
* **Neutral 2:** `#EFF6E9` (very soft light gray-green background)
* **Neutral 4:** `#D8E4CB`
* **Neutral 5:** `#C3CEAF`
* **Neutral 6:** `#A1AC8D`

---

## 2. Strict color usage & accessibility rules

### A. Approved color pairings (AAA compliance)
Restrict text-on-background combinations to these approved pairings:
* Dark Fir (`#08251A`) text on LFGreen (`#ABFF44`) background
* Dark Fir (`#08251A`) text on Light Blue (`#91DBDA`) background
* Dark Fir (`#08251A`) text on Neutral 3 (`#E4F0DA`) background
* Dark Fir (`#08251A`) text on Neutral 1 (`#FFFFFF`) background
* Dark Fir (`#08251A`) text on Neutral 2 (`#EFF6E9`) background
* Neutral 1 (`#FFFFFF`) text on Dark Fir (`#08251A`) background
* LFGreen (`#ABFF44`) text on Dark Fir (`#08251A`) background

### B. Color don'ts (strict violations)
* Never use two secondary colors together.
* Never use gradients of any kind (keep colors flat and solid).
* Never use primary colors (like LFGreen) as backgrounds for long body text.
* Never use any color other than Dark Fir (`#08251A`) for standard body text.
* Never overlay solid brand colors on photography without high-contrast
  treatments.
* Never use the same color over multiple sequential steps in stepper or flow
  indicators.
* Never invent unauthorized color pairings (e.g., pink text on green
  background).

---

## 3. Typography system

Dual-typeface system for different levels of expression: **Clear** (clean
structured info), **Playful** (engaging highlights), **Expressive** (high-impact
headings).

### A. The typefaces
1. **Headlines / display:** `VC Nudge` (SemiNormal ExtraBold and SemiBold)
2. **Body & UI labels:** `Die Grotesk B` (Medium and Regular)

### B. Typography stylesheet definitions (CSS)
Apply these rules exactly to heading and text styles:

```css
/* Typography Global Rules */
body {
  font-family: 'Die Grotesk B', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #08251A; /* Dark Fir is the mandatory body color */
  font-size: 16px;
  line-height: 24px;
}

/* Heading 1 - Bold and Chunkier */
h1, .h1-style {
  font-family: 'VC Nudge', sans-serif;
  font-weight: 800; /* ExtraBold */
  font-size: 48px;
  line-height: 48px;
  letter-spacing: -1px;
}

/* Heading 2 - Section Headers */
h2, .h2-style {
  font-family: 'VC Nudge', sans-serif;
  font-weight: 800; /* ExtraBold */
  font-size: 32px;
  line-height: 36px;
  letter-spacing: -0.5px;
}

/* Body Text - Regular weight */
p, .body-style {
  font-family: 'Die Grotesk B', sans-serif;
  font-weight: 400; /* Regular */
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
}

/* Captions / Small Text */
caption, .caption-style {
  font-family: 'Die Grotesk B', sans-serif;
  font-weight: 400; /* Regular */
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.5px;
}
```

---

## 4. UI element specifications

### A. Corner radii & smoothing (the "Opal pillow")
The brand uses smoothed rounded corners resembling the pillow shape of an
Opal (squircle).
* **Modules / cards:** corner radius of **`32px`** is the standard.
* **Corner smoothing:** standard corner smoothing must be set to **`70%`**
  when possible (iOS-like continuous curvature).
* **Buttons / small elements:** corner radius is **`8px`** (or full pill
  shape in playful expressions).

Because standard CSS `border-radius` creates an abrupt transition, simulate
the 70% smoothed opal shape using SVG clip-paths, continuous curve squircle
generators, or a clean CSS approximation:

```css
/* Custom utility for smoothed 32px corners (70% Smoothing) */
.opal-module {
  border-radius: 32px;
  /* Soft transition fallback or squircle shape */
  clip-path: paint(squircle); /* where supported, or use SVG clip-path */
}
```

### B. Buttons
* **Shape:** generous padding and rounded corners (`8px` radius) or
  pill-shape for a friendly, approachable feel.
* **Default state:** solid LFGreen (`#ABFF44`) background with Dark Fir
  (`#08251A`) text.
* **Layout:** adapt spacing dynamically — flex to accommodate left-aligned
  icons, or span full-width where modules require.
* **Padding:** generous padding is mandatory (e.g., `padding: 12px 24px` or
  `py-3 px-6` in Tailwind).

### C. Iconography
* **Library:** Google Material Symbols (Rounded family).
* **Weight:** `300` (mandatory to match the brand's chunkiness without being
  overly heavy).
* **Optical size:** `40dp` (default size for UI contexts).
* **Grade:** default or emphasis depending on container.
* **Interactive behavior:**
  * Inactive/default: outline style (`FILL` parameter = `0`).
  * Active/selected: filled style (`FILL` parameter = `1`).

```css
/* Google Material Symbols Style for Brand */
.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;

  /* Brand-specific Weight and Sizing */
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 40;
  transition: font-variation-settings 0.2s ease;
}

/* Filled state on active */
.material-symbols-rounded.active {
  font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 40;
}
```

---

## 5. Logo integration standards

### A. Size & limits
* **Minimum web size:** the logo must never be rendered below **`80px`** in
  width to preserve legibility of the stroke outline.
* **Icon-only fallback:** for small spaces (browser tabs, narrow mobile bars)
  where the full logo is too small, use the standard "O" pill icon instead.

### B. Clear space rules
* **The "l" width metric:** the safe clearance distance around all four sides
  of the logo must be at least the width of the letter 'l' in the Optimizely
  wordmark logo.

### C. Contrast & monochromatic usage
* **Primary logo:** green letters with dark outline. Use over light
  backgrounds like Neutral 1 (`#FFFFFF`) or Neutral 3 (`#E4F0DA`).
* **Monochromatic logo:** use the simplified white or black version on dark
  or complex backgrounds where the primary green logo's stroke lacks
  contrast.
* Never remove the outline of the primary logo.
* Never change the opacity or swap the colors of the logo.

---

## 6. HTML & Tailwind compliant grid (example code)

### A. Tailwind CSS configuration
If generating Tailwind-based code, configure theme colors and fonts as
follows:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          lfgreen: '#ABFF44',
          grass: '#7DDD3D',
          goodtogo: '#3AB533',
          darkfir: '#08251A',
          lightblue: '#91DBDA',
          neutral1: '#FFFFFF',
          neutral2: '#EFF6E9',
          neutral3: '#E4F0DA',
          neutral4: '#D8E4CB',
          neutral5: '#C3CEAF',
          neutral6: '#A1AC8D',
        }
      },
      fontFamily: {
        heading: ['VC Nudge', 'sans-serif'],
        body: ['Die Grotesk B', 'sans-serif'],
      }
    }
  }
}
```

### B. Fully compliant HTML & CSS component template
A compliant CTA banner module featuring correct colors, typography weights,
buttons, iconography, and 32px smoothed corner modules.

```html
<!-- Brand Standard Compliant Module -->
<div class="brand-card">
  <div class="brand-card-content">
    <div class="brand-tag">AI-Ready. Set. Go!</div>
    <h2 class="brand-h2">Turn your FML into LFG.</h2>
    <p class="brand-body">
      A harmonious experience brings warmth and a feeling of tactility to the brand.
      Use our selection of primary colors to prioritize clean, high-contrast layouts.
    </p>

    <!-- Dynamic CTA Button with left icon -->
    <button class="brand-btn">
      <span class="material-symbols-rounded">bolt</span>
      <span>Start Growing</span>
    </button>
  </div>
</div>

<style>
/* Associated CSS Styles conforming to Brand Guidelines */
.brand-card {
  background-color: #E4F0DA; /* Neutral 3 backdrop */
  border-radius: 32px; /* 32px Opal Corner Radii */
  padding: 40px;
  max-width: 480px;
  border: 1px solid #C3CEAF; /* Neutral 5 border for subtle touch */
  box-shadow: none; /* Keep designs flat, avoid heavy drop shadows */
}

.brand-card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand-tag {
  font-family: 'Die Grotesk B', sans-serif;
  font-weight: 500; /* Medium for UI Labels */
  font-size: 14px;
  color: #197050; /* Light Fir accent for tag */
  text-transform: uppercase;
  letter-spacing: 1px;
}

.brand-h2 {
  font-family: 'VC Nudge', sans-serif;
  font-weight: 800; /* ExtraBold */
  font-size: 32px;
  line-height: 36px;
  letter-spacing: -0.5px;
  color: #08251A; /* Mandatory Dark Fir body/heading text */
  margin: 0;
}

.brand-body {
  font-family: 'Die Grotesk B', sans-serif;
  font-weight: 400; /* Regular */
  font-size: 16px;
  line-height: 24px;
  color: #08251A; /* Mandatory Dark Fir text */
  margin: 0 0 8px 0;
}

.brand-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #ABFF44; /* Solid LFGreen Primary Button */
  color: #08251A; /* Dark Fir text for contrast */
  font-family: 'Die Grotesk B', sans-serif;
  font-weight: 500; /* Medium weight for buttons */
  font-size: 16px;
  padding: 12px 24px; /* Generous padding */
  border: none;
  border-radius: 8px; /* 8px Corner Radius for Button */
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  width: fit-content;
}

.brand-btn:hover {
  background-color: #7DDD3D; /* Hover fallback to Grass color */
}

.brand-btn:active {
  transform: scale(0.98);
}

/* Custom Icon override to support Material Symbols */
.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  line-height: 1;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 40;
}

/* Set icon to active (filled) on hover */
.brand-btn:hover .material-symbols-rounded {
  font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 40;
}
</style>
```

---

## 7. Automated quality assurance checklist

Before outputting any code, test the generation against this checklist:

1. **Background & text contrast:** is the background Neutral 1 (`#FFFFFF`),
   Neutral 3 (`#E4F0DA`), or Neutral 2 (`#EFF6E9`)? If yes, is body text
   Dark Fir (`#08251A`)?
2. **Headers:** are headers `font-family: 'VC Nudge'` with weight ExtraBold
   (`800`)? Are tracking values `-1px` (H1) and `-0.5px` (H2)?
3. **Corners:** are module/card containers exactly `border-radius: 32px`?
   Are buttons `border-radius: 8px`?
4. **No gradients:** scan output CSS for `linear-gradient`/`radial-gradient`.
   If found, replace with solid brand tokens.
5. **Icon configuration:** are Material Symbols configured with exactly
   `wght: 300`? Does the active state set `FILL` to `1`?
6. **Logo minimum size:** if the logo is implemented, does it have
   `min-width: 80px` or explicit width scaling starting at `80px`?
