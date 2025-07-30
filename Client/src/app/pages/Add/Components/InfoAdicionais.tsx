import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface InfoAdicionaisProps {
  form: {
    observacoes: string;
    renovacaoAutomatica: string;
    criacao: string;
    ctdigital:string;
    anuncio: string;
    logotipo: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement 
    >
  ) => void;
}

export const InfoAdicionais: React.FC<InfoAdicionaisProps> = ({
  form,
  handleInputChange,
}) => {
  return (
    <div>
      <h4 className="text-white">Informações Adicionais</h4>

      <div className="form-group mb-3">
        <label htmlFor="observacoes" className="form-label text-white">
          Observações
        </label>
        <textarea
          className="form-control"
          id="observacoes"
          name="observacoes"
          value={form.observacoes}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="renovacaoAutomatica" className="form-label text-white">
          Renovação Automática
        </label>
        <select
          className="form-control"
          id="renovacaoAutomatica"
          name="renovacaoAutomatica"
          value={form.renovacaoAutomatica}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
      </div>
      <div className="row">

      <div className="form-group mb-3 col-md-3">
        <label htmlFor="criacao" className="form-label text-white">
          Criação
        </label>
        <select
          className="form-control"
          id="criacao"
          name="criacao"
          value={form.criacao}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-3">
        <label htmlFor="ctdigital" className="form-label text-white">
          C.Digital
        </label>
        <select
          className="form-control"
          id="ctdigital"
          name="ctdigital"
          value={form.ctdigital}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-3">
        <label htmlFor="anuncio" className="form-label text-white">
          Anúncio
        </label>
        <select
          className="form-control"
          id="anuncio"
          name="anuncio"
          value={form.anuncio}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
      </div>
      <div className="form-group mb-3 col-md-3">
        <label htmlFor="logotipo" className="form-label text-white">
          Logotipo
        </label>
        <select
          className="form-control"
          id="logotipo"
          name="logotipo"
          value={form.logotipo}
          onChange={handleInputChange}
        >
          <option value="">Selecione</option>
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>
      </div>
      </div>
    </div>
  );
};
