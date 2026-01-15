import { useState } from "react";
import { formatLogsForClipboard } from "../../utils/formatLogsForClipboard";
import type { DebugConsoleMessage } from "../../plugin/services/debugConsole";
import { LoadingSpinner } from "../LoadingSpinner";
import { Alert } from "../Alert";
import { Button } from "../Button";
import { Stack } from "../Stack";
import classes from "./DebugConsole.module.css";

interface DebugConsoleProps {
  title: string;
  isActive: boolean;
  isComplete?: boolean;
  error?: string | null;
  debugLogs?: DebugConsoleMessage[];
  successMessage?: string;
}

export default function DebugConsole({
  title,
  isActive,
  isComplete = false,
  error = null,
  debugLogs,
  successMessage,
}: DebugConsoleProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLogs = async () => {
    const logsText = formatLogsForClipboard(debugLogs);
    if (!logsText) {
      alert("No logs available to copy");
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(logsText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      }

      const textArea = document.createElement("textarea");
      textArea.value = logsText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        throw new Error("execCommand('copy') failed");
      }
    } catch (err) {
      console.error("Failed to copy logs:", err);
      alert(
        "Failed to copy logs to clipboard. Please select and copy manually.",
      );
    }
  };

  const showCopyButton = isComplete || error;

  return (
    <Stack gap={16} className={classes.root}>
      {/* Activity Spinner */}
      {isActive && (
        <div className={classes.loadingContainer}>
          <LoadingSpinner size="small" />
          <p className={classes.loadingText}>{title}...</p>
        </div>
      )}

      {/* Success Message */}
      {isComplete && !error && (
        <div className={classes.successContainer}>
          <span>{successMessage || `${title} completed successfully`}</span>
          {showCopyButton && (
            <Button
              variant="filled"
              color="gray"
              size="xs"
              onClick={handleCopyLogs}
              className={
                copySuccess ? classes.copyButtonSuccess : classes.copyButton
              }
            >
              {copySuccess ? "Copied!" : "Copy Logs"}
            </Button>
          )}
        </div>
      )}

      {/* Error Area */}
      {error && (
        <Alert variant="error" className={classes.errorContainer}>
          <div className={classes.errorTitle}>{title} Failed</div>
          <div className={classes.errorMessage}>{error}</div>
          {showCopyButton && (
            <Button
              variant="filled"
              color="gray"
              size="xs"
              onClick={handleCopyLogs}
              className={
                copySuccess ? classes.copyButtonSuccess : classes.copyButton
              }
            >
              {copySuccess ? "Copied!" : "Copy Logs"}
            </Button>
          )}
        </Alert>
      )}
    </Stack>
  );
}
