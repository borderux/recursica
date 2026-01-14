import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { callPlugin } from "../../utils/callPlugin";
import type { PrimaryImportMetadata } from "../../plugin/services/singleComponentImportService";
import type { ImportSummaryData } from "../../plugin/services/getImportSummary";
import {
  Title,
  Text,
  Stack,
  Button,
  Alert,
  LoadingSpinner,
  Card,
} from "../../components";
import classes from "./ExistingImport.module.css";

export default function ExistingImport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PrimaryImportMetadata | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummaryData | null>(
    null,
  );

  const fetchImportSummary = useCallback(async () => {
    try {
      const { promise } = callPlugin("getImportSummary", {});
      const result = await promise;
      if (result.success && result.data) {
        const data = result.data as { summary: ImportSummaryData };
        setImportSummary(data.summary);
      }
    } catch (err) {
      console.error("[ExistingImport] Failed to fetch import summary:", err);
    }
  }, []);

  useEffect(() => {
    const loadExistingImport = async () => {
      try {
        const { promise } = callPlugin("checkForExistingPrimaryImport", {});
        const response = await promise;

        if (response.success && response.data) {
          const data = response.data as {
            exists: boolean;
            pageId?: string;
            metadata?: PrimaryImportMetadata;
          };

          if (data.exists && data.metadata && data.pageId) {
            setMetadata(data.metadata);
            setPageId(data.pageId);
            // Fetch import summary
            fetchImportSummary();
          } else {
            // No existing import, go to step 1
            navigate("/import-wizard/step1");
          }
        } else {
          navigate("/import-wizard/step1");
        }
      } catch (err) {
        console.error("Error loading existing import:", err);
        navigate("/import-wizard/step1");
      }
    };

    loadExistingImport();
  }, [navigate, fetchImportSummary]);

  const handleDelete = async () => {
    if (!pageId) {
      setError("Page ID not available");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this import? This will remove all imported pages and collections created",
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { promise } = callPlugin("deleteImportGroup", { pageId });
      const result = await promise;

      if (result.success) {
        // Navigate back to step 1
        navigate("/import-wizard/step1");
      } else {
        setError(result.message || "Failed to delete import group");
        setLoading(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete import group";
      setError(errorMessage);
      setLoading(false);
      console.error("[ExistingImport] Error:", err);
    }
  };

  if (!metadata) {
    return (
      <Stack gap="md" align="center" className={classes.loadingContainer}>
        <LoadingSpinner />
        <Text className={classes.loadingText}>Loading existing import...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" className={classes.root}>
      <div className={classes.header}>
        <Title order={1} mb="xs">
          Import Review
        </Title>
        <Text variant="small" className={classes.componentInfo}>
          Component: {metadata.componentName} (Version:{" "}
          {metadata.componentVersion})
        </Text>
      </div>

      {/* Import Error Display */}
      {metadata.importError && (
        <Alert variant="error">
          <Text fw={600} mb="xs">
            Import Failed
          </Text>
          <Text>{metadata.importError}</Text>
        </Alert>
      )}

      {/* Error guidance text */}
      {metadata.importError && (
        <Text variant="body" className={classes.errorGuidance}>
          The import could not be completed. Please review the error above and
          consider canceling this import to start over.
        </Text>
      )}

      {/* Import Summary Table */}
      {importSummary && (
        <>
          {!metadata.importError && (
            <Text variant="body" className={classes.reviewText}>
              Please review all pages created as part of the import. If you
              confirm they look good, Merge them into your file to proceed, or
              press Cancel to stop this import.
            </Text>
          )}
          <Card className={classes.summaryCard}>
            <div className={classes.summaryHeader}>
              <Title order={3}>Import Summary</Title>
            </div>
            <table className={classes.summaryTable}>
              <thead className={classes.summaryTableHeader}>
                <tr>
                  <th className={classes.summaryTableHeaderCell}>Category</th>
                  <th className={classes.summaryTableHeaderCell}>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className={`${classes.summaryTableBodyCell} ${classes.summaryTableBodyCellLabel}`}
                  >
                    Pages Created
                  </td>
                  <td className={classes.summaryTableBodyCell}>
                    {importSummary.pagesCreated.length === 0 ? (
                      <span className={classes.summaryTableBodyCellEmpty}>
                        None
                      </span>
                    ) : (
                      <ul className={classes.summaryList}>
                        {importSummary.pagesCreated.map((page) => (
                          <li
                            key={page.pageId}
                            className={classes.summaryListItem}
                          >
                            {page.pageName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    className={`${classes.summaryTableBodyCell} ${classes.summaryTableBodyCellLabel}`}
                  >
                    Pages Existing
                  </td>
                  <td className={classes.summaryTableBodyCell}>
                    {importSummary.pagesExisting.length === 0 ? (
                      <span className={classes.summaryTableBodyCellEmpty}>
                        None
                      </span>
                    ) : (
                      <ul className={classes.summaryList}>
                        {importSummary.pagesExisting.map((page) => (
                          <li
                            key={page.pageId}
                            className={classes.summaryListItem}
                          >
                            {page.pageName} ({page.componentPage})
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    className={`${classes.summaryTableBodyCell} ${classes.summaryTableBodyCellLabel}`}
                  >
                    New Variables
                  </td>
                  <td className={classes.summaryTableBodyCell}>
                    {importSummary.totalVariablesCreated}
                  </td>
                </tr>
                <tr>
                  <td
                    className={`${classes.summaryTableBodyCell} ${classes.summaryTableBodyCellLabel}`}
                  >
                    New Styles
                  </td>
                  <td className={classes.summaryTableBodyCell}>
                    {importSummary.totalStylesCreated}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      <div className={classes.actions}>
        <Button onClick={handleDelete} disabled={loading}>
          {loading ? "Cancelling..." : "Cancel"}
        </Button>
        {!metadata.importError && (
          <Button
            variant="filled"
            onClick={() => navigate("/import-wizard/merge/step1")}
            disabled={loading}
          >
            Merge
          </Button>
        )}
      </div>
    </Stack>
  );
}
