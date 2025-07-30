import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";

interface CampoLinkContratoProps {
  idVenda?: string;
}

function CampoLinkContrato({ idVenda }: CampoLinkContratoProps) {
  const [linkContratoAssinado, setLinkContratoAssinado] = useState("");
  const [linkParaAssinatura, setLinkParaAssinatura] = useState("");
  const [carregandoParaAssinatura, setCarregandoParaAssinatura] = useState(false);
  const [carregandoContratoAssinado, setCarregandoContratoAssinado] = useState(false);

  useEffect(() => {
    if (!idVenda) return;

    const fetchLinksContrato = async () => {
      try {
        const docRef = doc(db, "vendas", idVenda);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.contratoAssinado) setLinkContratoAssinado(data.contratoAssinado);
          if (data.linkParaAssinatura) setLinkParaAssinatura(data.linkParaAssinatura);
        }
      } catch (error) {
        console.error("Erro ao buscar links do contrato:", error);
      }
    };

    fetchLinksContrato();
  }, [idVenda]);

  const salvarLinkParaAssinatura = async () => {
    if (!linkParaAssinatura) {
      alert("Insira o link para assinatura.");
      return;
    }
    if (!idVenda) {
      alert("ID da venda não encontrado.");
      return;
    }

    try {
      setCarregandoParaAssinatura(true);
      const docRef = doc(db, "vendas", idVenda);
      await updateDoc(docRef, {
        linkParaAssinatura: linkParaAssinatura,
      });
      toast.success("Link para assinatura salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar o link para assinatura:", error);
      alert("Erro ao salvar o link para assinatura no banco de dados.");
    } finally {
      setCarregandoParaAssinatura(false);
    }
  };

  const salvarLinkContratoAssinado = async () => {
    if (!linkContratoAssinado) {
      alert("Insira o link do contrato assinado.");
      return;
    }
    if (!idVenda) {
      alert("ID da venda não encontrado.");
      return;
    }

    try {
      setCarregandoContratoAssinado(true);
      const docRef = doc(db, "vendas", idVenda);
      await updateDoc(docRef, {
        contratoAssinado: linkContratoAssinado,
      });
    toast.success("Link do contrato assinado salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar o link do contrato assinado:", error);
      alert("Erro ao salvar o link do contrato assinado no banco de dados.");
    } finally {
      setCarregandoContratoAssinado(false);
    }
  };

  return (
  <div className="col-md-12 card p-3">
    <div className="row">
      <div className="col-md-6 mb-4">
        <label htmlFor="linkParaAssinatura" className="form-label fw-bold">
          Link para assinatura do contrato
        </label>
        <input
          type="url"
          className="form-control"
          id="linkParaAssinatura"
          placeholder="https://exemplo.com/assinar-contrato"
          value={linkParaAssinatura}
          onChange={(e) => setLinkParaAssinatura(e.target.value)}
        />
        <button
          className="btn btn-primary mt-2 w-100"
          onClick={salvarLinkParaAssinatura}
          disabled={carregandoParaAssinatura}
        >
          {carregandoParaAssinatura ? "Salvando..." : "Salvar link para assinatura"}
        </button>
      </div>

      <div className="col-md-6 mb-4">
        <label htmlFor="linkContratoAssinado" className="form-label fw-bold">
          Link do contrato assinado
        </label>
        <input
          type="url"
          className="form-control"
          id="linkContratoAssinado"
          placeholder="https://exemplo.com/contrato-assinado"
          value={linkContratoAssinado}
          onChange={(e) => setLinkContratoAssinado(e.target.value)}
        />
        <button
          className="btn btn-success mt-2 w-100"
          onClick={salvarLinkContratoAssinado}
          disabled={carregandoContratoAssinado}
        >
          {carregandoContratoAssinado ? "Salvando..." : "Salvar link do contrato assinado"}
        </button>
      </div>
    </div>
    <ToastContainer />
  </div>
);

}

export default CampoLinkContrato;
