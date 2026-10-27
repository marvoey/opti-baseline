import type { Metadata } from "next";
import { Albert_Sans, League_Spartan } from "next/font/google";
import Script from "next/script";
import OptimizelyActivation from "./_components/OptimizelyActivation";
import { QuickLinks } from "./_components/QuickLinks";
import DevQuickLinks from "./_components/DevQuickLinks";
import PagesWidget from "./_components/PagesWidget";
import RecordingStatus from "./_components/RecordingStatus";
import UtilityTray from "./_components/UtilityTray";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";
import "@/cms/registry";

// ESL brand faces: Albert Sans for display and body, League Spartan for eyebrows.
const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
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
      className={`${albertSans.variable} ${leagueSpartan.variable} h-full antialiased`}
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
        <UtilityTray>
          <DevQuickLinks />
          <PagesWidget />
          <RecordingStatus />
        </UtilityTray>
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
