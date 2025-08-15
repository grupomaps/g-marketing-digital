import React, { useState } from "react";
import { HeaderDash } from "./components/header-dash";
import "../novo_mkt/components/dashboard.css";
import { ListDashboard } from "./components/list-dashboard";

export const NovoMkt = () => {
  const [totalMarketings, setTotalMarketings] = useState(0);
  const [totalRealizados, setTotalRealizados] = useState(0); 

  return (
    <div className="bg-dash">
      <div className="itens-dash">
        <HeaderDash totalMarketings={totalMarketings} totalRealizados={totalRealizados} />
        <ListDashboard setTotalMarketings={setTotalMarketings} setTotalRealizados={setTotalRealizados} /> 
      </div>
    </div>
  );
};
