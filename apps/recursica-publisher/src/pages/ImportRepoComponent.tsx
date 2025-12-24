import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageLayout from "../components/PageLayout";
import { useImportData, type ImportedFile } from "../context/ImportDataContext";
import { useAuth } from "../context/useAuth";
import { validateImport } from "../utils/validateExportFile";
import { fetchComponentWithDependencies } from "../services/repository/repositoryImportService";

export default function ImportRepoComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setImportData } = useImportData();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  const componentGuid = searchParams.get("guid");
  const ref = searchParams.get("ref") || "main";

  useEffect(() => {
    if (!componentGuid) {
      setError("Component GUID is required");
      setLoading(false);
      return;
    }

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        setProgress("Fetching component from repository...");

        // Fetch the component and all its dependencies
        const { mainComponent, dependencies } =
          await fetchComponentWithDependencies(
            componentGuid,
            ref,
            accessToken || undefined,
          );

        setProgress("Validating component files...");

        // Validate the main component
        const mainValidation = validateImport(mainComponent.jsonData);
        if (!mainValidation.valid) {
          throw new Error(
            mainValidation.error || "Invalid main component file format",
          );
        }

        // Validate all dependencies
        const invalidDeps: string[] = [];
        for (const dep of dependencies) {
          const depValidation = validateImport(dep.jsonData);
          if (!depValidation.valid) {
            invalidDeps.push(dep.name);
          }
        }

        if (invalidDeps.length > 0) {
          throw new Error(
            `Invalid dependency files: ${invalidDeps.join(", ")}`,
          );
        }

        setProgress("Preparing import data...");

        // Convert to ImportedFile format
        const timestamp = Date.now();
        const mainFile: ImportedFile = {
          id: `${mainComponent.guid}-${timestamp}-0`,
          name: `${mainComponent.name}.json`,
          size: JSON.stringify(mainComponent.jsonData).length,
          data: mainComponent.jsonData,
          status: "success",
        };

        const additionalFiles: ImportedFile[] = dependencies.map(
          (dep, index) => ({
            id: `${dep.guid}-${timestamp}-${index + 1}`,
            name: `${dep.name}.json`,
            size: JSON.stringify(dep.jsonData).length,
            data: dep.jsonData,
            status: "success",
          }),
        );

        // Set import data with source info and navigate to importing page
        setImportData({
          mainFile,
          additionalFiles,
          source: {
            type: "repo",
            branch: ref,
            owner: "borderux",
            repo: "recursica-figma",
          },
        });

        setProgress("Redirecting to import page...");

        // Navigate to importing page
        navigate("/importing");
      } catch (loadError) {
        const errorMessage =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load component from repository";
        setError(errorMessage);
        console.error(
          "[ImportRepoComponent] Failed to load component:",
          loadError,
        );
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [componentGuid, ref, navigate, setImportData, accessToken]);

  return (
    <PageLayout showBackButton={true}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          padding: "20px",
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
          Importing Component from Repository
        </h1>

        {loading && (
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              padding: "40px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                color: "#666",
                textAlign: "center",
              }}
            >
              {progress || "Loading..."}
            </div>
            <div
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#e0e0e0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#d40d0d",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "16px",
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: "8px",
              color: "#c62828",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              padding: "40px",
              color: "#666",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            Component loaded successfully. Redirecting...
          </div>
        )}
      </div>
    </PageLayout>
  );
}
