import React from "react";

export default function Finxa() {
  return (
    <div>
      <h1 className="h1">FINXA</h1>
      <p className="sub">Precalificador, pipeline, seguimiento y automatización omnicanal.</p>

      <div className="grid">
        <div className="card">
          <div className="card-title">Precalificador</div>
          <div className="card-sub">WhatsApp / Llamada / Web</div>
          <div className="card-metric">Entrada de leads</div>
        </div>
        <div className="card">
          <div className="card-title">CRM</div>
          <div className="card-sub">Etapas y control</div>
          <div className="card-metric">Prospecto → Oferta</div>
        </div>
        <div className="card">
          <div className="card-title">Bandeja</div>
          <div className="card-sub">Tickets por canal</div>
          <div className="card-metric">Atención</div>
        </div>
      </div>
    </div>
  );
}
