import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import DebugConsole from "../components/DebugConsole";
import { callPlugin } from "../utils/callPlugin";
import type { ExportPageResponseData } from "../plugin/services/pageExportNew";

export default function Publishing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        }
      } catch (err) {
        // Only set error if component is still mounted
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to export page",
          );
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
          minHeight: 0,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Publishing</h1>

        <DebugConsole showClearButton={false} />

        <div>
          {isPublishing ? (
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
                Exporting page...
              </p>
            </div>
          ) : error ? (
            <p style={{ color: "#c62828", fontStyle: "italic", margin: 0 }}>
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </PageLayout>
  );
}
