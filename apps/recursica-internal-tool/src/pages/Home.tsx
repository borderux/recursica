export default function Home() {
  return (
    <div>
      <h1>Recursica Internal Tool</h1>
      <p>Welcome to the Recursica Figma Plugin</p>
      <p>
        Use the navigation above to explore different sections of the plugin.
      </p>

      <div style={{ marginTop: "30px" }}>
        <h3>Available Features:</h3>
        <ul>
          <li>
            <strong>Page Management:</strong> Export, import, and copy Figma
            pages with full structure preservation
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
