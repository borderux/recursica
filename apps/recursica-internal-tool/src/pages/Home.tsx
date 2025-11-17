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
            <strong>Theme Settings:</strong> Configure file type and theme name
            for your project
          </li>
          <li>
            <strong>Page Management:</strong> Export, import, and copy Figma
            pages with full structure preservation
          </li>
          <li>
            <strong>Reset Metadata:</strong> Clear all metadata from variable
            collections
          </li>
          <li>
            <strong>Used Libraries:</strong> Detect which team libraries are
            actually being used in your file
          </li>
          <li>
            <strong>GitHub profile:</strong> Link your GitHub account to push to
            a repository
          </li>
        </ul>
      </div>
    </div>
  );
}
