import React from "react";

interface Parcela {
  valor: string;
  dataVencimento: string;
  valorPago?: string;
  dataPagamento?: string;
  link?: string;
  pagamento?: string;
}

interface ListaDeParcelasProps {
  parcelas: Parcela[];
  handleParcelaChange: (
    index: number,
    field: "valorPago" | "dataPagamento" | "link" | "pagamento",
    value: string
  ) => void;
}
const ListaDeParcelas: React.FC<ListaDeParcelasProps> = ({
  parcelas,
  handleParcelaChange,
}) => {
  if (!parcelas || parcelas.length === 0) return null;

  const handleInputValorPago = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const input = e.target.value;
    const onlyNumbers = input.replace(/\D/g, "");
    handleParcelaChange(index, "valorPago", onlyNumbers);
  };

  const formatarValorMonetario = (valor: string) => {
    if (!valor) return "0,00";
    const number = parseInt(valor, 10) / 100;
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePagamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    handleParcelaChange(index, "pagamento", e.target.value);
  };
  return (
    <div className="scroll-container">
      <div className="row gy-2">
        {parcelas.map((parcela, index) => (
          <div key={index} className="card shadow-sm p-3 rounded-2">
            <h3 className="text-center">Parcelas do Contrato</h3>
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h6 className="card-title mb-2">
                  <strong>Parcela {index + 1}</strong>
                </h6>
                <label htmlFor="pagamento" className="form-label">
                  Situação do Pagamento:
                </label>
                <select
                  className="form-select mb-3"
                  id={`pagamento-${index}`}
                  name="pagamento"
                  value={parcela.pagamento || "inadimplente"}
                  onChange={(e) => handlePagamentoChange(e, index)}
                  disabled
                >
                  <option value="pendente">Pendente</option>
                  <option value="inadimplente">Inadimplente</option>
                  <option value="pago">Pago</option>
                </select>

                <p className="mb-3">
                  <strong>Valor:</strong> R${" "}
                  {(Number(parcela.valor) / 100).toFixed(2).replace(".", ",")}
                  <br />
                  <strong>Vencimento:</strong> {parcela.dataVencimento}
                </p>

                <div className="mb-3">
                  <label className="form-label">Valor Pago:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatarValorMonetario(parcela.valorPago || "")}
                    onChange={(e) => handleInputValorPago(e, index)}
                    readOnly
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Data do Pagamento:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={parcela.dataPagamento}
                    onChange={(e) =>
                      handleParcelaChange(
                        index,
                        "dataPagamento",
                        e.target.value
                      )
                    }
                    readOnly
                    disabled
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">
                    Link do Comprovante (opcional):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cole aqui o link do comprovante"
                    value={parcela.link || ""}
                    onChange={(e) =>
                      handleParcelaChange(index, "link", e.target.value)
                    }
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaDeParcelas;
