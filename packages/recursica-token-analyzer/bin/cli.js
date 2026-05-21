#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    css: "recursica_variables_scoped.css",
    dir: "src/components",
    output: "token-analysis.json",
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--css") options.css = args[++i];
    else if (args[i] === "--dir") options.dir = args[++i];
    else if (args[i] === "--output") options.output = args[++i];
    else if (args[i] === "--help") {
      console.log(
        "Usage: analyze-tokens [--css file.css] [--dir src/components] [--output token-analysis.json]",
      );
      process.exit(0);
    }
  }
  return options;
}

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function analyze() {
  const options = parseArgs();

  console.log(`\n🔍 Recursica Token Analyzer`);
  console.log(`------------------------------`);
  console.log(`CSS Dictionary : ${options.css}`);
  console.log(`Source Dir     : ${options.dir}`);
  console.log(`Output File    : ${options.output}\n`);

  if (!fs.existsSync(options.css)) {
    console.error(`❌ Error: CSS file '${options.css}' not found.`);
    process.exit(1);
  }

  // 1. Extract defined generic variables (ignore auto-generated theme variants)
  const variablesFile = fs.readFileSync(options.css, "utf-8");
  const definedVars = new Set();
  [...variablesFile.matchAll(/(--recursica_[\w-]+)\s*:/g)].forEach((m) => {
    const v = m[1];
    if (!v.includes("_themes_")) {
      definedVars.add(v);
    }
  });

  // 2. Build Component Index & Extract Usage
  const componentsIndex = {};
  const usedVarsMap = new Map(); // varName -> set of { componentId, filePath }
  let exemptions = new Set();

  if (fs.existsSync(options.dir)) {
    const dirs = fs
      .readdirSync(options.dir)
      .filter((f) => fs.statSync(path.join(options.dir, f)).isDirectory());

    dirs.forEach((compName) => {
      const compId = compName.toLowerCase();
      const compDir = path.join(options.dir, compName);

      componentsIndex[compId] = {
        name: compName,
        tokenPrefix: toKebabCase(compName),
        directory: compDir,
        files: [],
      };

      function walkAndExtract(dirPath) {
        fs.readdirSync(dirPath).forEach((f) => {
          const fullPath = path.join(dirPath, f);
          if (fs.statSync(fullPath).isDirectory()) {
            walkAndExtract(fullPath);
          } else if (
            fullPath.endsWith(".module.css") ||
            fullPath.endsWith(".tsx") ||
            fullPath.endsWith(".ts")
          ) {
            componentsIndex[compId].files.push(fullPath);
            const content = fs.readFileSync(fullPath, "utf-8");

            // Extract variable usages
            const matches = [
              ...content.matchAll(/var\(\s*(--recursica_[\w-]+)/g),
            ];
            matches.forEach((m) => {
              const varName = m[1];
              if (!usedVarsMap.has(varName))
                usedVarsMap.set(varName, new Set());
              // Use JSON.stringify to ensure Set uniqueness based on contents
              usedVarsMap
                .get(varName)
                .add(
                  JSON.stringify({ componentId: compId, filePath: fullPath }),
                );
            });

            // Extract inline exemptions
            const ignoredMatches = [
              ...content.matchAll(/recursica-ignore:\s*(--recursica_[\w-]+)/g),
            ];
            ignoredMatches.forEach((m) => {
              exemptions.add(m[1]);
            });
          }
        });
      }

      walkAndExtract(compDir);
    });
  }

  // 3. Find Missing Variables
  const missingVars = [];
  const brokenComponents = new Set();

  usedVarsMap.forEach((usageSet, varName) => {
    if (!definedVars.has(varName)) {
      const parsedUsage = Array.from(usageSet).map((s) => JSON.parse(s));

      // Group files by componentId for this missing variable
      const byComp = {};
      parsedUsage.forEach((u) => {
        if (!byComp[u.componentId]) byComp[u.componentId] = [];
        byComp[u.componentId].push(u.filePath);
      });

      Object.keys(byComp).forEach((compId) => {
        brokenComponents.add(compId);
        missingVars.push({
          variable: varName,
          componentId: compId,
          files: byComp[compId],
        });
      });
    }
  });

  // 4. Find Unused Variables
  const unusedVars = new Set(definedVars);
  usedVarsMap.forEach((_, varName) => unusedVars.delete(varName));

  const unusedByComponent = {};

  // Create reverse lookup for tokenPrefix -> componentId
  const prefixToCompId = {};
  Object.keys(componentsIndex).forEach((id) => {
    prefixToCompId[componentsIndex[id].tokenPrefix] = id;
  });

  unusedVars.forEach((varName) => {
    if (exemptions.has(varName)) {
      unusedVars.delete(varName);
      return;
    }

    const match = varName.match(/ui-kit_components_([a-z-]+)_/);
    if (match) {
      const prefix = match[1];
      const compId = prefixToCompId[prefix] || prefix; // Fallback to raw prefix if no component exists yet
      if (!unusedByComponent[compId]) unusedByComponent[compId] = [];
      unusedByComponent[compId].push(varName);
    }
  });

  // 5. Output Results
  if (missingVars.length > 0) {
    console.error(`❌ FOUND ${missingVars.length} BROKEN VARIABLE REFERENCES!`);
    console.error(
      `   These components will fail to build or render incorrectly:\n`,
    );
    Array.from(brokenComponents).forEach((comp) =>
      console.error(`   - ${comp}`),
    );
    console.error(
      `\n   Check ${options.output} for the full stack trace of missing variables.\n`,
    );
  } else {
    console.log(
      `✅ No broken variables found! All references map to the UI Kit.\n`,
    );
  }

  const newComponents = Object.keys(unusedByComponent).length;
  if (unusedVars.size > 0) {
    console.warn(
      `⚠️ WARNING: FOUND ${unusedVars.size} UNUSED VARIABLES grouped across ${newComponents} component definitions.`,
    );
    console.warn(
      `   Review ${options.output} to identify the unmapped Figma features.\n`,
    );
  } else {
    console.log(
      `✅ No unmapped Figma features! All tokens are accounted for or exempted.\n`,
    );
  }

  fs.writeFileSync(
    options.output,
    JSON.stringify(
      {
        $schema: "node_modules/@recursica/token-analyzer/schema.json",
        summary: {
          totalDefined: definedVars.size,
          totalUsed: usedVarsMap.size,
          totalMissing: missingVars.length,
          totalUnused: unusedVars.size,
        },
        components: componentsIndex,
        brokenComponents: Array.from(brokenComponents).sort(),
        missingVariables: missingVars,
        unusedByComponent,
      },
      null,
      2,
    ),
  );

  console.log(`💾 Analysis written to ${options.output}\n`);

  if (missingVars.length > 0) {
    console.error(`🚨 BUILD FAILED: Token analysis found missing variables.`);
    process.exit(1);
  }
}

analyze();
