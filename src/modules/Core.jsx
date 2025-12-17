import React from "react";

export default function Core() {
 return (
  <div className="page-wrap">
      <h1 className="h1">OFILINK Core</h1>
      <p className="sub">CRM multiempresa, bandeja omnicanal, referidos y métricas.</p>

      <div className="grid">
        <div className="card">
          <div className="card-title">CRM</div>
          <div className="card-sub">Clientes, etapas, responsables</div>
          <div className="card-metric">Pipeline</div>
        </div>
        <div className="card">
          <div className="card-title">Bandeja</div>
          <div className="card-sub">Tickets por WhatsApp / Web / Llamada</div>
          <div className="card-metric">Atención</div>
        </div>
        <div className="card">
          <div className="card-title">Referidos</div>
          <div className="card-sub">Carga manual + reportes</div>
          <div className="card-metric">Crecimiento</div>
        </div>
      </div>
    </div>
  );
}
