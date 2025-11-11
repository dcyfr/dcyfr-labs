import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resume } from "@/data/resume";
import { ExternalLink } from "lucide-react";
import { TYPOGRAPHY } from "@/lib/design-tokens";

/**
 * About Certifications Component
 * 
 * Displays professional certifications grouped by provider with
 * visual badges and links to verification (Credly).
 * 
 * @component
 * @example
 * ```tsx
 * <AboutCertifications />
 * ```
 */

/**
 * Get Credly profile URL based on provider
 * GIAC, CompTIA, and ISC2 certifications are verified on Credly
 */
function getCredlyUrl(provider: string): string | null {
  const credlyLinks: Record<string, string> = {
    "GIAC": "https://www.credly.com/users/dcyfr",
    "CompTIA": "https://www.credly.com/users/dcyfr",
    "ISC2": "https://www.credly.com/users/dcyfr",
    // Mile2 certifications use a different verification system
  };
  
  return credlyLinks[provider] || null;
}

/**
 * Individual certification provider card
 */
function CertificationCard({ provider, certifications }: { provider: string; certifications: string[] }) {
  const credlyUrl = getCredlyUrl(provider);
  
  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="font-medium text-lg">{provider}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {certifications.length} {certifications.length === 1 ? 'certification' : 'certifications'}
            </p>
          </div>
        </div>
        {credlyUrl && (
          <a
            href={credlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors"
            aria-label={`View ${provider} certifications on Credly`}
          >
            <span className="hidden sm:inline">Verify</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {certifications.map((cert, idx) => (
          <Badge 
            key={idx}
            variant="secondary"
            className="px-3 py-1.5 text-sm font-mono hover:bg-primary/10 transition-colors cursor-default"
          >
            {cert}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

/**
 * Main certifications section component
 */
export function AboutCertifications() {
  const totalCerts = resume.certifications.reduce((sum, cat) => sum + cat.certifications.length, 0);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className={TYPOGRAPHY.h2.standard}>Professional Certifications</h2>
        <p className={TYPOGRAPHY.metadata}>
          {totalCerts} industry certifications across leading providers.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {resume.certifications.map((category, idx) => (
          <CertificationCard
            key={idx}
            provider={category.provider}
            certifications={category.certifications}
          />
        ))}
      </div>
    </div>
  );
}
