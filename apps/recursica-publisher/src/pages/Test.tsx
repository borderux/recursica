import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { DebugConsole } from "../components/DebugConsole";
import { callPlugin } from "../utils/callPlugin";
import type { DebugConsoleMessage } from "../plugin/services/debugConsole";

export default function Test() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);
  const [allTests, setAllTests] = useState<
    Array<{
      name: string;
      success: boolean;
      message: string;
      details?: Record<string, unknown>;
    }>
  >([]);
  const [debugLogs, setDebugLogs] = useState<DebugConsoleMessage[] | undefined>(
    undefined,
  );

  const testTitle = "itemSpacing Variable Binding Test (Issue #1)";

  // Run test when component mounts
  useEffect(() => {
    let isMounted = true;

    const runTest = async () => {
      try {
        setIsRunning(true);
        setError(null);
        setTestResults(null);
        setDebugLogs(undefined);

        const { promise } = callPlugin("runTest", {});
        const response = await promise;

        if (!isMounted) {
          return;
        }

        if (response.success && response.data) {
          const data = response.data as {
            testResults: {
              success: boolean;
              message: string;
              details?: Record<string, unknown>;
            };
            allTests?: Array<{
              name: string;
              success: boolean;
              message: string;
              details?: Record<string, unknown>;
            }>;
            debugLogs?: DebugConsoleMessage[];
          };
          setTestResults(data.testResults);
          if (data.allTests) {
            setAllTests(data.allTests);
          }
          if (data.debugLogs) {
            setDebugLogs(data.debugLogs);
          }
        } else {
          setError(
            response.message || "Test failed. Please check the debug console.",
          );
          // Extract debug logs from error response if available
          if (response.data?.debugLogs) {
            setDebugLogs(response.data.debugLogs as DebugConsoleMessage[]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to run test");
        }
      } finally {
        if (isMounted) {
          setIsRunning(false);
        }
      }
    };

    runTest();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageLayout showBackButton={true}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Test</h1>
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "normal",
            color: "#666",
          }}
        >
          {testTitle}
        </h2>

        <DebugConsole
          title="Test Output"
          isActive={isRunning}
          isComplete={!isRunning && testResults !== null && !error}
          error={error}
          debugLogs={debugLogs}
        />

        <div style={{ marginTop: "20px" }}>
          {isRunning ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #e0e0e0",
                  borderTop: "2px solid #666",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "#666", fontStyle: "italic", margin: 0 }}>
                Running test...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#ffebee",
                border: "1px solid #c62828",
                borderRadius: "4px",
                marginBottom: "12px",
              }}
            >
              <p
                style={{
                  color: "#c62828",
                  fontStyle: "italic",
                  margin: 0,
                  fontWeight: "bold",
                }}
              >
                Error: {error}
              </p>
            </div>
          ) : testResults ? (
            <div>
              {/* Overall Summary */}
              <div
                style={{
                  padding: "12px",
                  backgroundColor: testResults.success ? "#e8f5e9" : "#fff3e0",
                  border: `1px solid ${
                    testResults.success ? "#4caf50" : "#ff9800"
                  }`,
                  borderRadius: "4px",
                  marginBottom: "12px",
                }}
              >
                <p
                  style={{
                    color: testResults.success ? "#2e7d32" : "#e65100",
                    margin: "0 0 8px 0",
                    fontWeight: "bold",
                  }}
                >
                  {testResults.success
                    ? "✓ All Tests Completed"
                    : "✗ Some Tests Failed"}
                </p>
                <p
                  style={{
                    color: "#666",
                    margin: "0 0 8px 0",
                    fontSize: "14px",
                  }}
                >
                  {testResults.message}
                </p>
                {testResults.details &&
                  "summary" in testResults.details &&
                  typeof testResults.details.summary === "object" &&
                  testResults.details.summary !== null && (
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 8px 0",
                        fontSize: "12px",
                      }}
                    >
                      Total:{" "}
                      {String(
                        (testResults.details.summary as Record<string, unknown>)
                          .total || 0,
                      )}{" "}
                      | Passed:{" "}
                      {String(
                        (testResults.details.summary as Record<string, unknown>)
                          .passed || 0,
                      )}{" "}
                      | Failed:{" "}
                      {String(
                        (testResults.details.summary as Record<string, unknown>)
                          .failed || 0,
                      )}
                    </p>
                  )}
                {testResults.details && (
                  <details
                    style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}
                    >
                      View Full Details
                    </summary>
                    <pre
                      style={{
                        margin: "8px 0 0 0",
                        padding: "8px",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        overflow: "auto",
                        fontSize: "11px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {JSON.stringify(testResults.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>

              {/* Individual Test Results */}
              {allTests.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Individual Test Results:
                  </h3>
                  {allTests.map((test, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px",
                        backgroundColor: test.success ? "#f1f8f4" : "#fff8f0",
                        border: `1px solid ${
                          test.success ? "#a5d6a7" : "#ffcc80"
                        }`,
                        borderRadius: "4px",
                        marginBottom: "8px",
                      }}
                    >
                      <p
                        style={{
                          color: test.success ? "#2e7d32" : "#e65100",
                          margin: "0 0 4px 0",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {test.success ? "✓" : "✗"} {test.name}
                      </p>
                      <p
                        style={{
                          color: "#666",
                          margin: "0 0 4px 0",
                          fontSize: "12px",
                        }}
                      >
                        {test.message}
                      </p>
                      {test.details && (
                        <details
                          style={{
                            marginTop: "4px",
                            fontSize: "11px",
                            color: "#666",
                          }}
                        >
                          <summary
                            style={{
                              cursor: "pointer",
                              fontWeight: "bold",
                              marginBottom: "2px",
                            }}
                          >
                            View Details
                          </summary>
                          <pre
                            style={{
                              margin: "4px 0 0 0",
                              padding: "6px",
                              backgroundColor: "#f5f5f5",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              overflow: "auto",
                              fontSize: "10px",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "transparent",
              color: "#d40d0d",
              border: "2px solid #d40d0d",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#d40d0d";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#d40d0d";
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
