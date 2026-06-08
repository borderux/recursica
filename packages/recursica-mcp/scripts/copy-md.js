import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "../src");
const distDir = path.resolve(__dirname, "../dist");

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyDirRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else if (stats.isFile() && src.endsWith(".md")) {
    const destDirName = path.dirname(dest);
    if (!fs.existsSync(destDirName)) {
      fs.mkdirSync(destDirName, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log("📂 Copying all markdown files from src to dist...");
copyDirRecursive(srcDir, distDir);
console.log("✅ Markdown files copied successfully!");
