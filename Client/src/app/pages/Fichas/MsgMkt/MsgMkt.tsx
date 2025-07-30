import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/FichaMarketing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import axios from "axios";
import { jsPDF } from "jspdf";
import { faFilePdf, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import html2pdf from "html2pdf.js";
import { InfoqrMkt } from "./Components/InfoqrMkt";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../../firebase/firebaseConfig";

export const MsgMkt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const sairFicha = () => {
    window.history.back();
  };

  const Msg = async () => {
    try {
      const celularComCodigo = `55${clientData.celular.replace(/^55/, "")}`;

      const response = await axios.post(
        "https://crm-plataform-app-6t3u.vercel.app/api/enviar-texto-mkt",
        {
          phone: celularComCodigo,
          message: `Segue o link de sua página no Google Maps:
👉🏻 ${clientData.linkGoogle}

Estamos criando o seu QR Code avaliativo e Certificado de perfil atualizado que pode ser impresso e colado em seu estabelecimento para que seus clientes possam avaliar sua empresa com ⭐⭐⭐⭐⭐ na plataforma de buscas do Google Maps. 

Além do QR-Code, vamos encaminhar uma arte personalizada que pode ser utilizada para postagem em suas redes sociais, facilitando assim a divulgação de sua empresa. 

Lembrando que  durante o período do seu plano ${clientData.validade} você pode solicitar mensalmente artes personalizadas para divulgação nas suas redes sociais e enviar mensalmente as 30 fotos e os 5 vídeos com duração de até 30 segundos, para serem incluídos em seu perfil de empresa, contribuindo assim para o aumento do seu desempenho dentro da plataforma de buscas. 📈

Assim que ficar pronto te envio aqui mesmo no WhatsApp ok.

Em caso de dúvidas, estou a disposição!`,
        }
      );
      if (response.data.success) {
        alert("Mensagem enviada com sucesso!");
        console.log("mensagem enviada")
      } else {
        alert("Falha ao enviar a mensagem.");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Ocorreu um erro ao enviar a mensagem.");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  const downloadPDFAssinatura = () => {
    const contratoElement = document.getElementById("assinatura");
    const btn = document.getElementById("btn-baixar-pdf");

    if (btn) {
      btn.style.display = "none";
    }

    if (contratoElement) {
      contratoElement.classList.add("modo-pdf");

      const rect = contratoElement.getBoundingClientRect();
      const widthInInches = rect.width / 96;
      const heightInInches = rect.height / 96;

      const opt: any = {
        margin: 0,
        filename: `${clientData.razaoSocial}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: "in",
          format: [widthInInches, heightInInches],
          orientation:
            widthInInches > heightInInches ? "landscape" : "portrait",
        },
      };

      html2pdf()
        .set(opt)
        .from(contratoElement)
        .save()
        .then(() => {
          contratoElement.classList.remove("modo-pdf");
          if (btn) btn.style.display = "flex";
        })
        .catch((error: unknown) => {
          contratoElement.classList.remove("modo-pdf");
          console.error("Erro ao gerar PDF:", error);
          alert("Houve um erro ao gerar o PDF. Tente novamente.");
          if (btn) btn.style.display = "flex";
        });
    } else {
      alert("Erro: Um ou mais elementos não foram encontrados.");
    }
  };

  const downloadPDFCertificado = () => {
    const contratoElement = document.getElementById("certificado");
    const btn = document.getElementById("btn-baixar-pdf");

    if (btn) {
      btn.style.display = "none";
    }

    if (contratoElement) {
      contratoElement.classList.add("modo-pdf");

      const rect = contratoElement.getBoundingClientRect();
      const widthInInches = rect.width / 96;
      const heightInInches = rect.height / 96;

      const opt: any = {
        margin: 0,
        filename: `${clientData.razaoSocial}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: "in",
          format: [widthInInches, heightInInches],
          orientation:
            widthInInches > heightInInches ? "landscape" : "portrait",
        },
      };

      html2pdf()
        .set(opt)
        .from(contratoElement)
        .save()
        .then(() => {
          contratoElement.classList.remove("modo-pdf");
          if (btn) btn.style.display = "flex";
        })
        .catch((error: unknown) => {
          contratoElement.classList.remove("modo-pdf");
          console.error("Erro ao gerar PDF:", error);
          alert("Houve um erro ao gerar o PDF. Tente novamente.");
          if (btn) btn.style.display = "flex";
        });
    } else {
      alert("Erro: Um ou mais elementos não foram encontrados.");
    }
  };

  return (
    clientData && (
      <div className="fichaMarketing">
        <div className="container container-mtkservice">
          <button
            className="btn btn-danger btn-sair-marketing"
            onClick={sairFicha}
          >
            <FontAwesomeIcon icon={faLeftLong} />
          </button>
          <div className="col-md-4">
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
              <button className="btn btn-primary mt-3" onClick={Msg}>
                Enviar Mensagem De Apresentação do Marketing
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="bg-mktservice">
              <div className="bg-infos-mktservice" id="assinatura">
                <div className="box-avaliacoes">
                  <p className="text-uppercase text-center ">
                    Certificamos que o comércio:
                    <span>{clientData.nomeFantasia}</span> <br />
                    Está em dia com a atualização da sua página no Google Maps e
                    conta com suporte da G MAPS CONTACT CENTER LTDA até{" "}
                    {clientData.dataVigencia} .
                  </p>
                </div>
                <InfoqrMkt />
              </div>
              <div className="btns-sections my-3" id="btn-baixar-pdf">
                <button
                  className="btn btn-danger"
                  onClick={downloadPDFAssinatura}
                >
                  <FontAwesomeIcon icon={faFilePdf} />
                  <span className="ms-1">Baixar PDF</span>
                </button>
              </div>
              <ToastContainer />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="bg-certificado">
            <div className="bg-infos-certificado" id="certificado">
              <div className="box-certificado">
                <p className="text-uppercase text-center razao-social">
                  {clientData.nomeFantasia}
                </p>
              </div>
              <div className="box-assinatura">
                <p className="text-uppercase text-center">
                  {clientData.nomeFantasia}
                </p>
              </div>
            </div>
            <div className="btns-sections my-3" id="btn-baixar-pdf">
              <button
                className="btn btn-danger"
                onClick={downloadPDFCertificado}
              >
                <FontAwesomeIcon icon={faFilePdf} />
                <span className="ms-1">Baixar PDF</span>
              </button>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    )
  );
};
