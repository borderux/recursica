import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { useAuth } from "../../context/useAuth";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { Stack } from "../../components/Stack";
import { Alert } from "../../components/Alert";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  ComponentList,
  type ComponentInfo,
  type ComponentBadgeStatus,
} from "../../components/ComponentList";
import { callPlugin } from "../../utils/callPlugin";
import { getComponentCleanName } from "../../plugin/utils/getComponentCleanName";
import classes from "./ImportMain.module.css";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

interface IndexJson {
  components?: Record<
    string,
    {
      name: string;
      path: string;
      version?: number;
      publishDate?: string;
    }
  >;
}

export default function ImportMain() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoading(true);
        setError(null);

        const ref = searchParams.get("ref") || "main";

        const url = `https://api.github.com/repos/${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}/contents/index.json?ref=${encodeURIComponent(ref)}`;
        const headers: Record<string, string> = {
          Accept: "application/vnd.github.v3+json",
        };
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }
        const response = await fetch(url, { headers });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "index.json not found. The repository may not have been initialized yet.",
            );
          } else if (response.status === 403) {
            throw new Error(
              "Cannot access index.json. The repository may be private or you may not have access.",
            );
          }
          throw new Error(
            `Failed to load index.json: ${response.status} ${response.statusText}`,
          );
        }

        const fileData = await response.json();

        let indexContent: string;
        if (fileData.content && fileData.encoding === "base64") {
          const binaryString = atob(fileData.content.replace(/\s/g, ""));
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          indexContent = new TextDecoder("utf-8").decode(bytes);
        } else {
          const cacheBustUrl = `${fileData.download_url}?sha=${fileData.sha}`;
          indexContent = await fetch(cacheBustUrl, {
            cache: "no-store",
          }).then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to download index.json: ${res.status} ${res.statusText}`,
              );
            }
            return res.text();
          });
        }

        const indexJson: IndexJson = JSON.parse(indexContent);

        // Get existing components from Figma to determine badge status
        const { promise: getAllComponentsPromise } = callPlugin(
          "getAllComponents",
          {},
        );
        const existingComponentsResponse = await getAllComponentsPromise;

        let existingComponents: Array<{
          id: string;
          name: string;
          version: number;
        }> = [];

        if (
          existingComponentsResponse.success &&
          existingComponentsResponse.data
        ) {
          const data = existingComponentsResponse.data as {
            components: Array<{
              id: string;
              name: string;
              version: number;
            }>;
          };
          existingComponents = data.components.filter((c) => c.id !== "");
        }

        // Helper function to determine badge status
        const getBadgeStatus = (
          guid: string,
          version: number,
        ): ComponentBadgeStatus | undefined => {
          const existing = existingComponents.find((ec) => ec.id === guid);
          if (!existing) {
            return "NEW";
          } else if (existing.version !== version) {
            return "UPDATED";
          } else {
            return "EXISTING";
          }
        };

        const componentsList: ComponentInfo[] = [];

        if (indexJson.components) {
          for (const [guid, component] of Object.entries(
            indexJson.components,
          )) {
            const componentVersion = component.version ?? 0;
            componentsList.push({
              guid,
              name: component.name,
              path: component.path,
              version: componentVersion,
              publishDate: component.publishDate,
              badge: getBadgeStatus(guid, componentVersion),
            });
          }
        }

        // Sort by clean component name (case-insensitive, alphanumeric only)
        componentsList.sort((a, b) => {
          const cleanA = getComponentCleanName(a.name).toLowerCase();
          const cleanB = getComponentCleanName(b.name).toLowerCase();
          return cleanA.localeCompare(cleanB);
        });

        setComponents(componentsList);
      } catch (loadError) {
        const errorMessage =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load components from repository";
        setError(errorMessage);
        console.error("[ImportMain] Failed to load components:", loadError);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, [searchParams, accessToken]);

  return (
    <PageLayout showBackButton={true}>
      <Stack gap={20} className={classes.root}>
        <Title order={1} className={classes.title}>
          Component Library
        </Title>

        {searchParams.get("ref") ? (
          <div className={classes.branchInfo}>
            VIEWING BRANCH:{" "}
            <a
              href={`https://github.com/${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}/tree/${encodeURIComponent(searchParams.get("ref") || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.branchLink}
            >
              {`https://github.com/${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}/tree/${encodeURIComponent(searchParams.get("ref") || "")}`}
            </a>
          </div>
        ) : (
          <Text variant="body" className={classes.description}>
            We have an exciting list of components to import. Please choose from
            the list below. Check back frequently for new updates.
          </Text>
        )}

        {loading && (
          <div className={classes.loading}>
            <LoadingSpinner />
            <Text variant="body">Loading components...</Text>
          </div>
        )}

        {error && (
          <Alert variant="error" className={classes.error}>
            {error}
          </Alert>
        )}

        {!loading && !error && components.length === 0 && (
          <Text variant="body" className={classes.empty}>
            No components available.
          </Text>
        )}

        {!loading && !error && components.length > 0 && (
          <ComponentList
            components={components}
            onSelect={(component) => {
              const ref = searchParams.get("ref") || "main";
              navigate(
                `/import-wizard/step1?guid=${encodeURIComponent(component.guid)}&ref=${encodeURIComponent(ref)}`,
                {
                  state: { fromImportMain: true },
                },
              );
            }}
          />
        )}
      </Stack>
    </PageLayout>
  );
}
