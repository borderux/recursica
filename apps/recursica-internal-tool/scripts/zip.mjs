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
  parentDir + "/dev-releases/recursica-internal-tool.zip",
);
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level.
});

// listen for all archive data to be written
output.on("close", function () {
  console.log(
    `✅ Plugin packaged: recursica-internal-tool.zip (${archive.pointer()} bytes)`,
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

// finalize the archive
archive.finalize();
