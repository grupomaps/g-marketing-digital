import React, { useEffect, useState } from "react";
import { EditOperador } from "./Components/EditOperador";
import { EditEmpresa } from "./Components/EditEmpresa";
import { EditInfoAdicionais } from "./Components/EditInfoAdicionais";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Add/Components/Styles/add.css";

interface ClientData {
  numeroContrato: string;
  valorVenda: string;
  validade: string;
  formaPagamento: string;
  data: string;
  operador: string;
  equipe: string;
  contrato: string;
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
  parcelas: string;
  dataVencimento: string;
  complemento: string;
  linkGravacao: string;
  linkGoogle: string;
  renovacaoAutomatica: string;
  criacao: string;
  ctdigital: string;
  logotipo: string;
  anuncio: string;
  valorParcelado: string;
  grupo: string;
  account: string;
  diaData: string;
  valorExtenso: string;
  numeroResidencial: string;
  equipeMsg: string;
}

export const EditContrato = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState<"CPF" | "CNPJ">("CPF");
  const [isRotated, setIsRotated] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      if (id) {
        try {
          const docRef = doc(db, "vendas", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setClientData(docSnap.data() as ClientData);
          } else {
            toast.error("Documento não encontrado");
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do cliente: ", error);
          toast.error("Erro ao buscar dados do cliente.");
        }
      }
    };
    fetchClientData();
  }, [id]);

  const handleToggleDocumento = () => {
    setTipoDocumento((prev) => (prev === "CPF" ? "CNPJ" : "CPF"));
    setIsRotated((prev) => !prev);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setClientData((prevData) =>
      prevData
        ? {
            ...prevData,
            [name]: value,
            ...(name === "cpf" || name === "cnpj"
              ? { numeroContrato: value.slice(0, 6) }
              : {}),
            ...(name === "valorVenda" || name === "parcelas"
              ? (() => {
                  const valorVenda = parseFloat(
                    name === "valorVenda" ? value : prevData.valorVenda || "0"
                  );
                  const parcelas = parseInt(
                    name === "parcelas" ? value : prevData.parcelas || "1"
                  );

                  if (!isNaN(valorVenda) && parcelas > 0) {
                    if (parcelas === 1) {
                      // Se apenas 1 parcela, valorParcelado é igual ao valorVenda
                      return {
                        valorParcelado: Math.round(valorVenda).toString(),
                      };
                    } else {
                      // Divide o valorVenda pelas parcelas e arredonda para inteiro
                      return {
                        valorParcelado: Math.round(
                          valorVenda / parcelas
                        ).toString(),
                      };
                    }
                  }
                  return {};
                })()
              : {}),
          }
        : prevData
    );
  };

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

  const sairFicha = () => window.history.back();

  const updateClientData = async () => {
    if (id && clientData) {
      try {
        const updatedData = Object.fromEntries(
          Object.entries(clientData).filter(
            ([_, value]) =>
              value !== "" && value !== null && value !== undefined
          )
        );

        if (Object.keys(updatedData).length === 0) {
          console.error("Nenhum campo válido para atualizar.");
          return;
        }

        const colecoesParaAtualizar = [
          "vendas",
          "financeiros",
          "posVendas",
          "marketings",
        ];
        const updatePromises = colecoesParaAtualizar.map(async (colecao) => {
          const docRef = doc(db, colecao, id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            await setDoc(
              docRef,
              {
                ...updatedData,
                dataAtualizado: new Date().toISOString(),
              },
              { merge: true }
            );
            console.log(`Atualizado com sucesso em ${colecao}`);
          } else {
            console.log(
              `Documento não encontrado em ${colecao}, não será criado.`
            );
          }
        });

        await Promise.all(updatePromises);

        toast.success("Dados atualizados em todas as coleções!");
        setTimeout(() => navigate(-1), 2000);
      } catch (error) {
        console.error("Erro ao atualizar os dados do cliente: ", error);
        toast.error("Erro ao atualizar os dados do cliente.");
      }
    } else {
      console.log("ID ou clientData não disponível.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientData();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <EditEmpresa
            form={clientData}
            handleInputChange={handleInputChange}
            tipoDocumento={tipoDocumento}
            handleToggleDocumento={handleToggleDocumento}
            isRotated={isRotated}
          />
        );
      case 1:
        return (
          <EditOperador
            form={clientData}
            handleInputChange={handleInputChange}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="contrato text-center">
      <div className="container">
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className="mt-4 d-flex gap-4 justify-content-center">
            {step === 0 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={sairFicha}
              >
                Sair
              </button>
            )}
            {step > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
              >
                Voltar
              </button>
            )}
            {step < 1 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Próximo
              </button>
            )}
            <button type="submit" className="btn btn-success btn-salvar">
              Salvar
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};
