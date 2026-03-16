import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";
import { infoRow, labelStyle, linkStyle } from "./styles";

export default function ReviewNonRecursicaStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    nonRecursicaVars,
    nonRecursicaDecisions,
    setNonRecursicaAction,
    handleApply,
    handleFocusNode,
  } = useApplyTheme();

  // Read current index from URL search params
  const currentIndex = Math.min(
    parseInt(searchParams.get("i") ?? "0", 10) || 0,
    nonRecursicaVars.length - 1,
  );

  const handleAction = useCallback(() => {
    if (nonRecursicaVars.length === 0) return;
    const nv = nonRecursicaVars[currentIndex];
    setNonRecursicaAction(nv.variableId, "ignore");
    if (currentIndex < nonRecursicaVars.length - 1) {
      // Push a new history entry for the next item
      navigate(
        `/apply-recursica-theme/review-non-recursica?i=${currentIndex + 1}`,
      );
    } else {
      handleApply();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonRecursicaVars, currentIndex, navigate]);

  useFooterActions(
    <Button size="compact-md" onClick={handleAction}>
      Ignore
    </Button>,
    [handleAction],
  );

  if (nonRecursicaVars.length === 0) return null;
  const nv = nonRecursicaVars[currentIndex];

  // Check if a decision was already made for this item (e.g. user came back)
  const decision = nonRecursicaDecisions?.get(nv.variableId);
  const decisionLabel = decision?.action ?? null;

  return (
    <Stack gap={12}>
      <Title order={3}>
        Non-Recursica ({currentIndex + 1} of {nonRecursicaVars.length})
      </Title>
      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        This variable comes from a collection outside the Recursica theme.
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
                  backgroundColor: "#fff3e0",
                  color: "#e65100",
                  width: "fit-content",
                }}
              >
                {decisionLabel}
              </span>
            )}
          </span>
          <strong style={{ fontSize: 13 }}>{nv.variableName}</strong>
        </div>
        <div style={infoRow}>
          <span style={labelStyle}>Collection</span>
          <span>{nv.collectionName}</span>
        </div>
        <div style={{ ...infoRow, borderBottom: "none" }}>
          <span style={labelStyle}>Value</span>
          <span>{nv.variableValue}</span>
        </div>
      </div>

      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        Click a node below to highlight it on the canvas ({nv.bindings.length}{" "}
        bound node{nv.bindings.length !== 1 ? "s" : ""}):
      </p>
      <div>
        {nv.bindings.map((binding, i) => (
          <div
            key={i}
            style={{
              ...infoRow,
              borderBottom:
                i < nv.bindings.length - 1 ? "1px solid #eee" : "none",
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
