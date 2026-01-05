import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import DebugConsole from "../components/DebugConsole";
import { callPlugin } from "../utils/callPlugin";
import type { ExportPageResponseData } from "../plugin/services/pageExportNew";
import type { DebugConsoleMessage } from "../plugin/services/debugConsole";

export default function Publishing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<DebugConsoleMessage[] | undefined>(
    undefined,
  );
  const [exportData, setExportData] = useState<ExportPageResponseData | null>(
    null,
  );

  // Extract version from export data metadata
  const getCurrentVersion = useCallback(
    (exportData: ExportPageResponseData): number => {
      try {
        return exportData.pageData?.metadata?.version || 0;
      } catch {
        return 0;
      }
    },
    [],
  );

  // Start publishing when component mounts
  useEffect(() => {
    const pageIndexParam = searchParams.get("pageIndex");
    if (pageIndexParam === null) {
      setError("No page index provided");
      return;
    }

    const pageIndex = parseInt(pageIndexParam, 10);
    if (isNaN(pageIndex)) {
      setError("Invalid page index");
      return;
    }

    let cancelFn: ((errorOnCancel?: boolean) => void) | null = null;
    let isMounted = true;

    const startPublishing = async () => {
      try {
        // Set publishing state immediately so UI shows right away
        setIsPublishing(true);
        setError(null);

        // Small delay to ensure UI has rendered before starting the export
        // This ensures the user sees the publishing page immediately
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (!isMounted) return;

        console.log("[Publishing] Starting page export...", { pageIndex });
        const { promise, cancel } = callPlugin("exportPage", {
          pageIndex,
          skipPrompts: true, // Skip prompts - wizard will handle questions
        });
        cancelFn = cancel;

        const response = await promise;

        console.log("[Publishing] Export response:", {
          success: response.success,
          hasData: !!response.data,
          message: response.message,
        });

        // Check if component is still mounted before updating state
        if (!isMounted) {
          console.log("[Publishing] Component unmounted, skipping navigation");
          return;
        }

        if (response.success && response.data) {
          const exportDataResponse =
            response.data as unknown as ExportPageResponseData;

          console.log("[Publishing] Export successful", {
            pageName: exportDataResponse?.pageName,
            hasAdditionalPages: exportDataResponse?.additionalPages?.length > 0,
          });

          if (isMounted) {
            // Extract debug logs from response if available
            if (response.data?.debugLogs) {
              setDebugLogs(response.data.debugLogs as DebugConsoleMessage[]);
            }

            // Store export data and show success state
            setExportData(exportDataResponse);
            setIsPublishing(false);
          }
        } else {
          const errorMessage =
            response.message || "Failed to export page. Please try again.";
          console.error("[Publishing] Export failed:", errorMessage);
          setError(errorMessage);
          setIsPublishing(false);
          // Extract debug logs from response if available
          if (response.data?.debugLogs) {
            setDebugLogs(response.data.debugLogs as DebugConsoleMessage[]);
          }
        }
      } catch (err) {
        // Only set error if component is still mounted
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to export page";
          setError(errorMessage);
          setIsPublishing(false);
          // Try to extract debug logs from error response if available
          if (
            err &&
            typeof err === "object" &&
            "response" in err &&
            err.response &&
            typeof err.response === "object" &&
            "data" in err.response
          ) {
            const errorResponse = err.response as {
              data?: { debugLogs?: DebugConsoleMessage[] };
            };
            if (errorResponse.data?.debugLogs) {
              setDebugLogs(errorResponse.data.debugLogs);
            }
          }
        }
      }
    };

    startPublishing();

    // Cleanup: cancel the plugin call if component unmounts
    return () => {
      isMounted = false;
      if (cancelFn) {
        cancelFn(false); // Cancel without error since user navigated away
      }
    };
  }, [searchParams, getCurrentVersion, navigate]);

  return (
    <PageLayout showBackButton={true}>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Publishing</h1>

        <DebugConsole
          title="Exporting Page"
          isActive={isPublishing}
          isComplete={!isPublishing && !error && !!exportData}
          error={error}
          debugLogs={debugLogs}
          successMessage="Page exported successfully"
        />

        {!isPublishing && !error && exportData && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
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
                const pageIndexParam = searchParams.get("pageIndex");
                const pageIndex = pageIndexParam
                  ? parseInt(pageIndexParam, 10)
                  : undefined;
                navigate("/publishing-wizard", {
                  state: {
                    exportData,
                    pageIndex,
                  },
                  replace: true,
                });
              }}
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
        )}
      </div>
    </PageLayout>
  );
}
