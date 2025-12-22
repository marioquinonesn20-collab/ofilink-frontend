import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, getApiBase } from "../lib/api";

function pillClass(level) {
  if (level === "green") return "pill pill-green";
  if (level === "yellow") return "pill pill-yellow";
  if (level === "red") return "pill pill-red";
  return "pill";
}

export default function Compliance() {
  const apiBase = useMemo(() => getApiBase(), []);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("contax");

  // inputs v1 (mínimos)
  const [regimen, setRegimen] = useState("PM - General");
  const [actividad, setActividad] = useState("Servicios profesionales contables");
  const [periodo, setPeriodo] = useState("2025-01");

  // resultado
  const [running, setRunning] = useState(false);
  const [out, setOut] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoadingCompanies(true);
        const json = await apiGet("/api/aiconta/companies");
        if (!alive) return;
        setCompanies(json?.items || []);
        if (json?.items?.[0]?.id) setCompanyId(json.items[0].id);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "No pude cargar companies");
      } finally {
        if (alive) setLoadingCompanies(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  async function runAnalysis() {
    setErr("");
    setOut(null);
    setRunning(true);
    try {
      const payload = {
        companyId,
        regimen,
        actividad,
        periodo,
        focus: {
          efoEdoRisk: true,
          materialidad: true,
          beneficiarioControlador: true,
        },
        notes:
          "Fiscal Shield v1 demo (Contax). Semáforo + checklist materialidad. Citar artículos cuando aplique.",
      };

      const json = await apiPost("/api/aiconta/compliance/analyze", payload);
      setOut(json);
    } catch (e) {
      setErr(e?.message || "Error corriendo análisis");
    } finally {
      setRunning(false);
    }
  }

  const overall = out?.result?.overall || null;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="kicker">AI CONTA · CumpleBot</div>
          <h1 className="h1">Fiscal Shield v1</h1>
          <div className="muted">
            Backend: <span className="mono">{apiBase || "(sin VITE_API_BASE_URL)"}</span>
          </div>
        </div>

        <div className="head-actions">
          <span className={pillClass(overall)}>
            {overall ? `Semáforo: ${overall.toUpperCase()}` : "Semáforo: —"}
          </span>
          <button className="btn btn-primary" onClick={runAnalysis} disabled={running}>
            {running ? "Analizando..." : "Analizar compliance"}
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card pro-card">
          <div className="card-title">Entrada (v1)</div>
          <div className="card-sub">Lo mínimo para arrancar (luego crece a expediente + evidencias).</div>

          <div className="form">
            <label className="lbl">
              Empresa
              <select
                className="input"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                disabled={loadingCompanies}
              >
                {(companies.length ? companies : [{ id: "contax", legalName: "CONTAX (demo)" }]).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.legalName || c.id}
                  </option>
                ))}
              </select>
            </label>

            <label className="lbl">
              Régimen
              <select className="input" value={regimen} onChange={(e) => setRegimen(e.target.value)}>
                <option>PM - General</option>
                <option>PM - RESICO</option>
                <option>PF - Actividad empresarial</option>
                <option>PF - RESICO</option>
                <option>Otros</option>
              </select>
            </label>

            <label className="lbl">
              Actividad / giro
              <input className="input" value={actividad} onChange={(e) => setActividad(e.target.value)} />
            </label>

            <label className="lbl">
              Periodo (AAAA-MM)
              <input className="input" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
            </label>
          </div>

          {err && <div className="alert">{err}</div>}
        </div>

        <div className="card pro-card">
          <div className="card-title">Salida</div>
          <div className="card-sub">Semáforo + hallazgos + (después) artículos y evidencia.</div>

          {!out ? (
            <div className="muted">Dale “Analizar compliance”.</div>
          ) : (
            <>
              <div className="result-head">
                <div className={pillClass(out?.result?.overall)}>
                  {out?.result?.overall?.toUpperCase()}
                </div>
                <div className="muted">{out?.result?.summary}</div>
              </div>

              <div className="findings">
                {(out?.result?.findings || []).map((f, idx) => (
                  <div key={idx} className="finding">
                    <div className="finding-title">
                      {f.title} <span className="muted">({f.severity})</span>
                    </div>
                    <div className="finding-detail">{f.detail}</div>
                    {Array.isArray(f.suggestedNext) && f.suggestedNext.length > 0 && (
                      <ul className="ul">
                        {f.suggestedNext.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {Array.isArray(out?.result?.citations) && out.result.citations.length > 0 && (
                <div className="citations">
                  <div className="card-title">Citas</div>
                  <ul className="ul">
                    {out.result.citations.map((c, i) => (
                      <li key={i}>
                        <span className="mono">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
