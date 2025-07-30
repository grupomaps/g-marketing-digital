const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.TYPE_1,
    project_id: process.env.PROJECT_ID_1,
    private_key_id: process.env.PRIVATE_KEY_ID_1,
    private_key: process.env.PRIVATE_KEY_1,
    client_email: process.env.CLIENT_EMAIL_1,
    client_id: process.env.CLIENT_ID_1,
    auth_uri: process.env.AUTH_URI_1,
    token_uri: process.env.SERVICE_TOKEN_URI_1,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL_1,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL_1,
    universe_domain: process.env.UNIVERSE_DOMAIN_1
  },
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

const writeToSheet = async (data) => {
  try {
    const spreadsheetId = "1FqWGW8hSEHs7pBPtKR2NdjRHYJ24heY323FflklcB9s";
    const range = "Gmaps - Automação!A2";
    const valueInputOption = "RAW";

    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Gmaps - Automação!A2:A",
    });

    const existingNumeroContratos = existingData.data.values
      ? existingData.data.values.map((row) => row[0])
      : [];

    const uniqueData = data.filter(
      (row) => !existingNumeroContratos.includes(row.numeroContrato)
    );

    if (uniqueData.length > 0) {
      const batchedData = uniqueData.map((row) => [
        row.numeroContrato,
        row.cnpj,
        row.cpf,
        row.responsavel,
        row.email1,
        row.email2,
        row.operador,
        row.data,
        row.dataVencimento,
        row.contrato,
        row.nomeMonitor,
        row.artLink,
        row.contratoLink,
        row.celular,
        row.validade,
        row.valorVenda,
        row.linkGoogle,
        row.anuncio ? "Sim" : "Não",
        row.monitoriaConcluidaYes ? "Sim" : "Não",
        row.servicosConcluidos ? "Sim" : "Não",
      ]);

      const resource = { values: batchedData };

      const result = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });

      console.log("Planilha atualizada:", result.data);
    } else {
      console.log("Nenhum dado novo para adicionar.");
    }
  } catch (error) {
    console.error("Erro ao atualizar a planilha:", error);
    throw error;
  }
};

module.exports = { writeToSheet };
