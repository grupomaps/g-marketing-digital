import React from "react";

interface InfoPerfilProps {
  totalVendas: number;
  vendasMensais: number;
  vendasSemanais: number;
  vendasDiarias: number;
}

const InfoPerfil: React.FC<InfoPerfilProps> = ({
  totalVendas,
  vendasMensais,
  vendasSemanais,
  vendasDiarias,
}) => {
  return (
    <section className="profile-details">
      <h2>Métricas de Vendas</h2>
      <div className="profile-details-info row">
        <div className="info col-md-5">
          <h4>Total de Vendas: </h4>
          <p>{totalVendas}</p>
        </div>
        <div className="info col-md-5">
          <h4>Vendas Mensais: </h4>
          <p>{vendasMensais}</p>
        </div>
        <div className="info col-md-5">
          <h4>Vendas Semanais: </h4>
          <p>{vendasSemanais}</p>
        </div>
        <div className="info col-md-5">
          <h4>Vendas Diárias: </h4>
          <p>{vendasDiarias}</p>
        </div>
      </div>
    </section>
  );
};

export default InfoPerfil;