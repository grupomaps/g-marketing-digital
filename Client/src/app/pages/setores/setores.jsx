import React, { useState } from "react";
import "../setores/components/Setores.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faChartLine,
  faLaptop,
  faBullhorn,
  faDollarSign,
  faMoneyBillWave,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

export const Setores = () => {
  const [mostrarDetalhesVendas, setMostrarDetalhesVendas] = useState(false);

  const handleVendasClick = () => {
    setMostrarDetalhesVendas(!mostrarDetalhesVendas);
  };

  const { cargo, userId } = useAuth();
  const adminId = process.env.REACT_APP_ADMIN_USER_ID;
  const supervisorId = "wWLmbV9TIUemmTkcMUSAQ4xGlju2";
  const graziId = "nQwF9Uxh0lez9ETIOmP2gCgM0pf2";
  return (
    <div className="sector-selection container-fluid">
      <h1 className="title text-center">Escolha um Setor</h1>
      <div className="sector-container row justify-content-center">
        {(cargo === "vendas" || cargo === "supervisor" || cargo === "adm" || userId === adminId || userId === graziId) && (
          <div className="sector col-10 col-md-4">
            <div className="sector-content">
              <FontAwesomeIcon icon={faChartLine} className="sector-icon" />
              <h2>Vendas</h2>
              <p>Clique aqui para acessar a área de vendas.</p>
              <Link
                onClick={handleVendasClick}
                className="btn-sector btn btn-primary"
              >
                Acessar Vendas
              </Link>

              {mostrarDetalhesVendas && (
                <div className="overlay">
                  <div className="vendas-detalhes">
                    <button onClick={handleVendasClick} className="btn-closed">
                      <FontAwesomeIcon icon={faClose} />
                    </button>
                    <Link to="/vendas" className="btn-sector btn btn-primary">
                      Acessar Divulgação
                    </Link>
                    <Link
                      to="/dashboard"
                      className="btn-sector btn btn-primary"
                    >
                      Acessar Vendas de Sites
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* {(cargo === "monitoria" ||
          userId === adminId ||
          userId === supervisorId) && (
          <div className="sector col-10 col-md-4 col-lg-3">
            <div className="sector-content">
              <FontAwesomeIcon icon={faLaptop} className="sector-icon" />
              <h2>Monitoria</h2>
              <p>Clique aqui para verificar a monitoria.</p>
              <Link to="/monitoria" className="btn-sector btn btn-primary">
                Verificar Monitoria
              </Link>
            </div>
          </div>
        )} */}

        {(cargo === "posVenda" ||
          userId === adminId ||
          userId === supervisorId) && (
          <div className="sector col-10 col-md-4 col-lg-3">
            <div className="sector-content">
              <FontAwesomeIcon icon={faHeadset} className="sector-icon" />
              <h2>Pós Venda</h2>
              <p>Clique aqui para verificar o pós venda.</p>
              <Link to="/novomarketing" className="btn-sector btn btn-primary">
                Verificar Pós Venda
              </Link>
            </div>
          </div>
        )}

        {(cargo === "marketing" ||
          userId === adminId ||
          userId === supervisorId) && (
          <div className="sector col-10 col-md-4 col-lg-3">
            <div className="sector-content">
              <FontAwesomeIcon icon={faBullhorn} className="sector-icon" />
              <h2>Marketing</h2>
              <p>Clique aqui para ter uma visão do marketing.</p>
              <Link to="/novomarketing" className="btn-sector btn btn-primary">
                Visão do Marketing
              </Link>
            </div>
          </div>
        )}

        {(cargo === "financeiro" || userId === adminId) && (
          <div className="sector col-10 col-md-4 col-lg-3">
            <div className="sector-content">
              <FontAwesomeIcon icon={faDollarSign} className="sector-icon" />
              <h2>Financeiro</h2>
              <p>Clique aqui para ver a situação financeira.</p>
              <Link to="/financeiro" className="btn-sector btn btn-primary">
                Ver Situação Financeira
              </Link>
            </div>
          </div>
        )}

        {(cargo === "cobranca" ||
          userId === adminId ||
          userId === supervisorId) && (
          <div className="sector col-10 col-md-4 col-lg-3">
            <div className="sector-content">
              <FontAwesomeIcon icon={faMoneyBillWave} className="sector-icon" />
              <h2>Cobrança</h2>
              <p>Clique aqui para monitorar a cobrança.</p>
              <Link to="/cobranca" className="btn-sector btn btn-primary">
                Monitorar Cobrança
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
