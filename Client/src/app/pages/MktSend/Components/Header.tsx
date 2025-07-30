import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase/firebaseConfig';

export const Header: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "vendas", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data());
          } else {
            console.log("Não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do cliente: ", error);
      }
    };

    fetchClientData();
  }, [id]);

  // Função para formatar a data no formato brasileiro
  const formatDateToBrazilian = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3); // Ajuste para o horário de Brasília
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam do zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    clientData && (
      <div className="header-assinatura text-center">
        <img
          src="/img/logo_contrato_maps.jpg"
          alt="Logo"
          className="mb-1"
        />
      </div>
    )
  );
};
