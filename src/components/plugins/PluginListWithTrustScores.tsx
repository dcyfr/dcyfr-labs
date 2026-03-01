import { TYPOGRAPHY, SPACING } from '@/lib/design-tokens';

export interface PluginEntry {
  pluginId: string;
  name: string;
  version: string;
  trustScore: number;
  verified: boolean;
  auditDate: string;
  downloads: number;
  dimensions: {
    security: number;
    community: number;
    maintenance: number;
    transparency: number;
  };
  incidents: Array<{
    id: string;
    date: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    status: 'open' | 'resolved';
  }>;
}

interface Props {
  plugins: PluginEntry[];
}

function getTrustBadgeClasses(score: number): string {
  if (score >= 95) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  if (score >= 85)
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  if (score >= 70)
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
}

function getTrustLabel(score: number): string {
  if (score >= 95) return 'Excellent';
  if (score >= 85) return 'Good';
  if (score >= 70) return 'Acceptable';
  return 'Below threshold';
}

export function PluginListWithTrustScores({ plugins }: Props) {
  return (
    <div className={SPACING.content}>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th
                scope="col"
                className={`px-6 py-3 text-left ${TYPOGRAPHY.label.small} text-muted-foreground uppercase tracking-wider`}
              >
                Plugin
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left ${TYPOGRAPHY.label.small} text-muted-foreground uppercase tracking-wider`}
              >
                Version
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left ${TYPOGRAPHY.label.small} text-muted-foreground uppercase tracking-wider`}
              >
                Trust Score
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left ${TYPOGRAPHY.label.small} text-muted-foreground uppercase tracking-wider`}
              >
                Downloads
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left ${TYPOGRAPHY.label.small} text-muted-foreground uppercase tracking-wider`}
              >
                Open Incidents
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {plugins.map((plugin) => {
              const openIncidents = plugin.incidents.filter((i) => i.status === 'open').length;
              return (
                <tr key={plugin.pluginId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className={`${TYPOGRAPHY.label.small} text-foreground`}>
                          {plugin.name}
                        </div>
                        <div className={TYPOGRAPHY.metadata}>{plugin.pluginId}</div>
                      </div>
                      {plugin.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={TYPOGRAPHY.metadata}>v{plugin.version}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${getTrustBadgeClasses(plugin.trustScore)}`}
                      >
                        {plugin.trustScore}
                      </span>
                      <span className={TYPOGRAPHY.metadata}>
                        {getTrustLabel(plugin.trustScore)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={TYPOGRAPHY.metadata}>{plugin.downloads.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {openIncidents > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        {openIncidents} open
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Clean
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
