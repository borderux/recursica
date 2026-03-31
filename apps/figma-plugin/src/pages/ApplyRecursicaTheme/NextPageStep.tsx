import { useNavigate } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";

import { errorCard } from "./styles";

export default function NextPageStep() {
  const navigate = useNavigate();
  const {
    pageName,
    lastCompletedPageName,
    error,
    remainingPages,
    handleProceedToNextPage,
    handleSkipAll,
  } = useApplyTheme();

  const hasMore = remainingPages.length > 0;
  const nextPage = hasMore ? remainingPages[0] : null;

  useFooterActions(
    hasMore
      ? {
          secondary: [{ label: "Cancel", onClick: handleSkipAll }],
          primary: {
            label: "Next",
            onClick: handleProceedToNextPage,
          },
        }
      : {
          primary: {
            label: "Done",
            onClick: () => navigate("/"),
          },
        },
    [hasMore, handleProceedToNextPage, handleSkipAll, navigate],
  );

  return (
    <Stack gap={16} style={{ maxWidth: 500 }}>
      <Title order={1}>Apply Recursica Theme</Title>
      <Title order={3}>
        Page Complete: {lastCompletedPageName || pageName}
      </Title>

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
          Congratulations, your theme was applied.
        </p>
      )}
    </Stack>
  );
}
