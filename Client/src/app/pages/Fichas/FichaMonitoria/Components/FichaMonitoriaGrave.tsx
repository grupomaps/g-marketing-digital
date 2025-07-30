import React from "react";

interface InfoMonitoria {
  googleInfoYes: boolean;
  googleInfoNo: boolean;
  discountWithoutAuthorizationYes: boolean;
  discountWithoutAuthorizationNo: boolean;
  vencimentoYes: boolean;
  vencimentoNo: boolean;
  observation: string;
}

interface InfoMonitoriaProps {
  form: InfoMonitoria;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const questions = [
  {
    label: "Informa que somos da Google?",
    yesId: "googleInfoYes",
    noId: "googleInfoNo",
    yesChecked: (form: InfoMonitoria) => form.googleInfoYes,
    noChecked: (form: InfoMonitoria) => form.googleInfoNo,
  },
  {
    label: "Vendas sem compromisso?",
    yesId: "discountWithoutAuthorizationYes",
    noId: "discountWithoutAuthorizationNo",
    yesChecked: (form: InfoMonitoria) => form.discountWithoutAuthorizationYes,
    noChecked: (form: InfoMonitoria) => form.discountWithoutAuthorizationNo,
  },
  {
    label: "Informa uma data de vencimento e preenche outra na ficha?",
    yesId: "vencimentoYes",
    noId: "vencimentoNo",
    yesChecked: (form: InfoMonitoria) => form.vencimentoYes,
    noChecked: (form: InfoMonitoria) => form.vencimentoNo,
  },
];

export const FichaMonitoriaGrave: React.FC<InfoMonitoriaProps> = ({
  form,
  handleInputChange,
}) => {
  return (
    <>
      <h2 className="text-center">Questões Graves</h2>
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
        
        <div className="col-md-5 box-quest">
          <label>Digite aqui suas observações:</label>
          <textarea
            className="form-control textarea-obs"
            id="observation"
            name="observation"
            cols={4}
            value={form.observation}
            onChange={handleInputChange}
            placeholder="Digite aqui suas observações"
          />
        </div>
      </div>
    </>
  );
};
