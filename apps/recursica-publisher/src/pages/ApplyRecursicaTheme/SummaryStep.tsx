import { useNavigate } from "react-router";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { useFooterActions } from "../../context/FooterActionsContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";
import { successCard, errorCard } from "./styles";

export default function SummaryStep() {
  const navigate = useNavigate();
  const { error, allLogs, processedPages } = useApplyTheme();

  useFooterActions(
    <Button size="compact-md" onClick={() => navigate("/import")}>
      Done
    </Button>,
    [navigate],
  );

  return (
    <Stack gap={16} style={{ maxWidth: 500 }}>
      <Title order={1}>Apply Recursica Theme</Title>
      <Title order={3}>Operation Complete</Title>

      {processedPages.length > 0 && (
        <div style={{ fontSize: 13, color: "#666" }}>
          Pages processed: {processedPages.join(", ")}
        </div>
      )}

      {allLogs.length > 0 ? (
        <div
          style={{
            ...successCard,
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {allLogs.map((line, i) => (
            <div key={i} style={{ marginBottom: 2 }}>
              {line}
            </div>
          ))}
        </div>
      ) : (
        <div style={successCard}>No operations were needed.</div>
      )}

      {error && <div style={errorCard}>{error}</div>}
    </Stack>
  );
}
