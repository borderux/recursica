import React, { useState, useRef } from "react";
import PageLayout from "../components/PageLayout";

export default function Import() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".json")) {
        handleFile(file);
      } else {
        alert("Please drop a JSON file");
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".json")) {
        handleFile(file);
      } else {
        alert("Please select a JSON file");
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      console.log("Imported JSON:", jsonData);
      // TODO: Handle the imported JSON data
      // You can dispatch an action, call a service, etc.
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to read file. Please ensure it's a valid JSON file.");
    }
  };

  return (
    <PageLayout showBackButton={true}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          backgroundColor: isDragging ? "#f0f0f0" : "transparent",
          border: isDragging ? "2px dashed #d40d0d" : "2px dashed transparent",
          borderRadius: "8px",
          transition: "all 0.2s ease",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        <p
          style={{
            fontSize: "16px",
            color: "#333",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Drag-n-drop your Recursica component.json file here.
        </p>

        <button
          onClick={handleBrowseClick}
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
          Browse for file
        </button>
      </div>
    </PageLayout>
  );
}
