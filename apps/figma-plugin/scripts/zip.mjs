// require modules
import fs from 'node:fs';
import archiver from 'archiver';

import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// import packageInfo from '../package.json' with { type: "json" };
// const version = packageInfo.version;

const __dirname = dirname(fileURLToPath(import.meta.url));
const parentDir = resolve(__dirname, '..');
const DEV_RELEASES_DIR = 'dev-releases';
const releasesDir = path.join(parentDir, DEV_RELEASES_DIR);

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

// append update scripts (cross-platform)
archive.file('scripts/updater/update-dist.bat', { name: 'scripts/update-dist.bat' });
archive.file('scripts/updater/update-dist.ps1', { name: 'scripts/update-dist.ps1' });
archive.file('scripts/updater/update-dist.sh', { name: 'scripts/update-dist.sh' });
archive.file('scripts/updater/update-dist', { name: 'scripts/update-dist' });
archive.file('scripts/updater/UPDATE-README.md', { name: 'UPDATE-README.md' });

// finalize the archive
archive.finalize();
