import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ContactFormErrorBoundary } from "@/components/contact-form-error-boundary";
import {
  SITE_TITLE,
  SITE_URL,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { getContactPageSchema, getJsonLdScriptProps } from "@/lib/json-ld";
import { headers } from "next/headers";

const pageTitle = "Contact";
// Optimized meta description (143 characters)
const pageDescription = "Get in touch for cybersecurity consulting, collaboration opportunities, or questions about security architecture and development.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: `${pageTitle} — ${SITE_TITLE}`,
    description: pageDescription,
    url: `${SITE_URL}/contact`,
    siteName: SITE_TITLE,
    type: "website",
    images: [
      {
        url: getOgImageUrl(pageTitle, pageDescription),
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${pageTitle} — ${SITE_TITLE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} — ${SITE_TITLE}`,
    description: pageDescription,
    images: [getTwitterImageUrl(pageTitle, pageDescription)],
  },
};

export default async function ContactPage() {
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // JSON-LD structured data for contact page
  const jsonLd = getContactPageSchema(pageDescription);

  return (
    <>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      <div className="mx-auto max-w-2xl py-14 md:py-20 px-4 sm:px-6 md:px-8">
      {/* page hero */}
      <div className="prose space-y-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">Contact Me</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          I&apos;d love to hear from you! Whether you have a question, a project idea, or just want to say hello, feel free to reach out using the form below.
        </p>
      </div>
      {/* contact form */}
      <ContactFormErrorBoundary>
        <ContactForm />
      </ContactFormErrorBoundary>
    </div>
    </>
  );
}
