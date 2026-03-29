import { discoverOAuthMetadata } from "./auth/metadata";
import { registerClient } from "./auth/register";
import { generateCodeVerifier, generateCodeChallenge } from "./auth/pkce";
import { generateState, buildAuthorizationUrl } from "./auth/url";
import { saveAuth } from "./auth/state";

async function run() {
  console.log("Step 2: Auth URL");

  const server = "https://mcp.notion.com";
  const redirectUri = "http://localhost:3000/callback";

  const metadata = await discoverOAuthMetadata(server);
  const client = await registerClient(metadata, redirectUri);

  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = generateState();

  saveAuth({
    verifier,
    state,
    clientId: client.client_id,
  });

  const url = buildAuthorizationUrl(
    metadata,
    client.client_id,
    redirectUri,
    challenge,
    state
  );

  console.log("\nOPEN THIS URL:\n");
  console.log(url);
}

run();