import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketingForm } from "./Components/MarketingForm";
import "./Styles/FichaMarketing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import axios from "axios";
import { jsPDF } from "jspdf";
import ConfirmModal from "../components/ConfirmModal";

export const FichaMarketing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "marketings", id);
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

  const handleMarketingSubmit = async (data: any) => {
    try {
      if (id) {
        const docRef = doc(db, "marketings", id);
        await updateDoc(docRef, data);
        setClientData(data);
        console.log("Dados atualizados com sucesso!");
  
        // if (data.servicosConcluidos === true) {
        //   const posVendasRef = doc(db, "posVendas", id);
        //   const posVendasSnap = await getDoc(posVendasRef);
  
        //   if (!posVendasSnap.exists()) {
        //     await setDoc(posVendasRef, {
        //       ...data,
        //       dataAdicionado: new Date().toISOString(),
        //     });
        //     console.log("Cliente adicionado à coleção posVendas!");
        //   } else {
        //     await updateDoc(posVendasRef, {
        //       ...data,
        //       dataAtualizado: new Date().toISOString(),
        //     });
        //     console.log("Dados atualizados na coleção posVendas!");
        //   }
  
        //   navigate("/marketing");
        // } else {
        //   navigate("/marketing");
        // }
        navigate("/novomarketing");

      }
    } catch (error) {
      console.error("Erro ao atualizar os dados de marketing: ", error);
    }
  };
  
  // const handleConfirmDuplicate = async () => {
  //   if (!pendingData || !pendingId) return;

  //   try {
  //     const querySnapshot = await getDocs(
  //       query(
  //         collection(db, "posVendas"),
  //         where("__name__", ">=", `${pendingId}_copia`),
  //         where("__name__", "<", `${pendingId}_copia~`)
  //       )
  //     );

  //     const copiaCount = querySnapshot.size;
  //     const newId = `${pendingId}_copia${copiaCount + 1}`;

  //     await setDoc(doc(db, "posVendas", newId), {
  //       ...pendingData,
  //       dataAdicionado: new Date().toISOString(),
  //       idOriginal: pendingId,
  //     });

  //     console.log(`Cópia criada com ID: ${newId}`);
  //     setShowModalConfirm(false);
  //     setPendingData(null);
  //     setPendingId(null);
  //     navigate("/marketing");
  //   } catch (error) {
  //     console.error("Erro ao criar cópia na coleção posVendas:", error);
  //   }
  // };

  const sairFicha = () => {
    window.history.back();
  };

  const formatValor = (value: string | number | undefined): string => {
    if (!value) return "0,00"; // Retorna um valor padrão caso seja undefined ou null
    const num =
      typeof value === "number" ? value.toFixed(2) : value.replace(/\D/g, "");
    return num.replace(/(\d)(\d{2})$/, "$1,$2");
  };

  const formatDateToBrazilian = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3); // Ajuste para o horário de Brasília
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // meses começam do zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
            <div className="col-md-3">
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
            <div className="col-md-9">
              <MarketingForm
                form={clientData}
                onSubmit={handleMarketingSubmit}
              />
            </div>
          </div>
        </div>
          {/* <ConfirmModal
          show={showModalConfirm}
          title="Duplicar cliente"
          message="Este cliente já está na lista de pós-vendas. Deseja fazer uma cópia dele?"
          onCancel={() => setShowModalConfirm(false)}
          onConfirm={handleConfirmDuplicate}
        /> */}
      </div>
    )
  );
};
