/* eslint-disable react-hooks/rules-of-hooks */
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";

interface Address {
  logradouro: string;
  bairro: string;
  estado: string;
  cidade: string;
  cep: string;
}

interface Contact {
  email: string;
  telefone: string;
}

interface QuadroSocietario {
  nome: string;
}

interface Situacao {
  situacao_atual: string;
}

interface CNPJData {
  razao_social: string;
  nome_fantasia: string;
  endereco: Address;
  atividade_principal: string;
  quadro_societario: QuadroSocietario[];
  contato: Contact;
  situacao_cadastral: Situacao;
}

interface DadosEmpresaProps {
  form: {
    linkGoogle: string;
    numeroContrato: string;
    data: string;
    operador: string;
    equipe: string;
    razaoSocial: string;
    cpf: string;
    cnpj: string;
    nomeFantasia: string;
    enderecoComercial: string;
    bairro: string;
    cep: string;
    estado: string;
    cidade: string;
    complemento: string;
    validade: string;
    observacoes: string;
    fixo: string;
    celular: string;
    whatsapp: string;
    email1: string;
    email2: string;
    horarioFuncionamento: string;
    responsavel: string;
    cargo: string;
    numeroResidencial: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  tipoDocumento: string;
}

export const DadosEmpresa: React.FC<DadosEmpresaProps> = ({
  form,
  handleInputChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  const formatCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .substring(0, 18);
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s+/g, "");
    handleInputChange({
      target: { name, value: sanitizedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value, name } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = formatCPF(value);
      handleInputChange({
        target: { name, value: value.replace(/\D/g, "") },
      } as React.ChangeEvent<HTMLInputElement>);
    } else if (name === "cnpj") {
      formattedValue = formatCNPJ(value);
      handleInputChange({
        target: { name, value: value.replace(/\D/g, "") },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const buscarCNPJ = async (cnpj: string) => {
    try {
      const response = await axios.get(
        // `http://localhost:5000/buscar_cnpj?cnpj=${cnpj}`
        `https://crm-plataform-app-6t3u.vercel.app/buscar_cnpj?cnpj=${cnpj}`
      );
      const data: CNPJData = response.data;

      console.log("Dados recebidos:", data);

      if (
        data.situacao_cadastral?.situacao_atual?.toUpperCase() === "INAPTA" ||
        data.situacao_cadastral?.situacao_atual?.toUpperCase() === "BAIXADA"
      ) {
        setModalMessage(
          `A empresa com o CNPJ informado está com a situação ${
            data.situacao_cadastral?.situacao_atual || "desconhecida"
          }.
          Infelizmente, não será possível dar continuidade a essa operação no momento.`
        );
        setIsModalOpen(true);
        return;
      }

      handleInputChange({
        target: { name: "razaoSocial", value: data.razao_social || "" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: { name: "nomeFantasia", value: data.nome_fantasia || "" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: {
          name: "enderecoComercial",
          value: data.endereco?.logradouro || "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: { name: "cep", value: data.endereco?.cep || "" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: { name: "bairro", value: data.endereco?.bairro || "" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: { name: "estado", value: data.endereco?.estado || "" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: { name: "cidade", value: data.endereco?.cidade || "" },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: {
          name: "responsavel",
          value:
            data.quadro_societario?.map((socio) => socio.nome).join(", ") || "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: { name: "email1", value: data.contato?.email || "" },
      } as React.ChangeEvent<HTMLInputElement>);
    } catch (error) {
      console.error("Erro ao buscar CNPJ:", error);
    }
  };

  const closeModalSituacao = () => {
    setIsModalOpen(false);

    navigate("/vendas");
  };

  const handleCNPJSearch = (cnpj: string) => {
    buscarCNPJ(cnpj);
  };

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
        title="Adicionar Informações do Cliente/Empresa"
        img="/img/img-header-adicao-1.png"
      />
<div className="form-group mb-3 col-md-4">
        <label htmlFor="numeroContrato">Contrato Nº</label>
        <input
          type="text"
          className="form-control"
          id="numeroContrato"
          name="numeroContrato"
          value={form.numeroContrato}
          onChange={handleInputChange}
          placeholder="Inserido de forma automática a partir do cnpj/cpf"
          readOnly
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="nomeFantasia">CNPJ</label>
        <input
          type="text"
          className="form-control"
          id="cnpj"
          name="cnpj"
          value={form.cnpj ? formatCNPJ(form.cnpj) : ""}
          onChange={handleDocumentChange}
          onBlur={() => handleCNPJSearch(form.cnpj)}
          placeholder="Insira o CNPJ"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="nomeFantasia">CPF</label>
        <input
          type="text"
          className="form-control"
          id="cpf"
          name="cpf"
          value={form.cpf ? formatCPF(form.cpf) : ""}
          onChange={handleDocumentChange}
          placeholder="Insira o CPF"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="razaoSocial">Razão Social</label>
        <input
          type="text"
          className="form-control"
          id="razaoSocial"
          name="razaoSocial"
          value={form.razaoSocial}
          onChange={handleInputChange}
          placeholder="Insira a razão social"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="nomeFantasia">Nome Fantasia</label>
        <input
          type="text"
          className="form-control"
          id="nomeFantasia"
          name="nomeFantasia"
          value={form.nomeFantasia}
          onChange={handleInputChange}
          placeholder="Insira o nome fantasia"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          className="form-control"
          id="cep"
          name="cep"
          value={formatCEP(form.cep)}
          onChange={handleCEPChange}
          placeholder="Insira o CEP"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="enderecoComercial">Endereço Comercial</label>
        <input
          type="text"
          className="form-control"
          id="enderecoComercial"
          name="enderecoComercial"
          value={form.enderecoComercial}
          onChange={handleInputChange}
          placeholder="Insira o endereço comercial"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="enderecoComercial">Número do Endereço</label>
        <input
          type="text"
          className="form-control"
          id="numeroResidencial"
          name="numeroResidencial"
          value={form.numeroResidencial}
          onChange={handleInputChange}
          placeholder="Insira o número do endereço comercial"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="bairro">Bairro</label>
        <input
          type="text"
          className="form-control"
          id="bairro"
          name="bairro"
          value={form.bairro}
          onChange={handleInputChange}
          placeholder="Insira o bairro"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="cidade">Cidade</label>
        <input
          type="text"
          className="form-control"
          id="cidade"
          name="cidade"
          value={form.cidade}
          onChange={handleInputChange}
          placeholder="Insira a cidade"
        />
      </div>
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

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="cidade">Complemento</label>
        <input
          type="text"
          className="form-control"
          id="complemento"
          name="complemento"
          value={form.complemento}
          onChange={handleInputChange}
          placeholder="Insira o Complemento"
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="cidade">Horário de Funcionamento</label>
        <input
          type="text"
          className="form-control"
          id="horarioFuncionamento"
          name="horarioFuncionamento"
          value={form.horarioFuncionamento}
          onChange={handleInputChange}
          placeholder="Insira o horário de funcionamento"
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="fixo">Telefone Fixo</label>
        <input
          type="text"
          className="form-control"
          id="fixo"
          name="fixo"
          value={form.fixo}
          onChange={handleInputChange}
          placeholder="Insira o telefone fixo"
          required
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="celular">Celular</label>
        <input
          type="text"
          className="form-control"
          id="celular"
          name="celular"
          value={form.celular}
          onChange={handleInputChange}
          placeholder="Insira o celular"
          required
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="whatsapp">Whatsapp Comercial</label>
        <input
          type="text"
          className="form-control"
          id="whatsapp"
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleInputChange}
          placeholder="Insira o whatsapp comercial"
          required
        />
      </div>

      <div className="form-group mb-3 col-md-4">
        <label htmlFor="email1">1º E-mail</label>
        <input
          type="text"
          className="form-control"
          id="email1"
          name="email1"
          value={form.email1}
          onChange={handleEmailChange}
          placeholder="Insira o primeiro e-mail"
          required
        />
      </div>
      <div className="form-group mb-3 col-md-4">
        <label htmlFor="linkGoogle">Link da Página</label>
        <input
          type="text"
          className="form-control"
          id="linkGoogle"
          name="linkGoogle"
          value={form.linkGoogle}
          onChange={handleInputChange}
          placeholder="Insira o link da página do Google Maps"
        />
      </div>
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">⚠️ Alerta de Situação</h5>
              </div>
              <div className="modal-body">
                <p className="text-dark">{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={closeModalSituacao}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
