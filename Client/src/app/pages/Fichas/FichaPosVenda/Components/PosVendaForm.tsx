import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface posVendaForm {
  contratoAssinado: string;
  posVendaConcuida: boolean;
}


interface posVendaFormProps {
  form: posVendaForm | null;
  onSubmit: (data: posVendaForm) => void;
}

export const MarketingForm: React.FC<posVendaFormProps> = ({
  form: initialForm,
  onSubmit,
}) => {
  const [form, setForm] = useState<posVendaForm>({
    contratoAssinado: "",
    posVendaConcuida: false,
  });

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
    }
  }, [initialForm]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card p-4 mb-4" onSubmit={handleSubmit}>
      <h2 className="text-center">Informações de Pós Venda</h2>

      <div className="form-group mb-3">
        <label htmlFor="contratoAssinado">Link do contrato assinado: </label>
        <input
          type="text"
          id="contratoAssinado"
          className="form-control"
          name="contratoAssinado"
          value={form.contratoAssinado}
          onChange={handleInputChange}
          required
        />
      </div>

      <label>Serviços Concluídos?</label>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="posVendaConcuida"
          name="posVendaConcuida"
          checked={form.posVendaConcuida}
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor="posVendaConcuida">
          Sim
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        Salvar
      </button>
    </form>
  );
};
