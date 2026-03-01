import { TYPOGRAPHY, SPACING } from '@/lib/design-tokens';

interface PluginAuditEntry {
  pluginId: string;
  name: string;
  auditDate: string;
  trustScore: number;
}

interface Props {
  plugins: PluginAuditEntry[];
}

function getAuditStatus(auditDate: string): {
  label: string;
  badgeClasses: string;
  daysSince: number;
} {
  const now = new Date();
  const audit = new Date(auditDate);
  const daysSince = Math.floor((now.getTime() - audit.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSince < 90) {
    return {
      label: 'Current',
      badgeClasses: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      daysSince,
    };
  }
  if (daysSince < 180) {
    return {
      label: 'Review Soon',
      badgeClasses: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      daysSince,
    };
  }
  return {
    label: 'Overdue',
    badgeClasses: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    daysSince,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function AuditDateTracker({ plugins }: Props) {
  const sorted = [...plugins].sort(
    (a, b) => new Date(a.auditDate).getTime() - new Date(b.auditDate).getTime()
  );

  const overdue = sorted.filter((p) => getAuditStatus(p.auditDate).daysSince >= 180).length;
  const reviewSoon = sorted.filter((p) => {
    const { daysSince } = getAuditStatus(p.auditDate);
    return daysSince >= 90 && daysSince < 180;
  }).length;
  const current = sorted.length - overdue - reviewSoon;

  return (
    <div className={SPACING.content}>
      {/* Summary row */}
      <div className="flex flex-wrap gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          <span className={TYPOGRAPHY.metadata}>{current} current (&lt;90 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
          <span className={TYPOGRAPHY.metadata}>{reviewSoon} review soon (90–180 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className={TYPOGRAPHY.metadata}>{overdue} overdue (&gt;180 days)</span>
        </div>
      </div>

      {/* Plugin list */}
      <div className="space-y-3">
        {sorted.map((plugin) => {
          const status = getAuditStatus(plugin.auditDate);
          return (
            <div
              key={plugin.pluginId}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/10"
            >
              <div>
                <div className={TYPOGRAPHY.label.small}>{plugin.name}</div>
                <div className={TYPOGRAPHY.metadata}>
                  Last audit: {formatDate(plugin.auditDate)} ({status.daysSince} days ago)
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={TYPOGRAPHY.metadata}>Trust: {plugin.trustScore}</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${status.badgeClasses}`}
                >
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
