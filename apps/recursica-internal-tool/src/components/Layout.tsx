import { Outlet, Link, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <nav
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "20px",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link
              to="/"
              style={{
                textDecoration:
                  location.pathname === "/" ? "underline" : "none",
                color: location.pathname === "/" ? "#007acc" : "#333",
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/page-management"
              style={{
                textDecoration:
                  location.pathname === "/page-management"
                    ? "underline"
                    : "none",
                color:
                  location.pathname === "/page-management" ? "#007acc" : "#333",
              }}
            >
              Page Management
            </Link>
          </li>
          <li>
            <Link
              to="/reset-metadata"
              style={{
                textDecoration:
                  location.pathname === "/reset-metadata"
                    ? "underline"
                    : "none",
                color:
                  location.pathname === "/reset-metadata" ? "#d32f2f" : "#333",
              }}
            >
              Reset Metadata
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
