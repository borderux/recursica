import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  useImportWizard,
  type VariableSummary,
} from "../../context/ImportWizardContext";
import { callPlugin } from "../../utils/callPlugin";

export default function Step3VariableCollections() {
  const navigate = useNavigate();
  const { wizardState, setWizardState } = useImportWizard();
  const [tokensChoice, setTokensChoice] = useState<"new" | "existing">(
    wizardState.variableCollections.tokens,
  );
  const [themeChoice, setThemeChoice] = useState<"new" | "existing">(
    wizardState.variableCollections.theme,
  );
  const [layersChoice, setLayersChoice] = useState<"new" | "existing">(
    wizardState.variableCollections.layers,
  );
  const [summary, setSummary] = useState<VariableSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset summary when choices change
  useEffect(() => {
    setSummary(null);
  }, [tokensChoice, themeChoice, layersChoice]);

  const handleSummarize = async () => {
    if (!wizardState.componentData.mainComponent) {
      setError("No component data available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build array of all JSON files to analyze
      const jsonFiles = [
        {
          fileName: `${wizardState.componentData.mainComponent.name}.json`,
          jsonData: wizardState.componentData.mainComponent.jsonData,
        },
        ...wizardState.componentData.dependencies.map((dep) => ({
          fileName: `${dep.name}.json`,
          jsonData: dep.jsonData,
        })),
      ];

      // Call plugin service to summarize variables
      const { promise } = callPlugin("summarizeVariablesForWizard", {
        jsonFiles,
        tokensCollection: tokensChoice,
        themeCollection: themeChoice,
        layersCollection: layersChoice,
      });

      const result = await promise;

      if (!result.success) {
        throw new Error(result.message || "Failed to summarize variables");
      }

      const responseData = result.data as {
        tokens: { existing: number; new: number };
        theme: { existing: number; new: number };
        layers: { existing: number; new: number };
      };

      const variableSummary: VariableSummary = {
        tokens: responseData.tokens,
        theme: responseData.theme,
        layers: responseData.layers,
      };

      setSummary(variableSummary);
      setWizardState((prev) => ({
        ...prev,
        variableSummary,
        variableCollections: {
          tokens: tokensChoice,
          theme: themeChoice,
          layers: layersChoice,
        },
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to summarize variables";
      setError(errorMessage);
      console.error("[Step3VariableCollections] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!summary) {
      setError("Please click Summarize first");
      return;
    }
    setWizardState((prev) => ({
      ...prev,
      currentStep: 4,
    }));
    navigate("/import-wizard/step4");
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "8px",
            marginTop: "0",
          }}
        >
          Variable Collections
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Tokens Collection */}
        <div
          style={{
            padding: "5px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <label
            style={{
              fontSize: "14px",
              fontWeight: "normal",
              flex: 1,
            }}
          >
            Should I create a new Tokens variable collection or use the existing
            one?
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "flex-start",
              flexShrink: 0,
              marginLeft: "auto",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input
                type="radio"
                checked={tokensChoice === "new"}
                onChange={() => setTokensChoice("new")}
              />
              New
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input
                type="radio"
                checked={tokensChoice === "existing"}
                onChange={() => setTokensChoice("existing")}
              />
              Existing
            </label>
          </div>
        </div>

        {/* Theme Collection */}
        <div
          style={{
            padding: "5px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <label
            style={{
              fontSize: "14px",
              fontWeight: "normal",
              flex: 1,
            }}
          >
            Should I create a new Theme variable collection or use the existing
            one?
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "flex-start",
              flexShrink: 0,
              marginLeft: "auto",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input
                type="radio"
                checked={themeChoice === "new"}
                onChange={() => setThemeChoice("new")}
              />
              New
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input
                type="radio"
                checked={themeChoice === "existing"}
                onChange={() => setThemeChoice("existing")}
              />
              Existing
            </label>
          </div>
        </div>

        {/* Layers Collection */}
        <div
          style={{
            padding: "5px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <label
            style={{
              fontSize: "14px",
              fontWeight: "normal",
              flex: 1,
            }}
          >
            Should I create a new Layers variable collection or use the existing
            one?
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "flex-start",
              flexShrink: 0,
              marginLeft: "auto",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input
                type="radio"
                checked={layersChoice === "new"}
                onChange={() => setLayersChoice("new")}
              />
              New
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input
                type="radio"
                checked={layersChoice === "existing"}
                onChange={() => setLayersChoice("existing")}
              />
              Existing
            </label>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div
          style={{
            padding: "5px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Variable Summary
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div>
              <strong>Tokens Collection:</strong>
              <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                <li>Existing variables: {summary.tokens.existing}</li>
                <li>New variables: {summary.tokens.new}</li>
              </ul>
            </div>
            <div>
              <strong>Theme Collection:</strong>
              <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                <li>Existing variables: {summary.theme.existing}</li>
                <li>New variables: {summary.theme.new}</li>
              </ul>
            </div>
            <div>
              <strong>Layers Collection:</strong>
              <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                <li>Existing variables: {summary.layers.existing}</li>
                <li>New variables: {summary.layers.new}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            color: "#c62828",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {!summary ? (
          <button
            onClick={handleSummarize}
            disabled={loading}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: loading ? "#ccc" : "#d40d0d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.opacity = "0.9";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.opacity = "1";
              }
            }}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#d40d0d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
