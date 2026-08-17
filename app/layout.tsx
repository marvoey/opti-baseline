import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import OptimizelyActivation from "./_components/OptimizelyActivation";
import { QuickLinks } from "./_components/QuickLinks";
import DevQuickLinks from "./_components/DevQuickLinks";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";
import "@/cms/registry";

// Living Spaces uses Source Sans Pro (now Source Sans 3) throughout.
const displayFont = Source_Sans_3({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
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
        <QuickLinks />
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
