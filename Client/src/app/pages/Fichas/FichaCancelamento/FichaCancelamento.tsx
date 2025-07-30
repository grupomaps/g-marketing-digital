import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CancelamentoForm } from "./Components/CancelamentoForm";
import "./Styles/FichaCancelamento.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import axios from "axios";
import { jsPDF } from "jspdf";

export const FichaCancelamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "cancelados", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data());
          } else {
            console.log("Não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do cliente: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const handleCancelamentoSubmit = async (data: any) => {
    try {
      if (id) {
        const docRef = doc(db, "cancelados", id);
        await updateDoc(docRef, data);
        setClientData(data);
        console.log("Dados atualizados com sucesso!");
        navigate("/cancelados");
      }
    } catch (error) {
      console.error("Erro ao atualizar os dados de cancelados: ", error);
    }
  };

  const sairFicha = () => {
    window.history.back();
  };

  // const formatValor = (value: string | number | undefined): string => {
  //   if (!value) return "0,00"; // Retorna um valor padrão caso seja undefined ou null
  //   const num =
  //     typeof value === "number" ? value.toFixed(2) : value.replace(/\D/g, "");
  //   return num.replace(/(\d)(\d{2})$/, "$1,$2");
  // };

  // const formatDateToBrazilian = (dateString: string) => {
  //   const date = new Date(dateString);
  //   date.setHours(date.getHours() + 3); // Ajuste para o horário de Brasília
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // meses começam do zero
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    clientData && (
      <div className="fichaMarketing">
        <div className="container">
          <button
            className="btn btn-danger btn-sair-marketing"
            onClick={sairFicha}
          >
            <FontAwesomeIcon icon={faLeftLong} />
          </button>
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4 p-4">
                <h2 className="text-center">Informações do Cliente</h2>
                <p>
                  <strong>CNPJ:</strong> {clientData.cnpj}
                </p>
                <p>
                  <strong>Razão Social:</strong> {clientData.razaoSocial}
                </p>
                <p>
                  <strong>Nome Fantasia:</strong> {clientData.nomeFantasia}
                </p>
                <p>
                  <strong>Operador:</strong> {clientData.operador}
                </p>
                <p>
                  <strong>Telefone:</strong>{" "}
                  {clientData.telefone || clientData.celular}
                </p>
                <p>
                  <strong>Whatsapp:</strong> {clientData.whatsapp}
                </p>
                <p>
                  <strong>Valor da Venda:</strong> {clientData.valorVenda}
                </p>
                <p>
                  <strong>Vencimento:</strong> {clientData.dataVencimento}
                </p>
                <p>
                  <strong>Observações:</strong> {clientData.observacoes}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <CancelamentoForm
                form={clientData}
                onSubmit={handleCancelamentoSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
};
