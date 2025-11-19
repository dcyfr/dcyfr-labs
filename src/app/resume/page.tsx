import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resume } from "@/data/resume";
import { CollapsibleCertifications } from "@/components/collapsible-certifications";
import { highlightMetrics } from "@/lib/highlight-metrics";
import { TYPOGRAPHY, PAGE_LAYOUT, SPACING } from "@/lib/design-tokens";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHero } from "@/components/layouts/page-hero";
import { createPageMetadata } from "@/lib/metadata";

const pageTitle = "Resume";
const pageDescription = "Professional resume for Drew - cybersecurity architect with expertise in risk management, incident response, cloud security, and compliance (ISO 27001, SOC2).";

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/resume",
});

export default function ResumePage() {
  return (
    <PageLayout>
      <PageHero
        title="Drew's Resume"
        description={resume.summary}
      />

      {/* Experience */}
      <section className={PAGE_LAYOUT.section.container} aria-labelledby="experience-heading">
          <div className={SPACING.content}>
            <h2 id="experience-heading" className={TYPOGRAPHY.h2.standard}>Experience</h2>
            <div className="space-y-4">
              {resume.experience.map((exp, index) => (
                <Card key={index} className="p-5">
                  <article>
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="font-medium text-lg">{exp.title} at {exp.company}</h3>
                      <time className="text-sm text-muted-foreground mt-1 md:mt-0">{exp.duration}</time>
                    </header>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>{highlightMetrics(resp)}</li>
                      ))}
                    </ul>
                  </article>
                </Card>
              ))}
            </div>
          </div>
      </section>

      {/* Education & Certifications */}
      <section className={PAGE_LAYOUT.section.container} aria-labelledby="education-heading">
        <div className={SPACING.content}>
          <h2 id="education-heading" className={TYPOGRAPHY.h2.standard}>Education &amp; Certifications</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-5">
                <div className="space-y-3">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}
                        {edu.duration ? ` • ${edu.duration}` : ""}
                      </p>
                      {edu.highlights && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {edu.highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <CollapsibleCertifications certifications={resume.certifications} />
              </Card>
            </div>
          </div>
      </section>

      {/* Skills */}
      <section className={PAGE_LAYOUT.section.container} aria-labelledby="skills-heading">
        <div className={SPACING.content}>
          <h2 id="skills-heading" className={TYPOGRAPHY.h2.standard}>Skills</h2>
            <div className="space-y-3">
              {resume.skills.map((skillCategory, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-muted-foreground font-medium text-sm">
                    {skillCategory.category}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {skillCategory.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>
    </PageLayout>
  );
}
