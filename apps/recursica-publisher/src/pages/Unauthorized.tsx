import { useNavigate } from "react-router";
import { PageLayout } from "../components/PageLayout";

export default function Unauthorized() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <PageLayout showBackButton={true}>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          padding: "20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
          <h1 style={{ marginBottom: "20px", color: "#c62828" }}>
            Access Denied
          </h1>
          <p
            style={{
              fontSize: "16px",
              marginBottom: "30px",
              color: "#333",
            }}
          >
            You are not authorized to publish to the recursica Figma component
            library
          </p>
          <button
            onClick={handleBack}
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
