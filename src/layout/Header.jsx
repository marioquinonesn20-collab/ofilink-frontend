import React from "react";

export default function Header() {
  return (
    <header className="hd">
      <div>
        <div className="hd-kicker">OFILINK 2.0</div>
        <div className="hd-title">Panel de control</div>
      </div>

      <div className="hd-right">
        <span className="badge">Producción</span>
        <button className="btn btn-primary" type="button">
          Nuevo registro
        </button>
      </div>
    </header>
  );
}
