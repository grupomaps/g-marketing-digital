import React from "react";

interface HeaderProps {
  title: string;
  img?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, img }) => {
  return (
    <div className="title-contrato">
        <img src="/img/logo-header-adicao.png" className="logotipo-adicao" alt="Logotipo Header Adição" />
      <h2>{title}</h2>
      <img className="img-header" src={img} alt="Imagem do Header adição" />
    </div>
  );
};
