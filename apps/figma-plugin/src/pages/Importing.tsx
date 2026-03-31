import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useImportData } from "../context/ImportDataContext";

/**
 * Redirects to wizard flow - all imports must go through the wizard
 */
export default function Importing() {
  const navigate = useNavigate();
  const { importData, setImportData } = useImportData();

  useEffect(() => {
    if (
      !importData ||
      !importData.mainFile ||
      importData.mainFile.status !== "success"
    ) {
      // No import data, go to step 1
      navigate("/import-wizard/step1", { replace: true });
      return;
    }

    // If import failed, navigate to Review Import (which will show the error)
    if (importData.importStatus === "failed") {
      console.log("[Importing] Import failed, navigating to Review Import");
      navigate("/import-wizard/existing", { replace: true });
      return;
    }

    // If import is in progress, go to step 5 (importing screen)
    if (importData.importStatus === "in_progress") {
      navigate("/import-wizard/step5", { replace: true });
      return;
    }

    // If import is completed, go to home (which will show Review Import)
    if (importData.importStatus === "completed") {
      navigate("/", { replace: true });
      return;
    }

    // If import status is "pending", we've configured the import but haven't started yet
    // Navigate to step 5 to start the import
    if (importData.importStatus === "pending") {
      navigate("/import-wizard/step5", { replace: true });
      return;
    }

    // If import status is undefined, we have stale import data without proper status
    // Clear it and start fresh
    if (!importData.importStatus) {
      console.log(
        "[Importing] Found stale import data (no status), clearing and starting fresh",
      );
      setImportData(null);
      navigate("/import-wizard/step1", { replace: true });
      return;
    }
  }, [importData, navigate, setImportData]);

  return null;
}
