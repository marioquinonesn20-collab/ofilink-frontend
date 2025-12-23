import React, { useMemo, useState } from "react";

export default function Compliance() {
  const API_BASE = useMemo(() => {
    const raw = import.meta.env.VITE_API_BASE_URL || "";
    return raw.replace(/\/$/, "");
  }, []);

  const [companyId, setCompanyId] = useState("contax");
  const [topic, setTopic] = useState("Materialidad / expediente");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState(null);

  async function run() {
    setLoading(true);
    setOut(null);

    try {
      if (!API_BASE) throw new Error("Falta VITE_API_BASE_URL en Vercel/ENV");

      const res = await fetch(`${API_BASE}/api/aiconta/compliance/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          topic,
          notes,
          requestedAt: new Date().toISOString(),
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.message || `HTTP ${res.status}`);
      }

      setOut(json);
    } catch (e) {
      setOut({ ok: false, message: e?.message || "Error" });
    } finally {
      setLoading(false);
    }
  }

  const badge = out?.result?.overall || "gray";

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="hd-kicker">AI CONTA · CumpleBot</div>
          <div className="page-title">Fiscal Shield</div>
          <div className="page-sub">
            Materialidad, 69-B (EFOS/EDOS), contratos, evidencias, beneficiario controlador y alertas.
          </div>
          {!API_BASE && (
            <div className="warn">
              ⚠️ Falta configurar <b>VITE_API_BASE_URL</b> en Vercel (Production + Preview).
            </div>
          )}
        </div>

        <span className={`pill pill-${badge}`}>
          {badge === "green"
            ? "Verde"
            : badge === "yellow"
            ? "Amarillo"
            : badge === "red"
            ? "Rojo"
            : "—"}
        </span>
      </div>

      <div className="card pro-card">
        <div className="form-grid">
          <label className="f">
            <span>Empresa</span>
            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
              <option value="contax">CONTAX SOLUTIONS AND BUSINESS ADMINISTRATION SAS DE CV</option>
            </select>
          </label>

          <label className="f">
            <span>Tema</span>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} />
          </label>

          <label className="f f-full">
            <span>Notas / contexto</span>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: contrato anual, facturación mensual, evidencia de prestación, entregables, etc."
            />
          </label>

          <div className="f f-full">
            <button className="btn btn-primary" onClick={run} disabled={loading || !API_BASE}>
              {loading ? "Analizando..." : "Analizar Compliance"}
            </button>
          </div>
        </div>
      </div>

      {out && (
        <div className="card pro-card" style={{ marginTop: 14 }}>
          <div className="card-title">Resultado</div>
          {!out.ok && <div className="warn">⚠️ {out.message}</div>}
          <pre className="json">{JSON.stringify(out, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
