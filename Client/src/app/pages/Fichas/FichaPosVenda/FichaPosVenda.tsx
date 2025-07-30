import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketingForm } from "./Components/PosVendaForm";
import "./Styles/FichaMarketing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import axios from "axios";
import { jsPDF } from "jspdf";
import ConfirmModal from "../components/ConfirmModal";

export const FichaPosVenda: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [pendingFinanceiroData, setPendingFinanceiroData] = useState<any>(null);
  const navigate = useNavigate();

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

  const handleMarketingSubmit = async (data: any) => {
    try {
      if (id) {
        const docRef = doc(db, "vendas", id);
        await updateDoc(docRef, data);
        setClientData(data);
        console.log("Dados atualizados com sucesso!");

        if (data.posVendaConcuida) {
          await adicionarClienteFinanceiro(data);
        }

        navigate("/novomarketing");
      }
    } catch (error) {
      console.error("Erro ao atualizar os dados de marketing: ", error);
    }
  };

  const adicionarClienteFinanceiro = async (data: any) => {
    try {
      const financeirosRef = doc(db, "financeiros", id!);
      const financeirosSnap = await getDoc(financeirosRef);

      if (financeirosSnap.exists()) {
        // Em vez de window.confirm, mostramos o modal
        setPendingFinanceiroData(data);
        setShowModalConfirm(true);
        // Se já existe, pede confirmação para adicionar como cópia
        const confirmacao = window.confirm(
          "Este cliente já existe na coleção financeiros. Deseja adicionar como uma nova cópia?"
        );

        if (confirmacao) {
          let copyNumber = 1;
          let newId = `${id}_copia${copyNumber}`;
          let newDocRef = doc(db, "financeiros", newId);

          while ((await getDoc(newDocRef)).exists()) {
            copyNumber++;
            newId = `${id}_copia${copyNumber}`;
            newDocRef = doc(db, "financeiros", newId);
          }

          // Adiciona o documento com o novo ID
          await setDoc(newDocRef, {
            ...data,
            originalId: id, // Mantém referência ao ID original
            isCopy: true,
            copyNumber: copyNumber,
          });

          console.log(`Cliente adicionado como cópia com ID: ${newId}`);
        }
      } else {
        await setDoc(financeirosRef, data);
        console.log("Cliente adicionado à coleção financeiros");
      }
    } catch (error) {
      console.error("Erro ao adicionar cliente aos financeiros: ", error);
    }
  };

  const handleConfirmDuplicateFinanceiro = async () => {
    if (!pendingFinanceiroData) return;

    let copyNumber = 1;
    let newId = `${id}_copia${copyNumber}`;
    let newDocRef = doc(db, "financeiros", newId);

    while ((await getDoc(newDocRef)).exists()) {
      copyNumber++;
      newId = `${id}_copia${copyNumber}`;
      newDocRef = doc(db, "financeiros", newId);
    }

    await setDoc(newDocRef, {
      ...pendingFinanceiroData,
      originalId: id,
      isCopy: true,
      copyNumber: copyNumber,
    });

    console.log(`Cliente adicionado como cópia com ID: ${newId}`);
    setShowModalConfirm(false);
    setPendingFinanceiroData(null);
  };

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
//   const MsgParcela = async () => {
//     try {
//       const celularComCodigo = `55${clientData.celular.replace(/^55/, "")}`;

//       const response = await axios.post(
//         "https://crm-plataform-app-6t3u.vercel.app/api/enviar-texto",
//         {
//           phone: celularComCodigo,
//           message: `Olá,  ${clientData.responsavel}

// Seja bem vindo, ao Grupo Maps! 

// Conforme conversamos via ligação, já iniciamos o processo de atualização de sua página na plataforma de buscas do Google Maps e seu plano conosco já está ATIVO.

// Seu plano ${clientData.validade} de R$ ${formatValor(
//             clientData.valorVenda
//           )} a ser pago em ${
//             clientData.parcelas
//           } parcela(s) de R$ ${formatValor(
//             clientData.valorParcelado
//           )}, via boleto, ficou com o vencimento para o dia ${formatDateToBrazilian(
//             clientData.dataVencimento
//           )}.

// O protocolo de seu atendimento é:
// 402462535

// Abaixo, o termo de uso/autorização para assessoria em divulgação no site Google Maps e prestação dos nossos serviços. 

// Os serviços a serem prestados serão; 

// 1- Criação ou Atualização da página na Plataforma de buscas do Google Maps.

// 2- Criação do Qr-Code Direcionador 

// 3 - PACK com 3 artes para divulgação nas redes sociais.

// 4 - Suporte para Criação de anúncios Patrocinados no Google Ads.

// 5 - Adição de 5 bairros para ampliar a visibilidade da página.

// 6 - Correção do pino localizador do estabelecimento.

// 7 - Inclusão de 30 fotos e 5 vídeos mensalmente.

// 8 - Alteração de endereço 

// 9 - Alteração no horário de funcionamento.

// 10 - Logotipo personalizada 

// Todos os serviços mencionados acima ⬆ estão inclusos no plano contratado.

// Importante ressaltar que para um trabalho bem elaborado é de extrema importância a comunicação com nosso departamento de marketing.


// Em caso de desistência será cobrado o valor proporcional dos serviços executados, conforme descrito em cláusula do contrato.

// Em caso de dúvidas, estou a disposição ou entre em contato com a central de atendimento 0800 580 2766`,
//         }
//       );
//       if (response.data.success) {
//         alert("Mensagem enviada com sucesso!");
//       } else {
//         alert("Falha ao enviar a mensagem.");
//       }
//     } catch (error) {
//       console.error("Erro ao enviar mensagem:", error);
//       alert("Ocorreu um erro ao enviar a mensagem.");
//     }
//   };

//   const MsgValorCheio = async () => {
//     try {
//       const celularComCodigo = `55${clientData.celular.replace(/^55/, "")}`;

//       const response = await axios.post(
//         "https://crm-plataform-app-6t3u.vercel.app/api/enviar-texto",
//         {
//           phone: celularComCodigo,
//           message: `Olá,  ${clientData.responsavel}

// Seja bem vindo, ao Grupo Maps! 

// Conforme conversamos via ligação, já iniciamos o processo de atualização de sua página na plataforma de buscas do Google Maps e seu plano conosco já está ATIVO.

// Seu plano *${clientData.validade}* de R$ ${formatValor(
//             clientData.valorVenda
//           )} a ser pago em via boleto, ficou com o vencimento para o dia ${formatDateToBrazilian(
//             clientData.dataVencimento
//           )}.

// O protocolo de seu atendimento é:
// 402462535

// Abaixo, o termo de uso/autorização para assessoria em divulgação no site Google Maps e prestação dos nossos serviços. 

// Os serviços a serem prestados serão; 

// 1- Criação ou Atualização da página na Plataforma de buscas do Google Maps.

// 2- Criação do Qr-Code Direcionador 

// 3 - PACK com 3 artes para divulgação nas redes sociais.

// 4 - Suporte para Criação de anúncios Patrocinados no Google Ads.

// 5 - Adição de 5 bairros para ampliar a visibilidade da página.

// 6 - Correção do pino localizador do estabelecimento.

// 7 - Inclusão de 30 fotos e 5 vídeos mensalmente.

// 8 - Alteração de endereço 

// 9 - Alteração no horário de funcionamento.

// 10 - Logotipo personalizada 

// Todos os serviços mencionados acima ⬆ estão inclusos no plano contratado.

// Importante ressaltar que para um trabalho bem elaborado é de extrema importância a comunicação com nosso departamento de marketing.


// Em caso de desistência será cobrado o valor proporcional dos serviços executados, conforme descrito em cláusula do contrato.

// Em caso de dúvidas, estou a disposição ou entre em contato com a central de atendimento 0800 580 2766`,
//         }
//       );

//       if (response.data.success) {
//         alert("Mensagem enviada com sucesso!");
//       } else {
//         alert("Falha ao enviar a mensagem.");
//       }
//     } catch (error) {
//       console.error("Erro ao enviar mensagem:", error);
//       alert("Ocorreu um erro ao enviar a mensagem.");
//     }
//   };

//   const MsgRecorrencia = async () => {
//     try {
//       const celularComCodigo = `55${clientData.celular.replace(/^55/, "")}`;

//       const response = await axios.post(
//         "https://crm-plataform-app-6t3u.vercel.app/api/enviar-texto",
//         {
//           phone: celularComCodigo,
//           message: `Olá,  ${clientData.responsavel}

// Seja bem vindo, ao Grupo Maps! 

// Conforme conversamos via ligação, já iniciamos o processo de atualização de sua página na plataforma de buscas do Google Maps seu plano conosco já está ATIVO.

// Apenas reforçando que a adesão do seu plano *${
//             clientData.validade
//           }*  ficou no valor de R$ ${formatValor(
//             clientData.valorVenda
//           )} a ser pago via boleto, ficou com o vencimento para o dia ${formatDateToBrazilian(
//             clientData.dataVencimento
//           )}.

// Lembrando que as demais 11 parcelas de R$ 19,90 ficou com vencimento para todo dia ${
//             clientData.diaData
//           } de cada mês 

// O protocolo de seu atendimento é:
// 402462535

// Abaixo, o termo de uso/autorização para assessoria em divulgação no site Google Maps e prestação dos nossos serviços. 

// Os serviços a serem prestados serão; 

// 1- Criação ou Atualização da página na Plataforma de buscas do Google Maps.

// 2- Criação do Qr-Code Direcionador 

// 3 - PACK com 3 artes para divulgação nas redes sociais.

// 4 - Suporte para Criação de anúncios Patrocinados no Google Ads.

// 5 - Adição de 5 bairros para ampliar a visibilidade da página.

// 6 - Correção do pino localizador do estabelecimento.

// 7 - Inclusão de 30 fotos e 5 vídeos mensalmente.

// 8 - Alteração de endereço 

// 9 - Alteração no horário de funcionamento.

// 10 - Logotipo personalizada 

// Todos os serviços mencionados acima ⬆ estão inclusos no plano contratado.

// Importante ressaltar que para um trabalho bem elaborado é de extrema importância a comunicação com nosso departamento de marketing.


// Em caso de desistência será cobrado o valor proporcional dos serviços executados, conforme descrito em cláusula do contrato.

// Em caso de dúvidas, estou a disposição ou entre em contato com a central de atendimento 0800 580 2766`,
//         }
//       );
//       if (response.data.success) {
//         alert("Mensagem enviada com sucesso!");
//       } else {
//         alert("Falha ao enviar a mensagem.");
//       }
//     } catch (error) {
//       console.error("Erro ao enviar mensagem:", error);
//       alert("Ocorreu um erro ao enviar a mensagem.");
//     }
//   };

  // const MsgLink = async () => {
  //   try {
  //     const celularComCodigo = `55${clientData.celular.replace(/^55/, "")}`;

  //     const response = await axios.post(
  //       "https://crm-plataform-app-6t3u.vercel.app/api/enviar-texto",
  //       {
  //         phone: celularComCodigo,
  //         message: `https://youtube.com/shorts/_EgS6OVUgEA`,
  //       }
  //     );

  //     if (response.data.success) {
  //       alert("Mensagem enviada com sucesso!");
  //     } else {
  //       alert("Falha ao enviar a mensagem.");
  //     }
  //   } catch (error) {
  //     console.error("Erro ao enviar mensagem:", error);
  //     alert("Ocorreu um erro ao enviar a mensagem.");
  //   }
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
                {/* {clientData.parcelas >= 2 && (
                  <button className="btn btn-primary mt-3" onClick={MsgParcela}>
                    Enviar Mensagem De Apresentação de Vendas Parceladas
                  </button>
                )}
                {clientData.contrato !== "Recorencia" &&
                  clientData.parcelas <= 1 && (
                    <button
                      className="btn btn-primary mt-3"
                      onClick={MsgValorCheio}
                    >
                      Enviar Mensagem De Apresentação de Vendas Sem Parcelas
                    </button>
                  )}
                {clientData.contrato === "Recorencia" &&
                  clientData.parcelas <= 1 && (
                    <button
                      className="btn btn-primary mt-3"
                      onClick={MsgRecorrencia}
                    >
                      Enviar Mensagem De Apresentação de Vendas com Recorrência
                    </button>
                  )} */}
              </div>
            </div>
            <div className="col-md-6">
              <MarketingForm
                form={clientData}
                onSubmit={handleMarketingSubmit}
              />
            </div>
          </div>
        </div>
        <ConfirmModal
          show={showModalConfirm}
          title="Duplicar Cliente"
          onCancel={() => {
            setShowModalConfirm(false);
            setPendingFinanceiroData(null);
          }}
          onConfirm={handleConfirmDuplicateFinanceiro}
          message="Este cliente já está na lista de financeiro. Deseja fazer uma cópia dele?"
        />
      </div>
    )
  );
};
