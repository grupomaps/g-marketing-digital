import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEye,
  faSearch,
  faFilter,
  faPlus,
  faSync,
  faTableList,
  faX,
  faBars,
  faMoneyCheckDollar,
  faTrashAlt,
  faCheck,
  faExclamation,
  faList,
  faMarker,
  faPrint,
  faBroom,
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  setDoc,
  deleteDoc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { getAuth } from "firebase/auth";

interface Marketing {
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
  servicosConcluidos: boolean;
  createdBy: string;
  cartaApresentacao: any;
  certificado: any;
  fotosAdicionadas: any;
  telefone: any;
  endereco: any;
  redeSocial: any;
  semRedeSocial: any;
  operadorMkt: string;
  posVendaConcuida: boolean;
  monitoriaHorario: string;
}
interface ListDashboardProps {
  setTotalMarketings: (total: number) => void;
  setTotalRealizados: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({
  setTotalMarketings,
  setTotalRealizados,
}) => {
  const [marketings, setMarketings] = useState<Marketing[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [showConcluidos, setShowConcluidos] = useState(false);
  const [showIncompletos, setShowIncompletos] = useState(false);
  const [cargo, setCargo] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    dueDate: "",
    saleType: "",
    salesPerson: "",
    saleGroup: "",
  });
  const [showConcluidas, setShowConcluidas] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchMarketings = async () => {
      setLoading(true);
      try {
        const marketingsCollection = collection(db, "marketings");
        const marketingsSnapshot = await getDocs(marketingsCollection);
        const marketingsList = marketingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Marketing[];

        setMarketings(marketingsList);
        setTotalMarketings(marketingsList.length);

        const totalRealizados = marketingsList.filter(
          (marketing) => marketing.servicosConcluidos
        ).length;
        setTotalRealizados(totalRealizados);
      } catch (error) {
        console.error("Erro ao buscar marketings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketings();
  }, [setTotalMarketings, setTotalRealizados]);

  async function getUserCargo() {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.log("Usuário não está logado.");
      return null;
    }

    try {
      const userDocRef = doc(db, "usuarios", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const cargo = userData.cargo;
        console.log("Cargo do usuário:", cargo);
        return cargo;
      } else {
        console.log("Documento do usuário não encontrado.");
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar cargo do usuário:", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchVendas = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn("Usuário não está logado.");
          return;
        }

        const userId = user.uid;
        const userDocRef = doc(db, "usuarios", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.warn("Usuário não encontrado.");
          return;
        }

        const userData = userDocSnap.data();
        const cargo = userData.cargo;
        const nomeUsuario = userData.nome;
        setCargo(cargo);

        const marketingsCollection = collection(db, "marketings");
        const marketingsSnapshot = await getDocs(marketingsCollection);
        const marketingsList = marketingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Marketing[];

        let filteredVendas: Marketing[] = [];

        if (cargo === "adm" || cargo === "supervisor") {
          filteredVendas = marketingsList;
        } else if (cargo === "marketing") {
          filteredVendas = marketingsList.filter(
            (marketing) =>
              !marketing.operadorMkt ||
              marketing.operadorMkt.trim() === "" ||
              marketing.operadorMkt === nomeUsuario
          );
        } else {
          filteredVendas = marketingsList.filter(
            (marketing) => marketing.createdBy === userId
          );
        }

        setMarketings(filteredVendas);
        setTotalMarketings(filteredVendas.length);
      } catch (error) {
        console.error("Erro ao buscar marketings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendas();
  }, [setTotalMarketings, auth]);

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
      return newSelectedItems;
    });
  };

  const openModalExclusao = () => setModalExclusao(true);
  const closeModalExclusao = () => setModalExclusao(false);

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) return;

    const deletePromises = Array.from(selectedItems).map(async (id) => {
      const marketingDoc = doc(db, "marketings", id);
      const vendaData = (await getDoc(marketingDoc)).data();

      if (vendaData) {
        await setDoc(doc(db, "cancelados", id), {
          ...vendaData,
          deletedAt: new Date(),
        });
      }

      await deleteDoc(marketingDoc);
    });

    await Promise.all(deletePromises);

    setSelectedItems(new Set());
  };

  const applyFilters = () => {
    let filteredClients = marketings.filter((marketing) => {
      const lowerCaseTerm = activeSearchTerm.toLowerCase();
      const matchesSearchTerm =
        (marketing.cnpj &&
          marketing.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.cpf &&
          marketing.cpf.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.responsavel &&
          marketing.responsavel.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.email1 &&
          marketing.email1.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.email2 &&
          marketing.email2.toLowerCase().includes(lowerCaseTerm)) ||
        (marketing.operador &&
          marketing.operador.toLowerCase().includes(lowerCaseTerm));

      const { startDate, endDate, dueDate, saleType, salesPerson } = filters;

      const marketingData = new Date(marketing.data);
      const isStartDateValid = startDate
        ? marketingData.toDateString() === new Date(startDate).toDateString()
        : true;

      const isDateInRange =
        startDate && endDate
          ? marketingData >= new Date(startDate) &&
            marketingData <= new Date(endDate)
          : isStartDateValid;

      const marketingDataVencimento = new Date(marketing.dataVencimento);
      const isDueDateValid = dueDate
        ? marketingDataVencimento.toDateString() ===
          new Date(dueDate).toDateString()
        : true;

      const issaleTypeValid = saleType ? marketing.contrato === saleType : true;
      const issalesPersonValid = salesPerson
        ? marketing.operador === salesPerson
        : true;

      return (
        matchesSearchTerm &&
        isDateInRange &&
        isDueDateValid &&
        issaleTypeValid &&
        issalesPersonValid
      );
    });

    if (showConcluidas) {
      filteredClients = filteredClients.filter(
        (marketing) => !marketing.servicosConcluidos
      );
    }

    return filteredClients;
  };

  const handleSearchClick = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
  };
  const filteredClients = applyFilters();
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openModalExcel = () => setModalExcel(true);
  const closeModalExcel = () => setModalExcel(false);

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    localStorage.setItem("vendaFilters", JSON.stringify(newFilters));
    setModalExcel(false);
  };

  useEffect(() => {
    const savedFilters = localStorage.getItem("vendaFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  const formatCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .substring(0, 18);
  };

  const isChecklistConcluido = (marketing: Marketing) => {
    return (
      marketing.cartaApresentacao &&
      marketing.certificado &&
      marketing.fotosAdicionadas &&
      marketing.telefone &&
      marketing.endereco &&
      (marketing.redeSocial || marketing.semRedeSocial)
    );
  };
  const isPosVendaConcuida = (marketing: Marketing) => {
    return !!marketing.posVendaConcuida;
  };

  const toggleConcluidos = () => {
    setShowConcluidos(!showConcluidos);
    setShowIncompletos(false);
  };

  const toggleIncompletos = () => {
    setShowIncompletos(!showIncompletos);
    setShowConcluidos(false);
  };

  const mostrarTodos = () => {
    setShowConcluidos(false);
    setShowIncompletos(false);
  };

  const filteredClientss = currentClients.filter((marketing) => {
    const completo = isChecklistConcluido(marketing);

    if (showConcluidos) return completo;
    if (showIncompletos) return !completo;
    return true;
  });

  return (
    <div className="list-dashboard">
      {modalExcel && (
        <ModalExcel
          onClose={closeModalExcel}
          onApplyFilters={handleApplyFilters}
        />
      )}

      {modalExclusao && (
        <div className="modal-overlay">
          <div className="modal-exclusao">
            <div className="modal-header">
              <h2>Excluir Item</h2>
              <button
                className="close-btn"
                onClick={() => setModalExclusao(false)}
              >
                &#10006;
              </button>
            </div>
            <div className="modal-body">
              <p>Tem certeza de que deseja excluir este item?</p>
            </div>
            <div className="modal-footer">
              <button
                className="planilha-btn"
                onClick={() => {
                  handleRemoveSelected();
                  closeModalExclusao();
                }}
              >
                Confirmar
              </button>
              <button className="remove-btn" onClick={closeModalExclusao}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="header-list">
        <div className="header-content">
          <h2>Marketing</h2>
          <div className="search-container">
            <button
              className="search-button"
              onClick={handleSearchClick}
              data-tooltip-id="search-tooltip"
              data-tooltip-content="Pesquisar"
            >
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <Tooltip
                id="search-tooltip"
                place="top"
                className="custom-tooltip"
              />
            </button>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
            />
          </div>
          <div className="selects-container">
            <Link
              to="/add"
              className="create-btn"
              data-tooltip-id="tooltip-add"
              data-tooltip-content="Adicionar nova venda"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Link>

            <button
              className="filtros-btn"
              onClick={openModalExcel}
              data-tooltip-id="tooltip-filter"
              data-tooltip-content="Aplicar filtros"
            >
              <FontAwesomeIcon icon={faFilter} color="#fff" />
            </button>

            <button
              className="filtros-btn"
              data-tooltip-id="clear-tooltip"
              data-tooltip-content="Limpar filtros"
              onClick={() => {
                setFilters({
                  startDate: "",
                  endDate: "",
                  dueDate: "",
                  saleType: "",
                  salesPerson: "",
                  saleGroup: "",
                });
                localStorage.removeItem("vendaFilters");
              }}
            >
              <FontAwesomeIcon icon={faBroom} color="#fff" />
              <Tooltip
                id="clear-tooltip"
                place="top"
                className="custom-tooltip"
              />
            </button>

            <button
              className="btn-concluidos"
              onClick={toggleConcluidos}
              data-tooltip-id="tooltip-concluidos"
              data-tooltip-content={
                showConcluidos
                  ? "Fechar concluídos"
                  : "Mostrar apenas concluídos"
              }
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>

            <button
              className="btn-incompletos"
              onClick={toggleIncompletos}
              data-tooltip-id="tooltip-incompletos"
              data-tooltip-content={
                showIncompletos
                  ? "Fechar incompletos"
                  : "Mostrar apenas incompletos"
              }
            >
              <FontAwesomeIcon icon={faExclamation} />
            </button>

            {/* <button
              className="planilha-btn"
              onClick={handleSyncClients}
              disabled={syncLoading}
              data-tooltip-id="tooltip-sync"
              data-tooltip-content={
                syncLoading ? "Sincronizando..." : "Sincronizar clientes"
              }
            >
              <FontAwesomeIcon icon={faSync} color="#fff" spin={syncLoading} />
            </button> */}

            {cargo === "adm" && (
              <button
                onClick={openModalExclusao}
                className="remove-btn"
                data-tooltip-id="remove-tooltip"
                data-tooltip-content="Remover selecionados"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                <Tooltip
                  id="remove-tooltip"
                  place="top"
                  className="custom-tooltip"
                />
              </button>
            )}
            <Tooltip
              id="tooltip-concluidos"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-incompletos"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-todos"
              place="top"
              className="custom-tooltip"
            />
            {/* Tooltips */}
            <Tooltip id="tooltip-add" place="top" className="custom-tooltip" />
            <Tooltip
              id="tooltip-filter"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-close"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-view-all"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip id="tooltip-sync" place="top" className="custom-tooltip" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : filteredClients.length === 0 ? (
        <div className="no-clients">Nenhum cliente encontrado.</div>
      ) : (
        <>
          <table className="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th>Realizado</th>
                <th>CNPJ</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Operador</th>
                <th>Monitor</th>
                <th>Encaminhamento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredClientss.map((marketing) => {
                const checklistCompleto = isChecklistConcluido(marketing);
                const serviçoIniciado =
                  checklistCompleto || marketing.servicosConcluidos;
                console.log("posVendaConcuida:", marketing.posVendaConcuida);

                return (
                  <tr key={marketing.id}>
                    <td
                      className={
                        selectedItems.has(marketing.id) ? "selected" : ""
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.has(marketing.id)}
                        onChange={() => handleCheckboxChange(marketing.id)}
                        className="checkbox-table"
                      />
                    </td>
                    <td
                      className={`text-center ${
                        selectedItems.has(marketing.id) ? "selected" : ""
                      }`}
                    >
                      {isPosVendaConcuida(marketing) ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          color="green"
                          title="Concluída"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          color="red"
                          title="Pendente"
                        />
                      )}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(marketing.id) ? "selected" : ""
                      } ${
                        serviçoIniciado
                          ? checklistCompleto
                            ? "servicos-realizados"
                            : "servicos-incompletos"
                          : ""
                      }`}
                    >
                      {marketing.cnpj
                        ? formatCNPJ(marketing.cnpj)
                        : marketing.cpf
                        ? formatCPF(marketing.cpf)
                        : marketing.cnpj || marketing.cpf}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(marketing.id) ? "selected" : ""
                      } ${
                        marketing.servicosConcluidos
                          ? "servicos-realizados"
                          : ""
                      }`}
                    >
                      {marketing.responsavel}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(marketing.id) ? "selected" : ""
                      } ${
                        marketing.servicosConcluidos
                          ? "servicos-realizados"
                          : ""
                      }`}
                    >
                      {marketing.email1 || marketing.email2}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(marketing.id) ? "selected" : ""
                      } ${
                        marketing.servicosConcluidos
                          ? "servicos-realizados"
                          : ""
                      }`}
                    >
                      {marketing.operador.replace(/\./g, " ")}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(marketing.id) ? "selected" : ""
                      } ${
                        marketing.servicosConcluidos
                          ? "servicos-realizados"
                          : ""
                      }`}
                    >
                      {marketing.nomeMonitor}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(marketing.id) ? "selected" : ""
                      } ${
                        marketing.servicosConcluidos
                          ? "servicos-realizados"
                          : ""
                      }`}
                    >
                      {marketing.monitoriaHorario}
                    </td>
                    <td className="icon-container">
                      <Link
                        to={`/contrato/${marketing.id}`}
                        data-tooltip-id="tooltip-view-contract"
                        data-tooltip-content="Visualizar contrato"
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          className="icon-spacing text-dark"
                        />
                      </Link>

                      <Link
                        to={`/fichamarketing/${marketing.id}`}
                        data-tooltip-id="tooltip-marketing-file"
                        data-tooltip-content="Ficha de marketing"
                      >
                        <FontAwesomeIcon
                          icon={faTableList}
                          className="icon-spacing text-dark"
                        />
                      </Link>
                      <Link to={`/fichaboleto/${marketing.id}`}>
                        <FontAwesomeIcon
                          icon={faMoneyCheckDollar}
                          className="icon-spacing text-dark"
                          data-tooltip-id="tooltip-boleto"
                          data-tooltip-content="Ver ficha de boleto"
                        />
                        <Tooltip
                          id="tooltip-boleto"
                          place="top"
                          className="custom-tooltip"
                        />
                      </Link>
                      <Link to={`/fichamsgmarketing/${marketing.id}`}>
                        <FontAwesomeIcon
                          icon={faMarker}
                          className="icon-spacing text-dark"
                          data-tooltip-id="tooltip-msg"
                          data-tooltip-content="Ver ficha de mensagem"
                        />
                        <Tooltip
                          id="tooltip-msg"
                          place="top"
                          className="custom-tooltip"
                        />
                      </Link>
                      <Link
                        to={`/fichaposVenda/${marketing.id}`}
                        data-tooltip-id="tooltip-posVenda-file"
                        data-tooltip-content="Ficha de posVenda"
                      >
                        <FontAwesomeIcon
                          icon={faTableList}
                          className="icon-spacing text-dark"
                          data-tooltip-id="tooltip-pos"
                          data-tooltip-content="Acessar ficha Pós Venda"
                        />
                        <Tooltip
                          id="tooltip-pos"
                          place="top"
                          className="custom-tooltip"
                        />
                      </Link>
                      {/* <Link to={`/assinatura/${marketing.id}`}>
                        <FontAwesomeIcon
                          icon={faPrint}
                          className="icon-spacing text-dark"
                          data-tooltip-id="tooltip-assinatura"
                          data-tooltip-content="Visualizar Assinatura"
                        />
                        <Tooltip
                          id="tooltip-assinatura"
                          place="top"
                          className="custom-tooltip"
                        />
                      </Link> */}

                      <Tooltip
                        id="tooltip-view-contract"
                        place="top"
                        className="custom-tooltip"
                      />
                      <Tooltip
                        id="tooltip-marketing-file"
                        place="top"
                        className="custom-tooltip"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <ToastContainer />
          </div>
        </>
      )}
    </div>
  );
};
