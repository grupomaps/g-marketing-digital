import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface MarketingForm {
  artLink: string;
  creationOrUpdate: string;
  responsible: string;
  completionDate: string;
  servicosConcluidos: boolean;
  contratoLink: string;
  linkGoogle: string;
  cartaApresentacao: boolean;
  certificado: boolean;
  dominio: boolean;
  emailDominio: string;
  fotosAdicionadas: boolean;
  logotipo: "Feita" | "Não" | "Já possui";
  telefone: boolean;
  endereco: boolean;
  redeSocial: string;
  semRedeSocial: boolean;
}

interface MarketingFormProps {
  form: MarketingForm | null;
  onSubmit: (data: MarketingForm) => void;
}

export const MarketingForm: React.FC<MarketingFormProps> = ({
  form: initialForm,
  onSubmit,
}) => {
  const [form, setForm] = useState<MarketingForm>({
    artLink: "",
    creationOrUpdate: "Criação",
    responsible: "",
    completionDate: "",
    contratoLink: "",
    servicosConcluidos: false,
    linkGoogle: "",
    cartaApresentacao: false,
    certificado: false,
    dominio: false,
    emailDominio: "",
    fotosAdicionadas: false,
    logotipo: "Não",
    telefone: false,
    endereco: false,
    redeSocial: "",
    semRedeSocial: false,
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
    <form className="row" onSubmit={handleSubmit}>
      <div className="card col-md-6">
        <h5 className="mb-2">Checklist de Itens de Marketing</h5>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>Carta de Apresentação</td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="cartaApresentacao"
                    name="cartaApresentacao"
                    checked={form.cartaApresentacao}
                    onChange={handleInputChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="cartaApresentacao"
                  >
                    Sim
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Certificado</td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="certificado"
                    name="certificado"
                    checked={form.certificado}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="certificado">
                    Sim
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Email do Domínio da página</td>
              <td>
                <input
                  type="email"
                  name="emailDominio"
                  className="form-control"
                  value={form.emailDominio}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Fotos Adicionadas</td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="fotosAdicionadas"
                    name="fotosAdicionadas"
                    checked={form.fotosAdicionadas}
                    onChange={handleInputChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="fotosAdicionadas"
                  >
                    Sim
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Logotipo</td>
              <td>
                <select
                  name="logotipo"
                  className="form-select"
                  value={form.logotipo}
                  onChange={handleInputChange}
                >
                  <option value="Feita">Feita</option>
                  <option value="Não">Não</option>
                  <option value="Já possui">Já possui</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Telefone</td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="telefone"
                    name="telefone"
                    checked={form.telefone}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="telefone">
                    Sim
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Endereço</td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="endereco"
                    name="endereco"
                    checked={form.endereco}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="endereco">
                    Sim
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Link de Rede Social</td>
              <td>
                <input
                  type="text"
                  name="redeSocial"
                  className="form-control mb-2"
                  value={form.redeSocial}
                  onChange={handleInputChange}
                  disabled={form.semRedeSocial}
                />
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="semRedeSocial"
                    name="semRedeSocial"
                    checked={form.semRedeSocial}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="semRedeSocial">
                    Não possui
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card col-md-6">
        <h5 className="mb-3">Informações de Marketing</h5>

        <div className="mb-2">
          <label>Link da Arte Personalizada</label>
          <input
            type="text"
            name="artLink"
            className="form-control"
            value={form.artLink}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Criação ou Atualização</label>
          <select
            name="creationOrUpdate"
            className="form-select"
            value={form.creationOrUpdate}
            onChange={handleInputChange}
          >
            <option value="Criação">Criação</option>
            <option value="Atualização">Atualização</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Responsável</label>
          <input
            type="text"
            name="responsible"
            className="form-control"
            value={form.responsible}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Data da Conclusão</label>
          <input
            type="date"
            name="completionDate"
            className="form-control"
            value={form.completionDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Link da Página do Google</label>
          <input
            type="text"
            name="linkGoogle"
            className="form-control"
            value={form.linkGoogle}
            onChange={handleInputChange}
            required
          />
        </div>

        {form.linkGoogle && (
          <div className="d-flex flex-column align-items-center mt-3">
            <h6>QR Code</h6>
            <QRCodeSVG value={form.linkGoogle} size={128} />
          </div>
        )}

        <div className="form-check mt-4">
          <input
            type="checkbox"
            className="form-check-input"
            id="servicosConcluidos"
            name="servicosConcluidos"
            checked={form.servicosConcluidos}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="servicosConcluidos">
            Serviços Concluídos?
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-success mt-3">
        Salvar
      </button>
    </form>
  );
};
