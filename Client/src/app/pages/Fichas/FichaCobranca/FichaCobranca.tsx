import React, { useEffect, useState } from "react";
import "./Styles/FichaCobranca.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import { CobrancaForm } from "./Components/CobrancaForm";

export const FichaCobranca: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "financeiros", id);
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

  const handleCobrancaSubmit = async (data: any) => {
    try {
      if (id) {
        const docRef = doc(db, "financeiros", id);
        await updateDoc(docRef, data);
        setClientData(data);
        console.log("Dados atualizados com sucesso!");
        navigate("/cobranca")
      }
    } catch (error) {
      console.error("Erro ao atualizar os dados de financeiro: ", error);
    }
  };

  return (
    clientData && (
      <>
        <div className="financeiro">
          <div className="container">
            <div className="row align-items-center justify-content-center gap-3">
              <div className="col-md-6">
                <div className="card-cob card p-4">
                  <h2 className="text-center">Informações Gerais</h2>
                  <p>
                    <strong>CNPJ:</strong> {clientData.cnpj || clientData.cpf}
                  </p>
                  <p>
                    <strong>Razão Social:</strong> {clientData.razaoSocial}
                  </p>
                  <p>
                    <strong>Responsável:</strong> {clientData.responsavel}
                  </p>
                  <p>
                    <strong>Plano:</strong> {clientData.contrato}
                  </p>
                  <p>
                    <strong>Valor:</strong> {clientData.valorVenda}
                  </p>
                  <p>
                    <strong>E-mail:</strong> {clientData.email1 || clientData.email2}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {clientData.telefone || clientData.celular}
                  </p>
                  <p>
                    <strong>Vencimento:</strong> {clientData.dataVencimento}
                  </p>
                </div>
              </div>
              <div className="col-md-5">
                <CobrancaForm form={clientData} onSubmit={handleCobrancaSubmit}/>
              </div>
            </div>
          </div>
        </div>
      </>
      )
    );
  };