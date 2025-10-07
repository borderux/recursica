import { processAdapter } from "../shared/common";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
  console.log("🧪 Testing General Adapter...\n");

  const testOutputPath = path.join(__dirname, "output");

  // Clean up previous test output
  if (fs.existsSync(testOutputPath)) {
    console.log("🧹 Cleaning previous test output...");
    fs.rmSync(testOutputPath, { recursive: true });
  }
  fs.mkdirSync(testOutputPath, { recursive: true });

  try {
    // Read the actual recursica-bundle.json
    const bundlePath = path.join(__dirname, "test-recursica-bundle.json");
    if (!fs.existsSync(bundlePath)) {
      throw new Error(
        "recursica-bundle.json not found. Please ensure it exists in the package root.",
      );
    }

    const bundledJsonContent = fs.readFileSync(bundlePath, "utf-8");
    const bundledJson = JSON.parse(bundledJsonContent);

    console.log(`📊 Loaded bundle with:`);
    console.log(`  - ${Object.keys(bundledJson.tokens || {}).length} tokens`);
    console.log(`  - ${Object.keys(bundledJson.themes || {}).length} themes`);
    console.log(
      `  - ${Object.keys(bundledJson.uiKit || {}).length} UI Kit items\n`,
    );

    // Process the adapter
    const result = processAdapter({
      rootPath: "",
      bundledJsonContent,
      project: "Recursica",
      overrides: undefined,
      srcPath: testOutputPath,
      iconsJsonContent: undefined, // No icons for this test
      iconsConfig: undefined,
    });

    console.log(
      `✅ Adapter processed successfully! Generated ${result.length} files.\n`,
    );

    // Write files and analyze content
    for (const file of result) {
      const fullPath = path.join(testOutputPath, file.filename);

      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(fullPath, file.content);

      // Analyze file content
      analyzeFile(file);
    }

    console.log("\n🎉 All files generated successfully!");
    console.log("\n📁 Generated file structure:");
    listGeneratedFiles(testOutputPath);

    // Show sample content
    console.log("\n📄 Sample content from generated files:");
    showSampleContent(testOutputPath);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

function analyzeFile(file: { filename: string; content: string }) {
  const lines = file.content.split("\n").length;
  const size = file.content.length;

  console.log(`📄 ${file.filename}`);
  console.log(`   Size: ${size} bytes, Lines: ${lines}`);

  if (file.filename === "recursica-tokens.css") {
    const variableCount = (file.content.match(/--[^:]+:/g) || []).length;
    console.log(`   CSS Variables: ${variableCount}`);
  } else if (file.filename === "recursica.css") {
    const variableCount = (file.content.match(/--[^:]+:/g) || []).length;
    console.log(`   UI Kit Variables: ${variableCount}`);
  } else if (file.filename === "recursica.js") {
    const hasTokens = file.content.includes("tokens:");
    const hasUiKit = file.content.includes("uiKit:");
    const hasThemes = file.content.includes("themes:");
    console.log(
      `   JavaScript Object (tokens: ${hasTokens ? "✓" : "✗"}, uiKit: ${hasUiKit ? "✓" : "✗"}, themes: ${hasThemes ? "✓" : "✗"})`,
    );
  } else if (file.filename === "recursica.d.ts") {
    const typeCount = (file.content.match(/export type/g) || []).length;
    console.log(`   TypeScript Types (${typeCount} type definitions)`);
  } else if (file.filename.endsWith("-theme.css")) {
    const variableCount = (file.content.match(/--[^:]+:/g) || []).length;
    const themeName = file.filename.replace("-theme.css", "");
    console.log(`   Theme Variables: ${variableCount} (${themeName} theme)`);
  }
}

function listGeneratedFiles(outputPath: string) {
  const files = fs.readdirSync(outputPath);
  for (const file of files) {
    const filePath = path.join(outputPath, file);
    const stats = fs.statSync(filePath);
    console.log(`📄 ${file} (${stats.size} bytes)`);
  }
}

function showSampleContent(outputPath: string) {
  const files = fs.readdirSync(outputPath);

  // Show sample from recursica-tokens.css
  const tokensFile = path.join(outputPath, "recursica-tokens.css");
  if (fs.existsSync(tokensFile)) {
    const content = fs.readFileSync(tokensFile, "utf-8");
    console.log("\n🔍 recursica-tokens.css (first 10 lines):");
    console.log("──────────────────────────────────────────────────");
    console.log(content.split("\n").slice(0, 10).join("\n"));
    console.log(
      "   ... and " + (content.split("\n").length - 10) + " more lines",
    );
  }

  // Show sample from recursica.css
  const uiKitFile = path.join(outputPath, "recursica.css");
  if (fs.existsSync(uiKitFile)) {
    const content = fs.readFileSync(uiKitFile, "utf-8");
    console.log("\n🔍 recursica.css (first 10 lines):");
    console.log("──────────────────────────────────────────────────");
    console.log(content.split("\n").slice(0, 10).join("\n"));
    console.log(
      "   ... and " + (content.split("\n").length - 10) + " more lines",
    );
  }

  // Show theme files
  const themeFiles = files.filter((file) => file.endsWith(".theme.css"));
  if (themeFiles.length > 0) {
    console.log("\n🎨 Theme files found:", themeFiles.join(", "));

    const firstThemeFile = path.join(outputPath, themeFiles[0]);
    if (fs.existsSync(firstThemeFile)) {
      const content = fs.readFileSync(firstThemeFile, "utf-8");
      console.log(`\n🔍 ${themeFiles[0]} (first 8 lines):`);
      console.log("──────────────────────────────────────────────────");
      console.log(content.split("\n").slice(0, 8).join("\n"));
      console.log(
        "   ... and " + (content.split("\n").length - 8) + " more lines",
      );
    }
  }
}

// Run the test
test().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});
