import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "../components/navbar/navbar";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivatesRoute";
import {
  Login,
  Setores,
  Perfil,
  Vendas,
  Monitoria,
  Relatorio,
  Add,
  EditContrato,
  FichaMonitoria,
  FichaMarketing,
  FichaFinanceiro,
  FichaCobranca,
  FichaBoleto,
} from "../pages";
import { Contrato } from "../pages";
import { Financeiro } from "../pages/dashboard/financeiro/Financeiro";
import { Cobranca } from "../pages/dashboard/cobranca/Cobranca";
import { Comprovantes } from "../pages/Comprovantes/Comprovantes";
import { Cancelados } from "../pages/dashboard/cancelados/Cancelados";
import { FichaCancelamento } from "../pages/Fichas/FichaCancelamento/FichaCancelamento";
import { PosVenda } from "../pages/dashboard/pos_venda/PosVenda";
import { FichaPosVenda } from "../pages/Fichas/FichaPosVenda/FichaPosVenda";
import { Assinatura } from "../pages/Assinatura/Assinatura";
import { MsgMonitoria } from "../pages/Fichas/MsgMonitoria/MsgMonitoria";
import { MsgMkt } from "../pages/Fichas/MsgMkt/MsgMkt";
import { Analise } from "../pages/dashboard/analise/Analise";
import { VizuMonitoria } from "../pages/Fichas/VizuMonitoria/VizuMonitoria";
import { NovoMkt } from "../pages/dashboard/novo_mkt/NovoMkt";
import { VizuFinanceiro } from "../pages/Fichas/VizuFinanceiro/VizuFinanceiro";


export const LocalRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/setores" element={<PrivateRoute element={<Setores />} />} />
          <Route path="/perfil" element={<PrivateRoute element={<Perfil />} />} />
          <Route path="/vendas" element={<PrivateRoute element={<Vendas />}/>} />
          <Route path="/cancelados" element={<PrivateRoute element={<Cancelados />} />} />
          <Route path="/monitoria" element={<PrivateRoute element={<Monitoria />} />} />
          <Route path="/novomarketing" element={<PrivateRoute element={<NovoMkt />} />} />
          <Route path="/analises" element={<PrivateRoute element={<Analise />} />} />
          {/* <Route path="/pos-venda" element={<PrivateRoute element={<PosVenda />} />} /> */}
          <Route path="/financeiro" element={<PrivateRoute element={<Financeiro />} />} />
          <Route path="/cobranca" element={<PrivateRoute element={<Cobranca />} requiredCargo="cobranca" />} />
          <Route path="/relatorio" element={<PrivateRoute element={<Relatorio />} />} />
          <Route path="/add" element={<PrivateRoute element={<Add />} />} />
          <Route path="/contrato/:id" element={<PrivateRoute element={<Contrato />} />} />
          <Route path="/assinatura/:id" element={<PrivateRoute element={<Assinatura />} />} />
          <Route path="/editcontrato/:id" element={<PrivateRoute element={<EditContrato />} />} />
          <Route path="/comprovantes/:id" element={<PrivateRoute element={<Comprovantes />} />} />
          <Route path="/fichamonitoria/:id" element={<PrivateRoute element={<FichaMonitoria />} />} />
          <Route path="/vizumonitoria/:id" element={<PrivateRoute element={<VizuMonitoria />} />} />
          <Route path="/fichamsgmonitoria/:id" element={<PrivateRoute element={<MsgMonitoria />}  />} />
          <Route path="/fichamsgmarketing/:id" element={<PrivateRoute element={<MsgMkt />}  />} />
          <Route path="/fichamarketing/:id" element={<PrivateRoute element={<FichaMarketing />} />} />
          <Route path="/fichaposvenda/:id" element={<PrivateRoute element={<FichaPosVenda />} />} />
          <Route path="/fichafinanceiro/:id" element={<PrivateRoute element={<FichaFinanceiro />} requiredCargo="financeiro" />} />
          <Route path="/vizufinanceiro/:id" element={<PrivateRoute element={<VizuFinanceiro />} />} />
          <Route path="/fichacobranca/:id" element={<PrivateRoute element={<FichaCobranca />} requiredCargo="cobranca" />} />
          <Route path="/fichaboleto/:id" element={<PrivateRoute element={<FichaBoleto />} />} />
          <Route path="/fichacancelamento/:id" element={<PrivateRoute element={<FichaCancelamento />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const NavbarWrapper: React.FC = () => {
  const location = useLocation();
  const showNavbarRoutes = ["/vendas", "/monitoria", "/financeiro", "/cobranca", "/cancelados", "/pos-venda", "/analises", "/novomarketing"];

  return showNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
};