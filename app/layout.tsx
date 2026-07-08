import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import Script from "next/script";
import OptimizelyActivation from "./_components/OptimizelyActivation";
import DevQuickLinks from "./_components/DevQuickLinks";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";
import "@/cms/registry";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <DevQuickLinks />
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
        {WEB_SNIPPET_ID && (
          <>
            <Script
              src={`https://cdn.optimizely.com/js/${WEB_SNIPPET_ID}.js`}
              strategy="afterInteractive"
            />
            {/* Re-activate the Web snippet on client-side route changes (soft navigations). */}
            <OptimizelyActivation />
          </>
        )}
      </body>
    </html>
  );
}
