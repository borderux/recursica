import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { callPlugin } from "../../utils/callPlugin";
import type { PageInfo } from "../../plugin/services/getAllPages";
import type { ComponentMetadata } from "../../plugin/services/getComponentMetadata";
import { useAuth } from "../../context/useAuth";
import { GitHubService } from "../../services/github/githubService";
import {
  Title,
  Text,
  Stack,
  Button,
  Alert,
  LoadingSpinner,
  Card,
  Checkbox,
} from "../../components";
import classes from "./PublishInit.module.css";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

/**
 * Clean a component name to only allow alphanumeric, underscore, dash, or space characters
 */
function getComponentName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}

interface MatchedPage {
  pageInfo: PageInfo;
  githubComponent: {
    guid: string;
    name: string;
    version: number;
    publishDate?: string;
  } | null;
  hasGuidMismatch: boolean; // true if local GUID doesn't match GitHub GUID
}

export default function PublishInit() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedPages, setMatchedPages] = useState<MatchedPage[]>([]);
  const [selectedPageIndices, setSelectedPageIndices] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const loadData = async () => {
      if (!accessToken) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load all pages from Figma
        const { promise: pagesPromise } = callPlugin("getAllPages", {});
        const pagesResponse = await pagesPromise;

        if (!pagesResponse.success || !pagesResponse.data) {
          throw new Error(
            pagesResponse.message || "Failed to load pages from Figma",
          );
        }

        const pagesData = pagesResponse.data as { pages: PageInfo[] };

        // Load index.json from GitHub
        const githubService = new GitHubService(accessToken);
        const components = await githubService.loadComponentsFromBranch(
          RECURSICA_FIGMA_OWNER,
          RECURSICA_FIGMA_REPO,
          "main",
        );

        // Match pages by cleaned name and check for GUID mismatches
        const matched: MatchedPage[] = pagesData.pages.map((pageInfo) => {
          const cleanedName = pageInfo.cleanedName;
          const matchedComponent = components.find((comp) => {
            const cleanedCompName = getComponentName(comp.name);
            return cleanedCompName === cleanedName;
          });

          // Check for GUID mismatch: if page has local metadata with a GUID,
          // and it doesn't match the GitHub GUID, there's a mismatch
          let hasGuidMismatch = false;
          if (matchedComponent && pageInfo.localGuid) {
            hasGuidMismatch = pageInfo.localGuid !== matchedComponent.guid;
          }

          return {
            pageInfo,
            githubComponent: matchedComponent
              ? {
                  guid: matchedComponent.guid,
                  name: matchedComponent.name,
                  version: matchedComponent.version,
                  publishDate: matchedComponent.publishDate,
                }
              : null,
            hasGuidMismatch,
          };
        });

        // Auto-select pages with GUID mismatches (GitHub GUID takes precedence)
        const mismatchedIndices = new Set<number>();
        matched.forEach((mp) => {
          if (mp.hasGuidMismatch && mp.githubComponent) {
            mismatchedIndices.add(mp.pageInfo.index);
          }
        });

        setMatchedPages(matched);
        setSelectedPageIndices(mismatchedIndices);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
        console.error("[PublishInit] Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  const handleCheckboxToggle = (pageIndex: number, checked: boolean) => {
    setSelectedPageIndices((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(pageIndex);
      } else {
        newSet.delete(pageIndex);
      }
      return newSet;
    });
  };

  const handleSyncSelected = async () => {
    if (selectedPageIndices.size === 0) {
      setError("Please select at least one page to sync");
      return;
    }

    setSyncing(true);
    setError(null);

    try {
      // Sync each selected page
      for (const pageIndex of selectedPageIndices) {
        const matched = matchedPages.find(
          (mp) => mp.pageInfo.index === pageIndex,
        );

        if (!matched || !matched.githubComponent) {
          console.warn(
            `[PublishInit] Skipping page ${pageIndex} - no GitHub match`,
          );
          continue;
        }

        const metadata: ComponentMetadata = {
          _ver: 1,
          id: matched.githubComponent.guid,
          name: matched.githubComponent.name,
          version: matched.githubComponent.version,
          publishDate: matched.githubComponent.publishDate || "",
          history: {},
        };

        const { promise } = callPlugin("storePageMetadata", {
          pageIndex,
          metadata,
        });
        const response = await promise;

        if (!response.success) {
          throw new Error(
            `Failed to store metadata for page "${matched.pageInfo.name}": ${response.message}`,
          );
        }
      }

      // Navigate back to publish page after successful sync
      navigate("/publish");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sync pages";
      setError(errorMessage);
      console.error("[PublishInit] Error syncing pages:", err);
      setSyncing(false);
    }
  };

  const handleSkip = () => {
    // Navigate back to publish page without syncing
    navigate("/publish");
  };

  if (loading) {
    return (
      <PageLayout showBackButton={true}>
        <Stack gap="md" align="center" className={classes.loadingContainer}>
          <LoadingSpinner />
          <Text className={classes.loadingText}>
            Loading pages and GitHub data...
          </Text>
        </Stack>
      </PageLayout>
    );
  }

  const pagesWithMatches = matchedPages.filter((mp) => mp.githubComponent);
  const pagesWithoutMatches = matchedPages.filter((mp) => !mp.githubComponent);

  return (
    <PageLayout showBackButton={true}>
      <Stack gap="lg" className={classes.root}>
        <div className={classes.header}>
          <Title order={1} mb="xs">
            Publish Initialization
          </Title>
          <Text variant="small" className={classes.description}>
            Match your Figma pages with components from GitHub to sync metadata.
            Pages with GUID mismatches are automatically selected. GitHub GUID
            takes precedence over local metadata.
          </Text>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {pagesWithMatches.length > 0 && (
          <Card className={classes.pagesCard}>
            <div className={classes.cardHeader}>
              <Title order={3}>Pages with GitHub Matches</Title>
              <Text variant="small" className={classes.cardSubtitle}>
                {pagesWithMatches.length} page(s) found
              </Text>
            </div>
            <Stack gap="sm" className={classes.pagesList}>
              {pagesWithMatches.map((matched) => {
                const pageIndex = matched.pageInfo.index;
                const isSelected = selectedPageIndices.has(pageIndex);
                const hasMetadata = matched.pageInfo.hasMetadata;

                return (
                  <div key={pageIndex} className={classes.pageItem}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) =>
                        handleCheckboxToggle(pageIndex, e.target.checked)
                      }
                      disabled={syncing}
                    />
                    <div className={classes.pageInfo}>
                      <div className={classes.pageNameRow}>
                        <Text className={classes.pageName}>
                          {matched.pageInfo.name}
                        </Text>
                        {hasMetadata && (
                          <Text
                            variant="small"
                            className={classes.metadataBadge}
                          >
                            Has metadata
                          </Text>
                        )}
                      </div>
                      {matched.githubComponent && (
                        <div className={classes.githubInfo}>
                          <Text variant="small" className={classes.githubName}>
                            GitHub: {matched.githubComponent.name}
                          </Text>
                          <Text
                            variant="small"
                            className={classes.githubDetails}
                          >
                            GUID: {matched.githubComponent.guid.substring(0, 8)}
                            ... | Version: {matched.githubComponent.version}
                          </Text>
                          {matched.hasGuidMismatch && (
                            <Alert
                              variant="error"
                              className={classes.mismatchAlert}
                            >
                              <Text variant="small">
                                <strong>GUID Mismatch:</strong> Local GUID (
                                {matched.pageInfo.localGuid?.substring(0, 8)}
                                ...) does not match GitHub GUID (
                                {matched.githubComponent.guid.substring(0, 8)}
                                ...). GitHub GUID will be used when syncing.
                              </Text>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Stack>
          </Card>
        )}

        {pagesWithoutMatches.length > 0 && (
          <Card className={classes.pagesCard}>
            <div className={classes.cardHeader}>
              <Title order={3}>Pages without GitHub Matches</Title>
              <Text variant="small" className={classes.cardSubtitle}>
                {pagesWithoutMatches.length} page(s) - no matching component
                found in index.json
              </Text>
            </div>
            <Stack gap="sm" className={classes.pagesList}>
              {pagesWithoutMatches.map((matched) => (
                <div key={matched.pageInfo.index} className={classes.pageItem}>
                  <div className={classes.pageInfo}>
                    <Text className={classes.pageName}>
                      {matched.pageInfo.name}
                    </Text>
                    <Text variant="small" className={classes.noMatchText}>
                      No match found in GitHub index.json
                    </Text>
                  </div>
                </div>
              ))}
            </Stack>
          </Card>
        )}

        {pagesWithMatches.length === 0 && pagesWithoutMatches.length === 0 && (
          <Alert variant="info">
            No pages found in the current Figma file.
          </Alert>
        )}

        <div className={classes.actions}>
          <Button onClick={handleSkip} disabled={syncing}>
            {syncing ? "Processing..." : "Skip"}
          </Button>
          <Button
            variant="filled"
            onClick={handleSyncSelected}
            disabled={syncing || selectedPageIndices.size === 0}
          >
            {syncing ? "Syncing..." : "Sync Selected"}
          </Button>
        </div>
      </Stack>
    </PageLayout>
  );
}
