import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";
import { infoRow, labelStyle, warningCard } from "./styles";

export default function OverviewStep() {
  const navigate = useNavigate();
  const {
    pageName,
    clashVars,
    unmatchedVars,
    nonRecursicaVars,
    remainingPages,
    scanWarnings,
    handleApply,
  } = useApplyTheme();

  const handleNext = useCallback(() => {
    if (clashVars.length > 0) {
      navigate("/apply-recursica-theme/review-clash");
    } else if (unmatchedVars.length > 0) {
      navigate("/apply-recursica-theme/review-unmatched");
    } else if (nonRecursicaVars.length > 0) {
      navigate("/apply-recursica-theme/review-non-recursica");
    } else {
      handleApply();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clashVars.length,
    unmatchedVars.length,
    nonRecursicaVars.length,
    navigate,
  ]);

  useFooterActions(
    <>
      <Button
        size="compact-md"
        variant="light"
        onClick={() => navigate("/import")}
      >
        Cancel
      </Button>
      <Button size="compact-md" onClick={handleNext}>
        Next →
      </Button>
    </>,
    [handleNext, navigate],
  );

  return (
    <Stack gap={12}>
      <Title order={3}>Variable Issues Found</Title>
      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        We scanned <strong>{pageName}</strong> and found variable binding issues
        that need your attention.
      </p>

      <div style={{ padding: 10, backgroundColor: "#f5f5f5", borderRadius: 6 }}>
        <div style={infoRow}>
          <span style={labelStyle}>Variables not found in Theme</span>
          <strong>{unmatchedVars.length}</strong>
        </div>
        <div style={infoRow}>
          <span style={labelStyle}>Non-Recursica Variables</span>
          <strong>{nonRecursicaVars.length}</strong>
        </div>
        <div
          style={
            clashVars.length > 0
              ? infoRow
              : { ...infoRow, borderBottom: "none" }
          }
        >
          <span style={labelStyle}>Dependent pages</span>
          <strong>{remainingPages.length}</strong>
        </div>
        {clashVars.length > 0 && (
          <div style={{ ...infoRow, borderBottom: "none" }}>
            <span style={labelStyle}>Reassigned</span>
            <strong>{clashVars.length}</strong>
          </div>
        )}
      </div>

      {clashVars.length > 0 && (
        <p style={{ margin: 0, color: "#666", fontSize: 11 }}>
          Reassigned variables have a name collision with an imported variable
          of a different type. You will be asked to delete the old variable for
          each.
        </p>
      )}

      {unmatchedVars.length > 0 && (
        <p style={{ margin: 0, color: "#666", fontSize: 11 }}>
          Variables not found in the theme are bound on this page but missing
          from the imported theme. You can choose to ignore each one.
        </p>
      )}

      {nonRecursicaVars.length > 0 && (
        <p style={{ margin: 0, color: "#666", fontSize: 11 }}>
          Non-Recursica variables come from collections outside the Recursica
          theme. You can choose to ignore each one.
        </p>
      )}

      {scanWarnings.length > 0 && (
        <div style={warningCard}>
          {scanWarnings.map((w, i) => (
            <div key={i} style={{ fontSize: 12 }}>
              {w}
            </div>
          ))}
        </div>
      )}
    </Stack>
  );
}
