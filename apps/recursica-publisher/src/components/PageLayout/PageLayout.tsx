import React from "react";
import { useNavigate } from "react-router";
import packageJson from "../../../package.json";
import { useAuth } from "../../context/useAuth";
import { Button } from "../Button";
import { Badge } from "../Badge";
import classes from "./PageLayout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function PageLayout({
  children,
  showBackButton = false,
  onBack,
}: PageLayoutProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate("/auth");
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleLogoClick = () => {
    navigate("/admin");
  };

  return (
    <div className={classes.root}>
      {/* Main Content */}
      <main className={classes.main}>{children}</main>

      {/* Footer */}
      <footer className={classes.footer}>
        {showBackButton ? (
          <Button
            variant="subtle"
            size="sm"
            onClick={handleBackClick}
            className={classes.backButton}
            aria-label="Back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        ) : (
          <div className={classes.spacer} />
        )}

        {/* Logo in center */}
        <div className={classes.logoContainer} onClick={handleLogoClick}>
          <svg
            width="32"
            height="22"
            viewBox="0 0 64.04 43.03"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.logo}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.73689 0C1.22535 0 0 1.23486 0 2.75813V40.2687C0 41.792 1.22535 43.0269 2.73689 43.0269H61.3063C62.8178 43.0269 64.0431 41.792 64.0431 40.2687V2.75813C64.0431 1.23486 62.8178 0 61.3063 0H2.73689ZM4.10533 38.8628C4.10533 20.1314 18.8106 4.86124 37.2217 4.1372V38.8628H4.10533ZM45.4323 38.8628C42.4092 38.8628 39.9585 36.3931 39.9585 33.3465H45.4323V38.8628ZM59.8947 24.2447H39.9585V4.15383C50.6584 4.836 59.2177 13.4618 59.8947 24.2447ZM59.8674 27.0028C59.2296 33.2132 54.3317 38.1491 48.1692 38.7918V27.0028H59.8674ZM43.5165 27.0297C41.5515 27.0297 39.9585 28.635 39.9585 30.6153H43.5165V27.0297Z"
            />
          </svg>
        </div>

        {/* GitHub Login/Logout and Version on right */}
        <div className={classes.footerRight}>
          {/* GitHub Login/Logout */}
          <Button
            variant="subtle"
            onClick={handleAuthClick}
            className={classes.authButton}
          >
            {/* GitHub Logo SVG */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            <span>{isAuthenticated ? "Logout" : "Login"}</span>
          </Button>

          {/* Version */}
          <Badge variant="version" className={classes.version}>
            v{packageJson.version}
          </Badge>
        </div>
      </footer>
    </div>
  );
}
