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
        setIsPublishing(true);
        setError(null);
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
          const exportData = response.data as unknown as ExportPageResponseData;

          console.log("[Publishing] Export successful, navigating to wizard", {
            pageName: exportData?.pageName,
            hasAdditionalPages: exportData?.additionalPages?.length > 0,
          });

          if (isMounted) {
            setIsPublishing(false);

            // Navigate directly to publishing wizard with export data
            navigate("/publishing-wizard", {
              state: {
                exportData,
                pageIndex,
              },
              replace: true,
            });
          }
        } else {
          const errorMessage =
            response.message || "Failed to export page. Please try again.";
          console.error("[Publishing] Export failed:", errorMessage);
          setError(errorMessage);
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
      } finally {
        if (isMounted) {
          setIsPublishing(false);
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
          isComplete={!isPublishing && !error}
          error={error}
          debugLogs={debugLogs}
          successMessage="Page exported successfully"
        />
      </div>
    </PageLayout>
  );
}
