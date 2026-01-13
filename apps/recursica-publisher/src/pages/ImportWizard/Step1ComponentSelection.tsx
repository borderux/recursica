import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useImportWizard } from "../../context/ImportWizardContext";
import { useAuth } from "../../context/useAuth";
import {
  ComponentList,
  type ComponentInfo,
} from "../../components/ComponentList";

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

export default function Step1ComponentSelection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { wizardState, setWizardState } = useImportWizard();
  const { accessToken } = useAuth();
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigatingAwayRef = useRef(false);

  // Reset ref when component mounts (in case user navigated back)
  useEffect(() => {
    navigatingAwayRef.current = false;
  }, []);

  useEffect(() => {
    console.log("[Step1ComponentSelection] useEffect triggered");
    const loadComponents = async () => {
      console.log("[Step1ComponentSelection] loadComponents called");
      try {
        setLoading(true);
        setError(null);

        // Get branch/commit ref from search params, default to "main"
        const ref = searchParams.get("ref") || "main";
        console.log(
          "[Step1ComponentSelection] Loading components for ref:",
          ref,
        );

        // Fetch index.json from public repository
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

        console.log(
          "[Step1ComponentSelection] Setting components, count:",
          componentsList.length,
        );
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
        console.log("[Step1ComponentSelection] Setting loading to false");
        setLoading(false);
      }
    };

    loadComponents();
  }, [searchParams, accessToken]);

  // Auto-select component if guid is provided in query params (from ImportMain)
  useEffect(() => {
    const componentGuid = searchParams.get("guid");
    if (componentGuid && components.length > 0 && !loading) {
      const preSelectedComponent = components.find(
        (c) => c.guid === componentGuid,
      );
      if (preSelectedComponent) {
        // Auto-select and navigate to step 2
        console.log(
          "[Step1ComponentSelection] Auto-selecting component:",
          preSelectedComponent.name,
        );
        navigatingAwayRef.current = true; // Set ref synchronously before any async operations
        const ref = searchParams.get("ref") || "main";
        console.log(
          "[Step1ComponentSelection] Setting wizard state, ref:",
          ref,
        );
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
        console.log("[Step1ComponentSelection] Navigating to step2");
        navigate("/import-wizard/step2");
        console.log("[Step1ComponentSelection] Navigate called");
      }
    }
  }, [components, searchParams, loading, setWizardState, navigate]);

  const handleComponentSelect = (component: ComponentInfo) => {
    console.log(
      "[Step1ComponentSelection] handleComponentSelect called:",
      component.name,
    );
    navigatingAwayRef.current = true; // Set ref synchronously before any async operations
    const ref = searchParams.get("ref") || "main";
    console.log("[Step1ComponentSelection] Setting wizard state, ref:", ref);
    setWizardState((prev) => {
      console.log(
        "[Step1ComponentSelection] setWizardState callback, prev:",
        prev,
      );
      return {
        ...prev,
        selectedComponent: {
          guid: component.guid,
          name: component.name,
          version: component.version,
          ref,
        },
        currentStep: 2,
      };
    });
    console.log("[Step1ComponentSelection] Navigating to step2");
    navigate("/import-wizard/step2");
    console.log("[Step1ComponentSelection] Navigate called");
  };

  // Check ref first (synchronous, set before navigate)
  if (navigatingAwayRef.current) {
    console.log(
      "[Step1ComponentSelection] Render - hiding content, navigatingAwayRef is true",
    );
    return null;
  }

  console.log(
    "[Step1ComponentSelection] Render - loading:",
    loading,
    "components.length:",
    components.length,
    "error:",
    error,
  );
  console.log(
    "[Step1ComponentSelection] Render - searchParams ref:",
    searchParams.get("ref"),
  );
  console.log(
    "[Step1ComponentSelection] Render - wizardState.selectedComponent:",
    wizardState.selectedComponent,
    "currentStep:",
    wizardState.currentStep,
  );

  // Check if we're about to auto-select (guid in params)
  // Hide content immediately if guid exists, even during loading, to prevent flash
  const componentGuid = searchParams.get("guid");
  if (componentGuid && !wizardState.selectedComponent) {
    console.log(
      "[Step1ComponentSelection] Render - hiding content, guid in params, about to auto-select",
    );
    navigatingAwayRef.current = true;
    return null;
  }

  // If we've selected a component and are navigating to step2, don't render content
  if (wizardState.selectedComponent && wizardState.currentStep === 2) {
    console.log(
      "[Step1ComponentSelection] Render - hiding content, navigating to step2",
    );
    navigatingAwayRef.current = true;
    return null;
  }

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

      {(() => {
        const ref = searchParams.get("ref");
        console.log(
          "[Step1ComponentSelection] Render - checking ref, value:",
          ref,
        );
        return ref ? (
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
        );
      })()}

      {(() => {
        console.log(
          "[Step1ComponentSelection] Render - loading check, loading:",
          loading,
        );
        return loading ? (
          <div
            style={{
              padding: "40px",
              color: "#666",
              fontSize: "16px",
            }}
          >
            Loading components...
          </div>
        ) : null;
      })()}

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
        <ComponentList
          components={components}
          onSelect={handleComponentSelect}
        />
      )}
    </div>
  );
}
