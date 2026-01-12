import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { DebugConsole } from "../../components/DebugConsole";
import { callPlugin } from "../../utils/callPlugin";
import type { ExportPageResponseData } from "../../plugin/services/pageExportNew";
import type { DebugConsoleMessage } from "../../plugin/services/debugConsole";
import { useAuth } from "../../context/useAuth";
import {
  GitHubService,
  type ComponentInfo,
} from "../../services/github/githubService";
import { Title } from "../../components/Title";
import { Group } from "../../components/Group";
import { Button } from "../../components/Button";
import { Stack } from "../../components/Stack";
import classes from "./Publishing.module.css";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

export default function Publishing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<DebugConsoleMessage[] | undefined>(
    undefined,
  );
  const [exportData, setExportData] = useState<ExportPageResponseData | null>(
    null,
  );

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

        await new Promise((resolve) => setTimeout(resolve, 50));

        if (!isMounted) return;

        console.log("[Publishing] Starting page export...", { pageIndex });
        const { promise, cancel } = callPlugin("exportPage", {
          pageIndex,
          skipPrompts: true,
        });
        cancelFn = cancel;

        const response = await promise;

        console.log("[Publishing] Export response:", {
          success: response.success,
          hasData: !!response.data,
          message: response.message,
        });

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
            if (response.data?.debugLogs) {
              setDebugLogs(response.data.debugLogs as DebugConsoleMessage[]);
            }

            setExportData(exportDataResponse);
            setIsPublishing(false);
          }
        } else {
          const errorMessage =
            response.message || "Failed to export page. Please try again.";
          console.error("[Publishing] Export failed:", errorMessage);
          setError(errorMessage);
          setIsPublishing(false);
          if (response.data?.debugLogs) {
            setDebugLogs(response.data.debugLogs as DebugConsoleMessage[]);
          }
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to export page";
          setError(errorMessage);
          setIsPublishing(false);
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

    return () => {
      isMounted = false;
      if (cancelFn) {
        cancelFn(false);
      }
    };
  }, [searchParams, getCurrentVersion, navigate]);

  return (
    <PageLayout showBackButton={true}>
      <Stack gap={16} className={classes.root}>
        <Title order={1} className={classes.title}>
          Publishing
        </Title>

        <DebugConsole
          title="Exporting Page"
          isActive={isPublishing}
          isComplete={!isPublishing && !error && !!exportData}
          error={error}
          debugLogs={debugLogs}
          successMessage="Page exported successfully"
        />

        {!isPublishing && !error && exportData && (
          <Group gap={12} className={classes.buttonGroup}>
            <Button variant="outline" color="red" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              onClick={async () => {
                const pageIndexParam = searchParams.get("pageIndex");
                const pageIndex = pageIndexParam
                  ? parseInt(pageIndexParam, 10)
                  : undefined;

                let mainBranchComponents: ComponentInfo[] | undefined;
                if (accessToken) {
                  try {
                    const githubService = new GitHubService(accessToken);
                    mainBranchComponents =
                      await githubService.loadComponentsFromBranch(
                        RECURSICA_FIGMA_OWNER,
                        RECURSICA_FIGMA_REPO,
                        "main",
                      );
                    console.log(
                      `[Publishing] Loaded ${mainBranchComponents.length} components from main branch`,
                    );
                  } catch (err) {
                    console.error(
                      "[Publishing] Failed to load main branch components:",
                      err,
                    );
                  }
                }

                navigate("/publishing-wizard", {
                  state: {
                    exportData,
                    pageIndex,
                    mainBranchComponents,
                  },
                  replace: true,
                });
              }}
            >
              Next
            </Button>
          </Group>
        )}
      </Stack>
    </PageLayout>
  );
}
