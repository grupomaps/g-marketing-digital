import React, { FC, useEffect, useState } from "react";
import "./Styles/assinatura.css";
import { Header } from "./Components/Header";
import { DadosEmpresa } from "./Components/DadosEmpresa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faFilePdf,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import html2pdf from "html2pdf.js";
import { Infoqr } from "./Components/Infoqr";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export const Assinatura: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [desconto, setDesconto] = useState<string>("");
  const [descontoAtualizado, setDescontoAtualizado] = useState<string>("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "vendas", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data());
            setDesconto(docSnap.data().desconto || "");
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

  const downloadPDF = () => {
    const contratoElement = document.getElementById("assinatura");
    const btn = document.getElementById("btn-baixar-pdf");

    if (btn) {
      btn.style.display = "none";
    }

    if (contratoElement) {
      const opt = {
        margin: 0.5,
        filename: `${clientData.razaoSocial}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .set(opt)
        .from(contratoElement)
        .save()
        .then(() => {
          if (btn) {
            btn.style.display = "flex";
          }
        })
        .catch((error: unknown) => {
          console.error("Erro ao gerar PDF:", error);
          alert("Houve um erro ao gerar o PDF. Tente novamente.");

          if (btn) {
            btn.style.display = "flex";
          }
        });
    } else {
      alert("Erro: Um ou mais elementos não foram encontrados.");
    }
  };

  function formatValor(valor: string) {
    let valorFormatado = valor.replace(/\D/g, "");
    if (valorFormatado.length <= 2) {
      return valorFormatado;
    }
    valorFormatado = valorFormatado.replace(/(\d{2})$/, ",$1");
    return valorFormatado.replace(/(\d)(?=(\d{3})+(\,|$))/g, "$1.");
  }

  const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");

    if (valor === "") {
      setDesconto("");
      return;
    }

    while (valor.length < 3) {
      valor = "0" + valor;
    }

    const centavos = valor.slice(-2);
    let reais = valor.slice(0, -2).replace(/^0+/, "");

    if (reais === "") reais = "0";

    const reaisFormatado = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const formatado = `${reaisFormatado},${centavos}`;

    setDesconto(formatado);
  };

  const handleAtualizarDesconto = async () => {
    if (id && desconto) {
      const docRef = doc(db, "vendas", id);

      const valorLimpo = desconto.replace(/\D/g, "");

      try {
        await updateDoc(docRef, {
          desconto: valorLimpo,
        });
        setDescontoAtualizado(desconto);
        console.log("Desconto atualizado no Firestore");
        toast.success(`Desconto aplicado de R$${desconto}`);
      } catch (error) {
        console.error("Erro ao atualizar o desconto no Firestore:", error);
      }
    }
  };

  return (
    clientData && (
      <div className="bg-assinatura">
        <div className="bg-infos-contrato" id="assinatura">
          <Header />
          <DadosEmpresa />
          <Infoqr />

          <div>
            <p className="text-uppercase text-center">
              <FontAwesomeIcon icon={faCheck} /> DECLARO TER RECEBIDO ATRAVÉS DA
              LIGAÇÃO TODAS INFORMÇÕES REFERENTE AO MEU PLANO CONTRATADO
              CONFORME GRAVAÇÃO DO ATENDIMENTO. MEU PLANO ESCOLHIDO É O{" "}
              {clientData.validade} COM VIGÊNCIA ATÉ {clientData.dataVigencia},{" "}
              {clientData.parcelas <= 1
                ? `O VALOR DO SERVIÇO CONTRATADO É DE
               R$ ${formatValor(clientData.valorVenda)} CUJO VENCIMENTO
              FICOU PARA O DIA
              
                ${new Date(
                  clientData.dataVencimento + "T00:00:00"
                ).toLocaleDateString("pt-BR")}
              
              .`
                : `O VALOR DO SERVIÇO CONTRATADO É DE
               R$ ${formatValor(clientData.valorVenda)} DIVIDIDO EM ${
                    clientData.parcelas
                  } PARCELAS DE R$ ${formatValor(clientData.valorParcelado)}, CUJO PRIMEIRO VENCIMENTO
              FICOU PARA O DIA
              
                ${new Date(
                  clientData.dataVencimento + "T00:00:00"
                ).toLocaleDateString("pt-BR")}
              
              E OS OUTROS VENCIMENTOS PARA O DIA ${
                clientData.diaData
              } SUBSEQUENTE DOS PRÓXIMOS MESES.`}
            </p>

            {/* <p className="text-center">
            CIENTE QUE AO EFETUAR O PAGAMENTO ATÉ O DIA DO VENCIMENTO CONFORME
            MENCIONADO ACIMA IREI RECEBER UM DESCONTO DE{" "}
            <span className="fw-bold">
              R$
              <input
                type="text"
                id="desconto"
                className="form-control w-25 mx-auto"
                placeholder="Ex: 1500 para R$ 15,00"
                value={formatValor(desconto)}
                onChange={handleDescontoChange}
                style={{
                  maxWidth: "120px",
                  display: "inline-block",
                  border: "none",
                  paddingLeft: "0px",
                  fontWeight: "bold",
                }}
              />
            </span>
          </p> */}

            <p className="text-center">
              AUTORIZO QUE A EMPRESA CONTRATADA REALIZE TODA ASSESSORIA PARA
              OTIMIZAÇÃO DO PERIL EM MINHA PÁGINA DO GOOGLE MAPS, CIENTE DE
              TODAS INFORMAÇÕES PRESENTES NESTE DOCUMENTO.
            </p>

            <div className="assinatura-section pt-3">
              <p className="text-center">
                <strong>Assinatura:</strong>
              </p>
              <div className="linha-assinatura"></div>
            </div>
          </div>
          <div className="btns-sections my-3" id="btn-baixar-pdf">
            <button className="btn btn-danger" onClick={downloadPDF}>
              <FontAwesomeIcon icon={faFilePdf} />
              <span className="ms-1">Baixar PDF</span>
            </button>
            {/* <button className="btn btn-primary" onClick={handleAtualizarDesconto}>
            <FontAwesomeIcon icon={faFloppyDisk} />{" "}
            <span className="ms-1">Atualizar</span>
          </button> */}
          </div>
        </div>

        <ToastContainer />
      </div>
    )
  );
};
