import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import { callPlugin } from "../utils/callPlugin";
import type { ComponentMetadata } from "../plugin/services/getComponentMetadata";

export default function Publish() {
  const [metadata, setMetadata] = useState<ComponentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [componentName, setComponentName] = useState<string>("");
  const [currentPageIndex, setCurrentPageIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        const { promise } = callPlugin("getComponentMetadata", {});
        const response = await promise;
        if (response.success && response.data) {
          const responseData = response.data as {
            componentMetadata: ComponentMetadata;
            currentPageIndex: number;
          };
          const metadata = responseData.componentMetadata;
          setComponentName(metadata.name);
          // Check if metadata is actually published (has an id and publishDate)
          const isPublished = metadata.id && metadata.publishDate;
          setMetadata(isPublished ? metadata : null);
          // Set the current page index from the response
          setCurrentPageIndex(responseData.currentPageIndex);
        } else {
          setMetadata(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load component metadata",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  return (
    <PageLayout showBackButton={true}>
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {loading && <p>Loading component metadata...</p>}

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: "4px",
              color: "#c62828",
            }}
          >
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {metadata && metadata.id && metadata.publishDate ? (
              <div>
                <h1>Publishing</h1>
                <h2 style={{ marginTop: "20px", fontSize: "18px" }}>
                  Component Metadata
                </h2>
                <div style={{ marginTop: "20px" }}>
                  <p>
                    <strong>Component ID:</strong> {metadata.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {metadata.name}
                  </p>
                  <p>
                    <strong>Version:</strong> {metadata.version}
                  </p>
                  <p>
                    <strong>Publish Date:</strong>{" "}
                    {new Date(metadata.publishDate).toLocaleString()}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "30px",
                  }}
                >
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
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (currentPageIndex !== null) {
                        navigate(`/publishing?pageIndex=${currentPageIndex}`);
                      } else {
                        // Fallback: navigate without pageIndex (will show error)
                        navigate("/publishing");
                      }
                    }}
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
                    Publish
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1>Publishing</h1>
                {componentName && (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      marginBottom: "10px",
                    }}
                  >
                    Page: <strong>{componentName}</strong>
                  </p>
                )}
                <p style={{ textAlign: "center", fontSize: "16px" }}>
                  It appears the current page has never been published. Would
                  you like to publish it?
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >
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
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (currentPageIndex !== null) {
                        navigate(`/publishing?pageIndex=${currentPageIndex}`);
                      } else {
                        // Fallback: navigate without pageIndex (will show error)
                        navigate("/publishing");
                      }
                    }}
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
                    Ok
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
