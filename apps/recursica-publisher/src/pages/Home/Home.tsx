import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { PageLayout } from "../../components/PageLayout";
import { useImportData } from "../../context/ImportDataContext";
import { useAuth } from "../../context/useAuth";
import { callPlugin } from "../../utils/callPlugin";
import { Stack } from "../../components/Stack";
import { Button } from "../../components/Button";
import classes from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const { importData, setImportData } = useImportData();
  const { isAuthenticated, accessToken, hasWriteAccess } = useAuth();

  useEffect(() => {
    console.log("[Home] importData state:", {
      hasImportData: !!importData,
      hasMainFile: !!importData?.mainFile,
      mainFileStatus: importData?.mainFile?.status,
      mainFileName: importData?.mainFile?.name,
      additionalFilesCount: importData?.additionalFiles?.length || 0,
    });
  }, [importData]);

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

  useEffect(() => {
    if (checkingExisting) return;

    if (hasExistingImport) {
      console.log("[Home] Found existing import, navigating to Review Import");
      navigate("/import-wizard/existing", { replace: true });
      return;
    }

    if (
      importData &&
      importData.mainFile &&
      importData.mainFile.status === "success" &&
      importData.importStatus === "in_progress"
    ) {
      console.log("[Home] Import in progress, navigating to importing screen");
      navigate("/importing", { replace: true });
      return;
    }

    if (
      importData &&
      importData.mainFile &&
      importData.mainFile.status === "success" &&
      importData.importStatus === "failed" &&
      !hasExistingImport
    ) {
      console.log(
        "[Home] Found failed import data but no existing import in Figma, clearing stale data",
      );
      setImportData(null);
      return;
    }

    if (
      importData &&
      importData.mainFile &&
      importData.mainFile.status === "success" &&
      importData.importStatus === "failed" &&
      hasExistingImport
    ) {
      console.log(
        "[Home] Import failed with existing import, navigating to Review Import",
      );
      navigate("/import-wizard/existing", { replace: true });
      return;
    }

    if (importData?.importStatus === "completed") {
      console.log("[Home] Import completed, clearing import data");
      setImportData(null);
    }
  }, [
    hasExistingImport,
    checkingExisting,
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

    if (currentlyImporting) {
      console.log(
        "[Home] Navigating to /importing (button click - import in progress or failed)",
      );
      navigate("/importing");
      return;
    }

    if (importData?.importStatus === "completed") {
      console.log("[Home] Import completed, clearing import data");
      setImportData(null);
    }

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
    }

    if (isAuthenticated && accessToken && hasWriteAccess === true) {
      console.log("[Home] Navigating to /import (selection page)");
      navigate("/import");
      return;
    }

    console.log("[Home] Navigating to /import-main (default)");
    navigate("/import-main");
  };

  const handlePublishClick = () => {
    console.log("[Home] Publish button clicked");
    navigate("/publish");
  };

  return (
    <PageLayout showBackButton={false}>
      <div className={classes.root}>
        <Stack gap={20} align="center">
          <Button
            variant="outline"
            color="red"
            size="lg"
            onClick={handleImportClick}
            className={classes.button}
          >
            {importData &&
            importData.mainFile &&
            importData.mainFile.status === "success" &&
            (importData.importStatus === "in_progress" ||
              importData.importStatus === "failed")
              ? "Continue Import"
              : "Import"}
          </Button>

          <Button
            variant="outline"
            color="red"
            size="lg"
            onClick={handlePublishClick}
            className={classes.button}
          >
            Publish
          </Button>
        </Stack>
      </div>
    </PageLayout>
  );
}
