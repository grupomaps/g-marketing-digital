import React, { useState, useEffect } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";

interface ModalExcelProps {
  onClose: () => void;
  onApplyFilters: (filters: {
    startDate?: string;
    endDate?: string;
    dueStartDate?: string;
    dueEndDate?: string;
    saleType?: string;
    cobPerson?: string;
    salesPerson?: string;
    saleGroup?: string;
    sorting?: string;
  }) => void;
}

const salesPeopleOptions = [
  { value: "marcio", label: "Marcio" },
  { value: "ricardo", label: "Ricardo" },
  { value: "kaio", label: "Kaio" },
  { value: "giovanna", label: "Giovanna" },
  { value: "evelly", label: "Evelly" },
  { value: "igor", label: "Igor" },
  { value: "test", label: "test" },
];

const tipoVendaOptions = [
  { value: "Base", label: "Base" },
  { value: "Renovacao", label: "Renovação" },
];

const sortingOptions = [
  { value: "alfabetica", label: "Ordem Alfabética" },
  { value: "maisRecente", label: "Mais Recente" },
  { value: "maisAntigo", label: "Mais Antigo" },
];

const tipoGrupoOptions = [
  { value: "equipe_marcio", label: "Equipe Márcio/Kaio" },
  { value: "equipe_antony", label: "Equipe do Antony" },
  { value: "equipe_alef", label: "Equipe do Alef" },
];

export const ModalExcel: React.FC<ModalExcelProps> = ({
  onClose,
  onApplyFilters,
}) => {
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [dueStartDate, setDueStartDate] = useState<string | undefined>();
  const [dueEndDate, setDueEndDate] = useState<string | undefined>();
  const [saleType, setSaleType] = useState<string>();
  const [salesPerson, setSalesPerson] = useState<string>();
  const [saleGroup, setSaleGroup] = useState<string>();
  const [cobPerson, setCobPerson] = useState<string>();
  const [sorting, setSorting] = useState<string>();

  useEffect(() => {
    const savedFilters = JSON.parse(
      localStorage.getItem("excelFilters") || "{}"
    );
    setStartDate(savedFilters.startDate);
    setEndDate(savedFilters.endDate);
    setDueStartDate(savedFilters.dueStartDate);
    setDueEndDate(savedFilters.dueEndDate);
    setSaleType(savedFilters.saleType);
    setSalesPerson(savedFilters.salesPerson);
    setSaleGroup(savedFilters.saleGroup);
    setCobPerson(savedFilters.cobPerson);
    setSorting(savedFilters.sorting);
  }, []);

  const handleApplyFilters = () => {
    const filters = {
      startDate,
      endDate,
      dueStartDate,
      dueEndDate,
      saleType,
      salesPerson,
      saleGroup,
      cobPerson,
      sorting,
    };
    localStorage.setItem("excelFilters", JSON.stringify(filters));
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDueStartDate(undefined);
    setDueEndDate(undefined);
    setSaleType(undefined);
    setSalesPerson(undefined);
    setSaleGroup(undefined);
    setCobPerson(undefined);
    setSorting(undefined);
    localStorage.removeItem("excelFilters");
  };

  return (
    <div className="modal-excel">
      <div className="box-modal-excel p-4">
        <h2 className="text-center">Filtros de Data</h2>
        <button className="btn btn-danger btn-fechar-excel" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>

        <div className="datas mt-3">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="startDate" className="form-label">
                Data de Cadastro (Início)
              </label>
              <input
                type="date"
                className="form-control"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="endDate" className="form-label">
                Data de Cadastro (Fim)
              </label>
              <input
                type="date"
                className="form-control"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="dueStartDate" className="form-label">
                Vencimento Início
              </label>
              <input
                type="date"
                id="dueStartDate"
                className="form-control"
                value={dueStartDate || ""}
                onChange={(e) => setDueStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="dueEndDate" className="form-label">
                Vencimento Fim
              </label>
              <input
                type="date"
                id="dueEndDate"
                className="form-control"
                value={dueEndDate || ""}
                onChange={(e) => setDueEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tipo de Venda</label>
              <Select
                options={tipoVendaOptions}
                isClearable
                value={
                  tipoVendaOptions.find((opt) => opt.value === saleType) || null
                }
                onChange={(opt) => setSaleType(opt?.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Grupo</label>
              <Select
                options={tipoGrupoOptions}
                isClearable
                value={
                  tipoGrupoOptions.find((opt) => opt.value === saleGroup) ||
                  null
                }
                onChange={(opt) => setSaleGroup(opt?.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Vendedor</label>
              <Select
                options={salesPeopleOptions}
                isClearable
                value={
                  salesPeopleOptions.find((opt) => opt.value === salesPerson) ||
                  null
                }
                onChange={(opt) => setSalesPerson(opt?.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3 mx-auto">
              <label className="form-label">Ordenação</label>
              <Select
                options={sortingOptions}
                isClearable
                value={
                  sortingOptions.find((opt) => opt.value === sorting) || null
                }
                onChange={(opt) => setSorting(opt?.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-primary" onClick={handleApplyFilters}>
              Aplicar Filtros
            </button>
            <button
              className="btn btn-secondary ms-3"
              onClick={handleClearFilters}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
