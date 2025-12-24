import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { useImportData } from "../context/ImportDataContext";
import { useAuth } from "../context/useAuth";
import { callPlugin } from "../utils/callPlugin";

export default function Home() {
  const navigate = useNavigate();
  const { importData, setImportData } = useImportData();
  const { isAuthenticated, accessToken, hasWriteAccess } = useAuth();

  // Debug: Log importData state
  useEffect(() => {
    console.log("[Home] importData state:", {
      hasImportData: !!importData,
      hasMainFile: !!importData?.mainFile,
      mainFileStatus: importData?.mainFile?.status,
      mainFileName: importData?.mainFile?.name,
      additionalFilesCount: importData?.additionalFiles?.length || 0,
    });
  }, [importData]);

  // Check if import is in progress or failed (should show importing screen)
  const isImporting =
    importData &&
    importData.mainFile &&
    importData.mainFile.status === "success" &&
    (importData.importStatus === "in_progress" ||
      importData.importStatus === "failed");

  // Check for existing import in Figma (highest precedence - shows Review Import)
  const [hasExistingImport, setHasExistingImport] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    const checkForExisting = async () => {
      try {
        const { promise } = callPlugin("checkForExistingPrimaryImport", {});
        const response = await promise;

        if (response.success && response.data) {
          const data = response.data as {
            exists: boolean;
            pageId?: string;
            metadata?: unknown;
          };
          setHasExistingImport(data.exists || false);
        } else {
          setHasExistingImport(false);
        }
      } catch (err) {
        console.error("[Home] Error checking for existing import:", err);
        setHasExistingImport(false);
      } finally {
        setCheckingExisting(false);
      }
    };

    checkForExisting();
  }, []);

  // Debug: Log isImporting state
  useEffect(() => {
    console.log("[Home] isImporting check:", {
      isImporting,
      importDataExists: !!importData,
      mainFileExists: !!importData?.mainFile,
      mainFileStatus: importData?.mainFile?.status,
      importStatus: importData?.importStatus,
    });
  }, [isImporting, importData]);

  // Auto-navigate logic - highest precedence: existing import (Review Import)
  useEffect(() => {
    if (checkingExisting) return;

    // Highest precedence: If there's an existing import, show Review Import
    if (hasExistingImport) {
      console.log("[Home] Found existing import, navigating to Review Import");
      navigate("/import-wizard/existing", { replace: true });
      return;
    }

    // Second precedence: If import is in progress or failed, show importing screen
    if (isImporting) {
      console.log(
        "[Home] Navigating to /importing (auto-navigate - already importing or failed)",
      );
      navigate("/importing", { replace: true });
      return;
    }

    // If import is completed, clear it
    if (importData?.importStatus === "completed") {
      console.log("[Home] Import completed, clearing import data");
      setImportData(null);
    }
  }, [
    hasExistingImport,
    checkingExisting,
    isImporting,
    navigate,
    importData,
    setImportData,
  ]);

  const handleImportClick = async () => {
    console.log("[Home] Import button clicked");
    console.log("[Home] Current state:", {
      importDataExists: !!importData,
      mainFileExists: !!importData?.mainFile,
      mainFileStatus: importData?.mainFile?.status,
      isAuthenticated,
      hasAccessToken: !!accessToken,
      hasWriteAccess,
    });

    // Check import status again at click time (in case it changed)
    // Only consider it "importing" if import is actually in progress or failed
    const currentlyImporting =
      importData &&
      importData.mainFile &&
      importData.mainFile.status === "success" &&
      (importData.importStatus === "in_progress" ||
        importData.importStatus === "failed");

    console.log("[Home] currentlyImporting:", currentlyImporting, {
      importStatus: importData?.importStatus,
      hasMainFile: !!importData?.mainFile,
    });

    // If already importing or failed, show the importing screen
    if (currentlyImporting) {
      console.log(
        "[Home] Navigating to /importing (button click - import in progress or failed)",
      );
      navigate("/importing");
      return;
    }

    // If import is completed, clear the data and start fresh
    if (importData?.importStatus === "completed") {
      console.log("[Home] Import completed, clearing import data");
      setImportData(null);
    }

    // Check for existing import in Figma (via plugin metadata)
    try {
      const { promise } = callPlugin("checkForExistingPrimaryImport", {});
      const response = await promise;

      if (response.success && response.data) {
        const data = response.data as {
          exists: boolean;
          pageId?: string;
          metadata?: unknown;
        };

        if (data.exists) {
          console.log(
            "[Home] Found existing import, navigating to /import-wizard/existing",
          );
          navigate("/import-wizard/existing");
          return;
        }
      }
    } catch (err) {
      console.error("[Home] Error checking for existing import:", err);
      // Continue with normal flow if check fails
    }

    // If user is authenticated and has write access, show import selection page
    if (isAuthenticated && accessToken && hasWriteAccess === true) {
      console.log("[Home] Navigating to /import (selection page)");
      navigate("/import");
      return;
    }

    // Otherwise, show the import from repo page
    console.log("[Home] Navigating to /import-main (default)");
    navigate("/import-main");
  };

  const handleTestClick = () => {
    console.log("[Home] Test button clicked");
    navigate("/test");
  };

  return (
    <PageLayout showBackButton={false}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "100%",
        }}
      >
        {/* Import Button */}
        <button
          onClick={handleImportClick}
          style={{
            width: "200px",
            padding: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "transparent",
            color: "#d40d0d",
            border: "2px solid #d40d0d",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
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
          {isImporting ? "Continue Import" : "Import"}
        </button>

        {/* Publish Button */}
        <button
          onClick={() => navigate("/publish")}
          style={{
            width: "200px",
            padding: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "transparent",
            color: "#d40d0d",
            border: "2px solid #d40d0d",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
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

        {/* Test Button */}
        <button
          onClick={handleTestClick}
          style={{
            width: "200px",
            padding: "20px",
            fontSize: "18px",
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
          Test
        </button>
      </div>
    </PageLayout>
  );
}
