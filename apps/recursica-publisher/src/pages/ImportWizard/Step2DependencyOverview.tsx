import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  useImportWizard,
  type DependencySelection,
} from "../../context/ImportWizardContext";
import { useImportData } from "../../context/ImportDataContext";
import { fetchComponentWithDependencies } from "../../services/repository/repositoryImportService";
import { callPlugin } from "../../utils/callPlugin";
import { validateImport } from "../../utils/validateExportFile";

export default function Step2DependencyOverview() {
  const navigate = useNavigate();
  const { wizardState, setWizardState } = useImportWizard();
  const { importData } = useImportData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dependencies, setDependencies] = useState<DependencySelection[]>([]);

  useEffect(() => {
    const loadDependencies = async () => {
      // If no selected component but we have importData, populate wizard state from it
      if (!wizardState.selectedComponent) {
        if (importData?.mainFile?.data) {
          const mainFileData = importData.mainFile.data as {
            metadata?: { guid?: string; name?: string; version?: number };
          };
          const metadata = mainFileData?.metadata;

          if (metadata?.guid && metadata?.name) {
            const ref = importData.source?.branch || "main";
            setWizardState((prev) => ({
              ...prev,
              selectedComponent: {
                guid: metadata.guid,
                name: metadata.name,
                version: metadata.version || 0,
                ref,
              },
              componentData: {
                mainComponent: {
                  guid: metadata.guid,
                  name: metadata.name,
                  version: metadata.version || 0,
                  jsonData: mainFileData,
                },
                dependencies: importData.additionalFiles
                  .filter((file) => file.status === "success" && file.data)
                  .map((file) => {
                    const fileData = file.data as {
                      metadata?: {
                        guid?: string;
                        name?: string;
                        version?: number;
                      };
                    };
                    const fileMetadata = fileData?.metadata;
                    return {
                      guid: fileMetadata?.guid || "",
                      name:
                        fileMetadata?.name || file.name.replace(".json", ""),
                      version: fileMetadata?.version || 0,
                      jsonData: fileData,
                    };
                  }),
              },
            }));
            // State will be updated, but we need to wait for the next render
            // Return here and let the effect run again with the updated state
            return;
          }
        }
        // No importData or can't extract component info, go to step 1
        navigate("/import-wizard/step1");
        return;
      }

      // Check if component data is already loaded (from importData)
      if (
        wizardState.componentData.mainComponent &&
        wizardState.componentData.mainComponent.guid ===
          wizardState.selectedComponent.guid &&
        wizardState.componentData.dependencies.length > 0
      ) {
        // Component data already loaded, process it
        try {
          setLoading(true);
          setError(null);

          const fetchedDeps = wizardState.componentData.dependencies;

          // Get existing components in file
          const { promise: getAllComponentsPromise } = callPlugin(
            "getAllComponents",
            {},
          );
          const existingComponentsResponse = await getAllComponentsPromise;

          let existingComponents: Array<{
            id: string;
            name: string;
            version: number;
          }> = [];

          if (
            existingComponentsResponse.success &&
            existingComponentsResponse.data
          ) {
            const data = existingComponentsResponse.data as {
              components: Array<{
                id: string;
                name: string;
                version: number;
              }>;
            };
            existingComponents = data.components.filter((c) => c.id !== "");
          }

          // Extract version from JSON metadata
          const getVersionFromJson = (jsonData: unknown): number => {
            if (
              !jsonData ||
              typeof jsonData !== "object" ||
              Array.isArray(jsonData)
            ) {
              return 0;
            }
            const data = jsonData as Record<string, unknown>;
            if (data.metadata && typeof data.metadata === "object") {
              const metadata = data.metadata as Record<string, unknown>;
              if (typeof metadata.version === "number") {
                return metadata.version;
              }
            }
            return 0;
          };

          // Build dependency selections
          const dependencySelections: DependencySelection[] = fetchedDeps.map(
            (dep) => {
              const depVersion = getVersionFromJson(dep.jsonData);
              const existing = existingComponents.find(
                (c) => c.id === dep.guid,
              );

              let status: "NEW" | "UPDATED" | "SAME" = "NEW";
              let useExisting = false;

              if (existing) {
                if (depVersion > existing.version) {
                  status = "UPDATED";
                } else if (depVersion === existing.version) {
                  status = "SAME";
                  useExisting = true; // Default to using existing if versions match
                }
              }

              return {
                guid: dep.guid,
                name: dep.name,
                version: depVersion,
                currentVersionInFile: existing?.version,
                status,
                useExisting,
              };
            },
          );

          setDependencies(dependencySelections);

          // Update wizard state with dependencies
          setWizardState((prev) => ({
            ...prev,
            dependencies: dependencySelections,
          }));
        } catch (processError) {
          const errorMessage =
            processError instanceof Error
              ? processError.message
              : "Failed to process component data";
          setError(errorMessage);
          console.error(
            "[Step2DependencyOverview] Failed to process component data:",
            processError,
          );
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const ref = wizardState.selectedComponent.ref || "main";

        // Fetch component and dependencies
        const { mainComponent, dependencies: fetchedDeps } =
          await fetchComponentWithDependencies(
            wizardState.selectedComponent.guid,
            ref,
          );

        // Validate main component
        const mainValidation = validateImport(mainComponent.jsonData);
        if (!mainValidation.valid) {
          throw new Error(
            mainValidation.error || "Invalid main component file format",
          );
        }

        // Validate dependencies
        const invalidDeps: string[] = [];
        for (const dep of fetchedDeps) {
          const depValidation = validateImport(dep.jsonData);
          if (!depValidation.valid) {
            invalidDeps.push(dep.name);
          }
        }

        if (invalidDeps.length > 0) {
          throw new Error(
            `Invalid dependency files: ${invalidDeps.join(", ")}`,
          );
        }

        // Get existing components in file
        const { promise: getAllComponentsPromise } = callPlugin(
          "getAllComponents",
          {},
        );
        const existingComponentsResponse = await getAllComponentsPromise;

        let existingComponents: Array<{
          id: string;
          name: string;
          version: number;
        }> = [];

        if (
          existingComponentsResponse.success &&
          existingComponentsResponse.data
        ) {
          const data = existingComponentsResponse.data as {
            components: Array<{
              id: string;
              name: string;
              version: number;
            }>;
          };
          existingComponents = data.components.filter((c) => c.id !== "");
        }

        // Extract version from JSON metadata
        const getVersionFromJson = (jsonData: unknown): number => {
          if (
            jsonData &&
            typeof jsonData === "object" &&
            !Array.isArray(jsonData)
          ) {
            const data = jsonData as Record<string, unknown>;
            if (data.metadata && typeof data.metadata === "object") {
              const metadata = data.metadata as Record<string, unknown>;
              if (typeof metadata.version === "number") {
                return metadata.version;
              }
            }
          }
          return 0;
        };

        // Build dependency selections
        const dependencySelections: DependencySelection[] = fetchedDeps.map(
          (dep) => {
            const depVersion = getVersionFromJson(dep.jsonData);
            const existing = existingComponents.find(
              (ec) => ec.id === dep.guid,
            );
            let status: "NEW" | "UPDATED" | "SAME" = "NEW";
            let useExisting = false;

            if (existing) {
              if (existing.version === depVersion) {
                status = "SAME";
                useExisting = true; // Default to use existing for SAME
              } else if (existing.version < depVersion) {
                status = "UPDATED";
                useExisting = false; // Default to update for UPDATED
              } else {
                // Existing version is newer - still show as UPDATED but allow choice
                status = "UPDATED";
                useExisting = true;
              }
            }

            return {
              guid: dep.guid,
              name: dep.name,
              version: depVersion,
              currentVersionInFile: existing?.version,
              status,
              useExisting,
            };
          },
        );

        setDependencies(dependencySelections);

        // Extract main component version
        const mainVersion = getVersionFromJson(mainComponent.jsonData);

        // Store component data in wizard state
        setWizardState((prev) => ({
          ...prev,
          dependencies: dependencySelections,
          componentData: {
            mainComponent: {
              guid: mainComponent.guid,
              name: mainComponent.name,
              version: mainVersion,
              jsonData: mainComponent.jsonData,
            },
            dependencies: fetchedDeps.map((dep) => ({
              guid: dep.guid,
              name: dep.name,
              version: getVersionFromJson(dep.jsonData),
              jsonData: dep.jsonData,
            })),
          },
        }));
      } catch (loadError) {
        const errorMessage =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load component dependencies";
        setError(errorMessage);
        console.error(
          "[Step2DependencyOverview] Failed to load dependencies:",
          loadError,
        );
      } finally {
        setLoading(false);
      }
    };

    loadDependencies();
  }, [
    wizardState.selectedComponent,
    wizardState.componentData.dependencies,
    wizardState.componentData.mainComponent,
    navigate,
    setWizardState,
    importData,
  ]);

  const handleToggle = (guid: string, useExisting: boolean) => {
    setDependencies((prev) =>
      prev.map((dep) => (dep.guid === guid ? { ...dep, useExisting } : dep)),
    );
    setWizardState((prev) => ({
      ...prev,
      dependencies: prev.dependencies.map((dep) =>
        dep.guid === guid ? { ...dep, useExisting } : dep,
      ),
    }));
  };

  const handleNext = () => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: 3,
    }));
    navigate("/import-wizard/step3");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <p>Loading component dependencies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: "#ffebee",
          border: "1px solid #f44336",
          borderRadius: "8px",
          color: "#c62828",
          fontSize: "14px",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        {error}
      </div>
    );
  }

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
          Import Overview
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            margin: 0,
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
          }}
        >
          Component: {wizardState.selectedComponent?.name} (Version:{" "}
          {wizardState.selectedComponent?.version})
        </p>
      </div>

      <div>
        <p
          style={{
            fontSize: "14px",
            color: "#333",
            marginBottom: "12px",
          }}
        >
          Please review a list of components and select how you would like to
          proceed
        </p>

        {dependencies.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
            No dependencies found.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {dependencies.map((dep) => (
              <div
                key={dep.guid}
                style={{
                  padding: "5px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {/* Badge on the left */}
                <div
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor:
                      dep.status === "NEW"
                        ? "#e3f2fd"
                        : dep.status === "UPDATED"
                          ? "#fff3e0"
                          : "#e8f5e9",
                    color:
                      dep.status === "NEW"
                        ? "#1976d2"
                        : dep.status === "UPDATED"
                          ? "#f57c00"
                          : "#388e3c",
                    flexShrink: 0,
                  }}
                >
                  {dep.status}
                </div>

                {/* Component name and version in the middle */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "2px",
                      fontFamily:
                        "system-ui, -apple-system, 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
                    }}
                  >
                    {dep.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    {dep.currentVersionInFile !== undefined
                      ? `Current: v${dep.currentVersionInFile} → Latest: v${dep.version}`
                      : `Version: ${dep.version}`}
                  </div>
                </div>

                {/* Radio buttons vertical on the right */}
                {(dep.status === "SAME" || dep.status === "UPDATED") && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      alignItems: "flex-start",
                      flexShrink: 0,
                      marginLeft: "auto",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      <input
                        type="radio"
                        checked={dep.useExisting}
                        onChange={() => handleToggle(dep.guid, true)}
                      />
                      Existing
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      <input
                        type="radio"
                        checked={!dep.useExisting}
                        onChange={() => handleToggle(dep.guid, false)}
                      />
                      {dep.status === "SAME" ? "Create new" : "Update"}
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleNext}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#d40d0d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
