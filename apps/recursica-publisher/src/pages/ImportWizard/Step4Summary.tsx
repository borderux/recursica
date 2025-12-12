import { useState } from "react";
import { useNavigate } from "react-router";
import { useImportWizard } from "../../context/ImportWizardContext";
import {
  useImportData,
  type ImportedFile,
} from "../../context/ImportDataContext";

export default function Step4Summary() {
  const navigate = useNavigate();
  const { wizardState, setWizardState } = useImportWizard();
  const { setImportData } = useImportData();
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartImport = async () => {
    if (!wizardState.componentData.mainComponent) {
      setError("No component data available");
      return;
    }

    setImporting(true);
    setError(null);

    try {
      // Convert wizard component data to ImportedFile format
      const timestamp = Date.now();
      const mainFile: ImportedFile = {
        id: `${wizardState.componentData.mainComponent.guid}-${timestamp}-0`,
        name: `${wizardState.componentData.mainComponent.name}.json`,
        size: JSON.stringify(wizardState.componentData.mainComponent.jsonData)
          .length,
        data: wizardState.componentData.mainComponent.jsonData,
        status: "success",
      };

      const additionalFiles: ImportedFile[] =
        wizardState.componentData.dependencies
          .filter((dep) => {
            // Only include dependencies that should be imported (not using existing)
            const depSelection = wizardState.dependencies.find(
              (d) => d.guid === dep.guid,
            );
            return depSelection && !depSelection.useExisting;
          })
          .map((dep, index) => ({
            id: `${dep.guid}-${timestamp}-${index + 1}`,
            name: `${dep.name}.json`,
            size: JSON.stringify(dep.jsonData).length,
            data: dep.jsonData,
            status: "success" as const,
          }));

      // Determine source info from wizard state
      const ref = wizardState.selectedComponent?.ref || "main";
      const source = {
        type: "repo" as const,
        branch: ref,
        owner: "borderux",
        repo: "recursica-figma",
      };

      // Set import data with wizard selections and source info
      setImportData({
        mainFile,
        additionalFiles,
        source,
        wizardSelections: {
          dependencies: wizardState.dependencies.map((dep) => ({
            guid: dep.guid,
            name: dep.name,
            useExisting: dep.useExisting,
          })),
          tokensCollection: wizardState.variableCollections.tokens,
          themeCollection: wizardState.variableCollections.theme,
          layersCollection: wizardState.variableCollections.layers,
        },
        variableSummary: wizardState.variableSummary || {
          tokens: { existing: 0, new: 0 },
          theme: { existing: 0, new: 0 },
          layers: { existing: 0, new: 0 },
        },
        importStatus: "pending", // Mark as pending - will be set to "in_progress" when import starts
      });

      // Navigate to wizard step 5 (importing)
      setWizardState((prev) => ({
        ...prev,
        currentStep: 5,
      }));
      navigate("/import-wizard/step5");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start import";
      setError(errorMessage);
      setImporting(false);
      console.error("[Step4Summary] Error:", err);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "8px",
            marginTop: "0",
          }}
        >
          Summary
        </h1>
      </div>

      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e0e0e0",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Setting
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e0e0e0",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                Component Name
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #e0e0e0",
                  fontFamily:
                    "system-ui, -apple-system, 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
                }}
              >
                {wizardState.selectedComponent?.name}
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                Version
              </td>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                {wizardState.selectedComponent?.version}
              </td>
            </tr>
            {(() => {
              // Sort dependencies: new first, then existing
              const sortedDependencies = [...wizardState.dependencies].sort(
                (a, b) => {
                  if (a.useExisting === b.useExisting) return 0;
                  return a.useExisting ? 1 : -1; // false (new) comes before true (existing)
                },
              );

              return sortedDependencies.map((dep, index) => {
                // If using existing, show EXISTING badge, otherwise show status badge
                const badgeText = dep.useExisting ? "EXISTING" : dep.status;
                const badgeStyle = dep.useExisting
                  ? {
                      backgroundColor: "#e8f5e9",
                      color: "#388e3c",
                    }
                  : dep.status === "NEW"
                    ? {
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                      }
                    : dep.status === "UPDATED"
                      ? {
                          backgroundColor: "#fff3e0",
                          color: "#f57c00",
                        }
                      : {
                          backgroundColor: "#e8f5e9",
                          color: "#388e3c",
                        };

                return (
                  <tr key={dep.guid}>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {index === 0 ? "Dependencies" : ""}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {/* Badge */}
                        <div
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            ...badgeStyle,
                            flexShrink: 0,
                          }}
                        >
                          {badgeText}
                        </div>
                        {/* Component name and version */}
                        <span>
                          {dep.name} (Version {dep.version})
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              });
            })()}
            <tr>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                Tokens Collection
              </td>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                {wizardState.variableCollections.tokens === "new"
                  ? "Create new"
                  : "Use existing"}
                {wizardState.variableSummary && (
                  <>
                    <br />({wizardState.variableSummary.tokens.new} new
                    variables)
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                Theme Collection
              </td>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                {wizardState.variableCollections.theme === "new"
                  ? "Create new"
                  : "Use existing"}
                {wizardState.variableSummary && (
                  <>
                    <br />({wizardState.variableSummary.theme.new} new
                    variables)
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                Layers Collection
              </td>
              <td
                style={{ padding: "12px", borderBottom: "1px solid #e0e0e0" }}
              >
                {wizardState.variableCollections.layers === "new"
                  ? "Create new"
                  : "Use existing"}
                {wizardState.variableSummary && (
                  <>
                    <br />({wizardState.variableSummary.layers.new} new
                    variables)
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            color: "#c62828",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleStartImport}
          disabled={importing}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: importing ? "#ccc" : "#d40d0d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: importing ? "not-allowed" : "pointer",
          }}
          onMouseOver={(e) => {
            if (!importing) {
              e.currentTarget.style.opacity = "0.9";
            }
          }}
          onMouseOut={(e) => {
            if (!importing) {
              e.currentTarget.style.opacity = "1";
            }
          }}
        >
          {importing ? "Starting Import..." : "Start Import"}
        </button>
      </div>
    </div>
  );
}
