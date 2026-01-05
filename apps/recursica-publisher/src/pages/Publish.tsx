import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import { callPlugin } from "../utils/callPlugin";
import type { ComponentMetadata } from "../plugin/services/getComponentMetadata";
import { useAuth } from "../context/useAuth";
import { GitHubService } from "../services/github/githubService";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

export default function Publish() {
  const [metadata, setMetadata] = useState<ComponentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [componentName, setComponentName] = useState<string>("");
  const [currentPageIndex, setCurrentPageIndex] = useState<number | null>(null);
  const [publishedVersion, setPublishedVersion] = useState<
    number | "UNPUBLISHED" | null
  >(null);
  const [indexJsonError, setIndexJsonError] = useState<string | null>(null);
  const [loadingIndexJson, setLoadingIndexJson] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuth();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate("/publish/auth", { replace: true });
    }
  }, [isAuthenticated, accessToken, navigate]);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        const { promise } = callPlugin("getComponentMetadata", {});
        const response = await promise;
        if (response.success && response.data) {
          const responseData = response.data as {
            componentMetadata: ComponentMetadata;
            currentPageIndex: number;
          };
          const metadata = responseData.componentMetadata;
          setComponentName(metadata.name);
          // Always set metadata if we have it (we'll check published version from index.json)
          setMetadata(metadata);
          // Set the current page index from the response
          setCurrentPageIndex(responseData.currentPageIndex);
        } else {
          setMetadata(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load component metadata",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  // Fetch published version from index.json - always load fresh when component mounts or metadata/accessToken changes
  useEffect(() => {
    const loadPublishedVersion = async () => {
      if (!accessToken || !metadata?.id) {
        // Reset state if we don't have required data
        setPublishedVersion(null);
        setIndexJsonError(null);
        return;
      }

      // Always reset state before loading to ensure fresh data
      setPublishedVersion(null);
      setIndexJsonError(null);
      setLoadingIndexJson(true);

      // Capture metadata values for use in async function
      const componentId = metadata.id;
      const componentName = metadata.name;

      try {
        console.log(
          "[Publish] Fetching components from main branch to get published version...",
        );
        const githubService = new GitHubService(accessToken);
        const components = await githubService.loadComponentsFromBranch(
          RECURSICA_FIGMA_OWNER,
          RECURSICA_FIGMA_REPO,
          "main",
        );

        console.log(
          `[Publish] Loaded ${components.length} components from main branch`,
        );

        // Find the component by GUID
        const component = components.find((c) => c.guid === componentId);
        if (component && component.version > 0) {
          setPublishedVersion(component.version);
          console.log(
            `[Publish] Found published version for ${componentName || "component"}: ${component.version}`,
          );
        } else {
          setPublishedVersion("UNPUBLISHED");
          console.log(
            `[Publish] Component ${componentName || "component"} not found in index.json or version is 0`,
          );
        }
      } catch (loadError) {
        const errorMessage =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load components from main branch";
        setIndexJsonError(errorMessage);
        console.error(
          "[Publish] Failed to load components from main branch:",
          loadError,
        );
      } finally {
        setLoadingIndexJson(false);
      }
    };

    loadPublishedVersion();
  }, [metadata?.id, metadata?.name, accessToken]);

  // Helper to check if version is invalid for publishing
  const isVersionInvalid = useMemo(() => {
    if (
      publishedVersion === null ||
      publishedVersion === "UNPUBLISHED" ||
      typeof publishedVersion !== "number"
    ) {
      return false;
    }
    return (metadata?.version || 0) < publishedVersion;
  }, [publishedVersion, metadata?.version]);

  // Don't render if not authenticated
  if (!isAuthenticated || !accessToken) {
    return null;
  }

  return (
    <PageLayout showBackButton={true}>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {loading && <p>Loading component metadata...</p>}

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: "4px",
              color: "#c62828",
            }}
          >
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {metadata && metadata.id ? (
              <div>
                <h1>Publishing</h1>
                <h2 style={{ marginTop: "20px", fontSize: "18px" }}>
                  Name: {metadata.name}
                </h2>
                <div style={{ marginTop: "20px" }}>
                  <p>
                    <strong>Component ID:</strong> {metadata.id}
                  </p>
                  <p>
                    <strong>Published Version:</strong>{" "}
                    {loadingIndexJson
                      ? "Loading..."
                      : publishedVersion === null
                        ? "Loading..."
                        : publishedVersion === "UNPUBLISHED"
                          ? "UNPUBLISHED"
                          : publishedVersion}
                  </p>
                  <p>
                    <strong>This Version:</strong> {metadata.version || 0}
                  </p>
                </div>

                {/* Show warning if index.json cannot be found */}
                {indexJsonError && (
                  <div
                    style={{
                      padding: "12px",
                      marginTop: "20px",
                      backgroundColor: "#ffebee",
                      border: "1px solid #f44336",
                      borderRadius: "4px",
                      color: "#c62828",
                    }}
                  >
                    Warning: Unable to load index.json from repository. Cannot
                    verify published version.
                  </div>
                )}

                {/* Show warning if version is same or older */}
                {isVersionInvalid && (
                  <div
                    style={{
                      padding: "12px",
                      marginTop: "20px",
                      backgroundColor: "#fff3e0",
                      border: "1px solid #f57c00",
                      borderRadius: "4px",
                      color: "#e65100",
                    }}
                  >
                    ⚠️ Warning: This version is older than or equal to the
                    currently published version. Publishing will still proceed
                    if you continue.
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "30px",
                  }}
                >
                  <button
                    type="button"
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
                  <button
                    type="button"
                    onClick={() => {
                      console.log("[Publish] Publish button clicked", {
                        currentPageIndex,
                      });
                      if (currentPageIndex !== null) {
                        const targetUrl = `/publishing?pageIndex=${currentPageIndex}`;
                        console.log("[Publish] Navigating to:", targetUrl);
                        navigate(targetUrl);
                      } else {
                        // Fallback: navigate without pageIndex (will show error)
                        console.log(
                          "[Publish] Navigating to: /publishing (no pageIndex)",
                        );
                        navigate("/publishing");
                      }
                    }}
                    style={{
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      backgroundColor: "transparent",
                      color: "#d40d0d",
                      border: "2px solid #d40d0d",
                      borderRadius: "8px",
                      cursor: "pointer",
                      opacity: 1,
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
                    Publish
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1>Publishing</h1>
                {componentName && (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      marginBottom: "10px",
                    }}
                  >
                    Page: <strong>{componentName}</strong>
                  </p>
                )}
                <p style={{ textAlign: "center", fontSize: "16px" }}>
                  It appears the current page has never been published. Would
                  you like to publish it?
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >
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
                  <button
                    type="button"
                    onClick={() => {
                      console.log("[Publish] Ok button clicked", {
                        currentPageIndex,
                      });
                      if (currentPageIndex !== null) {
                        const targetUrl = `/publishing?pageIndex=${currentPageIndex}`;
                        console.log("[Publish] Navigating to:", targetUrl);
                        navigate(targetUrl);
                      } else {
                        // Fallback: navigate without pageIndex (will show error)
                        console.log(
                          "[Publish] Navigating to: /publishing (no pageIndex)",
                        );
                        navigate("/publishing");
                      }
                    }}
                    style={{
                      padding: "12px 24px",
                      fontSize: "16px",
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
                    Ok
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
