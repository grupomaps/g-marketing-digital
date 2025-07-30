import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface VendaData {
  observacoes: string;
  // qrcodeText: string;
  linkGravacao: string;
  renovacaoAutomatica: string;
  criacao: string;
  ctdigital: string;
  logotipo: string;
  anuncio: string;
}

interface EditInfoAdicionaisProps {
  form: VendaData | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const TextAreaField = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) => (
  <div className="form-group mb-3">
    <label htmlFor={id}>{label}</label>
    <textarea
      className="form-control textarea-resizable"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      placeholder={placeholder}
      style={{ resize: 'both', overflow: 'auto', width: '100%' }}
    />
  </div>
);

const InputField = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div className="form-group mb-3">
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({
  id,
  label,
  name,
  value,
  onChange,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="form-group mb-3">
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      name={name}
      className="form-control"
      value={value}
      onChange={onChange}
    >
      <option value="Sim">Sim</option>
      <option value="Não">Não</option>
    </select>
  </div>
);


const SelectOption = ({
  id,
  label,
  name,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="form-group mb-3 col-md-3">
    <label htmlFor={id}>{label}</label>
    <select className="form-control" id={id} name={name} value={value} onChange={onChange}>
      <option value="">Selecione</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const EditInfoAdicionais: React.FC<EditInfoAdicionaisProps> = ({ form, handleInputChange }) => {
  if (!form) return null;

  return (
    <div>
      <h4 className='text-white'>Informações Adicionais</h4>

      <TextAreaField
        id="observacoes"
        label="Observações"
        name="observacoes"
        value={form.observacoes}
        onChange={handleInputChange}
        placeholder="Adicione observações ou comentários relevantes..."
      />

      <SelectField
        id="renovacaoAutomatica"
        label="Renovação Automática"
        name="renovacaoAutomatica"
        value={form.renovacaoAutomatica}
        onChange={handleInputChange}
      />

      <div className='row'>
        <SelectOption
          id="criacao"
          label="Criação"
          name="criacao"
          value={form.criacao}
          onChange={handleInputChange}
          options={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" },
          ]}
        />


        <SelectOption
          id="ctdigital"
          label="C.Digital"
          name="ctdigital"
          value={form.ctdigital}
          onChange={handleInputChange}
          options={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" },
          ]}
        />

        <SelectOption
          id="anuncio"
          label="Anúncio"
          name="anuncio"
          value={form.anuncio}
          onChange={handleInputChange}
          options={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" },
          ]}
        />

        <SelectOption
          id="logotipo"
          label="Logotipo"
          name="logotipo"
          value={form.logotipo}
          onChange={handleInputChange}
          options={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" },
          ]}
        />
      </div>

      <InputField
        id="linkGravacao"
        label="Url para Link da gravação"
        name="linkGravacao"
        value={form.linkGravacao}
        onChange={handleInputChange}
        placeholder="Digite o texto para gerar o Link"
      />

      {/* {form.qrcodeText && (
        <div className="mt-3">
          <h5>QR Code:</h5>
          <QRCodeSVG value={form.qrcodeText} size={128} />
        </div>
      )} */}

    </div>
  );
};
