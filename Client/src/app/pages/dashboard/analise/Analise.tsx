import React, { useState } from "react";
import { HeaderDash } from "./components/header-dash";
import "../monitoria/components/dashboard.css";
import { ListDashboard } from "./components/list-dashboard";

export const Analise = () => {
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalRealizados, setTotalRealizados] = useState(0); 

  return (
    <div className="bg-dash">
      <div className="itens-dash">
        <HeaderDash totalVendas={totalVendas} totalRealizados={totalRealizados} />
        <ListDashboard setTotalVendas={setTotalVendas} setTotalRealizados={setTotalRealizados} />
      </div>
    </div>
  );
};
