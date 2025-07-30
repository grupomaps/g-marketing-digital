import React from "react";
import { useAuth } from "../../../../context/AuthContext";

interface HeaderDashProps {
  totalFinanceiros: number;
  totalPagos: number;
  totalNegativados: number;
  totalRecebido: number;
}

export const HeaderDash: React.FC<HeaderDashProps> = ({
  totalFinanceiros,
  totalPagos,
  totalNegativados,
  totalRecebido,
}) => {
  const { nome } = useAuth();

const formatarValor = (valor: number | string) => {
  let valorStr = String(valor);
  valorStr = valorStr.replace(/\D/g, "");
  while (valorStr.length < 3) {
    valorStr = "0" + valorStr;
  }
  return valorStr.replace(/(\d+)(\d{2})$/, "$1,$2");
};

console.log("Total Recebido:", totalRecebido);
console.log("Total Financeiros:", totalFinanceiros);
console.log("Total Pagos:", totalPagos);
console.log("Total Negativados:", totalNegativados);


  return (
    <>
      <section>
        <div className="">
          <div className="header-dash">
            <div className="row">
              <div className="col-md-6 bemvindo-text">
                <h3>Olá, {nome}</h3>
              </div>

              <div className="header-info">
                <div className="col-md-3 info-item">
                  <h3>Total de Clientes</h3>
                  <p>{totalFinanceiros}</p>
                </div>
                <div className="col-md-3 info-item">
                  <h3>Total de Pagantes</h3>
                  <p>{totalPagos}</p>
                </div>
                <div className="col-md-3 info-item">
                  <h3>Valor Total Pago</h3>
                  <p>{formatarValor(totalRecebido.toString())}</p>
                </div>
                <div className="col-md-3 info-item">
                  <h3>Total Inadimpletes</h3>
                  <p>{totalNegativados}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
