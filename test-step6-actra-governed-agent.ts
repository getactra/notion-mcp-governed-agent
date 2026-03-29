import { createMcpClient } from "./mcp/client";
import { getAccessToken } from "./auth/state";
import {
  Actra,
  ActraRuntime,
  ActraPolicyError,
} from "@getactra/actra";

// ------------------------------------------------------------
// 1. Schema
// ------------------------------------------------------------
const schemaYaml = `
version: 1

actions:
  notion-search:
    fields:
      query: string

  notion-create-pages:
    fields:
      title: string

actor:
  fields:
    role: string

snapshot:
  fields:
    safe_mode: boolean
`;

// ------------------------------------------------------------
// 2. Policy
// ------------------------------------------------------------
const policyYaml = `
version: 1

rules:
  # Block writes in safe mode
  - id: block_writes_in_safe_mode
    scope:
      action: notion-create-pages
    when:
      subject:
        domain: snapshot
        field: safe_mode
      operator: equals
      value:
        literal: true
    effect: block

  # Block empty search
  - id: block_empty_search
    scope:
      action: notion-search
    when:
      subject:
        domain: action
        field: query
      operator: equals
      value:
        literal: ""
    effect: block
`;

async function run() {
  console.log("STEP 6 — ACTRA GOVERNED MCP AGENT");
  console.log("\n=== PROTECTED BY ACTRA 🔒 ===\n");

  const policy = await Actra.fromStrings(schemaYaml, policyYaml);
  const runtime = new ActraRuntime(policy);

  runtime.setActorResolver(() => ({
    role: "developer",
  }));

  runtime.setSnapshotResolver(() => ({
    safe_mode: false,  //Toggle safe mode for policy check
  }));

  // ------------------------------------------------------------
  // MCP setup
  // ------------------------------------------------------------
  const token = getAccessToken();

  if (!token) {
    throw new Error("No access token found");
  }

  const client = await createMcpClient(
    "https://mcp.notion.com",
    token
  );

  console.log("\nConnected to MCP\n");

  // ------------------------------------------------------------
  // Governed tools
  // ------------------------------------------------------------
  const governedSearch = runtime.admit(
    "notion-search",
    async (input: { query: string }) => {
      return await client.callTool({
        name: "notion-search",
        arguments: input,
      });
    }
  );

  const governedCreatePage = runtime.admit(
    "notion-create-pages",
    async (input: { title: string }) => {
      return await client.callTool({
        name: "notion-create-pages",
        arguments: input,
      });
    }
  );


  // ------------------------------------------------------------
  // Test
  // ------------------------------------------------------------

  console.log("\n--- Allowed call (search) ---");
  await governedSearch({ query: "project" });
  console.log("✅ Search allowed");

  console.log("\n--- Blocked call (create page in safe_mode) ---");
  try {
    await governedCreatePage({ title: "Test Page1" });
    console.log("✅ Allowed when safe mode is false");
  } catch (e) {
    if (e instanceof ActraPolicyError) {
      console.log("❌ Blocked by Actra");
      console.log("Rule:", e.matchedRule);
    } else {
      throw e;
    }
  }
}

run().catch((err) => {
  console.error("FINAL ERROR:", err);
});