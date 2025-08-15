import React, { useState, useEffect } from "react";
import { Operador } from "./Components/Operador";
import { DadosEmpresa } from "./Components/Empresa";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Components/Styles/add.css";
import { useAuth } from "../../context/AuthContext";
import { InfoAdicionais } from "./Components/InfoAdicionais";
import { Button, Modal } from "react-bootstrap";

interface Parcela {
  valor: string;
  dataVencimento: string;
  pagamento: string
}

export const Add = () => {
  const userId = auth.currentUser?.uid;
  const { nome, cargo, equipe_msg } = useAuth();
  const [form, setForm] = useState({
    numeroContrato: "",
    data: new Date().toISOString().split("T")[0],
    dataVencimento: "",
    operador: nome,
    createdBy: userId,
    setor: cargo,
    equipeMsg: equipe_msg,
    equipe: "G MARKETING DIGITAL",
    account: "",
    razaoSocial: "",
    cpf: "",
    cnpj: "",
    nomeFantasia: "",
    enderecoComercial: "",
    bairro: "",
    numeroResidencial: "",
    zipcode: "",
    cep: "",
    estado: "",
    cidade: "",
    complemento: '',
    validade: "",
    dataVigencia: "",
    observacoes: "",
    fixo: "",
    celular: "",
    whatsapp: "",
    email1: "",
    email2: "",
    horarioFuncionamento: "",
    responsavel: "",
    cargo: "",
    valorVenda: "",
    parcelas: "1",
    valorParcelado: "",
    contrato: "",
    formaPagamento: "",
    qrcodeText: "",
    renovacaoAutomatica: "",
    linkGoogle: "",
    criacao: "",
    ctdigital: "",
    logotipo: "",
    anuncio: "",
    grupo: "",
    parcelaRecorrente: "1990",
    diaData: "",
    valorExtenso: "",
  });

  const [parcelasArray, setParcelasArray] = useState<Parcela[]>([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState("CPF");
  const [redirect, setRedirect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [novoId, setNovoId] = useState<string | null>(null);

  const [senha, setSenha] = useState("");
  const [senhaCorreta, setSenhaCorreta] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [nomeAutorizado, setNomeAutorizado] = useState("");
  const [erroNomeAutorizado, setErroNomeAutorizado] = useState("");
  const [senhaHabilitada, setSenhaHabilitada] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarTrocarSenha, setMostrarTrocarSenha] = useState(false);

  useEffect(() => {
    const fetchSenha = async () => {
      const senhaRef = doc(db, "senhas", "senhaCorreta");
      const senhaSnap = await getDoc(senhaRef);
      if (senhaSnap.exists()) {
        setSenhaCorreta(senhaSnap.data().senha);
      }
    };
    fetchSenha();
  }, []);

  const calcularDataVigencia = (data: string, validade: string): string => {
    const dataObj = new Date(data);
    let mesesAdicionar = 0;

    switch (validade) {
      case "Mensal":
        mesesAdicionar = 1;
        break;
      case "Trimestral":
        mesesAdicionar = 3;
        break;
      case "Semestral":
        mesesAdicionar = 6;
        break;
      case "Anual":
        mesesAdicionar = 12;
        break;
      default:
        return "";
    }

    dataObj.setMonth(dataObj.getMonth() + mesesAdicionar);

    const nomeMes = dataObj.toLocaleString("pt-BR", { month: "long" });
    const ano = dataObj.getFullYear();

    return `${nomeMes.toLowerCase()}/${ano}`;
  };

  useEffect(() => {
    const calcularParcelas = () => {
      const dataVencimento = form.dataVencimento;
      const contratoRecorrente = form.contrato === "Recorencia";

      if (contratoRecorrente && dataVencimento) {
        const novasParcelas: Parcela[] = [];
        const valorRecorrente = parseFloat(form.parcelaRecorrente || "0");
        const valorPrimeiraParcela = parseFloat(form.valorVenda || "0");

        const dataBase = new Date(dataVencimento);
        const diaDoMes = dataBase.getDate();

        // Primeira parcela com valor cheio
        novasParcelas.push({
          valor: Math.round(valorPrimeiraParcela).toString(),
          dataVencimento: dataBase.toISOString().split("T")[0],
          pagamento: "pendente",
        });

        // Demais parcelas (11) com valor recorrente
        for (let i = 1; i < 12; i++) {
          const dataParcela = new Date(dataBase);
          dataParcela.setMonth(dataBase.getMonth() + i);

          // Ajustar se o mês seguinte não tiver o mesmo dia (ex: fevereiro)
          if (dataParcela.getDate() !== diaDoMes) {
            dataParcela.setDate(0); // último dia do mês anterior
          }

          novasParcelas.push({
            valor: Math.round(valorRecorrente).toString(),
            dataVencimento: dataParcela.toISOString().split("T")[0],
            pagamento: "pendente",
          });
        }

        setParcelasArray(novasParcelas);
        setForm((prev) => ({
          ...prev,
          valorParcelado: Math.round(valorRecorrente).toString(),
          parcelas: "12", // atualiza para refletir na UI se necessário
        }));
      } else {
        const valorVenda = parseFloat(form.valorVenda || "0");
        const parcelas = parseInt(form.parcelas || "1");

        if (!isNaN(valorVenda)) {
          if (parcelas === 1) {
            setForm((prev) => ({
              ...prev,
              valorParcelado: Math.round(valorVenda).toString(),
            }));
            setParcelasArray([
              {
                valor: Math.round(valorVenda).toString(),
                dataVencimento: dataVencimento,
                pagamento: "pendente",
              },
            ]);
          } else {
            const valorParcela = Math.round(valorVenda / parcelas);
            setForm((prev) => ({
              ...prev,
              valorParcelado: valorParcela.toString(),
            }));

            const novasParcelas: Parcela[] = [];
            if (dataVencimento) {
              const dataBase = new Date(dataVencimento);
              const diaDoMes = dataBase.getDate();

              for (let i = 0; i < parcelas; i++) {
                const dataParcela = new Date(dataBase);
                dataParcela.setMonth(dataBase.getMonth() + i);

                if (dataParcela.getDate() !== diaDoMes) {
                  dataParcela.setDate(0); // último dia do mês anterior
                }

                novasParcelas.push({
                  valor: valorParcela.toString(),
                  dataVencimento: dataParcela.toISOString().split("T")[0],
                  pagamento: "pendente",
                });
              }
            }

            setParcelasArray(novasParcelas);
          }
        }
      }
    };

    calcularParcelas();
  }, [
    form.valorVenda,
    form.parcelas,
    form.dataVencimento,
    form.contrato,
    form.parcelaRecorrente,
  ]);

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
    setErroSenha("");
  };

  const handleNovaSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovaSenha(e.target.value);
  };

  const handleSaveWithPassword = async () => {
    if (senha === senhaCorreta) {
      if (novoId) {
        if (!nomeAutorizado) {
          setErroNomeAutorizado("O nome de quem autorizou é obrigatório.");
          return;
        }

        const dadosAtualizados = {
          ...form,
          nomeAutorizado,
          parcelasDetalhadas: parcelasArray,
        };

        try {
          const novoClienteRef = doc(db, "vendas", novoId);
          await setDoc(novoClienteRef, dadosAtualizados);
          toast.success("Cliente salvo com um novo ID!");
          handleModalClose();
          setRedirect(true);
        } catch (error) {
          console.error("Erro ao salvar os dados:", error);
          toast.error("Erro ao salvar os dados. Tente novamente.");
        }
      }
    } else {
      setErroSenha("Senha incorreta. Entre em contato com seu supervisor");
    }
  };

  const handleTrocarSenha = async () => {
    if (senha === senhaCorreta) {
      try {
        const senhaRef = doc(db, "senhas", "senhaCorreta");
        await updateDoc(senhaRef, { senha: novaSenha });
        setSenhaCorreta(novaSenha);
        setNovaSenha("");
        toast.success("Senha alterada com sucesso!");
      } catch (error) {
        console.error("Erro ao alterar a senha:", error);
        toast.error("Erro ao alterar a senha. Tente novamente.");
      }
    } else {
      setErroSenha("Senha incorreta. Não é possível alterar a senha.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

      if (name === "email1" || name === "email2") {
        updatedForm[name] = value.replace(/\s+/g, "");
      }

      if (name === "celular" || name === "whatsapp") {
        updatedForm[name] = value.replace(/\D/g, "").slice(0, 13);
      }

      if (name === "fixo") {
        updatedForm[name] = value.replace(/\D/g, "").slice(0, 10);
      }

      if ((name === "cpf" || name === "cnpj") && value.length >= 6) {
        updatedForm.numeroContrato = value.slice(0, 6);
      }

      // Atualiza a dataVigencia se 'validade' ou 'data' forem alterados
      if (name === "validade" || name === "data") {
        const validade = name === "validade" ? value : updatedForm.validade;
        const data = name === "data" ? value : updatedForm.data;
        if (validade && data) {
          updatedForm.dataVigencia = calcularDataVigencia(data, validade);
        }
      }

      return updatedForm;
    });
  };

  const handleSelectChange = (selectedOption: any) => {
    setForm({ ...form, operador: selectedOption.value });
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const sairFicha = () => {
    window.history.back();
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Gerar data e horário atual no formato: dd/mm/yyyy HH:MM
      const agora = new Date();
      const dataHorario = agora.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const dadosParaSalvar = {
        ...form,
        parcelasDetalhadas: parcelasArray,
        dataHorario, // 👈 adicionando data e hora da venda
      };

      const clienteRef = doc(db, "vendas", form.numeroContrato);
      const docSnap = await getDoc(clienteRef);

      if (docSnap.exists()) {
        setNovoId(`${form.numeroContrato}_${Date.now()}`);
        handleModalShow();
      } else {
        await setDoc(clienteRef, dadosParaSalvar);
        toast.success("Cliente salvo com sucesso!");
        setRedirect(true);
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setError("Erro ao salvar cliente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to={"/vendas"} />;
  }

  return (
    <div className="contrato text-center">
      {loading && <p>Aguarde, estamos processando...</p>}
      <div className="container">
        
        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <DadosEmpresa
              form={form}
              handleInputChange={handleInputChange}
              tipoDocumento={tipoDocumento}
            />
            
          )}
          {step === 1 && (
            <Operador
              form={form}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              operadoresOpcoes={[]}
            />
          )}

          <div className="mt-4">
            {step >= 0 && (
              <button
                type="button"
                className="btn btn-danger me-2"
                onClick={sairFicha}
              >
                Sair
              </button>
            )}
            {step > 0 && (
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={handleBack}
              >
                Voltar
              </button>
            )}

            {step < 1 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Próximo
              </button>
            )}
            {step === 1 && (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            )}
          </div>
        </form>
        <ToastContainer />
      </div>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            O número de contrato <strong>{form.numeroContrato}</strong> já
            existe. Para salvar com um novo ID, confirme sua senha abaixo:
          </p>

          <input
            type="text"
            placeholder="Nome de quem autorizou"
            value={nomeAutorizado}
            onChange={(e) => {
              setNomeAutorizado(e.target.value);
              if (e.target.value.length >= 4) {
                setSenhaHabilitada(true);
              } else {
                setSenhaHabilitada(false);
              }
            }}
            className="form-control mt-3"
          />
          {erroNomeAutorizado && (
            <p className="text-danger mt-2">{erroNomeAutorizado}</p>
          )}

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={handleSenhaChange}
            className="form-control mt-3"
            disabled={!senhaHabilitada}
          />
          {erroSenha && <p className="text-danger mt-2">{erroSenha}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveWithPassword}
            disabled={!senhaHabilitada}
          >
            Confirmar e Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
