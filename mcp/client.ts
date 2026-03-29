import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function createMcpClient(
  serverUrl: string,
  accessToken: string
) {
  console.log("Creating MCP client...");
  console.log("Server URL:", serverUrl);

  const transport = new StreamableHTTPClientTransport(
    new URL(`${serverUrl}/mcp`),
    {
      requestInit: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    }
  );

  const client = new Client({
    name: "actra-agent",
    version: "1.0.0",
  });

  console.log("Connecting via HTTP...");

  try {
    await client.connect(transport);
    console.log("Connected to MCP server");
  } catch (err) {
    console.error("Connection failed", err);
    throw err;
  }

  return client;
}