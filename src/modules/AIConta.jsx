import React from "react";

export default function AIConta() {
 return (
  <div className="page-wrap">
      <h1 className="h1">AI CONTA</h1>
      <p className="sub">
        Prioridad: CumpleBot (materialidad, compliance, avisos y respaldos) + FacturaBot + ContaBot.
      </p>

      <div className="grid">
        <div className="card">
          <div className="card-title">CumpleBot</div>
          <div className="card-sub">Materialidad + evidencias</div>
          <div className="card-metric">Compliance</div>
        </div>
        <div className="card">
          <div className="card-title">FacturaBot</div>
          <div className="card-sub">Factura por WA / voz</div>
          <div className="card-metric">Operación</div>
        </div>
        <div className="card">
          <div className="card-title">ContaBot</div>
          <div className="card-sub">Contabilidad asistida</div>
          <div className="card-metric">IA al alcance</div>
        </div>
      </div>
    </div>
  );
}
