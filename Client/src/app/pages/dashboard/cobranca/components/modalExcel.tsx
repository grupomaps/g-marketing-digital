import React, { useState, useEffect } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select';

interface ModalExcelProps {
  onClose: () => void;
  onApplyFilters: (filters: {
    startDate?: string;
    endDate?: string;
    dueDate?: string;
    saleType?: string;
    cobPerson?: string;
    salesPerson?: string;
    sorting?: string;
  }) => void;
}

const salesPeopleOptions = [
  { value: 'marcio', label: 'Marcio' },
  { value: 'ricardo', label: 'Ricardo' },
  { value: 'kaio', label: 'Kaio' },
  { value: 'giovanna', label: 'Giovanna' },
  { value: 'evelly', label: 'Evelly' },
  { value: 'igor', label: 'Igor' },
  { value: 'test', label: 'test' },
];

const cobPeopleOptions = [
  { value: 'Isa', label: 'Isa' },
  { value: 'Miguel', label: 'Miguel' },
];

const tipoVendaOptions = [
  { value: 'Base', label: 'Base' },
  { value: 'Renovacao', label: 'Renovação' }
];

const sortingOptions = [
  { value: 'alfabetica', label: 'Ordem Alfabética' },
  { value: 'maisRecente', label: 'Mais Recente' },
  { value: 'maisAntigo', label: 'Mais Antigo' },
];

export const ModalExcel: React.FC<ModalExcelProps> = ({ onClose, onApplyFilters }) => {
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [saleType, setSaleType] = useState<string | undefined>();
  const [salesPerson, setSalesPerson] = useState<string | undefined>();
  const [cobPerson, setCobPerson] = useState<string | undefined>();
  const [sorting, setSorting] = useState<string | undefined>();

  // Carregar os filtros salvos do localStorage ao carregar a página
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("excelFilters") || "{}");
    setStartDate(savedFilters.startDate || undefined);
    setEndDate(savedFilters.endDate || undefined);
    setDueDate(savedFilters.dueDate || undefined);
    setSaleType(savedFilters.saleType || undefined);
    setSalesPerson(savedFilters.salesPerson || undefined);
    setCobPerson(savedFilters.cobPerson || undefined);
    setSorting(savedFilters.sorting || undefined);
  }, []);

  const handleApplyFilters = () => {
    const filters = { startDate, endDate, dueDate, saleType, salesPerson, cobPerson, sorting };
    
    // Salvar os filtros no localStorage
    localStorage.setItem("excelFilters", JSON.stringify(filters));
    
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    // Limpar o estado dos filtros
    setStartDate(undefined);
    setEndDate(undefined);
    setDueDate(undefined);
    setSaleType(undefined);
    setSalesPerson(undefined);
    setCobPerson(undefined);
    setSorting(undefined);

    // Remover os filtros do localStorage
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
              <label htmlFor="startDate" className="form-label">Início</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="endDate" className="form-label">Fim</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">Data de Vencimento</label>
            <input
              type="date"
              id="dueDate"
              className="form-control"
              value={dueDate || ""}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="saleType" className="form-label">Tipo de Venda</label>
              <Select
                options={tipoVendaOptions}
                placeholder="Selecione"
                isClearable
                value={tipoVendaOptions.find(option => option.value === saleType) || null}
                onChange={(option) => setSaleType(option?.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="salesPerson" className="form-label">Vendedor</label>
              <Select
                options={salesPeopleOptions}
                placeholder="Selecione"
                isClearable
                value={salesPeopleOptions.find(option => option.value === salesPerson) || null}
                onChange={(option) => setSalesPerson(option?.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="cobPerson" className="form-label">Cobrador</label>
              <Select
                options={cobPeopleOptions}
                placeholder="Selecione"
                isClearable
                value={cobPeopleOptions.find(option => option.value === cobPerson) || null}
                onChange={(option) => setCobPerson(option?.value)}
              />
            </div>
            <div className="col-md-6 mb-3 mx-auto">
              <label htmlFor="sorting" className="form-label">Ordenação</label>
              <Select
                options={sortingOptions}
                placeholder="Selecione"
                isClearable
                value={sortingOptions.find(option => option.value === sorting) || null}
                onChange={(option) => setSorting(option?.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-primary" onClick={handleApplyFilters}>Aplicar Filtros</button>
            <button className="btn btn-secondary ms-3" onClick={handleClearFilters}>Limpar Filtros</button>
          </div>
        </div>
      </div>
    </div>
  );
};
