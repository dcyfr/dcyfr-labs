import { createPageMetadata } from "@/lib/metadata";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHero } from "@/components/layouts/page-hero";
import { TYPOGRAPHY, SPACING, CONTAINER_WIDTHS, getContainerClasses } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Font Pairings Demo",
  description:
    "Comparing free serif fonts paired with Geist Sans and Geist Mono for modern web design.",
  path: "/dev/font-pairings-demo",
});

// Font configuration data
const fontPairings = [
  {
    id: "gelasio",
    name: "Gelasio",
    category: "Contemporary Book Serif",
    description:
      "A modern take on old-style serifs with excellent character contrast. Balances Geist's cold precision without feeling vintage or fussy.",
    characteristics: ["High x-height", "Comfortable proportions", "Contemporary feel", "Great readability"],
    bestFor: "Body text, long-form copy under Geist headings",
    fontFamily: "Georgia, serif", // Fallback similar to Gelasio
    importUrl: "https://fonts.google.com/specimen/Gelasio",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    category: "Elegant Display Serif",
    description:
      "High-contrast elegant display serif perfect for headings. Works well on editorial or marketing pages while maintaining design hierarchy.",
    characteristics: ["High contrast", "Elegant", "Display-oriented", "Distinctive personality"],
    bestFor: "Headings, feature blocks, editorial pages",
    fontFamily: '"Playfair Display", Georgia, serif',
    importUrl: "https://fonts.google.com/specimen/Playfair+Display",
  },
  {
    id: "cardo",
    name: "Cardo",
    category: "Classical Scholarly Serif",
    description:
      "Classical serif with a scholarly tone and excellent long-form readability. Adds substance and gravitas to content-heavy layouts.",
    characteristics: ["Scholarly elegance", "Excellent readability", "Classic proportions", "Professional"],
    bestFor: "Article/body text, academic content, serious layouts",
    fontFamily: "Cardo, Georgia, serif",
    importUrl: "https://fonts.google.com/specimen/Cardo",
  },
  {
    id: "young-serif",
    name: "Young Serif",
    category: "Quirky Modern Serif",
    description:
      "Slightly quirky yet clean serif that adds warmth and personality to minimal interfaces. Brings character without sacrificing readability.",
    characteristics: ["Quirky charm", "Clean lines", "Warm personality", "Modern spirit"],
    bestFor: "Section titles, feature blocks, friendly editorial",
    fontFamily: '"Young Serif", Georgia, serif',
    importUrl: "https://fonts.google.com/specimen/Young+Serif",
  },
];

const fontLayers = [
  {
    name: "UI & Navigation",
    font: "Geist Sans",
    description: "Primary sans-serif for all interface elements, buttons, and labels",
    className: "font-sans",
    example: "Navigation · Buttons · Labels · Small Text",
  },
  {
    name: "Headings & Editorial",
    font: "Serif Choice",
    description: "Selected serif for headlines, article titles, and prominent content",
    className: "font-serif",
    example: "Headlines · Article Titles · Feature Blocks",
  },
  {
    name: "Code & Technical",
    font: "Geist Mono",
    description: "Monospace for code blocks, terminal output, and technical labels",
    className: "font-mono",
    example: "function example() { return value; }",
  },
];

export default function FontPairingsDemo() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <PageHero
        contentClassName={cn(CONTAINER_WIDTHS.content, "mx-auto")}
        title="Typography System Explorer"
        description="Comparing high-quality free serif fonts paired with Geist Sans and Geist Mono for modern web design"
        variant="standard"
      />

      <div className={getContainerClasses("content")}>
        {/* Back Link */}
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            "text-muted-foreground hover:text-foreground transition-colors",
            "mb-12"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Back Home
        </Link>

        {/* Font Layer System */}
        <section className="mb-16">
          <h2 className={cn(TYPOGRAPHY.h2.standard, "mb-8")}>Font Layer System</h2>
          <p className={cn(TYPOGRAPHY.body, SPACING.content, "mb-8")}>
            A three-layer typography system ensures clear visual hierarchy and functional clarity. Each layer serves a specific purpose in the design system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fontLayers.map((layer) => (
              <div
                key={layer.name}
                className={cn(
                  "p-6 rounded-lg border border-border bg-card",
                  "hover:shadow-md transition-shadow"
                )}
              >
                <div className={cn(TYPOGRAPHY.h3.standard, "text-base mb-2")}>
                  {layer.name}
                </div>
                <div className={cn(TYPOGRAPHY.metadata, "mb-4")}>
                  {layer.font}
                </div>
                  <p className={cn(TYPOGRAPHY.metadata, "mb-2")}>
                    {layer.description}
                  </p>
                  <div className={cn(
                    layer.className,
                    "p-4 bg-background rounded border border-border",
                    "text-sm font-medium text-foreground",
                    "break-words"
                  )}>
                    {layer.example}
                  </div>
              </div>
            ))}
          </div>
        </section>

        {/* Serif Font Comparison */}
        <section className="mb-16">
          <h2 className={cn(TYPOGRAPHY.h2.standard, "mb-8")}>Free Serif Font Options</h2>

          <div className="space-y-12">
            {fontPairings.map((pairing, index) => (
              <div key={pairing.id} className="scroll-mt-20" id={pairing.id}>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "inline-flex items-center justify-center",
                      "w-8 h-8 rounded-full bg-primary text-primary-foreground",
                      "text-xs font-semibold"
                    )}>
                      {index + 1}
                    </span>
                    <h3 className={cn(TYPOGRAPHY.h3.standard, "text-xl")}>
                      {pairing.name}
                    </h3>
                  </div>
                <p className={cn(TYPOGRAPHY.description, "ml-10")}>
                  {pairing.category}
                </p>
                </div>

                {/* Description */}
                <p className={cn(TYPOGRAPHY.body, SPACING.content, "mb-6")}>
                  {pairing.description}
                </p>

                {/* Characteristics */}
                <div className="mb-6 ml-4">
                  <p className={cn(TYPOGRAPHY.metadata, "font-semibold mb-2")}>
                    Key Characteristics:
                  </p>
                  <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {pairing.characteristics.map((char) => (
                      <li
                        key={char}
                        className={cn(
                          "text-sm text-foreground",
                          "flex items-start gap-2"
                        )}
                      >
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preview Box */}
                <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
                  {/* Sans (Geist) */}
                  <div className="p-6 border-b border-border bg-muted/50">
                    <div className={cn(TYPOGRAPHY.metadata, "font-semibold mb-2")}>
                      Geist Sans (UI & Navigation)
                    </div>
                    <div className="font-sans text-2xl font-semibold text-foreground">
                      The quick brown fox jumps over the lazy dog
                    </div>
                    <div className="font-sans text-sm text-muted-foreground mt-2">
                      123456789 | Buttons · Links · Labels
                    </div>
                  </div>

                  {/* Serif */}
                  <div className="p-6 border-b border-border">
                    <div className={cn(TYPOGRAPHY.metadata, "font-semibold mb-2")}>
                      {pairing.name} (Headings & Editorial)
                    </div>
                    <div
                      style={{ fontFamily: pairing.fontFamily }}
                      className="text-3xl font-semibold text-foreground"
                    >
                      The quick brown fox jumps over the lazy dog
                    </div>
                    <div
                      style={{ fontFamily: pairing.fontFamily }}
                      className="text-base text-muted-foreground mt-2"
                    >
                      123456789 | Headlines · Article Titles
                    </div>
                  </div>

                  {/* Mono */}
                  <div className="p-6 bg-muted/50">
                    <div className={cn(TYPOGRAPHY.metadata, "font-semibold mb-2")}>
                      Geist Mono (Code)
                    </div>
                    <div className="font-mono text-sm text-foreground break-words">
                      const example = () =&gt; &quot;Typography system&quot; 📊
                    </div>
                    <div className="font-mono text-xs text-muted-foreground mt-2">
                      Code blocks · Terminal output
                    </div>
                  </div>
                </div>

                {/* Best Use Cases */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <p className={cn(TYPOGRAPHY.metadata, "font-semibold mb-2")}>
                      Best For
                    </p>
                    <p className={cn(TYPOGRAPHY.body)}>
                      {pairing.bestFor}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <p className={cn(TYPOGRAPHY.metadata, "font-semibold mb-2")}>
                      Import from Google Fonts
                    </p>
                    <a
                      href={pairing.importUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "text-sm text-primary hover:text-primary/80",
                        "underline break-all"
                      )}
                    >
                      {pairing.name} on Google Fonts
                    </a>
                  </div>
                </div>

                {index < fontPairings.length - 1 && (
                  <div className="mt-12 pt-12 border-t border-border" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="mb-16">
          <h2 className={cn(TYPOGRAPHY.h2.standard, "mb-8")}>Implementation Guide</h2>

          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-muted/50 border border-border">
              <h3 className={cn(TYPOGRAPHY.h3.standard, "text-lg mb-4")}>
                1. Import Serif Font
              </h3>
              <pre className={cn(
                "font-mono text-sm p-4 rounded bg-background",
                "border border-border overflow-x-auto",
                "text-muted-foreground"
              )}>
                <code>{`const gelasio = Gelasio({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});`}</code>
              </pre>
            </div>

            <div className="p-6 rounded-lg bg-muted/50 border border-border">
              <h3 className={cn(TYPOGRAPHY.h3.standard, "text-lg mb-4")}>
                2. Apply Font Variables in Layout
              </h3>
              <pre className={cn(
                "font-mono text-sm p-4 rounded bg-background",
                "border border-border overflow-x-auto",
                "text-muted-foreground"
              )}>
                <code>{`<body className={\`\${geistSans.variable} \${geistMono.variable} \${gelasio.variable}\`}>
  {children}
</body>`}</code>
              </pre>
            </div>

            <div className="p-6 rounded-lg bg-muted/50 border border-border">
              <h3 className={cn(TYPOGRAPHY.h3.standard, "text-lg mb-4")}>
                3. Use in Components with Design Tokens
              </h3>
              <pre className={cn(
                "font-mono text-sm p-4 rounded bg-background",
                "border border-border overflow-x-auto",
                "text-muted-foreground"
              )}>
                <code>{`// UI & Navigation
<div className="font-sans">{content}</div>

// Headings & Editorial
<h1 className="font-serif text-4xl font-semibold">
  {title}
</h1>

// Code & Technical
<code className="font-mono text-sm">
  {codeSnippet}
</code>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className="mb-16">
          <h2 className={cn(TYPOGRAPHY.h2.standard, "mb-8")}>Design Principles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className={cn(TYPOGRAPHY.h3.standard, "text-lg mb-3")}>
                ✓ Pairing Strategy
              </h3>
              <ul className={cn("text-sm text-muted-foreground space-y-2")}>
                <li>• Use Geist Sans for UI, navigation, buttons, labels</li>
                <li>• Reserve serif for headings, editorial, long-form</li>
                <li>• Keep Geist Mono strictly for code and data</li>
                <li>• Maintain clear visual hierarchy with intentional choices</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className={cn(TYPOGRAPHY.h3.standard, "text-lg mb-3")}>
                ✓ Readability Tips
              </h3>
              <ul className={cn("text-sm text-muted-foreground space-y-2")}>
                <li>• Pick serifs with comfortable text proportions</li>
                <li>• Geist has high x-height—match with similarly proportioned serifs</li>
                <li>• Avoid cramped feeling in body copy paragraphs</li>
                <li>• Test all fonts across light and dark modes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="p-6 rounded-lg bg-muted/50 border border-border">
          <h3 className={cn(TYPOGRAPHY.h3.standard, "text-lg mb-4")}>
            Resources
          </h3>
          <ul className={cn("text-sm space-y-2")}>
            <li>
              <a
                href="https://fonts.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline"
              >
                Google Fonts Library
              </a>
            </li>
            <li>
              <a
                href="https://vercel.com/font"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline"
              >
                Vercel Font (Geist Information)
              </a>
            </li>
            <li>
              <a
                href="https://www.figma.com/resource-library/font-pairings/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline"
              >
                Figma Font Pairing Guide
              </a>
            </li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
