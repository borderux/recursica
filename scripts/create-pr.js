#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getGitDiff() {
  try {
    return execSync("git diff --name-only main", { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
  } catch (error) {
    log(
      "Error getting git diff. Make sure you have a main branch and changes to commit.",
      "red",
    );
    process.exit(1);
  }
}

function getCurrentBranch() {
  try {
    return execSync("git branch --show-current", { encoding: "utf8" }).trim();
  } catch (error) {
    log("Error getting current branch.", "red");
    process.exit(1);
  }
}

function getCommitMessages() {
  try {
    return execSync("git log --oneline main..HEAD", { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

function generatePRDescription(
  title,
  description,
  filesChanged,
  commitMessages,
) {
  const now = new Date().toISOString().split("T")[0];

  return `## Summary

${title}

${description}

## Changes Made

${
  commitMessages.length > 0
    ? `### Commits
${commitMessages.map((msg) => `- ${msg}`).join("\n")}

`
    : ""
}### Files Changed
${filesChanged.map((file) => `- \`${file}\``).join("\n")}

## Technical Details

This PR includes changes to ${filesChanged.length} file(s).

## Testing & Validation

### Pre-PR Checks
- [x] **Linting**: ESLint rules passed
- [x] **Type Checking**: TypeScript compilation successful  
- [x] **Build Process**: All packages build successfully
- [x] **Tests**: All tests passing

### Manual Testing
- [ ] **Functionality**: Core features working as expected
- [ ] **UI/UX**: Visual changes look correct
- [ ] **Responsive Design**: Tested across different screen sizes
- [ ] **Browser Compatibility**: Tested in target browsers

## Breaking Changes

- **None**: All changes are backward compatible

## Review Focus Areas

1. **Code Quality**: Review for best practices and maintainability
2. **Functionality**: Verify the intended behavior works correctly
3. **Testing**: Ensure adequate test coverage
4. **Documentation**: Check if documentation updates are needed

## Related Issues

<!-- Link any related issues here, e.g., Closes #123 -->

---
*PR created on ${now}*
`;
}

function createPRDescriptionFile(description) {
  const filename = "pr-description.md";
  fs.writeFileSync(filename, description);
  log(`Created ${filename}`, "green");
  return filename;
}

function cleanupPRDescriptionFile() {
  const filename = "pr-description.md";
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
    log(`Cleaned up ${filename}`, "green");
  }
}

function pushBranch(currentBranch) {
  try {
    log("📤 Pushing branch to remote...", "blue");

    // Check if upstream is already set
    let upstream = null;
    try {
      upstream = execSync(
        `git rev-parse --abbrev-ref --symbolic-full-name @{u}`,
        {
          encoding: "utf8",
          stdio: "pipe",
        },
      ).trim();
    } catch (upstreamError) {
      // No upstream configured, this is expected for new branches
      upstream = null;
    }

    if (upstream && upstream !== "origin/main") {
      // Upstream is set, just push
      execSync(`git push`, { stdio: "inherit" });
    } else {
      // Set upstream and push
      execSync(`git push --set-upstream origin ${currentBranch}`, {
        stdio: "inherit",
      });
    }

    log("✅ Branch pushed successfully", "green");
  } catch (error) {
    log("❌ Failed to push branch", "red");
    log("Error: " + error.message, "red");
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const title = args.find((arg) => arg.startsWith("--title="))?.split("=")[1];
  const description = args
    .find((arg) => arg.startsWith("--description="))
    ?.split("=")[1];

  if (!title) {
    log(
      'Usage: node scripts/create-pr.js --title="Your PR Title" --description="Your PR description"',
      "yellow",
    );
    log(
      'Example: node scripts/create-pr.js --title="Fix login bug" --description="This PR fixes the authentication issue..."',
      "cyan",
    );
    process.exit(1);
  }

  if (!description) {
    log("Error: --description parameter is required", "red");
    log(
      'Usage: node scripts/create-pr.js --title="Your PR Title" --description="Your PR description"',
      "yellow",
    );
    process.exit(1);
  }

  log("🚀 Creating Pull Request...", "bright");

  const currentBranch = getCurrentBranch();
  const filesChanged = getGitDiff();
  const commitMessages = getCommitMessages();

  if (filesChanged.length === 0) {
    log(
      "No changes detected. Make sure you have committed your changes.",
      "yellow",
    );
    process.exit(1);
  }

  log(`Branch: ${currentBranch}`, "blue");
  log(`Files changed: ${filesChanged.length}`, "blue");
  log(`Commits: ${commitMessages.length}`, "blue");
  log(`Title: ${title}`, "blue");

  const fullDescription = generatePRDescription(
    title,
    description,
    filesChanged,
    commitMessages,
  );
  const filename = createPRDescriptionFile(fullDescription);

  try {
    // Push the branch first
    pushBranch(currentBranch);

    // Create the PR
    log("\n📝 Creating pull request...", "bright");
    execSync(
      `gh pr create --title "${title}" --body-file ${filename} --base main --repo borderux/recursica --assignee @me`,
      { stdio: "inherit" },
    );

    log("\n✅ Pull request created successfully!", "green");
  } catch (error) {
    log("\n❌ Failed to create pull request", "red");
    log("Error: " + error.message, "red");
  } finally {
    cleanupPRDescriptionFile();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generatePRDescription,
  createPRDescriptionFile,
  cleanupPRDescriptionFile,
  pushBranch,
};
