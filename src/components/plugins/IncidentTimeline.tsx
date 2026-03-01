import { TYPOGRAPHY, SPACING } from '@/lib/design-tokens';

interface Incident {
  id: string;
  date: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  status: 'open' | 'resolved';
}

interface PluginWithIncidents {
  pluginId: string;
  name: string;
  incidents: Incident[];
}

interface FlatIncident extends Incident {
  pluginName: string;
  pluginId: string;
}

interface Props {
  plugins: PluginWithIncidents[];
}

const SEVERITY_CLASSES: Record<Incident['severity'], string> = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const STATUS_CLASSES: Record<Incident['status'], string> = {
  open: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  resolved: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function IncidentTimeline({ plugins }: Props) {
  // Flatten incidents across all plugins and sort by date (newest first)
  const allIncidents: FlatIncident[] = plugins
    .flatMap((plugin) =>
      plugin.incidents.map((incident) => ({
        ...incident,
        pluginName: plugin.name,
        pluginId: plugin.pluginId,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const openCount = allIncidents.filter((i) => i.status === 'open').length;
  const resolvedCount = allIncidents.filter((i) => i.status === 'resolved').length;

  if (allIncidents.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg border border-border bg-muted/10">
        <div className="text-3xl mb-2">✓</div>
        <p className={TYPOGRAPHY.label.standard}>No incidents recorded</p>
        <p className={TYPOGRAPHY.metadata}>All plugins are clean</p>
      </div>
    );
  }

  return (
    <div className={SPACING.content}>
      {/* Summary */}
      <div className="flex flex-wrap gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className={TYPOGRAPHY.metadata}>{openCount} open</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          <span className={TYPOGRAPHY.metadata}>{resolvedCount} resolved</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className={SPACING.content}>
          {allIncidents.map((incident) => (
            <div key={incident.id} className="relative flex items-start gap-4 pl-10">
              {/* Timeline dot */}
              <div
                className={`absolute left-3 w-2 h-2 rounded-full mt-2 ring-2 ring-background ${
                  incident.status === 'open' ? 'bg-red-500' : 'bg-green-500'
                }`}
              />

              {/* Incident card */}
              <div className="flex-1 p-4 rounded-lg border border-border bg-muted/10">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className={TYPOGRAPHY.label.small}>{incident.title}</div>
                    <div className={TYPOGRAPHY.metadata}>
                      {incident.pluginName}
                      <span className="mx-1">·</span>
                      {formatDate(incident.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SEVERITY_CLASSES[incident.severity]}`}
                    >
                      {incident.severity.toUpperCase()}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CLASSES[incident.status]}`}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
