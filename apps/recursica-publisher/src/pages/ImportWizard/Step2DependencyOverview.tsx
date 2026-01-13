import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  useImportWizard,
  type DependencySelection,
} from "../../context/ImportWizardContext";
import {
  useImportData,
  type ImportedFile,
} from "../../context/ImportDataContext";
import { useAuth } from "../../context/useAuth";
import { fetchComponentWithDependencies } from "../../services/repository/repositoryImportService";
import { callPlugin } from "../../utils/callPlugin";
import { validateImport } from "../../utils/validateExportFile";
import { VersionHistory } from "../../components";

export default function Step2DependencyOverview() {
  const navigate = useNavigate();
  const { wizardState, setWizardState } = useImportWizard();
  const { importData, setImportData } = useImportData();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dependencies, setDependencies] = useState<DependencySelection[]>([]);
  const processedRef = useRef<string | null>(null);
  const initialMountRef = useRef(true);
  const [existingComponentVersion, setExistingComponentVersion] = useState<
    number | null
  >(null);
  const [componentDescription, setComponentDescription] = useState<
    string | undefined
  >(undefined);
  const [componentUrl, setComponentUrl] = useState<string | undefined>(
    undefined,
  );
  const [componentHistory, setComponentHistory] = useState<
    Record<string, unknown>
  >({});

  useEffect(() => {
    const loadDependencies = async () => {
      // Reset processed ref when component changes
      const currentComponentGuid = wizardState.selectedComponent?.guid;
      if (
        processedRef.current &&
        currentComponentGuid &&
        !processedRef.current.startsWith(currentComponentGuid)
      ) {
        processedRef.current = null;
      }
      // If no selected component but we have importData, populate wizard state from it
      if (!wizardState.selectedComponent) {
        if (importData?.mainFile?.data) {
          const mainFileData = importData.mainFile.data as {
            metadata?: { guid?: string; name?: string; version?: number };
          };
          const metadata = mainFileData?.metadata;

          if (metadata?.guid && metadata?.name) {
            // Extract values after the check so TypeScript knows they're defined
            const guid = metadata.guid;
            const name = metadata.name;
            const ref = importData.source?.branch || "main";
            setWizardState((prev) => ({
              ...prev,
              selectedComponent: {
                guid,
                name,
                version: metadata.version || 0,
                ref,
              },
              componentData: {
                mainComponent: {
                  guid,
                  name,
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
        // On initial mount, skip navigation to allow state to update from previous step
        // The effect will run again when state updates, and then we can check properly
        if (initialMountRef.current) {
          initialMountRef.current = false;
          return;
        }
        // No importData or can't extract component info, go to step 1
        navigate("/import-wizard/step1");
        return;
      }

      // Mark that we've passed the initial mount check
      if (initialMountRef.current) {
        initialMountRef.current = false;
      }

      // Check if component data is already loaded (from importData)
      if (
        wizardState.componentData.mainComponent &&
        wizardState.componentData.mainComponent.guid ===
          wizardState.selectedComponent.guid
      ) {
        // Check if we've already processed this component to prevent loops
        const componentKey = `${wizardState.selectedComponent.guid}-${wizardState.componentData.dependencies.length}`;
        if (processedRef.current === componentKey) {
          // Already processed, skip
          return;
        }

        // If there are no dependencies, just set empty array and return
        if (wizardState.componentData.dependencies.length === 0) {
          setDependencies([]);
          setWizardState((prev) => ({
            ...prev,
            dependencies: [],
          }));
          setLoading(false);
          processedRef.current = componentKey;
          return;
        }

        // Component data already loaded, process it
        try {
          setLoading(true);
          setError(null);
          processedRef.current = componentKey;

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
                included: status === "NEW", // Only NEW dependencies are included by default
              };
            },
          );

          setDependencies(dependencySelections);

          // Extract metadata (description, url, history) from main component
          const extractMetadata = (
            jsonData: unknown,
          ): {
            description?: string;
            url?: string;
            history?: Record<string, unknown>;
          } => {
            if (
              !jsonData ||
              typeof jsonData !== "object" ||
              Array.isArray(jsonData)
            ) {
              return {};
            }
            const data = jsonData as Record<string, unknown>;
            if (data.metadata && typeof data.metadata === "object") {
              const metadata = data.metadata as Record<string, unknown>;
              return {
                description:
                  typeof metadata.description === "string"
                    ? metadata.description
                    : undefined,
                url:
                  typeof metadata.url === "string" ? metadata.url : undefined,
                history:
                  metadata.history &&
                  typeof metadata.history === "object" &&
                  !Array.isArray(metadata.history)
                    ? (metadata.history as Record<string, unknown>)
                    : undefined,
              };
            }
            return {};
          };

          if (wizardState.componentData.mainComponent) {
            const metadata = extractMetadata(
              wizardState.componentData.mainComponent.jsonData,
            );
            setComponentDescription(metadata.description);
            setComponentUrl(metadata.url);
            setComponentHistory(metadata.history || {});

            // Find existing component version
            const existingComponent = existingComponents.find(
              (ec) => ec.id === wizardState.selectedComponent?.guid,
            );
            setExistingComponentVersion(existingComponent?.version ?? null);
          }

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

      // Check if we've already processed this component to prevent loops
      const componentKey = `${wizardState.selectedComponent.guid}-fetch`;
      if (processedRef.current === componentKey) {
        // Already processed, skip
        return;
      }

      try {
        setLoading(true);
        setError(null);
        processedRef.current = componentKey;

        const ref = wizardState.selectedComponent.ref || "main";

        // Fetch component and dependencies
        const { mainComponent, dependencies: fetchedDeps } =
          await fetchComponentWithDependencies(
            wizardState.selectedComponent.guid,
            ref,
            accessToken || undefined,
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
              included: status === "NEW", // Only NEW dependencies are included by default
            };
          },
        );

        setDependencies(dependencySelections);

        // Extract main component version
        const mainVersion = getVersionFromJson(mainComponent.jsonData);

        // Extract metadata (description, url, history) from main component
        const extractMetadata = (
          jsonData: unknown,
        ): {
          description?: string;
          url?: string;
          history?: Record<string, unknown>;
        } => {
          if (
            jsonData &&
            typeof jsonData === "object" &&
            !Array.isArray(jsonData)
          ) {
            const data = jsonData as Record<string, unknown>;
            if (data.metadata && typeof data.metadata === "object") {
              const metadata = data.metadata as Record<string, unknown>;
              return {
                description:
                  typeof metadata.description === "string"
                    ? metadata.description
                    : undefined,
                url:
                  typeof metadata.url === "string" ? metadata.url : undefined,
                history:
                  metadata.history &&
                  typeof metadata.history === "object" &&
                  !Array.isArray(metadata.history)
                    ? (metadata.history as Record<string, unknown>)
                    : undefined,
              };
            }
          }
          return {};
        };

        const metadata = extractMetadata(mainComponent.jsonData);
        setComponentDescription(metadata.description);
        setComponentUrl(metadata.url);
        setComponentHistory(metadata.history || {});

        // Find existing component version
        if (wizardState.selectedComponent) {
          const selectedGuid = wizardState.selectedComponent.guid;
          const existingComponent = existingComponents.find(
            (ec) => ec.id === selectedGuid,
          );
          setExistingComponentVersion(existingComponent?.version ?? null);
        }

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
    wizardState.selectedComponent?.guid,
    wizardState.componentData.mainComponent?.guid,
    wizardState.componentData.dependencies,
    wizardState.componentData.mainComponent,
    wizardState.selectedComponent,
    navigate,
    setWizardState,
    importData,
    accessToken,
  ]);

  const handleCheckboxToggle = (guid: string, included: boolean) => {
    setDependencies((prev) =>
      prev.map((dep) => (dep.guid === guid ? { ...dep, included } : dep)),
    );
    setWizardState((prev) => ({
      ...prev,
      dependencies: prev.dependencies.map((dep) =>
        dep.guid === guid ? { ...dep, included } : dep,
      ),
    }));
  };

  const handleNext = async () => {
    if (!wizardState.componentData.mainComponent) {
      setError("No component data available");
      return;
    }

    try {
      // Set default variableCollections to all "existing"
      setWizardState((prev) => ({
        ...prev,
        variableCollections: {
          tokens: "existing",
          theme: "existing",
          layers: "existing",
        },
        currentStep: 5,
      }));

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
            // Only include dependencies that are checked (included === true)
            // Checked dependencies will create a new page as part of the import process
            const depSelection = wizardState.dependencies.find(
              (d) => d.guid === dep.guid,
            );
            const included =
              (depSelection as DependencySelection & { included?: boolean })
                .included === true;
            return depSelection && included;
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
          tokensCollection: "existing",
          themeCollection: "existing",
          layersCollection: "existing",
        },
        variableSummary: {
          tokens: { existing: 0, new: 0 },
          theme: { existing: 0, new: 0 },
          layers: { existing: 0, new: 0 },
        },
        importStatus: "pending", // Mark as pending - will be set to "in_progress" when import starts
      });

      // Navigate directly to step 5 (importing)
      navigate("/import-wizard/step5");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to prepare import";
      setError(errorMessage);
      console.error("[Step2DependencyOverview] Error:", err);
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
            marginBottom: "20px",
            marginTop: "0",
          }}
        >
          Import Overview
        </h1>

        {loading ? (
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              fontStyle: "italic",
              marginBottom: "20px",
            }}
          >
            Loading...
          </p>
        ) : (
          <>
            {/* Component Information Section */}
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#f9f9f9",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                  marginTop: "0",
                  marginBottom: "12px",
                }}
              >
                {wizardState.selectedComponent?.name}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "baseline",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        fontWeight: "bold",
                        lineHeight: "1.5",
                      }}
                    >
                      Import Version:
                    </span>{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        lineHeight: "1.5",
                      }}
                    >
                      v{wizardState.selectedComponent?.version || 0}
                    </span>
                    {(() => {
                      const importVersion =
                        wizardState.selectedComponent?.version || 0;
                      let badgeText: "NEW" | "UPDATE" | "SAME" = "NEW";
                      let badgeColor = "#1976d2";
                      let badgeBg = "#e3f2fd";

                      if (existingComponentVersion !== null) {
                        if (importVersion > existingComponentVersion) {
                          badgeText = "UPDATE";
                          badgeColor = "#f57c00";
                          badgeBg = "#fff3e0";
                        } else if (importVersion === existingComponentVersion) {
                          badgeText = "SAME";
                          badgeColor = "#388e3c";
                          badgeBg = "#e8f5e9";
                        } else {
                          badgeText = "UPDATE";
                          badgeColor = "#f57c00";
                          badgeBg = "#fff3e0";
                        }
                      }

                      return (
                        <div
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor: badgeBg,
                            color: badgeColor,
                            flexShrink: 0,
                            lineHeight: "1.5",
                          }}
                        >
                          {badgeText}
                        </div>
                      );
                    })()}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        fontWeight: "bold",
                        lineHeight: "1.5",
                      }}
                    >
                      Current Version:
                    </span>{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        lineHeight: "1.5",
                      }}
                    >
                      {existingComponentVersion !== null
                        ? `v${existingComponentVersion}`
                        : "Does not exist"}
                    </span>
                  </div>
                </div>

                {componentDescription && (
                  <div>
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      {componentDescription}
                    </span>
                  </div>
                )}

                {componentUrl && (
                  <div>
                    <a
                      href={componentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "14px",
                        color: "#1976d2",
                        textDecoration: "underline",
                      }}
                    >
                      Documentation
                    </a>
                  </div>
                )}

                {/* Version History */}
                {Object.keys(componentHistory).length > 0 && (
                  <div>
                    <VersionHistory
                      history={componentHistory}
                      currentVersion={wizardState.selectedComponent?.version}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dependencies Section */}
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                  marginTop: "0",
                  marginBottom: "12px",
                }}
              >
                Additional Dependencies
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                These are the additional dependencies that will be imported as
                part of this process.
              </p>

              {error ? (
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
              ) : (
                (() => {
                  // Filter out the main component from dependencies
                  const mainComponentGuid = wizardState.selectedComponent?.guid;
                  const filteredDependencies = dependencies.filter(
                    (dep) => dep.guid !== mainComponentGuid,
                  );

                  if (filteredDependencies.length === 0) {
                    return (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        No dependencies found.
                      </p>
                    );
                  }

                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {filteredDependencies.map((dep) => {
                        const included =
                          (dep as DependencySelection & { included?: boolean })
                            .included === true;
                        const isNew = dep.status === "NEW";

                        return (
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
                            {/* Checkbox on the left */}
                            <input
                              type="checkbox"
                              checked={included}
                              disabled={isNew}
                              onChange={(e) =>
                                handleCheckboxToggle(dep.guid, e.target.checked)
                              }
                              style={{
                                flexShrink: 0,
                                cursor: isNew ? "not-allowed" : "pointer",
                              }}
                            />

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

                            {/* Badge on the right */}
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
                                marginLeft: "auto",
                              }}
                            >
                              {dep.status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
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
          </>
        )}
      </div>
    </div>
  );
}
