import { useNavigate } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";
import { successCard, errorCard } from "./styles";

export default function NextPageStep() {
  const navigate = useNavigate();
  const {
    pageName,
    error,
    applyLog,
    remainingPages,
    handleProceedToNextPage,
    handleSkipAll,
  } = useApplyTheme();

  const hasMore = remainingPages.length > 0;
  const nextPage = hasMore ? remainingPages[0] : null;

  useFooterActions(
    hasMore ? (
      <>
        <Button size="compact-md" variant="light" onClick={handleSkipAll}>
          No, finish
        </Button>
        <Button size="compact-md" onClick={handleProceedToNextPage}>
          Yes, proceed
        </Button>
      </>
    ) : (
      <Button
        size="compact-md"
        onClick={() => navigate("/apply-recursica-theme/summary")}
      >
        View Summary
      </Button>
    ),
    [hasMore, handleProceedToNextPage, handleSkipAll, navigate],
  );

  return (
    <Stack gap={16} style={{ maxWidth: 500 }}>
      <Title order={1}>Apply Recursica Theme</Title>
      <Title order={3}>Page Complete: {pageName}</Title>

      {applyLog.length > 0 && (
        <div style={successCard}>
          {applyLog.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {error && <div style={errorCard}>{error}</div>}

      {hasMore && nextPage ? (
        <>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Would you like to proceed to the next component page?
          </p>
          <div
            style={{
              padding: 8,
              backgroundColor: "#e3f2fd",
              borderRadius: 6,
              fontSize: 14,
              color: "#1565c0",
            }}
          >
            Next: <strong>{nextPage.pageName}</strong>
            {remainingPages.length > 1 && (
              <span style={{ color: "#666" }}>
                {" "}
                (+{remainingPages.length - 1} more)
              </span>
            )}
          </div>
        </>
      ) : (
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
          No more referenced component pages to process.
        </p>
      )}
    </Stack>
  );
}
