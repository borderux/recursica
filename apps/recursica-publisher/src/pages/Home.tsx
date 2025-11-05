import React from "react";
import { useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageLayout showBackButton={false}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          width: "100%",
        }}
      >
        {/* Import Button */}
        <button
          onClick={() => navigate("/import")}
          style={{
            width: "200px",
            padding: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "transparent",
            color: "#d40d0d",
            border: "2px solid #d40d0d",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
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
          Import
        </button>

        {/* Publish Button */}
        <button
          onClick={() => navigate("/publish")}
          style={{
            width: "200px",
            padding: "20px",
            fontSize: "18px",
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
    </PageLayout>
  );
}
