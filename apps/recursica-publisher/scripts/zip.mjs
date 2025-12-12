// require modules
import fs from "node:fs";
import archiver from "archiver";

import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const parentDir = resolve(__dirname, "..");
const DEV_RELEASES_DIR = "dev-releases";
const releasesDir = path.join(parentDir, DEV_RELEASES_DIR);

// create a file to stream archive data to.
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir);
} else {
  // clear the releases directory
  fs.rmSync(releasesDir, { recursive: true });
  fs.mkdirSync(releasesDir);
}

const output = fs.createWriteStream(
  parentDir + "/dev-releases/recursica-publisher.zip",
);
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level.
});

// listen for all archive data to be written
output.on("close", function () {
  console.log(
    `✅ Plugin packaged: recursica-publisher.zip (${archive.pointer()} bytes)`,
  );
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    // log warning
    console.warn(err);
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);

// append files
archive.file("manifest.json", { name: "manifest.json" });

// append files from dist directory, preserving the dist/ folder structure
archive.directory("dist/", "dist/");

// append update scripts (cross-platform)
archive.file("scripts/updater/update-dist.bat", {
  name: "scripts/update-dist.bat",
});
archive.file("scripts/updater/update-dist.ps1", {
  name: "scripts/update-dist.ps1",
});
archive.file("scripts/updater/update-dist.sh", {
  name: "scripts/update-dist.sh",
});
archive.file("scripts/updater/update-dist", { name: "scripts/update-dist" });
archive.file("scripts/updater/UPDATE-README.md", { name: "UPDATE-README.md" });

// finalize the archive
archive.finalize();
