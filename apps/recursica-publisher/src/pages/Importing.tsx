import { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import DebugConsole from "../components/DebugConsole";
import PluginPrompt from "../components/PluginPrompt";
import { callPlugin } from "../utils/callPlugin";
import { useImportData } from "../context/ImportDataContext";
import {
  getRequiredImportFiles,
  fileMatchesRequired,
} from "../utils/getRequiredImportFiles";

interface ImportedComponent {
  name: string;
  pageId: string;
}

export default function Importing() {
  const { importData } = useImportData();
  const [importedComponents, setImportedComponents] = useState<
    ImportedComponent[]
  >([]);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start importing when component mounts
  useEffect(() => {
    if (
      !importData ||
      !importData.mainFile ||
      importData.mainFile.status !== "success"
    ) {
      setError("No import data available");
      return;
    }

    let cancelFn: ((errorOnCancel?: boolean) => void) | null = null;
    let isMounted = true;

    const startImporting = async () => {
      // Track all created entity IDs across all imports for cleanup
      const allCreatedEntityIds = {
        pageIds: [] as string[],
        collectionIds: [] as string[],
        variableIds: [] as string[],
      };

      try {
        setIsImporting(true);
        setError(null);

        // Track imported components (will be populated as imports complete)
        const components: ImportedComponent[] = [];

        // Get required files from the main file
        // We already checked that mainFile exists and has status "success" at the start of useEffect
        const mainFileData = importData.mainFile!.data!;
        const requiredFiles = getRequiredImportFiles(mainFileData);

        // Import referenced files first (before main file)
        // This ensures they're available when the main file references them
        // Only import files that are actually referenced (match a required file)
        const additionalFiles = importData.additionalFiles.filter((file) => {
          // Only process successfully loaded files
          if (file.status !== "success" || !file.data) {
            return false;
          }

          // Check if this file matches any required file
          return requiredFiles.some((requiredFile) =>
            fileMatchesRequired(file.data, requiredFile),
          );
        });

        for (const additionalFile of additionalFiles) {
          if (!isMounted) {
            return;
          }

          const { promise, cancel } = callPlugin("importPage", {
            jsonData: additionalFile.data,
            deleteScratchPagesOnFailure: false,
          });
          cancelFn = cancel;

          const response = await promise;

          // Check if component is still mounted before updating state
          if (!isMounted) {
            return;
          }

          if (!response.success) {
            // Import failed - cleanup all created entities
            await callPlugin("cleanupCreatedEntities", allCreatedEntityIds);
            setError(
              response.message ||
                `Failed to import referenced file. Please try again.`,
            );
            return;
          }

          // Track created entity IDs from this import
          if (response.data?.createdEntities) {
            const entities = response.data.createdEntities as {
              pageIds?: string[];
              collectionIds?: string[];
              variableIds?: string[];
            };
            if (entities.pageIds) {
              allCreatedEntityIds.pageIds.push(...entities.pageIds);
            }
            if (entities.collectionIds) {
              allCreatedEntityIds.collectionIds.push(...entities.collectionIds);
            }
            if (entities.variableIds) {
              allCreatedEntityIds.variableIds.push(...entities.variableIds);
            }
          }

          // Track imported component (use the actual page name from response)
          if (response.data?.pageName && response.data?.createdEntities) {
            const entities = response.data.createdEntities as {
              pageIds?: string[];
            };
            if (entities.pageIds && entities.pageIds.length > 0) {
              components.push({
                name: response.data.pageName as string,
                pageId: entities.pageIds[0],
              });
              setImportedComponents([...components]);
            }
          }
        }

        // Import main file last
        if (importData.mainFile && importData.mainFile.data) {
          if (!isMounted) {
            return;
          }

          const mainFileData = importData.mainFile.data;
          const { promise, cancel } = callPlugin("importPage", {
            jsonData: mainFileData,
            deleteScratchPagesOnFailure: false,
          });
          cancelFn = cancel;

          const response = await promise;

          // Check if component is still mounted before updating state
          if (!isMounted) {
            return;
          }

          if (!response.success) {
            // Import failed - cleanup all created entities
            await callPlugin("cleanupCreatedEntities", allCreatedEntityIds);
            setError(
              response.message || "Failed to import page. Please try again.",
            );
            return;
          }

          // Track created entity IDs from main file import
          if (response.data?.createdEntities) {
            const entities = response.data.createdEntities as {
              pageIds?: string[];
              collectionIds?: string[];
              variableIds?: string[];
            };
            if (entities.pageIds) {
              allCreatedEntityIds.pageIds.push(...entities.pageIds);
            }
            if (entities.collectionIds) {
              allCreatedEntityIds.collectionIds.push(...entities.collectionIds);
            }
            if (entities.variableIds) {
              allCreatedEntityIds.variableIds.push(...entities.variableIds);
            }
          }

          // Track imported component (use the actual page name from response)
          if (response.data?.pageName && response.data?.createdEntities) {
            const entities = response.data.createdEntities as {
              pageIds?: string[];
            };
            if (entities.pageIds && entities.pageIds.length > 0) {
              components.push({
                name: response.data.pageName as string,
                pageId: entities.pageIds[0],
              });
              setImportedComponents([...components]);
            }
          }
        }
      } catch (err) {
        // Import failed with exception - cleanup all created entities
        if (
          allCreatedEntityIds.pageIds.length > 0 ||
          allCreatedEntityIds.collectionIds.length > 0 ||
          allCreatedEntityIds.variableIds.length > 0
        ) {
          await callPlugin("cleanupCreatedEntities", allCreatedEntityIds);
        }
        // Only set error if component is still mounted
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to import page",
          );
        }
      } finally {
        if (isMounted) {
          setIsImporting(false);
        }
      }
    };

    startImporting();

    // Cleanup: cancel the plugin call if component unmounts
    return () => {
      isMounted = false;
      if (cancelFn) {
        cancelFn(false); // Cancel without error since user navigated away
      }
    };
  }, [importData]);

  const handleView = async (component: ImportedComponent) => {
    try {
      await callPlugin("switchToPage", { pageId: component.pageId });
    } catch (error) {
      console.error("Error switching to page:", error);
    }
  };

  return (
    <PageLayout showBackButton={true}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Importing</h1>

        <DebugConsole label="Import Logs:" showClearButton={false} />

        <PluginPrompt />

        <div>
          <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "18px" }}>
            Imported Components:
          </h2>
          {isImporting ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #e0e0e0",
                  borderTop: "2px solid #666",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "#666", fontStyle: "italic", margin: 0 }}>
                Waiting for import to complete...
              </p>
            </div>
          ) : error ? (
            <p style={{ color: "#c62828", fontStyle: "italic" }}>{error}</p>
          ) : importedComponents.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              Waiting for import to complete...
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {importedComponents.map((component) => (
                <li
                  key={component.pageId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    marginBottom: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{component.name}</span>
                  <button
                    onClick={() => handleView(component)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: "transparent",
                      color: "#d40d0d",
                      border: "1px solid #d40d0d",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#d40d0d";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#d40d0d";
                    }}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
