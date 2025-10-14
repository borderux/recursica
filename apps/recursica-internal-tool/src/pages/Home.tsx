import { useAuth } from "../context/useAuth";
import { Link } from "react-router";

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <h1>Recursica Internal Tool</h1>
      <p>Welcome to the Recursica Figma Plugin</p>

      {/* Authentication Status */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: isAuthenticated ? "#e8f5e8" : "#fff3cd",
          borderRadius: "4px",
          border: `1px solid ${isAuthenticated ? "#4caf50" : "#ffc107"}`,
        }}
      >
        {isAuthenticated ? (
          <div>
            <p style={{ margin: 0, color: "#2e7d32" }}>
              ✅ Authenticated with GitHub as{" "}
              <strong>{user?.name || "User"}</strong>
            </p>
            <button
              onClick={logout}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p style={{ margin: 0, color: "#856404" }}>
              ⚠️ Not authenticated.{" "}
              <Link to="/auth" style={{ color: "#007acc" }}>
                Login with GitHub
              </Link>{" "}
              to enable repository pushing.
            </p>
          </div>
        )}
      </div>

      <p>
        Use the navigation above to explore different sections of the plugin.
      </p>

      <div style={{ marginTop: "30px" }}>
        <h3>Available Features:</h3>
        <ul>
          <li>
            <strong>Theme Settings:</strong> Configure file type and theme name
            for your project
          </li>
          <li>
            <strong>Page Management:</strong> Export, import, and copy Figma
            pages with full structure preservation
            {isAuthenticated && (
              <span style={{ color: "#4caf50", fontSize: "14px" }}>
                {" "}
                (GitHub integration enabled)
              </span>
            )}
          </li>
          <li>
            <strong>Reset Metadata:</strong> Clear all metadata from variable
            collections
          </li>
        </ul>
      </div>
    </div>
  );
}
