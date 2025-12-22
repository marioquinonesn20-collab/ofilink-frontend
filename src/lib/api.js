const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export function getApiBase() {
  return API_BASE;
}

export async function apiGet(path) {
  if (!API_BASE) throw new Error("Falta VITE_API_BASE_URL");
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Error API");
  return json;
}

export async function apiPost(path, body) {
  if (!API_BASE) throw new Error("Falta VITE_API_BASE_URL");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Error API");
  return json;
}
