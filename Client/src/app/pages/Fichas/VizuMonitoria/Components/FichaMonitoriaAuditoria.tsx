import React from "react";

interface InfoAuditoria {
  nameClientYes: boolean;
  nameClientNo: boolean;
  valorDataYes: boolean;
  valorDataNo: boolean;
}

interface InfoAuditoriaProps {
  form: InfoAuditoria | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const questions = [
  {
    label: "Confirma o nome e o sobrenome do cliente?",
    yesId: "nameClientYes",
    noId: "nameClientNo",
    yesChecked: (form: InfoAuditoria) => form.nameClientYes,
    noChecked: (form: InfoAuditoria) => form.nameClientNo,
  },
  {
    label: "Confirma o valor e a data de vencimento?",
    yesId: "valorDataYes",
    noId: "valorDataNo",
    yesChecked: (form: InfoAuditoria) => form.valorDataYes,
    noChecked: (form: InfoAuditoria) => form.valorDataNo,
  },
];

export const FichaMonitoriaAuditoria: React.FC<InfoAuditoriaProps> = ({ form, handleInputChange }) => {
  if (!form) return null;

  return (
    <>
      <h3 className="text-center">Auditoria</h3>
      <div className="row monitoria">
        {questions.map(({ label, yesId, noId, yesChecked, noChecked }) => (
          <div className="col-md-5 box-quest" key={yesId}>
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
              <label className="form-check-label" htmlFor={yesId}>Sim</label>
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
              <label className="form-check-label" htmlFor={noId}>Não</label>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
