import React, { useEffect, useState } from "react";
import Select from "react-select";
import ListaDeParcelas from "./ListaDeParcelas";

interface Parcela {
  valor: string;
  dataVencimento: string;
  valorPago?: string;
  dataPagamento?: string;
}

interface Form {
  acordo: string;
  dataCobranca: string;
  dataPagamento: string;
  valorPago: string;
  encaminharCliente: string;
  operadorSelecionado: { value: string; label: string } | null;
  parcelasDetalhadas?: Parcela[];
}

interface CobrancaFormProps {
  form: Form | null;
  onSubmit: (data: Form) => void;
}

export const CobrancaForm: React.FC<CobrancaFormProps> = ({
  form: initialForm,
  onSubmit,
}) => {
  const [form, setForm] = useState<Form>({
    acordo: "",
    dataCobranca: "",
    dataPagamento: "",
    valorPago: "",
    encaminharCliente: "",
    operadorSelecionado: null,
    parcelasDetalhadas: [],
  });

  const [parcelas, setParcelas] = useState<Parcela[]>([]);

  const cobranca = [
    { value: "miguel", label: "Miguel" },
    { value: "isa", label: "Isa" },
  ];

  const sairFicha = () => {
    window.history.back();
  };

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
      if (initialForm.parcelasDetalhadas) {
        const parcelasIniciais = initialForm.parcelasDetalhadas.map((p) => ({
          ...p,
          valorPago: p.valorPago || "",
          dataPagamento: p.dataPagamento || "",
        }));
        setParcelas(parcelasIniciais);
      }
    }
  }, [initialForm]);

  useEffect(() => {
    const total = parcelas.reduce((acc, parcela) => {
      const valor = parseFloat(parcela.valorPago || "0");
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);

    setForm((prevForm) => ({
      ...prevForm,
      valorPago: (total / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    }));
  }, [parcelas]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setForm((prevForm) => ({
      ...prevForm,
      operadorSelecionado: selectedOption,
    }));
  };

  const handleParcelaChange = (
    index: number,
    field: "valorPago" | "dataPagamento" | "link",
    value: string
  ) => {
    const updatedParcelas = parcelas.map((parcela, i) =>
      i === index ? { ...parcela, [field]: value } : parcela
    );
    setParcelas(updatedParcelas);
    setForm((prevForm) => ({
      ...prevForm,
      parcelasDetalhadas: updatedParcelas,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="row gx-4 gy-4">
      {/* Coluna do formulário */}
      <div className="col-12 col-lg-6">
        <div className="card card-cob p-4 h-100">
          <form onSubmit={handleSubmit}>
            <label htmlFor="acordoCobrança" className="form-label">
              Possui acordo com a cobrança?
            </label>
            <select
              className="form-select mb-3"
              id="acordoCobrança"
              name="acordo"
              value={form.acordo}
              onChange={handleInputChange}
            >
              <option value="">Selecione uma opção</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>

            <label htmlFor="dataCobranca" className="form-label">
              Data da Cobrança:
            </label>
            <input
              type="date"
              name="dataCobranca"
              id="dataCobranca"
              className="form-control mb-3"
              value={form.dataCobranca || ""}
              onChange={handleInputChange}
            />

            <label htmlFor="valorPago" className="form-label">
              Valor Pago (Total das Parcelas):
            </label>
            <input
              type="text"
              name="valorPago"
              id="valorPago"
              className="form-control mb-3"
              value={form.valorPago || ""}
              readOnly
            />

            <label htmlFor="dataPagamento" className="form-label">
              Data do Pagamento (Geral):
            </label>
            <input
              type="date"
              name="dataPagamento"
              id="dataPagamento"
              className="form-control mb-3"
              value={form.dataPagamento || ""}
              onChange={handleInputChange}
            />

            <hr className="w-50 mx-auto" />

            <div className="encaminheCob">
              <label htmlFor="">Deseja retirar o cliente da sua fila?</label>
              <select
                className="form-select mb-3"
                id="encaminharCliente"
                name="encaminharCliente"
                value={form.encaminharCliente}
                onChange={handleInputChange}
              >
                <option value="">Selecione uma opção</option>
                <option value="sim">Não</option>
                <option value="nao">Sim</option>
              </select>
            </div>

            <div className="d-flex gap-3 justify-content-center">
              <button
                type="button"
                className="btn btn-danger mt-4"
                onClick={sairFicha}
              >
                Sair
              </button>
              <button type="submit" className="btn btn-primary mt-4">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Coluna da lista de parcelas */}
      <div className="col-12 col-lg-6">
        <ListaDeParcelas
          parcelas={parcelas}
          handleParcelaChange={handleParcelaChange}
        />
      </div>
    </div>
  );
};
