import React from "react";

interface Boleto {
  chargeId: string;
  barcode: string;
  pix: string;
  billetLink: string;
  expireAt: string;
  pdfLink: string;
  status: string;
  link: string;
}

interface BoletosGeradosProps {
  boletoDataList: Boleto[];
  fetchBoletoDetails: (chargeId: string) => void;
}

const BoletosGerados: React.FC<BoletosGeradosProps> = ({
  boletoDataList,
  fetchBoletoDetails,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="mt-4">
      <h3 className="text-center text-light">Boletos Gerados</h3>
      <div className="boletos-container">
        <div id="carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {boletoDataList.map((boleto, index) => (
              <div
                key={boleto.chargeId}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="card mb-4 p-4 boleto-card">
                  <p>
                    <strong>Código de barra:</strong> {boleto.barcode}
                  </p>
                  <p>
                    <strong>Pix:</strong> {boleto.pix}
                  </p>
                  <p>
                    <strong>Link do boleto:</strong>{" "}
                    <a href={boleto.billetLink}>{boleto.billetLink}</a>
                  </p>
                  <p>
                    <strong>Data de expiração:</strong>{" "}
                    {formatDate(boleto.expireAt)}
                  </p>
                  <p>
                    <strong>Link para download do PDF:</strong>{" "}
                    <a href={boleto.pdfLink}>{boleto.pdfLink}</a>
                  </p>
                  <p>
                    <strong>Status:</strong> {boleto.status}
                  </p>
                  <p>
                    <strong>Charge_id:</strong> {boleto.chargeId}
                  </p>
                  <p>
                    <strong>Link Boleto:</strong> {boleto.link}
                  </p>
                  <button
                    onClick={() => fetchBoletoDetails(boleto.chargeId)}
                    className="btn btn-info"
                  >
                    Verificar Status do Boleto
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
          <div className="carousel-indicators">
            {boletoDataList.map((boleto, index) => (
              <button
                key={boleto.chargeId}
                type="button"
                data-bs-target="#carousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              >
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoletosGerados;