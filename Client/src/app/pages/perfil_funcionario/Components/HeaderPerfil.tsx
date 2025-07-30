// Components/HeaderPerfil.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

interface HeaderPerfilProps {
  nome: string;
  email: string;
  avatar: string;
  cargo: string;
}

const HeaderPerfil: React.FC<HeaderPerfilProps> = ({ nome, avatar, cargo, email }) => {
  console.log("Cargo no HeaderPerfil:", cargo);
  return (
    <header className="profile-header">
      <div className="profile-header-content">
        <img src={avatar} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <h1 className="profile-name">{nome}</h1>
          <p className="profile-title">{cargo}</p>
          <p className="profile-email">
            <FontAwesomeIcon icon={faEnvelope} className="icon-email" /> {email}
          </p>
        </div>
      </div>
    </header>
  );
};

export default HeaderPerfil;