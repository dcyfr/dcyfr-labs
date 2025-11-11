import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { resume } from "@/data/resume";
import { socialLinks } from "@/data/socials";
import {
  SITE_TITLE,
  SITE_URL,
  getOgImageUrl,
  getTwitterImageUrl,
} from "@/lib/site-config";
import { Logo } from "@/components/logo";
import { getAboutPageSchema, getJsonLdScriptProps } from "@/lib/json-ld";
import { headers } from "next/headers";
import { Github, Linkedin, Heart, Users, BookOpen, Home, Mail, Calendar, Award, GraduationCap, ExternalLink } from "lucide-react";
import { AboutAvatar } from "@/components/about-avatar";
import { AboutStats } from "@/components/about-stats";
import { AboutSkills } from "@/components/about-skills";
import { AboutCertifications } from "@/components/about-certifications";
import { AboutCurrentlyLearning } from "@/components/about-currently-learning";
import { 
  getContainerClasses, 
  TYPOGRAPHY, 
  SPACING,
  HOVER_EFFECTS
} from "@/lib/design-tokens";

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
      <div className={`${getContainerClasses('prose')} ${SPACING.section}`}>
      {/* page hero */}
      <div className={`${SPACING.proseHero}`}>
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
      
      {/* stats showcase */}
      <AboutStats />
      
      {/* about me */}
      <section className={`prose ${SPACING.content}`}>
        <h2 className={TYPOGRAPHY.h2.standard}>What drives me</h2>
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
      
      {/* professional background */}
      <section className={SPACING.content}>
        <h2 className={TYPOGRAPHY.h2.standard}>Professional Background</h2>
        <p className="text-muted-foreground mb-4">
          I bring 5+ years of hands-on experience across security engineering, architecture, and leadership roles. 
          My career has spanned diverse industries including healthcare, finance, and technology, where I&apos;ve built and scaled security programs from the ground up.
        </p>
        <div className="flex items-center">
          <Link 
            className={`inline-flex items-center gap-2 text-primary ${HOVER_EFFECTS.link}`}
            href="/resume"
          >
            View full resume and work history
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
        
      {/* current role */}
      <section className={SPACING.content}>
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
      </section>
      
      {/* currently learning */}
      <AboutCurrentlyLearning />
      
      {/* skills & expertise */}
      <AboutSkills />
      
      {/* certifications */}
      <AboutCertifications />
      
      {/* call to action & socials */}
      <section className={SPACING.content}>
        <h2 className={TYPOGRAPHY.h2.standard}>Connect with me</h2>
        <p className="text-muted-foreground">
          I&apos;m open to connecting with fellow builders, sharing knowledge, and exploring new opportunities. Feel free to reach out through any of the platforms below!
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {socialLinks.map((social) => {
            // Map platform to icon component
            const IconComponent = social.platform === "homepage" ? Home
              : social.platform === "email" ? Mail
              : social.platform === "calendar" ? Calendar
              : social.platform === "linkedin" ? Linkedin
              : social.platform === "github" ? Github
              : social.platform === "github-sponsor" ? Heart
              : social.platform === "peerlist" ? Users
              : social.platform === "goodreads" ? BookOpen
              : social.platform === "credly" ? Award
              : social.platform === "orcid" ? GraduationCap
              : ExternalLink;

            // Determine if this is an internal link
            const isInternalLink = social.url.startsWith('/') || 
              (social.url.includes('cyberdrew.dev') && (
                social.url.endsWith('/') || 
                social.url.endsWith('/contact')
              ));
            
            // Get the internal path for homepage and contact
            const internalPath = social.platform === "homepage" ? "/" 
              : social.platform === "email" ? "/contact" 
              : social.url;

            // Render internal links with Link component
            if (isInternalLink && (social.platform === "homepage" || social.platform === "email")) {
              return (
                <Link
                  key={social.platform}
                  href={internalPath}
                  className="group"
                >
                  <Card className="p-4 h-full transition-colors hover:border-primary">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent 
                          className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" 
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">
                          {social.label}
                        </p>
                        {social.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {social.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            }

            // Render external links with <a> tag
            return (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="p-4 h-full transition-colors hover:border-primary">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <IconComponent 
                        className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" 
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {social.label}
                      </p>
                      {social.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {social.description}
                        </p>
                      )}
                    </div>
                    <ExternalLink 
                      className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" 
                      aria-hidden="true"
                    />
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      </section>
      </div>
    </>
  );
}
