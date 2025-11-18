import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { resume } from "@/data/resume";
import { getOgImageUrl } from "@/lib/site-config";
import { Logo } from "@/components/logo";
import { getAboutPageSchema, getJsonLdScriptProps } from "@/lib/json-ld";
import { headers } from "next/headers";
import { ExternalLink } from "lucide-react";
import { AboutAvatar } from "@/components/about-avatar";
import { AboutStats } from "@/components/about-stats";
import { AboutSkills } from "@/components/about-skills";
import { AboutCertifications } from "@/components/about-certifications";
import { AboutCurrentlyLearning } from "@/components/about-currently-learning";
import { SocialLinksGrid } from "@/components/sections/social-links-grid";
import { 
  TYPOGRAPHY, 
  SPACING,
  HOVER_EFFECTS,
  PAGE_LAYOUT,
} from "@/lib/design-tokens";
import { PageLayout } from "@/components/layouts/page-layout";
import { createPageMetadata } from "@/lib/metadata";

const pageTitle = "About";
const pageDescription = "Learn about Drew, a cybersecurity architect with 5+ years leading security programs, incident response, and building secure development practices.";

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/about",
});

export default async function AboutPage() {
  const currentRole = resume.experience[0];
  
  // Get nonce from proxy for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // JSON-LD structured data for about page
  const socialImage = getOgImageUrl(pageTitle, pageDescription);
  const jsonLd = getAboutPageSchema(pageDescription, socialImage);

  return (
    <PageLayout>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      
      {/* Page Hero */}
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={`${PAGE_LAYOUT.hero.content}`}>
          <div className="flex items-center gap-4 md:gap-6">
            <AboutAvatar size="md" />
            <h1 className={`${TYPOGRAPHY.h1.standard} flex items-center gap-2`}>
              I&apos;m Drew <Logo width={24} height={24} />
            </h1>
          </div>
          <p className={TYPOGRAPHY.description}>
            {resume.shortSummary}
          </p>
        </div>
      </section>
      
      {/* Stats Showcase */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <AboutStats />
        </div>
      </section>
      
      {/* About Me */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <h2 className={TYPOGRAPHY.h2.standard}>What drives me</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              My passion for cybersecurity stems from a deep-seated curiosity about technology and a commitment to making the digital world a safer place. I thrive on solving complex problems, staying ahead of emerging threats, and continuously learning in this ever-evolving field.
            </p>
            <p>
              Beyond the technical aspects, I believe that effective cybersecurity is about people—educating users, fostering a security-first culture, and collaborating across teams to build resilient systems. I&apos;m dedicated to empowering organizations to protect their assets while enabling innovation and growth.
            </p>
            <p>
              When I&apos;m not immersed in security challenges, you can find me exploring the latest tech trends, contributing to open-source projects, or sharing insights through writing and speaking engagements. I&apos;m always eager to connect with fellow professionals and enthusiasts who share my passion for cybersecurity.
            </p>
          </div>
        </div>
      </section>
      
      {/* Professional Background */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <h2 className={TYPOGRAPHY.h2.standard}>Professional Background</h2>
          <p className="text-muted-foreground mb-4">
            With over 5 years of experience in the cybersecurity industry, I have had the privilege of working with diverse organizations ranging from startups to established enterprises. My journey has equipped me with a comprehensive understanding of security frameworks, risk management, and incident response strategies.
          </p>
          <div className="flex items-center">
            <Link 
              className={`inline-flex items-center gap-2 text-primary ${HOVER_EFFECTS.link}`}
              href="/resume"
            >
              View full resume
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
        
      {/* Current Role */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <h2 className={TYPOGRAPHY.h2.standard}>Currently at {currentRole.company}</h2>
          <Card className="p-5 space-y-3">
            <div className="space-y-1">
              <p className="font-medium text-lg">{currentRole.title}</p>
              <p className="text-sm text-muted-foreground">{currentRole.duration}</p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              {currentRole.responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
      
      {/* Currently Learning */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <AboutCurrentlyLearning />
        </div>
      </section>
      
      {/* Skills & Expertise */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <AboutSkills />
        </div>
      </section>
      
      {/* Certifications */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <AboutCertifications />
        </div>
      </section>
      
      {/* Connect with Me */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <h2 className={TYPOGRAPHY.h2.standard}>Connect with me</h2>
          <p className="text-muted-foreground mb-4">
            I&apos;m open to connecting with fellow builders, sharing knowledge, and exploring new opportunities. Feel free to reach out through any of the platforms below!
          </p>
          <SocialLinksGrid />
        </div>
      </section>
    </PageLayout>
  );
}
