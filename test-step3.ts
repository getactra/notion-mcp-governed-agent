import { discoverOAuthMetadata } from "./auth/metadata";
import { loadAuth, saveTokens } from "./auth/state";
import { validateCallback } from "./auth/callback";
import { exchangeCodeForTokens } from "./auth/exchange";

async function run() {
  console.log("Step 3: Exchange Token");

  const callbackUrl = process.argv[2];

  if (!callbackUrl) {
    throw new Error("Provide callback URL");
  }

  const auth = loadAuth();

  const metadata = await discoverOAuthMetadata(
    "https://mcp.notion.com"
  );

  const code = validateCallback(callbackUrl, auth.state);

  const tokens = await exchangeCodeForTokens(
    code,
    auth.verifier,
    metadata,
    auth.clientId,
    undefined,
    "http://localhost:3000/callback"
  );

  console.log("\nTOKENS:\n", tokens);

  saveTokens(tokens);
}

run().catch(console.error);