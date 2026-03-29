import { createMcpClient } from "./mcp/client";
import { getAccessToken } from "./auth/state";

async function run() {
  console.log("STEP 5 — UNCONTROLLED MCP AGENT");

  const token = getAccessToken();

  if (!token) {
    throw new Error("No access token found");
  }

  const client = await createMcpClient(
    "https://mcp.notion.com",
    token
  );

  console.log("\nConnected to MCP\n");

  // --------------------------------------------------
  // Tool discovery
  // --------------------------------------------------
  const tools = await client.listTools();

  console.log("Available tools:");
  for (const t of tools.tools) {
    console.log("-", t.name);
  }

  // --------------------------------------------------
  // No policy enforcement
  // --------------------------------------------------

  console.log("\n--- Executing WITHOUT any control ---\n");
  console.log("\n=== NO POLICY ENFORCEMENT ❌ ===\n");

  //Example 1: Search (always works)
  console.log("Running: notion-search");

  const searchResult = await client.callTool({
    name: "notion-search",
    arguments: {
      query: "project",
    },
  });

  console.log("\nSearch Result:");
  console.dir(searchResult, { depth: null });


  console.log("\n⚠️ This agent can ALSO call:");
  console.log("- notion-create-pages");
  console.log("- notion-update-data-source");
  console.log("- notion-delete (if available)");

  console.log("\n⚠️ No guardrails. No policy. Full access.");
}

run().catch((err) => {
  console.error("FINAL ERROR:", err);
});