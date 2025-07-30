import React, { useEffect, useState } from "react"; // Importe useEffect
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { ModalRoutes } from "./components/ModalRoutes";

interface PrivateRouteProps {
  element: JSX.Element;
  requiredCargo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredCargo }) => {
  const { user, loading, cargo } = useAuth();
  const adminId = process.env.REACT_APP_ADMIN_USER_ID;
  const supervisorId ="wWLmbV9TIUemmTkcMUSAQ4xGlju2"
  const graziId ="nQwF9Uxh0lez9ETIOmP2gCgM0pf2"
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar o modal
  const [redirect, setRedirect] = useState(false); // Estado para controle de redirecionamento

  useEffect(() => {
    if (!loading && user && !((user.uid === adminId || user.uid === supervisorId || user.uid === graziId) || !requiredCargo || cargo === requiredCargo)) {
      setModalOpen(true); // Abre o modal se o usuário não tiver permissão
    }
  }, [loading, user, requiredCargo, cargo, adminId]); // Adiciona dependências no useEffect

  const handleCloseModal = () => {
    setModalOpen(false);
    setRedirect(true); // Define para redirecionar
  };

  if (loading) {
    return (
      <div className="circle-loading">
        <CircularProgress color="inherit" className="circle" />
      </div>
    );
  }

  if (redirect) {
    return <Navigate to="/" />; 
  }

  if (user && ((user.uid === adminId || user.uid === supervisorId || user.uid === graziId) || !requiredCargo || cargo === requiredCargo)) {
    return element; 
  }

  return (
    <>
      <ModalRoutes
        isOpen={modalOpen}
        onClose={handleCloseModal}
        message="Verifique suas credenciais! Redirecionando para a página inicial."
      />
    </>
  );
};

export default PrivateRoute;
