import React, { useEffect, useState } from "react";
import { HeaderDash } from "./components/header-dash";
import "../monitoria/components/dashboard.css";
import { ListDashboard } from "./components/list-dashboard";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

interface Venda {
  id: string;
  cnpj: string;
  cpf: string;
  responsavel: string;
  email1: string;
  email2: string;
  operador: string;
  data: string;
  dataVencimento: string;
  contrato: string;
  nomeMonitor: string;
  monitoriaConcluidaYes: boolean;
  observacaoYes: boolean;
}



export const Monitoria = () => {
    const [totalVendas, setTotalVendas] = useState(0);
  const [totalRealizados, setTotalRealizados] = useState(0);
  const [totalRealizadosDiario, setTotalRealizadosDiario] = useState(0);
  const [totalPendentesDiario, setTotalPendentesDiario] = useState(0);


  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const adminUserId = process.env.REACT_APP_ADMIN_USER_ID;
  const SupervisorUserId = "wWLmbV9TIUemmTkcMUSAQ4xGlju2";
  const graziId = "nQwF9Uxh0lez9ETIOmP2gCgM0pf2";

   useEffect(() => {
    const fetchVendas = async () => {
      try {
        const vendasSnapshot = await getDocs(collection(db, "vendas"));
        const vendasList = vendasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Venda[];

        setTotalVendas(vendasList.length);

        const realizadas = vendasList.filter((v) => v.monitoriaConcluidaYes === true);
        setTotalRealizados(realizadas.length);

        const hojeStr = new Date().toISOString().split("T")[0];

        const realizadasHoje = realizadas.filter((v) => v.data === hojeStr);
        const pendentesHoje = vendasList.filter(
          (v) => v.data === hojeStr && v.monitoriaConcluidaYes !== true
        );

        setTotalRealizadosDiario(realizadasHoje.length);
        setTotalPendentesDiario(pendentesHoje.length);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      }
    };

    fetchVendas();
  }, []);

  return (
    <div className="bg-dash">
      <div className="itens-dash">
       <HeaderDash
          totalVendas={totalVendas}
          totalRealizados={totalRealizados}
          totalRealizadosDiario={totalRealizadosDiario}
          totalPendentesDiario={totalPendentesDiario}
        />
        <ListDashboard setTotalVendas={setTotalVendas} setTotalRealizados={setTotalRealizados} />
      </div>
    </div>
  );
};
