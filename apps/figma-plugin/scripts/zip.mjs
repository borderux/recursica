// require modules
import fs from 'node:fs';
import archiver from 'archiver';

import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// import packageInfo from '../package.json' with { type: "json" };
// const version = packageInfo.version;

const __dirname = dirname(fileURLToPath(import.meta.url));
const parentDir = resolve(__dirname, '..');
const releasesDir = path.join(parentDir, 'dev-releases');

// create a file to stream archive data to.
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir);
} else {
  // clear the releases directory
  fs.rmSync(releasesDir, { recursive: true });
  fs.mkdirSync(releasesDir);
}

const output = fs.createWriteStream(parentDir + `/dev-releases/recursica-plugin.zip`);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Sets the compression level.
});

archive.pipe(output);

// append files
archive.file('manifest.dev.json', { name: 'manifest.json' });
archive.file('PLUGIN.md', { name: 'README.md' });

// append files from a sub-directory
archive.directory('dist-dev/', 'dist');
// finalize the archive
archive.finalize();
