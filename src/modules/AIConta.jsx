import React from "react";
import Compliance from "./compliance";

export default function AIConta() {
  return (
    <div className="page-wrap">
      <h1 className="h1">AI CONTA</h1>
      <p className="sub">
        Prioridad: CumpleBot (materialidad, compliance, avisos y respaldos) + FacturaBot + ContaBot.
      </p>

      <Compliance />
    </div>
  );
}
