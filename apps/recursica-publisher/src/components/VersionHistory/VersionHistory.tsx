import classes from "./VersionHistory.module.css";

interface VersionHistoryEntry {
  message?: string;
  date?: string;
}

interface VersionHistoryProps {
  history: Record<string, unknown>;
  currentVersion?: number;
}

export default function VersionHistory({ history }: VersionHistoryProps) {
  const historyEntries: Array<{
    version: number;
    message?: string;
    date?: string;
  }> = [];

  for (const [versionStr, entry] of Object.entries(history)) {
    const version = parseInt(versionStr, 10);
    if (!isNaN(version)) {
      const historyEntry = entry as VersionHistoryEntry;
      historyEntries.push({
        version,
        message: historyEntry.message,
        date: historyEntry.date,
      });
    }
  }

  historyEntries.sort((a, b) => b.version - a.version);

  if (historyEntries.length === 0) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.title}>Version History</div>
      <div className={classes.list}>
        {historyEntries.map((entry) => {
          const dateStr = entry.date
            ? new Date(entry.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : null;

          const parts = [`v${entry.version}`, dateStr, entry.message].filter(
            Boolean,
          );

          return (
            <div key={entry.version} className={classes.entry}>
              {parts.join(" - ")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
