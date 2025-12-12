import { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import type { ExportPageResponseData } from "../plugin/services/pageExportNew";
import { useAuth } from "../context/useAuth";
import {
  GitHubService,
  type ComponentInfo,
} from "../services/github/githubService";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

interface PublishingWizardLocationState {
  exportData: ExportPageResponseData;
  pageIndex: number;
  mainBranchComponents?: ComponentInfo[];
}

type WizardStep = "initial" | "dependency" | "main";

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

  // Get data from location state
  const state = location.state as PublishingWizardLocationState | null;
  const exportData = state?.exportData;

  // Initialize mainBranchComponents from location state if available
  useEffect(() => {
    if (state?.mainBranchComponents) {
      setMainBranchComponents(state.mainBranchComponents);
      console.log(
        `[PublishingWizard] Loaded ${state.mainBranchComponents.length} components from location state`,
      );
    }
  }, [state?.mainBranchComponents]);

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
  if (!state || !exportData) {
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
    if (wizardStep === "dependency") {
      if (currentDependencyIndex > 0) {
        // Go back to previous dependency
        const prevIndex = currentDependencyIndex - 1;
        setCurrentDependencyIndex(prevIndex);
      } else {
        // Go back to initial screen
        setWizardStep("initial");
      }
    } else if (wizardStep === "main") {
      if (exportData.additionalPages.length > 0) {
        // Go back to last dependency
        setWizardStep("dependency");
        setCurrentDependencyIndex(exportData.additionalPages.length - 1);
      } else {
        // Go back to initial screen
        setWizardStep("initial");
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
            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "14px",
                color: "#c62828",
                fontWeight: "bold",
              }}
            >
              Unable to publish because the version is the same or older than
              what is already published.
            </p>
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

        {!isVersionInvalid && (
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
        )}

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
        ) : isVersionInvalid ? (
          <button
            onClick={() => navigate("/")}
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
            Cancel
          </button>
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
        {wizardStep === "dependency" && renderDependencyScreen()}
        {wizardStep === "main" && renderMainScreen()}
      </div>
    </PageLayout>
  );
}
