import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEdit,
  faEye,
  faSearch,
  faTrashAlt,
  faFilter,
  faDownload,
  faPlus,
  faFile,
  faMoneyCheckDollar,
  faBan,
  faBroom,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ModalExcel } from "./modalExcel";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as XLSX from "xlsx";
import { Tooltip } from "react-tooltip";

interface Cancelado {
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
}

interface ListDashboardProps {
  setTotalCancelados: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({
  setTotalCancelados,
}) => {
  const [cancelados, setCancelados] = useState<Cancelado[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    dueDate: "",
    saleType: "",
    salesPerson: "",
    saleGroup: "",
  });
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const adminUserId = process.env.REACT_APP_ADMIN_USER_ID;
  const SupervisorUserId = "wWLmbV9TIUemmTkcMUSAQ4xGlju2";
  const graziId = "nQwF9Uxh0lez9ETIOmP2gCgM0pf2";
  useEffect(() => {
    const fetchCancelados = async () => {
      setLoading(true);
      try {
        const canceladosCollection = collection(db, "cancelados");
        const canceladosSnapshot = await getDocs(canceladosCollection);
        const canceladosList = canceladosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Cancelado[];

        const filteredCancelados =
          userId === adminUserId ||
          userId === SupervisorUserId ||
          userId === graziId
            ? canceladosList
            : canceladosList.filter(
                (cancelado) => cancelado.createdBy === userId
              );

        setCancelados(filteredCancelados);
        setTotalCancelados(filteredCancelados.length);
      } catch (error) {
        console.error("Erro ao buscar Cancelados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelados();
  }, [setTotalCancelados, userId]);

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

  // const handleRemoveSelected = async () => {
  //   if (selectedItems.size === 0) return;

  //   const deletePromises = Array.from(selectedItems).map(async (id) => {
  //     const vendaDoc = doc(db, "vendas", id);
  //     const vendaData = (await getDoc(vendaDoc)).data();

  //     if (vendaData) {
  //       await setDoc(doc(db, "cancelados", id), {
  //         ...vendaData,
  //         deletedAt: new Date(),
  //       });
  //     }

  //     await deleteDoc(vendaDoc);
  //   });

  //   await Promise.all(deletePromises);

  //   setVendas((prevVendas) => {
  //     return prevVendas.filter((venda) => !selectedItems.has(venda.id));
  //   });
  //   setSelectedItems(new Set());
  // };

  const applyFilters = () => {
    const filteredClients = cancelados.filter((cancelado) => {
      const lowerCaseTerm = activeSearchTerm.toLowerCase();
      const matchesSearchTerm =
        (cancelado.cnpj &&
          cancelado.cnpj.toLowerCase().includes(lowerCaseTerm)) ||
        (cancelado.cpf &&
          cancelado.cpf.toLowerCase().includes(lowerCaseTerm)) ||
        (cancelado.responsavel &&
          cancelado.responsavel.toLowerCase().includes(lowerCaseTerm)) ||
        (cancelado.email1 &&
          cancelado.email1.toLowerCase().includes(lowerCaseTerm)) ||
        (cancelado.email2 &&
          cancelado.email2.toLowerCase().includes(lowerCaseTerm)) ||
        (cancelado.operador &&
          cancelado.operador.toLowerCase().includes(lowerCaseTerm));
      cancelado.account &&
        cancelado.account.toLowerCase().includes(lowerCaseTerm);

      const { startDate, endDate, dueDate, saleType, salesPerson, saleGroup } =
        filters;

      const vendaData = new Date(cancelado.data);
      const isStartDateValid = startDate
        ? vendaData.toDateString() === new Date(startDate).toDateString()
        : true;

      const isDateInRange =
        startDate && endDate
          ? vendaData >= new Date(startDate) && vendaData <= new Date(endDate)
          : isStartDateValid;

      const vendaDataVencimento = new Date(cancelado.dataVencimento);
      const isDueDateValid = dueDate
        ? vendaDataVencimento.toDateString() ===
          new Date(dueDate).toDateString()
        : true;

      const isSaleTypeValid = saleType ? cancelado.contrato === saleType : true;
      const isSalesPersonValid = salesPerson
        ? cancelado.operador === salesPerson
        : true;

      const isGroupTypeValid = saleGroup
        ? cancelado.account === saleGroup
        : true;
      return (
        matchesSearchTerm &&
        isDateInRange &&
        isDueDateValid &&
        isSaleTypeValid &&
        isSalesPersonValid &&
        isGroupTypeValid
      );
    });

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

  const openModalExclusao = () => setModalExclusao(true);
  const closeModalExclusao = () => setModalExclusao(false);

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

  const downloadClients = () => {
    const clientsToDownload = applyFilters();

    const selectedFields = [
      "cnpj",
      "cpf",
      "razaoSocial",
      "responsavel",
      "email1",
      "email2",
      "fixo",
      "celular",
      "whatsapp",
      "operador",
      "valorVenda",
      "parcelas",
      "data",
      "validade",
      "dataVencimento",
      "account",
      "rePagamento",
      "valorPago",
    ];

    const filteredData = clientsToDownload.map((cancelado) => {
      return selectedFields.reduce((selectedData, field) => {
        if (cancelado[field as keyof Cancelado]) {
          selectedData[field] = cancelado[field as keyof Cancelado];
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

  return (
    <div className="list-dashboard">
      {modalExcel && (
        <ModalExcel
          onClose={closeModalExcel}
          onApplyFilters={handleApplyFilters}
        />
      )}
      {/* {modalExclusao && (
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
      )} */}

      <div className="header-list">
        <div className="header-content">
          <h2>Cancelados</h2>

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
            {/* <Link to="/add" className="create-btn" data-tooltip-id="add-tooltip"
              data-tooltip-content="Nova venda">
              <FontAwesomeIcon
                icon={faPlus}

              />
              <Tooltip id="add-tooltip" place="top" className="custom-tooltip" />
            </Link> */}

            {/* {userId === adminUserId && (
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
            )} */}

            <button
              className="filtros-btn"
              onClick={openModalExcel}
              data-tooltip-id="filter-tooltip"
              data-tooltip-content="Aplicar filtros"
            >
              <FontAwesomeIcon icon={faFilter} color="#fff" />
              <Tooltip
                id="filter-tooltip"
                place="top"
                className="custom-tooltip"
              />
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
              className="planilha-btn"
              onClick={downloadClients}
              data-tooltip-id="download-tooltip"
              data-tooltip-content="Baixar planilha"
            >
              <FontAwesomeIcon icon={faDownload} color="#fff" />
              <Tooltip
                id="download-tooltip"
                place="top"
                className="custom-tooltip"
              />
            </button>
          </div>
        </div>

        <Tooltip id="my-tooltip" />
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
                <th>CNPJ/CPF</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Operador</th>
                <th>Grupo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((cancelado: Cancelado) => (
                <tr key={cancelado.id}>
                  <td
                    className={
                      selectedItems.has(cancelado.id) ? "selected" : ""
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.has(cancelado.id)}
                      onChange={() => handleCheckboxChange(cancelado.id)}
                      className="checkbox-table"
                    />
                  </td>
                  <td
                    className={
                      selectedItems.has(cancelado.id) ? "selected" : ""
                    }
                  >
                    {cancelado.cnpj
                      ? formatCNPJ(cancelado.cnpj)
                      : cancelado.cpf
                      ? formatCPF(cancelado.cpf)
                      : cancelado.cnpj || cancelado.cpf}
                  </td>
                  <td
                    className={
                      selectedItems.has(cancelado.id) ? "selected" : ""
                    }
                  >
                    {cancelado.responsavel}
                  </td>
                  <td
                    className={
                      selectedItems.has(cancelado.id) ? "selected" : ""
                    }
                  >
                    {cancelado.email1}
                  </td>
                  <td
                    className={
                      selectedItems.has(cancelado.id) ? "selected" : ""
                    }
                  >
                    {cancelado.operador.replace(/\./g, " ")}
                  </td>
                  <td
                    className={
                      selectedItems.has(cancelado.id) ? "selected" : ""
                    }
                  >
                    {cancelado.account}
                  </td>

                  <td className="icon-container">
                    <Link to={`/contrato/${cancelado.id}`}>
                      <FontAwesomeIcon
                        icon={faEye}
                        className="icon-spacing text-dark"
                        data-tooltip-id="tooltip-contrato"
                        data-tooltip-content="Visualizar contrato"
                      />
                      <Tooltip
                        id="tooltip-contrato"
                        place="top"
                        className="custom-tooltip"
                      />
                    </Link>

                    <Link to={`/comprovantes/${cancelado.id}`}>
                      <FontAwesomeIcon
                        icon={faFile}
                        className="icon-spacing text-dark"
                        data-tooltip-id="tooltip-comprovantes"
                        data-tooltip-content="Ver comprovantes"
                      />
                      <Tooltip
                        id="tooltip-comprovantes"
                        place="top"
                        className="custom-tooltip"
                      />
                    </Link>

                    <Link to={`/fichacancelamento/${cancelado.id}`}>
                      <FontAwesomeIcon
                        icon={faBan}
                        className="icon-spacing text-dark"
                        data-tooltip-id="tooltip-comprovantes"
                        data-tooltip-content="Ver relato"
                      />
                      <Tooltip
                        id="tooltip-comprovantes"
                        place="top"
                        className="custom-tooltip"
                      />
                    </Link>
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
              {currentPage} de {totalPages}
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
