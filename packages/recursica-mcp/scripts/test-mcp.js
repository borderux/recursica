import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mcpScript = path.resolve(__dirname, "../dist/index.js");

// Standard standard rule of thumb: 1 token is approx 4 characters
function estimateTokens(text) {
  return Math.round(text.length / 4);
}

function testTool(toolName, args = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [mcpScript]);
    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    child.on("close", (code) => {
      try {
        const responseLines = stdoutData.split("\n").filter(Boolean);
        for (const line of responseLines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.id === 1) {
              resolve(parsed);
              return;
            }
          } catch (e) {
            // Not a JSON line, ignore
          }
        }
        reject(
          new Error(
            `Failed to find valid JSON response. Raw stdout: ${stdoutData}. Stderr: ${stderrData}`,
          ),
        );
      } catch (err) {
        reject(err);
      }
    });

    // Send the JSON-RPC request for calling the tool
    const request = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    };

    child.stdin.write(JSON.stringify(request) + "\n");
    child.stdin.end();
  });
}

async function runTests() {
  console.log("🚀 Starting verification tests for @recursica/mcp...");

  try {
    // Test 1: get_general_guidelines
    console.log("\n--- Test 1: get_general_guidelines (Mantine) ---");
    const guidelinesRes = await testTool("get_general_guidelines", {
      adapter: "mantine",
    });
    if (guidelinesRes.result && !guidelinesRes.error) {
      const text = guidelinesRes.result.content[0].text;
      console.log(`✅ get_general_guidelines success!`);
      console.log(
        `📊 Weight: ${text.length} characters | ~${estimateTokens(text)} tokens`,
      );
      console.log("Full Output:\n" + text + "\n");
    } else {
      console.error("❌ get_general_guidelines failed:", guidelinesRes);
    }

    // Test 2: list_components
    console.log("\n--- Test 2: list_components ---");
    const listRes = await testTool("list_components");
    if (listRes.result && !listRes.error) {
      const text = listRes.result.content[0].text;
      console.log(`✅ list_components success!`);
      console.log(
        `📊 Weight: ${text.length} characters | ~${estimateTokens(text)} tokens`,
      );
      console.log("Full Output:\n", text + "\n");
    } else {
      console.error("❌ list_components failed:", listRes);
    }

    // Test 3: get_component_doc for Accordion
    console.log("\n--- Test 3: get_component_doc (Accordion) ---");
    const docRes = await testTool("get_component_doc", {
      componentName: "Accordion",
    });
    if (docRes.result && !docRes.error) {
      const text = docRes.result.content[0].text;
      console.log(`✅ get_component_doc success!`);
      console.log(
        `📊 Weight: ${text.length} characters | ~${estimateTokens(text)} tokens`,
      );
      console.log("Full Output:\n", text + "\n");
    } else {
      console.error("❌ get_component_doc failed:", docRes);
    }

    // Test 4: recommend_component for collapse
    console.log("\n--- Test 4: recommend_component (collapse) ---");
    const recRes = await testTool("recommend_component", {
      requirement: "collapsible details list",
    });
    if (recRes.result && !recRes.error) {
      const text = recRes.result.content[0].text;
      console.log(`✅ recommend_component success!`);
      console.log(
        `📊 Weight: ${text.length} characters | ~${estimateTokens(text)} tokens`,
      );
      console.log("Full Output:\n", text + "\n");
    } else {
      console.error("❌ recommend_component failed:", recRes);
    }

    // Test 5: recommend_adapter
    console.log("\n--- Test 5: recommend_adapter ---");
    const recAdapterRes = await testTool("recommend_adapter");
    if (recAdapterRes.result && !recAdapterRes.error) {
      const text = recAdapterRes.result.content[0].text;
      console.log(`✅ recommend_adapter success!`);
      console.log(
        `📊 Weight: ${text.length} characters | ~${estimateTokens(text)} tokens`,
      );
      console.log("Full Output:\n", text + "\n");
    } else {
      console.error("❌ recommend_adapter failed:", recAdapterRes);
    }

    // Test 6: get_adapter_setup (Mantine)
    console.log("\n--- Test 6: get_adapter_setup (Mantine) ---");
    const setupRes = await testTool("get_adapter_setup", {
      adapter: "mantine",
    });
    if (setupRes.result && !setupRes.error) {
      const text = setupRes.result.content[0].text;
      console.log(`✅ get_adapter_setup success!`);
      console.log(
        `📊 Weight: ${text.length} characters | ~${estimateTokens(text)} tokens`,
      );
      console.log("Full Output:\n", text + "\n");
    } else {
      console.error("❌ get_adapter_setup failed:", setupRes);
    }

    // Test 7: recommend_adapter (explicit MUI v6)
    console.log("\n--- Test 7: recommend_adapter (explicit MUI v6) ---");
    const recExplicitRes = await testTool("recommend_adapter", {
      uiKit: "MUI",
      version: "6.0.0",
    });
    if (recExplicitRes.result && !recExplicitRes.error) {
      const text = recExplicitRes.result.content[0].text;
      console.log(`✅ recommend_adapter (explicit) success!`);
      console.log(
        `📊 Weight: ${text.length} characters | ~${estimateTokens(text)} tokens`,
      );
      console.log("Full Output:\n", text + "\n");
    } else {
      console.error("❌ recommend_adapter (explicit) failed:", recExplicitRes);
    }

    console.log("🎉 All verification tests executed successfully!");
  } catch (error) {
    console.error("💥 Verification failed with error:", error);
  }
}

runTests();
