require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const boletoCnpj = require("./routes/boletoCnpj");
const boletoCpf = require("./routes/boletoCpf");
const chargeRoutes = require("./routes/boletoStatus");
const syncMarketing = require("./routes/syncMarketing");
const syncPos = require("./routes/sync-posVenda")
const sendMessageRoute = require("./routes/sendMessage");
const buscarCnpj = require("./routes/buscarCnpj");


const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://grupomapscartaodigital.com.br",
  // origin: process.env.FRONTEND_URL || "http://localhost:3000",
}));
app.use(bodyParser.json());
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/generate-boleto-cnpj", boletoCnpj);
app.use("/generate-boleto-cpf", boletoCpf);
app.use("/v1/charge", chargeRoutes);
app.use("/sync-marketing", syncMarketing);
app.use("/sync-posVenda", syncPos);
app.use("/api", sendMessageRoute);
app.use("/buscar_cnpj", buscarCnpj);


// const atualizarPlanilha = async () => {
//   try {
//     const response = await fetch("http://localhost:5000/sync-marketing", {
//       method: "POST",
//     });
//     const mensagem = await response.text();
//     console.log(mensagem);
//   } catch (error) {
//     console.error("Erro ao forçar atualização:", error);
//   }
// };

// atualizarPlanilha()
// Exporte como função para a Vercel
module.exports = app;


// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });