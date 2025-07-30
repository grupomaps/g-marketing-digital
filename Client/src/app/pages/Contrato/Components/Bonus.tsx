import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebaseConfig";
import { QRCodeSVG } from "qrcode.react";

export const Bonus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);

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

  const formatDateToBrazilian = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatValor = (value: string): string => {
    return value.replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1,$2");
  };

  return (
    clientData && (
      <div className="bonus card text-center p-4">
        <h5 className="text-white ">DECLARAÇÃO DE CIÊNCIA E AUTORIZAÇÃO</h5>
        {/* <div className="d-flex justify-content-center my-1">
          {clientData.criacao === "sim" && (
            <div className="mx-2">
              <strong
                style={{
                  color: "red",
                }}
              >
                Criação
              </strong>
            </div>
          )}
          {clientData.anuncio === "sim" && (
            <div className="mx-2">
              <strong
                style={{
                  color: "red",
                }}
              >
                Anúncio
              </strong>
            </div>
          )}
          {clientData.ctdigital === "sim" && (
            <div className="mx-2">
              <strong
                style={{
                  color: "red",
                }}
              >
                Cartão Digital
              </strong>
            </div>
          )}
          {clientData.logotipo === "sim" && (
            <div className="mx-2">
              <strong
                style={{
                  color: "red",
                }}
              >
                Logotipo
              </strong>
            </div>
          )}
        </div> */}

        <div className="form-group">
          <p className="text-uppercase">
            <strong>
              Declaro, para os devidos fins, que recebi por ligação telefônica
              todas as informações referentes ao plano contratado, incluindo
              condições, valores e forma de execução do serviço.
              <br /> Autorizo a empresa G.MAPS CONTACT CENTER LTDA a realizar toda a assessoria e otimização do perfil da minha empresa no Google Maps, conforme as condições descritas neste documento.
            </strong>
          </p>
        </div>

        <div className="assinatura-section pt-5">
          <div className="linha-assinatura"></div>
        </div>

        {/* <h5 className="mt-2">CENTRAL DE ATENDIMENTO</h5>
        <div>
          <p>0800 580 2766</p>
          <p>
            <a href="mailto:MARKETING@GRUPOMAPSEMPRESAS.com.br">
              MARKETING@GRUPOMAPSEMPRESAS.com.br
            </a>
            <br />
            <a href="mailto:CONTATO@GRUPOMAPSEMPRESAS.com.br">
              CONTATO@GRUPOMAPSEMPRESAS.com.br
            </a>
          </p>
        </div> */}


        {/* <p>PARA ATENDIMENTO VIA WHATSAPP BASTA CLICAR NO ÍCONE ABAIXO:</p>
        <a
          href="https://wa.link/ulgll4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/img/img-wpp-contrato.webp"
            alt="WhatsApp"
            style={{ width: "170px" }}
          />
        </a> */}
      </div>
    )
  );
};
