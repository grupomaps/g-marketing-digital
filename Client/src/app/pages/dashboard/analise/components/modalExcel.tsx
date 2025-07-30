import React, { useState, useEffect } from "react"; 
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select';
import { db } from "../../../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from 'firebase/firestore';

interface ModalExcelProps {
  onClose: () => void;
  onApplyFilters: (filters: {
    startDate?: string;
    endDate?: string;
    dueDate?: string;
    saleType?: string;
    salesPerson?: string;
    sorting?: string;
  }) => void;
}

interface Option {
  value: string;
  label: string;
}

export const ModalExcel: React.FC<ModalExcelProps> = ({ onClose, onApplyFilters }) => {
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [saleType, setSaleType] = useState<string | undefined>();
  const [salesPerson, setSalesPerson] = useState<string | undefined>();
  const [sorting, setSorting] = useState<string | undefined>();
  const [salesPeopleOptions, setSalesPeopleOptions] = useState<Option[]>([]);
  
  const tipoVendaOptions: Option[] = [
    { value: 'Base', label: 'Base' },
    { value: 'Renovacao', label: 'Renovação' }
  ];
  


  useEffect(() => {
    const fetchSalesPeople = async () => {
      const salesPeopleRef = collection(db, 'vendas');
      const q = query(salesPeopleRef, where('setor', '==', 'vendas'));
      const querySnapshot = await getDocs(q);

      const uniqueOperators = new Set<string>(); // Usar um Set para garantir a unicidade
      const options: Option[] = [];

      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.operador && !uniqueOperators.has(data.operador)) {
          uniqueOperators.add(data.operador);
          options.push({ value: data.operador, label: data.operador });
        }
      });

      setSalesPeopleOptions(options);
    };

    fetchSalesPeople();
  }, []);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("excelFilters") || "{}");
    setStartDate(savedFilters.startDate || undefined);
    setEndDate(savedFilters.endDate || undefined);
    setDueDate(savedFilters.dueDate || undefined);
    setSaleType(savedFilters.saleType || undefined);
    setSalesPerson(savedFilters.salesPerson || undefined);
    setSorting(savedFilters.sorting || undefined);
  }, []);

  const handleApplyFilters = () => {
    const filters = { startDate, endDate, dueDate, saleType, salesPerson, sorting };
    localStorage.setItem("excelFilters", JSON.stringify(filters)); // Salva os filtros
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDueDate(undefined);
    setSaleType(undefined);
    setSalesPerson(undefined);
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
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-primary" onClick={handleApplyFilters}>Aplicar Filtros</button>
            <button className="btn btn-secondary ms-3" onClick={handleClearFilters}>Limpar Filtros</button>
          </div>
        </div>
      </div>
    </div>
  );
};
