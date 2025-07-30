import React from "react";

interface ClientData {
  nameInfoYes: boolean;
  nameInfoNo: boolean;
  mapsInfoYes: boolean;
  mapsInfoNo: boolean;
  infosYes: boolean;
  infosNo: boolean;
  optionsBuyYes: boolean;
  optionsBuyNo: boolean;
  confirmacaoYes: boolean;
  confirmacaoNo: boolean;
  nomeAutorizanteYes: boolean;
  nomeAutorizanteNo: boolean;
}

interface FichaMonitoriaQualidadeProps {
  form: ClientData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const questions = [
  {
    label: "Se apresenta com nome ou sobrenome?",
    yesId: "nameInfoYes",
    noId: "nameInfoNo",
    yesChecked: (form: ClientData) => form.nameInfoYes,
    noChecked: (form: ClientData) => form.nameInfoNo,
  },
  {
    label: "Informa que somos do Grupo Maps?",
    yesId: "mapsInfoYes",
    noId: "mapsInfoNo",
    yesChecked: (form: ClientData) => form.mapsInfoYes,
    noChecked: (form: ClientData) => form.mapsInfoNo,
  },
  {
    label: "Confirma com o cliente o endereço, e-mail e telefones para contato?",
    yesId: "infosYes",
    noId: "infosNo",
    yesChecked: (form: ClientData) => form.infosYes,
    noChecked: (form: ClientData) => form.infosNo,
  },
  {
    label: "Informa as opções para pagamento?",
    yesId: "optionsBuyYes",
    noId: "optionsBuyNo",
    yesChecked: (form: ClientData) => form.optionsBuyYes,
    noChecked: (form: ClientData) => form.optionsBuyNo,
  },
  {
    label: "Tem a confirmação do cliente?",
    yesId: "confirmacaoYes",
    noId: "confirmacaoNo",
    yesChecked: (form: ClientData) => form.confirmacaoYes,
    noChecked: (form: ClientData) => form.confirmacaoNo,
  },
  {
    label: "Solicita nome e sobrenome do autorizante?",
    yesId: "nomeAutorizanteYes",
    noId: "nomeAutorizanteNo",
    yesChecked: (form: ClientData) => form.nomeAutorizanteYes,
    noChecked: (form: ClientData) => form.nomeAutorizanteNo,
  },
];

export const FichaMonitoriaQualidade: React.FC<FichaMonitoriaQualidadeProps> = ({
  form,
  handleInputChange,
}) => {
  return (
    <>
      <h2 className="text-center">De Olho na Qualidade</h2>
      <div className="row monitoria">
        {questions.map(({ label, yesId, noId, yesChecked, noChecked }) => (
          <div className="col-md-5 box-quest" key={yesId}>
            <label>{label}</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={yesId}
                name={yesId}
                checked={yesChecked(form)}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor={yesId}>Sim</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={noId}
                name={noId}
                checked={noChecked(form)}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor={noId}>Não</label>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
