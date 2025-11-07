import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resume } from "@/data/resume";
import { GraduationCap, BookOpen } from "lucide-react";

/**
 * About Currently Learning Component
 * 
 * Highlights current educational pursuits and areas of focus.
 * Displays MS degree progress from SANS with course highlights.
 * 
 * @component
 * @example
 * ```tsx
 * <AboutCurrentlyLearning />
 * ```
 */

export function AboutCurrentlyLearning() {
  // Get the current education (MS degree in progress)
  const currentEducation = resume.education.find(edu => 
    edu.duration?.includes("Present") || edu.duration?.includes("2024")
  );

  if (!currentEducation) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl md:text-2xl font-medium font-serif">Currently Learning</h2>
      </div>
      
      <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-medium text-lg">{currentEducation.degree}</h3>
              <p className="text-sm text-muted-foreground">{currentEducation.institution}</p>
            </div>
            <Badge variant="default" className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-background"></span>
              </span>
              In Progress
            </Badge>
          </div>
          
          {currentEducation.duration && (
            <p className="text-sm text-muted-foreground">
              {currentEducation.duration}
            </p>
          )}
        </div>

        {currentEducation.highlights && currentEducation.highlights.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-medium">Current Focus Areas</p>
            </div>
            <ul className="space-y-2">
              {currentEducation.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 text-sm text-muted-foreground border-t border-border/50">
          <p>
            Continuously expanding expertise in advanced security engineering, 
            incident response methodologies, and strategic security leadership.
          </p>
        </div>
      </Card>
    </section>
  );
}
