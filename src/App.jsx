import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./layout/Sidebar.jsx";
import Header from "./layout/Header.jsx";

import Home from "./modules/Home.jsx";
import Finxa from "./modules/Finxa.jsx";
import AIConta from "./modules/AIConta.jsx";
import FactuRamval from "./modules/FactuRamval.jsx";
import Core from "./modules/Core.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Header />
        <div className="app-page">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/finxa" element={<Finxa />} />
            <Route path="/aiconta" element={<AIConta />} />
            <Route path="/facturamval" element={<FactuRamval />} />
            <Route path="/core" element={<Core />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
