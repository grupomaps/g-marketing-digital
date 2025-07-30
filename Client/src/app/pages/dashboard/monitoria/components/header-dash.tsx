import { useAuth } from "../../../../context/AuthContext";

interface HeaderDashProps {
  totalVendas: number;
  totalRealizados: number;
  totalRealizadosDiario: number;
  totalPendentesDiario: number;
}

export const HeaderDash: React.FC<HeaderDashProps> = ({
  totalVendas,
  totalRealizados,
  totalRealizadosDiario,
  totalPendentesDiario,
}) => {
  const { nome } = useAuth();

  return (
    <section>
      <div className="header-dash">
        <div className="row">
          <div className="col-md-6 bemvindo-text">
            <h3>Olá, {nome}</h3>
          </div>

          <div className="header-info row">
            <div className="col-md-3 info-item">
              <h3>Total de Clientes</h3>
              <p>{totalVendas}</p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
