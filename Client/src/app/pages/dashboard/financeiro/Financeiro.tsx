import React, { useState } from "react";
import { HeaderDash } from "./components/header-dash";
import "../financeiro/components/dashboard.css";
import { ListDashboard } from "./components/list-dashboard";

export const Financeiro = () => {
  const [totalFinanceiros, setTotalFinanceiros] = useState(0);
  const [totalPagos, setTotalPagos] = useState(0);
  const [totalNegativados, setTotalNegativados] = useState(0);
  const [totalRecebido, setTotalRecebido] = useState<number>(0);

  return (
    <div className="bg-dash">
      <div className="itens-dash">
        <HeaderDash
          totalFinanceiros={totalFinanceiros}
          totalPagos={totalPagos}
          totalNegativados={totalNegativados}
          totalRecebido={totalRecebido}
        />
        <ListDashboard
          setTotalFinanceiros={setTotalFinanceiros}
          setTotalPagos={setTotalPagos}
          setTotalNegativados={setTotalNegativados}
          setTotalRecebido={setTotalRecebido}
        />
      </div>
    </div>
  );
};
