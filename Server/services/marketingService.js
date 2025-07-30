const firebaseAdmin = require("./firebaseService");

const fetchMarketingData = async () => {
  try {
    const marketingRef = firebaseAdmin.firestore().collection("marketings");
    const snapshot = await marketingRef.get();

    if (snapshot.empty) {
      console.log("Nenhum documento encontrado.");
      return [];
    }

    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Erro ao pegar dados do Firestore:", error);
    throw error;
  }
};

const fetchPosVendaData = async () => {
  try {
    const posVendaRef = firebaseAdmin.firestore().collection("posVendas");
    const snapshot = await posVendaRef.get();

    if (snapshot.empty) {
      console.log("Nenhum documento encontrado.");
      return [];
    }

    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Erro ao pegar dados do Firestore:", error);
    throw error;
  }
};


module.exports = { fetchMarketingData, fetchPosVendaData };
