import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TYPOGRAPHY, SHADOWS, BORDERS } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import type { AgentProfile } from '@/lib/agent-profiles';

interface AgentProfileCardProps {
  profile: AgentProfile;
}

const CATEGORY_COLORS: Record<AgentProfile['category'], string> = {
  framework: 'bg-primary/10 text-primary',
  engineering: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  quality: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  operations: 'bg-green-500/10 text-green-700 dark:text-green-400',
};

/**
 * AgentProfileCard
 *
 * Displays a single AI agent profile with name, role, description,
 * capability tags, and an optional docs link.
 *
 * Uses standard design tokens for spacing, typography, shadows, and borders.
 */
export function AgentProfileCard({ profile }: AgentProfileCardProps) {
  const colorClass = CATEGORY_COLORS[profile.category];

  return (
    <Card
      className={cn('flex flex-col gap-4 p-6', SHADOWS.card.rest, BORDERS.card)}
      data-testid={`agent-profile-card-${profile.id}`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className={cn(TYPOGRAPHY.h3.standard, 'leading-snug')}>{profile.name}</h3>
          <p className={TYPOGRAPHY.metadata}>{profile.role}</p>
        </div>
        {profile.docsUrl && (
          <a
            href={profile.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${profile.name} documentation`}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* Description */}
      <p className={cn(TYPOGRAPHY.activity.replyDescription, 'flex-1')}>{profile.description}</p>

      {/* Capability tags */}
      <div className="flex flex-wrap gap-2" aria-label="Capabilities">
        {profile.capabilities.map((cap) => (
          <Badge key={cap} variant="secondary" className={cn('text-xs font-medium', colorClass)}>
            {cap}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
