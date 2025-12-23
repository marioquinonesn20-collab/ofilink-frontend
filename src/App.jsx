import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

import Home from "./modules/Home";
import Finxa from "./modules/Finxa";
import AIConta from "./modules/AIConta";
import FactuRamval from "./modules/FactuRamval";
import Core from "./modules/Core";

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
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
      </div>
    </div>
  );
}
