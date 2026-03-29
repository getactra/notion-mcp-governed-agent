import { randomBytes } from "crypto";

export function generateState(): string {
  return randomBytes(32).toString("hex");
}

export function buildAuthorizationUrl(
  metadata: any,
  clientId: string,
  redirectUri: string,
  codeChallenge: string,
  state: string
) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
    prompt: "consent",
  });

  return `${metadata.authorization_endpoint}?${params.toString()}`;
}