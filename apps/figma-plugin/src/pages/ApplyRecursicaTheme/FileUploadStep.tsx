import { useApplyTheme } from "../../context/ApplyThemeContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { Button } from "../../components/Button";

const FILE_NAMES = {
  tokens: "recursica_tokens.json",
  brand: "recursica_brand.json",
  uiKit: "recursica_ui-kit.json",
} as const;

export default function FileUploadStep() {
  const {
    fileInputRef,
    fileNames,
    hasFiles,
    importing,
    error,
    handleFileChange,
    handleImport,
  } = useApplyTheme();

  return (
    <Stack gap={20} style={{ maxWidth: 500 }}>
      <Title order={2}>Apply Recursica Theme</Title>
      <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
        Select one or more Recursica JSON files:{" "}
        <code>{FILE_NAMES.tokens}</code>, <code>{FILE_NAMES.brand}</code>,{" "}
        <code>{FILE_NAMES.uiKit}</code>
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        multiple
        onChange={handleFileChange}
        style={{ display: "block" }}
      />
      {hasFiles && (
        <span style={{ fontSize: 14, color: "#333" }}>
          Selected:{" "}
          {[fileNames.tokens, fileNames.brand, fileNames.uiKit]
            .filter(Boolean)
            .join(", ")}
        </span>
      )}
      <Button onClick={handleImport} disabled={!hasFiles} loading={importing}>
        {importing ? "Importing…" : "Import & Scan"}
      </Button>
      {error && (
        <div
          style={{
            padding: 12,
            backgroundColor: "#fde8e8",
            color: "#c00",
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}
    </Stack>
  );
}
