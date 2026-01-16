import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { DebugConsole } from "../components/DebugConsole";
import type {
  ExportPageResponseData,
  ReferencedPageInfo,
} from "../plugin/services/import-export/pageExportNew";
import { useAuth } from "../context/useAuth";
import {
  GitHubService,
  type ComponentInfo,
} from "../services/github/githubService";
import type { DebugConsoleMessage } from "../plugin/services/import-export/debugConsole";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

interface PublishingWizardLocationState {
  exportData?: ExportPageResponseData;
  pageIndex?: number;
  mainBranchComponents?: ComponentInfo[];
}

type WizardStep =
  | "initial"
  | "validationErrors"
  | "selectReferencedPages"
  | "publishing"
  | "componentRevision"
  | "finalPublish";

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
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
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
  // These are no longer used since export happens in Publishing page, but kept for compatibility
  const isExporting = false;
  const exportError: string | null = null;
  const exportDebugLogs: DebugConsoleMessage[] | undefined = undefined;
  const isExportingReferencedPages = false;
  const [discoveredReferencedPages, setDiscoveredReferencedPages] = useState<
    ReferencedPageInfo[]
  >([]);
  const [selectedReferencedPageIds, setSelectedReferencedPageIds] = useState<
    Set<string>
  >(new Set());
  const [hasExportedReferencedPages, setHasExportedReferencedPages] =
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

  // Initialize mainBranchComponents from location state if available, or load it
  useEffect(() => {
    if (state?.mainBranchComponents) {
      setMainBranchComponents(state.mainBranchComponents);
      console.log(
        `[PublishingWizard] Loaded ${state.mainBranchComponents.length} components from location state`,
      );
    } else if (accessToken && !mainBranchComponents) {
      // Load mainBranchComponents if not provided in state
      const loadMainBranchComponents = async () => {
        try {
          const githubService = new GitHubService(accessToken);
          const components = await githubService.loadComponentsFromBranch(
            RECURSICA_FIGMA_OWNER,
            RECURSICA_FIGMA_REPO,
            "main",
          );
          setMainBranchComponents(components);
          console.log(
            `[PublishingWizard] Loaded ${components.length} components from main branch`,
          );
        } catch (err) {
          console.error(
            "[PublishingWizard] Failed to load main branch components:",
            err,
          );
          // Continue without mainBranchComponents - version checking will be limited
        }
      };
      loadMainBranchComponents();
    }
  }, [state?.mainBranchComponents, accessToken, mainBranchComponents]);

  // Note: We no longer do a second export here. The export is done in the Publishing page
  // and the exportData is passed via navigation state. If there's no exportData, show an error.
  useEffect(() => {
    if (!exportData && !isExporting && !state?.exportData) {
      // If we have a pageIndex but no exportData, it means we navigated here incorrectly
      // (should always come from Publishing page with exportData)
      if (pageIndex !== undefined) {
        console.error(
          "[PublishingWizard] No exportData provided. Wizard should be accessed from Publishing page.",
        );
        setError(
          "No export data found. Please start from the Publishing page.",
        );
      }
    }
  }, [exportData, state?.exportData, pageIndex, isExporting]);

  // Get current page being processed
  const getCurrentPage = useCallback(() => {
    if (!exportData) return null;
    if (wizardStep === "componentRevision") {
      // Get all pages that will be published (main + selected referenced pages)
      const pagesToPublish: ExportPageResponseData[] = [exportData];
      // Add selected referenced pages that were exported
      for (const pageInfo of discoveredReferencedPages) {
        if (selectedReferencedPageIds.has(pageInfo.pageId)) {
          const exportedPage = exportData.additionalPages.find(
            (p) => p.pageName === pageInfo.pageName,
          );
          if (exportedPage) {
            pagesToPublish.push(exportedPage);
          }
        }
      }
      if (currentComponentIndex < pagesToPublish.length) {
        return pagesToPublish[currentComponentIndex];
      }
    }
    return null;
  }, [
    wizardStep,
    currentComponentIndex,
    exportData,
    discoveredReferencedPages,
    selectedReferencedPageIds,
  ]);

  const currentPage = getCurrentPage();

  // Get all pages that will be published (main + selected referenced pages)
  const getPagesToPublish = useCallback((): ExportPageResponseData[] => {
    if (!exportData) return [];
    const pages: ExportPageResponseData[] = [exportData]; // Main page always included
    // Add selected referenced pages that were exported
    for (const pageInfo of discoveredReferencedPages) {
      if (selectedReferencedPageIds.has(pageInfo.pageId)) {
        const exportedPage = exportData.additionalPages.find(
          (p) => p.pageName === pageInfo.pageName,
        );
        if (exportedPage) {
          pages.push(exportedPage);
        }
      }
    }
    return pages;
  }, [exportData, discoveredReferencedPages, selectedReferencedPageIds]);

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
      // Also check page metadata version as a fallback (in case component was published but index.json isn't loaded yet)
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

      // Fallback: If not found in mainBranchComponents, check page metadata version
      // This handles the case where the component was published but mainBranchComponents isn't loaded yet
      if (
        currentVersion === "UNPUBLISHED" &&
        page.pageData?.metadata?.version
      ) {
        const pageMetadataVersion = page.pageData.metadata.version;
        // Only use page metadata version if it's > 0 (0 means unpublished)
        if (pageMetadataVersion > 0) {
          currentVersion = pageMetadataVersion;
        }
      }

      // If there's a published version, new version should be currentVersion + 1
      // Otherwise, if the page has metadata with a version, use that (but at least 1)
      // Otherwise, default to 1
      let newVersion: number;
      if (currentVersion !== "UNPUBLISHED") {
        // Component is already published - increment the published version
        newVersion = currentVersion + 1;
      } else {
        // Component is not published - use version from page metadata if available, otherwise 1
        // But also check if page metadata has a version that suggests it was published before
        const pageMetadataVersion = page.pageData?.metadata?.version;
        if (pageMetadataVersion && pageMetadataVersion > 0) {
          // Page has metadata version - this might be from a previous publish
          // But since it's not in index.json, treat as unpublished and start at 1
          newVersion = 1;
        } else {
          newVersion = 1;
        }
      }

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

  // Process exportData when it's loaded (from state or export) and set wizard step
  useEffect(() => {
    if (!exportData || wizardStep !== "initial") return;

    console.log(
      "[PublishingWizard] Processing export data to determine wizard step",
      {
        hasValidationErrors: !!exportData.validationResult?.hasErrors,
        hasReferencedPages: !!exportData.discoveredReferencedPages?.length,
      },
    );

    // Check for validation errors first
    if (exportData.validationResult && exportData.validationResult.hasErrors) {
      console.log(
        `[PublishingWizard] Validation errors found: ${exportData.validationResult.errors.length} error(s)`,
      );
      setWizardStep("validationErrors");
    } else if (
      exportData.discoveredReferencedPages &&
      exportData.discoveredReferencedPages.length > 0
    ) {
      // Check if there are discovered referenced pages to ask user about
      console.log(
        `[PublishingWizard] Found ${exportData.discoveredReferencedPages.length} discovered referenced pages`,
      );
      setDiscoveredReferencedPages(exportData.discoveredReferencedPages);
      // Pre-select all pages by default
      setSelectedReferencedPageIds(
        new Set(exportData.discoveredReferencedPages.map((p) => p.pageId)),
      );
      setWizardStep("selectReferencedPages");
    } else {
      // No discovered referenced pages, initialize main page decision and go directly to componentRevision
      // (skip publishing step since export is already complete)
      const { currentVersion, newVersion } = getVersionInfo(exportData);
      updatePageDecision(exportData.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: true,
        changeMessage: "",
      });
      setHasExportedReferencedPages(true); // No pages to export, so mark as done
      // Go directly to componentRevision since export is already complete
      setWizardStep("componentRevision");
      setCurrentComponentIndex(0);
    }
  }, [exportData, wizardStep, getVersionInfo, updatePageDecision]);

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
            // Preserve existing history before updating
            const existingHistory =
              updatedPageData.metadata.history &&
              typeof updatedPageData.metadata.history === "object" &&
              !Array.isArray(updatedPageData.metadata.history)
                ? { ...updatedPageData.metadata.history }
                : {};

            // Validate that new version is higher than existing versions in history
            const existingVersions = Object.keys(existingHistory)
              .map((key) => {
                const version = parseInt(key, 10);
                return isNaN(version) ? 0 : version;
              })
              .filter((v) => v > 0);

            if (existingVersions.length > 0) {
              const maxExistingVersion = Math.max(...existingVersions);
              if (decision.newVersion <= maxExistingVersion) {
                console.warn(
                  `[updateExportDataWithDecisions] Warning: New version ${decision.newVersion} is not higher than existing max version ${maxExistingVersion} in history for ${pageData.pageName}. Proceeding anyway.`,
                );
              }
            }

            updatedPageData.metadata.version = decision.newVersion;
            // Remove changeMessage from metadata (it's in history)
            delete updatedPageData.metadata.changeMessage;
            // Remove exportedAt if it exists (redundant with publishDate)
            delete updatedPageData.metadata.exportedAt;
            updatedPageData.metadata.publishDate = new Date().toISOString();

            // Preserve existing history and add new entry at the top (newest first)
            const historyKey = `${decision.newVersion}`; // Use just the version number, not "v1"
            updatedPageData.metadata.history = {
              [historyKey]: {
                message: decision.changeMessage,
                date: new Date().toISOString(),
              },
              ...existingHistory, // Spread existing history after new entry (newest first)
            };
            console.log(
              `[updateExportDataWithDecisions] Added history entry for ${pageData.pageName}: ${historyKey} (preserved ${Object.keys(existingHistory).length} existing entries)`,
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

      // Recursively update additional pages, but only include pages that should be published
      // Filter out pages that don't have a decision or have publishNewVersion: false
      const updatedAdditionalPages = pageData.additionalPages
        .filter((page) => {
          const pageDecision = decisions.get(page.pageName);
          // Only include pages that have a decision with publishNewVersion: true
          // Pages without a decision are excluded (they were deselected)
          return pageDecision?.publishNewVersion === true;
        })
        .map((page) =>
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

  // Process selected referenced pages when publishing step is shown
  // Use already-exported pages from additionalPages instead of re-exporting
  useEffect(() => {
    if (
      wizardStep === "publishing" &&
      !hasExportedReferencedPages &&
      !isExportingReferencedPages &&
      discoveredReferencedPages.length > 0 &&
      exportData
    ) {
      console.log(
        `[PublishingWizard] Processing ${discoveredReferencedPages.length} discovered referenced page(s)...`,
      );

      const selectedPages = discoveredReferencedPages.filter((p) =>
        selectedReferencedPageIds.has(p.pageId),
      );

      // Use already-exported pages from additionalPages
      const exportedPages: ExportPageResponseData[] = [];

      for (const pageInfo of selectedPages) {
        // Find the page in additionalPages (already exported)
        const exportedPage = exportData.additionalPages.find(
          (p) => p.pageName === pageInfo.pageName,
        );

        if (exportedPage) {
          exportedPages.push(exportedPage);
          console.log(
            `[PublishingWizard] ✓ Using already-exported page: ${exportedPage.pageName}`,
          );
        } else {
          console.warn(
            `[PublishingWizard] Referenced page "${pageInfo.pageName}" not found in additionalPages. This should not happen if the full export was performed.`,
          );
        }
      }

      console.log(
        `[PublishingWizard] ✓ Processed ${exportedPages.length} referenced page(s) from export data`,
      );

      // Initialize decisions for selected referenced pages
      for (const exportedPage of exportedPages) {
        const { currentVersion, newVersion } = getVersionInfo(exportedPage);
        updatePageDecision(exportedPage.pageName, {
          currentVersion,
          newVersion,
          publishNewVersion: true,
          changeMessage: "",
        });
      }

      setHasExportedReferencedPages(true);
      console.log(
        `[PublishingWizard] Finished processing ${exportedPages.length} referenced page(s)`,
      );

      // Since export is already complete, go directly to componentRevision
      // (skip publishing step)
      if (wizardStep === "publishing") {
        console.log(
          "[PublishingWizard] Export complete, proceeding to componentRevision",
        );
        setWizardStep("componentRevision");
        setCurrentComponentIndex(0);
      }
    }
  }, [
    wizardStep,
    hasExportedReferencedPages,
    isExportingReferencedPages,
    discoveredReferencedPages,
    selectedReferencedPageIds,
    exportData,
    getVersionInfo,
    updatePageDecision,
  ]);

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
        <DebugConsole
          title="Exporting Page"
          isActive={true}
          isComplete={false}
          error={null}
          debugLogs={undefined}
        />
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
              marginBottom: "16px",
            }}
          >
            <DebugConsole
              title="Exporting Page"
              isActive={false}
              isComplete={false}
              error={exportError}
              debugLogs={exportDebugLogs}
            />
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

  // Handle exporting selected referenced pages - process them and go directly to componentRevision
  // (skip publishing step since export is already complete)
  const handleExportSelectedReferencedPages = () => {
    // Initialize decisions for main page (will be published)
    const { currentVersion, newVersion } = getVersionInfo(exportData!);
    updatePageDecision(exportData!.pageName, {
      currentVersion,
      newVersion,
      publishNewVersion: true, // Main page always publishes
      changeMessage: "",
    });

    // Process selected referenced pages from already-exported data
    const selectedPages = discoveredReferencedPages.filter((p) =>
      selectedReferencedPageIds.has(p.pageId),
    );

    // Use already-exported pages from additionalPages
    const exportedPages: ExportPageResponseData[] = [];

    for (const pageInfo of selectedPages) {
      // Find the page in additionalPages (already exported)
      const exportedPage = exportData!.additionalPages.find(
        (p) => p.pageName === pageInfo.pageName,
      );

      if (exportedPage) {
        exportedPages.push(exportedPage);
        console.log(
          `[PublishingWizard] ✓ Using already-exported page: ${exportedPage.pageName}`,
        );
      } else {
        console.warn(
          `[PublishingWizard] Referenced page "${pageInfo.pageName}" not found in additionalPages. This should not happen if the full export was performed.`,
        );
      }
    }

    // Initialize decisions for selected referenced pages
    for (const exportedPage of exportedPages) {
      const { currentVersion: pageCurrentVersion, newVersion: pageNewVersion } =
        getVersionInfo(exportedPage);
      updatePageDecision(exportedPage.pageName, {
        currentVersion: pageCurrentVersion,
        newVersion: pageNewVersion,
        publishNewVersion: true,
        changeMessage: "",
      });
    }

    // Export is already complete, mark as done and go directly to componentRevision
    setHasExportedReferencedPages(true);
    setWizardStep("componentRevision");
    setCurrentComponentIndex(0);
  };

  // Handle continue from publishing step (move to componentRevision)
  const handleContinueFromPublishing = () => {
    if (!hasExportedReferencedPages || isExportingReferencedPages) {
      return; // Don't allow continuing if export is not complete
    }
    const pagesToPublish = getPagesToPublish();
    if (pagesToPublish.length > 0) {
      setWizardStep("componentRevision");
      setCurrentComponentIndex(0);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (wizardStep === "validationErrors") {
      // Go back to initial screen
      navigate(-1);
    } else if (wizardStep === "selectReferencedPages") {
      // Go back to initial screen
      setWizardStep("initial");
    } else if (wizardStep === "publishing") {
      // Go back to select referenced pages
      setWizardStep("selectReferencedPages");
    } else if (wizardStep === "componentRevision") {
      if (currentComponentIndex > 0) {
        // Go back to previous component
        setCurrentComponentIndex(currentComponentIndex - 1);
      } else {
        // Go back to select referenced pages (if any) or initial
        if (discoveredReferencedPages.length > 0) {
          setWizardStep("selectReferencedPages");
        } else {
          setWizardStep("initial");
        }
      }
    } else if (wizardStep === "finalPublish") {
      // Go back to last component revision
      const pagesToPublish = getPagesToPublish();
      setWizardStep("componentRevision");
      setCurrentComponentIndex(Math.max(0, pagesToPublish.length - 1));
    } else {
      // From initial screen, go back
      navigate(-1);
    }
  };

  // Handle publish to GitHub
  const handlePublishToGitHub = async () => {
    const pagesToPublish = getPagesToPublish();

    // Validate all components have change messages
    for (const page of pagesToPublish) {
      const decision = getPageDecision(page.pageName);
      if (!decision || !decision.changeMessage.trim()) {
        const componentName = page.pageData?.metadata?.name || page.pageName;
        setError(`Please enter revision history for "${componentName}".`);
        return;
      }
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

      // Use main page's change message as the PR message
      const mainDecision = getPageDecision(exportData.pageName);
      const prMessage =
        mainDecision?.changeMessage.trim() || "Publish components";

      const githubService = new GitHubService(accessToken);
      const result = await githubService.publishPageExports(
        RECURSICA_FIGMA_OWNER,
        RECURSICA_FIGMA_REPO,
        updatedExportData,
        "main",
        prMessage,
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

  // Render validation errors screen
  const renderValidationErrorsScreen = () => {
    if (!exportData?.validationResult) {
      return null;
    }

    const validationResult = exportData.validationResult;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>
          <h2 style={{ marginTop: 0, marginBottom: "12px", color: "#c62828" }}>
            Validation Errors
          </h2>
          <p style={{ margin: 0, color: "#666" }}>
            The following errors were found during validation. Please fix these
            issues before publishing:
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#c62828" }}>
            External References ({validationResult.externalReferences.length})
          </h3>
          {validationResult.externalReferences.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {validationResult.externalReferences.map(
                (
                  ref: { componentName: string; pageName: string },
                  index: number,
                ) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    <strong>"{ref.componentName}"</strong> on page{" "}
                    <strong>"{ref.pageName}"</strong> references a component
                    from another file. External references are not allowed.
                  </li>
                ),
              )}
            </ul>
          ) : (
            <p style={{ margin: 0, color: "#666" }}>
              No external references found.
            </p>
          )}
        </div>

        <div
          style={{
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#c62828" }}>
            Unknown Collections ({validationResult.unknownCollections.length})
          </h3>
          {validationResult.unknownCollections.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {validationResult.unknownCollections.map(
                (
                  collection: {
                    collectionName: string;
                    collectionId: string;
                    pageName: string;
                  },
                  index: number,
                ) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    Page <strong>"{collection.pageName}"</strong> uses
                    collection <strong>"{collection.collectionName}"</strong>{" "}
                    which is not a known collection. Remote collections must be
                    named "Token", "Tokens", "Theme", or "Themes".
                  </li>
                ),
              )}
            </ul>
          ) : (
            <p style={{ margin: 0, color: "#666" }}>
              No unknown collections found.
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
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
      <p style={{ color: "#666", margin: 0 }}>
        The following pages are referenced by your component. Select which ones
        you want to publish a new version of. Unselected pages will keep their
        current version reference:
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
          const localVersion = pageInfo.localVersion ?? 0;
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
                    {pageInfo.pageName}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Local Version: {localVersion}
                  </div>
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
            backgroundColor: isExportingReferencedPages ? "#ccc" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isExportingReferencedPages ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {isExportingReferencedPages ? "Exporting..." : "Continue"}
        </button>
      </div>
    </div>
  );

  // OLD RENDER FUNCTIONS REMOVED - replaced by new flow:
  // - renderPublishingScreen (shows Debug Console)
  // - renderComponentRevisionScreen (shows revision history for each component)
  // - renderFinalPublishScreen (shows final publish button)

  // Render publishing screen (shows Debug Console)
  const renderPublishingScreen = () => {
    const isExporting =
      isExportingReferencedPages ||
      (discoveredReferencedPages.length > 0 && !hasExportedReferencedPages);
    const canContinue =
      hasExportedReferencedPages && !isExportingReferencedPages;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "10px" }}>
          Publishing Components
        </h2>
        <DebugConsole
          title="Exporting Selected Components"
          isActive={isExporting}
          isComplete={!isExporting && !error}
          error={error}
          debugLogs={exportDebugLogs}
          successMessage="Components exported successfully"
        />
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleBack}
            disabled={isExporting}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: isExporting ? "not-allowed" : "pointer",
              fontSize: "14px",
              opacity: isExporting ? 0.6 : 1,
            }}
          >
            Back
          </button>
          <button
            onClick={handleContinueFromPublishing}
            disabled={!canContinue}
            style={{
              padding: "10px 20px",
              backgroundColor: canContinue ? "#1976d2" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: canContinue ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {isExporting ? "Exporting..." : "Continue"}
          </button>
        </div>
      </div>
    );
  };

  // Render component revision screen (replaces dependency screen)
  const renderComponentRevisionScreen = () => {
    const pagesToPublish = getPagesToPublish();
    if (currentComponentIndex >= pagesToPublish.length) {
      // All components processed, move to final publish
      setWizardStep("finalPublish");
      return null;
    }

    const currentComponent = pagesToPublish[currentComponentIndex];
    const decision = getPageDecision(currentComponent.pageName);
    const { currentVersion, newVersion } = getVersionInfo(currentComponent);

    // Initialize decision if not exists
    if (!decision) {
      updatePageDecision(currentComponent.pageName, {
        currentVersion,
        newVersion,
        publishNewVersion: true,
        changeMessage: "",
      });
    }

    const currentDecision = decision || {
      pageName: currentComponent.pageName,
      publishNewVersion: true,
      changeMessage: "",
      currentVersion,
      newVersion,
    };

    const isLastComponent = currentComponentIndex === pagesToPublish.length - 1;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>
          <h2 style={{ marginTop: 0, marginBottom: "10px" }}>
            Revision History
          </h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Component {currentComponentIndex + 1} of {pagesToPublish.length}:{" "}
            <strong>
              {currentComponent.pageData?.metadata?.name ||
                currentComponent.pageName}
            </strong>
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            Current Version:{" "}
            <span style={{ color: "#333" }}>
              {currentVersion === "UNPUBLISHED"
                ? currentVersion
                : currentVersion}
            </span>
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            New Version: <span style={{ color: "#333" }}>{newVersion}</span>
          </p>
        </div>

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
            Revision History <span style={{ color: "#c62828" }}>*</span>
          </label>
          <textarea
            id="change-message"
            value={currentDecision.changeMessage}
            onChange={(e) => {
              updatePageDecision(currentComponent.pageName, {
                changeMessage: e.target.value,
              });
            }}
            placeholder="Describe the changes made to this component..."
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
            onClick={() => {
              if (!currentDecision.changeMessage.trim()) {
                setError("Please enter revision history for this component.");
                return;
              }
              setError(null);
              if (isLastComponent) {
                setWizardStep("finalPublish");
              } else {
                setCurrentComponentIndex(currentComponentIndex + 1);
              }
            }}
            disabled={!currentDecision.changeMessage.trim()}
            style={{
              padding: "10px 20px",
              backgroundColor: !currentDecision.changeMessage.trim()
                ? "#ccc"
                : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: !currentDecision.changeMessage.trim()
                ? "not-allowed"
                : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {isLastComponent ? "Continue to Publish" : "Next"}
          </button>
        </div>
      </div>
    );
  };

  // Render final publish screen
  const renderFinalPublishScreen = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "10px" }}>
          Publish to GitHub
        </h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Ready to publish all components to GitHub. Click the button below to
          create a pull request with all changes.
        </p>

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
            disabled={isPublishing}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: isPublishing ? "#ccc" : "#d40d0d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isPublishing ? "not-allowed" : "pointer",
              opacity: isPublishing ? 0.6 : 1,
              alignSelf: "flex-start",
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
    const getComponentName = (page: ExportPageResponseData | null): string => {
      if (!page) return "Component";
      return page.pageData?.metadata?.name || page.pageName;
    };

    if (wizardStep === "initial") {
      return `Publishing: ${getComponentName(exportData)}`;
    }
    if (wizardStep === "componentRevision" && currentPage) {
      return `Publishing: ${getComponentName(currentPage)}`;
    }
    if (wizardStep === "publishing") {
      return `Publishing: ${getComponentName(exportData)}`;
    }
    if (wizardStep === "finalPublish") {
      return `Publishing: ${getComponentName(exportData)}`;
    }
    return `Publishing: ${getComponentName(exportData)}`;
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

        {wizardStep === "validationErrors" && renderValidationErrorsScreen()}
        {wizardStep === "selectReferencedPages" &&
          renderSelectReferencedPagesScreen()}
        {wizardStep === "publishing" && renderPublishingScreen()}
        {wizardStep === "componentRevision" && renderComponentRevisionScreen()}
        {wizardStep === "finalPublish" && renderFinalPublishScreen()}
      </div>
    </PageLayout>
  );
}
