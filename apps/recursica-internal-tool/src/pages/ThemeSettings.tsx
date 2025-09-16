import { useState, useEffect } from "react";
import { usePlugin } from "../context/usePlugin";

export default function ThemeSettings() {
  const { themeSettings, updateThemeSettings, loading, error, clearError } =
    usePlugin();
  const [fileType, setFileType] = useState<string>(themeSettings.fileType);
  const [themeName, setThemeName] = useState<string>(themeSettings.themeName);

  // Update local state when context state changes
  useEffect(() => {
    setFileType(themeSettings.fileType);
    setThemeName(themeSettings.themeName);
  }, [themeSettings]);

  const handleSave = async () => {
    try {
      await updateThemeSettings(fileType, themeName);
    } catch (error) {
      console.error("Error updating theme settings:", error);
    }
  };

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFileType = e.target.value;
    setFileType(newFileType);

    // Clear theme name if file type is not "themes"
    if (newFileType !== "themes") {
      setThemeName("");
    }
  };

  if (loading.themeSettings) {
    return (
      <div>
        <h1>Theme Settings</h1>
        <p>Loading theme settings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Theme Settings</h1>
      <p>Configure file type and theme name for your project.</p>

      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            border: "1px solid #ffcdd2",
          }}
        >
          <p>{error}</p>
          <button
            onClick={clearError}
            style={{
              marginTop: "5px",
              padding: "5px 10px",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="fileType"
            style={{ display: "block", marginBottom: "5px" }}
          >
            File Type:
          </label>
          <select
            id="fileType"
            value={fileType}
            onChange={handleFileTypeChange}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "200px",
            }}
          >
            <option value="">Select file type...</option>
            <option value="themes">Themes</option>
            <option value="ui-kit">UI Kit</option>
            <option value="tokens">Tokens</option>
            <option value="icons">Icons</option>
            <option value="other">Other</option>
          </select>
        </div>

        {fileType === "themes" && (
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="themeName"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Theme Name:
            </label>
            <input
              id="themeName"
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Enter theme name..."
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minWidth: "200px",
              }}
            />
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={
            loading.operations ||
            !fileType ||
            (fileType === "themes" && !themeName)
          }
          style={{
            padding: "10px 20px",
            backgroundColor: loading.operations ? "#ccc" : "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading.operations ? "not-allowed" : "pointer",
          }}
        >
          {loading.operations ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div style={{ marginTop: "30px", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>Note:</strong> When file type is set to "themes", you must
          provide a theme name. For other file types, the theme name field will
          be hidden.
        </p>
      </div>
    </div>
  );
}
