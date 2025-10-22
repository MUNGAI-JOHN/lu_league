// src/lib/api.ts
import { getToken } from "./auth";

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  // optionally handle global 401 -> logout, etc.
  if (res.status === 401) {
    // client-side: you may want to broadcast logout or similar
  }
  return res;
}
