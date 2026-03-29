import { createMcpClient } from "./mcp/client";
import { getAccessToken } from "./auth/state";

async function run() {
  console.log("START STEP 4");

  const token = getAccessToken();
  console.log("Token exists:", !!token);

  if (!token) {
    throw new Error("No access token found");
  }

  console.log("Creating MCP client...");

  let client;

  try {
    client = await createMcpClient(
      "https://mcp.notion.com",
      token
    );
  } catch (err) {
    console.error("Failed to create MCP client", err);
    throw err;
  }

  console.log("Connected, listing tools...");

  try {
    const tools = await client.listTools();

    console.log("Tools response:", tools);

    if (!tools || !tools.tools || tools.tools.length === 0) {
      console.log("No tools found");
      return;
    }

    console.log("\nMCP TOOLS:\n");

    for (const t of tools.tools) {
      console.log("-", t.name);
    }
  } catch (err) {
    console.error("Failed to list tools", err);
    throw err;
  }
}

run().catch((err) => {
  console.error("FINAL ERROR:", err);
});