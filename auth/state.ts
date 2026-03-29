import fs from "fs";

const FILE = ".auth.json";

export function saveAuth(data: any) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function loadAuth() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

export function saveTokens(tokens: any) {
  const data = loadAuth();
  data.tokens = tokens;
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function getAccessToken() {
  const data = loadAuth();
  return data.tokens?.access_token;
}