const { relative } = require("path");

module.exports = {
  // 1. For all non-JS/TS files, just format them
  "*.{json,md,css,scss}": ["prettier --write"],

  // 2. For JS/TS files, run prettier, eslint on files, and tsc/test on affected packages
  "*.{js,jsx,ts,tsx}": (files) => {
    const filesByPkg = {};
    const packageDirs = new Set();
    const cwd = process.cwd();

    for (const file of files) {
      // Find the closest package or app directory, fallback to root
      const match = file.match(/^(.*?\/(?:apps|packages)\/[^\/]+)\//);
      const pkg = match ? match[1] : cwd;

      if (!filesByPkg[pkg]) filesByPkg[pkg] = [];
      filesByPkg[pkg].push(file);
      packageDirs.add(pkg);
    }

    const commands = [];

    // a) Format the files directly
    commands.push(`prettier --write ${files.join(" ")}`);

    // b) Lint the files by cd-ing into their respective package to ensure correct config resolution
    for (const [pkg, pkgFiles] of Object.entries(filesByPkg)) {
      const relativeFiles = pkgFiles.map((f) => relative(pkg, f));
      // Using npx ensures we find eslint even after changing directories
      commands.push(`cd ${pkg} && npx eslint --fix ${relativeFiles.join(" ")}`);
    }

    // c) Run check-types and test on the affected packages using turbo filters
    const filters = Array.from(packageDirs).map((dir) => {
      const relDir = relative(cwd, dir);
      return relDir ? `--filter={./${relDir}}` : "--filter={.}";
    });

    if (filters.length > 0) {
      commands.push(`npx turbo run check-types test ${filters.join(" ")}`);
    }

    return commands;
  },
};
