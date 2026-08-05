import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import Script from "next/script";
import OptimizelyActivation from "./_components/OptimizelyActivation";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";
import "@/cms/registry";

// Source Serif 4 — editorial serif for wealth management headings.
const displayFont = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

// Inter — clean grotesque for body text and UI.
const bodyFont = Inter({
  variable: "--font-body",
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
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/*
          Optimizely Web Experimentation snippet, loaded via next/script.
          Strategy is `afterInteractive` to avoid hydration mismatches.
          The project id comes from NEXT_PUBLIC_OPTIMIZELY_WEB_SNIPPET_ID.
        */}
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
