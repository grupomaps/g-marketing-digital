import React, { useEffect, useState } from "react";
import Select from "react-select";
import ListaDeParcelas from "./ListaDeParcelas";

interface ParcelaDetalhada {
  valor: string;
  dataVencimento: string;
  valorPago?: string;
  dataPagamento?: string;
  link?: string;
  pagamento?: string;
}

interface Form {
  valorPago: string;
  acordo: string;
  rePagamento: string;
  dataPagamento: string;
  encaminharCliente: string;
  operadorSelecionado: { value: string; label: string } | null;
  comprovante: string;
  parcelasDetalhadas?: ParcelaDetalhada[];
}

interface FinanceiroFormProps {
  form: Form | null;
  onSubmit: (data: Form) => void;
}

export const FinanceiroForm: React.FC<FinanceiroFormProps> = ({
  form: initialForm,
  onSubmit,
}) => {
  const [form, setForm] = useState<Form>({
    valorPago: "",
    acordo: "",
    rePagamento: "",
    dataPagamento: "",
    encaminharCliente: "",
    operadorSelecionado: null,
    comprovante: "",
    parcelasDetalhadas: [],
  });

  const [parcelas, setParcelas] = useState<ParcelaDetalhada[]>([]);
  const [isValorPagoManuallyEdited, setIsValorPagoManuallyEdited] =
    useState(false);
  const handleParcelaChange = (
    index: number,
    field: "valorPago" | "dataPagamento" | "link" | "pagamento",
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
    if (!isValorPagoManuallyEdited) {
      // Se não houver parcelas, não calculamos automaticamente
      if (!parcelas || parcelas.length === 0) return;

      const total = parcelas.reduce((acc, parcela) => {
        const valor = parseFloat(parcela.valorPago || "0");
        return acc + (isNaN(valor) ? 0 : valor);
      }, 0);

      setForm((prevForm) => ({
        ...prevForm,
        valorPago: (Number(total) / 100).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      }));
    }
  }, [parcelas, isValorPagoManuallyEdited]);

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

  const formatDisplayValue = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, "");
    const number = parseInt(onlyNumbers || "0", 10);
    return (number / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseToPureNumber = (value: string): string => {
    return value.replace(/\D/g, "") || "0";
  };

  const handleValorPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const onlyNumbers = value.replace(/\D/g, "");

    // Atualiza o estado com o valor formatado para exibição
    setForm((prevForm) => ({
      ...prevForm,
      valorPago: formatDisplayValue(onlyNumbers),
    }));
    setIsValorPagoManuallyEdited(true);
  };

  // Substituir a função handleValorPagoBlur
  const handleValorPagoBlur = () => {
    if (form.valorPago) {
      setForm((prevForm) => ({
        ...prevForm,
        valorPago: formatDisplayValue(form.valorPago),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formToSubmit: Form = {
      ...form,
      valorPago: parseToPureNumber(form.valorPago), // Envia apenas números
    };

    if (!form.parcelasDetalhadas || form.parcelasDetalhadas.length === 0) {
      delete formToSubmit.parcelasDetalhadas;
    }

    onSubmit(formToSubmit);
  };

  // Atualizar o useEffect que carrega dados iniciais
  useEffect(() => {
    if (initialForm) {
      const formData = { ...initialForm };

      // Converte valorPago para formato de exibição
      if (formData.valorPago) {
        formData.valorPago = formatDisplayValue(formData.valorPago);
      }

      if (
        !formData.parcelasDetalhadas ||
        formData.parcelasDetalhadas.length === 0
      ) {
        delete formData.parcelasDetalhadas;
      }

      setForm(formData);

      if (
        initialForm.parcelasDetalhadas &&
        initialForm.parcelasDetalhadas.length > 0
      ) {
        const parcelasIniciais = initialForm.parcelasDetalhadas.map((p) => ({
          ...p,
          valorPago: p.valorPago || "",
          dataPagamento: p.dataPagamento || "",
        }));
        setParcelas(parcelasIniciais);
      } else {
        setParcelas([]);
      }
    }
  }, [initialForm]);
  return (
    <div className="row gx-4 gy-4">
      <div className="col-12 col-lg-6">
        <div className="card p-4 h-100 shadow-sm">
          <form onSubmit={handleSubmit}>
            <label htmlFor="valorInput" className="form-label">
              Valor Pago (Total das Parcelas):
            </label>
            <input
              type="text"
              name="valorPago"
              id="valorInput"
              className="form-control"
              value={form.valorPago}
              onChange={handleValorPagoChange}
              onBlur={handleValorPagoBlur}
              readOnly
              disabled 
            />
            {/* <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetToParcelasSum}
              title="Usar soma das parcelas"
            >
              <i className="bi bi-calculator"></i>
            </button> */}

            <label htmlFor="rePagamento" className="form-label">
              O cliente realizou o pagamento?
            </label>
            <select
              className="form-select mb-3"
              id="rePagamento"
              name="rePagamento"
              value={form.rePagamento}
              onChange={handleInputChange}
              disabled 
            >
              <option value="">Selecione uma opção</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <label htmlFor="dataPagamento" className="form-label">
              Data do Pagamento (Geral):
            </label>
            <input
              type="date"
              name="dataPagamento"
              id="dataPagamento"
              className="form-control mb-3"
              value={form.dataPagamento}
              onChange={handleInputChange}
              readOnly
disabled 
            />

            <label htmlFor="comprovante" className="form-label">
              Comprovante do Pagamento:
            </label>
            <input
              type="text"
              name="comprovante"
              id="comprovante"
              className="form-control mb-3"
              value={form.comprovante}
              onChange={handleInputChange}
              readOnly
              disabled 
            />

            <hr className="w-50 mx-auto" />

            <div className="encaminheCob">
              <label htmlFor="encaminharCliente">
                Deseja encaminhar para a cobrança?
              </label>
              <select
                className="form-select mb-3"
                id="encaminharCliente"
                name="encaminharCliente"
                value={form.encaminharCliente}
                onChange={handleInputChange}
                required
                disabled 
              >
                <option value="">Selecione uma opção</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
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
              {/* <button type="submit" className="btn btn-primary mt-4">
                Salvar
              </button> */}
            </div>
          </form>
        </div>
      </div>

      <div className="col-12 col-lg-6">
        <ListaDeParcelas
          parcelas={parcelas}
          handleParcelaChange={handleParcelaChange}
        />
      </div>
    </div>
  );
};
