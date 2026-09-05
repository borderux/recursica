#!/usr/bin/env node
// Validates ADAPTER_STATUS.md at the repo root: confirms the `recursica:meta`
// comment and all 4 required `recursica:table` blocks (direct-mappings,
// hand-built, internal-only, unsupported) are present, matched, and each one
// is a well-formed 2-column GFM table. Wired into both the pre-commit hook
// (scripts/lint-staged.config.cjs) and CI (.github/workflows/pull-request.yml)
// so a malformed doc can't land either locally or on merge.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_PATH = join(__dirname, "..", "ADAPTER_STATUS.md");
const REQUIRED_TABLE_IDS = ["direct-mappings", "hand-built", "internal-only", "unsupported"];

function fail(message) {
  console.error(`ADAPTER_STATUS.md validation failed: ${message}`);
  process.exit(1);
}

let content;
try {
  content = readFileSync(FILE_PATH, "utf8");
} catch {
  fail(`file not found at ${FILE_PATH}`);
}

// 1. `recursica:meta` comment present with required attributes. Kit name/version
// deliberately aren't required here — that lives in this repo's own package.json,
// not duplicated in the doc.
const metaMatch = content.match(/<!--\s*recursica:meta\s+([^>]*?)-->/);
if (!metaMatch) fail("missing `<!-- recursica:meta ... -->` comment");
for (const attr of ["adapter"]) {
  if (!new RegExp(`${attr}="[^"]+"`).test(metaMatch[1])) {
    fail(`recursica:meta comment is missing required attribute \`${attr}\``);
  }
}

// 2. Every required table id present exactly once, as a matched open/close pair.
// Markers are matched only when they're the entire (trimmed) line, and fenced
// code blocks are stripped first, so an example marker inside a ``` snippet
// (e.g. this file's own explanation of the format) isn't mistaken for a real one.
const withoutFences = content.replace(/```[\s\S]*?```/g, "");
const lines = withoutFences.split("\n").map((line) => line.trim());
const openTags = lines
  .map((line) => line.match(/^<!--\s*recursica:table\s+id="([a-z-]+)"\s*-->$/))
  .filter(Boolean);
const closeCount = lines.filter((line) => /^<!--\s*\/recursica:table\s*-->$/.test(line)).length;

if (openTags.length !== closeCount) {
  fail(
    `found ${openTags.length} opening \`recursica:table\` marker(s) but ${closeCount} closing marker(s)`,
  );
}

const foundIds = openTags.map((m) => m[1]);
for (const id of REQUIRED_TABLE_IDS) {
  const count = foundIds.filter((f) => f === id).length;
  if (count === 0) fail(`missing required table id="${id}"`);
  if (count > 1) fail(`table id="${id}" appears ${count} times, expected exactly once`);
}
const unexpected = foundIds.filter((id) => !REQUIRED_TABLE_IDS.includes(id));
if (unexpected.length > 0) {
  fail(
    `unexpected table id(s): ${unexpected.join(", ")} — expected only ${REQUIRED_TABLE_IDS.join(", ")}`,
  );
}

// 3. Each table block is a well-formed 2-column GFM table (header + separator + rows).
// Escaped pipes (`\|`) are literal cell content in GFM, not column separators, so
// they're stripped before counting.
const cellCount = (row) => row.replace(/\\\|/g, "").split("|").length - 2;

for (const id of REQUIRED_TABLE_IDS) {
  const blockRe = new RegExp(
    `<!--\\s*recursica:table\\s+id="${id}"\\s*-->([\\s\\S]*?)<!--\\s*/recursica:table\\s*-->`,
  );
  const block = content.match(blockRe)[1];
  const rows = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"));

  if (rows.length < 3) {
    fail(
      `table id="${id}" needs a header, separator, and at least one data row (found ${rows.length} row(s))`,
    );
  }
  if (cellCount(rows[0]) !== 2) {
    fail(`table id="${id}" header row must have exactly 2 columns`);
  }
  if (!/^\|\s*:?-+:?\s*\|\s*:?-+:?\s*\|$/.test(rows[1])) {
    fail(`table id="${id}" separator row is malformed: ${rows[1]}`);
  }
  for (const row of rows.slice(2)) {
    if (cellCount(row) !== 2) {
      fail(`table id="${id}" has a row with the wrong column count: ${row}`);
    }
  }
}

console.log("ADAPTER_STATUS.md: all 4 required tables present and well-formed.");
