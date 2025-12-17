import React from "react";

export default function FactuRamval() {
  return (
  <div className="page-wrap">
      <h1 className="h1">Factu-Ramval</h1>
      <p className="sub">Facturación electrónica, paquetes, operación por bot y control.</p>

      <div className="grid">
        <div className="card">
          <div className="card-title">CFDI</div>
          <div className="card-sub">Emisión y timbrado</div>
          <div className="card-metric">Facturación</div>
        </div>
        <div className="card">
          <div className="card-title">Bot WA</div>
          <div className="card-sub">Flujo operativo</div>
          <div className="card-metric">Automatización</div>
        </div>
        <div className="card">
          <div className="card-title">Planes</div>
          <div className="card-sub">Emprendedor → PyME</div>
          <div className="card-metric">Venta</div>
        </div>
      </div>
    </div>
  );
}
