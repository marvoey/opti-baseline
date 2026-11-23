import type { Metadata } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import Script from "next/script";
import OptimizelyActivation from "./_components/OptimizelyActivation";
import DevQuickLinks from "./_components/DevQuickLinks";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";
import "@/cms/registry";

// VC Nudge (headlines) and Die Grotesk B (body) are licensed faces. The Optimizely Brand Pack
// names Roboto Condensed and Roboto as their fallbacks, the same pair /setup-guide uses.
const displayFont = Roboto_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const bodyFont = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  // Makes og:image / canonical URLs absolute, which link unfurlers (Teams, Slack) require.
  metadataBase: new URL(process.env.DEPLOYED_URL || `http://localhost:${process.env.PORT || 3009}`),
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

// Optimizely Web Experimentation / Personalization project id. Public by design
// (it ends up in a client-side script URL), so it uses the NEXT_PUBLIC_ prefix.
// When unset, the snippet is simply not loaded — the app runs without it.
const WEB_SNIPPET_ID = process.env.NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/*
          Optimizely Web Experimentation snippet, loaded via next/script.

          Strategy is `afterInteractive` (NOT beforeInteractive / a sync <head>
          script): the Web snippet mutates the DOM, and running it before React
          hydrates rewrites the SSR markup, causing hydration mismatches that make
          React revert the experiment. afterInteractive applies experiments after
          hydration — some flicker, but React stays stable. For flicker-free,
          React-native experimentation use Optimizely Feature Experimentation
          (server-side / React SDK) instead of this DOM-mutation snippet.

          The project id comes from NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID; without
          it, neither the snippet nor the route-change re-activation is rendered.
        */}
        {/* <QuickLinks /> */}
        <DevQuickLinks />
        {WEB_SNIPPET_ID && (
          <>
            <Script
              src={`https://cdn.optimizely.com/js/${WEB_SNIPPET_ID}.js`}
              strategy="afterInteractive"
            />
            <OptimizelyActivation />
          </>
        )}
      </body>
    </html>
  );
}
