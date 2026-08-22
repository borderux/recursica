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
    else if (args[i] === "--cleanup") options.cleanup = true;
    else if (args[i] === "--help") {
      console.log(
        "Usage: analyze-tokens [--css file.css] [--dir src/components] [--output token-analysis.json] [--cleanup]",
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

  let cssPath = options.css;
  if (!fs.existsSync(cssPath)) {
    try {
      cssPath = require.resolve(options.css, { paths: [process.cwd()] });
    } catch (e) {
      // Ignore, let the fs.existsSync check below fail
    }
  }

  console.log(`\n🔍 Recursica Token Analyzer`);
  console.log(`------------------------------`);
  console.log(`CSS Dictionary : ${cssPath}`);
  console.log(`Source Dir     : ${options.dir}`);
  console.log(`Output File    : ${options.output}\n`);

  if (!fs.existsSync(cssPath)) {
    console.error(`❌ Error: CSS file '${options.css}' not found.`);
    process.exit(1);
  }

  // 1. Extract defined generic variables (ignore auto-generated theme variants)
  const variablesFile = fs.readFileSync(cssPath, "utf-8");
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
  const exemptionLocationsMap = new Map(); // varName -> set of { componentId, filePath, line }
  const layerViolations = []; // { variable, layer, componentId, filePath, line, reason }

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

            // Layer enforcement: components must never touch the raw --recursica_tokens_*
            // primitives, and may only touch --recursica_brand_* directly when the CSS file's
            // own header explicitly exempts that variable via recursica-allow-brand. Scoped to
            // .module.css (the header-exemption model doesn't map cleanly onto .tsx files).
            if (fullPath.endsWith(".module.css")) {
              const headerEnd = content.indexOf("{");
              const header =
                headerEnd === -1 ? content : content.slice(0, headerEnd);
              const allowedBrandVars = new Set(
                [
                  ...header.matchAll(
                    /recursica-allow-brand:\s*(--recursica_brand_[\w-]+)/g,
                  ),
                ].map((h) => h[1]),
              );

              matches.forEach((m) => {
                const varName = m[1];
                const line = content.slice(0, m.index).split("\n").length;

                if (varName.startsWith("--recursica_tokens_")) {
                  layerViolations.push({
                    variable: varName,
                    layer: "tokens",
                    componentId: compId,
                    filePath: fullPath,
                    line,
                    reason:
                      "Components must never consume raw --recursica_tokens_* primitives directly, with no exemption. Route through a --recursica_ui-kit_components_* or --recursica_brand_* token instead.",
                  });
                } else if (
                  varName.startsWith("--recursica_brand_") &&
                  !allowedBrandVars.has(varName)
                ) {
                  layerViolations.push({
                    variable: varName,
                    layer: "brand",
                    componentId: compId,
                    filePath: fullPath,
                    line,
                    reason:
                      "Direct --recursica_brand_* consumption requires an explicit exemption declared in this file's header, e.g. /* recursica-allow-brand: " +
                      varName +
                      " */.",
                  });
                }
              });
            }

            // Extract inline exemptions
            const ignoredMatches = [
              ...content.matchAll(/recursica-ignore:\s*(--recursica_[\w-]+)/g),
            ];
            ignoredMatches.forEach((m) => {
              const varName = m[1];
              exemptions.add(varName);

              const line = content.slice(0, m.index).split("\n").length;
              if (!exemptionLocationsMap.has(varName))
                exemptionLocationsMap.set(varName, new Set());
              exemptionLocationsMap.get(varName).add(
                JSON.stringify({
                  variable: varName,
                  componentId: compId,
                  filePath: fullPath,
                  line,
                }),
              );
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

  // 4. Find Stale Exemptions (recursica-ignore directives pointing at variables that no
  // longer exist in the UI Kit dictionary at all, as opposed to variables that still exist
  // but are simply unused).
  const staleExemptions = [];
  exemptionLocationsMap.forEach((locSet, varName) => {
    if (!definedVars.has(varName)) {
      locSet.forEach((loc) => staleExemptions.push(JSON.parse(loc)));
    }
  });
  staleExemptions.sort(
    (a, b) => a.filePath.localeCompare(b.filePath) || a.line - b.line,
  );

  if (options.cleanup && staleExemptions.length > 0) {
    const byFile = {};
    staleExemptions.forEach((entry) => {
      if (!byFile[entry.filePath]) byFile[entry.filePath] = new Set();
      byFile[entry.filePath].add(entry.line);
    });

    Object.keys(byFile).forEach((filePath) => {
      const linesToRemove = byFile[filePath];
      const lines = fs.readFileSync(filePath, "utf-8").split("\n");
      const kept = lines.filter((_, i) => !linesToRemove.has(i + 1));
      fs.writeFileSync(filePath, kept.join("\n"));
    });

    console.log(
      `🧹 Cleaned up ${staleExemptions.length} stale recursica-ignore directive(s) across ${Object.keys(byFile).length} file(s).\n`,
    );
  }

  // 5. Find Unused Variables
  // Raw --recursica_brand_* and --recursica_tokens_* primitives are excluded entirely: components
  // are architecturally never supposed to consume these directly (they resolve down through the
  // --recursica_ui-kit_components_* layer), so they always read as "unused" regardless of how
  // complete a component is. That's noise, not signal — see layerViolations above for the actual
  // enforcement of that rule.
  const unusedVars = new Set(definedVars);
  usedVarsMap.forEach((_, varName) => unusedVars.delete(varName));
  Array.from(unusedVars).forEach((varName) => {
    if (
      varName.startsWith("--recursica_brand_") ||
      varName.startsWith("--recursica_tokens_")
    ) {
      unusedVars.delete(varName);
    }
  });

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

  // 6. Output Results
  if (layerViolations.length > 0) {
    console.error(
      `🚫 FOUND ${layerViolations.length} LAYER VIOLATION(S) — component CSS consuming --recursica_brand_*/--recursica_tokens_* without a declared exemption:\n`,
    );
    layerViolations.forEach((v) =>
      console.error(`   - ${v.filePath}:${v.line} — ${v.variable}`),
    );
    console.error(
      `\n   Check ${options.output} for details. --recursica_tokens_* has no exemption path; --recursica_brand_* requires a\n   recursica-allow-brand: <var> directive in the file's own header.\n`,
    );
  } else {
    console.log(
      `✅ No layer violations! All brand-layer consumption is explicitly exempted, tokens layer untouched.\n`,
    );
  }

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

  if (staleExemptions.length > 0) {
    const verb = options.cleanup ? "Removed" : "FOUND";
    console.warn(
      `⚠️ ${verb} ${staleExemptions.length} STALE recursica-ignore DIRECTIVE(S) — pointing at variables that no longer exist in the UI Kit.`,
    );
    if (!options.cleanup) {
      console.warn(
        `   Re-run with --cleanup to remove them automatically, or check ${options.output}.\n`,
      );
    } else {
      console.warn();
    }
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
          totalStaleExemptions: staleExemptions.length,
          totalLayerViolations: layerViolations.length,
        },
        components: componentsIndex,
        brokenComponents: Array.from(brokenComponents).sort(),
        missingVariables: missingVars,
        unusedByComponent,
        staleExemptions,
        layerViolations,
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

  if (layerViolations.length > 0) {
    console.error(`🚨 BUILD FAILED: Token analysis found layer violations.`);
    process.exit(1);
  }
}

analyze();
