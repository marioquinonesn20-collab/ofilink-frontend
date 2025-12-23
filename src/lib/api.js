// src/lib/api.js (FRONT) - cliente para llamar al BACKEND
const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "";
export const API_BASE = RAW_BASE.replace(/\/$/, "");

// helper fetch con error claro
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // intenta parsear JSON siempre
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { ok: false, message: text || "Respuesta no JSON" };
  }

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
