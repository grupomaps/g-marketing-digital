import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { useParams } from "react-router-dom";

export const DadosEmpresa: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);

  const formatCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .substring(0, 18);
  };

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  const formatCelular = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{5})$/, "$1-$2")
      .substring(0, 15);
  };

  const formatFixo = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/^(\(\d{2}\)) (\d{4})(\d)/, "$1 $2-$3")
      .substring(0, 14);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "vendas", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data());
          } else {
            console.log("Não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do cliente: ", error);
      }
    };

    fetchClientData();
  }, [id]);

  return (
    clientData && (
      <div className="dados-empresa p-4 my-1 upper">
        <h6 className="text-center">
          AUTORIZAÇÃO PARA DIVULGAÇÃO DAS FOTOS E VIDEOS E ASSESSORIA <br /> EM
          MARKETING DIGITAL REALIZADA PELA EMPRESA <br /> G MAPS CONTACT CENTER
          LTDA - CNPJ: 40.407.753/0001-30
        </h6>
        <div className="info-assinatura pt-3">
          <span>
            <strong>DATA DA ADESÃO:</strong>{" "}
            {new Date(clientData.data + "T00:00:00").toLocaleDateString(
              "pt-BR"
            )}
          </span>
          <span>
            <strong>EU: </strong>
            <span>{clientData.responsavel}</span>
          </span>
          <span>
            <strong>RESPONSÁVEL PELA EMPRESA:</strong> {clientData.nomeFantasia}
          </span>
          <span>
            {clientData.cnpj ? (
              <>
                <strong>CNPJ: </strong>
                <span>{formatCNPJ(clientData.cnpj)}</span>
              </>
            ) : (
              <>
                <strong>CPF: </strong>
                <span>{formatCPF(clientData.cpf)}</span>
              </>
            )}
          </span>

          <span>
            <strong>TELEFONE:</strong> {formatCelular(clientData.celular)}
          </span>
          <span>
            <strong>CARGO:</strong> {clientData.cargo}
          </span>
          <small>
            ESCANEIE O QRCODE PARA VERIFICAR E CONFERIR A PÁGINA OU CLIQUE NO
            LINK.
          </small>
        </div>
      </div>
    )
  );
};
