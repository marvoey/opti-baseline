'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  CheckCircle2,
  Play,
  Maximize2,
  MessageSquare,
  ListChecks,
  ArrowRight
} from 'lucide-react';

// ============================================================================
// OPTIMIZELY BRAND PACK TOKENS (Strictly No Gradients, Dark Fir #08251A Strokes)
// ============================================================================
const BRAND = {
  lfGreen: '#ABFF44',
  grass: '#7DDD3D',
  goodToGo: '#3AB533',
  neutral1: '#FFFFFF',
  neutral2: '#EFF6E9',
  neutral3: '#E4F0DA',
  lightBlue: '#91DBDA',
  darkFir: '#08251A',
  extrusion: ['#ABFF44', '#40A142', '#2E8C45', '#166E49', '#0D593E']
};

// Upwards 5-layer Extrusion Headline Component (Optimizely Brand Pack Spec)
const UpwardsExtrusionText = ({ text, sizeClass = 'text-5xl' }: { text: string; sizeClass?: string }) => {
  const layers = [
    { color: '#0D593E', offset: 12 }, // Step 5: Extrusion 8
    { color: '#166E49', offset: 9 },  // Step 4: Extrusion 6
    { color: '#2E8C45', offset: 6 },  // Step 3: Extrusion 4
    { color: '#40A142', offset: 3 },  // Step 2: Extrusion 3
    { color: '#ABFF44', offset: 0 }   // Step 1 (Front): Extrusion 1
  ];

  return (
    <span className="relative inline-block select-none mr-3 mb-2" style={{ paddingBottom: '12px', paddingLeft: '12px' }}>
      {layers.map((layer, idx) => {
        const isFront = idx === layers.length - 1;
        return (
          <span
            key={idx}
            aria-hidden={!isFront}
            className={`${isFront ? 'relative' : 'absolute top-0 left-0'} font-black uppercase tracking-tight ${sizeClass}`}
            style={{
              color: layer.color,
              transform: `translate(${-layer.offset}px, ${layer.offset}px)`,
              WebkitTextStroke: '2px #08251A',
              paintOrder: 'stroke fill',
              lineHeight: 1.05
            }}
          >
            {text}
          </span>
        );
      })}
    </span>
  );
};

// Copyable Code/Prompt Card
const CopyBlock = ({ title, badge, content, isDark = false }: { title?: string; badge?: string; content?: string; isDark?: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-[24px] overflow-hidden border-2 transition-all"
      style={{
        borderColor: BRAND.darkFir,
        backgroundColor: isDark ? BRAND.darkFir : BRAND.neutral1,
        color: isDark ? BRAND.neutral1 : BRAND.darkFir
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b-2"
        style={{
          borderColor: BRAND.darkFir,
          backgroundColor: isDark ? '#0D3A29' : BRAND.neutral3,
          color: isDark ? BRAND.neutral1 : BRAND.darkFir
        }}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: isDark ? BRAND.lfGreen : BRAND.darkFir, fill: BRAND.lfGreen }} />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">{title}</span>
          {badge && (
            <span
              className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-full border"
              style={{
                backgroundColor: BRAND.lfGreen,
                color: BRAND.darkFir,
                borderColor: BRAND.darkFir
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 transition-transform active:scale-95"
          style={{
            backgroundColor: copied ? BRAND.lfGreen : BRAND.neutral1,
            color: BRAND.darkFir,
            borderColor: BRAND.darkFir
          }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY FOR DEMO'}</span>
        </button>
      </div>
      <pre className="p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[210px]">
        {content}
      </pre>
    </div>
  );
};

// ============================================================================
// SLIDE DECK DATA STRUCTURE (2D Reveal.js Architecture: Horizontal = Tracks, Vertical = Steps)
// ============================================================================
interface Slide {
  subTitle: string;
  speakerNotes: string;
  type: string;
  talkTrack?: string;
  stakeholderQuote?: string;
  prepTitle?: string;
  prepBadge?: string;
  prepCode?: string;
  checklist?: string[];
  promptA_Title?: string;
  promptA?: string;
  promptB_Title?: string;
  promptB?: string;
  expectedResults?: string[];
  painResolution?: string;
  [key: string]: unknown;
}

interface Track {
  id: string;
  trackBadge: string;
  title: string;
  extrudedWord: string;
  subtitle: string;
  slides: Slide[];
  [key: string]: unknown;
}

const SLIDE_DECK: Track[] = [
  // COLUMN 0: INTRO & UP-FRONT CONTRACT
  {
    id: 'intro',
    trackBadge: 'START • DEMO COMMAND CENTER',
    title: 'SHUTTERFLY PURE MARK AI',
    extrudedWord: 'LIBERATION',
    subtitle: 'Interactive 2D Reveal.js Presenter Guide • CMS 12 PaaS Headless + React',
    slides: [
      {
        subTitle: '0.1 • Executive Framing & Up-Front Contract',
        speakerNotes: 'Open with the Sandler Up-Front Contract before touching any product UI. Disarm SaaS vs PaaS trauma immediately.',
        type: 'hero',
        talkTrack: '"Waruna, Kona, Manda—before we touch a single screen, let’s reset. Everything you see today runs 100% natively in Mark AI without requiring SaaS Visual Builder or rewriting your React frontend. We’re going to solve 5 specific bottlenecks you shared: 3-levels-deep block hunting, manual block scaffolding, eCom A/B test variations, Creative-to-CMS QA drift, and .NET/React developer velocity."'
      },
      {
        subTitle: '0.2 • Master Execution Matrix (5 Tracks → 3 Demo Streams)',
        speakerNotes: 'Show how the 5 operational tracks map cleanly to today’s 30-minute run of show.',
        type: 'matrix'
      }
    ]
  },

  // COLUMN 1: TRACK 1 - SITEOPS & CONTENT PRODUCTION (WARUNA)
  {
    id: 'track-1',
    trackBadge: 'TRACK 1 • SITEOPS & PRODUCTION',
    title: '3-LEVELS-DEEP',
    extrudedWord: 'QA AUDITOR',
    subtitle: 'Stakeholder: Waruna Perera (4-Person SiteOps Team) • Stream A',
    slides: [
      {
        subTitle: '1.1 • Prep & Mock CMS 12 Delivery JSON Payload',
        speakerNotes: 'Waruna told us settings get buried 3 levels deep in device tabs, forcing SiteOps to pull devs off sprint work. Copy this JSON and paste it into Mark.',
        type: 'prep',
        stakeholderQuote: '"Buried like 3 levels deep, on a different block, something’s added somewhere. And then they would ping our development team, and they would have to find it." — Waruna Perera {00:08:10}',
        prepTitle: 'STEP 1: Copy Mock CMS 12 Content Delivery API JSON (disney_promo_page.json)',
        prepBadge: 'JSON PAYLOAD',
        prepCode: `{
  "contentLink": { "id": 9042, "workId": 14 },
  "name": "Disney Holiday Collection Landing Page",
  "contentType": ["Page", "LandingPage"],
  "controlTab": { "visible": true, "campaignCode": "DISNEY_Q4_2026" },
  "mainContentArea": [
    {
      "Level_1_Block": "HeroContainerBlock_01",
      "contentLink": { "id": 4401 },
      "children": [
        {
          "Level_2_Block": "CarouselRowBlock_02",
          "contentLink": { "id": 5512 },
          "children": [
            {
              "Level_3_Block": "DisneyPromoCard_04",
              "contentLink": { "id": 7893 },
              "name": "Disney Custom Photo Book Promo Card",
              "controlTab": {
                "headline": "Magical Memories in Every Page",
                "ctaText": "Create Your Disney Book",
                "ctaUrl": "/disney-photo-books",
                "hidePrice": false,
                "discountBadge": "40% OFF"
              },
              "deviceTabs": {
                "desktop": { "inheritFromControl": true, "hidePrice": false },
                "tablet": { "inheritFromControl": true, "hidePrice": false },
                "mobile": {
                  "inheritFromControl": false,
                  "hidePrice": true,
                  "overrideVisibility": "HIDDEN",
                  "ctaUrl": ""
                }
              }
            }
          ]
        }
      ]
    }
  ]
}`,
        checklist: [
          'Open fresh Mark AI chat thread',
          'Copy the mock CMS 12 Content Delivery API JSON payload on the right',
          'Explain to Waruna: "This is the exact JSON structure your CMS 12 REST API outputs."'
        ]
      },
      {
        subTitle: '1.2 • Live Prompt: Deep Block Audit & New Block Scaffolding',
        speakerNotes: 'Paste the prompt below right after the JSON payload. Watch Mark pinpoint ID 7893 at Level 3 in 5 seconds.',
        type: 'prompt',
        promptA_Title: 'PROMPT 1A: 3-Levels-Deep Device Tab Audit',
        promptA: `You are a SiteOps QA Auditor for our headless Optimizely CMS 12 environment. Analyze the attached Content Delivery API JSON payload for the Disney Holiday Landing Page.
1. Recursively traverse all nested block levels (Level 1 -> Level 2 -> Level 3).
2. Identify any block where a 'deviceTabs' setting (desktop, tablet, or mobile) conflicts with or overrides the 'controlTab'.
3. Flag any missing required fields (such as empty URLs or missing CTAs).
4. Output a clean SiteOps Remediation Table showing: Exact Block Path, Block Content ID, Device Tab Affected, the Conflict Found, and the exact fix SiteOps needs to make in CMS 12.`,
        promptB_Title: 'PROMPT 1B: Automated CMS 12 Draft Block Scaffolding',
        promptB: `Now act as a CMS 12 Block Scaffolder. Based on our existing PromoCard schema above, generate the complete, schema-valid CMS 12 Management API JSON payload for a new 'Holiday Early Bird Promo Block' (40% off Holiday Cards, code EARLY40, valid across all device tabs with inheritFromControl = true) so we can POST it directly into Draft state.`
      },
      {
        subTitle: '1.3 • Expected Outcome & Stakeholder Value Reframe',
        speakerNotes: 'Highlight the remediation table Mark produces and anchor the business impact for Waruna’s 4-person team.',
        type: 'outcome',
        expectedResults: [
          'Instant Remediation Table flagging Level_1 (HeroContainer_01) -> Level_2 (CarouselRow_02) -> Level_3 (DisneyPromoCard_04 | ID: 7893).',
          'Pinpoints Mobile Tab conflict: inheritFromControl = false, hidePrice = true, overrideVisibility = HIDDEN, and empty ctaUrl.',
          'Generates ready-to-import CMS 12 Draft JSON payload with zero device-tab drift.'
        ],
        painResolution: 'Eliminates 2+ hours of manual tab-clicking across nested containers and stops SiteOps from interrupting engineering sprints to hunt down rogue mobile settings.'
      }
    ]
  },

  // COLUMN 2: TRACK 2 - E-COMMERCE MERCHANDISING & A/B TESTING (KONA)
  {
    id: 'track-2',
    trackBadge: 'TRACK 2 • E-COM & EXPERIMENTATION',
    title: 'PROMPT-TO-VARIANT',
    extrudedWord: 'GENERATOR',
    subtitle: 'Stakeholder: Srinivas Kona & E-Com Merchandising • Stream A',
    slides: [
      {
        subTitle: '2.1 • Prep & Master Approved CMS 12 Block JSON',
        speakerNotes: 'Kona told us they use a 3rd-party A/B testing plugin on React, and eCom bottlenecks creating block variations in CMS 12.',
        type: 'prep',
        stakeholderQuote: '"We also have third-party plugins to handle the A-B testing. And, for example, I have a testimonial block, and if there is an easy way, with a prompt, if I can create a different variation of a block for a particular variant, I think that kind of process might speed up the e-com\'s content creation way." — Srinivas Kona {00:17:03}',
        prepTitle: 'STEP 1: Copy Approved Baseline Testimonial Block (contentId: 4821)',
        prepBadge: 'MASTER BLOCK JSON',
        prepCode: `{
  "contentLink": { "id": 4821 },
  "name": "Testimonial_Block_Master_Control",
  "contentType": ["Block", "TestimonialBlock"],
  "status": "Published",
  "properties": {
    "eyebrow": "CUSTOMER LOVE",
    "quoteHeadline": "The easiest way to turn family photos into keepsakes.",
    "quoteBody": "I made our entire holiday album in under 20 minutes and the print quality blew us away.",
    "authorName": "Sarah M.",
    "productCategory": "Photo Books",
    "ctaText": "Start Your Photo Book",
    "ctaUrl": "/photo-books"
  }
}`,
        checklist: [
          'Keep the same Mark thread or start a clean eCom thread',
          'Copy the baseline Approved Testimonial Block JSON (#4821)',
          'Remind Kona: "This works directly with your existing 3rd-party React A/B testing tool."'
        ]
      },
      {
        subTitle: '2.2 • Live Prompt: Bulk A/B Test Block Variant Generation',
        speakerNotes: 'Run this single prompt to generate 3 audience-specific CMS 12 draft blocks plus a comparison table.',
        type: 'prompt',
        promptA_Title: 'PROMPT 2: Generate 3 Audience A/B Test Variants in CMS 12 Draft Format',
        promptA: `Here is our approved Master Testimonial Block (Content ID: 4821) from Optimizely CMS 12. Our eCom team is setting up a 3-variant A/B test in our React experimentation engine and needs 3 targeted variations of this block created in 'Draft' status:
- Variant A (Target: First-Time Holiday Card Buyers — focus on speed, zero stress, and address printing)
- Variant B (Target: High-Volume Repeat Photo Book Shoppers — focus on archival quality, layflat pages, and bulk memories)
- Variant C (Target: Newlyweds & Wedding Album Creators — focus on heirloom quality and timeless storytelling)

Please output:
1. A side-by-side Markdown comparison table for the eCom merchandising team to review the copy changes.
2. A single JSON array containing all 3 schema-compliant CMS 12 block payloads with "status": "Draft" and unique variant keys so they can be imported or fetched by our React A/B test plugin.`,
        promptB_Title: 'OPTIONAL FOLLOW-UP: Localize or Adjust Tone On-The-Fly',
        promptB: `Update Variant A's headline to emphasize "Free Recipient Addressing" and regenerate the JSON payload for Variant A.`
      },
      {
        subTitle: '2.3 • Expected Outcome & Stakeholder Value Reframe',
        speakerNotes: 'Point out both the human-readable review table for eCom and the machine-ready JSON array for CMS 12.',
        type: 'outcome',
        expectedResults: [
          'Side-by-side Merchandising Review Table comparing Variant A, B, and C across Eyebrow, Headline, Quote Body, and CTA.',
          'Complete JSON array containing 3 schema-valid CMS 12 TestimonialBlock objects set to "status": "Draft".',
          'Preserves all structural property keys required by the React frontend.'
        ],
        painResolution: 'Compresses hours of repetitive cloning, form-filling, and copywriting in CMS 12 down to a 15-second prompt—unlocking higher experimentation velocity for eCom.'
      }
    ]
  },

  // COLUMN 3: TRACK 3 - CREATIVE, UX & BRAND GOVERNANCE (WARUNA)
  {
    id: 'track-3',
    trackBadge: 'TRACK 3 • CREATIVE & UX GOVERNANCE',
    title: 'SPEC-TO-BUILD',
    extrudedWord: 'DISCREPANCY QA',
    subtitle: 'Stakeholder: Waruna Perera, UX & Creative Teams • Stream A',
    slides: [
      {
        subTitle: '3.1 • Prep & Creative Spec vs. Staging Build Payloads',
        speakerNotes: 'Waruna explained that UX mocks something up, Creative changes it, SiteOps builds to spec, and at debut they discover missing elements.',
        type: 'prep',
        stakeholderQuote: '"UX would mock something up, they would talk to Creative... then we would build it up to spec, and then come time to debut it, no one has time to QA properly. So at that point, oh wait, something was missing. The creative mock has this. The UX mock didn\'t..." — Waruna Perera {00:10:28}',
        prepTitle: 'STEP 1: Copy Creative Spec & CMS 12 Staging Build (spec_vs_build.json)',
        prepBadge: 'SPEC VS BUILD',
        prepCode: `=== APPROVED CREATIVE DESIGN SPEC (FINAL FIGMA COMP) ===
- Hero Eyebrow: "SHUTTERFLY x DISNEY COLLECTION"
- Primary Headline: "Where Family Memories Meet Disney Magic"
- Subheadline: "Create custom photo books, holiday cards, and gifts featuring classic Disney characters."
- Primary CTA Button: "Shop Disney Collection" -> URL: "/disney"
- Secondary CTA Button: "Preview Photo Book Styles" -> URL: "/disney/photo-books"
- Promotional Pill Badge: "CODE: MAGIC40 • ENDS SUNDAY"
- Required Partner Legal Footer: "(c) Disney. All Rights Reserved. Offer valid on select Disney Collection items."

=== ACTUAL CMS 12 STAGING BUILD PAYLOAD (BUILT FROM EARLY UX WIREFRAME) ===
{
  "contentLink": { "id": 9910 },
  "eyebrow": "DISNEY COLLECTION",
  "headline": "Where Family Memories Meet Disney Magic",
  "subheadline": "Create custom photo books and gifts featuring Disney characters.",
  "primaryCta": { "text": "Shop Disney Collection", "url": "/disney" },
  "secondaryCta": null,
  "promoBadge": "40% OFF SITEWIDE",
  "legalDisclaimer": ""
}`,
        checklist: [
          'Paste the combined Creative Spec + Staging Build snippet (or attach a Figma mockup image)',
          'Highlight that Mark can also browse live staging URLs directly for WCAG accessibility checks'
        ]
      },
      {
        subTitle: '3.2 • Live Prompt: Multimodal Spec-to-Build Discrepancy Audit',
        speakerNotes: 'Run the Spec-to-Build QA prompt first, then show how Mark can also run a live URL WCAG audit on day 1.',
        type: 'prompt',
        promptA_Title: 'PROMPT 3A: Pre-Launch Creative vs. UX vs. CMS Build Audit',
        promptA: `Act as our Pre-Launch Governance & QA Agent. Compare the Approved Creative Design Spec against our actual CMS 12 Staging Build JSON payload above.
1. Generate a 'Launch Readiness Scorecard' (Pass / Hold Launch).
2. List every discrepancy between the Creative Spec and the CMS 12 Staging Build, categorized by severity (Blocker / Major / Minor).
3. Provide the exact corrected JSON patch that SiteOps needs so the staging build matches the final Creative spec 100%.`,
        promptB_Title: 'PROMPT 3B: Zero-Integration Public URL Accessibility & SEO Audit',
        promptB: `Browse https://www.shutterfly.com and perform a rapid SiteOps QA & Accessibility check on the homepage hero and primary promotional banners: verify heading hierarchy, image alt-text completeness, link integrity, and CTA clarity.`
      },
      {
        subTitle: '3.3 • Expected Outcome & Stakeholder Value Reframe',
        speakerNotes: 'Show the "HOLD LAUNCH" verdict and the 4 caught discrepancies. This directly eliminates launch-day panic.',
        type: 'outcome',
        expectedResults: [
          'Verdict: HOLD LAUNCH — 4 Discrepancies Detected.',
          'BLOCKER: Missing mandatory Disney partner legal disclaimer & Missing Secondary CTA button.',
          'MAJOR: Promo badge says "40% OFF SITEWIDE" instead of "CODE: MAGIC40 • ENDS SUNDAY"; Subheadline omits "holiday cards".',
          'Outputs exact corrected CMS 12 JSON block ready to paste.'
        ],
        painResolution: 'Replaces last-minute launch fire drills ("what did we promise who?") with an automated 15-second pre-flight check before publishing.'
      }
    ]
  },

  // COLUMN 4: TRACK 4 - CORE SOFTWARE ENGINEERING (MANDA & KONA)
  {
    id: 'track-4',
    trackBadge: 'TRACK 4 • CORE SOFTWARE ENGINEERING',
    title: 'HEADLESS .NET & REACT',
    extrudedWord: 'DEV ACCELERATOR',
    subtitle: 'Stakeholders: Srinivas Manda & Srinivas Kona • Stream B',
    slides: [
      {
        subTitle: '4.1 • Prep & .NET C# Content Type Definition',
        speakerNotes: 'Manda asked at {00:22:29}: "We are literally coding on the Optimizely .NET repo... Do you have anything that can enable developers to better take decisions when designing a component?"',
        type: 'prep',
        stakeholderQuote: '"During the development, like, we are literally coding on the Optimizely repo, right? The .NET, whatever we have... Do you have anything that this platform can enable developers to better take the decisions when designing a component?" — Srinivas Manda {00:22:29}',
        prepTitle: 'STEP 1: Copy C# CMS 12 Block Class (InteractiveGiftFinderBlock.cs)',
        prepBadge: 'C# .NET MODEL',
        prepCode: `[ContentType(
    DisplayName = "Interactive Gift Finder Block",
    GUID = "d4a8e910-5b2c-4f88-9a11-0029384756ab",
    Description = "Headless block for filtering personalized gifts by occasion and price tier")]
public class InteractiveGiftFinderBlock : BlockData
{
    [Display(Name = "Header Title", Order = 10)]
    [Required]
    public virtual string HeaderTitle { get; set; }

    [Display(Name = "Occasion Categories", Order = 20)]
    public virtual IList<string> OccasionCategories { get; set; }

    [Display(Name = "Max Price Filter", Order = 30)]
    public virtual int MaxPriceFilter { get; set; }

    [Display(Name = "Featured Promo Banner", Order = 40)]
    [AllowedTypes(typeof(PromoCardBlock))]
    public virtual ContentReference FeaturedPromoBanner { get; set; }
}`,
        checklist: [
          'Copy the C# .NET CMS 12 Block class on the right',
          'Frame for Manda & Kona: "Let’s look at how Mark accelerates your .NET backend and React frontend workflow."'
        ]
      },
      {
        subTitle: '4.2 • Live Prompt: Component Architecture, TypeScript Contract & Cache Rules',
        speakerNotes: 'Paste this prompt to review the C# model, generate the exact Content Delivery REST API JSON, and build the React TypeScript interface.',
        type: 'prompt',
        promptA_Title: 'PROMPT 4: C# Model Review + REST Delivery JSON + React TypeScript Contract',
        promptA: `We are building a new headless component in Optimizely CMS 12 (.NET) consumed by our React frontend via the Optimizely Content Delivery REST API and cached in our custom middle-tier layer. Here is our draft C# BlockData class.

Please help our engineering team design this component:
1. Review the C# class and recommend best-practice CMS 12 attributes for headless delivery (e.g., CultureSpecific, ContentArea vs ContentReference expansion, validation attributes).
2. Generate the exact JSON response structure that the Optimizely Content Delivery REST API will return for this block (including expanded child block properties).
3. Generate the strict TypeScript interface ('InteractiveGiftFinderProps.ts') for our React frontend team.
4. Recommend the cache invalidation key pattern our middle-tier cache should use when the referenced 'FeaturedPromoBanner' child block is republished.`,
        promptB_Title: 'OPTIONAL FOLLOW-UP: Generate React Component Skeleton',
        promptB: `Generate a clean, accessible React functional component consuming InteractiveGiftFinderProps with error boundary fallbacks if FeaturedPromoBanner is unexpanded.`
      },
      {
        subTitle: '4.3 • Expected Outcome & Stakeholder Value Reframe',
        speakerNotes: 'Point out item #4 in Mark’s output—solving the parent/child middle-tier cache invalidation edge case Kona described at {00:15:00}.',
        type: 'outcome',
        expectedResults: [
          'Refactored C# CMS 12 class adding [CultureSpecific] and ?expand=featuredPromoBanner guidance.',
          'Exact simulated Content Delivery REST API JSON output.',
          'Production-ready TypeScript interface (InteractiveGiftFinderProps) for React.',
          'Dependency-tag cache invalidation strategy so republishing a child PromoCard invalidates the parent block in the middle tier.'
        ],
        painResolution: 'Proves to Manda and Kona that Mark is a full-stack headless engineering co-pilot that understands CMS 12 C# models, REST serialization, and middle-tier cache invalidation.'
      }
    ]
  },

  // COLUMN 5: TRACK 5 - QE & TROUBLESHOOTING VELOCITY (RAGHAVAN)
  {
    id: 'track-5',
    trackBadge: 'TRACK 5 • QE & TROUBLESHOOTING',
    title: 'AUTOMATED QE &',
    extrudedWord: 'TRIAGE ENGINE',
    subtitle: 'Stakeholder: Raghavan (Engineering & QE Lead) • Stream B & C',
    slides: [
      {
        subTitle: '5.1 • Prep & Broken Production API Payload vs. React Contract',
        speakerNotes: 'Raghavan challenged us at {00:40:21}: "Not just a chatbot... how is it going to expedite our development process and troubleshoot issues quickly?"',
        type: 'prep',
        stakeholderQuote: '"What capabilities can be provided to the engineering, SRE, QE teams for us to be able to do faster development, plus being able to troubleshoot issues quickly, etc. And not just a chatbot that is available to answer questions." — Raghavan {00:40:21}',
        prepTitle: 'STEP 1: Copy Broken API Payload vs. React TypeScript Contract',
        prepBadge: 'TRIAGE PAYLOAD',
        prepCode: `=== REACT FRONTEND TYPESCRIPT INTERFACE ===
interface DisneyHeroBannerProps {
  bannerId: number;
  headline: string;
  discountPercentage: number; // expects numeric value e.g. 40
  heroImage: {
    url: string;
    altText: string; // required non-null string for WCAG & rendering
  };
  ctaConfig: {
    label: string;
    targetUrl: string;
  };
}

=== ACTUAL CMS 12 CONTENT DELIVERY REST API RESPONSE (CAUSING REACT RENDER FAILURE) ===
{
  "contentLink": { "id": 8821 },
  "bannerId": 8821,
  "headline": "Disney Photo Book Special",
  "discountPercentage": "40%",
  "heroImage": {
    "url": "https://cdn.shutterfly.com/disney-hero.jpg",
    "altText": null
  },
  "ctaConfig": null
}`,
        checklist: [
          'Copy the failing API response & TypeScript contract on the right',
          'Frame for Raghavan: "Here is how Mark uses its sandboxed Python runtime to automate QE test seeding and root-cause triage."'
        ]
      },
      {
        subTitle: '5.2 • Live Prompt: Automated Root-Cause Triage & Python QE Stress-Test Generator',
        speakerNotes: 'This triggers Mark’s Python code execution sandbox to generate a downloadable 15-item QE edge-case JSON suite.',
        type: 'prompt',
        promptA_Title: 'PROMPT 5: Contract Root-Cause Triage + Python 15-Variant QE Generator',
        promptA: `Act as our QE & Troubleshooting Automation Engine.
Part 1 (Root-Cause Triage): Our React frontend is throwing a rendering exception on the CMS 12 Content Delivery API payload above. Diff the JSON response against our 'DisneyHeroBannerProps' TypeScript interface and identify every contract violation causing the crash.

Part 2 (Automated QE Test Suite Generation via Python): Use your Python code execution environment to programmatically generate a downloadable JSON file ('cms12_qe_stress_test_suite.json') containing 15 edge-case CMS 12 block payloads for 'DisneyHeroBannerProps' (testing max string lengths, Unicode/emoji characters, null optional fields, boundary numbers, and malformed URLs) so our QE team can stress-test our React components and middle-tier cache before launch.`,
        promptB_Title: 'EXECUTIVE WRAP-UP: Day 1 vs. Day 2 Architectural Honesty Matrix',
        promptB: `Summarize today's 5 proof points into a clean Day 1 (Zero Code Lift / Pure Mark AI) vs. Day 2 (REST API / MCP Integration) rollout matrix for Shutterfly's CMS 12 PaaS headless architecture.`
      },
      {
        subTitle: '5.3 • Expected Outcome & Executive Wrap-Up Matrix',
        speakerNotes: 'Download/click the generated JSON artifact tile from Mark’s Python sandbox, then close with the Day 1 vs Day 2 Reality Matrix.',
        type: 'outcome',
        expectedResults: [
          'Instant Root-Cause Triage pinpointing all 3 contract crashes: discountPercentage string ("40%") vs number (40), null altText, and null ctaConfig.',
          'Executes Python code in Mark’s sandbox and outputs downloadable cms12_qe_stress_test_suite.json with 15 synthetic edge-case payloads.',
          'Establishes total architectural honesty for the upcoming Executive Demo with the VP of E-Commerce.'
        ],
        painResolution: 'Directly answers Raghavan’s challenge: proves Mark is an active engineering and QE accelerator that diagnoses API contract bugs in seconds and generates synthetic test data programmatically.'
      }
    ]
  }
];

// ============================================================================
// MAIN INTERACTIVE REVEAL.JS-STYLE PRESENTATION COMPONENT
// ============================================================================
export default function App() {
  // 2D Coordinates: h = Horizontal Track (0..5), v = Vertical Step (0..2)
  const [hIndex, setHIndex] = useState(0);
  const [vIndex, setVIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [overviewMode, setOverviewMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const currentTrack = SLIDE_DECK[hIndex];
  const currentSlide = currentTrack.slides[vIndex] || currentTrack.slides[0];

  const totalSlidesCount = SLIDE_DECK.reduce((acc, track) => acc + track.slides.length, 0);
  const currentFlatIndex =
    SLIDE_DECK.slice(0, hIndex).reduce((acc, track) => acc + track.slides.length, 0) + vIndex + 1;

  // Navigation Handlers
  const goRight = useCallback(() => {
    if (hIndex < SLIDE_DECK.length - 1) {
      setHIndex((prev) => prev + 1);
      setVIndex(0);
    }
  }, [hIndex]);

  const goLeft = useCallback(() => {
    if (hIndex > 0) {
      setHIndex((prev) => prev - 1);
      setVIndex(0);
    }
  }, [hIndex]);

  const goDown = useCallback(() => {
    if (vIndex < currentTrack.slides.length - 1) {
      setVIndex((prev) => prev + 1);
    } else if (hIndex < SLIDE_DECK.length - 1) {
      setHIndex((prev) => prev + 1);
      setVIndex(0);
    }
  }, [vIndex, hIndex, currentTrack]);

  const goUp = useCallback(() => {
    if (vIndex > 0) {
      setVIndex((prev) => prev - 1);
    }
  }, [vIndex]);

  // Keyboard Navigation (Reveal.js Standard: Arrow keys, Space, N, O)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goRight();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goLeft();
      } else if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goDown();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goUp();
      } else if (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'n') {
        setShowNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === 'o' || e.key === 'Escape') {
        setOverviewMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goRight, goLeft, goDown, goUp]);

  const toggleComplete = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between select-none overflow-hidden"
      style={{
        backgroundColor: BRAND.neutral3,
        color: BRAND.darkFir,
        fontFamily: "'Roboto', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* ====================================================================
          TOP NAVIGATION BAR (TRACK SELECTOR + PRESENTER CONTROLS)
      ==================================================================== */}
      <header
        className="w-full px-6 py-3 border-b-2 flex flex-wrap items-center justify-between gap-3 z-20"
        style={{ backgroundColor: BRAND.darkFir, borderColor: BRAND.darkFir, color: BRAND.neutral1 }}
      >
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center border-2"
            style={{ backgroundColor: BRAND.lfGreen, borderColor: BRAND.neutral1 }}
          >
            <Zap className="w-5 h-5" style={{ color: BRAND.darkFir, fill: BRAND.darkFir }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-base uppercase" style={{ color: BRAND.lfGreen }}>
                OPTIMIZELY MARK AI
              </span>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: BRAND.lightBlue, color: BRAND.darkFir }}
              >
                CMS 12 PAAS HEADLESS
              </span>
            </div>
            <p className="text-xs opacity-80 font-mono">
              {'Shutterfly Interactive Presenter Deck • Use Arrow Keys (Left/Right = Tracks | Up/Down = Steps)'}
            </p>
          </div>
        </div>

        {/* Horizontal Track Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SLIDE_DECK.map((track, idx) => {
            const active = idx === hIndex;
            return (
              <button
                key={track.id}
                onClick={() => {
                  setHIndex(idx);
                  setVIndex(0);
                  setOverviewMode(false);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all border-2"
                style={{
                  backgroundColor: active ? BRAND.lfGreen : '#0D3A29',
                  color: active ? BRAND.darkFir : BRAND.neutral1,
                  borderColor: active ? BRAND.neutral1 : '#197050'
                }}
              >
                {idx === 0 ? '0. INTRO' : `T${idx}: ${track.id.toUpperCase()}`}
              </button>
            );
          })}
        </div>

        {/* Presenter Mode Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOverviewMode((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
            style={{
              backgroundColor: overviewMode ? BRAND.lfGreen : BRAND.neutral1,
              color: BRAND.darkFir,
              borderColor: BRAND.darkFir
            }}
            title="Toggle 2D Slide Map (Shortcut: O or Esc)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{overviewMode ? 'CLOSE MAP (O)' : '2D MAP (O)'}</span>
          </button>
          <button
            onClick={() => setShowNotes((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
            style={{
              backgroundColor: showNotes ? BRAND.lightBlue : BRAND.neutral1,
              color: BRAND.darkFir,
              borderColor: BRAND.darkFir
            }}
            title="Toggle Marvin's Teleprompter Notes (Shortcut: S)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showNotes ? 'HIDE TELEPROMPTER (S)' : 'TELEPROMPTER (S)'}</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          MAIN 16:9 VIEWPORT CANVAS
      ==================================================================== */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-8 py-5 flex flex-col justify-between overflow-y-auto">
        {overviewMode ? (
          /* ------------------------------------------------------------------
             REVEAL.JS 2D OVERVIEW MATRIX MODE (Press 'O' or 'Esc')
          ------------------------------------------------------------------ */
          <div className="w-full h-full flex flex-col justify-center">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {'2D REVEAL.JS SLIDE NAVIGATOR (COLUMNS = TRACKS • ROWS = DEMO STEPS)'}
              </h2>
              <span
                className="font-mono text-xs px-3 py-1 rounded-full border-2 font-bold"
                style={{ backgroundColor: BRAND.lfGreen, borderColor: BRAND.darkFir }}
              >
                CLICK ANY SLIDE TO JUMP DIRECTLY
              </span>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {SLIDE_DECK.map((col, cIdx) => (
                <div key={col.id} className="flex flex-col gap-3">
                  <div
                    className="px-3 py-2 rounded-[18px] border-2 font-mono text-xs font-bold uppercase text-center"
                    style={{
                      backgroundColor: cIdx === hIndex ? BRAND.lfGreen : BRAND.darkFir,
                      color: cIdx === hIndex ? BRAND.darkFir : BRAND.neutral1,
                      borderColor: BRAND.darkFir
                    }}
                  >
                    {col.trackBadge}
                  </div>
                  {col.slides.map((s, rIdx) => {
                    const isCurrent = cIdx === hIndex && rIdx === vIndex;
                    return (
                      <button
                        key={rIdx}
                        onClick={() => {
                          setHIndex(cIdx);
                          setVIndex(rIdx);
                          setOverviewMode(false);
                        }}
                        className="p-4 rounded-[24px] border-2 text-left transition-transform hover:-translate-y-1 flex flex-col justify-between min-h-[130px]"
                        style={{
                          backgroundColor: isCurrent ? BRAND.lfGreen : BRAND.neutral1,
                          borderColor: BRAND.darkFir,
                          boxShadow: isCurrent ? '0 6px 0 #08251A' : '0 3px 0 #08251A'
                        }}
                      >
                        <span className="font-mono text-[11px] font-bold uppercase opacity-75">
                          {`SLIDE ${cIdx}.${rIdx + 1}`}
                        </span>
                        <p className="font-bold text-sm leading-snug mt-1">{s.subTitle}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                            style={{ backgroundColor: BRAND.neutral3, borderColor: BRAND.darkFir }}
                          >
                            {s.type.toUpperCase()}
                          </span>
                          {isCurrent && <Play className="w-3.5 h-3.5 fill-current" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------------
             ACTIVE SLIDE VIEWPORT
          ------------------------------------------------------------------ */
          <div className="flex flex-col h-full justify-between gap-4">
            {/* Slide Header Banner */}
            <div
              className="w-full rounded-[32px] p-6 border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              style={{
                backgroundColor: BRAND.neutral1,
                borderColor: BRAND.darkFir,
                boxShadow: '0 6px 0 #08251A'
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border-2"
                    style={{
                      backgroundColor: BRAND.lfGreen,
                      color: BRAND.darkFir,
                      borderColor: BRAND.darkFir
                    }}
                  >
                    {currentTrack.trackBadge}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border-2"
                    style={{
                      backgroundColor: BRAND.lightBlue,
                      color: BRAND.darkFir,
                      borderColor: BRAND.darkFir
                    }}
                  >
                    {currentSlide.subTitle}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2 mt-1">
                  <h1
                    className="text-3xl md:text-4xl font-black uppercase tracking-tight mr-2"
                    style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                  >
                    {currentTrack.title}
                  </h1>
                  <UpwardsExtrusionText text={currentTrack.extrudedWord} sizeClass="text-3xl md:text-4xl" />
                </div>
                <p className="text-sm font-medium opacity-85 mt-1">{currentTrack.subtitle}</p>
              </div>

              {/* Vertical Stepper Pills inside Current Track */}
              <div className="flex flex-col items-end gap-2">
                <span className="text-[11px] font-mono font-bold uppercase">
                  {'VERTICAL TRACK STEPS (PRESS UP / DOWN)'}
                </span>
                <div className="flex items-center gap-2">
                  {currentTrack.slides.map((s, idx) => {
                    const active = idx === vIndex;
                    const stepLabels = ['1. PREP & PAYLOAD', '2. LIVE PROMPTS', '3. OUTCOME & VALUE'];
                    const introLabels = ['1. UP-FRONT CONTRACT', '2. MASTER MATRIX'];
                    const label = hIndex === 0 ? introLabels[idx] : stepLabels[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => setVIndex(idx)}
                        className="px-3.5 py-2 rounded-full text-xs font-mono font-bold border-2 transition-all"
                        style={{
                          backgroundColor: active ? BRAND.darkFir : BRAND.neutral2,
                          color: active ? BRAND.lfGreen : BRAND.darkFir,
                          borderColor: BRAND.darkFir
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Slide Body Content by Slide Type */}
            <div className="flex-1 grid grid-cols-1 gap-4">
              {/* TYPE: HERO (Slide 0.1) */}
              {currentSlide.type === 'hero' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  <div
                    className="lg:col-span-7 rounded-[32px] p-7 border-2 flex flex-col justify-between"
                    style={{
                      backgroundColor: BRAND.darkFir,
                      color: BRAND.neutral1,
                      borderColor: BRAND.darkFir,
                      boxShadow: '0 6px 0 #08251A'
                    }}
                  >
                    <div>
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold mb-4"
                        style={{ backgroundColor: BRAND.lfGreen, color: BRAND.darkFir }}
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>WORD-FOR-WORD OPENING UP-FRONT CONTRACT</span>
                      </div>
                      <h3 className="text-2xl font-black uppercase mb-3" style={{ color: BRAND.lfGreen }}>
                        {'Reset Stature and Disarm "SaaS Shelfware" Anxiety at Minute 1'}
                      </h3>
                      <p
                        className="text-base leading-relaxed font-medium p-5 rounded-[24px] border-2"
                        style={{ backgroundColor: '#0D3A29', borderColor: BRAND.lfGreen }}
                      >
                        {currentSlide.talkTrack}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="p-3.5 rounded-[20px] border" style={{ backgroundColor: '#0D3A29', borderColor: '#3AB533' }}>
                        <div className="font-mono text-xs font-bold" style={{ color: BRAND.lfGreen }}>RULE #1</div>
                        <div className="font-bold text-sm mt-1">Zero SaaS Visual Builder</div>
                        <p className="text-xs opacity-80 mt-1">{'Never show SaaS Experience Builder; stay 100% in headless JSON and REST.'}</p>
                      </div>
                      <div className="p-3.5 rounded-[20px] border" style={{ backgroundColor: '#0D3A29', borderColor: '#3AB533' }}>
                        <div className="font-mono text-xs font-bold" style={{ color: BRAND.lfGreen }}>RULE #2</div>
                        <div className="font-bold text-sm mt-1">Pure Mark AI Native</div>
                        <p className="text-xs opacity-80 mt-1">{'Every proof point runs live in Mark Chat + Python Sandbox today.'}</p>
                      </div>
                      <div className="p-3.5 rounded-[20px] border" style={{ backgroundColor: '#0D3A29', borderColor: '#3AB533' }}>
                        <div className="font-mono text-xs font-bold" style={{ color: BRAND.lfGreen }}>RULE #3</div>
                        <div className="font-bold text-sm mt-1">{'5 Pains -> 3 Streams'}</div>
                        <p className="text-xs opacity-80 mt-1">{'Structured for SiteOps (Waruna), Dev (Manda/Kona), and QE (Raghavan).'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Architecture Map Card */}
                  <div
                    className="lg:col-span-5 rounded-[32px] p-7 border-2 flex flex-col justify-between"
                    style={{
                      backgroundColor: BRAND.neutral1,
                      borderColor: BRAND.darkFir,
                      boxShadow: '0 6px 0 #08251A'
                    }}
                  >
                    <div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-mono font-bold border-2 inline-block mb-3"
                        style={{ backgroundColor: BRAND.lightBlue, borderColor: BRAND.darkFir }}
                      >
                        SHUTTERFLY HEADLESS STACK
                      </span>
                      <h3 className="text-xl font-black uppercase">Where Mark AI Plugs In Today</h3>
                      <div className="mt-4 space-y-2.5 font-mono text-xs">
                        <div
                          className="p-3 rounded-[18px] border-2 flex items-center justify-between"
                          style={{ backgroundColor: BRAND.neutral2, borderColor: BRAND.darkFir }}
                        >
                          <span>1. Optimizely CMS 12 PaaS (.NET)</span>
                          <span className="px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: BRAND.lfGreen }}>Authoring</span>
                        </div>
                        <div
                          className="p-3 rounded-[18px] border-2 flex items-center justify-between"
                          style={{ backgroundColor: BRAND.lfGreen, borderColor: BRAND.darkFir }}
                        >
                          <span className="font-bold">{'MARK AI LAYER (JSON / Specs / Code)'}</span>
                          <span className="px-2 py-0.5 rounded-full font-bold bg-white">Day 1 Active</span>
                        </div>
                        <div
                          className="p-3 rounded-[18px] border-2 flex items-center justify-between"
                          style={{ backgroundColor: BRAND.neutral2, borderColor: BRAND.darkFir }}
                        >
                          <span>{'2. Content Delivery and Search REST API'}</span>
                          <span className="px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: BRAND.lightBlue }}>JSON Payload</span>
                        </div>
                        <div
                          className="p-3 rounded-[18px] border-2 flex items-center justify-between"
                          style={{ backgroundColor: BRAND.neutral2, borderColor: BRAND.darkFir }}
                        >
                          <span>3. Custom Middle-Tier Cache + React UI</span>
                          <span className="px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: BRAND.neutral3 }}>Presentation</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={goDown}
                      className="mt-5 w-full py-3 rounded-full font-black text-sm uppercase border-2 flex items-center justify-center gap-2 transition-transform active:scale-98"
                      style={{ backgroundColor: BRAND.lfGreen, color: BRAND.darkFir, borderColor: BRAND.darkFir }}
                    >
                      <span>VIEW MASTER EXECUTION MATRIX (DOWN)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TYPE: MATRIX (Slide 0.2) */}
              {currentSlide.type === 'matrix' && (
                <div
                  className="rounded-[32px] p-6 border-2 overflow-x-auto"
                  style={{
                    backgroundColor: BRAND.neutral1,
                    borderColor: BRAND.darkFir,
                    boxShadow: '0 6px 0 #08251A'
                  }}
                >
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b-2 font-mono uppercase" style={{ borderColor: BRAND.darkFir, backgroundColor: BRAND.neutral3 }}>
                        <th className="p-3">Operational Track</th>
                        <th className="p-3">Stakeholder</th>
                        <th className="p-3">Core Discovery Pain Point</th>
                        <th className="p-3">Consolidated Stream</th>
                        <th className="p-3">Pure Mark AI Proof Point</th>
                        <th className="p-3">Jump</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: BRAND.darkFir }}>
                      {[
                        {
                          track: 'Track 1: SiteOps & Production',
                          who: 'Waruna Perera (4-person team)',
                          pain: 'Settings buried 3 levels deep in device tabs; slow manual block assembly.',
                          stream: 'Stream A: Content & QA Velocity',
                          proof: 'Recursive JSON Audit & Draft Block Scaffolder',
                          col: 1
                        },
                        {
                          track: 'Track 2: E-Com & Experimentation',
                          who: 'E-Com Team (via Kona)',
                          pain: 'Manual cloning of CMS 12 blocks for 3rd-party React A/B tests.',
                          stream: 'Stream A: Content & QA Velocity',
                          proof: 'Prompt-to-Block A/B Variant Generator',
                          col: 2
                        },
                        {
                          track: 'Track 3: Creative, UX & Governance',
                          who: 'UX & Creative (via Waruna)',
                          pain: 'UX wireframes vs Creative mocks vs CMS build drift; zero time to QA.',
                          stream: 'Stream A: Content & QA Velocity',
                          proof: 'Multimodal Spec-to-Build Discrepancy Audit',
                          col: 3
                        },
                        {
                          track: 'Track 4: Core Software Engineering',
                          who: 'Srinivas Manda & Kona',
                          pain: 'Coding in .NET repo without AI help for schemas, TS contracts & cache.',
                          stream: 'Stream B: Dev & QE Acceleration',
                          proof: 'C# Schema Review, TS Interface & Cache Keys',
                          col: 4
                        },
                        {
                          track: 'Track 5: QE & Troubleshooting',
                          who: 'Raghavan (Eng / QE Lead)',
                          pain: 'Needs faster API contract triage & automated QE edge-case test data.',
                          stream: 'Stream B & C: QE & Exec Value',
                          proof: 'API Triage + Python 15-Variant QE Generator',
                          col: 5
                        }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#EFF6E9] transition-colors">
                          <td className="p-3 font-bold">{row.track}</td>
                          <td className="p-3 font-medium">{row.who}</td>
                          <td className="p-3">{row.pain}</td>
                          <td className="p-3">
                            <span
                              className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold border"
                              style={{ backgroundColor: BRAND.lightBlue, borderColor: BRAND.darkFir }}
                            >
                              {row.stream}
                            </span>
                          </td>
                          <td className="p-3 font-semibold">{row.proof}</td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setHIndex(row.col);
                                setVIndex(0);
                              }}
                              className="px-3 py-1 rounded-full font-mono font-bold border-2 text-xs"
                              style={{ backgroundColor: BRAND.lfGreen, borderColor: BRAND.darkFir }}
                            >
                              {`OPEN T${row.col}`}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TYPE: PREP (Step 1 of each Track) */}
              {currentSlide.type === 'prep' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Left: Verbatim Quote + Interactive Prep Checklist */}
                  <div
                    className="lg:col-span-5 rounded-[32px] p-6 border-2 flex flex-col justify-between"
                    style={{
                      backgroundColor: BRAND.neutral1,
                      borderColor: BRAND.darkFir,
                      boxShadow: '0 6px 0 #08251A'
                    }}
                  >
                    <div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-mono font-bold border-2 inline-block mb-3"
                        style={{ backgroundColor: BRAND.lightBlue, borderColor: BRAND.darkFir }}
                      >
                        VERBATIM STAKEHOLDER PAIN
                      </span>
                      <blockquote
                        className="p-4 rounded-[20px] border-2 text-sm italic leading-relaxed"
                        style={{ backgroundColor: BRAND.neutral2, borderColor: BRAND.darkFir }}
                      >
                        {currentSlide.stakeholderQuote}
                      </blockquote>

                      <h4 className="font-black uppercase text-sm mt-5 mb-2.5 flex items-center gap-2">
                        <ListChecks className="w-4 h-4" />
                        <span>{"MARVIN'S PRE-FLIGHT CHECKLIST"}</span>
                      </h4>
                      <div className="space-y-2">
                        {(currentSlide.checklist ?? []).map((item, idx) => {
                          const key = `${currentTrack.id}-prep-${idx}`;
                          const checked = !!completedSteps[key];
                          return (
                            <button
                              key={idx}
                              onClick={() => toggleComplete(key)}
                              className="w-full p-3 rounded-[18px] border-2 text-left text-xs font-bold flex items-center gap-2.5 transition-all"
                              style={{
                                backgroundColor: checked ? BRAND.lfGreen : BRAND.neutral1,
                                borderColor: BRAND.darkFir
                              }}
                            >
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                                style={{ borderColor: BRAND.darkFir, backgroundColor: checked ? BRAND.darkFir : BRAND.neutral1 }}
                              >
                                {checked && <Check className="w-3 h-3" style={{ color: BRAND.lfGreen }} />}
                              </div>
                              <span className={checked ? 'line-through opacity-80' : ''}>{item}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={goDown}
                      className="mt-4 w-full py-3 rounded-full font-black text-xs uppercase border-2 flex items-center justify-center gap-2"
                      style={{ backgroundColor: BRAND.lfGreen, color: BRAND.darkFir, borderColor: BRAND.darkFir }}
                    >
                      <span>NEXT: COPY LIVE PROMPTS (DOWN)</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right: Copyable Mock Payload */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <CopyBlock
                      title={currentSlide.prepTitle}
                      badge={currentSlide.prepBadge}
                      content={currentSlide.prepCode}
                      isDark={true}
                    />
                  </div>
                </div>
              )}

              {/* TYPE: PROMPT (Step 2 of each Track) */}
              {currentSlide.type === 'prompt' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                  <div className="flex flex-col justify-between gap-4">
                    <CopyBlock
                      title={currentSlide.promptA_Title}
                      badge="PRIMARY DEMO PROMPT"
                      content={currentSlide.promptA}
                      isDark={false}
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <CopyBlock
                      title={currentSlide.promptB_Title}
                      badge="PART 2 / FOLLOW-UP PROMPT"
                      content={currentSlide.promptB}
                      isDark={false}
                    />
                    <div
                      className="p-5 rounded-[28px] border-2 flex items-center justify-between"
                      style={{ backgroundColor: BRAND.darkFir, color: BRAND.neutral1, borderColor: BRAND.darkFir }}
                    >
                      <div>
                        <span className="font-mono text-xs font-bold" style={{ color: BRAND.lfGreen }}>
                          READY TO DEBRIEF THIS PROOF POINT?
                        </span>
                        <p className="text-xs opacity-85 mt-0.5">
                          Advance down to show the expected output and stakeholder ROI reframe.
                        </p>
                      </div>
                      <button
                        onClick={goDown}
                        className="px-4 py-2.5 rounded-full font-black text-xs uppercase border-2 shrink-0 flex items-center gap-1.5"
                        style={{ backgroundColor: BRAND.lfGreen, color: BRAND.darkFir, borderColor: BRAND.neutral1 }}
                      >
                        <span>EXPECTED OUTCOME (DOWN)</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE: OUTCOME (Step 3 of each Track) */}
              {currentSlide.type === 'outcome' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Left: What Mark Outputs Live */}
                  <div
                    className="lg:col-span-7 rounded-[32px] p-6 border-2 flex flex-col justify-between"
                    style={{
                      backgroundColor: BRAND.neutral1,
                      borderColor: BRAND.darkFir,
                      boxShadow: '0 6px 0 #08251A'
                    }}
                  >
                    <div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-mono font-bold border-2 inline-block mb-3"
                        style={{ backgroundColor: BRAND.lfGreen, borderColor: BRAND.darkFir }}
                      >
                        WHAT MARK AI OUTPUTS ON SCREEN
                      </span>
                      <h3 className="text-xl font-black uppercase mb-4">Expected Live Demo Results</h3>
                      <div className="space-y-3">
                        {(currentSlide.expectedResults ?? []).map((res, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-[22px] border-2 flex items-start gap-3"
                            style={{ backgroundColor: BRAND.neutral2, borderColor: BRAND.darkFir }}
                          >
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BRAND.goodToGo }} />
                            <span className="text-sm font-bold leading-snug">{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: How This Solves Stakeholder Pain */}
                  <div
                    className="lg:col-span-5 rounded-[32px] p-6 border-2 flex flex-col justify-between"
                    style={{
                      backgroundColor: BRAND.darkFir,
                      color: BRAND.neutral1,
                      borderColor: BRAND.darkFir,
                      boxShadow: '0 6px 0 #08251A'
                    }}
                  >
                    <div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-mono font-bold inline-block mb-3"
                        style={{ backgroundColor: BRAND.lightBlue, color: BRAND.darkFir }}
                      >
                        CHALLENGER / SANDLER VALUE ANCHOR
                      </span>
                      <h3 className="text-xl font-black uppercase mb-3" style={{ color: BRAND.lfGreen }}>
                        How This Solves the Stakeholder Pain
                      </h3>
                      <p
                        className="text-sm leading-relaxed p-4 rounded-[22px] border"
                        style={{ backgroundColor: '#0D3A29', borderColor: BRAND.lfGreen }}
                      >
                        {currentSlide.painResolution}
                      </p>
                    </div>

                    <button
                      onClick={goRight}
                      disabled={hIndex === SLIDE_DECK.length - 1}
                      className="mt-6 w-full py-3.5 rounded-full font-black text-xs uppercase border-2 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ backgroundColor: BRAND.lfGreen, color: BRAND.darkFir, borderColor: BRAND.neutral1 }}
                    >
                      <span>
                        {hIndex < SLIDE_DECK.length - 1
                          ? `ADVANCE TO TRACK ${hIndex + 1} (RIGHT)`
                          : 'DEMO COMPLETE • REVIEW 2D MAP'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Speaker Teleprompter Drawer (Toggle with 'S') */}
            {showNotes && (
              <div
                className="w-full rounded-[24px] px-5 py-3 border-2 flex items-center justify-between gap-4"
                style={{
                  backgroundColor: BRAND.darkFir,
                  color: BRAND.neutral1,
                  borderColor: BRAND.darkFir
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase shrink-0"
                    style={{ backgroundColor: BRAND.lfGreen, color: BRAND.darkFir }}
                  >
                    {"MARVIN'S TELEPROMPTER"}
                  </span>
                  <p className="text-xs md:text-sm font-medium leading-snug">{currentSlide.speakerNotes}</p>
                </div>
                <span className="font-mono text-[11px] opacity-70 shrink-0">
                  {`SLIDE ${currentFlatIndex} / ${totalSlidesCount}`}
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ====================================================================
          BOTTOM REVEAL.JS 2D COMPASS & PROGRESS FOOTER
      ==================================================================== */}
      <footer
        className="w-full px-6 py-2.5 border-t-2 flex items-center justify-between z-20"
        style={{ backgroundColor: BRAND.neutral1, borderColor: BRAND.darkFir }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase">
            {`COORDINATES: TRACK ${hIndex} • STEP ${vIndex + 1}/${currentTrack.slides.length}`}
          </span>
          <div
            className="w-40 h-2.5 rounded-full border overflow-hidden"
            style={{ borderColor: BRAND.darkFir, backgroundColor: BRAND.neutral3 }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(currentFlatIndex / totalSlidesCount) * 100}%`,
                backgroundColor: BRAND.goodToGo
              }}
            />
          </div>
        </div>

        {/* Reveal.js 2D Directional Pad */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goLeft}
            disabled={hIndex === 0}
            className="p-2 rounded-full border-2 disabled:opacity-30 transition-transform active:scale-95"
            style={{ backgroundColor: BRAND.neutral3, borderColor: BRAND.darkFir }}
            title="Previous Track (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goUp}
            disabled={vIndex === 0}
            className="p-2 rounded-full border-2 disabled:opacity-30 transition-transform active:scale-95"
            style={{ backgroundColor: BRAND.neutral3, borderColor: BRAND.darkFir }}
            title="Previous Step in Track (Up Arrow)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={goDown}
            disabled={hIndex === SLIDE_DECK.length - 1 && vIndex === currentTrack.slides.length - 1}
            className="p-2 rounded-full border-2 disabled:opacity-30 transition-transform active:scale-95"
            style={{ backgroundColor: BRAND.lfGreen, borderColor: BRAND.darkFir }}
            title="Next Step in Track (Down Arrow or Space)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={goRight}
            disabled={hIndex === SLIDE_DECK.length - 1}
            className="p-2 rounded-full border-2 disabled:opacity-30 transition-transform active:scale-95"
            style={{ backgroundColor: BRAND.lfGreen, borderColor: BRAND.darkFir }}
            title="Next Track (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
