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
  faBalanceScaleLeft,
  faPrint,
  faBroom,
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
  addDoc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { getAuth } from "firebase/auth";

interface PosVenda {
  id: string;
  vendaId: string;
  cnpj: string;
  cpf: string;
  responsavel: string;
  email1: string;
  email2: string;
  operador: string;
  data: string;
  dataVencimento: string;
  contrato: string;
  operadorPosVenda: string;
  posVendaConcuida: boolean;
  nomeMonitor: string;
  monitoriaConcluidaYes: boolean;
  servicosConcluidos: boolean;
  createdBy: string;
}

interface venda {
  id: string;
  cnpj: string;
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
}

interface ListDashboardProps {
  setTotalPosVenda: (total: number) => void;
  setTotalRealizadosPosVenda: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({
  setTotalPosVenda,
  setTotalRealizadosPosVenda,
}) => {
  const [posVenda, setPosVenda] = useState<PosVenda[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    dueDate: "",
    saleType: "",
    salesPerson: "",
    saleGroup: ""
  });
  const [showConcluidas, setShowConcluidas] = useState(false);

  // useEffect(() => {
  //   const fetchvendas = async () => {
  //     setLoading(true);
  //     try {
  //       const vendasCollection = collection(db, "vendas");
  //       const vendasSnapshot = await getDocs(vendasCollection);
  //       const vendasList = vendasSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       })) as PosVenda[];

  //       setPosVenda(vendasList);
  //       setTotalPosVenda(vendasList.length);

  //       const totalRealizados = vendasList.filter(
  //         (venda) => venda.monitoriaConcluidaYes
  //       ).length;
  //       setTotalRealizados(totalRealizados);
  //     } catch (error) {
  //       console.error("Erro ao buscar vendas para o pós venda:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchvendas();
  // }, [setTotalPosVenda, setTotalRealizados]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const adminUserId = process.env.REACT_APP_ADMIN_USER_ID;
  const SupervisorUserId = "wWLmbV9TIUemmTkcMUSAQ4xGlju2";

  const handleSyncClients = async () => {
    setSyncLoading(true);
    try {
      const vendasCollection = collection(db, "marketings");
      const vendasSnapshot = await getDocs(vendasCollection);
      const vendasList = vendasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as venda[];

      const syncedvendas = vendasList.filter(
        (venda) => venda.servicosConcluidos
      );

      const batch = writeBatch(db);
      for (const venda of syncedvendas) {
        const marketingDocRef = doc(db, "posVendas", venda.id);
        batch.set(marketingDocRef, venda, { merge: true });
      }

      await batch.commit();

      const posVendaSnapshot = await getDocs(collection(db, "posVendas"));
      const posVendaList = posVendaSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PosVenda[];

      setPosVenda(posVendaList);
      setTotalPosVenda(posVendaList.length);
    } catch (error) {
      console.error("Erro ao sincronizar clientes:", error);
      toast.error("Erro na sincronização!");
    } finally {
      setSyncLoading(false);
    }
  };

  console.log("PosVenda:", posVenda);

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
      const marketingDoc = doc(db, "posVenda", id);
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

    setPosVenda((prevVendas) => {
      return prevVendas.filter((posVenda) => !selectedItems.has(posVenda.id));
    });
    setSelectedItems(new Set());
  };

  const applyFilters = () => {
    let filteredClients = posVenda.filter((posVenda) => {
      const lowerCaseTerm = activeSearchTerm.toLowerCase();
      const matchesSearchTerm =
        (posVenda.cnpj &&
          posVenda.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
        (posVenda.cpf && posVenda.cpf.toLowerCase().includes(lowerCaseTerm)) ||
        (posVenda.responsavel &&
          posVenda.responsavel.toLowerCase().includes(lowerCaseTerm)) ||
        (posVenda.email1 &&
          posVenda.email1.toLowerCase().includes(lowerCaseTerm)) ||
        (posVenda.email2 &&
          posVenda.email2.toLowerCase().includes(lowerCaseTerm)) ||
        (posVenda.operador &&
          posVenda.operador.toLowerCase().includes(lowerCaseTerm));

      const { startDate, endDate, dueDate, saleType, salesPerson } = filters;

      const posVendaData = new Date(posVenda.data);
      const isStartDateValid = startDate
        ? posVendaData.toDateString() === new Date(startDate).toDateString()
        : true;

      const isDateInRange =
        startDate && endDate
          ? posVendaData >= new Date(startDate) &&
            posVendaData <= new Date(endDate)
          : isStartDateValid;

      const posVendaDataVencimento = new Date(posVenda.dataVencimento);
      const isDueDateValid = dueDate
        ? posVendaDataVencimento.toDateString() ===
          new Date(dueDate).toDateString()
        : true;

      const issaleTypeValid = saleType ? posVenda.contrato === saleType : true;
      const issalesPersonValid = salesPerson
        ? posVenda.operador === salesPerson
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
        (marketing) => !marketing.posVendaConcuida
      );
    }

    return filteredClients;
  };

  const handleSearchClick = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1); // Resetar para a primeira página ao realizar nova pesquisa
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
    localStorage.setItem("vendaFilters", JSON.stringify(newFilters)); // ← salvar no localStorage
    setModalExcel(false);
  };

  useEffect(() => {
    const savedFilters = localStorage.getItem("vendaFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  const toggleConcluido = () => {
    setShowConcluidas(!showConcluidas);
  };

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  // Função para formatar o CNPJ (visual)
  const formatCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .substring(0, 18);
  };

  useEffect(() => {
    const fetchPosVenda = async () => {
      setLoading(true);
      try {
        const posVendaCollection = collection(db, "posVendas");
        const posVendaSnapshot = await getDocs(posVendaCollection);
        const posVendaList = posVendaSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PosVenda[];

        setPosVenda(posVendaList);
        setTotalPosVenda(posVendaList.length);

        const totalRealizados = posVendaList.filter(
          (posVenda) => posVenda.posVendaConcuida
        ).length;
        setTotalRealizadosPosVenda(totalRealizados);
      } catch (error) {
        console.error("Erro ao buscar marketings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosVenda();
  }, [setTotalPosVenda, setTotalRealizadosPosVenda]);

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
          <h2>Pós Venda</h2>
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

            {/* <button
              className="filtros-btn"
              onClick={syncVendasParaPosVenda}
              data-tooltip-id="tooltip-filter"
              data-tooltip-content="Aplicar filtros"
            >
              <FontAwesomeIcon icon={faBalanceScaleLeft} color="#fff" />
            </button> */}

            {showConcluidas ? (
              <button
                className="remove-btn"
                onClick={toggleConcluido}
                data-tooltip-id="tooltip-close"
                data-tooltip-content="Fechar concluídas"
              >
                <FontAwesomeIcon icon={faX} color="#fff" />
              </button>
            ) : (
              <button
                className="clear-btn"
                onClick={toggleConcluido}
                data-tooltip-id="tooltip-view-all"
                data-tooltip-content="Ver todas"
              >
                <FontAwesomeIcon icon={faBars} color="#fff" />
              </button>
            )}

            {userId === adminUserId && (
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
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>CNPJ</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Operador</th>
                <th>Operador Pós Venda</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((posVenda) => (
                <tr key={posVenda.id}>
                  <td
                    className={selectedItems.has(posVenda.id) ? "selected" : ""}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.has(posVenda.id)}
                      onChange={() => handleCheckboxChange(posVenda.id)}
                      className="checkbox-table"
                    />
                  </td>
                  <td
                    className={`${
                      selectedItems.has(posVenda.id) ? "selected" : ""
                    } ${
                      posVenda.posVendaConcuida ? "servicos-realizados" : ""
                    }`}
                  >
                    {posVenda.cnpj
                      ? formatCNPJ(posVenda.cnpj)
                      : posVenda.cpf
                      ? formatCPF(posVenda.cpf)
                      : posVenda.cnpj || posVenda.cpf}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(posVenda.id) ? "selected" : ""
                    } ${
                      posVenda.posVendaConcuida ? "servicos-realizados" : ""
                    }`}
                  >
                    {posVenda.responsavel}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(posVenda.id) ? "selected" : ""
                    } ${
                      posVenda.posVendaConcuida ? "servicos-realizados" : ""
                    }`}
                  >
                    {posVenda.email1 || posVenda.email2}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(posVenda.id) ? "selected" : ""
                    } ${
                      posVenda.posVendaConcuida ? "servicos-realizados" : ""
                    }`}
                  >
                    {posVenda.operador.replace(/\./g, " ")}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(posVenda.id) ? "selected" : ""
                    } ${
                      posVenda.posVendaConcuida ? "servicos-realizados" : ""
                    }`}
                  >
                    {posVenda.operadorPosVenda}
                  </td>
                  <td className="icon-container">
                    <Link
                      to={`/contrato/${posVenda.id}`}
                      data-tooltip-id="tooltip-view-contract"
                      data-tooltip-content="Visualizar contrato"
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="icon-spacing text-dark"
                      />
                    </Link>

                    <Link
                      to={`/fichaposVenda/${posVenda.id}`}
                      data-tooltip-id="tooltip-posVenda-file"
                      data-tooltip-content="Ficha de posVenda"
                    >
                      <FontAwesomeIcon
                        icon={faTableList}
                        className="icon-spacing text-dark"
                      />
                    </Link>
                    <Link to={`/assinatura/${posVenda.id}`}>
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
                    </Link>
                    <Link to={`/fichaboleto/${posVenda.id}`}>
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

                    {/* Tooltips */}
                    <Tooltip
                      id="tooltip-view-contract"
                      place="top"
                      className="custom-tooltip"
                    />
                    <Tooltip
                      id="tooltip-posVenda-file"
                      place="top"
                      className="custom-tooltip"
                    />
                  </td>
                </tr>
              ))}
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
