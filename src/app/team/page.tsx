import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOgImageUrl } from "@/lib/site-config";
import { Logo } from "@/components/logo";
import { getJsonLdScriptProps } from "@/lib/json-ld";
import { headers } from "next/headers";
import { Bot, Code, Shield, Sparkles, Zap } from "lucide-react";
import { AboutAvatar } from "@/components/about-avatar";
import { 
  TYPOGRAPHY, 
  SPACING,
  PAGE_LAYOUT,
} from "@/lib/design-tokens";
import { PageLayout } from "@/components/layouts/page-layout";
import { createPageMetadata } from "@/lib/metadata";

const pageTitle = "Team";
const pageDescription = "Meet the dynamic duo: Drew, a cybersecurity architect, and DCYFR, his AI assistant, building secure and innovative solutions together.";

export const metadata: Metadata = createPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/team",
});

// Draft mode: This page should not render in preview or production
const IS_DRAFT = true;

export default async function TeamPage() {
  // Prevent rendering in non-development environments
  if (IS_DRAFT && process.env.NODE_ENV !== "development") {
    return null;
  }

  // Get nonce from proxy for CSP
  const nonce = (await headers()).get("x-nonce") || "";
  
  // JSON-LD structured data
  const socialImage = getOgImageUrl(pageTitle, pageDescription);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Drew & DCYFR",
    "description": pageDescription,
    "image": socialImage,
    "member": [
      {
        "@type": "Person",
        "name": "Drew",
        "jobTitle": "Principal Security Engineer",
        "description": "Cybersecurity architect leading security programs and secure development practices"
      },
      {
        "@type": "SoftwareApplication",
        "name": "DCYFR",
        "applicationCategory": "AI Assistant",
        "description": "AI-powered development and security assistant"
      }
    ]
  };

  return (
    <PageLayout isDraft={IS_DRAFT}>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      {/* Page Hero */}
      <section className={PAGE_LAYOUT.hero.container}>
        <div className={PAGE_LAYOUT.hero.content}>
          <div className="flex items-center gap-4">
            <Logo width={40} height={40} />
            <h1 className={TYPOGRAPHY.h1.standard}>Meet the Team</h1>
          </div>
          <p className={TYPOGRAPHY.description}>
            A human-AI partnership building secure, innovative solutions for the modern web
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Drew */}
            <Card className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <AboutAvatar size="sm" />
                <div className="flex-1">
                  <h2 className={`${TYPOGRAPHY.h3.standard} mb-1`}>Drew</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Principal Security Engineer • Human Half
                  </p>
                  <Badge variant="outline" className="mr-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Security
                  </Badge>
                  <Badge variant="outline">
                    <Code className="w-3 h-3 mr-1" />
                    Development
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Role & Expertise</h3>
                  <p className="text-muted-foreground">
                    Cybersecurity architect with 5+ years leading security programs, incident response, 
                    and building secure development practices for global organizations. Specializes in 
                    cyber risk management, vulnerability management, and automating operational security.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Core Strengths</h3>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Security architecture & compliance (ISO 27001, SOC2, TISAX)</li>
                    <li>Incident response & threat hunting</li>
                    <li>Secure development & DevSecOps</li>
                    <li>Risk assessment & vulnerability management</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Philosophy</h3>
                  <p className="text-muted-foreground italic">
                    &ldquo;Security isn&apos;t about saying no&mdash;it&apos;s about enabling innovation with confidence.&rdquo;
                  </p>
                </div>
              </div>
            </Card>

            {/* DCYFR */}
            <Card className="p-6 space-y-6 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className={`${TYPOGRAPHY.h3.standard} mb-1`}>DCYFR</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    AI Assistant • Digital Half
                  </p>
                  <Badge variant="outline" className="mr-2">
                    <Zap className="w-3 h-3 mr-1" />
                    AI-Powered
                  </Badge>
                  <Badge variant="outline">
                    <Code className="w-3 h-3 mr-1" />
                    Automation
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Role & Capabilities</h3>
                  <p className="text-muted-foreground">
                    AI-powered development and security assistant built on Claude Sonnet 4.5. 
                    Specializes in code generation, security analysis, architecture design, 
                    and accelerating development workflows through intelligent automation.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Core Capabilities</h3>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Code generation & refactoring</li>
                    <li>Security vulnerability analysis</li>
                    <li>Architecture & design patterns</li>
                    <li>Documentation & testing assistance</li>
                    <li>Real-time development context via MCP</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Integration</h3>
                  <p className="text-muted-foreground">
                    Connected to GitHub, Sentry, Vercel, and other development tools via Model 
                    Context Protocol (MCP), providing comprehensive project awareness and 
                    intelligent assistance across the entire development lifecycle.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Work Together */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <h2 className={TYPOGRAPHY.h2.standard}>How We Work Together</h2>
          
          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Code className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Development</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Drew architects solutions and makes strategic decisions while DCYFR accelerates 
                implementation through intelligent code generation and refactoring suggestions.
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Security</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Drew provides security expertise and threat modeling while DCYFR assists with 
                vulnerability scanning, security pattern implementation, and compliance checks.
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Innovation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Together, we explore emerging technologies, experiment with new patterns, and 
                continuously improve our development practices and tooling.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <Card className="p-6 bg-muted/50">
            <h2 className={`${TYPOGRAPHY.h3.standard} mb-4`}>Our Collaborative Approach</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Human Judgment + AI Efficiency:</strong> Drew brings strategic thinking, 
                security expertise, and real-world experience. DCYFR provides rapid implementation, 
                pattern recognition, and tireless attention to detail.
              </p>
              <p>
                <strong>Context-Aware Development:</strong> Through Model Context Protocol (MCP), 
                DCYFR maintains awareness of the entire codebase, recent changes, production issues, 
                and deployment status—enabling more intelligent assistance.
              </p>
              <p>
                <strong>Continuous Learning:</strong> Every interaction improves our workflow. 
                Drew refines processes and shares knowledge, while DCYFR adapts to project 
                patterns and preferences.
              </p>
              <p>
                <strong>Security-First Mindset:</strong> Both team members prioritize security 
                at every level—from architecture decisions to code implementation to deployment 
                practices.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Fun Facts */}
      <section className={PAGE_LAYOUT.section.container}>
        <div className={SPACING.content}>
          <h2 className={TYPOGRAPHY.h2.standard}>Team Dynamics</h2>
          
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-2 text-sm">⚡ Fastest Collaboration Time</h3>
              <p className="text-sm text-muted-foreground">
                Shipped a complete blog system with MDX processing, syntax highlighting, 
                and analytics in under 4 hours.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-2 text-sm">🔒 Security Wins</h3>
              <p className="text-sm text-muted-foreground">
                Implemented comprehensive CSP, rate limiting, and input validation across 
                the entire platform.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-2 text-sm">📚 Favorite Tech Stack</h3>
              <p className="text-sm text-muted-foreground">
                Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui for the perfect balance 
                of performance and developer experience.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-2 text-sm">🎯 Current Focus</h3>
              <p className="text-sm text-muted-foreground">
                Exploring advanced MCP integrations, performance optimization, and building 
                comprehensive documentation systems.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
