import { useEffect, useState } from "react";
import { Button, setRecursica, type Recursica } from "@recursica/ui-kit-test";
import "./App.css";

// Import the recursica data
// @ts-expect-error: No type definitions for recursica.js
import recursicaData from "./recursica.js";

function App() {
  const [recursica, setRecursicaState] = useState<Recursica | null>(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Set the Recursica design system data globally
    const recursicaInstance = setRecursica(recursicaData);
    setRecursicaState(recursicaInstance);
    console.log("✅ Recursica design system initialized");
  }, []);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 Recursica Demo App</h1>
        <p>
          This app demonstrates the ui-kit-test package with real recursica.js
          data
        </p>
      </header>

      <main className="app-main">
        <section className="demo-section">
          <h2>Interactive Buttons</h2>
          <p>
            Click count: <code>{clickCount}</code>
          </p>
          <div className="button-group">
            <Button onClick={handleClick}>Click Me!</Button>
            <Button size="small" onClick={handleClick}>
              Small
            </Button>
            <Button size="large" onClick={handleClick}>
              Large
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section className="demo-section">
          <h2>Secondary Buttons</h2>
          <div className="button-group">
            <Button variant="secondary" onClick={handleClick}>
              Secondary
            </Button>
            <Button variant="secondary" size="small" onClick={handleClick}>
              Small Secondary
            </Button>
            <Button variant="secondary" size="large" onClick={handleClick}>
              Large Secondary
            </Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
          </div>
        </section>

        <section className="demo-section">
          <h2>Design Token Information</h2>
          <div className="info-box">
            {recursica && (
              <>
                <p>
                  <strong>Salmon/600 Color:</strong>{" "}
                  <code>{recursica.tokens["color/salmon/600"]}</code>
                </p>
                <p>
                  <strong>Border Radius:</strong>{" "}
                  <code>{recursica.tokens["size/border-radius/default"]}</code>
                </p>
                <p>
                  <strong>Font Family:</strong>{" "}
                  <code>{recursica.tokens["font/family/lexend"]}</code>
                </p>
                <p>
                  <strong>Font Size:</strong>{" "}
                  <code>{recursica.tokens["font/size/md"]}</code>
                </p>
                <p>
                  <strong>Font Weight:</strong>{" "}
                  <code>{recursica.tokens["font/weight/medium"]}</code>
                </p>
              </>
            )}
          </div>
        </section>

        <section className="demo-section">
          <h2>Factory System Status</h2>
          <div className="info-box">
            <p>✅ Factory initialized: {recursica ? "Yes" : "No"}</p>
            <p>
              ✅ Global storage:{" "}
              {(window as { __RECURSICA__?: Recursica }).__RECURSICA__
                ? "Available"
                : "Not available"}
            </p>
            <p>
              ✅ Token access: {recursica?.tokens ? "Working" : "Not working"}
            </p>
            <p>
              ✅ Real recursica.js:{" "}
              {recursica?.tokens?.["color/salmon/600"]
                ? "Loaded"
                : "Not loaded"}
            </p>
          </div>
        </section>

        <section className="demo-section">
          <h2>CSS Variables</h2>
          <div className="info-box">
            <p>
              The app uses CSS custom properties from the Recursica design
              system:
            </p>
            <ul>
              <li>
                Colors: <code>--color-salmon-600</code>,{" "}
                <code>--color-gray-000</code>, etc.
              </li>
              <li>
                Spacing: <code>--size-spacer-*</code>
              </li>
              <li>
                Typography: <code>--font-family-lexend</code>,{" "}
                <code>--font-size-*</code>
              </li>
              <li>
                Borders: <code>--size-border-radius-*</code>
              </li>
              <li>
                Elevation: <code>--elevation-*</code>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
