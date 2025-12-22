import React, { useEffect, useMemo, useState } from "react";

export default function Header() {
  const API_BASE = useMemo(
    () => (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, ""),
    []
  );

  const [apiOk, setApiOk] = useState(null); // null=loading, true=ok, false=down
  const [apiMsg, setApiMsg] = useState("");

  useEffect(() => {
    let alive = true;

    async function ping() {
      try {
        if (!API_BASE) throw new Error("Falta VITE_API_BASE_URL");
        const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
        const json = await res.json().catch(() => ({}));
        if (!alive) return;
        setApiOk(Boolean(json?.ok));
        setApiMsg(json?.message || "");
      } catch (e) {
        if (!alive) return;
        setApiOk(false);
        setApiMsg(e?.message || "API no disponible");
      }
    }

    ping();
    const t = setInterval(ping, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [API_BASE]);

  const statusText =
    apiOk === null ? "Conectando..." : apiOk ? "API Viva" : "API Caída";

  return (
    <header className="header-pro">
      <div>
        <div className="hd-kicker">OFILINK 2.0</div>
        <div className="hd-title">Panel de control</div>
        {!!apiMsg && <div className="hd-sub">{apiMsg}</div>}
      </div>

      <div className="hd-right">
        <span className={`badge ${apiOk ? "badge-ok" : apiOk === false ? "badge-bad" : ""}`}>
          {statusText}
        </span>

        <button className="btn btn-primary" type="button">
          Nuevo registro
        </button>
      </div>
    </header>
  );
}
