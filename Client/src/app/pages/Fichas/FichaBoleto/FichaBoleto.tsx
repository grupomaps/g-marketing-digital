import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/FichaBoleto.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import BoletosGerados from "./componentes/boletoCard";

interface BoletoData {
  barcode: string;
  billetLink: string;
  expireAt: string;
  pdfLink: string;
  status: string;
  chargeId: string;
  pix: string;
  link: string;
}

export const FichaBoleto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);
  const [boletoDataList, setBoletoDataList] = useState<BoletoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingBoleto, setGeneratingBoleto] = useState(false);
  const [showRecorrencia, setShowRecorrencia] = useState(false);

  const fetchClientData = useCallback(async () => {
    if (!id) return;

    try {
      const docRef = doc(db, "vendas", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setClientData(data);
        setBoletoDataList(Array.isArray(data.boleto) ? data.boleto : []);
      } else {
        console.error("Cliente não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do cliente:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const NomeRecorrente = clientData?.responsavel
    ? `R - ${clientData.responsavel}`
    : "Nome Padrão";

  const generateBoletos = async (url: string, isCpf: boolean) => {
    setGeneratingBoleto(true);

    try {
      if (!clientData || !clientData.parcelas) {
        throw new Error("Dados do cliente ou número de parcelas ausentes.");
      }

      const boletosGerados: BoletoData[] = [];

      let vencimentoBase;
      try {
        vencimentoBase = new Date(clientData.dataVencimento);
        if (isNaN(vencimentoBase.getTime())) {
          throw new Error("Data de vencimento inválida.");
        }
      } catch (error) {
        console.error("Erro ao processar data de vencimento:", error);
        throw new Error("Erro no formato da data de vencimento.");
      }

      const diaVencimento = vencimentoBase.getDate();

      for (let i = 0; i < clientData.parcelas; i++) {
        try {
          const vencimento = new Date(vencimentoBase);
          vencimento.setMonth(vencimento.getMonth() + i);
          vencimento.setDate(diaVencimento);
          if (vencimento.getDate() !== diaVencimento) {
            vencimento.setDate(0);
            vencimento.setDate(diaVencimento);
          }

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer <ACCESS_TOKEN>`,
            },
            body: JSON.stringify({
              ...(isCpf
                ? {
                    name:
                      clientData.contrato === "Recorencia"
                        ? NomeRecorrente
                        : clientData.responsavel,
                    cpf: clientData.cpf,
                    birth: "1977-01-15",
                  }
                : {
                    juridical_person: {
                      corporate_name: clientData.razaoSocial,
                      cnpj: clientData.cnpj,
                    },
                  }),
              email: clientData.email1,
              phone_number: clientData.celular,
              address: {
                street: clientData.enderecoComercial,
                number: clientData.numeroResidencial,
                neighborhood: clientData.bairro,
                zipcode: clientData.cep,
                city: clientData.cidade,
                complement: "",
                state: clientData.estado,
              },
              items: [
                {
                  name: clientData.validade,
                  value: Number(
                    clientData.parcelas === 1
                      ? clientData.valorVenda
                      : clientData.valorParcelado
                  ),
                  amount: 1,
                },
              ],
              account: clientData.equipeMsg,
              dataVencimento: vencimento.toISOString().split("T")[0],
            }),
          });

          if (!response.ok) {
            const responseData = await response.json();

            console.error(
              `🔴 Erro detalhado da API (status ${response.status}):`,
              responseData
            );

            const detalhes =
              responseData?.detalhes?.description ||
              responseData?.detalhes?.error ||
              responseData?.message ||
              "Erro desconhecido";

            throw new Error(`Erro na API: ${detalhes}`);
          }

          const result = await response.json();
          const { data } = result;

          if (
            !data?.barcode ||
            !data?.billet_link ||
            !data?.pdf?.charge ||
            !data?.expire_at ||
            !data?.link
          ) {
            throw new Error("Resposta da API incompleta.");
          }

          boletosGerados.push({
            barcode: data.barcode,
            pix: data.pix?.qrcode || "N/A",
            billetLink: data.billet_link,
            expireAt: vencimento.toISOString(),
            pdfLink: data.pdf.charge,
            status: data.status,
            chargeId: data.charge_id,
            link: data.link,
          });
        } catch (error) {
          console.error(`Erro ao gerar boleto da parcela ${i + 1}:`, error);
          throw new Error(`Falha ao gerar boleto da parcela ${i + 1}.`);
        }
      }

      try {
        const docRef = doc(db, "vendas", id!);
        await updateDoc(docRef, { boleto: boletosGerados });
      } catch (error) {
        console.error("Erro ao salvar boletos no Firestore:", error);
        throw new Error("Falha ao atualizar boletos no banco de dados.");
      }

      setBoletoDataList(boletosGerados);
      setShowRecorrencia(true);
      toast.success("Boletos gerados com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar boletos:", error);

      // Se o erro for um Error, exibe a mensagem detalhada (com erro da API)
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro desconhecido.");
      }
    } finally {
      setGeneratingBoleto(false);
    }
  };

  const generateBoletosRecorrencia = async (url: string, isCpf: boolean) => {
    setGeneratingBoleto(true);

    try {
      if (!clientData || !clientData.parcelas) {
        throw new Error("Dados do cliente ou número de parcelas ausentes.");
      }

      const boletosGerados: BoletoData[] = [];
      let vencimentoBase;

      try {
        vencimentoBase = new Date(clientData.dataVencimento);
        if (isNaN(vencimentoBase.getTime())) {
          throw new Error("Data de vencimento inválida.");
        }
      } catch (error) {
        console.error("Erro ao processar data de vencimento:", error);
        throw new Error("Erro no formato da data de vencimento.");
      }

      // Verificar se contrato é "Recorencia" e gerar boletos extras
      if (clientData.contrato === "Recorencia") {
        let vencimentoRecorrencia = new Date(vencimentoBase);

        for (let i = 0; i < 11; i++) {
          try {
            vencimentoRecorrencia.setMonth(
              vencimentoRecorrencia.getMonth() + 1
            );

            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer <ACCESS_TOKEN>`,
              },
              body: JSON.stringify({
                ...(isCpf
                  ? {
                      name: NomeRecorrente,
                      cpf: clientData.cpf,
                      birth: "1977-01-15",
                    }
                  : {
                      juridical_person: {
                        corporate_name: clientData.razaoSocial,
                        cnpj: clientData.cnpj,
                      },
                    }),
                email: clientData.email1,
                phone_number: clientData.celular,
                address: {
                  street: clientData.enderecoComercial,
                  number: clientData.numeroResidencial,
                  neighborhood: clientData.bairro,
                  zipcode: clientData.cep,
                  city: clientData.cidade,
                  complement: "",
                  state: clientData.estado,
                },
                items: [
                  {
                    name: "Superte G Maps",
                    value: 1990,
                    amount: 1,
                  },
                ],
                account: clientData.equipeMsg,
                dataVencimento: vencimentoRecorrencia
                  .toISOString()
                  .split("T")[0],
              }),
            });

            if (!response.ok) {
              const responseData = await response.json();
              throw new Error(
                `Erro na API (Recorrência): ${
                  response.status
                } - ${JSON.stringify(responseData)}`
              );
            }

            const result = await response.json();
            const { data } = result;

            if (
              !data?.barcode ||
              !data?.billet_link ||
              !data?.pdf?.charge ||
              !data?.expire_at ||
              !data?.link
            ) {
              throw new Error("Resposta da API incompleta (Recorrência).");
            }

            boletosGerados.push({
              barcode: data.barcode,
              pix: data.pix?.qrcode || "N/A",
              billetLink: data.billet_link,
              expireAt: vencimentoRecorrencia.toISOString(),
              pdfLink: data.pdf.charge,
              status: data.status,
              chargeId: data.charge_id,
              link: data.link,
            });
          } catch (error) {
            console.error(
              `Erro ao gerar boleto da recorrência ${i + 1}:`,
              error
            );
            throw new Error(`Falha ao gerar boleto da recorrência ${i + 1}.`);
          }
        }
      }

      // Obtenha os boletos originais antes de adicionar os recorrentes
      const boletosOriginais = boletoDataList;

      // Combinar os boletos originais e os recorrentes
      const boletosCombinados = [...boletosOriginais, ...boletosGerados];

      // Atualizar boletos no Firestore
      try {
        const docRef = doc(db, "vendas", id!);
        await updateDoc(docRef, { boleto: boletosCombinados });
      } catch (error) {
        console.error("Erro ao salvar boletos no Firestore:", error);
        throw new Error("Falha ao atualizar boletos no banco de dados.");
      }

      setBoletoDataList(boletosCombinados);
      toast.success("Boletos gerados com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar boletos:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro desconhecido."
      );
    } finally {
      setGeneratingBoleto(false);
    }
  };

  const fetchBoletoDetails = async (chargeId: string) => {
    try {
      if (!chargeId || !clientData?.account) {
        throw new Error("ID do boleto ou conta não fornecidos.");
      }

      // Requisição para buscar os detalhes do boleto
      const response = await fetch(
        `https://crm-plataform-app-6t3u.vercel.app/v1/charge/${chargeId}?account=${clientData.account}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer <ACCESS_TOKEN>`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Erro ao buscar informações do boleto.");

      const boletoDetails = await response.json();
      console.log("Detalhes do boleto:", boletoDetails);

      const updatedBoletos = boletoDataList.map((boleto) =>
        boleto.chargeId === chargeId
          ? { ...boleto, status: boletoDetails.status }
          : boleto
      );

      setBoletoDataList(updatedBoletos);
      const docRef = doc(db, "vendas", id!);
      await updateDoc(docRef, {
        boleto: updatedBoletos,
      });

      toast.success("Informações do boleto carregadas e status atualizado!");
    } catch (error: any) {
      console.error("Erro ao buscar informações do boleto:", error.message);
      toast.error(error.message || "Erro ao buscar as informações do boleto.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  const sairFicha = () => window.history.back();

  return (
    clientData && (
      <div className="fichaBoleto">
        <div className="container flex-column d-flex">
          <button
            className="btn btn-danger btn-sair-marketing"
            onClick={sairFicha}
          >
            <FontAwesomeIcon icon={faLeftLong} />
          </button>
          <div
            className={`boletos-container ${
              boletoDataList.length >= 12 ? "with-twelve" : ""
            }`}
          >
            {boletoDataList.length === 0 ? (
              <>
                <div className="row align-center justify-content-center text-center text-white">
                  <div className="text-cpf">
                    <p>
                      <b>O cliente possui o CPF:</b>{" "}
                      {clientData.cpf || "Não informado"}
                    </p>
                  </div>
                  <div className="text-cnpj">
                    <p>
                      <b>O cliente possui o CNPJ:</b>{" "}
                      {clientData.cnpj || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-5">
                  {["CPF", "CNPJ"].map((type, idx) => (
                    <div
                      key={type}
                      className="flex-column justify-content-center d-flex align-items-center gap-3 box-boleto"
                    >
                      <h2 className="text-center">
                        Clique no botão abaixo para gerar os boletos com {type}.
                      </h2>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          generateBoletos(
                            `https://crm-plataform-app-6t3u.vercel.app/generate-boleto-${type.toLowerCase()}`,
                            idx === 0
                          )
                        }
                        disabled={generatingBoleto}
                      >
                        {generatingBoleto
                          ? "Gerando Boletos..."
                          : `Gerar Boletos com ${type}`}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowRecorrencia(true)}
                >
                  Disponibilizar Boletos Recorrentes
                </button>
                <BoletosGerados
                  boletoDataList={boletoDataList}
                  fetchBoletoDetails={fetchBoletoDetails}
                  key={boletoDataList[0].chargeId}
                />
                {showRecorrencia && clientData.contrato === "Recorencia" && (
                  <div className="flex-column justify-content-center d-flex align-items-center gap-3 box-boleto">
                    <h2 className="text-center">
                      Clique no botão abaixo para gerar os boletos recorrentes.
                    </h2>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        generateBoletosRecorrencia(
                          `https://crm-plataform-app-6t3u.vercel.app/generate-boleto-${
                            clientData.cpf ? "cpf" : "cnpj"
                          }`,
                          !!clientData.cpf
                        )
                      }
                      disabled={generatingBoleto}
                    >
                      {generatingBoleto
                        ? "Gerando Boletos Recorrentes..."
                        : "Gerar Boletos Recorrentes"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    )
  );
};
