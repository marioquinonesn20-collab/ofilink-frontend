import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";

function nowIso() {
  return new Date().toISOString();
}

function labelOverall(overall) {
  if (overall === "green") return "Verde · Cumple";
  if (overall === "yellow") return "Amarillo · Revisar";
  if (overall === "red") return "Rojo · Incumplimiento";
  return "—";
}

function labelSeverity(sev) {
  if (sev === "high") return "ALTA";
  if (sev === "medium") return "MEDIA";
  if (sev === "low") return "BAJA";
  return (sev || "").toString().toUpperCase();
}

function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

export default function Compliance() {
  const API_BASE = useMemo(
    () => (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, ""),
    []
  );

  const [companyId, setCompanyId] = useState("contax");
  const [topic, setTopic] = useState("Materialidad / expediente");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState(null);

  async function run() {
    setLoading(true);
    setOut(null);
    try {
      const res = await fetch(`${API_BASE}/api/aiconta/compliance/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          companyId,
          topic,
          notes,
          requestedAt: nowIso(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      setOut(json);
    } catch (e) {
      setOut({ ok: false, message: e?.message || "Error" });
    } finally {
      setLoading(false);
    }
  }

  const overall = out?.result?.overall || "gray";
  const findings = Array.isArray(out?.result?.findings) ? out.result.findings : [];
  const summary = out?.result?.summary || "";
  const citations = Array.isArray(out?.result?.citations) ? out.result.citations : [];

  const prettyText = useMemo(() => {
    if (!out) return "";
    if (out?.ok !== true) return `ERROR: ${out?.message || "No disponible"}`;

    const lines = [];
    lines.push(`FISCAL SHIELD · RESULTADO`);
    lines.push(`Empresa: ${companyId}`);
    lines.push(`Tema: ${topic}`);
    lines.push(`Fecha: ${new Date().toLocaleString()}`);
    lines.push(`Semáforo: ${labelOverall(overall)}`);
    lines.push("");
    lines.push(`Resumen: ${safeString(summary)}`);
    lines.push("");

    if (findings.length === 0) {
      lines.push("Hallazgos: (sin hallazgos)");
    } else {
      lines.push(`Hallazgos (${findings.length}):`);
      findings.forEach((f, idx) => {
        lines.push(`${idx + 1}) ${safeString(f.title)} [${labelSeverity(f.severity)}] (${safeString(f.code)})`);
        if (f.detail) lines.push(`   - Detalle: ${safeString(f.detail)}`);
        if (Array.isArray(f.suggestedNext) && f.suggestedNext.length) {
          lines.push(`   - Siguiente:`);
          f.suggestedNext.forEach((s) => lines.push(`     • ${safeString(s)}`));
        }
        lines.push("");
      });
    }

    if (citations.length) {
      lines.push("Citas / Referencias:");
      citations.forEach((c) => lines.push(`- ${safeString(c)}`));
    }

    return lines.join("\n");
  }, [out, companyId, topic, overall, summary, findings, citations]);

  function downloadJson() {
    const blob = new Blob([JSON.stringify(out ?? {}, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fiscal-shield-${companyId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(prettyText || "");
      alert("Copiado ✅");
    } catch {
      alert("No se pudo copiar (permiso del navegador).");
    }
  }

  function exportPdf() {
    if (!out) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("FISCAL SHIELD · Reporte", margin, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const text = prettyText || "";
    const lines = doc.splitTextToSize(text, maxWidth);

    let y = 90;
    const lineHeight = 14;

    for (let i = 0; i < lines.length; i++) {
      if (y > 800) {
        doc.addPage();
        y = 60;
      }
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }

    doc.save(`fiscal-shield-${companyId}-${Date.now()}.pdf`);
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="page-head">
        <div>
          <div className="hd-kicker">AI CONTA · CumpleBot</div>
          <div className="page-title">Fiscal Shield</div>
          <div className="page-sub">
            Materialidad, 69-B (EFOS/EDOS), contratos, evidencias, beneficiario controlador y alertas.
          </div>
        </div>

        <span className={`pill pill-${overall}`}>
          {labelOverall(overall)}
        </span>
      </div>

      {/* Form */}
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

          <div className="f f-full" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={run} disabled={loading || !API_BASE}>
              {loading ? "Analizando..." : "Analizar Compliance"}
            </button>

            <button className="btn" type="button" onClick={copyToClipboard} disabled={!out}>
              Copiar
            </button>

            <button className="btn" type="button" onClick={downloadJson} disabled={!out}>
              Descargar JSON
            </button>

            <button className="btn" type="button" onClick={exportPdf} disabled={!out}>
              Exportar PDF
            </button>
          </div>

          {!API_BASE && (
            <div className="f f-full" style={{ color: "#ffb4b4", fontSize: 12 }}>
              Falta VITE_API_BASE_URL en Vercel / .env
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {out && out.ok === false && (
        <div className="card pro-card" style={{ marginTop: 14, borderColor: "rgba(255,80,80,.35)" }}>
          <div className="card-title">Error</div>
          <div className="card-sub">{out.message || "No disponible"}</div>
        </div>
      )}

      {/* Resumen + Hallazgos */}
      {out && out.ok === true && (
        <>
          <div className="grid" style={{ marginTop: 14 }}>
            <div className="card pro-card">
              <div className="card-title">Resumen</div>
              <div className="card-sub" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                {summary || "—"}
              </div>
            </div>

            <div className="card pro-card">
              <div className="card-title">Semáforo</div>
              <div className="card-sub" style={{ marginTop: 8 }}>
                {labelOverall(overall)}
              </div>
              <div className="card-metric" style={{ marginTop: 10 }}>
                Hallazgos: {findings.length}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="card-title" style={{ marginBottom: 10 }}>Hallazgos</div>

            {findings.length === 0 ? (
              <div className="card pro-card">
                <div className="card-sub">Sin hallazgos por ahora.</div>
              </div>
            ) : (
              <div className="grid">
                {findings.map((f, idx) => (
                  <div key={idx} className="card pro-card">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div className="card-title">{f.title || "Hallazgo"}</div>
                      <span className={`tag tag-${f.severity || "low"}`}>
                        {labelSeverity(f.severity)}
                      </span>
                    </div>

                    <div className="card-sub" style={{ marginTop: 8 }}>
                      <strong>Código:</strong> {f.code || "—"}
                    </div>

                    {!!f.detail && (
                      <div className="card-sub" style={{ marginTop: 8 }}>
                        {f.detail}
                      </div>
                    )}

                    {Array.isArray(f.suggestedNext) && f.suggestedNext.length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div className="card-sub"><strong>Siguiente:</strong></div>
                        <ul style={{ margin: "8px 0 0 18px", color: "var(--text)", fontSize: 12 }}>
                          {f.suggestedNext.map((s, i) => (
                            <li key={i} style={{ marginBottom: 6 }}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {citations.length > 0 && (
            <div className="card pro-card" style={{ marginTop: 14 }}>
              <div className="card-title">Citas / Referencias</div>
              <ul style={{ margin: "10px 0 0 18px", color: "var(--text)", fontSize: 12 }}>
                {citations.map((c, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Debug opcional: si quieres ocultarlo luego, lo borramos */}
          <div className="card pro-card" style={{ marginTop: 14 }}>
            <div className="card-title">Debug (JSON)</div>
            <pre className="json">{JSON.stringify(out, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
