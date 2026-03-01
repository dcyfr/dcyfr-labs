import { TYPOGRAPHY, SPACING } from '@/lib/design-tokens';

interface Dimensions {
  security: number;
  community: number;
  maintenance: number;
  transparency: number;
}

interface Props {
  pluginName: string;
  dimensions: Dimensions;
  overall: number;
}

const DIMENSION_CONFIG = [
  { key: 'security' as const, label: 'Security', weight: 40, color: 'bg-blue-500' },
  { key: 'community' as const, label: 'Community', weight: 30, color: 'bg-green-500' },
  { key: 'maintenance' as const, label: 'Maintenance', weight: 20, color: 'bg-orange-500' },
  { key: 'transparency' as const, label: 'Transparency', weight: 10, color: 'bg-purple-500' },
];

export function TrustScoreBreakdown({ pluginName, dimensions, overall }: Props) {
  return (
    <div className={`p-6 rounded-lg border border-border bg-muted/20 ${SPACING.content}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={TYPOGRAPHY.h3.standard}>{pluginName}</h3>
        <div className="flex items-center gap-2">
          <span className={TYPOGRAPHY.metadata}>Overall</span>
          <span className="text-2xl font-bold text-foreground">{overall}</span>
          <span className={TYPOGRAPHY.metadata}>/100</span>
        </div>
      </div>

      <div className={SPACING.content}>
        {DIMENSION_CONFIG.map(({ key, label, weight, color }) => {
          const score = dimensions[key];
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={TYPOGRAPHY.label.small}>{label}</span>
                  <span className={TYPOGRAPHY.metadata}>({weight}% weight)</span>
                </div>
                <span className={`${TYPOGRAPHY.label.small} text-foreground`}>{score}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-300`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className={TYPOGRAPHY.metadata}>
          Weighted formula: Security (40%) + Community (30%) + Maintenance (20%) + Transparency
          (10%)
        </p>
      </div>
    </div>
  );
}
