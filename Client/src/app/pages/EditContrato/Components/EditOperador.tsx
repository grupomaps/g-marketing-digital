import React from "react";
import { Header } from "../../Add/Components/Header";

interface VendaData {
  numeroContrato: string;
  valorVenda: string;
  validade: string;
  formaPagamento: string;
  data: string;
  operador: string;
  equipeMsg: string;
  equipe: string;
  contrato: string;
  dataVencimento: string;
  parcelas: string;
  valorParcelado: string;
  grupo: string;
  account: string;
  diaData: string;
  valorExtenso: string;
  responsavel: string;
  renovacaoAutomatica: string;
  cargo: string;
  observacoes: string;
}

interface EditOperadorProps {
  form: VendaData | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const SelectField = ({
  id,
  label,
  name,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="form-group mb-3 col-md-4">
    <label htmlFor={id}>{label}</label>
    <select
      className="form-control"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">Selecione uma opção</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const InputField = ({
  id,
  label,
  name,
  value,
  onChange,
  readOnly = false,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}) => (
  <div className="form-group mb-3 col-md-4">
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      className="form-control text-capitalize"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </div>
);

const InputData = ({
  id,
  label,
  name,
  value,
  onChange,
  readOnly = false,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}) => (
  <div className="form-group mb-3 col-md-4">
    <label htmlFor={id}>{label}</label>
    <input
      type="date"
      className="form-control"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </div>
);

export const EditOperador: React.FC<EditOperadorProps> = ({
  form,
  handleInputChange,
}) => {
  if (!form) return null;

  const formatValor = (value: string): string => {
    return value.replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1,$2");
  };

  const handleDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value, name } = e.target;
    let formattedValue = value;

    if (name === "valorVenda") {
      formattedValue = formatValor(value);
      handleInputChange({
        target: { name, value: value.replace(/\D/g, "") },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };
  const maxParcelas = form.formaPagamento === "Boleto" ? 2 : 12;

  const parcelaOptions = [...Array(maxParcelas)].map((_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  return (
    <div className="row d-flex justify-content-center">
      <Header
        title="Editar Plano e Condições de Pagamento"
        img="/img/img-header-adicao-2.png"
      />
      <h4 className="text-white">Informações do Contrato</h4>
      <InputField
        id="equipe"
        label="Equipe"
        name="equipe"
        value={form.equipe}
        onChange={handleInputChange}
        readOnly
      />
      <SelectField
        id="contrato"
        label="Tipo de Contrato"
        name="contrato"
        value={form.contrato}
        onChange={handleInputChange}
        options={[
          { value: "Base", label: "Base" },
          { value: "Renovacao", label: "Renovação" },
          { value: "Recorencia", label: "Base - Recorrência" },
        ]}
      />
      <SelectField
        id="validade"
        label="Tipo de validade"
        name="validade"
        value={form.validade}
        onChange={handleInputChange}
        options={[
          { value: "Cancelamento", label: "Cancelamento" },
          { value: "Mensal", label: "Mensal" },
          { value: "Trimestral", label: "Trimestral" },
          { value: "Semestral", label: "Semestral" },
          { value: "Anual", label: "Anual" },
        ]}
      />
      <InputField
        id="valorVenda"
        label="Valor da Venda"
        name="valorVenda"
        value={form.valorVenda ? formatValor(form.valorVenda) : ""}
        onChange={handleDocumentChange}
      />
      <InputData
        id="dataVencimento"
        label="Data do Vencimento (dd/mm/aaaa)"
        name="dataVencimento"
        value={form.dataVencimento}
        onChange={handleInputChange}
      />
      {form.contrato === "Recorencia" && (
        <div className="form-group mb-3 col-md-4">
          <label htmlFor="diaData">Dia (dd)</label>
          <input
            type="text"
            className="form-control"
            id="diaData"
            name="diaData"
            value={form.diaData}
          />
        </div>
      )}
      <SelectField
        id="formaPagamento"
        label="Forma de Pagamento"
        name="formaPagamento"
        value={form.formaPagamento}
        onChange={handleInputChange}
        options={[
          // { value: "Pix", label: "Pix" },
          { value: "Boleto", label: "Boleto" },
          { value: "Crédito", label: "Crédito" },
        ]}
      />
      <SelectField
        id="validade"
        label="Parcelas"
        name="parcelas"
        value={form.parcelas}
        onChange={handleInputChange}
        options={parcelaOptions}
      />
      <SelectField
        id="renovacaoAutomatica"
        label="Renovação Automática"
        name="renovacaoAutomatica"
        value={form.renovacaoAutomatica}
        onChange={handleInputChange}
        options={[
          { value: "", label: "Selecione" },
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ]}
      />
      <InputField
        id="responsavel"
        label="Nome do Responsável"
        name="responsavel"
        value={form.responsavel}
        onChange={handleDocumentChange}
      />
      <InputField
        id="cargo"
        label="Nome do Responsável"
        name="cargo"
        value={form.cargo}
        onChange={handleDocumentChange}
      />
      <InputField
        id="valorParcelado"
        label="Valor Parcelado"
        name="valorParcelado"
        value={form.valorParcelado ? formatValor(form.valorParcelado) : ""}
        onChange={handleDocumentChange}
      />

      {/* <InputData
        id="data"
        label="Data (dd/mm/aaaa)"
        name="data"
        value={form.data}
        onChange={handleInputChange}
      /> */}

      <InputField
        id="operador"
        label="Operador"
        name="operador"
        value={form.operador}
        onChange={handleInputChange}
        readOnly
      />
      <InputField
        id="equipeMsg"
        label="Equipe Mensagem"
        name="equipeMsg"
        value={form.equipeMsg}
        onChange={handleInputChange}
        readOnly
      />
      <InputField
        id="observacoes"
        label="Observações"
        name="observacoes"
        value={form.observacoes}
        onChange={handleInputChange}
        readOnly
      />

      <SelectField
        id="account"
        label="Grupo"
        name="account"
        value={form.account}
        onChange={handleInputChange}
        options={[{ value: "equipe_marcio", label: "Equipe do Márcio/Kaio" }]}
      />

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
    </div>
  );
};
