import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebaseConfig";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export const Infoqr: React.FC = () => {
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
      <div className="bonus  text-center gravacao">
        <h5 className="text-center text-uppercase">
          Visualize sua página no Google
        </h5>
        <div className="img-google">
          <img
            src={require("../../../Assets/logo-google.png")}
            alt="WhatsApp"
            style={{ width: "50px" }}
          />
        </div>
        <div className="qrcode-google">
          {clientData.linkGoogle && (
            <div className="d-flex flex-column align-items-center ">
              <p className="">
                Escanei o QrCOde Para Verificar e conferir a página ou clique no
                link:
              </p>
              <QRCodeSVG
                value={clientData.linkGoogle}
                size={70}
                className=" mb-1 qr-image"
              />
              <p className="">
                Link da Página:{" "}
                <a href={`${clientData.linkGoogle}`}>{clientData.linkGoogle}</a>
              </p>
            </div>
          )}
        </div>
        {/* <div className="termos-servico">
          <p className="">
            <a href="https://drive.google.com/file/d/1JKeU06Ep7XzwfNS1mz1FjQ2xe7NxaqWK/view?usp=sharing">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="https://drive.google.com/file/d/1xTe9gL84D79-0OaayMUQPhiy3GFidxYO/view?usp=sharing">
              Política de Privacidade
            </a>
          </p>
        </div> */}

        {/* <h5 className="mt-2 text-center">CENTRAL DE ATENDIMENTO</h5>
        <div className="text-center">
          <p>
            0800 580 2766
            <br />
            <a href="mailto:MARKETING@GRUPOMAPSEMPRESAS.com.br">
              MARKETING@GRUPOMAPSEMPRESAS.com.br
            </a>
            <br />
            <a href="mailto:CONTATO@GRUPOMAPSEMPRESAS.com.br">
              CONTATO@GRUPOMAPSEMPRESAS.com.br
            </a>
          </p>
        </div> */}
        <h5 className="text-white cond-pagamento">CONDIÇÕES DE PAGAMENTO</h5>
        <div className="d-flex align-items-center check-termos">
          <p className="mb-0 ms-1 ">
            <FontAwesomeIcon icon={faCheckCircle} color="#007bff" size="lg" />
            {"  "}
            DECLARO TER RECEBIDO ATRAVÉS DA LIGAÇÃO TODAS INFORMAÇÕES REFERENTE
            AO PLANO CONTRATADO
            {clientData.renovacaoAutomatica === "nao" &&
              ", SEM RENOVAÇÃO AUTOMÁTICA"}
            .
          </p>
        </div>
        <div className="form-group-info">
          <p className="text-uppercase text-pagamento">
            {clientData.parcelas <= 1 &&
              (clientData.contrato === "Base" ||
                clientData.contrato === "Renovacao") && (
                <strong>
                  O plano escolhido é o{" "}
                  <u className="">{clientData.validade}</u>, com vigencia até{" "}
                  {clientData.dataVigencia}
                  <br />o valor do plano é de{" "}
                  <u>
                    R${" "}
                    {clientData.valorVenda
                      ? formatValor(clientData.valorVenda)
                      : ""}
                  </u>{" "}
                  , cujo vencimento ficou para o dia{" "}
                  {formatDateToBrazilian(clientData.dataVencimento)}.
                  {clientData.renovacaoAutomatica === "sim" && (
                    <>
                      <br />
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        color="#007bff"
                        size="lg"
                      />
                      {"  "}
                      RENOVAÇÃO AUTOMATICA.{" "}
                    </>
                  )}
                  <br /> AUTORIZO QUE A EMPRESA CONTRATADA REALIZE TODA
                  ASSESSORIA PARA OTIMIZAÇÃO DO PERFIL EM MINHA PAGINA DO GOOGLE
                  MAPS, E ESTOU CIENTE DE TODAS INFORMAÇÕES PRESENTES NESTE
                  DOCUMENTO.
                </strong>
              )}
            {clientData.parcelas > 1 &&
              clientData.contrato === "Recorencia" && (
                <strong>
                  O plano escolhido é o{" "}
                  <u className="">{clientData.validade}</u>, com vigencia até{" "}
                  {clientData.dataVigencia} <br />o valor do plano é de{" "}
                  <u>
                    R${" "}
                    {clientData.valorVenda
                      ? formatValor(clientData.valorVenda)
                      : ""}
                  </u>{" "}
                  , cujo vencimento ficou para o dia{" "}
                  {formatDateToBrazilian(clientData.dataVencimento)}. E suas
                  parcelas recorrentes no valor de{" "}
                  <u>
                    R${" "}
                    {clientData.parcelaRecorrente
                      ? formatValor(clientData.parcelaRecorrente)
                      : ""}
                  </u>{" "}
                  com vencimento para o dia {clientData.diaData} dos meses
                  subsequentes.
                  {clientData.renovacaoAutomatica === "sim" && (
                    <>
                      <br />
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        color="#007bff"
                        size="lg"
                      />
                      {"  "}
                      RENOVAÇÃO AUTOMATICA.{" "}
                    </>
                  )}
                  <br /> AUTORIZO QUE A EMPRESA CONTRATADA REALIZE TODA
                  ASSESSORIA PARA OTIMIZAÇÃO DO PERFIL EM MINHA PAGINA DO GOOGLE
                  MAPS, E ESTOU CIENTE DE TODAS INFORMAÇÕES PRESENTES NESTE
                  DOCUMENTO.
                </strong>
              )}
            {clientData.parcelas > 1 &&
              (clientData.contrato === "Base" ||
                clientData.contrato === "Renovacao") && (
                <strong>
                  O plano escolhido é o{" "}
                  <u className="">{clientData.validade}</u>, com vigencia até{" "}
                  {clientData.dataVigencia} <br />o valor do plano é de{" "}
                  <u>
                    R${" "}
                    {clientData.valorVenda
                      ? formatValor(clientData.valorVenda)
                      : ""}
                  </u>{" "}
                  , parcelado em {clientData.parcelas} parcela(s) de{" "}
                  <u>
                    R${" "}
                    {clientData.valorParcelado
                      ? formatValor(clientData.valorParcelado)
                      : ""}
                  </u>{" "}
                  com primeiro vencimento para o dia{" "}
                  {formatDateToBrazilian(clientData.dataVencimento)}. E suas
                  parcelas com vencimento para o dia {clientData.diaData} dos
                  meses subsequentes.
                  {clientData.renovacaoAutomatica === "sim" && (
                    <>
                      <br />
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        color="#007bff"
                        size="lg"
                      />
                      {"  "}
                      RENOVAÇÃO AUTOMATICA.{" "}
                    </>
                  )}
                  <br /> AUTORIZO QUE A EMPRESA CONTRATADA REALIZE TODA
                  ASSESSORIA PARA OTIMIZAÇÃO DO PERFIL EM MINHA PAGINA DO GOOGLE
                  MAPS, E ESTOU CIENTE DE TODAS INFORMAÇÕES PRESENTES NESTE
                  DOCUMENTO.
                </strong>
              )}
          </p>
        </div>
        <div className="assinatura-section justify-content-center d-flex flex-column">
          <div className="assinatura-section justify-content-center d-flex flex-column">
            <div className="linha-assinatura mt-5"></div>
          </div>
        </div>

        {/* <div className="boleto-container">
          <div className="boleto-logo">
            <img src={require("../../../Assets/logo-efi.png")} alt="EFI Pay" />
          </div>
          <div className="boleto-header">
            <div className="boleto-info">
              <div className="header-boleto">
                <p className="mt-1">
                  Código do boleto: <br />
                  {clientData.boleto?.[0]?.barcode}
                </p>
                <p className="mt-1">
                  Link do boleto: <br />
                  <a href={clientData.boleto?.[0]?.billetLink}>
                    {clientData.boleto?.[0]?.billetLink}
                  </a>
                </p>
              </div>
              <div className="code-boleto">
                <p className="mt-1">
                  QrCode para pagamento:
                  {clientData.boleto?.[0]?.pix && (
                    <div className="mt-1">
                      <QRCodeSVG
                        value={clientData.boleto?.[0]?.pix}
                        size={80}
                      />
                    </div>
                  )}
                </p>
              </div>
              <p className="mt-1">
                <a href={clientData.boleto?.[0]?.link}>
                  {clientData.boleto?.[0]?.link}
                </a>
              </p>
              <p className="mt-1">
                Data de vencimento:{" "}
                {formatDateToBrazilian(clientData.dataVencimento)}
              </p>
            </div>
          </div>
        </div> */}
        {/* <h5 className="text-white">GRAVAÇÃO</h5>
        <div className="form-group-info">
          <p>
            <strong>
              ACEITE REALIZADO DE FORMA VERBAL;
              <br />
              PARA VERIFICAR SUA ADESÃO CLIQUE NO BOTÃO A BAIXO OU ESCANEIE O
              QRCODE DA GRAVAÇÃO
            </strong>
          </p>
        </div>
        <div className="qrcode-container">
          <a
            href={clientData.linkGravacao}
            target="_blank"
            rel="noopener noreferrer"
            className="qrcode-link"
          >
            <img
              src={require("../../../Assets/play.png")}
              alt="WhatsApp"
              style={{ width: "80px" }}
            />
            {clientData.linkGravacao && (
              <div className="qrcode">
                <QRCodeSVG value={clientData.linkGravacao} size={90} />
              </div>
            )}
          </a>
        </div>
        <div className="linha-assinatura mt-5"></div>

        <h5 className="mt-2">CENTRAL DE ATENDIMENTO</h5>
        <div className="text-center">
          <p>
            0800 580 2766
            <br />
            <a href="mailto:MARKETING@GRUPOMAPSEMPRESAS.com.br">
              MARKETING@GRUPOMAPSEMPRESAS.com.br
            </a>
            <br />
            <a href="mailto:CONTATO@GRUPOMAPSEMPRESAS.com.br">
              CONTATO@GRUPOMAPSEMPRESAS.com.br
            </a>
          </p>
        </div> */}
      </div>
    )
  );
};
