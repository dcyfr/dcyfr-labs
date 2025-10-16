import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resume } from "@/data/resume";
import {
  SITE_TITLE,
  SITE_URL,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";

const pageTitle = "Resume";
const pageDescription = resume.summary;

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
    <div className="mx-auto max-w-4xl py-12 md:py-16 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Resume</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          {resume.summary}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">Experience</h2>
        <div className="space-y-4">
          {resume.experience.map((exp, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h3 className="font-medium text-lg">{exp.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 md:mt-0">
                  {exp.company} • {exp.duration}
                </p>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">Education &amp; Certifications</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-medium mb-3">Education</h3>
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

          <Card className="p-6">
            <h3 className="font-medium mb-3">Certifications</h3>
            <div className="space-y-3">
              {resume.certifications.map((certCategory, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-muted-foreground font-medium text-sm">
                    {certCategory.provider}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {certCategory.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {certCategory.certifications.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{certCategory.certifications.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">Skills</h2>
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
    </div>
  );
}
