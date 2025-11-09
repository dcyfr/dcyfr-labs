import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resume } from "@/data/resume";
import { CollapsibleCertifications } from "@/components/collapsible-certifications";
import { highlightMetrics } from "@/lib/highlight-metrics";
import {
  SITE_TITLE,
  SITE_URL,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";

const pageTitle = "Resume";
// Optimized meta description (157 characters)
const pageDescription = "Professional resume for Drew - cybersecurity architect with expertise in risk management, incident response, cloud security, and compliance (ISO 27001, SOC2).";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: `${pageTitle} — ${SITE_TITLE}`,
    description: pageDescription,
    url: `${SITE_URL}/resume`,
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

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-4xl py-12 md:py-16 px-4 sm:px-6 md:px-8 space-y-7 print:py-8 print:px-0" aria-label="Resume">
      {/* hero section */}
      <header className="prose space-y-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">Drew&apos;s Resume</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          {resume.summary}
        </p>
      </header>
      {/* experience */}
      <section className="space-y-4" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="text-xl md:text-2xl font-medium font-serif">Experience</h2>
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
      </section>
      {/* education & certifications */}
      <section className="space-y-4" aria-labelledby="education-heading">
        <h2 id="education-heading" className="text-xl md:text-2xl font-medium font-serif">Education &amp; Certifications</h2>
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
      </section>
      {/* skills */}
      <section className="space-y-4" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="text-xl md:text-2xl font-medium font-serif">Skills</h2>

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
      </section>
    </main>
  );
}
