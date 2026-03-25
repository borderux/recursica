import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DebugConsole } from "../../../components/DebugConsole";
import { Button } from "../../../components/Button";
import { useImportWizard } from "../../../context/ImportWizardContext";
import { callPlugin } from "../../../utils/callPlugin";
import type { DebugConsoleMessage } from "../../../plugin/services/import-export/debugConsole";

export default function Step2MergeProgress() {
  const navigate = useNavigate();
  const { wizardState } = useImportWizard();
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [importDebugLogs, setImportDebugLogs] = useState<
    DebugConsoleMessage[] | undefined
  >(undefined);

  useEffect(() => {
    // Only start merge if we haven't already started/completed and we have choices
    if (isImporting || isComplete || importError) return;

    const startMerge = async () => {
      try {
        setIsImporting(true);
        setImportError(null);

        const { promise } = callPlugin("mergeImportGroup", {
          componentChoices: wizardState.componentMergeChoices,
        });

        const result = await promise;

        if (!result.success) {
          const errorMsg = result.message || "Merge failed";
          setImportError(errorMsg);
          if (result.data?.debugLogs) {
            setImportDebugLogs(result.data.debugLogs as DebugConsoleMessage[]);
          }
        } else {
          if (result.data?.debugLogs) {
            setImportDebugLogs(result.data.debugLogs as DebugConsoleMessage[]);
          }
          setIsComplete(true);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start merge";
        setImportError(errorMessage);
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
            setImportDebugLogs(errorResponse.data.debugLogs);
          }
        }
      } finally {
        setIsImporting(false);
      }
    };

    startMerge();
  }, [wizardState.componentMergeChoices, isImporting, isComplete, importError]);

  const handleDone = () => {
    navigate("/import-wizard/existing");
  };

  const componentName = wizardState.selectedComponent?.name || "import group";

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
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
        Merging Dependencies
      </h1>

      <DebugConsole
        title="Merging Components"
        isActive={isImporting}
        isComplete={isComplete}
        error={importError}
        debugLogs={importDebugLogs}
        successMessage={`Merge complete: ${componentName}`}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <Button onClick={handleDone} disabled={isImporting}>
          Done
        </Button>
      </div>
    </div>
  );
}
