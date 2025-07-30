import React, { useState, useEffect } from "react";

interface CancelamentoForm {
  infoCancelamento: string;
}

interface CancelamentoFormProps {
  form: CancelamentoForm | null;
  onSubmit: (data: CancelamentoForm) => void;
}

export const CancelamentoForm: React.FC<CancelamentoFormProps> = ({
  form: initialForm,
  onSubmit,
}) => {
  const [form, setForm] = useState<CancelamentoForm>({
    infoCancelamento: "",
  });

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
    }
  }, [initialForm]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      <h2 className="text-center">Informações de Cancelamento</h2>

      <div className="form-group mb-3">
        <label htmlFor="artLink">Motivo do cancelamento:</label>
        <textarea
          className="form-control"
          id="infoCancelamento"
          name="infoCancelamento"
          value={form.infoCancelamento}
          onChange={handleInputChange}
          rows={3}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Salvar
      </button>
    </form>
  );
};
