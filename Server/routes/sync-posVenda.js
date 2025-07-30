const express = require("express");
const cronService = require("../services/cronService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await cronService.checkForChanges();
    res.status(200).send("Planilha atualizada manualmente com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar manualmente a planilha:", error);
    res.status(500).send("Erro ao atualizar manualmente a planilha.");
  }
});

module.exports = router;
