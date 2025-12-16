import { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import PageLayout from "../components/PageLayout";
import type {
  ExportPageResponseData,
  ReferencedPageInfo,
} from "../plugin/services/pageExportNew";
import { useAuth } from "../context/useAuth";
import {
  GitHubService,
  type ComponentInfo,
} from "../services/github/githubService";
import { callPlugin } from "../utils/callPlugin";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

interface PublishingWizardLocationState {
  exportData?: ExportPageResponseData;
  pageIndex?: number;
  mainBranchComponents?: ComponentInfo[];
}

type WizardStep = "initial" | "selectReferencedPages" | "dependency" | "main";

interface PagePublishDecision {
  pageName: string;
  publishNewVersion: boolean;
  changeMessage: string;
  currentVersion: number | "UNPUBLISHED";
  newVersion: number;
}

export default function PublishingWizard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [wizardStep, setWizardStep] = useState<WizardStep>("initial");
  const [currentDependencyIndex, setCurrentDependencyIndex] = useState(0);
  const [pageDecisions, setPageDecisions] = useState<
    Map<string, PagePublishDecision>
  >(new Map());
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  // Components from main branch, loaded after publishing for comparison in wizard
  const [mainBranchComponents, setMainBranchComponents] = useState<
    ComponentInfo[] | null
  >(null);
  const [exportData, setExportData] = useState<ExportPageResponseData | null>(
    null,
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [discoveredReferencedPages, setDiscoveredReferencedPages] = useState<
    ReferencedPageInfo[]
  >([]);
  const [selectedReferencedPageIds, setSelectedReferencedPageIds] = useState<
    Set<string>
  >(new Set());
  const [isExportingReferencedPages, setIsExportingReferencedPages] =
    useState(false);

  // Get data from location state or search params
  const state = location.state as PublishingWizardLocationState | null;
  const [searchParams] = useSearchParams();
  const pageIndexFromState = state?.pageIndex;
  const pageIndexFromParams = searchParams.get("pageIndex");
  const pageIndex =
    pageIndexFromState ??
    (pageIndexFromParams ? parseInt(pageIndexFromParams, 10) : undefined);

  // Initialize exportData from location state if available
  useEffect(() => {
    if (state?.exportData) {
      setExportData(state.exportData);
      console.log(
        `[PublishingWizard] Loaded export data from location state for page: ${state.exportData.pageName}`,
      );
    }
  }, [state?.exportData]);

  // Initialize mainBranchComponents from location state if available
  useEffect(() => {
    if (state?.mainBranchComponents) {
      setMainBranchComponents(state.mainBranchComponents);
      console.log(
        `[PublishingWizard] Loaded ${state.mainBranchComponents.length} components from location state`,
      );
    }
  }, [state?.mainBranchComponents]);

  // If we have pageIndex but no exportData, export the page
  useEffect(() => {
    if (
      pageIndex !== undefined &&
      !isNaN(pageIndex) &&
      !exportData &&
      !isExporting &&
      !exportError
    ) {
      const doExport = async () => {
        try {
          setIsExporting(true);
          setExportError(null);
          console.log(
            `[PublishingWizard] Exporting page with index: ${pageIndex}`,
          );

          const { promise } = callPlugin("exportPage", {
            pageIndex,
            skipPrompts: true, // Skip prompts - wizard will handle questions
          });
          const response = await promise;

          if (response.success && response.data) {
            const exportedData =
              response.data as unknown as ExportPageResponseData;
            setExportData(exportedData);
            console.log(
              `[PublishingWizard] Export successful for page: ${exportedData.pageName}`,
            );

            // Check if there are discovered referenced pages to ask user about
            if (
              exportedData.discoveredReferencedPages &&
              exportedData.discoveredReferencedPages.length > 0
            ) {
              console.log(
                `[PublishingWizard] Found ${exportedData.discoveredReferencedPages.length} discovered referenced pages`,
              );
              setDiscoveredReferencedPages(
                exportedData.discoveredReferencedPages,
              );
              // Pre-select all pages by default
              setSelectedReferencedPageIds(
                new Set(
                  exportedData.discoveredReferencedPages.map((p) => p.pageId),
                ),
              );
              setWizardStep("selectReferencedPages");
            } else if (exportedData.additionalPages.length > 0) {
              // Has additional pages already exported, go to dependency step
              setWizardStep("dependency");
              setCurrentDependencyIndex(0);
            } else {
              // No dependencies, go straight to main
              setWizardStep("main");
            }
          } else {
            const errorMessage =
              response.message || "Failed to export page. Please try again.";
            setExportError(errorMessage);
            console.error("[PublishingWizard] Export failed:", errorMessage);
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to export page";
          setExportError(errorMessage);
          console.error("[PublishingWizard] Export error:", errorMessage);
        } finally {
          setIsExporting(false);
        }
      };

      doExport();
    }
  }, [pageIndex, exportData, isExporting, exportError]);

  // Get all pages that will be published (flattened list)
  const getAllPages = useCallback(
    (pageData: ExportPageResponseData): ExportPageResponseData[] => {
      const pages = [pageData];
      for (const additionalPage of pageData.additionalPages) {
        pages.push(...getAllPages(additionalPage));
      }
      return pages;
    },
    [],
  );

  const allPages = useMemo(
    () => (exportData ? getAllPages(exportData) : []),
    [exportData, getAllPages],
  );

  // Get current page being processed
  const getCurrentPage = useCallback(() => {
    if (!exportData) return null;
    if (wizardStep === "dependency") {
      return exportData.additionalPages[currentDependencyIndex];
    }
    if (wizardStep === "main") {
      return exportData;
    }
    return null;
  }, [wizardStep, currentDependencyIndex, exportData]);

  const currentPage = getCurrentPage();

  // Get version info for a page
  const getVersionInfo = useCallback(
    (
      page: ExportPageResponseData,
    ): {
      currentVersion: number | "UNPUBLISHED";
      newVersion: number;
    } => {
      // Get GUID from page metadata
      const pageGuid = page.pageData?.metadata?.guid;

      // Get version from repository index.json if available
      let currentVersion: number | "UNPUBLISHED" = "UNPUBLISHED";
      if (mainBranchComponents && pageGuid) {
        const component = mainBranchComponents.find((c) => c.guid === pageGuid);
        if (
          component &&
          component.version !== undefined &&
          component.version > 0
        ) {
          currentVersion = component.version;
        }
      }

      // New version comes from the page's metadata version (which is already incremented)
      const newVersion = page.pageData?.metadata?.version || 1;

      return { currentVersion, newVersion };
    },
    [mainBranchComponents],
  );

  // Get decision for a page
  const getPageDecision = useCallback(
    (pageName: string): PagePublishDecision | null => {
      return pageDecisions.get(pageName) || null;
    },
    [pageDecisions],
  );

  // Update decision for a page
  const updatePageDecision = useCallback(
    (pageName: string, decision: Partial<PagePublishDecision>) => {
      setPageDecisions((prev) => {
        const newMap = new Map(prev);
        const existing = newMap.get(pageName);
        newMap.set(pageName, {
          pageName,
          publishNewVersion: true,
          changeMessage: "",
          currentVersion: 0,
          newVersion: 1,
          ...existing,
          ...decision,
        });
        return newMap;
      });
    },
    [],
  );

  // Update export data with decisions (update versions, history, and instanceTable references)
  const updateExportDataWithDecisions = useCallback(
    (
      pageData: ExportPageResponseData,
      decisions: Map<string, PagePublishDecision>,
      mainBranchComponents: ComponentInfo[] | null = null,
    ): ExportPageResponseData => {
      const decision = decisions.get(pageData.pageName);
      const updatedPageData = JSON.parse(JSON.stringify(pageData.pageData)); // Deep clone

      console.log(
        `[updateExportDataWithDecisions] Processing page: ${pageData.pageName}`,
      );

      if (decision) {
        if (decision.publishNewVersion) {
          console.log(
            `[updateExportDataWithDecisions] Publishing new version for ${pageData.pageName}: version ${decision.newVersion}`,
          );
          // Update version in metadata
          if (updatedPageData.metadata) {
            updatedPageData.metadata.version = decision.newVersion;
            // Remove changeMessage from metadata (it's in history)
            delete updatedPageData.metadata.changeMessage;
            // Remove exportedAt if it exists (redundant with publishDate)
            delete updatedPageData.metadata.exportedAt;
            updatedPageData.metadata.publishDate = new Date().toISOString();

            // Add history entry
            if (!updatedPageData.metadata.history) {
              updatedPageData.metadata.history = {};
            }
            const historyKey = `${decision.newVersion}`; // Use just the version number, not "v1"
            updatedPageData.metadata.history[historyKey] = {
              message: decision.changeMessage,
              date: new Date().toISOString(),
            };
            console.log(
              `[updateExportDataWithDecisions] Added history entry for ${pageData.pageName}: ${historyKey}`,
            );
          }

          // Update instanceTable entries to reference new versions of components being published in this session
          if (updatedPageData.instances) {
            const instanceTable = updatedPageData.instances;
            // Handle both array format and object format (compressed keys)
            const entries = Array.isArray(instanceTable)
              ? instanceTable
              : Object.values(instanceTable);

            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              if (!entry || typeof entry !== "object") {
                continue;
              }

              // Check for both expanded and compressed key formats
              const instanceType =
                entry.instanceType || entry.instT || entry.instType;
              const componentPageName =
                entry.componentPageName || entry.cPage || entry.componentPage;

              // Only process normal instances that reference other components
              if (instanceType === "normal" && componentPageName) {
                // Find if the referenced component is also being published in this session
                const referencedComponentDecision =
                  decisions.get(componentPageName);

                if (referencedComponentDecision?.publishNewVersion) {
                  const newVersion = referencedComponentDecision.newVersion;
                  console.log(
                    `[updateExportDataWithDecisions] Updating instanceTable entry ${i} in ${pageData.pageName}: component ${componentPageName} version -> ${newVersion}`,
                  );

                  // Update both expanded and compressed formats
                  if (entry.componentVersion !== undefined) {
                    entry.componentVersion = newVersion;
                  }
                  if (entry.cVers !== undefined) {
                    entry.cVers = newVersion;
                  }
                } else if (referencedComponentDecision) {
                  console.log(
                    `[updateExportDataWithDecisions] Component ${componentPageName} is not being published (keep current version), keeping existing version in instanceTable`,
                  );
                } else {
                  console.log(
                    `[updateExportDataWithDecisions] Component ${componentPageName} not found in decisions, keeping existing version in instanceTable`,
                  );
                }
              }
            }
          }
        } else {
          console.log(
            `[updateExportDataWithDecisions] Keeping current version for ${pageData.pageName}, updating instanceTable references`,
          );
          // If keeping current version, we need to update instanceTable to reference the published component
          // Find the component in mainBranchComponents to get its version
          const pageGuid = updatedPageData.metadata?.guid;
          if (pageGuid && mainBranchComponents) {
            const publishedComponent = mainBranchComponents.find(
              (c) => c.guid === pageGuid,
            );
            if (publishedComponent) {
              console.log(
                `[updateExportDataWithDecisions] Found published component for ${pageData.pageName}: GUID ${pageGuid}, version ${publishedComponent.version}`,
              );
              // Update instanceTable entries to reference the published component
              if (updatedPageData.instances) {
                const instanceTable = updatedPageData.instances;
                if (Array.isArray(instanceTable)) {
                  for (let i = 0; i < instanceTable.length; i++) {
                    const entry = instanceTable[i];
                    if (
                      entry &&
                      typeof entry === "object" &&
                      entry.instanceType === "normal" &&
                      entry.componentGuid === pageGuid
                    ) {
                      console.log(
                        `[updateExportDataWithDecisions] Updating instanceTable entry ${i} to reference published version ${publishedComponent.version}`,
                      );
                      entry.componentVersion = publishedComponent.version;
                    }
                  }
                }
              }
            } else {
              console.warn(
                `[updateExportDataWithDecisions] Could not find published component for GUID ${pageGuid} in mainBranchComponents`,
              );
            }
          }
        }
      }

      // Recursively update additional pages
      const updatedAdditionalPages = pageData.additionalPages.map((page) =>
        updateExportDataWithDecisions(page, decisions, mainBranchComponents),
      );

      return {
        ...pageData,
        pageData: updatedPageData,
        additionalPages: updatedAdditionalPages,
      };
    },
    [],
  );

  // Early return after all hooks
  if (pageIndex === undefined || isNaN(pageIndex)) {
    return (
      <PageLayout showBackButton={true}>
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: "20px" }}>
            Publishing Wizard
          </h1>
          <p style={{ color: "#c62828" }}>
            Error: No page index provided. Please go back and try again.
          </p>
        </div>
      </PageLayout>
    );
  }

  if (isExporting) {
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
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            minHeight: "200px",
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: "20px" }}>
            Publishing Wizard
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #e0e0e0",
                borderTop: "2px solid #d40d0d",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "#666", fontStyle: "italic", margin: 0 }}>
              Exporting page...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (exportError) {
    return (
      <PageLayout showBackButton={true}>
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: "20px" }}>
            Publishing Wizard
          </h1>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: "8px",
              color: "#c62828",
            }}
          >
            <p style={{ margin: 0, fontWeight: "bold" }}>Export Failed</p>
            <p style={{ margin: "8px 0 0 0" }}>{exportError}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!exportData) {
    return (
      <PageLayout showBackButton={true}>
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: "20px" }}>
            Publishing Wizard
          </h1>
          <p style={{ color: "#c62828" }}>
            Error: No export data found. Please go back and try again.
          </p>
        </div>
      </PageLayout>
    );
  }

  // Handle exporting selected referenced pages
  const handleExportSelectedReferencedPages = async () => {
    if (selectedReferencedPageIds.size === 0) {
      setError("Please select at least one referenced page to include.");
      return;
    }

    setIsExportingReferencedPages(true);
    setError(null);

    try {
      const selectedPages = discoveredReferencedPages.filter((p) =>
        selectedReferencedPageIds.has(p.pageId),
      );
      const exportedPages: ExportPageResponseData[] = [];

      for (const pageInfo of selectedPages) {
        console.log(
          `[PublishingWizard] Exporting selected referenced page: ${pageInfo.pageName}`,
        );
        const { promise } = callPlugin("exportPage", {
          pageIndex: pageInfo.pageIndex,
          skipPrompts: true, // Skip prompts for nested references too
        });
        const response = await promise;

        if (response.success && response.data) {
          const exportedPageData =
            response.data as unknown as ExportPageResponseData;
          exportedPages.push(exportedPageData);
          console.log(
            `[PublishingWizard] Successfully exported: ${exportedPageData.pageName}`,
          );
        } else {
          throw new Error(
            `Failed to export "${pageInfo.pageName}": ${response.message}`,
          );
        }
      }

      // Update exportData with exported referenced pages
      if (exportData) {
        setExportData({
          ...exportData,
          additionalPages: exportedPages,
        });
      }

      // Move to next step
      if (exportedPages.length > 0) {
        setWizardStep("dependency");
        setCurrentDependencyIndex(0);
        // Initialize decision for first dependency
        const firstDep = exportedPages[0];
        const { currentVersion, newVersion } = getVersionInfo(firstDep);
        updatePageDecision(firstDep.pageName, {
          currentVersion,
          newVersion,
          publishNewVersion: false, // Default to not publishing
        });
      } else {
        // No pages selected, go straight to main
        setWizardStep("main");
        const { currentVersion, newVersion } = getVersionInfo(exportData!);
        updatePageDecision(exportData!.pageName, {
          currentVersion,
          newVersion,
          publishNewVersion: true,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to export referenced pages";
      setError(errorMessage);
      console.error("[PublishingWizard] Export error:", errorMessage);
    } finally {
      setIsExportingReferencedPages(false);
    }
  };

  // Handle start publishing
  const handleStartPublishing = () => {
    if (exportData.additionalPages.length > 0) {
      setWizardStep("dependency");
      setCurrentDependencyIndex(0);
      // Initialize decision for first dependency
      const firstDep = exportData.additionalPages[0];
      const { currentVersion, newVersion } = getVersionInfo(firstDep);
      updatePageDecision(firstDep.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: false, // Default to not publishing
      });
    } else {
      // No dependencies, go straight to main page
      setWizardStep("main");
      const { currentVersion, newVersion } = getVersionInfo(exportData);
      updatePageDecision(exportData.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: true,
      });
    }
  };

  // Handle back button
  const handleBack = () => {
    if (wizardStep === "selectReferencedPages") {
      // Go back to initial screen
      setWizardStep("initial");
    } else if (wizardStep === "dependency") {
      if (currentDependencyIndex > 0) {
        // Go back to previous dependency
        const prevIndex = currentDependencyIndex - 1;
        setCurrentDependencyIndex(prevIndex);
      } else {
        // Go back to select referenced pages if we have them, otherwise initial
        if (discoveredReferencedPages.length > 0) {
          setWizardStep("selectReferencedPages");
        } else {
          setWizardStep("initial");
        }
      }
    } else if (wizardStep === "main") {
      if (exportData.additionalPages.length > 0) {
        // Go back to last dependency
        setWizardStep("dependency");
        setCurrentDependencyIndex(exportData.additionalPages.length - 1);
      } else {
        // Go back to select referenced pages if we have them, otherwise initial
        if (discoveredReferencedPages.length > 0) {
          setWizardStep("selectReferencedPages");
        } else {
          setWizardStep("initial");
        }
      }
    } else {
      // From initial screen, go back to PublishingComplete
      navigate(-1);
    }
  };

  // Handle next in dependency wizard
  const handleNextDependency = () => {
    const currentDep = exportData.additionalPages[currentDependencyIndex];
    const decision = getPageDecision(currentDep.pageName);

    if (
      decision &&
      decision.publishNewVersion &&
      !decision.changeMessage.trim()
    ) {
      setError("Please enter a change message for this component.");
      return;
    }

    // Move to next dependency or main page
    if (currentDependencyIndex < exportData.additionalPages.length - 1) {
      const nextIndex = currentDependencyIndex + 1;
      setCurrentDependencyIndex(nextIndex);
      const nextDep = exportData.additionalPages[nextIndex];
      const { currentVersion, newVersion } = getVersionInfo(nextDep);
      updatePageDecision(nextDep.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: false,
      });
    } else {
      // Move to main page
      setWizardStep("main");
      const { currentVersion, newVersion } = getVersionInfo(exportData);
      updatePageDecision(exportData.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: true,
      });
    }
    setError(null);
  };

  // Handle keep current version for dependency
  const handleKeepCurrentVersion = () => {
    const currentDep = exportData.additionalPages[currentDependencyIndex];
    const { currentVersion, newVersion } = getVersionInfo(currentDep);
    updatePageDecision(currentDep.pageName, {
      publishNewVersion: false,
      changeMessage: "",
      currentVersion,
      newVersion,
    });

    // Move to next
    if (currentDependencyIndex < exportData.additionalPages.length - 1) {
      const nextIndex = currentDependencyIndex + 1;
      setCurrentDependencyIndex(nextIndex);
      const nextDep = exportData.additionalPages[nextIndex];
      const { currentVersion: nextCurrent, newVersion: nextNew } =
        getVersionInfo(nextDep);
      updatePageDecision(nextDep.pageName, {
        currentVersion: nextCurrent,
        newVersion: nextNew,
        publishNewVersion: false,
      });
    } else {
      setWizardStep("main");
      const { currentVersion, newVersion } = getVersionInfo(exportData);
      updatePageDecision(exportData.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: true,
      });
    }
    setError(null);
  };

  // Handle publish new version button click
  const handlePublishNewVersion = () => {
    if (!currentPage) return;
    const { currentVersion, newVersion } = getVersionInfo(currentPage);
    updatePageDecision(currentPage.pageName, {
      publishNewVersion: true,
      currentVersion,
      newVersion,
    });
  };

  // Handle publish to GitHub
  const handlePublishToGitHub = async () => {
    const mainDecision = getPageDecision(exportData.pageName);
    if (!mainDecision || !mainDecision.changeMessage.trim()) {
      setError("Please enter a change message for the main component.");
      return;
    }

    if (!accessToken) {
      setError("No access token available. Please authenticate first.");
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      // Build the export data with updated metadata based on decisions
      console.log(
        "[handlePublishToGitHub] Updating export data with decisions...",
      );
      const updatedExportData = updateExportDataWithDecisions(
        exportData,
        pageDecisions,
        mainBranchComponents,
      );

      console.log(
        "[handlePublishToGitHub] Export data updated, passing to GitHub service (will stringify at commit time)",
      );

      const githubService = new GitHubService(accessToken);
      const result = await githubService.publishPageExports(
        RECURSICA_FIGMA_OWNER,
        RECURSICA_FIGMA_REPO,
        updatedExportData,
        "main",
        mainDecision.changeMessage.trim(),
        pageDecisions,
      );

      setPrUrl(result.pr.html_url);
      setIsPublishing(false);
    } catch (publishError) {
      setIsPublishing(false);
      setError(
        publishError instanceof Error
          ? publishError.message
          : "Failed to publish to GitHub. Please try again.",
      );
    }
  };

  // Render select referenced pages screen
  const renderSelectReferencedPagesScreen = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "10px" }}>
        Select Referenced Pages
      </h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        The following pages are referenced by your component. Select which ones
        you want to include in this publication:
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {discoveredReferencedPages.map((pageInfo) => {
          const isSelected = selectedReferencedPageIds.has(pageInfo.pageId);
          return (
            <div
              key={pageInfo.pageId}
              style={{
                padding: "16px",
                border: `2px solid ${isSelected ? "#1976d2" : "#e0e0e0"}`,
                borderRadius: "8px",
                backgroundColor: isSelected ? "#e3f2fd" : "#fafafa",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => {
                setSelectedReferencedPageIds((prev) => {
                  const newSet = new Set(prev);
                  if (isSelected) {
                    newSet.delete(pageInfo.pageId);
                  } else {
                    newSet.add(pageInfo.pageId);
                  }
                  return newSet;
                });
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    setSelectedReferencedPageIds((prev) => {
                      const newSet = new Set(prev);
                      if (isSelected) {
                        newSet.delete(pageInfo.pageId);
                      } else {
                        newSet.add(pageInfo.pageId);
                      }
                      return newSet;
                    });
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    {pageInfo.componentName || pageInfo.pageName}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Page: {pageInfo.pageName}
                  </div>
                  {!pageInfo.hasMetadata && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#f57c00",
                        marginTop: "4px",
                      }}
                    >
                      ⚠️ No metadata found - will need to be published
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            color: "#c62828",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Back
        </button>
        <button
          onClick={handleExportSelectedReferencedPages}
          disabled={isExportingReferencedPages}
          style={{
            padding: "10px 20px",
            backgroundColor:
              isExportingReferencedPages || selectedReferencedPageIds.size === 0
                ? "#ccc"
                : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor:
              isExportingReferencedPages || selectedReferencedPageIds.size === 0
                ? "not-allowed"
                : "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {isExportingReferencedPages
            ? "Exporting..."
            : `Continue (${selectedReferencedPageIds.size} selected)`}
        </button>
      </div>
    </div>
  );

  // Render initial screen
  const renderInitialScreen = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div>
        <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "18px" }}>
          Success! Your Recursica files are ready to be published...
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          The following files will be published as part of this wizard:
        </p>
        <ul
          style={{
            margin: "12px 0",
            paddingLeft: "20px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          {allPages.map((page, index) => (
            <li key={index}>{page.pageName}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleStartPublishing}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "transparent",
          color: "#d40d0d",
          border: "2px solid #d40d0d",
          borderRadius: "8px",
          cursor: "pointer",
          alignSelf: "flex-start",
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
        Start Publishing
      </button>
    </div>
  );

  // Render dependency page screen
  const renderDependencyScreen = () => {
    if (!currentPage) return null;

    const decision = getPageDecision(currentPage.pageName);
    const { currentVersion, newVersion } = getVersionInfo(currentPage);
    const mainPageName = exportData.pageName;

    // Initialize decision if not exists
    if (!decision) {
      updatePageDecision(currentPage.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: false,
      });
    }

    const currentDecision = decision || {
      pageName: currentPage.pageName,
      publishNewVersion: false,
      changeMessage: "",
      currentVersion,
      newVersion,
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p style={{ margin: "12px 0", fontSize: "14px" }}>
          This component is a dependency of <strong>{mainPageName}</strong>,
          should we publish it too?
        </p>

        <div>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            Current Version:{" "}
            <span style={{ color: "#333" }}>
              {currentVersion === "UNPUBLISHED"
                ? "UNPUBLISHED"
                : currentVersion}
            </span>
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            New Version:{" "}
            <span
              style={{
                color:
                  typeof currentVersion === "number" &&
                  newVersion < currentVersion
                    ? "#c62828"
                    : "#333",
              }}
            >
              {newVersion}
              {typeof currentVersion === "number" &&
                newVersion === currentVersion &&
                " (SAME)"}
            </span>
          </p>
          {typeof currentVersion === "number" &&
            newVersion < currentVersion && (
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "12px",
                  color: "#c62828",
                }}
              >
                WARNING: This version is older than our published version.
              </p>
            )}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleKeepCurrentVersion}
            disabled={currentVersion === "UNPUBLISHED"}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "bold",
              backgroundColor: "transparent",
              color: currentVersion === "UNPUBLISHED" ? "#999" : "#666",
              border: "2px solid",
              borderColor: currentVersion === "UNPUBLISHED" ? "#ccc" : "#666",
              borderRadius: "8px",
              cursor:
                currentVersion === "UNPUBLISHED" ? "not-allowed" : "pointer",
              opacity: currentVersion === "UNPUBLISHED" ? 0.5 : 1,
            }}
            onMouseOver={(e) => {
              if (currentVersion !== "UNPUBLISHED") {
                e.currentTarget.style.backgroundColor = "#666";
                e.currentTarget.style.color = "white";
              }
            }}
            onMouseOut={(e) => {
              if (currentVersion !== "UNPUBLISHED") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666";
              }
            }}
          >
            Keep Current Version
          </button>
          <button
            onClick={handlePublishNewVersion}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "bold",
              backgroundColor: "transparent",
              color: "#d40d0d",
              border: "2px solid #d40d0d",
              borderRadius: "8px",
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
            Publish New Version
          </button>
        </div>

        {currentDecision.publishNewVersion && (
          <>
            <div>
              <label
                htmlFor="change-message"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Change Message <span style={{ color: "#c62828" }}>*</span>
              </label>
              <textarea
                id="change-message"
                value={currentDecision.changeMessage}
                onChange={(e) => {
                  updatePageDecision(currentPage.pageName, {
                    changeMessage: e.target.value,
                  });
                }}
                placeholder="Describe the changes you made component..."
                required
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              onClick={handleNextDependency}
              disabled={!currentDecision.changeMessage.trim()}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: "transparent",
                color: !currentDecision.changeMessage.trim()
                  ? "#999"
                  : "#d40d0d",
                border: `2px solid ${
                  !currentDecision.changeMessage.trim() ? "#999" : "#d40d0d"
                }`,
                borderRadius: "8px",
                cursor: !currentDecision.changeMessage.trim()
                  ? "not-allowed"
                  : "pointer",
                opacity: !currentDecision.changeMessage.trim() ? 0.6 : 1,
                alignSelf: "flex-start",
              }}
              onMouseOver={(e) => {
                if (currentDecision.changeMessage.trim()) {
                  e.currentTarget.style.backgroundColor = "#d40d0d";
                  e.currentTarget.style.color = "white";
                }
              }}
              onMouseOut={(e) => {
                if (currentDecision.changeMessage.trim()) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#d40d0d";
                }
              }}
            >
              Next
            </button>
          </>
        )}
      </div>
    );
  };

  // Render main page screen
  const renderMainScreen = () => {
    const decision = getPageDecision(exportData.pageName);
    const { currentVersion, newVersion } = getVersionInfo(exportData);

    // Initialize decision if not exists
    if (!decision) {
      updatePageDecision(exportData.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: true,
      });
    }

    const currentDecision = decision || {
      pageName: exportData.pageName,
      publishNewVersion: true,
      changeMessage: "",
      currentVersion,
      newVersion,
    };

    // Check if version is invalid (same or older than current)
    const isVersionInvalid =
      typeof currentVersion === "number" && newVersion <= currentVersion;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            Page: <span style={{ color: "#333" }}>{exportData.pageName}</span>
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            Current Version:{" "}
            <span style={{ color: "#333" }}>
              {currentVersion === "UNPUBLISHED"
                ? "UNPUBLISHED"
                : currentVersion}
            </span>
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            New Version:{" "}
            <span
              style={{
                color:
                  typeof currentVersion === "number" &&
                  newVersion < currentVersion
                    ? "#c62828"
                    : "#333",
              }}
            >
              {newVersion}
              {typeof currentVersion === "number" &&
                newVersion === currentVersion &&
                " (SAME)"}
            </span>
          </p>
          {isVersionInvalid && (
            <div
              style={{
                margin: "12px 0 0 0",
                padding: "12px",
                fontSize: "14px",
                backgroundColor: "#fff3e0",
                border: "1px solid #f57c00",
                borderRadius: "4px",
                color: "#e65100",
                fontWeight: "bold",
              }}
            >
              ⚠️ Warning: This version is older than or equal to the currently
              published version. Publishing will still proceed if you continue.
            </div>
          )}
          {typeof currentVersion === "number" &&
            newVersion < currentVersion && (
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "12px",
                  color: "#c62828",
                }}
              >
                WARNING: This version is older than our published version.
              </p>
            )}
        </div>

        <div>
          <label
            htmlFor="change-message-main"
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Change Message <span style={{ color: "#c62828" }}>*</span>
          </label>
          <textarea
            id="change-message-main"
            value={currentDecision.changeMessage}
            onChange={(e) => {
              updatePageDecision(exportData.pageName, {
                changeMessage: e.target.value,
              });
            }}
            placeholder="Describe the changes you made component..."
            required
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              fontSize: "14px",
              fontFamily: "inherit",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </div>

        {prUrl ? (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e8f5e9",
              border: "1px solid #4caf50",
              borderRadius: "4px",
              alignSelf: "flex-start",
            }}
          >
            <p style={{ margin: "0 0 8px 0", color: "#2e7d32" }}>
              ✓ Successfully published to GitHub!
            </p>
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#2e7d32",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              View Pull Request
            </a>
          </div>
        ) : (
          <button
            onClick={handlePublishToGitHub}
            disabled={isPublishing || !currentDecision.changeMessage.trim()}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "transparent",
              color:
                isPublishing || !currentDecision.changeMessage.trim()
                  ? "#999"
                  : "#d40d0d",
              border: `2px solid ${
                isPublishing || !currentDecision.changeMessage.trim()
                  ? "#999"
                  : "#d40d0d"
              }`,
              borderRadius: "8px",
              cursor:
                isPublishing || !currentDecision.changeMessage.trim()
                  ? "not-allowed"
                  : "pointer",
              opacity:
                isPublishing || !currentDecision.changeMessage.trim() ? 0.6 : 1,
              alignSelf: "flex-start",
            }}
            onMouseOver={(e) => {
              if (!isPublishing && currentDecision.changeMessage.trim()) {
                e.currentTarget.style.backgroundColor = "#d40d0d";
                e.currentTarget.style.color = "white";
              }
            }}
            onMouseOut={(e) => {
              if (!isPublishing && currentDecision.changeMessage.trim()) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#d40d0d";
              }
            }}
          >
            {isPublishing ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid currentColor",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Publishing to GitHub...
              </span>
            ) : (
              "Publish to GitHub"
            )}
          </button>
        )}
      </div>
    );
  };

  const getPageTitle = () => {
    if (wizardStep === "initial") {
      return `Publishing: ${exportData.pageName}`;
    }
    if (wizardStep === "dependency" && currentPage) {
      return `Publishing: ${currentPage.pageName}`;
    }
    if (wizardStep === "main") {
      return `Publishing: ${exportData.pageName}`;
    }
    return `Publishing: ${exportData.pageName}`;
  };

  return (
    <PageLayout showBackButton={true} onBack={handleBack}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          textarea:focus {
            outline: none;
            border-color: #d40d0d !important;
            border-width: 2px !important;
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>{getPageTitle()}</h1>

        {error && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: "4px",
              color: "#c62828",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {wizardStep === "initial" && renderInitialScreen()}
        {wizardStep === "selectReferencedPages" &&
          renderSelectReferencedPagesScreen()}
        {wizardStep === "dependency" && renderDependencyScreen()}
        {wizardStep === "main" && renderMainScreen()}
      </div>
    </PageLayout>
  );
}
