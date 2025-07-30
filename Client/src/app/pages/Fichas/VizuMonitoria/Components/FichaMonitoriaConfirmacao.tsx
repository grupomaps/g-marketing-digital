import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface InfoConfirmacao {
  monitoriaConcluidaYes: boolean;
  monitoriaConcluidaNo: boolean;
  observacaoYes: boolean;
  observacaoNo: boolean;
  nomeMonitor: string;
  // qrcodeText: string;
  linkGravacao: string;
  imagemUrl?: string;
}

interface InfoConfirmacaoProps {
  form: InfoConfirmacao | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const questions = [
  {
    label: "Confirma que realizou a auditoria?",
    yesId: "monitoriaConcluidaYes",
    noId: "monitoriaConcluidaNo",
    yesChecked: (form: InfoConfirmacao) => form.monitoriaConcluidaYes,
    noChecked: (form: InfoConfirmacao) => form.monitoriaConcluidaNo,
  },
  {
    label: "A venda precisa ser refeita ou tem muitos problemas?",
    yesId: "observacaoYes",
    noId: "observacaoNo",
    yesChecked: (form: InfoConfirmacao) => form.observacaoYes,
    noChecked: (form: InfoConfirmacao) => form.observacaoNo,
  },
];

export const FichaMonitoriaConfirmacao: React.FC<InfoConfirmacaoProps> = ({
  form,
  handleInputChange,
  handleImageUpload,
}) => {
  if (!form) return null;

  return (
    <>
      <h3 className="text-center">Auditoria</h3>
      <div className="row monitoria">
        {questions.map(({ label, yesId, noId, yesChecked, noChecked }) => (
          <div className="col-md-6 box-quest" key={yesId}>
            <label>{label}</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={yesId}
                checked={yesChecked(form)}
                onChange={handleInputChange}
                readOnly
                disabled
              />
              <label className="form-check-label" htmlFor={yesId}>
                Sim
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={noId}
                checked={noChecked(form)}
                onChange={handleInputChange}
                readOnly
                disabled
              />
              <label className="form-check-label" htmlFor={noId}>
                Não
              </label>
            </div>
          </div>
        ))}
        <div className="col-md-6 box-quest">
          <label>Informe seu nome:</label>
          <input
            className="form-control"
            id="nomeMonitor"
            name="nomeMonitor"
            value={form.nomeMonitor}
            onChange={handleInputChange}
            placeholder="Digite seu nome aqui"
          />
        </div>
        <div className="col-md-6 box-quest">
          <label>Informe o Link da Gravação:</label>
          <input
            className="form-control"
            id="linkGravacao"
            name="linkGravacao"
            value={form.linkGravacao}
            onChange={handleInputChange}
            placeholder="Insira o link da gravação"
          />
        </div>
        {/* <div className="col-md-6 box-quest">
          <label>Informe o Link da Gravação:</label>
          <input
            className="form-control"
            id="linkGravacao"
            name="linkGravacao"
            value={form.linkGravacao}
            onChange={handleInputChange}
            placeholder="Digite seu nome aqui"
          />
        </div> */}
        {/* <div className="col-md-6 box-quest">
          <label>Upload de Imagem:</label>
          <input
            className="form-control"
            type="file"
            id="imagemUpload"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {form.imagemUrl && (
            <div className="mt-3 img-boleto">
              <img
                src={form.imagemUrl}
                alt="Preview"
                className="img-fluid mt-2"
              />
            </div>
          )}
        </div> */}
        {/* {form.qrcodeText && (
          <div className="mt-3 justify-content-center d-flex flex-column align-items-center">
            <h5>QR Code:</h5>
            <QRCodeSVG value={form.qrcodeText} size={128} />
          </div>
        )} */}
      </div>
    </>
  );
};
