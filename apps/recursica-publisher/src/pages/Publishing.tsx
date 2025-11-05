import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import DebugConsole from "../components/DebugConsole";

interface PublishedFile {
  name: string;
  jsonContent: string;
}

export default function Publishing() {
  const [publishedFiles] = useState<PublishedFile[]>([]);

  const handleDownload = (file: PublishedFile) => {
    try {
      const blob = new Blob([file.jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <PageLayout showBackButton={true}>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Publishing</h1>

        <DebugConsole />

        <div>
          <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "18px" }}>
            Published Files:
          </h2>
          {publishedFiles.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              No files published yet
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {publishedFiles.map((file, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    marginBottom: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{file.name}</span>
                  <button
                    onClick={() => handleDownload(file)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: "transparent",
                      color: "#d40d0d",
                      border: "1px solid #d40d0d",
                      borderRadius: "4px",
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
                    Download
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
