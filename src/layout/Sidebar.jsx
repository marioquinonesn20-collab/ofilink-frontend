import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/home", label: "Inicio" },
  { to: "/finxa", label: "FINXA" },
  { to: "/aiconta", label: "AI CONTA" },
  { to: "/facturamval", label: "Factu-Ramval" },
  { to: "/core", label: "OFILINK Core" },
];

export default function Sidebar() {
  return (
    <aside className="sb">
      <div className="sb-top">
        <div className="sb-logo">
          <img
            src="/assets/logo/ofilink-logo.svg"
            alt="OFILINK"
            className="sb-logo-img"
          />
          <div className="sb-logo-txt">
            <div className="sb-title">OFILINK 2.0</div>
            <div className="sb-sub">Omnicanal + IA modular</div>
          </div>
        </div>

        <div className="sb-pill">
          <span className="dot" />
          <span>PRO</span>
        </div>
      </div>

      <nav className="sb-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => (isActive ? "sb-link sb-on" : "sb-link")}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sb-footer">
        <div className="sb-foot-card">
          <div className="sb-foot-title">Railway + Vercel</div>
          <div className="sb-foot-sub">Frontend PRO · Backend API</div>
        </div>
      </div>
    </aside>
  );
}
