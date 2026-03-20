import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { infoRow, labelStyle, linkStyle } from "./styles";

export default function ReviewTextStylesStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    nonRecursicaTextStyles,
    nonRecursicaEffectStyles,
    availableTextStyles,
    textStyleDecisions,
    setTextStyleAction,
    clashVars, // Note: We will dynamically prune these later!
    unmatchedVars,
    nonRecursicaVars,
    handleApply,
    handleFocusNode,
  } = useApplyTheme();

  // Read current index from URL search params
  const currentIndex = Math.min(
    parseInt(searchParams.get("i") ?? "0", 10) || 0,
    Math.max(0, nonRecursicaTextStyles.length - 1),
  );

  const proceedNext = useCallback(() => {
    // Determine what array to go to next
    if (nonRecursicaEffectStyles.length > 0) {
      navigate("/apply-recursica-theme/review-effect-styles");
    } else if (clashVars.length > 0) {
      navigate("/apply-recursica-theme/review-clash");
    } else if (unmatchedVars.length > 0) {
      navigate("/apply-recursica-theme/review-unmatched");
    } else if (nonRecursicaVars.length > 0) {
      navigate("/apply-recursica-theme/review-non-recursica");
    } else {
      handleApply();
    }
  }, [
    navigate,
    nonRecursicaEffectStyles.length,
    clashVars.length,
    unmatchedVars.length,
    nonRecursicaVars.length,
    handleApply,
  ]);

  const handleAction = useCallback(
    (action: "ignore" | "map", mappedStyleId?: string) => {
      if (nonRecursicaTextStyles.length === 0) return;
      const ts = nonRecursicaTextStyles[currentIndex];
      setTextStyleAction(ts.styleId, action, mappedStyleId);

      if (currentIndex < nonRecursicaTextStyles.length - 1) {
        navigate(
          `/apply-recursica-theme/review-text-styles?i=${currentIndex + 1}`,
        );
      } else {
        proceedNext();
      }
    },
    [
      nonRecursicaTextStyles,
      currentIndex,
      navigate,
      setTextStyleAction,
      proceedNext,
    ],
  );

  const currentTs = nonRecursicaTextStyles[currentIndex];
  const decision = currentTs
    ? textStyleDecisions?.get(currentTs.styleId)
    : null;
  const decisionMappedId = decision?.mappedStyleId;

  useFooterActions(
    <>
      <Button
        size="compact-md"
        variant="light"
        onClick={() => handleAction("ignore")}
      >
        Ignore
      </Button>
      <Button
        size="compact-md"
        disabled={!decisionMappedId && decision?.action !== "map"}
        onClick={() => handleAction("map", decisionMappedId)}
      >
        Next
      </Button>
    </>,
    [handleAction, decisionMappedId, decision?.action],
  );

  if (nonRecursicaTextStyles.length === 0) return null;

  return (
    <Stack gap={12}>
      <Title order={3}>
        Legacy Text Styles ({currentIndex + 1} of{" "}
        {nonRecursicaTextStyles.length})
      </Title>
      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        This text style does not belong to the Recursica framework. Mapping it
        will replace it across all bound nodes.
      </p>

      <div style={{ padding: 10, backgroundColor: "#f5f5f5", borderRadius: 6 }}>
        <div style={{ ...infoRow, borderBottom: "none" }}>
          <span style={labelStyle}>Style Name</span>
          <strong style={{ fontSize: 13 }}>{currentTs.styleName}</strong>
        </div>
      </div>

      <div
        style={{
          padding: 10,
          backgroundColor: "#e3f2fd",
          borderRadius: 6,
        }}
      >
        <p style={{ margin: "0 0 8px", color: "#1565c0", fontSize: 12 }}>
          Select a Recursica replacement below.
        </p>
        <Select
          data={availableTextStyles.map((s) => ({
            value: s.id,
            label: s.name,
          }))}
          value={decisionMappedId || null}
          onChange={(val) => {
            setTextStyleAction(
              currentTs.styleId,
              val ? "map" : "ignore",
              val || undefined,
            );
          }}
          placeholder="(None selected)"
        />
      </div>

      <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
        Click a node below to highlight it on the canvas (
        {currentTs.bindings.length} bound node
        {currentTs.bindings.length !== 1 ? "s" : ""}):
      </p>
      <div>
        {currentTs.bindings.map((binding, i) => (
          <div
            key={i}
            style={{
              ...infoRow,
              borderBottom:
                i < currentTs.bindings.length - 1 ? "1px solid #eee" : "none",
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
