export type OAuthMetadata = {
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint?: string;
};

export async function discoverOAuthMetadata(serverUrl: string) {
  const res = await fetch(
    `${serverUrl}/.well-known/oauth-authorization-server`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch OAuth metadata");
  }

  return (await res.json()) as OAuthMetadata;
}