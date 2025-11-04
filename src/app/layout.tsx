import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "./print.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DOMAIN,
  SITE_DESCRIPTION,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/back-to-top";
import { LoadingBar } from "@/components/loading-bar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — " + SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_TITLE,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${SITE_DOMAIN} — Developer Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [getTwitterImageUrl()],
  },
  icons: {
    icon: [
      { url: "/icon/light", media: "(prefers-color-scheme: light)" },
      { url: "/icon/dark", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [
      { url: "/apple-icon/light", media: "(prefers-color-scheme: light)" },
      { url: "/apple-icon/dark", media: "(prefers-color-scheme: dark)" },
    ],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
      "application/atom+xml": `${SITE_URL}/atom.xml`,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get nonce from middleware for CSP-compliant theme injection
  const nonce = (await headers()).get("x-nonce") || undefined;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem nonce={nonce}>
          <LoadingBar />
          <SiteHeader />
          <main className="min-h-[calc(100dvh-128px)] px-4 sm:px-6 md:px-8 pb-20 md:pb-8">{children}</main>
          <SiteFooter />
          <BottomNav />
          <BackToTop />
          <Toaster richColors position="top-center" />
          {/* Vercel Analytics & Speed Insights */}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
