import React from "react";
import Compliance from "./Compliance";

export default function AIConta() {
  return (
    <div className="page-wrap">
      <h1 className="h1">AI CONTA</h1>
      <p className="sub">
        Prioridad: CumpleBot (materialidad, compliance, avisos y respaldos) + FacturaBot + ContaBot.
      </p>

      {/* CumpleBot (Fiscal Shield) */}
      <div className="card pro-card" style={{ marginTop: 14 }}>
        <Compliance />
      </div>

      {/* Cards resumen (opcionales, solo UI) */}
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="card-title">FacturaBot</div>
          <div className="card-sub">Factura por WA / voz</div>
          <div className="card-metric">Operación</div>
        </div>

        <div className="card">
          <div className="card-title">ContaBot</div>
          <div className="card-sub">Contabilidad asistida</div>
          <div className="card-metric">Registro</div>
        </div>

        <div className="card">
          <div className="card-title">CumpleBot</div>
          <div className="card-sub">Fiscal Shield (materialidad + 69-B)</div>
          <div className="card-metric">Compliance</div>
        </div>
      </div>
    </div>
  );
}
