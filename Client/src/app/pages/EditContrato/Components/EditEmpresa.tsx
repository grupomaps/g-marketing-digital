import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Header } from "../../Add/Components/Header";

interface VendaData {
  razaoSocial: string;
  cpf: string;
  cnpj: string;
  nomeFantasia: string;
  enderecoComercial: string;
  bairro: string;
  cep: string;
  estado: string;
  cidade: string;
  observacoes: string;
  fixo: string;
  celular: string;
  whatsapp: string;
  email1: string;
  email2: string;
  horarioFuncionamento: string;
  responsavel: string;
  cargo: string;
  linkGoogle: string;
  numeroResidencial: string;
  complemento: string;
  numeroContrato: string;
}

interface EditEmpresaFormProps {
  form: VendaData | null;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  tipoDocumento: "CPF" | "CNPJ";
  handleToggleDocumento: () => void;
  isRotated: boolean;
}

const InputField = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
}) => (
  <div className="form-group mb-3 col-md-4">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      className="form-control"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </div>
);

export const EditEmpresa: React.FC<EditEmpresaFormProps> = ({
  form,
  handleInputChange,
  tipoDocumento,
  handleToggleDocumento,
  isRotated,
}) => {
  const [formattedDocument, setFormattedDocument] = useState("");

  useEffect(() => {
    const raw = tipoDocumento === "CPF" ? form?.cpf || "" : form?.cnpj || "";
    const formatted = formatDocument(tipoDocumento, raw);
    setFormattedDocument(formatted);
  }, [tipoDocumento, form]);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const onlyNumbers = value.replace(/\D/g, ""); // tira tudo que não for número

    const maxLength = name === "cpf" ? 11 : 14;
    const trimmed = onlyNumbers.slice(0, maxLength);

    const formatted = formatDocument(name === "cpf" ? "CPF" : "CNPJ", trimmed);

    setFormattedDocument(formatted);

    handleInputChange({
      target: { name, value: trimmed }, // salva só os números
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const formatDocument = (tipo: "CPF" | "CNPJ", value: string): string => {
    if (tipo === "CPF") {
      return value
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    }

    if (tipo === "CNPJ") {
      return value
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
    }

    return value;
  };

  const formatCEP = (value: string): string => {
      const onlyNumbers = value.replace(/\D/g, "").substring(0, 8);
  
      if (onlyNumbers.length > 5) {
        return `${onlyNumbers.slice(0, 5)}-${onlyNumbers.slice(5)}`;
      }
  
      return onlyNumbers; // Retorna sem traço se tiver menos de 5 dígitos
    };
  
    const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
  
      // Remove o traço e limita a 8 dígitos (valor real para o banco de dados)
      const cepWithoutMask = value.replace(/\D/g, "").substring(0, 8);
  
      // Atualiza o estado com o valor SEM traço
      handleInputChange({
        target: { name, value: cepWithoutMask }, // Salva apenas os números
      } as React.ChangeEvent<HTMLInputElement>);
    };

  if (!form) return null;

  const estadosBrasil = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  return (
    <div className="row d-flex justify-content-center">
      <Header
        title="Editar Informações do Cliente/Empresa"
        img="/img/img-header-adicao-1.png"
      />
      <InputField
        id="numeroContrato"
        label="Contrato Nº"
        name="numeroContrato"
        value={form.numeroContrato}
        onChange={handleInputChange}
        readOnly
      />
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="documento">{tipoDocumento}</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="documento"
            name={tipoDocumento === "CPF" ? "cpf" : "cnpj"}
            value={formattedDocument}
            onChange={handleDocumentChange}
            placeholder={`Insira o ${tipoDocumento}`}
          />
          <button
            type="button"
            className="btn btn-outline-secondary bg-white"
            onClick={handleToggleDocumento}
          >
            <FontAwesomeIcon
              icon={faSync}
              className={`icon-troca ${isRotated ? "rotated" : ""} text-dark`}
            />
          </button>
        </div>
      </div>
      <InputField
        id="razaoSocial"
        label="Razão Social"
        name="razaoSocial"
        value={form.razaoSocial}
        onChange={handleInputChange}
        placeholder="Insira a razão social"
      />

      <InputField
        id="nomeFantasia"
        label="Nome Fantasia"
        name="nomeFantasia"
        value={form.nomeFantasia}
        onChange={handleInputChange}
        placeholder="Insira o nome fantasia"
      />
      <InputField
        id="cep"
        label="CEP"
        name="cep"
        value={formatCEP(form.cep)}
          onChange={handleCEPChange}
        placeholder="Insira o CEP"
      />
      <InputField
        id="enderecoComercial"
        label="Endereço Comercial"
        name="enderecoComercial"
        value={form.enderecoComercial}
        onChange={handleInputChange}
        placeholder="Insira o endereço comercial"
      />
      <InputField
        id="numeroResidencial"
        label="Número do Endereço"
        name="numeroResidencial"
        value={form.numeroResidencial}
        onChange={handleInputChange}
        placeholder="Insira o número do endereço comercial"
      />
      <InputField
        id="bairro"
        label="Bairro"
        name="bairro"
        value={form.bairro}
        onChange={handleInputChange}
        placeholder="Insira o bairro"
      />
      <InputField
        id="cidade"
        label="Cidade"
        name="cidade"
        value={form.cidade}
        onChange={handleInputChange}
        placeholder="Insira a cidade"
      />
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="estado">Estado</label>
        <select
          className="form-control"
          id="estado"
          name="estado"
          value={form.estado}
          onChange={handleInputChange}
        >
          <option value="">Selecione um estado</option>
          {estadosBrasil.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>
      </div>
      <InputField
        id="complemento"
        label="Insira o complemento"
        name="complemento"
        value={form.complemento}
        onChange={handleInputChange}
        placeholder="Insira o complemento"
      />
      <InputField
        id="horarioFuncionamento"
        label="Horário de funcionamento"
        name="horarioFuncionamento"
        value={form.horarioFuncionamento}
        onChange={handleInputChange}
      />
      <InputField
        id="fixo"
        label="Telefone Fixo"
        name="fixo"
        value={form.fixo}
        onChange={handleInputChange}
        placeholder="Insira o telefone fixo"
      />
      <InputField
        id="celular"
        label="Celular"
        name="celular"
        value={form.celular}
        onChange={handleInputChange}
        placeholder="Insira o celular"
      />
      <InputField
        id="whatsapp"
        label="Whatsapp Comercial"
        name="whatsapp"
        value={form.whatsapp}
        onChange={handleInputChange}
        placeholder="Insira o whatsapp comercial"
      />
      <InputField
        id="email1"
        label="1º E-mail"
        name="email1"
        value={form.email1}
        onChange={handleInputChange}
        placeholder="Insira o primeiro e-mail"
      />
      <InputField
        id="linkGoogle"
        label="Link Google Maps"
        name="linkGoogle"
        value={form.linkGoogle}
        onChange={handleInputChange}
      />
    </div>
  );
};
