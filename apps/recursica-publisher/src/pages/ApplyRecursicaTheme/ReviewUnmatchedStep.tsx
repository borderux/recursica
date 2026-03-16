import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";
import { infoRow, labelStyle, linkStyle } from "./styles";

export default function ReviewUnmatchedStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    unmatchedVars,
    nonRecursicaVars,
    unmatchedDecisions,
    setUnmatchedAction,
    globalIgnored,
    handleApply,
    handleFocusNode,
  } = useApplyTheme();

  // Read current index from URL search params
  const currentIndex = Math.min(
    parseInt(searchParams.get("i") ?? "0", 10) || 0,
    unmatchedVars.length - 1,
  );

  const handleAction = useCallback(
    (action: "ignore") => {
      if (unmatchedVars.length === 0) return;
      const uv = unmatchedVars[currentIndex];
      setUnmatchedAction(uv.variableId, action);
      if (currentIndex < unmatchedVars.length - 1) {
        // Push a new history entry for the next item
        navigate(
          `/apply-recursica-theme/review-unmatched?i=${currentIndex + 1}`,
        );
      } else {
        if (nonRecursicaVars.length > 0) {
          navigate("/apply-recursica-theme/review-non-recursica");
        } else {
          handleApply();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [unmatchedVars, currentIndex, nonRecursicaVars.length, navigate],
  );

  useFooterActions(
    <>
      <Button
        size="compact-md"
        variant="light"
        onClick={() => handleAction("ignore")}
      >
        Ignore
      </Button>
      <Button size="compact-md" disabled>
        Fix
      </Button>
    </>,
    [handleAction],
  );

  if (unmatchedVars.length === 0) return null;
  const uv = unmatchedVars[currentIndex];

  // Auto-skip items that were already ignored on a previous page
  if (globalIgnored.has(uv.variableId)) {
    handleAction("ignore");
    return null;
  }

  // Check if a decision was already made for this item (e.g. user came back)
  const decision = unmatchedDecisions.get(uv.variableId);
  const decisionLabel = decision?.action ?? null;

  return (
    <Stack gap={12}>
      <Title order={3}>
        Not Found in Theme ({currentIndex + 1} of {unmatchedVars.length})
      </Title>
      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        This bound variable is not part of the imported theme.
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
                  backgroundColor:
                    decisionLabel === "ignore" ? "#fff3e0" : "#e3f2fd",
                  color: decisionLabel === "ignore" ? "#e65100" : "#1565c0",
                  width: "fit-content",
                }}
              >
                {decisionLabel}
              </span>
            )}
          </span>
          <strong style={{ fontSize: 13 }}>{uv.variableName}</strong>
        </div>
        <div style={infoRow}>
          <span style={labelStyle}>Collection</span>
          <span>{uv.collectionName}</span>
        </div>
        <div style={{ ...infoRow, borderBottom: "none" }}>
          <span style={labelStyle}>Value</span>
          <span>{uv.variableValue}</span>
        </div>
      </div>

      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        Click a node below to highlight it on the canvas ({uv.bindings.length}{" "}
        bound node{uv.bindings.length !== 1 ? "s" : ""}):
      </p>
      <div>
        {uv.bindings.map((binding, i) => (
          <div
            key={i}
            style={{
              ...infoRow,
              borderBottom:
                i < uv.bindings.length - 1 ? "1px solid #eee" : "none",
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
