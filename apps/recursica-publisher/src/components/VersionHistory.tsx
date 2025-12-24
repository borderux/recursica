interface VersionHistoryEntry {
  message?: string;
  date?: string;
}

interface VersionHistoryProps {
  history: Record<string, unknown>;
  currentVersion?: number;
}

export default function VersionHistory({ history }: VersionHistoryProps) {
  // Convert history object to sorted array of entries
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

  // Sort by version number (descending - newest first)
  historyEntries.sort((a, b) => b.version - a.version);

  if (historyEntries.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#666",
          marginBottom: "4px",
        }}
      >
        Version History
      </div>
      <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>
        {historyEntries.map((entry, index) => {
          const dateStr = entry.date
            ? new Date(entry.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : null;

          return (
            <div
              key={entry.version}
              style={{
                marginBottom: index < historyEntries.length - 1 ? "4px" : "0",
              }}
            >
              <div>
                <span>v{entry.version}</span>
                {dateStr && (
                  <span style={{ color: "#666", marginLeft: "8px" }}>
                    {dateStr}
                  </span>
                )}
              </div>
              {entry.message && (
                <div
                  style={{
                    color: "#666",
                    marginLeft: "16px",
                    marginTop: "2px",
                  }}
                >
                  {entry.message}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
