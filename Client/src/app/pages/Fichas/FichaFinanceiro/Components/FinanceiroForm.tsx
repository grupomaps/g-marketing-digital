import React, { useEffect, useState } from "react";
import ListaDeParcelas from "./ListaDeParcelas";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { useParams } from "react-router-dom";

interface ParcelaDetalhada {
  valor: string;
  dataVencimento: string;
  valorPago?: string;
  dataPagamento?: string;
  link?: string;
  pagamento?: string;
}

interface Form {
  id?: string;
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

export const FinanceiroForm: React.FC<FinanceiroFormProps> = ({ form: initialForm, onSubmit }) => {
  const { id } = useParams<{ id: string }>();

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
  const [novoValor, setNovoValor] = useState<string>("0");
  const [novaDataVencimento, setNovaDataVencimento] = useState<string>("");
  const [mostrarCampos, setMostrarCampos] = useState(false);
  const [isValorPagoManuallyEdited, setIsValorPagoManuallyEdited] = useState(false);

  const atualizarFinanceiroNoFirestore = async (parcelasAtualizadas: ParcelaDetalhada[]) => {
    if (id) {
      const docRef = doc(db, "financeiros", id);
      try {
        await updateDoc(docRef, {
          parcelasDetalhadas: parcelasAtualizadas,
          parcelas: parcelasAtualizadas.length,
        });
      } catch (error) {
        console.error("Erro ao atualizar parcelas no Firestore:", error);
      }
    }
  };

  const adicionarParcela = () => {
    if (!novoValor || !novaDataVencimento) {
      alert("Por favor, preencha o valor e a data de vencimento!");
      return;
    }

    const novaParcela: ParcelaDetalhada = {
      valor: novoValor,
      valorPago: "",
      pagamento: "pendente",
      dataVencimento: novaDataVencimento,
      dataPagamento: "",
      link: "",
    };

    const novasParcelas = [...parcelas, novaParcela];
    setParcelas(novasParcelas);
    setForm((prevForm) => ({
      ...prevForm,
      parcelasDetalhadas: novasParcelas,
    }));
    atualizarFinanceiroNoFirestore(novasParcelas);

    setNovoValor("0");
    setNovaDataVencimento("");
  };

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
    atualizarFinanceiroNoFirestore(updatedParcelas);
  };

  const handleRemoverParcela = (index: number) => {
    const novasParcelas = parcelas.filter((_, i) => i !== index);
    setParcelas(novasParcelas);
    setForm((prevForm) => ({
      ...prevForm,
      parcelasDetalhadas: novasParcelas,
    }));
    atualizarFinanceiroNoFirestore(novasParcelas);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleValorPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setForm((prevForm) => ({
      ...prevForm,
      valorPago: formatDisplayValue(onlyNumbers),
    }));
    setIsValorPagoManuallyEdited(true);
  };

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
      valorPago: parseToPureNumber(form.valorPago),
    };
    if (!form.parcelasDetalhadas?.length) {
      delete formToSubmit.parcelasDetalhadas;
    }
    onSubmit(formToSubmit);
  };

  const sairFicha = () => window.history.back();

  const formatDisplayValue = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, "");
    const number = parseInt(onlyNumbers || "0", 10);
    return (number / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseToPureNumber = (value: string): string =>
    value.replace(/\D/g, "") || "0";

  useEffect(() => {
    if (initialForm) {
      const formData = { ...initialForm };
      if (formData.valorPago) {
        formData.valorPago = formatDisplayValue(formData.valorPago);
      }
      setForm(formData);

      if (formData.parcelasDetalhadas?.length) {
        const parcelasIniciais = formData.parcelasDetalhadas.map((p) => ({
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

  useEffect(() => {
    if (!isValorPagoManuallyEdited && parcelas.length > 0) {
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
    }
  }, [parcelas, isValorPagoManuallyEdited]);

  const handleDataVencimentoChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setNovaDataVencimento(e.target.value);
};

  return (
    <div className="row gx-4 gy-4">
      <div className="col-12 col-lg-6">
        <div className="card p-4 h-100 shadow-sm">
          <form onSubmit={handleSubmit}>
            <label htmlFor="valorInput" className="form-label">Valor Pago (Total das Parcelas):</label>
            <input
              type="text"
              name="valorPago"
              id="valorInput"
              className="form-control"
              value={form.valorPago}
              onChange={handleValorPagoChange}
              onBlur={handleValorPagoBlur}
            />

            <label htmlFor="rePagamento" className="form-label">O cliente realizou o pagamento?</label>
            <select
              className="form-select mb-3"
              id="rePagamento"
              name="rePagamento"
              value={form.rePagamento}
              onChange={handleInputChange}
            >
              <option value="">Selecione uma opção</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <label htmlFor="dataPagamento" className="form-label">Data do Pagamento (Geral):</label>
            <input
              type="date"
              name="dataPagamento"
              id="dataPagamento"
              className="form-control mb-3"
              value={form.dataPagamento}
              onChange={handleInputChange}
            />

            <label htmlFor="comprovante" className="form-label">Comprovante do Pagamento:</label>
            <input
              type="text"
              name="comprovante"
              id="comprovante"
              className="form-control mb-3"
              value={form.comprovante}
              onChange={handleInputChange}
            />

            <hr className="w-50 mx-auto" />

            <div className="encaminheCob">
              <label htmlFor="encaminharCliente">Deseja encaminhar para a cobrança?</label>
              <select
                className="form-select mb-3"
                id="encaminharCliente"
                name="encaminharCliente"
                value={form.encaminharCliente}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione uma opção</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>

            <div className="d-flex gap-3 justify-content-center">
              <button type="button" className="btn btn-danger mt-4" onClick={sairFicha}>Sair</button>
              <button type="submit" className="btn btn-primary mt-4">Salvar</button>
            </div>
          </form>
        </div>
      </div>

      <div className="col-12 col-lg-6">
        <div className="d-flex justify-content-end mb-3">
          <button onClick={() => setMostrarCampos(true)} className="btn btn-success">+ Adicionar Parcela</button>
        </div>

        {mostrarCampos && (
          <div className="mb-3">
            <label htmlFor="valor" className="form-label">Valor da Parcela:</label>
            <input
              type="text"
              id="valor"
              value={formatDisplayValue(novoValor)}
              onChange={(e) => setNovoValor(e.target.value.replace(/\D/g, ""))}
              className="form-control mb-2"
              placeholder="Digite o valor"
            />

            <label htmlFor="dataVencimento" className="form-label">Data de Vencimento:</label>
            <input
              type="date"
              id="dataVencimento"
              value={novaDataVencimento}
              onChange={handleDataVencimentoChange}
              className="form-control mb-2"
            />

            <button onClick={adicionarParcela} className="btn btn-primary mt-2">Adicionar Parcela</button>
            <button onClick={() => setMostrarCampos(false)} className="btn btn-secondary mt-2 ms-2">Cancelar</button>
          </div>
        )}

        <ListaDeParcelas
          parcelas={parcelas}
          handleParcelaChange={handleParcelaChange}
          handleRemoverParcela={handleRemoverParcela}
        />
      </div>
    </div>
  );
};
