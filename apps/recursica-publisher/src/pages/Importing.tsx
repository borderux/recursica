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

        // Get required files from the main file
        // We already checked that mainFile exists and has status "success" at the start of useEffect
        const mainFileData = importData.mainFile!.data!;
        const requiredFiles = getRequiredImportFiles(mainFileData);

        // Collect all files to import (main + additional)
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

        // Build array of all files to import with their names
        const allFilesToImport = [
          ...additionalFiles.map((file) => ({
            fileName: file.name,
            jsonData: file.data!,
          })),
          // Include main file
          ...(importData.mainFile?.data
            ? [
                {
                  fileName: importData.mainFile.name,
                  jsonData: importData.mainFile.data,
                },
              ]
            : []),
        ];

        // Use dependency resolver to import in correct order
        // This handles circular dependencies and ensures dependencies are imported first
        const { promise, cancel } = callPlugin("importPagesInOrder", {
          jsonFiles: allFilesToImport,
          mainFileName: importData.mainFile!.name, // Mark the main file so it always creates a copy (already validated at start of useEffect)
        });
        cancelFn = cancel;

        const importResult = await promise;

        // Check if component is still mounted before updating state
        if (!isMounted) {
          return;
        }

        if (!importResult.success) {
          // Import failed - cleanup all created entities
          const resultData = importResult.data as {
            createdEntities?: {
              pageIds?: string[];
              collectionIds?: string[];
              variableIds?: string[];
            };
            errors?: string[];
          };
          if (resultData?.createdEntities) {
            await callPlugin(
              "cleanupCreatedEntities",
              resultData.createdEntities,
            );
          }
          const errorMessage = importResult.message || "Failed to import pages";
          const errorDetails = resultData?.errors?.join("; ");
          setError(
            errorDetails ? `${errorMessage}. ${errorDetails}` : errorMessage,
          );
          return;
        }

        // Collect all deferred instances and entity IDs from individual imports
        // Note: importPagesInOrder handles the actual imports, but we need to track
        // the results. Since importPagesInOrder returns a summary, we'll need to
        // get the individual page results. For now, we'll use the summary data.
        // TODO: If we need individual page tracking, we might need to modify
        // importPagesInOrder to return more detailed results

        // Track imported components from the result
        if (importResult.data) {
          const resultData = importResult.data as {
            imported?: number;
            failed?: number;
            deferred?: number;
            errors?: string[];
            importedPages?: Array<{ name: string; pageId: string }>;
          };

          // Use importedPages from the result if available
          if (
            resultData?.importedPages &&
            resultData.importedPages.length > 0
          ) {
            // Filter out any entries with empty pageId (shouldn't happen, but be safe)
            const validPages = resultData.importedPages.filter(
              (p) => p.pageId && p.name,
            );
            if (validPages.length > 0) {
              setImportedComponents(validPages);
            } else if (resultData.imported && resultData.imported > 0) {
              // Fallback if all pages have empty IDs
              setImportedComponents([
                {
                  name: `Imported ${resultData.imported} page(s)`,
                  pageId: "",
                },
              ]);
            }
          } else if (resultData.imported && resultData.imported > 0) {
            // Fallback if importedPages not available
            setImportedComponents([
              {
                name: `Imported ${resultData.imported} page(s)`,
                pageId: "",
              },
            ]);
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
    if (!component.pageId) {
      console.warn("Cannot view component: pageId is empty");
      return;
    }
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
                    disabled={!component.pageId}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: "transparent",
                      color: component.pageId ? "#d40d0d" : "#999",
                      border: `1px solid ${component.pageId ? "#d40d0d" : "#999"}`,
                      borderRadius: "4px",
                      cursor: component.pageId ? "pointer" : "not-allowed",
                      opacity: component.pageId ? 1 : 0.5,
                    }}
                    onMouseOver={(e) => {
                      if (component.pageId) {
                        e.currentTarget.style.backgroundColor = "#d40d0d";
                        e.currentTarget.style.color = "white";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (component.pageId) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#d40d0d";
                      }
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
