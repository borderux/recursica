import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";
import { VariableInput } from "../../components/VariableInput";
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
    variablePaths,
    variableTypeMap,
    fixSelections,
    setFixSelection,
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

  const handleFix = useCallback(() => {
    if (nonRecursicaVars.length === 0) return;
    const nv = nonRecursicaVars[currentIndex];
    const selectedPath = fixSelections.get(nv.variableId);
    if (!selectedPath) return;
    // For now, treat fix the same as a navigation action
    // TODO: Wire up the actual remap logic
    if (currentIndex < nonRecursicaVars.length - 1) {
      navigate(
        `/apply-recursica-theme/review-non-recursica?i=${currentIndex + 1}`,
      );
    } else {
      handleApply();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonRecursicaVars, currentIndex, fixSelections, navigate]);

  // Check if fix is available for current item
  const currentVarId = nonRecursicaVars[currentIndex]?.variableId;
  const hasFixSelection = currentVarId
    ? fixSelections.has(currentVarId)
    : false;

  useFooterActions(
    <>
      <Button size="compact-md" variant="light" onClick={handleAction}>
        Ignore
      </Button>
      <Button size="compact-md" disabled={!hasFixSelection} onClick={handleFix}>
        Fix
      </Button>
    </>,
    [handleAction, handleFix, hasFixSelection],
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

      {variablePaths.length > 0 && (
        <div
          style={{
            padding: 10,
            backgroundColor: "#e3f2fd",
            borderRadius: 6,
          }}
        >
          <p style={{ margin: "0 0 8px", color: "#1565c0", fontSize: 12 }}>
            To fix this issue, use the input below to select a replacement
            variable from the theme.
          </p>
          <VariableInput
            key={nv.variableId}
            variablePaths={variablePaths}
            typeMap={variableTypeMap}
            typeFilter={nv.variableType}
            value={fixSelections.get(nv.variableId)}
            onChange={(val) => setFixSelection(nv.variableId, val)}
            placeholder="Search theme variables…"
          />
        </div>
      )}

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
