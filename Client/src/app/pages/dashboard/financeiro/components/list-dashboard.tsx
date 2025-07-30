/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEye,
  faSearch,
  faFilter,
  faTableList,
  faX,
  faMinus,
  faDownload,
  faBroom,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { Tooltip } from "react-tooltip";
import { getAuth } from "firebase/auth";

interface Parcela {
  valorPago: string;
  valor: string;
  dataVencimento: string;
  pagamento?: string;
}

interface Marketing {
  createdBy: string;
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
  encaminharCliente: string;
  rePagamento: string;
  account: string;
  parcelasDetalhadas?: Parcela[];
  posVendaConcuida: boolean;
}

interface ListDashboardProps {
  setTotalFinanceiros: (total: number) => void;
  setTotalPagos: (total: number) => void;
  setTotalNegativados: (total: number) => void;
  setTotalRecebido: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({
  setTotalFinanceiros,
  setTotalPagos,
  setTotalNegativados,
  setTotalRecebido,
}) => {
  const [financeiros, setFinanceiros] = useState<Marketing[]>([]);
  const [selectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    dueStartDate: "",
    dueEndDate: "",
    saleType: "",
    salesPerson: "",
    saleGroup: "",
  });
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  const [showNegativos, setShowNegativos] = useState(false);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const adminUserId = process.env.REACT_APP_ADMIN_USER_ID;
  const SupervisorUserId = "wWLmbV9TIUemmTkcMUSAQ4xGlju2";
  const graziId = "nQwF9Uxh0lez9ETIOmP2gCgM0pf2";

  useEffect(() => {
    const fetchFinanceiros = async () => {
      setLoading(true);
      try {
        const financeirosCollection = collection(db, "financeiros");
        const financeirosSnapshot = await getDocs(financeirosCollection);
        const financeirosList = financeirosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Marketing[];

        const filteredVendas =
          userId === adminUserId ||
          userId === SupervisorUserId ||
          userId === graziId
            ? financeirosList
            : financeirosList.filter(
                (financeiro) => financeiro.createdBy === userId
              );

        // const limitedList = filteredVendas.slice(0, 10);
        setFinanceiros(filteredVendas);
        setTotalFinanceiros(filteredVendas.length); 
      } catch (error) {
        console.error("Erro ao buscar financeiros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceiros();
  }, [setTotalFinanceiros]);


 useEffect(() => {
  const filtered = applyFilters();

  const totalPagos = filtered.filter((f) =>
    f.parcelasDetalhadas?.some((p) => p.pagamento === "pago")
  ).length;

  const totalNegativados = filtered.filter((f) =>
    f.parcelasDetalhadas?.some((p) => p.pagamento === "inadimplente")
  ).length;

  const totalRecebido = filtered.reduce((total, f) => {
    const soma = (f.parcelasDetalhadas || []).reduce((acc, parcela) => {
      const valorString = parcela?.valorPago;
      const valor = parseFloat(valorString && valorString.trim() !== "" ? valorString : "0");
      if (isNaN(valor)) {
        console.log("❌ Valor inválido em parcela:", parcela);
      }
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);
    return total + soma;
  }, 0);

  console.log("✅ totalRecebido calculado:", totalRecebido);
  setTotalPagos(totalPagos);
  setTotalNegativados(totalNegativados);
  setTotalRecebido(totalRecebido);
}, [financeiros, filters, activeSearchTerm, showNegativos]);

  const applyFilters = () => {
  let filteredClients = financeiros.filter((marketing, index) => {
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
        marketing.operador.toLowerCase().includes(lowerCaseTerm)) ||
      (marketing.account &&
        marketing.account.toLowerCase().includes(lowerCaseTerm));

    const {
      startDate,
      endDate,
      dueStartDate,
      dueEndDate,
      saleType,
      salesPerson,
      saleGroup,
    } = filters;

    const marketingData = new Date(marketing.data);
    const isStartDateValid = startDate
      ? marketingData.toDateString() === new Date(startDate).toDateString()
      : true;

    const isDateInRange =
      startDate && endDate
        ? marketingData >= new Date(startDate) &&
          marketingData <= new Date(endDate)
        : isStartDateValid;

    let isDueDateInRange = true;
if (dueStartDate || dueEndDate) {
  isDueDateInRange = (marketing.parcelasDetalhadas || []).some((parcela) => {
    if (!parcela.dataVencimento) return false;
    const vencimento = new Date(parcela.dataVencimento);
    const start = dueStartDate ? new Date(dueStartDate) : null;
    const end = dueEndDate ? new Date(dueEndDate) : null;
    return (!start || vencimento >= start) && (!end || vencimento <= end);
  });
}

    const isSaleTypeValid = saleType ? marketing.contrato === saleType : true;
    const isSalesPersonValid = salesPerson
      ? marketing.operador === salesPerson
      : true;
    const isGroupTypeValid = saleGroup
      ? marketing.account === saleGroup
      : true;

    const passed =
      matchesSearchTerm &&
      isDateInRange &&
      isDueDateInRange &&
      isSaleTypeValid &&
      isSalesPersonValid &&
      isGroupTypeValid;


    return passed;
  });

  if (showNegativos) {
    filteredClients = filteredClients.filter((marketing, index) => {
      const hasInadimplente = marketing.parcelasDetalhadas?.some(
        (parcela) => parcela.pagamento === "inadimplente"
      );

      if (!hasInadimplente) {
        console.log(`Cliente #${index} removido no filtro de inadimplentes`, {
          nome: marketing.responsavel,
        });
      }

      return hasInadimplente;
    });

    console.log("Clientes após filtro de inadimplente:", filteredClients.length);
  }

  return filteredClients;
};


  
  const filteredClients = applyFilters();
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleSearchClick = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
  };


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

  const downloadClients = () => {
    const clientsToDownload = applyFilters();

    const selectedFields = [
      "cnpj",
      "cpf",
      "responsavel",
      "email1",
      "email2",
      "operador",
      "data",
      "dataVencimento",
      "rePagamento",
      "dataPagamento",
      "encaminharCliente",
      "operadorSelecionado",
      "account",
      "valorPago",
    ];

    const filteredData = clientsToDownload.map((financeiro) => {
      return selectedFields.reduce((selectedData, field) => {
        if (field in financeiro) {
          selectedData[field] = financeiro[field as keyof Marketing];
        }
        return selectedData;
      }, {} as { [key: string]: any });
    });

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const range = XLSX.utils.decode_range(ws["!ref"]!);
    ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "vendas");

    XLSX.writeFile(wb, "planilha_vendas.xlsx");
  };

  const toggleNegativo = () => {
    setShowNegativos(!showNegativos);
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

  return (
    <div className="list-dashboard">
      {modalExcel && (
        <ModalExcel
          onClose={closeModalExcel}
          onApplyFilters={handleApplyFilters}
        />
      )}

      <div className="header-list">
        <div className="header-content">
          <h2>Financeiro</h2>
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
                  dueStartDate: "",
                  dueEndDate: "",
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

            {showNegativos ? (
              <button
                className="remove-btn"
                onClick={toggleNegativo}
                data-tooltip-id="tooltip-remove-negativo"
                data-tooltip-content="Remover inadimpletes"
              >
                <FontAwesomeIcon icon={faX} color="#fff" />
              </button>
            ) : (
              <button
                className="concluido-btn"
                onClick={toggleNegativo}
                data-tooltip-id="tooltip-add-negativo"
                data-tooltip-content="Mostrar inadimpletes"
              >
                <FontAwesomeIcon icon={faMinus} color="#fff" />
              </button>
            )}

            <button
              className="planilha-btn"
              onClick={downloadClients}
              data-tooltip-id="tooltip-download"
              data-tooltip-content="Baixar planilha"
            >
              <FontAwesomeIcon icon={faDownload} color="#fff" />
            </button>

            {/* <button
              className="remove-btn"
              onClick={handleSyncClients}
              disabled={syncLoading}
              data-tooltip-id="tooltip-sync"
              data-tooltip-content={
                syncLoading ? "Sincronizando..." : "Sincronizar clientes"
              }
            >
              {syncLoading ? (
                <FontAwesomeIcon icon={faSync} spin color="#fff" />
              ) : (
                <FontAwesomeIcon icon={faSync} color="#fff" />
              )}
            </button> */}

            {/* Tooltips */}
            <Tooltip
              id="tooltip-filter"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-remove-cancelado"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-add-cancelado"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-remove-negativo"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-add-negativo"
              place="top"
              className="custom-tooltip"
            />
            <Tooltip
              id="tooltip-download"
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
                <th>CNPJ/CPF</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Equipe</th>
                <th>Operador</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((marketing) => (
                <tr key={marketing.id}>
                  <td></td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.encaminharCliente === "sim"
                        ? "cobranca-encaminhado"
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
                      marketing.encaminharCliente === "sim"
                        ? "cobranca-encaminhado"
                        : ""
                    }`}
                  >
                    {marketing.responsavel}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.encaminharCliente === "sim"
                        ? "cobranca-encaminhado"
                        : ""
                    }`}
                  >
                    {marketing.email1 || marketing.email2}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.encaminharCliente === "sim"
                        ? "cobranca-encaminhado"
                        : ""
                    }`}
                  >
                    {marketing.account}
                  </td>
                  <td
                    className={`${
                      selectedItems.has(marketing.id) ? "selected" : ""
                    } ${
                      marketing.encaminharCliente === "sim"
                        ? "cobranca-encaminhado"
                        : ""
                    }`}
                  >
                    {marketing.operador.replace(/\./g, " ")}
                  </td>
                  <td className="icon-container">
                    <Link
                      to={`/contrato/${marketing.id}`}
                      data-tooltip-id="tooltip-eye"
                      data-tooltip-content="Visualizar contrato"
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="icon-spacing text-dark"
                      />
                    </Link>

                    {!adminUserId ? (
                      <Link
                        to={`/fichafinanceiro/${marketing.id}`}
                        data-tooltip-id="tooltip-financeiro"
                        data-tooltip-content="Ficha financeiro"
                      >
                        <FontAwesomeIcon
                          icon={faTableList}
                          className="icon-spacing text-dark"
                        />
                      </Link>
                    ) : (
                      <Link
                        to={`/fichafinanceiro/${marketing.id}`}
                        data-tooltip-id="tooltip-vizu"
                        data-tooltip-content="Vizualizar financeiro"
                      >
                        <FontAwesomeIcon
                          icon={faTableList}
                          className="icon-spacing text-dark"
                        />
                      </Link>
                    )}
                  </td>

                  {/* Tooltip */}
                  <Tooltip
                    id="tooltip-eye"
                    place="top"
                    className="custom-tooltip"
                  />
                  <Tooltip
                    id="tooltip-financeiro"
                    place="top"
                    className="custom-tooltip"
                  />
                  <Tooltip
                    id="tooltip-vizu"
                    place="top"
                    className="custom-tooltip"
                  />
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
