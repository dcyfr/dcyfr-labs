import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resume, getSummary } from "@/data/resume";
import { CollapsibleCertifications } from "@/components/collapsible-certifications";
import { CollapsibleSkills } from "@/components/collapsible-skills";
import { CollapsibleEducation } from "@/components/collapsible-education";
import { highlightMetrics } from "@/lib/highlight-metrics";
import { TYPOGRAPHY, PAGE_LAYOUT, SPACING, HOVER_EFFECTS } from "@/lib/design-tokens";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHero } from "@/components/layouts/page-hero";
import { createPageMetadata } from "@/lib/metadata";
import { getResumePageSchema, getJsonLdScriptProps } from "@/lib/json-ld";
import { DownloadResumeButton } from "@/components/download-resume-button";
import { ResumeStats } from "@/components/resume-stats";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ResumeSectionNav } from "@/components/resume-section-nav";
import { BackToTop } from "@/components/back-to-top";
import dynamic from "next/dynamic";

const ScrollReveal = dynamic(() => import("@/components/scroll-reveal").then(mod => ({ default: mod.ScrollReveal })), {
  loading: () => <div className="contents" />,
  ssr: true,
});

const pageTitle = "Resume";
const pageDescription = "Professional resume for Drew - cybersecurity architect with expertise in risk management, incident response, cloud security, and compliance (ISO 27001, SOC2).";

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/resume",
});

// Company website URLs for linking
const companyUrls: Record<string, string> = {
  "Monks": "https://monks.com/",
  "Creative Breakthroughs, Inc.": "https://convergetp.com/our-story/cbi/",
  "Escambia County Commissioners Office": "https://myescambia.com/",
};

export default async function ResumePage() {
  // Get nonce from proxy for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // JSON-LD structured data for resume page
  const jsonLd = getResumePageSchema(
    pageDescription,
    resume.experience.slice(0, 3) // Include top 3 positions for schema
  );

  return (
    <PageLayout>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      <div className="space-y-10 md:space-y-14">
      <PageHero
        title="Drew's Resume"
        description={getSummary()}
      />
      
      {/* Download Button 
      <ScrollReveal animation="fade-up" delay={0}>
        <div className="flex justify-center -mt-4 mb-8">
          <DownloadResumeButton />
        </div>
      </ScrollReveal> */}

      {/* Stats Overview */}
      <section className={PAGE_LAYOUT.section.container}>
        <ScrollReveal animation="fade-up" delay={50}>
          <div className={SPACING.content}>
            <ResumeStats />
          </div>
        </ScrollReveal>
      </section>

      {/* Section Navigation 
      <section className={PAGE_LAYOUT.section.container}>
        <ScrollReveal animation="fade-up" delay={100}>
          <div className={SPACING.content}>
            <ResumeSectionNav />
          </div>
        </ScrollReveal>
      </section> */}

      {/* Experience */}
      <section id="experience" className={PAGE_LAYOUT.section.container} aria-labelledby="experience-heading">
        <ScrollReveal animation="fade-up" delay={150}>
          <div className={SPACING.content}>
            <h2 id="experience-heading" className={TYPOGRAPHY.h2.standard}>Experience</h2>
            <ExperienceTimeline experiences={resume.experience} companyUrls={companyUrls} />
          </div>
        </ScrollReveal>
      </section>

      {/* Education & Certifications */}
      <section id="education" className={PAGE_LAYOUT.section.container} aria-labelledby="education-heading">
        <ScrollReveal animation="fade-up" delay={200}>
          <div className={SPACING.content}>
            <h2 id="education-heading" className={TYPOGRAPHY.h2.standard}>Education &amp; Certifications</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-5">
                <CollapsibleEducation education={resume.education} />
              </Card>
              <Card className="p-5">
                <CollapsibleCertifications certifications={resume.certifications} />
              </Card>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Skills */}
      <section id="skills" className={PAGE_LAYOUT.section.container} aria-labelledby="skills-heading">
        <ScrollReveal animation="fade-up" delay={250}>
          <div className={SPACING.content}>
            <h2 id="skills-heading" className={TYPOGRAPHY.h2.standard}>Skills</h2>
            <CollapsibleSkills skills={resume.skills} />
          </div>
        </ScrollReveal>
      </section>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </PageLayout>
  );
}
