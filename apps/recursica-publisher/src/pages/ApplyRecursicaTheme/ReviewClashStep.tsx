import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";
import { infoRow, labelStyle, linkStyle, warningCard } from "./styles";

export default function ReviewClashStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    clashVars,
    unmatchedVars,
    nonRecursicaVars,
    clashDecisions,
    setClashAction,
    scanWarnings,
    handleApply,
    handleFocusNode,
  } = useApplyTheme();

  // Read current index from URL search params
  const currentIndex = Math.min(
    parseInt(searchParams.get("i") ?? "0", 10) || 0,
    clashVars.length - 1,
  );

  const handleClashAction = useCallback(
    (action: "delete") => {
      if (clashVars.length === 0) return;
      const cv = clashVars[currentIndex];
      setClashAction(cv.oldVariableId, action);
      if (currentIndex < clashVars.length - 1) {
        // Push a new history entry for the next item
        navigate(`/apply-recursica-theme/review-clash?i=${currentIndex + 1}`);
      } else {
        if (unmatchedVars.length > 0) {
          navigate("/apply-recursica-theme/review-unmatched");
        } else if (nonRecursicaVars.length > 0) {
          navigate("/apply-recursica-theme/review-non-recursica");
        } else {
          handleApply();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      clashVars,
      currentIndex,
      unmatchedVars.length,
      nonRecursicaVars.length,
      navigate,
    ],
  );

  useFooterActions(
    <>
      <Button
        size="compact-md"
        variant="light"
        onClick={() => handleClashAction("delete")}
      >
        Delete
      </Button>
      <Button size="compact-md" disabled>
        Fix
      </Button>
    </>,
    [handleClashAction],
  );

  if (clashVars.length === 0) return null;
  const cv = clashVars[currentIndex];

  // Check if a decision was already made for this item (e.g. user came back)
  const decision = clashDecisions.get(cv.oldVariableId);
  const decisionLabel = decision?.action ?? null;

  return (
    <Stack gap={12}>
      <Title order={3}>
        Reassigned ({currentIndex + 1} of {clashVars.length})
      </Title>
      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        This variable has a type mismatch. The old (incorrect) variable must be
        removed.
      </p>

      <div style={{ padding: 10, backgroundColor: "#f5f5f5", borderRadius: 6 }}>
        <div style={infoRow}>
          <span
            style={{
              ...labelStyle,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            Variable
            {decisionLabel && (
              <span
                style={{
                  display: "inline-block",
                  padding: "1px 8px",
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  backgroundColor: "#fde8e8",
                  color: "#c00",
                  width: "fit-content",
                }}
              >
                {decisionLabel}
              </span>
            )}
          </span>
          <strong style={{ fontSize: 13 }}>{cv.oldVariableName}</strong>
        </div>
        <div style={infoRow}>
          <span style={labelStyle}>Collection</span>
          <span>{cv.collectionName}</span>
        </div>
        <div style={infoRow}>
          <span style={labelStyle}>Old Type</span>
          <span>{cv.oldVariableType}</span>
        </div>
        <div style={infoRow}>
          <span style={labelStyle}>Old Value</span>
          <span>{cv.oldVariableValue}</span>
        </div>
        <div style={infoRow}>
          <span style={labelStyle}>New Type</span>
          <span>{cv.newVariableType}</span>
        </div>
        <div style={{ ...infoRow, borderBottom: "none" }}>
          <span style={labelStyle}>New Value</span>
          <span>{cv.newVariableValue}</span>
        </div>
      </div>

      {scanWarnings.length > 0 && (
        <div style={warningCard}>
          {scanWarnings.map((w, i) => (
            <div key={i} style={{ fontSize: 12 }}>
              {w}
            </div>
          ))}
        </div>
      )}

      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        Click a node below to highlight it on the canvas ({cv.bindings.length}{" "}
        bound node{cv.bindings.length !== 1 ? "s" : ""}):
      </p>
      <div>
        {cv.bindings.map((binding, i) => (
          <div
            key={i}
            style={{
              ...infoRow,
              borderBottom:
                i < cv.bindings.length - 1 ? "1px solid #eee" : "none",
            }}
          >
            <span
              style={linkStyle}
              onClick={() => handleFocusNode(binding.nodeId)}
              title={binding.nodePath}
            >
              {binding.nodePath}
            </span>
          </div>
        ))}
      </div>
    </Stack>
  );
}
