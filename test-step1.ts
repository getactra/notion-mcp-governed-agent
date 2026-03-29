import { discoverOAuthMetadata } from "./auth/metadata";
import { registerClient } from "./auth/register";

async function run() {
  console.log("Starting Step 1...");

  const server = "https://mcp.notion.com";

  console.log("Fetching metadata...");

  const metadata = await discoverOAuthMetadata(server);
  console.log("Metadata:", metadata);

  console.log("Registering client...");

  const client = await registerClient(
    metadata,
    "http://localhost:3000/callback"
  );

  console.log("Client:", client);
}

run().catch((err) => {
  console.error("ERROR:", err);
});