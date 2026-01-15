import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { DebugConsole } from "../../components/DebugConsole";
import type {
  ExportPageResponseData,
  ReferencedPageInfo,
} from "../../plugin/services/pageExportNew";
import { useAuth } from "../../context/useAuth";
import {
  GitHubService,
  type ComponentInfo,
} from "../../services/github/githubService";
import type { DebugConsoleMessage } from "../../plugin/services/debugConsole";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Stack } from "../../components/Stack";
import { Group } from "../../components/Group";
import { Card } from "../../components/Card";
import { Alert } from "../../components/Alert";
import { Textarea } from "../../components/Textarea";
import { Checkbox } from "../../components/Checkbox";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import classes from "./PublishingWizard.module.css";

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
  const [mainBranchComponents, setMainBranchComponents] = useState<
    ComponentInfo[] | null
  >(null);
  const [exportData, setExportData] = useState<ExportPageResponseData | null>(
    null,
  );
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

  const state = location.state as PublishingWizardLocationState | null;
  const [searchParams] = useSearchParams();
  const pageIndexFromState = state?.pageIndex;
  const pageIndexFromParams = searchParams.get("pageIndex");
  const pageIndex =
    pageIndexFromState ??
    (pageIndexFromParams ? parseInt(pageIndexFromParams, 10) : undefined);

  useEffect(() => {
    if (state?.exportData) {
      setExportData(state.exportData);
      console.log(
        `[PublishingWizard] Loaded export data from location state for page: ${state.exportData.pageName}`,
      );
    }
  }, [state?.exportData]);

  useEffect(() => {
    if (state?.mainBranchComponents) {
      setMainBranchComponents(state.mainBranchComponents);
      console.log(
        `[PublishingWizard] Loaded ${state.mainBranchComponents.length} components from location state`,
      );
    } else if (accessToken && !mainBranchComponents) {
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
        }
      };
      loadMainBranchComponents();
    }
  }, [state?.mainBranchComponents, accessToken, mainBranchComponents]);

  useEffect(() => {
    if (!exportData && !isExporting && !state?.exportData) {
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

  const getCurrentPage = useCallback(() => {
    if (!exportData) return null;
    if (wizardStep === "componentRevision") {
      const pagesToPublish: ExportPageResponseData[] = [exportData];
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

  const getPagesToPublish = useCallback((): ExportPageResponseData[] => {
    if (!exportData) return [];
    const pages: ExportPageResponseData[] = [exportData];

    // Helper function to recursively search for a page in additionalPages (including nested)
    const findPageInAdditionalPages = (
      pageName: string,
      pagesToSearch: ExportPageResponseData[],
    ): ExportPageResponseData | null => {
      for (const page of pagesToSearch) {
        if (page.pageName === pageName) {
          return page;
        }
        if (page.additionalPages && page.additionalPages.length > 0) {
          const found = findPageInAdditionalPages(
            pageName,
            page.additionalPages,
          );
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    for (const pageInfo of discoveredReferencedPages) {
      if (selectedReferencedPageIds.has(pageInfo.pageId)) {
        const exportedPage = findPageInAdditionalPages(
          pageInfo.pageName,
          exportData.additionalPages,
        );
        if (exportedPage) {
          pages.push(exportedPage);
        } else {
          // User selected this page but it's not in additionalPages
          // Create a minimal ExportPageResponseData so the user can still enter revision history
          // This should not normally happen, but we want to show all selected pages
          console.warn(
            `[PublishingWizard] Selected page "${pageInfo.pageName}" not found in additionalPages. Creating minimal structure.`,
          );
          const minimalPageData: ExportPageResponseData = {
            filename: `${pageInfo.pageName.replace(/\s+/g, "_")}.figma.json`,
            pageData: {
              metadata: {
                name: pageInfo.componentName || pageInfo.pageName,
                version: pageInfo.localVersion || 0,
                guid: "", // Will need to be filled from mainBranchComponents if available
              },
            },
            pageName: pageInfo.componentName || pageInfo.pageName,
            additionalPages: [],
          };
          pages.push(minimalPageData);
        }
      }
    }
    return pages;
  }, [exportData, discoveredReferencedPages, selectedReferencedPageIds]);

  const getVersionInfo = useCallback(
    (
      page: ExportPageResponseData,
    ): {
      currentVersion: number | "UNPUBLISHED";
      newVersion: number;
    } => {
      const pageGuid = page.pageData?.metadata?.guid;
      let currentVersion: number | "UNPUBLISHED" = "UNPUBLISHED";
      let newVersion = 1;

      if (pageGuid && mainBranchComponents) {
        const publishedComponent = mainBranchComponents.find(
          (c) => c.guid === pageGuid,
        );
        if (publishedComponent) {
          currentVersion = publishedComponent.version;
          newVersion =
            typeof currentVersion === "number" ? currentVersion + 1 : 1;
        }
      } else {
        const metadataVersion = page.pageData?.metadata?.version;
        if (metadataVersion !== undefined && metadataVersion > 0) {
          currentVersion = metadataVersion;
          newVersion =
            typeof currentVersion === "number" ? currentVersion + 1 : 1;
        }
      }

      return { currentVersion, newVersion };
    },
    [mainBranchComponents],
  );

  const getPageDecision = useCallback(
    (pageName: string): PagePublishDecision | undefined => {
      return pageDecisions.get(pageName);
    },
    [pageDecisions],
  );

  const updatePageDecision = useCallback(
    (
      pageName: string,
      updates: Partial<Omit<PagePublishDecision, "pageName">>,
    ) => {
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
          ...updates,
        });
        return newMap;
      });
    },
    [],
  );

  const updateExportDataWithDecisions = useCallback(
    (
      pageData: ExportPageResponseData,
      decisions: Map<string, PagePublishDecision>,
      mainBranchComponents: ComponentInfo[] | null,
    ): ExportPageResponseData => {
      const decision = decisions.get(pageData.pageName);
      const updatedPageData = { ...pageData.pageData };

      if (decision?.publishNewVersion) {
        if (updatedPageData.metadata) {
          // Preserve existing history before creating new metadata object
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

          updatedPageData.metadata = {
            ...updatedPageData.metadata,
            version: decision.newVersion,
            // Preserve existing history and add new entry
            history: {
              ...existingHistory,
              [`${decision.newVersion}`]: {
                message: decision.changeMessage,
                date: new Date().toISOString(),
              },
            },
          };
          // Remove exportedAt if it exists (redundant with publishDate)
          delete updatedPageData.metadata.exportedAt;
          // Add publishDate
          updatedPageData.metadata.publishDate = new Date().toISOString();
        }

        // Update instanceTable entries to reference correct versions of referenced components
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
            const componentGuid =
              entry.componentGuid || entry.cGuid || entry.componentGUID;

            // Only process normal instances that reference other components
            if (
              instanceType === "normal" &&
              componentPageName &&
              componentGuid
            ) {
              const referencedComponentDecision =
                decisions.get(componentPageName);

              if (referencedComponentDecision?.publishNewVersion) {
                // Component is being published in this session - use new version
                const newVersion = referencedComponentDecision.newVersion;
                // Always set version fields (even if they were undefined)
                entry.componentVersion = newVersion;
                entry.cVers = newVersion;
              } else {
                // Component is NOT being published - must look up version from mainBranchComponents
                if (!mainBranchComponents) {
                  throw new Error(
                    `Cannot determine version for referenced component "${componentPageName}" (GUID: ${componentGuid.substring(0, 8)}...): mainBranchComponents not loaded. This component must be published before it can be referenced.`,
                  );
                }

                const publishedComponent = mainBranchComponents.find(
                  (c) => c.guid === componentGuid,
                );

                if (!publishedComponent) {
                  throw new Error(
                    `Referenced component "${componentPageName}" (GUID: ${componentGuid.substring(0, 8)}...) is not published and is not being published in this session. All referenced components must either be published (exist in main branch) or selected for publishing.`,
                  );
                }

                // Found published version - always use it
                entry.componentVersion = publishedComponent.version;
                entry.cVers = publishedComponent.version;
              }
            }
          }
        }
      } else {
        // Not publishing new version - update instanceTable to reference published versions
        const pageGuid = updatedPageData.metadata?.guid;
        if (pageGuid) {
          if (!mainBranchComponents) {
            throw new Error(
              `Cannot determine version for component "${pageData.pageName}" (GUID: ${pageGuid.substring(0, 8)}...): mainBranchComponents not loaded.`,
            );
          }

          const publishedComponent = mainBranchComponents.find(
            (c) => c.guid === pageGuid,
          );

          if (!publishedComponent) {
            throw new Error(
              `Component "${pageData.pageName}" (GUID: ${pageGuid.substring(0, 8)}...) is not published in main branch. Cannot update instanceTable references.`,
            );
          }

          if (updatedPageData.instances) {
            const instanceTable = updatedPageData.instances;
            // Handle both array format and object format
            const entries = Array.isArray(instanceTable)
              ? instanceTable
              : Object.values(instanceTable);

            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              if (!entry || typeof entry !== "object") {
                continue;
              }

              const instanceType =
                entry.instanceType || entry.instT || entry.instType;
              const componentPageName =
                entry.componentPageName || entry.cPage || entry.componentPage;
              const entryComponentGuid =
                entry.componentGuid || entry.cGuid || entry.componentGUID;

              // Update all normal instances that reference other components
              if (
                instanceType === "normal" &&
                componentPageName &&
                entryComponentGuid
              ) {
                const referencedComponentDecision =
                  decisions.get(componentPageName);

                if (referencedComponentDecision?.publishNewVersion) {
                  // Referenced component is being published - use new version
                  const newVersion = referencedComponentDecision.newVersion;
                  entry.componentVersion = newVersion;
                  entry.cVers = newVersion;
                } else {
                  // Referenced component is NOT being published - must look up from mainBranchComponents
                  const referencedPublishedComponent =
                    mainBranchComponents.find(
                      (c) => c.guid === entryComponentGuid,
                    );

                  if (!referencedPublishedComponent) {
                    throw new Error(
                      `Referenced component "${componentPageName}" (GUID: ${entryComponentGuid.substring(0, 8)}...) in "${pageData.pageName}" is not published and is not being published in this session. All referenced components must either be published (exist in main branch) or selected for publishing.`,
                    );
                  }

                  // Found published version - always use it
                  entry.componentVersion = referencedPublishedComponent.version;
                  entry.cVers = referencedPublishedComponent.version;
                }
              } else if (
                instanceType === "normal" &&
                entryComponentGuid === pageGuid
              ) {
                // Self-reference - use current published version
                entry.componentVersion = publishedComponent.version;
                entry.cVers = publishedComponent.version;
              }
            }
          }
        }
      }

      const updatedAdditionalPages = pageData.additionalPages
        .filter((page) => {
          const pageDecision = decisions.get(page.pageName);
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

      // Helper function to recursively search for a page in additionalPages (including nested)
      const findPageInAdditionalPages = (
        pageName: string,
        pages: ExportPageResponseData[],
      ): ExportPageResponseData | null => {
        for (const page of pages) {
          if (page.pageName === pageName) {
            return page;
          }
          if (page.additionalPages && page.additionalPages.length > 0) {
            const found = findPageInAdditionalPages(
              pageName,
              page.additionalPages,
            );
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      const exportedPages: ExportPageResponseData[] = [];

      for (const pageInfo of selectedPages) {
        const exportedPage = findPageInAdditionalPages(
          pageInfo.pageName,
          exportData.additionalPages,
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

  useEffect(() => {
    if (!exportData) return;

    // Use discoveredReferencedPages from export data if available (preferred)
    // Otherwise fall back to discovering from instances (for backward compatibility)
    let referencedPages: ReferencedPageInfo[] = [];

    if (
      exportData.discoveredReferencedPages &&
      exportData.discoveredReferencedPages.length > 0
    ) {
      // Use the discovered pages from export response (has full metadata)
      referencedPages = exportData.discoveredReferencedPages;
      console.log(
        `[PublishingWizard] Using ${referencedPages.length} discovered referenced pages from export data`,
      );

      // Auto-select all discovered pages since they're already exported in additionalPages
      // User can deselect them if they don't want to publish new versions
      const allPageIds = new Set(referencedPages.map((p) => p.pageId));
      setSelectedReferencedPageIds(allPageIds);
      console.log(
        `[PublishingWizard] Auto-selected ${allPageIds.size} referenced page(s) (already exported)`,
      );
    } else {
      // Fallback: discover from instances (for backward compatibility)
      console.log(
        "[PublishingWizard] No discoveredReferencedPages in export data, discovering from instances...",
      );
      const pageGuid = exportData.pageData?.metadata?.guid;

      if (pageGuid && exportData.pageData?.instances) {
        const instanceTable = exportData.pageData.instances;
        if (Array.isArray(instanceTable)) {
          for (const entry of instanceTable) {
            if (
              entry &&
              typeof entry === "object" &&
              entry.instanceType === "normal" &&
              entry.componentPageName &&
              entry.componentPageName !== exportData.pageName
            ) {
              const existing = referencedPages.find(
                (p) => p.pageName === entry.componentPageName,
              );
              if (!existing && entry.componentPageName) {
                referencedPages.push({
                  pageId: entry.componentPageName,
                  pageName: entry.componentPageName,
                  pageIndex: -1, // Not available from instance entry
                  hasMetadata: false, // Not available from instance entry
                  localVersion: (entry.componentVersion as number) || 0,
                });
              }
            }
          }
        }
      }
    }

    setDiscoveredReferencedPages(referencedPages);

    if (referencedPages.length > 0) {
      if (exportData.validationResult) {
        const hasErrors =
          exportData.validationResult.externalReferences.length > 0 ||
          exportData.validationResult.unknownCollections.length > 0;
        if (hasErrors) {
          setWizardStep("validationErrors");
        } else {
          setWizardStep("selectReferencedPages");
        }
      } else {
        setWizardStep("selectReferencedPages");
      }
    } else {
      if (exportData.validationResult) {
        const hasErrors =
          exportData.validationResult.externalReferences.length > 0 ||
          exportData.validationResult.unknownCollections.length > 0;
        if (hasErrors) {
          setWizardStep("validationErrors");
        } else {
          setWizardStep("componentRevision");
        }
      } else {
        setWizardStep("componentRevision");
      }
    }
  }, [exportData]);

  if (pageIndex === undefined || isNaN(pageIndex)) {
    return (
      <PageLayout showBackButton={true}>
        <Stack gap={20} className={classes.root}>
          <Title order={1}>Publishing Wizard</Title>
          <Text variant="body" color="error">
            Error: No page index provided. Please go back and try again.
          </Text>
        </Stack>
      </PageLayout>
    );
  }

  if (isExporting) {
    return (
      <PageLayout showBackButton={true}>
        <Stack gap={20} align="center" className={classes.loadingContainer}>
          <Title order={1}>Publishing Wizard</Title>
          <Group gap={12}>
            <LoadingSpinner size="default" color="primary" />
            <Text className={classes.loadingText}>Exporting page...</Text>
          </Group>
        </Stack>
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
        <Stack gap={20} className={classes.root}>
          <Title order={1}>Publishing Wizard</Title>
          <Alert variant="error">
            <DebugConsole
              title="Exporting Page"
              isActive={false}
              isComplete={false}
              error={exportError}
              debugLogs={exportDebugLogs}
            />
          </Alert>
        </Stack>
      </PageLayout>
    );
  }

  if (!exportData) {
    return (
      <PageLayout showBackButton={true}>
        <Stack gap={20} className={classes.root}>
          <Title order={1}>Publishing Wizard</Title>
          <Text variant="body" color="error">
            Error: No export data found. Please go back and try again.
          </Text>
        </Stack>
      </PageLayout>
    );
  }

  const handleExportSelectedReferencedPages = () => {
    const { currentVersion, newVersion } = getVersionInfo(exportData!);
    updatePageDecision(exportData!.pageName, {
      currentVersion,
      newVersion,
      publishNewVersion: true,
      changeMessage: "",
    });

    const selectedPages = discoveredReferencedPages.filter((p) =>
      selectedReferencedPageIds.has(p.pageId),
    );

    const exportedPages: ExportPageResponseData[] = [];

    for (const pageInfo of selectedPages) {
      const exportedPage = exportData!.additionalPages.find(
        (p) => p.pageName === pageInfo.pageName,
      );

      if (exportedPage) {
        exportedPages.push(exportedPage);
      }
    }

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

    setHasExportedReferencedPages(true);
    setWizardStep("componentRevision");
    setCurrentComponentIndex(0);
  };

  const handleContinueFromPublishing = () => {
    if (!hasExportedReferencedPages || isExportingReferencedPages) {
      return;
    }
    const pagesToPublish = getPagesToPublish();
    if (pagesToPublish.length > 0) {
      setWizardStep("componentRevision");
      setCurrentComponentIndex(0);
    }
  };

  const handleBack = () => {
    if (wizardStep === "validationErrors") {
      navigate(-1);
    } else if (wizardStep === "selectReferencedPages") {
      setWizardStep("initial");
    } else if (wizardStep === "publishing") {
      setWizardStep("selectReferencedPages");
    } else if (wizardStep === "componentRevision") {
      if (currentComponentIndex > 0) {
        setCurrentComponentIndex(currentComponentIndex - 1);
      } else {
        if (discoveredReferencedPages.length > 0) {
          setWizardStep("selectReferencedPages");
        } else {
          setWizardStep("initial");
        }
      }
    } else if (wizardStep === "finalPublish") {
      const pagesToPublish = getPagesToPublish();
      setWizardStep("componentRevision");
      setCurrentComponentIndex(Math.max(0, pagesToPublish.length - 1));
    } else {
      navigate(-1);
    }
  };

  const handlePublishToGitHub = async () => {
    const pagesToPublish = getPagesToPublish();

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

  const renderValidationErrorsScreen = () => {
    if (!exportData?.validationResult) {
      return null;
    }

    const validationResult = exportData.validationResult;

    return (
      <Stack gap={20} className={classes.screen}>
        <div>
          <Title order={2} error className={classes.screenTitle}>
            Validation Errors
          </Title>
          <Text className={classes.screenDescription}>
            The following errors were found during validation. Please fix these
            issues before publishing:
          </Text>
        </div>

        <Card variant="error" className={classes.validationSection}>
          <Title order={3} error className={classes.validationTitle}>
            External References ({validationResult.externalReferences.length})
          </Title>
          {validationResult.externalReferences.length > 0 ? (
            <ul className={classes.validationList}>
              {validationResult.externalReferences.map(
                (
                  ref: { componentName: string; pageName: string },
                  index: number,
                ) => (
                  <li key={index} className={classes.validationListItem}>
                    <strong>"{ref.componentName}"</strong> on page{" "}
                    <strong>"{ref.pageName}"</strong> references a component
                    from another file. External references are not allowed.
                  </li>
                ),
              )}
            </ul>
          ) : (
            <Text variant="body">No external references found.</Text>
          )}
        </Card>

        <Card variant="error" className={classes.validationSection}>
          <Title order={3} error className={classes.validationTitle}>
            Unknown Collections ({validationResult.unknownCollections.length})
          </Title>
          {validationResult.unknownCollections.length > 0 ? (
            <ul className={classes.validationList}>
              {validationResult.unknownCollections.map(
                (
                  collection: {
                    collectionName: string;
                    collectionId: string;
                    pageName: string;
                  },
                  index: number,
                ) => (
                  <li key={index} className={classes.validationListItem}>
                    Page <strong>"{collection.pageName}"</strong> uses
                    collection <strong>"{collection.collectionName}"</strong>{" "}
                    which is not a known collection. Remote collections must be
                    named "Token", "Tokens", "Theme", or "Themes".
                  </li>
                ),
              )}
            </ul>
          ) : (
            <Text variant="body">No unknown collections found.</Text>
          )}
        </Card>

        <Group gap={12} className={classes.buttonGroup}>
          <Button variant="subtle" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Group>
      </Stack>
    );
  };

  const renderSelectReferencedPagesScreen = () => (
    <Stack gap={20} className={classes.screen}>
      <div>
        <Title order={2} className={classes.screenTitle}>
          Select Referenced Pages
        </Title>
        <Text variant="body" className={classes.screenDescription}>
          The following pages are referenced by your component. Select which
          ones you want to publish a new version of. Unselected pages will keep
          their current version reference:
        </Text>
      </div>

      <Stack gap={12} className={classes.pageSelectList}>
        {discoveredReferencedPages.map((pageInfo) => {
          const isSelected = selectedReferencedPageIds.has(pageInfo.pageId);
          const localVersion = pageInfo.localVersion ?? 0;
          return (
            <Card
              key={pageInfo.pageId}
              variant="selectable"
              selected={isSelected}
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
              className={classes.pageSelectCard}
            >
              <Group gap={12} className={classes.pageSelectContent}>
                <Checkbox
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
                />
                <div style={{ flex: 1 }}>
                  <div className={classes.pageSelectName}>
                    {pageInfo.pageName}
                  </div>
                  <div className={classes.pageSelectVersion}>
                    Local Version: {localVersion}
                  </div>
                </div>
              </Group>
            </Card>
          );
        })}
      </Stack>

      {error && (
        <Alert variant="error" className={classes.errorAlert}>
          {error}
        </Alert>
      )}

      <Group gap={12} className={classes.buttonGroup}>
        <Button variant="subtle" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="filled"
          onClick={handleExportSelectedReferencedPages}
          disabled={isExportingReferencedPages}
          loading={isExportingReferencedPages}
        >
          {isExportingReferencedPages ? "Exporting..." : "Continue"}
        </Button>
      </Group>
    </Stack>
  );

  const renderPublishingScreen = () => {
    const isExporting =
      isExportingReferencedPages ||
      (discoveredReferencedPages.length > 0 && !hasExportedReferencedPages);
    const canContinue =
      hasExportedReferencedPages && !isExportingReferencedPages;

    return (
      <Stack gap={20} className={classes.screen}>
        <Title order={2} className={classes.screenTitle}>
          Publishing Components
        </Title>
        <DebugConsole
          title="Exporting Selected Components"
          isActive={isExporting}
          isComplete={!isExporting && !error}
          error={error}
          debugLogs={exportDebugLogs}
          successMessage="Components exported successfully"
        />
        <Group gap={12} className={classes.buttonGroup}>
          <Button variant="subtle" onClick={handleBack} disabled={isExporting}>
            Back
          </Button>
          <Button
            variant="filled"
            onClick={handleContinueFromPublishing}
            disabled={!canContinue}
          >
            {isExporting ? "Exporting..." : "Continue"}
          </Button>
        </Group>
      </Stack>
    );
  };

  const renderComponentRevisionScreen = () => {
    const pagesToPublish = getPagesToPublish();
    if (currentComponentIndex >= pagesToPublish.length) {
      setWizardStep("finalPublish");
      return null;
    }

    const currentComponent = pagesToPublish[currentComponentIndex];
    const decision = getPageDecision(currentComponent.pageName);
    const { currentVersion, newVersion } = getVersionInfo(currentComponent);

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
      <Stack gap={20} className={classes.screen}>
        <div>
          <Title order={2} className={classes.screenTitle}>
            Revision History
          </Title>
          <Text variant="body" className={classes.revisionComponentInfo}>
            Component {currentComponentIndex + 1} of {pagesToPublish.length}:{" "}
            <span className={classes.revisionComponentName}>
              {currentComponent.pageData?.metadata?.name ||
                currentComponent.pageName}
            </span>
          </Text>
          <Text variant="body" className={classes.revisionInfo}>
            Current Version:{" "}
            <span className={classes.revisionInfoValue}>
              {currentVersion === "UNPUBLISHED"
                ? currentVersion
                : String(currentVersion)}
            </span>
          </Text>
          <Text variant="body" className={classes.revisionInfo}>
            New Version:{" "}
            <span className={classes.revisionInfoValue}>{newVersion}</span>
          </Text>
        </div>

        <div>
          <label htmlFor="change-message" className={classes.revisionLabel}>
            Revision History{" "}
            <span className={classes.revisionLabelRequired}>*</span>
          </label>
          <Textarea
            id="change-message"
            value={currentDecision.changeMessage}
            onChange={(e) => {
              updatePageDecision(currentComponent.pageName, {
                changeMessage: e.target.value,
              });
            }}
            placeholder="Describe the changes made to this component..."
            required
            className={classes.textarea}
          />
        </div>

        <Group gap={12} className={classes.buttonGroup}>
          <Button variant="subtle" onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="filled"
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
          >
            {isLastComponent ? "Continue to Publish" : "Next"}
          </Button>
        </Group>
      </Stack>
    );
  };

  const renderFinalPublishScreen = () => {
    return (
      <Stack gap={20} className={classes.screen}>
        <div>
          <Title order={2} className={classes.screenTitle}>
            Publish to GitHub
          </Title>
          <Text variant="body" className={classes.screenDescription}>
            Ready to publish all components to GitHub. Click the button below to
            create a pull request with all changes.
          </Text>
        </div>

        {prUrl ? (
          <Card variant="success" className={classes.successMessage}>
            <Text variant="body" className={classes.successText}>
              ✓ Successfully published to GitHub!
            </Text>
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.successLink}
            >
              View Pull Request
            </a>
          </Card>
        ) : (
          <Button
            variant="filled"
            onClick={handlePublishToGitHub}
            disabled={isPublishing}
            loading={isPublishing}
          >
            {isPublishing ? "Publishing to GitHub..." : "Publish to GitHub"}
          </Button>
        )}
      </Stack>
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
      <Stack gap={20} className={classes.root}>
        <Title order={1} className={classes.title}>
          {getPageTitle()}
        </Title>

        {error && (
          <Alert variant="error" className={classes.errorAlert}>
            {error}
          </Alert>
        )}

        {wizardStep === "validationErrors" && renderValidationErrorsScreen()}
        {wizardStep === "selectReferencedPages" &&
          renderSelectReferencedPagesScreen()}
        {wizardStep === "publishing" && renderPublishingScreen()}
        {wizardStep === "componentRevision" && renderComponentRevisionScreen()}
        {wizardStep === "finalPublish" && renderFinalPublishScreen()}
      </Stack>
    </PageLayout>
  );
}
