import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import "./Relatorio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { Ranking } from "./components/Ranking";

interface Venda {
  operador: string;
  data: string;
  modelo: string;
  contrato: string;
}

interface Usuario {
  avatar: string;
  nome: string;
}

export const Relatorio: React.FC = () => {
  const [vendasDiarias, setVendasDiarias] = useState<
    (Venda & { avatar?: string })[]
  >([]);
  const [, setVendasSemanais] = useState<
    (Venda & { avatar?: string })[]
  >([]);
  const [, setVendasMensais] = useState<
    (Venda & { avatar?: string })[]
  >([]);
  const [, setVendasPorOperadorDiario] = useState<
    Record<string, number>
  >({});
  const [vendasPorOperadorSemanal, setVendasPorOperadorSemanal] = useState<
    Record<string, number>
  >({});
  const [vendasPorOperadorMensal, setVendasPorOperadorMensal] = useState<
    Record<string, number>
  >({});
  const [usuariosMap, setUsuariosMap] = useState<Record<string, Usuario>>({});
  const [usuariosPorNome, setUsuariosPorNome] = useState<
    Record<string, string>
  >({});
  const [totalBase, setTotalBase] = useState(0);
  const [totalRenovacao, setTotalRenovacao] = useState(0);
  const [totalRecorencia, setTotalRecorencia] = useState(0);
  const [currentPageBase, setCurrentPageBase] = useState(1);
  const [currentPageRenovacao, setCurrentPageRenovacao] = useState(1);
  const [currentPageRecorencia, setCurrentPageRecorencia] = useState(1);
  const itemsPerPage = 4;

  const db = getFirestore();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosCollection = collection(db, "usuarios");
      const usuariosSnapshot = await getDocs(usuariosCollection);
      const usuarios: Record<string, Usuario> = {};
      const nomeParaID: Record<string, string> = {};

      usuariosSnapshot.forEach((doc) => {
        const usuario = doc.data() as Usuario;
        usuarios[doc.id] = usuario;
        nomeParaID[usuario.nome.trim()] = doc.id;
      });

      setUsuariosMap(usuarios);
      setUsuariosPorNome(nomeParaID);
    };

    fetchUsuarios();
  }, [db]);

  useEffect(() => {
    const fetchVendas = () => {
      const vendasCollection = collection(db, "vendas");

      const unsubscribe = onSnapshot(vendasCollection, (querySnapshot) => {
        const vendasHoje: (Venda & { avatar?: string })[] = [];
        const vendasSemana: (Venda & { avatar?: string })[] = [];
        const vendasMes: (Venda & { avatar?: string })[] = [];

        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const operadoresDiario: Record<string, number> = {};
        const operadoresSemanal: Record<string, number> = {};
        const operadoresMensal: Record<string, number> = {};

        let baseCount = 0;
        let renovacaoCount = 0;
        let recorenciaCount = 0;

        const vendasMapeadas = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (Venda & { id: string })[];

        for (const venda of vendasMapeadas) {
          const usuarioID = usuariosPorNome[venda.operador] || venda.operador;
          const usuario = usuariosMap[usuarioID];

          const vendaComAvatar = { ...venda, avatar: usuario?.avatar };
          const vendaDate = new Date(`${venda.data}T03:00:00`);

          if (venda.data === todayString) {
            vendasHoje.push(vendaComAvatar);
            operadoresDiario[venda.operador] =
              (operadoresDiario[venda.operador] || 0) + 1;
          }

          if (vendaDate >= weekStart && vendaDate <= today) {
            vendasSemana.push(vendaComAvatar);
            operadoresSemanal[venda.operador] =
              (operadoresSemanal[venda.operador] || 0) + 1;
          }

          if (vendaDate >= monthStart && vendaDate <= today) {
            vendasMes.push(vendaComAvatar);
            operadoresMensal[venda.operador] =
              (operadoresMensal[venda.operador] || 0) + 1;
          }

          if (venda.data === todayString) {
            if (venda.contrato === "Base") baseCount += 1;
            else if (venda.contrato === "Renovacao") renovacaoCount += 1;
            else if (venda.contrato === "Recorencia") recorenciaCount += 1;
          }
        }

        setTotalBase(baseCount);
        setTotalRenovacao(renovacaoCount);
        setTotalRecorencia(recorenciaCount);
        setVendasDiarias(vendasHoje);
        setVendasSemanais(vendasSemana);
        setVendasMensais(vendasMes);
        setVendasPorOperadorDiario(operadoresDiario);
        setVendasPorOperadorSemanal(operadoresSemanal);
        setVendasPorOperadorMensal(operadoresMensal);
      });

      return () => unsubscribe();
    };

    if (Object.keys(usuariosMap).length > 0) {
      fetchVendas();
    }
  }, [db, usuariosMap, usuariosPorNome]);

  const rankingOperadores = Object.keys(vendasPorOperadorSemanal).map(
    (operador) => {
      const usuarioID = usuariosPorNome[operador] || operador;
      const usuario = usuariosMap[usuarioID];

      return {
        operador: operador.replace(/\./g, " "),
        imgOperador: usuario?.avatar || "https://placehold.co/600x400",
        vendasSemanal: vendasPorOperadorSemanal[operador] || 0,
        vendasMensal: vendasPorOperadorMensal[operador] || 0,
      };
    }
  );

  type TipoContrato = "base" | "renovacao" | "recorencia"; // Usando as chaves com letras minúsculas

const vendasPorOperador = vendasDiarias.reduce<
  Record<string, { base: number; renovacao: number; recorencia: number }>
>((acc, venda) => {
  const { operador, contrato } = venda;

  if (!acc[operador]) {
    acc[operador] = { base: 0, renovacao: 0, recorencia: 0 };
  }

  if (contrato === "Base") {
    acc[operador].base += 1;
  } else if (contrato === "Renovacao") {
    acc[operador].renovacao += 1;
  } else if (contrato === "Recorencia") {
    acc[operador].recorencia += 1;
  }

  return acc;
}, {});

const getTopThree = (tipo: TipoContrato) => {
  const filtrados = Object.keys(vendasPorOperador).filter((operador) => {
    if (tipo === "base") {
      return vendasPorOperador[operador].base > 0;
    } else if (tipo === "renovacao") {
      return vendasPorOperador[operador].renovacao > 0;
    } else if (tipo === "recorencia") {
      return vendasPorOperador[operador].recorencia > 0;
    }
    return false;
  });

  return filtrados
    .sort((a, b) => {
      const totalA = vendasPorOperador[a][tipo]; // Ordena apenas pelo tipo de contrato específico
      const totalB = vendasPorOperador[b][tipo]; // Ordena apenas pelo tipo de contrato específico
      return totalB - totalA; // Ordena do maior para o menor
    })
    .slice(0, 3); // Retorna os 3 primeiros
};

const topRenovacao = getTopThree("renovacao");
const topBase = getTopThree("base");
const topRecorencia = getTopThree("recorencia");

const calculateTotalPages = (contractType: "base" | "renovacao" | "recorencia") => {
  const filteredOperators = Object.keys(vendasPorOperador).filter(
    (operador) => vendasPorOperador[operador][contractType] > 0
  );
  return Math.ceil(filteredOperators.length / itemsPerPage);
};

const getOperatorsForContractType = (
  contractType: "base" | "renovacao" | "recorencia",
  currentPage: number
) => {
  const indexOfLastOperator = currentPage * itemsPerPage;
  const indexOfFirstOperator = indexOfLastOperator - itemsPerPage;

  const filteredOperators = Object.keys(vendasPorOperador)
    .filter((operador) => vendasPorOperador[operador][contractType] > 0)
    .sort((a, b) => {
      const totalA = vendasPorOperador[a][contractType];
      const totalB = vendasPorOperador[b][contractType];
      return totalB - totalA; // Ordem decrescente
    });

  return filteredOperators.slice(indexOfFirstOperator, indexOfLastOperator);
};

const currentBaseOperators = getOperatorsForContractType("base", currentPageBase);
const totalBasePages = calculateTotalPages("base");

const currentRenovacaoOperators = getOperatorsForContractType("renovacao", currentPageRenovacao);
const totalRenovacaoPages = calculateTotalPages("renovacao");

const currentRecorenciaOperators = getOperatorsForContractType("recorencia", currentPageRecorencia);
const totalRecorenciaPages = calculateTotalPages("recorencia");


  return (
    <section className="dashboard">
      <div className="bg-relatorio">
        <FontAwesomeIcon
          icon={faLeftLong}
          className="icon-back-relatorio"
          onClick={() => window.history.back()}
        />
        <div className="ranking renovacao">
          <h4 className="total-contrato">Total Renovação: {totalRenovacao}</h4>
          <div className="podio">
            {topRenovacao.map((operador, index) => {
              const avatar = usuariosMap[usuariosPorNome[operador]]?.avatar;
              return (
                <div key={operador} className={`colocacao${index + 1}`}>
                  <img
                    src={avatar}
                    alt={`${operador} Avatar`}
                    className="img-podio"
                  />
                  <span className="operador-podio">
                    {operador.replace(/\./g, " ")}
                  </span>
                  <span className="vendas-podio">
                    {vendasPorOperador[operador].renovacao}
                  </span>
                </div>
              );
            })}
          </div>
          <ul className="tabela-ranking text-center">
            {currentRenovacaoOperators.map((operador) => {
              const avatar = usuariosMap[usuariosPorNome[operador]]?.avatar;
              return (
                <li
                  key={operador}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src={avatar}
                    alt={`${operador} Avatar`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                    className="foto-ranking"
                  />
                  <span className="nome-operador">
                    {operador.replace(/\./g, " ")}
                  </span>
                  <h2 className="vendas-operador">
                    {vendasPorOperador[operador].renovacao}
                  </h2>
                </li>
              );
            })}
          </ul>
          <div className="paginacao">
            <button
              onClick={() =>
                setCurrentPageRenovacao((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPageRenovacao === 1}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </button>
            <span>
              {currentPageRenovacao} / {totalRenovacaoPages}
            </span>
            <button
              onClick={() =>
                setCurrentPageRenovacao((prev) =>
                  Math.min(prev + 1, totalRenovacaoPages)
                )
              }
              disabled={currentPageRenovacao === totalRenovacaoPages}
            >
              <FontAwesomeIcon icon={faRightLong} />
            </button>
          </div>
        </div>
        <div className="ranking base">
          <h4 className="total-contrato">Total Base: {totalBase}</h4>
          <div className="podio">
            {topBase.map((operador, index) => {
              const avatar = usuariosMap[usuariosPorNome[operador]]?.avatar;
              return (
                <div key={operador} className={`colocacao${index + 1}`}>
                  <img
                    src={avatar}
                    alt={`${operador} Avatar`}
                    className="img-podio"
                  />
                  <span className="operador-podio">
                    {operador.replace(/\./g, " ")}
                  </span>
                  <span className="vendas-podio">
                    {vendasPorOperador[operador].base}
                  </span>
                </div>
              );
            })}
          </div>
          <ul className="tabela-ranking text-center">
            {currentBaseOperators.map((operador) => {
              const avatar = usuariosMap[usuariosPorNome[operador]]?.avatar;
              return (
                <li
                  key={operador}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src={avatar}
                    alt={`${operador} Avatar`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                    className="foto-ranking"
                  />
                  <span className="nome-operador">
                    {operador.replace(/\./g, " ")}
                  </span>
                  <h2 className="vendas-operador">
                    {vendasPorOperador[operador].base}
                  </h2>
                </li>
              );
            })}
          </ul>
          <div className="paginacao">
            <button
              onClick={() =>
                setCurrentPageBase((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPageBase === 1}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </button>
            <span>
              {currentPageBase} / {totalBasePages}
            </span>
            <button
              onClick={() =>
                setCurrentPageBase((prev) => Math.min(prev + 1, totalBasePages))
              }
              disabled={currentPageBase === totalBasePages}
            >
              <FontAwesomeIcon icon={faRightLong} />
            </button>
          </div>
        </div>
        <div className="ranking base">
          <h4 className="total-contrato">
            Total Recorrência: {totalRecorencia}
          </h4>

          {/* Ordenando o topRecorencia do maior para o menor */}
          <div className="podio">
            {topRecorencia
              .sort((a, b) => {
                const vendasA = vendasPorOperador[a]?.recorencia || 0;
                const vendasB = vendasPorOperador[b]?.recorencia || 0;
                return vendasB - vendasA; // Ordenando do maior para o menor
              })
              .map((operador, index) => {
                const avatar = usuariosMap[usuariosPorNome[operador]]?.avatar;
                return (
                  <div key={operador} className={`colocacao${index + 1}`}>
                    <img
                      src={avatar}
                      alt={`${operador} Avatar`}
                      className="img-podio"
                    />
                    <span className="operador-podio">
                      {operador.replace(/\./g, " ")}
                    </span>
                    <span className="vendas-podio">
                      {vendasPorOperador[operador].recorencia}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Ordenando o currentRecorenciaOperators do maior para o menor */}
          <ul className="tabela-ranking text-center">
            {currentRecorenciaOperators
              .sort((a, b) => {
                const vendasA = vendasPorOperador[a]?.recorencia || 0;
                const vendasB = vendasPorOperador[b]?.recorencia || 0;
                return vendasB - vendasA; // Ordenando do maior para o menor
              })
              .map((operador) => {
                const avatar = usuariosMap[usuariosPorNome[operador]]?.avatar;
                return (
                  <li
                    key={operador}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <img
                      src={avatar}
                      alt={`${operador} Avatar`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                      className="foto-ranking"
                    />
                    <span className="nome-operador">
                      {operador.replace(/\./g, " ")}
                    </span>
                    <h2 className="vendas-operador">
                      {vendasPorOperador[operador].recorencia}
                    </h2>
                  </li>
                );
              })}
          </ul>

          <div className="paginacao">
            <button
              onClick={() =>
                setCurrentPageRecorencia((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPageRecorencia === 1}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </button>
            <span>
              {currentPageRecorencia} / {totalRecorenciaPages}
            </span>
            <button
              onClick={() =>
                setCurrentPageRecorencia((prev) =>
                  Math.min(prev + 1, totalRecorenciaPages)
                )
              }
              disabled={currentPageRecorencia === totalRecorenciaPages}
            >
              <FontAwesomeIcon icon={faRightLong} />
            </button>
          </div>
        </div>
      </div>
      <div className="total-vendas">
        <h4>Total de vendas: {totalBase + totalRenovacao + totalRecorencia}</h4>
      </div>
      <Ranking operadores={rankingOperadores} />
    </section>
  );
};
