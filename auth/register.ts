import { OAuthMetadata } from "./metadata";

export async function registerClient(
  metadata: OAuthMetadata,
  redirectUri: string
) {
  if (!metadata.registration_endpoint) {
    throw new Error("No registration endpoint");
  }

  const res = await fetch(metadata.registration_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_name: "Actra MCP Client",
      redirect_uris: [redirectUri],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}