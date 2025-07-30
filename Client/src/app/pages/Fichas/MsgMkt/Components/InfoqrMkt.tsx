import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../firebase/firebaseConfig";
import { QRCodeSVG } from "qrcode.react";

export const InfoqrMkt: React.FC = () => {
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

  return (
    clientData && (
      <div className="bonus text-center">
        <br />
        {/* <img src="/img/estrelas.png" alt="Logo" width={200} /> */}
        <div className="qrcode-container p-5">
          {clientData.linkGoogle && (
            <div className="qrcode-mktservice">
              <QRCodeSVG value={clientData.linkGoogle} />
            </div>
          )}
        </div>
        {/* <div className="google-partiners">
          <img src="/img/google-partiners.png" alt="Logo" width={150} />
        </div> */}
      </div>
    )
  );
};
