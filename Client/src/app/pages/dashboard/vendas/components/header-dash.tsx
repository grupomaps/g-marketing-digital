// HeaderDash.tsx
import React from "react";
import { useAuth } from "../../../../context/AuthContext";

interface HeaderDashProps {
  totalVendas: number;
  vendasDia: number;
}

export const HeaderDash: React.FC<HeaderDashProps> = ({
  totalVendas,
  vendasDia,
}) => {
  const { nome } = useAuth();

  return (
    <section>
      <div className="header-dash">
        <div className="row">
          <div className="col-md-6 bemvindo-text">
            <h3>Olá, {nome.replace(/\./g, " ")}</h3>
          </div>
          <div className="header-info">
            <div className="col-md-6 info-item">
              <h3>Total de Clientes</h3>
              <p>{totalVendas}</p>
            </div>
            <div className="col-md-6 info-item">
              <h3>Vendas Diárias</h3>
              <p>{vendasDia}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
