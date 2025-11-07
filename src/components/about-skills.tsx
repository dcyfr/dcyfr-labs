"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resume, type SkillCategory } from "@/data/resume";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * About Skills Component
 * 
 * Interactive skills visualization displaying categorized technical skills
 * from resume data. Features expandable categories and tag-based layout.
 * 
 * @component
 * @example
 * ```tsx
 * <AboutSkills />
 * ```
 */

type SkillCategoryCardProps = {
  category: SkillCategory;
  defaultExpanded?: boolean;
};

/**
 * Individual skill category card with expand/collapse functionality
 */
function SkillCategoryCard({ category, defaultExpanded = false }: SkillCategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Show first 8 skills when collapsed, all when expanded
  const displaySkills = isExpanded ? category.skills : category.skills.slice(0, 8);
  const hasMore = category.skills.length > 8;

  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-lg">{category.category}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {category.skills.length} {category.skills.length === 1 ? 'skill' : 'skills'}
          </p>
        </div>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? (
              <>
                Less <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              <>
                More <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displaySkills.map((skill, idx) => (
          <Badge 
            key={idx} 
            variant="secondary"
            className="px-3 py-1 text-sm hover:bg-primary/10 transition-colors cursor-default"
          >
            {skill}
          </Badge>
        ))}
        {!isExpanded && hasMore && (
          <Badge 
            variant="outline"
            className="px-3 py-1 text-sm text-muted-foreground cursor-default"
          >
            +{category.skills.length - 8} more
          </Badge>
        )}
      </div>
    </Card>
  );
}

/**
 * Main skills section component
 * Displays all skill categories with "Critical Skills" expanded by default
 */
export function AboutSkills() {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-medium font-serif">Skills & Expertise</h2>
        <p className="text-sm text-muted-foreground">
          Technical competencies and frameworks I work with regularly
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {resume.skills.map((category, idx) => (
          <SkillCategoryCard 
            key={idx} 
            category={category}
            // Expand "Critical Skills" by default
            defaultExpanded={category.category === "Critical Skills"}
          />
        ))}
      </div>
    </section>
  );
}
