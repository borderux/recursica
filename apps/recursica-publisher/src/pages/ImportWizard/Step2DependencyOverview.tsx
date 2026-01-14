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
import {
  Title,
  Text,
  Stack,
  Card,
  Button,
  Checkbox,
  Badge,
  Alert,
  LoadingSpinner,
  VersionHistory,
} from "../../components";
import classes from "./Step2DependencyOverview.module.css";

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

  const getBadgeStatus = (
    importVersion: number,
    existingVersion: number | null,
  ): "NEW" | "UPDATED" | "EXISTING" | undefined => {
    if (existingVersion === null) {
      return "NEW";
    } else if (importVersion > existingVersion) {
      return "UPDATED";
    } else if (importVersion === existingVersion) {
      return "EXISTING";
    } else {
      return "UPDATED";
    }
  };

  const getDependencyBadgeStatus = (
    status: "NEW" | "UPDATED" | "SAME",
  ): "NEW" | "UPDATED" | "EXISTING" | undefined => {
    if (status === "NEW") return "NEW";
    if (status === "UPDATED") return "UPDATED";
    if (status === "SAME") return "EXISTING";
    return undefined;
  };

  return (
    <Stack gap="lg" className={classes.root}>
      <Title order={1}>Component Overview</Title>

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <Stack gap="md" align="center">
          <LoadingSpinner />
          <Text className={classes.loadingText}>Loading...</Text>
        </Stack>
      ) : (
        <>
          {/* Component Information Section */}
          <Card className={classes.componentInfoCard}>
            <Stack gap="sm">
              <Title order={3} className={classes.componentName}>
                {wizardState.selectedComponent?.name}
              </Title>

              <Stack gap="xs" className={classes.versionInfo}>
                <div className={classes.versionRow}>
                  <div className={classes.versionGroup}>
                    <Text variant="small" fw={600} color="secondary">
                      Import Version:
                    </Text>
                    <Text variant="small">
                      v{wizardState.selectedComponent?.version || 0}
                    </Text>
                    {(() => {
                      const importVersion =
                        wizardState.selectedComponent?.version || 0;
                      const badgeStatus = getBadgeStatus(
                        importVersion,
                        existingComponentVersion,
                      );
                      return (
                        badgeStatus && (
                          <Badge
                            status={badgeStatus}
                            className={classes.dependencyBadge}
                          />
                        )
                      );
                    })()}
                  </div>
                  <div className={classes.versionGroup}>
                    <Text variant="small" fw={600} color="secondary">
                      Current Version:
                    </Text>
                    <Text variant="small">
                      {existingComponentVersion !== null
                        ? `v${existingComponentVersion}`
                        : "Does not exist"}
                    </Text>
                  </div>
                </div>

                {componentDescription && (
                  <Text variant="small">{componentDescription}</Text>
                )}

                {componentUrl && (
                  <Text variant="small">
                    <a
                      href={componentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--mantine-color-blue-6)" }}
                    >
                      Documentation
                    </a>
                  </Text>
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
              </Stack>
            </Stack>
          </Card>

          {/* Dependencies Section */}
          <div className={classes.dependenciesSection}>
            <Title order={2} mb="sm">
              Additional Dependencies
            </Title>
            <Text variant="body" color="secondary" mb="sm">
              Select the additional dependent components you would also like to
              import
            </Text>

            {error ? (
              <Alert variant="error">{error}</Alert>
            ) : (
              (() => {
                // Filter out the main component from dependencies
                const mainComponentGuid = wizardState.selectedComponent?.guid;
                const filteredDependencies = dependencies.filter(
                  (dep) => dep.guid !== mainComponentGuid,
                );

                if (filteredDependencies.length === 0) {
                  return (
                    <Text variant="body" className={classes.emptyDependencies}>
                      No dependencies found.
                    </Text>
                  );
                }

                return (
                  <Stack gap="xs" className={classes.dependenciesList}>
                    {filteredDependencies.map((dep) => {
                      const included =
                        (dep as DependencySelection & { included?: boolean })
                          .included === true;
                      const isNew = dep.status === "NEW";
                      const badgeStatus = getDependencyBadgeStatus(dep.status);

                      return (
                        <div key={dep.guid} className={classes.dependencyItem}>
                          <Checkbox
                            checked={included}
                            disabled={isNew}
                            onChange={(e) =>
                              handleCheckboxToggle(dep.guid, e.target.checked)
                            }
                          />
                          <div className={classes.dependencyInfo}>
                            <Text className={classes.dependencyName}>
                              {dep.name}
                            </Text>
                          </div>
                          {badgeStatus && (
                            <Badge
                              status={badgeStatus}
                              className={classes.dependencyBadge}
                            />
                          )}
                        </div>
                      );
                    })}
                  </Stack>
                );
              })()
            )}
          </div>

          <div className={classes.actions}>
            <Button variant="filled" onClick={handleNext}>
              Next
            </Button>
          </div>
        </>
      )}
    </Stack>
  );
}
