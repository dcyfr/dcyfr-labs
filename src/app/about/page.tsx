import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resume } from "@/data/resume";
import {
  SITE_TITLE,
  SITE_URL,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";

const pageTitle = "About";
const pageDescription = resume.shortSummary;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: `${pageTitle} — ${SITE_TITLE}`,
    description: pageDescription,
    url: `${SITE_URL}/about`,
    siteName: SITE_TITLE,
    type: "profile",
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

export default function AboutPage() {
  const currentRole = resume.experience[0];

  return (
    <div className="mx-auto max-w-3xl py-12 md:py-16 space-y-12">
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Hi, I&apos;m Drew.</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          {resume.shortSummary}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/resume">View my resume</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">What drives me</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>
            I build approachable security programs that help teams ship quickly
            without sacrificing resilience. I enjoy pairing technical work like
            threat hunting and vulnerability management with coaching that
            brings the whole organization along for the journey.
          </p>
          <p>
            Over the past few years I&apos;ve led audits, run incident response
            teams, and shipped the policies that keep global engineering orgs
            aligned. The goal is always the same: make security feel like a
            multiplier instead of a blocker.
          </p>
          <p>
            Outside the office you&apos;ll find me mentoring, hosting community
            events, and tinkering with the tools that keep defenders a step
            ahead. I like turning that curiosity into clear guidance for the
            teams I support.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">Currently</h2>
        <Card className="p-6 space-y-3">
          <div className="space-y-1">
            <p className="font-medium text-lg">{currentRole.title}</p>
            <p className="text-sm text-muted-foreground">
              {currentRole.company} • {currentRole.duration}
            </p>
          </div>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            {currentRole.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
