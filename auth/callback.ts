export function parseCallback(url: string) {
  const params = new URL(url).searchParams;

  return {
    code: params.get("code") || undefined,
    state: params.get("state") || undefined,
    error: params.get("error") || undefined,
    error_description: params.get("error_description") || undefined,
  };
}

export function validateCallback(
  callbackUrl: string,
  storedState: string
) {
  const params = parseCallback(callbackUrl);

  if (params.error) {
    throw new Error(
      `OAuth error: ${params.error} - ${
        params.error_description || "Unknown"
      }`
    );
  }

  if (params.state !== storedState) {
    throw new Error("Invalid state (CSRF)");
  }

  if (!params.code) {
    throw new Error("Missing authorization code");
  }

  return params.code;
}