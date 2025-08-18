#!/usr/bin/env node

const { execSync } = require("child_process");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function main() {
  const args = process.argv.slice(2);
  const prTitle = args.find((arg) => arg.startsWith("--title="))?.split("=")[1];

  if (!prTitle) {
    log(
      'Usage: node scripts/commit-pr-check.js --title="Your PR Title"',
      "yellow",
    );
    log(
      'Example: node scripts/commit-pr-check.js --title="Fix login bug"',
      "cyan",
    );
    process.exit(1);
  }

  try {
    // Check if there are any staged changes
    const stagedChanges = execSync("git diff --cached --name-only", {
      encoding: "utf8",
    }).trim();

    if (!stagedChanges) {
      log("No staged changes to commit", "yellow");
      log(
        "This script is meant to be run after the AI agent has completed its PR check",
        "yellow",
      );
      process.exit(0);
    }

    // Create commit message
    const commitMessage = `AI agent PR check completed - PR created with title: ${prTitle}`;

    // Commit the changes
    execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

    log("✅ PR check work committed successfully!", "green");
    log(`Commit message: ${commitMessage}`, "blue");
  } catch (error) {
    log("❌ Failed to commit PR check work", "red");
    log("Error: " + error.message, "red");
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
