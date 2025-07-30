import React, { useState } from "react";
import { HeaderDash } from "./components/header-dash";
import "../financeiro/components/dashboard.css";
import { ListDashboard } from "./components/list-dashboard";

export const Cobranca = () => {
  // Mesma lista do financeiro porem com filtro para vizualizar 
  const [totalFinanceiros, setTotalFinanceiros] = useState(0);

  return (
    <div className="bg-dash">
      <div className="itens-dash">
        <HeaderDash totalFinanceiros={totalFinanceiros} />
        <ListDashboard setTotalFinanceiros={setTotalFinanceiros} /> 
      </div>
    </div>
  );
};
