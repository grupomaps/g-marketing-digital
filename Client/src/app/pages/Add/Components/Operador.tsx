// Operador.tsx
import React, { useState } from "react";
import { Header } from "./Header";
interface OperadorProps {
  form: {
    numeroContrato: string;
    data: string;
    dataVencimento: string;
    operador: string;
    equipeMsg: string;
    equipe: string;
    validade: string;
    parcelas: string;
    valorVenda: string;
    contrato: string;
    formaPagamento: string;
    account: string;
    grupo: string;
    parcelaRecorrente: string;
    diaData: string;
    valorExtenso: string;
    renovacaoAutomatica: string;
    responsavel: string;
    cargo: string;
    observacoes: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSelectChange: (selectedOption: any) => void;
  operadoresOpcoes: { value: string; label: string }[];
}

export const Operador: React.FC<OperadorProps> = ({
  form,
  handleInputChange,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const formatValor = (value: string): string => {
    return value.replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1,$2");
  };

  const handleDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value, name } = e.target;
    let formattedValue = value;

    if (name === "valorVenda" || name === "parcelaRecorrente") {
      formattedValue = formatValor(value);
      handleInputChange({
        target: { name, value: value.replace(/\D/g, "") },
      } as React.ChangeEvent<HTMLInputElement>);
      return;
    }

    if (name === "responsavel") {
      const nomeSobrenomeRegex = /^[A-Za-zÀ-ÿ]{2,}( [A-Za-zÀ-ÿ]{2,})+$/;

      if (!nomeSobrenomeRegex.test(value.trim())) {
        setErrors((prev) => ({
          ...prev,
          responsavel: "Insira nome e sobrenome válidos.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, responsavel: "" }));
      }
    }

    handleInputChange(e); 
  };

  const extractDayFromDate = (dataVencimento: string): string => {
    if (!dataVencimento) return "";
    const [year, month, day] = dataVencimento.split("-");
    return day || "";
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "dataVencimento") {
      const dia = extractDayFromDate(value);
      handleInputChange({
        target: { name: "diaData", value: dia },
      } as React.ChangeEvent<HTMLInputElement>);
    }
    handleInputChange(e);
  };

  return (
    <div className="row d-flex justify-content-center">
      <Header
        title="Plano e Condições de Pagamento"
        img="/img/img-header-adicao-2.png"
      />
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="equipe">Equipe</label>
        <input
          type="text"
          className="form-control"
          id="equipe"
          name="equipe"
          value={form.equipe}
          onChange={handleInputChange}
          readOnly
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="contrato">Tipo de Contrato</label>
        <select
          className="form-control"
          id="contrato"
          name="contrato"
          value={form.contrato}
          onChange={handleInputChange}
        >
          <option value="">Selecione uma opção</option>
          <option value="Base">Base</option>
          <option value="Recorencia">Base - Recorrência</option>
          <option value="Renovacao">Renovação</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="validade">Válido por</label>
        <select
          className="form-control"
          id="validade"
          name="validade"
          value={form.validade}
          onChange={handleInputChange}
        >
          <option value="">Selecione uma opção</option>
          <option value="Cancelamento">Cancelamento</option>
          <option value="Mensal">Mensal</option>
          <option value="Trimestral">Trimestral</option>
          <option value="Semestral">Semestral</option>
          <option value="Anual">Anual</option>
          <option value="gestao-ads">Gestão ADS</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="valorVenda">Valor da Venda</label>
        <input
          type="text"
          className="form-control"
          id="valorVenda"
          name="valorVenda"
          value={form.valorVenda ? formatValor(form.valorVenda) : ""}
          onChange={handleDocumentChange}
          placeholder="Insira o valor da venda"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="data">Data da Venda (dd/mm/aaaa)</label>
        <input
          type="date"
          className="form-control"
          id="data"
          name="data"
          value={form.data}
          onChange={handleInputChange}
          required
        />
      </div>

      {form.contrato === "Recorencia" && (
        <div className="form-group mb-3 col-md-4">
          <label htmlFor="diaData">Dia (dd)</label>
          <input
            type="text"
            className="form-control"
            id="diaData"
            name="diaData"
            value={form.diaData}
            readOnly
          />
        </div>
      )}

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="data">Data do Vencimento (dd/mm/aaaa)</label>
        <input
          type="date"
          className="form-control"
          id="dataVencimento"
          name="dataVencimento"
          value={form.dataVencimento}
          onChange={handleDateChange}
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="formaPagamento">Forma de Pagamento</label>
        <select
          className="form-control"
          id="formaPagamento"
          name="formaPagamento"
          value={form.formaPagamento}
          onChange={handleInputChange}
        >
          <option value="">Selecione uma opção</option>
          <option value="Boleto">Boleto</option>
          <option value="Crédito">Crédito</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="parcelas">Parcelas</label>
        <select
          className="form-control"
          id="parcelas"
          name="parcelas"
          value={form.parcelas}
          onChange={handleInputChange}
        >
          {Array.from({
            length: 12,
          }).map((_, index) => {
            const parcela = index + 1;
            return (
              <option key={parcela} value={parcela}>
                {parcela}
              </option>
            );
          })}
        </select>
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="renovacaoAutomatica" className="form-label text-white">
          Renovação Automática
        </label>
        <select
          className="form-control"
          id="renovacaoAutomatica"
          name="renovacaoAutomatica"
          value={form.renovacaoAutomatica}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="responsavel">Responsável</label>
        <input
          type="text"
          className={`form-control ${errors.responsavel ? "is-invalid" : ""}`}
          id="responsavel"
          name="responsavel"
          value={form.responsavel}
          onChange={handleDocumentChange}
          placeholder="Insira o nome completo do responsável"
          required
        />
        {errors.responsavel && (
          <div className="invalid-feedback">{errors.responsavel}</div>
        )}
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="cargo">Cargo do Responsável</label>
        <input
          type="text"
          className="form-control"
          id="cargo"
          name="cargo"
          value={form.cargo}
          onChange={handleDocumentChange}
          placeholder="Insira o cargo do responsável"
        />
      </div>

      {form.contrato === "Recorencia" && (
        <div className="form-group mb-3 col-md-4">
          <label htmlFor="valorExtenso">Valor por Extenso</label>
          <select
            className="form-control"
            id="valorExtenso"
            name="valorExtenso"
            value={form.valorExtenso}
            onChange={handleInputChange}
          >
            <option value="Duzentos e Quarenta e Nove Reais e Noventa Centavos">
              Duzentos e Quarenta e Nove Reais e Noventa Centavos
            </option>
            <option value="Cento e Noventa e Nove Reais e Noventa Centavos">
              Cento e Noventa e Nove Reais e Noventa Centavos
            </option>
            <option value="Cento e Quarenta e Nove Reais e Noventa Centavos">
              Cento e Quarenta e Nove Reais e Noventa Centavos
            </option>
          </select>
        </div>
      )}

      {form.contrato === "Recorencia" && (
        <div className="form-group mb-3 col-md-4">
          <label htmlFor="parcelaRecorrente">Valor da Parcela Recorrente</label>
          <input
            type="text"
            className="form-control"
            id="parcelaRecorrente"
            name="parcelaRecorrente"
            value={
              form.parcelaRecorrente ? formatValor(form.parcelaRecorrente) : ""
            }
            onChange={handleDocumentChange}
            placeholder="Insira o valor da parcela"
            disabled
          />
        </div>
      )}

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="operador">Operador</label>
        <input
          type="text"
          className="form-control text-capitalize"
          id="operador"
          name="operador"
          value={form.operador}
          onChange={handleInputChange}
          readOnly
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="equipeMsg">equipeMsg</label>
        <input
          type="text"
          className="form-control text-capitalize"
          id="equipeMsg"
          name="equipeMsg"
          value={form.equipeMsg}
          onChange={handleInputChange}
          readOnly
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="observacoes" className="form-label text-white">
          Observações
        </label>
        <textarea
          className="form-control"
          id="observacoes"
          name="observacoes"
          value={form.observacoes}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
    </div>
  );
};