import React, { useEffect, useState } from "react";
import { HeaderDash } from "./components/header-dash";
import "../vendas/components/dashboard.css";
import "./components/dashboard.css";
import { ListDashboard } from "./components/list-dashboard";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import { endOfDay, parse, startOfDay } from "date-fns";

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
  createdBy: string;
  setor: string;
  account: string;
  whatsapp: string;
  infoCancelamento: string;
}

export const Vendas = () => {
  const [totalVendas, setTotalVendas] = useState(0);
  const [vendasDia, setVendasDia] = useState(0);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const adminUserId = process.env.REACT_APP_ADMIN_USER_ID;
  const SupervisorUserId = "wWLmbV9TIUemmTkcMUSAQ4xGlju2";
  const graziId = "nQwF9Uxh0lez9ETIOmP2gCgM0pf2";

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        const vendasCollection = collection(db, "vendas");
        const vendasSnapshot = await getDocs(vendasCollection);
        const vendasList = vendasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Venda[];
        const vendasFiltradasPorUsuario =
          userId === adminUserId ||
          userId === SupervisorUserId ||
          userId === graziId
            ? vendasList
            : vendasList.filter((venda) => venda.createdBy === userId);

        const hoje = new Date();
        const inicioDia = startOfDay(hoje).getTime();
        const fimDia = endOfDay(hoje).getTime();

        const vendasDoDia = vendasFiltradasPorUsuario.filter((venda) => {
          const vendaTimestamp = parse(venda.data, "yyyy-MM-dd", new Date()).getTime();
          return vendaTimestamp >= inicioDia && vendaTimestamp <= fimDia;
        });

        setTotalVendas(vendasFiltradasPorUsuario.length);
        setVendasDia(vendasDoDia.length);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      }
    };

    fetchVendas();
  }, [userId]);

  return (
    <div className="bg-dash">
      <div className="itens-dash">
        <HeaderDash totalVendas={totalVendas} vendasDia={vendasDia} />
        <ListDashboard setTotalVendas={setTotalVendas} />
      </div>
    </div>
  );
};
