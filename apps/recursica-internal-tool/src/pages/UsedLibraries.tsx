import { useState } from "react";
import { usePlugin } from "../context/usePlugin";

export default function UsedLibraries() {
  const {
    detectUsedLibraries,
    usedLibraries,
    remoteComponents,
    remoteStyles,
    loading,
    error,
    clearError,
  } = usePlugin();
  const [hasScanned, setHasScanned] = useState(false);

  const handleDetect = async () => {
    setHasScanned(false);
    clearError();
    try {
      await detectUsedLibraries();
      setHasScanned(true);
    } catch (error) {
      console.error("Failed to detect libraries:", error);
    }
  };

  return (
    <div>
      <h1>Used Libraries</h1>
      <p>
        This scans your file to detect which team libraries are actually being
        used (components, styles, or variables).
      </p>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginBottom: "20px",
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

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleDetect}
          disabled={loading.operations}
          style={{
            padding: "10px 20px",
            backgroundColor: loading.operations ? "#ccc" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading.operations ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading.operations ? "Scanning..." : "Scan for Used Libraries"}
        </button>
      </div>

      {/* Results */}
      {hasScanned && !loading.operations && (
        <div>
          {usedLibraries.length === 0 &&
            remoteComponents.length === 0 &&
            remoteStyles.length === 0 && (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#e8f5e8",
                  border: "1px solid #4caf50",
                  borderRadius: "4px",
                  color: "#2e7d32",
                  marginBottom: "20px",
                }}
              >
                ✅ No library files are currently in use in this file.
              </div>
            )}

          {usedLibraries.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3>Libraries with Variables in Use</h3>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {usedLibraries.map((library, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      borderBottom:
                        index < usedLibraries.length - 1
                          ? "1px solid #ddd"
                          : "none",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "8px",
                      }}
                    >
                      {library.libraryName}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      <div>
                        Variables: {library.usedIn.variables} reference(s)
                      </div>
                      <div>
                        Components: {library.usedIn.components} reference(s)
                      </div>
                      <div>Styles: {library.usedIn.styles} reference(s)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(remoteComponents.length > 0 || remoteStyles.length > 0) && (
            <div style={{ marginBottom: "20px" }}>
              <h3>Remote Components and Styles</h3>

              {remoteComponents.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <h4 style={{ marginBottom: "8px" }}>
                    Remote Components ({remoteComponents.length})
                  </h4>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    {remoteComponents.map((component, index) => (
                      <div
                        key={component.key}
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            index < remoteComponents.length - 1
                              ? "1px solid #ddd"
                              : "none",
                          backgroundColor:
                            index % 2 === 0 ? "#f9f9f9" : "white",
                          fontSize: "14px",
                        }}
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (component.nodeIds.length > 0) {
                              // Select the first node using this component
                              parent.postMessage(
                                {
                                  pluginMessage: {
                                    type: "select-node",
                                    nodeId: component.nodeIds[0],
                                  },
                                },
                                "*",
                              );
                            }
                          }}
                          style={{
                            color: "#1976d2",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {component.name}
                        </a>
                        {component.nodeIds.length > 1 && (
                          <span
                            style={{
                              marginLeft: "8px",
                              color: "#666",
                              fontSize: "12px",
                            }}
                          >
                            ({component.nodeIds.length} instances)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {remoteStyles.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: "8px" }}>
                    Remote Styles ({remoteStyles.length})
                  </h4>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    {remoteStyles.map((style, index) => (
                      <div
                        key={style.key}
                        style={{
                          padding: "8px 12px",
                          borderBottom:
                            index < remoteStyles.length - 1
                              ? "1px solid #ddd"
                              : "none",
                          backgroundColor:
                            index % 2 === 0 ? "#f9f9f9" : "white",
                          fontSize: "14px",
                        }}
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (style.nodeIds.length > 0) {
                              // Select the first node using this style
                              parent.postMessage(
                                {
                                  pluginMessage: {
                                    type: "select-node",
                                    nodeId: style.nodeIds[0],
                                  },
                                },
                                "*",
                              );
                            }
                          }}
                          style={{
                            color: "#1976d2",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          {style.name}
                        </a>
                        <span
                          style={{
                            marginLeft: "8px",
                            color: "#666",
                            fontSize: "12px",
                          }}
                        >
                          ({style.type})
                        </span>
                        {style.nodeIds.length > 1 && (
                          <span
                            style={{
                              marginLeft: "8px",
                              color: "#666",
                              fontSize: "12px",
                            }}
                          >
                            • {style.nodeIds.length} nodes
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
