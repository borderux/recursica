import { Outlet, Link, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div
      style={{
        padding: isHomePage ? "0" : "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {!isHomePage && (
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
                    location.pathname === "/page-management"
                      ? "#007acc"
                      : "#333",
                }}
              >
                Page Management
              </Link>
            </li>
            <li>
              <Link
                to="/auth"
                style={{
                  textDecoration:
                    location.pathname === "/auth" ? "underline" : "none",
                  color: location.pathname === "/auth" ? "#007acc" : "#333",
                }}
              >
                GitHub
              </Link>
            </li>
          </ul>
        </nav>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
