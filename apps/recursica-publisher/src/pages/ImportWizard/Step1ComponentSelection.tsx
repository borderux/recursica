import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useImportWizard } from "../../context/ImportWizardContext";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

interface ComponentInfo {
  guid: string;
  name: string;
  path: string;
  version: number;
  publishDate?: string;
}

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

export default function Step1ComponentSelection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setWizardState } = useImportWizard();
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get branch/commit ref from search params, default to "main"
        const ref = searchParams.get("ref") || "main";

        // Fetch index.json from public repository
        const url = `https://api.github.com/repos/${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}/contents/index.json?ref=${encodeURIComponent(ref)}`;
        const response = await fetch(url, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        });

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

        // Use base64 content from API response to avoid CDN caching issues
        // GitHub API includes content for files under 1MB (index.json is small)
        let indexContent: string;
        if (fileData.content && fileData.encoding === "base64") {
          // Decode base64 content directly from API response (avoids CDN cache)
          // Properly handle UTF-8 encoding for Unicode characters (emojis, etc.)
          const binaryString = atob(fileData.content.replace(/\s/g, ""));
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          indexContent = new TextDecoder("utf-8").decode(bytes);
        } else {
          // Fallback: use download_url with cache-busting using SHA
          const cacheBustUrl = `${fileData.download_url}?sha=${fileData.sha}`;
          indexContent = await fetch(cacheBustUrl, {
            cache: "no-store", // Explicitly disable caching
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

        // Convert the components object to an array of ComponentInfo
        const componentsList: ComponentInfo[] = [];

        if (indexJson.components) {
          for (const [guid, component] of Object.entries(
            indexJson.components,
          )) {
            componentsList.push({
              guid,
              name: component.name,
              path: component.path,
              version: component.version ?? 0,
              publishDate: component.publishDate,
            });
          }
        }

        // Sort components by name
        componentsList.sort((a, b) => a.name.localeCompare(b.name));

        setComponents(componentsList);
      } catch (loadError) {
        const errorMessage =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load components from repository";
        setError(errorMessage);
        console.error(
          "[Step1ComponentSelection] Failed to load components:",
          loadError,
        );
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, [searchParams]);

  // Auto-select component if guid is provided in query params (from ImportMain)
  useEffect(() => {
    const componentGuid = searchParams.get("guid");
    if (componentGuid && components.length > 0 && !loading) {
      const preSelectedComponent = components.find(
        (c) => c.guid === componentGuid,
      );
      if (preSelectedComponent) {
        // Auto-select and navigate to step 2
        const ref = searchParams.get("ref") || "main";
        setWizardState((prev) => ({
          ...prev,
          selectedComponent: {
            guid: preSelectedComponent.guid,
            name: preSelectedComponent.name,
            version: preSelectedComponent.version,
            ref,
          },
          currentStep: 2,
        }));
        navigate("/import-wizard/step2");
      }
    }
  }, [components, searchParams, loading, setWizardState, navigate]);

  const handleComponentSelect = (component: ComponentInfo) => {
    const ref = searchParams.get("ref") || "main";
    setWizardState((prev) => ({
      ...prev,
      selectedComponent: {
        guid: component.guid,
        name: component.name,
        version: component.version,
        ref,
      },
      currentStep: 2,
    }));
    navigate("/import-wizard/step2");
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "0px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "8px",
          marginTop: "0",
        }}
      >
        Choose your component
      </h1>

      {searchParams.get("ref") ? (
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            marginBottom: "20px",
            marginTop: "0",
            padding: "12px",
            fontSize: "14px",
            fontFamily: "inherit",
            border: "1px solid #000",
            borderRadius: "4px",
            boxSizing: "border-box",
            backgroundColor: "#fff",
            color: "#333",
          }}
        >
          VIEWING BRANCH:{" "}
          <a
            href={`https://github.com/${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}/tree/${encodeURIComponent(searchParams.get("ref") || "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1976d2",
              textDecoration: "underline",
            }}
          >
            {`https://github.com/${RECURSICA_FIGMA_OWNER}/${RECURSICA_FIGMA_REPO}/tree/${encodeURIComponent(searchParams.get("ref") || "")}`}
          </a>
        </div>
      ) : (
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "0",
            maxWidth: "600px",
          }}
        >
          We have an exciting list of components to import. Please choose from
          the list below. Check back frequently for new updates.
        </p>
      )}

      {loading && (
        <div
          style={{
            padding: "40px",
            color: "#666",
            fontSize: "16px",
          }}
        >
          Loading components...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            color: "#c62828",
            fontSize: "14px",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && components.length === 0 && (
        <div
          style={{
            padding: "40px",
            color: "#666",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          No components available.
        </div>
      )}

      {!loading && !error && components.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {components.map((component) => (
            <button
              key={component.guid}
              onClick={() => handleComponentSelect(component)}
              style={{
                width: "100%",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: "transparent",
                color: "#d40d0d",
                border: "2px solid #d40d0d",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
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
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  flex: 1,
                  fontFamily:
                    "system-ui, -apple-system, 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
                }}
              >
                {component.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "2px",
                  flexShrink: 0,
                }}
              >
                <div>Version: {component.version || "N/A"}</div>
                {component.publishDate && (
                  <div>
                    {new Date(component.publishDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
