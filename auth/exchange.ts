export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  metadata: any,
  clientId: string,
  clientSecret: string | undefined,
  redirectUri: string
) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  if (clientSecret) {
    params.append("client_secret", clientSecret);
  }

  const res = await fetch(metadata.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}