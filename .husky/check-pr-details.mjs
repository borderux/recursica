#!/usr/bin/env node

/**
 * Git pre-push hook script to validate AI agent PR check completion
 *
 * This script ensures that the AI agent has performed the PR check
 * before allowing a push to prevent incomplete pull requests.
 *
 * @author Recursica Team
 * @version 2.0.0
 */

import { execSync } from "child_process";

/* global console, process */

/**
 * Logs a message
 * @param {string} message - The message to log
 */
function log(message) {
  // eslint-disable-next-line no-console
  console.error(message);
}

/**
 * Gets the current git branch name
 * @returns {string} The current branch name
 * @throws {Error} If unable to get branch name
 */
function getCurrentBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
    }).trim();
  } catch (error) {
    log(`Error getting current branch: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Determines the main branch name (main or master)
 * @returns {string} The main branch name
 * @throws {Error} If neither main nor master branch exists
 */
function getMainBranch() {
  try {
    // Try main first, then master
    execSync("git rev-parse --verify origin/main", { stdio: "ignore" });
    return "main";
  } catch {
    try {
      execSync("git rev-parse --verify origin/master", { stdio: "ignore" });
      return "master";
    } catch {
      log("Could not find main or master branch");
      process.exit(1);
    }
  }
}

/**
 * Gets recent commit messages since the last push
 * @param {string} mainBranch - The main branch name
 * @returns {string[]} Array of commit messages
 */
function getRecentCommitMessages(mainBranch) {
  try {
    const commits = execSync(`git log --oneline origin/${mainBranch}..HEAD`, {
      encoding: "utf8",
    }).trim();

    if (!commits) {
      return [];
    }

    return commits.split("\n").filter(Boolean);
  } catch (error) {
    log(`Error getting commit messages: ${error.message}`);
    return [];
  }
}

/**
 * Checks if there are any commits that indicate PR creation was attempted
 * @param {string[]} commitMessages - Array of commit messages
 * @returns {boolean} True if PR creation was attempted
 */
function hasPRCreationAttempt(commitMessages) {
  const prKeywords = [
    "pr created",
    "pull request",
    "create pr",
    "npm run pr",
    "gh pr create",
    "pr:",
    "pr -",
  ];

  return commitMessages.some((commit) => {
    const message = commit.toLowerCase();
    return prKeywords.some((keyword) => message.includes(keyword));
  });
}

/**
 * Checks if there are any commits that indicate the AI agent performed analysis
 * @param {string[]} commitMessages - Array of commit messages
 * @returns {boolean} True if AI analysis was performed
 */
function hasAIAnalysis(commitMessages) {
  const aiKeywords = [
    "ai analysis",
    "pr check",
    "pull request check",
    "review changes",
    "code review",
    "pr details",
    "update pr",
  ];

  return commitMessages.some((commit) => {
    const message = commit.toLowerCase();
    return aiKeywords.some((keyword) => message.includes(keyword));
  });
}

/**
 * Main function that orchestrates the AI agent PR check validation
 */
function main() {
  const currentBranch = getCurrentBranch();
  const mainBranch = getMainBranch();

  // Skip check for main/master branch
  if (currentBranch === "main" || currentBranch === "master") {
    log("Skipping AI agent PR check for main/master branch");
    process.exit(0);
  }

  // Check if we have the remote branch available
  try {
    execSync(`git rev-parse --verify origin/${mainBranch}`, {
      stdio: "ignore",
    });
  } catch (error) {
    log("PRE-PUSH HOOK FAILED");
    log("");
    log(`Cannot access remote branch 'origin/${mainBranch}'`);
    log("");
    log("How to fix:");
    log("   1. git fetch origin");
    log("   2. Try pushing again");
    log("");
    log("Hook Details:");
    log(`   Branch: ${currentBranch}`);
    log(`   Main branch: ${mainBranch}`);
    log("");
    process.exit(1);
  }

  // Get recent commit messages
  const commitMessages = getRecentCommitMessages(mainBranch);

  if (commitMessages.length === 0) {
    log("PRE-PUSH HOOK FAILED");
    log("");
    log("No commits found since last push to main branch");
    log("");
    log("This usually means:");
    log("   1. You haven't committed your changes yet");
    log("   2. You're trying to push to the wrong branch");
    log("");
    log("How to fix:");
    log("   1. git add .");
    log("   2. git commit -m 'Your commit message'");
    log("   3. git push origin ${currentBranch}");
    log("");
    process.exit(1);
  }

  // Check if PR creation was attempted
  const hasPRCreation = hasPRCreationAttempt(commitMessages);
  const hasAnalysis = hasAIAnalysis(commitMessages);

  if (!hasPRCreation && !hasAnalysis) {
    log("PRE-PUSH HOOK FAILED");
    log("");
    log(
      `AI agent PR check has not been performed for branch: ${currentBranch}`,
    );
    log("");
    log("Required Action:");
    log("   The AI agent must perform a PR check before pushing");
    log("");
    log("How to fix:");
    log("   1. Open Cursor chat");
    log(
      "   2. Type: 'Follow the instructions found in PULL-REQUEST-CHECK.txt'",
    );
    log("   3. Let the AI agent analyze your changes and create a PR");
    log("   4. Commit any changes made by the AI agent");
    log("   5. git push origin ${currentBranch}");
    log("");
    log("Recent commits:");
    commitMessages.slice(0, 5).forEach((commit) => {
      log(`   ${commit}`);
    });
    if (commitMessages.length > 5) {
      log(`   ... and ${commitMessages.length - 5} more commits`);
    }
    log("");
    process.exit(1);
  }

  log("AI agent PR check validation passed - proceeding with push");
  process.exit(0);
}

// Execute the main function
// main();
// eslint-disable-next-line no-console
console.log("PRE-PUSH HOOK temporarily disabled for now");
