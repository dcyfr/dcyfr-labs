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
import { Logo } from "@/components/logo";
import { getAboutPageSchema, getJsonLdScriptProps } from "@/lib/json-ld";
import { headers } from "next/headers";

const pageTitle = "About";
// Optimized meta description (154 characters)
const pageDescription = "Learn about Drew, a cybersecurity architect with 5+ years leading security programs, incident response, and building secure development practices.";

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

export default async function AboutPage() {
  const currentRole = resume.experience[0];
  
  // Get nonce from middleware for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // JSON-LD structured data for about page
  const socialImage = getOgImageUrl(pageTitle, pageDescription);
  const jsonLd = getAboutPageSchema(pageDescription, socialImage);

  return (
    <>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      <div className="mx-auto max-w-3xl py-12 md:py-16 space-y-12">
      {/* page hero */}
      <div className="prose space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-serif flex items-center gap-2">I&apos;m Drew <Logo width={24} height={24} className="ml-2" /></h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          {resume.shortSummary}
        </p>
      </div>
      {/* about me */}
      <section className="prose space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">What drives me</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>
            My passion lies in helping organizations build resilient security programs that empower teams to move fast and stay secure. I believe security must be an enabler, not a bottleneck, and I strive to create solutions that balance risk management with business agility.
          </p>
          <p>
            Throughout my career, I have dedicated myself to fostering a culture of security awareness and continuous improvement. I enjoy collaborating with cross-functional teams to identify vulnerabilities, implement robust security frameworks, and deliver technical solutions that scale.
          </p>
          <p>
            Outside of work, I consider myself an avid tinkerer who loves exploring new technologies and staying up-to-date with the latest trends in cybersecurity. I am always eager to learn, grow, and share my experience with others.
          </p>
        </div>
      </section>
      {/* current role */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">Currently at {currentRole.company}</h2>
        <Card className="p-6 space-y-3">
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
      </section>
      {/* previous roles */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-medium">Previously</h2>
        <div className="space-y-6">
          {resume.experience.slice(1,4).map((role, idx) => (
            <Card key={idx} className="p-6 space-y-3">
              <div className="space-y-1">
                <p className="font-medium text-lg">{role.title} at {role.company}</p>
                <p className="text-sm text-muted-foreground">{role.duration}</p>
              </div>
              {/* <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                {role.responsibilities.map((item, rIdx) => (
                  <li key={rIdx}>{item}</li>
                ))}
              </ul> */}
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link className="text-sm text-primary underline" href="/resume">
            View my full resume
          </Link>
        </div>
      </section>
      {/* call to action */}
      <div className="mx-auto max-w-2xl mt-24 text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-medium italic">Let&apos;s connect!</h2>
        <p className="text-muted-foreground">
          I&apos;m always open to discussing new opportunities, collaborations, or just chatting about all things security. Feel free to reach out!
        </p>
        <Button asChild>
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
    </>
  );
}
