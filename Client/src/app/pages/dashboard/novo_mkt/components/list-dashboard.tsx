import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEdit,
  faEye,
  faSearch,
  faFilter,
  faRectangleList,
  faX,
  faBars,
  faMoneyCheckDollar,
  faMarker,
  faBroom,
  faTableList,
  faTrashAlt,
  faExclamation,
  faCheck,
  faPlus,
  faCheckCircle,
  faCircleXmark,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebase/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { Tooltip } from "react-tooltip";
import { getAuth } from "firebase/auth";

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
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  const [cargo, setCargo] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [marketings, setMarketings] = useState<Venda[]>([]);

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
        })) as Venda[];

        let filteredVendas: Venda[] = [];

        if (cargo === "adm" || cargo === "supervisor" || cargo === "posVenda") {
          filteredVendas = marketingsList;
        } else if (cargo === "marketing") {
          filteredVendas = marketingsList.filter(
            (venda) =>
              !venda.operadorMkt ||
              venda.operadorMkt.trim() === "" ||
              venda.operadorMkt === nomeUsuario
          );
        } else {
          filteredVendas = marketingsList.filter(
            (venda) => venda.createdBy === userId
          );
        }

        setVendas(filteredVendas);
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

  const applyFilters = () => {
    let filteredClients = vendas.filter((venda) => {
      const lowerCaseTerm = activeSearchTerm.toLowerCase();
      const matchesSearchTerm =
        (venda.cnpj && venda.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.cpf && venda.cpf.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.responsavel &&
          venda.responsavel.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.email1 && venda.email1.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.email2 && venda.email2.toLowerCase().includes(lowerCaseTerm)) ||
        (venda.operador &&
          venda.operador.toLowerCase().includes(lowerCaseTerm));

      const { startDate, endDate, dueDate, saleType, salesPerson } = filters;

      const marketingData = new Date(venda.data);
      const isStartDateValid = startDate
        ? marketingData.toDateString() === new Date(startDate).toDateString()
        : true;

      const isDateInRange =
        startDate && endDate
          ? marketingData >= new Date(startDate) &&
            marketingData <= new Date(endDate)
          : isStartDateValid;

      const marketingDataVencimento = new Date(venda.dataVencimento);
      const isDueDateValid = dueDate
        ? marketingDataVencimento.toDateString() ===
          new Date(dueDate).toDateString()
        : true;

      const issaleTypeValid = saleType ? venda.contrato === saleType : true;
      const issalesPersonValid = salesPerson
        ? venda.operador === salesPerson
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

  const formatCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .substring(0, 18);
  };
  const [showConcluidos, setShowConcluidos] = useState(false);
  const [showIncompletos, setShowIncompletos] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);

  const openModalExclusao = () => setModalExclusao(true);
  const closeModalExclusao = () => setModalExclusao(false);

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) return;

    const deletePromises = Array.from(selectedItems).map(async (id) => {
      const marketingDoc = doc(db, "vendas", id);
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

  const toggleConcluidos = () => {
    setShowConcluidos(!showConcluidos);
    setShowIncompletos(false);
  };

  const toggleIncompletos = () => {
    setShowIncompletos(!showIncompletos);
    setShowConcluidos(false);
  };

  const isPosVendaConcuida = (venda: Venda) => {
    return !!venda.posVendaConcuida;
  };
  const isChecklistConcluido = (venda: Venda) => {
    return (
      venda.cartaApresentacao &&
      venda.certificado &&
      venda.fotosAdicionadas &&
      venda.telefone &&
      venda.endereco &&
      (venda.redeSocial || venda.semRedeSocial)
    );
  };

  const filteredClientss = currentClients.filter((venda) => {
    const completo = isChecklistConcluido(venda);

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
          <h2>Marketing | Pós Venda</h2>
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
        <div className="no-clients">Não existem vendas a exibir.</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Realizado</th>
                <th>CNPJ/CPF</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Operador</th>
                <th>Monitor</th>
                <th>Encaminhamento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredClientss.map((venda: Venda) => {
                const checklistCompleto = isChecklistConcluido(venda);
                const serviçoIniciado =
                  checklistCompleto || venda.servicosConcluidos;
                console.log("posVendaConcuida:", venda.posVendaConcuida);

                return (
                  <tr key={venda.id}>
                    <td
                      className={selectedItems.has(venda.id) ? "selected" : ""}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.has(venda.id)}
                        onChange={() => handleCheckboxChange(venda.id)}
                        className="checkbox-table"
                      />
                    </td>
                    <td
                      className={`text-center ${
                        selectedItems.has(venda.id) ? "selected" : ""
                      }`}
                    >
                      {isPosVendaConcuida(venda) ? (
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
                        selectedItems.has(venda.id) ? "selected" : ""
                      } ${
                        serviçoIniciado
                          ? checklistCompleto
                            ? "servicos-realizados"
                            : "servicos-incompletos"
                          : ""
                      }`}
                    >
                      {venda.cnpj
                        ? formatCNPJ(venda.cnpj)
                        : venda.cpf
                        ? formatCPF(venda.cpf)
                        : venda.cnpj || venda.cpf}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(venda.id) ? "selected" : ""
                      } ${
                        venda.servicosConcluidos ? "servicos-realizados" : ""
                      }`}
                    >
                      {venda.responsavel}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(venda.id) ? "selected" : ""
                      } ${
                        venda.servicosConcluidos ? "servicos-realizados" : ""
                      }`}
                    >
                      {venda.email1 || venda.email2}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(venda.id) ? "selected" : ""
                      } ${
                        venda.servicosConcluidos ? "servicos-realizados" : ""
                      }`}
                    >
                      {venda.operador.replace(/\./g, " ")}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(venda.id) ? "selected" : ""
                      } ${
                        venda.servicosConcluidos ? "servicos-realizados" : ""
                      }`}
                    >
                      {venda.nomeMonitor}
                    </td>
                    <td
                      className={`${
                        selectedItems.has(venda.id) ? "selected" : ""
                      } ${
                        venda.servicosConcluidos ? "servicos-realizados" : ""
                      }`}
                    >
                      {venda.monitoriaHorario}
                    </td>
                    <td className="icon-container">
                      <Link
                        to={`/contrato/${venda.id}`}
                        data-tooltip-id="tooltip-view-contract"
                        data-tooltip-content="Visualizar contrato"
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          className="icon-spacing text-dark"
                        />
                      </Link>

                      {cargo !== "posVenda" && (
                        <Link
                          to={`/fichamarketing/${venda.id}`}
                          data-tooltip-id="tooltip-marketing-file"
                          data-tooltip-content="Ficha de marketing"
                        >
                          <FontAwesomeIcon
                            icon={faTableList}
                            className="icon-spacing text-dark"
                          />
                        </Link>
                      )}
                      {cargo !== "marketing" && (
                        <Link
                          to={`/fichaposVenda/${venda.id}`}
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
                      )}

                      <Link to={`/fichaboleto/${venda.id}`}>
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
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
