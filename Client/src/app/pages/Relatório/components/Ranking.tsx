import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface OperadorRanking {
  operador: string;
  imgOperador: string;
  vendasSemanal: number;
  vendasMensal: number;
}

interface RankingProps {
  operadores: OperadorRanking[];
}

export const Ranking: React.FC<RankingProps> = ({ operadores }) => {
  const [currentPageSemanal, setCurrentPageSemanal] = useState(1);
  const [currentPageMensal, setCurrentPageMensal] = useState(1);

  const operadoresSemanalOrdenados = [...operadores].sort(
    (a, b) => b.vendasSemanal - a.vendasSemanal
  );
  const operadoresMensalOrdenados = [...operadores].sort(
    (a, b) => b.vendasMensal - a.vendasMensal
  );

  const itemsPerPage = 5;

  const totalPagesSemanal = Math.ceil(
    operadoresSemanalOrdenados.length / itemsPerPage
  );
  const totalPagesMensal = Math.ceil(
    operadoresMensalOrdenados.length / itemsPerPage
  );

  const paginatedSemanal = operadoresSemanalOrdenados.slice(
    (currentPageSemanal - 1) * itemsPerPage,
    currentPageSemanal * itemsPerPage
  );

  const paginatedMensal = operadoresMensalOrdenados.slice(
    (currentPageMensal - 1) * itemsPerPage,
    currentPageMensal * itemsPerPage
  );

  const nextPageSemanal = () =>
    setCurrentPageSemanal((prev) => Math.min(prev + 1, totalPagesSemanal));
  const prevPageSemanal = () =>
    setCurrentPageSemanal((prev) => Math.max(prev - 1, 1));

  const nextPageMensal = () =>
    setCurrentPageMensal((prev) => Math.min(prev + 1, totalPagesMensal));
  const prevPageMensal = () =>
    setCurrentPageMensal((prev) => Math.max(prev - 1, 1));

  // Função para determinar a classe CSS baseada na posição
  const getPositionClass = (position: number) => {
    if (position === 1) return "top-1";
    if (position === 2) return "top-2";
    if (position === 3) return "top-3";
    return "";
  };

  return (
    <section className="ranking-geral py-4">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm ranking-card">
            <div className="card-header text-center bg-primary text-white ranking-header">
              <h5 className="mb-0">🏆 Ranking Semanal</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {paginatedSemanal.map((operador, index) => {
                  const posicao =
                    (currentPageSemanal - 1) * itemsPerPage + index + 1;
                  return (
                    <li
                      key={`semanal-${operador.operador}-${posicao}`}
                      className={`list-group-item ranking-item ${getPositionClass(
                        posicao
                      )}`}
                    >
                      <div className="d-flex align-items-center">
                        <span className="position-badge me-2 fw-bold">
                          {posicao}º
                        </span>
                        <img
                          src={operador.imgOperador}
                          className="rounded-circle me-3"
                          width="60"
                          height="60"
                          alt={operador.operador}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/50";
                          }}
                        />
                        <div>
                          <div className="text-capitalize fw-medium">
                            {operador.operador}
                          </div>
                        </div>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {operador.vendasSemanal === 1
                          ? `${operador.vendasSemanal} Venda`
                          : `${operador.vendasSemanal ?? 0} Vendas`}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="d-flex justify-content-center align-items-center mt-3">
                <button
                  className="btn btn-outline-primary pagination-btn"
                  onClick={prevPageSemanal}
                  disabled={currentPageSemanal === 1}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <span className="mx-3">
                  Página {currentPageSemanal} de {totalPagesSemanal}
                </span>
                <button
                  className="btn btn-outline-primary pagination-btn"
                  onClick={nextPageSemanal}
                  disabled={currentPageSemanal === totalPagesSemanal}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm ranking-card">
            <div className="card-header text-center bg-warning text-white ranking-header">
              <h5 className="mb-0">📅 Ranking Mensal</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {paginatedMensal.map((operador, index) => {
                  const posicao =
                    (currentPageMensal - 1) * itemsPerPage + index + 1;
                  return (
                    <li
                      key={`mensal-${operador.operador}-${posicao}`}
                      className={`list-group-item ranking-item ${getPositionClass(
                        posicao
                      )}`}
                    >
                      <div className="d-flex align-items-center">
                        <span className="position-badge me-2 fw-bold">
                          {posicao}º
                        </span>
                        <img
                          src={operador.imgOperador}
                          className="rounded-circle me-3"
                          width="60"
                          height="60"
                          alt={operador.operador}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/50";
                          }}
                        />
                        <div>
                          <div className="text-capitalize fw-medium">
                            {operador.operador}
                          </div>
                        </div>
                      </div>
                      <span className="badge bg-warning text-dark rounded-pill">
                      {operador.vendasMensal === 1
                          ? `${operador.vendasMensal} Venda`
                          : `${operador.vendasMensal ?? 0} Vendas`}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="d-flex justify-content-center align-items-center mt-3">
                <button
                  className="btn btn-outline-warning pagination-btn"
                  onClick={prevPageMensal}
                  disabled={currentPageMensal === 1}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <span className="mx-3">
                  Página {currentPageMensal} de {totalPagesMensal}
                </span>
                <button
                  className="btn btn-outline-warning pagination-btn"
                  onClick={nextPageMensal}
                  disabled={currentPageMensal === totalPagesMensal}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
