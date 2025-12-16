import React from "react";

export default function Home() {
  return (
    <div>
      <h1 className="h1">OFILINK 2.0</h1>
      <p className="sub">
        Panel PRO en producción. Omnicanal + IA modular para AI CONTA, FINXA y Factu-Ramval.
      </p>

      <div className="grid">
        <div className="card">
          <div className="card-title">AI CONTA</div>
          <div className="card-sub">FacturaBot · ContaBot · CumpleBot</div>
          <div className="card-metric">Compliance primero</div>
        </div>

        <div className="card">
          <div className="card-title">FINXA</div>
          <div className="card-sub">Precalificador WA + Llamadas</div>
          <div className="card-metric">Pipeline de crédito</div>
        </div>

        <div className="card">
          <div className="card-title">Factu-Ramval</div>
          <div className="card-sub">Facturación + contabilidad</div>
          <div className="card-metric">Bots operativos</div>
        </div>

        <div className="card">
          <div className="card-title">OFILINK Core</div>
          <div className="card-sub">CRM + Bandeja + Referidos</div>
          <div className="card-metric">Multiempresa</div>
        </div>
      </div>
    </div>
  );
}
