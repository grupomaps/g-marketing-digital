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
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as XLSX from "xlsx";
import { Tooltip } from "react-tooltip";

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

interface ListDashboardProps {
  setTotalVendas: (total: number) => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({
  setTotalVendas,
}) => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalExcel, setModalExcel] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [infoCancelamento, setInfoCancelamento] = useState<string>("");
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
    const fetchVendas = async () => {
      setLoading(true);
      try {
        const vendasCollection = collection(db, "vendas");
        const vendasSnapshot = await getDocs(vendasCollection);
        const vendasList = vendasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Venda[];

        const filteredVendas =
          userId === adminUserId ||
          userId === SupervisorUserId ||
          userId === graziId
            ? vendasList
            : vendasList.filter((venda) => venda.createdBy === userId);

        setVendas(filteredVendas);
        setTotalVendas(filteredVendas.length);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendas();
  }, [setTotalVendas, userId]);

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

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0 || !infoCancelamento.trim()) {
      alert("Por favor, forneça um motivo para o cancelamento.");
      return;
    }

    const deletePromises = Array.from(selectedItems).map(async (id) => {
      const vendaDoc = doc(db, "vendas", id);
      const vendaData = (await getDoc(vendaDoc)).data();

      if (vendaData) {
        await setDoc(doc(db, "cancelados", id), {
          ...vendaData,
          infoCancelamento,
          deletedAt: new Date(),
        });
      }

      await deleteDoc(vendaDoc);
    });

    await Promise.all(deletePromises);

    setVendas((prevVendas) =>
      prevVendas.filter((venda) => !selectedItems.has(venda.id))
    );
    setSelectedItems(new Set());
    setInfoCancelamento("");
    closeModalExclusao();
  };

  const applyFilters = () => {
    const filteredClients = vendas.filter((venda) => {
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
      venda.account && venda.account.toLowerCase().includes(lowerCaseTerm);

      const { startDate, endDate, dueDate, saleType, salesPerson, saleGroup } =
        filters;

      const vendaData = new Date(venda.data);
      const isStartDateValid = startDate
        ? vendaData.toDateString() === new Date(startDate).toDateString()
        : true;

      const isDateInRange =
        startDate && endDate
          ? vendaData >= new Date(startDate) && vendaData <= new Date(endDate)
          : isStartDateValid;

      const vendaDataVencimento = new Date(venda.dataVencimento);
      const isDueDateValid = dueDate
        ? vendaDataVencimento.toDateString() ===
          new Date(dueDate).toDateString()
        : true;

      const isSaleTypeValid = saleType ? venda.contrato === saleType : true;
      const isSalesPersonValid = salesPerson
        ? venda.operador === salesPerson
        : true;

      const isGroupTypeValid = saleGroup ? venda.account === saleGroup : true;
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

  const openModalExclusao = () => setModalExclusao(true);
  const closeModalExclusao = () => setModalExclusao(false);

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
  const formatarTelefone = (numero: any) => {
    if (!numero) return "";

    const numeros = numero.replace(/\D/g, "");

    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
        7
      )}`;
    } else if (numeros.length === 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(
        6
      )}`;
    }

    return numero;
  };

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

    const filteredData = clientsToDownload.map((venda) => {
      return selectedFields.reduce((selectedData, field) => {
        if (venda[field as keyof Venda]) {
          selectedData[field] = venda[field as keyof Venda];
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
            <div className="form-group mb-3">
              <label htmlFor="infoCancelamento">Motivo do cancelamento:</label>
              <textarea
                className="form-control"
                placeholder="Digite o motivo do cancelamento..."
                value={infoCancelamento}
                onChange={(e) => setInfoCancelamento(e.target.value)}
                rows={3}
                required
              />
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
          <h2>Vendas</h2>

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
              data-tooltip-id="add-tooltip"
              data-tooltip-content="Nova venda"
            >
              <FontAwesomeIcon icon={faPlus} />
              <Tooltip
                id="add-tooltip"
                place="top"
                className="custom-tooltip"
              />
            </Link>

            {(userId === adminUserId ||
              userId === SupervisorUserId ||
              userId === graziId) && (
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
                <th>Whatsapp</th>
                <th>Operador</th>
                <th>Grupo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((venda: Venda) => (
                <tr key={venda.id}>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(venda.id)}
                      onChange={() => handleCheckboxChange(venda.id)}
                      className="checkbox-table"
                    />
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.cnpj
                      ? formatCNPJ(venda.cnpj)
                      : venda.cpf
                      ? formatCPF(venda.cpf)
                      : venda.cnpj || venda.cpf}
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.responsavel}
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.email1}
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {formatarTelefone(venda.whatsapp)}
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.operador.replace(/\./g, " ")}
                  </td>
                  <td className={selectedItems.has(venda.id) ? "selected" : ""}>
                    {venda.account}
                  </td>

                  <td className="icon-container">
                    <Link to={`/editcontrato/${venda.id}`}>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="icon-spacing text-dark"
                        data-tooltip-id="tooltip-edit"
                        data-tooltip-content="Editar contrato"
                      />
                      <Tooltip
                        id="tooltip-edit"
                        place="top"
                        className="custom-tooltip"
                      />
                    </Link>

                    {/* <Link to={`/comprovantes/${venda.id}`}>
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
                    </Link> */}

                    <Link to={`/contrato/${venda.id}`}>
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
